// tests/helpers/tap.mjs
//
// 极小的测试注册与执行框架（约 100 行），在任何 Node 环境都能跑。
//
// 为什么不用 node:test：
//   `node --test` 以及 node:test 的编程式 run({ files }) 都会 fork 子进程并
//   通过管道收集结果。在受限沙箱（禁止创建命名管道）里会直接 EPERM。
//   本项目需要"在任何环境可复现"（验收标准之一），所以自带一个不 fork 的实现。
//
// 用法（与 node:test 手感一致）：
//   import { test, run } from '../helpers/tap.mjs';
//   import assert from 'node:assert/strict';
//
//   test('加法', () => { assert.equal(1 + 1, 2); });
//   test('异步', async () => { await something(); });
//   run();                     // 文件末尾调用一次；失败时设置 exitCode = 1

const tests = [];
let currentFile = 'unknown';

export function setFile(name) {
  currentFile = name;
}

/**
 * @param {string} name
 * @param {(t:{test:Function, diagnostic:Function})=>any} fn
 */
export function test(name, fn) {
  tests.push({ name, fn, file: currentFile });
}

export function suite(name, fn) {
  const before = tests.length;
  fn();
  for (let i = before; i < tests.length; i++) tests[i].name = `${name} › ${tests[i].name}`;
}

/** 让测试文件在 import 时自动登记自己的路径。 */
export function autoFile(url) {
  try {
    const p = new URL(url).pathname;
    currentFile = decodeURIComponent(p.replace(/^\/([A-Za-z]:)/, '$1')).split(/[\\/]/).slice(-2).join('/');
  } catch {
    /* 保持默认 */
  }
}

function formatError(err) {
  if (!err) return String(err);
  const msg = err.message || String(err);
  const stack = String(err.stack || '')
    .split('\n')
    .slice(1, 4)
    .map((l) => '      ' + l.trim())
    .join('\n');
  return stack ? `${msg}\n${stack}` : msg;
}

/** 执行全部已登记测试并打印 TAP 风格结果。返回失败数。 */
export async function run() {
  const started = Date.now();
  let pass = 0;
  const failures = [];

  for (const t of tests) {
    const t0 = Date.now();
    try {
      const ctx = {
        test: (n, f) => test(`${t.name} › ${n}`, f),
        diagnostic: (msg) => console.log(`# ${msg}`),
      };
      // 支持返回 Promise 的异步测试
      await t.fn(ctx);
      pass++;
      console.log(`ok   ${t.name}  (${Date.now() - t0}ms)`);
    } catch (err) {
      failures.push({ name: t.name, err });
      console.log(`FAIL ${t.name}  (${Date.now() - t0}ms)`);
      console.log('     ' + formatError(err).split('\n').join('\n     '));
    }
  }

  console.log('');
  console.log(`1..${tests.length}`);
  console.log(`# ${pass} passed, ${failures.length} failed, ${tests.length} total (${Date.now() - started}ms)`);
  if (failures.length) {
    console.log('# 失败清单：');
    for (const f of failures) console.log(`#   ✗ ${f.name}`);
  }
  // 用显式退出码而不是 process.exitCode：某些环境下（例如被其他脚本包裹时）
  // exitCode 可能被后续代码覆盖，导致"测试失败但退出码为 0"。
  process.exit(failures.length > 0 ? 1 : 0);
}

/** 断言辅助：抛出的错误信息更贴近本项目语境。 */
export const expect = {
  ok(value, msg) {
    if (!value) throw new Error(msg || `期望为真，实际 ${JSON.stringify(value)}`);
  },
  equal(actual, expected, msg) {
    if (actual !== expected) throw new Error(msg || `期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}`);
  },
  notEqual(actual, expected, msg) {
    if (actual === expected) throw new Error(msg || `期望不等于 ${JSON.stringify(expected)}，但相等`);
  },
  deepEqual(actual, expected, msg) {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) throw new Error(msg || `深比较失败\n  期望 ${b}\n  实际 ${a}`);
  },
  includes(haystack, needle, msg) {
    if (!String(haystack).includes(needle)) throw new Error(msg || `期望包含 ${JSON.stringify(needle)}`);
  },
  notIncludes(haystack, needle, msg) {
    if (String(haystack).includes(needle)) throw new Error(msg || `不应包含 ${JSON.stringify(needle)}`);
  },
  match(text, re, msg) {
    if (!re.test(String(text))) throw new Error(msg || `期望匹配 ${re}`);
  },
  throws(fn, msg) {
    let threw = false;
    try {
      fn();
    } catch {
      threw = true;
    }
    if (!threw) throw new Error(msg || '期望抛出错误，但没有');
  },
  async rejects(promise, msg) {
    let threw = false;
    try {
      await promise;
    } catch {
      threw = true;
    }
    if (!threw) throw new Error(msg || '期望 Promise 被拒绝，但成功完成了');
  },
};
