// tests/content/01-integrity.test.mjs
//
// **大纲完整性测试**：这是"每节课都有交互练习与自动测试"这条验收标准的机器保证。
//
// 做法：在 DOM 桩里先加载 00-core.js（提供 CPL.registerLesson），再逐个执行
// content/**/*.js（它们是"自注册"的经典脚本），然后把注册进来的课程对象
// 逐条对照 8 段式契约检查。加课如果漏了 demo 或测试，CI 会立刻失败。

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, autoFile } from '../helpers/tap.mjs';
import { loadApp, ROOT_DIR } from '../helpers/load-app.mjs';

autoFile(import.meta.url);

const CONTENT = join(ROOT_DIR, 'content');
const FOLDERS = ['basics', 'labs', 'fortran', 'projects', 'cs-core', 'meta', 'user'];

function collectLessonFiles() {
  const out = [];
  for (const folder of FOLDERS) {
    const dir = join(CONTENT, folder);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith('.js')) continue;
      if (name.startsWith('_')) continue; // 模板不参与
      out.push({ folder, file: join(dir, name), rel: `content/${folder}/${name}` });
    }
  }
  return out;
}

/** 加载课程：先在桩里建好 CPL，再执行每个课程文件。 */
async function loadAllLessons() {
  // 需要 15-catalog.js 来提供 CPL.registerLesson 与课程注册表
  const { win, CPL } = await loadApp({
    only: [
      '07-manifest.snapshot.js',
      '07-syllabus.snapshot.js',
      '00-core.js',
      '05-dom.js',
      '10-store.js',
      '15-catalog.js',
      '25-math.js',
      '20-markdown.js',
      '30-mastery.js',
    ],
  });
  const vm = await import('node:vm');
  const context = vm.createContext(win);
  const errors = [];
  const files = collectLessonFiles();
  for (const f of files) {
    try {
      new vm.Script(readFileSync(f.file, 'utf8'), { filename: f.file }).runInContext(context, { timeout: 10000 });
    } catch (err) {
      errors.push(`${f.rel}: ${err.message}`);
    }
  }
  const lessons = CPL.catalog ? CPL.catalog.loadedIds().map((id) => CPL.catalog.get(id)) : [];
  return { CPL, win, lessons, errors, files, context };
}

test('课程文件全部能被安全执行（无 import/export、无 eval）', async () => {
  const { errors, files } = await loadAllLessons();
  expect.equal(errors.length, 0, `有 ${errors.length} 个课程文件执行失败：\n  ${errors.join('\n  ')}`);
  expect.ok(files.length > 0, 'content/ 下没有找到任何课程文件');
});

test('课程文件不得含 ESM 语法或动态执行（防线：内容只能是数据）', () => {
  const files = collectLessonFiles();
  const bad = [];
  // 先剥掉注释与字符串，避免把文档里"禁止 eval("这句话本身当成违规
  const strip = (src) =>
    String(src)
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/(^|[^:\\])\/\/[^\n]*/g, '$1 ')
      .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
      .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
      .replace(/`(?:[^`\\]|\\.)*`/g, '``');

  for (const f of files) {
    const code = strip(readFileSync(f.file, 'utf8'));
    if (/^\s*export\s+(default|const|function|class|\{)/m.test(code)) bad.push(`${f.rel}: 含 export 语句`);
    if (/^\s*import\s+[^\n]*from\s*['"]/m.test(code)) bad.push(`${f.rel}: 含 import ... from 语句`);
    if (/\beval\s*\(/.test(code)) bad.push(`${f.rel}: 含 eval(`);
    if (/new\s+Function\s*\(/.test(code)) bad.push(`${f.rel}: 含 new Function(`);
    if (/document\.write/.test(code)) bad.push(`${f.rel}: 含 document.write`);
  }
  expect.equal(bad.length, 0, '课程文件里出现了不允许的构造：\n  ' + bad.join('\n  '));
});

test('元数据契约：id / module / week / title 齐全且唯一', async () => {
  const { lessons } = await loadAllLessons();
  const problems = [];
  const ids = new Set();
  for (const l of lessons) {
    if (!l.id) problems.push('有课程缺少 id');
    if (ids.has(l.id)) problems.push(`重复的课程 id：${l.id}`);
    ids.add(l.id);
    if (!l.title) problems.push(`${l.id}: 缺少 title`);
    if (!Number.isFinite(l.module)) problems.push(`${l.id}: module 不是数字`);
    // week 允许小数：模块 0 用 0.5/0.6… 表示"排在正式第 1 周之前的前置内容"。
    // 99 是约定的"不占用正式周次"（用户自定义内容）。
    if (!Number.isFinite(l.week) || l.week < 0 || l.week > 99) problems.push(`${l.id}: week=${l.week} 超出 0..99`);
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('8 段式契约：每课必须有目标 / 概念 / demo / 练习 / 测试 / 引导问题 / 卡片 / 阅读 / 清单', async () => {
  const { lessons, CPL } = await loadAllLessons();
  const problems = [];
  for (const l of lessons) {
    const missing = CPL.catalog.validateLesson(l);
    if (missing.length) problems.push(`${l.id}（第 ${l.week} 周）：缺 ${missing.join('、')}`);
  }
  expect.equal(problems.length, 0, '不满足 8 段式结构的课程：\n  ' + problems.join('\n  '));
});

test('每课的自动测试至少 1 个，且结构合法', async () => {
  const { lessons } = await loadAllLessons();
  const problems = [];
  for (const l of lessons) {
    const tests = l.tests || [];
    if (!tests.length) {
      problems.push(`${l.id}: 没有任何自动测试`);
      continue;
    }
    tests.forEach((t, i) => {
      if (!t.name) problems.push(`${l.id}.tests[${i}]: 缺少 name`);
      const kind = t.kind || 'python';
      if (!['python', 'static', 'check'].includes(kind)) problems.push(`${l.id}.tests[${i}]: 未知 kind=${kind}`);
      if (kind === 'python' && !t.assert) problems.push(`${l.id}.tests[${i}]: python 测试缺少 assert`);
      if (kind === 'static' && !t.rules) problems.push(`${l.id}.tests[${i}]: static 测试缺少 rules`);
      if (kind === 'check' && typeof t.run !== 'function') problems.push(`${l.id}.tests[${i}]: check 测试缺少 run 函数`);
    });
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('python 测试的 assert 里必须真的有 assert（否则是空测试）', async () => {
  const { lessons } = await loadAllLessons();
  const problems = [];
  // 先剥掉注释与字符串再检测：否则"# 刻意不用 time.perf_counter"这种
  // 说明性文字会被当成真的在计时（这个误报真的发生过）。
  // 与 tests/content/02-python-tests 的 stripCommentsAndStrings 是同一套思路。
  const stripPy = (src) =>
    String(src)
      .replace(/(^|[^\\])#.*$/gm, '$1')
      .replace(/'''[\s\S]*?'''/g, "''")
      .replace(/"""[\s\S]*?"""/g, '""')
      .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
      .replace(/"(?:[^"\\\n]|\\.)*"/g, '""');

  for (const l of lessons) {
    for (const t of l.tests || []) {
      if ((t.kind || 'python') !== 'python') continue;
      const src = String(t.assert || '');
      if (!/\bassert\b/.test(src)) problems.push(`${l.id} / ${t.name}: assert 里没有 assert 语句`);
      // 复杂度类测试必须有"规模翻倍"或"超时"的量级判据，而不是只看绝对耗时
      const code = stripPy(src);
      if (/(time\.perf_counter|time\.time)\s*\(/.test(code) && !/ratio|倍数|<\s*[0-9.]+/.test(code)) {
        problems.push(`${l.id} / ${t.name}: 用了计时但没有量级断言（跨机器会失败）`);
      }
    }
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('每课的 demo.kind 都必须在 CPL.demos 里注册过', async () => {
  const { lessons, CPL } = await loadAllLessons();
  const { CPL: fullCPL } = await loadApp();
  const known = new Set(fullCPL.demos.kinds());
  const problems = [];
  for (const l of lessons) {
    if (!l.demo) continue;
    if (!l.demo.kind) problems.push(`${l.id}: demo 缺少 kind`);
    else if (!known.has(l.demo.kind)) problems.push(`${l.id}: demo.kind="${l.demo.kind}" 未注册（已注册：${Array.from(known).join(', ')}）`);
  }
  void lessons;
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('每课的 Anki 卡片：正反面齐全、内容非空', async () => {
  const { lessons } = await loadAllLessons();
  const problems = [];
  for (const l of lessons) {
    const cards = l.anki || [];
    if (!cards.length) {
      problems.push(`${l.id}: 没有任何 Anki 卡片`);
      continue;
    }
    cards.forEach((c, i) => {
      if (typeof c.front !== 'string' || !c.front.trim()) problems.push(`${l.id}.anki[${i}]: front 为空`);
      if (typeof c.back !== 'string' || !c.back.trim()) problems.push(`${l.id}.anki[${i}]: back 为空`);
    });
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('每课的 AI 引导问题至少 1 条，且必须是疑问句（引导式，不是给答案）', async () => {
  const { lessons } = await loadAllLessons();
  const problems = [];
  for (const l of lessons) {
    const prompts = l.aiPrompts || [];
    if (!prompts.length) {
      problems.push(`${l.id}: 没有 AI 引导问题`);
      continue;
    }
    for (const p of prompts) {
      if (typeof p !== 'string' || p.trim().length < 6) problems.push(`${l.id}: 引导问题过短或非字符串：${p}`);
      else if (!/[？?]/.test(p)) problems.push(`${l.id}: 引导问题不是疑问句：${p.slice(0, 40)}`);
    }
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('练习：有 starter 与 solution，且 solution 与 starter 不同', async () => {
  const { lessons } = await loadAllLessons();
  const problems = [];
  for (const l of lessons) {
    const ex = l.exercise;
    if (!ex) continue;
    if (!ex.starter || !ex.starter.trim()) problems.push(`${l.id}: 练习缺少 starter`);
    if (!ex.solution || !ex.solution.trim()) problems.push(`${l.id}: 练习缺少 solution`);
    if (ex.starter === ex.solution) problems.push(`${l.id}: starter 与 solution 完全相同（学生无事可做）`);
    if (!['python', 'fortran', 'cpp', 'c'].includes(ex.lang)) problems.push(`${l.id}: 练习语言异常：${ex.lang}`);
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('延伸阅读：标题齐全，URL 必须是 http(s)', async () => {
  const { lessons } = await loadAllLessons();
  const problems = [];
  for (const l of lessons) {
    for (const r of l.reading || []) {
      if (!r.title) problems.push(`${l.id}: 阅读项缺少 title`);
      if (r.url && !/^https?:\/\//i.test(r.url)) problems.push(`${l.id}: 阅读 URL 协议不对：${r.url}`);
    }
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('大纲覆盖：syllabus.json 声明的每个模块都必须有课程', async () => {
  const { lessons } = await loadAllLessons();
  const syllabus = JSON.parse(readFileSync(join(CONTENT, 'syllabus.json'), 'utf8'));
  const modulesWithLessons = new Set(lessons.map((l) => l.module));
  const problems = [];
  for (const mod of syllabus.modules) {
    // 模块 7（用户自定义内容）由运行时提供，不需要内置课程文件
    if (mod.id === 7) continue;
    if (!modulesWithLessons.has(mod.id)) problems.push(`模块 ${mod.id}（${mod.title}）没有任何课程文件`);
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('manifest.json 与 content/ 一致（防止手改产物）', async () => {
  const manifestPath = join(ROOT_DIR, 'manifest.json');
  expect.ok(existsSync(manifestPath), 'manifest.json 不存在，请先运行 npm run build');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const files = collectLessonFiles();
  expect.equal(
    manifest.count,
    files.length,
    `manifest 记录了 ${manifest.count} 课，但 content/ 下有 ${files.length} 个课程文件（运行 npm run build 重新生成）`
  );

  // 每个课程文件都必须在 manifest 里出现
  const inManifest = new Set(manifest.lessons.map((l) => l.file.replace(/\\/g, '/')));
  const problems = files.filter((f) => !inManifest.has(f.rel)).map((f) => `${f.rel} 不在 manifest 中`);
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('内容文件体积有上限（防止把大段二进制塞进课程）', () => {
  const files = collectLessonFiles();
  const problems = [];
  for (const f of files) {
    const size = statSync(f.file).size;
    if (size > 200 * 1024) problems.push(`${f.rel} 体积 ${(size / 1024).toFixed(0)} KB，超过 200 KB 上限`);
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});
