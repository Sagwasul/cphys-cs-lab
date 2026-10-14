/* ============================================================================
 * _template.js — 课程文件模板
 *
 * 复制本文件到 content/<folder>/ 下改名即可开始写课。
 * 注意：课程文件是"经典脚本"（不是 ES 模块），因此：
 *   ✗ 不要写 import / export
 *   ✓ 用 (function(){ ... })() 包起来，避免污染全局
 *   ✓ 结尾必须调用 CPL.registerLesson({...})
 *
 * 构建脚本会检查三条硬约束（缺一即 npm run build 失败）：
 *   1. 文件顶部有 //__CPL_META__ {...} 元数据行；
 *   2. 文中有 CPL.registerLesson( 调用；
 *   3. 不含 import/export 语句。
 * ==========================================================================*/

//__CPL_META__ {"id":"template-lesson","module":0,"week":0,"title":"课程模板","subtitle":"复制我","tags":["template"]}

(function () {
  'use strict';

  CPL.registerLesson({
    // ── 元数据 ────────────────────────────────────────────────
    id: 'template-lesson',
    module: 0,
    week: 0,
    title: '课程模板',
    subtitle: '复制我，然后删掉这段说明',
    tags: ['template'],

    // ── 1. 学习目标 ───────────────────────────────────────────
    // 用可检验的动词：能推导 / 能预测 / 能定位 / 能解释。
    // 不要写"了解""熟悉"这类无法检验的词。
    objectives: [
      '能解释本课核心概念，并说明它在哪类数值计算里会出问题。',
      '能预测把某个参数改大 10 倍后，误差或耗时会怎么变化。',
      '能把概念用在一段自己的代码里，并说出为什么这样写。',
    ],

    // ── 2. 核心概念（概念性知识：必须内化） ────────────────────
    concepts: [
      {
        term: '概念名称',
        // must: 'internalize' 概念性知识 | 'lookup' 工具性细节
        must: 'internalize',
        body: [
          '用 Markdown 写清定义、直觉、以及一个反例。',
          '',
          '$$ f(x) = \\frac{1}{1 + e^{-x}} $$',
          '',
          '> [!PHYSICS] 物理直觉',
          '> 这里写"为什么物理上会这样"，而不是"数学上是什么"。',
        ].join('\n'),
        // 自检问题：能答上来才算内化
        selfCheck: ['不看笔记，能否在 1 分钟内说明它的适用条件？', '它失效的典型场景是什么？'],
      },
    ],

    // ── 3. 工具速查（知道存在、会查即可） ──────────────────────
    tools: [
      {
        name: '某个 API / 命令 / 语法',
        must: 'lookup',
        code: 'np.linalg.solve(A, b)',
        doc: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html',
        note: '一句话说明它干什么、什么时候用。',
      },
    ],

    // ── 4. 交互式 demo ────────────────────────────────────────
    // kind 要在 CPL.demos 里注册过（见 pieces/80-demos.js）
    demo: {
      kind: 'growth-curve',
      title: '参数扫描：看曲线怎么长',
      intro: '拖动滑块，观察不同复杂度在同一 N 下的数量级差异。',
      params: { N: 100000 },
    },

    // ── 5. 代码练习（浏览器内运行） ───────────────────────────
    exercise: {
      id: 'main',
      lang: 'python',
      title: '用 O(N) 解法替换 O(N²) 暴力解',
      brief: '实现 two_sum(nums, target)，返回一对下标；要求均摊 O(N)。',
      starter: [
        'def two_sum(nums, target):',
        '    """返回两个下标 i<j 使 nums[i]+nums[j]==target；无解返回 None。"""',
        '    # TODO: 用字典/集合把内层循环消掉',
        '    for i in range(len(nums)):',
        '        for j in range(i + 1, len(nums)):',
        '            if nums[i] + nums[j] == target:',
        '                return (i, j)',
        '    return None',
      ].join('\n'),
      solution: [
        'def two_sum(nums, target):',
        '    seen = {}',
        '    for i, v in enumerate(nums):',
        '        need = target - v',
        '        if need in seen:',
        '            return (seen[need], i)',
        '        seen[v] = i',
        '    return None',
      ].join('\n'),
      hints: ['遍历到 v 时，只需要知道 target-v 之前出现过没有。', '为什么用 dict 而不是 list 存"见过的值"？'],
    },

    // ── 6. 自动测试 ───────────────────────────────────────────
    // kind: 'python' 在浏览器 Pyodide 里跑；'static' 只做静态断言（不需要运行时）
    tests: [
      {
        name: '正确性：基本用例',
        kind: 'python',
        assert: [
          'assert two_sum([2, 7, 11, 15], 9) in [(0, 1), (1, 0)]',
          'assert two_sum([3, 2, 4], 6) in [(1, 2), (2, 1)]',
        ].join('\n'),
      },
      {
        name: '复杂度：规模翻倍耗时增长应接近线性，而不是四倍',
        kind: 'python',
        assert: [
          'import time, random',
          'random.seed(0)',
          'def timed(n):',
          '    nums = [random.randrange(10**9) for _ in range(n)]',
          '    t = time.perf_counter(); two_sum(nums, -1); return time.perf_counter() - t',
          't1 = max(timed(20000), 1e-4)',
          't2 = max(timed(40000), 1e-4)',
          'ratio = t2 / t1',
          'assert ratio < 3.2, f"规模翻倍耗时增长 {ratio:.2f} 倍，看起来还是 O(N^2)"',
        ].join('\n'),
      },
    ],

    // ── 7. AI 助教引导问题（只提问，不给答案） ────────────────
    aiPrompts: [
      '你测到的耗时比值是多少？和"线性"理论值 2 差多少？差的部分来自哪里？',
      '如果输入是排好序的数组，能不能不用额外空间？代价是什么？',
      '你的 PRB/CPC 代码里有没有同样形状的"嵌套循环可以消掉"的地方？',
    ],

    // ── 8. Anki 卡片 ──────────────────────────────────────────
    anki: [
      { front: '问题正面（要能独立回答）', back: '答案背面，附一个最小代码片段或数值例子。', tags: ['template'] },
    ],

    // ── 9. 延伸阅读 ───────────────────────────────────────────
    reading: [
      { title: '教材名 · 第 X 章', url: 'https://example.com', note: '只读这一节，重点看 Y。' },
    ],

    // ── 10. 完成自检清单 ─────────────────────────────────────
    checklist: [
      '能不看笔记说清核心概念的适用条件与失效场景',
      '练习的自动测试全部通过',
      '能举出一个自己代码里的同类例子',
      '把本课卡片加进 Anki 并复习过一次',
    ],
  });
})();
