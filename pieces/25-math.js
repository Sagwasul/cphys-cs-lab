/* ============================================================================
 * 25-math.js — 轻量 LaTeX 子集 → MathML 渲染器
 *
 * 为什么不用 KaTeX 作为唯一路径：
 *   本平台要能在完全离线（file:// 双击打开、内网无外网）时可用。
 *   KaTeX 需要 3 个 CDN 资源；MathML 是浏览器原生能力，零依赖。
 *   因此：默认用这里的 MathML 渲染器；若用户在设置里开启 CDN 且 KaTeX 可用，
 *   则自动切换到 KaTeX（排版更精细），两条路径的输出都经过转义。
 *
 * 支持范围（覆盖物理/CS 课程里的 95% 公式）：
 *   \frac \dfrac \sqrt \sum \prod \int \oint \lim \partial \nabla
 *   ^ _ 上下标、\left \right 定界符、希腊字母、\vec \hat \bar \dot \tilde
 *   \begin{matrix|pmatrix|bmatrix|vmatrix|cases}...\end{...}
 *   \text \mathrm \operatorname、\cdot \times \pm \approx \leq \geq \neq \to
 *
 * 不支持：\begin{align} 的完整对齐语义、TikZ、自定义宏。遇到不认识的命令时
 * 会降级为纯文本显示（不报错、不白屏）。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;

  const math = (CPL.math = {});

  // ─────────────────────────────────────────────────────────────
  // 符号表
  // ─────────────────────────────────────────────────────────────
  const GREEK = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ϵ',
    zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ',
    lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', varpi: 'ϖ', rho: 'ρ',
    varrho: 'ϱ', sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ', phi: 'φ',
    varphi: 'ϕ', chi: 'χ', psi: 'ψ', omega: 'ω',
    Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
    Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  };

  const SYMBOLS = {
    cdot: '⋅', cdots: '⋯', ldots: '…', dots: '…', vdots: '⋮', ddots: '⋱',
    times: '×', div: '÷', pm: '±', mp: '∓', ast: '∗', star: '⋆', circ: '∘',
    bullet: '∙', oplus: '⊕', otimes: '⊗', cap: '∩', cup: '∪', setminus: '∖',
    subset: '⊂', supset: '⊃', subseteq: '⊆', supseteq: '⊇', in: '∈', notin: '∉',
    ni: '∋', forall: '∀', exists: '∃', nexists: '∄', emptyset: '∅', varnothing: '∅',
    infty: '∞', partial: '∂', nabla: '∇', propto: '∝', sim: '∼', simeq: '≃',
    approx: '≈', cong: '≅', equiv: '≡', neq: '≠', ne: '≠', leq: '≤', le: '≤',
    geq: '≥', ge: '≥', ll: '≪', gg: '≫', to: '→', rightarrow: '→', leftarrow: '←',
    leftrightarrow: '↔', Rightarrow: '⇒', Leftarrow: '⇐', Leftrightarrow: '⇔',
    mapsto: '↦', implies: '⟹', iff: '⟺', uparrow: '↑', downarrow: '↓',
    prime: '′', angle: '∠', perp: '⊥', parallel: '∥', therefore: '∴', because: '∵',
    aleph: 'ℵ', hbar: 'ℏ', ell: 'ℓ', Re: 'ℜ', Im: 'ℑ', wp: '℘',
    langle: '⟨', rangle: '⟩', lceil: '⌈', rceil: '⌉', lfloor: '⌊', rfloor: '⌋',
    lVert: '‖', rVert: '‖', vert: '|', Vert: '‖', backslash: '\\',
    quad: '\u2003', qquad: '\u2003\u2003', ',': '\u2009', ';': '\u2005', ':': '\u2005', '!': '',
  };

  const BIG_OPS = {
    sum: '∑', prod: '∏', coprod: '∐', int: '∫', iint: '∬', iiint: '∭',
    oint: '∮', bigcup: '⋃', bigcap: '⋂', bigoplus: '⨁', bigotimes: '⨂',
    lim: 'lim', limsup: 'lim sup', liminf: 'lim inf', max: 'max', min: 'min',
    sup: 'sup', inf: 'inf', argmax: 'arg max', argmin: 'arg min', det: 'det',
    gcd: 'gcd', log: 'log', ln: 'ln', exp: 'exp', sin: 'sin', cos: 'cos',
    tan: 'tan', sinh: 'sinh', cosh: 'cosh', tanh: 'tanh', arcsin: 'arcsin',
    arccos: 'arccos', arctan: 'arctan', mod: 'mod', deg: 'deg', dim: 'dim',
    ker: 'ker', hom: 'hom', rank: 'rank', tr: 'tr', diag: 'diag', sign: 'sgn',
  };

  const ACCENTS = {
    vec: '\u20d7', hat: '^', bar: '¯', tilde: '~', dot: '˙', ddot: '¨',
    overline: '¯', underline: '_', widehat: '^', widetilde: '~',
  };

  const DELIMS = { '\\{': '{', '\\}': '}', '{': '{', '}': '}', '|': '|', '.': '' };

  /**
   * 需要"作用于下一个原子"的命令 → MathML 构造
   * 返回值是 {tag, ...} 描述，由 renderer 递归构建。
   */

  // ─────────────────────────────────────────────────────────────
  // Tokenizer：把 LaTeX 串切成 token
  // ─────────────────────────────────────────────────────────────
  function tokenize(src) {
    const tokens = [];
    let i = 0;
    const n = src.length;
    while (i < n) {
      const ch = src[i];
      if (ch === '\\') {
        if (src[i + 1] === '\\') {
          // 换行命令 \\
          tokens.push({ type: 'command', value: '\\' });
          i += 2;
          continue;
        }
        const escaped = src[i + 1];
        if (escaped && '{}$%&#_^~'.includes(escaped)) {
          // 转义字符：按字面量处理
          tokens.push({ type: 'text', value: escaped });
          i += 2;
          continue;
        }
        // 命令：\name 或 \sym
        let j = i + 1;
        let name = '';
        while (j < n && /[a-zA-Z]/.test(src[j])) name += src[j++];
        if (!name) {
          // 单字符命令，如 \, \; \! \:
          name = src[j] || '';
          j++;
        }
        tokens.push({ type: 'command', value: name });
        i = j;
      } else if (ch === '{') {
        tokens.push({ type: 'lbrace' });
        i++;
      } else if (ch === '}') {
        tokens.push({ type: 'rbrace' });
        i++;
      } else if (ch === '^') {
        tokens.push({ type: 'sup' });
        i++;
      } else if (ch === '_') {
        tokens.push({ type: 'sub' });
        i++;
      } else if (ch === '&') {
        tokens.push({ type: 'align' });
        i++;
      } else if (ch === '~') {
        tokens.push({ type: 'text', value: '\u00a0' });
        i++;
      } else if (/\s/.test(ch)) {
        tokens.push({ type: 'text', value: ' ' });
        i++;
      } else {
        // 普通字符：连续的字母数字打包，避免 MathML 里每个字符一个节点
        let j = i;
        let buf = '';
        while (j < n && !/[\\{}^_&~\s]/.test(src[j])) buf += src[j++];
        tokens.push({ type: 'text', value: buf });
        i = j;
      }
    }
    return tokens;
  }

  // ─────────────────────────────────────────────────────────────
  // Parser：token → 语法树
  // node = {kind:'row', children} | {kind:'sym', text, op?} | {kind:'frac', num, den}
  //      | {kind:'sqrt', index?, body} | {kind:'sup'|'sub'|'supsub', base, arg}
  //      | {kind:'accent', accent, body} | {kind:'text', text}
  //      | {kind:'matrix', env, rows:[[node]], delim}
  //      | {kind:'styled', variant, body}
  // ─────────────────────────────────────────────────────────────
  function parse(tokens) {
    let pos = 0;

    const peek = () => tokens[pos];
    const next = () => tokens[pos++];

    function parseGroup() {
      // 读取一个"原子"：{...} 组、单个 token、或命令
      const t = peek();
      if (!t) return { kind: 'row', children: [] };
      if (t.type === 'lbrace') {
        next();
        const node = parseRow(true);
        if (peek() && peek().type === 'rbrace') next();
        return node;
      }
      return parseAtom();
    }

    function parseOptionalBracket() {
      // LaTeX 的可选参数用 [ ]，这里只在 \sqrt[3] 和 \begin{...}[..] 中用到
      if (peek() && peek().type === 'text' && peek().value.trim().startsWith('[')) {
        // 简化处理：把 [3] 当作一个文本原子返回
        const t = next();
        const m = /\[([^\]]*)\]/.exec(t.value);
        return m ? { kind: 'text', text: m[1] } : null;
      }
      return null;
    }

    function parseMatrix(env) {
      const rows = [[]];
      let cell = [];
      const delim = {
        matrix: null,
        pmatrix: ['(', ')'],
        bmatrix: ['[', ']'],
        Bmatrix: ['{', '}'],
        vmatrix: ['|', '|'],
        Vmatrix: ['‖', '‖'],
        cases: ['{', ''],
        aligned: null,
        align: null,
        array: null,
      }[env] || null;

      const pushCell = () => {
        rows[rows.length - 1].push({ kind: 'row', children: cell });
        cell = [];
      };

      while (pos < tokens.length) {
        const t = tokens[pos];
        if (t.type === 'command' && t.value === 'end') {
          pos++;
          // 跳过 {env}
          if (peek() && peek().type === 'lbrace') {
            pos++;
            while (peek() && peek().type !== 'rbrace') pos++;
            if (peek()) pos++;
          }
          break;
        }
        if (t.type === 'command' && t.value === '\\') {
          pos++;
          pushCell();
          rows.push([]);
          continue;
        }
        if (t.type === 'align') {
          pos++;
          pushCell();
          continue;
        }
        cell.push(parseAtom());
      }
      pushCell();
      return { kind: 'matrix', env, delim, rows: rows.filter((r) => r.length) };
    }

    /**
     * 解析一个原子。
     * @param {boolean} allowScripts 是否吃掉紧随的 ^ / _。
     *   脚本参数用 false 调用，避免把"脚本的脚本"错误地吞进来。
     */
    function parseAtom(allowScripts = true) {
      const node = parseAtomBase();
      return allowScripts ? attachScripts(node) : node;
    }

    /** 只解析原子本身，不处理 ^ / _。 */
    function parseAtomBase() {
      const t = next();
      if (!t) return { kind: 'row', children: [] };

      if (t.type === 'text') {
        return { kind: 'text', text: t.value };
      }

      if (t.type === 'lbrace') {
        const row = parseRow(true);
        if (peek() && peek().type === 'rbrace') next();
        return row;
      }

      if (t.type === 'sup' || t.type === 'sub') {
        // 畸形输入（^ 或 _ 出现在没有基的位置）：忽略这个脚本标记，返回空行
        return { kind: 'row', children: [] };
      }

      if (t.type === 'rbrace') {
        // 多余的 }，忽略
        return { kind: 'row', children: [] };
      }

      if (t.type === 'command') {
        const name = t.value;

        if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
          const num = parseGroup();
          const den = parseGroup();
          return { kind: 'frac', num, den, display: name === 'dfrac' };
        }

        if (name === 'sqrt') {
          const index = parseOptionalBracket();
          const body = parseGroup();
          return { kind: 'sqrt', index, body };
        }

        if (name === 'begin') {
          // \begin{env}
          let env = '';
          if (peek() && peek().type === 'lbrace') {
            pos++;
            while (peek() && peek().type !== 'rbrace') {
              const x = next();
              if (x.type === 'text') env += x.value;
              else if (x.type === 'command') env += x.value;
            }
            if (peek()) pos++;
          }
          return parseMatrix(env.trim());
        }

        if (name === 'text' || name === 'mathrm' || name === 'mbox' || name === 'textrm') {
          const g = parseGroup();
          const plain = plainText(g);
          return { kind: 'text', text: plain, upright: true };
        }

        if (name === 'mathbf' || name === 'boldsymbol' || name === 'bm') {
          return { kind: 'styled', variant: 'bold', body: parseGroup() };
        }

        if (name === 'mathit' || name === 'operatorname') {
          return { kind: 'styled', variant: 'italic', body: parseGroup() };
        }

        if (name === 'mathbb') {
          const plain = plainText(parseGroup());
          const map = { R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', E: '𝔼', P: 'ℙ' };
          return { kind: 'text', text: plain.replace(/[A-Z]/g, (c) => map[c] || c) };
        }

        if (name === 'left' || name === 'right' || name === 'big' || name === 'Big' || name === 'bigg' || name === 'Bigg') {
          // 定界符命令：把紧跟的定界符符号吃掉
          const d = peek();
          if (d && d.type === 'text') {
            const raw = d.value.trim();
            if (raw && /^[()\[\]|.\\/<>]/.test(raw)) {
              next();
              return { kind: 'text', text: DELIMS[raw] !== undefined ? DELIMS[raw] : raw };
            }
          }
          if (d && d.type === 'command' && (d.value === '{' || d.value === '}' || d.value === 'lVert' || d.value === 'rVert' || d.value === 'vert' || d.value === 'Vert')) {
            next();
            return { kind: 'text', text: SYMBOLS[d.value] || '' };
          }
          return { kind: 'row', children: [] };
        }

        if (name === '\\') {
          // 换行：在行内公式里当作空格
          return { kind: 'row', children: [] };
        }

        if (GREEK[name]) {
          return { kind: 'text', text: GREEK[name], italic: true };
        }

        if (ACCENTS[name]) {
          const body = parseGroup();
          return { kind: 'accent', accent: ACCENTS[name], body };
        }

        if (BIG_OPS[name]) {
          return { kind: 'bigop', text: BIG_OPS[name] };
        }

        if (SYMBOLS[name] !== undefined) {
          return { kind: 'text', text: SYMBOLS[name] };
        }

        // 未识别命令：原样显示命令名，保证不白屏
        return { kind: 'text', text: name };
      }

      return { kind: 'row', children: [] };
    }

    /** 把紧随其后的 ^ / _ 挂到基上。 */
    // 关键设计：脚本参数必须用 parseScriptArg() 解析（只吃一个原子，不再去吃后续的 ^ _），
    // 否则 x_i^2 会被解析成 x_(i^2) —— MathML 语义完全错误（上标作用在下标上）。
    function attachScripts(base) {
      let sup = null;
      let sub = null;
      // 允许 ^ 与 _ 以任意顺序出现，各最多一个
      for (let guard = 0; guard < 2; guard++) {
        const t = peek();
        if (!t) break;
        if (t.type === 'sup' && !sup) {
          next();
          sup = parseScriptArg();
        } else if (t.type === 'sub' && !sub) {
          next();
          sub = parseScriptArg();
        } else break;
      }
      if (!sup && !sub) return base;
      return { kind: 'scripts', base, sup, sub };
    }

    /** 只解析一个"脚本参数"原子：不吞掉后面可能跟着的 ^ 或 _。 */
    function parseScriptArg() {
      const t = peek();
      if (!t) return { kind: 'row', children: [] };
      if (t.type === 'lbrace') {
        next();
        const node = parseRow(true);
        if (peek() && peek().type === 'rbrace') next();
        return node;
      }
      // allowScripts=false：脚本参数只吃一个原子，不吃后面可能跟着的 ^ / _
      return parseAtom(false);
    }

    function isEmptyRow(node) {
      return Boolean(node && node.kind === 'row' && (!node.children || node.children.length === 0));
    }

    function parseRow(stopAtBrace) {
      const children = [];
      while (pos < tokens.length) {
        const t = peek();
        if (stopAtBrace && t.type === 'rbrace') break;
        if (t.type === 'command' && t.value === 'end') break;
        if (t.type === 'command' && t.value === '\\') break;
        if (t.type === 'align') break;
        children.push(parseAtom());
      }
      return { kind: 'row', children };
    }

    const root = parseRow(false);
    return root;
  }

  /** 提取节点里的纯文本（\text{...} 与 plain() 用）。 */
  function plainText(node) {
    if (!node) return '';
    if (node.kind === 'text') return node.text;
    if (node.kind === 'row') return (node.children || []).map(plainText).join('');
    if (node.kind === 'scripts') {
      return plainText(node.base) + (node.sub ? plainText(node.sub) : '') + (node.sup ? plainText(node.sup) : '');
    }
    if (node.kind === 'frac') return `${plainText(node.num)}/${plainText(node.den)}`;
    if (node.kind === 'sqrt') return `√(${plainText(node.body)})`;
    if (node.kind === 'accent') return plainText(node.body) + node.accent;
    if (node.kind === 'styled') return plainText(node.body);
    if (node.kind === 'bigop') return node.text;
    if (node.kind === 'matrix') return node.rows.map((r) => r.map(plainText).join(' ')).join('; ');
    return '';
  }

  // ─────────────────────────────────────────────────────────────
  // Renderer：语法树 → MathML 字符串（关键字符全部转义）
  // ─────────────────────────────────────────────────────────────
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  function mi(text, opts = {}) {
    const variant = opts.upright ? '' : ' mathvariant="italic"';
    return `<mi${variant}>${esc(text)}</mi>`;
  }
  function mn(text) {
    return `<mn>${esc(text)}</mn>`;
  }
  function mo(text, opts = {}) {
    const stretchy = opts.stretchy === false ? ' stretchy="false"' : '';
    const form = opts.form ? ` form="${opts.form}"` : '';
    return `<mo${stretchy}${form}>${esc(text)}</mo>`;
  }
  function mtext(text) {
    return `<mtext>${esc(text)}</mtext>`;
  }
  function row(inner) {
    return inner ? `<mrow>${inner}</mrow>` : '';
  }

  const DIGITS = /^[0-9.,]+$/;
  const IDENT = /^[A-Za-z]+$/;

  function renderNode(node) {
    if (!node) return '';
    switch (node.kind) {
      case 'row':
        return row((node.children || []).map(renderNode).join(''));

      case 'text': {
        const t = node.text;
        if (!t) return '';
        if (DIGITS.test(t)) return mn(t);
        if (IDENT.test(t) && t.length === 1) return mi(t, { upright: node.upright });
        // 短的连续字母（mc、dx、psi）按单字母拆分：
        // MathML 里 <mi> 是"标识符"，多字符时浏览器不做斜体偏移，排版看起来不对。
        if (IDENT.test(t) && t.length <= 4) {
          let short = '';
          for (const ch of t) short += mi(ch, { upright: node.upright });
          return row(short);
        }
        if (IDENT.test(t)) return mi(t);
        // 混合内容：逐字符拆分，字母用 mi、数字用 mn、其余用 mo
        let out = '';
        for (const ch of t) {
          if (/[0-9.]/.test(ch)) out += mn(ch);
          else if (/[A-Za-z]/.test(ch)) out += mi(ch, { upright: node.upright });
          else out += mo(ch === '-' ? '−' : ch);
        }
        return row(out);
      }

      case 'frac':
        return `<mfrac${node.display ? ' displaystyle="true"' : ''}>${renderNode(node.num)}${renderNode(node.den)}</mfrac>`;

      case 'sqrt':
        return node.index
          ? `<mroot>${renderNode(node.body)}${renderNode(node.index)}</mroot>`
          : `<msqrt>${renderNode(node.body)}</msqrt>`;

      case 'scripts': {
        const base = renderNode(node.base);
        // 规范化输出顺序：MathML 要求 msubsup 的子元素顺序是 基 → 下标 → 上标。
        // 若按源码里 ^ _ 的出现顺序输出（两者都合法 LaTeX），浏览器会把上标当成了下标。
        const sub = node.sub ? renderNode(node.sub) : '';
        const sup = node.sup ? renderNode(node.sup) : '';
        if (sub && sup) return `<msubsup>${base}${sub}${sup}</msubsup>`;
        if (sub) return `<msub>${base}${sub}</msub>`;
        if (sup) return `<msup>${base}${sup}</msup>`;
        return base;
      }

      case 'accent':
        return `<mover accent="true">${renderNode(node.body)}${mo(node.accent, { stretchy: false })}</mover>`;

      case 'bigop': {
        // ∑ 之类的上下限由外层 scripts 处理（MathML 会自动把 msubsup 排在算子上下方）
        const isWord = /^[a-z ]+$/.test(node.text) && node.text.length > 1;
        return isWord ? mi(node.text, { upright: true }) : mo(node.text);
      }

      case 'styled':
        return row(`<mstyle mathvariant="${node.variant}">${renderNode(node.body)}</mstyle>`);

      case 'matrix': {
        const rows = (node.rows || [])
          .map((cells) => `<mtr>${cells.map((c) => `<mtd>${renderNode(c)}</mtd>`).join('')}</mtr>`)
          .join('');
        const table = `<mtable>${rows}</mtable>`;
        if (!node.delim) return table;
        const [open, close] = node.delim;
        return row(
          (open ? mo(open, { stretchy: true }) : '') + table + (close ? mo(close, { stretchy: true }) : '')
        );
      }

      default:
        return '';
    }
  }

  /**
   * 渲染 LaTeX 为 MathML。
   * @param {string} latex
   * @param {{display?: boolean}} opts
   * @returns {string} MathML 字符串（已转义，可安全 innerHTML）
   */
  math.toMathML = function toMathML(latex, opts = {}) {
    const src = String(latex || '').trim();
    if (!src) return '';
    const tree = parse(tokenize(src));
    const inner = renderNode(tree);
    const display = opts.display ? ' display="block"' : '';
    // aria-label 让屏幕阅读器与"复制 LaTeX"按钮有可读来源
    return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="${opts.display ? 'block' : 'inline'}"${display} aria-label="${esc(src)}">${inner}</math>`;
  };

  /** 供测试用的纯文本近似（不依赖 DOM）。 */
  math.plain = function plain(latex) {
    try {
      return plainText(parse(tokenize(String(latex || ''))));
    } catch {
      return String(latex || '');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // KaTeX 可选加速路径
  // ─────────────────────────────────────────────────────────────
  let katexPromise = null;

  math.loadKatex = function loadKatex() {
    if (katexPromise) return katexPromise;
    if (!CPL.config.allowCdn || !CPL.prefs.get('enableCdn')) {
      return Promise.reject(new Error('CDN 已禁用'));
    }
    const base = CPL.config.cdn.katex;
    const sri = CPL.config.cdn.katexSRI || {};
    katexPromise = new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = `${base}katex.min.css`;
      css.crossOrigin = 'anonymous';
      // SRI：锁死内容，防止 CDN 被投毒后在前端执行任意公式宏
      if (sri.css) css.integrity = sri.css;
      document.head.append(css);

      const script = document.createElement('script');
      script.src = `${base}katex.min.js`;
      script.crossOrigin = 'anonymous';
      if (sri.js) script.integrity = sri.js;
      script.onload = () => {
        if (window.katex) resolve(window.katex);
        else reject(new Error('katex 未挂载到 window'));
      };
      script.onerror = () => reject(new Error('KaTeX 加载失败'));
      document.head.append(script);
    }).catch((err) => {
      katexPromise = null;
      throw err;
    });
    return katexPromise;
  };

  /** KaTeX 是否已经可用（同步检查）。 */
  math.katexReady = () => Boolean(window.katex && typeof window.katex.renderToString === 'function');

  /** 渲染入口：优先复用已加载的 KaTeX，否则回退 MathML。 */
  math.render = function render(latex, opts = {}) {
    if (math.katexReady()) {
      try {
        return window.katex.renderToString(String(latex), {
          displayMode: Boolean(opts.display),
          throwOnError: false,
          // 安全：不信任输入里的 \htmlClass / \href / \includegraphics 等 HTML 注入指令。
          // trust:false 是 KaTeX 的默认值，这里显式写出来表明这是有意的安全选择。
          trust: false,
          strict: 'ignore',
          output: 'htmlAndMathml',
          maxExpand: 1000,
          maxSize: 200,
          macros: { '\\R': '\\mathbb{R}', '\\N': '\\mathbb{N}', '\\Z': '\\mathbb{Z}' },
        });
      } catch (err) {
        CPL.log('warn', 'KaTeX 渲染失败，回退 MathML', err);
      }
    }
    return math.toMathML(latex, opts);
  };

  /** 如果用户开启了 CDN，就悄悄把 KaTeX 拉起来，失败了也无声（MathML 兜底）。 */
  math.warmKatex = function warmKatex() {
    if (!CPL.config.allowCdn) return;
    math.loadKatex()
      .then(() => CPL.bus.emit('math:katex-ready'))
      .catch(() => {});
  };
})();
