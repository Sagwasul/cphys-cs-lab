/* ============================================================================
 * 35-assessment.js — CIU 式诊断测评引擎与题库
 *
 * 首次使用的流程（新增需求）：
 *   ① 诊断测评（本文件）→ ② 技能清单画像（30-mastery.js）
 *   → ③ 生成学习路径（跳过已掌握 / 优先补薄弱）→ ④ 进入课程
 *
 * 设计原则：
 *   · 题目问的是"判据与预测"，不是名词定义——只有这样才能区分
 *     "背过"和"内化了"（这正是本平台的核心判断准则）。
 *   · 每题必须给出解析，答错时立刻知道错在哪、对应哪一课。
 *   · 题库可扩展：加题只需往 DEMO_QUESTIONS 里加对象；答案不参与评分逻辑。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const assess = (CPL.assess = {});

  // ─────────────────────────────────────────────────────────────
  // 题库
  // 每题：{ id, skill, domain, q, options[], answer, explain, lesson }
  //   skill  关联 30-mastery.js 的技能 id
  //   lesson 答错时推荐去上的课（可选）
  // ─────────────────────────────────────────────────────────────
  const QUESTIONS = [
    {
      id: 'q-complexity-1',
      skill: 'complexity',
      q: '一段 O(N²) 的代码在 N=10³ 时耗时 1 ms。同一台机器上 N=10⁵ 时大约耗时多久？',
      options: ['约 0.1 s', '约 10 s', '约 1000 s', '无法估计'],
      answer: 1,
      explain: 'N 从 10³ 放大到 10⁵ 是 100 倍，O(N²) 使耗时放大 100² = 10⁴ 倍，即 1 ms × 10⁴ = 10 s。这类"先估量级再动手"的判断必须内化，它决定你是改算法还是换机器。',
      lesson: 'lab-01-complexity-memory',
    },
    {
      id: 'q-complexity-2',
      skill: 'complexity',
      q: '你的程序跑了 3 小时没结束。下面哪个判断最能帮你缩小范围？',
      options: [
        '先看是不是语法问题',
        '先估算算法复杂度 × 输入规模，判断理论耗时是否本来就在这个量级',
        '先加 print 看每步输出',
        '先换成更快的语言重写',
      ],
      answer: 1,
      explain: '如果理论量级本身就是小时级，那不是 bug 而是选型问题；如果理论耗时该是秒级，才需要去查实现。先算后查，能省掉大量盲目调试。',
      lesson: 'lab-01-complexity-memory',
    },
    {
      id: 'q-memory-1',
      skill: 'memory-model',
      q: '同一个数组、同样多的元素，只是把访问下标从 i 改成 i*64，实测有效带宽可能下降一个量级。主要原因是：',
      options: ['CPU 主频下降了', '每次访问要搬进一整条 cache line，却只用到其中很少一部分', '编译器优化失效', '数组被复制了一份'],
      answer: 1,
      explain: '这是缓存局部性问题：一次内存访问搬来 64 B 的 cache line，跨步访问时利用率极低。Fortran 列主序与 C 行主序的性能差异本质也是同一件事。',
      lesson: 'lab-01-complexity-memory',
    },
    {
      id: 'q-float-1',
      skill: 'float-error',
      q: '把同一个 double 值累加 n 次，朴素求和的相对误差大致是什么量级？',
      options: ['与 n 无关，约 ε', '约 n·ε，随累加次数线性增长', '约 √n·ε', '与 ε 无关，只取决于数值大小'],
      answer: 1,
      explain: '每次加法都可能引入约 ε 的相对误差，误差沿求和过程累积，最坏情况下呈 n·ε 量级。Kahan 补偿求和把这一项压到基本与 n 无关，这就是它存在的理由。',
      lesson: 'lab-02-numerical-error',
    },
    {
      id: 'q-float-2',
      skill: 'float-error',
      q: '计算 f(x) = (1 − cos x) / x² 在 x = 1e-8 处的值。下面哪个做法最可能救你？',
      options: ['把 x 用 float32 存以省内存', '改用 1 − cos x = 2 sin²(x/2) 的等价形式', '把循环改成向量化', '提高输出的有效位数'],
      answer: 1,
      explain: 'x 很小时 cos x ≈ 1，直接相减会发生灾难性抵消，有效位被吃光。用恒等式 2 sin²(x/2) 避免相减，这是"改公式"而不是"改精度"。',
      lesson: 'lab-02-numerical-error',
    },
    {
      id: 'q-stability-1',
      skill: 'stability',
      q: '一个问题的条件数是 10¹²，用双精度（≈16 位有效数字）求解。你能期待结果有几位有效数字？',
      options: ['约 16 位', '约 4 位', '约 12 位', '取决于算法，与条件数无关'],
      answer: 1,
      explain: '误差放大倍数约等于条件数：16 − 12 = 4 位。这说明问题本身病态，换更"聪明"的算法也救不了多少——必须改问题表述或提高精度。',
      lesson: 'lab-02-numerical-error',
    },
    {
      id: 'q-convergence-1',
      skill: 'convergence',
      q: '在 log-log 图上，误差随步长 h 变化的斜率是 −2。把 h 减半，误差大约变为原来的：',
      options: ['1/2', '1/4', '1/8', '不变'],
      answer: 1,
      explain: '斜率 −2 意味着 error ∝ h²，步长减半误差降到 1/4。这就是"二阶收敛"的实用含义——也是你判断边界条件是否降阶的依据。',
      lesson: 'lab-03-convergence-boundary',
    },
    {
      id: 'q-convergence-2',
      skill: 'convergence',
      q: '理论上二阶收敛的格式，实测斜率只有约 −1。最可能的原因是什么？',
      options: ['浮点误差太大', '边界条件或某个离散点只有一阶精度，把整体阶数拉低了', '参数选得不够大', '绘图刻度不对'],
      answer: 1,
      explain: '整体收敛阶由最差的那一环决定。常见元凶就是一阶的边界处理、非均匀网格接缝、或多步法启动步。用逐点误差图往往能直接看出是哪一格在拖后腿。',
      lesson: 'lab-03-convergence-boundary',
    },
    {
      id: 'q-boundary-1',
      skill: 'boundary',
      q: '在显式一维扩散里，若把两端写成周期边界，最典型的实现方式是：',
      options: ['直接令边界值为零', '用 ghost cell 或取模索引让边界与对侧耦合', '把边界点排除在循环之外', '在边界处改用一阶前向差分'],
      answer: 1,
      explain: '周期性要求两端互为邻居。ghost cell 或取模索引都能表达这件事；而"令边界值为零"是 Dirichlet，物理含义完全不同。',
      lesson: 'lab-03-convergence-boundary',
    },
    {
      id: 'q-parallel-1',
      skill: 'parallel',
      q: '程序串行执行时 20% 的部分无法并行。按 Amdahl 定律，即使并行部分做到无限快的加速，总加速比上限是：',
      options: ['5×', '10×', '无限大', '1.25×'],
      answer: 0,
      explain: '1 / 0.2 = 5。这条定律的价值在于：它告诉你在优化并行度之前，先确认不可并行部分占比有多大，否则很快撞天花板。',
      lesson: 'lab-04-parallel-debug',
    },
    {
      id: 'q-parallel-2',
      skill: 'parallel',
      q: 'OpenMP 并行化后结果每次都不一样，且与串行结果不符。最可能的原因是：',
      options: ['线程数太多', '循环体内对共享变量做了读写（竞态），需要 reduction/atomic/critical', '编译器版本不一致', '内存不够'],
      answer: 1,
      explain: '结果随运行变化是竞态的典型标志。先找出被多个线程同时写的变量，再用 reduction 或 atomic 消除。',
      lesson: 'week-07-performance-parallel',
    },
    {
      id: 'q-debug-1',
      skill: 'debugging',
      q: '一个跑了 40 分钟的模拟结果不对。下面哪个做法最有效？',
      options: [
        '把打印语句加到每一行',
        '构造一个 30 秒内跑完、结果已知的小算例，二分缩小出问题的那一步',
        '换成更好的编译器优化选项',
        '重新推导全部公式',
      ],
      answer: 1,
      explain: '把"不可调试的大问题"变成"可反复运行的小问题"是调试的核心动作。之后再沿时间步、空间点、代码路径二分定位。',
      lesson: 'lab-04-parallel-debug',
    },
    {
      id: 'q-fortran-1',
      skill: 'fortran-basics',
      q: 'Fortran 里 `implicit none` 的作用是：',
      options: ['提高编译优化等级', '禁止按首字母隐式推断变量类型，强制所有变量显式声明', '开启动态内存分配', '让数组下标从 0 开始'],
      answer: 1,
      explain: '没有 implicit none 时，未声明变量会按首字母推断类型（i–n 为整型），拼错的变量名会静默变成新变量——这是 legacy 代码里最难查的一类 bug。',
      lesson: 'week-05-fortran-basics',
    },
    {
      id: 'q-fortran-2',
      skill: 'fortran-arrays',
      q: 'Fortran 中 `A(1:10) = B(1:10) + 2.0` 这类整数组运算：',
      options: ['需要写显式循环才能编译', '是语言原生语义，编译器通常会向量化', '只能用于一维数组', '会隐式复制数组导致性能变差'],
      answer: 1,
      explain: '整数组运算是 Fortran 的核心优势，语义天然并行、易于向量化，代码也比循环短。但要注意临时数组的生成，热点处需查编译报告或改写成显式循环。',
      lesson: 'week-06-numerical-arrays',
    },
    {
      id: 'q-fortran-3',
      skill: 'fortran-legacy',
      q: '读一段固定格式（.f）legacy 代码时，下面哪条约定必须先确认？',
      options: ['变量命名风格', '第 1–5 列是标号、第 6 列是续行标志、第 7 列起是语句', '是否用了 module', '是否有注释'],
      answer: 1,
      explain: '固定格式靠列位置解释代码。不知道列约定时，续行与标号会被完全误读，这是读 legacy 代码的第一个坎。',
      lesson: 'week-07-performance-parallel',
    },
    {
      id: 'q-ds-1',
      skill: 'ds-basic',
      q: '动态数组（如 Python list）按倍数扩容。为什么追加操作的摊销复杂度是 O(1)？',
      options: ['因为每次只复制一个元素', '因为扩容总代价按等比级数求和后被元素个数均摊成常数', '因为操作系统会优化内存复制', '因为扩容其实不发生'],
      answer: 1,
      explain: 'n 次追加的总复制量是 1 + 2 + 4 + … ≈ 2n 量级，均摊到每个元素是常数。这就是"摊销分析"的经典例子，也是"按倍数扩容"而不是"每次加一个"的理由。',
      lesson: 'week-11-complexity-array-hash',
    },
    {
      id: 'q-ds-2',
      skill: 'ds-basic',
      q: '哈希表负载因子从 0.5 升到 0.95，开放寻址的期望探测次数会：',
      options: ['基本不变', '显著上升（近似 1/(1−α) 量级发散）', '略微下降', '先升后降'],
      answer: 1,
      explain: '开放寻址的期望探测次数随负载因子 α 趋于 1/(1−α) 而快速上升。所以在 α 约 0.7 附近扩容是工程上的常见折中。',
      lesson: 'week-11-complexity-array-hash',
    },
    {
      id: 'q-ds-3',
      skill: 'ds-tree',
      q: '并查集加上「路径压缩」后，单次操作的摊销复杂度大致是：',
      options: ['O(1) 严格常数', 'O(α(n))，反阿克曼函数，实际可视作常数', 'O(log n)', 'O(n)'],
      answer: 1,
      explain: 'union by rank + 路径压缩给出 O(α(n))，α(n) 在 n 小于宇宙原子数时都小于 5——工程上就是常数，但严格说不是 O(1)。',
      lesson: 'week-13-tree-heap-trie',
    },
    {
      id: 'q-algo-1',
      skill: 'algo-sort',
      q: '在长度为 n 的有序数组上找 target 的插入位置（lower_bound），循环条件应该保证什么？',
      options: ['区间始终为闭区间，循环条件用 left <= right', '区间用左闭右开 [lo, hi)，循环条件用 lo < hi，退出时 lo 即答案', '每次比较后必须返回', 'mid 必须向下取整'],
      answer: 1,
      explain: '左闭右开的区间不变式能让边界情况自动收敛，退出时 lo == hi 就是插入点。这是最不容易写错的一种二分写法，也是"能一次写对边界"这个能力的具体内容。',
      lesson: 'week-14-sort-binary-backtrack',
    },
    {
      id: 'q-algo-2',
      skill: 'algo-dp-graph',
      q: '图里有负权边（但没有负环），求单源最短路应该用：',
      options: ['Dijkstra', 'Bellman-Ford / SPFA', 'BFS', 'Kruskal'],
      answer: 1,
      explain: 'Dijkstra 依赖"已确定点的距离不会再被改进"这一贪心前提，负权边会破坏它。Bellman-Ford 通过 V−1 轮松弛处理负权，并可在第 V 轮检测负环。',
      lesson: 'week-15-dp-graph',
    },
    {
      id: 'q-sys-1',
      skill: 'system-design',
      q: 'CAP 定理中，当网络分区（P）实际发生时，你必须在 C 与 A 之间选择。对于银行转账系统，通常的选择是：',
      options: ['优先可用性，允许短暂不一致', '优先一致性，分区期间拒绝部分请求', '两者都要，靠增加缓存解决', '与业务无关，纯技术选择'],
      answer: 1,
      explain: '转账不能出现"钱扣了但对方没收到且系统认为成功"的状态，因此通常选 CP：分区期间宁可拒绝服务。而社交动态、点赞数这类场景通常容忍最终一致。取舍由业务语义决定，不是技术偏好。',
      lesson: 'week-17-system-design-2',
    },
    {
      id: 'q-sys-2',
      skill: 'system-design',
      q: '缓存命中率从 80% 提升到 95%，假设缓存命中 1 ms、未命中 100 ms。平均延迟大约从多少降到多少？',
      options: ['100 ms → 95 ms', '约 20.8 ms → 约 6 ms', '约 50 ms → 约 25 ms', '基本不变'],
      answer: 1,
      explain: '0.8×1 + 0.2×100 = 20.8 ms；0.95×1 + 0.05×100 = 5.95 ms。命中率的小幅提升在高未命中代价下收益极大——这是缓存策略里最该记住的一个数量级直觉。',
      lesson: 'week-16-system-design-1',
    },
    {
      id: 'q-os-1',
      skill: 'os-network-db',
      q: '关于进程与线程，下面哪句最准确？',
      options: ['线程有独立地址空间，进程共享内存', '进程有独立地址空间，同进程的线程共享地址空间与堆', '两者没有本质区别', '线程切换一定比进程切换慢'],
      answer: 1,
      explain: '地址空间是分界线：进程隔离，线程共享堆（各自有栈）。线程切换更便宜，代价是要自己处理数据竞争。',
      lesson: 'week-18-os-network-db',
    },
    {
      id: 'q-concurrency-1',
      skill: 'concurrency',
      q: '两个线程各自执行 `x = x + 1` 100 万次，最终 x 却远小于 200 万。直接原因是：',
      options: ['CPU 缓存太小', '读-改-写不是原子操作，两个线程可能读到同一个旧值', '循环被编译器优化掉了', '内存不够'],
      answer: 1,
      explain: 'x = x + 1 在机器层面是 load-add-store 三步，交错执行会丢失更新。修法：加锁、原子操作、或改成归约（每线程局部累加后再合并）。最后一种在高性能数值计算里最常用。',
      lesson: 'week-19-concurrency-performance',
    },
    {
      id: 'q-project-1',
      skill: 'project-knowledge',
      q: '要验证一个数值模拟的正确性，下面哪组证据最有说服力？',
      options: [
        '代码能编译且不崩',
        '与解析解对比 + 网格/步长收敛测试（实测收敛阶符合理论）+ 与文献数据定量一致',
        '结果看起来合理',
        '同事审查过代码',
      ],
      answer: 1,
      explain: '三条独立证据交叉：解析解验证实现、收敛测试验证离散格式、文献对比验证物理建模。只看"能跑不崩"是最常见的自欺。',
      lesson: 'week-10-project-verification',
    },
    {
      id: 'q-ds-linear-1',
      skill: 'ds-linear',
      q: '要把一个单链表原地反转（不允许新建链表），循环里最少需要维护几个指针？',
      options: [
        '1 个就够（每次把当前节点的 next 指向前一个）',
        '3 个：prev、curr、next（next 必须在改 curr.next 之前备份）',
        '2 个：curr 和 prev',
        '不需要指针，递归即可',
      ],
      answer: 1,
      explain:
        '关键是顺序：若先执行 curr.next = prev，就丢失了原来的后继。因此必须先用 next 备份 curr.next，再反转、再前进。空间复杂度 O(1)。',
      lesson: 'week-12-linked-list-stack-queue',
    },
    {
      id: 'q-ds-linear-2',
      skill: 'ds-linear',
      q: '用两个栈实现一个队列。单次 enqueue / dequeue 的摊销复杂度是多少，为什么？',
      options: [
        'dequeue 是 O(N)，因此整体 O(N)',
        '摊销 O(1)：每个元素最多被倒入、倒出各一次，总搬运量 2N',
        '摊销 O(log N)',
        '无法用两个栈实现队列',
      ],
      answer: 1,
      explain:
        '入队压入 in 栈；出队时若 out 栈为空，就把 in 栈全部倒入 out 栈。每个元素一生只在两次倒入中各被搬运一次，因此摊销 O(1)——这是"摊销分析"的另一个经典例子。',
      lesson: 'week-12-linked-list-stack-queue',
    },
    {
      id: 'q-ds-tree-2',
      skill: 'ds-tree',
      q: '从含 N 个元素的二叉堆中连续取最小元素 N 次（堆排序的核心这一步），总复杂度是：',
      options: ['O(N)', 'O(N log N)', 'O(N²)', 'O(log N)'],
      answer: 1,
      explain:
        '每次取堆顶并下沉的代价是 O(log N)，做 N 次即 O(N log N)。建堆本身只有 O(N)（自底向上 sift-down），但排序阶段无法低于 O(N log N)。',
      lesson: 'week-13-tree-heap-trie',
    },
    {
      id: 'q-algo-dp-2',
      skill: 'algo-dp-graph',
      q: '0/1 背包的二维 DP 中，为什么容量这一维要从大到小遍历才能压缩成一维？',
      options: [
        '为了减少内存占用',
        '从小到大遍历会让同一物品被重复使用，从而变成完全背包',
        '与遍历方向无关',
        '为了让缓存命中率更高',
      ],
      answer: 1,
      explain:
        '一维写法 dp[c] = max(dp[c], dp[c-w]+v) 依赖的是"上一轮"的 dp[c-w]。若从小到大遍历，dp[c-w] 已被本轮更新过（即已放入当前物品），就退化成完全背包。从大到小遍历保证读到的是上一轮的值。',
      lesson: 'week-15-dp-graph',
    },
    {
      id: 'q-anti-forgetting-1',
      skill: 'anti-forgetting',
      q: '"本周学了很多，感觉都懂了"——下面哪种做法最能检验你是不是真的内化了？',
      options: [
        '把讲义再读一遍',
        '把知识点挂到自己的代码/项目上，并写出一张"判据 + 最小例子"的卡片',
        '把别人的笔记抄一遍',
        '多做几道同类选择题',
      ],
      answer: 1,
      explain:
        '内化的判据是"能自己推回来 + 能指出它在自己代码里的位置"。重读与抄写带来的是熟悉感（fluency illusion），不是掌握。把知识挂到具体锚点上、写成可自测的卡片，才能同时检验与巩固。',
      lesson: 'module-06-anti-forgetting',
    },
    {
      id: 'q-project-2',
      skill: 'project-knowledge',
      q: '你的模拟与解析解在某个参数下吻合，但在另一个参数下差 10%。最有效的下一步是：',
      options: [
        '换一个更精确的数值格式',
        '做收敛性测试（缩小步长/网格，看误差是否按理论阶数下降），先分清是"格式未收敛"还是"物理建模不同"',
        '调参数直到对上',
        '认为解析解有误',
      ],
      answer: 1,
      explain:
        '收敛性测试能把"离散误差"与"模型差异"分开：误差随步长按理论阶数下降 → 是离散精度问题；误差收敛到一个非零常数 → 两种表述的物理不同（近似、边界、参数定义）。先分类，再动手。',
      lesson: 'week-10-project-verification',
    },
  ];

  // 每次诊断抽题数：太少测不准，太多没人做。24 题全做约 8 分钟。
  assess.QUESTIONS = QUESTIONS;

  // ─────────────────────────────────────────────────────────────
  // 测评状态
  // ─────────────────────────────────────────────────────────────
  const scope = CPL.store.scope('assess');

  const state = {
    questions: [],
    index: 0,
    answers: [], // { id, choice, correct }
    startedAt: 0,
    finished: false,
  };

  assess.state = state;

  assess.history = function history() {
    return scope.get('history', []);
  };

  assess.latest = function latest() {
    const h = assess.history();
    return h.length ? h[h.length - 1] : null;
  };

  assess.hasTaken = () => assess.history().length > 0;

  /** 开始一次新测评；order 可指定技能优先顺序（例如先测薄弱域）。 */
  assess.start = function start(opts = {}) {
    let qs = QUESTIONS.slice();
    if (opts.prioritize && opts.prioritize.length) {
      const pri = new Set(opts.prioritize);
      qs.sort((a, b) => (pri.has(b.skill) ? 1 : 0) - (pri.has(a.skill) ? 1 : 0));
    }
    if (opts.limit) qs = qs.slice(0, opts.limit);
    state.questions = qs;
    state.index = 0;
    state.answers = [];
    state.startedAt = Date.now();
    state.finished = false;
    CPL.bus.emit('assess:started', { total: qs.length });
    return state;
  };

  assess.current = () => state.questions[state.index] || null;

  /**
   * 提交当前题的选择。
   * @returns {{correct:boolean, question:object}}
   */
  assess.answer = function answer(choice) {
    const q = assess.current();
    if (!q) return null;
    const correct = choice === q.answer;
    state.answers.push({ id: q.id, skill: q.skill, choice, correct, lesson: q.lesson });
    CPL.bus.emit('assess:answered', { id: q.id, correct });
    return { correct, question: q };
  };

  assess.next = function next() {
    if (state.index < state.questions.length - 1) {
      state.index++;
      return true;
    }
    state.finished = true;
    return false;
  };

  assess.progress = () => ({
    index: state.index,
    total: state.questions.length,
    answered: state.answers.length,
  });

  /** 结束并落盘：写自我评估到掌握度引擎，返回结果摘要。 */
  assess.finish = function finish() {
    const results = state.answers.map((a) => ({ skillId: a.skill, correct: a.correct }));
    const profile = CPL.mastery.recordSelfAssessment(results);

    const bySkill = {};
    for (const a of state.answers) {
      if (!bySkill[a.skill]) bySkill[a.skill] = { right: 0, total: 0, wrong: [] };
      bySkill[a.skill].total++;
      if (a.correct) bySkill[a.skill].right++;
      else bySkill[a.skill].wrong.push(a.id);
    }

    const right = state.answers.filter((a) => a.correct).length;
    const record = {
      at: Date.now(),
      total: state.questions.length,
      answered: state.answers.length,
      right,
      percent: state.answers.length ? Math.round((right / state.answers.length) * 100) : 0,
      seconds: Math.round((Date.now() - state.startedAt) / 1000),
      bySkill,
      overallLevel: profile.overallLevel,
    };
    const h = assess.history();
    h.push(record);
    if (h.length > 20) h.shift();
    scope.set('history', h);
    state.finished = true;
    CPL.bus.emit('assess:finished', record);
    return { record, profile };
  };

  /** 需要重测的题目（答错过的），用于"错题重练"。 */
  assess.wrongQuestions = function wrongQuestions() {
    const latest = assess.latest();
    if (!latest) return [];
    const ids = new Set();
    for (const entry of Object.values(latest.bySkill || {})) {
      for (const id of entry.wrong || []) ids.add(id);
    }
    return QUESTIONS.filter((q) => ids.has(q.id));
  };

  assess.reset = function reset() {
    scope.remove('history');
    CPL.mastery.reset();
    state.questions = [];
    state.answers = [];
    state.index = 0;
    state.finished = false;
    CPL.bus.emit('assess:reset', {});
  };

  // ─────────────────────────────────────────────────────────────
  // 测评视图（路由 #/assess）
  // ─────────────────────────────────────────────────────────────
  const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

  CPL.nav.register('assess', function renderAssess(main, param) {
    if (param === 'result') return renderResult(main);
    return renderIntro(main);
  });

  function header(title, lead) {
    return dom.h(
      'header',
      { class: 'cpl-lesson__head' },
      dom.h('p', { class: 'cpl-lesson__crumb' }, dom.h('a', { href: '#/home', text: '首页' }), ' / 诊断测评'),
      dom.h('h1', { class: 'cpl-lesson__title', text: title }),
      lead ? dom.h('p', { class: 'cpl-lesson__subtitle', text: lead }) : null
    );
  }

  function renderIntro(main) {
    const prof = CPL.mastery.profile();
    const latest = assess.latest();

    main.append(
      header(
        '先测一测，再决定从哪开始',
        '这一步不是为了打分，而是为了把「你已经会的」和「你以为你会」分开。测完会生成技能清单画像与学习路径。'
      )
    );

    const body = dom.h('div', { class: 'cpl-assess__intro' });

    body.append(
      dom.h(
        'div',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '这个测评是怎么运作的' }),
        dom.h(
          'ul',
          { class: 'cpl-list' },
          [
            `${QUESTIONS.length} 道题，全部是「判据与预测」型，不问名词定义。`,
            '做完立刻给每题解析，并指出对应去上哪一课。',
            '结果只用于在你自己的浏览器里生成学习路径，不上传任何个人信息。',
            '随时可以在设置里清空重测。',
          ].map((t) => dom.h('li', { text: t }))
        ),
        dom.h(
          'div',
          { class: 'cpl-assess__actions' },
          dom.h('button', {
            class: 'cpl-btn cpl-btn--primary',
            type: 'button',
            text: latest ? '重测一次（覆盖自我评估）' : `开始诊断（${QUESTIONS.length} 题，约 8 分钟）`,
            onclick: () => {
              assess.start();
              CPL.nav.render();
            },
          }),
          dom.h('button', {
            class: 'cpl-btn',
            type: 'button',
            text: '只测 10 题（快速版）',
            onclick: () => {
              assess.start({ limit: 10 });
              CPL.nav.render();
            },
          }),
          prof.hasAssessment
            ? dom.h('a', { class: 'cpl-btn', href: '#/assess/result', text: '查看上次结果与学习路径' })
            : null
        )
      )
    );

    if (prof.hasAssessment) {
      body.append(renderSkillTable(prof));
    } else {
      body.append(
        dom.h(
          'div',
          { class: 'cpl-card' },
          dom.h('h2', { class: 'cpl-card__title', text: '还没测过' }),
          dom.h('p', {
            text:
              '不测也能用：课程页、demo、练习都能直接进。但"跳过已掌握的、优先补薄弱的"这条路径需要测评结果才能算出来，否则只能从第 1 周顺序学。',
          }),
          dom.h('p', { class: 'cpl-muted', text: '技能清单共 ' + CPL.mastery.skills().length + ' 项，覆盖计算物理概念、Fortran、数据结构与算法、系统与并发。' })
        )
      );
    }

    main.append(body);
  }

  /** 技能清单表格：掌握度 + 等级 + CIU 式检查项。 */
  function renderSkillTable(prof, { compact = false } = {}) {
    const wrap = dom.h('section', { class: 'cpl-card cpl-skilltable' });
    wrap.append(dom.h('h2', { class: 'cpl-card__title', text: '技能清单与掌握度' }));
    wrap.append(
      dom.h('p', {
        class: 'cpl-muted',
        text: `总体 ${Math.round(prof.overall * 100)}%（${CPL.mastery.levelLabel(prof.overallLevel)}）· 已评估 ${prof.assessedCount}/${prof.totalSkills} 项`,
      })
    );

    for (const domain of Object.values(prof.byDomain)) {
      const rows = compact ? domain.rows.filter((r) => r.level !== 'strong') : domain.rows;
      if (compact && !rows.length) continue;

      const section = dom.h('div', { class: 'cpl-skilldomain' });
      section.append(
        dom.h(
          'h3',
          { class: 'cpl-skilldomain__title' },
          dom.h('span', { text: domain.label }),
          dom.h('span', { class: 'cpl-pill', text: `${Math.round(domain.average * 100)}% · ${CPL.mastery.levelLabel(domain.level)}` })
        )
      );

      for (const row of rows) {
        const item = dom.h('details', { class: `cpl-skill cpl-skill--${row.level}` });
        item.append(
          dom.h(
            'summary',
            { class: 'cpl-skill__summary' },
            dom.h('span', { class: `cpl-skill__badge cpl-skill__badge--${row.level}`, text: CPL.mastery.levelLabel(row.level) }),
            dom.h('span', { class: 'cpl-skill__name', text: row.skill.name }),
            dom.h('span', { class: 'cpl-skill__kind', text: row.skill.kind === 'must' ? '必须内化' : '会查即可' }),
            dom.h('span', { class: 'cpl-skill__score', text: `${Math.round(row.score * 100)}%` })
          )
        );
        const detail = dom.h('div', { class: 'cpl-skill__body' });
        if (row.skill.checks && row.skill.checks.length) {
          detail.append(dom.h('h4', { text: 'CIU 式检查项（能当场做出来才算会）' }));
          detail.append(dom.h('ul', { class: 'cpl-list' }, row.skill.checks.map((c) => dom.h('li', { text: c }))));
        }
        if (row.skill.evidence) {
          detail.append(dom.h('h4', { text: '证据要求' }));
          detail.append(dom.h('p', { text: row.skill.evidence }));
        }
        detail.append(
          dom.h(
            'p',
            { class: 'cpl-muted' },
            `自评 ${row.self === null ? '未测' : Math.round(row.self * 100) + '%'} · 课程完成 ${Math.round(row.lesson * 100)}% · 证据 ${Math.round(
              row.evidence * 100
            )}%`
          )
        );
        if (row.skill.lessons.length) {
          detail.append(
            dom.h(
              'p',
              { class: 'cpl-skill__lessons' },
              dom.h('span', { text: '对应课程：' }),
              ...row.skill.lessons.flatMap((id) => {
                const meta = CPL.catalog.meta(id);
                return [
                  dom.h('a', { href: `#/lesson/${id}`, text: meta ? `W${meta.week} ${meta.title}` : id }),
                  document.createTextNode(' '),
                ];
              })
            )
          );
        }
        item.append(detail);
        section.append(item);
      }
      wrap.append(section);
    }
    return wrap;
  }

  assess.renderSkillTable = renderSkillTable;

  // ── 答题界面 ──────────────────────────────────────────────
  CPL.nav.register('assess-quiz', (main) => {
    const q = assess.current();
    if (!q) {
      dom.toast('没有正在进行的测评', { kind: 'warn' });
      CPL.nav.go('assess');
      return;
    }
    const prog = assess.progress();
    const answered = assess.state.answers[assess.state.answers.length - 1];
    const showingFeedback = Boolean(answered && answered.id === q.id);

    main.append(
      header('诊断测评', `${prog.index + 1} / ${prog.total} · 选择最符合你判断的一项`)
    );

    const bar = dom.h('div', { class: 'cpl-quiz__progress' }, dom.h('span', { style: { width: `${((prog.index + 1) / prog.total) * 100}%` } }));
    main.append(bar);

    const card = dom.h('div', { class: 'cpl-quiz' });
    card.append(dom.h('p', { class: 'cpl-quiz__skill', text: `技能：${(CPL.mastery.skill(q.skill) || {}).name || q.skill}` }));
    card.append(dom.h('h2', { class: 'cpl-quiz__q', text: q.q }));

    const options = dom.h('div', { class: 'cpl-quiz__options' });
    const buttons = [];

    function submit(choice) {
      if (showingFeedback) return;
      evaluate(choice);
    }

    q.options.forEach((text, idx) => {
      const btn = dom.h(
        'button',
        {
          class: 'cpl-quiz__option',
          type: 'button',
          onclick: () => submit(idx),
        },
        dom.h('span', { class: 'cpl-quiz__key', text: OPTION_LABELS[idx] }),
        dom.h('span', { class: 'cpl-quiz__text', text })
      );
      buttons.push(btn);
      options.append(btn);
    });
    card.append(options);

    const feedback = dom.h('div', { class: 'cpl-quiz__feedback', hidden: true });
    card.append(feedback);

    // 键盘 1-4 选项
    const onKey = (e) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= q.options.length) {
        e.preventDefault();
        submit(n - 1);
      }
    };
    document.addEventListener('keydown', onKey);
    CPL.nav._cleanup = () => document.removeEventListener('keydown', onKey);

    function paintFeedback(chosen) {
      buttons.forEach((b, i) => {
        b.disabled = true;
        if (i === q.answer) b.classList.add('is-correct');
        else if (i === chosen) b.classList.add('is-wrong');
      });
      const correct = chosen === q.answer;
      dom.clear(feedback);
      feedback.hidden = false;
      feedback.className = `cpl-quiz__feedback ${correct ? 'is-correct' : 'is-wrong'}`;
      feedback.append(
        dom.h('p', { class: 'cpl-quiz__verdict', text: correct ? '✓ 判断正确' : `✗ 正确选项是 ${OPTION_LABELS[q.answer]}` }),
        dom.h('p', { class: 'cpl-quiz__explain', text: q.explain })
      );
      if (!correct && q.lesson) {
        const meta = CPL.catalog.meta(q.lesson);
        feedback.append(
          dom.h(
            'p',
            { class: 'cpl-quiz__next' },
            dom.h('a', { class: 'cpl-btn cpl-btn--sm', href: `#/lesson/${q.lesson}`, text: `去补这一课：${meta ? meta.title : q.lesson}` })
          )
        );
      }
      const isLast = prog.index >= prog.total - 1;
      feedback.append(
        dom.h('div', { class: 'cpl-quiz__actions' },
          dom.h('button', {
            class: 'cpl-btn cpl-btn--primary',
            type: 'button',
            text: isLast ? '查看结果与学习路径 →' : '下一题 →',
            onclick: () => {
              document.removeEventListener('keydown', onKey);
              if (assess.next()) {
                CPL.nav.render();
              } else {
                assess.finish();
                CPL.nav.go('assess', 'result');
              }
            },
          })
        )
      );
      feedback.append(dom.h('p', { class: 'cpl-muted cpl-quiz__kbd-hint', text: '提示：可以直接按数字键 1–4 选择' }));
    }

    function evaluate(choice) {
      const res = assess.answer(choice);
      if (!res) return;
      paintFeedback(choice);
    }

    main.append(card);

    if (showingFeedback) {
      paintFeedback(answered.choice);
    }
  });

  // ── 结果与学习路径 ────────────────────────────────────────
  function renderResult(main) {
    const prof = CPL.mastery.profile();
    const latest = assess.latest();

    main.append(
      header(
        '你的技能画像与学习路径',
        latest
          ? `最近一次测评：${new Date(latest.at).toLocaleString('zh-CN')} · 答对 ${latest.right}/${latest.answered}（${latest.percent}%）· 用时 ${latest.seconds} 秒`
          : '还没有测评结果，先做一次诊断'
      )
    );

    if (!latest && !prof.hasAssessment) {
      main.append(
        dom.errorCard('没有测评数据', '先完成一次诊断测评，才会生成学习路径。', ['点下面的按钮开始']),
        dom.h('p', {}, dom.h('a', { class: 'cpl-btn cpl-btn--primary', href: '#/assess', text: '开始诊断测评' }))
      );
      return;
    }

    // 薄弱项优先
    const weakRows = prof.rows.filter((r) => r.level === 'weak' || r.level === 'unknown');
    const strongRows = prof.rows.filter((r) => r.level === 'strong');

    main.append(
      dom.h(
        'div',
        { class: 'cpl-assess__summary' },
        dom.h(
          'div',
          { class: 'cpl-card' },
          dom.h('h2', { class: 'cpl-card__title', text: '优先补这些' }),
          weakRows.length
            ? dom.h(
                'ul',
                { class: 'cpl-list' },
                weakRows.slice(0, 8).map((r) =>
                  dom.h(
                    'li',
                    {},
                    dom.h('strong', { text: r.skill.name }),
                    dom.h('span', { class: `cpl-pill cpl-pill--${r.level === 'unknown' ? 'warn' : 'danger'}`, text: CPL.mastery.levelLabel(r.level) }),
                    r.skill.checks && r.skill.checks[0] ? dom.h('div', { class: 'cpl-muted', text: '检验方式：' + r.skill.checks[0] }) : null
                  )
                )
              )
            : dom.h('p', { text: '没有明显薄弱项。可以进入下一阶段的内容，或提高难度。' })
        ),
        dom.h(
          'div',
          { class: 'cpl-card' },
          dom.h('h2', { class: 'cpl-card__title', text: '可以快速略过' }),
          strongRows.length
            ? dom.h(
                'ul',
                { class: 'cpl-list' },
                strongRows.map((r) => dom.h('li', {}, dom.h('strong', { text: r.skill.name }), dom.h('span', { class: 'cpl-pill cpl-pill--ok', text: '已掌握' })))
              )
            : dom.h('p', { text: '还没有评估为"已掌握"的技能。先按路径顺序推进。' })
        )
      )
    );

    // 学习路径
    const lessons = CPL.catalog.lessons();
    const rec = CPL.mastery.recommend(lessons);

    const pathCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '推荐学习路径（按你的画像重排）' }));
    pathCard.append(
      dom.h('p', {
        class: 'cpl-muted',
        text: `共 ${rec.focus.length} 课被标为重点，${rec.skip.length} 课被判定为可快速略过。排序规则：先补薄弱（按原有周次），其余保持周次顺序。`,
      })
    );

    const list = dom.h('ol', { class: 'cpl-pathlist' });
    const shown = rec.order.slice(0, 40);
    for (const id of shown) {
      const meta = CPL.catalog.meta(id);
      if (!meta) continue;
      const isFocus = rec.focus.includes(id);
      const isSkip = rec.skip.includes(id);
      list.append(
        dom.h(
          'li',
          { class: `cpl-pathlist__item${isFocus ? ' is-focus' : ''}${isSkip ? ' is-skip' : ''}` },
          dom.h('span', { class: 'cpl-pathlist__week', text: `W${String(meta.week).padStart(2, '0')}` }),
          dom.h(
            'div',
            { class: 'cpl-pathlist__body' },
            dom.h('a', { class: 'cpl-pathlist__link', href: `#/lesson/${id}`, text: meta.title }),
            dom.h('p', { class: 'cpl-pathlist__reason', text: rec.reason[id] || '' })
          ),
          isFocus ? dom.h('span', { class: 'cpl-pill cpl-pill--danger', text: '重点' }) : isSkip ? dom.h('span', { class: 'cpl-pill cpl-pill--ok', text: '可略过' }) : null
        )
      );
    }
    pathCard.append(list);
    if (rec.order.length > shown.length) {
      pathCard.append(dom.h('p', { class: 'cpl-muted', text: `（还有 ${rec.order.length - shown.length} 课未列出，可在左侧目录按周次继续）` }));
    }

    main.append(pathCard);
    main.append(renderSkillTable(prof));

    // 错题重练
    const wrong = assess.wrongQuestions();
    if (wrong.length) {
      const wrongCard = dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: `错题重练（${wrong.length} 题）` }),
        dom.h('p', { class: 'cpl-muted', text: '这些题的技能被判定为薄弱。重练一次会更新自我评估。' }),
        dom.h(
          'div',
          { class: 'cpl-assess__actions' },
          dom.h('button', {
            class: 'cpl-btn cpl-btn--primary',
            type: 'button',
            text: '只重练错题',
            onclick: () => {
              assess.start({ prioritize: wrong.map((w) => w.skill), limit: wrong.length });
              // 只保留错题
              assess.state.questions = wrong.slice();
              CPL.nav.render();
            },
          })
        )
      );
      main.append(wrongCard);
    }

    main.append(
      dom.h(
        'div',
        { class: 'cpl-assess__actions' },
        dom.h('a', { class: 'cpl-btn', href: '#/assess', text: '← 回到测评说明' }),
        dom.h('a', { class: 'cpl-btn cpl-btn--primary', href: `#/lesson/${rec.order.find((id) => rec.focus.includes(id)) || rec.order[0] || ''}`, text: '开始第一课 →' })
      )
    );
  }
})();
