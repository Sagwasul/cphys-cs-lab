/* ============================================================================
 * 50-tests.js — 课程自动测试运行器
 *
 * 课程里的 tests 有三种类型：
 *   kind:'python'  在 Pyodide 里与用户代码拼接后执行，支持 import numpy 与计时断言
 *   kind:'static'  只检查源码本身（正则/长度/是否用了某个结构），不需要运行时
 *   kind:'check'   纯前端断言函数（(ctx) => true/false），用于检查"是否做过某个交互"
 *
 * 设计要点：
 *   · 每个测试独立超时，一个测试卡住不会拖垮整页；
 *   · 输出保留 stdout/stderr，让学生看到自己的 print；
 *   · 失败信息做长度裁剪，避免把控制台刷爆；
 *   · 复杂度类测试用"规模翻倍耗时比"而不是绝对时间，跨机器可复现。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const runner = (CPL.tests = {});

  const MAX_OUTPUT = 4000;

  function clip(s, n = MAX_OUTPUT) {
    const str = String(s === undefined || s === null ? '' : s);
    return str.length > n ? str.slice(0, n) + `\n…（已裁剪 ${str.length - n} 字符）` : str;
  }

  /** 把一个测试的断言代码包装成可执行的 Python 片段。 */
  function wrapPythonTest(test, userCode) {
    return [
      'import io as _cpl_io, traceback as _cpl_tb',
      `_cpl_user = ${JSON.stringify(userCode)}`,
      `_cpl_test = ${JSON.stringify(test.assert || '')}`,
      '_cpl_ns = {}',
      '_cpl_ok = True',
      '_cpl_msg = ""',
      'try:',
      '    exec(compile(_cpl_user, "<你的代码>", "exec"), _cpl_ns)',
      '    exec(compile(_cpl_test, "<测试>", "exec"), _cpl_ns)',
      'except AssertionError as _cpl_e:',
      '    _cpl_ok = False',
      '    _cpl_msg = str(_cpl_e) or "断言失败（assert 没有给出说明文字）"',
      'except BaseException as _cpl_e:',
      '    _cpl_ok = False',
      '    _cpl_msg = type(_cpl_e).__name__ + ": " + str(_cpl_e)',
      'if not _cpl_ok:',
      '    print("__CPL_FAIL__" + _cpl_msg[:600])',
    ].join('\n');
  }

  /**
   * 运行一段用户代码（会话模式），返回 stdout/repr。
   * 测试运行器不直接用它，但课程页的"运行"按钮用它，保证与测试执行方式一致。
   */
  runner.runCode = function runCode(code, opts = {}) {
    const runPython = opts.runPython || ((src, o) => CPL.runtimes.runPython(src, o));
    return runPython(code, { timeoutMs: opts.timeoutMs || CPL.config.runTimeoutMs, namespace: true, resetNamespace: true, onStatus: opts.onStatus });
  };

  /**
   * 剥掉注释与字符串字面量，只留下"可执行代码"。
   *
   * 为什么必须做：static 规则的意图是"学生是否真的这么写了"。
   * 但 starter 里通常有一句 "TODO: 用 heapq 维护小顶堆" 这样的注释，
   * 直接对源码做正则就会命中注释，导致规则永远通过——测试形同虚设。
   * （这个坑是真实踩到的：week-13 的 `mustMatch: 'heapq'` 连 starter 都放行。）
   */
  function stripCommentsAndStrings(src) {
    let out = '';
    let i = 0;
    const n = src.length;
    while (i < n) {
      const c = src[i];
      // 三引号字符串
      if ((c === '"' || c === "'") && src[i + 1] === c && src[i + 2] === c) {
        const q = c + c + c;
        i += 3;
        const end = src.indexOf(q, i);
        i = end < 0 ? n : end + 3;
        out += '""';
        continue;
      }
      // 单引号 / 双引号字符串（处理转义）
      if (c === '"' || c === "'") {
        const quote = c;
        i++;
        while (i < n) {
          if (src[i] === '\\') {
            i += 2;
            continue;
          }
          if (src[i] === quote) {
            i++;
            break;
          }
          i++;
        }
        out += '""';
        continue;
      }
      // 注释
      if (c === '#') {
        while (i < n && src[i] !== '\n') i++;
        continue;
      }
      out += c;
      i++;
    }
    return out;
  }
  runner.stripCommentsAndStrings = stripCommentsAndStrings;

  /** static 类型：用正则/长度断言源码。规则都在课程文件里，这里只提供执行器。 */
  function runStaticTest(test, code) {
    const raw = String(code || '');
    // 默认对"去掉注释与字符串"的代码做匹配；规则可用 target:'raw' 显式要求原始源码
    const scoped = (rule) => (rule.target === 'raw' ? raw : stripCommentsAndStrings(raw));
    const failures = [];
    for (const rule of rules(test)) {
      const src = scoped(rule);
      try {
        if (rule.mustMatch && !new RegExp(rule.mustMatch, rule.flags || 'm').test(src)) {
          failures.push(rule.message || `应匹配 ${rule.mustMatch}`);
        }
        if (rule.mustNotMatch && new RegExp(rule.mustNotMatch, rule.flags || 'm').test(src)) {
          failures.push(rule.message || `不应匹配 ${rule.mustNotMatch}`);
        }
        if (rule.minLength && src.length < rule.minLength) {
          failures.push(rule.message || `可执行代码长度不足 ${rule.minLength} 字符（当前 ${src.length}）`);
        }
      } catch (err) {
        failures.push(`规则本身有误：${dom.friendlyError(err)}`);
      }
    }
    return { passed: failures.length === 0, message: failures.join('；'), stdout: '', stderr: '', ms: 0 };
  }

  function rules(test) {
    return test.rules || [];
  }
  runner.runStaticTest = runStaticTest;

  /**
   * 运行一课的全部测试。
   * @param {object} lesson
   * @param {string} code
   * @param {{onProgress?:Function, runPython?:Function, signal?:{aborted:boolean}}} opts
   * @returns {Promise<{results:Array, passed:number, total:number, ms:number}>}
   */
  runner.run = async function run(lesson, code, opts = {}) {
    const tests = (lesson && lesson.tests) || [];
    const results = [];
    const t0 = performance.now();
    const runPython = opts.runPython || ((src, o) => CPL.runtimes.runPython(src, o));

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      if (opts.signal && opts.signal.aborted) break;
      if (opts.onProgress) opts.onProgress({ index: i, total: tests.length, name: test.name });

      const kind = test.kind || 'python';

      if (kind === 'static') {
        const r = runStaticTest(test, code);
        results.push({ name: test.name, kind, ...r });
        continue;
      }

      if (kind === 'check') {
        let passed = false;
        let message = '';
        try {
          passed = Boolean(test.run ? test.run({ code, lesson, CPL }) : false);
        } catch (err) {
          message = dom.friendlyError(err);
        }
        results.push({ name: test.name, kind, passed, message, stdout: '', stderr: '', ms: 0 });
        continue;
      }

      // python
      const wrapped = wrapPythonTest(test, code);
      const out = await runPython(wrapped, {
        timeoutMs: test.timeoutMs || CPL.config.runTimeoutMs,
        // 每条测试都在干净命名空间里执行（用户代码在测试内部被 exec 一遍），
        // 这样测试之间不会互相污染变量。
        namespace: false,
        onStatus: opts.onStatus,
      });

      let stdout = clip(out.stdout || '');
      let stderr = clip(out.stderr || '');
      let passed = false;
      let message = '';

      if (!out.ok) {
        message = out.message || '执行失败';
        // 区分"环境问题"与"代码问题"，避免学生以为是自己的错
        if (/超时|timeout/i.test(message)) message = `测试超时：${message}`;
        if (/Pyodide|WebAssembly|无法加载/.test(message)) message = `运行环境不可用：${message}`;
      } else {
        const failMatch = /__CPL_FAIL__([\s\S]*)$/.exec(stdout);
        if (failMatch) {
          passed = false;
          message = failMatch[1].trim();
          stdout = stdout.replace(/__CPL_FAIL__[\s\S]*$/, '');
        } else {
          passed = true;
        }
        if (!passed && !message) message = '断言失败（未给出原因，检查 assert 是否写全）';
        if (stderr) {
          // stderr 里有 traceback 但断言通过了（例如学生自己 print 到 stderr），只提示不判负
          message = message || '';
        }
      }

      results.push({
        name: test.name,
        kind,
        passed,
        message: clip(message, 900),
        stdout,
        stderr,
        ms: Math.round(out.ms || 0),
        hint: test.hint || '',
      });
    }

    const passed = results.filter((r) => r.passed).length;
    const summary = { results, passed, total: tests.length, ms: Math.round(performance.now() - t0) };

    if (lesson && lesson.id && tests.length) {
      CPL.progress.recordRun(lesson.id, { passed, total: tests.length, ms: summary.ms });
      // 证据分：全部通过给该课程覆盖的技能 +0.4
      if (passed === tests.length && CPL.mastery) {
        for (const skill of CPL.mastery.skillsForLesson(lesson.id)) {
          CPL.mastery.addEvidence(skill.id, 0.4);
        }
      }
    }
    CPL.bus.emit('tests:finished', { lessonId: lesson && lesson.id, ...summary });
    return summary;
  };

  // ─────────────────────────────────────────────────────────────
  // 结果渲染
  // ─────────────────────────────────────────────────────────────
  runner.render = function render(summary) {
    const wrap = dom.h('div', { class: 'cpl-tests' });
    const allPassed = summary.total > 0 && summary.passed === summary.total;

    wrap.append(
      dom.h(
        'div',
        { class: `cpl-tests__summary ${allPassed ? 'is-pass' : summary.passed ? 'is-partial' : 'is-fail'}` },
        dom.h('span', { class: 'cpl-tests__score', text: `${summary.passed} / ${summary.total}` }),
        dom.h('span', { class: 'cpl-tests__label', text: allPassed ? '全部通过' : summary.passed ? '部分通过' : '未通过' }),
        dom.h('span', { class: 'cpl-tests__time', text: `${(summary.ms / 1000).toFixed(2)} s` })
      )
    );

    const list = dom.h('ul', { class: 'cpl-tests__list' });
    for (const r of summary.results) {
      const item = dom.h('li', { class: `cpl-tests__item ${r.passed ? 'is-pass' : 'is-fail'}` });
      item.append(
        dom.h(
          'div',
          { class: 'cpl-tests__head' },
          dom.h('span', { class: 'cpl-tests__icon', 'aria-hidden': 'true', text: r.passed ? '✓' : '✗' }),
          dom.h('span', { class: 'cpl-tests__name', text: r.name }),
          dom.h('span', { class: 'cpl-tests__kind', text: r.kind }),
          r.ms ? dom.h('span', { class: 'cpl-tests__ms', text: `${r.ms} ms` }) : null
        )
      );
      if (r.message) {
        item.append(dom.h('pre', { class: 'cpl-tests__msg', text: r.message }));
      }
      if (r.stdout) {
        const details = dom.h('details', { class: 'cpl-tests__out' });
        details.append(dom.h('summary', { text: '程序输出' }), dom.h('pre', { text: r.stdout }));
        item.append(details);
      }
      list.append(item);
    }
    wrap.append(list);
    return wrap;
  };
})();
