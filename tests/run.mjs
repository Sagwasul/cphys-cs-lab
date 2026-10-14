// tests/run-all.mjs
//
// 一次跑完 tests/ 下的所有 *.test.mjs（同一进程、串行）。
//   node tests/run-all.mjs            全部
//   node tests/run-all.mjs markdown   只跑文件名含 "markdown" 的
//
// 每个测试文件都会 import 本文件？不会——测试文件只调用 tap.run()。
// 这里的做法是：先 import 所有测试文件（它们会自己登记测试），
// 然后依次调用每个文件导出的 runner？不可行（run 是全局的）。
//
// 因此实际结构是：**每个测试文件自己独立可执行**（node file.test.mjs），
// 本文件负责批量 spawn？—— 不行，沙箱禁止 spawn。
// 折中：本文件用动态 import 依次加载所有测试文件，tap 的全局注册表会把它们
// 全部收集起来，最后统一 run() 一次。文件名前缀用于让输出可读。

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from './helpers/tap.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TESTS = join(ROOT, 'tests');

function collect(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === 'helpers' || name === 'fixtures') continue;
      collect(full, out);
    } else if (name.endsWith('.test.mjs')) {
      out.push(full);
    }
  }
  return out;
}

const filter = process.argv[2];
let files = collect(TESTS).sort();
if (filter) files = files.filter((f) => f.includes(filter));

if (!files.length) {
  console.error(filter ? `没有匹配 "${filter}" 的测试文件` : 'tests/ 下没有 *.test.mjs');
  process.exit(1);
}

console.log(`\n批量测试：${files.length} 个文件（同进程顺序加载）`);
for (const f of files) console.log('  · ' + relative(ROOT, f));
console.log('');

for (const f of files) {
  try {
    await import(new URL(`file://${f.replace(/\\/g, '/')}`).href);
  } catch (err) {
    console.error(`\n✗ 加载测试文件失败：${relative(ROOT, f)}`);
    console.error('  ' + (err && err.stack ? err.stack : err));
    process.exitCode = 1;
  }
}

await run();
