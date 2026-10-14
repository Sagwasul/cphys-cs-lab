/* ============================================================================
 * 96-views.js — 卡片库、设置、关于（#/cards、#/settings、#/about）
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;

  function pageHead(title, lead, crumb) {
    return dom.h(
      'header',
      { class: 'cpl-lesson__head' },
      dom.h('p', { class: 'cpl-lesson__crumb' }, dom.h('a', { href: '#/home', text: '首页' }), ' / ' + (crumb || title)),
      dom.h('h1', { class: 'cpl-lesson__title', text: title }),
      lead ? dom.h('p', { class: 'cpl-lesson__subtitle', text: lead }) : null
    );
  }

  // ═════════════════════════════════════════════════════════════
  // #/cards — 卡片库
  // ═════════════════════════════════════════════════════════════
  CPL.nav.register('cards', async function renderCards(main, param) {
    main.append(
      pageHead(
        '卡片库与 Anki 导出',
        '把课程自带的卡片、你的错题、以及自定义内容的卡片集中导出。导出格式是 Anki 原生支持的 TSV / CSV，导入步骤见 README。',
        '卡片'
      )
    );

    // 先确保用到的课程内容已加载（卡片写在课程文件里）
    const metas = CPL.catalog.lessons();
    const needLoad = metas.slice(0, 60).map((m) => m.id);
    const loaded = await Promise.all(
      needLoad.map((id) => CPL.catalog.load(id).catch(() => null))
    );
    void loaded;

    const userLessons = await CPL.userContent.all();

    const allLessonCards = CPL.anki.collect({});
    const wrongCards = CPL.anki.collect({ source: 'wrong' });
    const userCards = CPL.anki.collectUserCards(userLessons);
    const all = [...allLessonCards, ...wrongCards, ...userCards];

    const stats = dom.h('div', { class: 'cpl-hero__stats' });
    stats.append(
      stat('课程卡片', String(allLessonCards.length)),
      stat('错题卡片', String(wrongCards.length)),
      stat('我的卡片', String(userCards.length)),
      stat('合计', String(all.length))
    );
    main.append(stats);

    const bar = dom.h('div', { class: 'cpl-lesson__actions' });
    bar.append(
      dom.h('button', { class: 'cpl-btn', type: 'button', text: '开始复习（全部）', disabled: !all.length, onclick: () => review(all, '全部卡片') }),
      dom.h('button', { class: 'cpl-btn', type: 'button', text: '只复习错题', disabled: !wrongCards.length, onclick: () => review(wrongCards, '错题重练') }),
      dom.h('button', { class: 'cpl-btn', type: 'button', text: '复习最不熟的', disabled: !all.length, onclick: () => review(CPL.anki.weakCards(all).slice(0, 30), '最不熟的卡片') })
    );
    main.append(bar);

    const exportBar = dom.h('div', { class: 'cpl-lesson__actions' });
    for (const fmt of [
      ['tsv', 'TSV（推荐，Anki 直接导入）'],
      ['csv', 'CSV（Excel 可编辑）'],
      ['md', 'Markdown（贴到任何地方）'],
      ['json', 'JSON（含完整元数据，可再导入）'],
    ]) {
      exportBar.append(
        dom.h('button', {
          class: fmt[0] === 'tsv' ? 'cpl-btn cpl-btn--primary' : 'cpl-btn',
          type: 'button',
          text: `导出全部为 ${fmt[1]}`,
          disabled: !all.length,
          onclick: () => CPL.anki.exportCards(all, fmt[0]),
        })
      );
    }
    main.append(exportBar);

    const reviewHost = dom.h('div', { class: 'cpl-review__mount' });
    main.append(reviewHost);

    let reviewer = null;
    function review(cards, label) {
      if (reviewer) reviewer.destroy();
      dom.clear(reviewHost);
      if (!cards.length) {
        reviewHost.append(dom.h('p', { class: 'cpl-muted', text: '这一叠没有卡片。' }));
        return;
      }
      reviewHost.append(dom.h('h2', { class: 'cpl-ls__title', text: `复习：${label}（${cards.length} 张）` }));
      reviewer = CPL.anki.mountReviewer(reviewHost, cards);
      reviewHost.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    CPL.nav._cleanup = () => reviewer && reviewer.destroy();

    // 按周分组浏览
    const groups = new Map();
    for (const c of all) {
      const key = c.week ? `第 ${String(c.week).padStart(2, '0')} 周` : '未分周';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(c);
    }

    const browse = dom.h('section', { class: 'cpl-ls' });
    browse.append(dom.h('h2', { class: 'cpl-ls__title', text: '按周浏览与导出' }));
    for (const [key, cards] of Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0], 'zh-CN'))) {
      const row = dom.h(
        'div',
        { class: 'cpl-cardrow' },
        dom.h('span', { class: 'cpl-cardrow__label', text: key }),
        dom.h('span', { class: 'cpl-cardrow__count', text: `${cards.length} 张` }),
        dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '复习', onclick: () => review(cards, key) }),
        dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '导出 TSV', onclick: () => CPL.anki.exportCards(cards, 'tsv') })
      );
      browse.append(row);
    }
    main.append(browse);

    const note = dom.h(
      'section',
      { class: 'cpl-card' },
      dom.h('h2', { class: 'cpl-card__title', text: '为什么没有 .apkg 文件' }),
      dom.h('p', {
        text:
          '.apkg 本质是一个内含 SQLite 数据库的 ZIP 包。在纯前端手写 SQLite 二进制格式很容易生成打不开的坏包，所以本平台选择导出 Anki 原生支持的文本格式：导入只要两步（文件 → 导入 → 选 TSV → 指定字段与标签列），比给你一个可能损坏的 .apkg 更可靠。',
      }),
      dom.h('p', { class: 'cpl-muted', text: '导入步骤写在 README 的「Anki 导入」一节，可直接照抄。' })
    );
    main.append(note);

    function stat(label, value) {
      return dom.h('div', { class: 'cpl-stat' }, dom.h('span', { class: 'cpl-stat__label', text: label }), dom.h('strong', { class: 'cpl-stat__value', text: value }));
    }
    void param;
  });

  // ═════════════════════════════════════════════════════════════
  // #/settings — 设置与数据管理
  // ═════════════════════════════════════════════════════════════
  CPL.nav.register('settings', async function renderSettings(main) {
    main.append(pageHead('设置与数据', '所有偏好与数据都只保存在你自己的浏览器里。这里也可以测试 AI 代理连通性、导出/导入/清空本地数据。', '设置'));

    const prefs = CPL.prefs.all();

    // ── 外观 ─────────────────────────────────────────────
    const appearance = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '外观' }));

    appearance.append(
      selectField('主题', ['auto', 'light', 'dark'], prefs.theme, (v) => {
        CPL.theme.set(v);
      }, { auto: '跟随系统', light: '浅色', dark: '深色' }),
      selectField('密度', ['comfortable', 'compact'], prefs.density, (v) => {
        CPL.prefs.set('density', v);
      }, { comfortable: '宽松', compact: '紧凑' }),
      rangeField('字号缩放', 0.85, 1.4, 0.05, prefs.fontScale, (v) => CPL.prefs.set('fontScale', v), (v) => `${Math.round(v * 100)}%`),
      checkField('减少动效（尊重系统的"减少动态效果"设置）', prefs.reducedMotion, (v) => CPL.prefs.set('reducedMotion', v)),
      checkField('允许按需从 CDN 加载可选依赖（Pyodide / KaTeX / CodeMirror）', prefs.enableCdn, (v) => {
        CPL.prefs.set('enableCdn', v);
        dom.toast(v ? '已允许 CDN 依赖，刷新后生效' : '已禁用 CDN 依赖。浏览器内 Python 执行将不可用，公式会退回原生 MathML 渲染。', { kind: 'info', ms: 6000 });
      }),
      checkField('打开课程后自动运行测试（会立刻消耗一次运行时加载）', prefs.autoRunTests, (v) => CPL.prefs.set('autoRunTests', v))
    );
    main.append(appearance);

    // ── AI 助教 ──────────────────────────────────────────
    const aiCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: 'AI 助教' }));
    const usage = CPL.store.scope('aiUsage');
    const today = new Date().toISOString().slice(0, 10);
    const todayUsage = usage.get(today, { count: 0 });

    aiCard.append(
      dom.h(
        'p',
        {},
        dom.h('strong', { text: '代理地址：' }),
        CPL.config.apiBase ? dom.h('code', { class: 'cpl-code-inline', text: CPL.config.apiBase }) : dom.h('span', { class: 'cpl-pill cpl-pill--warn', text: '未配置（离线模式）' })
      ),
      dom.h('p', { class: 'cpl-muted', text: `今日已用：${todayUsage.count} 次 · 前端软限流：每分钟 ${CPL.config.ai.softRatePerMin} 次（真正的限流在服务端）` }),
      dom.h('p', {
        class: 'cpl-muted',
        text:
          '安全说明：API 密钥只存在于 Serverless 环境变量里，前端代码与 GitHub 仓库中都没有密钥。代理会做 Origin 白名单、速率限制、输入长度限制，并统一错误返回（不泄露内部信息）。详见仓库根目录的 SECURITY.md。',
      })
    );

    if (!CPL.config.apiBase) {
      aiCard.append(
        dom.h(
          'div',
          { class: 'cpl-callout cpl-callout--note' },
          dom.h(
            'div',
            { class: 'cpl-callout__body' },
            dom.h('p', { text: '要让 AI 助教工作，需要两步：' }),
            dom.h(
              'ol',
              { class: 'cpl-list' },
              [
                dom.h('li', {}, dom.h('span', { text: '把仓库里的 api/chat.js 部署到 Vercel，并配置环境变量 AI_API_KEY、ALLOWED_ORIGINS。' })),
                dom.h('li', {}, dom.h('span', { text: '把 index.html 里的 apiBase 改成 https://<你的项目>.vercel.app/api/chat。' })),
              ]
            ),
            dom.h('p', { class: 'cpl-muted', text: '完整命令见 README「部署 AI 代理（Vercel）」。' })
          )
        )
      );
    } else {
      const testBtn = dom.h('button', { class: 'cpl-btn', type: 'button', text: '测试连通性' });
      const testOut = dom.h('div', { class: 'cpl-run-output' });
      testBtn.addEventListener('click', async () => {
        testBtn.disabled = true;
        dom.clear(testOut);
        testOut.append(dom.spinner('正在请求代理…'));
        const t0 = performance.now();
        const res = await CPL.ai.request(
          { action: 'chat', messages: [{ role: 'user', content: '连通性测试：请只回复两个字"收到"。' }], context: { lessonId: '', tags: ['connectivity-test'] } },
          { onDelta: () => {} }
        );
        testBtn.disabled = false;
        dom.clear(testOut);
        if (res.ok) {
          testOut.append(dom.h('p', { class: 'cpl-pill cpl-pill--ok', text: `连通正常（${util.seconds(performance.now() - t0)}）` }));
          if (res.text) testOut.append(dom.h('pre', { class: 'cpl-run-stdout', text: res.text.slice(0, 500) }));
        } else {
          testOut.append(
            dom.errorCard('连通失败', res.message || '未知错误', [
              `错误码：${res.code}${res.requestId ? ' · requestId: ' + res.requestId : ''}`,
              '检查 vercel 环境变量与 ALLOWED_ORIGINS 是否包含当前站点域名',
            ])
          );
        }
        return undefined;
      });
      aiCard.append(dom.h('div', { class: 'cpl-lesson__actions' }, testBtn), testOut);
    }
    main.append(aiCard);

    // ── 运行时 ───────────────────────────────────────────
    const rtCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '运行时能力与限制' }));
    const status = CPL.runtimes.pyStatus();
    rtCard.append(
      dom.h(
        'table',
        { class: 'cpl-table cpl-table--compact' },
        dom.h('thead', {}, dom.h('tr', {}, ['语言', '浏览器内执行', '说明'].map((h) => dom.h('th', { text: h })))),
        dom.h(
          'tbody',
          {},
          [
            ['Python', '完整可用', 'Pyodide 314.0.7（CPython 3.14.2 → WASM），支持 numpy / scipy / matplotlib，在 Worker 中运行并有超时保护。'],
            ['Fortran', '不可用（诚实说明）', 'LFortran 的 WASM 版本仍是 alpha，官方明确不保证第三方代码；GitHub Pages 也给不了它需要的跨源隔离头。本平台提供静态检查 + 本地运行命令 + 在线编译器链接。'],
            ['C / C++', '不可用（体积原因）', 'Clang→WASM 压缩后仍需约 20 MB 下载与本地解压，不适合作为默认路径。提供静态检查与本地运行命令。'],
          ].map((r) => dom.h('tr', {}, r.map((c) => dom.h('td', { text: c }))))
        )
      ),
      dom.h('p', { class: 'cpl-muted', text: `当前 Python 运行时状态：${status.ready ? '已就绪' : status.loading ? '加载中' : '未加载'}${status.error ? ' · 上次错误：' + status.error : ''}` })
    );
    rtCard.append(
      dom.h(
        'div',
        { class: 'cpl-lesson__actions' },
        dom.h('button', {
          class: 'cpl-btn',
          type: 'button',
          text: '预加载 Python 运行时',
          onclick: async (e) => {
            const btn = e.target;
            btn.disabled = true;
            btn.textContent = '加载中…';
            try {
              await CPL.runtimes.ensurePython((m) => {
                btn.textContent = m.length > 40 ? m.slice(0, 40) + '…' : m;
              });
              dom.toast('Python 运行时就绪', { kind: 'ok' });
              CPL.nav.render();
            } catch (err) {
              dom.toast(dom.friendlyError(err), { kind: 'error', ms: 8000 });
              btn.disabled = false;
              btn.textContent = '预加载 Python 运行时';
            }
          },
        }),
        dom.h('button', {
          class: 'cpl-btn cpl-btn--ghost',
          type: 'button',
          text: '重置运行时',
          onclick: () => {
            CPL.runtimes.resetPython();
            dom.toast('运行时已重置，下次运行会重新加载', { kind: 'info' });
          },
        })
      )
    );
    main.append(rtCard);

    // ── 数据管理 ─────────────────────────────────────────
    const dataCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '数据管理' }));
    const lessons = await CPL.userContent.all();
    const estimate = await CPL.store.idb.estimate();

    dataCard.append(
      dom.h('p', { class: 'cpl-muted', text: `自定义课程：${lessons.length} 个 · 偏好与进度：localStorage${estimate ? ` · 估算占用：${util.bytes(estimate.usage || 0)}` : ''}` }),
      dom.h(
        'div',
        { class: 'cpl-lesson__actions' },
        dom.h('button', {
          class: 'cpl-btn cpl-btn--primary',
          type: 'button',
          text: '导出全部本地数据（备份）',
          onclick: async () => {
            const payload = {
              prefs: CPL.prefs.all(),
              store: CPL.store.exportAll(),
              userLessons: lessons,
              ankiReviewed: CPL.anki.reviewed(),
              exportedAt: new Date().toISOString(),
            };
            dom.download(`cphys-cs-lab-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json');
            dom.toast('备份已下载', { kind: 'ok' });
          },
        }),
        dom.h('button', {
          class: 'cpl-btn',
          type: 'button',
          text: '从备份导入',
          onclick: async () => {
            try {
              const file = await dom.pickFile('.json,application/json');
              if (!file) return;
              const data = JSON.parse(file.text);
              let restored = 0;
              if (data.store && data.store.data) {
                const res = CPL.store.importAll(data.store);
                restored += res.written;
              }
              if (data.prefs) {
                for (const [k, v] of Object.entries(data.prefs)) CPL.prefs.set(k, v);
              }
              if (Array.isArray(data.userLessons)) {
                for (const l of data.userLessons) {
                  await CPL.userContent.save(l);
                  restored++;
                }
              }
              if (data.ankiReviewed) {
                const s = CPL.store.scope('anki');
                s.set('reviewed', data.ankiReviewed);
              }
              dom.toast(`已恢复 ${restored} 项数据，页面即将刷新`, { kind: 'ok' });
              setTimeout(() => location.reload(), 1200);
            } catch (err) {
              dom.toast(dom.friendlyError(err), { kind: 'error', ms: 8000 });
            }
          },
        }),
        dom.h('button', {
          class: 'cpl-btn cpl-btn--danger',
          type: 'button',
          text: '清空全部本地数据',
          onclick: async () => {
            if (!window.confirm('这会删除：学习进度、自检勾选、笔记、自定义课程、卡片复习记录、偏好设置。确定继续？')) return;
            if (!window.confirm('再确认一次：数据删除后无法恢复（除非你导出过备份）。')) return;
            const n = CPL.store.clearAll();
            try {
              if (CPL.store.idb.available()) {
                await CPL.store.idb.clear('userLessons');
                await CPL.store.idb.clear('anki');
                await CPL.store.idb.clear('drafts');
                await CPL.store.idb.clear('kv');
              }
            } catch (err) {
              CPL.log('warn', '清空 IndexedDB 失败', err);
            }
            dom.toast(`已清空 ${n} 项本地数据，页面即将刷新`, { kind: 'ok' });
            setTimeout(() => location.reload(), 1200);
          },
        })
      )
    );
    main.append(dataCard);

    // ── 诊断测评 ─────────────────────────────────────────
    const assessCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '诊断测评与掌握度' }));
    const history = CPL.assess.history();
    assessCard.append(
      dom.h('p', { class: 'cpl-muted', text: history.length ? `已做过 ${history.length} 次测评，最近一次：${new Date(history[history.length - 1].at).toLocaleString('zh-CN')}（${history[history.length - 1].percent}%）` : '还没有做过诊断测评。' }),
      dom.h(
        'div',
        { class: 'cpl-lesson__actions' },
        dom.h('a', { class: 'cpl-btn cpl-btn--primary', href: '#/assess', text: '去做诊断测评' }),
        dom.h('a', { class: 'cpl-btn', href: '#/assess/result', text: '查看技能画像与推荐路径' }),
        dom.h('button', {
          class: 'cpl-btn cpl-btn--danger',
          type: 'button',
          text: '重置测评与掌握度',
          onclick: () => {
            if (!window.confirm('重置后掌握度画像会清空（课程进度不受影响）。继续？')) return;
            CPL.assess.reset();
            dom.toast('已重置', { kind: 'ok' });
            CPL.nav.render();
          },
        })
      )
    );
    main.append(assessCard);

    // ── 关于本页的日志 ───────────────────────────────────
    const logCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '诊断日志' }));
    logCard.append(
      dom.h('p', { class: 'cpl-muted', text: '这些日志只存在内存里，不会发送到任何服务器。遇到问题时可以复制出来自查。' }),
      dom.h('button', {
        class: 'cpl-btn cpl-btn--sm',
        type: 'button',
        text: '复制最近日志',
        onclick: async () => {
          const text = CPL.logHistory()
            .map((e) => `${new Date(e.t).toISOString()} [${e.level}] ${e.args.map((a) => (typeof a === 'string' ? a : dom.friendlyError(a))).join(' ')}`)
            .join('\n');
          const ok = await dom.copyToClipboard(text || '（无日志）');
          dom.toast(ok ? '日志已复制' : '复制失败', { kind: ok ? 'ok' : 'warn' });
        },
      })
    );
    main.append(logCard);

    // ── 小工具 ───────────────────────────────────────────
    function selectField(label, values, current, onChange, labels = {}) {
      const sel = dom.h('select', { class: 'cpl-select', 'aria-label': label });
      for (const v of values) sel.append(dom.h('option', { value: v, text: labels[v] || v, selected: v === current }));
      sel.addEventListener('change', () => onChange(sel.value));
      return dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: label }), sel);
    }

    function rangeField(label, min, max, step, current, onChange, fmt) {
      const out = dom.h('output', { class: 'cpl-ctl__value', text: fmt(current) });
      const input = dom.h('input', {
        type: 'range',
        class: 'cpl-ctl__range',
        min: String(min),
        max: String(max),
        step: String(step),
        value: String(current),
        'aria-label': label,
        oninput: (e) => {
          const v = Number(e.target.value);
          out.textContent = fmt(v);
          onChange(v);
        },
      });
      return dom.h('div', { class: 'cpl-field' }, dom.h('label', { class: 'cpl-ctl' }, dom.h('span', { class: 'cpl-ctl__label', text: label }), input, out));
    }

    function checkField(label, checked, onChange) {
      const input = dom.h('input', { type: 'checkbox', checked, onchange: (e) => onChange(e.target.checked) });
      return dom.h('label', { class: 'cpl-check cpl-field' }, input, dom.h('span', { text: label }));
    }
  });

  // ═════════════════════════════════════════════════════════════
  // #/about — 关于与许可
  // ═════════════════════════════════════════════════════════════
  CPL.nav.register('about', function renderAbout(main) {
    main.append(pageHead('关于本平台', '一个纯静态的互动学习站点：没有后端、没有数据库、没有备案、没有追踪。', '关于'));

    const wrap = dom.h('div', { class: 'cpl-about' });

    wrap.append(
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '它是什么' }),
        dom.h('p', {
          text:
            '面向计算物理与计算机科学的知识学习平台，27 周、7 大模块。每节课包含学习目标、核心概念、工具速查、交互式 demo、代码练习（浏览器内运行）、自动测试、AI 引导式助教与 Anki 卡片。',
        }),
        dom.h('p', { class: 'cpl-muted', text: '平台只介绍知识，不涉及面试、简历、就业等私人事务。' })
      ),
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '三条判断准则' }),
        dom.h('ul', { class: 'cpl-list' }, [
          dom.h('li', {}, dom.h('strong', { text: '概念性知识必须内化' }), dom.h('span', { text: '：复杂度、内存模型、数值误差、稳定性、收敛阶、并行范式、边界条件、调试方法。判据是"能自己推回来"。' })),
          dom.h('li', {}, dom.h('strong', { text: '工具性细节知道存在、会查即可' }), dom.h('span', { text: '：API、语法、库函数、编译参数。判据是"30 秒能查到"。' })),
          dom.h('li', {}, dom.h('strong', { text: '忘记不是归零，是存档' }), dom.h('span', { text: '：项目锚点 + 代码库 + Anki + 费曼输出。' })),
        ])
      ),
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '隐私与数据' }),
        dom.h('ul', { class: 'cpl-list' }, [
          dom.h('li', { text: '没有账号系统，不收集任何个人信息（姓名、邮箱、学校都不需要）。' }),
          dom.h('li', { text: '学习进度、笔记、自定义课程、卡片复习记录全部保存在你自己的浏览器里。' }),
          dom.h('li', { text: '使用 AI 助教时，只会发送"当前课程 id + 你的提问 + 你主动贴出的代码"，以及技能掌握等级。' }),
          dom.h('li', { text: '没有第三方分析脚本、没有埋点、没有广告。' }),
        ])
      ),
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '技术栈与依赖' }),
        dom.h('ul', { class: 'cpl-list' }, [
          dom.h('li', { text: '前端：原生 HTML/CSS/JavaScript，由零依赖构建脚本拼成三个文件（index.html + app.js + app.css）。课程内容按需加载，加课不用重新构建。' }),
          dom.h('li', { text: 'Python 执行：Pyodide 314.0.7（CPython 3.14.2 → WebAssembly），在 Web Worker 中运行。首次约 13.5 MB，之后走浏览器缓存。' }),
          dom.h('li', { text: '公式：默认用浏览器原生 MathML（零依赖、可离线）；开启 CDN 后自动切换到 KaTeX 0.19.0（带 SRI 校验）。' }),
          dom.h('li', { text: '编辑器：CodeMirror 6（从 CDN 按需加载，允许离线退化到纯文本框）。' }),
          dom.h('li', { text: '托管：GitHub Pages（静态）。AI 代理：Vercel Serverless Functions（密钥只在服务端环境变量里）。' }),
        ])
      ),
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '诚实声明：什么在浏览器里跑不了' }),
        dom.h('p', {
          text:
            'Fortran 与 C/C++ 的浏览器内执行在本平台上不可用，这是经过核实的结论而不是偷懒：LFortran 的 WASM 版本仍处于 alpha，官方明确说明不保证第三方代码；Clang→WASM 需要约 20 MB 的下载与本地解压。与其给出一个"点了没反应"的按钮，这里选择提供静态检查、语法陷阱提示、参考实现、可一键复制的本地运行命令，以及官方在线编译器的链接。',
        }),
        dom.h('p', { class: 'cpl-muted', text: 'Python 与 NumPy 在浏览器内是完整可用的，练习与自动测试都真实执行。' })
      ),
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '验收标准' }),
        dom.h(
          'ul',
          { class: 'cpl-list' },
          [
            '无备案、无自建服务器：全站静态 + Serverless 代理',
            'API 密钥不出现在前端代码、仓库、日志中的任何位置',
            '每节课都有交互式练习与自动测试（由大纲完整性测试保证）',
            'Fortran 模块（5–7 周）与 CS 核心模块（11–19 周）内容完整',
            '用户可添加自定义学习内容，支持 JSON 导入导出往返一致',
            '移动端可用（单栏 + 抽屉导航，触控目标 ≥ 44px）',
            '代码可复现：npm run build && npm test 全绿',
          ].map((t) => dom.h('li', { text: t }))
        )
      )
    );

    if (CPL.config.repoUrl) {
      wrap.append(
        dom.h('p', {}, dom.h('a', { class: 'cpl-btn', href: dom.safeUrl(CPL.config.repoUrl), target: '_blank', rel: 'noopener noreferrer', text: '在 GitHub 上查看源码' }))
      );
    }
    wrap.append(dom.h('p', { class: 'cpl-muted', text: `构建版本：${CPL.VERSION} · 内容清单 schema ${CPL.SCHEMA}` }));

    main.append(wrap);
  });
})();
