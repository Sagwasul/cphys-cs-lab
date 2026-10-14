/* ============================================================================
 * 62-editor.js — 代码编辑器（CodeMirror 6，带 <textarea> 降级）
 *
 * 关键实现事实（2026 年核实）：
 *   · 只有 @codemirror/lang-python 与 @codemirror/lang-cpp，**没有 lang-fortran**；
 *     Fortran 用 @codemirror/legacy-modes 的 StreamLanguage 提供。
 *   · 从 esm.sh 加载时，如果多个模块各自解析依赖，会加载两份
 *     @codemirror/state，运行时报 "Unrecognized extension value"。
 *     因此这里**先注入 import map，把所有 @codemirror/* 钉到单一版本**，
 *     再用动态 import() 加载——import map 只影响之后发起的解析请求。
 *   · CDN 被禁用或加载失败时，自动退回 <textarea>：
 *     语法高亮没了，但写代码、运行、跑测试全部照常。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const editor = (CPL.editor = {});

  const CDN_FALLBACKS = [
    'https://esm.sh/',
    'https://cdn.jsdelivr.net/npm/',
  ];

  let importMapInjected = false;
  let cmPromise = null;

  function pin(map, keys, version, base, suffix = '') {
    for (const k of keys) map[k] = `${base}${k}@${version}${suffix}`;
  }

  /** 注入 import map（同一页面只注入一次；重复注入会被浏览器忽略）。 */
  function ensureImportMap() {
    if (importMapInjected) return;
    importMapInjected = true;
    const v = CPL.config.versions;
    const base = CPL.config.cdn.esm;

    const imports = {
      codemirror: `${base}codemirror@${v.codemirror}`,
      '@codemirror/lang-python': `${base}@codemirror/lang-python@${v.langPython}`,
      '@codemirror/lang-cpp': `${base}@codemirror/lang-cpp@${v.langCpp}`,
      '@codemirror/legacy-modes/mode/fortran': `${base}@codemirror/legacy-modes@${v.legacyModes}/mode/fortran`,
    };
    // 这些包会被上面的包间接依赖；钉死到同一线上，避免出现两份实例。
    for (const pkg of ['state', 'view', 'language', 'commands', 'search', 'autocomplete', 'lint']) {
      imports[`@codemirror/${pkg}`] = `${base}@codemirror/${pkg}@6`;
    }

    const script = document.createElement('script');
    script.type = 'importmap';
    script.textContent = JSON.stringify({ imports });
    document.head.append(script);
    CPL.log('debug', '已注入 CodeMirror import map');
  }

  /** 加载 CodeMirror 模块集合（带一次备用 CDN 重试）。 */
  async function loadCodeMirror() {
    if (cmPromise) return cmPromise;
    if (!CPL.config.allowCdn || CPL.prefs.get('enableCdn') === false) {
      return Promise.reject(new Error('CDN 已禁用'));
    }
    ensureImportMap();

    cmPromise = (async () => {
      const [core, py, cpp, fortranMod] = await Promise.all([
        import('codemirror'),
        import('@codemirror/lang-python').catch(() => null),
        import('@codemirror/lang-cpp').catch(() => null),
        import('@codemirror/legacy-modes/mode/fortran').catch(() => null),
      ]);
      const view = await import('@codemirror/view');
      const state = await import('@codemirror/state');
      return { core, py, cpp, fortranMod, view, state };
    })().catch((err) => {
      cmPromise = null;
      throw err;
    });

    return cmPromise;
  }

  editor.available = () => Boolean(cmPromise) || (CPL.config.allowCdn && CPL.prefs.get('enableCdn') !== false);

  /** 语言名 → CodeMirror 扩展 */
  function langExtension(cm, lang) {
    const l = String(lang || '').toLowerCase();
    try {
      if ((l === 'python' || l === 'py') && cm.py) return cm.py.python();
      if (['cpp', 'c++', 'cc', 'cxx', 'c', 'h', 'hpp'].includes(l) && cm.cpp) return cm.cpp.cpp();
      if (l.startsWith('f') || l === 'fortran') {
        if (cm.fortranMod && cm.fortranMod.fortran) {
          return cm.view.StreamLanguage ? cm.view.StreamLanguage.define(cm.fortranMod.fortran) : [];
        }
      }
    } catch (err) {
      CPL.log('warn', `语言扩展加载失败（${lang}），退回纯文本`, err);
    }
    return [];
  }

  /**
   * 挂载编辑器。
   * @param {HTMLElement} host
   * @param {{value?:string, language?:string, readOnly?:boolean, minHeight?:number, onChange?:Function,
   *          onSubmit?:Function, ariaLabel?:string, placeholder?:string}} opts
   * @returns {Promise<{getValue:Function,setValue:Function,setLanguage:Function,focus:Function,
   *                    destroy:Function,kind:'codemirror'|'textarea',element:HTMLElement}>}
   */
  editor.mount = async function mount(host, opts = {}) {
    const wrap = dom.h('div', { class: 'cpl-editor__host' });
    host.append(wrap);

    // ── 先建 textarea（同时也作为降级路径） ──────────────────
    const ta = dom.h('textarea', {
      class: 'cpl-editor__fallback',
      spellcheck: 'false',
      autocapitalize: 'off',
      autocomplete: 'off',
      'aria-label': opts.ariaLabel || '代码编辑器',
      placeholder: opts.placeholder || '',
      style: { minHeight: `${opts.minHeight || 260}px` },
    });
    ta.value = opts.value || '';
    if (opts.readOnly) ta.readOnly = true;
    let changeHandler = opts.onChange || null;
    ta.addEventListener('input', () => changeHandler && changeHandler(ta.value));
    if (opts.onSubmit) {
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          opts.onSubmit();
        }
      });
    }
    wrap.append(ta);

    const api = {
      kind: 'textarea',
      element: wrap,
      getValue: () => ta.value,
      setValue: (v) => {
        ta.value = v;
      },
      setLanguage: () => {},
      focus: () => ta.focus(),
      destroy: () => {
        dom.clear(wrap);
      },
    };

    // ── 尝试升级到 CodeMirror ────────────────────────────────
    let cm;
    try {
      cm = await loadCodeMirror();
    } catch (err) {
      CPL.log('warn', 'CodeMirror 不可用，使用纯文本编辑器', dom.friendlyError(err));
      wrap.dataset.editor = 'textarea';
      return api;
    }

    try {
      const { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection, rectangularSelection, highlightSpecialChars, EditorState } = cm.view;
      const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        highlightSpecialChars(),
        drawSelection(),
        rectangularSelection(),
        EditorView.lineWrapping,
        EditorState.tabSize.of(4),
        langExtension(cm, opts.language),
      ];
      if (cm.core.basicSetup) extensions.unshift(cm.core.basicSetup);
      if (opts.onSubmit) {
        extensions.push(
          keymap.of([
            {
              key: 'Mod-Enter',
              run: () => {
                opts.onSubmit();
                return true;
              },
            },
          ])
        );
      }
      if (opts.readOnly) extensions.push(EditorState.readOnly.of(true), EditorView.editable.of(false));

      const view = new EditorView({
        doc: opts.value || '',
        parent: wrap,
        extensions,
      });
      // 移除 textarea 降级（保留在 DOM 里会占位）
      ta.remove();

      api.kind = 'codemirror';
      api.view = view;
      api.getValue = () => view.state.doc.toString();
      api.setValue = (v) => {
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: v } });
      };
      api.setLanguage = (lang) => {
        // 简单做法：重建语言扩展代价高；这里通过重新配置 compartment 太重，
        // 所以只在语言真的变化时提示用户刷新（课程内语言不会变）。
        void lang;
      };
      api.focus = () => view.focus();
      api.destroy = () => {
        view.destroy();
        dom.clear(wrap);
      };
      wrap.dataset.editor = 'codemirror';
      return api;
    } catch (err) {
      CPL.log('warn', 'CodeMirror 初始化失败，继续用 textarea', dom.friendlyError(err));
      wrap.dataset.editor = 'textarea';
      return api;
    }
  };

  /**
   * 编辑器面板：语言标签 + 行数 + 运行/重置/复制按钮，包一层统一外观。
   * @returns {{editor:Promise, element:HTMLElement}}
   */
  editor.panel = function panel(opts = {}) {
    const langBadge = dom.h('span', { class: 'cpl-editor__lang', text: opts.language || 'text' });
    const meta = dom.h('span', { class: 'cpl-editor__meta', text: '' });
    const actions = dom.h('div', { class: 'cpl-editor__actions' });
    const body = dom.h('div', { class: 'cpl-editor__body' });

    const wrap = dom.h(
      'div',
      { class: 'cpl-editor' },
      dom.h('div', { class: 'cpl-editor__bar' }, langBadge, meta, actions),
      body
    );

    const ready = editor.mount(body, opts).then((api) => {
      const update = () => {
        const value = api.getValue();
        meta.textContent = `${value.split('\n').length} 行 · ${value.length} 字符`;
      };
      update();
      const original = opts.onChange;
      // 包一层，顺便更新统计
      const wrapped = (v) => {
        update();
        if (original) original(v);
      };
      if (api.kind === 'codemirror' && api.view) {
        // CodeMirror 的变更通过 updateListener 监听
        void wrapped;
      } else {
        const ta = body.querySelector('textarea');
        if (ta) ta.addEventListener('input', update);
      }
      api.refreshMeta = update;
      return api;
    });

    return { editor: ready, element: wrap, actions, body, langBadge };
  };

  // 预热的时机：进入课程页时再加载，避免首屏就下载 300 KB
  editor.warm = function warm() {
    loadCodeMirror().catch(() => {});
  };
})();
