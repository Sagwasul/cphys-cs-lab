/* ============================================================================
 * _example.js — 内置"用户自定义课程"的格式示例
 *
 * 用途：当你想把自己的内容贡献成**站点内置课程**（所有人可见）时，
 * 复制本文件、改名、改内容，然后提 PR。
 *
 * 日常使用**不需要**这个文件：直接在网站的「我的内容」页面写就行，
 * 数据存在你自己的浏览器里，可以导出 JSON 备份。
 *
 * 硬性要求（构建脚本与测试会逐条检查）：
 *   1. 第一行必须是 //__CPL_META__ {...}
 *   2. 必须是经典脚本：禁止 import/export/eval/new Function/document.write
 *   3. 必须调用 CPL.registerLesson({...})
 *   4. 至少要有：objectives / (concepts 或 sections) / (demo 或 sections) /
 *      (exercise 或 sections) / tests / aiPrompts / anki / reading / checklist
 *   5. aiPrompts 每一条都要以 ？ 结尾
 *
 * 最简单的写法：只写 sections（纯笔记，渲染器会自动当作"核心概念"展示）。
 * 完整的写法：把所有字段都填上（能带交互 demo 与自动测试）。
 * ==========================================================================*/

//__CPL_META__ {"id":"user-example-lesson","module":7,"week":99,"title":"自定义课程示例（复制我）","subtitle":"纯笔记形式的内置课程模板","tags":["自定义","示例"]}

(function () {
  'use strict';

  CPL.registerLesson({
    id: 'user-example-lesson',
    module: 7,
    week: 99,
    title: '自定义课程示例（复制我）',
    subtitle: '纯笔记形式的内置课程模板',
    tags: ['自定义', '示例'],

    // ── 学习目标（≥1 条，用可检验的动词） ──────────────────────
    objectives: [
      '能说明周期性边界条件与 Dirichlet 边界在物理含义上的区别。',
      '能解释为什么在循环里 np.append 是 O(N²)。',
    ],

    // ── 正文（纯笔记形式） ─────────────────────────────────────
    // sections 会被渲染为"核心概念"列表，每节的 body 走 Markdown 渲染。
    sections: [
      {
        title: '周期性边界：用 np.roll 表达"两端互为邻居"',
        body: [
          '周期性边界的意思是：**最后一个格点的右邻居是第一个格点**。',
          '',
          '最直接的实现是取模索引，但 NumPy 里更清晰、也更快的是 `np.roll`：',
          '',
          '```python',
          'import numpy as np',
          '',
          'def laplacian_periodic(u, dx=1.0):',
          '    """周期边界下的一维拉普拉斯算子。"""',
          '    return (np.roll(u, -1) - 2 * u + np.roll(u, +1)) / dx**2',
          '```',
          '',
          '`np.roll` 把数组整体平移并**把移出去的部分补回另一头**，这正是周期性。',
          '',
          '> [!CAUTION] 常见错误',
          '> 把周期边界写成"两端设为 0"——那是 Dirichlet 边界，物理含义完全不同：',
          '> 一个表示"系统首尾相连、没有边界"，另一个表示"边界被固定住"。',
          '> 写错边界条件不会报错，只会给出错误的物理结果，而且往往仍然"看起来合理"。',
        ].join('\n'),
      },
      {
        title: '不要在循环里 np.append',
        body: [
          '`np.append` 每次都**新建数组并复制全部元素**，因此在长度为 N 的循环里总代价是 O(N²)。',
          '',
          '```python',
          '# 错误：O(N^2)',
          'acc = np.array([])',
          'for i in range(n):',
          '    acc = np.append(acc, value(i))',
          '',
          '# 正确 A：先收集到 Python list（摊销 O(1)），最后一次性转换',
          'buf = []',
          'for i in range(n):',
          '    buf.append(value(i))',
          'acc = np.asarray(buf, dtype=float)',
          '',
          '# 正确 B：预先分配，按下标赋值（最快）',
          'acc = np.empty(n, dtype=float)',
          'for i in range(n):',
          '    acc[i] = value(i)',
          '```',
          '',
          '> [!NUMERIC] 数量级',
          '> N = 10⁵ 时，O(N²) 是 10¹⁰ 次元素搬运，按 1 ns/次 估计约 10 秒；',
          '> 改成 O(N) 之后是 10⁵ 次，约 0.1 毫秒。**差五个数量级。**',
        ].join('\n'),
      },
    ],

    // ── 工具速查（可选） ────────────────────────────────────────
    tools: [
      {
        name: 'np.roll',
        must: 'lookup',
        code: 'np.roll(arr, shift)',
        doc: 'https://numpy.org/doc/stable/reference/generated/numpy.roll.html',
        note: '循环移位，天然表达周期性边界；注意它是复制而非视图，热点处要留意额外内存。',
      },
    ],

    // ── 交互 demo（可选；kind 必须是已注册的） ──────────────────
    demo: {
      kind: 'float-error',
      title: '数值误差演示',
      intro: '把累加次数拉大，观察朴素求和的误差如何随 n 线性增长，而 Kahan 补偿基本不变。',
      params: { n: 10000 },
    },
    // demo 的可用 kind 见 pieces/82-demos.js 与 pieces/83-demos-cs.js

    // ── 代码练习（可选） ───────────────────────────────────────
    exercise: {
      id: 'main',
      lang: 'python',
      title: '用一次分配替代循环 append',
      brief: '实现 `build_squares(n)`，返回前 n 个平方数的 numpy 数组。要求预先分配，不要在循环里 append。',
      starter: [
        'import numpy as np',
        '',
        'def build_squares(n):',
        '    # TODO: 现在是 O(N^2)，改成一次分配',
        '    acc = np.array([], dtype=float)',
        '    for i in range(n):',
        '        acc = np.append(acc, i * i)',
        '    return acc',
      ].join('\n'),
      solution: [
        'import numpy as np',
        '',
        'def build_squares(n):',
        '    acc = np.empty(n, dtype=float)',
        '    for i in range(n):',
        '        acc[i] = i * i',
        '    return acc',
      ].join('\n'),
      hints: [
        'np.append 每次都会新建数组并复制全部元素——想想循环 N 次的总代价。',
        '有没有办法先知道最终需要多大？np.empty 或 np.arange 都可以。',
        '如果连循环都能省掉，用向量化会更短：np.arange(n, dtype=float) ** 2。',
      ],
    },

    // ── 自动测试（≥1 条） ──────────────────────────────────────
    tests: [
      {
        name: '正确性：前 n 个平方数',
        kind: 'python',
        assert: [
          'import numpy as np',
          'r = build_squares(10)',
          'assert len(r) == 10, f"长度应为 10，得到 {len(r)}"',
          'assert list(r) == [0.0, 1.0, 4.0, 9.0, 16.0, 25.0, 36.0, 49.0, 64.0, 81.0]',
          'assert len(build_squares(0)) == 0, "n=0 应返回空数组"',
        ].join('\n'),
      },
      {
        name: '静态检查：不允许在循环里用 np.append / np.array([]) 累积',
        kind: 'static',
        // 为什么把这条做成静态检查而不是计时断言：
        // np.append 的每次复制是 C 层 memcpy，常数极小。实测在 N=4 万时
        // "循环 append" 与"一次分配"的耗时差不到 2 倍，计时根本分不开
        // （规模要拉到几十万才明显，但那样在浏览器里会撞上 12 秒超时）。
        // 所以这里检查"写法"——这才是真正要教的东西。
        // 详见 ARCHITECTURE.md 的「静态测试为什么要剥掉注释与字符串」。
        rules: [
          {
            mustNotMatch: 'np\\.append\\s*\\(',
            message:
              '不要在循环里用 np.append 累积数组：每次都会新建并复制整个数组（O(N²)）。改成 np.empty + 下标赋值，或用 np.arange 之类的向量化构造。',
          },
          {
            mustNotMatch: 'np\\.array\\(\\s*\\[\\s*\\]',
            message:
              '不要从 np.array([]) 这样的空数组起步再往里加：应先确定最终大小（np.empty / np.zeros），或在最后用 np.asarray 一次性转换。',
          },
        ],
      },
      {
        name: '复杂度：规模翻倍时耗时增长不应达到平方量级',
        kind: 'python',
        assert: [
          'import time',
          'build_squares(2000)   # 热身',
          't0 = time.perf_counter(); build_squares(20000); t1 = max(time.perf_counter() - t0, 2e-4)',
          't0 = time.perf_counter(); build_squares(40000); t2 = max(time.perf_counter() - t0, 2e-4)',
          'ratio = t2 / t1',
          '# 这条只做"没出现平方爆炸"的兜底检查（阈值放宽到 4.0）。',
          '# 真正的判据是上面那条静态检查：不许用 np.append 累积。',
          '# 原因：np.append 的复制在 C 层做，常数极小，计时在这个规模上分不开。',
          'assert ratio < 4.0, f"规模翻倍耗时增长 {ratio:.2f} 倍，出现平方量级迹象（t1={t1*1000:.2f}ms t2={t2*1000:.2f}ms）"',
        ].join('\n'),
        timeoutMs: 30000,
      },
    ],

    // ── AI 引导问题（每一条都要以 ？ 结尾） ─────────────────────
    aiPrompts: [
      '你测到的耗时比值是多少？和线性解的理论值 2 差在哪里？',
      '如果预先分配时 n 写小了会发生什么？numpy 会替你扩容吗？',
      '你自己的代码里有没有"循环里反复 append 到 ndarray"的写法？',
    ],

    // ── Anki 卡片（≥1 张） ────────────────────────────────────
    anki: [
      {
        front: '周期性边界条件在 NumPy 里最清晰的实现是什么？为什么不能"把两端设为零"？',
        back: '`np.roll(u, ±1)`。把两端设为零是 Dirichlet 边界，表示"边界被固定"；周期边界表示"首尾相连、没有边界"，两者物理含义完全不同。',
        tags: ['boundary', 'numpy'],
      },
      {
        front: '为什么在循环里 np.append 是 O(N²)？正确写法是什么？',
        back: 'np.append 每次新建数组并复制全部元素，N 次循环的总复制量是 O(N²)。正确写法：先收集到 Python list（摊销 O(1)）最后 np.asarray；或预先 np.empty 后按下标赋值。',
        tags: ['numpy', 'amortized'],
      },
    ],

    // ── 延伸阅读（≥1 条） ─────────────────────────────────────
    reading: [
      {
        title: 'NumPy 官方广播文档',
        url: 'https://numpy.org/doc/stable/user/basics.broadcasting.html',
        note: '理解广播规则之后，很多显式循环都能消掉。',
      },
    ],

    // ── 完成自检清单（≥1 条） ─────────────────────────────────
    checklist: [
      '能说出周期性边界与 Dirichlet 边界的物理区别',
      '练习的两条自动测试都通过',
      '在自己最近写的代码里找到一处循环 append',
    ],
  });
})();
