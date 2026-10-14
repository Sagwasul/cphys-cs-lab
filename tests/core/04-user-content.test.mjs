// tests/core/04-user-content.test.mjs
//
// 用户自定义内容（模块 7）的持久化与导入导出测试。
// 重点是**导入路径**：它会读外部文件，是最容易把坏数据带进本地库的地方。

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
  '62-editor.js',
  '70-ai.js',
  '90-user-content.js',
];

async function load() {
  const { CPL } = await loadApp({ only: PIECES });
  return CPL;
}

test('空课程骨架：结构完整且能通过自身校验', async () => {
  const CPL = await load();
  const blank = CPL.userContent.blankLesson();
  expect.ok(blank.id.startsWith('user-'), 'id 应以 user- 开头，避免与内置课程冲突');
  expect.equal(blank.module, 7);
  expect.ok(Array.isArray(blank.sections) && blank.sections.length >= 1, '应当带一个示例小节');
  expect.ok(CPL.userContent.isUserLessonId(blank.id));
  const check = CPL.userContent.validateLesson(blank);
  expect.equal(check.ok, true, '骨架本身应合法：' + check.problems.join('；'));
});

test('模板骨架：含 8 段式要素，可直接新建课程', async () => {
  const CPL = await load();
  const tpl = CPL.userContent.blankLesson(CPL.userContent.templateSkeleton());
  expect.ok(tpl.objectives.length >= 2, '模板应有学习目标');
  expect.ok(tpl.anki.length >= 1, '模板应有卡片');
  expect.ok(tpl.checklist.length >= 1, '模板应有自检项');
  expect.ok(tpl.sections.length >= 3, '模板应含多个正文小节');
  expect.equal(CPL.userContent.validateLesson(tpl).ok, true);
});

test('校验器：能拦住缺标题、类型错误、卡片字段缺失', async () => {
  const CPL = await load();
  const uc = CPL.userContent;

  expect.equal(uc.validateLesson(null).ok, false);
  expect.equal(uc.validateLesson('字符串').ok, false);
  expect.equal(uc.validateLesson({}).ok, false, '没有 title 应被拒绝');
  expect.equal(uc.validateLesson({ title: '   ' }).ok, false, '空白 title 应被拒绝');
  expect.equal(uc.validateLesson({ title: 'x', sections: 'not-an-array' }).ok, false);
  expect.equal(uc.validateLesson({ title: 'x', sections: [{ body: 123 }] }).ok, false, 'body 必须是字符串');
  expect.equal(uc.validateLesson({ title: 'x', anki: [{ front: 'a' }] }).ok, false, '卡片缺 back 应被拒绝');
  expect.equal(uc.validateLesson({ title: 'x', anki: [{ front: 'a', back: 'b' }] }).ok, true);
});

test('导入：拒绝非 JSON、错误结构与空对象', async () => {
  const CPL = await load();
  const uc = CPL.userContent;

  await expect.rejects(uc.importJson('{ 这不是 json'), '非 JSON 应抛错');
  await expect.rejects(uc.importJson('42'), '数字应抛错');
  await expect.rejects(uc.importJson('{"foo":1}'), '没有 lessons 字段应抛错');
  await expect.rejects(uc.importJson('[]'), '空数组应抛错（没有可导入的内容）');
});

test('导入：支持三种形态（本平台格式 / 裸数组 / 单个课程对象）', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  await uc.remove(await firstId(uc, '形态A'));
  await uc.remove(await firstId(uc, '形态B'));
  await uc.remove(await firstId(uc, '形态C'));

  const mk = (title) => uc.blankLesson({ title, sections: [{ title: 's', body: '正文' }] });

  const r1 = await uc.importJson(JSON.stringify({ schema: 1, lessons: [mk('形态A')] }));
  expect.equal(r1.added, 1, '本平台格式应导入 1 个');

  const r2 = await uc.importJson(JSON.stringify([mk('形态B')]));
  expect.equal(r2.added, 1, '裸数组应导入 1 个');

  const r3 = await uc.importJson(JSON.stringify(mk('形态C')));
  expect.equal(r3.added, 1, '单个课程对象应导入 1 个');

  const all = await uc.all();
  const titles = all.map((l) => l.title);
  expect.ok(titles.includes('形态A') && titles.includes('形态B') && titles.includes('形态C'), '三种形态都应入库');
});

test('导入：坏数据被跳过并给出原因，不影响好数据', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  const good = uc.blankLesson({ title: '好数据-' + Date.now() });
  const bad = { title: '坏数据', sections: 'not-an-array' };

  const res = await uc.importJson(JSON.stringify({ lessons: [good, bad] }));
  expect.equal(res.added, 1, '好数据应被导入');
  expect.equal(res.skipped, 1, '坏数据应被跳过');
  expect.ok(res.problems.length >= 1, '应给出跳过原因');
  expect.includes(res.problems.join(' '), '坏数据');
});

test('导入：默认不覆盖同名课程；勾选覆盖时替换', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  const title = '重名测试-' + Date.now();
  const first = uc.blankLesson({ title, sections: [{ title: 's', body: '第一版' }] });
  await uc.save(first);

  const second = uc.blankLesson({ title, sections: [{ title: 's', body: '第二版' }] });

  const res1 = await uc.importJson(JSON.stringify({ lessons: [second] }));
  expect.equal(res1.added, 0, '默认不应覆盖');
  expect.equal(res1.skipped, 1);

  const res2 = await uc.importJson(JSON.stringify({ lessons: [second] }), { overwrite: true });
  expect.equal(res2.added, 1, '勾选覆盖后应导入');
  const after = (await uc.all()).filter((l) => l.title === title);
  expect.equal(after.length, 1, '同名课程在覆盖模式下不应产生两份');
});

test('导入：id 冲突时自动换新 id（不会覆盖别人的课程）', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  const a = uc.blankLesson({ title: 'id冲突A-' + Date.now() });
  await uc.save(a);
  // 拿同一个 id，但换个标题
  const b = Object.assign({}, a, { title: 'id冲突B-' + Date.now(), sections: [{ title: 's', body: 'B' }] });
  const res = await uc.importJson(JSON.stringify({ lessons: [b] }), { overwrite: true });
  expect.ok(res.added >= 1, '应当被导入');
  const all = await uc.all();
  const ids = all.map((l) => l.id);
  expect.equal(new Set(ids).size, ids.length, '导入后 id 必须唯一');
});

test('导出 → 再导入：字段往返一致（内容不丢）', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  const original = uc.blankLesson({
    title: '往返一致性-' + Date.now(),
    subtitle: '带公式与代码块',
    week: 42,
    tags: ['往返', '公式'],
    objectives: ['目标一', '目标二'],
    sections: [{ title: '小节', body: '正文含 $E=mc^2$ 与\n\n```python\nprint(1)\n```' }],
    anki: [{ front: '问题？', back: '答案。', tags: ['t'] }],
    checklist: ['能复述'],
  });
  await uc.save(original);

  const exported = uc.exportAll([original]);
  const parsed = JSON.parse(exported);
  expect.equal(parsed.count, 1);
  expect.equal(parsed.lessons[0].title, original.title);

  // 用非覆盖模式导入会因同名被跳过，这里先删掉再导入，验证内容完整回来
  await uc.remove(original.id);
  const res = await uc.importJson(exported);
  expect.equal(res.added, 1, '删除后应能重新导入');

  const restored = (await uc.all()).find((l) => l.title === original.title);
  expect.ok(restored, '应能找回导入的课程');
  expect.equal(restored.subtitle, original.subtitle);
  expect.equal(restored.week, original.week);
  expect.deepEqual(restored.tags, original.tags);
  expect.deepEqual(restored.objectives, original.objectives);
  expect.equal(restored.sections.length, original.sections.length);
  expect.equal(restored.sections[0].body, original.sections[0].body, '正文（含公式与代码块）必须一字不差');
  expect.equal(restored.anki.length, original.anki.length);
  expect.equal(restored.anki[0].front, original.anki[0].front);
  expect.equal(restored.checklist.length, original.checklist.length);
});

test('单课导出：结构与批量导出一致', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  const one = uc.blankLesson({ title: '单课导出-' + Date.now() });
  const payload = JSON.parse(uc.exportOne(one));
  expect.equal(payload.count, 1);
  expect.equal(payload.kind, 'user-lessons');
  expect.equal(payload.lessons.length, 1);
  expect.equal(payload.lessons[0].id, one.id);
});

test('排序：上移下移会持久化顺序', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  const stamp = Date.now();
  await uc.save(uc.blankLesson({ title: `排序A-${stamp}` }));
  await uc.save(uc.blankLesson({ title: `排序B-${stamp}` }));
  await uc.save(uc.blankLesson({ title: `排序C-${stamp}` }));

  const before = (await uc.all()).map((l) => l.id);
  expect.ok(before.length >= 3, '至少应有 3 门课用于排序');

  // 把第一个往下移一位，它必须换位置
  const firstId = before[0];
  const after = (await uc.reorder(firstId, 1)).map((l) => l.id);
  expect.equal(after.length, before.length, '排序不应增删课程');
  expect.notEqual(after.indexOf(firstId), 0, '下移之后不应还在第一位');
  expect.equal(after[1], firstId, '下移一位之后应该在第 2 位');

  // 再移回去，顺序应恢复
  const back = (await uc.reorder(firstId, -1)).map((l) => l.id);
  expect.equal(back[0], firstId, '上移一位之后应该回到第 1 位');
  expect.deepEqual(back, before, '两次反向移动应回到原顺序');

  // 越界不报错
  const noop = await uc.reorder(before[0], -5);
  expect.equal(noop.length, before.length);
});

test('删除：连同索引一起移除，且不误删其它课程', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  const keep = await uc.save(uc.blankLesson({ title: '保留-' + Date.now() }));
  const drop = await uc.save(uc.blankLesson({ title: '待删-' + Date.now() }));
  await uc.remove(drop.id);

  const all = await uc.all();
  expect.ok(!all.some((l) => l.id === drop.id), '被删的课程不应还在');
  expect.ok(all.some((l) => l.id === keep.id), '其它课程不应被误删');
  const index = uc.index();
  expect.ok(!index.some((l) => l.id === drop.id), '索引里也不应残留');
});

test('保存：updatedAt 会被刷新，order 会被补齐', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  const rec = uc.blankLesson({ title: '时间戳-' + Date.now(), createdAt: 1000, updatedAt: 1000, order: 0 });
  const saved = await uc.save(rec);
  expect.ok(saved.updatedAt > 1000, 'updatedAt 应被刷新');
  expect.ok(saved.order > 0, 'order 应被补齐');
});

test('保存：校验失败时不写入（不污染本地库）', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  const before = (await uc.all()).length;
  await expect.rejects(uc.save({ title: 'x', sections: 'bad' }), '非法结构应抛错');
  expect.equal((await uc.all()).length, before, '非法内容不应入库');
});

test('本地课程能被注册进课程目录（出现在课表里）', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  const rec = await uc.save(uc.blankLesson({ title: '进目录-' + Date.now(), week: 42 }));
  const runtime = uc.toLessonShape(rec);
  expect.equal(runtime.id, rec.id);
  expect.ok(Array.isArray(runtime.concepts), 'sections 应被转换成 concepts');
  expect.ok(runtime.concepts.length >= 1);
  expect.ok(runtime.aiPrompts.length >= 1, '应给出默认引导问题');
  expect.ok(runtime.checklist.length >= 1, '应给出默认自检项');

  CPL.catalog.registerRuntimeLesson(runtime);
  const inCatalog = CPL.catalog.lessons().some((l) => l.id === rec.id);
  expect.equal(inCatalog, true, '注册后应出现在课表里');
  CPL.catalog.unregister(rec.id);
  expect.equal(CPL.catalog.lessons().some((l) => l.id === rec.id), false, '注销后应从课表移除');
});

test('存储降级：后端标签如实反映能力（不谎称"已保存"）', async () => {
  const CPL = await load();
  const store = CPL.store;
  const label = store.backendLabel();
  expect.ok(typeof label === 'string' && label.length > 0, '应给出后端描述');

  if (store.indexedDBAvailable()) {
    expect.includes(label, 'IndexedDB');
  } else if (store.localStorageAvailable()) {
    expect.includes(label, 'localStorage');
    expect.includes(label, '5 MB', '应提示容量上限，否则用户会在存满后才发现');
  } else {
    expect.includes(label, '内存');
    expect.includes(label, '丢失');
  }
});

test('存储降级：IndexedDB 不可用时写入仍成功（落到 localStorage），且能读回', async () => {
  const CPL = await load();
  const uc = CPL.userContent;
  expect.equal(CPL.store.indexedDBAvailable(), false, '测试桩里没有 IndexedDB');
  const rec = await uc.save(uc.blankLesson({ title: '降级写入-' + Date.now() }));
  const back = await uc.get(rec.id);
  expect.ok(back, '应当能从降级后端读回');
  expect.equal(back.title, rec.title);
});

test('用户内容 id 前缀判定：内置课程不会被当成用户内容', async () => {
  const CPL = await load();
  expect.equal(CPL.userContent.isUserLessonId('user-abc'), true);
  expect.equal(CPL.userContent.isUserLessonId('week-11-complexity-array-hash'), false);
  expect.equal(CPL.userContent.isUserLessonId(''), false);
  expect.equal(CPL.userContent.isUserLessonId(null), false);
});

async function firstId(uc, title) {
  const hit = (await uc.all()).find((l) => l.title === title);
  return hit ? hit.id : 'user-nonexistent';
}
