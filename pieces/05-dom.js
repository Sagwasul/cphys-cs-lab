/* ============================================================================
 * 05-dom.js — DOM 构造与安全渲染工具
 *
 * 安全前提：全站任何"来自内容 / 用户 / AI"的文本都必须经过 esc() 或
 * text() 注入，绝不允许直接 innerHTML 拼接未转义字符串。
 * markdown 渲染器（20-markdown.js）已经统一转义，这里是最后一道闸门。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const util = (CPL.util = CPL.util || {});
  const dom = (CPL.dom = {});

  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** 转义为 HTML 文本安全形式。所有不可信字符串都要过这一关。 */
  dom.esc = (s) =>
    String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

  /** 转义为 HTML 属性值安全形式（比 esc 更严格，额外拦掉控制字符）。 */
  dom.escAttr = (s) =>
    dom
      .esc(s)
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001f\u007f]/g, (c) => '&#' + c.charCodeAt(0) + ';');

  /** URL 白名单：只允许 http/https/mailto/锚点/相对路径，拦掉 javascript: 与 data: */
  dom.safeUrl = (url) => {
    const raw = String(url || '').trim();
    if (!raw) return '';
    // 先去掉可能绕过检测的空白与换行
    const normalized = raw.replace(/[\u0000-\u0020]/g, '').toLowerCase();
    if (/^(javascript|vbscript|file):/.test(normalized)) return '';
    if (/^data:/.test(normalized)) {
      // 只允许图片类 data URI
      return /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/.test(normalized) ? raw : '';
    }
    return raw;
  };

  /** 创建元素：h('div', {class:'x'}, '文本', childEl) */
  dom.h = (tag, attrs, ...children) => {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (value === null || value === undefined || value === false) continue;
        if (key === 'class' || key === 'className') {
          el.className = Array.isArray(value) ? value.filter(Boolean).join(' ') : String(value);
        } else if (key === 'text') {
          el.textContent = String(value);
        } else if (key === 'html') {
          // 仅供本文件内部与已验证的白名单渲染器使用
          el.innerHTML = String(value);
        } else if (key === 'dataset') {
          Object.assign(el.dataset, value);
        } else if (key === 'style' && typeof value === 'object') {
          Object.assign(el.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === 'value' && (tag === 'input' || tag === 'textarea' || tag === 'select')) {
          el.value = String(value);
        } else if (value === true) {
          el.setAttribute(key, '');
        } else {
          el.setAttribute(key, String(value));
        }
      }
    }
    for (const child of children.flat(Infinity)) {
      if (child === null || child === undefined || child === false) continue;
      el.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
  };

  /** SVG 元素（需命名空间） */
  dom.svg = (tag, attrs, ...children) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (value === null || value === undefined || value === false) continue;
        if (key.startsWith('on') && typeof value === 'function') {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
          el.setAttribute(key, String(value));
        }
      }
    }
    for (const child of children.flat(Infinity)) {
      if (child === null || child === undefined || child === false) continue;
      el.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
  };

  dom.clear = (el) => {
    while (el && el.firstChild) el.removeChild(el.firstChild);
    return el;
  };

  dom.qs = (sel, root = document) => root.querySelector(sel);
  dom.qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** 一次性事件监听，返回取消函数。 */
  dom.on = (target, event, handler, options) => {
    target.addEventListener(event, handler, options);
    return () => target.removeEventListener(event, handler, options);
  };

  /** 事件委托：只在容器上挂一个监听。 */
  dom.delegate = (root, event, selector, handler) => {
    const wrapped = (e) => {
      const match = e.target instanceof Element ? e.target.closest(selector) : null;
      if (match && root.contains(match)) handler(e, match);
    };
    root.addEventListener(event, wrapped);
    return () => root.removeEventListener(event, wrapped);
  };

  /** 等待 DOM 就绪 */
  dom.ready = () =>
    new Promise((resolve) => {
      if (document.readyState !== 'loading') resolve();
      else document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
    });

  // ─────────────────────────────────────────────────────────────
  // 通知条（toast）
  // ─────────────────────────────────────────────────────────────
  let toastHost = null;

  function ensureToastHost() {
    if (toastHost && document.body.contains(toastHost)) return toastHost;
    toastHost = dom.h('div', {
      class: 'cpl-toasts',
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'false',
    });
    document.body.append(toastHost);
    return toastHost;
  }

  /**
   * @param {string} message
   * @param {{kind?:'info'|'ok'|'warn'|'error', ms?:number, action?:{label:string,onClick:Function}}} opts
   */
  dom.toast = (message, opts = {}) => {
    const host = ensureToastHost();
    const kind = opts.kind || 'info';
    const node = dom.h(
      'div',
      { class: `cpl-toast cpl-toast--${kind}` },
      dom.h('span', { class: 'cpl-toast__msg', text: message })
    );
    if (opts.action && typeof opts.action.onClick === 'function') {
      node.append(
        dom.h('button', {
          class: 'cpl-toast__action',
          type: 'button',
          text: opts.action.label,
          onclick: () => {
            opts.action.onClick();
            node.remove();
          },
        })
      );
    }
    const close = dom.h('button', {
      class: 'cpl-toast__close',
      type: 'button',
      'aria-label': '关闭通知',
      text: '×',
      onclick: () => node.remove(),
    });
    node.append(close);
    host.append(node);
    const ms = opts.ms === undefined ? (kind === 'error' ? 9000 : 4200) : opts.ms;
    if (ms > 0) setTimeout(() => node.remove(), ms);
    return node;
  };

  /** 统一的加载骨架 */
  dom.spinner = (label = '加载中…') =>
    dom.h(
      'div',
      { class: 'cpl-spinner', role: 'status', 'aria-live': 'polite' },
      dom.h('span', { class: 'cpl-spinner__dot' }),
      dom.h('span', { class: 'cpl-spinner__dot' }),
      dom.h('span', { class: 'cpl-spinner__dot' }),
      dom.h('span', { class: 'cpl-spinner__label', text: label })
    );

  /** 错误卡片：统一错误展示，永不显示堆栈或内部路径。 */
  dom.errorCard = (title, detail, hints = []) =>
    dom.h(
      'div',
      { class: 'cpl-error-card', role: 'alert' },
      dom.h('h3', { class: 'cpl-error-card__title', text: title }),
      detail ? dom.h('p', { class: 'cpl-error-card__detail', text: detail }) : null,
      hints.length
        ? dom.h(
            'ul',
            { class: 'cpl-error-card__hints' },
            hints.map((h) => dom.h('li', { text: h }))
          )
        : null
    );

  /** 把任意错误对象压成"可展示、不泄露内部信息"的一句话。 */
  dom.friendlyError = (err) => {
    if (!err) return '发生未知错误';
    const msg = typeof err === 'string' ? err : err.message || String(err);
    // 剥离可能的绝对路径与堆栈行
    return msg
      .split('\n')[0]
      .replace(/(?:\/[\w.\-]+){3,}/g, '<路径已隐藏>')
      .slice(0, 300);
  };

  // ─────────────────────────────────────────────────────────────
  // 无障碍与键盘
  // ─────────────────────────────────────────────────────────────
  /** 焦点陷阱：用于移动端抽屉与模态框。 */
  dom.trapFocus = (container) => {
    const SELECTOR =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const items = Array.from(container.querySelectorAll(SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', onKey);
    return () => container.removeEventListener('keydown', onKey);
  };

  dom.copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // 非安全上下文（如 file://）退化为 execCommand
      const ta = dom.h('textarea', { style: { position: 'fixed', opacity: '0' } });
      ta.value = text;
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (err) {
      util.hash; // 保持 util 引用，避免打包器误删
      CPL.log('warn', '复制失败', err);
      return false;
    }
  };

  dom.download = (filename, content, mime = 'application/json') => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = dom.h('a', { href: url, download: filename });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  /** 读取用户选择的文件（导入用）。限制大小，避免一次性把内存吃满。 */
  dom.pickFile = (accept = '.json,application/json', maxBytes = 8 * 1024 * 1024) =>
    new Promise((resolve, reject) => {
      const input = dom.h('input', { type: 'file', accept, style: { display: 'none' } });
      document.body.append(input);
      input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        input.remove();
        if (!file) return resolve(null);
        if (file.size > maxBytes) {
          return reject(new Error(`文件过大（${util.bytes(file.size)}），上限 ${util.bytes(maxBytes)}`));
        }
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, text: String(reader.result || '') });
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsText(file, 'utf-8');
        return undefined;
      });
      input.click();
    });
})();
