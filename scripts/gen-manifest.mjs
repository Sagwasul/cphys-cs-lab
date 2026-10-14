// scripts/gen-manifest.mjs
//
// 扫描 content/ 生成 manifest.json。
//   node scripts/gen-manifest.mjs            # 写入 manifest.json
//   node scripts/gen-manifest.mjs --check    # 只校验，不写文件（CI 用）
//
// 构建脚本 scripts/build.mjs 会复用同一个库，保证两处结果一致。

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildManifest } from './lib/manifest.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

const io = {
  readFile: (p) => readFileSync(join(ROOT, p), 'utf8'),
  listDir: (dir) => readdirSync(join(ROOT, dir)),
};

const { manifest, problems } = buildManifest(io, 'content');

if (problems.length) {
  console.error('内容契约问题：');
  for (const p of problems) console.error('  ✗ ' + p);
  process.exit(1);
}

const out = JSON.stringify(manifest, null, 2) + '\n';
const target = join(ROOT, 'manifest.json');

if (checkOnly) {
  if (!existsSync(target)) {
    console.error('manifest.json 不存在，请运行 npm run manifest');
    process.exit(1);
  }
  const current = JSON.parse(readFileSync(target, 'utf8'));
  const same = JSON.stringify({ ...current, generatedAt: null }) === JSON.stringify({ ...manifest, generatedAt: null });
  if (!same) {
    console.error('manifest.json 与 content/ 不同步，请运行 npm run manifest');
    process.exit(1);
  }
  console.log(`manifest 校验通过（${manifest.count} 课）`);
} else {
  writeFileSync(target, out);
  console.log(`已写入 manifest.json：${manifest.count} 课，${manifest.lessons.reduce((n, l) => n + l.bytes, 0)} 字节内容`);
}
