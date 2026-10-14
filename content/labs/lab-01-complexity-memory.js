//__CPL_META__ {"id":"lab-01-complexity-memory","module":1,"week":1,"title":"复杂度与内存模型","subtitle":"先估操作数、再看内存：判断一段代码在这台机器上还行不行","tags":["big-O","memory","cache","locality"]}

/* ============================================================================
 * lab-01-complexity-memory.js — 模块 1（概念性知识内化）· 第 1 周
 *
 * 这一课要内化的不是"背下复杂度表"，而是两件事：
 *   1. 看到一个循环结构，能在 30 秒内估出操作数量级，并换算成"几分钟"；
 *   2. 知道同一个复杂度下，内存访问顺序能让耗时差好几倍。
 * 判据：给你一段科研代码，你能说出它属于下面哪一格，以及该怎么改。
 *
 * 本文件是经典脚本（不是 ES 模块），必须自注册；不要写 import/export。
 * ==========================================================================*/

(function () {
  'use strict';

  CPL.registerLesson({
    id: 'lab-01-complexity-memory',
    module: 1,
    week: 1,
    title: '复杂度与内存模型',
    subtitle: '先估操作数、再看内存：判断一段代码在这台机器上还行不行',
    tags: ['big-O', 'memory', 'cache', 'locality'],

    // ── 1. 学习目标 ─────────────────────────────────────────────
    objectives: [
      '能推导给定循环结构的操作数表达式，并把它换算成"秒 / 分 / 小时"的量级判断。',
      '能预测输入规模放大 2 倍或 10 倍后耗时与内存占用的变化倍数。',
      '能解释同一条公式在 Fortran 列主序与 C 行主序下的耗时差异来自缓存行，而不是算法。',
      '能定位自己代码里"复杂度没变但慢了一个量级"的地方（跨步访问、指针追逐、临时数组）。',
      '能写出包含 nbytes 与 dtype 的内存占用估算，并在分配前判断工作集是否超过 L3。',
    ],

    // ── 2. 核心概念 ─────────────────────────────────────────────
    concepts: [
      {
        term: '量级优先：先估操作数，再谈优化',
        must: 'internalize',
        body: [
          '大 O 描述的是**输入规模趋于无穷时的增长量级**，它故意丢掉了常数因子。',
          '丢掉常数是为了让结论与机器无关，但这也意味着：**O 记号本身不能回答"跑得完吗"**。',
          '回答"跑得完吗"需要三个数：规模 $N$、单次操作的代价、以及操作总数的量级。',
          '',
          '$$T(N) \\approx (\\text{每元素的浮点操作数}) \\times N^{p} \\times t_{\\text{op}}$$',
          '',
          '在 3 GHz 的 CPU 上，一次可流水线的浮点乘加约 0.3 ns；一次随机访存约 80 ns。',
          '这两个数差 200 多倍，所以**估量级时必须区分"算术"与"访存"**。',
          '',
          '| 复杂度 | N = 10³ | N = 10⁶ | N = 10⁹ | 判据 |',
          '| --- | --- | --- | --- | --- |',
          '| O(N) | 1 µs | 1 ms | 1 s | 可以随便写 |',
          '| O(N log N) | 10 µs | 20 ms | 30 s | 一次性能接受 |',
          '| O(N²) | 1 ms | 16 min | 31 年 | N > 10⁴ 就别写 |',
          '| O(N³) | 1 s | 3×10⁷ 年 | — | 必须换算法或换并行 |',
          '',
          '> [!PHYSICS] 这在计算物理里是最常见的"选型事故"',
          '> 一个 1000 原子、每原子 100 个基函数的紧束缚/DFT 计算，$N^3$ 的稠密对角化是 10⁹ 次操作（秒级，可以接受）；',
          '> 但如果代码里对**每一对原子**都做一次同样的对角化，等效于 $N^4$，同样的物理问题就变成几个月。',
          '> 判断这类事故不需要 profiler，只需要数一数"循环嵌套了多深、每层多大"。',
          '',
          '> [!NUMERIC] 换算口诀',
          '> $10^9$ 次算术 ≈ 1 秒，$10^9$ 次随机访存 ≈ 80 秒。',
          '> 先把操作数写成 $10^{k}$，再对照 $k$：$k \\le 8$ 随便；$k = 9 \\sim 10$ 要想想；$k \\ge 12$ 不是优化问题而是算法问题。',
        ].join('\n'),
        selfCheck: [
          '不看笔记：$N$ 从 $10^4$ 增到 $10^5$，$O(N^2)$ 的耗时变化多少倍？',
          '你现在正在写的那段代码，操作数是多少？说得出 $10^{k}$ 里的 $k$ 吗？',
          '什么情况下你会**故意**选一个量级更差的算法？',
        ],
        anchor: '任何一次"程序跑了很久没结束"，第一个动作是估量级，不是加 print。',
      },

      {
        term: '内存层次：为什么"访问次数"不等于"耗时"',
        must: 'internalize',
        body: [
          'CPU 取数不是按变量取，而是按 **cache line（x86 通常 64 字节）** 整块搬进缓存。',
          '所以"访问了 10⁶ 个 double"这句话的代价，完全取决于这 10⁶ 次访问落在几条 cache line 上。',
          '',
          '| 层级 | 典型容量 | 典型延迟 | 一条 64 B cache line 装几个 double |',
          '| --- | --- | --- | --- |',
          '| 寄存器 | 几百字节 | < 1 ns | — |',
          '| L1 | 32–64 KB | ~1 ns | 8 |',
          '| L2 | 0.5–2 MB | ~4 ns | 8 |',
          '| L3 | 8–64 MB（多核共享） | ~15 ns | 8 |',
          '| DRAM | 16–256 GB | ~80 ns | 8 |',
          '',
          '三条直接推论：',
          '',
          '1. **顺序访问**：一条 cache line 里的 8 个 double 都会被用到，有效带宽是满的。',
          '2. **跨步 8（即每次跳 64 B）**：每条 cache line 只用 1 个 double，浪费 7/8 的带宽。',
          '3. **指针追逐**（链表、树、字典）：下一次访问的地址要等上一次取回来才知道，延迟完全无法掩盖。',
          '',
          '> [!CAUTION] 这三种写法结果都正确',
          '> 缓存不友好**不会给出错误的数值**，只会给出错误的耗时。',
          '> 因此这类问题只能靠 profiler 或"实测带宽"发现；靠读代码看不出来，靠 print 也看不出来。',
          '> 见本课 demo：同一个数组、同样多的元素，只改跨步，有效带宽掉一个量级。',
          '',
          '```python',
          'import numpy as np',
          'a = np.arange(1 << 22, dtype=np.float64)   # 32 MB，超过多数 L3',
          '',
          '# 顺序：期望带宽 5–15 GB/s',
          's = a.sum()',
          '',
          '# 跨步 8：同样读到 4M 个元素里的 512K 个，但因为每次搬 64 B，',
          '# 实际搬进来的字节数不变，有效带宽除以 8',
          's2 = a[::8].sum()',
          '```',
        ].join('\n'),
        selfCheck: [
          '一条 64 字节的 cache line 能装几个 float64？跨步 8 时利用率是多少？',
          '为什么"遍历链表"和"遍历数组"的量级相同，实测耗时却可能差 5 倍以上？',
          '你的代码里有没有"外层循环走列、内层循环走行"的写法？它对应的数据是怎么存的？',
        ],
        anchor: 'Fortran 列主序 → 内层循环走第一个下标（见 demo 与本模块 week-05）。',
      },

      {
        term: '列主序与行主序：循环顺序决定常数因子',
        must: 'internalize',
        body: [
          '同一段数学公式，循环顺序写反，结果完全正确，耗时可能差 3–10 倍。原因是存储顺序：',
          '',
          '- **Fortran 列主序**：`A(i, j)` 的地址是 `base + (i-1) + (j-1)*lda`，第一个下标连续。',
          '- **C / NumPy（默认）行主序**：`a[i][j]` 的地址是 `base + i*ldb + j`，最后一个下标连续。',
          '',
          '```fortran',
          '! Fortran：内层走 i（内存连续）→ 快',
          'do j = 1, n',
          '  do i = 1, n',
          '    s = s + A(i, j)',
          '  end do',
          'end do',
          '',
          '! Fortran：内层走 j（跨步 n 个元素）→ 慢，但结果相同',
          'do i = 1, n',
          '  do j = 1, n',
          '    s = s + A(i, j)',
          '  end do',
          'end do',
          '```',
          '',
          '```c',
          '/* C：内层走 j（内存连续）→ 快 */',
          'for (int i = 0; i < n; i++)',
          '  for (int j = 0; j < n; j++)',
          '    s += a[i][j];',
          '```',
          '',
          '矩阵乘法 $C = A B$ 是这件事最重要的应用场景。在列主序下，',
          '朴素三重循环的最优顺序是 $i$ 最内、$k$ 次之、$j$ 最外；',
          '顺序写错就退化成"每次只用到一条 cache line 的 1/8"。',
          '',
          '> [!TIP] 工程上的实际做法',
          '> 不要自己手写三重循环去搏缓存：直接调用 BLAS 的 `dgemm`（Fortran 里 `call dgemm(...)`，',
          '> NumPy 里 `A @ B` 底层也是它）。BLAS 里做了分块（blocking）、打包（packing）与向量化，',
          '> 实测能到峰值浮点性能的 70% 以上，而手写循环通常只有 5–15%。',
          '> **只有当循环体不是标准矩阵乘法时，才需要自己关心顺序。**',
        ].join('\n'),
        selfCheck: [
          '在 Fortran 里把 `A(i,j)` 的两层循环顺序写反，会得到错误结果吗？为什么？',
          '为什么"手写三重循环矩阵乘法"通常比 `dgemm` 慢一个量级，即使两者都是 $O(N^3)$？',
          'NumPy 里 `A.T @ B` 与 `A @ B` 哪个可能触发额外拷贝？怎么验证？',
        ],
        anchor: '矩阵乘法的顺序问题在 week-06（BLAS 调用）里会具体到代码行。',
      },

      {
        term: '工作集大小：复杂度之外的第二个判据',
        must: 'internalize',
        body: [
          '**工作集（working set）** 是一段代码在"活跃期"内反复访问的数据总量。',
          '它和复杂度一起决定性能：复杂度决定访问**次数**，工作集决定每次访问的**代价**。',
          '',
          '一个数值代码的完整估算包含两步：',
          '',
          '1. 内存占用：$\\text{bytes} = N_{\\text{元素}} \\times \\text{itemsize}$。',
          '   `float64` 是 8 B，`complex128` 是 16 B，一个 2000³ 的复矩阵是 $2000^3 \\times 16 = 128$ GB。',
          '2. 工作集是否放得下：$N_{\\text{元素}} \\times 8$ 与 L2/L3 容量比较，决定"是否每步都去 DRAM 取数"。',
          '',
          '| 数据量 | 落在哪一层 | 期望有效带宽 |',
          '| --- | --- | --- |',
          '| < 256 KB | L2 | 100+ GB/s |',
          '| 1–8 MB | L3 | 30–60 GB/s |',
          '| > 64 MB | DRAM | 5–20 GB/s |',
          '',
          '> [!PHYSICS] 这就是"分块算法"（blocking / tiling）的全部动机',
          '> 把大矩阵切成能塞进 L2 的小块，让每次从 DRAM 取来的数据在被换出前被尽可能多地复用。',
          '> 分块**不改变复杂度**，只改变常数因子；但在这个常数能决定"跑一天还是跑一小时"的问题上，它就是决定性的。',
          '',
          '> [!DEBUG] 一个立刻能用的诊断动作',
          '> 在代码里打印 dtype 与元素个数，算一遍 `nbytes`，和你的机器 L3 容量比一比。',
          '> 如果工作集是 L3 的 10 倍以上，那"优化循环体"的收益通常远小于"提高数据复用率 / 减少临时数组"。',
          '',
          '```python',
          'import numpy as np',
          'A = np.zeros((2000, 2000), dtype=np.float64)',
          'print(A.nbytes / 1024**2, "MB")        # 30.5 MB',
          'print(A.itemsize, A.dtype, A.strides)  # 8 float64 (16000, 8)',
          '# 注意 strides：NumPy 行主序下最后一维步长才是 8',
          '```',
        ].join('\n'),
        selfCheck: [
          '一个 4096×4096 的 float64 矩阵占多少内存？在你的机器上它还在 L3 里吗？',
          '为什么"多引入一个全数组临时变量"可能让耗时不升反降？',
          '你的项目里最大的那个数组有多大？它被复用了多少次？',
        ],
        anchor: '分块与临时数组的代价在 week-07（算术强度与 roofline）里量化。',
      },
    ],

    // ── 3. 工具速查 ─────────────────────────────────────────────
    tools: [
      {
        name: 'time.perf_counter：测墙钟耗时',
        must: 'lookup',
        doc: 'https://docs.python.org/3/library/time.html#time.perf_counter',
        code: 'import time\n\nt0 = time.perf_counter()\nf()\ndt = time.perf_counter() - t0',
        note: '用单调时钟，不受系统时间调整影响。测比值（规模翻倍）而不是绝对值，跨机器才可复现。',
      },
      {
        name: 'ndarray.nbytes / itemsize / strides',
        must: 'lookup',
        doc: 'https://numpy.org/doc/stable/reference/arrays.ndarray.html#memory-layout',
        code: 'A.nbytes        # 总字节数 = size * itemsize\nA.itemsize      # 单个元素字节数\nA.strides       # 每一维前进一个下标跨越的字节数\nA.flags.c_contiguous, A.flags.f_contiguous',
        note: 'strides 是判断"切片是否制造了跨步访问"的唯一可靠依据；strides 为 0 表示该维被广播。',
      },
      {
        name: 'cProfile：先测量，再优化',
        must: 'lookup',
        doc: 'https://docs.python.org/3/library/profile.html',
        code: 'python3 -m cProfile -s tottime your_script.py | head -30',
        note: 'cumtime 找"大头的调用链"，tottime 找"自身耗时的函数"。不要凭直觉猜热点。',
      },
      {
        name: 'perf stat：看 CPU 侧的真实瓶颈',
        must: 'lookup',
        doc: 'https://perf.wiki.kernel.org/index.php/Main_Page',
        code: 'perf stat -e cycles,instructions,cache-misses,cache-references ./a.out',
        note: 'instructions / cycles < 1 通常说明在等内存；cache-misses 比例高说明局部性差。Linux only。',
      },
      {
        name: 'tracemalloc：Python 侧的内存归因',
        must: 'lookup',
        doc: 'https://docs.python.org/3/library/tracemalloc.html',
        code: 'import tracemalloc\ntracemalloc.start()\nrun()\nsnap = tracemalloc.take_snapshot()\nfor s in snap.statistics("lineno")[:5]: print(s)',
        note: '在"内存爆掉但不知道在哪分配"时用；NumPy 的大块分配也会被统计到。',
      },
    ],

    docChallenges: [
      {
        q: '给你这个陌生属性：`ndarray.flags.f_contiguous`。2 分钟内从官方文档查出：它在什么情况下是 True？一个用 `np.asfortranarray` 转换过的数组，它的 `strides` 会长什么样？',
        answer: '`f_contiguous` 为 True 表示**第一个下标方向（列）连续**，即列主序存储。`np.asfortranarray(A)` 会返回一个列主序的数组（必要时会拷贝），此时 `A.strides` 的第一个元素是 8（itemsize），最后一个元素是 `8 * shape[0]`。文档：https://numpy.org/doc/stable/reference/arrays.ndarray.html#memory-layout',
      },
      {
        q: '给你这个 API：`numpy.lib.stride_tricks.sliding_window_view(x, window_shape)`。2 分钟内查出它在算什么、返回的数组是否共享内存、用它做移动平均的复杂度是多少？',
        answer: '它返回一个**只读的视图**，形状在 `x.shape` 前面插入 `window_shape` 维；不拷贝数据（`np.shares_memory` 为 True）。用 `.mean(axis=-1)` 做窗口为 $w$ 的移动平均是 $O(N w)$ 次加法、但只有 $O(N)$ 的分配——比 Python 循环快得多，也比 `O(N \\log N)` 的 FFT 方案在中等 $w$ 下更快。文档：https://numpy.org/doc/stable/reference/generated/numpy.lib.stride_tricks.sliding_window_view.html',
      },
    ],

    // ── 4. 交互式 demo ──────────────────────────────────────────
    demo: {
      kind: 'memory-model',
      title: '同一个数组、同样多的元素，只改跨步，带宽掉一个量级',
      intro:
        '点"运行内存带宽实验"：程序构造一个 1M 个 float64 的数组（8 MB），按跨步 1、2、4 … 4096 遍历它，并记录有效带宽。跨步一旦超过 64 字节（一条 cache line），每次访问都要搬进一整条 line 却只用其中一个 double，有效带宽就明显下降。把这条曲线和"Fortran 列主序 / C 行主序"对应起来：循环顺序写反，等价于把跨步从 1 变成了 n。',
      params: { stride: 8, elements: 1048576 },
    },

    // ── 5. 代码练习 ─────────────────────────────────────────────
    exercise: {
      id: 'main',
      lang: 'python',
      title: '把 O(N²) 的两两枚举换成 O(N log N) 的排序 + 双指针',
      brief: [
        '实现 `count_pairs_leq(a, t)`：统计满足 `i < j` 且 `a[i] + a[j] <= t` 的**下标对个数**（重复元素按位置分别计数）。',
        '',
        'starter 是双重循环的暴力解，复杂度 $O(N^2)$。要求改成**排序 + 双指针**，达到 $O(N \\log N)$。',
        '',
        '为什么这题放在"复杂度与内存模型"里：排序把数据变成**顺序访问**，双指针只用一个单调移动的下标，',
        '整个算法除了排序之外没有随机访存。这是"算法复杂度"和"内存局部性"同时变好的典型例子。',
        '',
        '提示：先想清楚"当 `b[i] + b[j] <= t` 时，能一次性确认多少个配对成立"，再想双指针为什么是单调的。',
      ].join('\n'),
      starter: [
        'def count_pairs_leq(a, t):',
        '    """返回满足 i < j 且 a[i] + a[j] <= t 的下标对个数。"""',
        '    # TODO: 现在是 O(N^2) 的双重循环，N = 10^5 时约需要 10^10 次比较，不可用。',
        '    # 提示：先 sorted(a) 得到顺序访问的数组，再用两个单调指针。',
        '    n = len(a)',
        '    cnt = 0',
        '    for i in range(n):',
        '        ai = a[i]',
        '        for j in range(i + 1, n):',
        '            if ai + a[j] <= t:',
        '                cnt += 1',
        '    return cnt',
      ].join('\n'),
      solution: [
        'def count_pairs_leq(a, t):',
        '    """排序 + 双指针，O(N log N)。',
        '',
        '    排序后 b 单调递增。固定左指针 i，右指针 j 从末尾单调左移：',
        '    若 b[i] + b[j] <= t，则 b[i] 与 b[i+1..j] 的每一个都能配对（共 j - i 对），',
        '    于是把 i 右移一格；否则说明 b[j] 太大，把 j 左移一格。',
        '    两个指针各自单调，循环总共执行 O(N) 次。',
        '    """',
        '    b = sorted(a)          # 顺序内存布局，后续访问全部命中 cache line',
        '    i, j = 0, len(b) - 1',
        '    cnt = 0',
        '    while i < j:',
        '        if b[i] + b[j] <= t:',
        '            cnt += j - i   # b[i] 与 b[i+1..j] 全部成立',
        '            i += 1',
        '        else:',
        '            j -= 1',
        '    return cnt',
      ].join('\n'),
      hints: [
        '暴力解的内层循环每次只回答一个问题："a[i] + a[j] 是不是 <= t？"能不能一次回答一整段？',
        '把数组排序之后，固定 i，满足条件的 j 一定落在某个前缀 [i+1, j] 里。这个 j 随 i 增大是往哪边走？',
        '既然 j 只往一个方向走，为什么整个 while 循环是 O(N) 而不是 O(N²)？数一数 i 和 j 各最多变化多少次。',
        '排序本身是 O(N log N)，它是整个算法的瓶颈。如果同一个数组要被查询很多次不同的 t，你会怎么改？',
      ],
    },

    // ── 6. 自动测试 ─────────────────────────────────────────────
    tests: [
      {
        name: '正确性：与暴力枚举逐例对照',
        kind: 'python',
        assert: [
          'import random',
          'random.seed(2024)',
          '',
          'def brute(a, t):',
          '    n = len(a)',
          '    c = 0',
          '    for i in range(n):',
          '        for j in range(i + 1, n):',
          '            if a[i] + a[j] <= t:',
          '                c += 1',
          '    return c',
          '',
          'assert count_pairs_leq([], 0) == 0, "空数组应返回 0"',
          'assert count_pairs_leq([1], 5) == 0, "只有一个元素时没有数对"',
          'assert count_pairs_leq([1, 1, 1], 2) == 3, "1+1=2 <= 2，三对全成立"',
          'assert count_pairs_leq([5, 5], 9) == 0, "唯一数对不满足"',
          'for trial in range(60):',
          '    n = random.randint(0, 30)',
          '    a = [random.randint(-15, 15) for _ in range(n)]',
          '    t = random.randint(-30, 30)',
          '    got = count_pairs_leq(a, t)',
          '    want = brute(a, t)',
          '    assert got == want, f"a={a} t={t} 应为 {want}，得到 {got}"',
          'assert count_pairs_leq(list(range(100)), 10**9) == 100 * 99 // 2, "全部成立时应为 C(N,2)"',
        ].join('\n'),
      },
      {
        name: '复杂度：规模翻倍时耗时增长应接近 2 倍，而不是 4 倍',
        kind: 'python',
        // 规模必须足够大，否则计时落在噪声里：N=2000 时 O(N²) 只要 ~1 ms，
        // 常数开销（函数调用、列表切片、计时器分辨率）会淹没量级差异，
        // 于是暴力解也能通过——这条测试就成了摆设。（实测验证过。）
        assert: [
          'import time, random',
          'random.seed(7)',
          'BIG = [random.uniform(-1e6, 1e6) for _ in range(16000)]',
          '',
          'def timed(n, reps=2):',
          '    sub = BIG[:n]',
          '    t0 = time.perf_counter()',
          '    for _ in range(reps):',
          '        count_pairs_leq(sub, 0.0)',
          '    dt = time.perf_counter() - t0',
          '    assert dt > 1e-4, f"N={n} 时耗时只有 {dt*1e6:.0f} µs，太小无法判断量级"',
          '    return dt',
          '',
          'timed(2000, 1)  # 热身，避开首次运行的分配与缓存抖动',
          't1 = timed(8000)',
          't2 = timed(16000)',
          'ratio = t2 / t1',
          '# 线性解规模翻倍 → 约 2 倍；O(N²) → 约 4 倍。取 3.0 作为分界。',
          'assert ratio < 3.0, (',
          '    f"规模翻倍耗时增长 {ratio:.2f} 倍：接近 4 说明内层还在逐对枚举（仍是 O(N^2)），"',
          '    f"排序+双指针应该接近 2 倍。t1={t1*1000:.2f}ms t2={t2*1000:.2f}ms"',
          ')',
        ].join('\n'),
        timeoutMs: 25000,
        hint: '如果正确性测试通过但这条失败，说明你保留了双重循环。检查内层是否真的完全消失（while 循环算一次遍历，不算嵌套）。',
      },
      {
        name: '静态检查：不允许保留嵌套的 for 循环',
        kind: 'static',
        rules: [
          {
            mustNotMatch: 'for[^\\n]*:\\s*\\n(?:[ \\t]+[^\\n]*\\n)*?[ \\t]+for[^\\n]*:',
            flags: 'm',
            message:
              '检测到嵌套的 for 循环。本题要求用排序 + 双指针把内层枚举消掉。如果你认为嵌套不可避免，请先写出你的复杂度推导，再用 AI 助教核对。',
          },
          {
            minLength: 120,
            message: '代码太短（少于 120 字符），看起来没有真正实现双指针。',
          },
        ],
      },
    ],

    // ── 7. AI 引导问题 ──────────────────────────────────────────
    aiPrompts: [
      '你测到的"规模翻倍耗时比"是多少？和 O(N log N) 在 N = 2000 时的理论比值差多少？差的那部分来自哪里？',
      '如果数组里全是相同的元素（大量并列），双指针的计数 `cnt += j - i` 还对吗？请构造一个用例验证你的判断？',
      '同一个数组要被很多个不同的阈值 t 反复查询，每次都排序划算吗？如果不划算，你会把排序结果缓存在哪里？',
      '在你的科研代码里找一段"两两遍历"的循环（比如逐对计算相互作用），它的规模是多少、操作数落在 10 的几次方？',
    ],

    // ── 8. Anki 卡片 ────────────────────────────────────────────
    anki: [
      {
        front: '看到一段代码"跑了很久没结束"，第一个动作是什么而不是加 print？',
        back: '**先估量级**：数循环嵌套层数与每层规模，写出操作数 $N^{p}$，换算成 $10^{k}$。$k \\le 8$ 随便，$k \\ge 12$ 是算法问题（换算法或并行），加 print 只会浪费时间。',
        tags: ['big-O', 'debug'],
      },
      {
        front: '一条 64 字节的 cache line 能装几个 float64？跨步 8 时带宽利用率是多少？',
        back: '64 / 8 = **8 个**。跨步 8 时一次访问跨越 64 字节，每次只用到 1 个 double，带宽利用率 **1/8 = 12.5%**——结果完全正确，只是慢。',
        tags: ['memory', 'cache'],
      },
      {
        front: 'Fortran 列主序下，`A(i,j)` 的两层循环哪个下标应该在内层？写反了会得到错误结果吗？',
        back: '**i（第一个下标）在内层**。写反了结果完全正确，只是每次访问跨步 $n$ 个元素而变慢。这类"正确但慢"的问题只能靠 profiler 或实测带宽发现。',
        tags: ['memory', 'fortran'],
      },
      {
        front: '为什么手写三重循环矩阵乘法通常比 BLAS 的 dgemm 慢一个量级，尽管都是 O(N³)？',
        back: 'BLAS 做了**分块（blocking）与打包（packing）**，把工作集压到 L2 能容纳，并配向量化与寄存器复用。手写循环每次只用到一条 cache line 的 1/8，且缺少数据复用。分块不改变复杂度，只改变常数因子。',
        tags: ['memory', 'blas'],
      },
      {
        front: '一个 4096×4096 的 float64 矩阵占多少内存？它在 L3 里吗？',
        back: '$4096^2 \\times 8\\,\\text{B} = 128$ MB。多数桌面 CPU 的 L3 是 8–64 MB，所以**放不下**，每次遍历都要去 DRAM，有效带宽会掉到 5–20 GB/s。',
        tags: ['memory', 'estimate'],
      },
      {
        front: '为什么"多引入一个临时的全数组变量"有时反而更快？',
        back: '当多个表达式反复从 DRAM 读同一份数据时，先把它算进一个**能放进 L2/L3 的临时数组**再复用，能把 DRAM 流量降下来。内存带宽是共享资源，减少重复取数往往比减少算术更划算。',
        tags: ['memory', 'optimize'],
      },
      {
        front: '估算"跑得完吗"需要哪三个数？',
        back: '**规模 $N$、每元素的操作数、单次操作的代价**。并且要区分算术（~0.3 ns/次）与随机访存（~80 ns/次），两者差 200 倍以上。',
        tags: ['big-O', 'estimate'],
      },
    ],

    // ── 9. 延伸阅读 ─────────────────────────────────────────────
    reading: [
      {
        title: 'CSAPP 第 6 章：存储器层次结构',
        url: 'https://csapp.cs.cmu.edu/',
        note: '读 6.1–6.4（存储技术、局部性、缓存存储器）。本章解释了"为什么必须关心访问顺序，而不只是访问次数"。',
      },
      {
        title: 'Ulrich Drepper：What Every Programmer Should Know About Memory',
        url: 'https://people.freebsd.org/~lstewart/articles/cpumemory.pdf',
        note: '第 3 章（CPU cache）与第 6 章（多核与 cache 一致性）最值得读；第 4 章的数据可跳过。',
      },
      {
        title: 'BLIS / GotoBLAS 的矩阵乘法分块思路（经典论文）',
        url: 'https://www.cs.utexas.edu/users/flame/pubs/blis3_ipdps14.pdf',
        note: '看第 2 章的分块层级图即可：从 L3 → L2 → L1 → 寄存器，每一层对应一层循环分块。',
      },
      {
        title: 'Python 官方 TimeComplexity 维基',
        url: 'https://wiki.python.org/moin/TimeComplexity',
        note: '扫一遍 list / dict / set 的表格，重点标出所有非 O(1) 的操作（`x in list`、`list.insert(0, x)`）。',
      },
    ],

    // ── 10. 完成自检清单 ────────────────────────────────────────
    checklist: [
      '能不看笔记把一段嵌套循环的操作数写成 $N^{p}$，并换算成秒/分量级',
      '能解释"为什么 Fortran 里循环顺序写反结果对但慢"',
      '能说出至少三种"结果正确但慢"的写法（跨步、指针追逐、临时数组过多）',
      '练习的三条自动测试全部通过（含复杂度那条）',
      '能在自己的科研代码里指出至少一处工作集超过 L3 的数组，并说出它会带来什么代价',
      '把本课的 7 张卡片加进 Anki 并完成第一次复习',
    ],
  });
})();
