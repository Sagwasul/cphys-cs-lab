// scripts/verify-python.mjs
//
// 用本机 CPython **真的跑一遍**每节课的 python 自动测试，断言：
//   1. 课程提供的参考解（exercise.solution）能通过该课全部 python 测试；
//   2. 性能/复杂度类测试能拦下起始代码（starter）——否则那条测试没有鉴别力；
//   3. 每条测试的耗时远低于浏览器里 12 秒的硬超时。
//
// 为什么单独做成脚本而不是塞进 node:test：
//   受限沙箱禁止子进程管道通信（spawnSync EPERM），而 node:test 的 runner 也需要 spawn。
//   独立出来可以让 CI（ubuntu-latest 自带 python3）与任何正常开发机直接跑：
//     node scripts/verify-python.mjs
//   受限环境里它会明确报告"无法执行"并以退出码 2 退出，而不是假装通过。
//
// ── 这个脚本本身踩过的一个坑，值得记下来 ──────────────────────────
//   最初 buildRunCode 把 `_cpl_out.getvalue()` 当作最后一条语句，指望
//   "表达式结果被打印出来"。但 Python 只在**交互式 REPL** 里这么做；
//   `python -c` 与 Pyodide 的 runPython 都不会。于是子进程 stdout 恒为空，
//   所有断言都被判为"通过"——测试套件全绿但什么都没测到。
//   发现方式：故意用一个必然失败的断言（assert 1 + 1 == 3）跑一遍，
//   发现它也被判为通过。**测试代码本身也需要被测试。**
//   现在改为显式 write 到 sys.__stdout__，并用分隔符标记边界；
//   而且脚本开头就有一步 harness 自检，坏掉就立刻退出。

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { loadApp } from '../tests/helpers/load-app.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'content');
const FOLDERS = ['labs', 'fortran', 'projects', 'cs-core', 'meta', 'user'];

const DEBUG = process.env.VERIFY_PYTHON_DEBUG === '1';

// ── 输出协议（必须与 pieces/60-runtimes.js 的 buildRunCode 保持一致）──
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

/** 从子进程 stdout 里解出 (stdout, stderr)。 */
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

// 与 pieces/50-tests.js 的 wrapPythonTest 一致
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

function findPython() {
  for (const exe of ['python3', 'python', 'py']) {
    const r = spawnSync(exe, ['-c', 'import sys; print(sys.version_info[0])'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
    });
    if (r.error) {
      const code = String(r.error.code || '');
      if (/EPERM|EACCES/.test(code)) {
        console.error('\n无法在本环境执行子进程（' + code + '）。');
        console.error('这说明当前沙箱禁止管道通信，与本项目的代码无关。');
        console.error('请在正常开发机或 GitHub Actions 上运行：node scripts/verify-python.mjs\n');
        process.exit(2);
      }
      continue;
    }
    if (r.status === 0) return { exe, version: String(r.stdout).trim() };
  }
  return null;
}

const py = findPython();
if (!py) {
  console.error('\n找不到 python 解释器。请安装 Python 3.10+ 后重试。\n');
  process.exit(2);
}

// ─────────────────────────────────────────────────────────────
// 加载课程（在 DOM 桩里执行 content 文件，拿到注册表）
// ─────────────────────────────────────────────────────────────
const { win, CPL } = await loadApp({
  only: ['07-manifest.snapshot.js', '07-syllabus.snapshot.js', '00-core.js', '05-dom.js', '10-store.js', '15-catalog.js', '25-math.js', '20-markdown.js', '30-mastery.js'],
});
const vm = await import('node:vm');
const ctx = vm.createContext(win);

const loadErrors = [];
for (const folder of FOLDERS) {
  const dir = join(CONTENT, folder);
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.js') || name.startsWith('_')) continue;
    const file = join(dir, name);
    try {
      new vm.Script(readFileSync(file, 'utf8'), { filename: `content/${folder}/${name}` }).runInContext(ctx, { timeout: 10000 });
    } catch (err) {
      loadErrors.push(`content/${folder}/${name}: ${err.message}`);
    }
  }
}

const lessons = CPL.catalog
  .loadedIds()
  .map((id) => CPL.catalog.get(id))
  .sort((a, b) => (a.week || 0) - (b.week || 0) || String(a.id).localeCompare(String(b.id)));

console.log(`\nPython 语义验证`);
console.log(`解释器：${py.exe}（Python ${py.version}）`);
console.log(`课程数：${lessons.length}`);

function runPython(code, timeoutMs = 60000) {
  // 通过 -c 传代码（避免依赖 stdin 管道）
  const res = spawnSync(py.exe, ['-c', code], {
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: timeoutMs,
    maxBuffer: 8 * 1024 * 1024,
    encoding: 'utf8',
  });
  // spawnSync 超时/被杀时 status 为 null 且没有 stdout —— 必须显式区分三态，
  // 否则"超时"会被误判为"通过"。
  if (res.error) {
    const killed = res.error.code === 'ETIMEDOUT' || Boolean(res.signal);
    return {
      ok: false,
      timedOut: true,
      message: killed ? `执行超时（>${Math.round(timeoutMs / 1000)} 秒）` : 'spawn 失败：' + res.error.message,
    };
  }
  if (res.signal) return { ok: false, timedOut: true, message: `被信号终止：${res.signal}` };

  const raw = String(res.stdout || '');
  const { stdout, stderr, packed } = unpack(raw);
  if (!packed) {
    // 解不出协议头，说明 Python 连包装代码都没跑完（例如最外层语法错误）
    return {
      ok: false,
      message: '未能解析捕获输出（子进程可能启动失败）: ' + JSON.stringify((stderr || raw).slice(0, 200)),
    };
  }
  const fail = /__CPL_FAIL__([\s\S]*)$/.exec(stdout);
  if (fail) return { ok: false, message: fail[1].trim() };
  return { ok: true, message: '' };
}

/**
 * 判断一条测试是不是"性能/鉴别力"类。
 *
 * 只有这一类必须拦住 starter：题目给的 starter 通常是"正确但慢的暴力解"，
 * 正确性测试当然应该放行它（它确实算对了），但性能测试必须拦下它，
 * 否则那条测试就没有意义。
 *
 * 不要用"内存/量级/线性"这类过宽的词——会误伤"内存语义：切片是视图"
 * 这种其实是正确性测试的名字。只认真正描述缩放的措辞。
 */
const PERF_RE = /规模翻倍|复杂度|耗时增长|次线性|快至少|下标访问计数|O\(N[²2]?\)/;
const PERF_EXCLUDE = /内存语义|切片是视图|加速比上限/;

// ─────────────────────────────────────────────────────────────
// 自检：先证明这套 harness 能分辨对错，再拿它去测课程
// ─────────────────────────────────────────────────────────────
{
  const shouldFail = runPython(buildRunCode(wrapPythonTest('assert 1 + 1 == 3, "自检：这个断言必须失败"', 'x = 1')));
  const shouldPass = runPython(buildRunCode(wrapPythonTest('assert 1 + 1 == 2', 'x = 1')));
  const shouldSeeShared = runPython(
    buildRunCode(
      wrapPythonTest(
        ['_seen = compute()', 'assert _seen == 42, f"用户代码里定义的函数没有被断言看到：{_seen}"'].join('\n'),
        ['def compute():', '    return 42'].join('\n')
      )
    )
  );
  if (shouldFail.ok) {
    console.error('\n✗ harness 自检失败：一个必然为假的断言被判为通过。');
    console.error('  说明输出捕获协议坏了，后续所有结论都不可信。\n');
    process.exit(3);
  }
  if (!shouldPass.ok) {
    console.error('\n✗ harness 自检失败：一个必然为真的断言被判为失败。');
    console.error('  原因：' + shouldPass.message + '\n');
    process.exit(3);
  }
  if (!shouldSeeShared.ok) {
    console.error('\n✗ harness 自检失败：断言看不到用户代码定义的东西（命名空间没有共享）。');
    console.error('  原因：' + shouldSeeShared.message + '\n');
    process.exit(3);
  }
  console.log('· harness 自检通过（能分辨通过/失败，且用户代码与断言共享命名空间）\n');
}

// ─────────────────────────────────────────────────────────────
// 主循环
// ─────────────────────────────────────────────────────────────
let solutionPass = 0;
let solutionFail = 0;
let starterRejected = 0;
let starterAcceptedPerf = 0;
let starterAcceptedCorrectness = 0;
let starterTimedOut = 0;
const slow = [];
const failures = [];
const perfAcceptsStarter = [];

for (const lesson of lessons) {
  const pyTests = (lesson.tests || []).filter((t) => (t.kind || 'python') === 'python');
  if (!pyTests.length) continue;
  const ex = lesson.exercise;
  if (!ex || !ex.solution) {
    console.log(`  ⚠ ${lesson.id}：有 python 测试但没有 exercise.solution，无法验证（${pyTests.length} 条）`);
    continue;
  }

  const line = [];
  for (const t of pyTests) {
    const t0 = Date.now();
    const resSol = runPython(buildRunCode(wrapPythonTest(t.assert, ex.solution)));
    const msSol = Date.now() - t0;
    if (msSol > 4000) slow.push(`${lesson.id} / ${t.name}: ${msSol} ms`);

    if (resSol.ok) {
      solutionPass++;
      line.push('·');
    } else {
      solutionFail++;
      line.push('S');
      failures.push(`参考解未通过：${lesson.id} / ${t.name}\n      ${resSol.message}`);
    }

    if (typeof ex.starter === 'string') {
      const isPerf = PERF_RE.test(t.name) && !PERF_EXCLUDE.test(t.name);
      const resStar = runPython(buildRunCode(wrapPythonTest(t.assert, ex.starter)), 30000);
      if (DEBUG) {
        console.log(
          `#   [starter] ${lesson.id} / ${t.name} => ok=${resStar.ok} timedOut=${Boolean(resStar.timedOut)} isPerf=${isPerf} msg=${String(resStar.message || '').slice(0, 120)}`
        );
      }
      if (resStar.ok) {
        if (isPerf) {
          starterAcceptedPerf++;
          line.push('P');
          perfAcceptsStarter.push(`${lesson.id} / ${t.name}`);
        } else {
          starterAcceptedCorrectness++;
          line.push('s');
        }
      } else if (resStar.timedOut) {
        starterTimedOut++;
        line.push('t');
      } else {
        starterRejected++;
      }
    }
  }
  console.log(`  ${lesson.id.padEnd(34)} ${pyTests.length} 条  [${line.join('')}]`);
}

console.log('\n' + '─'.repeat(66));
console.log(`参考解：${solutionPass} 通过 / ${solutionFail} 失败`);
console.log(
  `起始代码：${starterRejected} 条被拦下 · ${starterTimedOut} 条超时 · ${starterAcceptedCorrectness} 条正确性测试放行（正常）· ${starterAcceptedPerf} 条性能测试放行（需检查）`
);
console.log('  图例：· 参考解通过   s 正确性测试放行 starter（正常）   P 性能测试放行 starter（问题）   t starter 超时');

if (perfAcceptsStarter.length) {
  console.log(`\n⚠ 以下 ${perfAcceptsStarter.length} 条性能类测试连暴力解 starter 都能通过——`);
  console.log('  说明测试规模太小或阈值太松，无法区分 O(N) 与 O(N²)：');
  for (const s of perfAcceptsStarter) console.log('  ✗ ' + s);
}
if (loadErrors.length) {
  console.log(`\n课程文件加载失败 ${loadErrors.length} 个：`);
  for (const e of loadErrors) console.log('  ✗ ' + e);
}
if (slow.length) {
  console.log('\n耗时偏高（接近浏览器 12 秒硬超时，建议优化）：');
  for (const s of slow) console.log('  ⚠ ' + s);
}
if (failures.length) {
  console.log('\n参考解失败详情：');
  for (const f of failures) console.log('  ✗ ' + f);
}

console.log('');
// 退出码语义（刻意区分"硬错误"与"提示"）：
//
//   退出 1（硬错误）← 参考解有测试不通过，或课程文件加载失败。
//                     这一定是我或课程作者写错了，必须修。
//   退出 3（硬错误）← harness 自检失败（捕获协议坏了），结论不可信。
//   退出 0（仅提示）← 某些性能类测试连暴力解也能通过。
//
// 为什么"性能测试没拦下 starter"不判失败：
//   这类断言依赖**计时**，而计时在不同性能的机器上会抖动。同一份代码，
//   在开发机上能拦下、在更快的 CI runner 上可能就拦不下（反之亦然）。
//   把它当作失败，会让我们去追一个"随机器变化"的幻影，而掩盖真正的回归。
//   工程上的正确做法是：能用确定性判据的（结构断言、静态检查）就换成
//   确定性判据——本项目的 week-13（树高）与 user-example（静态检查）已经这么做了；
//   剩下这几条是"计时在物理上分不开"的，保留为提示，由人判断。
//   因此 CI 里这一步也配了 continue-on-error，报告但不阻断发布。
if (failures.length || loadErrors.length) {
  console.log('✗ 存在硬错误（参考解失败或课程加载失败），见上。\n');
  process.exit(1);
}
if (perfAcceptsStarter.length) {
  console.log(`✓ ${solutionPass} 条 Python 测试全部通过参考解。`);
  console.log(`ℹ 有 ${perfAcceptsStarter.length} 条性能类测试在本机未能拦下暴力解（计时抖动，不判失败）。`);
  console.log('  若想确认它们是否有效，请用 VERIFY_PYTHON_DEBUG=1 跑，或把判据改成确定性的。\n');
  process.exit(0);
}
console.log(`✓ ${solutionPass} 条 Python 测试全部通过参考解，且性能类测试都能拦下暴力解\n`);
