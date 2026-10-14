// scripts/serve.mjs
//
// 零依赖的本地静态服务器（用于预览，不是部署方案）。
//   node scripts/serve.mjs            默认 http://127.0.0.1:5173
//   node scripts/serve.mjs 8080       指定端口
//
// 为什么需要它：Pyodide / CodeMirror / fetch('manifest.json') 在 file:// 下都会失败
// （浏览器禁止从本地文件读其它文件）。用本地 http 服务就没有这个问题。
//
// 安全：只服务本目录之下的文件，拒绝路径穿越（..）；默认只绑定 127.0.0.1。

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, sep, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(join(dirname(fileURLToPath(import.meta.url)), '..'));
const PORT = Number(process.argv[2] || process.env.PORT || 5173);
const HOST = process.env.HOST || '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.map': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.whl': 'application/octet-stream',
  '.zip': 'application/zip',
};

const server = createServer(async (req, res) => {
  const started = Date.now();
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';

    // 路径穿越防护：规范化后必须仍在 ROOT 之内
    const target = normalize(join(ROOT, pathname));
    if (target !== ROOT && !target.startsWith(ROOT + sep)) {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('403 拒绝访问');
      return;
    }

    let filePath = target;
    let st = await stat(filePath).catch(() => null);
    if (st && st.isDirectory()) {
      filePath = join(filePath, 'index.html');
      st = await stat(filePath).catch(() => null);
    }

    if (!st || !st.isFile()) {
      // 单页应用回退：只对"根路径或没有扩展名的路径"回退到 index.html。
      // 对 content/xxx.js 这类明确带扩展名的请求必须返回真正的 404，
      // 否则加载失败会被伪装成"拿到了 HTML"，让排查变得非常困难
      // （浏览器会报 "Unexpected token '<'"，而不是清晰的 404）。
      const ext = extname(pathname);
      const isRoute = !ext || ext === '.html';
      const fallback = join(ROOT, 'index.html');
      const fb = isRoute ? await stat(fallback).catch(() => null) : null;
      if (fb && fb.isFile()) {
        const body = await readFile(fallback);
        res.writeHead(200, { 'content-type': MIME['.html'], 'cache-control': 'no-cache' });
        res.end(body);
        console.log(`200 ${pathname} → index.html (SPA 回退)`);
        return;
      }
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('404 未找到');
      console.log(`404 ${pathname}`);
      return;
    }

    const body = await readFile(filePath);
    const type = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'content-type': type,
      // 本地预览禁用缓存，避免改了 pieces 还看到旧产物
      'cache-control': 'no-cache, no-store, must-revalidate',
      'x-content-type-options': 'nosniff',
    });
    res.end(body);
    console.log(`200 ${pathname} (${body.length} B, ${Date.now() - started}ms)`);
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('500 服务器内部错误');
    console.error('500', err && err.message);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n本地预览：http://${HOST}:${PORT}/`);
  console.log(`服务目录：${ROOT}`);
  console.log('提示：浏览器内 Python 需要联网下载 Pyodide（首次约 13.5 MB）。');
  console.log('按 Ctrl+C 停止。\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用。换一个：node scripts/serve.mjs ${PORT + 1}`);
  } else {
    console.error('服务器启动失败：', err.message);
  }
  process.exit(1);
});
