// tests/helpers/load-app.mjs
//
// 按构建顺序（pieces/ 文件名排序 + 快照优先）在 DOM 桩里加载所有前端分片，
// 得到可以在 Node 里断言的 window.CPL。

import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPieces } from './dom-stub.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PIECES = join(ROOT, 'pieces');

const FIRST = ['07-manifest.snapshot.js', '07-syllabus.snapshot.js'];

export function pieceOrder() {
  const files = readdirSync(PIECES)
    .filter((f) => f.endsWith('.js'))
    .sort((a, b) => a.localeCompare(b, 'en'));
  files.sort((a, b) => {
    const ai = FIRST.indexOf(a);
    const bi = FIRST.indexOf(b);
    if (ai >= 0 || bi >= 0) return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    return 0;
  });
  return files;
}

/**
 * 加载全部（或指定）分片。
 * @param {{only?:string[], skip?:string[]}} opts
 */
export async function loadApp(opts = {}) {
  let files = pieceOrder();
  if (opts.only) files = files.filter((f) => opts.only.includes(f));
  if (opts.skip) files = files.filter((f) => !opts.skip.includes(f));
  const absolute = files.map((f) => join(PIECES, f));
  const result = await loadPieces(absolute);
  return { ...result, CPL: result.win.CPL, files };
}

export const ROOT_DIR = ROOT;
