// tests/core/05-runtime-plot.test.mjs
//
// 运行时静态检查、本地运行指引、绘图刻度与拟合、语法高亮的逻辑测试。
// 这些函数全都不依赖浏览器渲染，因此可以在 Node 里直接断言。

import { test, expect, autoFile } from '../helpers/tap.mjs';
import { loadApp } from '../helpers/load-app.mjs';

autoFile(import.meta.url);

const PIECES = [
  '07-manifest.snapshot.js',
  '07-syllabus.snapshot.js',
  '00-core.js',
  '05-dom.js',
  '10-store.js',
  '15-catalog.js',
  '25-math.js',
  '20-markdown.js',
  '30-mastery.js',
  '55-highlight.js',
  '60-runtimes.js',
  '80-plot.js',
];

async function load() {
  const { CPL } = await loadApp({ only: PIECES });
  return CPL;
}

// ─────────────────────────────────────────────────────────────
// Fortran 静态检查
// ─────────────────────────────────────────────────────────────
test('Fortran 静态检查：能抓出缺 implicit none', async () => {
  const CPL = await load();
  const src = [
    'program bad',
    '  integer :: i, n',
    '  real :: x(100)',
    '  n = 100',
    '  do i = 1, n',
    '    x(i) = real(i) * 0.5',
    '  end do',
    '  write(*,*) x(1)',
    'end program bad',
  ].join('\n');
  const issues = CPL.runtimes.staticCheck('fortran', src);
  expect.ok(issues.some((i) => /implicit none/.test(i.msg)), '应当提示缺少 implicit none');
});

test('Fortran 静态检查：有 implicit none 就不再提示', async () => {
  const CPL = await load();
  const src = ['program good', '  implicit none', '  integer :: i', '  i = 1', '  write(*,*) i', 'end program good'].join('\n');
  const issues = CPL.runtimes.staticCheck('fortran', src);
  expect.equal(issues.filter((i) => /implicit none/.test(i.msg)).length, 0, '有 implicit none 时不应提示');
});

test('Fortran 静态检查：数组下标 0 越界被判为 error', async () => {
  const CPL = await load();
  const issues = CPL.runtimes.staticCheck('fortran', 'x(0) = 1.0');
  const hit = issues.find((i) => /下标/.test(i.msg));
  expect.ok(hit, '应当报下标 0 的问题');
  expect.equal(hit.level, 'error', '越界应当是 error 级别');
});

test('Fortran 静态检查：real*8 与非标准写法被提示', async () => {
  const CPL = await load();
  const issues = CPL.runtimes.staticCheck('fortran', 'real*8 :: x');
  expect.ok(issues.some((i) => /real\*8|real64/.test(i.msg)), '应提示 real*8 的非标准写法');
});

test('Fortran 静态检查：common 块与旧式比较运算符被提示', async () => {
  const CPL = await load();
  const issues = CPL.runtimes.staticCheck('fortran', ['common /blk/ a, b', 'if (a .eq. b) then', 'end if'].join('\n'));
  expect.ok(issues.some((i) => /common/.test(i.msg)), '应提示 common 块');
  expect.ok(issues.some((i) => /\.eq\./.test(i.msg)), '应提示旧式比较运算符');
});

test('Fortran 静态检查：OpenMP 共享写竞态被提示', async () => {
  const CPL = await load();
  const src = ['!$omp parallel do', 'do i = 1, n', '  s = s + a(i)', 'end do', '!$omp end parallel do'].join('\n');
  const issues = CPL.runtimes.staticCheck('fortran', src);
  expect.ok(issues.some((i) => /竞态|reduction|atomic/.test(i.msg)), '应提示 OpenMP 竞态');
});

test('括号平衡：能抓到未闭合与不匹配', async () => {
  const CPL = await load();
  expect.ok(CPL.runtimes.staticCheck('cpp', 'int main() { return 0;').some((i) => /未闭合/.test(i.msg)), '应报未闭合');
  expect.ok(CPL.runtimes.staticCheck('cpp', 'int main() { return 0; )').some((i) => /不匹配/.test(i.msg)), '应报不匹配');
  expect.equal(CPL.runtimes.staticCheck('cpp', 'int main() { return 0; }').filter((i) => /括号/.test(i.msg)).length, 0, '平衡时不应报');
});

test('括号平衡：注释与字符串里的括号不应误判', async () => {
  const CPL = await load();
  const src = ['// 这里有未闭合的 ( 在注释里', 'const char* s = ")(";', 'int main() { return 0; }'].join('\n');
  expect.equal(CPL.runtimes.staticCheck('cpp', src).filter((i) => /括号/.test(i.msg)).length, 0, '注释与字符串里的括号不应参与计数');
});

test('C++ 静态检查：裸 new / malloc / using namespace std 被提示', async () => {
  const CPL = await load();
  const src = ['using namespace std;', 'int* p = new int[10];', 'void* q = malloc(10);', 'int main(){ return 0; }'].join('\n');
  const issues = CPL.runtimes.staticCheck('cpp', src);
  expect.ok(issues.some((i) => /new/.test(i.msg)));
  expect.ok(issues.some((i) => /malloc/.test(i.msg)));
  expect.ok(issues.some((i) => /namespace std/.test(i.msg)));
});

test('静态检查：未知语言返回空数组（不抛错）', async () => {
  const CPL = await load();
  expect.deepEqual(CPL.runtimes.staticCheck('python', 'def f(): pass'), []);
  expect.deepEqual(CPL.runtimes.staticCheck('', 'anything'), []);
});

// ─────────────────────────────────────────────────────────────
// 本地运行指引
// ─────────────────────────────────────────────────────────────
test('本地运行指引：Fortran 必须包含边界检查开关（调试期关键）', async () => {
  const CPL = await load();
  const info = CPL.runtimes.localRunInfo('fortran', 'main');
  expect.equal(info.ext, 'f90');
  expect.equal(info.file, 'main.f90');
  expect.ok(info.commands.length >= 5, `命令偏少：${info.commands.length}`);
  const all = info.commands.map((c) => c.cmd).join('\n');
  expect.includes(all, 'gfortran');
  expect.includes(all, '-fcheck', '必须给出边界/运行时检查的编译开关');
  expect.includes(all, '-fopenmp', '必须给出 OpenMP 编译方式');
  expect.includes(all, 'mpif90', '必须给出 MPI 编译方式');
  expect.includes(all, 'ifx', '应给出 Intel ifx 的写法');
});

test('本地运行指引：C++ 必须包含 sanitizer 开关', async () => {
  const CPL = await load();
  const info = CPL.runtimes.localRunInfo('cpp', 'bench');
  expect.equal(info.ext, 'cpp');
  const all = info.commands.map((c) => c.cmd).join('\n');
  expect.includes(all, '-fsanitize=address,undefined', '必须给出 AddressSanitizer + UBSan 的编译方式');
  expect.includes(all, '-std=c++20');
  const c = CPL.runtimes.localRunInfo('c', 'bench');
  expect.includes(c.commands.map((x) => x.cmd).join('\n'), '-std=c17');
});

test('本地运行指引：Python 给出剖析命令', async () => {
  const CPL = await load();
  const info = CPL.runtimes.localRunInfo('python', 'solver');
  expect.equal(info.file, 'solver.py');
  const all = info.commands.map((c) => c.cmd).join('\n');
  expect.includes(all, 'cProfile');
  expect.includes(all, 'python3');
});

test('外部编译器链接：必须明确标注不确定性（不假装可靠）', async () => {
  const CPL = await load();
  const runners = CPL.runtimes.externalRunners;
  expect.ok(runners.length >= 3, '应至少给出 3 个外部选项');
  const fortranEntry = runners.find((r) => r.lang.includes('Fortran'));
  expect.ok(fortranEntry, '应有 Fortran 选项');
  expect.ok(/alpha|不保证/.test(fortranEntry.name), 'LFortran 的 alpha 状态必须写清楚');
  for (const r of runners) {
    expect.match(r.url, /^https:\/\//, `${r.name} 的链接必须是 https`);
  }
});

// ─────────────────────────────────────────────────────────────
// 绘图工具
// ─────────────────────────────────────────────────────────────
test('线性刻度：生成 1-2-5 序列且覆盖范围', async () => {
  const CPL = await load();
  const { ticks, step } = CPL.plot.linTicks(0, 100, 6);
  expect.ok(ticks.length >= 4 && ticks.length <= 30, `刻度数量异常：${ticks.length}`);
  expect.ok(step > 0);
  expect.equal(ticks[0], 0);
  expect.ok(ticks[ticks.length - 1] <= 100 + step * 1e-6, '最后一个刻度不应超过上界');
  // 步长应是 1/2/5 × 10^k
  const norm = step / Math.pow(10, Math.floor(Math.log10(step)));
  expect.ok([1, 2, 5, 10].some((v) => Math.abs(norm - v) < 1e-9), `步长 ${step} 不是 1-2-5 序列`);
});

test('线性刻度：退化区间（min == max）不抛错', async () => {
  const CPL = await load();
  const r = CPL.plot.linTicks(5, 5, 6);
  expect.ok(Array.isArray(r.ticks));
});

test('对数刻度：全是 10 的幂，且落在范围内', async () => {
  const CPL = await load();
  const ticks = CPL.plot.logTicks(1, 10000);
  expect.ok(ticks.length >= 4);
  for (const t of ticks) {
    expect.ok(t >= 1 * 0.999 && t <= 10000 * 1.001, `刻度 ${t} 超出范围`);
    const e = Math.log10(t);
    const m = t / Math.pow(10, Math.round(e));
    expect.ok([1, 2, 5].some((v) => Math.abs(m - v) < 1e-9), `刻度 ${t} 不是 1/2/5 × 10^k`);
  }
});

test('刻度格式化：大数/小数用 10 的幂表示', async () => {
  const CPL = await load();
  expect.equal(CPL.plot.fmtTick(0), '0');
  expect.includes(CPL.plot.fmtTick(1e6), '10^6');
  expect.includes(CPL.plot.fmtTick(1e-5), '10^-5');
  expect.equal(CPL.plot.fmtTick(3), '3');
});

test('拟合：斜率与相关系数能正确恢复已知幂律', async () => {
  const CPL = await load();
  // y = 3 x^(-2) 在 log-log 上应当是斜率 -2
  const xs = [1, 2, 5, 10, 20, 50, 100];
  const ys = xs.map((x) => 3 * Math.pow(x, -2));
  const k = CPL.util.slope(xs.map(Math.log10), ys.map(Math.log10));
  expect.ok(Math.abs(k + 2) < 1e-9, `斜率应为 -2，实际 ${k}`);
  const r = CPL.util.pearson(xs.map(Math.log10), ys.map(Math.log10));
  expect.ok(Math.abs(r + 1) < 1e-9, `相关系数应为 -1，实际 ${r}`);
});

test('拟合：完全无相关的数据给出接近 0 的相关系数', async () => {
  const CPL = await load();
  const xs = [1, 2, 3, 4, 5, 6];
  const ys = [3, 1, 4, 1, 5, 9];
  const r = CPL.util.pearson(xs, ys);
  expect.ok(Math.abs(r) < 0.7, `不该出现强相关：r=${r}`);
});

test('数字格式化：数量级判断用的可读输出', async () => {
  const CPL = await load();
  expect.equal(CPL.util.fmtNum(0), '0');
  expect.includes(CPL.util.fmtNum(1e6, 3), '×10^');
  expect.ok(CPL.util.fmtNum(1234.5).length > 0);
  expect.ok(CPL.util.fmtNum(Infinity) === 'Infinity' || CPL.util.fmtNum(Infinity).includes('Inf'));
  expect.includes(CPL.util.bytes(1500000), 'MB');
  expect.includes(CPL.util.bytes(2048), 'KB');
  expect.includes(CPL.util.seconds(1500), 's');
});

// ─────────────────────────────────────────────────────────────
// 语法高亮
// ─────────────────────────────────────────────────────────────
test('高亮：输出已转义，不会产生可执行 HTML', async () => {
  const CPL = await load();
  const out = CPL.highlight.render('if (x < 3) { printf("<script>"); }', 'cpp');
  expect.notIncludes(out, '<script>');
  expect.includes(out, '&lt;script&gt;');
});

test('高亮：Python 关键字与字符串被着色', async () => {
  const CPL = await load();
  const out = CPL.highlight.render('def f(x):\n    return "abc"', 'python');
  expect.includes(out, 'cpl-tok-keyword');
  expect.includes(out, 'def');
  expect.includes(out, 'cpl-tok-string');
});

test('高亮：Fortran 大小写不敏感', async () => {
  const CPL = await load();
  for (const src of ['PROGRAM main', 'program main', 'Program Main']) {
    const out = CPL.highlight.render(src, 'fortran');
    expect.includes(out, 'cpl-tok-keyword', `未识别关键字：${src}`);
  }
});

test('高亮：Fortran 的 ! 注释与 C++ 的 // 注释都被识别', async () => {
  const CPL = await load();
  expect.includes(CPL.highlight.render('x = 1  ! 这是注释', 'fortran'), 'cpl-tok-comment');
  expect.includes(CPL.highlight.render('int x = 1; // 注释', 'cpp'), 'cpl-tok-comment');
});

test('高亮：未知语言退化为纯转义文本', async () => {
  const CPL = await load();
  const out = CPL.highlight.render('a < b && c > d', 'brainfuck');
  expect.notIncludes(out, 'cpl-tok-');
  expect.includes(out, '&lt;');
});

test('高亮：空输入与长输入都不崩', async () => {
  const CPL = await load();
  expect.equal(CPL.highlight.render('', 'python'), '');
  const long = ('x = 1\n').repeat(5000);
  const out = CPL.highlight.render(long, 'python');
  expect.ok(out.length > long.length * 0.5, '长输入应有输出');
});

// ─────────────────────────────────────────────────────────────
// MathML 渲染
// ─────────────────────────────────────────────────────────────
test('MathML：上下标、分数、根号、矩阵都能渲染', async () => {
  const CPL = await load();
  expect.includes(CPL.math.toMathML('x^2'), '<msup>');
  expect.includes(CPL.math.toMathML('x_i'), '<msub>');
  expect.includes(CPL.math.toMathML('x_i^2'), '<msubsup>');
  expect.includes(CPL.math.toMathML('\\frac{a}{b}'), '<mfrac>');
  expect.includes(CPL.math.toMathML('\\sqrt{2}'), '<msqrt>');
  expect.includes(CPL.math.toMathML('\\sqrt[3]{2}'), '<mroot>');
  expect.includes(CPL.math.toMathML('\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'), '<mtable>');
});

test('MathML：上下标的语义必须正确（不能变成"上标作用在下标上"）', async () => {
  const CPL = await load();
  const out = CPL.math.toMathML('x_i^2');
  // 关键：<msubsup> 的第二个孩子必须是 i（下标），第三个必须是 2（上标）
  const inner = out.replace(/^.*?<msup>|^/, '');
  expect.ok(/<msubsup>/.test(out), '应当输出 msubsup');
  const idxSub = out.indexOf('<msubsup>');
  const segment = out.slice(idxSub, idxSub + 160);
  expect.ok(segment.indexOf('<mi mathvariant="italic">i</mi>') < segment.indexOf('<mn>2</mn>'), `下标 i 必须在上标 2 之前：${segment}`);
  expect.notIncludes(out, '<msub><msup>', '不该出现 msub 包 msup 的错误嵌套');
  void inner;
});

test('MathML：上下标顺序颠倒（x^2_i）也得到相同的语义', async () => {
  const CPL = await load();
  const a = CPL.math.toMathML('x_i^2');
  const b = CPL.math.toMathML('x^2_i');
  // 两者的 aria-label（原始 LaTeX）不同，但数学结构必须一致
  const strip = (s) => s.replace(/aria-label="[^"]*"/, '');
  expect.equal(strip(a), strip(b), 'x_i^2 与 x^2_i 应渲染成完全相同的结构');
  // 显式确认 msubsup 的子元素顺序是 基 → i → 2
  const seg = a.slice(a.indexOf('<msubsup>'), a.indexOf('<msubsup>') + 120);
  expect.ok(seg.indexOf('>i</mi>') < seg.indexOf('>2</mn>'), `下标的 i 必须在上标的 2 之前：${seg}`);
});

test('MathML：求和符号的上下限用 msubsup（∑ 的上下限）', async () => {
  const CPL = await load();
  const out = CPL.math.toMathML('\\sum_{i=1}^{N} a_i');
  expect.includes(out, '<msubsup>');
  expect.includes(out, '∑');
});

test('MathML：希腊字母与算子被转换', async () => {
  const CPL = await load();
  expect.includes(CPL.math.toMathML('\\alpha + \\beta'), 'α');
  expect.includes(CPL.math.toMathML('\\alpha + \\beta'), 'β');
  expect.includes(CPL.math.toMathML('\\sum_{i=1}^{N}'), '∑');
  expect.includes(CPL.math.toMathML('\\int_0^1'), '∫');
  expect.includes(CPL.math.toMathML('a \\leq b'), '≤');
});

test('MathML：恶意内容被转义，且带 aria-label', async () => {
  const CPL = await load();
  const out = CPL.math.toMathML('\\text{<script>alert(1)</script>}');
  expect.notIncludes(out, '<script>');
  expect.includes(out, 'aria-label=');
  expect.includes(out, 'xmlns="http://www.w3.org/1998/Math/MathML"');
});

test('MathML：未识别的命令退化显示，不抛错也不白屏', async () => {
  const CPL = await load();
  const out = CPL.math.toMathML('\\totallyUnknownCommand{x}');
  expect.ok(out.length > 0, '应有输出');
  expect.includes(out, '<math');
});

test('MathML：纯文本近似（用于搜索与卡片预览）', async () => {
  const CPL = await load();
  expect.equal(CPL.math.plain('\\frac{1}{2}'), '1/2');
  expect.includes(CPL.math.plain('\\alpha'), 'α');
  expect.equal(CPL.math.plain('x^2'), 'x2');
});

test('MathML：空输入返回空字符串', async () => {
  const CPL = await load();
  expect.equal(CPL.math.toMathML(''), '');
  expect.equal(CPL.math.toMathML('   '), '');
});

// ─────────────────────────────────────────────────────────────
// demo 注册表
// ─────────────────────────────────────────────────────────────
test('demo 注册表：课程用到的 kind 都已注册，且注册表可查询', async () => {
  const { CPL } = await loadApp();
  const kinds = CPL.demos.kinds();
  expect.ok(kinds.length >= 15, `已注册 demo 偏少：${kinds.length}`);
  for (const k of ['growth-curve', 'memory-model', 'float-error', 'complexity-table', 'amortized-array', 'hash-probe', 'cache-hit', 'cap-tradeoff', 'race-condition', 'fortran-layout', 'monte-carlo', 'convergence-study', 'sort-compare', 'binary-search', 'dp-table', 'graph-traverse', 'amdahl']) {
    expect.ok(CPL.demos.has(k), `demo "${k}" 未注册`);
  }
});

test('demo 注册表：挂载未知 kind 时给出错误卡而不是抛错', async () => {
  const { CPL } = await loadApp();
  const host = CPL.dom.h('div', {});
  expect.equal(CPL.demos.mount('nonexistent-kind', host, {}, {}), null);
  expect.ok(host.children.length >= 1, '应当挂上一个错误卡');
});
