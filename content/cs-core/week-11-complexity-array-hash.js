/* ============================================================================
 * week-11-complexity-array-hash.js — 模块 5 · 第 11 周
 * 复杂度 · 数组与字符串 · 哈希表
 *
 * 这是本模块的第一课，也是整个"CS 核心"路径的入口。
 * 概念内化的判据很具体：给你一段代码，你能在 30 秒内说出它的量级，
 * 并预测把 N 放大 10 倍之后会发生什么。
 * ==========================================================================*/

//__CPL_META__ {"id":"week-11-complexity-array-hash","module":5,"week":11,"title":"复杂度 · 数组 · 哈希表","subtitle":"把「量级判断」变成直觉，而不是查表","tags":["big-O","amortized","hash","array"]}

(function () {
  'use strict';

  CPL.registerLesson({
    id: 'week-11-complexity-array-hash',
    module: 5,
    week: 11,
    title: '复杂度 · 数组 · 哈希表',
    subtitle: '把「量级判断」变成直觉，而不是查表',
    tags: ['big-O', 'amortized', 'hash', 'array'],

    // ── 1. 学习目标 ─────────────────────────────────────────────
    objectives: [
      '能在 30 秒内说出给定循环结构的复杂度，并说明是哪一层在主导。',
      '能预测输入规模放大 10 倍后耗时/内存的变化倍数（而不是"会变慢"这种空话）。',
      '能推导动态数组按倍数扩容的摊销代价，并解释为什么是"倍数"而不是"每次加一"。',
      '能解释哈希表负载因子与期望探测次数的关系，并说出为什么要在 0.7 附近扩容。',
      '能在自己的数值代码里指出哪些"字典查找"其实可以换成一个数组下标。',
    ],

    // ── 2. 核心概念 ─────────────────────────────────────────────
    concepts: [
      {
        term: '大 O 是「量级」，不是「耗时」',
        must: 'internalize',
        body: [
          '大 O 描述的是**当输入规模趋于无穷时，增长的量级**。它丢掉了常数因子，这既是它的价值也是它的陷阱。',
          '',
          '$$T(N) = a\\,N^2 + b\\,N + c \\quad\\Longrightarrow\\quad T(N) = O(N^2)$$',
          '',
          '关键推论：**比较两个算法时，先看量级；量级相同时才比常数。**',
          '',
          '- 若 A 是 O(N²) 但常数极小，B 是 O(N log N) 但常数很大，',
          '  那么在 N 很小的时候 A 可能更快 —— 这就是"优化一个只在 N=100 时运行的函数"没有意义的原因。',
          '- 反过来，如果你的代码要处理 N = 10⁶，那么任何 O(N²) 都直接排除，',
          '  不论常数多小：10¹² 次操作在 1 ns/次 的估计下是 **1000 秒**。',
          '',
          '> [!PHYSICS] 科研代码里的实际判据',
          '> 先估算：**N 是多少？单步代价是多少？总操作数是 10⁶ 还是 10¹² ？**',
          '> 10⁹ 以内的操作数通常可以忍（秒级）；10¹² 必须换算法或换并行。',
          '> 这个判断应该在写代码之前做，不是跑完之后才想。',
          '',
          '一个具体对照（1 ns/次操作、每元素 8 字节）：',
          '',
          '| 复杂度 | N = 10³ | N = 10⁶ | N = 10⁹ |',
          '| --- | --- | --- | --- |',
          '| O(N) | 1 µs | 1 ms | 1 s |',
          '| O(N log N) | 10 µs | 20 ms | 30 s |',
          '| O(N²) | 1 ms | **1000 s** | 10⁹ s（31 年）|',
          '| O(2^N) | — | — | —（N>40 就别想了）|',
        ].join('\n'),
        selfCheck: [
          '不看笔记：N 从 10⁴ 增到 10⁵，O(N²) 的耗时变化多少倍？',
          '你说得出自己最近写的那段循环的复杂度吗？',
          '什么情况下你会**故意**选择一个量级更差的算法？',
        ],
        anchor: '任何一次"程序跑了很久没结束"，第一反应应该是估量级，而不是加 print。',
      },

      {
        term: '摊销分析：为什么 append 是 O(1)',
        must: 'internalize',
        body: [
          '动态数组（Python `list`、C++ `vector`、Fortran 的 `allocatable` 数组）容量用尽时会申请一块更大的内存并搬过去。',
          '单看那一次 `append`，代价是 O(N)。但它是**摊销** O(1) 的。',
          '',
          '设每次容量翻倍。第 k 次扩容时搬 k 个元素。到第 N 次追加为止，总搬运量：',
          '',
          '$$\\sum_{k=1}^{\\log_2 N} 2^k \\;=\\; 2N - 1 \\;=\\; O(N)$$',
          '',
          '均摊到 N 次追加上，每次是**常数**。这就是"按倍数扩容"而不是"每次加一个"的原因：',
          '后者每次都要搬运，总代价退化为 O(N²)。',
          '',
          '> [!NUMERIC] 这条结论在数值计算里的直接后果',
          '> **不要在循环里反复 `np.append` / `list.append` 到超大规模再转数组。**',
          '> 正确做法是：先算好最终大小，用 `np.empty` 一次分配；或者先收集到 Python list，最后 `np.asarray` 一次转换。',
          '> 二者都是摊销 O(N)；而"每次 append 到 ndarray"是 O(N²)。',
        ].join('\n'),
        selfCheck: [
          '如果改成每次扩容只增加 10% 的容量，摊销代价还是 O(1) 吗？常数变大了多少？',
          '为什么 C++ vector 的扩容因子通常是 1.5 或 2，而不是 1.1？',
          '你代码里有没有"循环里反复 append 到 ndarray"的写法？',
        ],
      },

      {
        term: '哈希表：用空间换常数',
        must: 'internalize',
        body: [
          '哈希表把"查找"从 O(N) 或 O(log N) 降到期望 O(1)。代价是：额外的内存、以及对哈希函数质量的依赖。',
          '',
          '两种主流的冲突处理方式：',
          '',
          '| 方式 | 做法 | 优点 | 缺点 |',
          '| --- | --- | --- | --- |',
          '| 链地址法 | 每个槽挂一个链表/数组 | 删除简单、负载因子可以 > 1 | 指针追逐，缓存不友好 |',
          '| 开放寻址 | 冲突时按探测序列找下一个空槽 | 连续内存，缓存友好 | 删除要用墓碑标记；负载因子必须 < 1 |',
          '',
          '负载因子 $\\alpha = n / m$（元素数 / 槽数）决定性能。开放寻址下的期望探测次数约为：',
          '',
          '$$\\text{成功查找} \\approx \\frac{1}{2}\\left(1 + \\frac{1}{1-\\alpha}\\right), \\qquad \\text{不成功查找} \\approx \\frac{1}{2}\\left(1 + \\frac{1}{(1-\\alpha)^2}\\right)$$',
          '',
          '把这个式子读一遍：**α 趋近 1 时探测次数发散**。所以工程上在 α ≈ 0.7 附近扩容，',
          '因为再往上性能掉得比省下的内存快得多。',
          '',
          '> [!CAUTION] 开放寻址为什么不能直接删除',
          '> 直接清空一个槽会**切断探测链**，让后面本来能找到的元素找不到。',
          '> 标准做法是写入一个"墓碑"（tombstone）标记：查找时继续往下走，插入时可以复用。',
          '> 墓碑过多时要整体 rehash，否则表会退化成线性扫描。',
          '',
          '> [!DEBUG] 什么时候哈希表会变慢',
          '> 1. 哈希函数太差（大量冲突）；2. 负载因子太高；3. 键的比较代价很高（比如长字符串）；',
          '> 4. 键是自定义对象但没实现好的哈希 —— Python 里这会让每元素比较变成 O(len)。',
          '> 把键换成整数 id，往往比优化循环本身更有效。',
        ].join('\n'),
        selfCheck: [
          'α 从 0.5 升到 0.9，开放寻址的不成功查找探测次数大约变化多少倍？',
          '为什么 Python 的 dict 在 3.6+ 是"紧凑"的？这对遍历性能有什么影响？',
          '你的代码里哪个字典的键是字符串，但其实可以用整数枚举代替？',
        ],
        anchor: '查找密集的内层循环里，dict 换成数组下标常常是最大的单点收益。',
      },

      {
        term: '内存布局决定常数因子',
        must: 'internalize',
        body: [
          '同一个算法，改一下内存访问顺序，速度可能差好几倍。原因是缓存：',
          'CPU 从主存取数据时按 **cache line（通常 64 字节）** 整块搬进缓存，',
          '所以"顺序访问"能用到搬进来的每一个字节，而"跨步访问"大部分是浪费。',
          '',
          '这就是 Fortran 列主序（第一个下标连续）与 C 行主序（最后一个下标连续）的差异根源：',
          '',
          '```fortran',
          '! Fortran: A(i,j) 中 i 是连续方向 → 内层循环走 i 最快',
          'do j = 1, n',
          '  do i = 1, n',
          '    s = s + A(i, j)',
          '  end do',
          'end do',
          '```',
          '',
          '```c',
          '// C: a[i][j] 中 j 是连续方向 → 内层循环走 j 最快',
          'for (int i = 0; i < n; i++)',
          '  for (int j = 0; j < n; j++)',
          '    s += a[i][j];',
          '```',
          '',
          '把循环顺序写反，代码完全正确，但性能可能掉一个量级。',
          '**这类问题不会给出错误结果，只会给出错误的耗时** —— 所以 profiler 比直觉重要。',
        ].join('\n'),
        selfCheck: [
          '在 Fortran 里把 A(i,j) 的两层循环顺序写反，会得到错误结果吗？为什么？',
          '如果你的数据结构是一串指针节点（链表/树），为什么"理论复杂度更优"不一定更快？',
          'cache line 是 64 字节：一个 double 占 8 字节，那么顺序访问时一条 cache line 能用几次？跨步 8 呢？',
        ],
        anchor: 'Fortran 列主序 → 内层循环走第一个下标（见第 7 周与内存模型 demo）。',
      },
    ],

    // ── 3. 工具速查 ─────────────────────────────────────────────
    tools: [
      {
        name: 'Python 内置容器的平均复杂度表',
        must: 'lookup',
        doc: 'https://wiki.python.org/moin/TimeComplexity',
        code: 'list.append: O(1) 摊销 | x in list: O(N) | d[k]: O(1) | set 去重: O(N)',
        note: '把这张表扫一遍就够，"x in list" 是最常见的手滑。',
      },
      {
        name: 'time.perf_counter',
        must: 'lookup',
        doc: 'https://docs.python.org/3/library/time.html#time.perf_counter',
        code: 'import time; t0 = time.perf_counter(); f(); dt = time.perf_counter() - t0',
        note: '测墙钟耗时的正确工具（time.time() 精度不足，time.clock() 已废弃）。',
      },
      {
        name: 'cProfile 快速定位热点',
        must: 'lookup',
        doc: 'https://docs.python.org/3/library/profile.html',
        code: 'python3 -m cProfile -s cumtime your_script.py | head -30',
        note: '先看 cumtime（累计）找大头，再看 tottime 找自身耗时。',
      },
      {
        name: 'np.asarray 替代 np.append',
        must: 'lookup',
        doc: 'https://numpy.org/doc/stable/reference/generated/numpy.asarray.html',
        code: 'arr = np.asarray(py_list, dtype=float)   # 一次分配，O(N)',
        note: '在循环里 np.append 是 O(N²)；先收集到 list 再一次性转换。',
      },
      {
        name: 'str.join 替代 += 拼字符串',
        must: 'lookup',
        doc: 'https://docs.python.org/3/library/stdtypes.html#str.join',
        code: '"".join(parts)   # O(N)；s += piece 在循环里是 O(N²)',
        note: 'CPython 对 str += 有优化，但不要依赖它；join 是明确的 O(N)。',
      },
    ],

    docChallenges: [
      {
        q: '给你这个陌生 API：`bisect.bisect_left(a, x, lo=0, hi=len(a))`。2 分钟内查出：它的返回值在 a 中有重复元素时是什么含义？时间复杂度多少？写一个最小示例。',
        answer: '返回**第一个不小于 x** 的位置（插入点），等价于 C++ 的 lower_bound。复杂度 O(log N)。最小示例：\n\n```python\nimport bisect\na = [1, 3, 3, 5]\nbisect.bisect_left(a, 3)   # 1  （第一个 3 的位置）\nbisect.bisect_right(a, 3)  # 3  （最后一个 3 之后）\n```',
      },
      {
        q: '在 Python 里，`x in some_list` 与 `x in some_set` 的复杂度分别是多少？如果 some_list 只有 8 个元素，你会换成 set 吗？为什么？',
        answer: '`in list` 是 O(N)，`in set` 是期望 O(1)，但 set 有额外的哈希与内存开销。元素很少（个位数）时，list 的顺序扫描往往**更快**——这正是"量级相同才比常数"的反向应用：小 N 下常数主导。',
      },
    ],

    // ── 4. 交互式 demo ──────────────────────────────────────────
    demo: {
      kind: 'growth-curve',
      title: '拖动滑块，看量级差异如何变成"卡死"',
      intro:
        '勾选几条复杂度曲线，把 N 拖到 10^5～10^6。注意表格里的"估算耗时"：它是把操作数乘以一个典型单次操作耗时得到的量级判断，用来回答"这台机器上还行不行"。点下面的按钮会真的跑一次循环给你看。',
      params: { N: 100000 },
    },

    // ── 5. 代码练习 ─────────────────────────────────────────────
    exercise: {
      id: 'main',
      lang: 'python',
      title: '把 O(N²) 的暴力查找换成 O(N) 的一次扫描',
      brief: [
        '给定一个整数列表 `nums` 与目标值 `target`，返回**一对下标** `(i, j)`（i < j）使得 `nums[i] + nums[j] == target`；无解返回 `None`。',
        '',
        '下面的 starter 是暴力双重循环（O(N²)）。要求你改成**单次扫描 + 哈希表**（均摊 O(N)）。',
        '',
        '提示（先自己想，卡住再看「卡住了？」）：先想清楚"当我走到第 i 个元素时，我需要知道什么"。',
      ].join('\n'),
      starter: [
        'def two_sum(nums, target):',
        '    """返回 (i, j) 使 nums[i] + nums[j] == target；无解返回 None。"""',
        '    # TODO: 现在是 O(N^2) 的暴力解。用哈希表把它降成 O(N)。',
        '    n = len(nums)',
        '    for i in range(n):',
        '        for j in range(i + 1, n):',
        '            if nums[i] + nums[j] == target:',
        '                return (i, j)',
        '    return None',
      ].join('\n'),
      solution: [
        'def two_sum(nums, target):',
        '    """一次扫描：走到 nums[i] 时，只需查 target - nums[i] 是否已经出现过。"""',
        '    seen = {}  # 值 -> 第一次出现的下标',
        '    for i, v in enumerate(nums):',
        '        need = target - v',
        '        if need in seen:',
        '            return (seen[need], i)',
        '        if v not in seen:',
        '            seen[v] = i  # 保留最早出现的下标，保证 i < j',
        '    return None',
      ].join('\n'),
      hints: [
        '暴力解的内层循环在回答一个问题："target - nums[i] 在数组里吗？" 这个问题的答案能不能提前存起来？',
        '如果你用 dict 存"见过的值 → 下标"，那么内层循环就消失了。需要存什么、什么时候存？',
        '为什么存"第一次出现"的下标而不是最后一次？想想重复元素的情况。',
        '均摊 O(1) 的前提是 dict 的哈希质量；如果 nums 里是长字符串而不是整数，结论会变吗？',
      ],
    },

    // ── 6. 自动测试 ─────────────────────────────────────────────
    tests: [
      {
        name: '正确性：基本用例与无解情况',
        kind: 'python',
        assert: [
          '# 提示：不要写 `assert x := y` —— 海象运算符在 assert 语句里必须加括号，',
          '# 否则直接是 SyntaxError，测试根本不会执行到断言。',
          'r = two_sum([2, 7, 11, 15], 9)',
          'assert r is not None, "有解却返回了 None"',
          'assert sorted(r) == [0, 1], f"[2,7,11,15] target=9 应该是 (0,1)，得到 {r}"',
          'assert sorted(two_sum([3, 2, 4], 6)) == [1, 2]',
          'assert sorted(two_sum([3, 3], 6)) == [0, 1], "重复元素的情况处理错了吗？"',
          'assert two_sum([1, 2, 3], 100) is None, "无解时应返回 None"',
          'assert two_sum([], 5) is None',
          'assert two_sum([5], 10) is None, "单个元素不可能凑出两个不同的下标"',
        ].join('\n'),
      },
      {
        name: '返回值形状：必须是两个不同下标且满足等式',
        kind: 'python',
        assert: [
          'import random',
          'random.seed(7)',
          'for trial in range(30):',
          '    n = random.randint(2, 40)',
          '    nums = [random.randint(-20, 20) for _ in range(n)]',
          '    i, j = random.sample(range(n), 2)',
          '    target = nums[i] + nums[j]',
          '    res = two_sum(nums, target)',
          '    assert res is not None, f"漏解：nums={nums} target={target}（确实存在 {i},{j}）"',
          '    a, b = res',
          '    assert a != b, "返回了两个相同的下标"',
          '    assert 0 <= a < len(nums) and 0 <= b < len(nums), f"下标越界：{res}"',
          '    assert nums[a] + nums[b] == target, f"和不等于 target：{nums[a]}+{nums[b]} != {target}"',
        ].join('\n'),
      },
      {
        name: '复杂度：规模翻倍时耗时增长应接近 2 倍，而不是 4 倍',
        kind: 'python',
        assert: [
          'import time, random',
          'random.seed(1)',
          'BIG = [random.randrange(10**9) for _ in range(200000)]',
          '',
          'def timed(n):',
          '    sub = BIG[:n]',
          '    t0 = time.perf_counter()',
          '    two_sum(sub, -1)   # -1 保证无解，走满全程',
          '    return time.perf_counter() - t0',
          '',
          '# 先热身，避开首次运行的编译/缓存抖动',
          'timed(20000)',
          't1 = max(timed(50000), 2e-4)',
          't2 = max(timed(100000), 2e-4)',
          'ratio = t2 / t1',
          'assert ratio < 4.0, (',
          '    f"规模翻倍耗时增长 {ratio:.2f} 倍：接近 4 说明内层还在遍历（仍是 O(N^2)），"',
          '    f"线性解应该接近 2 倍。t1={t1*1000:.2f}ms t2={t2*1000:.2f}ms"',
          ')',
        ].join('\n'),
        timeoutMs: 25000,
        hint: '如果这条测试失败但正确性测试通过，说明你写的还是嵌套循环。检查内层是否真的消失了。',
      },
      {
        name: '静态检查：内层不能有嵌套的 for（这是本题的核心要求）',
        kind: 'static',
        rules: [
          {
            mustNotMatch: 'for[^\\n]*:\\s*\\n(?:[ \\t]+[^\\n]*\\n)*?[ \\t]+for[^\\n]*:',
            flags: 'm',
            message:
              '检测到嵌套的 for 循环。本题要求用哈希表把内层循环消掉——如果你确实认为嵌套不可避免，请在 AI 助教那里说明理由，并让它帮你确认复杂度。',
          },
        ],
      },
    ],

    // ── 7. AI 引导问题 ──────────────────────────────────────────
    aiPrompts: [
      '你测到的"规模翻倍耗时比"是多少？和线性解的理论值 2 差多少？差的那部分来自哪里（Python 解释器开销？哈希冲突？内存分配？）？',
      '如果 nums 里有大量重复元素，你的 seen 字典存"第一次出现"和"最后一次出现"会给出不同结果吗？哪种是正确的？',
      '如果把哈希表换成排序 + 双指针，复杂度是多少？在什么情况下这个方案反而更好（提示：想想能不能只排序一次然后反复查询）？',
      '你的科研代码里有没有"在某段循环内部做一次查找"的写法？那个查找能不能用数组下标或预计算替代？',
    ],

    // ── 8. Anki 卡片 ────────────────────────────────────────────
    anki: [
      {
        front: 'N 从 10⁴ 增到 10⁶，O(N²) 算法的耗时大约放大多少倍？',
        back: '规模放大 100 倍 → 耗时放大 100² = **10⁴ 倍**。所以"在 N=10⁴ 时跑 1 ms"的代码，在 N=10⁶ 时要 10 s，在 N=10⁷ 时接近 17 分钟。',
        tags: ['big-O'],
      },
      {
        front: '动态数组按倍数扩容，为什么 append 是摊销 O(1)？',
        back: '总搬运量是 $1+2+4+\\dots+2^k \\approx 2N$，均摊到 N 次追加上是常数。若改成"每次加 1 个容量"，总搬运量退化为 O(N²)。',
        tags: ['amortized'],
      },
      {
        front: '开放寻址的期望探测次数随负载因子 α 如何变化？工程上在哪里扩容？',
        back: '不成功查找约 $\\frac12\\left(1+\\frac{1}{(1-\\alpha)^2}\\right)$，α→1 时发散。工程上常在 **α ≈ 0.7** 扩容，因为再往上性能掉得比省下的内存快得多。',
        tags: ['hash'],
      },
      {
        front: '开放寻址为什么不能直接删除元素？正确做法是什么？',
        back: '直接清空会**切断探测链**，使后面本来能找到的元素查不到。正确做法是写"墓碑"标记：查找时继续探测，插入时可复用。墓碑过多需整体 rehash。',
        tags: ['hash', 'debug'],
      },
      {
        front: '链地址法与开放寻址各适合什么场景？',
        back: '链地址：删除简单、负载因子可 >1，但指针追逐导致缓存不友好。开放寻址：连续内存、缓存友好、常数更小，但删除要墓碑且 α 必须 <1。**对性能敏感的数值代码通常选开放寻址。**',
        tags: ['hash', 'memory'],
      },
      {
        front: '为什么在循环里 np.append 是灾难？正确写法是什么？',
        back: 'np.append 每次都新建数组并复制全部元素 → O(N²)。正确写法：先收集到 Python list（摊销 O(1) 追加），最后 `np.asarray(lst)` 一次性转换；或预先 `np.empty(N)` 再按下标赋值。',
        tags: ['numpy', 'amortized'],
      },
      {
        front: 'Fortran 列主序下，A(i,j) 的两层循环应该哪个在内层？写反了会得到错误结果吗？',
        back: 'i（第一个下标）方向内存连续，所以 **i 在内层**最快。写反了**结果完全正确，只是慢**——这类"正确但慢"的问题只能靠 profiler 发现，不会自己报错。',
        tags: ['memory', 'fortran'],
      },
      {
        front: '看到"程序跑了很久没结束"，第一个动作应该是什么？',
        back: '**先估量级**：N 是多少？单步代价多少？总操作数落在 10⁶ 还是 10¹²？如果是后者，那不是 bug 而是选型问题，加 print 只会浪费更多时间。',
        tags: ['debug', 'big-O'],
      },
    ],

    // ── 9. 延伸阅读 ─────────────────────────────────────────────
    reading: [
      {
        title: 'CSAPP（深入理解计算机系统）第 6 章：存储器层次结构',
        url: 'https://csapp.cs.cmu.edu/',
        note: '读 6.1–6.4（存储技术与局部性）。这一章解释了你为什么必须关心"访问顺序"，而不只是"访问次数"。',
      },
      {
        title: 'Python 官方 TimeComplexity 维基',
        url: 'https://wiki.python.org/moin/TimeComplexity',
        note: '把 list / dict / set / deque 的表格扫一遍，重点标出所有非 O(1) 的操作。',
      },
      {
        title: 'CLRS 第 11 章：散列表',
        url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/',
        note: '读 11.2（链地址）与 11.4（开放寻址）。定理 11.6 与 11.8 给出上面那两个期望探测次数公式的推导。',
      },
      {
        title: 'CIU 原版清单（本模块的知识点来源）',
        url: 'https://github.com/',
        note: '按清单逐项勾选。遇到"知道存在但没用过"的项，回到本课的对应 demo 跑一遍参数扫描。',
      },
    ],

    // ── 10. 完成自检清单 ────────────────────────────────────────
    checklist: [
      '能不看笔记说出 O(N²) 在 N=10⁶ 时的耗时量级',
      '能推导动态数组按倍数扩容的摊销代价',
      '能写出负载因子与期望探测次数的关系，并说出 0.7 这个数的来源',
      '练习的三条自动测试全部通过（含复杂度那条）',
      '能在自己的科研代码里指出至少一处"循环内反复 append 到 ndarray"或"用 list 做成员检查"',
      '把本课的 8 张卡片加进 Anki，并做完第一次复习',
    ],
  });
})();
