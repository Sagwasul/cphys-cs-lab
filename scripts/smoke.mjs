// scripts/smoke.mjs
//
// 构建产物冒烟测试：把站点按"发布目录"的方式跑起来，逐个请求关键资源。
//
// 为什么需要它：单元测试是在进程内直接读 pieces/ 的，**没有经过 HTTP**。
// 而真实部署里最常见的失败恰恰是 HTTP 层面的：
//   · 某个资源路径写错（404）
//   · Content-Type 不对（浏览器拒绝执行）
//   · 产物没被重新构建（app.js 里还是旧内容）
//   · .nojekyll 缺失导致 GitHub Pages 忽略下划线开头的文件
// 这个脚本把这些一次性检查掉。
//
// 用法：
//   node scripts/smoke.mjs            检查当前目录
//   node scripts/smoke.mjs dist       检查 dist/ 目录（CI 里发布前跑）

import { createServer } from 'node:http';
import { readFile, stat, readdir } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { join, extname, normalize, sep, resolve, relative } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(join(HERE, '..'));
const SERVE_DIR = resolve(join(ROOT, process.argv[2] || '.'));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const failures = [];
const checks = [];

function ok(name, detail = '') {
  checks.push({ name, pass: true, detail });
  console.log(`  ✓ ${name}${detail ? '  ' + detail : ''}`);
}
function bad(name, detail = '') {
  checks.push({ name, pass: false, detail });
  failures.push(`${name}${detail ? ' — ' + detail : ''}`);
  console.log(`  ✗ ${name}${detail ? '  ' + detail : ''}`);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const target = normalize(join(SERVE_DIR, pathname));
    if (target !== SERVE_DIR && !target.startsWith(SERVE_DIR + sep)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    let st = await stat(target).catch(() => null);
    if (st && st.isDirectory()) {
      res.writeHead(301, { location: url.pathname + '/' }).end();
      return;
    }
    if (!st || !st.isFile()) {
      res.writeHead(404).end('404');
      return;
    }
    res.writeHead(200, { 'content-type': MIME[extname(target).toLowerCase()] || 'application/octet-stream' });
    createReadStream(target).pipe(res);
  } catch {
    res.writeHead(500).end('500');
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

console.log(`\n冒烟测试：${relative(ROOT, SERVE_DIR) || '.'}（本地端口 ${port}）\n`);

async function get(path) {
  const res = await fetch(base + path, { redirect: 'manual' });
  const text = res.headers.get('content-type')?.includes('text') || res.headers.get('content-type')?.includes('json') ? await res.text() : '';
  return { status: res.status, type: res.headers.get('content-type') || '', length: text.length, text };
}

// ── 1. 必需文件存在且 Content-Type 正确 ─────────────────────
const REQUIRED = [
  ['/', 'text/html'],
  ['/app.js', 'text/javascript'],
  ['/app.css', 'text/css'],
  ['/manifest.json', 'application/json'],
  ['/content/syllabus.json', 'application/json'],
  ['/.nojekyll', ''],
];

for (const [path, expectedType] of REQUIRED) {
  const r = await get(path);
  if (r.status !== 200) {
    bad(`GET ${path}`, `HTTP ${r.status}`);
    continue;
  }
  if (expectedType && !r.type.includes(expectedType)) {
    bad(`GET ${path} Content-Type`, `期望含 ${expectedType}，实际 ${r.type}`);
    continue;
  }
  ok(`GET ${path}`, `${r.status} · ${r.type || 'no content-type'}`);
}

// ── 2. index.html 的注入区已被构建替换 ──────────────────────
{
  const r = await get('/');
  if (r.text.includes('<!-- CPL:INJECT -->') && !/app\.js\?v=/.test(r.text)) {
    bad('index.html 注入区', '仍然是未构建的模板（请运行 npm run build）');
  } else if (!/app\.js\?v=/.test(r.text)) {
    bad('index.html 引用 app.js', '没有找到带版本号的 app.js 引用');
  } else {
    ok('index.html 已注入构建产物', '带内容指纹的 app.js / app.css 引用');
  }
  if (!/<script[^>]+src="\.\/app\.js/.test(r.text)) {
    bad('index.html script 标签', '没有相对路径的 app.js（子路径部署会 404）');
  } else {
    ok('app.js 使用相对路径', '可在 GitHub Pages 子路径下工作');
  }
  if (/https?:\/\/[^"']*\/app\.js/.test(r.text)) {
    bad('app.js 使用了绝对 URL', '子路径部署下会指向错误地址');
  }
}

// ── 3. manifest.json 与 content/ 一致，且每个文件都能取到 ────
{
  const r = await get('/manifest.json');
  let manifest = null;
  try {
    manifest = JSON.parse(r.text);
  } catch {
    bad('manifest.json 解析', '不是合法 JSON');
  }
  if (manifest) {
    ok('manifest.json 可解析', `${manifest.count} 课`);
    if (!manifest.count) bad('课程数量', '清单里没有任何课程');

    let missing = 0;
    let badType = 0;
    for (const lesson of manifest.lessons) {
      const f = await get('/' + lesson.file.replace(/\\/g, '/'));
      if (f.status !== 200) {
        missing++;
        bad(`GET /${lesson.file}`, `HTTP ${f.status}`);
      } else if (!f.type.includes('javascript')) {
        badType++;
        bad(`GET /${lesson.file} Content-Type`, f.type);
      }
    }
    if (!missing && !badType) ok(`全部 ${manifest.lessons.length} 个课程文件可访问`, 'Content-Type 正确');

    // 清单里的 id 必须唯一
    const ids = manifest.lessons.map((l) => l.id);
    if (new Set(ids).size !== ids.length) bad('课程 id 唯一性', 'manifest 里有重复 id');
    else ok('课程 id 唯一', `${ids.length} 个`);
  }
}

// ── 4. 产物里不能出现服务端环境变量或密钥形态 ────────────────
{
  const js = await get('/app.js');
  const css = await get('/app.css');
  const combined = js.text + css.text;

  if (/process\.env/.test(js.text)) bad('app.js 含 process.env', '前端不应该读取服务端环境变量');
  else ok('app.js 不含 process.env');

  const secretRe = /sk-[A-Za-z0-9_-]{16,}|sk-ant-|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{30,}/;
  if (secretRe.test(combined)) bad('产物含密钥形态字符串', '构建期扫描应该已经拦住，请检查');
  else ok('产物不含密钥形态字符串');

  if (/javascript:/.test(css)) bad('app.css 含 javascript: 协议', '不应该出现在样式里');
}

// ── 5. 安全相关的默认值 ──────────────────────────────────────
{
  const html = (await get('/')).text;
  if (/window\.CPL_CONFIG/.test(html)) {
    ok('内联配置存在');
    // 先剔掉注释行，否则会匹配到示例注释里的 apiBase，造成误报
    const configBlock = html.replace(/^\s*\/\/.*$/gm, '');
    const m = /apiBase:\s*'([^']*)'/.exec(configBlock);
    if (!m) bad('apiBase 配置项', '没有找到 apiBase');
    else if (m[1] === '') ok('apiBase 默认为空', 'AI 助教进入离线模式（不会误连第三方）');
    else ok('apiBase 已配置', m[1].replace(/\/\/[^/]+/, '//<host>'));
  } else {
    bad('内联配置', 'index.html 里没有 window.CPL_CONFIG');
  }

  if (/http-equiv="Content-Security-Policy"/.test(html)) ok('CSP meta 存在');
  else bad('CSP meta 缺失');

  if (/image\/svg\+xml/.test((await get('/app.js')).text)) ok('URL 白名单包含 svg 例外处理');
}

// ── 6. 用户内容示例必须与契约一致（它就是给用户抄的模板） ─────
{
  const r = await get('/content/user/example-lesson.js');
  if (r.status === 200) {
    ok('用户内容示例可访问');
    if (!/CPL\.registerLesson/.test(r.text)) bad('示例缺少 CPL.registerLesson 调用');
    else ok('示例包含自注册调用');
    if (/^\s*export\s/m.test(r.text) || /^\s*import\s+[^\n]*from\s*['"]/m.test(r.text)) {
      bad('示例含 ESM 语法', '课程文件必须是经典脚本');
    } else {
      ok('示例是经典脚本（无 import/export）');
    }
  } else {
    bad('GET /content/user/example-lesson.js', `HTTP ${r.status}`);
  }
}

// ── 7. 目录结构一致性 ────────────────────────────────────────
{
  try {
    const entries = await readdir(SERVE_DIR);
    if (entries.includes('index.html') && entries.includes('app.js') && entries.includes('content')) {
      ok('发布目录结构完整', 'index.html + app.js + content/');
    } else {
      bad('发布目录结构', `缺少必需项：${['index.html', 'app.js', 'content'].filter((e) => !entries.includes(e)).join(', ')}`);
    }
    if (entries.includes('pieces') || entries.includes('scripts') || entries.includes('tests')) {
      // 发布目录里出现源码目录不是致命错误，但会让页面体积变大、也可能误暴露源码
      console.log('  ⚠ 发布目录里包含源码目录（pieces/ scripts/ tests/），建议在部署工作流里只拷贝产物');
    }
  } catch (err) {
    bad('读取发布目录', err.message);
  }
}

server.close();

console.log('');
const passCount = checks.filter((c) => c.pass).length;
console.log(`冒烟结果：${passCount} / ${checks.length} 通过`);
if (failures.length) {
  console.log('\n失败项：');
  for (const f of failures) console.log('  ✗ ' + f);
  console.log('');
  process.exit(1);
}
console.log('✓ 发布产物通过全部 HTTP 冒烟检查\n');
