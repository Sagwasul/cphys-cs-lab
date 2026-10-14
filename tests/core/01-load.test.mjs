// tests/core/01-load.test.mjs
//
// 冒烟测试：所有前端分片必须能在最小 DOM 环境下加载成功。
// 这条测试把"某个分片有语法错 / 引用了不存在的 API"从
// "用户打开页面发现白屏"提前到 CI 里失败。

import { test, expect, autoFile } from '../helpers/tap.mjs';
import { loadApp, pieceOrder } from '../helpers/load-app.mjs';

autoFile(import.meta.url);

test('所有 pieces/*.js 都能加载且不抛错', async () => {
  const { errors, CPL, files } = await loadApp();
  const detail = errors.map((e) => `${e.file.replace(/.*[\\/]/, '')}: ${e.message}`).join('\n  ');
  expect.equal(errors.length, 0, `有 ${errors.length} 个分片加载失败：\n  ${detail}`);
  expect.ok(files.length >= 15, `分片数量偏少：${files.length}`);
  expect.ok(CPL, 'window.CPL 没有被创建');
});

test('核心命名空间都挂上了', async () => {
  const { CPL } = await loadApp();
  const keys = [
    'util',
    'bus',
    'log',
    'dom',
    'store',
    'prefs',
    'drafts',
    'catalog',
    'md',
    'math',
    'highlight',
    'plot',
    'demos',
    'mastery',
    'assess',
    'anki',
    'ai',
    'runtimes',
    'tests',
    'editor',
    'userContent',
    'nav',
    'theme',
    'progress',
  ];
  const missing = keys.filter((k) => !CPL[k]);
  expect.deepEqual(missing, [], '缺少命名空间：' + missing.join(', '));
});

test('分片加载顺序：快照最先、99-main 最后', () => {
  const files = pieceOrder();
  expect.ok(files[0].startsWith('07-'), `首个分片应为快照，实际 ${files[0]}`);
  expect.equal(files[files.length - 1], '99-main.js');
  expect.ok(files.indexOf('00-core.js') > files.indexOf('07-syllabus.snapshot.js'), '00-core.js 必须在快照之后');
});

test('配置默认值是安全的（无密钥、超时有界、限流有值）', async () => {
  const { CPL } = await loadApp();
  const cfg = CPL.config;
  expect.equal(cfg.apiBase, '', '默认 apiBase 必须为空（离线模式）');
  expect.equal(cfg.ai.stream, true);
  expect.ok(cfg.ai.maxInputChars > 0 && cfg.ai.maxInputChars <= 8000, 'maxInputChars 必须是有界的合理值');
  expect.ok(cfg.ai.maxChars >= cfg.ai.maxInputChars, 'maxChars 必须不小于单条上限');
  expect.ok(cfg.runTimeoutMs > 0 && cfg.runTimeoutMs <= 30000, '执行超时必须有界');
  expect.notIncludes(JSON.stringify(cfg), 'sk-', '配置里不应出现任何密钥形态的字符串');
});

test('AI 默认禁用；启用判断只看 apiBase', async () => {
  const { CPL } = await loadApp();
  expect.equal(CPL.ai.enabled(), false);
  CPL.config.apiBase = 'https://example.vercel.app/api/chat';
  expect.equal(CPL.ai.enabled(), true);
});

test('CDN 版本号已核实并写死（防止无意间跟随 latest）', async () => {
  const { CPL } = await loadApp();
  const cdn = CPL.config.cdn;
  expect.includes(cdn.pyodide, 'v314.0.7', 'Pyodide 版本应为核实过的 314.0.7');
  expect.includes(cdn.katex, 'katex@0.19.0', 'KaTeX 版本应为 0.19.0');
  expect.ok(cdn.katexSRI && cdn.katexSRI.js && cdn.katexSRI.css, 'KaTeX 必须带 SRI 哈希');
  expect.equal(CPL.config.versions.codemirror, '6.0.2');
});
