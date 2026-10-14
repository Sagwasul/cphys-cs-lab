/* ============================================================================
 * 00-core.js — 命名空间、配置、事件总线、工具函数
 *
 * 这是整个前端的第一个分片，也是唯一的全局入口。所有其他分片都挂在 CPL 上。
 * 设计原则：无框架、无构建期依赖、可在 file:// 下降级运行。
 * ==========================================================================*/
(function () {
  'use strict';

  const CPL = (window.CPL = window.CPL || {});

  /** 与 manifest.json 的 schema 对应；改动需同步 scripts/lib/manifest.mjs。 */
  CPL.VERSION = '0.1.0';
  CPL.SCHEMA = 1;

  /** 所有 localStorage 键统一前缀，便于"清空本站数据"与版本迁移。 */
  CPL.NS = 'cpl.v1.';

  // ─────────────────────────────────────────────────────────────
  // 配置：优先级 window.CPL_CONFIG > 默认值
  // 注意：这里只放"公开"配置。任何密钥、token、私有上游地址都不允许出现在前端。
  // ─────────────────────────────────────────────────────────────
  const DEFAULTS = {
    // AI 代理地址。留空则 AI 助教进入"离线模式"，只显示本地引导问题库。
    apiBase: '',
    // 站点名与副标题
    siteName: '计算物理 × 计算机科学',
    siteSubtitle: '概念内化 · 工具速查 · 抗遗忘',
    // 允许按需从第三方 CDN 加载可选依赖（Pyodide / KaTeX / CodeMirror）。
    // 关掉它则完全离线（需要把依赖 vendored 到仓库，见 README「离线部署」）。
    allowCdn: true,
    // CDN 基址，便于自托管或换镜像。
    // 版本号经过核实（2026）：
    //   Pyodide 314.0.7 = Python 3.14.2 线，core ≈ 13.5 MB，numpy wheel ≈ 2.9 MB
    //   KaTeX 0.19.0 = 当前稳定版，带 SRI
    //   CodeMirror 6 通过 esm.sh 加载，必须用 import map 钉死所有 @codemirror/* 版本，
    //   否则会出现两份 @codemirror/state 并报 "Unrecognized extension value"。
    cdn: {
      pyodide: 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/',
      pyodideModule: 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs',
      katex: 'https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/',
      katexSRI: {
        css: 'sha384-3rdsX6e5mueWyoweR9NIVmtEsUkokpBT/0ALqKKIBMr9j4qhHkaIkAcGgsE6uVlp',
        js: 'sha384-QFFtAGzvvj+bfgCGxXJlNZZR1nXEZgvG8tDLCCY1F19xl20WlfTYgguB4VcNdxYk',
      },
      esm: 'https://esm.sh/',
    },
    // 可选运行时版本（导入映射用）
    versions: {
      codemirror: '6.0.2',
      langPython: '6.2.1',
      langCpp: '6.0.3',
      legacyModes: '6.5.5',
    },
    // 单次代码执行超时（毫秒）。超时后强杀 Worker，防死循环冻结页面。
    runTimeoutMs: 12000,
    // AI 请求的前端侧限制（服务端还有一道独立的、更严格的限制）
    ai: {
      maxInputChars: 4000,
      maxMessages: 12,
      maxChars: 12000,
      maxCodeChars: 8000,
      maxOutputTokens: 1200,
      stream: true,
      // 前端每分钟最多发起多少次请求（软限制，真正的限流在服务端）
      softRatePerMin: 12,
    },
    // 版本号展示用
    repoUrl: '',
  };

  function mergeConfig(base, override) {
    if (!override || typeof override !== 'object') return base;
    const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    for (const key of Object.keys(override)) {
      const b = base[key];
      const o = override[key];
      if (b && o && typeof b === 'object' && typeof o === 'object' && !Array.isArray(b)) {
        out[key] = mergeConfig(b, o);
      } else if (o !== undefined && o !== null) {
        out[key] = o;
      }
    }
    return out;
  }

  CPL.config = mergeConfig(DEFAULTS, window.CPL_CONFIG || {});
  CPL.defaults = DEFAULTS;

  /** AI 是否可用（前端只判断有没有配代理地址，不涉及任何密钥）。 */
  CPL.aiEnabled = () => Boolean(CPL.config.apiBase);

  // ─────────────────────────────────────────────────────────────
  // 事件总线：分片之间解耦通信
  // ─────────────────────────────────────────────────────────────
  const listeners = new Map();

  CPL.bus = {
    on(event, fn) {
      if (typeof fn !== 'function') return () => {};
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
      return () => CPL.bus.off(event, fn);
    },
    off(event, fn) {
      const set = listeners.get(event);
      if (set) set.delete(fn);
    },
    /** 单个订阅者抛错不影响其他订阅者。 */
    emit(event, payload) {
      const set = listeners.get(event);
      if (!set) return;
      for (const fn of Array.from(set)) {
        try {
          fn(payload);
        } catch (err) {
          CPL.log('error', `[bus:${event}]`, err);
        }
      }
    },
  };

  // ─────────────────────────────────────────────────────────────
  // 日志：默认只在 console 输出，绝不把内容发往任何远端
  // ─────────────────────────────────────────────────────────────
  const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 99 };
  let logLevel = LEVELS.info;
  const logHistory = [];

  CPL.log = function log(level, ...args) {
    const entry = { t: Date.now(), level, args };
    logHistory.push(entry);
    if (logHistory.length > 200) logHistory.shift();
    if ((LEVELS[level] || 20) < logLevel) return;
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn.call(console, `[CPL:${level}]`, ...args);
  };
  CPL.setLogLevel = (name) => {
    if (LEVELS[name] !== undefined) logLevel = LEVELS[name];
  };
  CPL.logHistory = () => logHistory.slice();

  // ─────────────────────────────────────────────────────────────
  // 通用工具
  // ─────────────────────────────────────────────────────────────
  const util = (CPL.util = {});

  util.clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

  util.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /** 去抖 */
  util.debounce = (fn, ms = 200) => {
    let timer = null;
    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  /** 节流（首帧立即执行） */
  util.throttle = (fn, ms = 100) => {
    let last = 0;
    let timer = null;
    return function throttled(...args) {
      const now = Date.now();
      const wait = ms - (now - last);
      if (wait <= 0) {
        last = now;
        fn.apply(this, args);
      } else if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          last = Date.now();
          fn.apply(this, args);
        }, wait);
      }
    };
  };

  /** 稳定字符串哈希（FNV-1a），与构建脚本保持一致，用于内容指纹。 */
  util.hash = (text) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  };

  util.uid = (prefix = 'id') =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  /** 带单位的数字格式化，用于把 10^6 级别的量级写成人能读的形式。 */
  util.fmtNum = (n, digits = 3) => {
    if (!Number.isFinite(n)) return String(n);
    const abs = Math.abs(n);
    if (abs === 0) return '0';
    // 先判科学计数法区间，再判千分位——顺序反了会让 1e6 落到 toLocaleString 分支
    if (abs >= 1e6 || abs < 1e-4) return n.toExponential(digits - 1).replace('e', '×10^');
    if (abs >= 1e5) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return Number(n.toPrecision(digits)).toString();
  };

  util.bytes = (n) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
  };

  util.seconds = (ms) => (ms < 1000 ? `${ms.toFixed(0)} ms` : `${(ms / 1000).toFixed(2)} s`);

  /** 深拷贝（仅处理 JSON 可表达的数据；跨分片传内容对象足够用）。 */
  util.clone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (typeof structuredClone === 'function') {
      try {
        return structuredClone(obj);
      } catch {
        /* 含函数时退化到浅拷贝路径 */
      }
    }
    if (Array.isArray(obj)) return obj.map(util.clone);
    const out = {};
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      out[k] = typeof v === 'function' ? v : util.clone(v);
    }
    return out;
  };

  /** 占位符替换：{name} → params.name */
  util.template = (str, params = {}) =>
    String(str).replace(/\{(\w+)\}/g, (m, key) => (params[key] === undefined ? m : String(params[key])));

  /** 数组按 key 分组 */
  util.groupBy = (arr, keyFn) => {
    const out = new Map();
    for (const item of arr) {
      const k = keyFn(item);
      if (!out.has(k)) out.set(k, []);
      out.get(k).push(item);
    }
    return out;
  };

  /** 线性回归斜率（用于 log-log 图上自动拟合收敛阶）。 */
  util.slope = (xs, ys) => {
    const n = Math.min(xs.length, ys.length);
    if (n < 2) return NaN;
    let sx = 0;
    let sy = 0;
    let sxx = 0;
    let sxy = 0;
    for (let i = 0; i < n; i++) {
      sx += xs[i];
      sy += ys[i];
      sxx += xs[i] * xs[i];
      sxy += xs[i] * ys[i];
    }
    const denom = n * sxx - sx * sx;
    if (Math.abs(denom) < 1e-30) return NaN;
    return (n * sxy - sx * sy) / denom;
  };

  /** 皮尔逊相关系数，用来判断拟合是否可信。 */
  util.pearson = (xs, ys) => {
    const n = Math.min(xs.length, ys.length);
    if (n < 2) return NaN;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let dx = 0;
    let dy = 0;
    for (let i = 0; i < n; i++) {
      const a = xs[i] - mx;
      const b = ys[i] - my;
      num += a * b;
      dx += a * a;
      dy += b * b;
    }
    const den = Math.sqrt(dx * dy);
    return den < 1e-30 ? NaN : num / den;
  };

  /** 防 unhandled rejection 静默失败：统一上报到日志与事件总线。 */
  CPL.guard = (label, fn) => {
    try {
      const r = fn();
      if (r && typeof r.then === 'function') {
        return r.catch((err) => {
          CPL.log('error', `[${label}]`, err);
          CPL.bus.emit('app:error', { label, error: err });
          return undefined;
        });
      }
      return r;
    } catch (err) {
      CPL.log('error', `[${label}]`, err);
      CPL.bus.emit('app:error', { label, error: err });
      return undefined;
    }
  };

  window.addEventListener('unhandledrejection', (e) => {
    CPL.log('error', '[unhandledrejection]', e.reason);
    CPL.bus.emit('app:error', { label: 'unhandledrejection', error: e.reason });
  });
  window.addEventListener('error', (e) => {
    // 资源加载失败没有 error 对象，只有 target
    if (e.target && e.target !== window && e.target.tagName) {
      CPL.log('warn', '[resource]', e.target.tagName, e.target.src || e.target.href);
      return;
    }
    CPL.log('error', '[window.onerror]', e.message);
  });

  CPL.ready = false;

  // ─────────────────────────────────────────────────────────────
  // 路由注册表的"占位"
  //
  // 分片按文件名顺序加载，而视图分片（35-assessment / 40-lesson / 90-user-content）
  // 都排在 95-nav.js 之前。为了让它们能在加载期就调用 CPL.nav.register(...)，
  // 这里先建一个极小的桩：register 把渲染函数收进 views，go/render 等真正实现
  // 由 95-nav.js 挂上并接管（见该文件开头的说明）。
  // ─────────────────────────────────────────────────────────────
  const navStub = (CPL.nav = CPL.nav || {});
  navStub.views = navStub.views || {};
  if (!navStub.register) {
    navStub.register = function register(name, fn) {
      navStub.views[name] = fn;
    };
  }
  if (!navStub.go) {
    navStub.go = function go(name, param) {
      location.hash = `#/${name}${param ? '/' + param : ''}`;
    };
  }
})();
