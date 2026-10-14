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
const FOLDERS = ['labs', 'fortran', 'projects', 'cs-core', 'meta', 'user'];

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

/** 与 pieces/60-runtimes.js 的 buildRunCode 保持一致。 */
function buildRunCode(src) {
  const lines = src.split('\n').map((l) => (l.length ? '    ' + l : ''));
  return [
    'import sys as _cpl_sys, io as _cpl_io',
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
    '_cpl_stdout_val = _cpl_out.getvalue()',
    '_cpl_stderr_val = _cpl_err.getvalue()',
  ].join('\n');
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
  if (res.error) return { ok: false, stdout: '', stderr: '', message: 'spawn 失败：' + res.error.message };
  if (res.status !== 0 && !res.stdout) {
    return { ok: false, stdout: '', stderr: String(res.stderr || ''), message: 'python 非零退出：' + String(res.stderr || '').split('\n').slice(0, 3).join(' | ') };
  }
  const stdout = String(res.stdout || '');
  const stderr = String(res.stderr || '');
  const fail = /__CPL_FAIL__([\s\S]*)$/.exec(stdout);
  if (fail) {
    return { ok: false, stdout: stdout.replace(/__CPL_FAIL__[\s\S]*$/, ''), stderr, message: fail[1].trim() };
  }
  return { ok: true, stdout, stderr };
}

/** 取断言的失败标记；成功时可能还有 __CPL_FAIL__ 之外的内容。 */
function runTest(lang, testDef, code) {
  const wrapped = wrapPythonTest(testDef.assert, code);
  return runPython(buildRunCode(wrapped));
}

const lessons = await loadAllLessons();

test('本机有 python 可用于验证 python 测试的语义（不可用时显式说明原因）', () => {
  if (PYTHON) {
    expect.ok(PYTHON, '应能找到 python');
    return;
  }
  // 明确打印跳过原因。**不要**让这一整套检查静默变绿：
  // "参考解全部通过"如果在没有解释器时也显示通过，那是自欺。
  console.log('# ⚠ 跳过 python 语义验证：' + PY.reason);
  console.log(`#   找到的解释器：${PY.exe || '（无）'}`);
  console.log('#   在正常开发机与 GitHub Actions（ubuntu-latest 自带 python3）上，这一整套检查会真正执行。');
  console.log('#   想在本机强制验证：直接运行 `python -c "..."` 或 `npm test`（不经受限沙箱）。');
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

  expect.ok(ran > 0, '一条 python 测试都没跑到，说明课程内容缺失');
  expect.equal(problems.length, 0, `共跑了 ${ran} 条 python 测试，以下参考解未通过：\n  - ${problems.join('\n  - ')}`);
});

test('起始代码（starter）应当无法通过复杂度类测试（证明测试真的有鉴别力）', () => {
  if (!PYTHON) return;
  // 只挑"名字里含复杂度/性能/量级"的计时类测试：starter 通常是暴力解，
  // 如果这类测试连 starter 都能通过，说明阈值太松、测试形同虚设。
  const checked = [];
  for (const lesson of lessons) {
    const ex = lesson.exercise;
    if (!ex || !ex.starter) continue;
    for (const t of lesson.tests || []) {
      if ((t.kind || 'python') !== 'python') continue;
      if (!/复杂度|性能|量级|规模翻倍|线性/.test(t.name)) continue;
      const res = runTest('python', t, ex.starter);
      checked.push({ lesson: lesson.id, name: t.name, starterPassed: res.ok, message: res.message });
    }
  }
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
  for (const lesson of lessons) {
    const ex = lesson.exercise;
    if (!ex || !ex.solution) continue;
    for (const t of lesson.tests || []) {
      if ((t.kind || 'python') !== 'python') continue;
      const t0 = Date.now();
      runTest('python', t, ex.solution);
      const ms = Date.now() - t0;
      // 12 秒是浏览器里的硬超时；这里要求参考解在 1/3 以内完成，留足余量
      if (ms > 4000) slow.push(`${lesson.id} / ${t.name}: ${ms} ms`);
    }
  }
  expect.equal(slow.length, 0, '以下测试太慢（浏览器里可能超时）：\n  ' + slow.join('\n  '));
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
