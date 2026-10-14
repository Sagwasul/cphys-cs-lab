// tests/core/03-mastery.test.mjs
//
// 掌握度引擎、诊断测评、推荐路径的逻辑测试。
// 这三块是"首次使用按 CIU 式清单流程走"的核心，必须保证：
//   · 掌握度合成公式单调、有界、可解释；
//   · 答对加分、答错减分，且不会因为一次手滑把画像打崩；
//   · 推荐路径真的会"跳过已掌握、优先补薄弱"。

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
  '35-assessment.js',
];

async function load() {
  const { CPL } = await loadApp({ only: PIECES });
  return CPL;
}

test('技能清单：结构完整、id 唯一、字段齐全', async () => {
  const CPL = await load();
  const skills = CPL.mastery.skills();
  expect.ok(skills.length >= 15, `技能数量偏少：${skills.length}`);

  const ids = new Set();
  const problems = [];
  for (const s of skills) {
    if (!s.id) problems.push('有技能缺少 id');
    if (ids.has(s.id)) problems.push(`重复技能 id：${s.id}`);
    ids.add(s.id);
    if (!s.name) problems.push(`${s.id}: 缺少 name`);
    if (!['must', 'lookup'].includes(s.kind)) problems.push(`${s.id}: kind 必须是 must 或 lookup`);
    if (!s.domain) problems.push(`${s.id}: 缺少 domain`);
    if (!Array.isArray(s.lessons)) problems.push(`${s.id}: lessons 必须是数组`);
    if (!Array.isArray(s.checks) || s.checks.length < 2) problems.push(`${s.id}: 至少需要 2 条 CIU 式检查项`);
    if (!s.evidence) problems.push(`${s.id}: 缺少 evidence（证据要求）`);
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('掌握度范围：0..1，且课程进度不会让它越界', async () => {
  const CPL = await load();
  const ids = CPL.mastery.skills().map((s) => s.id);
  // 极端输入
  for (const id of ids.slice(0, 6)) {
    CPL.mastery.set(id, { lesson: 99, evidence: -5, self: 3 });
    const rec = CPL.mastery.get(id);
    expect.ok(rec.score >= 0 && rec.score <= 1, `${id} 的 score=${rec.score} 越界`);
  }
});

test('公式：三源加权合成（自评 0.4 / 课程 0.4 / 证据 0.2）', async () => {
  const CPL = await load();
  const s = CPL.mastery.skills()[0].id;
  CPL.mastery.set(s, { self: 1, lesson: 0, evidence: 0 });
  expect.ok(Math.abs(CPL.mastery.get(s).score - 0.4) < 1e-9, '自评权重应为 0.4');
  CPL.mastery.set(s, { self: 0, lesson: 1, evidence: 0 });
  expect.ok(Math.abs(CPL.mastery.get(s).score - 0.4) < 1e-9, '课程权重应为 0.4');
  CPL.mastery.set(s, { self: 0, lesson: 0, evidence: 1 });
  expect.ok(Math.abs(CPL.mastery.get(s).score - 0.2) < 1e-9, '证据权重应为 0.2');
  CPL.mastery.set(s, { self: 1, lesson: 1, evidence: 1 });
  expect.ok(Math.abs(CPL.mastery.get(s).score - 1) < 1e-9, '全满应为 1');
});

test('公式：没有自评时权重按比例重分配（课程 0.65 / 证据 0.35）', async () => {
  const CPL = await load();
  const s = CPL.mastery.skills()[0].id;
  CPL.mastery.set(s, { self: null, lesson: 1, evidence: 0 });
  expect.ok(Math.abs(CPL.mastery.get(s).score - 0.65) < 1e-9, '未测评时课程权重应为 0.65');
  CPL.mastery.set(s, { self: null, lesson: 0, evidence: 1 });
  expect.ok(Math.abs(CPL.mastery.get(s).score - 0.35) < 1e-9, '未测评时证据权重应为 0.35');
});

test('单调性：课程进度提高不会让掌握度下降', async () => {
  const CPL = await load();
  const s = CPL.mastery.skills()[1].id;
  CPL.mastery.set(s, { self: 0.5, lesson: 0, evidence: 0.3 });
  const before = CPL.mastery.get(s).score;
  CPL.mastery.set(s, { lesson: 1 });
  const after = CPL.mastery.get(s).score;
  expect.ok(after >= before, '提高课程完成度却让掌握度下降了');
});

test('等级阈值：strong ≥ 0.75，ok ≥ 0.5，weak ≥ 0.25，否则 unknown', async () => {
  const CPL = await load();
  expect.equal(CPL.mastery.level(0.9), 'strong');
  expect.equal(CPL.mastery.level(0.75), 'strong');
  expect.equal(CPL.mastery.level(0.6), 'ok');
  expect.equal(CPL.mastery.level(0.3), 'weak');
  expect.equal(CPL.mastery.level(0), 'unknown');
});

test('测评题库：每题都有解析，且必须关联到已存在的技能', async () => {
  const CPL = await load();
  const skills = new Set(CPL.mastery.skills().map((s) => s.id));
  const problems = [];
  const ids = new Set();
  for (const q of CPL.assess.QUESTIONS) {
    if (!q.id) problems.push('有题目缺少 id');
    if (ids.has(q.id)) problems.push(`重复题目 id：${q.id}`);
    ids.add(q.id);
    if (!skills.has(q.skill)) problems.push(`${q.id}: skill="${q.skill}" 不在技能清单里`);
    if (!q.q || !q.q.trim()) problems.push(`${q.id}: 缺少题干`);
    if (!Array.isArray(q.options) || q.options.length < 3) problems.push(`${q.id}: 至少需要 3 个选项`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      problems.push(`${q.id}: answer=${q.answer} 越界`);
    }
    if (!q.explain || q.explain.length < 20) problems.push(`${q.id}: 解析太短或缺失（答错必须知道错在哪）`);
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});

test('测评题库规模与覆盖度：≥20 题，且覆盖全部 must 类技能', async () => {
  const CPL = await load();
  const qs = CPL.assess.QUESTIONS;
  expect.ok(qs.length >= 20, `题目只有 ${qs.length} 道，偏少`);
  const covered = new Set(qs.map((q) => q.skill));
  const mustSkills = CPL.mastery.byKind('must').map((s) => s.id);
  const missing = mustSkills.filter((id) => !covered.has(id));
  expect.equal(missing.length, 0, '以下必须内化的技能没有被任何题目覆盖：' + missing.join(', '));
});

test('答题流程：答对/答错都能推进，且能给出正确性判断', async () => {
  const CPL = await load();
  CPL.assess.start({ limit: 4 });
  expect.equal(CPL.assess.progress().total, 4);

  const q1 = CPL.assess.current();
  const wrong = CPL.assess.answer((q1.answer + 1) % q1.options.length);
  expect.equal(wrong.correct, false);
  expect.ok(CPL.assess.next());

  const q2 = CPL.assess.current();
  expect.notEqual(q2.id, q1.id, 'next() 之后应该换题');
  const right = CPL.assess.answer(q2.answer);
  expect.equal(right.correct, true);
  void q1;
});

test('测评提交：写入历史并将其折成自我评估，进入掌握度画像', async () => {
  const CPL = await load();
  CPL.mastery.reset();
  CPL.assess.start({ limit: 6 });
  for (let i = 0; i < 6; i++) {
    const q = CPL.assess.current();
    // 全部答对
    CPL.assess.answer(q.answer);
    CPL.assess.next();
  }
  const { record, profile } = CPL.assess.finish();
  expect.equal(record.answered, 6);
  expect.equal(record.right, 6);
  expect.equal(record.percent, 100);
  expect.equal(CPL.assess.history().length, 1, '历史应记录一次');
  expect.ok(profile.hasAssessment, '完成后画像应标记为已评估');
  const touched = profile.rows.filter((r) => r.self !== null);
  expect.ok(touched.length >= 1, '至少有一个技能被写入了自评');
  for (const r of touched) expect.equal(r.self, 1, '全答对时自评应为 1');
});

test('测评历史：有次数上限，不会无限增长', async () => {
  const CPL = await load();
  CPL.assess.reset();
  for (let k = 0; k < 25; k++) {
    CPL.assess.start({ limit: 1 });
    CPL.assess.answer(CPL.assess.current().answer);
    CPL.assess.next();
    CPL.assess.finish();
  }
  expect.ok(CPL.assess.history().length <= 20, `历史长度 ${CPL.assess.history().length} 超过上限`);
});

test('错题：能被识别并可单独重练', async () => {
  const CPL = await load();
  CPL.assess.reset();
  CPL.assess.start();
  const total = CPL.assess.progress().total;
  for (let i = 0; i < total; i++) {
    const q = CPL.assess.current();
    // 每隔一题故意答错
    const choice = i % 2 === 0 ? (q.answer + 1) % q.options.length : q.answer;
    CPL.assess.answer(choice);
    CPL.assess.next();
  }
  CPL.assess.finish();
  const wrong = CPL.assess.wrongQuestions();
  expect.ok(wrong.length >= 5, `错题数量偏少：${wrong.length}`);
  expect.ok(wrong.length < total, '不应该所有题都是错题');
});

test('推荐路径：已掌握的技能对应的课程被标记为可略过', async () => {
  const CPL = await load();
  CPL.mastery.reset();
  // 把所有技能拉满
  for (const s of CPL.mastery.skills()) {
    CPL.mastery.set(s.id, { self: 1, lesson: 1, evidence: 1 });
  }
  const lessons = [
    { id: 'week-11-complexity-array-hash', week: 11 },
    { id: 'lab-01-complexity-memory', week: 1 },
    { id: 'lab-02-numerical-error', week: 2 },
  ];
  const rec = CPL.mastery.recommend(lessons);
  expect.ok(rec.skip.length >= 1, '全部掌握时应该有可略过的课程');
  expect.ok(rec.order.length === lessons.length, '排序结果必须包含全部课程');
  expect.ok(typeof rec.reason['week-11-complexity-array-hash'] === 'string' && rec.reason['week-11-complexity-array-hash'].length > 0, '每课都要给出理由');
});

test('推荐路径：薄弱技能对应的课程被排到前面并标为重点', async () => {
  const CPL = await load();
  CPL.mastery.reset();
  // 只把"复杂度"相关技能打到 0，其余留空（unknown 也算薄弱）
  for (const s of CPL.mastery.skills()) {
    CPL.mastery.set(s.id, { self: 0, lesson: 0, evidence: 0 });
  }
  CPL.mastery.set('complexity', { self: 1, lesson: 1, evidence: 1 });
  CPL.mastery.set('memory-model', { self: 1, lesson: 1, evidence: 1 });

  const lessons = [
    { id: 'week-15-dp-graph', week: 15 },
    { id: 'lab-01-complexity-memory', week: 1 },
    { id: 'lab-02-numerical-error', week: 2 },
  ];
  const rec = CPL.mastery.recommend(lessons);
  expect.ok(rec.skip.includes('lab-01-complexity-memory'), '已掌握的课应被标记可略过');
  const firstFocus = rec.order.find((id) => rec.focus.includes(id));
  expect.ok(firstFocus, '应至少有一课被标为重点');
  expect.equal(firstFocus, 'lab-02-numerical-error', '薄弱项应按周次优先');
  void firstFocus;
});

test('给 AI 的掌握度上下文：只含技能名与等级，不含分数历史或个人字段', async () => {
  const CPL = await load();
  CPL.mastery.reset();
  CPL.mastery.set('complexity', { self: 1, lesson: 1, evidence: 1 });
  CPL.mastery.set('float-error', { self: 0, lesson: 0, evidence: 0 });
  const ctx = CPL.mastery.toContext();
  const json = JSON.stringify(ctx);
  expect.ok(ctx.overall, '应有 overall 概要');
  expect.ok(Array.isArray(ctx.weak) && ctx.weak.length > 0, '应有薄弱技能列表');
  expect.ok(Array.isArray(ctx.strong) && ctx.strong.length > 0, '应有已掌握技能列表');
  expect.notIncludes(json, '@');
  expect.notIncludes(json, 'email');
  expect.notIncludes(json, 'score');
});

test('技能与课程的映射是双向一致的', async () => {
  const CPL = await load();
  const problems = [];
  for (const s of CPL.mastery.skills()) {
    for (const lessonId of s.lessons) {
      const back = CPL.mastery.skillsForLesson(lessonId).map((x) => x.id);
      if (!back.includes(s.id)) problems.push(`${s.id} 声明了 ${lessonId}，但反向查询查不到`);
    }
  }
  expect.equal(problems.length, 0, problems.join('\n  '));
});
