/* ============================================================================
 * 55-highlight.js — 轻量语法高亮（Python / Fortran / C++ / JS / bash）
 *
 * 目标不是"完美的语言解析"，而是让课程里的代码块一眼可读。
 * 采用 sticky 正则逐位置扫描，先切 token 再统一转义 —— 因此不存在
 * "转义后的 &lt; 被当成运算符"这类经典 bug。
 * 未知语言原样显示（只转义，不高亮），不报错。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const hl = (CPL.highlight = {});

  const esc = dom.esc;

  /** 关键字表：长词在前，避免 'end' 抢先匹配 'enddo'。 */
  function words(list) {
    return list
      .slice()
      .sort((a, b) => b.length - a.length)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
  }

  const PY_KW = [
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
    'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in',
    'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with',
    'yield', 'match', 'case', 'self', 'cls',
  ];
  const PY_BUILTIN = [
    'print', 'len', 'range', 'enumerate', 'zip', 'map', 'filter', 'sum', 'min', 'max', 'abs', 'round',
    'sorted', 'list', 'dict', 'set', 'tuple', 'int', 'float', 'str', 'bool', 'complex', 'bytes',
    'open', 'isinstance', 'type', 'super', 'repr', 'format', 'any', 'all', 'pow', 'divmod', 'next',
    'iter', 'hasattr', 'getattr', 'setattr', 'property', 'staticmethod', 'classmethod', 'Exception',
    'ValueError', 'TypeError', 'KeyError', 'IndexError', 'RuntimeError', 'ZeroDivisionError',
  ];
  const PY_EXC = ['np', 'numpy', 'scipy', 'plt', 'matplotlib', 'pd', 'pandas', 'math', 'time', 'random', 'os', 'sys', 'json'];

  const F_KW = [
    'program', 'endprogram', 'module', 'endmodule', 'submodule', 'subroutine', 'endsubroutine',
    'function', 'endfunction', 'interface', 'endinterface', 'procedure', 'contains', 'use', 'only',
    'implicit', 'none', 'integer', 'real', 'complex', 'character', 'logical', 'type', 'class',
    'endtype', 'kind', 'parameter', 'dimension', 'allocatable', 'allocate', 'deallocate', 'pointer',
    'target', 'intent', 'in', 'out', 'inout', 'optional', 'public', 'private', 'protected', 'save',
    'external', 'intrinsic', 'pure', 'elemental', 'recursive', 'result', 'if', 'then', 'elseif',
    'else', 'endif', 'do', 'enddo', 'while', 'select', 'case', 'endselect', 'default', 'where',
    'elsewhere', 'endwhere', 'forall', 'call', 'return', 'stop', 'error', 'continue', 'cycle',
    'exit', 'go', 'to', 'goto', 'write', 'read', 'print', 'open', 'close', 'format', 'namelist',
    'associate', 'block', 'endblock', 'critical', 'enum', 'enumerator', 'generic', 'bind', 'value',
    'abstract', 'deferred', 'extends', 'final', 'import', 'sequence', 'codimension', 'sync', 'all',
    'images', 'memory', 'team', 'event', 'post', 'wait', 'lock', 'unlock', 'errorstop', 'non_overridable',
    'omp', 'parallel', 'end', 'omp', 'critical', 'atomic', 'simd', 'do', 'sections', 'single', 'master',
    'taskwait', 'barrier', 'flush', 'threadprivate', 'reduction', 'schedule', 'shared', 'firstprivate',
    'lastprivate', 'collapse', 'num_threads', 'use_device',
  ];
  const F_TYPES = [
    'int8', 'int16', 'int32', 'int64', 'real32', 'real64', 'real128', 'kind', 'len', 'selected_real_kind',
    'selected_int_kind', 'huge', 'tiny', 'epsilon', 'maxval', 'minval', 'sum', 'product', 'dot_product',
    'matmul', 'transpose', 'reshape', 'spread', 'pack', 'unpack', 'cshift', 'eoshift', 'size', 'shape',
    'lbound', 'ubound', 'allocated', 'associated', 'present', 'merge', 'modulo', 'mod', 'abs', 'sqrt',
    'exp', 'log', 'log10', 'sin', 'cos', 'tan', 'atan', 'atan2', 'asin', 'acos', 'sinh', 'cosh', 'tanh',
    'floor', 'ceiling', 'nint', 'aint', 'anint', 'sign', 'dim', 'max', 'min', 'random_number',
    'random_seed', 'cpu_time', 'system_clock', 'dble', 'cmplx', 'transfer', 'trim', 'adjustl',
    'adjustr', 'len_trim', 'index', 'scan', 'verify', 'repeat', 'achar', 'iachar', 'char', 'ichar',
    'not', 'and', 'or', 'xor', 'eqv', 'neqv', 'ieor', 'iand', 'ior', 'ibits', 'ishft',
  ];

  const CPP_KW = [
    'alignas', 'alignof', 'asm', 'auto', 'break', 'case', 'catch', 'class', 'concept', 'const',
    'consteval', 'constexpr', 'constinit', 'const_cast', 'continue', 'co_await', 'co_return',
    'co_yield', 'decltype', 'default', 'delete', 'do', 'dynamic_cast', 'else', 'enum', 'explicit',
    'export', 'extern', 'false', 'final', 'for', 'friend', 'goto', 'if', 'inline', 'mutable',
    'namespace', 'new', 'noexcept', 'nullptr', 'operator', 'override', 'private', 'protected',
    'public', 'register', 'reinterpret_cast', 'requires', 'return', 'sizeof', 'static', 'static_assert',
    'static_cast', 'struct', 'switch', 'template', 'this', 'thread_local', 'throw', 'true', 'try',
    'typedef', 'typeid', 'typename', 'union', 'using', 'virtual', 'volatile', 'while', 'int', 'long',
    'short', 'char', 'bool', 'float', 'double', 'void', 'unsigned', 'signed', 'wchar_t', 'char8_t',
    'char16_t', 'char32_t', 'size_t', 'std', 'omp', 'pragma', 'include', 'define', 'ifdef', 'ifndef',
    'endif', 'if', 'else', 'elif',
  ];

  const SH_KW = ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'in', 'export', 'local', 'return', 'source', 'set', 'cd', 'echo', 'printf', 'grep', 'sed', 'awk', 'find', 'make', 'cmake', 'python3', 'pip', 'git', 'gfortran', 'mpirun', 'mpiexec', 'g++', 'clang++', 'valgrind', 'perf', 'nvidia-smi'];

  /**
   * 语言定义：顺序即优先级。
   * kind: 'comment' | 'string' | 'number' | 'keyword' | 'type' | 'function' | 'preproc'
   */
  function defs(lang) {
    const L = String(lang || '').toLowerCase();
    const py = L === 'python' || L === 'py' || L === 'python3';
    const f = L === 'fortran' || L === 'f90' || L === 'f95' || L === 'f03' || L === 'f08' || L === 'f';
    const cpp = ['c', 'h', 'cpp', 'c++', 'cc', 'cxx', 'hpp', 'cuda', 'cu'].includes(L);
    const js = ['js', 'javascript', 'ts', 'typescript', 'json'].includes(L);
    const sh = ['bash', 'sh', 'shell', 'zsh', 'console'].includes(L);

    const set = [];
    const ci = f; // Fortran 大小写不敏感

    if (f) {
      set.push({ kind: 'comment', re: /!.*/y });
      set.push({ kind: 'string', re: /'(?:[^']|'')*'|"(?:[^"]|"")*"/y });
    } else if (sh) {
      set.push({ kind: 'comment', re: /#.*/y });
      set.push({ kind: 'string', re: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/y });
    } else {
      set.push({ kind: 'comment', re: /\/\*[\s\S]*?\*\//y });
      set.push({ kind: 'comment', re: /\/\/.*/y });
      if (py) set.push({ kind: 'comment', re: /#.*/y });
      set.push({ kind: 'string', re: /"""[\s\S]*?"""|'''[\s\S]*?'''/y });
      set.push({ kind: 'string', re: /[rbfu]{0,2}"(?:[^"\\]|\\.)*"|[rbfu]{0,2}'(?:[^'\\]|\\.)*'/y });
    }

    set.push({ kind: 'preproc', re: /^\s*#\s*(?:include|define|ifdef|ifndef|endif|pragma|if|else|elif|undef|error)\b.*/my });
    set.push({ kind: 'number', re: /0[xX][0-9a-fA-F_]+|0[bB][01_]+|\d[\d_]*(?:\.[\d_]*)?(?:[eEdD][-+]?\d+)?(?:_\w+)?/y });

    if (f) {
      set.push({ kind: 'keyword', re: new RegExp(`\\b(?:${words(F_KW)})\\b`, ci ? 'iy' : 'y') });
      set.push({ kind: 'type', re: new RegExp(`\\b(?:${words(F_TYPES)})\\b`, ci ? 'iy' : 'y') });
    } else if (cpp) {
      set.push({ kind: 'keyword', re: new RegExp(`\\b(?:${words(CPP_KW)})\\b`, 'y') });
      set.push({ kind: 'type', re: /\b[A-Z][A-Za-z0-9_]*\b|\b(?:std|Eigen|MPI|omp)::?\w*/y });
    } else if (py) {
      set.push({ kind: 'keyword', re: new RegExp(`\\b(?:${words(PY_KW)})\\b`, 'y') });
      set.push({ kind: 'type', re: new RegExp(`\\b(?:${words(PY_BUILTIN)})\\b`, 'y') });
      set.push({ kind: 'type', re: new RegExp(`\\b(?:${words(PY_EXC)})\\b`, 'y') });
    } else if (sh) {
      set.push({ kind: 'keyword', re: new RegExp(`\\b(?:${words(SH_KW)})\\b`, 'y') });
    } else if (js) {
      set.push({
        kind: 'keyword',
        re: /\b(?:const|let|var|function|return|if|else|for|while|class|new|import|export|from|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false|this|super|of|in|yield|static|get|set)\b/y,
      });
      set.push({ kind: 'type', re: /\b[A-Z][A-Za-z0-9_]*\b/y });
    }

    // 函数调用：标识符紧跟 (
    if (py || js || cpp || f) set.push({ kind: 'function', re: /[A-Za-z_]\w*(?=\s*\()/y });

    return set;
  }

  /**
   * 高亮为 HTML（已转义）。
   * @param {string} code
   * @param {string} lang
   * @returns {string}
   */
  hl.render = function render(code, lang) {
    const src = String(code === undefined || code === null ? '' : code);
    const set = defs(lang);
    if (!set.length) return esc(src);

    let out = '';
    let i = 0;
    const n = src.length;
    // 每个模式独立维护 lastIndex
    let guard = 0;

    while (i < n) {
      if (++guard > n * 4 + 1000) break; // 防御性上限，避免正则死循环
      let matched = false;

      for (const { kind, re } of set) {
        re.lastIndex = i;
        const m = re.exec(src);
        if (!m || m.index !== i || !m[0].length) continue;
        out += `<span class="cpl-tok-${kind}">${esc(m[0])}</span>`;
        i += m[0].length;
        matched = true;
        break;
      }

      if (!matched) {
        // 普通字符：标识符残段（未命中关键字/函数）或单个运算符
        let j = i;
        if (/[A-Za-z0-9_]/.test(src[j])) {
          while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
        } else if (/\s/.test(src[j])) {
          while (j < n && /\s/.test(src[j])) j++;
        } else {
          j = i + 1;
        }
        out += esc(src.slice(i, j));
        i = j;
      }
    }
    return out;
  };

  /** 就地高亮一个 <code> 元素（读 textContent，写回 span 序列）。 */
  hl.apply = function apply(codeEl, lang) {
    if (!codeEl) return;
    if (codeEl.dataset.cplHighlighted === '1') return;
    const raw = codeEl.textContent || '';
    codeEl.innerHTML = hl.render(raw, lang || codeEl.dataset.lang || '');
    codeEl.dataset.cplHighlighted = '1';
  };

  /** 全站自动高亮：渲染完视图后扫描 .cpl-pre code。 */
  hl.applyAll = function applyAll(root) {
    for (const codeEl of CPL.dom.qsa('.cpl-pre code, pre[data-lang] code', root || document)) {
      const block = codeEl.closest('[data-lang]');
      const lang = block ? block.dataset.lang : '';
      hl.apply(codeEl, lang);
    }
  };

  CPL.bus.on('app:mounted', () => {
    hl.applyAll();
    // 视图切换后也补一次（导航渲染完成后触发）
    CPL.bus.on('view:rendered', () => hl.applyAll());
  });

  hl.languages = ['python', 'fortran', 'cpp', 'c', 'javascript', 'bash', 'text'];
})();
