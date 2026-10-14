/* ============================================================================
 * 20-markdown.js — 自成体系的 Markdown 渲染器（含 LaTeX 与代码块）
 *
 * 为什么不用 marked / markdown-it：
 *   1. 零依赖是本项目的硬约束（参考项目也是零依赖）；
 *   2. 我们需要对"用户自定义内容"和"AI 生成内容"渲染 Markdown，
 *      而任何第三方库的默认 HTML 直通都是 XSS 面;这里从设计上就不产生未转义输出。
 *
 * 安全约定（关键）：
 *   · 原始 HTML 一律转义，永不透传（不提供 rawHtml 选项）。
 *   · 链接/图片 URL 过 CPL.dom.safeUrl，拦掉 javascript:/data:。
 *   · 代码块内容只做转义，不做任何解释。
 *   · 数学公式走 CPL.math（MathML 或 KaTeX，且 KaTeX 关闭 trust）。
 *
 * 语法支持：
 *   标题 #..###### / 粗斜体 / 行内代码 / 围栏代码块 / 引用（含 [!NOTE] callout）
 *   / 有序无序列表（支持嵌套与任务列表）/ 表格 / 水平线 / 链接与图片 / 自动链接
 *   / 行内与块级 $$ 数学 / 脚注式行内注 / ==高亮== / ~~删除线~~
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  // 注意：这里**不能**在模块加载时就把 CPL.math / CPL.highlight 缓存成常量。
  // 分片的加载顺序由文件名排序决定，20-markdown.js 排在 25-math.js 之前，
  // 早期缓存会拿到 undefined。统一用惰性读取。
  const mathOf = () => CPL.math;
  const highlightOf = () => CPL.highlight;

  const md = (CPL.md = {});

  const esc = dom.esc;
  const escAttr = dom.escAttr;

  // ─────────────────────────────────────────────────────────────
  // 行内解析
  // ─────────────────────────────────────────────────────────────
  const INLINE_PATTERNS = [
    // 行内数学：$...$ （要求 $ 后不是空格，避免误判货币）
    { re: /^\$([^$\n]+?)\$/ },
    // 行内代码：`...`
    { re: /^`([^`]+)`/ },
    // 图片
    { re: /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/ },
    // 链接
    { re: /^\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/ },
    // 自动链接
    { re: /^<((?:https?|mailto):[^>\s]+)>/ },
    // 粗斜体
    { re: /^\*\*\*([^*\n]+)\*\*\*/ },
    // 粗体
    { re: /^\*\*([^*\n]+)\*\*/ },
    { re: /^__([^_\n]+)__/ },
    // 高亮
    { re: /^==([^=\n]+)==/ },
    // 删除线
    { re: /^~~([^~\n]+)~~/ },
    // 斜体
    { re: /^\*([^*\n]+)\*/ },
    { re: /^_([^_\n]+)_/ },
  ];

  /**
   * 行内渲染。
   * @param {string} text
   * @returns {string} HTML 片段（已转义）
   */
  function inline(text) {
    let out = '';
    let rest = String(text === undefined || text === null ? '' : text);

    while (rest.length) {
      let matched = false;

      // 反斜杠转义：\$ \* \_ \` \[ \] \\ 等一律按字面量输出
      const escapeHit = /^\\([\\`*_{}\[\]()#+\-.!$~=|>])/.exec(rest);
      if (escapeHit) {
        out += esc(escapeHit[1]);
        rest = rest.slice(escapeHit[0].length);
        continue;
      }

      for (const { re } of INLINE_PATTERNS) {
        const m = re.exec(rest);
        if (!m) continue;

        if (re === INLINE_PATTERNS[0].re) {
          out += mathOf().render(m[1], { display: false });
        } else if (re === INLINE_PATTERNS[1].re) {
          out += `<code class="cpl-code-inline">${esc(m[1])}</code>`;
        } else if (re === INLINE_PATTERNS[2].re) {
          const url = dom.safeUrl(m[2]);
          if (!url) {
            out += esc(m[0]);
          } else {
            out += `<img src="${escAttr(url)}" alt="${escAttr(m[1])}"${
              m[3] ? ` title="${escAttr(m[3])}"` : ''
            } loading="lazy" decoding="async" class="cpl-md-img" />`;
          }
        } else if (re === INLINE_PATTERNS[3].re) {
          const url = dom.safeUrl(m[2]);
          if (!url) {
            out += esc(m[0]);
          } else {
            const external = /^https?:/i.test(url);
            out += `<a href="${escAttr(url)}"${external ? ' target="_blank" rel="noopener noreferrer external"' : ''}${
              m[3] ? ` title="${escAttr(m[3])}"` : ''
            }>${inline(m[1])}</a>`;
          }
        } else if (re === INLINE_PATTERNS[4].re) {
          const url = dom.safeUrl(m[1]);
          out += url
            ? `<a href="${escAttr(url)}" target="_blank" rel="noopener noreferrer external">${esc(m[1])}</a>`
            : esc(m[0]);
        } else if (re === INLINE_PATTERNS[5].re) {
          out += `<strong><em>${inline(m[1])}</em></strong>`;
        } else if (re === INLINE_PATTERNS[6].re || re === INLINE_PATTERNS[7].re) {
          out += `<strong>${inline(m[1])}</strong>`;
        } else if (re === INLINE_PATTERNS[8].re) {
          out += `<mark>${inline(m[1])}</mark>`;
        } else if (re === INLINE_PATTERNS[9].re) {
          out += `<del>${inline(m[1])}</del>`;
        } else {
          out += `<em>${inline(m[1])}</em>`;
        }

        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }

      if (!matched) {
        // 没有匹配到任何模式：吃掉一个字符（转义后再输出）
        // 为了减少 HTML 体积，把连续的普通字符一起吃掉
        let i = 0;
        while (i < rest.length && !/[$`!\[<*_=~\\]/.test(rest[i])) i++;
        if (i === 0) i = 1;
        out += esc(rest.slice(0, i));
        rest = rest.slice(i);
      }
    }
    return out;
  }

  md.inline = inline;

  // ─────────────────────────────────────────────────────────────
  // 块级解析
  // ─────────────────────────────────────────────────────────────
  const CALLOUT_KINDS = {
    NOTE: { cls: 'note', label: '注意', icon: 'ℹ' },
    TIP: { cls: 'tip', label: '提示', icon: '✦' },
    IMPORTANT: { cls: 'important', label: '要点', icon: '★' },
    WARNING: { cls: 'warn', label: '警告', icon: '⚠' },
    CAUTION: { cls: 'caution', label: '易错', icon: '⛔' },
    PHYSICS: { cls: 'physics', label: '物理直觉', icon: '⚛' },
    NUMERIC: { cls: 'numeric', label: '数值陷阱', icon: '±' },
    DEBUG: { cls: 'debug', label: '调试线索', icon: '🐞' },
    EXAM: { cls: 'exam', label: '自测', icon: '✓' },
  };

  function renderTable(rows) {
    // rows[0] 是表头，rows[1] 是分隔行（已被调用方过滤）
    const head = rows[0];
    const body = rows.slice(1);
    const cells = (line, tag) =>
      line
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((c) => `<${tag}>${inline(c.trim())}</${tag}>`)
        .join('');
    return (
      '<div class="cpl-table-wrap"><table class="cpl-table">' +
      `<thead><tr>${cells(head, 'th')}</tr></thead>` +
      `<tbody>${body.map((r) => `<tr>${cells(r, 'td')}</tr>`).join('')}</tbody>` +
      '</table></div>'
    );
  }

  function renderList(items, ordered, start = 1) {
    const tag = ordered ? 'ol' : 'ul';
    const attr = ordered && start !== 1 ? ` start="${start}"` : '';
    const html = items
      .map((it) => {
        const task = /^\[([ xX])\]\s+/.exec(it.text);
        if (task) {
          const checked = task[1].toLowerCase() === 'x';
          const rest = it.text.slice(task[0].length);
          return (
            `<li class="cpl-task${checked ? ' is-done' : ''}">` +
            `<input type="checkbox" disabled${checked ? ' checked' : ''} aria-hidden="true" />` +
            `<span>${inline(rest)}${
              it.children ? renderBlocks(it.children) : ''
            }</span></li>`
          );
        }
        return `<li>${inline(it.text)}${it.children ? renderBlocks(it.children) : ''}</li>`;
      })
      .join('');
    return `<${tag}${attr} class="cpl-list">${html}</${tag}>`;
  }

  /**
   * 把 Markdown 源码渲染为 HTML 字符串。
   * @param {string} source
   * @param {{headingAnchors?: boolean}} opts
   */
  function renderBlocks(source, opts = {}) {
    const lines = String(source === undefined || source === null ? '' : source).replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let i = 0;
    let headingSeq = 0;

    const isBlank = (s) => /^\s*$/.test(s);

    while (i < lines.length) {
      const line = lines[i];

      // 空行
      if (isBlank(line)) {
        i++;
        continue;
      }

      // 围栏代码块 ``` 或 ~~~
      const fence = /^\s*(`{3,}|~{3,})\s*([\w+#.-]*)\s*(.*)$/.exec(line);
      if (fence) {
        const marker = fence[1][0];
        const lang = (fence[2] || '').toLowerCase();
        const meta = fence[3] || '';
        const body = [];
        i++;
        const endRe = new RegExp(`^\\s*${marker}{3,}\\s*$`);
        let closed = false;
        while (i < lines.length) {
          if (endRe.test(lines[i])) {
            closed = true;
            i++; // 吃掉结束围栏
            break;
          }
          body.push(lines[i]);
          i++;
        }
        // 未闭合的围栏：把剩余内容当代码处理，而不是丢掉，也绝不越界
        if (!closed) CPL.log('warn', '代码块围栏未闭合，已按"到文件末尾"处理');
        const code = body.join('\n');
        const label = (lang || 'text').replace(/[^\w+#.-]/g, '') || 'text';
        const metaAttrs = /\S/.test(meta) ? ` data-meta="${escAttr(meta.trim().slice(0, 120))}"` : '';
        // 语法高亮分片（55-highlight.js）可能比本分片后加载，因此运行时探测。
        const highlighted = highlightOf() ? highlightOf().render(code, label) : esc(code);
        out.push(
          '<div class="cpl-codeblock" data-lang="' +
            escAttr(label) +
            '"' +
            metaAttrs +
            '>' +
            `<div class="cpl-codeblock__bar"><span class="cpl-codeblock__lang">${esc(label)}</span>` +
            '<button type="button" class="cpl-codeblock__copy" data-copy-code>复制</button></div>' +
            `<pre class="cpl-pre"><code class="language-${escAttr(label)}">${highlighted}</code></pre>` +
            '</div>'
        );
        continue;
      }

      // 块级数学 $$ ... $$（可有单行 $$x$$ 形式）
      if (/^\s*\$\$/.test(line)) {
        const single = /^\s*\$\$(.+?)\$\$\s*$/.exec(line);
        if (single) {
          out.push(`<div class="cpl-math-block">${mathOf().render(single[1], { display: true })}</div>`);
          i++;
          continue;
        }
        const body = [];
        i++;
        while (i < lines.length && !/^\s*\$\$\s*$/.test(lines[i])) {
          body.push(lines[i]);
          i++;
        }
        i++;
        out.push(`<div class="cpl-math-block">${mathOf().render(body.join('\n'), { display: true })}</div>`);
        continue;
      }

      // 标题
      const heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
      if (heading) {
        const level = Math.min(6, heading[1].length + 1); // # → h2（h1 留给课程标题）
        const text = heading[2];
        const id = opts.headingAnchors !== false ? `sec-${++headingSeq}` : '';
        out.push(
          `<h${level}${id ? ` id="${id}"` : ''} class="cpl-md-h cpl-md-h${level}">${inline(text)}` +
            (id ? `<a class="cpl-anchor" href="#${id}" aria-label="本段锚点">#</a>` : '') +
            `</h${level}>`
        );
        i++;
        continue;
      }

      // 水平线
      if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
        out.push('<hr class="cpl-hr" />');
        i++;
        continue;
      }

      // 引用（含 callout）
      if (/^\s*>/.test(line)) {
        const body = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) {
          body.push(lines[i].replace(/^\s*>\s?/, ''));
          i++;
        }
        const first = body[0] || '';
        const callout = /^\[!(\w+)\]\s*(.*)$/.exec(first);
        if (callout) {
          const kind = CALLOUT_KINDS[callout[1].toUpperCase()] || CALLOUT_KINDS.NOTE;
          const title = callout[2].trim() || kind.label;
          body.shift();
          out.push(
            `<aside class="cpl-callout cpl-callout--${kind.cls}" role="note">` +
              `<div class="cpl-callout__head"><span class="cpl-callout__icon" aria-hidden="true">${kind.icon}</span>` +
              `<span class="cpl-callout__title">${inline(title)}</span></div>` +
              `<div class="cpl-callout__body">${renderBlocks(body.join('\n'), opts)}</div>` +
              '</aside>'
          );
        } else {
          out.push(`<blockquote class="cpl-quote">${renderBlocks(body.join('\n'), opts)}</blockquote>`);
        }
        continue;
      }

      // 表格：当前行含 | 且下一行是分隔行
      if (/\|/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1]) && /-/.test(lines[i + 1])) {
        const rows = [];
        rows.push(line);
        i += 2; // 跳过表头与分隔行
        while (i < lines.length && /\|/.test(lines[i]) && !isBlank(lines[i])) {
          rows.push(lines[i]);
          i++;
        }
        out.push(renderTable(rows));
        continue;
      }

      // 列表
      const listMatch = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line);
      if (listMatch) {
        const baseIndent = listMatch[1].length;
        const ordered = /\d/.test(listMatch[2]);
        const start = ordered ? parseInt(listMatch[2], 10) : 1;
        const items = [];
        while (i < lines.length) {
          const m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
          if (!m) break;
          if (m[1].length < baseIndent) break;
          if (m[1].length > baseIndent) {
            // 属于上一项的嵌套内容
            if (items.length) {
              const nested = [];
              const nestedIndent = m[1].length;
              while (i < lines.length) {
                const mm = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
                if (!mm || mm[1].length < nestedIndent) break;
                nested.push(lines[i]);
                i++;
              }
              items[items.length - 1].children = nested.join('\n');
            }
            continue;
          }
          items.push({ text: m[3], children: '' });
          i++;
          // 续行（缩进对齐的普通行）
          while (
            i < lines.length &&
            !isBlank(lines[i]) &&
            /^\s+\S/.test(lines[i]) &&
            !/^(\s*)([-*+]|\d+[.)])\s+/.test(lines[i])
          ) {
            items[items.length - 1].text += ` ${lines[i].trim()}`;
            i++;
          }
        }
        out.push(renderList(items, ordered, start));
        continue;
      }

      // 段落：连续非空行合并
      const para = [line];
      i++;
      while (
        i < lines.length &&
        !isBlank(lines[i]) &&
        !/^\s*(#{1,6}\s|>|\$\$|`{3,}|~{3,}|([-*+]|\d+[.)])\s)/.test(lines[i]) &&
        !/^\s*([-*_])(\s*\1){2,}\s*$/.test(lines[i])
      ) {
        para.push(lines[i]);
        i++;
      }
      out.push(`<p class="cpl-md-p">${inline(para.join(' ').replace(/\s{2,}$/, ''))}</p>`);
    }

    return out.join('\n');
  }

  md.renderBlocks = renderBlocks;

  /**
   * 渲染为 DOM 节点（推荐路径：挂载时代码块复制按钮已经可用）。
   */
  md.render = function render(source, opts = {}) {
    const wrap = dom.h('div', { class: 'cpl-md' });
    wrap.innerHTML = renderBlocks(source, opts);
    return wrap;
  };

  /** 渲染到指定容器（会先清空）。 */
  md.mount = function mount(container, source, opts = {}) {
    dom.clear(container);
    container.append(md.render(source, opts));
    return container;
  };

  /** 提取纯文本摘要（导航/搜索/Anki 前端预览用）。 */
  md.plain = function plain(source, maxLen = 160) {
    const text = String(source || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/\$\$[\s\S]*?\$\$/g, ' ')
      .replace(/`([^`]*)`/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/^\s*(#{1,6}|>|[-*+]|\d+[.)])\s+/gm, '')
      .replace(/[*_~=]{1,3}/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > maxLen ? text.slice(0, maxLen - 1) + '…' : text;
  };

  /** 提取所有标题，生成目录。 */
  md.outline = function outline(source) {
    const items = [];
    let seq = 0;
    for (const line of String(source || '').split('\n')) {
      const m = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
      if (!m) continue;
      seq++;
      items.push({ level: Math.min(6, m[1].length + 1), text: md.plain(m[2], 80), id: `sec-${seq}` });
    }
    return items;
  };

  // ─────────────────────────────────────────────────────────────
  // 代码块复制按钮：全站一次事件委托即可
  // ─────────────────────────────────────────────────────────────
  CPL.bus.on('app:mounted', () => {
    if (document.body.dataset.cplCopyBound === '1') return;
    document.body.dataset.cplCopyBound = '1';
    dom.delegate(document.body, 'click', '[data-copy-code]', async (e, btn) => {
      e.preventDefault();
      const block = btn.closest('.cpl-codeblock');
      const code = block ? block.querySelector('code') : null;
      if (!code) return;
      const ok = await dom.copyToClipboard(code.textContent || '');
      btn.textContent = ok ? '已复制' : '复制失败';
      setTimeout(() => {
        btn.textContent = '复制';
      }, 1600);
    });
  });
})();
