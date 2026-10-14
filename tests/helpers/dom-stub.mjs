// tests/helpers/dom-stub.mjs
//
// 一个极小的 DOM / 浏览器 API 桩，用于在 Node 里加载 pieces/*.js 并测试其中的纯逻辑。
//
// 为什么需要它：
//   本项目的分片是浏览器经典脚本（不是 ESM），依赖 window/document/localStorage。
//   为了在没有浏览器的情况下做单元测试（CI 里也要跑），这里实现最小可用的替身。
//   **它不是给生产用的，也不是完整的 DOM 实现**：只覆盖分片在加载期与纯函数路径上
//   真正会碰到的 API。任何依赖真实布局/渲染的行为都不在这里测。

class ClassList {
  constructor(el) {
    this.el = el;
  }
  _list() {
    return String(this.el.className || '')
      .split(/\s+/)
      .filter(Boolean);
  }
  _write(list) {
    this.el.className = list.join(' ');
  }
  add(...names) {
    const l = this._list();
    for (const n of names) if (!l.includes(n)) l.push(n);
    this._write(l);
  }
  remove(...names) {
    this._write(this._list().filter((c) => !names.includes(c)));
  }
  contains(name) {
    return this._list().includes(name);
  }
  toggle(name, force) {
    const has = this.contains(name);
    const want = force === undefined ? !has : Boolean(force);
    if (want && !has) this.add(name);
    if (!want && has) this.remove(name);
    return want;
  }
}

class StubElement {
  constructor(tagName = 'div') {
    this.tagName = String(tagName).toUpperCase();
    this.nodeType = 1;
    this.children = [];
    this.childNodes = this.children;
    this.parentElement = null;
    this.attributes = new Map();
    this.dataset = {};
    this.style = new Proxy({}, { set: (t, k, v) => ((t[k] = v), true), get: (t, k) => t[k] || '' });
    this.classList = new ClassList(this);
    this.className = '';
    this.textContent = '';
    this.value = '';
    this.checked = false;
    this.disabled = false;
    this.hidden = false;
    this.files = null;
    this.ownerDocument = null;
    this._listeners = new Map();
    this._html = '';
  }

  get innerHTML() {
    return this._html;
  }
  set innerHTML(v) {
    this._html = String(v);
  }

  get firstChild() {
    return this.children[0] || null;
  }

  get offsetParent() {
    return null;
  }

  append(...nodes) {
    for (const n of nodes) {
      if (n === null || n === undefined) continue;
      if (typeof n === 'string') {
        const t = new StubElement('#text');
        t.textContent = n;
        t.nodeType = 3;
        t.parentElement = this;
        this.children.push(t);
      } else {
        n.parentElement = this;
        this.children.push(n);
      }
    }
  }

  appendChild(n) {
    this.append(n);
    return n;
  }

  prepend(...nodes) {
    this.children.unshift(...nodes);
  }

  removeChild(n) {
    const i = this.children.indexOf(n);
    if (i >= 0) this.children.splice(i, 1);
    n.parentElement = null;
    return n;
  }

  remove() {
    if (this.parentElement) this.parentElement.removeChild(this);
  }

  contains(n) {
    if (n === this) return true;
    return this.children.some((c) => c.contains && c.contains(n));
  }

  setAttribute(k, v) {
    this.attributes.set(k, String(v));
    if (k === 'class') this.className = String(v);
    if (k.startsWith('data-')) this.dataset[k.slice(5).replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = String(v);
  }
  getAttribute(k) {
    return this.attributes.has(k) ? this.attributes.get(k) : null;
  }
  removeAttribute(k) {
    this.attributes.delete(k);
  }
  hasAttribute(k) {
    return this.attributes.has(k);
  }

  addEventListener(type, fn) {
    if (!this._listeners.has(type)) this._listeners.set(type, new Set());
    this._listeners.get(type).add(fn);
  }
  removeEventListener(type, fn) {
    const s = this._listeners.get(type);
    if (s) s.delete(fn);
  }
  dispatchEvent(event) {
    const s = this._listeners.get(event.type);
    if (s) for (const fn of Array.from(s)) fn(Object.assign({ target: this, preventDefault() {}, stopPropagation() {} }, event));
    return true;
  }

  focus() {}
  blur() {}
  select() {}
  click() {
    this.dispatchEvent({ type: 'click' });
  }

  querySelector(sel) {
    return this.querySelectorAll(sel)[0] || null;
  }
  querySelectorAll(sel) {
    const out = [];
    const classes = String(sel)
      .split(',')
      .map((s) => s.trim().replace(/^\./, ''))
      .filter((s) => /^[\w-]+$/.test(s));
    const walk = (node) => {
      for (const c of node.children) {
        if (c.nodeType === 1 && classes.some((cl) => c.classList.contains(cl))) out.push(c);
        if (c.children) walk(c);
      }
    };
    walk(this);
    return out;
  }

  closest(sel) {
    const cls = String(sel).replace(/^\./, '');
    let node = this;
    while (node) {
      if (node.classList && node.classList.contains(cls)) return node;
      node = node.parentElement;
    }
    return null;
  }

  getBoundingClientRect() {
    return { width: 800, height: 320, top: 0, left: 0, right: 800, bottom: 320, x: 0, y: 0 };
  }

  getContext() {
    // 画布上下文桩：所有绘图调用都变成空操作，只记录调用次数
    const noop = () => {};
    return new Proxy(
      { canvas: this, setTransform: noop, clearRect: noop, fillRect: noop, fillText: noop, measureText: () => ({ width: 10 }), beginPath: noop, arc: noop, fill: noop, stroke: noop, moveTo: noop, lineTo: noop, save: noop, restore: noop, translate: noop, rotate: noop, setLineDash: noop },
      { get: (t, k) => (k in t ? t[k] : noop), set: (t, k, v) => ((t[k] = v), true) }
    );
  }

  scrollIntoView() {}
  scrollTo() {}
}

class StubDocument extends StubElement {
  constructor() {
    super('#document');
    this.readyState = 'complete';
    this.head = new StubElement('head');
    this.body = new StubElement('body');
    this.append(this.head, this.body);
    this.documentElement = new StubElement('html');
    this.documentElement.dataset = {};
    this.documentElement.style = new Proxy({ setProperty() {} }, { get: () => () => {} });
    this.activeElement = null;
    this.title = 'test';
  }

  createElement(tag) {
    const el = new StubElement(tag);
    el.ownerDocument = this;
    return el;
  }
  createElementNS(_ns, tag) {
    return this.createElement(tag);
  }
  createTextNode(text) {
    const t = new StubElement('#text');
    t.nodeType = 3;
    t.textContent = String(text);
    return t;
  }
  getElementById(id) {
    let found = null;
    const walk = (n) => {
      if (found) return;
      if (n.attributes && n.attributes.get('id') === id) found = n;
      for (const c of n.children || []) walk(c);
    };
    walk(this.body);
    walk(this.head);
    return found;
  }
  execCommand() {
    return true;
  }
}

export function makeWindow() {
  const document = new StubDocument();

  const storage = new Map();
  const localStorage = {
    get length() {
      return storage.size;
    },
    key: (i) => Array.from(storage.keys())[i] ?? null,
    getItem: (k) => (storage.has(String(k)) ? storage.get(String(k)) : null),
    setItem: (k, v) => void storage.set(String(k), String(v)),
    removeItem: (k) => void storage.delete(String(k)),
    clear: () => storage.clear(),
    _dump: () => Object.fromEntries(storage),
  };

  const win = {
    // 分片里用 `x instanceof Node` 判断是否为 DOM 节点，所以必须提供这两个构造器
    Node: StubElement,
    Element: StubElement,
    HTMLElement: StubElement,
    HTMLCanvasElement: StubElement,
    document,
    localStorage,
    sessionStorage: localStorage,
    devicePixelRatio: 1,
    innerWidth: 1280,
    innerHeight: 800,
    isSecureContext: true,
    location: { href: 'https://example.github.io/repo/', pathname: '/repo/', hash: '', origin: 'https://example.github.io' },
    navigator: { userAgent: 'node', clipboard: null, storage: null },
    matchMedia: (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: (fn) => setTimeout(() => fn(Date.now()), 0),
    cancelAnimationFrame: clearTimeout,
    requestIdleCallback: (fn) => setTimeout(() => fn({ didTimeout: false, timeRemaining: () => 5 }), 0),
    cancelIdleCallback: clearTimeout,
    performance: { now: () => Number(process.hrtime.bigint() / 1000000n) },
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    scrollTo: () => {},
    scrollBy: () => {},
    // 分片里用 `x instanceof Node` 判断节点，因此这两个构造器必须在全局可见
    Node: StubElement,
    Element: StubElement,
    HTMLElement: StubElement,
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return true;
    },
    confirm: () => true,
    alert: () => {},
    prompt: () => null,
    indexedDB: undefined, // 让分片走 localStorage 降级路径
    Worker: undefined,
    WebAssembly: undefined,
    Blob: class {
      constructor(parts) {
        this.parts = parts;
      }
    },
    URL: Object.assign(function URL(u) {
      this.href = String(u);
    }, { createObjectURL: () => 'blob:stub', revokeObjectURL: () => {} }),
    fetch: () => Promise.reject(new Error('fetch 在测试桩里不可用')),
    AbortController: globalThis.AbortController,
    TextDecoder: globalThis.TextDecoder,
    Response: globalThis.Response,
    structuredClone: globalThis.structuredClone,
    console,
    JSON,
    Math,
    Date,
    Promise,
    Set,
    Map,
    Array,
    Object,
    Number,
    String,
    Boolean,
    RegExp,
    Error,
    TypeError,
    RangeError,
    isNaN,
    parseInt,
    parseFloat,
    encodeURIComponent,
    decodeURIComponent,
  };
  win.window = win;
  win.self = win;
  win.globalThis = win;
  win.document.defaultView = win;
  win.top = win;
  win.parent = win;
  return win;
}

/**
 * 在隔离的 vm 上下文里加载分片，返回该上下文的 window（上面挂着 CPL 等全局）。
 * @param {string} contextGlobalName
 * @param {string[]} files 绝对路径列表，按顺序执行
 */
export async function loadPieces(files) {
  const vm = await import('node:vm');
  const fs = await import('node:fs');
  const win = makeWindow();
  const context = vm.createContext(win);
  const errors = [];
  const loaded = [];

  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    try {
      // 分片是经典脚本，用 vm 直接跑
      new vm.Script(code, { filename: file }).runInContext(context, { timeout: 10000 });
      loaded.push(file);
    } catch (err) {
      errors.push({ file, message: err.message });
    }
  }
  return { win, loaded, errors, context };
}
