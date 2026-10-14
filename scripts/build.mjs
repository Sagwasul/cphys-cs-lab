// scripts/build.mjs
//
// 把 pieces/*.js|css 拼成站点三文件产物（index.html + app.js + app.css）+ manifest.json。
//
// 设计约束（对应规划 D1/D5）：
//   · 零依赖：只用 Node 内置模块，不需要 npm install。
//   · 内容不参与构建：content/ 由浏览器运行时按需加载，加课 = 加文件，不用重新构建。
//   · 构建期做三件硬检查：契约校验、可解析性、密钥泄露扫描。任一项失败即构建失败。

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildManifest } from './lib/manifest.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PIECES = join(ROOT, 'pieces');
const errors = [];
const warnings = [];

const banner = (rel) => `\n/* ===== ${rel} ===== */\n`;

// ─────────────────────────────────────────────────────────────
// 0. 读取并排序 pieces
// ─────────────────────────────────────────────────────────────
if (!existsSync(PIECES)) {
  console.error('找不到 pieces/ 目录');
  process.exit(1);
}

const pieceFiles = readdirSync(PIECES)
  .filter((f) => f.endsWith('.js') || f.endsWith('.css'))
  .sort((a, b) => a.localeCompare(b, 'en'));

// 快照必须最先执行（它们只写 window.CPL_*_SNAPSHOT，不读取任何东西）
const FIRST = ['07-manifest.snapshot.js', '07-syllabus.snapshot.js'];
pieceFiles.sort((a, b) => {
  const ai = FIRST.indexOf(a);
  const bi = FIRST.indexOf(b);
  if (ai >= 0 || bi >= 0) return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  return 0;
});

const jsFiles = pieceFiles.filter((f) => f.endsWith('.js'));
const cssFiles = pieceFiles.filter((f) => f.endsWith('.css'));

if (!jsFiles.length) errors.push('pieces/ 下没有任何 .js 分片');
if (!cssFiles.length) errors.push('pieces/ 下没有任何 .css 分片');

// 快照在前，00-core.js 紧随其后，99-main.js 必须最后
if (!jsFiles.includes('00-core.js')) errors.push('pieces/ 缺少 00-core.js');
if (jsFiles[jsFiles.length - 1] !== '99-main.js') {
  errors.push(`pieces 顺序错误：99-main.js 必须在最后，实际最后一个是 ${jsFiles[jsFiles.length - 1]}`);
}
const coreIdx = jsFiles.indexOf('00-core.js');
for (const f of FIRST) {
  const i = jsFiles.indexOf(f);
  if (i >= 0 && i > coreIdx) errors.push(`pieces 顺序错误：${f} 必须在 00-core.js 之前`);
}


// ─────────────────────────────────────────────────────────────
// 0b. 生成内容清单，并把清单/大纲内嵌为"离线快照"分片
// ─────────────────────────────────────────────────────────────
const io = {
  readFile: (p) => readFileSync(join(ROOT, p), 'utf8'),
  listDir: (dir) => (existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)) : []),
};
const { manifest, problems } = buildManifest(io, 'content');
errors.push(...problems);
writeFileSync(join(ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// ─────────────────────────────────────────────────────────────
// 0c. 硬检查 C：每个课程文件的 JavaScript 语法必须能通过解析
//
// 用 vm.Script 在进程内编译（只编译、不执行）：
//   · 课程文件是经典脚本，vm.Script 正是它的语义（顶层 return 也合法）；
//   · 不用 child_process 跑 `node --check`——那会在受限沙箱里 EPERM；
//   · 不用 new Function 因为它的顶层 return 语义与脚本不同。
// ─────────────────────────────────────────────────────────────
{
  const vm = await import('node:vm');
  for (const lesson of manifest.lessons) {
    const abs = join(ROOT, lesson.file);
    if (!existsSync(abs)) continue;
    try {
      new vm.Script(readFileSync(abs, 'utf8'), { filename: lesson.file });
    } catch (err) {
      const detail = String(err && err.message ? err.message : err).slice(0, 300);
      errors.push(`content 文件语法错误：${lesson.file} — ${detail}`);
    }
  }
}

function writeSnapshot(file, globalName, value, note) {
  const body =
    `/* ============================================================================\n` +
    ` * ${file} — 构建期自动生成，请勿手改（运行 npm run build 覆盖）\n` +
    ` * ${note}\n` +
    ` * ==========================================================================*/\n` +
    `(function () {\n  'use strict';\n  window.${globalName} = ${JSON.stringify(value)};\n})();\n`;
  writeFileSync(join(PIECES, file), body);
}

writeSnapshot(
  '07-manifest.snapshot.js',
  'CPL_MANIFEST_SNAPSHOT',
  manifest,
  `内容快照：${manifest.count} 课。fetch('manifest.json') 失败时用它兜底。`
);

let syllabusSnapshot = null;
try {
  syllabusSnapshot = JSON.parse(io.readFile('content/syllabus.json'));
} catch (err) {
  warnings.push('content/syllabus.json 缺失或解析失败，导航将按周次平铺：' + err.message);
}
writeSnapshot(
  '07-syllabus.snapshot.js',
  'CPL_SYLLABUS_SNAPSHOT',
  syllabusSnapshot,
  '课程大纲快照（模块划分与周次安排）。'
);

// 重新读取 pieces（因为刚写入了两个快照）
const readPiece = (f) => readFileSync(join(PIECES, f), 'utf8');
const jsSources = jsFiles.map((f) => ({ file: f, text: readPiece(f) }));
const cssSources = cssFiles.map((f) => ({ file: f, text: readPiece(f) }));

// ─────────────────────────────────────────────────────────────
// 1. 硬检查 A：密钥 / 凭据泄露扫描
// ─────────────────────────────────────────────────────────────
// 允许出现 "process.env.AI_API_KEY"（服务端读取），但绝不允许出现真实密钥字面量。
const SECRET_PATTERNS = [
  { re: /\bsk-[A-Za-z0-9_-]{16,}/g, what: 'OpenAI 风格密钥字面量' },
  { re: /\bsk-ant-[A-Za-z0-9_-]{16,}/g, what: 'Anthropic 密钥字面量' },
  { re: /\bghp_[A-Za-z0-9]{20,}/g, what: 'GitHub token' },
  { re: /\bgithub_pat_[A-Za-z0-9_]{20,}/g, what: 'GitHub PAT' },
  { re: /\bAKIA[0-9A-Z]{16}\b/g, what: 'AWS Access Key' },
  { re: /\bAIza[0-9A-Za-z_-]{30,}/g, what: 'Google API Key' },
  { re: /Authorization\s*:\s*["'`]Bearer\s+[A-Za-z0-9._-]{12,}/g, what: '硬编码 Bearer 头' },
  { re: /\b(?:api[_-]?key|apikey|secret|token|password)\s*[:=]\s*["'`][A-Za-z0-9_\-.]{16,}["'`]/gi, what: '硬编码凭据赋值' },
];

function scanSecrets(text, where) {
  for (const { re, what } of SECRET_PATTERNS) {
    re.lastIndex = 0;
    const hit = re.exec(text);
    if (hit) {
      const line = text.slice(0, hit.index).split('\n').length;
      errors.push(`${where}:${line} 检测到疑似${what}，禁止提交密钥到仓库`);
    }
  }
}

for (const { file, text } of [...jsSources, ...cssSources]) scanSecrets(text, `pieces/${file}`);
scanSecrets(readFileSync(join(ROOT, 'index.html'), 'utf8'), 'index.html');

// ─────────────────────────────────────────────────────────────
// 2. 硬检查 B：每个 .js 分片必须是可解析的 ESM（能捕捉语法错误）
// ─────────────────────────────────────────────────────────────
for (const { file } of jsSources) {
  try {
    // 只解析、不执行：import() 会真正执行分片，而分片依赖浏览器 DOM。
    // 产物是经典脚本，所以用 Function 构造器做语法解析即可捕捉到绝大多数低级错误。
    // 分片允许写 ESM 式的 import/export（构建时会被剥离语义），这里先剥掉再解析。
    const src = readPiece(file)
      .replace(/^\s*import\s+[\s\S]*?from\s*['"][^'"]+['"];?[ \t]*$/gm, '')
      .replace(/^\s*export\s+default\s+/gm, 'void 0, ')
      .replace(/^\s*export\s+/gm, '');
    // eslint-disable-next-line no-new-func
    new Function(src);
  } catch (err) {
    errors.push(`pieces/${file} 语法检查失败：${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// 3. 拼接产物
// ─────────────────────────────────────────────────────────────
const cssOut = cssSources.map(({ file, text }) => banner(`pieces/${file}`) + text.trimEnd() + '\n').join('');
const jsOut = jsSources.map(({ file, text }) => banner(`pieces/${file}`) + text.trimEnd() + '\n').join('');

const jsHeader = `/*! cphys-cs-lab — app.js（构建产物，请勿直接编辑；改 pieces/*.js 后运行 npm run build） */
"use strict";
`;
const forcedHeader = `/*! cphys-cs-lab — app.css（构建产物，请勿直接编辑；改 pieces/*.css 后运行 npm run build） */
@charset "UTF-8";
`;

const appCss = forcedHeader + cssOut;
const appJs = jsHeader + jsOut;

// 经典脚本里的转义陷阱：分片若包含 HTML 注释或裸 ${ 在模板串外，会在拼接后语义漂移。
if (/<\/script/i.test(appJs)) {
  errors.push('app.js 中出现 "</script" 字面量，会提前关闭 <script> 标签；请写成 "<\\/script"');
}

// ─────────────────────────────────────────────────────────────
// 3b. 确定性自检：同样的输入必须得到逐字节相同的产物
//
// 为什么放在这里，而不是让 CI 再跑一次 `npm run build` 然后 diff：
//   再跑一次会重写 manifest.json，而 manifest 里有 generatedAt 时间戳，
//   diff 必然非零 —— 于是"时间戳变了"被误报成"构建不确定"，挡住整个发布。
//   （这个坑真的踩到了：Deploy 工作流连续失败在这一步。）
//   现在改成在**内存里**独立重算一遍拼接结果并比较哈希：
//   既不碰磁盘、不受时间戳干扰，又能真正抓到哈希遍历顺序之类的非确定性。
// ─────────────────────────────────────────────────────────────
{
  const sha = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
  const rejoin = (sources) => sources.map(({ file, text }) => banner(`pieces/${file}`) + text.trimEnd() + '\n').join('');

  if (sha(forcedHeader + rejoin(cssSources)) !== sha(appCss)) {
    errors.push('构建不确定性：两次拼接 app.css 的结果不同');
  }
  if (sha(jsHeader + rejoin(jsSources)) !== sha(appJs)) {
    errors.push('构建不确定性：两次拼接 app.js 的结果不同');
  }
  // manifest 的课程顺序必须是确定的（按周次、再按 id），
  // 否则导航顺序会随文件系统返回顺序漂移。
  for (let i = 1; i < manifest.lessons.length; i++) {
    const a = manifest.lessons[i - 1];
    const b = manifest.lessons[i];
    if (a.week > b.week || (a.week === b.week && String(a.id) > String(b.id))) {
      errors.push(`manifest 排序不确定：${a.id}（第 ${a.week} 周）排在 ${b.id}（第 ${b.week} 周）之前`);
      break;
    }
  }
}

writeFileSync(join(ROOT, 'app.css'), appCss);
writeFileSync(join(ROOT, 'app.js'), appJs);

// ─────────────────────────────────────────────────────────────
// 4. 重写 index.html 里的产物引用（含 CSP 用的脚本哈希）
// ─────────────────────────────────────────────────────────────
const manifestCount = manifest.count;
const indexPath = join(ROOT, 'index.html');
let html = readFileSync(indexPath, 'utf8');

const sha256 = (s) => 'sha256-' + createHash('sha256').update(s, 'utf8').digest('base64');

// 外链 app.js/app.css 时，CSP 不需要脚本哈希；但为了支持"单文件内联"发行版，
// 我们仍然把哈希写进一个 data 属性，供需要内联的部署方式读取。
const scriptHash = sha256(appJs);
const styleHash = sha256(appCss);

const INJECT_RE = /(<!--\s*CPL:INJECT\s*-->)([\s\S]*?)(<!--\s*\/CPL:INJECT\s*-->)/g;
if (!INJECT_RE.test(html)) {
  errors.push('index.html 缺少 <!-- CPL:INJECT --> ... <!-- /CPL:INJECT --> 注入区');
  INJECT_RE.lastIndex = 0;
}
INJECT_RE.lastIndex = 0;

const injected = `<!-- CPL:INJECT -->
    <!-- 由 npm run build 生成；请勿手改。改 pieces/ 后重新构建。 -->
    <link rel="stylesheet" href="./app.css?v=${styleHash.slice(7, 15)}" />
    <script src="./app.js?v=${scriptHash.slice(7, 15)}" defer></script>
    <!-- /CPL:INJECT -->`;

html = html.replace(INJECT_RE, injected);
html = html.replace(/(<html[^>]*\sdata-cpl-script-hash=")[^"]*(")/, `$1${scriptHash}$2`);
html = html.replace(/(<html[^>]*\sdata-cpl-style-hash=")[^"]*(")/, `$1${styleHash}$2`);
html = html.replace(/(<html[^>]*\sdata-cpl-build=")[^"]*(")/, `$1${new Date().toISOString()}$2`);

writeFileSync(indexPath, html);

// ─────────────────────────────────────────────────────────────
// 5. 报告
//
// 注意用 Buffer.byteLength 而不是 String.length：
// 课程内容里大量中文，一个字符占 3 个 UTF-8 字节。
// 早期版本用 .length 报告，数字比磁盘上的实际大小小 20%，容易误判体积。
// ─────────────────────────────────────────────────────────────
const bytes = (s) => Buffer.byteLength(String(s), 'utf8');
const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const emit = (label, cols) => console.log(`  ${label.padEnd(12)} ${cols}`);

console.log('\ncphys-cs-lab 构建结果');
console.log('─'.repeat(64));
emit('app.js', `${kb(bytes(appJs))}  ← ${jsFiles.length} 个分片`);
emit('app.css', `${kb(bytes(appCss))}  ← ${cssFiles.length} 个分片`);
emit('index.html', `${kb(bytes(html))}`);
emit('manifest', `${manifestCount} 课 / ${kb(bytes(JSON.stringify(manifest)))}`);
emit('script hash', scriptHash);
console.log('─'.repeat(64));

for (const w of warnings) console.warn('  ⚠ ' + w);
if (errors.length) {
  console.error('\n构建失败：');
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log('  ✓ 构建通过（契约 / 语法 / 密钥扫描 全部通过）\n');
