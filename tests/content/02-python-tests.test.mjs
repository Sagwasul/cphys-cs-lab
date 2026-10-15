// tests/content/02-python-tests.test.mjs
//
// ★ 这是最有价值的一条测试：把每节课的 python 自动测试**真的跑一遍**，
//   断言"用课程提供的参考解（solution）能全部通过"。
//
// 为什么必须做：
//   课程页里的 python 测试最终要在 Pyodide 里执行。如果断言本身写错了
//   （变量名不对、依赖外部作用域、用了 global、数值阈值不合理），
//   学生即使写对了也会看到"测试失败"——这是最伤人的一种 bug。
//   在 CI 里用本机 CPython 跑一遍，就能在发布前把它拦住。
//
// 执行模型与浏览器完全一致：
//   外层：buildRunCode 把用户代码包进 try 里并捕获 stdout/stderr
//   内层：wrapPythonTest 把 用户代码 + 断言代码 一起 exec 进同一个命名空间
//   判定：stdout 里出现 __CPL_FAIL__ 即失败
//
// 没有 python 时自动跳过（不把环境问题伪装成测试失败）。

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test, expect, autoFile } from '../helpers/tap.mjs';
import { loadApp, ROOT_DIR } from '../helpers/load-app.mjs';

autoFile(import.meta.url);

const CONTENT = join(ROOT_DIR, 'content');
const FOLDERS = ['basics', 'labs', 'fortran', 'projects', 'cs-core', 'meta', 'user'];

/**
 * 找一个可用的 python 解释器。
 * 返回 { exe, runnable, reason }：
 *   · 找到且能执行 → runnable=true
 *   · 磁盘上有但沙箱禁止 spawn → runnable=false，reason 说明原因
 *     （这种情况下语义验证会被跳过，但必须**显式说明**，不能静默绿）
 */
function findPython() {
  const candidates = ['python', 'python3', 'py'];
  for (const exe of candidates) {
    const r = spawnSync(exe, ['-c', 'print(1)'], { stdio: ['ignore', 'pipe', 'ignore'] });
    if (!r.error && r.status === 0) return { exe, runnable: true, reason: '' };
    if (r.error && /EPERM|EACCES/i.test(String(r.error.code || r.error.message))) {
      // 沙箱禁止创建管道 → spawnSync 永远失败，即使解释器存在
      const found = findOnDisk(candidates);
      return {
        exe: found || exe,
        runnable: false,
        reason: `沙箱禁止子进程管道通信（${r.error.code}）${found ? `，但磁盘上存在 ${found}` : ''}`,
      };
    }
  }
  return { exe: null, runnable: false, reason: 'PATH 上找不到 python' };
}

/** 在 PATH 上找可执行文件（不 spawn）。 */
function findOnDisk(candidates) {
  const dirs = String(process.env.PATH || '').split(process.platform === 'win32' ? ';' : ':');
  const exts = process.platform === 'win32' ? ['.exe', '.cmd', '.bat', ''] : [''];
  for (const name of candidates) {
    for (const dir of dirs) {
      if (!dir) continue;
      for (const ext of exts) {
        const p = join(dir, name + ext);
        try {
          if (existsSync(p)) return p;
        } catch {
          /* 忽略无权限的目录 */
        }
      }
    }
  }
  return null;
}

const PY = findPython();
const PYTHON = PY.runnable ? PY.exe : null;

function collectLessonFiles() {
  const out = [];
  for (const folder of FOLDERS) {
    const dir = join(CONTENT, folder);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith('.js') || name.startsWith('_')) continue;
      out.push({ folder, file: join(dir, name), rel: `content/${folder}/${name}` });
    }
  }
  return out;
}

async function loadAllLessons() {
  const { win, CPL } = await loadApp({
    only: ['07-manifest.snapshot.js', '07-syllabus.snapshot.js', '00-core.js', '05-dom.js', '10-store.js', '15-catalog.js', '25-math.js', '20-markdown.js', '30-mastery.js'],
  });
  const vm = await import('node:vm');
  const context = vm.createContext(win);
  for (const f of collectLessonFiles()) {
    try {
      new vm.Script(readFileSync(f.file, 'utf8'), { filename: f.file }).runInContext(context, { timeout: 10000 });
    } catch {
      /* 语法/加载错误由 01-integrity 报告，这里忽略 */
    }
  }
  return CPL.catalog.loadedIds().map((id) => CPL.catalog.get(id));
}

// ─────────────────────────────────────────────────────────────
// 输出协议（必须与 pieces/60-runtimes.js 的 buildRunCode 完全一致）
//
// ⚠ 这里曾经有一个致命缺陷，值得留档：
//   旧版把 `_cpl_out.getvalue()` 当作**最后一条语句**，指望它的值被打印出来。
//   但 Python 只在**交互式 REPL** 里显示表达式结果，`python -c` 不会。
//   于是子进程 stdout 恒为空 → `__CPL_FAIL__` 永远检测不到 →
//   "参考解全部通过" 与 "starter 应被拦下" 两条检查**恒为绿，形同虚设**。
//   而且这个缺陷在受限沙箱里完全看不出来，因为沙箱会直接跳过整个 python 验证。
//   （同源缺陷此前也在 scripts/verify-python.mjs 里出现过，已修。）
//   修法：显式 write 到 sys.__stdout__，并用不可打印字符做分隔；
//   同时下面加了一条 harness 自检，用"必然失败的断言"证明检测能力真的存在。
// ─────────────────────────────────────────────────────────────
const OUT_MARK = '\u001eCPL_OUT\u001e';
const ERR_MARK = '\u001cCPL_ERR\u001c';
const END_MARK = '\u001d';

function buildRunCode(src) {
  const lines = src.split('\n').map((l) => (l.length ? '    ' + l : ''));
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

/** 从子进程 stdout 里解出捕获到的 (stdout, stderr)。 */
function unpack(raw) {
  const s = String(raw || '');
  const a = s.indexOf(OUT_MARK);
  if (a < 0) return { stdout: s, stderr: '', packed: false };
  const b = s.indexOf(ERR_MARK, a + OUT_MARK.length);
  if (b < 0) return { stdout: s.slice(a + OUT_MARK.length), stderr: '', packed: false };
  const c = s.indexOf(END_MARK, b + ERR_MARK.length);
  return {
    stdout: s.slice(a + OUT_MARK.length, b),
    stderr: c < 0 ? s.slice(b + ERR_MARK.length) : s.slice(b + ERR_MARK.length, c),
    packed: true,
  };
}

/** 与 pieces/50-tests.js 的 wrapPythonTest 保持一致。 */
function wrapPythonTest(assertSrc, userCode) {
  return [
    'import io as _cpl_io, traceback as _cpl_tb',
    `_cpl_user = ${JSON.stringify(userCode)}`,
    `_cpl_test = ${JSON.stringify(assertSrc)}`,
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
 * 在本地 CPython 里执行一段代码，返回 {ok, stdout, stderr, message}。
 * 注意：通过 -c 传代码而不是 stdin，避免在受限环境里依赖管道。
 */
function runPython(code, timeoutMs = 30000) {
  const res = spawnSync(PYTHON, ['-c', code], {
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: timeoutMs,
    maxBuffer: 8 * 1024 * 1024,
    encoding: 'utf8',
  });
  // spawnSync 超时时 status 为 null 且没有 stdout；必须显式区分，否则会把"超时"当成"通过"
  if (res.error) {
    const killed = res.error.code === 'ETIMEDOUT' || Boolean(res.signal);
    return { ok: false, stdout: '', stderr: '', message: killed ? `执行超时（>${Math.round(timeoutMs / 1000)} 秒）` : 'spawn 失败：' + res.error.message };
  }
  if (res.signal) return { ok: false, stdout: '', stderr: '', message: `被信号终止：${res.signal}` };

  const { stdout: capOut, stderr: capErr, packed } = unpack(String(res.stdout || ''));
  if (!packed) {
    return {
      ok: false,
      stdout: '',
      stderr: capErr,
      message: '未能解析捕获输出（python 可能没跑完包装代码）：' + JSON.stringify(String(res.stderr || res.stdout || '').slice(0, 200)),
    };
  }
  const fail = /__CPL_FAIL__([\s\S]*)$/.exec(capOut);
  if (fail) {
    return { ok: false, stdout: capOut.replace(/__CPL_FAIL__[\s\S]*$/, ''), stderr: capErr, message: fail[1].trim() };
  }
  return { ok: true, stdout: capOut, stderr: capErr };
}

/**
 * 取断言的失败标记；成功时可能还有 __CPL_FAIL__ 之外的内容。
 *
 * 超时策略：**尊重测试自己声明的 timeoutMs**（课程作者按浏览器 12 秒硬超时来定），
 * 只做很窄的兜底，避免被错误配置拖死：
 *   · 下限 3 秒 —— 防止有人把 timeoutMs 写成 0/负数导致测试毫无预算
 *   · 上限 30 秒 —— 防止某条测试把整个 CI 预算吃光
 *   · grace 倍率 —— 检查 starter 时给一点点余量，让"到底会不会超时"更公平；
 *     但余量必须小，否则暴力解只要比参考解稍慢就能蒙混过关。
 *
 * 早期版本把下限硬写成 30 秒，直接忽略了课程声明的 timeoutMs=8000，
 * 结果三条暴力解各跑满 30 秒，光这一项就吃掉 91 秒。
 */
function runTest(lang, testDef, code, opts = {}) {
  const declared = Number(testDef && testDef.timeoutMs) || 8000;
  const grace = Number(opts.grace) || 1;
  const budget = Math.min(Math.max(Math.round(declared * grace), 3000), 30000);
  const wrapped = wrapPythonTest(testDef.assert, code);
  return runPython(buildRunCode(wrapped), budget);
}

const lessons = await loadAllLessons();

/**
 * 环境诊断横幅。
 *
 * 为什么需要它：这套检查的结果**依赖运行环境**（python 版本、第三方包是否装了、
 * runner 快不快）。此前 CI 报"第 5 步失败"时，日志里只有测试名，看不出是哪个
 * 环境因素导致的，排查只能靠猜。把环境信息在开头一次性打出来，
 * 之后任何失败都能立刻对上号。
 */
function diagnosticsBanner() {
  const lines = [];
  lines.push(`# 环境：node ${process.version} · ${process.platform} · python ${PY.exe || '（无）'}`);
  if (process.env.CI) {
    lines.push(`# CI：${process.env.CI} · RUNNER_OS=${process.env.RUNNER_OS || '?'} · RUNNER_ARCH=${process.env.RUNNER_ARCH || '?'}`);
  }
  if (PYTHON) {
    const v = spawnSync(PYTHON, ['-c', 'import sys; print(".".join(map(str, sys.version_info[:3])))'], {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    });
    lines.push(`# python 版本：${String(v.stdout || '').trim() || '未知'}`);
  }
  // 课程里有用到第三方包的测试；缺包会让"参考解未通过"，但那是环境问题不是内容问题，
  // 必须一眼能区分，否则会去改根本没坏的课程。
  if (PYTHON) {
    for (const mod of ['numpy']) {
      const r = spawnSync(PYTHON, ['-c', `import ${mod}`], { stdio: ['ignore', 'ignore', 'ignore'] });
      lines.push(`# 第三方包 ${mod}：${r.status === 0 ? '可用' : '缺失（依赖它的课程测试会失败，属环境问题）'}`);
    }
  }
  console.log(lines.join('\n'));
}

test('本机有 python 可用于验证 python 测试的语义（不可用时显式说明原因）', () => {
  if (PYTHON) {
    expect.ok(PYTHON, '应能找到 python');
    diagnosticsBanner();
    return;
  }
  // 明确打印跳过原因。**不要**让这一整套检查静默变绿：
  // "参考解全部通过"如果在没有解释器时也显示通过，那是自欺。
  console.log('# ⚠ 跳过 python 语义验证：' + PY.reason);
  console.log(`#   找到的解释器：${PY.exe || '（无）'}`);
  console.log('#   在正常开发机与 GitHub Actions（ubuntu-latest 自带 python3）上，这一整套检查会真正执行。');
  console.log('#   想在本机强制验证：直接运行 `python -c "..."` 或 `npm test`（不经受限沙箱）。');
});

test('harness 自检：这套检测真的能发现失败（否则下面所有结论都不可信）', () => {
  if (!PYTHON) return;
  // 用"必然为假"的断言跑一遍。如果它被判为通过，说明输出捕获协议坏了，
  // 那么"参考解全部通过"这类结论就毫无意义——必须立刻失败。
  const mustFail = runTest('python', { assert: 'assert 1 + 1 == 3, "自检：这个断言必须失败"' }, 'x = 1');
  expect.equal(mustFail.ok, false, '一个必然为假的断言竟然被判为通过 → 输出捕获协议已坏，语义验证不可信');

  const mustPass = runTest('python', { assert: 'assert 1 + 1 == 2' }, 'x = 1');
  expect.equal(mustPass.ok, true, '一个必然为真的断言被判为失败：' + mustPass.message);

  // 断言必须能看到用户代码里定义的东西（命名空间共享）
  const shared = runTest('python', { assert: 'assert compute() == 42' }, 'def compute():\n    return 42');
  expect.equal(shared.ok, true, '断言看不到用户代码定义的函数：' + shared.message);
});

test('全部课程的参考解（solution）都能通过它自己的 python 自动测试', () => {
  if (!PYTHON) return;
  const problems = [];
  let ran = 0;

  for (const lesson of lessons) {
    const ex = lesson.exercise;
    const pyTests = (lesson.tests || []).filter((t) => (t.kind || 'python') === 'python');
    if (!pyTests.length) continue;
    if (!ex || !ex.solution) {
      problems.push(`${lesson.id}: 有 python 测试但没有 exercise.solution，无法验证`);
      continue;
    }
    for (const t of pyTests) {
      ran++;
      const res = runTest('python', t, ex.solution);
      if (!res.ok) {
        problems.push(`${lesson.id} / ${t.name}\n      参考解未通过：${res.message}`);
      }
    }
  }

  const detail = problems.map((p, i) => `    ${i + 1}. ${p}`).join('\n');
  // 先独立打印一份完整清单：CI 日志里断言消息可能被截断，
  // 而这份清单是定位问题唯一的依据，必须在最后单独出现一次。
  if (problems.length) {
    console.log('');
    console.log(`# ✗ 参考解失败清单（共 ${problems.length} 条，环境：见上方横幅）`);
    console.log(detail);
    console.log('');
  }
  expect.ok(ran > 0, '一条 python 测试都没跑到，说明课程内容缺失');
  expect.equal(problems.length, 0, `共跑了 ${ran} 条 python 测试，以下参考解未通过：\n${detail}`);
});

test('起始代码（starter）应当无法通过复杂度类测试（证明测试真的有鉴别力）', () => {
  if (!PYTHON) return;
  // 只挑"名字里含复杂度/性能/量级"的计时类测试：starter 通常是暴力解，
  // 如果这类测试连 starter 都能通过，说明阈值太松、测试形同虚设。
  const checked = [];
  const t0All = Date.now();
  for (const lesson of lessons) {
    const ex = lesson.exercise;
    if (!ex || !ex.starter) continue;
    for (const t of lesson.tests || []) {
      if ((t.kind || 'python') !== 'python') continue;
      if (!/复杂度|性能|量级|规模翻倍|线性/.test(t.name)) continue;
      const t0 = Date.now();
      // starter 给 1.2 倍余量：参考解与暴力解在临界点上不应因为几十毫秒的抖动
      // 得到相反结论；但余量必须小，否则"慢一点的暴力解"会被误判为通过。
      const res = runTest('python', t, ex.starter, { grace: 1.2 });
      const ms = Date.now() - t0;
      // 单条超过 10 秒就打印出来：这一项在慢机器上可能吃掉整个测试预算
      if (ms > 10000) {
        console.log(`#   starter 慢用例：${lesson.id} / ${t.name} — ${(ms / 1000).toFixed(1)}s（${res.ok ? '通过' : '被拦下'}）`);
      }
      checked.push({ lesson: lesson.id, name: t.name, starterPassed: res.ok, message: res.message, ms });
    }
  }
  console.log(
    `# starter 鉴别力检查：${checked.length} 条 · 合计 ${((Date.now() - t0All) / 1000).toFixed(1)}s · 最慢 ${Math.max(0, ...checked.map((c) => c.ms))}ms`
  );
  if (!checked.length) {
    console.log('# 没有找到计时类测试，跳过鉴别力检查');
    return;
  }
  const tooLoose = checked.filter((c) => c.starterPassed);
  // 不强制失败：有些题目的 starter 只是"未完成"而不是"暴力解"，
  // 但计时类测试若连暴力解都放行，是明确的信号，需要人工看一眼。
  if (tooLoose.length) {
    console.log('# 以下计时类测试 starter 也能通过（阈值可能太松，建议检查）：');
    for (const c of tooLoose) console.log(`#   - ${c.lesson} / ${c.name}`);
  }
  expect.ok(checked.length > 0, '计时类测试应当存在');
});

test('静态测试（kind:static）的规则本身是合法正则', () => {
  const problems = [];
  for (const lesson of lessons) {
    for (const t of lesson.tests || []) {
      if (t.kind !== 'static') continue;
      for (const rule of t.rules || []) {
        for (const key of ['mustMatch', 'mustNotMatch']) {
          if (!rule[key]) continue;
          try {
            new RegExp(rule[key], rule.flags || 'm');
          } catch (err) {
            problems.push(`${lesson.id} / ${t.name} / ${key}: 正则非法 — ${err.message}`);
          }
        }
      }
    }
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('静态测试：参考解必须通过（规则写错会把正确实现误杀）', () => {
  const problems = [];
  for (const lesson of lessons) {
    const ex = lesson.exercise;
    const staticTests = (lesson.tests || []).filter((t) => t.kind === 'static');
    if (!staticTests.length) continue;
    for (const t of staticTests) {
      const fail = firstRuleFailure(t, ex && ex.solution);
      if (fail) problems.push(`${lesson.id} / ${t.name}: 参考解未通过 — ${fail}`);
    }
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('静态测试：起始代码必须被拦下（否则这条测试没有鉴别力）', () => {
  const problems = [];
  let checked = 0;
  for (const lesson of lessons) {
    const ex = lesson.exercise;
    if (!ex || typeof ex.starter !== 'string') continue;
    for (const t of (lesson.tests || []).filter((x) => x.kind === 'static')) {
      checked++;
      const fail = firstRuleFailure(t, ex.starter);
      if (!fail) {
        problems.push(`${lesson.id} / ${t.name}: starter 也通过了静态测试——规则太松，等于没测`);
      }
    }
  }
  if (!checked) {
    console.log('# 没有 static 测试，跳过鉴别力检查');
    return;
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

/** 返回第一条被违反的规则说明；全部通过返回 null。 */
function firstRuleFailure(testDef, code) {
  if (typeof code !== 'string') return '没有可检查的代码';
  const strip = stripCommentsAndStrings;
  for (const rule of testDef.rules || []) {
    const src = rule.target === 'raw' ? code : strip(code);
    try {
      if (rule.mustMatch && !new RegExp(rule.mustMatch, rule.flags || 'm').test(src)) {
        return `应匹配 ${rule.mustMatch}`;
      }
      if (rule.mustNotMatch && new RegExp(rule.mustNotMatch, rule.flags || 'm').test(src)) {
        return `不应匹配 ${rule.mustNotMatch}`;
      }
      if (rule.minLength && src.length < rule.minLength) {
        return `可执行代码长度 ${src.length} < ${rule.minLength}`;
      }
    } catch (err) {
      return '规则本身有误：' + err.message;
    }
  }
  return null;
}

/**
 * 与 pieces/50-tests.js 的 stripCommentsAndStrings 保持一致。
 * 作用：static 规则只应看到"可执行代码"，否则 starter 里的
 * "TODO: 用 heapq" 这种注释会让规则永远通过。
 */
function stripCommentsAndStrings(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if ((c === '"' || c === "'") && src[i + 1] === c && src[i + 2] === c) {
      const q = c + c + c;
      i += 3;
      const end = src.indexOf(q, i);
      i = end < 0 ? n : end + 3;
      out += '""';
      continue;
    }
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
    if (c === '#') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

test('python 测试的执行时间在可接受范围内（防止学生等太久）', () => {
  if (!PYTHON) return;
  const slow = [];
  const timings = [];
  let worst = { ms: 0, who: '（无）' };
  const t0All = Date.now();
  for (const lesson of lessons) {
    const ex = lesson.exercise;
    if (!ex || !ex.solution) continue;
    for (const t of lesson.tests || []) {
      if ((t.kind || 'python') !== 'python') continue;
      const t0 = Date.now();
      runTest('python', t, ex.solution);
      const ms = Date.now() - t0;
      timings.push(ms);
      if (ms > worst.ms) worst = { ms, who: `${lesson.id} / ${t.name}` };
      // 12 秒是浏览器里的硬超时。这里要求参考解远快于它。
      // 阈值放到 6 秒：CI runner 上每个用例都要新建一个 python 进程，
      // 进程启动本身就要几十到上百毫秒，4 秒阈值曾在 CI 上误报。
      // 真正要拦的是"学生要等十几秒"的用例，6 秒足够严格。
      if (ms > 6000) slow.push(`${lesson.id} / ${t.name}: ${ms} ms`);
    }
  }
  const totalMs = Date.now() - t0All;
  const avg = timings.length ? Math.round(timings.reduce((a, b) => a + b, 0) / timings.length) : 0;
  const sorted = [...timings].sort((a, b) => b - a);
  // 无论成败都打印概要：CI 上失败时这段信息是唯一的线索
  console.log(
    `# python 语义验证耗时：${timings.length} 条用例 · 合计 ${(totalMs / 1000).toFixed(1)}s · 平均 ${avg}ms · 最慢 ${worst.ms}ms（${worst.who}）`
  );
  console.log(`#   最慢 5 条：${sorted.slice(0, 5).join('ms, ')}ms`);
  expect.equal(
    slow.length,
    0,
    '以下测试太慢（浏览器里 12 秒硬超时，参考解就逼近会让学生体验很差）：\n  ' + slow.join('\n  ')
  );
});

test('exercise 语言与测试类型匹配（fortran/cpp 的练习只能用静态测试）', () => {
  const problems = [];
  for (const lesson of lessons) {
    const ex = lesson.exercise;
    if (!ex) continue;
    const lang = (ex.lang || 'python').toLowerCase();
    if (lang === 'python') continue;
    for (const t of lesson.tests || []) {
      if ((t.kind || 'python') === 'python') {
        problems.push(`${lesson.id}: 练习语言是 ${lang}，但存在 python 测试（浏览器里跑不了 ${lang}）`);
      }
    }
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});
