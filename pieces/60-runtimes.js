/* ============================================================================
 * 60-runtimes.js — 浏览器内代码执行与静态检查
 *
 * 事实基础（2026 年核实，见 README「运行时能力与限制」）：
 *   · Python：**完整可用**。Pyodide 314.0.7（CPython 3.14.2 → WASM）。
 *     自 314.0.0 起 classic worker（importScripts）被移除，**必须用 module worker**。
 *     core ≈ 13.5 MB，numpy wheel ≈ 2.9 MB（CDN 不重压缩 wheel）。
 *   · Fortran：**浏览器内无法可靠执行**。LFortran 有真实的 WASM 构建，
 *     但官方自称 alpha（"expected to not work on third-party codes"）；
 *     且在 GitHub Pages 上拿不到 COOP/COEP，JupyterLite 内核存在随机启动挂起。
 *     本平台因此提供：静态检查 + 参考实现 + 一键复制本地运行命令 + 官方在线编译器链接。
 *     **不假装它能跑。**
 *   · C++：同上。真 clang WASM 约 20 MB（gzip 后仍需下载解压），不塞进首屏。
 *
 * 安全边界（执行 Python 时）：
 *   · 在 Worker 内运行 → 没有 DOM、没有 window、不共享父页面内存；
 *   · 超时 12 秒硬 terminate（防死循环冻死页面）；
 *   · 屏蔽 subprocess / socket / os.system / os.fork / 文件写；
 *   · 单次输出长度上限，防 print 洪水；
 *   · 页面侧只接收字符串，不接收任何可执行对象。
 *   ⚠ 这套屏蔽是"防误用"，不是安全沙箱（Pyodide 内可以访问 js 桥）。
 *     真正的边界是 Worker + 超时 + 不加载不可信第三方代码。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const rt = (CPL.runtimes = {});

  // ─────────────────────────────────────────────────────────────
  // Worker 主体
  //
  // 直接写成真实函数，再用 Function.prototype.toString() 序列化进 Worker。
  // 这样不需要转义，也不会因为模板字符串里出现 ${} 而语法错乱。
  // ─────────────────────────────────────────────────────────────
  function pythonWorkerMain() {
    let pyodide = null;
    let loading = null;
    let ns = null;

    function post(type, payload) {
      self.postMessage(Object.assign({ type: type }, payload || {}));
    }

    function init(url) {
      if (pyodide) return Promise.resolve(pyodide);
      if (loading) return loading;
      loading = import(url)
        .then(function (mod) {
          return mod.loadPyodide({ indexURL: url.replace(/pyodide\.mjs$/, '') });
        })
        .then(function (py) {
          pyodide = py;
          // 屏蔽在浏览器里不可能工作、或会带来风险的入口。
          py.runPython(
            [
              'import builtins, os',
              '',
              'class _Blocked:',
              '    def __init__(self, what):',
              '        self.what = what',
              '    def __call__(self, *a, **k):',
              '        raise RuntimeError(self.what + " 在浏览器沙箱里被禁用；请在本地运行")',
              '',
              'try:',
              '    import subprocess',
              '    subprocess.Popen = _Blocked("subprocess")',
              '    subprocess.run = _Blocked("subprocess")',
              '    subprocess.call = _Blocked("subprocess")',
              'except Exception:',
              '    pass',
              'try:',
              '    import socket',
              '    socket.socket = _Blocked("socket")',
              'except Exception:',
              '    pass',
              'try:',
              '    os.system = _Blocked("os.system")',
              '    os.fork = _Blocked("os.fork")',
              'except Exception:',
              '    pass',
              '_real_open = builtins.open',
              'def _guarded_open(file, mode="r", *a, **k):',
              '    if any(c in mode for c in "wax+"):',
              '        p = str(file)',
              '        if not p.startswith("/tmp"):',
              '            raise RuntimeError("浏览器沙箱里禁止写文件；请在本地运行")',
              '    return _real_open(file, mode, *a, **k)',
              'builtins.open = _guarded_open',
            ].join('\n')
          );
          post('ready', { python: py.version });
          return py;
        })
        .catch(function (err) {
          loading = null;
          post('fatal', { message: String((err && err.message) || err) });
          throw err;
        });
      return loading;
    }

    function loadPackages(names) {
      if (!names.length) return Promise.resolve();
      post('status', { message: '正在加载包：' + names.join(', ') + '（首次约 3 MB，之后走浏览器缓存）' });
      return pyodide.loadPackage(names, {
        messageCallback: function (m) {
          post('status', { message: m });
        },
      });
    }

    /**
     * 把用户代码包进 stdout/stderr 捕获器，并在同一命名空间里执行。
     *
     * ⚠ 这里必须**显式**把捕获结果写到真正的 stdout，不能依赖"最后一行表达式的值"。
     *   Python 只在交互式 REPL 里才显示表达式结果；`python -c` 与 Pyodide 的
     *   runPython 都不会。早期版本把 `_cpl_out.getvalue()` 当作最后一条语句，
     *   结果页面拿到的 stdout 永远是空字符串——测试全部"通过"但什么都没测到。
     *   这个 bug 用一个必然失败的断言才暴露出来。
     *
     * 输出协议（供 Node 侧的 scripts/verify-python.mjs 解析；浏览器侧不用它，
     * 而是直接分别读取 _cpl_out / _cpl_err 两个缓冲区）：
     *   \x1eCPL_OUT\x1e<stdout>\x1cCPL_ERR\x1c<stderr>\x1d
     * 用不可打印字符做分隔，避免与用户输出冲突。
     */
    function buildRunCode(src) {
      // 空行不加缩进：否则用户代码里的多行字符串会多出尾随空格，
      // 而空行加缩进本身在 Python 里也会引发 IndentationError。
      const lines = src.split('\n').map(function (l) {
        return l.length ? '    ' + l : '';
      });
      return [
        'import sys as _cpl_sys, io as _cpl_io',
        '_cpl_real_out = _cpl_sys.__stdout__',
        '_cpl_out = _cpl_io.StringIO()',
        '_cpl_err = _cpl_io.StringIO()',
        '_cpl_saved = (_cpl_sys.stdout, _cpl_sys.stderr)',
        '_cpl_sys.stdout = _cpl_out',
        '_cpl_sys.stderr = _cpl_err',
        'try:',
        ...lines,
        'except BaseException:',
        '    import traceback as _cpl_tb',
        '    _cpl_err.write(_cpl_tb.format_exc())',
        'finally:',
        '    _cpl_sys.stdout = _cpl_saved[0]',
        '    _cpl_sys.stderr = _cpl_saved[1]',
        '_cpl_real_out.write("\\x1eCPL_OUT\\x1e" + _cpl_out.getvalue() + "\\x1cCPL_ERR\\x1c" + _cpl_err.getvalue() + "\\x1d")',
        '_cpl_real_out.flush()',
      ].join('\n');
    }

    self.onmessage = async function (event) {
      const data = event.data || {};
      const id = data.id;

      if (data.type === 'init') {
        try {
          await init(data.url);
          post('done', { id: id });
        } catch (err) {
          post('error', { id: id, message: String((err && err.message) || err) });
        }
        return;
      }

      if (data.type === 'run') {
        const t0 = performance.now();
        const src = String(data.code || '');
        try {
          await init(data.url);

          const guessed = [];
          if (/\b(import|from)\s+numpy|\bnp\./.test(src)) guessed.push('numpy');
          if (/\b(import|from)\s+scipy|\bsp\./.test(src)) guessed.push('scipy');
          if (/\b(import|from)\s+matplotlib|\bplt\./.test(src)) guessed.push('matplotlib');
          const packages = guessed.filter(function (n, i) {
            return guessed.indexOf(n) === i;
          });
          await loadPackages(packages);

          // 会话模式：用户代码与后续测试共用一个 Python 命名空间字典。
          // globals 必须传 Python dict（PyProxy），不能传普通 JS 对象。
          if (data.namespace && (data.resetNamespace || !ns)) {
            if (ns && ns.destroy) {
              try {
                ns.destroy();
              } catch (e0) {
                /* 忽略 */
              }
            }
            ns = pyodide.runPython('{}');
          }
          const opts = data.namespace ? { globals: ns } : undefined;

          pyodide.runPython(buildRunCode(src), opts);
          // 用独立的 runPython 调用把两个缓冲区取出来。
          // （不要依赖"最后一条表达式的值"——那只在 REPL 里有效。）
          var stdout = '';
          var stderr = '';
          try {
            stdout = String(pyodide.runPython('_cpl_out.getvalue()', opts) || '');
          } catch (eOut) {
            stdout = '';
          }
          try {
            stderr = String(pyodide.runPython('_cpl_err.getvalue()', opts) || '');
          } catch (eErr) {
            stderr = '';
          }

          post('result', {
            id: id,
            stdout: stdout,
            stderr: stderr,
            ms: performance.now() - t0,
            packages: packages,
          });
        } catch (err) {
          post('error', {
            id: id,
            message: String((err && err.message) || err),
            stdout: '',
            stderr: '',
            ms: performance.now() - t0,
          });
        }
        return;
      }

      if (data.type === 'reset') {
        try {
          if (ns && ns.destroy) ns.destroy();
        } catch (e) {
          /* 忽略 */
        }
        ns = null;
        pyodide = null;
        loading = null;
        post('reset', { id: id });
      }
    };
  }

  /** Pyodide 完全不可用时的降级 Worker：明确报错，绝不静默假装成功。 */
  function minimalWorkerMain() {
    self.onmessage = function (e) {
      const d = e.data || {};
      if (d.type === 'init') {
        self.postMessage({ type: 'ready', python: '已降级（未加载 Pyodide）' });
        return;
      }
      if (d.type === 'run') {
        self.postMessage({
          id: d.id,
          type: 'error',
          message:
            '当前环境无法加载 Pyodide（可能是离线、CDN 被拦截，或浏览器禁用了 WebAssembly）。Python 代码没有被执行。',
          hint: '检查网络后重试；或把代码复制到本地用 python3 运行。',
          ms: 0,
        });
      }
    };
  }

  function makeWorkerBlob(fn) {
    const source = `'use strict';\n(${fn.toString()})();\n`;
    return URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  }

  // ─────────────────────────────────────────────────────────────
  // Worker 生命周期
  // ─────────────────────────────────────────────────────────────
  const state = {
    worker: null,
    ready: false,
    loading: false,
    minimal: false,
    pending: new Map(),
    seq: 0,
    lastError: null,
  };

  rt.pyStatus = () => ({
    ready: state.ready,
    loading: state.loading,
    minimal: state.minimal,
    error: state.lastError,
    cdnAllowed: CPL.config.allowCdn && CPL.prefs.get('enableCdn') !== false,
  });

  function spawnWorker() {
    if (state.worker) return state.worker;
    try {
      state.worker = new Worker(makeWorkerBlob(pythonWorkerMain), { type: 'module' });
    } catch (err) {
      CPL.log('warn', 'module worker 创建失败，降级为纯报错模式', dom.friendlyError(err));
      state.worker = new Worker(makeWorkerBlob(minimalWorkerMain));
      state.minimal = true;
    }
    state.worker.onmessage = onWorkerMessage;
    state.worker.onerror = (e) => {
      CPL.log('error', 'Python worker 崩溃', e.message);
      state.ready = false;
      state.loading = false;
      rejectAll(new Error(e.message || 'Python 运行时崩溃'));
    };
    return state.worker;
  }

  function rejectAll(err) {
    for (const [, entry] of state.pending) entry.reject(err);
    state.pending.clear();
  }

  function onWorkerMessage(event) {
    const msg = event.data || {};
    if (msg.type === 'ready') {
      state.ready = true;
      state.loading = false;
      CPL.log('info', 'Python 运行时就绪：', msg.python || '');
      CPL.bus.emit('runtime:ready', { lang: 'python', version: msg.python });
      return;
    }
    if (msg.type === 'fatal') {
      state.loading = false;
      state.lastError = msg.message;
      CPL.bus.emit('runtime:error', { lang: 'python', message: msg.message });
      return;
    }
    if (msg.type === 'status') {
      CPL.bus.emit('runtime:status', { lang: 'python', message: msg.message });
      const entry = state.pending.get(Number(msg.id));
      if (entry && entry.onStatus) entry.onStatus(msg.message);
      return;
    }
    const entry = state.pending.get(Number(msg.id));
    if (!entry) return;
    state.pending.delete(Number(msg.id));
    clearTimeout(entry.timer);
    entry.resolve({ ok: msg.type === 'result', ...msg });
  }

  /** 确保运行时可用（首次约 13.5 MB，之后走浏览器缓存）。 */
  rt.ensurePython = function ensurePython(onStatus) {
    if (!CPL.config.allowCdn || CPL.prefs.get('enableCdn') === false) {
      return Promise.reject(
        new Error('第三方 CDN 已被禁用（设置里关闭了）。请在设置里打开，或把 Pyodide 自托管到本站 /pyodide/ 后修改 config.cdn.pyodideModule。')
      );
    }
    if (typeof Worker === 'undefined' || typeof WebAssembly === 'undefined') {
      return Promise.reject(new Error('当前浏览器不支持 Web Worker 或 WebAssembly，无法在浏览器内运行 Python。'));
    }
    if (state.ready) return Promise.resolve(true);
    if (state.loading) {
      return new Promise((resolve, reject) => {
        const off = CPL.bus.on('runtime:ready', () => {
          off();
          offErr();
          resolve(true);
        });
        const offErr = CPL.bus.on('runtime:error', (e) => {
          off();
          offErr();
          reject(new Error(e.message));
        });
      });
    }

    state.loading = true;
    state.lastError = null;
    if (onStatus) onStatus('正在下载 Python 运行时（约 13.5 MB，仅首次；之后走浏览器缓存）…');

    const worker = spawnWorker();
    const id = ++state.seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        state.pending.delete(id);
        state.loading = false;
        reject(new Error('Python 运行时加载超时（60 秒）。检查网络，或稍后重试。'));
      }, 60000);
      state.pending.set(id, {
        timer,
        resolve: (m) => {
          if (m.ok) resolve(true);
          else {
            state.loading = false;
            state.lastError = m.message;
            reject(new Error(m.message));
          }
        },
        reject: (err) => {
          state.loading = false;
          reject(err);
        },
      });
      worker.postMessage({ type: 'init', id, url: CPL.config.cdn.pyodideModule });
    });
  };

  /**
   * 运行 Python 代码。
   * @param {string} code
   * @param {{timeoutMs?:number, onStatus?:Function, namespace?:boolean, resetNamespace?:boolean}} opts
   * @returns {Promise<{ok:boolean, stdout:string, stderr:string, ms:number, message?:string}>}
   */
  rt.runPython = async function runPython(code, opts = {}) {
    const timeout = opts.timeoutMs || CPL.config.runTimeoutMs;
    try {
      await rt.ensurePython(opts.onStatus);
    } catch (err) {
      return { ok: false, stdout: '', stderr: '', ms: 0, message: dom.friendlyError(err) };
    }

    const worker = spawnWorker();
    const id = ++state.seq;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        // 硬超时：终止 Worker 并重建干净实例，防止死循环拖死页面
        state.pending.delete(id);
        try {
          worker.terminate();
        } catch {
          /* 忽略 */
        }
        state.worker = null;
        state.ready = false;
        state.loading = false;
        resolve({
          ok: false,
          stdout: '',
          stderr: '',
          ms: timeout,
          message: `执行超时（超过 ${(timeout / 1000).toFixed(0)} 秒），已强制终止运行时。检查是否有死循环，或把 N 调小。`,
        });
      }, timeout);

      state.pending.set(id, {
        timer,
        resolve: (m) => resolve(m),
        reject: (err) => resolve({ ok: false, stdout: '', stderr: '', ms: 0, message: dom.friendlyError(err) }),
        onStatus: opts.onStatus,
      });

      worker.postMessage({
        type: 'run',
        id,
        code,
        url: CPL.config.cdn.pyodideModule,
        namespace: Boolean(opts.namespace),
        resetNamespace: Boolean(opts.resetNamespace),
      });
    });
  };

  rt.resetPython = function resetPython() {
    if (state.worker) {
      try {
        state.worker.postMessage({ type: 'reset', id: ++state.seq });
      } catch {
        /* 忽略 */
      }
      try {
        state.worker.terminate();
      } catch {
        /* 忽略 */
      }
    }
    state.worker = null;
    state.ready = false;
    state.loading = false;
    state.pending.clear();
    CPL.bus.emit('runtime:reset', { lang: 'python' });
  };

  // ─────────────────────────────────────────────────────────────
  // 静态检查：Fortran / C++（不执行，只做可验证的检查）
  // ─────────────────────────────────────────────────────────────
  const FORTRAN_RULES = [
    {
      level: 'error',
      re: /(?:^|\n)[^\n!]*\b([A-Za-z_]\w*)\s*\(\s*0\s*[,)]/,
      msg: '数组下标出现了 0。Fortran 默认下标从 1 开始，除非显式声明了 0 下界，否则这是越界。',
    },
    {
      level: 'error',
      re: /\b(?:real|integer|logical|character)\s*\(\s*kind\s*=\s*(?!\w)/i,
      msg: '`kind=` 后面缺参数值。用 `real(kind=real64)`（需要 `use iso_fortran_env`）或 `integer, parameter :: dp = kind(1.0d0)` 再写 `real(dp)`。',
    },
    {
      level: 'warn',
      re: /(?:^|\n)\s*(?:program|module|subroutine|function|pure\s+function|real\s+function)\b[\s\S]{0,4000}?(?=(?:^|\n)\s*(?:end\s+(?:program|module|subroutine|function)|end)\b)/im,
      msg: '检查这一段是否写了 `implicit none`。Fortran 默认按首字母推断类型（i–n 为整型），拼错的变量名会静默变成新变量，这是 legacy 代码里最难查的一类 bug。',
      test: (src) => {
        // 只有在"确实没有 implicit none"时才报告
        const blocks = src.split(/(?=\n\s*(?:program|module|subroutine|function)\b)/i);
        return blocks.some((b) => /(?:program|module|subroutine|function)\b/i.test(b) && !/implicit\s+none/i.test(b) && b.trim().length > 40);
      },
    },
    { level: 'info', re: /\breal\s*\*\s*[48]\b/i, msg: '`real*8` 是非标准扩展。可移植写法：`use iso_fortran_env, only: real64` 然后 `real(real64)`。' },
    { level: 'info', re: /\bcommon\s*\//i, msg: '`common` 块是 legacy 特性。同一 common 块在不同文件里的声明必须完全一致，否则会出现极难定位的数据错乱；改成 `module` 变量更安全。' },
    { level: 'info', re: /\.(?:eq|ne|lt|le|gt|ge)\./i, msg: '用了 `.eq.` 等旧式比较运算；现代写法是 `==` `/=` `<` `<=` `>` `>=`。' },
    {
      level: 'tip',
      re: /matmul\s*\(|dot_product\s*\(/i,
      msg: '用了 `matmul`/`dot_product`：通常映射到 BLAS（dgemm/dgemv），性能远好于手写三重循环。若这里恰好是热点，确认链接了优化过的 BLAS。',
    },
    {
      level: 'warn',
      re: /!\$omp\s+parallel\s+do[\s\S]{0,400}?(?:\w+\s*=\s*\w+\s*\+\s*1|(\w+)\s*=\s*\1\s*\+)/i,
      msg: 'OpenMP 并行循环里对共享变量做 `x = x + 1` 是典型竞态。用 `reduction(+:x)` 或 `!$omp atomic`。',
    },
    {
      level: 'tip',
      re: /do\s+\w+\s*=\s*[^,\n]+,[^,\n]+(?:,[^,\n]+)?\s*\n(?:[^\n]*\n){0,40}?\s*end\s*do\s+\w+/i,
      msg: 'do 循环用了带名字的 `end do name`。现代 Fortran 支持匿名 `end do`，但带名字在长循环体里更不容易出错——保持你的风格一致即可。',
    },
    {
      level: 'info',
      re: /^\s{6,}\S[^\n]*$/m,
      msg: '检测到第 6 列之后仍有内容的行，可能混用了固定格式（.f/.for）的列约定。自由格式（.f90）没有列限制，混用会误导阅读。',
    },
  ];

  const CPP_RULES = [
    { level: 'warn', re: /\bnew\s+[A-Za-z_]\w*/, msg: '裸 `new` 需要配对 `delete`。C++11 之后优先用 `std::vector` / `std::unique_ptr` 管理生命周期。' },
    { level: 'warn', re: /\bmalloc\s*\(/, msg: '`malloc` 不会调用构造函数。在 C++ 里除非是与 C 交互，否则用 `new` 或容器。' },
    { level: 'info', re: /\bprintf\s*\(\s*"[^"]*%s/, msg: '用 `printf` 打印 `std::string` 会出问题，要 `.c_str()`；C++ 里建议直接用 `std::cout`。' },
    { level: 'info', re: /#\s*include\s*<\w+\.h>/, msg: '包含 C 风格头文件（如 `<math.h>`）。C++ 里更推荐 `<cmath>` 并把名字放到 `std::`。' },
    { level: 'warn', re: /^\s*using\s+namespace\s+std\s*;/m, msg: '`using namespace std;` 会污染命名空间。头文件里绝对不要写；实现文件里也建议限定作用域。' },
    {
      level: 'warn',
      re: /#\s*pragma\s+omp\s+parallel\s+for[\s\S]{0,400}?\+\+/,
      msg: 'OpenMP `parallel for` 内出现自增共享变量，通常是竞态。用 `reduction(+:x)`。',
    },
    { level: 'tip', re: /\b(?:int|float|double|char)\s+\w+\s*\[\s*\d{6,}\s*\]/, msg: '大尺寸固定栈数组会爆栈（默认栈约 8 MB）。大数组改用 `std::vector` 或 `static`。' },
    { level: 'info', re: /\bwhile\s*\(\s*(?:true|1)\s*\)/, msg: '`while(true)` 需要明确的退出路径。确认每个分支都能跳出，且没有在循环里做重复的内存分配。' },
  ];

  /** 去掉字符串与注释后的括号平衡检查。 */
  function balance(src) {
    const cleaned = String(src)
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/\/\/[^\n]*/g, ' ')
      .replace(/![^\n]*/g, ' ')
      .replace(/'(?:[^'\n]|'')*'/g, "''")
      .replace(/"(?:[^"\n]|"")*"/g, '""');
    const pairs = { ')': '(', ']': '[', '}': '{' };
    const stack = [];
    for (const ch of cleaned) {
      if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
      else if (pairs[ch]) {
        if (stack.pop() !== pairs[ch]) {
          return { level: 'error', msg: `括号不匹配：遇到 ${ch} 时没有对应的 ${pairs[ch]}。` };
        }
      }
    }
    if (stack.length) {
      return { level: 'error', msg: `括号未闭合：还有 ${stack.length} 个未匹配的 ${stack.join('')}。` };
    }
    return null;
  }

  function applyRules(rules, src) {
    const issues = [];
    for (const rule of rules) {
      let hit;
      try {
        hit = rule.test ? rule.test(src) : rule.re.test(src);
      } catch {
        hit = false;
      }
      if (hit) issues.push({ level: rule.level, msg: rule.msg });
    }
    const bal = balance(src);
    if (bal) issues.push(bal);
    return issues;
  }

  rt.staticCheck = function staticCheck(lang, src) {
    const l = String(lang || '').toLowerCase();
    if (l === 'fortran' || l === 'f' || l === 'f90' || l === 'f95' || l === 'f03' || l === 'f08') {
      return applyRules(FORTRAN_RULES, src);
    }
    if (['c', 'cpp', 'c++', 'cc', 'cxx', 'h', 'hpp', 'cuda', 'cu'].includes(l)) {
      return applyRules(CPP_RULES, src);
    }
    return [];
  };

  // ─────────────────────────────────────────────────────────────
  // 本地运行指引
  // ─────────────────────────────────────────────────────────────
  rt.localRunInfo = function localRunInfo(lang, sourceName = 'main') {
    const l = String(lang || '').toLowerCase();
    if (l === 'python' || l === 'py' || l === 'python3') {
      return {
        ext: 'py',
        file: `${sourceName}.py`,
        commands: [
          { label: '直接运行', cmd: `python3 ${sourceName}.py`, note: 'Windows 上用 `python` 而不是 `python3`。' },
          { label: '函数级性能剖析', cmd: `python3 -m cProfile -s cumtime ${sourceName}.py | head -30` },
          { label: '逐行剖析（需先 pip install line_profiler）', cmd: `kernprof -l -v ${sourceName}.py` },
          { label: '内存峰值（需 pip install memory_profiler）', cmd: `python3 -m memory_profiler ${sourceName}.py` },
        ],
      };
    }
    if (l === 'fortran' || l === 'f' || l === 'f90' || l === 'f95' || l === 'f03' || l === 'f08') {
      return {
        ext: 'f90',
        file: `${sourceName}.f90`,
        commands: [
          { label: '编译并运行（gfortran，带全部运行时检查）', cmd: `gfortran -O2 -Wall -Wextra -fcheck=all ${sourceName}.f90 -o ${sourceName} && ./${sourceName}` },
          { label: '生产优化（会关掉边界检查）', cmd: `gfortran -O3 -march=native ${sourceName}.f90 -o ${sourceName} && ./${sourceName}` },
          { label: '显式检查数组越界与未初始化（调试期必备）', cmd: `gfortran -g -O0 -fcheck=bounds -finit-real=snan -ffpe-trap=invalid,zero,overflow ${sourceName}.f90 -o ${sourceName} && ./${sourceName}` },
          { label: '链接 BLAS/LAPACK', cmd: `gfortran -O2 ${sourceName}.f90 -o ${sourceName} -llapack -lblas && ./${sourceName}` },
          { label: 'OpenMP 并行', cmd: `gfortran -O3 -fopenmp ${sourceName}.f90 -o ${sourceName} && OMP_NUM_THREADS=4 ./${sourceName}` },
          { label: 'MPI 并行', cmd: `mpif90 -O3 ${sourceName}.f90 -o ${sourceName} && mpirun -np 4 ./${sourceName}` },
          { label: 'Intel ifx（ifort 的 LLVM 后继；如已安装）', cmd: `ifx -O2 -qopenmp ${sourceName}.f90 -o ${sourceName} && ./${sourceName}` },
          { label: 'Windows PowerShell', cmd: `gfortran -O2 ${sourceName}.f90 -o ${sourceName}.exe; .\\${sourceName}.exe` },
        ],
      };
    }
    if (['c', 'cpp', 'c++', 'cc', 'cxx', 'cuda', 'cu'].includes(l)) {
      const isC = l === 'c';
      const ext = isC ? 'c' : 'cpp';
      const file = `${sourceName}.${ext}`;
      const std = isC ? 'c17' : 'c++20';
      const comp = isC ? 'gcc' : 'g++';
      return {
        ext,
        file,
        commands: [
          { label: '编译并运行', cmd: `${comp} -std=${std} -O2 -Wall -Wextra ${file} -o ${sourceName} && ./${sourceName}` },
          { label: 'AddressSanitizer + UBSan（抓越界、泄漏、未定义行为）', cmd: `${comp} -std=${std} -g -O1 -fsanitize=address,undefined -fno-omit-frame-pointer ${file} -o ${sourceName} && ./${sourceName}` },
          { label: 'OpenMP 并行', cmd: `${comp} -std=${std} -O3 -fopenmp ${file} -o ${sourceName} && OMP_NUM_THREADS=4 ./${sourceName}` },
          { label: '性能剖析', cmd: `perf record -g ./${sourceName} && perf report` },
          { label: 'Windows PowerShell', cmd: `${comp} -std=${std} -O2 ${file} -o ${sourceName}.exe; .\\${sourceName}.exe` },
        ],
      };
    }
    return { ext: 'txt', file: `${sourceName}.txt`, commands: [] };
  };

  /** 外部在线编译器：只给链接，不承诺可靠性。 */
  rt.externalRunners = [
    { lang: 'Fortran', name: 'LFortran 官方在线版（官方标注 alpha，不保证第三方代码）', url: 'https://dev.lfortran.org/' },
    { lang: 'Fortran / C++', name: 'Compiler Explorer（需联网，代码会上传到对方服务器）', url: 'https://godbolt.org/' },
    { lang: 'C++', name: 'wasm-clang（Clang/LLD WASM，约 20 MB 首次下载，源码不上传）', url: 'https://binji.github.io/wasm-clang/' },
  ];
})();
