// tests/core/02-markdown.test.mjs
//
// Markdown 渲染器的正确性与**安全性**测试。安全性是重点。

import { test, expect, autoFile } from '../helpers/tap.mjs';
import { loadApp } from '../helpers/load-app.mjs';

autoFile(import.meta.url);

const RENDER_PIECES = [
  '07-manifest.snapshot.js',
  '07-syllabus.snapshot.js',
  '00-core.js',
  '05-dom.js',
  '25-math.js',
  '20-markdown.js',
  '55-highlight.js',
];

async function md() {
  const { CPL } = await loadApp({ only: RENDER_PIECES });
  return CPL.md;
}

test('转义：原始 HTML 一律被吃掉，不会执行', async () => {
  const m = await md();
  const out = m.renderBlocks('<script>alert(1)</script>');
  expect.notIncludes(out, '<script', '出现了未转义的 <script');
  expect.includes(out, '&lt;script&gt;', 'HTML 应被转义为实体');

  const img = m.renderBlocks('<img src=x onerror=alert(1)>');
  expect.ok(!/<img[^>]*onerror/.test(img), '出现了未转义的 onerror');
});

test('链接：javascript: 与 data: 协议被拦截', async () => {
  const m = await md();
  const js = m.renderBlocks('[点我](javascript:alert(1))');
  expect.ok(!/href="javascript:/i.test(js), 'javascript: 链接未被拦截');
  const data = m.renderBlocks('[点我](data:text/html,<script>alert(1)</script>)');
  expect.ok(!/href="data:/i.test(data), 'data: 链接未被拦截');
  const ok = m.renderBlocks('[Numpy](https://numpy.org/doc/)');
  expect.includes(ok, 'href="https://numpy.org/doc/"');
  expect.includes(ok, 'rel="noopener noreferrer external"');
});

test('图片：data:image 允许，data:text 拦截', async () => {
  const m = await md();
  const okImg = m.renderBlocks('![x](data:image/png;base64,iVBORw0KGgo=)');
  expect.includes(okImg, 'src="data:image/png;base64,');
  const badImg = m.renderBlocks('![x](data:text/html;base64,PHNjcmlwdD4=)');
  expect.notIncludes(badImg, 'src="data:text');
});

test('行内元素：代码、粗体、斜体、删除线、高亮', async () => {
  const m = await md();
  expect.includes(m.renderBlocks('`x = 1`'), '<code class="cpl-code-inline">x = 1</code>');
  expect.includes(m.renderBlocks('**粗**'), '<strong>粗</strong>');
  expect.includes(m.renderBlocks('*斜*'), '<em>斜</em>');
  expect.includes(m.renderBlocks('~~删~~'), '<del>删</del>');
  expect.includes(m.renderBlocks('==高=='), '<mark>高</mark>');
});

test('反斜杠转义：行内特殊字符按字面量输出', async () => {
  const m = await md();
  const out = m.renderBlocks('价格是 \\$5 而不是 $x$');
  expect.includes(out, '$5');
  expect.ok(!out.includes('<em>'), '被转义的 * 不应产生斜体');
  expect.includes(m.renderBlocks('\\*不是斜体\\*'), '*不是斜体*');
});

test('代码块：语言标签与内容转义', async () => {
  const m = await md();
  const out = m.renderBlocks('```python\ndef f(x):\n    return x < 3 and "a"\n```');
  expect.includes(out, 'data-lang="python"');
  expect.includes(out, '&lt;', '代码块里的 < 应被转义');
  expect.notIncludes(out, 'return x < 3', '代码块里出现了未转义的 <');
});

test('代码块：模拟闭合标签注入被转义', async () => {
  const m = await md();
  const out = m.renderBlocks('```\n</code></pre><script>alert(1)</script>\n```');
  expect.notIncludes(out, '<script>');
  expect.includes(out, '&lt;script&gt;');
});

test('代码块：非法语言名被清洗为安全字符', async () => {
  const m = await md();
  const out = m.renderBlocks('```py"onload="alert(1)\nprint(1)\n```');
  // 关键性质 1：不产生任何新的 HTML 属性（引号必须被吃掉，不能带出来）
  expect.notIncludes(out, 'onload="', 'language 属性里带出了注入引号');
  // 关键性质 2：data-lang 的取值只由白名单字符构成
  const attr = /data-lang="([^"]*)"/.exec(out);
  expect.ok(attr, '没有生成 data-lang');
  expect.match(attr[1], /^[\w+#.-]+$/, `data-lang 取值含非法字符：${attr[1]}`);
});

test('列表：有序、无序、任务列表', async () => {
  const m = await md();
  expect.includes(m.renderBlocks('- a\n- b'), '<ul class="cpl-list">');
  expect.includes(m.renderBlocks('1. a\n2. b'), '<ol');
  const task = m.renderBlocks('- [x] 做完\n- [ ] 没做');
  expect.includes(task, 'cpl-task is-done');
  expect.includes(task, 'checked');
});

test('表格：表头与单元格', async () => {
  const m = await md();
  const out = m.renderBlocks('| 列1 | 列2 |\n| --- | --- |\n| a | b |');
  expect.includes(out, '<thead>');
  expect.includes(out, '<th>列1</th>');
  expect.includes(out, '<td>a</td>');
});

test('引用与 callout：识别 [!TYPE] 并给出语义类名', async () => {
  const m = await md();
  const out = m.renderBlocks('> [!PHYSICS] 物理直觉\n> 这里写物理意义。');
  expect.includes(out, 'cpl-callout--physics');
  expect.includes(out, '物理直觉');
  expect.includes(m.renderBlocks('> 普通引用'), '<blockquote');
  expect.includes(m.renderBlocks('> [!UNKNOWN_TYPE] 标题\n> 内容'), 'cpl-callout--note');
});

test('标题：层级映射与锚点 id 递增', async () => {
  const m = await md();
  const out = m.renderBlocks('# 一\n\n## 二');
  expect.includes(out, 'id="sec-1"');
  expect.includes(out, 'id="sec-2"');
  expect.includes(out, '<h2');
  expect.includes(out, '<h3');
});

test('数学：行内与块级都渲染为 MathML，且恶意内容被转义', async () => {
  const m = await md();
  const inline = m.renderBlocks('能量是 $E = mc^2$ 的形式');
  expect.includes(inline, '<math', '行内公式没有渲染');
  const block = m.renderBlocks('$$\n\\int_0^1 x^2 dx = \\frac{1}{3}\n$$');
  expect.includes(block, 'cpl-math-block');
  expect.includes(block, '<mfrac>', '分数应渲染为 mfrac');
  const evil = m.renderBlocks('$\\text{<script>alert(1)</script>}$');
  expect.notIncludes(evil, '<script>');
});

test('纯文本提取：用于搜索与卡片预览', async () => {
  const { CPL } = await loadApp({ only: RENDER_PIECES });
  const text = CPL.md.plain('# 标题\n\n这是**正文**，带 `代码` 与 $x^2$。\n\n```py\nfoo()\n```');
  expect.includes(text, '标题');
  expect.includes(text, '正文');
  expect.notIncludes(text, 'foo()', '代码块不应出现在纯文本摘要里');
  expect.notIncludes(text, '**');
});

test('目录提取：标题层级与锚点 id 对应', async () => {
  const { CPL } = await loadApp({ only: RENDER_PIECES });
  const outline = CPL.md.outline('# 一\n\n## 二\n\n### 三');
  expect.equal(outline.length, 3);
  expect.equal(outline[0].id, 'sec-1');
  expect.equal(outline[1].level, 3);
});

test('未闭合的围栏代码块不会吞掉后面内容或抛错', async () => {
  const m = await md();
  const out = m.renderBlocks('```python\nx = 1\n');
  expect.includes(out, 'cpl-codeblock');
  // 语法高亮会把 `1` 包进 span，所以断言"代码内容仍然完整可见"而不是整串匹配
  expect.includes(out, 'x = ');
  expect.includes(out, '>1</span>', '数字 1 应该仍在代码块里');
  expect.includes(out, '</code>');
});
