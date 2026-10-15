/*! cphys-cs-lab — app.js（构建产物，请勿直接编辑；改 pieces/*.js 后运行 npm run build） */
"use strict";

/* ===== pieces/07-manifest.snapshot.js ===== */
/* ============================================================================
 * 07-manifest.snapshot.js — 构建期自动生成，请勿手改（运行 npm run build 覆盖）
 * 内容快照：34 课。fetch('manifest.json') 失败时用它兜底。
 * ==========================================================================*/
(function () {
  'use strict';
  window.CPL_MANIFEST_SNAPSHOT = {"schema":1,"generatedAt":"2026-10-15T06:42:09.131Z","count":34,"lessons":[{"id":"basics-01-what-is-a-program","module":0,"week":0.5,"title":"程序是什么","subtitle":"从一行代码到屏幕上的结果：把每一步都看清楚","tags":["程序","print","执行顺序","字符串","注释"],"folder":"basics","file":"content/basics/basics-01-what-is-a-program.js","fingerprint":"011b3343","bytes":15743},{"id":"basics-02-variables","module":0,"week":0.6,"title":"变量与数据类型","subtitle":"给值起名字：把中间结果存下来反复用","tags":["变量","数据类型","赋值"],"folder":"basics","file":"content/basics/basics-02-variables.js","fingerprint":"b6a49dec","bytes":31849},{"id":"basics-03-conditions","module":0,"week":0.7,"title":"条件判断","subtitle":"让程序在不同情况下做不同的事","tags":["if","条件","布尔"],"folder":"basics","file":"content/basics/basics-03-conditions.js","fingerprint":"0b7c020f","bytes":35080},{"id":"basics-04-loops","module":0,"week":0.8,"title":"循环","subtitle":"让同一段代码重复执行，次数由你控制","tags":["for","while","循环","range"],"folder":"basics","file":"content/basics/basics-04-loops.js","fingerprint":"dba49c9b","bytes":29562},{"id":"basics-05-functions","module":0,"week":0.85,"title":"函数","subtitle":"把一段代码打包成有名字、可反复调用的东西","tags":["函数","参数","返回值","作用域"],"folder":"basics","file":"content/basics/basics-05-functions.js","fingerprint":"22c255f6","bytes":34745},{"id":"basics-06-lists","module":0,"week":0.9,"title":"列表与下标","subtitle":"一格一格地装数据：编号从 0 开始，这件事要记牢","tags":["列表","下标","索引","切片"],"folder":"basics","file":"content/basics/basics-06-lists.js","fingerprint":"8e88fa63","bytes":44248},{"id":"appendix-a-concept-cards","module":6,"week":1,"title":"附录 A · 概念卡片总表","subtitle":"把所有「必须内化」的概念压成可检索、可校验、可导出的卡片","tags":["appendix","concept-card","anki","index","audit"],"folder":"meta","file":"content/meta/appendix-a-concept-cards.js","fingerprint":"ac60f299","bytes":32676},{"id":"appendix-b-assessment","module":6,"week":1,"title":"附录 B · 自查清单与验收标准","subtitle":"把「我学会了」变成可以被打分的证据：每条验收都指向一个能测的量","tags":["appendix","assessment","rubric","self-check"],"folder":"meta","file":"content/meta/appendix-b-assessment.js","fingerprint":"aa5d9f40","bytes":29276},{"id":"lab-01-complexity-memory","module":1,"week":1,"title":"复杂度与内存模型","subtitle":"先估操作数、再看内存：判断一段代码在这台机器上还行不行","tags":["big-O","memory","cache","locality"],"folder":"labs","file":"content/labs/lab-01-complexity-memory.js","fingerprint":"0d19dee9","bytes":20480},{"id":"lab-05-python-numpy","module":2,"week":1,"title":"Python 科学计算速查","subtitle":"ndarray 是「连续内存 + 元数据」：把循环换成向量化，把拷贝换成视图","tags":["numpy","vectorization","broadcast","view"],"folder":"labs","file":"content/labs/lab-05-python-numpy.js","fingerprint":"c77c72ec","bytes":23587},{"id":"lab-06-cpp-reading","module":2,"week":1,"title":"C++ 阅读能力","subtitle":"读懂别人的 C++：从声明读出所有权，从签名读出拷贝，从循环读出复杂度","tags":["cpp","raii","const-reference","stl"],"folder":"labs","file":"content/labs/lab-06-cpp-reading.js","fingerprint":"c8ec6ba3","bytes":22530},{"id":"lab-08-toolchain","module":2,"week":1,"title":"工具链：Linux / Git / venv / pytest / cProfile / Make / CMake","subtitle":"把「环境不确定」变成「可复现」：依赖锁定、二分定位、先测量再优化、增量构建","tags":["toolchain","git","pytest","cprofile","make","cmake"],"folder":"labs","file":"content/labs/lab-08-toolchain.js","fingerprint":"03f4c203","bytes":27841},{"id":"lab-09-ai-assisted","module":2,"week":1,"title":"AI 辅助的正确用法","subtitle":"生成很便宜、验证很贵：把 AI 用在「可验证的产出」上，而不是用在「看起来对」上","tags":["ai","verification","hallucination","workflow"],"folder":"labs","file":"content/labs/lab-09-ai-assisted.js","fingerprint":"99c011f6","bytes":24520},{"id":"module-06-anti-forgetting","module":6,"week":1,"title":"系统抗遗忘 · 项目锚点与间隔重复","subtitle":"忘记不是归零，是存档：把细节挂回项目，再按间隔把它取回来","tags":["anti-forgetting","spaced-repetition","anchor","feynman"],"folder":"meta","file":"content/meta/module-06-anti-forgetting.js","fingerprint":"6c86b25b","bytes":31247},{"id":"lab-02-numerical-error","module":1,"week":2,"title":"数值误差与稳定性","subtitle":"把「浮点不精确」这句空话换成可以预先估计的误差量级","tags":["ieee754","cancellation","kahan","condition-number"],"folder":"labs","file":"content/labs/lab-02-numerical-error.js","fingerprint":"8ed2b1c1","bytes":21714},{"id":"lab-03-convergence-boundary","module":1,"week":3,"title":"收敛阶与边界条件","subtitle":"用 log-log 斜率把「格式是几阶的」变成一个可以测出来的数","tags":["convergence","order","stability","boundary"],"folder":"labs","file":"content/labs/lab-03-convergence-boundary.js","fingerprint":"ba1ff15f","bytes":23833},{"id":"lab-04-parallel-debug","module":1,"week":4,"title":"并行范式与调试方法","subtitle":"并行不是把循环加个指令：先算加速比上限，再用确定性复现定位竞态","tags":["amdahl","openmp","mpi","race-condition"],"folder":"labs","file":"content/labs/lab-04-parallel-debug.js","fingerprint":"ae8cf4aa","bytes":25101},{"id":"lab-07-fortran-cheatsheet","module":2,"week":5,"title":"Fortran 基础速查","subtitle":"语法、kind、数组语义、I/O、编译参数——全部按「30 秒能查到」的标准整理","tags":["fortran","kind","array","gfortran"],"folder":"labs","file":"content/labs/lab-07-fortran-cheatsheet.js","fingerprint":"16aa4c20","bytes":23664},{"id":"week-05-fortran-basics","module":3,"week":5,"title":"Fortran 基础与现代特性","subtitle":"用 module + elemental + pure 写出能被编译器检查的计算物理代码","tags":["fortran","module","elemental","pure","kind"],"folder":"fortran","file":"content/fortran/week-05-fortran-basics.js","fingerprint":"fb8a3e5f","bytes":24632},{"id":"week-06-numerical-arrays","module":3,"week":6,"title":"数值方法与数组操作","subtitle":"allocatable、BLAS、掩码归约与蒙特卡洛：让数组运算既快又准","tags":["fortran","array","blas","monte-carlo","reduction"],"folder":"fortran","file":"content/fortran/week-06-numerical-arrays.js","fingerprint":"a113b3f9","bytes":26333},{"id":"week-07-performance-parallel","module":3,"week":7,"title":"性能、并行与 legacy 代码","subtitle":"先测量、再并行、最后才谈优化：OpenMP 归约、halo 交换与 legacy 改造策略","tags":["fortran","openmp","mpi","roofline","legacy"],"folder":"fortran","file":"content/fortran/week-07-performance-parallel.js","fingerprint":"8297960c","bytes":26997},{"id":"week-08-project-question","module":4,"week":8,"title":"项目知识整理 I · 物理问题是什么","subtitle":"把「我在算什么」压缩成别人能复现的三句话加一张参数表","tags":["project","dimensional-analysis","boundary-condition","buckingham-pi"],"folder":"projects","file":"content/projects/week-08-project-question.js","fingerprint":"ad2d754d","bytes":24657},{"id":"week-09-project-method","module":4,"week":9,"title":"项目知识整理 II · 数值方法与数据流","subtitle":"把「为什么不用别的」写成一张取舍表，把代码画成一条数据流","tags":["project","numerical-method","dataflow","architecture"],"folder":"projects","file":"content/projects/week-09-project-method.js","fingerprint":"97e18fe7","bytes":36701},{"id":"week-10-project-verification","module":4,"week":10,"title":"项目知识整理 III · 调试、性能与验证","subtitle":"把「我确定它是对的」变成一份可复现的测量记录","tags":["project","debug","profiling","convergence","verification"],"folder":"projects","file":"content/projects/week-10-project-verification.js","fingerprint":"f3d988a6","bytes":29848},{"id":"week-11-complexity-array-hash","module":5,"week":11,"title":"复杂度 · 数组 · 哈希表","subtitle":"把「量级判断」变成直觉，而不是查表","tags":["big-O","amortized","hash","array"],"folder":"cs-core","file":"content/cs-core/week-11-complexity-array-hash.js","fingerprint":"6f50fca0","bytes":16789},{"id":"week-12-linked-list-stack-queue","module":5,"week":12,"title":"链表 · 栈 · 队列 · 递归","subtitle":"同一份数据的四种接口：指针、LIFO、FIFO 与调用栈","tags":["linked-list","stack","queue","recursion"],"folder":"cs-core","file":"content/cs-core/week-12-linked-list-stack-queue.js","fingerprint":"1d803a61","bytes":26495},{"id":"week-13-tree-heap-trie","module":5,"week":13,"title":"树 · 堆 · 优先队列 · Trie · 并查集","subtitle":"层次结构：从遍历顺序到路径压缩","tags":["tree","bst","heap","trie","union-find"],"folder":"cs-core","file":"content/cs-core/week-13-tree-heap-trie.js","fingerprint":"586d1881","bytes":31302},{"id":"week-14-sort-binary-backtrack","module":5,"week":14,"title":"排序 · 二分 · 分治 · 回溯 · 贪心","subtitle":"把搜索空间剪到能算完为止","tags":["sorting","binary-search","divide-conquer","backtracking","greedy"],"folder":"cs-core","file":"content/cs-core/week-14-sort-binary-backtrack.js","fingerprint":"f257b17c","bytes":32992},{"id":"week-15-dp-graph","module":5,"week":15,"title":"动态规划 · 图算法","subtitle":"状态定义与最短路契约：DP 是 DAG 上的最短路","tags":["dynamic-programming","graph","dijkstra","bellman-ford","mst"],"folder":"cs-core","file":"content/cs-core/week-15-dp-graph.js","fingerprint":"7342bf14","bytes":32835},{"id":"week-16-system-design-1","module":5,"week":16,"title":"系统设计基础 I","subtitle":"可扩展性 · 负载均衡 · 缓存 · CDN · SQL/NoSQL · 消息队列","tags":["scalability","load-balancing","caching","cdn","nosql","message-queue","lru"],"folder":"cs-core","file":"content/cs-core/week-16-system-design-1.js","fingerprint":"261ab0ee","bytes":32212},{"id":"week-17-system-design-2","module":5,"week":17,"title":"系统设计基础 II","subtitle":"CAP · 一致性 · 微服务 · 分布式 · MapReduce · 限流 · 幂等","tags":["cap","consistency","microservices","distributed","mapreduce","rate-limiting","idempotency"],"folder":"cs-core","file":"content/cs-core/week-17-system-design-2.js","fingerprint":"5d15738e","bytes":31480},{"id":"week-18-os-network-db","module":5,"week":18,"title":"OS / 网络 / 数据库速览","subtitle":"进程线程 · 内存 · 文件系统 · TCP/IP · HTTP · DNS · TLS · 索引 · 事务","tags":["os","memory","filesystem","tcp","http","dns","tls","index","transaction"],"folder":"cs-core","file":"content/cs-core/week-18-os-network-db.js","fingerprint":"dacb999b","bytes":31957},{"id":"week-19-concurrency-performance","module":5,"week":19,"title":"并发 · 性能 · 综合复习","subtitle":"线程 · 锁 · 无锁 · Actor · MapReduce · 性能分析 · 知识体系梳理","tags":["concurrency","lock","lock-free","actor","mapreduce","performance","amdahl","review"],"folder":"cs-core","file":"content/cs-core/week-19-concurrency-performance.js","fingerprint":"20ab1a96","bytes":33570},{"id":"user-example-lesson","module":7,"week":99,"title":"自定义课程示例（复制我）","subtitle":"纯笔记形式的内置课程模板","tags":["自定义","示例"],"folder":"user","file":"content/user/example-lesson.js","fingerprint":"f17ddaa9","bytes":7959}]};
})();

/* ===== pieces/07-syllabus.snapshot.js ===== */
/* ============================================================================
 * 07-syllabus.snapshot.js — 构建期自动生成，请勿手改（运行 npm run build 覆盖）
 * 课程大纲快照（模块划分与周次安排）。
 * ==========================================================================*/
(function () {
  'use strict';
  window.CPL_SYLLABUS_SNAPSHOT = {"schema":1,"title":"计算物理 × 计算机科学 · 互动学习平台","weeks":27,"philosophy":{"concept":"概念性知识必须内化：复杂度、内存模型、数值误差、稳定性、收敛阶、并行范式、边界条件、调试方法。判据是能自己推回来。","tool":"工具性细节知道存在、会查即可：API、语法、库函数、编译参数。判据是 30 秒能查到。","antiForgetting":"忘记不是归零，是存档：项目锚点 + 代码库 + Anki 间隔重复 + 费曼输出。"},"modules":[{"id":0,"title":"零基础入门：从没写过代码开始","weeks":[0,0],"summary":"假设你此前从未写过一行代码、也不知道「程序」是什么。六节课把后面 27 周要用到的最小语言基础补齐：程序与执行、变量与类型、条件、循环、函数、列表与下标。每个名词第一次出现时就地解释清楚，配可在浏览器里直接运行的练习。","outcome":"能读懂并写出含变量、条件、循环、函数、列表的一小段 Python 代码，并知道每一行的作用。","isPrerequisite":true},{"id":1,"title":"概念性知识内化","weeks":[1,4],"summary":"把四类必须内化的概念——计算复杂度与内存模型、浮点误差与稳定性、收敛阶与边界条件、并行范式与调试——用你自己的科研代码练到手。","outcome":"一份「概念卡片」，每张卡都用一具体科研代码片段举例。"},{"id":2,"title":"工具性细节速查","weeks":[1,27],"summary":"每天 15 分钟：Python 科学计算、C++ 阅读、现代 Fortran 语法、工具链（Linux/Git/venv/pytest/cProfile/Makefile/CMake）、AI 辅助的正确用法。","outcome":"一份可检索的个人速查库；每节课附「查文档挑战」。"},{"id":3,"title":"Fortran 计算物理编程","weeks":[5,7],"summary":"现代 Fortran 与 legacy 代码的阅读、修改、性能优化；数组语义、BLAS/LAPACK 调用、列主序内存布局、OpenMP/MPI/Coarray、与 C/Python 互操作。","outcome":"能读懂并改造一段真实的计算物理 Fortran 代码，并能解释其性能特征。"},{"id":4,"title":"计算物理项目知识整理","weeks":[8,10],"summary":"把每个科研项目（PRB/CPC 类工作）整理成 7 问知识文档：物理问题、数值方法取舍、代码架构与数据流、最大 bug 的定位过程、性能瓶颈与优化、正确性验证、如果重做会改什么。","outcome":"每个项目一页可导出的知识整理文档。"},{"id":5,"title":"计算机科学核心知识","weeks":[11,19],"summary":"CIU 式清单推进：复杂度与基础数据结构 → 链表栈队列递归 → 树堆 Trie 并查集 → 排序二分分治回溯贪心 → DP 与图 → 系统设计 I/II → OS/网络/数据库 → 并发与性能。","outcome":"每个主题一个交互式 demo、一组练习题、一套 Anki 卡片。"},{"id":6,"title":"系统抗遗忘","weeks":[1,27],"summary":"把细节挂在项目锚点上，建立自己的 snippets 与笔记库，每周 10 分钟间隔重复，用费曼输出检验真正掌握。","outcome":"可持续运转的复习机制：每周自动生成 5 张基于本周代码与错题的 Anki 卡。"},{"id":7,"title":"用户自定义学习内容","weeks":[1,27],"summary":"在浏览器里创建、编辑、保存、导出、导入你自己的知识卡片与课程模块；内容存在本机（localStorage/IndexedDB），也可按模板贡献到仓库。","outcome":"你自己的课程出现在课表里，可编辑、删除、排序，并可一键备份为 JSON。"}],"lessonStructure":[{"key":"objectives","label":"学习目标","desc":"学完能做什么，用可检验的动词描述。"},{"key":"concepts","label":"核心概念","desc":"必须内化的概念性知识，附自检问题。"},{"key":"tools","label":"工具速查","desc":"知道存在、会查即可的 API/语法/命令。"},{"key":"demo","label":"交互式 demo","desc":"可在浏览器里调参数、看曲线、做参数扫描。"},{"key":"exercise","label":"代码练习","desc":"浏览器内运行（Python/NumPy 完整支持）。"},{"key":"tests","label":"自动测试","desc":"断言题目要点，跑通即通过。"},{"key":"aiPrompts","label":"AI 助教引导","desc":"只提问不给答案，逼你自己想清楚。"},{"key":"anki","label":"Anki 卡片","desc":"可直接导出的问答卡，含 .apkg/CSV。"},{"key":"reading","label":"延伸阅读","desc":"教材章节与论文，标注读哪一节。"},{"key":"checklist","label":"完成自检","desc":"勾完即视为掌握，进度自动记录。"}]};
})();

/* ===== pieces/00-core.js ===== */
/* ============================================================================
 * 00-core.js — 命名空间、配置、事件总线、工具函数
 *
 * 这是整个前端的第一个分片，也是唯一的全局入口。所有其他分片都挂在 CPL 上。
 * 设计原则：无框架、无构建期依赖、可在 file:// 下降级运行。
 * ==========================================================================*/
(function () {
  'use strict';

  const CPL = (window.CPL = window.CPL || {});

  /** 与 manifest.json 的 schema 对应；改动需同步 scripts/lib/manifest.mjs。 */
  CPL.VERSION = '0.1.0';
  CPL.SCHEMA = 1;

  /** 所有 localStorage 键统一前缀，便于"清空本站数据"与版本迁移。 */
  CPL.NS = 'cpl.v1.';

  // ─────────────────────────────────────────────────────────────
  // 配置：优先级 window.CPL_CONFIG > 默认值
  // 注意：这里只放"公开"配置。任何密钥、token、私有上游地址都不允许出现在前端。
  // ─────────────────────────────────────────────────────────────
  const DEFAULTS = {
    // AI 代理地址。留空则 AI 助教进入"离线模式"，只显示本地引导问题库。
    apiBase: '',
    // 站点名与副标题
    siteName: '计算物理 × 计算机科学',
    siteSubtitle: '概念内化 · 工具速查 · 抗遗忘',
    // 允许按需从第三方 CDN 加载可选依赖（Pyodide / KaTeX / CodeMirror）。
    // 关掉它则完全离线（需要把依赖 vendored 到仓库，见 README「离线部署」）。
    allowCdn: true,
    // CDN 基址，便于自托管或换镜像。
    // 版本号经过核实（2026）：
    //   Pyodide 314.0.7 = Python 3.14.2 线，core ≈ 13.5 MB，numpy wheel ≈ 2.9 MB
    //   KaTeX 0.19.0 = 当前稳定版，带 SRI
    //   CodeMirror 6 通过 esm.sh 加载，必须用 import map 钉死所有 @codemirror/* 版本，
    //   否则会出现两份 @codemirror/state 并报 "Unrecognized extension value"。
    cdn: {
      pyodide: 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/',
      pyodideModule: 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs',
      katex: 'https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/',
      katexSRI: {
        css: 'sha384-3rdsX6e5mueWyoweR9NIVmtEsUkokpBT/0ALqKKIBMr9j4qhHkaIkAcGgsE6uVlp',
        js: 'sha384-QFFtAGzvvj+bfgCGxXJlNZZR1nXEZgvG8tDLCCY1F19xl20WlfTYgguB4VcNdxYk',
      },
      esm: 'https://esm.sh/',
    },
    // 可选运行时版本（导入映射用）
    versions: {
      codemirror: '6.0.2',
      langPython: '6.2.1',
      langCpp: '6.0.3',
      legacyModes: '6.5.5',
    },
    // 单次代码执行超时（毫秒）。超时后强杀 Worker，防死循环冻结页面。
    runTimeoutMs: 12000,
    // AI 请求的前端侧限制（服务端还有一道独立的、更严格的限制）
    ai: {
      maxInputChars: 4000,
      maxMessages: 12,
      maxChars: 12000,
      maxCodeChars: 8000,
      maxOutputTokens: 1200,
      stream: true,
      // 前端每分钟最多发起多少次请求（软限制，真正的限流在服务端）
      softRatePerMin: 12,
    },
    // 版本号展示用
    repoUrl: '',
  };

  function mergeConfig(base, override) {
    if (!override || typeof override !== 'object') return base;
    const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    for (const key of Object.keys(override)) {
      const b = base[key];
      const o = override[key];
      if (b && o && typeof b === 'object' && typeof o === 'object' && !Array.isArray(b)) {
        out[key] = mergeConfig(b, o);
      } else if (o !== undefined && o !== null) {
        out[key] = o;
      }
    }
    return out;
  }

  CPL.config = mergeConfig(DEFAULTS, window.CPL_CONFIG || {});
  CPL.defaults = DEFAULTS;

  /** AI 是否可用（前端只判断有没有配代理地址，不涉及任何密钥）。 */
  CPL.aiEnabled = () => Boolean(CPL.config.apiBase);

  // ─────────────────────────────────────────────────────────────
  // 事件总线：分片之间解耦通信
  // ─────────────────────────────────────────────────────────────
  const listeners = new Map();

  CPL.bus = {
    on(event, fn) {
      if (typeof fn !== 'function') return () => {};
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
      return () => CPL.bus.off(event, fn);
    },
    off(event, fn) {
      const set = listeners.get(event);
      if (set) set.delete(fn);
    },
    /** 单个订阅者抛错不影响其他订阅者。 */
    emit(event, payload) {
      const set = listeners.get(event);
      if (!set) return;
      for (const fn of Array.from(set)) {
        try {
          fn(payload);
        } catch (err) {
          CPL.log('error', `[bus:${event}]`, err);
        }
      }
    },
  };

  // ─────────────────────────────────────────────────────────────
  // 日志：默认只在 console 输出，绝不把内容发往任何远端
  // ─────────────────────────────────────────────────────────────
  const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 99 };
  let logLevel = LEVELS.info;
  const logHistory = [];

  CPL.log = function log(level, ...args) {
    const entry = { t: Date.now(), level, args };
    logHistory.push(entry);
    if (logHistory.length > 200) logHistory.shift();
    if ((LEVELS[level] || 20) < logLevel) return;
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn.call(console, `[CPL:${level}]`, ...args);
  };
  CPL.setLogLevel = (name) => {
    if (LEVELS[name] !== undefined) logLevel = LEVELS[name];
  };
  CPL.logHistory = () => logHistory.slice();

  // ─────────────────────────────────────────────────────────────
  // 通用工具
  // ─────────────────────────────────────────────────────────────
  const util = (CPL.util = {});

  util.clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

  util.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /** 去抖 */
  util.debounce = (fn, ms = 200) => {
    let timer = null;
    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  /** 节流（首帧立即执行） */
  util.throttle = (fn, ms = 100) => {
    let last = 0;
    let timer = null;
    return function throttled(...args) {
      const now = Date.now();
      const wait = ms - (now - last);
      if (wait <= 0) {
        last = now;
        fn.apply(this, args);
      } else if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          last = Date.now();
          fn.apply(this, args);
        }, wait);
      }
    };
  };

  /** 稳定字符串哈希（FNV-1a），与构建脚本保持一致，用于内容指纹。 */
  util.hash = (text) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  };

  util.uid = (prefix = 'id') =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  /** 带单位的数字格式化，用于把 10^6 级别的量级写成人能读的形式。 */
  util.fmtNum = (n, digits = 3) => {
    if (!Number.isFinite(n)) return String(n);
    const abs = Math.abs(n);
    if (abs === 0) return '0';
    // 先判科学计数法区间，再判千分位——顺序反了会让 1e6 落到 toLocaleString 分支
    if (abs >= 1e6 || abs < 1e-4) return n.toExponential(digits - 1).replace('e', '×10^');
    if (abs >= 1e5) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return Number(n.toPrecision(digits)).toString();
  };

  util.bytes = (n) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
  };

  util.seconds = (ms) => (ms < 1000 ? `${ms.toFixed(0)} ms` : `${(ms / 1000).toFixed(2)} s`);

  /** 深拷贝（仅处理 JSON 可表达的数据；跨分片传内容对象足够用）。 */
  util.clone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (typeof structuredClone === 'function') {
      try {
        return structuredClone(obj);
      } catch {
        /* 含函数时退化到浅拷贝路径 */
      }
    }
    if (Array.isArray(obj)) return obj.map(util.clone);
    const out = {};
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      out[k] = typeof v === 'function' ? v : util.clone(v);
    }
    return out;
  };

  /** 占位符替换：{name} → params.name */
  util.template = (str, params = {}) =>
    String(str).replace(/\{(\w+)\}/g, (m, key) => (params[key] === undefined ? m : String(params[key])));

  /** 数组按 key 分组 */
  util.groupBy = (arr, keyFn) => {
    const out = new Map();
    for (const item of arr) {
      const k = keyFn(item);
      if (!out.has(k)) out.set(k, []);
      out.get(k).push(item);
    }
    return out;
  };

  /** 线性回归斜率（用于 log-log 图上自动拟合收敛阶）。 */
  util.slope = (xs, ys) => {
    const n = Math.min(xs.length, ys.length);
    if (n < 2) return NaN;
    let sx = 0;
    let sy = 0;
    let sxx = 0;
    let sxy = 0;
    for (let i = 0; i < n; i++) {
      sx += xs[i];
      sy += ys[i];
      sxx += xs[i] * xs[i];
      sxy += xs[i] * ys[i];
    }
    const denom = n * sxx - sx * sx;
    if (Math.abs(denom) < 1e-30) return NaN;
    return (n * sxy - sx * sy) / denom;
  };

  /** 皮尔逊相关系数，用来判断拟合是否可信。 */
  util.pearson = (xs, ys) => {
    const n = Math.min(xs.length, ys.length);
    if (n < 2) return NaN;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let dx = 0;
    let dy = 0;
    for (let i = 0; i < n; i++) {
      const a = xs[i] - mx;
      const b = ys[i] - my;
      num += a * b;
      dx += a * a;
      dy += b * b;
    }
    const den = Math.sqrt(dx * dy);
    return den < 1e-30 ? NaN : num / den;
  };

  /** 防 unhandled rejection 静默失败：统一上报到日志与事件总线。 */
  CPL.guard = (label, fn) => {
    try {
      const r = fn();
      if (r && typeof r.then === 'function') {
        return r.catch((err) => {
          CPL.log('error', `[${label}]`, err);
          CPL.bus.emit('app:error', { label, error: err });
          return undefined;
        });
      }
      return r;
    } catch (err) {
      CPL.log('error', `[${label}]`, err);
      CPL.bus.emit('app:error', { label, error: err });
      return undefined;
    }
  };

  window.addEventListener('unhandledrejection', (e) => {
    CPL.log('error', '[unhandledrejection]', e.reason);
    CPL.bus.emit('app:error', { label: 'unhandledrejection', error: e.reason });
  });
  window.addEventListener('error', (e) => {
    // 资源加载失败没有 error 对象，只有 target
    if (e.target && e.target !== window && e.target.tagName) {
      CPL.log('warn', '[resource]', e.target.tagName, e.target.src || e.target.href);
      return;
    }
    CPL.log('error', '[window.onerror]', e.message);
  });

  CPL.ready = false;

  // ─────────────────────────────────────────────────────────────
  // 路由注册表的"占位"
  //
  // 分片按文件名顺序加载，而视图分片（35-assessment / 40-lesson / 90-user-content）
  // 都排在 95-nav.js 之前。为了让它们能在加载期就调用 CPL.nav.register(...)，
  // 这里先建一个极小的桩：register 把渲染函数收进 views，go/render 等真正实现
  // 由 95-nav.js 挂上并接管（见该文件开头的说明）。
  // ─────────────────────────────────────────────────────────────
  const navStub = (CPL.nav = CPL.nav || {});
  navStub.views = navStub.views || {};
  if (!navStub.register) {
    navStub.register = function register(name, fn) {
      navStub.views[name] = fn;
    };
  }
  if (!navStub.go) {
    navStub.go = function go(name, param) {
      location.hash = `#/${name}${param ? '/' + param : ''}`;
    };
  }
})();

/* ===== pieces/05-dom.js ===== */
/* ============================================================================
 * 05-dom.js — DOM 构造与安全渲染工具
 *
 * 安全前提：全站任何"来自内容 / 用户 / AI"的文本都必须经过 esc() 或
 * text() 注入，绝不允许直接 innerHTML 拼接未转义字符串。
 * markdown 渲染器（20-markdown.js）已经统一转义，这里是最后一道闸门。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const util = (CPL.util = CPL.util || {});
  const dom = (CPL.dom = {});

  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** 转义为 HTML 文本安全形式。所有不可信字符串都要过这一关。 */
  dom.esc = (s) =>
    String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

  /** 转义为 HTML 属性值安全形式（比 esc 更严格，额外拦掉控制字符）。 */
  dom.escAttr = (s) =>
    dom
      .esc(s)
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001f\u007f]/g, (c) => '&#' + c.charCodeAt(0) + ';');

  /** URL 白名单：只允许 http/https/mailto/锚点/相对路径，拦掉 javascript: 与 data: */
  dom.safeUrl = (url) => {
    const raw = String(url || '').trim();
    if (!raw) return '';
    // 先去掉可能绕过检测的空白与换行
    const normalized = raw.replace(/[\u0000-\u0020]/g, '').toLowerCase();
    if (/^(javascript|vbscript|file):/.test(normalized)) return '';
    if (/^data:/.test(normalized)) {
      // 只允许图片类 data URI
      return /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/.test(normalized) ? raw : '';
    }
    return raw;
  };

  /** 创建元素：h('div', {class:'x'}, '文本', childEl) */
  dom.h = (tag, attrs, ...children) => {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (value === null || value === undefined || value === false) continue;
        if (key === 'class' || key === 'className') {
          el.className = Array.isArray(value) ? value.filter(Boolean).join(' ') : String(value);
        } else if (key === 'text') {
          el.textContent = String(value);
        } else if (key === 'html') {
          // 仅供本文件内部与已验证的白名单渲染器使用
          el.innerHTML = String(value);
        } else if (key === 'dataset') {
          Object.assign(el.dataset, value);
        } else if (key === 'style' && typeof value === 'object') {
          Object.assign(el.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === 'value' && (tag === 'input' || tag === 'textarea' || tag === 'select')) {
          el.value = String(value);
        } else if (value === true) {
          el.setAttribute(key, '');
        } else {
          el.setAttribute(key, String(value));
        }
      }
    }
    for (const child of children.flat(Infinity)) {
      if (child === null || child === undefined || child === false) continue;
      el.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
  };

  /** SVG 元素（需命名空间） */
  dom.svg = (tag, attrs, ...children) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (value === null || value === undefined || value === false) continue;
        if (key.startsWith('on') && typeof value === 'function') {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
          el.setAttribute(key, String(value));
        }
      }
    }
    for (const child of children.flat(Infinity)) {
      if (child === null || child === undefined || child === false) continue;
      el.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
  };

  dom.clear = (el) => {
    while (el && el.firstChild) el.removeChild(el.firstChild);
    return el;
  };

  dom.qs = (sel, root = document) => root.querySelector(sel);
  dom.qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** 一次性事件监听，返回取消函数。 */
  dom.on = (target, event, handler, options) => {
    target.addEventListener(event, handler, options);
    return () => target.removeEventListener(event, handler, options);
  };

  /** 事件委托：只在容器上挂一个监听。 */
  dom.delegate = (root, event, selector, handler) => {
    const wrapped = (e) => {
      const match = e.target instanceof Element ? e.target.closest(selector) : null;
      if (match && root.contains(match)) handler(e, match);
    };
    root.addEventListener(event, wrapped);
    return () => root.removeEventListener(event, wrapped);
  };

  /** 等待 DOM 就绪 */
  dom.ready = () =>
    new Promise((resolve) => {
      if (document.readyState !== 'loading') resolve();
      else document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
    });

  // ─────────────────────────────────────────────────────────────
  // 通知条（toast）
  // ─────────────────────────────────────────────────────────────
  let toastHost = null;

  function ensureToastHost() {
    if (toastHost && document.body.contains(toastHost)) return toastHost;
    toastHost = dom.h('div', {
      class: 'cpl-toasts',
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'false',
    });
    document.body.append(toastHost);
    return toastHost;
  }

  /**
   * @param {string} message
   * @param {{kind?:'info'|'ok'|'warn'|'error', ms?:number, action?:{label:string,onClick:Function}}} opts
   */
  dom.toast = (message, opts = {}) => {
    const host = ensureToastHost();
    const kind = opts.kind || 'info';
    const node = dom.h(
      'div',
      { class: `cpl-toast cpl-toast--${kind}` },
      dom.h('span', { class: 'cpl-toast__msg', text: message })
    );
    if (opts.action && typeof opts.action.onClick === 'function') {
      node.append(
        dom.h('button', {
          class: 'cpl-toast__action',
          type: 'button',
          text: opts.action.label,
          onclick: () => {
            opts.action.onClick();
            node.remove();
          },
        })
      );
    }
    const close = dom.h('button', {
      class: 'cpl-toast__close',
      type: 'button',
      'aria-label': '关闭通知',
      text: '×',
      onclick: () => node.remove(),
    });
    node.append(close);
    host.append(node);
    const ms = opts.ms === undefined ? (kind === 'error' ? 9000 : 4200) : opts.ms;
    if (ms > 0) setTimeout(() => node.remove(), ms);
    return node;
  };

  /** 统一的加载骨架 */
  dom.spinner = (label = '加载中…') =>
    dom.h(
      'div',
      { class: 'cpl-spinner', role: 'status', 'aria-live': 'polite' },
      dom.h('span', { class: 'cpl-spinner__dot' }),
      dom.h('span', { class: 'cpl-spinner__dot' }),
      dom.h('span', { class: 'cpl-spinner__dot' }),
      dom.h('span', { class: 'cpl-spinner__label', text: label })
    );

  /** 错误卡片：统一错误展示，永不显示堆栈或内部路径。 */
  dom.errorCard = (title, detail, hints = []) =>
    dom.h(
      'div',
      { class: 'cpl-error-card', role: 'alert' },
      dom.h('h3', { class: 'cpl-error-card__title', text: title }),
      detail ? dom.h('p', { class: 'cpl-error-card__detail', text: detail }) : null,
      hints.length
        ? dom.h(
            'ul',
            { class: 'cpl-error-card__hints' },
            hints.map((h) => dom.h('li', { text: h }))
          )
        : null
    );

  /** 把任意错误对象压成"可展示、不泄露内部信息"的一句话。 */
  dom.friendlyError = (err) => {
    if (!err) return '发生未知错误';
    const msg = typeof err === 'string' ? err : err.message || String(err);
    // 剥离可能的绝对路径与堆栈行
    return msg
      .split('\n')[0]
      .replace(/(?:\/[\w.\-]+){3,}/g, '<路径已隐藏>')
      .slice(0, 300);
  };

  // ─────────────────────────────────────────────────────────────
  // 无障碍与键盘
  // ─────────────────────────────────────────────────────────────
  /** 焦点陷阱：用于移动端抽屉与模态框。 */
  dom.trapFocus = (container) => {
    const SELECTOR =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const items = Array.from(container.querySelectorAll(SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', onKey);
    return () => container.removeEventListener('keydown', onKey);
  };

  dom.copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // 非安全上下文（如 file://）退化为 execCommand
      const ta = dom.h('textarea', { style: { position: 'fixed', opacity: '0' } });
      ta.value = text;
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (err) {
      util.hash; // 保持 util 引用，避免打包器误删
      CPL.log('warn', '复制失败', err);
      return false;
    }
  };

  dom.download = (filename, content, mime = 'application/json') => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = dom.h('a', { href: url, download: filename });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  /** 读取用户选择的文件（导入用）。限制大小，避免一次性把内存吃满。 */
  dom.pickFile = (accept = '.json,application/json', maxBytes = 8 * 1024 * 1024) =>
    new Promise((resolve, reject) => {
      const input = dom.h('input', { type: 'file', accept, style: { display: 'none' } });
      document.body.append(input);
      input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        input.remove();
        if (!file) return resolve(null);
        if (file.size > maxBytes) {
          return reject(new Error(`文件过大（${util.bytes(file.size)}），上限 ${util.bytes(maxBytes)}`));
        }
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, text: String(reader.result || '') });
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsText(file, 'utf-8');
        return undefined;
      });
      input.click();
    });
})();

/* ===== pieces/10-store.js ===== */
/* ============================================================================
 * 10-store.js — 持久化：localStorage 轻量状态 + IndexedDB 大对象
 *
 * 分工（对应规划 D6）：
 *   · localStorage：进度、偏好、勾选清单等小对象（< 5MB，同步、简单）。
 *   · IndexedDB   ：用户自定义课程（Markdown 正文可能很大）、Anki 卡片库、
 *                   代码草稿快照。
 *   · 内存兜底    ：隐私模式 / 存储被禁用时，功能不崩，只是刷新后丢失，
 *                   并且会明确告知用户（不允许静默丢数据）。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;

  const NS = CPL.NS; // 'cpl.v1.'

  // ─────────────────────────────────────────────────────────────
  // 能力探测
  // ─────────────────────────────────────────────────────────────
  const memory = new Map();
  let lsOk = false;
  let idbOk = false;

  try {
    const probe = NS + '__probe';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    lsOk = true;
  } catch {
    lsOk = false;
    CPL.log('warn', 'localStorage 不可用（隐私模式或存储被禁用），本次会话进度只保存在内存中');
  }

  // IndexedDB 的可用性必须"真的打开一次"才能确定：
  // Safari 在第三方/跨源 iframe 里会直接抛 SecurityError，而 typeof 检查仍然通过。
  // 只做 typeof 判断会在那种环境下留下一个"看起来可用、一用就崩"的假象。
  let idbProbeError = null;
  try {
    idbOk = typeof window.indexedDB !== 'undefined' && window.indexedDB !== null;
    if (idbOk) {
      // 同步触发一次 open，任何同步异常（SecurityError 等）立刻捕获
      const req = window.indexedDB.open('cpl-probe', 1);
      req.onerror = () => {
        idbProbeError = req.error && req.error.message ? req.error.message : 'unknown';
        idbOk = false;
        CPL.log('warn', 'IndexedDB 不可用：' + idbProbeError);
      };
      req.onsuccess = () => {
        try {
          req.result.close();
          if (typeof window.indexedDB.deleteDatabase === 'function') window.indexedDB.deleteDatabase('cpl-probe');
        } catch {
          /* 忽略 */
        }
      };
      req.onupgradeneeded = () => {
        /* 空库，不需要建表 */
      };
    }
  } catch (err) {
    idbOk = false;
    idbProbeError = err && err.message ? err.message : 'blocked';
    CPL.log('warn', 'IndexedDB 被阻止：' + idbProbeError);
  }

  const store = (CPL.store = {});
  store.localStorageAvailable = () => lsOk;
  store.indexedDBAvailable = () => idbOk;
  store.idbError = () => idbProbeError;

  /**
   * 存储后端的一句话描述，供设置页展示（不要谎称"数据已保存"）。
   */
  store.backendLabel = () => {
    if (idbOk) return 'IndexedDB（容量大，适合自定义课程）';
    if (lsOk) return 'localStorage（IndexedDB 不可用，容量约 5 MB）';
    return '仅内存（刷新即丢失）';
  };

  // ─────────────────────────────────────────────────────────────
  // 轻量键值层（所有键自动加前缀）
  // ─────────────────────────────────────────────────────────────
  function lsGet(key, fallback = null) {
    const full = NS + key;
    try {
      if (!lsOk) return memory.has(full) ? memory.get(full) : fallback;
      const raw = window.localStorage.getItem(full);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      CPL.log('warn', `读取 ${key} 失败，使用默认值`, err);
      return fallback;
    }
  }

  function lsSet(key, value) {
    const full = NS + key;
    const raw = JSON.stringify(value);
    memory.set(full, value);
    if (!lsOk) return false;
    try {
      window.localStorage.setItem(full, raw);
      return true;
    } catch (err) {
      // 配额超限：给出可操作的提示，而不是静默失败
      CPL.log('error', `写入 ${key} 失败`, err);
      dom.toast('本地存储已满，进度未能保存。可在「设置」里导出后清理数据。', { kind: 'error' });
      return false;
    }
  }

  function lsRemove(key) {
    const full = NS + key;
    memory.delete(full);
    if (!lsOk) return;
    try {
      window.localStorage.removeItem(full);
    } catch (err) {
      CPL.log('warn', `删除 ${key} 失败`, err);
    }
  }

  function lsKeys() {
    if (!lsOk) return Array.from(memory.keys()).map((k) => k.slice(NS.length));
    const out = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(NS)) out.push(k.slice(NS.length));
    }
    return out;
  }

  store.get = lsGet;
  store.set = lsSet;
  store.remove = lsRemove;
  store.keys = lsKeys;

  /** 命名空间作用域，避免键名冲突：const s = CPL.store.scope('anki') */
  store.scope = (prefix) => ({
    get: (key, fallback) => lsGet(`${prefix}.${key}`, fallback),
    set: (key, value) => lsSet(`${prefix}.${key}`, value),
    remove: (key) => lsRemove(`${prefix}.${key}`),
    keys: () => lsKeys().filter((k) => k.startsWith(`${prefix}.`)),
  });

  /** 清空本站全部数据（设置页用）。返回删掉的键数。 */
  store.clearAll = () => {
    const keys = lsKeys();
    for (const k of keys) lsRemove(k);
    memory.clear();
    return keys.length;
  };

  /** 导出所有本地数据（备份用）。不包含任何凭据——前端本来也没有凭据。 */
  store.exportAll = () => {
    const data = {};
    for (const k of lsKeys()) data[k] = lsGet(k, null);
    return { schema: CPL.SCHEMA, exportedAt: new Date().toISOString(), app: 'cphys-cs-lab', data };
  };

  /** 导入备份。默认合并（覆盖同名键），标记冲突数量供 UI 展示。 */
  store.importAll = (payload) => {
    if (!payload || typeof payload !== 'object' || typeof payload.data !== 'object') {
      throw new Error('备份文件格式不正确：缺少 data 字段');
    }
    const keys = Object.keys(payload.data);
    let written = 0;
    for (const k of keys) {
      if (k.startsWith('__')) continue; // 保留键不导入
      lsSet(k, payload.data[k]);
      written++;
    }
    return { written, total: keys.length };
  };

  // ─────────────────────────────────────────────────────────────
  // IndexedDB：用户内容 / 卡片库 / 草稿
  // ─────────────────────────────────────────────────────────────
  const DB_NAME = 'cpl-db';
  const DB_VERSION = 1;
  const STORES = { userLessons: 'userLessons', anki: 'anki', drafts: 'drafts', kv: 'kv' };

  let dbPromise = null;

  function openDb() {
    if (!idbOk) return Promise.reject(new Error('IndexedDB 不可用'));
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORES.userLessons)) {
          const s = db.createObjectStore(STORES.userLessons, { keyPath: 'id' });
          s.createIndex('order', 'order', { unique: false });
          s.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.anki)) {
          db.createObjectStore(STORES.anki, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.drafts)) {
          db.createObjectStore(STORES.drafts, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.kv)) {
          db.createObjectStore(STORES.kv, { keyPath: 'k' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('IndexedDB 打开失败'));
      req.onblocked = () => CPL.log('warn', 'IndexedDB 被其它标签页阻塞');
    });
    return dbPromise;
  }

  function tx(storeName, mode, fn) {
    return openDb().then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(storeName, mode);
          const objectStore = transaction.objectStore(storeName);
          let result;
          try {
            result = fn(objectStore);
          } catch (err) {
            reject(err);
            return;
          }
          transaction.oncomplete = () => resolve(result && result.__req ? result.__req.result : result);
          transaction.onerror = () => reject(transaction.error || new Error('IndexedDB 事务失败'));
          transaction.onabort = () => reject(transaction.error || new Error('IndexedDB 事务被中止'));
        })
    );
  }

  const req = (r) => ({ __req: r });

  store.idb = {
    available: () => idbOk,
    STORES,

    async put(storeName, value) {
      return tx(storeName, 'readwrite', (s) => req(s.put(value)));
    },
    async get(storeName, key) {
      return tx(storeName, 'readonly', (s) => req(s.get(key)));
    },
    async del(storeName, key) {
      return tx(storeName, 'readwrite', (s) => req(s.delete(key)));
    },
    async all(storeName) {
      const out = await tx(storeName, 'readonly', (s) => req(s.getAll()));
      return out || [];
    },
    async count(storeName) {
      const n = await tx(storeName, 'readonly', (s) => req(s.count()));
      return n || 0;
    },
    async clear(storeName) {
      return tx(storeName, 'readwrite', (s) => req(s.clear()));
    },
    async bulkPut(storeName, values) {
      if (!values || !values.length) return 0;
      await openDb();
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        for (const v of values) objectStore.put(v);
        transaction.oncomplete = () => resolve(values.length);
        transaction.onerror = () => reject(transaction.error || new Error('批量写入失败'));
      });
    },
    /** 估算用量，用于设置页展示。 */
    async estimate() {
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const e = await navigator.storage.estimate();
          return { usage: e.usage || 0, quota: e.quota || 0 };
        } catch {
          return null;
        }
      }
      return null;
    },
  };

  // ─────────────────────────────────────────────────────────────
  // 进度追踪
  // ─────────────────────────────────────────────────────────────
  const progressScope = store.scope('progress');
  const STATES = ['todo', 'doing', 'done'];

  const progress = (CPL.progress = {
    STATES,

    /** @returns {{state:string, checklist:Object, updatedAt:number, notes:string}} */
    get(lessonId) {
      const rec = progressScope.get(lessonId, null);
      return Object.assign(
        { state: 'todo', checklist: {}, updatedAt: 0, notes: '', runs: 0, testsPassed: 0 },
        rec || {}
      );
    },

    set(lessonId, patch) {
      const next = Object.assign(progress.get(lessonId), patch, { updatedAt: Date.now() });
      // 自动推进状态：勾完清单即视为完成
      const items = Object.keys(next.checklist || {});
      if (items.length && items.every((k) => next.checklist[k]) && next.state === 'todo') {
        next.state = 'doing';
      }
      progressScope.set(lessonId, next);
      CPL.bus.emit('progress:changed', { lessonId, record: next });
      return next;
    },

    toggleChecklist(lessonId, index) {
      const rec = progress.get(lessonId);
      const key = String(index);
      rec.checklist[key] = !rec.checklist[key];
      return progress.set(lessonId, { checklist: rec.checklist });
    },

    setState(lessonId, state) {
      if (!STATES.includes(state)) throw new Error(`非法状态: ${state}`);
      return progress.set(lessonId, { state });
    },

    /** 记录一次"跑通测试"，用于课程卡片上的通过标记。 */
    recordRun(lessonId, { passed = 0, total = 0, ms = 0 } = {}) {
      const rec = progress.get(lessonId);
      return progress.set(lessonId, {
        runs: (rec.runs || 0) + 1,
        testsPassed: Math.max(rec.testsPassed || 0, passed),
        lastRun: { passed, total, ms, at: Date.now() },
      });
    },

    all() {
      const out = {};
      for (const key of progressScope.keys()) {
        out[key.slice('progress.'.length)] = progressScope.get(key.slice('progress.'.length));
      }
      return out;
    },

    reset() {
      for (const key of progressScope.keys()) progressScope.remove(key.slice('progress.'.length));
      CPL.bus.emit('progress:changed', { lessonId: null, record: null });
    },

    /** 依据目录计算总进度。 */
    summary(lessons) {
      const total = lessons.length;
      let done = 0;
      let doing = 0;
      for (const l of lessons) {
        const s = progress.get(l.id).state;
        if (s === 'done') done++;
        else if (s === 'doing') doing++;
      }
      const percent = total ? Math.round((done / total) * 100) : 0;
      return { total, done, doing, todo: total - done - doing, percent };
    },
  });

  // ─────────────────────────────────────────────────────────────
  // 偏好设置
  // ─────────────────────────────────────────────────────────────
  const PREF_DEFAULTS = {
    theme: 'auto', // auto | light | dark
    density: 'comfortable', // comfortable | compact
    fontScale: 1,
    reducedMotion: false,
    autoRunTests: false,
    ankiPerWeek: 5,
    lastLesson: '',
    sidebarCollapsed: false,
    enableCdn: true,
  };

  const prefScope = store.scope('pref');
  CPL.prefs = {
    defaults: PREF_DEFAULTS,
    all() {
      return Object.assign({}, PREF_DEFAULTS, prefScope.get('values', {}));
    },
    get(key) {
      const values = prefScope.get('values', {});
      return values[key] === undefined ? PREF_DEFAULTS[key] : values[key];
    },
    set(key, value) {
      const values = prefScope.get('values', {});
      values[key] = value;
      prefScope.set('values', values);
      CPL.bus.emit('prefs:changed', { key, value, values });
      return values;
    },
    reset() {
      prefScope.remove('values');
      CPL.bus.emit('prefs:changed', { key: '*', value: null, values: PREF_DEFAULTS });
    },
  };

  // ─────────────────────────────────────────────────────────────
  // 草稿（编辑器里未提交的代码）
  // ─────────────────────────────────────────────────────────────
  const draftScope = store.scope('draft');
  CPL.drafts = {
    key: (lessonId, exerciseId = 'main') => `${lessonId}::${exerciseId}`,
    save(lessonId, exerciseId, code) {
      const k = CPL.drafts.key(lessonId, exerciseId);
      if (code && code.length > 200 * 1024) {
        CPL.log('warn', '草稿过大，未保存');
        return false;
      }
      draftScope.set(k, { code, at: Date.now() });
      return true;
    },
    load(lessonId, exerciseId) {
      const rec = draftScope.get(CPL.drafts.key(lessonId, exerciseId), null);
      return rec && typeof rec.code === 'string' ? rec : null;
    },
    clear(lessonId, exerciseId) {
      draftScope.remove(CPL.drafts.key(lessonId, exerciseId));
    },
    all() {
      const out = {};
      for (const k of draftScope.keys()) out[k.slice('draft.'.length)] = draftScope.get(k.slice('draft.'.length));
      return out;
    },
  };

  util.hash; // 保持引用
})();

/* ===== pieces/15-catalog.js ===== */
/* ============================================================================
 * 15-catalog.js — 课程目录：清单加载、课程注册表、按需加载课程脚本
 *
 * 加载策略（对应规划 D1）：
 *   1. 先尝试 fetch('manifest.json') 与 fetch('content/syllabus.json')；
 *   2. 失败时（例如 file:// 直接打开、或离线发行版）退化到构建期内嵌的目录快照
 *      （pieces/08-manifest.generated.js，由 scripts/build.mjs 自动生成，禁止手改）。
 *   3. 课程脚本用 <script src> 注入加载 —— 课程文件是"自注册"的经典脚本，
 *      不使用 ESM，因此 file:// 下也能工作。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const catalog = (CPL.catalog = {});

  // 构建期内嵌快照（若存在）
  const SNAPSHOT = window.CPL_MANIFEST_SNAPSHOT || null;
  const SYLLABUS_SNAPSHOT = window.CPL_SYLLABUS_SNAPSHOT || null;

  catalog.state = {
    ready: false,
    source: 'unknown', // 'fetch' | 'snapshot'
    lessons: [],
    syllabus: null,
    problems: [],
  };

  async function fetchJson(url, timeoutMs = 8000) {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      const res = await fetch(url, { signal: controller ? controller.signal : undefined, cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 课程注册表
  // ─────────────────────────────────────────────────────────────
  const registry = new Map(); // id -> lesson 对象
  const metaIndex = new Map(); // id -> manifest 条目

  /**
   * 课程文件在自己末尾调用它完成注册。
   * @param {object} lesson 见 content/labs/_template.js 的字段说明
   */
  CPL.registerLesson = function registerLesson(lesson) {
    if (!lesson || typeof lesson !== 'object') {
      CPL.log('error', 'registerLesson: 参数不是对象');
      return;
    }
    if (!lesson.id) {
      CPL.log('error', 'registerLesson: 缺少 id');
      return;
    }
    const existing = registry.get(lesson.id);
    registry.set(lesson.id, lesson);
    if (existing && existing !== lesson) {
      CPL.log('warn', `课程 ${lesson.id} 被重复注册，后注册的覆盖前者`);
    }
    CPL.bus.emit('lesson:registered', lesson);
  };

  /** 运行时追加课程（用户自定义内容用，不经过脚本加载）。 */
  catalog.registerRuntimeLesson = function registerRuntimeLesson(lesson) {
    CPL.registerLesson(lesson);
    // 让自定义课程也出现在课表里
    if (!catalog.state.lessons.some((l) => l.id === lesson.id)) {
      catalog.state.lessons.push({
        id: lesson.id,
        module: lesson.module ?? 7,
        week: lesson.week ?? 99,
        title: lesson.title || lesson.id,
        subtitle: lesson.subtitle || '',
        tags: lesson.tags || [],
        folder: 'user',
        file: '',
        custom: true,
        fingerprint: CPL.util.hash(JSON.stringify(lesson.sections || lesson.title || lesson.id)),
        bytes: 0,
      });
      catalog.state.lessons.sort((a, b) => a.week - b.week || a.id.localeCompare(b.id));
      CPL.bus.emit('catalog:changed', catalog.state);
    }
    return lesson;
  };

  catalog.unregister = function unregister(id) {
    registry.delete(id);
    const i = catalog.state.lessons.findIndex((l) => l.id === id);
    if (i >= 0 && catalog.state.lessons[i].custom) {
      catalog.state.lessons.splice(i, 1);
      CPL.bus.emit('catalog:changed', catalog.state);
    }
  };

  catalog.get = (id) => registry.get(id) || null;
  catalog.isLoaded = (id) => registry.has(id);
  catalog.loadedIds = () => Array.from(registry.keys());

  catalog.meta = (id) => metaIndex.get(id) || null;

  /** 课表（含未加载的课程，用于导航）。 */
  catalog.lessons = () => catalog.state.lessons.slice();

  /** 周次 → 课程 */
  catalog.byWeek = (week) => catalog.state.lessons.filter((l) => l.week === week);

  /** 模块 → 课程 */
  catalog.byModule = (moduleId) => catalog.state.lessons.filter((l) => l.module === moduleId);

  /** 标签搜索 */
  catalog.search = (query, limit = 30) => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    return catalog.state.lessons
      .map((l) => {
        const hay = `${l.title} ${l.subtitle} ${l.id} ${(l.tags || []).join(' ')} week${l.week} 第${l.week}周`.toLowerCase();
        let score = 0;
        for (const t of terms) {
          if (!hay.includes(t)) return null;
          if (l.title.toLowerCase().includes(t)) score += 3;
          if ((l.tags || []).some((tag) => String(tag).toLowerCase().includes(t))) score += 2;
          score += 1;
        }
        return { lesson: l, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.lesson);
  };

  // ─────────────────────────────────────────────────────────────
  // 课程脚本按需加载
  // ─────────────────────────────────────────────────────────────
  const inflight = new Map();

  /**
   * 加载某一课的脚本并返回课程对象。
   * 同一个 id 并发调用只会注入一次 <script>。
   */
  catalog.load = function load(id) {
    if (registry.has(id)) return Promise.resolve(registry.get(id));

    const meta = metaIndex.get(id);
    if (!meta) {
      // 自定义课程没有脚本文件，只能从内容数据集里取
      return Promise.reject(new Error(`未知课程：${id}（目录里没有这一课）`));
    }
    if (!meta.file) {
      return Promise.reject(new Error(`课程 ${id} 没有对应的内容文件`));
    }
    if (inflight.has(id)) return inflight.get(id);

    const url = `${meta.file}?v=${meta.fingerprint || CPL.VERSION}`;

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = false; // 保持与插入顺序一致，避免同一课内多文件乱序
      script.charset = 'utf-8';
      script.dataset.cplLesson = id;

      // 加载超时：<script> 在某些网络环境下会"既不 onload 也不 onerror"
      // （请求被中间层挂起、代理静默丢弃等）。没有超时的话这个 Promise
      // 永远不 settle，调用方的 await 就永久挂住——而 nav.render 里
      // "正在渲染"的标志一旦不释放，用户点任何链接都会毫无反应。
      // 这是真实遇到过的现象：点「设置」没反应。
      const timer = setTimeout(() => {
        cleanup();
        reject(
          new Error(
            `加载课程文件 ${meta.file} 超时（20 秒）。可能网络或中间层挂住了这个请求，请刷新页面重试。`
          )
        );
      }, 20000);

      const cleanup = () => {
        clearTimeout(timer);
        script.onload = null;
        script.onerror = null;
      };

      script.onload = () => {
        cleanup();
        const lesson = registry.get(id);
        if (!lesson) {
          reject(new Error(`课程脚本 ${meta.file} 已加载，但没有调用 CPL.registerLesson("${id}")`));
          return;
        }
        resolve(lesson);
      };

      script.onerror = () => {
        cleanup();
        reject(
          new Error(
            `无法加载课程文件 ${meta.file}。若你是用 file:// 直接打开页面，请改用本地服务器（npm run serve）。`
          )
        );
      };

      document.head.append(script);
    }).finally(() => {
      inflight.delete(id);
    });

    inflight.set(id, promise);
    return promise;
  };

  /** 预取：空闲时把相邻课程悄悄加载好，翻页更快。 */
  catalog.prefetch = function prefetch(ids) {
    const run = () => {
      for (const id of ids) {
        if (registry.has(id) || inflight.has(id)) continue;
        catalog.load(id).catch(() => {});
      }
    };
    if (typeof requestIdleCallback === 'function') requestIdleCallback(run, { timeout: 3000 });
    else setTimeout(run, 1200);
  };

  // ─────────────────────────────────────────────────────────────
  // 目录初始化
  // ─────────────────────────────────────────────────────────────
  function indexFromManifest(manifest, source) {
    catalog.state.lessons = (manifest.lessons || []).slice();
    metaIndex.clear();
    for (const l of catalog.state.lessons) metaIndex.set(l.id, l);
    catalog.state.source = source;
  }

  catalog.normalizeLesson = function normalizeLesson(lesson) {
    const out = Object.assign({}, lesson);
    out.objectives = out.objectives || [];
    out.concepts = out.concepts || [];
    out.tools = out.tools || [];
    out.tests = out.tests || [];
    out.aiPrompts = out.aiPrompts || [];
    out.anki = out.anki || [];
    out.reading = out.reading || [];
    out.checklist = out.checklist || [];
    out.sections = out.sections || [];
    out.exercise = out.exercise || null;
    out.demo = out.demo || null;
    return out;
  };

  /** 校验课程是否满足"8 段式"契约；返回缺失项列表（空数组即合格）。 */
  catalog.validateLesson = function validateLesson(lesson) {
    const missing = [];
    if (!lesson) return ['lesson 对象为空'];
    if (!lesson.id) missing.push('id');
    if (!lesson.title) missing.push('title');
    if (!(lesson.objectives && lesson.objectives.length)) missing.push('objectives');
    if (!(lesson.concepts && lesson.concepts.length) && !(lesson.sections && lesson.sections.length)) {
      missing.push('concepts 或 sections');
    }
    if (!lesson.demo && !lesson.sections) missing.push('demo');
    if (!lesson.exercise && !lesson.sections) missing.push('exercise');
    if (!(lesson.tests && lesson.tests.length)) missing.push('tests');
    if (!(lesson.aiPrompts && lesson.aiPrompts.length)) missing.push('aiPrompts');
    if (!(lesson.anki && lesson.anki.length)) missing.push('anki');
    if (!(lesson.reading && lesson.reading.length)) missing.push('reading');
    return missing;
  };

  catalog.init = async function init() {
    let manifest = null;
    let syllabus = null;
    let source = 'snapshot';

    // 1) 网络优先（Pages 环境下总是走这条）
    try {
      manifest = await fetchJson('manifest.json');
      source = 'fetch';
    } catch (err) {
      CPL.log('warn', 'manifest.json 获取失败，使用内嵌快照', dom.friendlyError(err));
      manifest = SNAPSHOT;
    }
    try {
      syllabus = await fetchJson('content/syllabus.json');
    } catch {
      syllabus = SYLLABUS_SNAPSHOT;
    }

    if (!manifest || !Array.isArray(manifest.lessons)) {
      catalog.state.problems.push('既无法获取 manifest.json，也没有可用的内嵌快照');
      catalog.state.ready = true;
      CPL.bus.emit('catalog:ready', catalog.state);
      return catalog.state;
    }

    indexFromManifest(manifest, source);
    catalog.state.syllabus = syllabus || null;
    catalog.state.ready = true;

    if (!syllabus) {
      catalog.state.problems.push('content/syllabus.json 不可用，课程将按周次平铺显示');
    }
    CPL.log('info', `目录就绪：${catalog.state.lessons.length} 课（来源：${source}）`);
    CPL.bus.emit('catalog:ready', catalog.state);
    return catalog.state;
  };

  /** 模块元数据（来自 syllabus.json，缺失时按模块号兜底生成）。 */
  catalog.modules = function modules() {
    const syl = catalog.state.syllabus;
    if (syl && Array.isArray(syl.modules) && syl.modules.length) return syl.modules;

    const ids = Array.from(new Set(catalog.state.lessons.map((l) => l.module))).sort((a, b) => a - b);
    return ids.map((id) => ({
      id,
      title: `模块 ${id}`,
      weeks: (() => {
        const ws = catalog.state.lessons.filter((l) => l.module === id).map((l) => l.week);
        return ws.length ? [Math.min(...ws), Math.max(...ws)] : [0, 0];
      })(),
      summary: '',
    }));
  };
})();

/* ===== pieces/20-markdown.js ===== */
/* ============================================================================
 * 20-markdown.js — 自成体系的 Markdown 渲染器（含 LaTeX 与代码块）
 *
 * 为什么不用 marked / markdown-it：
 *   1. 零依赖是本项目的硬约束（参考项目也是零依赖）；
 *   2. 我们需要对"用户自定义内容"和"AI 生成内容"渲染 Markdown，
 *      而任何第三方库的默认 HTML 直通都是 XSS 面;这里从设计上就不产生未转义输出。
 *
 * 安全约定（关键）：
 *   · 原始 HTML 一律转义，永不透传（不提供 rawHtml 选项）。
 *   · 链接/图片 URL 过 CPL.dom.safeUrl，拦掉 javascript:/data:。
 *   · 代码块内容只做转义，不做任何解释。
 *   · 数学公式走 CPL.math（MathML 或 KaTeX，且 KaTeX 关闭 trust）。
 *
 * 语法支持：
 *   标题 #..###### / 粗斜体 / 行内代码 / 围栏代码块 / 引用（含 [!NOTE] callout）
 *   / 有序无序列表（支持嵌套与任务列表）/ 表格 / 水平线 / 链接与图片 / 自动链接
 *   / 行内与块级 $$ 数学 / 脚注式行内注 / ==高亮== / ~~删除线~~
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  // 注意：这里**不能**在模块加载时就把 CPL.math / CPL.highlight 缓存成常量。
  // 分片的加载顺序由文件名排序决定，20-markdown.js 排在 25-math.js 之前，
  // 早期缓存会拿到 undefined。统一用惰性读取。
  const mathOf = () => CPL.math;
  const highlightOf = () => CPL.highlight;

  const md = (CPL.md = {});

  const esc = dom.esc;
  const escAttr = dom.escAttr;

  // ─────────────────────────────────────────────────────────────
  // 行内解析
  // ─────────────────────────────────────────────────────────────
  const INLINE_PATTERNS = [
    // 行内数学：$...$ （要求 $ 后不是空格，避免误判货币）
    { re: /^\$([^$\n]+?)\$/ },
    // 行内代码：`...`
    { re: /^`([^`]+)`/ },
    // 图片
    { re: /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/ },
    // 链接
    { re: /^\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/ },
    // 自动链接
    { re: /^<((?:https?|mailto):[^>\s]+)>/ },
    // 粗斜体
    { re: /^\*\*\*([^*\n]+)\*\*\*/ },
    // 粗体
    { re: /^\*\*([^*\n]+)\*\*/ },
    { re: /^__([^_\n]+)__/ },
    // 高亮
    { re: /^==([^=\n]+)==/ },
    // 删除线
    { re: /^~~([^~\n]+)~~/ },
    // 斜体
    { re: /^\*([^*\n]+)\*/ },
    { re: /^_([^_\n]+)_/ },
  ];

  /**
   * 行内渲染。
   * @param {string} text
   * @returns {string} HTML 片段（已转义）
   */
  function inline(text) {
    let out = '';
    let rest = String(text === undefined || text === null ? '' : text);

    while (rest.length) {
      let matched = false;

      // 反斜杠转义：\$ \* \_ \` \[ \] \\ 等一律按字面量输出
      const escapeHit = /^\\([\\`*_{}\[\]()#+\-.!$~=|>])/.exec(rest);
      if (escapeHit) {
        out += esc(escapeHit[1]);
        rest = rest.slice(escapeHit[0].length);
        continue;
      }

      for (const { re } of INLINE_PATTERNS) {
        const m = re.exec(rest);
        if (!m) continue;

        if (re === INLINE_PATTERNS[0].re) {
          out += mathOf().render(m[1], { display: false });
        } else if (re === INLINE_PATTERNS[1].re) {
          out += `<code class="cpl-code-inline">${esc(m[1])}</code>`;
        } else if (re === INLINE_PATTERNS[2].re) {
          const url = dom.safeUrl(m[2]);
          if (!url) {
            out += esc(m[0]);
          } else {
            out += `<img src="${escAttr(url)}" alt="${escAttr(m[1])}"${
              m[3] ? ` title="${escAttr(m[3])}"` : ''
            } loading="lazy" decoding="async" class="cpl-md-img" />`;
          }
        } else if (re === INLINE_PATTERNS[3].re) {
          const url = dom.safeUrl(m[2]);
          if (!url) {
            out += esc(m[0]);
          } else {
            const external = /^https?:/i.test(url);
            out += `<a href="${escAttr(url)}"${external ? ' target="_blank" rel="noopener noreferrer external"' : ''}${
              m[3] ? ` title="${escAttr(m[3])}"` : ''
            }>${inline(m[1])}</a>`;
          }
        } else if (re === INLINE_PATTERNS[4].re) {
          const url = dom.safeUrl(m[1]);
          out += url
            ? `<a href="${escAttr(url)}" target="_blank" rel="noopener noreferrer external">${esc(m[1])}</a>`
            : esc(m[0]);
        } else if (re === INLINE_PATTERNS[5].re) {
          out += `<strong><em>${inline(m[1])}</em></strong>`;
        } else if (re === INLINE_PATTERNS[6].re || re === INLINE_PATTERNS[7].re) {
          out += `<strong>${inline(m[1])}</strong>`;
        } else if (re === INLINE_PATTERNS[8].re) {
          out += `<mark>${inline(m[1])}</mark>`;
        } else if (re === INLINE_PATTERNS[9].re) {
          out += `<del>${inline(m[1])}</del>`;
        } else {
          out += `<em>${inline(m[1])}</em>`;
        }

        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }

      if (!matched) {
        // 没有匹配到任何模式：吃掉一个字符（转义后再输出）
        // 为了减少 HTML 体积，把连续的普通字符一起吃掉
        let i = 0;
        while (i < rest.length && !/[$`!\[<*_=~\\]/.test(rest[i])) i++;
        if (i === 0) i = 1;
        out += esc(rest.slice(0, i));
        rest = rest.slice(i);
      }
    }
    return out;
  }

  md.inline = inline;

  // ─────────────────────────────────────────────────────────────
  // 块级解析
  // ─────────────────────────────────────────────────────────────
  const CALLOUT_KINDS = {
    NOTE: { cls: 'note', label: '注意', icon: 'ℹ' },
    TIP: { cls: 'tip', label: '提示', icon: '✦' },
    IMPORTANT: { cls: 'important', label: '要点', icon: '★' },
    WARNING: { cls: 'warn', label: '警告', icon: '⚠' },
    CAUTION: { cls: 'caution', label: '易错', icon: '⛔' },
    PHYSICS: { cls: 'physics', label: '物理直觉', icon: '⚛' },
    NUMERIC: { cls: 'numeric', label: '数值陷阱', icon: '±' },
    DEBUG: { cls: 'debug', label: '调试线索', icon: '🐞' },
    EXAM: { cls: 'exam', label: '自测', icon: '✓' },
  };

  function renderTable(rows) {
    // rows[0] 是表头，rows[1] 是分隔行（已被调用方过滤）
    const head = rows[0];
    const body = rows.slice(1);
    const cells = (line, tag) =>
      line
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((c) => `<${tag}>${inline(c.trim())}</${tag}>`)
        .join('');
    return (
      '<div class="cpl-table-wrap"><table class="cpl-table">' +
      `<thead><tr>${cells(head, 'th')}</tr></thead>` +
      `<tbody>${body.map((r) => `<tr>${cells(r, 'td')}</tr>`).join('')}</tbody>` +
      '</table></div>'
    );
  }

  function renderList(items, ordered, start = 1) {
    const tag = ordered ? 'ol' : 'ul';
    const attr = ordered && start !== 1 ? ` start="${start}"` : '';
    const html = items
      .map((it) => {
        const task = /^\[([ xX])\]\s+/.exec(it.text);
        if (task) {
          const checked = task[1].toLowerCase() === 'x';
          const rest = it.text.slice(task[0].length);
          return (
            `<li class="cpl-task${checked ? ' is-done' : ''}">` +
            `<input type="checkbox" disabled${checked ? ' checked' : ''} aria-hidden="true" />` +
            `<span>${inline(rest)}${
              it.children ? renderBlocks(it.children) : ''
            }</span></li>`
          );
        }
        return `<li>${inline(it.text)}${it.children ? renderBlocks(it.children) : ''}</li>`;
      })
      .join('');
    return `<${tag}${attr} class="cpl-list">${html}</${tag}>`;
  }

  /**
   * 把 Markdown 源码渲染为 HTML 字符串。
   * @param {string} source
   * @param {{headingAnchors?: boolean}} opts
   */
  function renderBlocks(source, opts = {}) {
    const lines = String(source === undefined || source === null ? '' : source).replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let i = 0;
    let headingSeq = 0;

    const isBlank = (s) => /^\s*$/.test(s);

    while (i < lines.length) {
      const line = lines[i];

      // 空行
      if (isBlank(line)) {
        i++;
        continue;
      }

      // 围栏代码块 ``` 或 ~~~
      const fence = /^\s*(`{3,}|~{3,})\s*([\w+#.-]*)\s*(.*)$/.exec(line);
      if (fence) {
        const marker = fence[1][0];
        const lang = (fence[2] || '').toLowerCase();
        const meta = fence[3] || '';
        const body = [];
        i++;
        const endRe = new RegExp(`^\\s*${marker}{3,}\\s*$`);
        let closed = false;
        while (i < lines.length) {
          if (endRe.test(lines[i])) {
            closed = true;
            i++; // 吃掉结束围栏
            break;
          }
          body.push(lines[i]);
          i++;
        }
        // 未闭合的围栏：把剩余内容当代码处理，而不是丢掉，也绝不越界
        if (!closed) CPL.log('warn', '代码块围栏未闭合，已按"到文件末尾"处理');
        const code = body.join('\n');
        const label = (lang || 'text').replace(/[^\w+#.-]/g, '') || 'text';
        const metaAttrs = /\S/.test(meta) ? ` data-meta="${escAttr(meta.trim().slice(0, 120))}"` : '';
        // 语法高亮分片（55-highlight.js）可能比本分片后加载，因此运行时探测。
        const highlighted = highlightOf() ? highlightOf().render(code, label) : esc(code);
        out.push(
          '<div class="cpl-codeblock" data-lang="' +
            escAttr(label) +
            '"' +
            metaAttrs +
            '>' +
            `<div class="cpl-codeblock__bar"><span class="cpl-codeblock__lang">${esc(label)}</span>` +
            '<button type="button" class="cpl-codeblock__copy" data-copy-code>复制</button></div>' +
            `<pre class="cpl-pre"><code class="language-${escAttr(label)}">${highlighted}</code></pre>` +
            '</div>'
        );
        continue;
      }

      // 块级数学 $$ ... $$（可有单行 $$x$$ 形式）
      if (/^\s*\$\$/.test(line)) {
        const single = /^\s*\$\$(.+?)\$\$\s*$/.exec(line);
        if (single) {
          out.push(`<div class="cpl-math-block">${mathOf().render(single[1], { display: true })}</div>`);
          i++;
          continue;
        }
        const body = [];
        i++;
        while (i < lines.length && !/^\s*\$\$\s*$/.test(lines[i])) {
          body.push(lines[i]);
          i++;
        }
        i++;
        out.push(`<div class="cpl-math-block">${mathOf().render(body.join('\n'), { display: true })}</div>`);
        continue;
      }

      // 标题
      const heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
      if (heading) {
        const level = Math.min(6, heading[1].length + 1); // # → h2（h1 留给课程标题）
        const text = heading[2];
        const id = opts.headingAnchors !== false ? `sec-${++headingSeq}` : '';
        out.push(
          `<h${level}${id ? ` id="${id}"` : ''} class="cpl-md-h cpl-md-h${level}">${inline(text)}` +
            (id ? `<a class="cpl-anchor" href="#${id}" aria-label="本段锚点">#</a>` : '') +
            `</h${level}>`
        );
        i++;
        continue;
      }

      // 水平线
      if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
        out.push('<hr class="cpl-hr" />');
        i++;
        continue;
      }

      // 引用（含 callout）
      if (/^\s*>/.test(line)) {
        const body = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) {
          body.push(lines[i].replace(/^\s*>\s?/, ''));
          i++;
        }
        const first = body[0] || '';
        const callout = /^\[!(\w+)\]\s*(.*)$/.exec(first);
        if (callout) {
          const kind = CALLOUT_KINDS[callout[1].toUpperCase()] || CALLOUT_KINDS.NOTE;
          const title = callout[2].trim() || kind.label;
          body.shift();
          out.push(
            `<aside class="cpl-callout cpl-callout--${kind.cls}" role="note">` +
              `<div class="cpl-callout__head"><span class="cpl-callout__icon" aria-hidden="true">${kind.icon}</span>` +
              `<span class="cpl-callout__title">${inline(title)}</span></div>` +
              `<div class="cpl-callout__body">${renderBlocks(body.join('\n'), opts)}</div>` +
              '</aside>'
          );
        } else {
          out.push(`<blockquote class="cpl-quote">${renderBlocks(body.join('\n'), opts)}</blockquote>`);
        }
        continue;
      }

      // 表格：当前行含 | 且下一行是分隔行
      if (/\|/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1]) && /-/.test(lines[i + 1])) {
        const rows = [];
        rows.push(line);
        i += 2; // 跳过表头与分隔行
        while (i < lines.length && /\|/.test(lines[i]) && !isBlank(lines[i])) {
          rows.push(lines[i]);
          i++;
        }
        out.push(renderTable(rows));
        continue;
      }

      // 列表
      const listMatch = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line);
      if (listMatch) {
        const baseIndent = listMatch[1].length;
        const ordered = /\d/.test(listMatch[2]);
        const start = ordered ? parseInt(listMatch[2], 10) : 1;
        const items = [];
        while (i < lines.length) {
          const m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
          if (!m) break;
          if (m[1].length < baseIndent) break;
          if (m[1].length > baseIndent) {
            // 属于上一项的嵌套内容
            if (items.length) {
              const nested = [];
              const nestedIndent = m[1].length;
              while (i < lines.length) {
                const mm = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
                if (!mm || mm[1].length < nestedIndent) break;
                nested.push(lines[i]);
                i++;
              }
              items[items.length - 1].children = nested.join('\n');
            }
            continue;
          }
          items.push({ text: m[3], children: '' });
          i++;
          // 续行（缩进对齐的普通行）
          while (
            i < lines.length &&
            !isBlank(lines[i]) &&
            /^\s+\S/.test(lines[i]) &&
            !/^(\s*)([-*+]|\d+[.)])\s+/.test(lines[i])
          ) {
            items[items.length - 1].text += ` ${lines[i].trim()}`;
            i++;
          }
        }
        out.push(renderList(items, ordered, start));
        continue;
      }

      // 段落：连续非空行合并
      const para = [line];
      i++;
      while (
        i < lines.length &&
        !isBlank(lines[i]) &&
        !/^\s*(#{1,6}\s|>|\$\$|`{3,}|~{3,}|([-*+]|\d+[.)])\s)/.test(lines[i]) &&
        !/^\s*([-*_])(\s*\1){2,}\s*$/.test(lines[i])
      ) {
        para.push(lines[i]);
        i++;
      }
      out.push(`<p class="cpl-md-p">${inline(para.join(' ').replace(/\s{2,}$/, ''))}</p>`);
    }

    return out.join('\n');
  }

  md.renderBlocks = renderBlocks;

  /**
   * 渲染为 DOM 节点（推荐路径：挂载时代码块复制按钮已经可用）。
   */
  md.render = function render(source, opts = {}) {
    const wrap = dom.h('div', { class: 'cpl-md' });
    wrap.innerHTML = renderBlocks(source, opts);
    return wrap;
  };

  /** 渲染到指定容器（会先清空）。 */
  md.mount = function mount(container, source, opts = {}) {
    dom.clear(container);
    container.append(md.render(source, opts));
    return container;
  };

  /** 提取纯文本摘要（导航/搜索/Anki 前端预览用）。 */
  md.plain = function plain(source, maxLen = 160) {
    const text = String(source || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/\$\$[\s\S]*?\$\$/g, ' ')
      .replace(/`([^`]*)`/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/^\s*(#{1,6}|>|[-*+]|\d+[.)])\s+/gm, '')
      .replace(/[*_~=]{1,3}/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > maxLen ? text.slice(0, maxLen - 1) + '…' : text;
  };

  /** 提取所有标题，生成目录。 */
  md.outline = function outline(source) {
    const items = [];
    let seq = 0;
    for (const line of String(source || '').split('\n')) {
      const m = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
      if (!m) continue;
      seq++;
      items.push({ level: Math.min(6, m[1].length + 1), text: md.plain(m[2], 80), id: `sec-${seq}` });
    }
    return items;
  };

  // ─────────────────────────────────────────────────────────────
  // 代码块复制按钮：全站一次事件委托即可
  // ─────────────────────────────────────────────────────────────
  CPL.bus.on('app:mounted', () => {
    if (document.body.dataset.cplCopyBound === '1') return;
    document.body.dataset.cplCopyBound = '1';
    dom.delegate(document.body, 'click', '[data-copy-code]', async (e, btn) => {
      e.preventDefault();
      const block = btn.closest('.cpl-codeblock');
      const code = block ? block.querySelector('code') : null;
      if (!code) return;
      const ok = await dom.copyToClipboard(code.textContent || '');
      btn.textContent = ok ? '已复制' : '复制失败';
      setTimeout(() => {
        btn.textContent = '复制';
      }, 1600);
    });
  });
})();

/* ===== pieces/25-math.js ===== */
/* ============================================================================
 * 25-math.js — 轻量 LaTeX 子集 → MathML 渲染器
 *
 * 为什么不用 KaTeX 作为唯一路径：
 *   本平台要能在完全离线（file:// 双击打开、内网无外网）时可用。
 *   KaTeX 需要 3 个 CDN 资源；MathML 是浏览器原生能力，零依赖。
 *   因此：默认用这里的 MathML 渲染器；若用户在设置里开启 CDN 且 KaTeX 可用，
 *   则自动切换到 KaTeX（排版更精细），两条路径的输出都经过转义。
 *
 * 支持范围（覆盖物理/CS 课程里的 95% 公式）：
 *   \frac \dfrac \sqrt \sum \prod \int \oint \lim \partial \nabla
 *   ^ _ 上下标、\left \right 定界符、希腊字母、\vec \hat \bar \dot \tilde
 *   \begin{matrix|pmatrix|bmatrix|vmatrix|cases}...\end{...}
 *   \text \mathrm \operatorname、\cdot \times \pm \approx \leq \geq \neq \to
 *
 * 不支持：\begin{align} 的完整对齐语义、TikZ、自定义宏。遇到不认识的命令时
 * 会降级为纯文本显示（不报错、不白屏）。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;

  const math = (CPL.math = {});

  // ─────────────────────────────────────────────────────────────
  // 符号表
  // ─────────────────────────────────────────────────────────────
  const GREEK = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ϵ',
    zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ',
    lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', varpi: 'ϖ', rho: 'ρ',
    varrho: 'ϱ', sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ', phi: 'φ',
    varphi: 'ϕ', chi: 'χ', psi: 'ψ', omega: 'ω',
    Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
    Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  };

  const SYMBOLS = {
    cdot: '⋅', cdots: '⋯', ldots: '…', dots: '…', vdots: '⋮', ddots: '⋱',
    times: '×', div: '÷', pm: '±', mp: '∓', ast: '∗', star: '⋆', circ: '∘',
    bullet: '∙', oplus: '⊕', ominus: '⊖', otimes: '⊗', oslash: '⊘', odot: '⊙',
    cap: '∩', cup: '∪', sqcap: '⊓', sqcup: '⊔', uplus: '⊎', setminus: '∖',
    subset: '⊂', supset: '⊃', subseteq: '⊆', supseteq: '⊇', nsubset: '⊄',
    in: '∈', notin: '∉', ni: '∋', owns: '∋',
    forall: '∀', exists: '∃', nexists: '∄', emptyset: '∅', varnothing: '∅',
    infty: '∞', partial: '∂', nabla: '∇', propto: '∝',
    sim: '∼', simeq: '≃', approx: '≈', cong: '≅', equiv: '≡', neq: '≠', ne: '≠',
    leq: '≤', le: '≤', geq: '≥', ge: '≥', ll: '≪', gg: '≫',
    // 近似比较：数值收敛分析里极常用（"误差随步长按 ≲ h² 下降"）
    lesssim: '≲', gtrsim: '≳', lessapprox: '⪅', gtrapprox: '⪆',
    prec: '≺', succ: '≻', preceq: '⪯', succeq: '⪰',
    to: '→', rightarrow: '→', leftarrow: '←', leftrightarrow: '↔',
    Rightarrow: '⇒', Leftarrow: '⇐', Leftrightarrow: '⇔',
    longrightarrow: '⟶', longleftarrow: '⟵', Longrightarrow: '⟹',
    Longleftarrow: '⟸', Longleftrightarrow: '⟺', implies: '⟹', iff: '⟺',
    mapsto: '↦', longmapsto: '⟼', uparrow: '↑', downarrow: '↓', updownarrow: '↕',
    prime: '′', angle: '∠', perp: '⊥', parallel: '∥', therefore: '∴', because: '∵',
    aleph: 'ℵ', hbar: 'ℏ', ell: 'ℓ', Re: 'ℜ', Im: 'ℑ', wp: '℘',
    langle: '⟨', rangle: '⟩', lceil: '⌈', rceil: '⌉', lfloor: '⌊', rfloor: '⌋',
    // 注意 | 与 ‖ 的区别（这条以前搞错过，渲染出来就是一个竖线的差别）：
    //   裸 |      → 单竖线，绝对值的随意写法
    //   \| 与 \Vert → 双竖线，范数
    lVert: '‖', rVert: '‖', vert: '|', Vert: '‖',
    lvert: '|', rvert: '|', lbrace: '{', rbrace: '}',
    backslash: '\\', '\\|': '‖', '|': '|',
    quad: '\u2003', qquad: '\u2003\u2003', '\\,': '\u2009', '\\;': '\u2005', '\\:': '\u2005', '\\!': '',
  };

  /**
   * \left / \right 后面跟的定界符 → [左形, 右形]，且应渲染为可伸缩（stretchy）。
   *
   * 为什么必须单独一张表：\left\| 如果走普通符号查找，
   * `\|` 会被拆成单个 `|`，结果双竖线变成单竖线（真实出现过的渲染错误）。
   */
  const DELIM_MAP = {
    '(': ['(', ')'], ')': [')', ')'],
    '[': ['[', ']'], ']': [']', ']'],
    '{': ['{', '}'], '}': ['}', '}'],
    // 注意 | 与 ‖ 的区别：
    //   裸 |   → 单竖线（\left| x \right| 是绝对值）
    //   \| 与 \Vert → 双竖线（\left\| x \right\| 是范数）
    // 这里必须分开写，否则范数会悄悄变成单竖线。
    '|': ['|', '|'], '\\|': ['‖', '‖'], '‖': ['‖', '‖'], '.': ['', ''], '/': ['/', '/'],
    '<': ['⟨', '⟩'], '>': ['⟨', '⟩'],
    lbrace: ['{', '}'], rbrace: ['}', '}'],
    langle: ['⟨', '⟩'], rangle: ['⟩', '⟩'],
    vert: ['|', '|'], Vert: ['‖', '‖'],
    lvert: ['|', '|'], rvert: ['|', '|'],
    lVert: ['‖', '‖'], rVert: ['‖', '‖'],
    lfloor: ['⌊', '⌋'], rfloor: ['⌋', '⌋'],
    lceil: ['⌈', '⌉'], rceil: ['⌉', '⌉'],
    backslash: ['\\', '\\'],
  };

  const BIG_OPS = {
    sum: '∑', prod: '∏', coprod: '∐', int: '∫', iint: '∬', iiint: '∭',
    oint: '∮', bigcup: '⋃', bigcap: '⋂', bigoplus: '⨁', bigotimes: '⨂',
    lim: 'lim', limsup: 'lim sup', liminf: 'lim inf', max: 'max', min: 'min',
    sup: 'sup', inf: 'inf', argmax: 'arg max', argmin: 'arg min', det: 'det',
    gcd: 'gcd', log: 'log', ln: 'ln', exp: 'exp', sin: 'sin', cos: 'cos',
    tan: 'tan', sinh: 'sinh', cosh: 'cosh', tanh: 'tanh', arcsin: 'arcsin',
    arccos: 'arccos', arctan: 'arctan', mod: 'mod', deg: 'deg', dim: 'dim',
    ker: 'ker', hom: 'hom', rank: 'rank', tr: 'tr', diag: 'diag', sign: 'sgn',
  };

  const ACCENTS = {
    vec: '\u20d7', hat: '^', bar: '¯', tilde: '~', dot: '˙', ddot: '¨',
    overline: '¯', underline: '_', widehat: '^', widetilde: '~',
  };

  const DELIMS = { '\\{': '{', '\\}': '}', '{': '{', '}': '}', '|': '|', '.': '' };

  /**
   * 需要"作用于下一个原子"的命令 → MathML 构造
   * 返回值是 {tag, ...} 描述，由 renderer 递归构建。
   */

  // ─────────────────────────────────────────────────────────────
  // Tokenizer：把 LaTeX 串切成 token
  // ─────────────────────────────────────────────────────────────
  function tokenize(src) {
    const tokens = [];
    let i = 0;
    const n = src.length;
    while (i < n) {
      const ch = src[i];
      if (ch === '\\') {
        if (src[i + 1] === '\\') {
          // 换行命令 \\
          tokens.push({ type: 'command', value: '\\' });
          i += 2;
          continue;
        }
        const escaped = src[i + 1];
        if (escaped && '{}$%&#_^~'.includes(escaped)) {
          // 转义字符：按字面量处理
          tokens.push({ type: 'text', value: escaped });
          i += 2;
          continue;
        }
        // 命令：\name 或 \sym
        let j = i + 1;
        let name = '';
        while (j < n && /[a-zA-Z]/.test(src[j])) name += src[j++];
        if (!name) {
          // 单字符命令，如 \, \; \! \: \| \%
          // 保留反斜杠前缀，才能在语义上把 \|（范数双竖线）
          // 与裸 |（绝对值单竖线）区分开——两者必须渲染成不同的符号。
          const sym = src[j] || '';
          j++;
          if (sym) {
            tokens.push({ type: 'command', value: '\\' + sym });
            i = j;
            continue;
          }
        }
        tokens.push({ type: 'command', value: name });
        i = j;
      } else if (ch === '{') {
        tokens.push({ type: 'lbrace' });
        i++;
      } else if (ch === '}') {
        tokens.push({ type: 'rbrace' });
        i++;
      } else if (ch === '^') {
        tokens.push({ type: 'sup' });
        i++;
      } else if (ch === '_') {
        tokens.push({ type: 'sub' });
        i++;
      } else if (ch === '&') {
        tokens.push({ type: 'align' });
        i++;
      } else if (ch === '~') {
        tokens.push({ type: 'text', value: '\u00a0' });
        i++;
      } else if (/\s/.test(ch)) {
        tokens.push({ type: 'text', value: ' ' });
        i++;
      } else {
        // 普通字符：连续的字母数字打包，避免 MathML 里每个字符一个节点
        let j = i;
        let buf = '';
        while (j < n && !/[\\{}^_&~\s]/.test(src[j])) buf += src[j++];
        tokens.push({ type: 'text', value: buf });
        i = j;
      }
    }
    return tokens;
  }

  // ─────────────────────────────────────────────────────────────
  // Parser：token → 语法树
  // node = {kind:'row', children} | {kind:'sym', text, op?} | {kind:'frac', num, den}
  //      | {kind:'sqrt', index?, body} | {kind:'sup'|'sub'|'supsub', base, arg}
  //      | {kind:'accent', accent, body} | {kind:'text', text}
  //      | {kind:'matrix', env, rows:[[node]], delim}
  //      | {kind:'styled', variant, body}
  // ─────────────────────────────────────────────────────────────
  function parse(tokens) {
    let pos = 0;

    const peek = () => tokens[pos];
    const next = () => tokens[pos++];

    /** 读 \left / \right / \big 后面紧跟的那个定界符（文本形式或命令形式）。 */
    function readDelimiter(isRight) {
      const d = peek();
      if (!d) return '';
      if (d.type === 'command') {
        const dm = DELIM_MAP[d.value];
        if (dm) {
          next();
          return isRight ? dm[1] : dm[0];
        }
        // tokenizer 现在把 \{ \} 保留为带反斜杠的命令形式
        if (d.value === '{' || d.value === '}' || d.value === '\\{' || d.value === '\\}') {
          next();
          return d.value.slice(-1);
        }
        return '';
      }
      if (d.type === 'text') {
        const raw = d.value.trim();
        if (raw && DELIM_MAP[raw]) {
          next();
          return isRight ? DELIM_MAP[raw][1] : DELIM_MAP[raw][0];
        }
        // 未收录的单字符定界符：原样使用
        if (raw && raw.length === 1 && !/[a-zA-Z0-9]/.test(raw)) {
          next();
          return raw;
        }
      }
      return '';
    }

    /**
     * \left ... \right 必须作为**整体**解析。
     *
     * 如果让它们各自变成一个原子，会出两个问题：
     *   ① \right\|_2 的下标会挂到整个表达式上，而不是右定界符上；
     *   ② 左括号与右括号之间没有共同的"可伸缩容器"，括号无法随分式长高。
     * 注意返回值**不**处理 ^ _：脚本由调用方（parseGroup / parseRow）统一挂。
     */
    function parseLeftRight() {
      next(); // 吃掉 \left
      const open = readDelimiter(false);
      const inner = parseRow(false, { stopAtRight: true });
      let close = '';
      if (peek() && peek().type === 'command' && peek().value === 'right') {
        next();
        close = readDelimiter(true);
      }
      const children = [];
      if (open) children.push({ kind: 'delim', text: open });
      for (const c of inner.children || []) children.push(c);
      if (close) children.push({ kind: 'delim', text: close });
      return { kind: 'row', children };
    }

    function parseGroup() {
      // 读取一个"原子"：{...} 组、\left...\right、单个 token、或命令
      const t = peek();
      if (!t) return { kind: 'row', children: [] };
      if (t.type === 'command' && (t.value === 'left' || t.value === 'right')) {
        return parseLeftRight();
      }
      if (t.type === 'lbrace') {
        next();
        const node = parseRow(true);
        if (peek() && peek().type === 'rbrace') next();
        return node;
      }
      return parseAtom();
    }

    function parseOptionalBracket() {
      // LaTeX 的可选参数用 [ ]，这里只在 \sqrt[3] 和 \begin{...}[..] 中用到
      if (peek() && peek().type === 'text' && peek().value.trim().startsWith('[')) {
        // 简化处理：把 [3] 当作一个文本原子返回
        const t = next();
        const m = /\[([^\]]*)\]/.exec(t.value);
        return m ? { kind: 'text', text: m[1] } : null;
      }
      return null;
    }

    function parseMatrix(env) {
      const rows = [[]];
      let cell = [];
      const delim = {
        matrix: null,
        pmatrix: ['(', ')'],
        bmatrix: ['[', ']'],
        Bmatrix: ['{', '}'],
        vmatrix: ['|', '|'],
        Vmatrix: ['‖', '‖'],
        cases: ['{', ''],
        aligned: null,
        align: null,
        array: null,
      }[env] || null;

      const pushCell = () => {
        rows[rows.length - 1].push({ kind: 'row', children: cell });
        cell = [];
      };

      while (pos < tokens.length) {
        const t = tokens[pos];
        if (t.type === 'command' && t.value === 'end') {
          pos++;
          // 跳过 {env}
          if (peek() && peek().type === 'lbrace') {
            pos++;
            while (peek() && peek().type !== 'rbrace') pos++;
            if (peek()) pos++;
          }
          break;
        }
        if (t.type === 'command' && t.value === '\\') {
          pos++;
          pushCell();
          rows.push([]);
          continue;
        }
        if (t.type === 'align') {
          pos++;
          pushCell();
          continue;
        }
        cell.push(parseAtom());
      }
      pushCell();
      return { kind: 'matrix', env, delim, rows: rows.filter((r) => r.length) };
    }

    /**
     * 解析一个原子。
     * @param {boolean} allowScripts 是否吃掉紧随的 ^ / _。
     *   脚本参数用 false 调用，避免把"脚本的脚本"错误地吞进来。
     */
    function parseAtom(allowScripts = true) {
      const node = parseAtomBase();
      return allowScripts ? attachScripts(node) : node;
    }

    /** 只解析原子本身，不处理 ^ / _。 */
    function parseAtomBase() {
      const t = next();
      if (!t) return { kind: 'row', children: [] };

      if (t.type === 'text') {
        return { kind: 'text', text: t.value };
      }

      if (t.type === 'lbrace') {
        const row = parseRow(true);
        if (peek() && peek().type === 'rbrace') next();
        return row;
      }

      if (t.type === 'sup' || t.type === 'sub') {
        // 畸形输入（^ 或 _ 出现在没有基的位置）：忽略这个脚本标记，返回空行
        return { kind: 'row', children: [] };
      }

      if (t.type === 'rbrace') {
        // 多余的 }，忽略
        return { kind: 'row', children: [] };
      }

      if (t.type === 'command') {
        const name = t.value;

        if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
          const num = parseGroup();
          const den = parseGroup();
          return { kind: 'frac', num, den, display: name === 'dfrac' };
        }

        if (name === 'sqrt') {
          const index = parseOptionalBracket();
          const body = parseGroup();
          return { kind: 'sqrt', index, body };
        }

        if (name === 'begin') {
          // \begin{env}
          let env = '';
          if (peek() && peek().type === 'lbrace') {
            pos++;
            while (peek() && peek().type !== 'rbrace') {
              const x = next();
              if (x.type === 'text') env += x.value;
              else if (x.type === 'command') env += x.value;
            }
            if (peek()) pos++;
          }
          return parseMatrix(env.trim());
        }

        if (name === 'text' || name === 'mathrm' || name === 'mbox' || name === 'textrm') {
          const g = parseGroup();
          const plain = plainText(g);
          return { kind: 'text', text: plain, upright: true };
        }

        if (name === 'mathbf' || name === 'boldsymbol' || name === 'bm') {
          return { kind: 'styled', variant: 'bold', body: parseGroup() };
        }

        if (name === 'mathit' || name === 'operatorname') {
          return { kind: 'styled', variant: 'italic', body: parseGroup() };
        }

        if (name === 'mathbb') {
          const plain = plainText(parseGroup());
          const map = { R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', E: '𝔼', P: 'ℙ' };
          return { kind: 'text', text: plain.replace(/[A-Z]/g, (c) => map[c] || c) };
        }

        // 字体命令：参数照常渲染，只改字型。
        // 这些命令以前没实现，会被降级成字面文字（页面上直接显示 "texttt"）。
        if (name === 'texttt' || name === 'textrm' || name === 'textsf' || name === 'textnormal') {
          return { kind: 'styled', variant: 'upright', body: parseGroup() };
        }
        if (name === 'mathcal' || name === 'mathscr' || name === 'mathfrak') {
          // 花体/哥特体：MathML 用 mathvariant 表达，字体缺失时浏览器会自动回退，
          // 也不会像"显示成 mathcal 字样"那样明显出错。
          return { kind: 'styled', variant: name === 'mathfrak' ? 'fraktur' : 'script', body: parseGroup() };
        }
        if (name === 'bm' || name === 'boldsymbol' || name === 'mathbf') {
          return { kind: 'styled', variant: 'bold', body: parseGroup() };
        }

        // \left...\right 由 parseRow / parseGroup 统一整体处理（见 parseLeftRight）。
        // 这里若还留一个分支，会让左括号被单独吃掉，右括号随后变成孤立原子。
        if (name === 'right') {
          const d = readDelimiter(true);
          return d ? { kind: 'delim', text: d } : { kind: 'row', children: [] };
        }

        // 上下花括号：\underbrace{...}_{说明} —— 算法复杂度与数值推导里很常见
        if (name === 'underbrace' || name === 'overbrace' || name === 'underbracket' || name === 'overbracket') {
          const body = parseGroup();
          return { kind: name.indexOf('over') === 0 ? 'overbrace' : 'underbrace', body };
        }

        if (name === '\\') {
          // 换行：在行内公式里当作空格
          return { kind: 'row', children: [] };
        }

        if (GREEK[name]) {
          return { kind: 'text', text: GREEK[name], italic: true };
        }

        if (ACCENTS[name]) {
          const body = parseGroup();
          return { kind: 'accent', accent: ACCENTS[name], body };
        }

        if (BIG_OPS[name]) {
          return { kind: 'bigop', text: BIG_OPS[name] };
        }

        if (SYMBOLS[name] !== undefined) {
          return { kind: 'text', text: SYMBOLS[name] };
        }

        // 未识别命令：原样显示命令名，保证不白屏
        return { kind: 'text', text: name };
      }

      return { kind: 'row', children: [] };
    }

    /** 把紧随其后的 ^ / _ 挂到基上。 */
    // 关键设计：脚本参数必须用 parseScriptArg() 解析（只吃一个原子，不再去吃后续的 ^ _），
    // 否则 x_i^2 会被解析成 x_(i^2) —— MathML 语义完全错误（上标作用在下标上）。
    function attachScripts(base) {
      let sup = null;
      let sub = null;
      // 允许 ^ 与 _ 以任意顺序出现，各最多一个
      for (let guard = 0; guard < 2; guard++) {
        const t = peek();
        if (!t) break;
        if (t.type === 'sup' && !sup) {
          next();
          sup = parseScriptArg();
        } else if (t.type === 'sub' && !sub) {
          next();
          sub = parseScriptArg();
        } else break;
      }
      if (!sup && !sub) return base;
      return { kind: 'scripts', base, sup, sub };
    }

    /** 只解析一个"脚本参数"原子：不吞掉后面可能跟着的 ^ 或 _。 */
    function parseScriptArg() {
      const t = peek();
      if (!t) return { kind: 'row', children: [] };
      if (t.type === 'lbrace') {
        next();
        const node = parseRow(true);
        if (peek() && peek().type === 'rbrace') next();
        return node;
      }
      // allowScripts=false：脚本参数只吃一个原子，不吃后面可能跟着的 ^ / _
      return parseAtom(false);
    }

    function isEmptyRow(node) {
      return Boolean(node && node.kind === 'row' && (!node.children || node.children.length === 0));
    }

    function parseRow(stopAtBrace, opts = {}) {
      const children = [];
      while (pos < tokens.length) {
        const t = peek();
        if (stopAtBrace && t.type === 'rbrace') break;
        // \left...\right 的收尾：由 parseLeftRight 自己消费 \right，
        // 这里只是在遇到"孤立的 \right"时停下，避免把它当成普通原子。
        if (opts.stopAtRight && t.type === 'command' && t.value === 'right') break;
        if (t.type === 'command' && t.value === 'end') break;
        if (t.type === 'command' && t.value === '\\') break;
        if (t.type === 'align') break;
        if (t.type === 'command' && t.value === 'left') {
          // 整体解析 + 挂脚标：\left( \frac{a}{b} \right)^2
          children.push(attachScripts(parseLeftRight()));
          continue;
        }
        children.push(parseAtom());
      }
      return { kind: 'row', children };
    }

    const root = parseRow(false);
    return root;
  }

  /** 提取节点里的纯文本（\text{...} 与 plain() 用）。 */
  function plainText(node) {
    if (!node) return '';
    if (node.kind === 'text') return node.text;
    if (node.kind === 'row') return (node.children || []).map(plainText).join('');
    if (node.kind === 'scripts') {
      return plainText(node.base) + (node.sub ? plainText(node.sub) : '') + (node.sup ? plainText(node.sup) : '');
    }
    if (node.kind === 'frac') return `${plainText(node.num)}/${plainText(node.den)}`;
    if (node.kind === 'sqrt') return `√(${plainText(node.body)})`;
    if (node.kind === 'accent') return plainText(node.body) + node.accent;
    if (node.kind === 'styled') return plainText(node.body);
    if (node.kind === 'bigop') return node.text;
    if (node.kind === 'matrix') return node.rows.map((r) => r.map(plainText).join(' ')).join('; ');
    return '';
  }

  // ─────────────────────────────────────────────────────────────
  // Renderer：语法树 → MathML 字符串（关键字符全部转义）
  // ─────────────────────────────────────────────────────────────
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  function mi(text, opts = {}) {
    const variant = opts.upright ? '' : ' mathvariant="italic"';
    return `<mi${variant}>${esc(text)}</mi>`;
  }
  function mn(text) {
    return `<mn>${esc(text)}</mn>`;
  }
  function mo(text, opts = {}) {
    // 注意：MathML 里 stretchy 默认为 true，但不同浏览器对"隐式伸缩"的支持不一致，
    // 所以这里显式写出来。早先的条件写反了（只在 opts.stretchy === false 时输出），
    // 结果所有定界符都被强制成不伸缩——括号不会随分式长高，这正是"公式没渲染对"的观感。
    const stretchy = opts.stretchy === false ? ' stretchy="false"' : ' stretchy="true"';
    const form = opts.form ? ` form="${opts.form}"` : '';
    return `<mo${stretchy}${form}>${esc(text)}</mo>`;
  }
  function mtext(text) {
    return `<mtext>${esc(text)}</mtext>`;
  }
  function row(inner) {
    return inner ? `<mrow>${inner}</mrow>` : '';
  }

  const DIGITS = /^[0-9.,]+$/;
  const IDENT = /^[A-Za-z]+$/;

  function renderNode(node) {
    if (!node) return '';
    switch (node.kind) {
      case 'row':
        return row((node.children || []).map(renderNode).join(''));

      case 'text': {
        const t = node.text;
        if (!t) return '';
        // 纯空白：直接输出空格字符。
        // 不能走下面的"逐字符拆成 <mo>"分支——MathML 里 <mo> 默认可伸缩，
        // 浏览器会把空格拉伸成一个大间隙，公式看起来"散架"。
        if (/^\s+$/.test(t)) return ' ';
        if (DIGITS.test(t)) return mn(t);
        if (IDENT.test(t) && t.length === 1) return mi(t, { upright: node.upright });
        // 短的连续字母（mc、dx、psi）按单字母拆分：
        // MathML 里 <mi> 是"标识符"，多字符时浏览器不做斜体偏移，排版看起来不对。
        if (IDENT.test(t) && t.length <= 4) {
          let short = '';
          for (const ch of t) short += mi(ch, { upright: node.upright });
          return row(short);
        }
        if (IDENT.test(t)) return mi(t);
        // 混合内容：逐字符拆分，字母用 mi、数字用 mn、其余用 mo
        let out = '';
        for (const ch of t) {
          // 空白直接输出：<mo> 默认可伸缩，浏览器会把空格拉成大间隙
          if (/\s/.test(ch)) { out += ' '; continue; }
          if (/[0-9.]/.test(ch)) out += mn(ch);
          else if (/[A-Za-z]/.test(ch)) out += mi(ch, { upright: node.upright });
          else out += mo(ch === '-' ? '−' : ch, { stretchy: false });
        }
        return row(out);
      }

      // \left( ... \right) 这类定界符：标记可伸缩，让浏览器按内容高度自动拉长
      case 'delim':
        if (!node.text) return '';
        return mo(node.text, { stretchy: true });

      // \underbrace{...}_{说明} / \overbrace{...}^{说明}
      case 'underbrace':
      case 'overbrace': {
        const tag = node.kind === 'underbrace' ? 'munder' : 'mover';
        return `<${tag}>${renderNode(node.body)}<mo stretchy="true">${node.kind === 'underbrace' ? '⏟' : '⏞'}</mo></${tag}>`;
      }

      case 'frac':
        return `<mfrac${node.display ? ' displaystyle="true"' : ''}>${renderNode(node.num)}${renderNode(node.den)}</mfrac>`;

      case 'sqrt':
        return node.index
          ? `<mroot>${renderNode(node.body)}${renderNode(node.index)}</mroot>`
          : `<msqrt>${renderNode(node.body)}</msqrt>`;

      case 'scripts': {
        const base = renderNode(node.base);
        // 规范化输出顺序：MathML 要求 msubsup 的子元素顺序是 基 → 下标 → 上标。
        // 若按源码里 ^ _ 的出现顺序输出（两者都合法 LaTeX），浏览器会把上标当成了下标。
        const sub = node.sub ? renderNode(node.sub) : '';
        const sup = node.sup ? renderNode(node.sup) : '';
        if (sub && sup) return `<msubsup>${base}${sub}${sup}</msubsup>`;
        if (sub) return `<msub>${base}${sub}</msub>`;
        if (sup) return `<msup>${base}${sup}</msup>`;
        return base;
      }

      case 'accent':
        return `<mover accent="true">${renderNode(node.body)}${mo(node.accent, { stretchy: false })}</mover>`;

      case 'bigop': {
        // ∑ 之类的上下限由外层 scripts 处理（MathML 会自动把 msubsup 排在算子上下方）
        const isWord = /^[a-z ]+$/.test(node.text) && node.text.length > 1;
        return isWord ? mi(node.text, { upright: true }) : mo(node.text);
      }

      case 'styled':
        return row(`<mstyle mathvariant="${node.variant}">${renderNode(node.body)}</mstyle>`);

      case 'matrix': {
        const rows = (node.rows || [])
          .map((cells) => `<mtr>${cells.map((c) => `<mtd>${renderNode(c)}</mtd>`).join('')}</mtr>`)
          .join('');
        const table = `<mtable>${rows}</mtable>`;
        if (!node.delim) return table;
        const [open, close] = node.delim;
        return row(
          (open ? mo(open, { stretchy: true }) : '') + table + (close ? mo(close, { stretchy: true }) : '')
        );
      }

      default:
        return '';
    }
  }

  /**
   * 渲染 LaTeX 为 MathML。
   * @param {string} latex
   * @param {{display?: boolean}} opts
   * @returns {string} MathML 字符串（已转义，可安全 innerHTML）
   */
  math.toMathML = function toMathML(latex, opts = {}) {
    const src = String(latex || '').trim();
    if (!src) return '';
    const tree = parse(tokenize(src));
    const inner = renderNode(tree);
    const display = opts.display ? ' display="block"' : '';
    // aria-label 让屏幕阅读器与"复制 LaTeX"按钮有可读来源
    return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="${opts.display ? 'block' : 'inline'}"${display} aria-label="${esc(src)}">${inner}</math>`;
  };

  /** 供测试用的纯文本近似（不依赖 DOM）。 */
  math.plain = function plain(latex) {
    try {
      return plainText(parse(tokenize(String(latex || ''))));
    } catch {
      return String(latex || '');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // KaTeX 可选加速路径
  // ─────────────────────────────────────────────────────────────
  let katexPromise = null;

  math.loadKatex = function loadKatex() {
    if (katexPromise) return katexPromise;
    if (!CPL.config.allowCdn || !CPL.prefs.get('enableCdn')) {
      return Promise.reject(new Error('CDN 已禁用'));
    }
    const base = CPL.config.cdn.katex;
    const sri = CPL.config.cdn.katexSRI || {};
    katexPromise = new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = `${base}katex.min.css`;
      css.crossOrigin = 'anonymous';
      // SRI：锁死内容，防止 CDN 被投毒后在前端执行任意公式宏
      if (sri.css) css.integrity = sri.css;
      document.head.append(css);

      const script = document.createElement('script');
      script.src = `${base}katex.min.js`;
      script.crossOrigin = 'anonymous';
      if (sri.js) script.integrity = sri.js;
      script.onload = () => {
        if (window.katex) resolve(window.katex);
        else reject(new Error('katex 未挂载到 window'));
      };
      script.onerror = () => reject(new Error('KaTeX 加载失败'));
      document.head.append(script);
    }).catch((err) => {
      katexPromise = null;
      throw err;
    });
    return katexPromise;
  };

  /** KaTeX 是否已经可用（同步检查）。 */
  math.katexReady = () => Boolean(window.katex && typeof window.katex.renderToString === 'function');

  /** 渲染入口：优先复用已加载的 KaTeX，否则回退 MathML。 */
  math.render = function render(latex, opts = {}) {
    if (math.katexReady()) {
      try {
        return window.katex.renderToString(String(latex), {
          displayMode: Boolean(opts.display),
          throwOnError: false,
          // 安全：不信任输入里的 \htmlClass / \href / \includegraphics 等 HTML 注入指令。
          // trust:false 是 KaTeX 的默认值，这里显式写出来表明这是有意的安全选择。
          trust: false,
          strict: 'ignore',
          output: 'htmlAndMathml',
          maxExpand: 1000,
          maxSize: 200,
          macros: { '\\R': '\\mathbb{R}', '\\N': '\\mathbb{N}', '\\Z': '\\mathbb{Z}' },
        });
      } catch (err) {
        CPL.log('warn', 'KaTeX 渲染失败，回退 MathML', err);
      }
    }
    return math.toMathML(latex, opts);
  };

  /** 如果用户开启了 CDN，就悄悄把 KaTeX 拉起来，失败了也无声（MathML 兜底）。 */
  math.warmKatex = function warmKatex() {
    if (!CPL.config.allowCdn) return;
    math.loadKatex()
      .then(() => CPL.bus.emit('math:katex-ready'))
      .catch(() => {});
  };
})();

/* ===== pieces/30-mastery.js ===== */
/* ============================================================================
 * 30-mastery.js — 技能清单与掌握度引擎
 *
 * 用途（对应新增需求）：
 *   · 首次使用时按 CIU 式清单流程走：先做诊断测评 → 得到技能掌握画像 →
 *     据此生成"跳过什么、重点补什么"的学习路径；
 *   · 学习过程中，课程完成度与自检勾选持续更新掌握度；
 *   · AI 助教按掌握度决定提问深度（不会在没内化的概念上直接抛难题）。
 *
 * 掌握度的三个来源（加权合成）：
 *   1. 自评（诊断测评的答题结果）       权重 0.4
 *   2. 课程完成（课程状态 done/doing）   权重 0.4
 *   3. 证据（跑通自动测试、练习通过）    权重 0.2
 *
 * CIU 式清单的含义在这里落实为：每个技能都有明确的 check 项与"证据要求"，
 * 不是"学过/没学过"的模糊状态，而是"能不能当场做出来"的可验证判断。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const util = CPL.util;

  const mastery = (CPL.mastery = {});

  // ─────────────────────────────────────────────────────────────
  // 技能清单（skill inventory）
  //
  // 每个技能：
  //   id      稳定标识（存储键，不要随便改）
  //   name    显示名
  //   domain  所属域：concept(计算物理概念) / fortran / cs / systems / math
  //   kind    'must'（必须内化）| 'lookup'（会查即可）
  //   lessons 关联课程 id（用于把课程完成度折成掌握度）
  //   checks  CIU 式可验证检查项（"能……"句式）
  //   evidence 证据要求：什么样的产出才算掌握
  // ─────────────────────────────────────────────────────────────
  const SKILLS = [
    // ── 计算物理概念（必须内化） ──────────────────────────────
    {
      id: 'complexity',
      name: '计算复杂度与量级判断',
      domain: 'concept',
      kind: 'must',
      lessons: ['lab-01-complexity-memory', 'week-11-complexity-array-hash'],
      checks: [
        '能在 30 秒内说出给定算法的时间与空间复杂度',
        '能把 N 放大 10 倍后耗时/内存的变化倍数算出来',
        '能判断"卡住"是复杂度问题还是常数因子/内存带宽问题',
      ],
      evidence: '拿自己的一段循环贴给助教，说出它的复杂度与瓶颈判据',
    },
    {
      id: 'memory-model',
      name: '内存模型与缓存局部性',
      domain: 'concept',
      kind: 'must',
      lessons: ['lab-01-complexity-memory', 'week-07-performance-parallel'],
      checks: [
        '能解释为什么遍历顺序会带来数倍性能差异',
        '能说出 C 行主序与 Fortran 列主序对循环嵌套的影响',
        '能判断一个数据结构是"指针追逐"还是"连续访问"',
      ],
      evidence: '实测一次跨步访问的带宽下降，并解释 cache line 的作用',
    },
    {
      id: 'float-error',
      name: '浮点误差与灾难性抵消',
      domain: 'concept',
      kind: 'must',
      lessons: ['lab-02-numerical-error'],
      checks: [
        '能用 ε 估算求和误差量级（n·ε）',
        '能识别灾难性抵消（两个相近大数相减）',
        '能说出 Kahan 补偿求和为什么有效',
      ],
      evidence: '在自己的求和代码里指出误差主项并给出改进方案',
    },
    {
      id: 'stability',
      name: '数值稳定性与条件数',
      domain: 'concept',
      kind: 'must',
      lessons: ['lab-02-numerical-error'],
      checks: [
        '能区分"算法不稳定"与"问题本身病态"',
        '能估计条件数对结果有效位数的影响',
        '能说出为什么某些迭代格式必须隐式',
      ],
      evidence: '举一个自己代码里病态条件的例子（或证明不存在）',
    },
    {
      id: 'convergence',
      name: '收敛阶与误差-步长分析',
      domain: 'concept',
      kind: 'must',
      lessons: ['lab-03-convergence-boundary'],
      checks: [
        '能画 log-log 误差图并从斜率读出收敛阶',
        '能预测把步长减半后误差下降多少',
        '能判断实测斜率偏离理论值的可能原因',
      ],
      evidence: '对一种数值格式给出实测斜率并与理论阶数对比',
    },
    {
      id: 'boundary',
      name: '边界条件与离散格式',
      domain: 'concept',
      kind: 'must',
      lessons: ['lab-03-convergence-boundary', 'week-06-numerical-arrays'],
      checks: [
        '能说出 Dirichlet / Neumann / 周期边界在差分里的写法差异',
        '能判断边界处理是否降阶（一阶 vs 二阶）',
        '能解释周期边界为什么常用 ghost cell',
      ],
      evidence: '故意写错一次边界条件，观察收敛阶变化并解释',
    },
    {
      id: 'parallel',
      name: '并行范式与加速比',
      domain: 'concept',
      kind: 'must',
      lessons: ['lab-04-parallel-debug', 'week-07-performance-parallel'],
      checks: [
        '能用 Amdahl 定律预测加速比上限',
        '能判断瓶颈在计算、内存带宽还是通信',
        '能识别竞态条件与假共享',
      ],
      evidence: '实测串行 vs 并行耗时，画出加速比曲线并解释偏离',
    },
    {
      id: 'debugging',
      name: '调试方法与二分定位',
      domain: 'concept',
      kind: 'must',
      lessons: ['lab-04-parallel-debug'],
      checks: [
        '能用二分法把 bug 范围缩到最小可复现单元',
        '知道断言/边界检查/内存检查工具各查什么',
        '能区分"结果错了"和"根本没跑"',
      ],
      evidence: '记录一次真实 bug 的定位过程（哪一步排除了什么）',
    },

    // ── Fortran ────────────────────────────────────────────────
    {
      id: 'fortran-basics',
      name: '现代 Fortran 语法与程序结构',
      domain: 'fortran',
      kind: 'lookup',
      lessons: ['week-05-fortran-basics', 'lab-07-fortran-cheatsheet'],
      checks: ['能读懂 module / interface / 派生类型的声明', '能写出可编译的自由格式源码', '知道 kind 参数怎么写可移植'],
      evidence: '把一段 Python 数值代码改写成 Fortran 并能编译运行',
    },
    {
      id: 'fortran-arrays',
      name: 'Fortran 数组语义与线性代数',
      domain: 'fortran',
      kind: 'lookup',
      lessons: ['week-06-numerical-arrays'],
      checks: ['能解释数组切片与整数组运算的语义', '知道 matmul 与手写循环的性能差距来源', '知道 BLAS/LAPACK 的调用约定'],
      evidence: '用 matmul 或 BLAS 替换三重循环并测出加速比',
    },
    {
      id: 'fortran-legacy',
      name: 'Legacy Fortran 阅读与改写',
      domain: 'fortran',
      kind: 'lookup',
      lessons: ['week-07-performance-parallel'],
      checks: ['能识别固定格式的列约定与隐式类型', '能把 common block 改成 module', '能找出未声明的变量风险'],
      evidence: '对一段 legacy 代码列出至少 3 个可现代化点',
    },

    // ── 计算机科学 ────────────────────────────────────────────
    {
      id: 'ds-basic',
      name: '基础数据结构（数组/字符串/哈希）',
      domain: 'cs',
      kind: 'must',
      lessons: ['week-11-complexity-array-hash'],
      checks: ['能推导动态数组扩容的摊销代价', '能解释哈希冲突与开放寻址/链地址的区别', '能说出负载因子对性能的影响'],
      evidence: '实现一次哈希表插入并测出负载因子-探测次数曲线',
    },
    {
      id: 'ds-linear',
      name: '链表 / 栈 / 队列 / 递归',
      domain: 'cs',
      kind: 'must',
      lessons: ['week-12-linked-list-stack-queue'],
      checks: ['能手写链表反转并解释指针变化', '能区分栈与队列的适用场景', '能把递归改写为显式栈'],
      evidence: '不看答案手写反转，并说明空间复杂度',
    },
    {
      id: 'ds-tree',
      name: '树 / 堆 / Trie / 并查集',
      domain: 'cs',
      kind: 'must',
      lessons: ['week-13-tree-heap-trie'],
      checks: ['能说出 BST 删除的三种情况', '能解释堆的上浮下沉与堆排序', '知道并查集路径压缩的复杂度'],
      evidence: '实现并查集并测出路径压缩前后的操作次数差异',
    },
    {
      id: 'algo-sort',
      name: '排序 / 二分 / 分治 / 回溯 / 贪心',
      domain: 'cs',
      kind: 'must',
      lessons: ['week-14-sort-binary-backtrack'],
      checks: ['能说出快排最坏情况与规避方式', '能一次写对 lower_bound / upper_bound 边界', '能判断贪心是否成立（交换论证）'],
      evidence: '写一个二分的边界测试集并全部通过',
    },
    {
      id: 'algo-dp-graph',
      name: '动态规划与图算法',
      domain: 'cs',
      kind: 'must',
      lessons: ['week-15-dp-graph'],
      checks: ['能把问题写成状态+转移方程', '能区分 BFS/DFS/Dijkstra/Bellman-Ford 的适用条件', '能说明负权边为什么让 Dijkstra 失效'],
      evidence: '手推一个 DP 表格并把转移方程写清楚',
    },
    {
      id: 'system-design',
      name: '系统设计与一致性权衡',
      domain: 'systems',
      kind: 'must',
      lessons: ['week-16-system-design-1', 'week-17-system-design-2'],
      checks: ['能用 CAP 说明一个具体取舍', '能估算缓存命中率对延迟的影响', '能说出限流与幂等的实现要点'],
      evidence: '为一个具体系统画出数据流并指出瓶颈与单点',
    },
    {
      id: 'os-network-db',
      name: 'OS / 网络 / 数据库要点',
      domain: 'systems',
      kind: 'lookup',
      lessons: ['week-18-os-network-db'],
      checks: ['能说出进程与线程的差别及代价', '能复述 TCP 握手与 TLS 的作用', '能解释索引为什么能加速查询'],
      evidence: '解释一次"请求从浏览器到数据库"的完整链路',
    },
    {
      id: 'concurrency',
      name: '并发、锁与性能分析',
      domain: 'systems',
      kind: 'must',
      lessons: ['week-19-concurrency-performance'],
      checks: ['能构造一个竞态并给出两种修法', '能区分死锁的四个必要条件', '能用 profiler 找出热点而不是靠猜'],
      evidence: '用剖析工具定位一次真实热点并给出优化前后对比',
    },

    // ── 项目知识整理（计算物理独有） ──────────────────────────
    {
      id: 'project-knowledge',
      name: '科研项目知识整理',
      domain: 'concept',
      kind: 'must',
      lessons: ['week-08-project-question', 'week-09-project-method', 'week-10-project-verification'],
      checks: [
        '能用 7 问说清一个项目（问题/方法/架构/bug/性能/验证/重做）',
        '能量化说明数值方法的选择理由',
        '能给出与解析解或文献对比的验证证据',
      ],
      evidence: '每个项目一页可导出的知识整理文档',
    },
    {
      id: 'anti-forgetting',
      name: '抗遗忘系统运转',
      domain: 'concept',
      kind: 'must',
      lessons: ['module-06-anti-forgetting'],
      checks: ['每个细节都挂在具体代码锚点上', '每周卡片复习不间断', '能用费曼方式讲清一个概念'],
      evidence: '连续两周完成每周 5 张卡片的生成与复习',
    },
  ];

  const SKILL_MAP = new Map(SKILLS.map((s) => [s.id, s]));

  mastery.skills = () => SKILLS.slice();
  mastery.skill = (id) => SKILL_MAP.get(id) || null;
  mastery.byDomain = (domain) => SKILLS.filter((s) => s.domain === domain);
  mastery.byKind = (kind) => SKILLS.filter((s) => s.kind === kind);
  mastery.domains = () => Array.from(new Set(SKILLS.map((s) => s.domain)));

  const DOMAIN_LABEL = {
    concept: '计算物理核心概念',
    fortran: 'Fortran 编程',
    cs: '数据结构与算法',
    systems: '系统 / 并发',
    math: '数学基础',
  };
  mastery.domainLabel = (d) => DOMAIN_LABEL[d] || d;

  // ─────────────────────────────────────────────────────────────
  // 掌握度存储
  // ─────────────────────────────────────────────────────────────
  const scope = CPL.store.scope('mastery');

  /** 默认记录：{ score:0..1, source:{self,lesson,evidence}, attempts, updatedAt } */
  function blank() {
    return { score: 0, self: null, lesson: 0, evidence: 0, attempts: 0, updatedAt: 0 };
  }

  mastery.get = function get(skillId) {
    return Object.assign(blank(), scope.get(skillId, null) || {});
  };

  mastery.set = function set(skillId, patch) {
    const next = Object.assign(mastery.get(skillId), patch, { updatedAt: Date.now() });
    next.score = mastery.combine(next);
    scope.set(skillId, next);
    CPL.bus.emit('mastery:changed', { skillId, record: next });
    return next;
  };

  /** 三源加权合成，自评缺失时把权重按比例分给课程完成与证据。 */
  mastery.combine = function combine(rec) {
    const r = Object.assign(blank(), rec);
    const self = typeof r.self === 'number' ? util.clamp(r.self, 0, 1) : null;
    const lesson = util.clamp(r.lesson || 0, 0, 1);
    const evidence = util.clamp(r.evidence || 0, 0, 1);
    if (self === null) return util.clamp(lesson * 0.65 + evidence * 0.35, 0, 1);
    return util.clamp(self * 0.4 + lesson * 0.4 + evidence * 0.2, 0, 1);
  };

  /** 记录一次诊断测评结果（每题对/错已折成 0..1）。 */
  mastery.recordSelfAssessment = function recordSelfAssessment(results) {
    // results: [{ skillId, correct:boolean }]
    const bySkill = new Map();
    for (const r of results) {
      if (!r.skillId) continue;
      const cur = bySkill.get(r.skillId) || { right: 0, total: 0 };
      cur.total++;
      if (r.correct) cur.right++;
      bySkill.set(r.skillId, cur);
    }
    for (const [skillId, tally] of bySkill) {
      const rec = mastery.get(skillId);
      const ratio = tally.total ? tally.right / tally.total : 0;
      // 多次测评取"最近一次"与"历史最好"的加权，避免一次手滑把画像打崩
      const blended = rec.self === null ? ratio : rec.self * 0.35 + ratio * 0.65;
      mastery.set(skillId, { self: blended, attempts: (rec.attempts || 0) + 1 });
    }
    return mastery.profile();
  };

  /** 由课程进度刷新"课程完成"维度的分数。 */
  mastery.syncFromProgress = function syncFromProgress() {
    for (const skill of SKILLS) {
      if (!skill.lessons.length) continue;
      let sum = 0;
      for (const lessonId of skill.lessons) {
        const state = CPL.progress.get(lessonId).state;
        sum += state === 'done' ? 1 : state === 'doing' ? 0.4 : 0;
      }
      const lessonScore = sum / skill.lessons.length;
      const rec = mastery.get(skill.id);
      if (Math.abs((rec.lesson || 0) - lessonScore) > 1e-6) mastery.set(skill.id, { lesson: lessonScore });
    }
  };

  /** 记录"证据"（跑通测试、完成练习、导出知识文档…）。 */
  mastery.addEvidence = function addEvidence(skillId, amount = 0.5) {
    const rec = mastery.get(skillId);
    return mastery.set(skillId, { evidence: util.clamp((rec.evidence || 0) + amount, 0, 1) });
  };

  /** 从课程 id 反查它覆盖的技能。 */
  mastery.skillsForLesson = function skillsForLesson(lessonId) {
    return SKILLS.filter((s) => s.lessons.includes(lessonId));
  };

  mastery.reset = function reset() {
    for (const key of scope.keys()) scope.remove(key.slice('mastery.'.length));
    CPL.bus.emit('mastery:changed', { skillId: null, record: null });
  };

  // ─────────────────────────────────────────────────────────────
  // 画像与推荐
  // ─────────────────────────────────────────────────────────────
  const THRESHOLD = { strong: 0.75, ok: 0.5, weak: 0.25 };

  mastery.level = function level(score) {
    if (score >= THRESHOLD.strong) return 'strong';
    if (score >= THRESHOLD.ok) return 'ok';
    if (score >= THRESHOLD.weak) return 'weak';
    return 'unknown';
  };

  const LEVEL_LABEL = { strong: '已掌握', ok: '基本会', weak: '薄弱', unknown: '未评估' };
  mastery.levelLabel = (lv) => LEVEL_LABEL[lv] || lv;

  /**
   * 生成完整画像。
   * @param {{syllabus?:boolean}} opts
   */
  mastery.profile = function profile() {
    const rows = SKILLS.map((s) => {
      const rec = mastery.get(s.id);
      return {
        skill: s,
        score: rec.score,
        level: mastery.level(rec.score),
        self: rec.self,
        lesson: rec.lesson,
        evidence: rec.evidence,
        assessed: rec.self !== null,
      };
    });

    const byDomain = {};
    for (const row of rows) {
      const d = row.skill.domain;
      if (!byDomain[d]) byDomain[d] = { domain: d, label: mastery.domainLabel(d), scores: [], rows: [] };
      byDomain[d].scores.push(row.score);
      byDomain[d].rows.push(row);
    }
    for (const d of Object.values(byDomain)) {
      d.average = d.scores.reduce((a, b) => a + b, 0) / Math.max(1, d.scores.length);
      d.level = mastery.level(d.average);
    }

    const assessed = rows.filter((r) => r.assessed);
    const overall = rows.reduce((a, r) => a + r.score, 0) / Math.max(1, rows.length);

    return {
      rows,
      byDomain,
      overall,
      overallLevel: mastery.level(overall),
      assessedCount: assessed.length,
      totalSkills: rows.length,
      hasAssessment: assessed.length > 0,
      weak: rows.filter((r) => r.level === 'weak' || r.level === 'unknown').map((r) => r.skill.id),
      strong: rows.filter((r) => r.level === 'strong').map((r) => r.skill.id),
    };
  };

  /**
   * 根据画像生成学习路径：跳过已掌握的、优先补薄弱的、其余按周次顺序。
   * @param {Array} lessons 课程清单（来自 catalog）
   * @returns {{skip:string[], focus:string[], order:string[], reason:Object}}
   */
  mastery.recommend = function recommend(lessons) {
    const prof = mastery.profile();
    const scoreOf = {};
    for (const row of prof.rows) scoreOf[row.skill.id] = row.score;

    const reason = {};
    const focus = new Set();
    const skip = new Set();

    for (const row of prof.rows) {
      if (!row.skill.lessons.length) continue;
      if (row.level === 'strong') row.skill.lessons.forEach((l) => skip.add(l));
      else if (row.level === 'weak' || row.level === 'unknown') row.skill.lessons.forEach((l) => focus.add(l));
    }

    // 已掌握但课程里还包含别的薄弱点时不跳过（一个课程往往覆盖多个技能）
    for (const lesson of lessons) {
      const skills = mastery.skillsForLesson(lesson.id);
      if (!skills.length) continue;
      const min = Math.min(...skills.map((s) => scoreOf[s.id] ?? 0));
      if (min < THRESHOLD.strong) skip.delete(lesson.id);
      if (skills.some((s) => scoreOf[s.id] !== undefined && scoreOf[s.id] < THRESHOLD.ok)) focus.add(lesson.id);
    }

    // 排序：先薄弱（按周次），再其余（按周次）
    const sorted = lessons.slice().sort((a, b) => {
      const fa = focus.has(a.id) ? 0 : 1;
      const fb = focus.has(b.id) ? 0 : 1;
      if (fa !== fb) return fa - fb;
      return a.week - b.week || a.id.localeCompare(b.id);
    });

    for (const l of sorted) {
      const skills = mastery.skillsForLesson(l.id);
      if (skills.length) {
        const weakest = skills.reduce((a, b) => ((scoreOf[a.id] ?? 0) <= (scoreOf[b.id] ?? 0) ? a : b));
        reason[l.id] = skip.has(l.id)
          ? `覆盖的技能（${skills.map((s) => s.name).join('、')}）已评估为掌握，可快速略过`
          : `最薄弱环节：${weakest.name}（掌握度 ${Math.round((scoreOf[weakest.id] ?? 0) * 100)}%）`;
      } else {
        reason[l.id] = '属于工具性细节，按需查阅即可';
      }
    }

    return { skip: Array.from(skip), focus: Array.from(focus), order: sorted.map((l) => l.id), reason, profile: prof };
  };

  /** 生成"给 AI 助教的掌握度上下文"——只发技能等级，不发任何个人信息。 */
  mastery.toContext = function toContext(limit = 8) {
    const prof = mastery.profile();
    const weak = prof.rows
      .filter((r) => r.level === 'weak' || r.level === 'unknown')
      .slice(0, limit)
      .map((r) => `${r.skill.name}=${mastery.levelLabel(r.level)}`);
    const strong = prof.rows
      .filter((r) => r.level === 'strong')
      .slice(0, limit)
      .map((r) => r.skill.name);
    return {
      overall: `${Math.round(prof.overall * 100)}%（已评估 ${prof.assessedCount}/${prof.totalSkills} 项技能）`,
      weak,
      strong,
    };
  };

  // 课程进度变化时自动同步
  CPL.bus.on('progress:changed', () => mastery.syncFromProgress());
})();

/* ===== pieces/35-assessment.js ===== */
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

/* ===== pieces/40-lesson.js ===== */
/* ============================================================================
 * 40-lesson.js — 课程页渲染（8 段式结构 + 编辑器 + 测试 + AI 助教 + 卡片）
 *
 * 页面结构（严格按规划，缺任何一段都会有明显提示，不会静默省略）：
 *   1 学习目标   2 核心概念（含自检问题）  3 工具速查（含查文档挑战）
 *   4 交互式 demo 5 代码练习（浏览器内运行）6 自动测试
 *   7 AI 助教（引导提问 / 代码审查 / 掌握度评估）8 Anki 卡片
 *   9 延伸阅读   10 完成自检清单
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const md = CPL.md;
  const util = CPL.util;

  const lessonView = (CPL.lessonView = {});

  /** 本页需要清理的资源（demo 的 rAF、编辑器实例、AI 面板…） */
  let cleanups = [];

  function addCleanup(fn) {
    if (typeof fn === 'function') cleanups.push(fn);
  }

  function runCleanups() {
    for (const fn of cleanups.slice().reverse()) {
      try {
        fn();
      } catch (err) {
        CPL.log('warn', '清理课程页资源失败', err);
      }
    }
    cleanups = [];
  }

  // ─────────────────────────────────────────────────────────────
  // 小组件
  // ─────────────────────────────────────────────────────────────
  function section(title, id, ...children) {
    const sec = dom.h('section', { class: 'cpl-ls', id: id ? `ls-${id}` : null });
    if (title) {
      sec.append(
        dom.h(
          'h2',
          { class: 'cpl-ls__title' },
          title,
          id ? dom.h('a', { class: 'cpl-anchor', href: `#ls-${id}`, 'aria-label': '本节锚点', text: '#' }) : null
        )
      );
    }
    sec.append(...children.flat(Infinity).filter(Boolean));
    return sec;
  }

  function pill(text, kind) {
    return dom.h('span', { class: `cpl-pill${kind ? ` cpl-pill--${kind}` : ''}`, text });
  }

  function tabs(items) {
    const nav = dom.h('div', { class: 'cpl-tabs', role: 'tablist' });
    const panels = dom.h('div', { class: 'cpl-tabs__panels' });
    let active = 0;

    const buttons = items.map((item, i) => {
      const btn = dom.h('button', {
        class: 'cpl-tabs__tab',
        type: 'button',
        role: 'tab',
        id: `tab-${i}-${util.hash(item.label)}`,
        'aria-selected': i === 0 ? 'true' : 'false',
        'aria-controls': `panel-${i}-${util.hash(item.label)}`,
        tabindex: i === 0 ? '0' : '-1',
        text: item.label,
        onclick: () => select(i),
      });
      return btn;
    });

    const panelEls = items.map((item, i) => {
      const panel = dom.h('div', {
        class: 'cpl-tabs__panel',
        role: 'tabpanel',
        id: `panel-${i}-${util.hash(item.label)}`,
        'aria-labelledby': `tab-${i}-${util.hash(item.label)}`,
        hidden: i !== 0,
      });
      panel.append(item.content);
      return panel;
    });

    function select(i) {
      active = i;
      buttons.forEach((b, k) => {
        b.setAttribute('aria-selected', k === i ? 'true' : 'false');
        b.tabIndex = k === i ? 0 : -1;
        b.classList.toggle('is-active', k === i);
      });
      panelEls.forEach((p, k) => {
        p.hidden = k !== i;
      });
      if (items[i].onShow) items[i].onShow();
    }

    nav.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = (active + (e.key === 'ArrowRight' ? 1 : items.length - 1)) % items.length;
        select(next);
        buttons[next].focus();
      }
    });

    items.forEach((item, i) => {
      if (i > 0) buttons[i].classList.remove('is-active');
    });
    buttons[0].classList.add('is-active');
    nav.append(...buttons);
    panels.append(...panelEls);
    return { nav, panels, select };
  }

  // ─────────────────────────────────────────────────────────────
  // 主渲染
  // ─────────────────────────────────────────────────────────────

  /** 竞态保护：只渲染最后一次请求的课程。 */
  let renderToken = 0;

  CPL.nav.register('lesson', async (main, lessonId) => {
    runCleanups();
    const token = ++renderToken;

    const meta = CPL.catalog.meta(lessonId);
    if (!meta && !CPL.catalog.isLoaded(lessonId)) {
      main.append(
        dom.errorCard(`找不到课程「${lessonId}」`, '这个 id 不在课程清单里。', [
          '回到首页从课程地图进入',
          '如果这是你自己创建的课程，请在「我的内容」里查看',
        ])
      );
      main.append(dom.h('p', {}, dom.h('a', { class: 'cpl-btn', href: '#/home', text: '← 回到课程地图' })));
      return;
    }

    // 加载占位
    dom.clear(main);
    main.append(
      dom.h('div', { class: 'cpl-lesson' }, dom.h('header', { class: 'cpl-lesson__head' }, dom.h('h1', { class: 'cpl-lesson__title', text: meta ? meta.title : lessonId })), dom.spinner('正在加载课程内容…'))
    );

    let lesson;
    try {
      lesson = await CPL.catalog.load(lessonId);
    } catch (err) {
      dom.clear(main);
      main.append(
        dom.errorCard('课程加载失败', dom.friendlyError(err), [
          '检查网络后刷新重试',
          '如果你用 file:// 直接打开了 index.html，请改用 npm run serve',
        ])
      );
      return;
    }
    if (token !== renderToken) return; // 用户已经切到别的课

    lesson = CPL.catalog.normalizeLesson(lesson);
    const missing = CPL.catalog.validateLesson(lesson);
    if (missing.length) {
      CPL.log('warn', `课程 ${lessonId} 缺少字段：${missing.join(', ')}`);
    }

    // 记忆上次访问
    CPL.prefs.set('lastLesson', lessonId);

    dom.clear(main);
    const page = dom.h('article', { class: 'cpl-lesson' });
    main.append(page);

    // ── 头部 ──────────────────────────────────────────────
    page.append(renderHeader(lesson, meta, missing));

    // ── 编辑器与代码状态（多个段共用） ─────────────────────
    const codeState = {
      api: null,
      getValue: () => (codeState.api ? codeState.api.getValue() : ''),
    };

    // ── 1 学习目标 ────────────────────────────────────────
    if (lesson.objectives.length) {
      page.append(
        section(
          '学习目标',
          'objectives',
          dom.h(
            'ul',
            { class: 'cpl-objectives' },
            lesson.objectives.map((o) => dom.h('li', { text: o }))
          ),
          dom.h('p', { class: 'cpl-muted', text: '这些目标都是可检验的：学完后你应该能在不看笔记的情况下做到。' })
        )
      );
    }

    // ── 2 核心概念 ────────────────────────────────────────
    if (lesson.concepts.length) {
      const list = dom.h('div', { class: 'cpl-concepts' });
      for (const c of lesson.concepts) {
        const isMust = c.must !== 'lookup';
        const item = dom.h('div', { class: 'cpl-concept' });
        item.append(
          dom.h(
            'div',
            { class: 'cpl-concept__head' },
            dom.h('h3', { class: 'cpl-concept__term', text: c.term }),
            pill(isMust ? '必须内化' : '会查即可', isMust ? 'physics' : 'accent')
          )
        );
        const body = dom.h('div', { class: 'cpl-concept__body' });
        body.append(c.body ? md.render(c.body) : dom.h('p', { text: c.summary || '' }));
        item.append(body);

        if (c.selfCheck && c.selfCheck.length) {
          const sc = dom.h('div', { class: 'cpl-selfcheck' });
          sc.append(dom.h('h4', { class: 'cpl-selfcheck__title', text: '自检（答不上来就说明还没内化）' }));
          sc.append(dom.h('ul', { class: 'cpl-list' }, c.selfCheck.map((q) => dom.h('li', { text: q }))));
          item.append(sc);
        }
        if (c.anchor) {
          item.append(dom.h('p', { class: 'cpl-concept__anchor' }, dom.h('strong', { text: '项目锚点：' }), c.anchor));
        }
        list.append(item);
      }
      page.append(section('核心概念', 'concepts', list));
    }

    // ── 3 工具速查 ────────────────────────────────────────
    const tools = lesson.tools || [];
    const docChallenges = lesson.docChallenges || [];
    if (tools.length || docChallenges.length) {
      const wrap = dom.h('div', {});
      if (tools.length) {
        const table = dom.h(
          'table',
          { class: 'cpl-table cpl-table--compact' },
          dom.h('thead', {}, dom.h('tr', {}, ['工具 / API', '最小示例', '文档', '备注'].map((h) => dom.h('th', { text: h })))),
          dom.h(
            'tbody',
            {},
            tools.map((t) =>
              dom.h(
                'tr',
                {},
                dom.h('td', {}, dom.h('strong', { text: t.name }), t.must === 'must' ? pill('内化', 'physics') : null),
                dom.h('td', {}, t.code ? dom.h('code', { class: 'cpl-code-inline', text: t.code }) : dom.h('span', { class: 'cpl-muted', text: '—' })),
                dom.h(
                  'td',
                  {},
                  t.doc ? dom.h('a', { href: t.doc, target: '_blank', rel: 'noopener noreferrer', text: '文档 ↗' }) : dom.h('span', { class: 'cpl-muted', text: '—' })
                ),
                dom.h('td', { class: 'cpl-muted', text: t.note || '' })
              )
            )
          )
        );
        wrap.append(dom.h('p', { class: 'cpl-muted', text: '工具性细节不需要背。目标是「知道有它，30 秒能查到用法」。' }), table);
      }

      if (docChallenges.length) {
        const dc = dom.h('div', { class: 'cpl-docchallenge' });
        dc.append(dom.h('h3', { class: 'cpl-docchallenge__title', text: '查文档挑战（限时 2 分钟）' }));
        for (const ch of docChallenges) {
          const item = dom.h('div', { class: 'cpl-docchallenge__item' });
          item.append(dom.h('p', { class: 'cpl-docchallenge__q', text: ch.q }));
          const answer = dom.h('div', { class: 'cpl-docchallenge__answer', hidden: true });
          answer.append(md.render(ch.answer || '（没有预置答案，请自己写下最小示例）'));
          item.append(
            dom.h('button', {
              class: 'cpl-btn cpl-btn--sm',
              type: 'button',
              text: '我查到了，看参考答案',
              onclick: (e) => {
                answer.hidden = !answer.hidden;
                e.target.textContent = answer.hidden ? '我查到了，看参考答案' : '收起答案';
              },
            }),
            answer
          );
          dc.append(item);
        }
        wrap.append(dc);
      }
      page.append(section('工具速查与查文档挑战', 'tools', wrap));
    }

    // ── 4 交互式 demo ─────────────────────────────────────
    // askButtons 是 demo 与 AI 助教的连接点：demo 用 api.on('ask', ...) 注册
    // 一个"针对当前参数该问什么"的问题，这里把它渲染成可点击的 chip。
    const askButtons = dom.h('div', { class: 'cpl-demo__asklist' });
    const demoHost = dom.h('div', { class: 'cpl-demo' });
    if (lesson.demo) {
      page.append(
        section(
          '交互式 demo',
          'demo',
          lesson.demo.title ? dom.h('p', { class: 'cpl-ls__lead', text: lesson.demo.title }) : null,
          lesson.demo.intro ? dom.h('p', { class: 'cpl-muted', text: lesson.demo.intro }) : null,
          demoHost,
          askButtons
        )
      );
    }

    // ── 5 代码练习 ────────────────────────────────────────
    let editorApi = null;
    let testsHost = null;
    const exercise = lesson.exercise;

    if (exercise) {
      const ex = exercise;
      const briefEl = dom.h('div', { class: 'cpl-exercise__brief' });
      if (ex.brief) briefEl.append(md.render(ex.brief));

      const bar = dom.h('div', { class: 'cpl-exercise__bar' });
      const runBtn = dom.h('button', { class: 'cpl-btn cpl-btn--primary', type: 'button', text: '▶ 运行（Ctrl/Cmd+Enter）' });
      const testBtn = dom.h('button', { class: 'cpl-btn', type: 'button', text: '运行自动测试' });
      const resetBtn = dom.h('button', { class: 'cpl-btn cpl-btn--ghost cpl-btn--sm', type: 'button', text: '恢复初始代码' });
      const solutionBtn = dom.h('button', { class: 'cpl-btn cpl-btn--ghost cpl-btn--sm', type: 'button', text: '看参考答案' });
      const copyBtn = dom.h('button', { class: 'cpl-btn cpl-btn--ghost cpl-btn--sm', type: 'button', text: '复制代码' });
      bar.append(runBtn, testBtn, resetBtn, solutionBtn, copyBtn);

      const editorHost = dom.h('div', { class: 'cpl-exercise__editor' });
      const outputHost = dom.h('div', { class: 'cpl-exercise__output' });
      testsHost = dom.h('div', { class: 'cpl-exercise__tests' });

      const hints = dom.h('details', { class: 'cpl-hints' });
      hints.append(dom.h('summary', { text: '卡住了？看提示（不会直接给答案）' }));
      hints.append(
        dom.h(
          'ul',
          { class: 'cpl-list' },
          (ex.hints || ['先写出暴力解，再想哪一层循环可以被替换掉。', '把"我用过什么"记录在一个结构里，避免重复扫描。']).map((h) => dom.h('li', { text: h }))
        )
      );

      page.append(section('代码练习', 'exercise', briefEl, bar, editorHost, hints, outputHost, testsHost));

      // 草稿恢复
      const draft = CPL.drafts.load(lesson.id, ex.id || 'main');
      const initialCode = (draft && draft.code) || ex.starter || '';
      if (draft) {
        dom.toast('已恢复上次未提交的代码草稿', {
          kind: 'info',
          action: { label: '用初始代码', onClick: () => editorApi && editorApi.setValue(ex.starter || '') },
        });
      }

      // 初始化编辑器
      CPL.editor
        .mount(editorHost, {
          value: initialCode,
          language: ex.lang || 'python',
          ariaLabel: `${lesson.title} 代码练习`,
          minHeight: 300,
          onSubmit: () => runNow(),
          onChange: util.debounce((v) => CPL.drafts.save(lesson.id, ex.id || 'main', v), 700),
        })
        .then((api) => {
          if (token !== renderToken) {
            api.destroy();
            return;
          }
          editorApi = api;
          codeState.api = api;
          addCleanup(() => api.destroy());
        });

      // 运行
      const outBox = dom.h('div', { class: 'cpl-run-output' });
      outputHost.append(outBox);

      async function runNow() {
        if (!editorApi) {
          dom.toast('编辑器还在初始化，稍等一下', { kind: 'info', ms: 1500 });
          return;
        }
        const code = editorApi.getValue();
        if (!code.trim()) {
          dom.toast('先写点代码', { kind: 'warn' });
          return;
        }
        runBtn.disabled = true;
        dom.clear(outBox);
        const statusLine = dom.h('div', { class: 'cpl-run-status', text: '准备运行时…' });
        outBox.append(statusLine);

        const lang = ex.lang || 'python';

        if (lang !== 'python') {
          // 非 Python：静态检查 + 本地运行指引（诚实说明为什么不能在浏览器里跑）
          renderNonPythonRun(outBox, lang, code, lesson);
          runBtn.disabled = false;
          return;
        }

        const offStatus = CPL.bus.on('runtime:status', (e) => {
          statusLine.textContent = e.message;
        });
        const result = await CPL.tests.runCode(code, {
          onStatus: (m) => {
            statusLine.textContent = m;
          },
        });
        offStatus();
        runBtn.disabled = false;
        dom.clear(outBox);

        if (!result.ok) {
          outBox.append(
            dom.errorCard('运行没能完成', result.message || '未知错误', [
              '如果是加载超时，检查网络后重试',
              '如果是超时，检查有没有死循环或把 N 调小',
            ])
          );
          return;
        }

        outBox.append(
          dom.h('div', { class: 'cpl-run-meta', text: `执行完成 · ${util.seconds(result.ms || 0)} · ${(result.packages || []).length ? '已加载 ' + result.packages.join(', ') : '未额外加载包'}` })
        );
        if (result.stdout) outBox.append(dom.h('pre', { class: 'cpl-run-stdout', text: result.stdout }));
        if (result.stderr) outBox.append(dom.h('pre', { class: 'cpl-run-stderr', text: result.stderr }));
        if (!result.stdout && !result.stderr) outBox.append(dom.h('p', { class: 'cpl-muted', text: '（没有输出。用 print() 打印中间量，或点「运行自动测试」检查正确性。）' }));
      }

      runBtn.addEventListener('click', runNow);
      testBtn.addEventListener('click', () => {
        if (!editorApi) return;
        runTests(editorApi.getValue());
      });
      resetBtn.addEventListener('click', () => {
        if (!editorApi) return;
        if (!window.confirm('确定恢复到初始代码？当前改动会丢失（草稿也会清掉）。')) return;
        editorApi.setValue(ex.starter || '');
        CPL.drafts.clear(lesson.id, ex.id || 'main');
        dom.clear(outBox);
        dom.clear(testsHost);
      });
      solutionBtn.addEventListener('click', () => {
        if (!editorApi) return;
        const box = dom.h('div', { class: 'cpl-solution' });
        box.append(
          dom.h('p', { class: 'cpl-muted', text: '参考答案只是其中一种写法。先自己写出来再看，否则这次练习的价值接近零。' }),
          dom.h('pre', { class: 'cpl-pre', html: CPL.highlight ? CPL.highlight.render(ex.solution || '', ex.lang || 'python') : dom.esc(ex.solution || '') })
        );
        dom.clear(testsHost);
        testsHost.append(box);
      });
      copyBtn.addEventListener('click', async () => {
        if (!editorApi) return;
        const ok = await dom.copyToClipboard(editorApi.getValue());
        dom.toast(ok ? '已复制到剪贴板' : '复制失败', { kind: ok ? 'ok' : 'warn', ms: 1600 });
      });

      async function runTests(code) {
        if (!lesson.tests || !lesson.tests.length) {
          dom.toast('这一课没有配置自动测试', { kind: 'warn' });
          return;
        }
        testBtn.disabled = true;
        dom.clear(testsHost);
        const progress = dom.h('div', { class: 'cpl-run-status', text: '准备运行测试…' });
        testsHost.append(progress);
        const summary = await CPL.tests.run(lesson, code, {
          onProgress: (p) => {
            progress.textContent = `运行中：${p.index + 1}/${p.total} · ${p.name}`;
          },
          onStatus: (m) => {
            progress.textContent = m;
          },
        });
        testBtn.disabled = false;
        dom.clear(testsHost);
        testsHost.append(CPL.tests.render(summary));
        if (summary.total && summary.passed === summary.total) {
          dom.toast('全部测试通过 ✓ 已记录到进度与掌握度证据', { kind: 'ok' });
          refreshProgressUi(lesson);
        } else {
          dom.toast(`${summary.passed}/${summary.total} 通过。看失败项的提示，别直接看答案。`, { kind: summary.passed ? 'info' : 'warn' });
        }
      }

      // 可供 AI 助教读取代码
      lessonView.getCurrentCode = () => (editorApi ? editorApi.getValue() : '');
    }

    // ── 6 自动测试说明 ────────────────────────────────────
    if (lesson.tests && lesson.tests.length) {
      const list = dom.h(
        'ul',
        { class: 'cpl-testlist' },
        lesson.tests.map((t) =>
          dom.h(
            'li',
            { class: 'cpl-testlist__item' },
            dom.h('span', { class: `cpl-testlist__kind cpl-testlist__kind--${t.kind || 'python'}`, text: t.kind === 'static' ? '静态' : t.kind === 'check' ? '交互' : 'Python' }),
            dom.h('span', { text: t.name })
          )
        )
      );
      const testSection = section(
        '自动测试',
        'tests',
        dom.h('p', { class: 'cpl-muted', text: '这些测试断言的是题目要点（正确性、边界、量级），不是实现细节。跑通即通过，结果会写入进度与掌握度证据。' }),
        list
      );
      if (CPL.prefs.get('autoRunTests')) {
        testSection.append(
          dom.h('p', { class: 'cpl-muted', text: '（设置里开启了「加载后自动跑测试」，写完后点上面的「运行自动测试」即可。）' })
        );
      }
      page.append(testSection);
    } else if (missing.includes('tests')) {
      page.append(
        section('自动测试', 'tests', dom.errorCard('这一课还没有自动测试', '大纲完整性要求每课至少 1 个自动测试。', ['补充 tests 字段后重新构建']))
      );
    }

    // ── 7 AI 助教 ─────────────────────────────────────────
    const aiSection = section(
      'AI 助教',
      'ai',
      dom.h('p', {
        class: 'cpl-muted',
        text: '助教的行为约定：先提问、不直接给答案；能检查你的代码并指出物理正确性、边界条件、数值稳定性、数组越界、内存布局、并行竞态等问题；也能按当前掌握度评估你该补什么。',
      })
    );
    page.append(aiSection);

    // ── 8 Anki 卡片 ───────────────────────────────────────
    page.append(renderAnkiSection(lesson, meta));

    // ── 9 延伸阅读 ────────────────────────────────────────
    if (lesson.reading.length) {
      page.append(
        section(
          '延伸阅读',
          'reading',
          dom.h(
            'ul',
            { class: 'cpl-reading' },
            lesson.reading.map((r) =>
              dom.h(
                'li',
                {},
                r.url ? dom.h('a', { href: dom.safeUrl(r.url), target: '_blank', rel: 'noopener noreferrer external', text: r.title }) : dom.h('strong', { text: r.title }),
                r.note ? dom.h('span', { class: 'cpl-muted', text: ' — ' + r.note }) : null
              )
            )
          )
        )
      );
    }

    // ── 10 完成自检清单 ───────────────────────────────────
    page.append(renderChecklist(lesson, meta));

    // ── 上一课 / 下一课 ───────────────────────────────────
    page.append(renderPrevNext(lesson));

    // ── 挂载 demo 与 AI 面板 ──────────────────────────────
    if (lesson.demo) {
      const demoApi = {
        on(kind, fn) {
          if (kind === 'ask' && typeof fn === 'function') {
            const question = String(fn() || '');
            if (!question) return;
            askButtons.append(
              dom.h('button', {
                class: 'cpl-chip cpl-chip--ask',
                type: 'button',
                text: '把这个问题带给助教：' + (question.length > 56 ? question.slice(0, 56) + '…' : question),
                title: question,
                onclick: () => {
                  const input = aiSection.querySelector('.cpl-ai__input');
                  if (input) {
                    input.value = question;
                    input.focus();
                    input.dispatchEvent(new Event('input'));
                  } else {
                    dom.toast('AI 面板还没准备好，稍后再试', { kind: 'warn' });
                  }
                },
              })
            );
          }
        },
        lesson,
        setParam() {},
      };
      const cleanup = CPL.demos.mount(lesson.demo.kind, demoHost, lesson.demo.params || {}, demoApi);
      if (typeof cleanup === 'function') addCleanup(cleanup);
    }
    lessonView._askHost = askButtons;

    // AI 面板（三个模式做成 tab：引导提问 / 代码审查 / 掌握度评估）
    CPL.editor.warm();
    const tutorHost = dom.h('div', {});
    const reviewHost = dom.h('div', {});
    const assessHost = dom.h('div', {});

    const aiTabs = tabs([
      { label: '引导提问', content: tutorHost, onShow: () => ensurePanel('tutor') },
      { label: '代码审查', content: reviewHost, onShow: () => ensurePanel('review') },
      { label: '掌握度评估', content: assessHost, onShow: () => ensurePanel('assess') },
    ]);
    aiSection.append(aiTabs.nav, aiTabs.panels);

    const panels = {};
    function ensurePanel(mode) {
      if (panels[mode]) return panels[mode];
      const host = mode === 'tutor' ? tutorHost : mode === 'review' ? reviewHost : assessHost;
      const panel = CPL.ai.mountPanel(host, {
        lesson,
        lessonId: lesson.id,
        mode,
        getCode: () => lessonView.getCurrentCode(),
        getLanguage: () => (lesson.exercise && lesson.exercise.lang) || 'python',
      });
      panels[mode] = panel;
      addCleanup(() => panel.destroy());
      return panel;
    }
    // 默认挂载第一个 tab
    ensurePanel('tutor');

    // 初始进度渲染
    refreshProgressUi(lesson);

    // ── 非 Python 练习的运行说明 ──────────────────────────
    function renderNonPythonRun(host, lang, code, ls) {
      const issues = CPL.runtimes.staticCheck(lang, code);
      const info = CPL.runtimes.localRunInfo(lang, 'main');

      host.append(
        dom.h(
          'div',
          { class: 'cpl-callout cpl-callout--warn' },
          dom.h('div', { class: 'cpl-callout__head' }, dom.h('span', { class: 'cpl-callout__icon', text: '⚠' }), dom.h('span', { class: 'cpl-callout__title', text: '为什么这段代码不能在浏览器里直接运行' })),
          dom.h(
            'div',
            { class: 'cpl-callout__body' },
            dom.h('p', {
              text:
                lang === 'fortran'
                  ? 'Fortran 的浏览器内编译（LFortran WASM）目前仍是 alpha 阶段，官方明确说明不保证第三方代码；GitHub Pages 也无法提供它需要的跨源隔离响应头。因此这里给你三样能真正用的东西：静态检查、参考实现、可复制的本地运行命令。'
                  : '浏览器内的 C/C++ 编译器（Clang→WASM）压缩后仍需下载约 20 MB 并在本地解压，塞进首屏会让所有学习者都付这个代价。因此这里给你静态检查与本地运行命令。',
            }),
            dom.h('p', { class: 'cpl-muted', text: '这不是"功能缺失"，是不想给你一个假装能跑的按钮。' })
          )
        )
      );

      if (issues.length) {
        const list = dom.h('ul', { class: 'cpl-staticcheck' });
        for (const issue of issues) {
          list.append(
            dom.h(
              'li',
              { class: `cpl-staticcheck__item cpl-staticcheck__item--${issue.level}` },
              dom.h('span', { class: 'cpl-staticcheck__level', text: { error: '错误', warn: '警告', info: '提示', tip: '要点' }[issue.level] || issue.level }),
              dom.h('span', { text: issue.msg })
            )
          );
        }
        host.append(dom.h('h4', { text: `静态检查发现 ${issues.length} 处值得注意的地方` }), list);
      } else {
        host.append(dom.h('p', { class: 'cpl-muted', text: '静态检查没有发现常见问题（这不能代替真正的编译与运行检查）。' }));
      }

      const cmds = dom.h('div', { class: 'cpl-cmdlist' });
      for (const c of info.commands) {
        const row = dom.h(
          'div',
          { class: 'cpl-cmd' },
          dom.h('span', { class: 'cpl-cmd__label', text: c.label }),
          dom.h('code', { class: 'cpl-cmd__code', text: c.cmd }),
          dom.h('button', {
            class: 'cpl-btn cpl-btn--sm',
            type: 'button',
            text: '复制',
            onclick: async (e) => {
              const ok = await dom.copyToClipboard(c.cmd);
              e.target.textContent = ok ? '已复制' : '失败';
              setTimeout(() => {
                e.target.textContent = '复制';
              }, 1500);
            },
          })
        );
        if (c.note) row.append(dom.h('span', { class: 'cpl-cmd__note', text: c.note }));
        cmds.append(row);
      }
      host.append(dom.h('h4', { text: `本地运行（把代码保存为 ${info.file}）` }), cmds);

      const links = dom.h('div', { class: 'cpl-cmdlist' });
      for (const r of CPL.runtimes.externalRunners) {
        links.append(dom.h('div', { class: 'cpl-cmd' }, dom.h('span', { class: 'cpl-cmd__label', text: r.lang }), dom.h('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer', text: r.name })));
      }
      host.append(dom.h('h4', { text: '在线编译器（需要联网）' }), links);
      void ls;
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 头部
  // ─────────────────────────────────────────────────────────────
  function renderHeader(lesson, meta, missing) {
    const rec = CPL.progress.get(lesson.id);
    const head = dom.h('header', { class: 'cpl-lesson__head' });

    const crumb = dom.h(
      'p',
      { class: 'cpl-lesson__crumb' },
      dom.h('a', { href: '#/home', text: '课程地图' }),
      ' / ',
      dom.h('span', { text: `模块 ${lesson.module || (meta && meta.module) || '—'} · 第 ${lesson.week || (meta && meta.week) || '—'} 周` })
    );

    const titleRow = dom.h(
      'div',
      { class: 'cpl-lesson__titlerow' },
      dom.h('h1', { class: 'cpl-lesson__title', text: lesson.title }),
      lesson.subtitle ? dom.h('p', { class: 'cpl-lesson__subtitle', text: lesson.subtitle }) : null
    );

    const actions = dom.h('div', { class: 'cpl-lesson__actions cpl-actions' });
    const stateBtn = dom.h('button', { class: 'cpl-btn', type: 'button' });
    const stateLabel = { todo: '标记为进行中', doing: '标记为已完成', done: '已完成 ✓（点击取消）' };

    function paintState() {
      const r = CPL.progress.get(lesson.id);
      stateBtn.textContent = stateLabel[r.state] || stateLabel.todo;
      stateBtn.className = `cpl-btn${r.state === 'done' ? ' cpl-btn--primary' : ''}`;
    }

    stateBtn.addEventListener('click', () => {
      const r = CPL.progress.get(lesson.id);
      const next = r.state === 'todo' ? 'doing' : r.state === 'doing' ? 'done' : 'todo';
      CPL.progress.setState(lesson.id, next);
      paintState();
      if (next === 'done' && CPL.mastery) {
        for (const skill of CPL.mastery.skillsForLesson(lesson.id)) CPL.mastery.addEvidence(skill.id, 0.3);
        dom.toast('已标记完成，掌握度已更新', { kind: 'ok' });
      }
    });
    paintState();

    const skills = CPL.mastery ? CPL.mastery.skillsForLesson(lesson.id) : [];
    actions.append(
      stateBtn,
      dom.h('a', { class: 'cpl-btn cpl-btn--ghost cpl-btn--sm', href: `#/cards?lesson=${lesson.id}`, text: '本课卡片' })
    );

    head.append(crumb, titleRow);
    if (skills.length) {
      head.append(
        dom.h(
          'div',
          { class: 'cpl-lesson__skills' },
          dom.h('span', { class: 'cpl-muted', text: '本课覆盖技能：' }),
          ...skills.map((s) => {
            const lv = CPL.mastery.level(CPL.mastery.get(s.id).score);
            return pill(`${s.name} · ${CPL.mastery.levelLabel(lv)}`, lv === 'strong' ? 'ok' : lv === 'weak' ? 'danger' : lv === 'unknown' ? 'warn' : 'accent');
          })
        )
      );
    }
    if ((lesson.tags || []).length) {
      head.append(dom.h('div', { class: 'cpl-lesson__tags' }, lesson.tags.map((t) => pill(t))));
    }
    if (missing.length) {
      head.append(
        dom.h('div', { class: 'cpl-callout cpl-callout--caution' }, dom.h('div', { class: 'cpl-callout__body' }, dom.h('p', { text: `内容完整性提示：本课缺少 ${missing.join('、')}。` })))
      );
    }
    head.append(actions);
    void rec;
    return head;
  }

  // ─────────────────────────────────────────────────────────────
  // Anki 段
  // ─────────────────────────────────────────────────────────────
  function renderAnkiSection(lesson, meta) {
    const cards = (lesson.anki || []).map((c, i) => ({
      id: `${lesson.id}#${i}`,
      lessonId: lesson.id,
      week: lesson.week,
      deck: `计算物理CS::W${String(lesson.week || 0).padStart(2, '0')} ${lesson.title}`,
      front: c.front,
      back: c.back,
      tags: ['cphys-cs', `w${lesson.week || 0}`, ...(c.tags || [])],
      source: 'lesson',
    }));

    const wrap = dom.h('div', {});
    if (!cards.length) {
      wrap.append(dom.errorCard('这一课还没有卡片', '大纲完整性要求每课至少 1 张 Anki 卡片。', ['补充 anki 字段后重新构建']));
      return section('Anki 卡片', 'anki', wrap);
    }

    wrap.append(dom.h('p', { class: 'cpl-muted', text: `本课 ${cards.length} 张卡片。可以先在这里翻一遍，再导出到 Anki 做间隔重复。` }));

    const actions = dom.h('div', { class: 'cpl-lesson__actions' });
    actions.append(
      dom.h('button', { class: 'cpl-btn cpl-btn--primary', type: 'button', text: '开始翻卡复习', onclick: () => reviewCards(cards) }),
      dom.h('button', { class: 'cpl-btn', type: 'button', text: '导出 TSV（Anki 导入用）', onclick: () => CPL.anki.exportCards(cards, 'tsv') }),
      dom.h('button', { class: 'cpl-btn cpl-btn--ghost cpl-btn--sm', type: 'button', text: 'CSV', onclick: () => CPL.anki.exportCards(cards, 'csv') }),
      dom.h('button', { class: 'cpl-btn cpl-btn--ghost cpl-btn--sm', type: 'button', text: 'Markdown', onclick: () => CPL.anki.exportCards(cards, 'md') }),
      dom.h('button', { class: 'cpl-btn cpl-btn--ghost cpl-btn--sm', type: 'button', text: '本周 5 张', onclick: () => CPL.anki.exportCards(CPL.anki.weeklySet(lesson.week), 'tsv') })
    );

    const host = dom.h('div', { class: 'cpl-review__mount' });
    const list = dom.h('details', { class: 'cpl-cardlist' });
    list.append(dom.h('summary', { text: `展开看全部 ${cards.length} 张卡片（正面 / 背面）` }));
    for (const c of cards) {
      const item = dom.h('div', { class: 'cpl-cardlist__item' }, dom.h('div', { class: 'cpl-cardlist__front' }, md.render(c.front)), dom.h('div', { class: 'cpl-cardlist__back' }, md.render(c.back)));
      list.append(item);
    }

    wrap.append(actions, host, list);
    void meta;

    let reviewer = null;
    function reviewCards(list) {
      if (reviewer) reviewer.destroy();
      dom.clear(host);
      reviewer = CPL.anki.mountReviewer(host, list);
      addCleanup(() => reviewer && reviewer.destroy());
    }

    return section('Anki 卡片', 'anki', wrap);
  }

  // ─────────────────────────────────────────────────────────────
  // 自检清单
  // ─────────────────────────────────────────────────────────────
  function renderChecklist(lesson, meta) {
    const rec = CPL.progress.get(lesson.id);
    const items = lesson.checklist && lesson.checklist.length
      ? lesson.checklist
      : ['能不看笔记说清本课核心概念的适用条件', '练习的自动测试全部通过', '能举出自己代码里的同类例子'];

    const list = dom.h('ul', { class: 'cpl-checklist' });
    const boxes = [];

    items.forEach((text, i) => {
      const checked = Boolean(rec.checklist && rec.checklist[String(i)]);
      const box = dom.h('input', {
        type: 'checkbox',
        checked,
        onchange: () => {
          CPL.progress.toggleChecklist(lesson.id, i);
          paintProgress();
        },
      });
      boxes.push(box);
      list.append(
        dom.h('li', { class: `cpl-checklist__item${checked ? ' is-done' : ''}` }, dom.h('label', { class: 'cpl-check' }, box, dom.h('span', { text })))
      );
    });

    const bar = dom.h('div', { class: 'cpl-checklist__bar' });
    function paintProgress() {
      const r = CPL.progress.get(lesson.id);
      const total = items.length;
      const done = items.filter((_, i) => r.checklist && r.checklist[String(i)]).length;
      dom.clear(bar);
      bar.append(
        dom.h('div', { class: 'cpl-meter' },
          dom.h('span', { class: 'cpl-meter__label', text: `自检进度 ${done}/${total}` }),
          dom.h('span', { class: 'cpl-meter__track' }, dom.h('span', { class: 'cpl-meter__style cpl-meter__fill', style: { width: `${(done / total) * 100}%` } })),
          dom.h('span', { class: 'cpl-meter__value', text: `${Math.round((done / total) * 100)}%` })
        )
      );
      boxes.forEach((b, i) => {
        const li = b.closest('.cpl-checklist__item');
        if (li) li.classList.toggle('is-done', b.checked);
      });
      if (done === total && total > 0 && CPL.progress.get(lesson.id).state !== 'done') {
        CPL.progress.setState(lesson.id, 'done');
        dom.toast('自检全部勾完，已自动标记为完成', { kind: 'ok' });
      }
    }
    paintProgress();

    const notes = dom.h('textarea', {
      class: 'cpl-textarea cpl-notes',
      rows: '4',
      placeholder: '写下你自己的项目锚点：这一课的知识点让你想到自己代码里的哪一处？（这段文字只存在你的浏览器里，可导出）',
      'aria-label': '本课笔记',
    });
    notes.value = rec.notes || '';
    notes.addEventListener(
      'input',
      util.debounce(() => {
        CPL.progress.set(lesson.id, { notes: notes.value });
      }, 600)
    );

    const exportBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '导出本课笔记与自检',
      onclick: () => {
        const r = CPL.progress.get(lesson.id);
        const text = [
          `# ${lesson.title}`,
          `周次：第 ${lesson.week} 周 · 模块 ${lesson.module}`,
          '',
          '## 自检清单',
          ...items.map((t, i) => `- [${r.checklist && r.checklist[String(i)] ? 'x' : ' '}] ${t}`),
          '',
          '## 我的笔记 / 项目锚点',
          r.notes || '（空）',
          '',
          `导出时间：${new Date().toLocaleString('zh-CN')}`,
        ].join('\n');
        dom.download(`note-${lesson.id}.md`, text, 'text/markdown');
      },
    });

    return section('完成自检与笔记', 'checklist', bar, list, dom.h('div', { class: 'cpl-lesson__actions' }, exportBtn), notes);
  }

  // ─────────────────────────────────────────────────────────────
  // 上一课 / 下一课
  // ─────────────────────────────────────────────────────────────
  function renderPrevNext(lesson) {
    const all = CPL.catalog.lessons();
    const idx = all.findIndex((l) => l.id === lesson.id);
    const prev = idx > 0 ? all[idx - 1] : null;
    const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
    const nav = dom.h('nav', { class: 'cpl-prevnext', 'aria-label': '课程导航' });
    nav.append(
      prev
        ? dom.h('a', { class: 'cpl-prevnext__link', href: `#/lesson/${prev.id}` }, dom.h('span', { class: 'cpl-prevnext__dir', text: '← 上一课' }), dom.h('span', { class: 'cpl-prevnext__title', text: prev.title }))
        : dom.h('span', {}),
      next
        ? dom.h('a', { class: 'cpl-prevnext__link cpl-prevnext__link--next', href: `#/lesson/${next.id}` }, dom.h('span', { class: 'cpl-prevnext__dir', text: '下一课 →' }), dom.h('span', { class: 'cpl-prevnext__title', text: next.title }))
        : dom.h('span', {})
    );
    return nav;
  }

  /** 进度变化后刷新页面上的状态按钮等（避免整页重渲染）。 */
  function refreshProgressUi(lesson) {
    CPL.bus.emit('lesson:progress-refresh', { lessonId: lesson.id });
  }

  /** 离开课程页时释放资源（由 95-nav.js 在切换路由时调用）。 */
  lessonView.cleanup = runCleanups;
})();

/* ===== pieces/50-tests.js ===== */
/* ============================================================================
 * 50-tests.js — 课程自动测试运行器
 *
 * 课程里的 tests 有三种类型：
 *   kind:'python'  在 Pyodide 里与用户代码拼接后执行，支持 import numpy 与计时断言
 *   kind:'static'  只检查源码本身（正则/长度/是否用了某个结构），不需要运行时
 *   kind:'check'   纯前端断言函数（(ctx) => true/false），用于检查"是否做过某个交互"
 *
 * 设计要点：
 *   · 每个测试独立超时，一个测试卡住不会拖垮整页；
 *   · 输出保留 stdout/stderr，让学生看到自己的 print；
 *   · 失败信息做长度裁剪，避免把控制台刷爆；
 *   · 复杂度类测试用"规模翻倍耗时比"而不是绝对时间，跨机器可复现。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const runner = (CPL.tests = {});

  const MAX_OUTPUT = 4000;

  function clip(s, n = MAX_OUTPUT) {
    const str = String(s === undefined || s === null ? '' : s);
    return str.length > n ? str.slice(0, n) + `\n…（已裁剪 ${str.length - n} 字符）` : str;
  }

  /** 把一个测试的断言代码包装成可执行的 Python 片段。 */
  function wrapPythonTest(test, userCode) {
    return [
      'import io as _cpl_io, traceback as _cpl_tb',
      `_cpl_user = ${JSON.stringify(userCode)}`,
      `_cpl_test = ${JSON.stringify(test.assert || '')}`,
      '_cpl_ns = {}',
      '_cpl_ok = True',
      '_cpl_msg = ""',
      'try:',
      '    exec(compile(_cpl_user, "<你的代码>", "exec"), _cpl_ns)',
      '    exec(compile(_cpl_test, "<测试>", "exec"), _cpl_ns)',
      'except AssertionError as _cpl_e:',
      '    _cpl_ok = False',
      '    _cpl_msg = str(_cpl_e) or "断言失败（assert 没有给出说明文字）"',
      'except BaseException as _cpl_e:',
      '    _cpl_ok = False',
      '    _cpl_msg = type(_cpl_e).__name__ + ": " + str(_cpl_e)',
      'if not _cpl_ok:',
      '    print("__CPL_FAIL__" + _cpl_msg[:600])',
    ].join('\n');
  }

  /**
   * 运行一段用户代码（会话模式），返回 stdout/repr。
   * 测试运行器不直接用它，但课程页的"运行"按钮用它，保证与测试执行方式一致。
   */
  runner.runCode = function runCode(code, opts = {}) {
    const runPython = opts.runPython || ((src, o) => CPL.runtimes.runPython(src, o));
    return runPython(code, { timeoutMs: opts.timeoutMs || CPL.config.runTimeoutMs, namespace: true, resetNamespace: true, onStatus: opts.onStatus });
  };

  /**
   * 剥掉注释与字符串字面量，只留下"可执行代码"。
   *
   * 为什么必须做：static 规则的意图是"学生是否真的这么写了"。
   * 但 starter 里通常有一句 "TODO: 用 heapq 维护小顶堆" 这样的注释，
   * 直接对源码做正则就会命中注释，导致规则永远通过——测试形同虚设。
   * （这个坑是真实踩到的：week-13 的 `mustMatch: 'heapq'` 连 starter 都放行。）
   */
  function stripCommentsAndStrings(src) {
    let out = '';
    let i = 0;
    const n = src.length;
    while (i < n) {
      const c = src[i];
      // 三引号字符串
      if ((c === '"' || c === "'") && src[i + 1] === c && src[i + 2] === c) {
        const q = c + c + c;
        i += 3;
        const end = src.indexOf(q, i);
        i = end < 0 ? n : end + 3;
        out += '""';
        continue;
      }
      // 单引号 / 双引号字符串（处理转义）
      if (c === '"' || c === "'") {
        const quote = c;
        i++;
        while (i < n) {
          if (src[i] === '\\') {
            i += 2;
            continue;
          }
          if (src[i] === quote) {
            i++;
            break;
          }
          i++;
        }
        out += '""';
        continue;
      }
      // 注释
      if (c === '#') {
        while (i < n && src[i] !== '\n') i++;
        continue;
      }
      out += c;
      i++;
    }
    return out;
  }
  runner.stripCommentsAndStrings = stripCommentsAndStrings;

  /** static 类型：用正则/长度断言源码。规则都在课程文件里，这里只提供执行器。 */
  function runStaticTest(test, code) {
    const raw = String(code || '');
    // 默认对"去掉注释与字符串"的代码做匹配；规则可用 target:'raw' 显式要求原始源码
    const scoped = (rule) => (rule.target === 'raw' ? raw : stripCommentsAndStrings(raw));
    const failures = [];
    for (const rule of rules(test)) {
      const src = scoped(rule);
      try {
        if (rule.mustMatch && !new RegExp(rule.mustMatch, rule.flags || 'm').test(src)) {
          failures.push(rule.message || `应匹配 ${rule.mustMatch}`);
        }
        if (rule.mustNotMatch && new RegExp(rule.mustNotMatch, rule.flags || 'm').test(src)) {
          failures.push(rule.message || `不应匹配 ${rule.mustNotMatch}`);
        }
        if (rule.minLength && src.length < rule.minLength) {
          failures.push(rule.message || `可执行代码长度不足 ${rule.minLength} 字符（当前 ${src.length}）`);
        }
      } catch (err) {
        failures.push(`规则本身有误：${dom.friendlyError(err)}`);
      }
    }
    return { passed: failures.length === 0, message: failures.join('；'), stdout: '', stderr: '', ms: 0 };
  }

  function rules(test) {
    return test.rules || [];
  }
  runner.runStaticTest = runStaticTest;

  /**
   * 运行一课的全部测试。
   * @param {object} lesson
   * @param {string} code
   * @param {{onProgress?:Function, runPython?:Function, signal?:{aborted:boolean}}} opts
   * @returns {Promise<{results:Array, passed:number, total:number, ms:number}>}
   */
  runner.run = async function run(lesson, code, opts = {}) {
    const tests = (lesson && lesson.tests) || [];
    const results = [];
    const t0 = performance.now();
    const runPython = opts.runPython || ((src, o) => CPL.runtimes.runPython(src, o));

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      if (opts.signal && opts.signal.aborted) break;
      if (opts.onProgress) opts.onProgress({ index: i, total: tests.length, name: test.name });

      const kind = test.kind || 'python';

      if (kind === 'static') {
        const r = runStaticTest(test, code);
        results.push({ name: test.name, kind, ...r });
        continue;
      }

      if (kind === 'check') {
        let passed = false;
        let message = '';
        try {
          passed = Boolean(test.run ? test.run({ code, lesson, CPL }) : false);
        } catch (err) {
          message = dom.friendlyError(err);
        }
        results.push({ name: test.name, kind, passed, message, stdout: '', stderr: '', ms: 0 });
        continue;
      }

      // python
      const wrapped = wrapPythonTest(test, code);
      const out = await runPython(wrapped, {
        timeoutMs: test.timeoutMs || CPL.config.runTimeoutMs,
        // 每条测试都在干净命名空间里执行（用户代码在测试内部被 exec 一遍），
        // 这样测试之间不会互相污染变量。
        namespace: false,
        onStatus: opts.onStatus,
      });

      let stdout = clip(out.stdout || '');
      let stderr = clip(out.stderr || '');
      let passed = false;
      let message = '';

      if (!out.ok) {
        message = out.message || '执行失败';
        // 区分"环境问题"与"代码问题"，避免学生以为是自己的错
        if (/超时|timeout/i.test(message)) message = `测试超时：${message}`;
        if (/Pyodide|WebAssembly|无法加载/.test(message)) message = `运行环境不可用：${message}`;
      } else {
        const failMatch = /__CPL_FAIL__([\s\S]*)$/.exec(stdout);
        if (failMatch) {
          passed = false;
          message = failMatch[1].trim();
          stdout = stdout.replace(/__CPL_FAIL__[\s\S]*$/, '');
        } else {
          passed = true;
        }
        if (!passed && !message) message = '断言失败（未给出原因，检查 assert 是否写全）';
        if (stderr) {
          // stderr 里有 traceback 但断言通过了（例如学生自己 print 到 stderr），只提示不判负
          message = message || '';
        }
      }

      results.push({
        name: test.name,
        kind,
        passed,
        message: clip(message, 900),
        stdout,
        stderr,
        ms: Math.round(out.ms || 0),
        hint: test.hint || '',
      });
    }

    const passed = results.filter((r) => r.passed).length;
    const summary = { results, passed, total: tests.length, ms: Math.round(performance.now() - t0) };

    if (lesson && lesson.id && tests.length) {
      CPL.progress.recordRun(lesson.id, { passed, total: tests.length, ms: summary.ms });
      // 证据分：全部通过给该课程覆盖的技能 +0.4
      if (passed === tests.length && CPL.mastery) {
        for (const skill of CPL.mastery.skillsForLesson(lesson.id)) {
          CPL.mastery.addEvidence(skill.id, 0.4);
        }
      }
    }
    CPL.bus.emit('tests:finished', { lessonId: lesson && lesson.id, ...summary });
    return summary;
  };

  // ─────────────────────────────────────────────────────────────
  // 结果渲染
  // ─────────────────────────────────────────────────────────────
  runner.render = function render(summary) {
    const wrap = dom.h('div', { class: 'cpl-tests' });
    const allPassed = summary.total > 0 && summary.passed === summary.total;

    wrap.append(
      dom.h(
        'div',
        { class: `cpl-tests__summary ${allPassed ? 'is-pass' : summary.passed ? 'is-partial' : 'is-fail'}` },
        dom.h('span', { class: 'cpl-tests__score', text: `${summary.passed} / ${summary.total}` }),
        dom.h('span', { class: 'cpl-tests__label', text: allPassed ? '全部通过' : summary.passed ? '部分通过' : '未通过' }),
        dom.h('span', { class: 'cpl-tests__time', text: `${(summary.ms / 1000).toFixed(2)} s` })
      )
    );

    const list = dom.h('ul', { class: 'cpl-tests__list' });
    for (const r of summary.results) {
      const item = dom.h('li', { class: `cpl-tests__item ${r.passed ? 'is-pass' : 'is-fail'}` });
      item.append(
        dom.h(
          'div',
          { class: 'cpl-tests__head' },
          dom.h('span', { class: 'cpl-tests__icon', 'aria-hidden': 'true', text: r.passed ? '✓' : '✗' }),
          dom.h('span', { class: 'cpl-tests__name', text: r.name }),
          dom.h('span', { class: 'cpl-tests__kind', text: r.kind }),
          r.ms ? dom.h('span', { class: 'cpl-tests__ms', text: `${r.ms} ms` }) : null
        )
      );
      if (r.message) {
        item.append(dom.h('pre', { class: 'cpl-tests__msg', text: r.message }));
      }
      if (r.stdout) {
        const details = dom.h('details', { class: 'cpl-tests__out' });
        details.append(dom.h('summary', { text: '程序输出' }), dom.h('pre', { text: r.stdout }));
        item.append(details);
      }
      list.append(item);
    }
    wrap.append(list);
    return wrap;
  };
})();

/* ===== pieces/55-highlight.js ===== */
/* ============================================================================
 * 55-highlight.js — 轻量语法高亮（Python / Fortran / C++ / JS / bash）
 *
 * 目标不是"完美的语言解析"，而是让课程里的代码块一眼可读。
 * 采用 sticky 正则逐位置扫描，先切 token 再统一转义 —— 因此不存在
 * "转义后的 &lt; 被当成运算符"这类经典 bug。
 * 未知语言原样显示（只转义，不高亮），不报错。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const hl = (CPL.highlight = {});

  const esc = dom.esc;

  /** 关键字表：长词在前，避免 'end' 抢先匹配 'enddo'。 */
  function words(list) {
    return list
      .slice()
      .sort((a, b) => b.length - a.length)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
  }

  const PY_KW = [
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
    'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in',
    'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with',
    'yield', 'match', 'case', 'self', 'cls',
  ];
  const PY_BUILTIN = [
    'print', 'len', 'range', 'enumerate', 'zip', 'map', 'filter', 'sum', 'min', 'max', 'abs', 'round',
    'sorted', 'list', 'dict', 'set', 'tuple', 'int', 'float', 'str', 'bool', 'complex', 'bytes',
    'open', 'isinstance', 'type', 'super', 'repr', 'format', 'any', 'all', 'pow', 'divmod', 'next',
    'iter', 'hasattr', 'getattr', 'setattr', 'property', 'staticmethod', 'classmethod', 'Exception',
    'ValueError', 'TypeError', 'KeyError', 'IndexError', 'RuntimeError', 'ZeroDivisionError',
  ];
  const PY_EXC = ['np', 'numpy', 'scipy', 'plt', 'matplotlib', 'pd', 'pandas', 'math', 'time', 'random', 'os', 'sys', 'json'];

  const F_KW = [
    'program', 'endprogram', 'module', 'endmodule', 'submodule', 'subroutine', 'endsubroutine',
    'function', 'endfunction', 'interface', 'endinterface', 'procedure', 'contains', 'use', 'only',
    'implicit', 'none', 'integer', 'real', 'complex', 'character', 'logical', 'type', 'class',
    'endtype', 'kind', 'parameter', 'dimension', 'allocatable', 'allocate', 'deallocate', 'pointer',
    'target', 'intent', 'in', 'out', 'inout', 'optional', 'public', 'private', 'protected', 'save',
    'external', 'intrinsic', 'pure', 'elemental', 'recursive', 'result', 'if', 'then', 'elseif',
    'else', 'endif', 'do', 'enddo', 'while', 'select', 'case', 'endselect', 'default', 'where',
    'elsewhere', 'endwhere', 'forall', 'call', 'return', 'stop', 'error', 'continue', 'cycle',
    'exit', 'go', 'to', 'goto', 'write', 'read', 'print', 'open', 'close', 'format', 'namelist',
    'associate', 'block', 'endblock', 'critical', 'enum', 'enumerator', 'generic', 'bind', 'value',
    'abstract', 'deferred', 'extends', 'final', 'import', 'sequence', 'codimension', 'sync', 'all',
    'images', 'memory', 'team', 'event', 'post', 'wait', 'lock', 'unlock', 'errorstop', 'non_overridable',
    'omp', 'parallel', 'end', 'omp', 'critical', 'atomic', 'simd', 'do', 'sections', 'single', 'master',
    'taskwait', 'barrier', 'flush', 'threadprivate', 'reduction', 'schedule', 'shared', 'firstprivate',
    'lastprivate', 'collapse', 'num_threads', 'use_device',
  ];
  const F_TYPES = [
    'int8', 'int16', 'int32', 'int64', 'real32', 'real64', 'real128', 'kind', 'len', 'selected_real_kind',
    'selected_int_kind', 'huge', 'tiny', 'epsilon', 'maxval', 'minval', 'sum', 'product', 'dot_product',
    'matmul', 'transpose', 'reshape', 'spread', 'pack', 'unpack', 'cshift', 'eoshift', 'size', 'shape',
    'lbound', 'ubound', 'allocated', 'associated', 'present', 'merge', 'modulo', 'mod', 'abs', 'sqrt',
    'exp', 'log', 'log10', 'sin', 'cos', 'tan', 'atan', 'atan2', 'asin', 'acos', 'sinh', 'cosh', 'tanh',
    'floor', 'ceiling', 'nint', 'aint', 'anint', 'sign', 'dim', 'max', 'min', 'random_number',
    'random_seed', 'cpu_time', 'system_clock', 'dble', 'cmplx', 'transfer', 'trim', 'adjustl',
    'adjustr', 'len_trim', 'index', 'scan', 'verify', 'repeat', 'achar', 'iachar', 'char', 'ichar',
    'not', 'and', 'or', 'xor', 'eqv', 'neqv', 'ieor', 'iand', 'ior', 'ibits', 'ishft',
  ];

  const CPP_KW = [
    'alignas', 'alignof', 'asm', 'auto', 'break', 'case', 'catch', 'class', 'concept', 'const',
    'consteval', 'constexpr', 'constinit', 'const_cast', 'continue', 'co_await', 'co_return',
    'co_yield', 'decltype', 'default', 'delete', 'do', 'dynamic_cast', 'else', 'enum', 'explicit',
    'export', 'extern', 'false', 'final', 'for', 'friend', 'goto', 'if', 'inline', 'mutable',
    'namespace', 'new', 'noexcept', 'nullptr', 'operator', 'override', 'private', 'protected',
    'public', 'register', 'reinterpret_cast', 'requires', 'return', 'sizeof', 'static', 'static_assert',
    'static_cast', 'struct', 'switch', 'template', 'this', 'thread_local', 'throw', 'true', 'try',
    'typedef', 'typeid', 'typename', 'union', 'using', 'virtual', 'volatile', 'while', 'int', 'long',
    'short', 'char', 'bool', 'float', 'double', 'void', 'unsigned', 'signed', 'wchar_t', 'char8_t',
    'char16_t', 'char32_t', 'size_t', 'std', 'omp', 'pragma', 'include', 'define', 'ifdef', 'ifndef',
    'endif', 'if', 'else', 'elif',
  ];

  const SH_KW = ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'in', 'export', 'local', 'return', 'source', 'set', 'cd', 'echo', 'printf', 'grep', 'sed', 'awk', 'find', 'make', 'cmake', 'python3', 'pip', 'git', 'gfortran', 'mpirun', 'mpiexec', 'g++', 'clang++', 'valgrind', 'perf', 'nvidia-smi'];

  /**
   * 语言定义：顺序即优先级。
   * kind: 'comment' | 'string' | 'number' | 'keyword' | 'type' | 'function' | 'preproc'
   */
  function defs(lang) {
    const L = String(lang || '').toLowerCase();
    const py = L === 'python' || L === 'py' || L === 'python3';
    const f = L === 'fortran' || L === 'f90' || L === 'f95' || L === 'f03' || L === 'f08' || L === 'f';
    const cpp = ['c', 'h', 'cpp', 'c++', 'cc', 'cxx', 'hpp', 'cuda', 'cu'].includes(L);
    const js = ['js', 'javascript', 'ts', 'typescript', 'json'].includes(L);
    const sh = ['bash', 'sh', 'shell', 'zsh', 'console'].includes(L);

    const set = [];
    const ci = f; // Fortran 大小写不敏感

    if (f) {
      set.push({ kind: 'comment', re: /!.*/y });
      set.push({ kind: 'string', re: /'(?:[^']|'')*'|"(?:[^"]|"")*"/y });
    } else if (sh) {
      set.push({ kind: 'comment', re: /#.*/y });
      set.push({ kind: 'string', re: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/y });
    } else {
      set.push({ kind: 'comment', re: /\/\*[\s\S]*?\*\//y });
      set.push({ kind: 'comment', re: /\/\/.*/y });
      if (py) set.push({ kind: 'comment', re: /#.*/y });
      set.push({ kind: 'string', re: /"""[\s\S]*?"""|'''[\s\S]*?'''/y });
      set.push({ kind: 'string', re: /[rbfu]{0,2}"(?:[^"\\]|\\.)*"|[rbfu]{0,2}'(?:[^'\\]|\\.)*'/y });
    }

    set.push({ kind: 'preproc', re: /^\s*#\s*(?:include|define|ifdef|ifndef|endif|pragma|if|else|elif|undef|error)\b.*/my });
    set.push({ kind: 'number', re: /0[xX][0-9a-fA-F_]+|0[bB][01_]+|\d[\d_]*(?:\.[\d_]*)?(?:[eEdD][-+]?\d+)?(?:_\w+)?/y });

    if (f) {
      set.push({ kind: 'keyword', re: new RegExp(`\\b(?:${words(F_KW)})\\b`, ci ? 'iy' : 'y') });
      set.push({ kind: 'type', re: new RegExp(`\\b(?:${words(F_TYPES)})\\b`, ci ? 'iy' : 'y') });
    } else if (cpp) {
      set.push({ kind: 'keyword', re: new RegExp(`\\b(?:${words(CPP_KW)})\\b`, 'y') });
      set.push({ kind: 'type', re: /\b[A-Z][A-Za-z0-9_]*\b|\b(?:std|Eigen|MPI|omp)::?\w*/y });
    } else if (py) {
      set.push({ kind: 'keyword', re: new RegExp(`\\b(?:${words(PY_KW)})\\b`, 'y') });
      set.push({ kind: 'type', re: new RegExp(`\\b(?:${words(PY_BUILTIN)})\\b`, 'y') });
      set.push({ kind: 'type', re: new RegExp(`\\b(?:${words(PY_EXC)})\\b`, 'y') });
    } else if (sh) {
      set.push({ kind: 'keyword', re: new RegExp(`\\b(?:${words(SH_KW)})\\b`, 'y') });
    } else if (js) {
      set.push({
        kind: 'keyword',
        re: /\b(?:const|let|var|function|return|if|else|for|while|class|new|import|export|from|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false|this|super|of|in|yield|static|get|set)\b/y,
      });
      set.push({ kind: 'type', re: /\b[A-Z][A-Za-z0-9_]*\b/y });
    }

    // 函数调用：标识符紧跟 (
    if (py || js || cpp || f) set.push({ kind: 'function', re: /[A-Za-z_]\w*(?=\s*\()/y });

    return set;
  }

  /**
   * 高亮为 HTML（已转义）。
   * @param {string} code
   * @param {string} lang
   * @returns {string}
   */
  hl.render = function render(code, lang) {
    const src = String(code === undefined || code === null ? '' : code);
    const set = defs(lang);
    if (!set.length) return esc(src);

    let out = '';
    let i = 0;
    const n = src.length;
    // 每个模式独立维护 lastIndex
    let guard = 0;

    while (i < n) {
      if (++guard > n * 4 + 1000) break; // 防御性上限，避免正则死循环
      let matched = false;

      for (const { kind, re } of set) {
        re.lastIndex = i;
        const m = re.exec(src);
        if (!m || m.index !== i || !m[0].length) continue;
        out += `<span class="cpl-tok-${kind}">${esc(m[0])}</span>`;
        i += m[0].length;
        matched = true;
        break;
      }

      if (!matched) {
        // 普通字符：标识符残段（未命中关键字/函数）或单个运算符
        let j = i;
        if (/[A-Za-z0-9_]/.test(src[j])) {
          while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
        } else if (/\s/.test(src[j])) {
          while (j < n && /\s/.test(src[j])) j++;
        } else {
          j = i + 1;
        }
        out += esc(src.slice(i, j));
        i = j;
      }
    }
    return out;
  };

  /** 就地高亮一个 <code> 元素（读 textContent，写回 span 序列）。 */
  hl.apply = function apply(codeEl, lang) {
    if (!codeEl) return;
    if (codeEl.dataset.cplHighlighted === '1') return;
    const raw = codeEl.textContent || '';
    codeEl.innerHTML = hl.render(raw, lang || codeEl.dataset.lang || '');
    codeEl.dataset.cplHighlighted = '1';
  };

  /** 全站自动高亮：渲染完视图后扫描 .cpl-pre code。 */
  hl.applyAll = function applyAll(root) {
    for (const codeEl of CPL.dom.qsa('.cpl-pre code, pre[data-lang] code', root || document)) {
      const block = codeEl.closest('[data-lang]');
      const lang = block ? block.dataset.lang : '';
      hl.apply(codeEl, lang);
    }
  };

  CPL.bus.on('app:mounted', () => {
    hl.applyAll();
    // 视图切换后也补一次（导航渲染完成后触发）
    CPL.bus.on('view:rendered', () => hl.applyAll());
  });

  hl.languages = ['python', 'fortran', 'cpp', 'c', 'javascript', 'bash', 'text'];
})();

/* ===== pieces/60-runtimes.js ===== */
/* ============================================================================
 * 60-runtimes.js — 浏览器内代码执行与静态检查
 *
 * 事实基础（2026 年核实，见 README「运行时能力与限制」）：
 *   · Python：**完整可用**。Pyodide 314.0.7（CPython 3.14.2 → WASM）。
 *     自 314.0.0 起 classic worker（importScripts）被移除，**必须用 module worker**。
 *     core ≈ 13.5 MB，numpy wheel ≈ 2.9 MB（CDN 不重压缩 wheel）。
 *   · Fortran：**浏览器内无法可靠执行**。LFortran 有真实的 WASM 构建，
 *     但官方自称 alpha（"expected to not work on third-party codes"）；
 *     且在 GitHub Pages 上拿不到 COOP/COEP，JupyterLite 内核存在随机启动挂起。
 *     本平台因此提供：静态检查 + 参考实现 + 一键复制本地运行命令 + 官方在线编译器链接。
 *     **不假装它能跑。**
 *   · C++：同上。真 clang WASM 约 20 MB（gzip 后仍需下载解压），不塞进首屏。
 *
 * 安全边界（执行 Python 时）：
 *   · 在 Worker 内运行 → 没有 DOM、没有 window、不共享父页面内存；
 *   · 超时 12 秒硬 terminate（防死循环冻死页面）；
 *   · 屏蔽 subprocess / socket / os.system / os.fork / 文件写；
 *   · 单次输出长度上限，防 print 洪水；
 *   · 页面侧只接收字符串，不接收任何可执行对象。
 *   ⚠ 这套屏蔽是"防误用"，不是安全沙箱（Pyodide 内可以访问 js 桥）。
 *     真正的边界是 Worker + 超时 + 不加载不可信第三方代码。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const rt = (CPL.runtimes = {});

  // ─────────────────────────────────────────────────────────────
  // Worker 主体
  //
  // 直接写成真实函数，再用 Function.prototype.toString() 序列化进 Worker。
  // 这样不需要转义，也不会因为模板字符串里出现 ${} 而语法错乱。
  // ─────────────────────────────────────────────────────────────
  function pythonWorkerMain() {
    let pyodide = null;
    let loading = null;
    let ns = null;

    function post(type, payload) {
      self.postMessage(Object.assign({ type: type }, payload || {}));
    }

    function init(url) {
      if (pyodide) return Promise.resolve(pyodide);
      if (loading) return loading;
      loading = import(url)
        .then(function (mod) {
          return mod.loadPyodide({ indexURL: url.replace(/pyodide\.mjs$/, '') });
        })
        .then(function (py) {
          pyodide = py;
          // 屏蔽在浏览器里不可能工作、或会带来风险的入口。
          py.runPython(
            [
              'import builtins, os',
              '',
              'class _Blocked:',
              '    def __init__(self, what):',
              '        self.what = what',
              '    def __call__(self, *a, **k):',
              '        raise RuntimeError(self.what + " 在浏览器沙箱里被禁用；请在本地运行")',
              '',
              'try:',
              '    import subprocess',
              '    subprocess.Popen = _Blocked("subprocess")',
              '    subprocess.run = _Blocked("subprocess")',
              '    subprocess.call = _Blocked("subprocess")',
              'except Exception:',
              '    pass',
              'try:',
              '    import socket',
              '    socket.socket = _Blocked("socket")',
              'except Exception:',
              '    pass',
              'try:',
              '    os.system = _Blocked("os.system")',
              '    os.fork = _Blocked("os.fork")',
              'except Exception:',
              '    pass',
              '_real_open = builtins.open',
              'def _guarded_open(file, mode="r", *a, **k):',
              '    if any(c in mode for c in "wax+"):',
              '        p = str(file)',
              '        if not p.startswith("/tmp"):',
              '            raise RuntimeError("浏览器沙箱里禁止写文件；请在本地运行")',
              '    return _real_open(file, mode, *a, **k)',
              'builtins.open = _guarded_open',
            ].join('\n')
          );
          post('ready', { python: py.version });
          return py;
        })
        .catch(function (err) {
          loading = null;
          post('fatal', { message: String((err && err.message) || err) });
          throw err;
        });
      return loading;
    }

    function loadPackages(names) {
      if (!names.length) return Promise.resolve();
      post('status', { message: '正在加载包：' + names.join(', ') + '（首次约 3 MB，之后走浏览器缓存）' });
      return pyodide.loadPackage(names, {
        messageCallback: function (m) {
          post('status', { message: m });
        },
      });
    }

    /**
     * 把用户代码包进 stdout/stderr 捕获器，并在同一命名空间里执行。
     *
     * ⚠ 这里必须**显式**把捕获结果写到真正的 stdout，不能依赖"最后一行表达式的值"。
     *   Python 只在交互式 REPL 里才显示表达式结果；`python -c` 与 Pyodide 的
     *   runPython 都不会。早期版本把 `_cpl_out.getvalue()` 当作最后一条语句，
     *   结果页面拿到的 stdout 永远是空字符串——测试全部"通过"但什么都没测到。
     *   这个 bug 用一个必然失败的断言才暴露出来。
     *
     * 输出协议（供 Node 侧的 scripts/verify-python.mjs 解析；浏览器侧不用它，
     * 而是直接分别读取 _cpl_out / _cpl_err 两个缓冲区）：
     *   \x1eCPL_OUT\x1e<stdout>\x1cCPL_ERR\x1c<stderr>\x1d
     * 用不可打印字符做分隔，避免与用户输出冲突。
     */
    function buildRunCode(src) {
      // 空行不加缩进：否则用户代码里的多行字符串会多出尾随空格，
      // 而空行加缩进本身在 Python 里也会引发 IndentationError。
      const lines = src.split('\n').map(function (l) {
        return l.length ? '    ' + l : '';
      });
      return [
        'import sys as _cpl_sys, io as _cpl_io',
        '_cpl_real_out = _cpl_sys.__stdout__',
        '_cpl_out = _cpl_io.StringIO()',
        '_cpl_err = _cpl_io.StringIO()',
        '_cpl_saved = (_cpl_sys.stdout, _cpl_sys.stderr)',
        '_cpl_sys.stdout = _cpl_out',
        '_cpl_sys.stderr = _cpl_err',
        'try:',
        ...lines,
        'except BaseException:',
        '    import traceback as _cpl_tb',
        '    _cpl_err.write(_cpl_tb.format_exc())',
        'finally:',
        '    _cpl_sys.stdout = _cpl_saved[0]',
        '    _cpl_sys.stderr = _cpl_saved[1]',
        '_cpl_real_out.write("\\x1eCPL_OUT\\x1e" + _cpl_out.getvalue() + "\\x1cCPL_ERR\\x1c" + _cpl_err.getvalue() + "\\x1d")',
        '_cpl_real_out.flush()',
      ].join('\n');
    }

    self.onmessage = async function (event) {
      const data = event.data || {};
      const id = data.id;

      if (data.type === 'init') {
        try {
          await init(data.url);
          post('done', { id: id });
        } catch (err) {
          post('error', { id: id, message: String((err && err.message) || err) });
        }
        return;
      }

      if (data.type === 'run') {
        const t0 = performance.now();
        const src = String(data.code || '');
        try {
          await init(data.url);

          const guessed = [];
          if (/\b(import|from)\s+numpy|\bnp\./.test(src)) guessed.push('numpy');
          if (/\b(import|from)\s+scipy|\bsp\./.test(src)) guessed.push('scipy');
          if (/\b(import|from)\s+matplotlib|\bplt\./.test(src)) guessed.push('matplotlib');
          const packages = guessed.filter(function (n, i) {
            return guessed.indexOf(n) === i;
          });
          await loadPackages(packages);

          // 会话模式：用户代码与后续测试共用一个 Python 命名空间字典。
          // globals 必须传 Python dict（PyProxy），不能传普通 JS 对象。
          if (data.namespace && (data.resetNamespace || !ns)) {
            if (ns && ns.destroy) {
              try {
                ns.destroy();
              } catch (e0) {
                /* 忽略 */
              }
            }
            ns = pyodide.runPython('{}');
          }
          const opts = data.namespace ? { globals: ns } : undefined;

          pyodide.runPython(buildRunCode(src), opts);
          // 用独立的 runPython 调用把两个缓冲区取出来。
          // （不要依赖"最后一条表达式的值"——那只在 REPL 里有效。）
          var stdout = '';
          var stderr = '';
          try {
            stdout = String(pyodide.runPython('_cpl_out.getvalue()', opts) || '');
          } catch (eOut) {
            stdout = '';
          }
          try {
            stderr = String(pyodide.runPython('_cpl_err.getvalue()', opts) || '');
          } catch (eErr) {
            stderr = '';
          }

          post('result', {
            id: id,
            stdout: stdout,
            stderr: stderr,
            ms: performance.now() - t0,
            packages: packages,
          });
        } catch (err) {
          post('error', {
            id: id,
            message: String((err && err.message) || err),
            stdout: '',
            stderr: '',
            ms: performance.now() - t0,
          });
        }
        return;
      }

      if (data.type === 'reset') {
        try {
          if (ns && ns.destroy) ns.destroy();
        } catch (e) {
          /* 忽略 */
        }
        ns = null;
        pyodide = null;
        loading = null;
        post('reset', { id: id });
      }
    };
  }

  /** Pyodide 完全不可用时的降级 Worker：明确报错，绝不静默假装成功。 */
  function minimalWorkerMain() {
    self.onmessage = function (e) {
      const d = e.data || {};
      if (d.type === 'init') {
        self.postMessage({ type: 'ready', python: '已降级（未加载 Pyodide）' });
        return;
      }
      if (d.type === 'run') {
        self.postMessage({
          id: d.id,
          type: 'error',
          message:
            '当前环境无法加载 Pyodide（可能是离线、CDN 被拦截，或浏览器禁用了 WebAssembly）。Python 代码没有被执行。',
          hint: '检查网络后重试；或把代码复制到本地用 python3 运行。',
          ms: 0,
        });
      }
    };
  }

  function makeWorkerBlob(fn) {
    const source = `'use strict';\n(${fn.toString()})();\n`;
    return URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  }

  // ─────────────────────────────────────────────────────────────
  // Worker 生命周期
  // ─────────────────────────────────────────────────────────────
  const state = {
    worker: null,
    ready: false,
    loading: false,
    minimal: false,
    pending: new Map(),
    seq: 0,
    lastError: null,
  };

  rt.pyStatus = () => ({
    ready: state.ready,
    loading: state.loading,
    minimal: state.minimal,
    error: state.lastError,
    cdnAllowed: CPL.config.allowCdn && CPL.prefs.get('enableCdn') !== false,
  });

  function spawnWorker() {
    if (state.worker) return state.worker;
    try {
      state.worker = new Worker(makeWorkerBlob(pythonWorkerMain), { type: 'module' });
    } catch (err) {
      CPL.log('warn', 'module worker 创建失败，降级为纯报错模式', dom.friendlyError(err));
      state.worker = new Worker(makeWorkerBlob(minimalWorkerMain));
      state.minimal = true;
    }
    state.worker.onmessage = onWorkerMessage;
    state.worker.onerror = (e) => {
      CPL.log('error', 'Python worker 崩溃', e.message);
      state.ready = false;
      state.loading = false;
      rejectAll(new Error(e.message || 'Python 运行时崩溃'));
    };
    return state.worker;
  }

  function rejectAll(err) {
    for (const [, entry] of state.pending) entry.reject(err);
    state.pending.clear();
  }

  function onWorkerMessage(event) {
    const msg = event.data || {};
    if (msg.type === 'ready') {
      state.ready = true;
      state.loading = false;
      CPL.log('info', 'Python 运行时就绪：', msg.python || '');
      CPL.bus.emit('runtime:ready', { lang: 'python', version: msg.python });
      return;
    }
    if (msg.type === 'fatal') {
      state.loading = false;
      state.lastError = msg.message;
      CPL.bus.emit('runtime:error', { lang: 'python', message: msg.message });
      return;
    }
    if (msg.type === 'status') {
      CPL.bus.emit('runtime:status', { lang: 'python', message: msg.message });
      const entry = state.pending.get(Number(msg.id));
      if (entry && entry.onStatus) entry.onStatus(msg.message);
      return;
    }
    const entry = state.pending.get(Number(msg.id));
    if (!entry) return;
    state.pending.delete(Number(msg.id));
    clearTimeout(entry.timer);
    entry.resolve({ ok: msg.type === 'result', ...msg });
  }

  /** 确保运行时可用（首次约 13.5 MB，之后走浏览器缓存）。 */
  rt.ensurePython = function ensurePython(onStatus) {
    if (!CPL.config.allowCdn || CPL.prefs.get('enableCdn') === false) {
      return Promise.reject(
        new Error('第三方 CDN 已被禁用（设置里关闭了）。请在设置里打开，或把 Pyodide 自托管到本站 /pyodide/ 后修改 config.cdn.pyodideModule。')
      );
    }
    if (typeof Worker === 'undefined' || typeof WebAssembly === 'undefined') {
      return Promise.reject(new Error('当前浏览器不支持 Web Worker 或 WebAssembly，无法在浏览器内运行 Python。'));
    }
    if (state.ready) return Promise.resolve(true);
    if (state.loading) {
      return new Promise((resolve, reject) => {
        const off = CPL.bus.on('runtime:ready', () => {
          off();
          offErr();
          resolve(true);
        });
        const offErr = CPL.bus.on('runtime:error', (e) => {
          off();
          offErr();
          reject(new Error(e.message));
        });
      });
    }

    state.loading = true;
    state.lastError = null;
    if (onStatus) onStatus('正在下载 Python 运行时（约 13.5 MB，仅首次；之后走浏览器缓存）…');

    const worker = spawnWorker();
    const id = ++state.seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        state.pending.delete(id);
        state.loading = false;
        reject(new Error('Python 运行时加载超时（60 秒）。检查网络，或稍后重试。'));
      }, 60000);
      state.pending.set(id, {
        timer,
        resolve: (m) => {
          if (m.ok) resolve(true);
          else {
            state.loading = false;
            state.lastError = m.message;
            reject(new Error(m.message));
          }
        },
        reject: (err) => {
          state.loading = false;
          reject(err);
        },
      });
      worker.postMessage({ type: 'init', id, url: CPL.config.cdn.pyodideModule });
    });
  };

  /**
   * 运行 Python 代码。
   * @param {string} code
   * @param {{timeoutMs?:number, onStatus?:Function, namespace?:boolean, resetNamespace?:boolean}} opts
   * @returns {Promise<{ok:boolean, stdout:string, stderr:string, ms:number, message?:string}>}
   */
  rt.runPython = async function runPython(code, opts = {}) {
    const timeout = opts.timeoutMs || CPL.config.runTimeoutMs;
    try {
      await rt.ensurePython(opts.onStatus);
    } catch (err) {
      return { ok: false, stdout: '', stderr: '', ms: 0, message: dom.friendlyError(err) };
    }

    const worker = spawnWorker();
    const id = ++state.seq;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        // 硬超时：终止 Worker 并重建干净实例，防止死循环拖死页面
        state.pending.delete(id);
        try {
          worker.terminate();
        } catch {
          /* 忽略 */
        }
        state.worker = null;
        state.ready = false;
        state.loading = false;
        resolve({
          ok: false,
          stdout: '',
          stderr: '',
          ms: timeout,
          message: `执行超时（超过 ${(timeout / 1000).toFixed(0)} 秒），已强制终止运行时。检查是否有死循环，或把 N 调小。`,
        });
      }, timeout);

      state.pending.set(id, {
        timer,
        resolve: (m) => resolve(m),
        reject: (err) => resolve({ ok: false, stdout: '', stderr: '', ms: 0, message: dom.friendlyError(err) }),
        onStatus: opts.onStatus,
      });

      worker.postMessage({
        type: 'run',
        id,
        code,
        url: CPL.config.cdn.pyodideModule,
        namespace: Boolean(opts.namespace),
        resetNamespace: Boolean(opts.resetNamespace),
      });
    });
  };

  rt.resetPython = function resetPython() {
    if (state.worker) {
      try {
        state.worker.postMessage({ type: 'reset', id: ++state.seq });
      } catch {
        /* 忽略 */
      }
      try {
        state.worker.terminate();
      } catch {
        /* 忽略 */
      }
    }
    state.worker = null;
    state.ready = false;
    state.loading = false;
    state.pending.clear();
    CPL.bus.emit('runtime:reset', { lang: 'python' });
  };

  // ─────────────────────────────────────────────────────────────
  // 静态检查：Fortran / C++（不执行，只做可验证的检查）
  // ─────────────────────────────────────────────────────────────
  const FORTRAN_RULES = [
    {
      level: 'error',
      re: /(?:^|\n)[^\n!]*\b([A-Za-z_]\w*)\s*\(\s*0\s*[,)]/,
      msg: '数组下标出现了 0。Fortran 默认下标从 1 开始，除非显式声明了 0 下界，否则这是越界。',
    },
    {
      level: 'error',
      re: /\b(?:real|integer|logical|character)\s*\(\s*kind\s*=\s*(?!\w)/i,
      msg: '`kind=` 后面缺参数值。用 `real(kind=real64)`（需要 `use iso_fortran_env`）或 `integer, parameter :: dp = kind(1.0d0)` 再写 `real(dp)`。',
    },
    {
      level: 'warn',
      re: /(?:^|\n)\s*(?:program|module|subroutine|function|pure\s+function|real\s+function)\b[\s\S]{0,4000}?(?=(?:^|\n)\s*(?:end\s+(?:program|module|subroutine|function)|end)\b)/im,
      msg: '检查这一段是否写了 `implicit none`。Fortran 默认按首字母推断类型（i–n 为整型），拼错的变量名会静默变成新变量，这是 legacy 代码里最难查的一类 bug。',
      test: (src) => {
        // 只有在"确实没有 implicit none"时才报告
        const blocks = src.split(/(?=\n\s*(?:program|module|subroutine|function)\b)/i);
        return blocks.some((b) => /(?:program|module|subroutine|function)\b/i.test(b) && !/implicit\s+none/i.test(b) && b.trim().length > 40);
      },
    },
    { level: 'info', re: /\breal\s*\*\s*[48]\b/i, msg: '`real*8` 是非标准扩展。可移植写法：`use iso_fortran_env, only: real64` 然后 `real(real64)`。' },
    { level: 'info', re: /\bcommon\s*\//i, msg: '`common` 块是 legacy 特性。同一 common 块在不同文件里的声明必须完全一致，否则会出现极难定位的数据错乱；改成 `module` 变量更安全。' },
    { level: 'info', re: /\.(?:eq|ne|lt|le|gt|ge)\./i, msg: '用了 `.eq.` 等旧式比较运算；现代写法是 `==` `/=` `<` `<=` `>` `>=`。' },
    {
      level: 'tip',
      re: /matmul\s*\(|dot_product\s*\(/i,
      msg: '用了 `matmul`/`dot_product`：通常映射到 BLAS（dgemm/dgemv），性能远好于手写三重循环。若这里恰好是热点，确认链接了优化过的 BLAS。',
    },
    {
      level: 'warn',
      re: /!\$omp\s+parallel\s+do[\s\S]{0,400}?(?:\w+\s*=\s*\w+\s*\+\s*1|(\w+)\s*=\s*\1\s*\+)/i,
      msg: 'OpenMP 并行循环里对共享变量做 `x = x + 1` 是典型竞态。用 `reduction(+:x)` 或 `!$omp atomic`。',
    },
    {
      level: 'tip',
      re: /do\s+\w+\s*=\s*[^,\n]+,[^,\n]+(?:,[^,\n]+)?\s*\n(?:[^\n]*\n){0,40}?\s*end\s*do\s+\w+/i,
      msg: 'do 循环用了带名字的 `end do name`。现代 Fortran 支持匿名 `end do`，但带名字在长循环体里更不容易出错——保持你的风格一致即可。',
    },
    {
      level: 'info',
      re: /^\s{6,}\S[^\n]*$/m,
      msg: '检测到第 6 列之后仍有内容的行，可能混用了固定格式（.f/.for）的列约定。自由格式（.f90）没有列限制，混用会误导阅读。',
    },
  ];

  const CPP_RULES = [
    { level: 'warn', re: /\bnew\s+[A-Za-z_]\w*/, msg: '裸 `new` 需要配对 `delete`。C++11 之后优先用 `std::vector` / `std::unique_ptr` 管理生命周期。' },
    { level: 'warn', re: /\bmalloc\s*\(/, msg: '`malloc` 不会调用构造函数。在 C++ 里除非是与 C 交互，否则用 `new` 或容器。' },
    { level: 'info', re: /\bprintf\s*\(\s*"[^"]*%s/, msg: '用 `printf` 打印 `std::string` 会出问题，要 `.c_str()`；C++ 里建议直接用 `std::cout`。' },
    { level: 'info', re: /#\s*include\s*<\w+\.h>/, msg: '包含 C 风格头文件（如 `<math.h>`）。C++ 里更推荐 `<cmath>` 并把名字放到 `std::`。' },
    { level: 'warn', re: /^\s*using\s+namespace\s+std\s*;/m, msg: '`using namespace std;` 会污染命名空间。头文件里绝对不要写；实现文件里也建议限定作用域。' },
    {
      level: 'warn',
      re: /#\s*pragma\s+omp\s+parallel\s+for[\s\S]{0,400}?\+\+/,
      msg: 'OpenMP `parallel for` 内出现自增共享变量，通常是竞态。用 `reduction(+:x)`。',
    },
    { level: 'tip', re: /\b(?:int|float|double|char)\s+\w+\s*\[\s*\d{6,}\s*\]/, msg: '大尺寸固定栈数组会爆栈（默认栈约 8 MB）。大数组改用 `std::vector` 或 `static`。' },
    { level: 'info', re: /\bwhile\s*\(\s*(?:true|1)\s*\)/, msg: '`while(true)` 需要明确的退出路径。确认每个分支都能跳出，且没有在循环里做重复的内存分配。' },
  ];

  /** 去掉字符串与注释后的括号平衡检查。 */
  function balance(src) {
    const cleaned = String(src)
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/\/\/[^\n]*/g, ' ')
      .replace(/![^\n]*/g, ' ')
      .replace(/'(?:[^'\n]|'')*'/g, "''")
      .replace(/"(?:[^"\n]|"")*"/g, '""');
    const pairs = { ')': '(', ']': '[', '}': '{' };
    const stack = [];
    for (const ch of cleaned) {
      if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
      else if (pairs[ch]) {
        if (stack.pop() !== pairs[ch]) {
          return { level: 'error', msg: `括号不匹配：遇到 ${ch} 时没有对应的 ${pairs[ch]}。` };
        }
      }
    }
    if (stack.length) {
      return { level: 'error', msg: `括号未闭合：还有 ${stack.length} 个未匹配的 ${stack.join('')}。` };
    }
    return null;
  }

  function applyRules(rules, src) {
    const issues = [];
    for (const rule of rules) {
      let hit;
      try {
        hit = rule.test ? rule.test(src) : rule.re.test(src);
      } catch {
        hit = false;
      }
      if (hit) issues.push({ level: rule.level, msg: rule.msg });
    }
    const bal = balance(src);
    if (bal) issues.push(bal);
    return issues;
  }

  rt.staticCheck = function staticCheck(lang, src) {
    const l = String(lang || '').toLowerCase();
    if (l === 'fortran' || l === 'f' || l === 'f90' || l === 'f95' || l === 'f03' || l === 'f08') {
      return applyRules(FORTRAN_RULES, src);
    }
    if (['c', 'cpp', 'c++', 'cc', 'cxx', 'h', 'hpp', 'cuda', 'cu'].includes(l)) {
      return applyRules(CPP_RULES, src);
    }
    return [];
  };

  // ─────────────────────────────────────────────────────────────
  // 本地运行指引
  // ─────────────────────────────────────────────────────────────
  rt.localRunInfo = function localRunInfo(lang, sourceName = 'main') {
    const l = String(lang || '').toLowerCase();
    if (l === 'python' || l === 'py' || l === 'python3') {
      return {
        ext: 'py',
        file: `${sourceName}.py`,
        commands: [
          { label: '直接运行', cmd: `python3 ${sourceName}.py`, note: 'Windows 上用 `python` 而不是 `python3`。' },
          { label: '函数级性能剖析', cmd: `python3 -m cProfile -s cumtime ${sourceName}.py | head -30` },
          { label: '逐行剖析（需先 pip install line_profiler）', cmd: `kernprof -l -v ${sourceName}.py` },
          { label: '内存峰值（需 pip install memory_profiler）', cmd: `python3 -m memory_profiler ${sourceName}.py` },
        ],
      };
    }
    if (l === 'fortran' || l === 'f' || l === 'f90' || l === 'f95' || l === 'f03' || l === 'f08') {
      return {
        ext: 'f90',
        file: `${sourceName}.f90`,
        commands: [
          { label: '编译并运行（gfortran，带全部运行时检查）', cmd: `gfortran -O2 -Wall -Wextra -fcheck=all ${sourceName}.f90 -o ${sourceName} && ./${sourceName}` },
          { label: '生产优化（会关掉边界检查）', cmd: `gfortran -O3 -march=native ${sourceName}.f90 -o ${sourceName} && ./${sourceName}` },
          { label: '显式检查数组越界与未初始化（调试期必备）', cmd: `gfortran -g -O0 -fcheck=bounds -finit-real=snan -ffpe-trap=invalid,zero,overflow ${sourceName}.f90 -o ${sourceName} && ./${sourceName}` },
          { label: '链接 BLAS/LAPACK', cmd: `gfortran -O2 ${sourceName}.f90 -o ${sourceName} -llapack -lblas && ./${sourceName}` },
          { label: 'OpenMP 并行', cmd: `gfortran -O3 -fopenmp ${sourceName}.f90 -o ${sourceName} && OMP_NUM_THREADS=4 ./${sourceName}` },
          { label: 'MPI 并行', cmd: `mpif90 -O3 ${sourceName}.f90 -o ${sourceName} && mpirun -np 4 ./${sourceName}` },
          { label: 'Intel ifx（ifort 的 LLVM 后继；如已安装）', cmd: `ifx -O2 -qopenmp ${sourceName}.f90 -o ${sourceName} && ./${sourceName}` },
          { label: 'Windows PowerShell', cmd: `gfortran -O2 ${sourceName}.f90 -o ${sourceName}.exe; .\\${sourceName}.exe` },
        ],
      };
    }
    if (['c', 'cpp', 'c++', 'cc', 'cxx', 'cuda', 'cu'].includes(l)) {
      const isC = l === 'c';
      const ext = isC ? 'c' : 'cpp';
      const file = `${sourceName}.${ext}`;
      const std = isC ? 'c17' : 'c++20';
      const comp = isC ? 'gcc' : 'g++';
      return {
        ext,
        file,
        commands: [
          { label: '编译并运行', cmd: `${comp} -std=${std} -O2 -Wall -Wextra ${file} -o ${sourceName} && ./${sourceName}` },
          { label: 'AddressSanitizer + UBSan（抓越界、泄漏、未定义行为）', cmd: `${comp} -std=${std} -g -O1 -fsanitize=address,undefined -fno-omit-frame-pointer ${file} -o ${sourceName} && ./${sourceName}` },
          { label: 'OpenMP 并行', cmd: `${comp} -std=${std} -O3 -fopenmp ${file} -o ${sourceName} && OMP_NUM_THREADS=4 ./${sourceName}` },
          { label: '性能剖析', cmd: `perf record -g ./${sourceName} && perf report` },
          { label: 'Windows PowerShell', cmd: `${comp} -std=${std} -O2 ${file} -o ${sourceName}.exe; .\\${sourceName}.exe` },
        ],
      };
    }
    return { ext: 'txt', file: `${sourceName}.txt`, commands: [] };
  };

  /** 外部在线编译器：只给链接，不承诺可靠性。 */
  rt.externalRunners = [
    { lang: 'Fortran', name: 'LFortran 官方在线版（官方标注 alpha，不保证第三方代码）', url: 'https://dev.lfortran.org/' },
    { lang: 'Fortran / C++', name: 'Compiler Explorer（需联网，代码会上传到对方服务器）', url: 'https://godbolt.org/' },
    { lang: 'C++', name: 'wasm-clang（Clang/LLD WASM，约 20 MB 首次下载，源码不上传）', url: 'https://binji.github.io/wasm-clang/' },
  ];
})();

/* ===== pieces/62-editor.js ===== */
/* ============================================================================
 * 62-editor.js — 代码编辑器（CodeMirror 6，带 <textarea> 降级）
 *
 * 关键实现事实（2026 年核实）：
 *   · 只有 @codemirror/lang-python 与 @codemirror/lang-cpp，**没有 lang-fortran**；
 *     Fortran 用 @codemirror/legacy-modes 的 StreamLanguage 提供。
 *   · 从 esm.sh 加载时，如果多个模块各自解析依赖，会加载两份
 *     @codemirror/state，运行时报 "Unrecognized extension value"。
 *     因此这里**先注入 import map，把所有 @codemirror/* 钉到单一版本**，
 *     再用动态 import() 加载——import map 只影响之后发起的解析请求。
 *   · CDN 被禁用或加载失败时，自动退回 <textarea>：
 *     语法高亮没了，但写代码、运行、跑测试全部照常。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const editor = (CPL.editor = {});

  const CDN_FALLBACKS = [
    'https://esm.sh/',
    'https://cdn.jsdelivr.net/npm/',
  ];

  let importMapInjected = false;
  let cmPromise = null;

  function pin(map, keys, version, base, suffix = '') {
    for (const k of keys) map[k] = `${base}${k}@${version}${suffix}`;
  }

  /** 注入 import map（同一页面只注入一次；重复注入会被浏览器忽略）。 */
  function ensureImportMap() {
    if (importMapInjected) return;
    importMapInjected = true;
    const v = CPL.config.versions;
    const base = CPL.config.cdn.esm;

    const imports = {
      codemirror: `${base}codemirror@${v.codemirror}`,
      '@codemirror/lang-python': `${base}@codemirror/lang-python@${v.langPython}`,
      '@codemirror/lang-cpp': `${base}@codemirror/lang-cpp@${v.langCpp}`,
      '@codemirror/legacy-modes/mode/fortran': `${base}@codemirror/legacy-modes@${v.legacyModes}/mode/fortran`,
    };
    // 这些包会被上面的包间接依赖；钉死到同一线上，避免出现两份实例。
    for (const pkg of ['state', 'view', 'language', 'commands', 'search', 'autocomplete', 'lint']) {
      imports[`@codemirror/${pkg}`] = `${base}@codemirror/${pkg}@6`;
    }

    const script = document.createElement('script');
    script.type = 'importmap';
    script.textContent = JSON.stringify({ imports });
    document.head.append(script);
    CPL.log('debug', '已注入 CodeMirror import map');
  }

  /** 加载 CodeMirror 模块集合（带一次备用 CDN 重试）。 */
  async function loadCodeMirror() {
    if (cmPromise) return cmPromise;
    if (!CPL.config.allowCdn || CPL.prefs.get('enableCdn') === false) {
      return Promise.reject(new Error('CDN 已禁用'));
    }
    ensureImportMap();

    cmPromise = (async () => {
      const [core, py, cpp, fortranMod] = await Promise.all([
        import('codemirror'),
        import('@codemirror/lang-python').catch(() => null),
        import('@codemirror/lang-cpp').catch(() => null),
        import('@codemirror/legacy-modes/mode/fortran').catch(() => null),
      ]);
      const view = await import('@codemirror/view');
      const state = await import('@codemirror/state');
      return { core, py, cpp, fortranMod, view, state };
    })().catch((err) => {
      cmPromise = null;
      throw err;
    });

    return cmPromise;
  }

  editor.available = () => Boolean(cmPromise) || (CPL.config.allowCdn && CPL.prefs.get('enableCdn') !== false);

  /** 语言名 → CodeMirror 扩展 */
  function langExtension(cm, lang) {
    const l = String(lang || '').toLowerCase();
    try {
      if ((l === 'python' || l === 'py') && cm.py) return cm.py.python();
      if (['cpp', 'c++', 'cc', 'cxx', 'c', 'h', 'hpp'].includes(l) && cm.cpp) return cm.cpp.cpp();
      if (l.startsWith('f') || l === 'fortran') {
        if (cm.fortranMod && cm.fortranMod.fortran) {
          return cm.view.StreamLanguage ? cm.view.StreamLanguage.define(cm.fortranMod.fortran) : [];
        }
      }
    } catch (err) {
      CPL.log('warn', `语言扩展加载失败（${lang}），退回纯文本`, err);
    }
    return [];
  }

  /**
   * 挂载编辑器。
   * @param {HTMLElement} host
   * @param {{value?:string, language?:string, readOnly?:boolean, minHeight?:number, onChange?:Function,
   *          onSubmit?:Function, ariaLabel?:string, placeholder?:string}} opts
   * @returns {Promise<{getValue:Function,setValue:Function,setLanguage:Function,focus:Function,
   *                    destroy:Function,kind:'codemirror'|'textarea',element:HTMLElement}>}
   */
  editor.mount = async function mount(host, opts = {}) {
    const wrap = dom.h('div', { class: 'cpl-editor__host' });
    host.append(wrap);

    // ── 先建 textarea（同时也作为降级路径） ──────────────────
    const ta = dom.h('textarea', {
      class: 'cpl-editor__fallback',
      spellcheck: 'false',
      autocapitalize: 'off',
      autocomplete: 'off',
      'aria-label': opts.ariaLabel || '代码编辑器',
      placeholder: opts.placeholder || '',
      style: { minHeight: `${opts.minHeight || 260}px` },
    });
    ta.value = opts.value || '';
    if (opts.readOnly) ta.readOnly = true;
    let changeHandler = opts.onChange || null;
    ta.addEventListener('input', () => changeHandler && changeHandler(ta.value));
    if (opts.onSubmit) {
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          opts.onSubmit();
        }
      });
    }
    wrap.append(ta);

    const api = {
      kind: 'textarea',
      element: wrap,
      getValue: () => ta.value,
      setValue: (v) => {
        ta.value = v;
      },
      setLanguage: () => {},
      focus: () => ta.focus(),
      destroy: () => {
        dom.clear(wrap);
      },
    };

    // ── 尝试升级到 CodeMirror ────────────────────────────────
    let cm;
    try {
      cm = await loadCodeMirror();
    } catch (err) {
      CPL.log('warn', 'CodeMirror 不可用，使用纯文本编辑器', dom.friendlyError(err));
      wrap.dataset.editor = 'textarea';
      return api;
    }

    try {
      const { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection, rectangularSelection, highlightSpecialChars, EditorState } = cm.view;
      const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        highlightSpecialChars(),
        drawSelection(),
        rectangularSelection(),
        EditorView.lineWrapping,
        EditorState.tabSize.of(4),
        langExtension(cm, opts.language),
      ];
      if (cm.core.basicSetup) extensions.unshift(cm.core.basicSetup);
      if (opts.onSubmit) {
        extensions.push(
          keymap.of([
            {
              key: 'Mod-Enter',
              run: () => {
                opts.onSubmit();
                return true;
              },
            },
          ])
        );
      }
      if (opts.readOnly) extensions.push(EditorState.readOnly.of(true), EditorView.editable.of(false));

      const view = new EditorView({
        doc: opts.value || '',
        parent: wrap,
        extensions,
      });
      // 移除 textarea 降级（保留在 DOM 里会占位）
      ta.remove();

      api.kind = 'codemirror';
      api.view = view;
      api.getValue = () => view.state.doc.toString();
      api.setValue = (v) => {
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: v } });
      };
      api.setLanguage = (lang) => {
        // 简单做法：重建语言扩展代价高；这里通过重新配置 compartment 太重，
        // 所以只在语言真的变化时提示用户刷新（课程内语言不会变）。
        void lang;
      };
      api.focus = () => view.focus();
      api.destroy = () => {
        view.destroy();
        dom.clear(wrap);
      };
      wrap.dataset.editor = 'codemirror';
      return api;
    } catch (err) {
      CPL.log('warn', 'CodeMirror 初始化失败，继续用 textarea', dom.friendlyError(err));
      wrap.dataset.editor = 'textarea';
      return api;
    }
  };

  /**
   * 编辑器面板：语言标签 + 行数 + 运行/重置/复制按钮，包一层统一外观。
   * @returns {{editor:Promise, element:HTMLElement}}
   */
  editor.panel = function panel(opts = {}) {
    const langBadge = dom.h('span', { class: 'cpl-editor__lang', text: opts.language || 'text' });
    const meta = dom.h('span', { class: 'cpl-editor__meta', text: '' });
    const actions = dom.h('div', { class: 'cpl-editor__actions' });
    const body = dom.h('div', { class: 'cpl-editor__body' });

    const wrap = dom.h(
      'div',
      { class: 'cpl-editor' },
      dom.h('div', { class: 'cpl-editor__bar' }, langBadge, meta, actions),
      body
    );

    const ready = editor.mount(body, opts).then((api) => {
      const update = () => {
        const value = api.getValue();
        meta.textContent = `${value.split('\n').length} 行 · ${value.length} 字符`;
      };
      update();
      const original = opts.onChange;
      // 包一层，顺便更新统计
      const wrapped = (v) => {
        update();
        if (original) original(v);
      };
      if (api.kind === 'codemirror' && api.view) {
        // CodeMirror 的变更通过 updateListener 监听
        void wrapped;
      } else {
        const ta = body.querySelector('textarea');
        if (ta) ta.addEventListener('input', update);
      }
      api.refreshMeta = update;
      return api;
    });

    return { editor: ready, element: wrap, actions, body, langBadge };
  };

  // 预热的时机：进入课程页时再加载，避免首屏就下载 300 KB
  editor.warm = function warm() {
    loadCodeMirror().catch(() => {});
  };
})();

/* ===== pieces/65-anki.js ===== */
/* ============================================================================
 * 65-anki.js — Anki 卡片：生成、预览、每周计划、导出
 *
 * 关于导出格式的诚实说明：
 *   真正的 .apkg 是一个内含 SQLite 数据库（collection.anki2）的 ZIP 包。
 *   在纯前端手写 SQLite 二进制格式风险高且容易生成坏包，所以本平台**不生成 .apkg**，
 *   而是导出 Anki 原生支持的两种文本格式：
 *     · TSV（制表符分隔）—— 最适合 Anki 的「文件 → 导入」，支持标签
 *     · CSV（逗号分隔，带引号转义）—— 适合 Excel/Numbers 先编辑
 *   导入步骤写在 README，两步就能完成，比给出一个可能打不开的 .apkg 更可靠。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;

  const anki = (CPL.anki = {});

  const scope = CPL.store.scope('anki');

  // ─────────────────────────────────────────────────────────────
  // 卡片收集
  // ─────────────────────────────────────────────────────────────
  /**
   * 收集卡片。source:
   *   'lesson'（默认，课程自带卡片）| 'user'（用户自定义课程）| 'wrong'（错题）| 'all'
   */
  anki.collect = function collect({ source = 'lesson', lessonIds = null, lessons = null } = {}) {
    const out = [];
    const list = lessons || CPL.catalog.lessons();

    for (const meta of list) {
      if (lessonIds && !lessonIds.includes(meta.id)) continue;
      const lesson = CPL.catalog.get(meta.id);
      if (!lesson) continue; // 未加载的课程没有卡片内容

      for (const card of lesson.anki || []) {
        out.push({
          id: `${meta.id}#${util.hash(card.front + (card.back || ''))}`,
          lessonId: meta.id,
          week: meta.week,
          deck: `计算物理CS::W${String(meta.week).padStart(2, '0')} ${meta.title}`,
          front: card.front,
          back: card.back,
          tags: ['cphys-cs', `w${meta.week}`, ...(card.tags || []), ...(meta.tags || []).slice(0, 3)],
          source: 'lesson',
        });
      }
    }

    if (source === 'wrong') {
      const wrong = CPL.assess ? CPL.assess.wrongQuestions() : [];
      for (const q of wrong) {
        const skill = CPL.mastery ? CPL.mastery.skill(q.skill) : null;
        out.push({
          id: `wrong#${q.id}`,
          lessonId: q.lesson || '',
          week: 0,
          deck: '计算物理CS::错题重练',
          front: q.q,
          back: `**正确答案：** ${q.options[q.answer]}\n\n**解析：** ${q.explain}`,
          tags: ['cphys-cs', 'wrong', q.skill, ...(skill ? [skill.domain] : [])],
          source: 'wrong',
        });
      }
    }

    return out;
  };

  /** 用户自定义课程里的卡片也要能导出。 */
  anki.collectUserCards = function collectUserCards(userLessons) {
    const out = [];
    for (const lesson of userLessons || []) {
      for (const card of lesson.anki || []) {
        out.push({
          id: `${lesson.id}#${util.hash(card.front + (card.back || ''))}`,
          lessonId: lesson.id,
          week: lesson.week || 0,
          deck: `计算物理CS::我的内容::${lesson.title || lesson.id}`,
          front: card.front,
          back: card.back,
          tags: ['cphys-cs', 'user', ...(card.tags || [])],
          source: 'user',
        });
      }
    }
    return out;
  };

  /** 每周自动生成 5 张（模块 6 的要求）：按本周课程 + 错题权重挑选。 */
  anki.weeklySet = function weeklySet(week, size = null) {
    const n = size || CPL.prefs.get('ankiPerWeek') || 5;
    const weekMeta = CPL.catalog.byWeek(week);
    const cards = anki.collect({ lessons: weekMeta });
    const wrong = anki.collect({ source: 'wrong' });
    // 错题优先，其次按课程顺序
    const merged = [...wrong.slice(0, Math.ceil(n / 2)), ...cards];
    const seen = new Set();
    const picked = [];
    for (const c of merged) {
      if (seen.has(c.front)) continue;
      seen.add(c.front);
      picked.push(c);
      if (picked.length >= n) break;
    }
    return picked;
  };

  /** 学习计划：从第 1 周到第 27 周，每周一叠。 */
  anki.plan = function plan(size) {
    const weeks = Array.from(new Set(CPL.catalog.lessons().map((l) => l.week))).filter((w) => w > 0).sort((a, b) => a - b);
    return weeks.map((w) => ({ week: w, cards: anki.weeklySet(w, size) }));
  };

  // ─────────────────────────────────────────────────────────────
  // 导出
  // ─────────────────────────────────────────────────────────────

  /** 把 Markdown 压成适合 Anki 的 HTML 片段（保留换行与公式可读性）。 */
  function cardHtml(markdown) {
    const html = CPL.md.renderBlocks(markdown || '');
    // Anki 字段里允许 HTML；行内换行用 <br>
    return html.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
  }

  anki.toTsv = function toTsv(cards, { html = true, includeTags = true, deckHeader = true } = {}) {
    const lines = [];
    if (deckHeader) {
      lines.push('#separator:tab');
      lines.push('#html:' + (html ? 'true' : 'false'));
      lines.push('#notetype:Basic');
      if (includeTags) lines.push('#tags column:3');
      lines.push('#deck column:4');
    }
    for (const c of cards) {
      const front = html ? cardHtml(c.front) : c.front.replace(/\n/g, ' ');
      const back = html ? cardHtml(c.back) : c.back.replace(/\n/g, ' ');
      const tags = includeTags ? c.tags.join(' ') : '';
      // 制表符与换行必须清掉，否则一行会被拆成多列
      const clean = (s) => String(s).replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
      if (includeTags) lines.push([clean(front), clean(back), clean(tags), clean(c.deck)].join('\t'));
      else lines.push([clean(front), clean(back)].join('\t'));
    }
    return lines.join('\n') + '\n';
  };

  anki.toCsv = function toCsv(cards, { html = false } = {}) {
    const quote = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const rows = [['front', 'back', 'tags', 'deck', 'lessonId', 'source'].map(quote).join(',')];
    for (const c of cards) {
      rows.push(
        [
          html ? cardHtml(c.front) : c.front,
          html ? cardHtml(c.back) : c.back,
          c.tags.join(' '),
          c.deck,
          c.lessonId,
          c.source,
        ]
          .map(quote)
          .join(',')
      );
    }
    return '\ufeff' + rows.join('\n') + '\n'; // BOM 让 Excel 正确识别 UTF-8
  };

  /** 纯文本（贴到任何地方） */
  anki.toPlain = function toPlain(cards) {
    return cards
      .map(
        (c, i) =>
          `### ${i + 1}. ${c.deck}\n\n**正面**\n${c.front}\n\n**背面**\n${c.back}\n\n标签：${c.tags.join(', ')}\n`
      )
      .join('\n---\n\n');
  };

  /** JSON 备份（含完整元数据，可再次导入本平台） */
  anki.toJson = function toJson(cards) {
    return JSON.stringify({ schema: CPL.SCHEMA, app: 'cphys-cs-lab', kind: 'anki-cards', exportedAt: new Date().toISOString(), count: cards.length, cards }, null, 2);
  };

  anki.export = function exportCards(cards, format = 'tsv') {
    const stamp = new Date().toISOString().slice(0, 10);
    if (!cards.length) {
      dom.toast('没有可导出的卡片', { kind: 'warn' });
      return 0;
    }
    if (format === 'tsv') dom.download(`cphys-cs-cards-${stamp}.txt`, anki.toTsv(cards), 'text/tab-separated-values');
    else if (format === 'csv') dom.download(`cphys-cs-cards-${stamp}.csv`, anki.toCsv(cards), 'text/csv');
    else if (format === 'md') dom.download(`cphys-cs-cards-${stamp}.md`, anki.toPlain(cards), 'text/markdown');
    else if (format === 'json') dom.download(`cphys-cs-cards-${stamp}.json`, anki.toJson(cards), 'application/json');
    dom.toast(`已导出 ${cards.length} 张卡片（${format}）。导入步骤见 README「Anki 导入」。`, { kind: 'ok' });
    return cards.length;
  };

  // ─────────────────────────────────────────────────────────────
  // 复习记录（本地）
  // ─────────────────────────────────────────────────────────────
  anki.reviewed = function reviewed() {
    return scope.get('reviewed', {}); // { cardId: { count, lastAt } }
  };

  anki.markReviewed = function markReviewed(cardId, known) {
    const all = anki.reviewed();
    const rec = all[cardId] || { count: 0, known: 0, unknown: 0 };
    rec.count++;
    rec.lastAt = Date.now();
    if (known) rec.known++;
    else rec.unknown++;
    all[cardId] = rec;
    scope.set('reviewed', all);
    CPL.bus.emit('anki:reviewed', { cardId, known });
    return rec;
  };

  /** 需要重点复习的卡片（答错次数高于答对） */
  anki.weakCards = function weakCards(cards) {
    const rev = anki.reviewed();
    return cards
      .filter((c) => {
        const r = rev[c.id];
        return r && r.unknown > r.known;
      })
      .sort((a, b) => (rev[b.id].unknown - rev[b.id].known) - (rev[a.id].unknown - rev[a.id].known));
  };

  // ─────────────────────────────────────────────────────────────
  // 复习界面
  // ─────────────────────────────────────────────────────────────
  /**
   * 简易复习器：翻卡 + 会/不会 + 键盘快捷键（空格翻面，1 不会，2 会）。
   * @returns {{destroy:Function, stats:Function}}
   */
  anki.mountReviewer = function mountReviewer(host, cards, opts = {}) {
    let index = 0;
    let flipped = false;
    let right = 0;
    let wrong = 0;

    const counter = dom.h('span', { class: 'cpl-review__counter' });
    const cardBox = dom.h('div', { class: 'cpl-review__card', tabindex: '0', role: 'button' });
    const frontEl = dom.h('div', { class: 'cpl-review__face cpl-review__face--front' });
    const backEl = dom.h('div', { class: 'cpl-review__face cpl-review__face--back' });
    const deckEl = dom.h('span', { class: 'cpl-review__deck' });

    const knowBtn = dom.h('button', { class: 'cpl-btn cpl-btn--primary', type: 'button', text: '会（2）' });
    const dontBtn = dom.h('button', { class: 'cpl-btn', type: 'button', text: '不会（1）' });

    function paint() {
      const card = cards[index];
      if (!card) {
        dom.clear(cardBox);
        cardBox.append(dom.h('div', { class: 'cpl-review__done' }, dom.h('h3', { text: '这一叠复习完了' }), dom.h('p', { text: `会 ${right} 张 · 不会 ${wrong} 张` })));
        return;
      }
      counter.textContent = `${index + 1} / ${cards.length} · 会 ${right} · 不会 ${wrong}`;
      deckEl.textContent = card.deck;
      dom.clear(frontEl);
      dom.clear(backEl);
      frontEl.append(CPL.md.render(card.front));
      if (flipped) {
        backEl.append(CPL.md.render(card.back));
        backEl.hidden = false;
      } else {
        backEl.hidden = true;
      }
      if (CPL.highlight) CPL.highlight.applyAll(cardBox);
    }

    function flip() {
      if (!cards[index]) return;
      flipped = !flipped;
      paint();
    }

    function answer(known) {
      if (!cards[index]) return;
      if (known) right++;
      else wrong++;
      anki.markReviewed(cards[index].id, known);
      index++;
      flipped = false;
      paint();
    }

    cardBox.addEventListener('click', flip);
    cardBox.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flip();
      }
    });
    knowBtn.addEventListener('click', () => answer(true));
    dontBtn.addEventListener('click', () => answer(false));

    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (e.key === ' ') {
        e.preventDefault();
        flip();
      } else if (e.key === '1') answer(false);
      else if (e.key === '2') answer(true);
    };
    document.addEventListener('keydown', onKey);

    host.append(
      dom.h('div', { class: 'cpl-review' }, dom.h('div', { class: 'cpl-review__bar' }, deckEl, counter), cardBox, dom.h('div', { class: 'cpl-review__actions' }, dontBtn, knowBtn)),
      dom.h('p', { class: 'cpl-muted', text: '快捷键：空格翻面 · 1 不会 · 2 会' })
    );
    cardBox.append(frontEl, backEl);
    paint();
    if (opts.focus !== false) cardBox.focus();

    return {
      destroy: () => document.removeEventListener('keydown', onKey),
      stats: () => ({ right, wrong, index, total: cards.length }),
    };
  };
})();

/* ===== pieces/70-ai.js ===== */
/* ============================================================================
 * 70-ai.js — AI 助教客户端（引导式提问 / 代码审查 / 掌握度评估）
 *
 * 安全边界（前端这一侧）：
 *   · 前端永远不持有 API 密钥。所有请求打到自己的 Serverless 代理
 *     （api/chat.js），由代理去持有密钥、做 Origin 白名单与速率限制。
 *   · 只发送学习上下文：课程 id、代码、用户提问、技能等级。
 *     不发送姓名、邮箱、学校、IP 之外的任何身份信息（IP 由服务端限流使用）。
 *   · 三处长度限制：单条消息、消息条数、总字符数，均在发送前裁剪。
 *   · 离线降级：未配置 apiBase 时，把课程自带的引导问题当作"本地助教"，
 *     功能不缺失（只是不会动态追问）。
 *
 * 三个动作（与 api/chat.js 的 action 字段对应）：
 *   chat        引导式答疑（默认）
 *   review-code 讲解用户上传的代码 + 反问是否掌握 + 指出风险
 *   assess      根据对话与代码证据评估技能掌握度
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;

  const ai = (CPL.ai = {});

  ai.enabled = () => Boolean(CPL.config.apiBase);

  // ─────────────────────────────────────────────────────────────
  // 前端侧的软限流（真正的限流在服务端，这里只是防止误触发连点）
  // ─────────────────────────────────────────────────────────────
  const rate = { hits: [], windowMs: 60000 };

  ai.rateRemaining = function rateRemaining() {
    const now = Date.now();
    rate.hits = rate.hits.filter((t) => now - t < rate.windowMs);
    return Math.max(0, CPL.config.ai.softRatePerMin - rate.hits.length);
  };

  function takeToken() {
    const now = Date.now();
    rate.hits = rate.hits.filter((t) => now - t < rate.windowMs);
    if (rate.hits.length >= CPL.config.ai.softRatePerMin) return false;
    rate.hits.push(now);
    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // 输入裁剪
  // ─────────────────────────────────────────────────────────────
  function truncate(text, max) {
    const s = String(text === undefined || text === null ? '' : text);
    if (s.length <= max) return s;
    return s.slice(0, max - 1) + '…';
  }

  /**
   * 规范化消息数组：限制条数、单条长度、总长度，并且只保留 user/assistant。
   * 客户端不允许指定 system —— system 提示词由服务端注入，防止越权。
   */
  ai.normalizeMessages = function normalizeMessages(messages) {
    const cfg = CPL.config.ai;
    const cleaned = (messages || [])
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: truncate(m.content, cfg.maxInputChars) }));

    let out = cleaned.slice(-cfg.maxMessages);

    // 总长度约束：从最旧的消息开始丢，直到满足上限
    const total = () => out.reduce((n, m) => n + m.content.length, 0);
    while (out.length > 1 && total() > cfg.maxChars) out.shift();
    if (total() > cfg.maxChars && out.length) {
      out[0] = { role: out[0].role, content: truncate(out[0].content, cfg.maxChars) };
    }
    return out;
  };

  // ─────────────────────────────────────────────────────────────
  // 学习上下文：只发"学什么"，不发"我是谁"
  // ─────────────────────────────────────────────────────────────
  /**
   * @param {{lesson?:object, lessonId?:string, skills?:string[], language?:string, code?:string, extra?:object}} ctx
   */
  ai.buildContext = function buildContext(ctx = {}) {
    const lessonId = ctx.lessonId || (ctx.lesson && ctx.lesson.id) || '';
    const meta = lessonId && CPL.catalog ? CPL.catalog.meta(lessonId) : null;
    const lesson = ctx.lesson || (CPL.catalog ? CPL.catalog.get(lessonId) : null);

    const out = {
      lessonId,
      lessonTitle: (lesson && lesson.title) || (meta && meta.title) || '',
      module: (lesson && lesson.module) || (meta && meta.module),
      week: (lesson && lesson.week) || (meta && meta.week),
      objectives: lesson ? (lesson.objectives || []).slice(0, 6) : [],
      tags: meta ? (meta.tags || []).slice(0, 8) : [],
    };

    // 掌握度：只发技能名与等级，不发分数历史
    if (CPL.mastery) {
      const profile = CPL.mastery.toContext();
      out.mastery = profile;
      out.skills = ctx.skills || (lessonId ? CPL.mastery.skillsForLesson(lessonId).map((s) => s.id) : []);
    }
    if (ctx.language) out.language = ctx.language;
    if (ctx.extra) out.extra = ctx.extra;
    return out;
  };

  // ─────────────────────────────────────────────────────────────
  // 统一请求
  // ─────────────────────────────────────────────────────────────
  const ERROR_TEXT = {
    RATE_LIMITED: '请求太频繁了。等一分钟再问，或者先把当前问题想清楚再问。',
    INPUT_TOO_LONG: '内容太长了。把问题缩小到一点，或者只贴最关键的那几十行代码。',
    NOT_ALLOWED_ORIGIN: '这个站点的来源不在代理的白名单里。请检查 api/chat.js 的 ALLOWED_ORIGINS 配置。',
    UPSTREAM_ERROR: '上游模型服务出错了。稍后重试；如果持续失败，检查服务端的 API 密钥与额度。',
    UPSTREAM_TIMEOUT: '模型响应超时。把问题拆小一点再试。',
    NOT_CONFIGURED: '服务端还没配置 AI 密钥（AI_API_KEY）。配置后这个功能才会生效。',
    BAD_REQUEST: '请求格式不对，这通常是前端 bug。',
    INTERNAL: '服务端内部错误。已记录请求 id，细节不会返回给前端。',
  };

  /**
   * 调用代理。
   * @param {object} payload
   * @param {{onDelta?:Function, onStatus?:Function, signal?:AbortSignal}} opts
   * @returns {Promise<{ok:boolean, text:string, code?:string, requestId?:string, usage?:object, message?:string}>}
   */
  ai.request = async function request(payload, opts = {}) {
    if (!ai.enabled()) {
      return { ok: false, code: 'DISABLED', message: 'AI 助教未启用（未配置 apiBase）', text: '' };
    }
    if (!takeToken()) {
      return {
        ok: false,
        code: 'CLIENT_RATE_LIMITED',
        message: '你连点太快了。等一分钟，或者先把问题写清楚再问。',
        text: '',
      };
    }

    const body = {
      action: payload.action || 'chat',
      messages: ai.normalizeMessages(payload.messages),
      context: payload.context || {},
      // 服务端会再次校验这些字段，这里只是"自证清白"
      clientVersion: CPL.VERSION,
    };
    if (payload.code) body.code = truncate(payload.code, CPL.config.ai.maxCodeChars || 8000);
    if (payload.language) body.language = truncate(payload.language, 24);
    if (payload.filename) body.filename = truncate(payload.filename, 120);

    const wantsStream = CPL.config.ai.stream && payload.stream !== false && typeof opts.onDelta === 'function';

    let res;
    try {
      res = await fetch(CPL.config.apiBase, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: wantsStream ? 'text/event-stream' : 'application/json' },
        body: JSON.stringify(body),
        signal: opts.signal,
      });
    } catch (err) {
      if (err && err.name === 'AbortError') return { ok: false, code: 'ABORTED', message: '已取消', text: '' };
      return {
        ok: false,
        code: 'NETWORK',
        message: '无法连接到 AI 代理。检查 apiBase 地址是否正确，以及代理是否已部署。',
        text: '',
      };
    }

    const requestId = res.headers.get('x-request-id') || '';

    if (!res.ok) {
      let code = 'INTERNAL';
      let message = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        if (data && data.error) {
          code = data.error.code || code;
          message = data.error.message || message;
        }
      } catch {
        /* 非 JSON 错误体，保持默认 */
      }
      return {
        ok: false,
        code,
        requestId,
        message: ERROR_TEXT[code] || message,
        text: '',
      };
    }

    const ctype = res.headers.get('content-type') || '';

    // ── 流式（SSE） ──────────────────────────────────────────
    if (wantsStream && ctype.includes('text/event-stream') && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let text = '';
      let done = false;

      try {
        while (!done) {
          const chunk = await reader.read();
          if (chunk.done) break;
          buffer += decoder.decode(chunk.value, { stream: true });
          // 以空行分隔事件
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';
          for (const part of parts) {
            const lines = part.split('\n');
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const data = trimmed.slice(5).trim();
              if (data === '[DONE]') {
                done = true;
                continue;
              }
              let parsed;
              try {
                parsed = JSON.parse(data);
              } catch {
                continue; // 非 JSON 数据帧（心跳等）直接跳过
              }
              if (parsed.error) {
                return { ok: false, code: parsed.error.code || 'UPSTREAM_ERROR', message: ERROR_TEXT[parsed.error.code] || parsed.error.message, text, requestId };
              }
              // 兼容两种常见分片格式：
              //   OpenAI 风格：{ choices: [{ delta: { content } }] }
              //   Vercel AI SDK 风格：{ type: 'text-delta', textDelta }
              const delta = extractDelta(parsed);
              if (delta) {
                text += delta;
                opts.onDelta(delta, text);
              }
              if (parsed.type === 'done' || parsed.done === true) done = true;
            }
          }
        }
      } catch (err) {
        if (err && err.name === 'AbortError') return { ok: true, text: text + '\n\n（已中断）', requestId };
        return { ok: false, code: 'STREAM_ERROR', message: '流式读取中断：' + dom.friendlyError(err), text, requestId };
      }
      return { ok: true, text, requestId };
    }

    // ── 非流式（JSON） ───────────────────────────────────────
    let data;
    try {
      data = await res.json();
    } catch {
      return { ok: false, code: 'BAD_RESPONSE', message: '服务端返回了无法解析的内容。', text: '', requestId };
    }
    if (data && data.error) {
      const code = data.error.code || 'INTERNAL';
      return { ok: false, code, message: ERROR_TEXT[code] || data.error.message, text: '', requestId };
    }
    const text =
      (data && (data.text || (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content))) || '';
    return { ok: true, text, requestId, usage: data && data.usage };
  };

  /** 从分片对象里取出增量文本（兼容多种上游格式）。 */
  function extractDelta(obj) {
    if (!obj || typeof obj !== 'object') return '';
    if (typeof obj.delta === 'string') return obj.delta;
    if (typeof obj.textDelta === 'string') return obj.textDelta;
    if (typeof obj.text === 'string' && obj.type !== 'done') return obj.text;
    if (typeof obj.content === 'string' && !obj.role) return obj.content;
    const choice = obj.choices && obj.choices[0];
    if (choice) {
      if (choice.delta && typeof choice.delta.content === 'string') return choice.delta.content;
      if (choice.message && typeof choice.message.content === 'string') return choice.message.content;
      if (typeof choice.text === 'string') return choice.text;
    }
    return '';
  }

  // ─────────────────────────────────────────────────────────────
  // 离线兜底：本地引导问题库
  // ─────────────────────────────────────────────────────────────
  ai.localPrompts = function localPrompts(lesson) {
    const prompts = (lesson && lesson.aiPrompts) || [];
    if (prompts.length) return prompts;
    return [
      '先说说你自己是怎么理解这一课的？哪一步最不确定？',
      '如果把你现在的参数放大 10 倍，你预期结果会怎么变？为什么？',
      '这段逻辑放到你自己的科研代码里，最可能在哪一步出错？',
    ];
  };

  // ─────────────────────────────────────────────────────────────
  // 三个高层动作
  // ─────────────────────────────────────────────────────────────
  ai.chat = function chat({ messages, lesson, lessonId, code, language, onDelta, onStatus, signal }) {
    return ai.request(
      {
        action: 'chat',
        messages,
        context: ai.buildContext({ lesson, lessonId, language, code: code ? true : undefined }),
        code,
        language,
      },
      { onDelta, onStatus, signal }
    );
  };

  /** 代码审查：讲解 + 反问 + 风险点。要求服务端不直接给完整答案。 */
  ai.reviewCode = function reviewCode({ code, language, filename, lesson, lessonId, question, onDelta, onStatus, signal }) {
    return ai.request(
      {
        action: 'review-code',
        messages: [
          {
            role: 'user',
            content:
              (question ? question + '\n\n' : '') +
              '请对照本课的知识点，分析我上传的代码。要求：\n' +
              '1) 先说清这段代码在做什么（用一两句话，不要逐行复述）；\n' +
              '2) 指出与本节课知识点相关的问题（物理正确性 / 边界条件 / 数值稳定性 / 复杂度 / 内存布局 / 并行竞态 / 数组越界，按相关性挑最要紧的两三个）；\n' +
              '3) 不要直接把改好的完整代码给我，用提问引导我自己发现；\n' +
              '4) 最后给我 1–3 个检验我是否真掌握了的追问。',
          },
        ],
        context: ai.buildContext({ lesson, lessonId, language, code: true }),
        code,
        language,
        filename,
      },
      { onDelta, onStatus, signal }
    );
  };

  /** 掌握度评估：只发技能清单等级与（可选）代码证据，不发个人身份信息。 */
  ai.assess = function assessMastery({ lesson, lessonId, code, language, answers, onDelta, signal }) {
    const skillNames = (lessonId && CPL.mastery ? CPL.mastery.skillsForLesson(lessonId) : []).map((s) => s.name);
    return ai.request(
      {
        action: 'assess',
        messages: [
          {
            role: 'user',
            content: [
              '请根据下面的证据，判断我对这些技能的掌握程度，并给出下一步建议。',
              skillNames.length ? '相关技能：' + skillNames.join('、') : '',
              answers ? '我的自述/回答：' + answers : '',
              code ? '我的代码见附件。' : '',
              '输出要求：①逐技能给出「已掌握 / 基本会 / 薄弱 / 未评估」并说明依据；②指出我最可能自我高估的那一项；③给我 2 个能当场验证的判断题。',
            ]
              .filter(Boolean)
              .join('\n'),
          },
        ],
        context: ai.buildContext({ lesson, lessonId, language, code: code ? true : undefined }),
        code,
        language,
      },
      { onDelta, signal }
    );
  };

  // ─────────────────────────────────────────────────────────────
  // 聊天面板组件（课程页与「我的内容」共用）
  // ─────────────────────────────────────────────────────────────
  /**
   * @param {HTMLElement} host
   * @param {{lesson?:object, lessonId?:string, mode?:'tutor'|'review'|'assess', getCode?:Function, getLanguage?:Function, title?:string, intro?:string}} opts
   * @returns {{destroy:Function, setLesson:Function, focus:Function}}
   */
  ai.mountPanel = function mountPanel(host, opts = {}) {
    const mode = opts.mode || 'tutor';
    const messages = []; // {role, content}
    const controller = { current: null };

    const log = dom.h('div', { class: 'cpl-ai__log', role: 'log', 'aria-live': 'polite', 'aria-label': 'AI 助教对话' });
    const status = dom.h('div', { class: 'cpl-ai__status', hidden: true });
    const input = dom.h('textarea', {
      class: 'cpl-ai__input',
      rows: '3',
      placeholder: mode === 'review' ? '可选：说说你想让助教重点看哪里…' : '把你的问题写清楚：你试了什么、观察到什么、卡在哪一步…',
      'aria-label': '给 AI 助教的消息',
      maxlength: String(CPL.config.ai.maxInputChars),
    });
    const sendBtn = dom.h('button', { class: 'cpl-btn cpl-btn--primary', type: 'button', text: '发送' });
    const stopBtn = dom.h('button', { class: 'cpl-btn', type: 'button', text: '停止', hidden: true });
    const clearBtn = dom.h('button', { class: 'cpl-btn cpl-btn--ghost cpl-btn--sm', type: 'button', text: '清空对话' });
    const counter = dom.h('span', { class: 'cpl-ai__counter', text: `0 / ${CPL.config.ai.maxInputChars}` });

    const promptsHost = dom.h('div', { class: 'cpl-ai__prompts' });

    function renderPrompts() {
      dom.clear(promptsHost);
      const prompts = ai.localPrompts(opts.lesson);
      const lead =
        mode === 'review'
          ? '代码审查：我会先讲清它在做什么，再指出与本节知识点相关的问题，然后用提问引导你自己发现。'
          : mode === 'assess'
          ? '掌握度评估：我会逐技能判断你处在哪一档，并指出你最容易高估的那一项。'
          : '引导式助教：我不直接给答案，先问你几个问题。想不出来时直接说「给我提示」。';
      promptsHost.append(dom.h('p', { class: 'cpl-ai__lead', text: lead }));
      if (prompts.length) {
        promptsHost.append(dom.h('p', { class: 'cpl-ai__lead-label', text: '本课的引导问题：' }));
        const list = dom.h('div', { class: 'cpl-ai__chips' });
        for (const p of prompts) {
          list.append(
            dom.h('button', {
              class: 'cpl-chip',
              type: 'button',
              text: p,
              onclick: () => {
                input.value = p;
                updateCounter();
                input.focus();
              },
            })
          );
        }
        promptsHost.append(list);
      }
    }

    function updateCounter() {
      counter.textContent = `${input.value.length} / ${CPL.config.ai.maxInputChars}`;
      counter.classList.toggle('is-over', input.value.length > CPL.config.ai.maxInputChars * 0.9);
    }

    function bubble(role, content) {
      const node = dom.h(
        'div',
        { class: `cpl-ai__msg cpl-ai__msg--${role}` },
        dom.h('div', { class: 'cpl-ai__role', text: role === 'user' ? '你' : role === 'system' ? '系统' : 'AI 助教' }),
        dom.h('div', { class: 'cpl-ai__content' })
      );
      const contentEl = node.querySelector('.cpl-ai__content');
      if (role === 'assistant') {
        // AI 输出也走 Markdown 渲染器（内部统一转义，不存在直通 HTML）
        contentEl.append(CPL.md.render(content));
        if (CPL.highlight) CPL.highlight.applyAll(contentEl);
      } else {
        contentEl.textContent = content;
      }
      log.append(node);
      log.scrollTop = log.scrollHeight;
      return contentEl;
    }

    function setStatus(text) {
      if (!text) {
        status.hidden = true;
        status.textContent = '';
        return;
      }
      status.hidden = false;
      status.textContent = text;
    }

    async function onSubmit() {
      const text = input.value.trim();
      if (!text && mode !== 'review') {
        dom.toast('先写点什么再发', { kind: 'warn', ms: 1800 });
        return;
      }
      input.value = '';
      updateCounter();
      messages.push({ role: 'user', content: text });
      bubble('user', text || '（请审查当前代码）');

      if (!ai.enabled()) {
        // 离线模式：给出课程自带问题作为"本地助教"，并明确说明原因
        const offline = [
          'AI 助教当前处于**离线模式**（站点未配置 `apiBase` 指向你的 Serverless 代理）。',
          '',
          '在你部署代理之前，这里把你的问题还给你——这些是本课设计好的引导问题：',
          '',
          ...ai.localPrompts(opts.lesson).map((p) => `- ${p}`),
          '',
          '想把问题贴给任意大模型，可以直接复制本页的对话与代码。',
        ].join('\n');
        bubble('assistant', offline);
        return;
      }

      const answerEl = bubble('assistant', '');
      let acc = '';
      sendBtn.disabled = true;
      stopBtn.hidden = false;
      setStatus('思考中…');
      controller.current = new AbortController();

      const code = typeof opts.getCode === 'function' ? opts.getCode() : '';
      const language = typeof opts.getLanguage === 'function' ? opts.getLanguage() : '';

      const useMode = mode === 'review' ? 'reviewCode' : mode === 'assess' ? 'assess' : 'chat';
      const call =
        useMode === 'reviewCode'
          ? ai.reviewCode({ code, language, lesson: opts.lesson, lessonId: opts.lessonId, question: text, onDelta, onStatus: setStatus, signal: controller.current.signal })
          : useMode === 'assess'
          ? ai.assessMastery({ lesson: opts.lesson, lessonId: opts.lessonId, code, language, answers: text, onDelta, signal: controller.current.signal })
          : ai.chat({ messages, lesson: opts.lesson, lessonId: opts.lessonId, code, language, onDelta, onStatus: setStatus, signal: controller.current.signal });

      function onDelta(_delta, full) {
        acc = full;
        dom.clear(answerEl);
        answerEl.append(CPL.md.render(full));
      }

      const result = await call;

      sendBtn.disabled = false;
      stopBtn.hidden = true;
      setStatus('');
      controller.current = null;

      if (!result.ok) {
        dom.clear(answerEl);
        const err = dom.errorCard('助教没能回答', result.message || '未知错误', [
          result.code === 'DISABLED' ? '在 index.html 里把 apiBase 指向你部署好的 /api/chat' : '检查代理是否在线、密钥是否已配置',
          '也可以把问题复制到任意大模型里继续',
        ]);
        answerEl.append(err);
        return;
      }

      // 流式已渲染；非流式需要补渲染
      if (!acc) {
        dom.clear(answerEl);
        answerEl.append(CPL.md.render(result.text || '（空回复）'));
      }
      if (CPL.highlight) CPL.highlight.applyAll(answerEl);
      messages.push({ role: 'assistant', content: result.text || acc });

      // 记录一次使用，便于设置页展示
      const usage = CPL.store.scope('aiUsage');
      const today = new Date().toISOString().slice(0, 10);
      const rec = usage.get(today, { count: 0 });
      rec.count++;
      usage.set(today, rec);

      CPL.bus.emit('ai:answered', { mode: useMode, requestId: result.requestId });
    }

    sendBtn.addEventListener('click', onSubmit);
    input.addEventListener('input', updateCounter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onSubmit();
      }
    });
    stopBtn.addEventListener('click', () => {
      if (controller.current) controller.current.abort();
      setStatus('已停止');
      setTimeout(() => setStatus(''), 1200);
    });
    clearBtn.addEventListener('click', () => {
      messages.length = 0;
      dom.clear(log);
      renderPrompts();
    });

    renderPrompts();
    host.append(promptsHost, log, status, dom.h('div', { class: 'cpl-ai__compose' }, input, dom.h('div', { class: 'cpl-ai__compose-actions' }, counter, clearBtn, stopBtn, sendBtn)));
    updateCounter();

    return {
      destroy() {
        if (controller.current) controller.current.abort();
      },
      setLesson(lesson, lessonId) {
        opts.lesson = lesson;
        opts.lessonId = lessonId;
        renderPrompts();
      },
      focus: () => input.focus(),
      element: host,
    };
  };

  // 补充一个配置项（与 00-core.js 的默认值合并）
  if (CPL.config.ai.maxChars === undefined) {
    CPL.config.ai.maxChars = 12000;
    CPL.config.ai.maxCodeChars = 8000;
  }
  util.hash;
})();

/* ===== pieces/80-plot.js ===== */
/* ============================================================================
 * 80-plot.js — 零依赖 Canvas 绘图：折线 / 散点 / log-log / 热力图 / 柱状
 *
 * 为什么自己写：
 *   课程里到处要"画一张 log-log 图看斜率"，引入 Plotly/Chart.js 会破坏
 *   "无依赖 + 可离线" 的约束，而且体积远大于需要的功能。
 * 支持：
 *   · 线性与对数坐标（x/y 各自独立）
 *   · 网格 + 1-2-5 刻度 + 对数刻度自动取 10 的幂
 *   · 多序列折线/散点、标注文本、参考斜率线
 *   · log-log 自动拟合斜率（用 CPL.util.slope，输出到图注）
 *   · 悬停读书：鼠标靠近时显示最近数据点
 *   · 高 DPI、窗口尺寸变化自动重绘
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const util = CPL.util;

  const plot = (CPL.plot = {});

  const PALETTE = ['#3b5bdb', '#e8590c', '#0ca678', '#ae3ec9', '#f08c00', '#1098ad', '#c2255c', '#495057'];

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function theme() {
    return {
      text: cssVar('--cpl-text', '#16191d'),
      muted: cssVar('--cpl-text-mute', '#78818f'),
      grid: cssVar('--cpl-border', '#dfe3e9'),
      axis: cssVar('--cpl-border-strong', '#c3cad4'),
      bg: cssVar('--cpl-bg-elev', '#fff'),
      accent: cssVar('--cpl-accent', '#3b5bdb'),
      warn: cssVar('--cpl-warn', '#a45c00'),
      ok: cssVar('--cpl-ok', '#12805c'),
      danger: cssVar('--cpl-danger', '#bf2c2c'),
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 刻度生成
  // ─────────────────────────────────────────────────────────────
  /** 线性轴：1-2-5 序列，按可用像素选步长。 */
  plot.linTicks = function linTicks(min, max, target = 6) {
    if (!(max > min)) return { ticks: [min], step: 1 };
    const raw = (max - min) / Math.max(1, target);
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
    const ticks = [];
    const start = Math.ceil(min / step) * step;
    for (let v = start; v <= max + step * 1e-9; v += step) {
      ticks.push(Math.abs(v) < step * 1e-9 ? 0 : v);
      if (ticks.length > 200) break;
    }
    return { ticks, step };
  };

  /** 对数轴：10 的幂，跨度小时补 2/5。 */
  plot.logTicks = function logTicks(min, max) {
    const ticks = [];
    const lo = Math.floor(Math.log10(Math.max(min, Number.MIN_VALUE)));
    const hi = Math.ceil(Math.log10(Math.max(max, Number.MIN_VALUE)));
    for (let e = lo; e <= hi; e++) {
      const base = Math.pow(10, e);
      ticks.push(base);
      if (hi - lo <= 3) {
        ticks.push(2 * base, 5 * base);
      }
    }
    return ticks.filter((t) => t >= min * 0.999 && t <= max * 1.001);
  };

  /** 让坐标轴"漂亮"地包住数据。 */
  function niceDomain(values, scale, padRatio = 0.06) {
    const finite = values.filter((v) => Number.isFinite(v));
    if (!finite.length) return scale === 'log' ? [1, 10] : [0, 1];
    let lo = Math.min(...finite);
    let hi = Math.max(...finite);
    if (scale === 'log') {
      lo = lo <= 0 ? Math.min(...finite.filter((v) => v > 0), 1) : lo;
      hi = hi <= 0 ? lo * 10 : hi;
      const logLo = Math.log10(lo) - padRatio;
      const logHi = Math.log10(hi) + padRatio;
      return [Math.pow(10, logLo), Math.pow(10, logHi)];
    }
    if (lo === hi) {
      const d = Math.abs(lo) * 0.1 || 1;
      return [lo - d, hi + d];
    }
    const pad = (hi - lo) * padRatio;
    return [lo - pad, hi + pad];
  }

  // ─────────────────────────────────────────────────────────────
  // 绘图主体
  // ─────────────────────────────────────────────────────────────
  /**
   * @param {HTMLElement} container
   * @param {{
   *   series: Array<{name:string, points:Array<[number,number]>, color?:string, type?:'line'|'scatter', dash?:boolean, width?:number}>,
   *   xScale?: 'linear'|'log', yScale?: 'linear'|'log',
   *   xLabel?: string, yLabel?: string, title?: string,
   *   annotations?: Array<{x:number,y:number,text:string,color?:string}>,
   *   fitSlope?: boolean, height?: number, caption?: string,
   *   hover?: boolean
   * }} opts
   */
  plot.mount = function mount(container, opts = {}) {
    const state = {
      opts,
      hover: null,
      geom: null,
      disposed: false,
    };

    const wrap = CPL.dom.h('figure', { class: 'cpl-plot' });
    const canvas = CPL.dom.h('canvas', {
      class: 'cpl-plot__canvas',
      role: 'img',
      'aria-label': opts.title || '数据图',
    });
    canvas.style.height = `${opts.height || 320}px`;
    const caption = CPL.dom.h('figcaption', { class: 'cpl-plot__caption' });
    const tip = CPL.dom.h('div', { class: 'cpl-plot__tip', hidden: true });
    wrap.append(canvas, tip, caption);
    container.append(wrap);

    const ctx = canvas.getContext('2d');

    function draw() {
      if (state.disposed) return;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(240, rect.width || wrap.clientWidth || 600);
      const h = opts.height || 320;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const t = theme();
      const series = (opts.series || []).filter((s) => s && Array.isArray(s.points) && s.points.length);
      const pad = { l: 62, r: 16, t: opts.title ? 30 : 14, b: 42 };

      const xs = series.flatMap((s) => s.points.map((p) => p[0]));
      const ys = series.flatMap((s) => s.points.map((p) => p[1]));
      const xScale = opts.xScale || 'linear';
      const yScale = opts.yScale || 'linear';
      const [x0, x1] = niceDomain(xs, xScale);
      const [y0, y1] = niceDomain(ys, yScale);

      const px = (x) => {
        const v = xScale === 'log' ? Math.log10(Math.max(x, Number.MIN_VALUE)) : x;
        const a = xScale === 'log' ? Math.log10(Math.max(x0, Number.MIN_VALUE)) : x0;
        const b = xScale === 'log' ? Math.log10(Math.max(x1, Number.MIN_VALUE)) : x1;
        return pad.l + ((v - a) / (b - a || 1)) * (w - pad.l - pad.r);
      };
      const py = (y) => {
        const v = yScale === 'log' ? Math.log10(Math.max(y, Number.MIN_VALUE)) : y;
        const a = yScale === 'log' ? Math.log10(Math.max(y0, Number.MIN_VALUE)) : y0;
        const b = yScale === 'log' ? Math.log10(Math.max(y1, Number.MIN_VALUE)) : y1;
        return h - pad.b - ((v - a) / (b - a || 1)) * (h - pad.t - pad.b);
      };

      state.geom = { px, py, x0, x1, y0, y1, w, h, pad, series };

      // 背景
      ctx.fillStyle = t.bg;
      ctx.fillRect(0, 0, w, h);

      // 网格与刻度
      ctx.font = '11px ui-monospace, monospace';
      ctx.textBaseline = 'middle';
      const xTicks = xScale === 'log' ? plot.logTicks(x0, x1) : plot.linTicks(x0, x1, Math.max(3, Math.floor((w - pad.l - pad.r) / 90))).ticks;
      const yTicks = yScale === 'log' ? plot.logTicks(y0, y1) : plot.linTicks(y0, y1, Math.max(3, Math.floor((h - pad.t - pad.b) / 46))).ticks;

      ctx.strokeStyle = t.grid;
      ctx.lineWidth = 1;
      for (const xt of xTicks) {
        const X = Math.round(px(xt)) + 0.5;
        if (X < pad.l - 1 || X > w - pad.r + 1) continue;
        ctx.beginPath();
        ctx.moveTo(X, pad.t);
        ctx.lineTo(X, h - pad.b);
        ctx.stroke();
      }
      for (const yt of yTicks) {
        const Y = Math.round(py(yt)) + 0.5;
        if (Y < pad.t - 1 || Y > h - pad.b + 1) continue;
        ctx.beginPath();
        ctx.moveTo(pad.l, Y);
        ctx.lineTo(w - pad.r, Y);
        ctx.stroke();
      }

      // 轴
      ctx.strokeStyle = t.axis;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(pad.l + 0.5, pad.t);
      ctx.lineTo(pad.l + 0.5, h - pad.b + 0.5);
      ctx.lineTo(w - pad.r, h - pad.b + 0.5);
      ctx.stroke();

      // 刻度标签
      ctx.fillStyle = t.muted;
      ctx.textAlign = 'right';
      for (const yt of yTicks) {
        const Y = py(yt);
        if (Y < pad.t - 1 || Y > h - pad.b + 1) continue;
        ctx.fillText(plot.fmtTick(yt), pad.l - 6, Y);
      }
      ctx.textAlign = 'center';
      for (const xt of xTicks) {
        const X = px(xt);
        if (X < pad.l - 1 || X > w - pad.r + 1) continue;
        ctx.fillText(plot.fmtTick(xt), X, h - pad.b + 14);
      }

      // 轴标题
      ctx.fillStyle = t.text;
      ctx.font = '12px system-ui, sans-serif';
      if (opts.xLabel) {
        ctx.textAlign = 'center';
        ctx.fillText(opts.xLabel, pad.l + (w - pad.l - pad.r) / 2, h - 8);
      }
      if (opts.yLabel) {
        ctx.save();
        ctx.translate(13, pad.t + (h - pad.t - pad.b) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText(opts.yLabel, 0, 0);
        ctx.restore();
      }
      if (opts.title) {
        ctx.textAlign = 'left';
        ctx.font = '13px system-ui, sans-serif';
        ctx.fillStyle = t.text;
        ctx.fillText(opts.title, pad.l - 40, 16);
      }

      // 数据
      series.forEach((s, idx) => {
        const color = s.color || PALETTE[idx % PALETTE.length];
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = s.width || 2;
        ctx.setLineDash(s.dash ? [6, 4] : []);
        const pts = s.points.map(([x, y]) => [px(x), py(y)]);
        if ((s.type || 'line') === 'line' && pts.length > 1) {
          ctx.beginPath();
          pts.forEach(([X, Y], i) => (i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y)));
          ctx.stroke();
        }
        if ((s.type || 'line') === 'scatter' || pts.length <= 40) {
          ctx.setLineDash([]);
          for (const [X, Y] of pts) {
            ctx.beginPath();
            ctx.arc(X, Y, (s.type || 'line') === 'scatter' ? 3.4 : 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.setLineDash([]);
      });

      // 标注
      for (const a of opts.annotations || []) {
        const X = px(a.x);
        const Y = py(a.y);
        ctx.fillStyle = a.color || t.accent;
        ctx.font = '600 12px system-ui, sans-serif';
        ctx.textAlign = a.align || 'left';
        ctx.fillText(a.text, X + (a.dx || 4), Y + (a.dy || -6));
      }

      // 图例
      if (series.length > 1 || opts.legend !== false) {
        let lx = pad.l + 6;
        const ly = pad.t + 6;
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'left';
        series.forEach((s, idx) => {
          const color = s.color || PALETTE[idx % PALETTE.length];
          ctx.fillStyle = color;
          ctx.fillRect(lx, ly - 4, 10, 3);
          ctx.fillStyle = t.text;
          const label = s.name || `序列 ${idx + 1}`;
          ctx.fillText(label, lx + 14, ly);
          lx += ctx.measureText(label).width + 34;
          if (lx > w - pad.r - 60) lx = pad.l + 6;
        });
      }

      // 悬停标记
      if (state.hover) {
        const { X, Y, label } = state.hover;
        ctx.strokeStyle = t.accent;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(X, pad.t);
        ctx.lineTo(X, h - pad.b);
        ctx.moveTo(pad.l, Y);
        ctx.lineTo(w - pad.r, Y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = t.accent;
        ctx.beginPath();
        ctx.arc(X, Y, 4, 0, Math.PI * 2);
        ctx.fill();
        tip.hidden = false;
        tip.textContent = label;
        tip.style.left = `${Math.min(Math.max(X + 10, 6), w - 150)}px`;
        tip.style.top = `${Math.max(Y - 34, 4)}px`;
      } else {
        tip.hidden = true;
      }

      // 图注：自动拟合斜率
      if (opts.fitSlope && series.length) {
        const s = series[0];
        const lx = s.points.map((p) => Math.log10(p[0]));
        const ly = s.points.map((p) => Math.log10(Math.max(p[1], Number.MIN_VALUE)));
        const k = util.slope(lx, ly);
        const r = util.pearson(lx, ly);
        caption.textContent = `log-log 拟合斜率 ≈ ${k.toFixed(3)}（相关系数 r = ${Number.isFinite(r) ? r.toFixed(4) : 'n/a'}）${
          opts.caption ? ' · ' + opts.caption : ''
        }`;
        caption.hidden = false;
      } else if (opts.caption) {
        caption.textContent = opts.caption;
        caption.hidden = false;
      } else {
        caption.hidden = true;
      }
    }

    // 悬停
    if (opts.hover !== false) {
      canvas.addEventListener('mousemove', (e) => {
        const g = state.geom;
        if (!g) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        // 找最近数据点（按 x 距离，比较各序列）
        let best = null;
        g.series.forEach((s, idx) => {
          for (const [x, y] of s.points) {
            const d = Math.abs(g.px(x) - mx);
            if (!best || d < best.d) best = { d, x, y, idx };
          }
        });
        if (best && best.d < 24) {
          const name = g.series[best.idx].name || '';
          state.hover = {
            X: g.px(best.x),
            Y: g.py(best.y),
            label: `${name ? name + ' · ' : ''}x=${util.fmtNum(best.x, 4)}, y=${util.fmtNum(best.y, 4)}`,
          };
        } else {
          state.hover = null;
        }
        draw();
      });
      canvas.addEventListener('mouseleave', () => {
        state.hover = null;
        draw();
      });
    }

    // 尺寸变化重绘
    const offTheme = CPL.bus.on('theme:changed', () => draw());
    if (typeof ResizeObserver === 'function') {
      const ro = new ResizeObserver(util.debounce(() => draw(), 90));
      ro.observe(wrap);
      state.dispose = () => {
        state.disposed = true;
        offTheme();
        ro.disconnect();
      };
    } else {
      const onResize = util.debounce(() => draw(), 120);
      window.addEventListener('resize', onResize);
      state.dispose = () => {
        state.disposed = true;
        offTheme();
        window.removeEventListener('resize', onResize);
      };
    }

    draw();
    return {
      update(next) {
        Object.assign(opts, next || {});
        if (next && next.series) opts.series = next.series;
        draw();
      },
      redraw: draw,
      dispose: () => state.dispose && state.dispose(),
      element: wrap,
    };
  };

  plot.fmtTick = function fmtTick(v) {
    const a = Math.abs(v);
    if (a === 0) return '0';
    if (a >= 1e5 || a < 1e-3) {
      const e = Math.round(Math.log10(a));
      const m = v / Math.pow(10, e);
      return Math.abs(m - 1) < 1e-9 ? `10^${e}` : `${Number(m.toPrecision(2))}·10^${e}`;
    }
    if (a >= 1000) return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return String(Number(v.toPrecision(3)));
  };

  // ─────────────────────────────────────────────────────────────
  // 柱状图（用于"操作次数对比"这类场景）
  // ─────────────────────────────────────────────────────────────
  plot.bars = function bars(container, { items = [], max, height = 220, unit = '' } = {}) {
    const wrap = CPL.dom.h('div', { class: 'cpl-bars', role: 'img', 'aria-label': '柱状对比图' });
    const top = max || Math.max(...items.map((i) => i.value), 1);
    for (const item of items) {
      const pct = Math.max(1, (item.value / top) * 100);
      wrap.append(
        CPL.dom.h(
          'div',
          { class: 'cpl-bars__row' },
          CPL.dom.h('span', { class: 'cpl-bars__label', text: item.label }),
          CPL.dom.h(
            'span',
            { class: 'cpl-bars__track' },
            CPL.dom.h('span', {
              class: 'cpl-bars__fill',
              style: {
                width: `${pct}%`,
                background: item.color || 'var(--cpl-accent)',
                height: `${Math.max(8, Math.min(20, height / Math.max(items.length, 1) / 1.8))}px`,
              },
            })
          ),
          CPL.dom.h('span', { class: 'cpl-bars__value', text: `${util.fmtNum(item.value, 4)}${unit}` })
        )
      );
    }
    container.append(wrap);
    return wrap;
  };

  // ─────────────────────────────────────────────────────────────
  // 热力图（哈希探测序列、内存布局等）
  // ─────────────────────────────────────────────────────────────
  plot.heatmap = function heatmap(container, { rows = [], cols = [], values = [], cell = 22, xLabel = '', yLabel = '' } = {}) {
    const wrap = CPL.dom.h('div', { class: 'cpl-heatmap-wrap' });
    const table = CPL.dom.h('table', { class: 'cpl-heatmap' });
    const max = Math.max(...values.flat().filter(Number.isFinite), 1);
    const head = CPL.dom.h('tr', {}, CPL.dom.h('th', { class: 'cpl-heatmap__corner', text: yLabel ? `${yLabel} \\ ${xLabel}` : '' }));
    for (const c of cols) head.append(CPL.dom.h('th', { class: 'cpl-heatmap__col', text: String(c) }));
    table.append(CPL.dom.h('thead', {}, head));

    const body = CPL.dom.h('tbody');
    rows.forEach((r, ri) => {
      const tr = CPL.dom.h('tr', {}, CPL.dom.h('th', { class: 'cpl-heatmap__row', text: String(r) }));
      cols.forEach((c, ci) => {
        const v = values[ri] ? values[ri][ci] : 0;
        const ratio = max ? Math.max(0, Math.min(1, v / max)) : 0;
        tr.append(
          CPL.dom.h('td', {
            class: 'cpl-heatmap__cell',
            style: {
              width: `${cell}px`,
              height: `${cell}px`,
              background: `color-mix(in srgb, var(--cpl-accent) ${Math.round(ratio * 100)}%, var(--cpl-bg-sunken))`,
            },
            title: `${r} / ${c} = ${v}`,
            text: '',
          })
        );
      });
      body.append(tr);
    });
    table.append(body);
    wrap.append(table);
    container.append(wrap);
    return wrap;
  };
})();

/* ===== pieces/82-demos.js ===== */
/* ============================================================================
 * 82-demos.js — 交互式 demo 注册表与内置 demo
 *
 * 每个 demo 是一个函数：(host, params, api) => cleanup?
 *   · host  要挂载进去的容器
 *   · params 课程里 demo.params 传入的初始参数
 *   · api   { on(kind, fn) 注册「发给 AI 助教的问题」、lesson 当前课程、setParam }
 *
 * 课程文件只需写 demo: { kind: 'growth-curve', params: {...} }，
 * 渲染逻辑与调参 UI 都在这里，课程内容保持"只有知识、没有框架代码"。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;
  const plot = CPL.plot;

  const demos = (CPL.demos = {});

  const registry = new Map();

  demos.register = (kind, fn) => registry.set(kind, fn);
  demos.has = (kind) => registry.has(kind);
  demos.kinds = () => Array.from(registry.keys());

  /** 挂载 demo；失败时展示错误卡而不是让整页崩掉。 */
  demos.mount = function mount(kind, host, params = {}, api = {}) {
    const fn = registry.get(kind);
    if (!fn) {
      host.append(
        dom.errorCard(`没有找到 demo「${kind}」`, '可能是课程内容里的 kind 拼写有误，或对应分片未加载。', [
          `已注册的 demo：${demos.kinds().join(', ') || '（无）'}`,
        ])
      );
      return null;
    }
    try {
      return fn(host, params, api) || null;
    } catch (err) {
      CPL.log('error', `demo ${kind} 渲染失败`, err);
      host.append(dom.errorCard('这个 demo 没能渲染出来', dom.friendlyError(err), ['刷新页面重试']));
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 通用控件工厂
  // ─────────────────────────────────────────────────────────────
  function slider({ label, min, max, step = 1, value, format = (v) => String(v), onInput }) {
    const out = dom.h('output', { class: 'cpl-ctl__value', text: format(value) });
    const input = dom.h('input', {
      type: 'range',
      class: 'cpl-ctl__range',
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(value),
      'aria-label': label,
      oninput: (e) => {
        const v = Number(e.target.value);
        out.textContent = format(v);
        onInput(v);
      },
    });
    return {
      el: dom.h('label', { class: 'cpl-ctl' }, dom.h('span', { class: 'cpl-ctl__label', text: label }), input, out),
      input,
      set(v) {
        input.value = String(v);
        out.textContent = format(Number(v));
      },
    };
  }

  function checkbox({ label, checked, onChange, hint }) {
    const input = dom.h('input', {
      type: 'checkbox',
      checked,
      onchange: (e) => onChange(e.target.checked),
    });
    const el = dom.h(
      'label',
      { class: 'cpl-check cpl-check--inline' },
      input,
      dom.h('span', {}, dom.h('span', { text: label }), hint ? dom.h('small', { class: 'cpl-ctl__hint', text: ` ${hint}` }) : null)
    );
    return { el, input };
  }

  function panel(title, ...children) {
    return dom.h(
      'section',
      { class: 'cpl-demo__panel' },
      title ? dom.h('h4', { class: 'cpl-demo__panel-title', text: title }) : null,
      ...children
    );
  }

  // ─────────────────────────────────────────────────────────────
  // demo 1：复杂度增长曲线
  // ─────────────────────────────────────────────────────────────
  const COMPLEXITIES = [
    { key: 'O(1)', color: '#868e96', f: () => 1 },
    { key: 'O(log N)', color: '#0ca678', f: (N) => Math.log2(N) },
    { key: 'O(N)', color: '#3b5bdb', f: (N) => N },
    { key: 'O(N log N)', color: '#1098ad', f: (N) => N * Math.log2(N) },
    { key: 'O(N²)', color: '#e8590c', f: (N) => N * N },
    { key: 'O(2^N)', color: '#c2255c', f: (N) => Math.pow(2, N) },
  ];

  /** 一次"基本操作"的粗略耗时估计（现代 CPU 上跑 JS 循环的量级）。 */
  const NS_PER_OP = 1.2;

  function humanTime(ns) {
    if (!Number.isFinite(ns)) return '∞';
    const s = ns / 1e9;
    if (s < 1e-6) return `${(ns).toFixed(1)} ns`;
    if (s < 1e-3) return `${(s * 1e6).toFixed(1)} µs`;
    if (s < 1) return `${(s * 1e3).toFixed(1)} ms`;
    if (s < 60) return `${s.toFixed(2)} s`;
    if (s < 3600) return `${(s / 60).toFixed(1)} min`;
    if (s < 86400) return `${(s / 3600).toFixed(2)} h`;
    if (s < 86400 * 365) return `${(s / 86400).toFixed(1)} 天`;
    return `${(s / 86400 / 365).toFixed(1)} 年`;
  }

  demos.register('growth-curve', (host, params, api) => {
    const state = {
      N: params.N || 1e5,
      active: new Set(['O(N)', 'O(N log N)', 'O(N²)']),
      measure: false,
      measured: null,
    };

    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const tableHost = dom.h('div', { class: 'cpl-demo__table' });
    const noteHost = dom.h('div', { class: 'cpl-demo__note' });

    const nSlider = slider({
      label: '输入规模 N',
      min: 2,
      max: 8,
      step: 0.05,
      value: Math.log10(state.N),
      format: (v) => `10^${Number(v).toFixed(2)} ≈ ${util.fmtNum(Math.pow(10, v), 3)}`,
      onInput: (v) => {
        state.N = Math.pow(10, v);
        refresh();
      },
    });

    const toggles = dom.h('div', { class: 'cpl-demo__toggles' });
    for (const c of COMPLEXITIES) {
      const cb = checkbox({
        label: c.key,
        checked: state.active.has(c.key),
        onChange: (on) => {
          if (on) state.active.add(c.key);
          else state.active.delete(c.key);
          refresh();
        },
      });
      toggles.append(cb.el);
    }

    const measureBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '实测一下 O(N) 与 O(N²)（真跑代码）',
      onclick: runMeasurement,
    });

    let view = null;

    function runMeasurement() {
      // 真跑：证明"理论量级"不是纸面结论。上限保护避免把页面卡死。
      const N = Math.min(Math.round(state.N), 40000);
      const arr = new Float64Array(N);
      for (let i = 0; i < N; i++) arr[i] = i;

      const t0 = performance.now();
      let s1 = 0;
      for (let i = 0; i < N; i++) s1 += arr[i];
      const t1 = performance.now() - t0;

      const t2s = performance.now();
      let s2 = 0;
      // 只跑 N/20 规模的外层，避免 O(N²) 在 4e4 时把浏览器钉死
      const M = Math.max(1, Math.round(N / 20));
      for (let i = 0; i < M; i++) {
        for (let j = 0; j < M; j++) s2 += 1;
      }
      const t2 = (performance.now() - t2s) * 400; // 按 N² 折算回同规模

      state.measured = { N, linearMs: t1, quadraticMs: t2 };
      noteHost.textContent = `实测（N=${N.toLocaleString()}）：O(N) 求和 ${t1.toFixed(2)} ms；O(N²) 等规模折算约 ${t2.toFixed(1)} ms（放大 ${(t2 / Math.max(t1, 0.001)).toFixed(0)} 倍）。校验和 ${s1.toFixed(0)} / ${s2.toFixed(0)}`;
      refresh();
    }

    function series() {
      const out = [];
      for (const c of COMPLEXITIES) {
        if (!state.active.has(c.key)) continue;
        const pts = [];
        for (let e = 1; e <= 8.001; e += 0.25) {
          const N = Math.pow(10, e);
          pts.push([N, Math.max(c.f(N), Number.MIN_VALUE)]);
        }
        out.push({ name: c.key, points: pts, color: c.color, type: 'line' });
      }
      // 当前 N 的竖线（用两个点画出来）
      if (state.N) {
        out.push({
          name: `当前 N`,
          points: [
            [state.N, 1],
            [state.N, 1e18],
          ],
          color: 'var(--cpl-text-mute)',
          dash: true,
          width: 1,
        });
      }
      return out;
    }

    function refresh() {
      dom.clear(tableHost);
      dom.clear(canvasHost);
      if (view) view.dispose();

      view = plot.mount(canvasHost, {
        series: series(),
        xScale: 'log',
        yScale: 'log',
        xLabel: 'N（log）',
        yLabel: '基本操作次数（log）',
        height: 300,
        caption: 'log-log 上：斜率 1 = O(N)，斜率 2 = O(N²)，斜率 ~1 但整体抬高 = O(N log N)',
      });

      // 当前 N 下的数量级表
      const N = state.N;
      const rows = COMPLEXITIES.filter((c) => state.active.has(c.key)).map((c) => {
        const ops = c.f(N);
        const seconds = ops * NS_PER_OP / 1e9;
        const mem = c.key === 'O(N)' || c.key === 'O(N log N)' ? N * 8 : c.key === 'O(N²)' ? N * N * 8 : 0;
        return [
          c.key,
          util.fmtNum(ops, 3),
          humanTime(ops * NS_PER_OP),
          mem ? util.bytes(mem) : '—',
        ];
      });

      const table = dom.h(
        'table',
        { class: 'cpl-table cpl-table--compact' },
        dom.h(
          'thead',
          {},
          dom.h(
            'tr',
            {},
            dom.h('th', { text: '复杂度' }),
            dom.h('th', { text: `N = ${util.fmtNum(N, 3)} 时的操作数` }),
            dom.h('th', { text: `按 ~${NS_PER_OP} ns/次估算耗时` }),
            dom.h('th', { text: '若每元素 8 字节的内存' })
          )
        ),
        dom.h(
          'tbody',
          {},
          rows.map((r) => dom.h('tr', {}, r.map((c) => dom.h('td', { text: c }))))
        )
      );
      tableHost.append(table);
    }

    host.append(
      panel(
        '参数',
        nSlider.el,
        toggles,
        dom.h('div', { class: 'cpl-demo__actions' }, measureBtn),
        dom.h('p', {
          class: 'cpl-ctl__hint',
          text:
            '提示：表格里的"估算耗时"是把操作数乘以一个典型的单次操作耗时得到的量级估计，用来判断"这台机器上还行不行"，不是精确预测。点上面的按钮会真的跑一次给你看。',
        })
      ),
      panel('数量级对比', canvasHost),
      panel(null, tableHost, noteHost)
    );

    refresh();

    api.on && api.on('ask', () => '为什么 O(N²) 在 N=10⁴ 就已经很难受了？把 N 再放大 10 倍，耗时变化多少倍？');

    return () => view && view.dispose();
  });

  // ─────────────────────────────────────────────────────────────
  // demo 2：内存模型探针（寻址代价与缓存局部性）
  // ─────────────────────────────────────────────────────────────
  demos.register('memory-model', (host, params, api) => {
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const out = dom.h('div', { class: 'cpl-demo__note' });
    let view = null;

    const strides = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

    function bench(stride) {
      const N = 1 << 22; // 4M 个 float64 = 32 MB，超过 L3 常见容量
      const n = stride === 1 ? 3 : 2;
      let best = Infinity;
      for (let trial = 0; trial < n; trial++) {
        const t0 = performance.now();
        let acc = 0;
        const count = Math.floor(N / stride);
        for (let i = 0; i < count; i++) acc += i;
        best = Math.min(best, performance.now() - t0);
      }
      void N;
      return best;
    }

    /**
     * 更真实的缓存实验：构造一个"每次跳 stride 个元素"的数组遍历，
     * 比较顺序访问与跨步访问的带宽差异。
     */
    function strideBench(stride) {
      const elements = 1 << 20; // 1M
      const data = new Float64Array(elements);
      for (let i = 0; i < elements; i++) data[i] = i * 0.5;
      const step = stride;
      const rounds = Math.max(1, Math.floor(8 / Math.log2(Math.max(stride, 2))));
      let best = Infinity;
      for (let r = 0; r < rounds; r++) {
        let acc = 0;
        const t0 = performance.now();
        for (let i = 0; i < elements; i += step) acc += data[i];
        const dt = performance.now() - t0;
        best = Math.min(best, dt);
        void acc;
      }
      return best;
    }

    const runBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '运行内存带宽实验（约 1 秒）',
      onclick: () => {
        runBtn.disabled = true;
        runBtn.textContent = '测量中…';
        setTimeout(() => {
          const pts = [];
          const rows = [];
          for (const s of strides) {
            const ms = strideBench(s);
            const bytesTouched = (1 << 20) * 8 / s;
            pts.push([s * 8, bytesTouched / (ms / 1000) / 1e9]); // x: 跨步字节数, y: 有效带宽 GB/s
            rows.push([`${s} × 8 B = ${s * 8} B`, `${ms.toFixed(2)} ms`, `${(bytesTouched / (ms / 1000) / 1e9).toFixed(3)} GB/s`]);
          }
          dom.clear(out);
          out.append(
            dom.h('p', {
              text:
                '这是本机实测，绝对值随机器变化，但趋势稳定：跨步一旦超过缓存行（通常 64 B），有效带宽明显下降——因为每次访问都要搬进一整条 cache line，只用到了其中一小部分。',
            })
          );
          dom.clear(canvasHost);
          if (view) view.dispose();
          view = plot.mount(canvasHost, {
            series: [{ name: '有效带宽', points: pts, color: '#e8590c', type: 'line' }],
            xScale: 'log',
            yScale: 'linear',
            xLabel: '跨步字节数（log）',
            yLabel: '有效带宽 (GB/s)',
            height: 260,
          });
          const tbl = dom.h(
            'table',
            { class: 'cpl-table cpl-table--compact' },
            dom.h('thead', {}, dom.h('tr', {}, ['跨步', '耗时', '有效带宽'].map((h) => dom.h('th', { text: h })))),
            dom.h('tbody', {}, rows.map((r) => dom.h('tr', {}, r.map((c) => dom.h('td', { text: c })))))
          );
          out.append(tbl);
          runBtn.disabled = false;
          runBtn.textContent = '重新测量';
        }, 30);
      },
    });

    host.append(
      panel(
        '缓存局部性实验',
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '同一个数组、同样数量的元素，只改变"访问跨步"，有效带宽就会掉一个量级。这就是为什么 Fortran 的列主序（第一维连续）和 C 的行主序（最后一维连续）会让同一段公式差好几倍性能。',
        }),
        dom.h('div', { class: 'cpl-demo__actions' }, runBtn),
        out,
        canvasHost
      )
    );

    api.on && api.on('ask', () => '你测到的带宽随跨步怎么变化？把它和"数组维度顺序"联系起来：改一下 Fortran 里 do 循环的嵌套顺序，性能会变吗？');
    void bench;

    return () => view && view.dispose();
  });

  // ─────────────────────────────────────────────────────────────
  // demo 3：浮点误差累加
  // ─────────────────────────────────────────────────────────────
  function kahanSum(arr) {
    let sum = 0;
    let c = 0;
    for (let i = 0; i < arr.length; i++) {
      const y = arr[i] - c;
      const t = sum + y;
      c = t - sum - y;
      sum = t;
    }
    return sum;
  }

  function naiveSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    return sum;
  }

  demos.register('float-error', (host, params, api) => {
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const resultHost = dom.h('div', { class: 'cpl-demo__note' });
    let view = null;
    let n = params.n || 10000;

    const valueSel = dom.h(
      'select',
      { class: 'cpl-select', 'aria-label': '被累加的值' },
      [
        { v: '0.1', label: '0.1（二进制无限循环小数）' },
        { v: '1e-8', label: '1e-8（与小量相加被吞掉）' },
        { v: '0.333333333333', label: '0.333333333333（截断的 1/3）' },
      ].map((o) => dom.h('option', { value: o.v, text: o.label }))
    );

    const nSlider = slider({
      label: '累加次数',
      min: 1,
      max: 6,
      step: 0.02,
      value: Math.log10(n),
      format: (v) => `10^${Number(v).toFixed(2)} = ${util.fmtNum(Math.pow(10, v), 3)} 次`,
      onInput: (v) => {
        n = Math.round(Math.pow(10, v));
        refresh();
      },
    });

    function refresh() {
      const v = Number(valueSel.value);
      const count = Math.min(n, 2e6);
      const arr = new Float64Array(count);
      arr.fill(v);
      const naive = naiveSum(arr);
      const kahan = kahanSum(arr);
      const exact = v * count;

      const series = [];
      const ptsNaive = [];
      const ptsKahan = [];
      let s1 = 0;
      let s2 = 0;
      let c = 0;
      for (let i = 1; i <= count; i++) {
        s1 += v;
        const y = v - c;
        const t = s2 + y;
        c = t - s2 - y;
        s2 = t;
        if (i === 1 || i % Math.max(1, Math.floor(count / 120)) === 0 || i === count) {
          ptsNaive.push([i, Math.abs(s1 - v * i) || Number.MIN_VALUE]);
          ptsKahan.push([i, Math.abs(s2 - v * i) || Number.MIN_VALUE]);
        }
      }
      series.push({ name: '朴素累加误差', points: ptsNaive, color: '#e8590c' });
      series.push({ name: 'Kahan 补偿误差', points: ptsKahan, color: '#0ca678' });

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series,
        xScale: 'log',
        yScale: 'log',
        xLabel: '累加次数（log）',
        yLabel: '与精确值的偏差（log）',
        height: 280,
        caption: '误差归零的点会被画在下界处（0 无法画在 log 轴上）',
      });

      dom.clear(resultHost);
      const rows = [
        ['精确值 v×n', exact.toPrecision(17)],
        ['朴素累加', naive.toPrecision(17)],
        ['Kahan 补偿', kahan.toPrecision(17)],
        ['朴素相对误差', exact !== 0 ? Math.abs((naive - exact) / exact).toExponential(3) : '—'],
        ['Kahan 相对误差', exact !== 0 ? Math.abs((kahan - exact) / exact).toExponential(3) : '—'],
        ['机器 epsilon (float64)', Number.EPSILON.toExponential(6)],
      ];
      resultHost.append(
        dom.h(
          'table',
          { class: 'cpl-table cpl-table--compact' },
          dom.h('thead', {}, dom.h('tr', {}, [dom.h('th', { text: '量' }), dom.h('th', { text: '值' })])),
          dom.h('tbody', {}, rows.map((r) => dom.h('tr', {}, dom.h('td', { text: r[0] }), dom.h('td', { class: 'cpl-mono', text: r[1] }))))
        )
      );
      resultHost.append(
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '朴素累加的误差随 n 近似线性增长（n·ε），Kahan 补偿把误差压到基本与 n 无关。注意：这不是"浮点不精确"这种笼统结论，而是可预测的 n·ε 量级。',
        })
      );
    }

    valueSel.addEventListener('change', refresh);

    host.append(
      panel(
        '参数',
        dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '累加的值 v' }), valueSel),
        nSlider.el
      ),
      panel('误差随累加次数的增长', canvasHost),
      panel('数值对照', resultHost)
    );

    refresh();
    api.on && api.on('ask', () => '你的朴素累加误差是 n·ε 的量级吗？把 n 放大 100 倍，误差涨了多少倍？你论文里哪个求和是这个形状？');
    return () => view && view.dispose();
  });
})();

/* ===== pieces/83-demos-cs.js ===== */
/* ============================================================================
 * 83-demos-cs.js — 模块 5（CS 核心）与模块 3（Fortran）的交互式 demo
 *
 * 每个 demo 都是真实的交互控件 + 真实计算，不是静态截图。
 * 全部零依赖（用 80-plot.js 的 Canvas 绘图与 82-demos.js 的控件工厂）。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;
  const plot = CPL.plot;
  const demos = CPL.demos;

  // ── 复用 82-demos.js 里的控件工厂（这里重新定义一份，避免跨分片私有依赖） ──
  function slider({ label, min, max, step = 1, value, format = (v) => String(v), onInput }) {
    const out = dom.h('output', { class: 'cpl-ctl__value', text: format(value) });
    const input = dom.h('input', {
      type: 'range',
      class: 'cpl-ctl__range',
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(value),
      'aria-label': label,
      oninput: (e) => {
        const v = Number(e.target.value);
        out.textContent = format(v);
        onInput(v);
      },
    });
    return { el: dom.h('label', { class: 'cpl-ctl' }, dom.h('span', { class: 'cpl-ctl__label', text: label }), input, out), input };
  }

  function checkbox({ label, checked, onChange }) {
    const input = dom.h('input', { type: 'checkbox', checked, onchange: (e) => onChange(e.target.checked) });
    return dom.h('label', { class: 'cpl-check cpl-check--inline' }, input, dom.h('span', { text: label }));
  }

  function panel(title, ...children) {
    return dom.h('section', { class: 'cpl-demo__panel' }, title ? dom.h('h4', { class: 'cpl-demo__panel-title', text: title }) : null, ...children.filter(Boolean));
  }

  function table(headers, rows) {
    return dom.h(
      'table',
      { class: 'cpl-table cpl-table--compact' },
      dom.h('thead', {}, dom.h('tr', {}, headers.map((h) => dom.h('th', { text: h })))),
      dom.h(
        'tbody',
        {},
        rows.map((r) => dom.h('tr', {}, r.map((c) => dom.h('td', { text: c === null || c === undefined ? '—' : String(c) }))))
      )
    );
  }

  function fmtOps(n) {
    if (!Number.isFinite(n)) return '∞';
    const a = Math.abs(n);
    if (a >= 1e15) return n.toExponential(2);
    if (a >= 1e6) return n.toExponential(3);
    return Math.round(n).toLocaleString('en-US');
  }

  function human(ns) {
    const s = ns / 1e9;
    if (s < 1e-6) return `${(ns).toFixed(0)} ns`;
    if (s < 1e-3) return `${(s * 1e6).toFixed(1)} µs`;
    if (s < 1) return `${(s * 1e3).toFixed(1)} ms`;
    if (s < 60) return `${s.toFixed(2)} s`;
    if (s < 3600) return `${(s / 60).toFixed(1)} min`;
    if (s < 86400) return `${(s / 3600).toFixed(1)} h`;
    if (s < 86400 * 365) return `${(s / 86400).toFixed(1)} 天`;
    return `${(s / 86400 / 365).toExponential(2)} 年`;
  }

  const NS_PER_OP = 1.2;

  // ═════════════════════════════════════════════════════════════
  // 通用：复杂度对照表 + 增长曲线（几乎所有 CS 课都能用）
  // ═════════════════════════════════════════════════════════════
  const TERMS = {
    'O(1)': () => 1,
    'O(log N)': (N) => Math.log2(Math.max(N, 2)),
    'O(√N)': (N) => Math.sqrt(N),
    'O(N)': (N) => N,
    'O(N log N)': (N) => N * Math.log2(Math.max(N, 2)),
    'O(N^1.5)': (N) => Math.pow(N, 1.5),
    'O(N²)': (N) => N * N,
    'O(N³)': (N) => N * N * N,
    'O(2^N)': (N) => Math.pow(2, Math.min(N, 1024)),
  };

  demos.register('complexity-table', (host, params, api) => {
    const presets = params.presets || ['O(N)', 'O(N log N)', 'O(N²)'];
    const active = new Set(presets);
    const state = { N: params.N || 1e6, memBytesPerElem: params.memBytesPerElem || 8 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const tableHost = dom.h('div', {});
    let view = null;

    const nSlider = slider({
      label: '输入规模 N',
      min: 1,
      max: 9,
      step: 0.1,
      value: Math.log10(state.N),
      format: (v) => `10^${Number(v).toFixed(1)} = ${fmtOps(Math.pow(10, v))}`,
      onInput: (v) => {
        state.N = Math.pow(10, v);
        refresh();
      },
    });

    const toggles = dom.h('div', { class: 'cpl-demo__toggles' });
    for (const key of Object.keys(TERMS)) {
      toggles.append(
        checkbox({
          label: key,
          checked: active.has(key),
          onChange: (on) => {
            if (on) active.add(key);
            else active.delete(key);
            refresh();
          },
        })
      );
    }

    function refresh() {
      const N = state.N;
      dom.clear(tableHost);
      const rows = Array.from(active).map((key) => {
        const ops = TERMS[key](N);
        const mem = /N\^?[23²³]/.test(key) ? N * N * state.memBytesPerElem : /N/.test(key) ? N * state.memBytesPerElem : 0;
        return [
          key,
          fmtOps(ops),
          human(ops * NS_PER_OP),
          mem && mem < 1e18 ? util.bytes(mem) : '—',
          Number.isFinite(ops) && ops > 1e12 ? '不可行' : ops > 1e9 ? '勉强' : '可行',
        ];
      });
      tableHost.append(
        table(['复杂度', `N = ${fmtOps(N)} 时的操作数`, '按 ~1.2 ns/次估算', '线性存储内存', '判据'], rows)
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const series = Array.from(active).map((key, i) => ({
        name: key,
        color: ['#3b5bdb', '#e8590c', '#0ca678', '#ae3ec9', '#f08c00', '#1098ad', '#c2255c', '#495057'][i % 8],
        points: Array.from({ length: 33 }, (_, k) => {
          const n = Math.pow(10, 1 + k * 0.25);
          return [n, Math.max(TERMS[key](n), 1e-9)];
        }),
      }));
      view = plot.mount(canvasHost, {
        series,
        xScale: 'log',
        yScale: 'log',
        xLabel: 'N（log）',
        yLabel: '操作数（log）',
        height: 280,
        caption: 'log-log 图的斜率就是指数：斜率 1 = 线性，2 = 平方，N log N 会缓慢上翘。',
      });
    }

    host.append(panel('参数', nSlider.el, toggles), panel('量级判断', tableHost), panel('增长曲线', canvasHost));
    refresh();
    api.on && api.on('ask', () => `在 N = ${fmtOps(state.N)} 时，你选中的这几条里哪一条最先变得不可行？把它的操作数和"1 秒能跑 10⁹ 次操作"这个经验值比一下。`);
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 动态数组扩容：倍数 vs 固定增量
  // ═════════════════════════════════════════════════════════════
  demos.register('amortized-array', (host, params) => {
    const state = { N: params.N || 2000, factor: params.factor || 2 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    const tableHost = dom.h('div', {});
    let view = null;

    const nSlider = slider({ label: '追加次数 N', min: 100, max: 20000, step: 100, value: state.N, format: (v) => String(Math.round(v)), onInput: (v) => { state.N = Math.round(v); refresh(); } });
    const fSlider = slider({
      label: '扩容策略',
      min: 2,
      max: 100,
      value: Math.round(state.factor * 10),
      format: (v) => (Number(v) >= 100 ? '每次 +1（灾难）' : `容量 × ${(Number(v) / 10).toFixed(1)}`),
      onInput: (v) => {
        state.factor = Number(v) / 10;
        refresh();
      },
    });

    function simulate(N, factor) {
      let capacity = 1;
      let size = 0;
      let copies = 0;
      let reallocs = 0;
      const trace = [];
      for (let i = 0; i < N; i++) {
        if (size === capacity) {
          const next = factor >= 10 ? capacity + Math.max(1, Math.round(capacity / 10)) : Math.max(capacity + 1, Math.floor(capacity * factor));
          copies += size;
          capacity = next;
          reallocs++;
        }
        size++;
        if (i % Math.max(1, Math.floor(N / 200)) === 0 || i === N - 1) trace.push([i + 1, Math.max(copies, 1)]);
      }
      return { copies, reallocs, finalCapacity: capacity, trace };
    }

    function refresh() {
      const N = state.N;
      const doubling = simulate(N, 2);
      const current = simulate(N, state.factor);
      const fixed = simulate(N, 100); // 每次 +1

      dom.clear(outHost);
      outHost.append(
        dom.h('p', {
          text: `在 N = ${N.toLocaleString()} 次追加下，总元素搬运次数：`,
        }),
        table(
          ['扩容策略', '扩容次数', '总搬运次数', '摊销到每次追加', '对比'],
          [
            ['× 2（推荐）', doubling.reallocs, doubling.copies.toLocaleString(), (doubling.copies / N).toFixed(2), '基准'],
            [`× ${state.factor.toFixed(1)}（当前选择）`, current.reallocs, current.copies.toLocaleString(), (current.copies / N).toFixed(2), `${(current.copies / Math.max(doubling.copies, 1)).toFixed(2)}× 基准`],
            ['每次 +1（错误做法）', fixed.reallocs, fixed.copies.toLocaleString(), (fixed.copies / N).toFixed(1), `${(fixed.copies / Math.max(doubling.copies, 1)).toFixed(0)}× 基准`],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '看"摊销到每次追加"这一列：倍数扩容下它是常数（约 2），而"每次 +1"下它随 N 线性增长——这就是 O(1) 摊销与 O(N) 的区别。',
        })
      );

      dom.clear(tableHost);
      tableHost.append(
        table(['N', '× 2 总搬运', '每次 +1 总搬运'], [100, 1000, 5000, 20000].map((n) => [n.toLocaleString(), simulate(n, 2).copies.toLocaleString(), simulate(n, 100).copies.toLocaleString()]))
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [
          { name: '× 2（摊销常数）', points: doubling.trace, color: '#0ca678' },
          { name: `× ${state.factor.toFixed(1)}`, points: current.trace, color: '#3b5bdb' },
          { name: '每次 +1', points: fixed.trace, color: '#c2255c' },
        ],
        xScale: 'linear',
        yScale: 'log',
        xLabel: '追加次数',
        yLabel: '累计搬运元素数（log）',
        height: 260,
      });
    }

    host.append(panel('参数', nSlider.el, fSlider.el), panel('累计搬运代价', canvasHost), panel('数值对照', outHost, tableHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 哈希表：负载因子 vs 探测次数
  // ═════════════════════════════════════════════════════════════
  demos.register('hash-probe', (host, params) => {
    const state = { m: params.m || 512, alpha: params.alpha || 0.7, n: 0 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    const mSlider = slider({ label: '槽数 m', min: 5, max: 11, step: 1, value: Math.log2(state.m), format: (v) => `2^${Math.round(v)} = ${Math.pow(2, Math.round(v))}`, onInput: (v) => { state.m = Math.pow(2, Math.round(v)); refresh(); } });
    const aSlider = slider({ label: '负载因子 α', min: 10, max: 95, value: Math.round(state.alpha * 100), format: (v) => Number(v) / 100 === 1 ? '1.00' : (Number(v) / 100).toFixed(2), onInput: (v) => { state.alpha = Number(v) / 100; refresh(); } });

    function probeStats(m, alpha) {
      const n = Math.max(1, Math.floor(m * alpha));
      // 用真实哈希（FNV-1a）插入，统计成功/不成功的探测次数
      const table = new Array(m).fill(null);
      const hash = (k) => {
        let h = 0x811c9dc5;
        const s = String(k);
        for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
        return h >>> 0;
      };
      let maxProbe = 0;
      let totalProbe = 0;
      for (let k = 0; k < n; k++) {
        let idx = hash('key' + k) % m;
        let p = 0;
        while (table[idx] !== null) { idx = (idx + 1) % m; p++; if (p > m) break; }
        table[idx] = k;
        totalProbe += p + 1;
        maxProbe = Math.max(maxProbe, p + 1);
      }
      // 不成功查找的平均探测次数：对全部 m 个起点取平均
      let failProbe = 0;
      for (let start = 0; start < m; start++) {
        let idx = start;
        let p = 0;
        while (table[idx] !== null && p < m) { idx = (idx + 1) % m; p++; }
        failProbe += p + 1;
      }
      failProbe /= m;
      // 把探测序列可视化成热力（前 32 个槽的占用与探测长度）
      const cells = table.slice(0, 64).map((v, i) => ({ index: i, occupied: v !== null }));
      return { n, avgSuccess: totalProbe / n, maxProbe, avgFail: failProbe, cells };
    }

    function refresh() {
      const m = Math.round(state.m);
      const alpha = state.alpha;
      const stats = probeStats(m, alpha);

      const theoSuccess = 0.5 * (1 + 1 / (1 - Math.min(alpha, 0.999)));
      const theoFail = 0.5 * (1 + 1 / Math.pow(1 - Math.min(alpha, 0.999), 2));

      dom.clear(outHost);
      outHost.append(
        table(
          ['指标', '实测', '理论（开放寻址公式）'],
          [
            ['元素数 n', stats.n.toLocaleString(), `m × α = ${(m * alpha).toFixed(0)}`],
            ['成功查找平均探测', stats.avgSuccess.toFixed(3), theoSuccess.toFixed(3)],
            ['不成功查找平均探测', stats.avgFail.toFixed(3), theoFail.toFixed(3)],
            ['最长探测序列', stats.maxProbe, '—'],
            ['判据', stats.avgFail > 10 ? '⚠ 该扩容了' : stats.avgFail > 4 ? '接近临界' : '健康', '工程上常在 α≈0.7 扩容'],
          ]
        )
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const ptsFail = [];
      const ptsSuccess = [];
      for (let a = 0.05; a < 0.99; a += 0.02) {
        ptsFail.push([a, 0.5 * (1 + 1 / Math.pow(1 - a, 2))]);
        ptsSuccess.push([a, 0.5 * (1 + 1 / (1 - a))]);
      }
      view = plot.mount(canvasHost, {
        series: [
          { name: '不成功查找（理论）', points: ptsFail, color: '#c2255c' },
          { name: '成功查找（理论）', points: ptsSuccess, color: '#0ca678' },
          { name: `你在 α=${alpha.toFixed(2)} 的实测（不成功）`, points: [[alpha, stats.avgFail]], color: '#3b5bdb', type: 'scatter' },
        ],
        xScale: 'linear',
        yScale: 'linear',
        xLabel: '负载因子 α',
        yLabel: '期望探测次数',
        height: 280,
        annotations: [{ x: 0.7, y: stats.avgFail, text: 'α = 0.7', color: '#a45c00' }],
        caption: '看曲线的形状：α 超过 0.7 之后探测次数迅速上翘，收益（省下的内存）远不及代价。',
      });
    }

    host.append(panel('参数', mSlider.el, aSlider.el), panel('实测 vs 理论', outHost), panel('探测次数曲线', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 链表 vs 数组：插入/查找代价与缓存效应
  // ═════════════════════════════════════════════════════════════
  demos.register('list-vs-array', (host, params) => {
    const state = { N: params.N || 20000 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    const nSlider = slider({ label: '元素个数 N', min: 3, max: 6, step: 0.2, value: Math.log10(state.N), format: (v) => `10^${Number(v).toFixed(1)} = ${fmtOps(Math.pow(10, v))}`, onInput: (v) => { state.N = Math.round(Math.pow(10, v)); refresh(); } });

    function measure() {
      const N = state.N;
      // 数组（Float64Array）：连续内存
      const arr = new Float64Array(N);
      for (let i = 0; i < N; i++) arr[i] = i;
      let t0 = performance.now();
      let s = 0;
      for (let i = 0; i < N; i++) s += arr[i];
      const arrSum = performance.now() - t0;

      // 数组随机访问
      const idx = new Int32Array(N);
      let seed = 12345;
      for (let i = 0; i < N; i++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; idx[i] = seed % N; }
      t0 = performance.now();
      let s2 = 0;
      for (let i = 0; i < N; i++) s2 += arr[idx[i]];
      const arrRandom = performance.now() - t0;

      // "链表"：用对象数组模拟指针追逐（每个节点是一个对象，带 next 下标）
      const nodes = new Array(N);
      for (let i = 0; i < N; i++) nodes[i] = { value: i, next: i + 1 < N ? i + 1 : -1 };
      t0 = performance.now();
      let s3 = 0;
      let cur = 0;
      let guard = 0;
      while (cur !== -1 && guard++ < N + 10) { s3 += nodes[cur].value; cur = nodes[cur].next; }
      const listTraverse = performance.now() - t0;

      // 中间插入：数组要搬移，链表只改指针
      const half = Math.floor(N / 2);
      t0 = performance.now();
      const arr2 = Array.from(arr);
      arr2.splice(half, 0, -1);
      const arrInsert = performance.now() - t0;

      t0 = performance.now();
      nodes[half].next = half + 1;
      nodes[half] = { value: -1, next: half + 1 };
      const listInsert = performance.now() - t0;

      void s; void s2; void s3; void arr2; void listInsert;

      return { N, arrSum, arrRandom, listTraverse, arrInsert, listInsert: Math.max(listInsert, 0.0005) };
    }

    function refresh() {
      const r = measure();
      const N = r.N;

      dom.clear(outHost);
      outHost.append(
        table(
          ['操作', '实测耗时', '每次操作', '理论复杂度', '说明'],
          [
            ['数组顺序求和', `${r.arrSum.toFixed(3)} ms`, `${((r.arrSum * 1e6) / N).toFixed(2)} ns`, 'O(N)', '连续内存，一条 cache line 用满'],
            ['数组随机访问', `${r.arrRandom.toFixed(3)} ms`, `${((r.arrRandom * 1e6) / N).toFixed(2)} ns`, 'O(N)', '每次都可能 cache miss'],
            ['链表遍历（对象数组）', `${r.listTraverse.toFixed(3)} ms`, `${((r.listTraverse * 1e6) / N).toFixed(2)} ns`, 'O(N)', '指针追逐，缓存不友好'],
            ['数组中间插入', `${r.arrInsert.toFixed(3)} ms`, '—', 'O(N)', '需要搬移后半段'],
            ['链表中间插入（改指针）', `${r.listInsert.toFixed(3)} ms`, '—', 'O(1)', '找到位置才是瓶颈'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '结论不是"链表比数组快"或"数组比链表快"，而是：**理论复杂度只描述缩放，实际速度还取决于缓存是否命中。** 同样是 O(N) 的遍历，链表因为指针追逐可能慢好几倍。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const scale = [1e3, 3e3, 1e4, 3e4, 1e5].filter((n) => n <= 200000);
      const series = [
        { name: '数组顺序访问', color: '#0ca678', points: scale.map((n) => [n, (n * (r.arrSum * 1e6)) / N]) },
        { name: '数组随机访问', color: '#3b5bdb', points: scale.map((n) => [n, (n * (r.arrRandom * 1e6)) / N]) },
        { name: '链表遍历', color: '#c2255c', points: scale.map((n) => [n, (n * (r.listTraverse * 1e6)) / N]) },
      ];
      view = plot.mount(canvasHost, {
        series,
        xScale: 'log',
        yScale: 'log',
        xLabel: 'N（log）',
        yLabel: '预计耗时 ns（log）',
        height: 260,
        caption: '三条线斜率相同（都是 O(N)），但截距不同——这个差距就是缓存局部性的贡献。',
      });
    }

    const btn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '重新测量（本机实测）',
      onclick: () => {
        btn.disabled = true;
        setTimeout(() => { refresh(); btn.disabled = false; }, 20);
      },
    });

    host.append(panel('参数', nSlider.el, dom.h('div', { class: 'cpl-demo__actions' }, btn)), panel('本机实测', outHost), panel('缩放趋势', canvasHost));
    btn.disabled = true;
    setTimeout(() => { refresh(); btn.disabled = false; }, 30);
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 排序算法对比（比较与交换次数，真实排序）
  // ═════════════════════════════════════════════════════════════
  demos.register('sort-compare', (host, params) => {
    const state = { N: params.N || 400, pattern: 'random' };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    const counters = { cmp: 0, swap: 0 };
    const reset = () => { counters.cmp = 0; counters.swap = 0; };
    const less = (a, b) => { counters.cmp++; return a < b; };
    const swap = (a, i, j) => { counters.swap++; const t = a[i]; a[i] = a[j]; a[j] = t; };

    function insertionSort(a) { for (let i = 1; i < a.length; i++) { let j = i; while (j > 0 && less(a[j], a[j - 1])) { swap(a, j, j - 1); j--; } } return a; }
    function mergeSort(a) {
      if (a.length <= 1) return a;
      const mid = a.length >> 1;
      const l = mergeSort(a.slice(0, mid));
      const r = mergeSort(a.slice(mid));
      const out = [];
      let i = 0; let j = 0;
      while (i < l.length && j < r.length) out.push(less(r[j], l[i]) ? r[j++] : l[i++]);
      while (i < l.length) out.push(l[i++]);
      while (j < r.length) out.push(r[j++]);
      return out;
    }
    function quickSort(a, lo = 0, hi = a.length - 1) {
      if (lo >= hi) return a;
      const mid = (lo + hi) >> 1;
      // 三数取中，避免有序输入下退化
      if (less(a[mid], a[lo])) swap(a, mid, lo);
      if (less(a[hi], a[lo])) swap(a, hi, lo);
      if (less(a[hi], a[mid])) swap(a, hi, mid);
      const pivot = a[mid];
      let i = lo; let j = hi;
      while (i <= j) {
        while (less(a[i], pivot)) i++;
        while (less(pivot, a[j])) j--;
        if (i <= j) { swap(a, i, j); i++; j--; }
      }
      quickSort(a, lo, j);
      quickSort(a, i, hi);
      return a;
    }
    function heapSort(a) {
      const n = a.length;
      const sift = (start, end) => {
        let root = start;
        while (root * 2 + 1 <= end) {
          let child = root * 2 + 1;
          if (child + 1 <= end && less(a[child], a[child + 1])) child++;
          if (less(a[root], a[child])) { swap(a, root, child); root = child; } else return;
        }
      };
      for (let s = (n - 2) >> 1; s >= 0; s--) sift(s, n - 1);
      for (let e = n - 1; e > 0; e--) { swap(a, 0, e); sift(0, e - 1); }
      return a;
    }

    function makeData(N, pattern) {
      const a = new Float64Array(N);
      for (let i = 0; i < N; i++) a[i] = i;
      if (pattern === 'random') {
        let seed = 42;
        for (let i = N - 1; i > 0; i--) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; const j = seed % (i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; }
      } else if (pattern === 'sorted') {
        // 已有序
      } else if (pattern === 'reverse') {
        a.reverse();
      } else if (pattern === 'few') {
        for (let i = 0; i < N; i++) a[i] = i % 5;
      }
      return a;
    }

    const algos = [
      { name: '插入排序', fn: insertionSort, theory: 'O(N²)', best: 'O(N)（近乎有序）' },
      { name: '归并排序', fn: mergeSort, theory: 'O(N log N)', best: 'O(N log N)' },
      { name: '快速排序（三数取中）', fn: quickSort, theory: 'O(N log N) 期望', best: 'O(N log N)' },
      { name: '堆排序', fn: heapSort, theory: 'O(N log N)', best: 'O(N log N)' },
    ];

    const nSlider = slider({ label: '数据规模 N', min: 2, max: 5, step: 0.1, value: Math.log10(state.N), format: (v) => fmtOps(Math.pow(10, v)), onInput: (v) => { state.N = Math.round(Math.pow(10, v)); run(); } });

    const patSelect = dom.h(
      'select',
      { class: 'cpl-select', 'aria-label': '数据分布' },
      [
        ['random', '随机'],
        ['sorted', '已经有序（插入排序的最好情况）'],
        ['reverse', '完全逆序（快排的坏情况之一）'],
        ['few', '大量重复（三路快排的场景）'],
      ].map(([v, label]) => dom.h('option', { value: v, text: label }))
    );
    patSelect.addEventListener('change', () => { state.pattern = patSelect.value; run(); });

    function run() {
      const N = state.N;
      const rows = [];
      const points = { random: [], sorted: [], reverse: [], few: [] };
      for (const algo of algos) {
        reset();
        const data = makeData(N, state.pattern);
        const t0 = performance.now();
        const sorted = algo.fn(data);
        const ms = performance.now() - t0;
        // 校验正确性（顺带统计）
        let ok = true;
        for (let i = 1; i < sorted.length; i++) if (sorted[i - 1] > sorted[i]) { ok = false; break; }
        rows.push([
          algo.name,
          algo.theory,
          ms.toFixed(2) + ' ms',
          counters.cmp.toLocaleString(),
          counters.swap.toLocaleString(),
          ok ? '✓' : '✗ 排序结果错误',
        ]);

        // 缩放到不同 N 的预计比较次数
        for (const n of [1e2, 1e3, 1e4, 1e5]) {
          const factor = algo.name.includes('插入') ? n * n / (N * N) : (n * Math.log2(n)) / (N * Math.log2(Math.max(N, 2)));
          points.random.push([n, counters.cmp * factor]);
        }
      }

      dom.clear(outHost);
      outHost.append(
        table(['算法', '最坏复杂度', '本机耗时', '比较次数', '交换次数', '结果'], rows),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '比较次数才是跨机器可比的量。注意"已经有序"这一行：插入排序退化成 O(N)，而朴素快排（不取中）会退化成 O(N²)——这就是选择基准的重要性。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [
          { name: '插入排序 ∝ N²', points: [1e2, 1e3, 1e4, 1e5].map((n) => [n, n * n]), color: '#e8590c' },
          { name: '归并/快排/堆排 ∝ N log N', points: [1e2, 1e3, 1e4, 1e5].map((n) => [n, n * Math.log2(n)]), color: '#0ca678' },
        ],
        xScale: 'log',
        yScale: 'log',
        xLabel: 'N（log）',
        yLabel: '比较次数量级（log）',
        height: 260,
        caption: '两条参考线的斜率差就是"平方"与"N log N"的差距。',
      });
    }

    host.append(
      panel('参数', nSlider.el, dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '数据分布' }), patSelect)),
      panel('实测对比', outHost),
      panel('量级参考线', canvasHost)
    );
    run();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 二分查找边界（lower_bound / upper_bound）
  // ═════════════════════════════════════════════════════════════
  demos.register('binary-search', (host, params) => {
    const state = { target: params.target ?? 3, array: [1, 2, 3, 3, 3, 5, 8, 8, 13, 21, 34] };
    const outHost = dom.h('div', {});
    const traceHost = dom.h('div', {});

    const arrInput = dom.h('input', { class: 'cpl-input', value: state.array.join(', '), 'aria-label': '有序数组' });
    const tInput = dom.h('input', { class: 'cpl-input', type: 'number', value: String(state.target), 'aria-label': '目标值' });

    function parseArr() {
      return arrInput.value
        .split(/[,\s]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n));
    }

    function lowerBound(a, x) {
      let lo = 0; let hi = a.length;
      const trace = [];
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        trace.push({ lo, hi, mid, a: a[mid], move: a[mid] < x ? 'lo = mid+1（mid 太小）' : 'hi = mid（mid 可能就是答案）' });
        if (a[mid] < x) lo = mid + 1;
        else hi = mid;
      }
      return { index: lo, trace };
    }

    function upperBound(a, x) {
      let lo = 0; let hi = a.length;
      const trace = [];
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        trace.push({ lo, hi, mid, a: a[mid], move: a[mid] <= x ? 'lo = mid+1（mid 还可以更右）' : 'hi = mid' });
        if (a[mid] <= x) lo = mid + 1;
        else hi = mid;
      }
      return { index: lo, trace };
    }

    function refresh() {
      const a = parseArr();
      const x = Number(tInput.value);
      dom.clear(outHost);
      dom.clear(traceHost);

      if (!a.length) {
        outHost.append(dom.errorCard('数组为空', '请输入至少一个数字。'));
        return;
      }
      const sorted = a.slice().sort((p, q) => p - q);
      const isSorted = a.every((v, i) => i === 0 || a[i - 1] <= v);

      const lb = lowerBound(a, x);
      const ub = upperBound(a, x);
      const exact = a.findIndex((v) => v === x);

      outHost.append(
        table(
          ['查询', '返回值', '含义', '元素是否存在'],
          [
            ['lower_bound(a, x)', lb.index, `第一个 >= ${x} 的位置（插入点）`, exact >= 0 ? `存在，首次出现在 ${exact}` : '不存在（可插入位置）'],
            ['upper_bound(a, x)', ub.index, `第一个 > ${x} 的位置`, exact >= 0 ? `存在，共 ${ub.index - lb.index} 个` : '不存在'],
            ['相等元素区间', `[${lb.index}, ${ub.index})`, `长度 ${ub.index - lb.index}`, '—'],
          ]
        ),
        !isSorted ? dom.h('div', { class: 'cpl-callout cpl-callout--caution' }, dom.h('div', { class: 'cpl-callout__body' }, dom.h('p', { text: '⚠ 输入数组不是有序的。二分查找的前提是有序，此时结果无意义。' }))) : null,
        dom.h('p', { class: 'cpl-demo__intro', text: `左闭右开区间写法下，循环条件用 lo < hi，退出时 lo == hi 就是答案。比较次数：⌈log₂(${a.length + 1})⌉ = ${Math.ceil(Math.log2(a.length + 1))} 次。` })
      );

      // 展示 lower_bound 的搜索过程
      const steps = dom.h('ol', { class: 'cpl-trace' });
      lb.trace.forEach((t, i) => {
        const inRange = t.mid >= t.lo && t.mid < t.hi;
        steps.append(
          dom.h(
            'li',
            { class: 'cpl-trace__item' },
            dom.h('span', { class: 'cpl-trace__idx', text: `#${i + 1}` }),
            dom.h('span', { class: 'cpl-mono', text: `lo=${t.lo} hi=${t.hi} mid=${t.mid} a[mid]=${t.a}` }),
            dom.h('span', { class: 'cpl-trace__move', text: ` → ${inRange ? t.move : '（区间收敛）'}` })
          )
        );
      });
      traceHost.append(dom.h('h4', { text: 'lower_bound 的搜索轨迹（每一步区间怎么收缩）' }), steps);
    }

    arrInput.addEventListener('input', util.debounce(refresh, 300));
    tInput.addEventListener('input', util.debounce(refresh, 300));

    host.append(
      panel('输入', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '有序数组（逗号分隔）' }), arrInput), dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '目标值 x' }), tInput)),
      panel('结果', outHost),
      panel('搜索过程', traceHost)
    );
    refresh();
  });

  // ═════════════════════════════════════════════════════════════
  // 图遍历：BFS / DFS / Dijkstra
  // ═════════════════════════════════════════════════════════════
  demos.register('graph-traverse', (host, params) => {
    const defaultEdges = params.edges || [
      [0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 5], [2, 3, 8], [3, 4, 3], [2, 4, 10], [4, 5, 2], [3, 5, 6],
    ];
    const edges = defaultEdges.slice();
    const n = Math.max(...edges.flatMap((e) => [e[0], e[1]])) + 1;

    const adj = new Map();
    for (let i = 0; i < n; i++) adj.set(i, []);
    for (const [u, v, w] of edges) {
      adj.get(u).push({ to: v, w });
      adj.get(v).push({ to: u, w });
    }

    const state = { source: 0, algo: 'dijkstra' };
    const outHost = dom.h('div', {});
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    let view = null;

    function bfs(src) {
      const dist = new Array(n).fill(Infinity);
      const order = [];
      const q = [src];
      dist[src] = 0;
      while (q.length) {
        const u = q.shift();
        order.push(u);
        for (const { to } of adj.get(u)) {
          if (dist[to] === Infinity) { dist[to] = dist[u] + 1; q.push(to); }
        }
      }
      return { dist, order, unit: '边数' };
    }

    function dfs(src) {
      const dist = new Array(n).fill(Infinity);
      const order = [];
      const stack = [src];
      dist[src] = 0;
      while (stack.length) {
        const u = stack.pop();
        order.push(u);
        for (const { to } of adj.get(u)) {
          if (dist[to] === Infinity) { dist[to] = dist[u] + 1; stack.push(to); }
        }
      }
      return { dist, order, unit: '边数（不保证最短）' };
    }

    function dijkstra(src) {
      const dist = new Array(n).fill(Infinity);
      const done = new Array(n).fill(false);
      const order = [];
      dist[src] = 0;
      for (let iter = 0; iter < n; iter++) {
        let u = -1;
        for (let i = 0; i < n; i++) if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
        if (u === -1 || dist[u] === Infinity) break;
        done[u] = true;
        order.push(u);
        for (const { to, w } of adj.get(u)) {
          if (dist[u] + w < dist[to]) dist[to] = dist[u] + w;
        }
      }
      return { dist, order, unit: '权重和' };
    }

    const srcSelect = dom.h('select', { class: 'cpl-select', 'aria-label': '起点' }, Array.from({ length: n }, (_, i) => dom.h('option', { value: String(i), text: `节点 ${i}` })));
    srcSelect.addEventListener('change', () => { state.source = Number(srcSelect.value); refresh(); });

    const patSelect = dom.h('select', { class: 'cpl-select', 'aria-label': '算法' },
      [['dijkstra', 'Dijkstra（非负权最短路径）'], ['bfs', 'BFS（按边数最短）'], ['dfs', 'DFS（深度优先）']].map(([v, t]) => dom.h('option', { value: v, text: t })));
    patSelect.addEventListener('change', () => { state.algo = patSelect.value; refresh(); });

    function refresh() {
      const src = state.source;
      const res = state.algo === 'dijkstra' ? dijkstra(src) : state.algo === 'bfs' ? bfs(src) : dfs(src);

      dom.clear(outHost);
      outHost.append(
        table(
          ['节点', '距离 / 层级', '是否可达'],
          Array.from({ length: n }, (_, i) => [String(i), res.dist[i] === Infinity ? '∞' : String(res.dist[i]), res.dist[i] === Infinity ? '不可达' : '可达'])
        ),
        dom.h('p', { class: 'cpl-demo__intro', text: `度量方式：${res.unit}。访问顺序：${res.order.join(' → ')}` }),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            state.algo === 'dijkstra'
              ? 'Dijkstra 的贪心前提是"已确定点的距离不会再被改进"。这条性质依赖所有边权非负——加一条负权边试试（把上面的边权改成负数），预测结果会发生什么。'
              : state.algo === 'bfs'
              ? 'BFS 只在"每条边代价相同"时给出最短路径（按边数）。边权不等时它给出的不是最小代价路径——这正是需要 Dijkstra 的原因。'
              : 'DFS 用栈实现，访问顺序依赖邻居的入栈顺序。它的用途是连通性、拓扑排序、找环，而不是最短路径。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      // 把每个节点的距离画成柱状（用 plot.bars 更直观）
      plot.bars(canvasHost, {
        items: Array.from({ length: n }, (_, i) => ({
          label: `节点 ${i}`,
          value: res.dist[i] === Infinity ? 0 : res.dist[i],
          color: i === src ? '#0ca678' : res.dist[i] === Infinity ? '#c2255c' : '#3b5bdb',
        })),
        max: Math.max(...res.dist.filter(Number.isFinite), 1),
      });
    }

    host.append(
      panel('参数', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '算法' }), patSelect), dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '起点' }), srcSelect)),
      panel('结果', outHost),
      panel('到各节点的距离', canvasHost)
    );
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 动态规划表格（背包 / LIS / 编辑距离）
  // ═════════════════════════════════════════════════════════════
  demos.register('dp-table', (host, params) => {
    const state = { items: params.items || [[2, 3], [3, 4], [4, 5], [5, 6]], capacity: params.capacity || 8, show: 'knapsack' };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});

    function knapsack(items, capacity) {
      const n = items.length;
      const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
      for (let i = 1; i <= n; i++) {
        const [w, v] = items[i - 1];
        for (let c = 0; c <= capacity; c++) {
          dp[i][c] = dp[i - 1][c];
          if (c >= w && dp[i - 1][c - w] + v > dp[i][c]) dp[i][c] = dp[i - 1][c - w] + v;
        }
      }
      // 回溯选中的物品
      const chosen = [];
      let c = capacity;
      for (let i = n; i >= 1; i--) {
        if (dp[i][c] !== dp[i - 1][c]) { chosen.push(i - 1); c -= items[i - 1][0]; }
      }
      return { dp, value: dp[n][capacity], chosen: chosen.reverse() };
    }

    function lis(arr) {
      const n = arr.length;
      const dp = new Array(n).fill(1);
      const prev = new Array(n).fill(-1);
      for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
          if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) { dp[i] = dp[j] + 1; prev[i] = j; }
        }
      }
      let best = 0;
      for (let i = 1; i < n; i++) if (dp[i] > dp[best]) best = i;
      const seq = [];
      for (let k = best; k !== -1; k = prev[k]) seq.push(arr[k]);
      return { dp: [dp], value: dp[best] || 0, seq: seq.reverse() };
    }

    function editDistance(a, b) {
      const m = a.length;
      const n = b.length;
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
      return { dp, value: dp[m][n] };
    }

    function refresh() {
      dom.clear(outHost);
      if (state.show === 'knapsack') {
        const r = knapsack(state.items, state.capacity);
        outHost.append(
          dom.h('p', { text: `物品（重量, 价值）：${state.items.map(([w, v]) => `(${w},${v})`).join(' ')} · 背包容量 ${state.capacity}` }),
          dom.h('p', {}, dom.h('strong', { text: `最大价值 = ${r.value}` }), dom.h('span', { text: ` · 选中的物品下标：${r.chosen.join(', ') || '（无）'}` })),
          dpTable(r.dp, ['i \\ c', ...Array.from({ length: state.capacity + 1 }, (_, c) => String(c))], ['0', ...state.items.map((_, i) => `物品${i + 1}`)], r.dp)
        );
      } else if (state.show === 'lis') {
        const arr = [10, 9, 2, 5, 3, 7, 101, 18];
        const r = lis(arr);
        outHost.append(
          dom.h('p', { text: `数组：${arr.join(', ')}` }),
          dom.h('p', {}, dom.h('strong', { text: `最长递增子序列长度 = ${r.value}` }), dom.h('span', { text: ` · 一个解：${r.seq.join(' → ')}` })),
          dpTable(r.dp, ['i', ...arr.map((_, i) => String(i))], ['dp[i]'], r.dp)
        );
      } else {
        const a = 'kitten';
        const b = 'sitting';
        const r = editDistance(a, b);
        outHost.append(
          dom.h('p', { text: `把 "${a}" 变成 "${b}"` }),
          dom.h('p', {}, dom.h('strong', { text: `编辑距离 = ${r.value}` })),
          dpTable(r.dp, ['', ...b.split('')], ['', ...a.split('')], r.dp)
        );
      }
    }

    function dpTable(dp, colHeaders, rowHeaders, values) {
      const max = Math.max(...values.flat(), 1);
      const tableEl = dom.h('table', { class: 'cpl-table cpl-table--compact cpl-dptable' });
      const head = dom.h('tr', {}, colHeaders.map((h) => dom.h('th', { text: String(h) })));
      tableEl.append(dom.h('thead', {}, head));
      const body = dom.h('tbody');
      for (let i = 0; i < dp.length; i++) {
        const tr = dom.h('tr', {}, dom.h('th', { text: String(rowHeaders[i] ?? i) }));
        for (let j = 0; j < dp[i].length; j++) {
          const ratio = max ? dp[i][j] / max : 0;
          tr.append(
            dom.h('td', {
              style: { background: `color-mix(in srgb, var(--cpl-accent) ${Math.round(ratio * 55)}%, var(--cpl-bg-elev))` },
              title: `dp[${i}][${j}] = ${dp[i][j]}`,
              text: String(dp[i][j]),
            })
          );
        }
        body.append(tr);
      }
      tableEl.append(body);
      return dom.h('div', { class: 'cpl-table-wrap' }, tableEl);
    }

    const capSlider = slider({ label: '背包容量', min: 3, max: 15, step: 1, value: state.capacity, format: (v) => String(Math.round(v)), onInput: (v) => { state.capacity = Math.round(v); refresh(); } });
    const kindSel = dom.h('select', { class: 'cpl-select', 'aria-label': 'DP 问题' },
      [['knapsack', '0/1 背包'], ['lis', '最长递增子序列 LIS'], ['edit', '编辑距离']].map(([v, t]) => dom.h('option', { value: v, text: t })));
    kindSel.addEventListener('change', () => { state.show = kindSel.value; refresh(); });

    host.append(panel('参数', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: 'DP 问题' }), kindSel), capSlider.el), panel('DP 表格（颜色深浅 = 数值大小）', outHost), panel(null, canvasHost));
    refresh();
  });

  // ═════════════════════════════════════════════════════════════
  // 缓存命中率与延迟
  // ═════════════════════════════════════════════════════════════
  demos.register('cache-hit', (host, params) => {
    const state = { hit: params.hit || 0.8, hitsMs: params.hitMs || 1, missMs: params.missMs || 100, qps: params.qps || 1000 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    function refresh() {
      const avg = state.hit * state.hitsMs + (1 - state.hit) * state.missMs;
      const p99Approx = state.missMs; // 最坏情况近似
      const loadOnBackend = state.qps * (1 - state.hit);

      dom.clear(outHost);
      outHost.append(
        table(
          ['指标', '数值', '说明'],
          [
            ['平均延迟', `${avg.toFixed(2)} ms`, `${state.hit.toFixed(2)}×${state.hitsMs} + ${(1 - state.hit).toFixed(2)}×${state.missMs}`],
            ['尾延迟（未命中时）', `${p99Approx} ms`, '这是用户实际感受到的"偶尔卡一下"'],
            ['后端 QPS', loadOnBackend.toFixed(0), `缓存挡掉了 ${(state.hit * 100).toFixed(0)}% 的请求`],
            ['命中率再提升 5% 的收益', `${(avg - ((state.hit + 0.05) * state.hitsMs + (1 - state.hit - 0.05) * state.missMs)).toFixed(2)} ms`, avg > 0 ? `降低 ${(((avg - ((state.hit + 0.05) * state.hitsMs + (1 - state.hit - 0.05) * state.missMs)) / avg) * 100).toFixed(0)}%` : '—'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text: `关键数量级直觉：命中率从 80% 提到 95%，平均延迟从 ${(0.8 * 1 + 0.2 * 100).toFixed(1)} ms 降到 ${(0.95 * 1 + 0.05 * 100).toFixed(2)} ms——命中率的小幅提升在高未命中代价下收益极大。这也是"缓存不是优化，而是架构"的原因。`,
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const pts = [];
      for (let h = 0; h <= 1.0001; h += 0.02) pts.push([h, h * state.hitsMs + (1 - h) * state.missMs]);
      view = plot.mount(canvasHost, {
        series: [
          { name: '平均延迟', points: pts, color: '#3b5bdb' },
          { name: `当前命中率 ${(state.hit * 100).toFixed(0)}%`, points: [[state.hit, avg]], color: '#c2255c', type: 'scatter' },
        ],
        xScale: 'linear',
        yScale: 'linear',
        xLabel: '缓存命中率',
        yLabel: '平均延迟 (ms)',
        height: 260,
        caption: '曲线左端陡峭：命中率低于 80% 时，每掉几个百分点延迟就明显上升。',
      });
    }

    const hSlider = slider({ label: '命中率', min: 0, max: 100, step: 1, value: Math.round(state.hit * 100), format: (v) => `${Math.round(v)}%`, onInput: (v) => { state.hit = Number(v) / 100; refresh(); } });
    const hitSlider = slider({ label: '命中耗时 (ms)', min: 0.1, max: 20, step: 0.1, value: state.hitsMs, format: (v) => `${Number(v).toFixed(1)} ms`, onInput: (v) => { state.hitsMs = Number(v); refresh(); } });
    const missSlider = slider({ label: '未命中耗时 (ms)', min: 5, max: 2000, step: 5, value: state.missMs, format: (v) => `${Math.round(v)} ms`, onInput: (v) => { state.missMs = Number(v); refresh(); } });
    const qpsSlider = slider({ label: '总 QPS', min: 10, max: 100000, step: 10, value: state.qps, format: (v) => `${Math.round(v)}/s`, onInput: (v) => { state.qps = Math.round(v); refresh(); } });

    host.append(panel('参数', hSlider.el, hitSlider.el, missSlider.el, qpsSlider.el), panel('延迟与负载', outHost), panel('命中率-延迟曲线', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // CAP 权衡滑块
  // ═════════════════════════════════════════════════════════════
  demos.register('cap-tradeoff', (host) => {
    const state = { partition: true, choice: 'CP', scenario: 'transfer' };
    const outHost = dom.h('div', {});

    const scenarios = {
      transfer: {
        name: '银行转账',
        write: '扣款与入账必须同时成功或同时失败',
        tolerant: false,
        reason: '出现"钱扣了但对方没收到，且系统认为成功"是不可接受的。因此分区期间宁可拒绝服务（选 CP）。',
      },
      feed: {
        name: '社交动态 / 点赞数',
        write: '发一条动态、点一个赞',
        tolerant: true,
        reason: '点赞数短暂不一致没人会受伤，但发不出内容用户立刻走人。因此选 AP，用最终一致收尾。',
      },
      inventory: {
        name: '秒杀库存扣减',
        write: '库存 -1（不能超卖）',
        tolerant: false,
        reason: '超卖要赔付、要道歉。选 CP：分区时拒绝下单，或者用预扣 + 异步确认。',
      },
      iot: {
        name: '传感器数据上报',
        write: '温度读数入库',
        tolerant: true,
        reason: '丢几个点比全部丢弃好。选 AP，允许短暂丢失/乱序，后续用时间戳校正。',
      },
    };

    function refresh() {
      const s = scenarios[state.scenario];
      const p = state.partition;
      const consistent = p ? state.choice === 'CP' : true;
      const available = p ? state.choice === 'AP' : true;

      dom.clear(outHost);
      outHost.append(
        table(
          ['维度', '当前状态', '说明'],
          [
            ['场景', s.name, s.write],
            ['是否发生网络分区 (P)', p ? '是' : '否', p ? '分区不可避免，此时必须在 C 与 A 之间取舍' : '没有分区时，C 与 A 可以同时满足'],
            ['一致性 (C)', consistent ? '保证' : '放弃（允许读到旧数据）', consistent ? '分区期间拒绝部分请求以维持一致' : '分区两侧各自继续服务，事后合并'],
            ['可用性 (A)', available ? '保证' : '放弃（返回错误）', available ? '所有请求都有响应（可能是旧数据）' : '部分请求返回失败'],
            ['业务是否容忍不一致', s.tolerant ? '容忍' : '不容忍', '这一条决定了正确选择'],
            ['结论', s.tolerant ? '选 AP（或最终一致）' : '选 CP（宁可拒绝服务）', s.reason],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text: p && state.choice === (s.tolerant ? 'CP' : 'AP')
            ? '⚠ 当前选择与业务语义不匹配。CAP 的取舍由"业务能不能容忍不一致"决定，不是技术偏好。'
            : '当前选择与业务语义一致。',
        })
      );
    }

    const scenSel = dom.h('select', { class: 'cpl-select', 'aria-label': '业务场景' },
      Object.entries(scenarios).map(([k, v]) => dom.h('option', { value: k, text: v.name })));
    scenSel.addEventListener('change', () => { state.scenario = scenSel.value; refresh(); });

    const partBox = checkbox({ label: '模拟网络分区发生', checked: state.partition, onChange: (v) => { state.partition = v; refresh(); } });
    const chooseBtns = dom.h('div', { class: 'cpl-demo__actions' });
    for (const [value, label] of [['CP', '优先一致性（拒绝部分请求）'], ['AP', '优先可用性（允许旧数据）']]) {
      chooseBtns.append(
        dom.h('button', {
          class: `cpl-btn cpl-btn--sm${state.choice === value ? ' cpl-btn--primary' : ''}`,
          type: 'button',
          text: label,
          dataset: { choice: value },
          onclick: () => {
            state.choice = value;
            for (const b of chooseBtns.children) b.classList.toggle('cpl-btn--primary', b.dataset.choice === value);
            refresh();
          },
        })
      );
    }

    host.append(panel('参数', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '业务场景' }), scenSel), dom.h('div', { class: 'cpl-demo__toggles' }, partBox), dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '分区期间的选择' }), chooseBtns)), panel('权衡结果', outHost));
    refresh();
  });

  // ═════════════════════════════════════════════════════════════
  // Fortran 数组：循环顺序与内存布局
  // ═════════════════════════════════════════════════════════════
  demos.register('fortran-layout', (host, params) => {
    const state = { n: params.n || 512 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    const nSlider = slider({ label: '矩阵阶数 n（n×n）', min: 64, max: 2048, step: 64, value: state.n, format: (v) => `${Math.round(v)} × ${Math.round(v)} = ${(Math.round(v) ** 2 / 1e6).toFixed(2)} M 元素`, onInput: (v) => { state.n = Math.round(v); refresh(); } });

    function measure() {
      const n = state.n;
      // Fortran 列主序：内存里 A[i + j*n]（i 连续）
      const A = new Float64Array(n * n);
      for (let i = 0; i < A.length; i++) A[i] = (i % 97) * 0.01;

      // 列优先遍历（Fortran 的正确顺序：内层走 i）
      let t0 = performance.now();
      let s1 = 0;
      for (let j = 0; j < n; j++) {
        const base = j * n;
        for (let i = 0; i < n; i++) s1 += A[base + i];
      }
      const colMajor = performance.now() - t0;

      // 行优先遍历（在列主序存储上是"错误"顺序：内层走 j，跨步 n）
      t0 = performance.now();
      let s2 = 0;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) s2 += A[j * n + i];
      }
      const rowMajor = performance.now() - t0;

      void s1; void s2;
      return { colMajor, rowMajor, ratio: rowMajor / Math.max(colMajor, 0.001) };
    }

    function refresh() {
      const r = measure();
      const n = state.n;
      const bytes = n * n * 8;

      dom.clear(outHost);
      outHost.append(
        table(
          ['遍历顺序', '本机实测', '相对倍数', '说明'],
          [
            ['内层走 i（Fortran 正确顺序）', `${r.colMajor.toFixed(2)} ms`, '1.00×', '内存连续，每条 cache line 用满'],
            ['内层走 j（顺序写反）', `${r.rowMajor.toFixed(2)} ms`, `${r.ratio.toFixed(2)}×`, '跨步 n×8 字节，每次搬 cache line 只用 8 字节'],
          ]
        ),
        dom.h('p', { class: 'cpl-demo__intro', text: `数据量：${n}×${n} float64 = ${util.bytes(bytes)}。此时已经远超 L2/L3 缓存容量，所以顺序的影响会被放大。` }),
        dom.h(
          'div',
          { class: 'cpl-callout cpl-callout--physics' },
          dom.h('div', { class: 'cpl-callout__head' }, dom.h('span', { class: 'cpl-callout__icon', text: '⚛' }), dom.h('span', { class: 'cpl-callout__title', text: '对应到 Fortran 代码' })),
          dom.h(
            'div',
            { class: 'cpl-callout__body' },
            dom.h('pre', { class: 'cpl-pre', html: CPL.highlight ? CPL.highlight.render(
              '! 正确：内层走第一个下标（列主序连续）\n' +
                'do j = 1, n\n  do i = 1, n\n    s = s + A(i, j)\n  end do\nend do\n\n' +
                '! 慢：内层走第二个下标（每次跨 n 个元素）\n' +
                'do i = 1, n\n  do j = 1, n\n    s = s + A(i, j)\n  end do\nend do',
              'fortran'
            ) : '' })
          )
        )
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const sizes = [64, 128, 256, 512, 1024, 2048].filter((s) => s <= 2048);
      const ptsCol = [];
      const ptsRow = [];
      for (const s of sizes) {
        // 用当前测得的"每元素代价"外推（避免这里再跑 6 次大循环）
        const cells = s * s;
        const curCells = n * n;
        ptsCol.push([cells, (r.colMajor / curCells) * cells]);
        ptsRow.push([cells, (r.rowMajor / curCells) * cells]);
      }
      view = plot.mount(canvasHost, {
        series: [
          { name: '列优先（内层 i）', points: ptsCol, color: '#0ca678' },
          { name: '行优先（内层 j）', points: ptsRow, color: '#c2255c' },
        ],
        xScale: 'log',
        yScale: 'log',
        xLabel: '矩阵元素数（log）',
        yLabel: '预计耗时 ms（log）',
        height: 260,
        caption: '两条线斜率相同（都是 O(N²) 次加法），但截距差好几倍——差距来自缓存，不来自算法。',
      });
    }

    const btn = dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '重新测量', onclick: () => { btn.disabled = true; setTimeout(() => { refresh(); btn.disabled = false; }, 20); } });

    host.append(panel('参数', nSlider.el, dom.h('div', { class: 'cpl-demo__actions' }, btn)), panel('实测', outHost), panel('缩放', canvasHost));
    host.append(panel('脚本演示', dom.h('div', { class: 'cpl-demo__actions' },
      dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '复制 Fortran 测试代码', onclick: async (e) => {
        const code = 'program layout_bench\n  implicit none\n  integer, parameter :: dp = kind(1.0d0)\n  integer :: n, i, j\n  real(dp), allocatable :: A(:,:)\n  real(dp) :: s, t0, t1\n  n = 1024\n  allocate(A(n,n))\n  call random_number(A)\n\n  ! 列优先：内层走 i\n  call cpu_time(t0)\n  s = 0.0_dp\n  do j = 1, n\n    do i = 1, n\n      s = s + A(i,j)\n    end do\n  end do\n  call cpu_time(t1)\n  write(*,\'(A,F10.4,A)\') " column-major: ", t1-t0, " s"\n\n  ! 行优先：内层走 j\n  call cpu_time(t0)\n  s = 0.0_dp\n  do i = 1, n\n    do j = 1, n\n      s = s + A(i,j)\n    end do\n  end do\n  call cpu_time(t1)\n  write(*,\'(A,F10.4,A)\') " row-major:    ", t1-t0, " s"\n  deallocate(A)\nend program layout_bench';
        const ok = await dom.copyToClipboard(code);
        e.target.textContent = ok ? '已复制' : '失败';
        setTimeout(() => { e.target.textContent = '复制 Fortran 测试代码'; }, 1600);
      } }),
      dom.h('code', { class: 'cpl-code-inline', text: 'gfortran -O3 layout.f90 -o layout && ./layout' })
    )));
    btn.disabled = true;
    setTimeout(() => { refresh(); btn.disabled = false; }, 30);
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // Monte Carlo 收敛：误差 ~ 1/√N
  // ═════════════════════════════════════════════════════════════
  demos.register('monte-carlo', (host) => {
    const state = { N: 100000, dim: 1 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;
    let rng = 123456789;
    const rand = () => {
      rng ^= rng << 13; rng >>>= 0;
      rng ^= rng >> 17;
      rng ^= rng << 5; rng >>>= 0;
      return rng / 4294967296;
    };

    const nSlider = slider({
      label: '采样数 N',
      min: 2,
      max: 7,
      step: 0.1,
      value: Math.log10(state.N),
      format: (v) => `10^${Number(v).toFixed(1)} ≈ ${fmtOps(Math.pow(10, v))}`,
      onInput: (v) => { state.N = Math.round(Math.pow(10, v)); refresh(); },
    });
    const dSel = dom.h('select', { class: 'cpl-select', 'aria-label': '积分维度' },
      [[1, '∫₀¹ x² dx = 1/3（1 维）'], [4, '4 维超立方体上的同类积分'], [8, '8 维（维数灾难演示）']].map(([v, t]) => dom.h('option', { value: String(v), text: t })));
    dSel.addEventListener('change', () => { state.dim = Number(dSel.value); refresh(); });

    function refresh() {
      const N = state.N;
      const dim = state.dim;
      const exact = 1 / 3;
      rng = 123456789;
      let sum = 0;
      let sumSq = 0;
      const trace = [];
      const step = Math.max(1, Math.floor(N / 120));
      for (let i = 1; i <= N; i++) {
        let v = 1;
        for (let d = 0; d < dim; d++) {
          const u = rand();
          v *= u * u;
        }
        sum += v;
        sumSq += v * v;
        if (i % step === 0 || i === N) {
          const mean = sum / i;
          trace.push([i, Math.abs(mean - exact) || 1e-12]);
        }
      }
      const mean = sum / N;
      const variance = sumSq / N - mean * mean;
      const stderr = Math.sqrt(Math.max(variance, 0) / N);
      const error = Math.abs(mean - exact);

      dom.clear(outHost);
      outHost.append(
        table(
          ['量', '数值', '说明'],
          [
            ['精确值', exact.toFixed(10), dim === 1 ? '∫₀¹ x² dx' : `${dim} 维类比`],
            ['MC 估计', mean.toFixed(10), `N = ${N.toLocaleString()}`],
            ['实际误差', error.toExponential(3), '—'],
            ['理论标准误 σ/√N', stderr.toExponential(3), `σ ≈ ${Math.sqrt(Math.max(variance, 0)).toFixed(4)}`],
            ['误差是否在 1σ 内', error <= stderr ? '是 ✓' : error <= 3 * stderr ? '在 3σ 内' : '超出 3σ（检查随机数质量）', 'MC 误差是随机的，偶尔超出 1σ 正常'],
            ['误差量级 ~ N^(-1/2)', `${(error * Math.sqrt(N)).toFixed(4)}`, '这个乘积应大致稳定在 σ 附近'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '关键结论：**Monte Carlo 的误差按 1/√N 下降，与维度无关。** 这是它在高维问题上胜过网格法的原因——但也意味着想多要一位有效数字，采样数要乘 100。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [
          { name: '实测误差', points: trace, color: '#3b5bdb' },
          {
            name: '参考线 ∝ N^(-1/2)',
            points: trace.map(([n]) => [n, Math.max(stderr * Math.sqrt(N) / Math.sqrt(n), 1e-12)]),
            color: '#c2255c',
            dash: true,
          },
        ],
        xScale: 'log',
        yScale: 'log',
        xLabel: '采样数 N（log）',
        yLabel: '误差（log）',
        height: 280,
        fitSlope: true,
        caption: '拟合斜率应接近 −0.5。这是"误差 ∝ 1/√N"的直接证据。',
      });
    }

    host.append(panel('参数', nSlider.el, dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '维度' }), dSel)), panel('数值对照', outHost), panel('误差收敛', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 并行加速比（Amdahl 定律 + 实测模型）
  // ═════════════════════════════════════════════════════════════
  demos.register('amdahl', (host) => {
    const state = { parallelFraction: 0.9, cores: 8, overheadPerCore: 0.02 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    function speedup(p, n, overhead) {
      // Amdahl + 线性通信开销项：现实里加速比会先升后降
      const ideal = 1 / ((1 - p) + p / n);
      return ideal / (1 + overhead * (n - 1));
    }

    function refresh() {
      const p = state.parallelFraction;
      const maxIdeal = 1 / (1 - p);
      const rows = [1, 2, 4, 8, 16, 32, 64, 128].map((n) => {
        const s = speedup(p, n, state.overheadPerCore);
        return [String(n), s.toFixed(2), `${((s / n) * 100).toFixed(0)}%`, n > 1 ? `${(Math.min(1 / (1 - p), n) - s).toFixed(2)}` : '—'];
      });

      dom.clear(outHost);
      outHost.append(
        table(['核数 n', '加速比 S(n)', '并行效率 S/n', '与理想值的差距'], rows),
        dom.h('p', { class: 'cpl-demo__intro', text: `不可并行部分占 ${((1 - p) * 100).toFixed(0)}%，所以 Amdahl 上限是 ${maxIdeal.toFixed(2)}×。即使核数到无穷，也突破不了这个数。` })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const ns = Array.from({ length: 60 }, (_, i) => 1 + i * 2);
      view = plot.mount(canvasHost, {
        series: [
          { name: '理想线性加速', points: ns.map((n) => [n, n]), color: '#868e96', dash: true },
          { name: `Amdahl 上限 ${maxIdeal.toFixed(1)}×`, points: ns.map((n) => [n, maxIdeal]), color: '#a45c00', dash: true },
          { name: 'Amdahl（无开销）', points: ns.map((n) => [n, 1 / ((1 - p) + p / n)]), color: '#3b5bdb' },
          { name: `含通信开销 ${(state.overheadPerCore * 100).toFixed(0)}%/核`, points: ns.map((n) => [n, speedup(p, n, state.overheadPerCore)]), color: '#c2255c' },
        ],
        xScale: 'log',
        yScale: 'log',
        xLabel: '核数 n（log）',
        yLabel: '加速比（log）',
        height: 300,
        caption: '红线的下降段就是"加核反而更慢"——现实中 MPI 程序常见这个形状。',
      });
    }

    const pSlider = slider({ label: '可并行比例', min: 50, max: 99, step: 0.5, value: state.parallelFraction * 100, format: (v) => `${Number(v).toFixed(1)}%`, onInput: (v) => { state.parallelFraction = Number(v) / 100; refresh(); } });
    const cSlider = slider({ label: '核心数', min: 1, max: 128, step: 1, value: state.cores, format: (v) => String(Math.round(v)), onInput: (v) => { state.cores = Math.round(v); refresh(); } });
    const oSlider = slider({ label: '每核通信开销', min: 0, max: 20, step: 0.5, value: state.overheadPerCore * 100, format: (v) => `${Number(v).toFixed(1)}%`, onInput: (v) => { state.overheadPerCore = Number(v) / 100; refresh(); } });

    host.append(panel('参数', pSlider.el, cSlider.el, oSlider.el), panel('加速比表', outHost), panel('加速比曲线', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 数值格式对照（float32 / float64 / 累加误差）
  // ═════════════════════════════════════════════════════════════
  demos.register('float-format', (host) => {
    const outHost = dom.h('div', {});
    const input = dom.h('input', { class: 'cpl-input', value: '0.1', 'aria-label': '要检查的数值' });
    const countSlider = slider({ label: '累加次数', min: 1, max: 7, step: 1, value: 6, format: (v) => fmtOps(Math.pow(10, Math.round(v))), onInput: () => refresh() });

    function refresh() {
      const v = Number(input.value) || 0;
      const n = Math.round(Math.pow(10, Number(countSlider.input.value)));

      const f32 = new Float32Array(1);
      f32[0] = v;
      const asF32 = f32[0];

      // float32 累加
      const arr32 = new Float32Array(n);
      arr32.fill(asF32);
      let s32 = 0;
      for (let i = 0; i < n; i++) s32 = Math.fround(s32 + arr32[i]);

      // float64 累加
      let s64 = 0;
      for (let i = 0; i < n; i++) s64 += v;

      // Kahan
      let sk = 0;
      let c = 0;
      for (let i = 0; i < n; i++) {
        const y = v - c;
        const t = sk + y;
        c = t - sk - y;
        sk = t;
      }

      const exact = v * n;
      const rel = (x) => (exact !== 0 ? Math.abs((x - exact) / exact) : 0);

      dom.clear(outHost);
      outHost.append(
        table(
          ['表示 / 累加方式', '结果', '相对误差', '说明'],
          [
            ['精确值 v × n', exact.toPrecision(17), '0', '数学上的结果'],
            ['float32 单次表示', asF32.toPrecision(9), rel(asF32 - v + v) === 0 ? `${Math.abs(asF32 - v).toExponential(2)}（绝对）` : '—', `float32 的相对精度 ε ≈ ${Number.EPSILON.toExponential(1)}（其实是 float64）`],
            ['float32 累加', s32.toPrecision(9), rel(s32).toExponential(3), '误差 ∝ n·ε₃₂，ε₃₂ ≈ 1.2e-7'],
            ['float64 累加（朴素）', s64.toPrecision(17), rel(s64).toExponential(3), '误差 ∝ n·ε₆₄，ε₆₄ ≈ 2.2e-16'],
            ['float64 累加（Kahan）', sk.toPrecision(17), rel(sk).toExponential(3), '补偿求和，误差基本与 n 无关'],
            ['机器 epsilon (float64)', Number.EPSILON.toExponential(6), '—', '1 + ε/2 ≠ 1 的最小 ε'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '把累加次数的滑块拉大，观察误差怎么长：**朴素累加是随 n 线性增长的，Kahan 基本不动。** 这不是"浮点不精确"这种笼统结论，而是可预测的 n·ε 量级——所以你可以事先估计它会不会毁掉你的结果。',
        })
      );
    }

    input.addEventListener('input', util.debounce(refresh, 250));
    host.append(panel('参数', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '被累加的值 v' }), input), countSlider.el), panel('数值对照', outHost));
    refresh();
  });

  // ═════════════════════════════════════════════════════════════
  // 收敛阶研究：误差 vs 步长 log-log
  // ═════════════════════════════════════════════════════════════
  demos.register('convergence-study', (host, params) => {
    const state = { scheme: params.scheme || 'rk4', T: 1.0 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    // 用 y' = -y, y(0) = 1，精确解 e^{-t} 做收敛研究
    function solve(scheme, h) {
      const n = Math.round(state.T / h);
      let y = 1;
      let t = 0;
      for (let i = 0; i < n; i++) {
        const f = (tt, yy) => -yy;
        if (scheme === 'euler') {
          y = y + h * f(t, y);
        } else if (scheme === 'heun') {
          const k1 = f(t, y);
          const k2 = f(t + h, y + h * k1);
          y = y + (h / 2) * (k1 + k2);
        } else if (scheme === 'rk4') {
          const k1 = f(t, y);
          const k2 = f(t + h / 2, y + (h / 2) * k1);
          const k3 = f(t + h / 2, y + (h / 2) * k2);
          const k4 = f(t + h, y + h * k3);
          y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
        }
        t += h;
      }
      return y;
    }

    const SCHEMES = {
      euler: { name: '前向欧拉（一阶）', theory: 1 },
      heun: { name: 'Heun / 梯形法（二阶）', theory: 2 },
      rk4: { name: '经典 RK4（四阶）', theory: 4 },
    };

    const exact = Math.exp(-state.T);

    const sel = dom.h('select', { class: 'cpl-select', 'aria-label': '时间推进格式' },
      Object.entries(SCHEMES).map(([k, v]) => dom.h('option', { value: k, text: v.name, selected: k === state.scheme })));
    sel.addEventListener('change', () => { state.scheme = sel.value; refresh(); });

    function refresh() {
      const hs = [];
      for (let k = 2; k <= 7; k++) hs.push(Math.pow(10, -k / 2));
      const errors = hs.map((h) => Math.abs(solve(state.scheme, h) - exact));
      const lx = hs.map((h) => Math.log10(h));
      const ly = errors.map((e) => Math.log10(Math.max(e, 1e-17)));
      const slope = util.slope(lx, ly);
      const r = util.pearson(lx, ly);

      dom.clear(outHost);
      outHost.append(
        table(
          ['步长 h', '数值解', '绝对误差', 'log₁₀(误差)'],
          hs.map((h, i) => [h.toExponential(1), solve(state.scheme, h).toPrecision(10), errors[i].toExponential(3), ly[i].toFixed(4)])
        ),
        table(
          ['量', '数值', '说明'],
          [
            ['拟合斜率', slope.toFixed(4), '斜率 ≈ 收敛阶（负号只表示 h 减小时误差减小）'],
            ['相关系数 r', Number.isFinite(r) ? r.toFixed(6) : 'n/a', '接近 −1 才说明确实是幂律关系'],
            ['理论阶数', String(SCHEMES[state.scheme].theory), '对应格式的名义精度'],
            ['实测阶数', Math.abs(slope).toFixed(2), Math.abs(Math.abs(slope) - SCHEMES[state.scheme].theory) < 0.25 ? '✓ 与理论一致' : '⚠ 与理论不符，检查 h 是否进入渐近区'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '如果实测阶数低于理论值，常见原因：h 还不够小（未进入渐近区）、右端函数不够光滑、或者最差的那一环（往往是一阶的边界处理）在拖后腿。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [
          { name: `${SCHEMES[state.scheme].name} 实测`, points: hs.map((h, i) => [h, Math.max(errors[i], 1e-17)]), color: '#3b5bdb' },
          { name: `参考斜率 ${SCHEMES[state.scheme].theory}`, points: hs.map((h) => [h, Math.pow(h, SCHEMES[state.scheme].theory)]), color: '#868e96', dash: true },
        ],
        xScale: 'log',
        yScale: 'log',
        xLabel: '步长 h（log）',
        yLabel: '绝对误差（log）',
        height: 300,
        caption: '斜率就是收敛阶。灰虚线是理论参考线，两条平行即说明格式达到了名义阶数。',
      });
    }

    host.append(panel('参数', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '时间推进格式（求解 y\' = −y）' }), sel), dom.h('p', { class: 'cpl-muted', text: `精确解 y(${state.T}) = e^(−${state.T}) = ${exact.toPrecision(12)}` })), panel('误差表与拟合', outHost), panel('log-log 收敛图', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 稳定性：显式扩散的稳定性条件
  // ═════════════════════════════════════════════════════════════
  demos.register('stability-diffusion', (host) => {
    const state = { N: 50, r: 0.4, steps: 200 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    function run() {
      const N = state.N;
      const r = state.r;
      let u = new Float64Array(N);
      // 初始：中心一个尖峰
      for (let i = 0; i < N; i++) u[i] = Math.abs(i - N / 2) < 2 ? 1 : 0;
      const initial = Array.from(u);
      let maxVal = 1;
      let minVal = 0;
      let blewUp = false;
      const energyTrace = [];

      for (let s = 0; s < state.steps; s++) {
        const next = new Float64Array(N);
        // Dirichlet 边界 (u=0)
        next[0] = 0;
        next[N - 1] = 0;
        for (let i = 1; i < N - 1; i++) {
          next[i] = u[i] + r * (u[i - 1] - 2 * u[i] + u[i + 1]);
        }
        u = next;
        const l2 = Math.sqrt(u.reduce((a, v) => a + v * v, 0) / N);
        energyTrace.push([s + 1, Math.max(l2, 1e-16)]);
        maxVal = Math.max(maxVal, ...u);
        minVal = Math.min(minVal, ...u);
        if (!Number.isFinite(maxVal) || Math.abs(maxVal) > 1e6) { blewUp = true; break; }
      }

      const stable = r <= 0.5;
      dom.clear(outHost);
      outHost.append(
        table(
          ['量', '数值', '说明'],
          [
            ['显式格式参数 r = αΔt/Δx²', r.toFixed(3), '稳定性条件由它决定'],
            ['稳定性条件', 'r ≤ 0.5', '一维显式 FTCS 的 von Neumann 条件'],
            ['当前状态', stable ? '稳定' : '不稳定（应当发散）', stable ? '解的光滑化符合物理' : '高频模态被放大，数值解爆炸'],
            ['最大值', Number.isFinite(maxVal) ? maxVal.toExponential(3) : '∞', '初始最大值为 1'],
            ['最小值', Number.isFinite(minVal) ? minVal.toExponential(3) : '−∞', '物理上应当非负且不超过初值'],
            ['是否爆炸', blewUp ? '是（已中断）' : '否', blewUp ? 'r > 0.5 时数值解指数增长' : '未出现指数增长'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text: stable
            ? '当前 r ≤ 0.5，数值解平滑地衰减到零——这与"扩散把尖峰抹平"的物理一致。'
            : '当前 r > 0.5，你会看到数值解出现高频振荡并指数增长。**这不是 bug，而是显式格式的稳定性限制**：时间步必须小于 Δx²/(2α)。这也解释了为什么隐式格式值得付出解线性方程组的代价。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [
          { name: 'L2 范数（log）', points: energyTrace, color: stable ? '#0ca678' : '#c2255c' },
          { name: '初始 L2', points: [[1, Math.sqrt(initial.reduce((a, v) => a + v * v, 0) / N)]], color: '#868e96', type: 'scatter' },
        ],
        xScale: 'linear',
        yScale: 'log',
        xLabel: '时间步',
        yLabel: 'L2 范数（log）',
        height: 280,
        caption: stable ? 'L2 单调下降：扩散耗散能量。' : 'L2 指数上升：不稳定的典型特征。',
      });
    }

    const nSlider = slider({ label: '网格点数 N', min: 20, max: 200, step: 10, value: state.N, format: (v) => String(Math.round(v)), onInput: (v) => { state.N = Math.round(v); refresh(); } });
    const rSlider = slider({ label: 'r = αΔt/Δx²', min: 5, max: 80, step: 1, value: state.r * 100, format: (v) => (Number(v) / 100).toFixed(2), onInput: (v) => { state.r = Number(v) / 100; refresh(); } });
    const sSlider = slider({ label: '时间步数', min: 20, max: 1000, step: 20, value: state.steps, format: (v) => String(Math.round(v)), onInput: (v) => { state.steps = Math.round(v); refresh(); } });

    // 修正表格里的一个占位错误（写法保持简单直白）
    function refresh() {
      run();
    }

    host.append(panel('参数', nSlider.el, rSlider.el, sSlider.el), panel('稳定性诊断', outHost), panel('L2 范数随时间', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 通用：参数扫描表（ratio/性能分析类课程反复用到）
  // ═════════════════════════════════════════════════════════════
  demos.register('sweep', (host, params) => {
    const spec = params.spec || { label: '参数', min: 1, max: 64, step: 1, value: 4 };
    const formula = params.formula === 'speedup' ? (n) => n : (n) => Math.log2(n);
    const state = { x: spec.value };
    const outHost = dom.h('div', {});
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    let view = null;

    function refresh() {
      const xs = [];
      for (let v = spec.min; v <= spec.max; v += spec.step) xs.push(v);
      const pts = xs.map((v) => [v, Math.max(formula(v), 1e-6)]);
      dom.clear(outHost);
      outHost.append(table([spec.label, '结果'], xs.slice(0, 16).map((v) => [String(v), formula(v).toFixed(3)])));
      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [{ name: params.label || '结果', points: pts, color: '#3b5bdb' }],
        xScale: 'linear',
        yScale: 'linear',
        xLabel: spec.label,
        yLabel: params.label || '结果',
        height: 240,
      });
    }

    const s = slider({ label: spec.label, min: spec.min, max: spec.max, step: spec.step, value: spec.value, format: (v) => String(v), onInput: (v) => { state.x = v; refresh(); } });
    host.append(panel('参数', s.el, dom.h('p', { class: 'cpl-muted', text: params.note || '' })), panel('扫描结果', outHost), panel('曲线', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 系统设计：请求链路与瓶颈定位
  // ═════════════════════════════════════════════════════════════
  demos.register('request-chain', (host, params) => {
    const defaults = params.stages || [
      { name: 'DNS 解析', ms: 20, cacheable: true },
      { name: 'TCP + TLS 握手', ms: 60, cacheable: true },
      { name: 'CDN（静态资源）', ms: 15, cacheable: true },
      { name: '负载均衡', ms: 2, cacheable: false },
      { name: '应用服务', ms: 40, cacheable: false },
      { name: '缓存查询', ms: 3, cacheable: false },
      { name: '数据库查询', ms: 80, cacheable: false },
      { name: '序列化与传输', ms: 12, cacheable: false },
    ];
    const stages = defaults.map((s) => Object.assign({}, s));
    const outHost = dom.h('div', {});

    function refresh() {
      const total = stages.reduce((a, s) => a + (s.enabled === false ? 0 : s.ms), 0);
      const sorted = stages.slice().sort((a, b) => b.ms - a.ms);
      const top = sorted[0];
      const top3 = sorted.slice(0, 3).reduce((a, s) => a + s.ms, 0);

      dom.clear(outHost);
      const list = dom.h('div', { class: 'cpl-cmdlist' });
      for (const s of stages) {
        const input = dom.h('input', { type: 'range', min: '0', max: '300', step: '1', value: String(s.ms), class: 'cpl-ctl__range', 'aria-label': s.name + ' 耗时' });
        input.addEventListener('input', (e) => {
          s.ms = Number(e.target.value);
          refresh();
        });
        const box = dom.h('input', { type: 'checkbox', checked: s.enabled !== false, onchange: (e) => { s.enabled = e.target.checked; refresh(); } });
        const value = dom.h('code', { class: 'cpl-cmd__code', text: `${s.ms} ms` });
        list.append(
          dom.h(
            'div',
            { class: 'cpl-cmd' },
            dom.h('label', { class: 'cpl-check' }, box, dom.h('span', { text: s.name })),
            input,
            value
          )
        );
      }

      outHost.append(
        list,
        table(
          ['指标', '数值', '说明'],
          [
            ['端到端总延迟', `${total} ms`, '各阶段之和（串行链路）'],
            ['最大瓶颈', `${top.name}（${top.ms} ms）`, `占 ${((top.ms / Math.max(total, 1)) * 100).toFixed(0)}%`],
            ['前 3 大耗时占比', `${((top3 / Math.max(total, 1)) * 100).toFixed(0)}%`, '优化这里收益最大；优化最小的那几项几乎无效'],
            ['若瓶颈减半', `${(total - top.ms / 2).toFixed(0)} ms`, `总体降低 ${(((top.ms / 2) / Math.max(total, 1)) * 100).toFixed(0)}%`],
            ['可缓存阶段总耗时', `${stages.filter((s) => s.cacheable && s.enabled !== false).reduce((a, s) => a + s.ms, 0)} ms`, '这部分第一次访问才有，后续命中缓存可省掉'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '这是"先测量再优化"的练习：拖动滑块，找出当前最大的那一项。注意一个常见误区——把每个阶段都优化 10% 的收益，远小于把最大的那一项砍掉一半。',
        })
      );
    }

    host.append(panel('链路各阶段耗时（可拖动）', outHost));
    refresh();
  });

  // ═════════════════════════════════════════════════════════════
  // 并发竞态（用 Atomics 无法在单线程演示，用交错调度模拟）
  // ═════════════════════════════════════════════════════════════
  demos.register('race-condition', (host) => {
    const state = { threads: 4, increments: 10000, locked: false, atomic: false };
    const outHost = dom.h('div', {});

    function simulate() {
      // 用"读-改-写三步交错"来模拟竞态：每次尝试有概率被打断
      const threads = state.threads;
      const per = state.increments;
      let counter = 0;
      let lostUpdates = 0;
      let collisions = 0;

      if (state.atomic) {
        // 原子：无丢失
        let total = 0;
        for (let t = 0; t < threads; t++) total += per;
        return { expected: total, actual: total, lostUpdates: 0, collisions: 0 };
      }

      if (state.locked) {
        // 加锁：串行化，结果正确但耗时增加（用"锁竞争次数"体现）
        let total = 0;
        for (let t = 0; t < threads; t++) {
          for (let i = 0; i < per; i++) {
            total++;
            if (Math.random() < 0.001) collisions++;
          }
        }
        return { expected: threads * per, actual: total, lostUpdates: 0, collisions };
      }

      // 无保护：模拟交错
      let expected = threads * per;
      let progress = new Array(threads).fill(0);
      let done = 0;
      let guard = 0;
      // 用一个"读到旧值"的概率模型来描述真实竞态
      const lostProb = 1 - 1 / threads;
      while (done < threads && guard++ < expected * 2 + 1000) {
        for (let t = 0; t < threads; t++) {
          if (progress[t] >= per) continue;
          // 读
          const read = counter;
          progress[t]++;
          if (progress[t] === per) done++;
          // 有概率在写回之前被另一个线程插入（丢失更新）
          if (Math.random() < 0.5 * lostProb) {
            lostUpdates++;
            counter = read + 1; // 基于旧值写回 → 覆盖了别人的更新
          } else {
            counter = counter + 1;
          }
        }
      }
      return { expected, actual: counter, lostUpdates, collisions };
    }

    function refresh() {
      const r = simulate();
      dom.clear(outHost);
      const loss = r.expected - r.actual;
      outHost.append(
        table(
          ['量', '数值', '说明'],
          [
            ['线程数', state.threads, '—'],
            ['每线程自增次数', state.increments.toLocaleString(), '—'],
            ['期望结果', r.expected.toLocaleString(), 'threads × increments'],
            ['实际结果', r.actual.toLocaleString(), '—'],
            ['丢失的更新', loss.toLocaleString(), `占 ${((loss / Math.max(r.expected, 1)) * 100).toFixed(2)}%`],
            ['保护措施', state.atomic ? '原子操作（无锁）' : state.locked ? '互斥锁' : '无保护', state.atomic ? 'CPU 提供原子指令，无丢失' : state.locked ? '结果正确，代价是锁竞争与串行化' : '结果错误且不可复现'],
            ['诊断', loss > 0 ? '⚠ 结果随运行变化 = 竞态的典型标志' : '✓ 结果确定', loss > 0 ? '修法：加锁 / 原子操作 / 每线程局部累加后归约' : '—'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '`x = x + 1` 在机器层面是 load → add → store 三步。两个线程交错执行会丢失更新。**结果随运行变化**是竞态最可靠的标志（比"结果不对"更可靠，因为有时恰好是对的）。高性能数值计算里最常用的修法不是加锁，而是每个线程各自累加到局部变量，最后归约。',
        })
      );
    }

    const tSlider = slider({ label: '线程数', min: 2, max: 16, step: 1, value: state.threads, format: (v) => String(Math.round(v)), onInput: (v) => { state.threads = Math.round(v); refresh(); } });
    const iSlider = slider({ label: '每线程自增次数', min: 1000, max: 100000, step: 1000, value: state.increments, format: (v) => Math.round(v).toLocaleString(), onInput: (v) => { state.increments = Math.round(v); refresh(); } });
    const lockBox = checkbox({ label: '加互斥锁', checked: state.locked, onChange: (v) => { state.locked = v; refresh(); } });
    const atomicBox = checkbox({ label: '改用原子操作', checked: state.atomic, onChange: (v) => { state.atomic = v; refresh(); } });

    host.append(
      panel('参数', tSlider.el, iSlider.el, dom.h('div', { class: 'cpl-demo__toggles' }, lockBox, atomicBox)),
      panel('模拟结果', outHost)
    );
    refresh();
  });
})();

/* ===== pieces/85-theme.js ===== */
/* ============================================================================
 * 85-theme.js — 主题与显示偏好
 *
 * 三条主题路径：auto（跟随系统）/ light / dark，全部通过 CSS 变量实现，
 * 不存在"深色模式下某个面板还是白底"的情况（变量集中在 00-reset.css）。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  const theme = (CPL.theme = {});

  const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const mqlMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  theme.resolve = function resolve() {
    const pref = CPL.prefs.get('theme');
    if (pref === 'light' || pref === 'dark') return pref;
    return mql && mql.matches ? 'dark' : 'light';
  };

  theme.apply = function apply() {
    const resolved = theme.resolve();
    const root = document.documentElement;
    root.dataset.cplTheme = resolved;
    root.dataset.cplThemePref = CPL.prefs.get('theme');
    root.dataset.cplDensity = CPL.prefs.get('density');
    root.style.setProperty('--cpl-font-scale', String(CPL.prefs.get('fontScale') || 1));

    const reduced = CPL.prefs.get('reducedMotion') || (mqlMotion && mqlMotion.matches);
    if (reduced) root.dataset.cplMotion = 'reduced';
    else delete root.dataset.cplMotion;

    // 移动端浏览器的主题色，让状态栏与页面一致
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0e1117' : '#f7f8fa');

    CPL.bus.emit('theme:changed', { resolved, pref: CPL.prefs.get('theme') });
  };

  theme.set = function set(pref) {
    if (!['auto', 'light', 'dark'].includes(pref)) return;
    CPL.prefs.set('theme', pref);
    theme.apply();
  };

  theme.cycle = function cycle() {
    const order = ['auto', 'light', 'dark'];
    const next = order[(order.indexOf(CPL.prefs.get('theme')) + 1) % order.length];
    theme.set(next);
    const label = { auto: '跟随系统', light: '浅色', dark: '深色' }[next];
    dom.toast(`主题：${label}`, { kind: 'info', ms: 1600 });
  };

  theme.toggle = function toggle() {
    theme.set(theme.resolve() === 'dark' ? 'light' : 'dark');
  };

  if (mql && typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', () => {
      if (CPL.prefs.get('theme') === 'auto') theme.apply();
    });
  }
  if (mqlMotion && typeof mqlMotion.addEventListener === 'function') {
    mqlMotion.addEventListener('change', () => theme.apply());
  }

  CPL.bus.on('prefs:changed', (e) => {
    if (['theme', 'density', 'fontScale', 'reducedMotion'].includes(e.key) || e.key === '*') theme.apply();
  });

  theme.apply();
})();

/* ===== pieces/90-user-content.js ===== */
/* ============================================================================
 * 90-user-content.js — 模块 7：用户自定义学习内容
 *
 * 功能（严格对应需求）：
 *   · 在浏览器里创建 / 编辑 / 保存 / 删除 / 排序自己的课程模块
 *   · Markdown 编辑（支持代码块与 KaTeX/MathML 公式）
 *   · 数据持久化：IndexedDB 为主（容量大），localStorage 只存轻量索引
 *   · 导出为 JSON、从 JSON 导入（导入做结构校验与去重，防止坏数据污染）
 *   · 提供模板，方便按格式提交到仓库 content/user/（走 GitHub PR）
 *   · AI 助教可帮助润色内容、生成练习题、生成 Anki 卡片
 *
 * 安全设计（重要）：
 *   用户内容是**数据**，不是代码。绝不 eval、绝不用 new Function 执行。
 *   所有正文经 CPL.md 渲染（统一转义 HTML），因此不存在把恶意 HTML 存进
 *   IndexedDB 再执行的路径。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const md = CPL.md;
  const util = CPL.util;

  const uc = (CPL.userContent = {});

  const IDB_STORE = 'userLessons';
  const INDEX_KEY = 'userLessons.index';
  const scope = CPL.store.scope('user');

  // 用户内容 id 前缀，便于与内置课程区分
  const ID_PREFIX = 'user-';
  uc.nextId = () => `${ID_PREFIX}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  uc.isUserLessonId = (id) => String(id || '').startsWith(ID_PREFIX);

  // ─────────────────────────────────────────────────────────────
  // 数据结构
  // ─────────────────────────────────────────────────────────────
  /** 新建一个空白课程（含模板骨架）。 */
  uc.blankLesson = function blankLesson(patch = {}) {
    const now = Date.now();
    return Object.assign(
      {
        id: uc.nextId(),
        module: 7,
        week: 99,
        title: '未命名课程',
        subtitle: '',
        tags: [],
        objectives: [],
        sections: [
          {
            title: '核心概念',
            body: [
              '在这里写正文。支持：',
              '',
              '- **粗体**、*斜体*、`行内代码`',
              '- 代码块（三点围栏 + 语言名）',
              '- 公式：行内 $E = mc^2$，块级 $$\\int_0^1 x^2 dx = \\frac{1}{3}$$',
              '- 提示框：`> [!TIP] 标题`',
            ].join('\n'),
          },
        ],
        tools: [],
        aiPrompts: [],
        anki: [],
        reading: [],
        checklist: [],
        order: now,
        createdAt: now,
        updatedAt: now,
        source: 'browser',
      },
      patch
    );
  };

  /** 结构校验：导入时用，防止坏数据写入本地库。 */
  uc.validateLesson = function validateLesson(obj) {
    const problems = [];
    if (!obj || typeof obj !== 'object') return { ok: false, problems: ['不是对象'] };
    if (typeof obj.title !== 'string' || !obj.title.trim()) problems.push('缺少 title');
    // 类型不对时只记问题、不再继续遍历（否则会在错误数据上崩溃）
    if (obj.sections !== undefined && !Array.isArray(obj.sections)) problems.push('sections 必须是数组');
    if (obj.anki !== undefined && !Array.isArray(obj.anki)) problems.push('anki 必须是数组');
    if (obj.objectives !== undefined && !Array.isArray(obj.objectives)) problems.push('objectives 必须是数组');
    if (obj.tags !== undefined && !Array.isArray(obj.tags)) problems.push('tags 必须是数组');
    if (Array.isArray(obj.sections)) {
      obj.sections.forEach((s, i) => {
        if (!s || typeof s !== 'object') problems.push(`sections[${i}] 不是对象`);
        else if (typeof s.body !== 'string') problems.push(`sections[${i}].body 必须是字符串`);
      });
    }
    if (Array.isArray(obj.anki)) {
      obj.anki.forEach((c, i) => {
        if (!c || typeof c !== 'object') problems.push(`anki[${i}] 不是对象`);
        else if (typeof c.front !== 'string' || typeof c.back !== 'string') {
          problems.push(`anki[${i}] 必须有字符串类型的 front 与 back`);
        }
      });
    }
    return { ok: problems.length === 0, problems };
  };

  // ─────────────────────────────────────────────────────────────
  // 持久化
  // ─────────────────────────────────────────────────────────────
  const memoryFallback = new Map();

  /** 更新轻量索引（同步，供课程列表立即使用）。 */
  function writeIndex(lessons) {
    const index = lessons.map((l) => ({
      id: l.id,
      title: l.title,
      subtitle: l.subtitle || '',
      module: l.module ?? 7,
      week: l.week ?? 99,
      tags: l.tags || [],
      order: l.order || 0,
      updatedAt: l.updatedAt,
      sectionCount: (l.sections || []).length,
      cardCount: (l.anki || []).length,
    }));
    scope.set('index', index);
    CPL.bus.emit('user:changed', { count: index.length });
    return index;
  }

  uc.index = () => scope.get('index', []);

  /** 读取全部用户课程。IndexedDB 优先，不可用时退化为 localStorage，最后退内存。 */
  uc.all = async function all() {
    const sortFn = (a, b) => (a.order || 0) - (b.order || 0) || (a.updatedAt || 0) - (b.updatedAt || 0) || String(a.id).localeCompare(String(b.id));
    if (CPL.store.idb.available()) {
      try {
        const rows = await CPL.store.idb.all(IDB_STORE);
        return (rows || []).sort(sortFn);
      } catch (err) {
        CPL.log('warn', 'IndexedDB 读取失败，退化到 localStorage', dom.friendlyError(err));
      }
    }
    const ls = scope.get('lessons', null);
    if (Array.isArray(ls)) return ls.slice().sort(sortFn);
    return Array.from(memoryFallback.values()).sort(sortFn);
  };

  uc.get = async function get(id) {
    if (CPL.store.idb.available()) {
      try {
        const rec = await CPL.store.idb.get(IDB_STORE, id);
        if (rec) return rec;
      } catch {
        /* 继续尝试其他来源 */
      }
    }
    const ls = scope.get('lessons', []);
    return (ls || []).find((l) => l.id === id) || memoryFallback.get(id) || null;
  };

  /** 保存（新增或更新）。返回写入后的记录。 */
  uc.save = async function save(lesson) {
    if (!lesson || !lesson.id) throw new Error('课程缺少 id');
    const rec = Object.assign({}, lesson, { updatedAt: Date.now() });

    // order 用"当前最大 order + 1"，而不是时间戳——
    // 同一毫秒内连续保存两门课时时间戳会相同，排序就会不稳定。
    if (!rec.order || rec.order <= 0) {
      const existing = await uc.all();
      const maxOrder = existing.reduce((m, l) => Math.max(m, l.order || 0), 0);
      rec.order = maxOrder + 1;
    }

    const check = uc.validateLesson(rec);
    if (!check.ok) throw new Error('课程结构有问题：' + check.problems.join('；'));

    memoryFallback.set(rec.id, rec);

    if (CPL.store.idb.available()) {
      try {
        await CPL.store.idb.put(IDB_STORE, rec);
      } catch (err) {
        CPL.log('warn', 'IndexedDB 写入失败，退化到 localStorage', dom.friendlyError(err));
        fallbackWrite(rec);
      }
    } else {
      fallbackWrite(rec);
    }

    // 刷新索引，并注册到运行时目录，使其立即出现在课表里
    const all = await uc.all();
    writeIndex(all);
    syncCatalog(all);
    return rec;
  };

  function fallbackWrite(rec) {
    const ls = scope.get('lessons', []);
    const idx = ls.findIndex((l) => l.id === rec.id);
    if (idx >= 0) ls[idx] = rec;
    else ls.push(rec);
    // localStorage 只有 5 MB，超出时明确告警而不是静默丢数据
    if (JSON.stringify(ls).length > 4 * 1024 * 1024) {
      dom.toast('本地存储接近上限。建议导出备份后删除部分自定义课程。', { kind: 'error', ms: 9000 });
    }
    scope.set('lessons', ls);
  }

  uc.remove = async function remove(id) {
    memoryFallback.delete(id);
    if (CPL.store.idb.available()) {
      try {
        await CPL.store.idb.del(IDB_STORE, id);
      } catch (err) {
        CPL.log('warn', 'IndexedDB 删除失败', dom.friendlyError(err));
      }
    }
    const ls = scope.get('lessons', []);
    scope.set('lessons', ls.filter((l) => l.id !== id));
    const all = await uc.all();
    writeIndex(all);
    if (CPL.catalog) CPL.catalog.unregister(id);
    return all;
  };

  uc.duplicate = async function duplicate(id) {
    const src = await uc.get(id);
    if (!src) throw new Error('找不到要复制的课程');
    const copy = Object.assign({}, util.clone(src), {
      id: uc.nextId(),
      title: src.title + '（副本）',
      order: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return uc.save(copy);
  };

  /** 调整顺序（在数组里上移/下移）。会重排全部 order 并落盘。 */
  uc.reorder = async function reorder(id, delta) {
    const all = await uc.all();
    const i = all.findIndex((l) => l.id === id);
    if (i < 0) return all;
    const j = util.clamp(i + delta, 0, all.length - 1);
    if (i === j) return all;
    const tmp = all[i];
    all[i] = all[j];
    all[j] = tmp;

    for (let k = 0; k < all.length; k++) {
      all[k].order = (k + 1) * 1000;
      all[k].updatedAt = Date.now() + k; // 让 updatedAt 也保持单调，作为稳定排序的次键
      memoryFallback.set(all[k].id, all[k]);
    }
    // 整体重写一次，保证 IndexedDB 与 localStorage 两侧一致
    writeIndex(all);
    if (CPL.store.idb.available()) {
      try {
        await CPL.store.idb.bulkPut(IDB_STORE, all);
      } catch (err) {
        CPL.log('warn', 'IndexedDB 批量写入失败，退化到 localStorage', dom.friendlyError(err));
        scope.set('lessons', all);
      }
    } else {
      scope.set('lessons', all);
    }
    syncCatalog(all);
    return await uc.all();
  };

  // ─────────────────────────────────────────────────────────────
  // 注册进课程目录（让它出现在侧边栏与首页）
  // ─────────────────────────────────────────────────────────────
  function syncCatalog(all) {
    if (!CPL.catalog) return;
    for (const rec of all) {
      CPL.catalog.registerRuntimeLesson(toLessonShape(rec));
    }
  }

  /** 把用户内容记录转换成课程视图能理解的结构（sections → concepts）。 */
  function toLessonShape(rec) {
    return {
      id: rec.id,
      module: rec.module ?? 7,
      week: rec.week ?? 99,
      title: rec.title,
      subtitle: rec.subtitle || '',
      tags: rec.tags || [],
      objectives: rec.objectives || [],
      custom: true,
      // 用户内容用 sections 表达正文，课程页会把它们渲染成"核心概念"列表
      concepts: (rec.sections || []).map((s) => ({
        term: s.title || '（未命名小节）',
        must: 'lookup',
        body: s.body || '',
        selfCheck: s.selfCheck || [],
        anchor: s.anchor || '',
      })),
      tools: rec.tools || [],
      docChallenges: rec.docChallenges || [],
      aiPrompts: (rec.aiPrompts || []).length
        ? rec.aiPrompts
        : ['这一节里最不确定的是哪一句？把它改写成你能对别人讲清楚的说法。'],
      anki: rec.anki || [],
      reading: rec.reading || [],
      checklist: (rec.checklist || []).length
        ? rec.checklist
        : ['能用自己的话复述这一节', '把这一节的知识点挂到一个具体项目或代码片段上'],
      tests: [],
      exercise: null,
      demo: null,
    };
  }
  uc.toLessonShape = toLessonShape;

  /** 启动时把已存在的用户课程注册进目录（异步，不阻塞首屏）。 */
  uc.init = async function init() {
    try {
      const all = await uc.all();
      writeIndex(all);
      syncCatalog(all);
      CPL.log('info', `用户自定义课程：${all.length} 个`);
    } catch (err) {
      CPL.log('warn', '用户内容初始化失败', dom.friendlyError(err));
    }
    return uc.index();
  };

  // ─────────────────────────────────────────────────────────────
  // 导入 / 导出
  // ─────────────────────────────────────────────────────────────
  uc.exportAll = function exportAll(lessons) {
    return JSON.stringify(
      {
        schema: CPL.SCHEMA,
        app: 'cphys-cs-lab',
        kind: 'user-lessons',
        exportedAt: new Date().toISOString(),
        count: lessons.length,
        lessons,
      },
      null,
      2
    );
  };

  uc.exportOne = function exportOne(lesson) {
    return JSON.stringify(
      { schema: CPL.SCHEMA, app: 'cphys-cs-lab', kind: 'user-lessons', exportedAt: new Date().toISOString(), count: 1, lessons: [lesson] },
      null,
      2
    );
  };

  /**
   * 导入。支持三种形态：
   *   1. { lessons: [...] }        —— 本平台导出的格式
   *   2. [ {...}, {...} ]          —— 裸数组
   *   3. { title, sections, ... }  —— 单个课程对象
   * @returns {{added:number, skipped:number, problems:string[]}}
   */
  uc.importJson = async function importJson(text, { overwrite = false } = {}) {
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error('JSON 解析失败：' + dom.friendlyError(err));
    }

    let incoming = [];
    if (Array.isArray(data)) incoming = data;
    else if (data && Array.isArray(data.lessons)) incoming = data.lessons;
    else if (data && typeof data === 'object' && data.title) incoming = [data];
    else throw new Error('无法识别的文件结构：既不是数组，也没有 lessons 字段，也不是单个课程对象。');

    if (!incoming.length) throw new Error('文件里没有任何课程可导入。');

    const existing = await uc.all();
    const existingIds = new Set(existing.map((l) => l.id));
    const existingTitles = new Set(existing.map((l) => l.title.trim()));

    let added = 0;
    let skipped = 0;
    const problems = [];

    for (const raw of incoming) {
      const check = uc.validateLesson(raw);
      if (!check.ok) {
        skipped++;
        problems.push(`${raw && raw.title ? raw.title : '（无标题）'}：${check.problems.join('；')}`);
        continue;
      }
      const rec = Object.assign({}, raw);
      const sameId = existingIds.has(rec.id);
      const sameTitle = existingTitles.has(String(rec.title).trim());

      if (sameTitle && overwrite) {
        // 覆盖模式：按标题找到已有记录并原地替换（保持 id 与顺序），避免产生两份
        const prev = existing.find((l) => String(l.title).trim() === String(rec.title).trim());
        if (prev) {
          rec.id = prev.id;
          rec.order = prev.order;
          rec.createdAt = prev.createdAt || Date.now();
          await uc.remove(prev.id);
          existingIds.delete(prev.id);
        }
      } else if (sameTitle) {
        // 同名：默认跳过（要替换必须显式勾选"覆盖"）
        skipped++;
        problems.push(`${rec.title}：已存在同名课程（勾选"覆盖"可替换）`);
        continue;
      } else if (sameId) {
        // 只是 id 撞了（标题不同）：换一个新 id 导入，绝不覆盖已有课程
        problems.push(`${rec.title}：id 与已有课程冲突，已自动分配新 id`);
        rec.id = uc.nextId();
      } else if (!uc.isUserLessonId(rec.id)) {
        // 不是本平台的 id 前缀：补一个前缀，避免与内置课程 id 空间冲突
        rec.id = uc.nextId();
      }

      rec.source = 'import';
      await uc.save(rec);
      existingIds.add(rec.id);
      existingTitles.add(String(rec.title).trim());
      added++;
    }

    return { added, skipped, problems };
  };

  // ─────────────────────────────────────────────────────────────
  // 视图：#/mine
  // ─────────────────────────────────────────────────────────────
  CPL.nav.register('mine', async function renderMine(main) {
    main.append(
      dom.h(
        'header',
        { class: 'cpl-lesson__head' },
        dom.h('p', { class: 'cpl-lesson__crumb' }, dom.h('a', { href: '#/home', text: '首页' }), ' / 我的内容'),
        dom.h('h1', { class: 'cpl-lesson__title', text: '我的内容' }),
        dom.h('p', {
          class: 'cpl-lesson__subtitle',
          text: '在这里创建你自己的课程与卡片。数据存在你自己的浏览器里（IndexedDB），不会上传到任何服务器。请定期导出 JSON 备份。',
        })
      )
    );

    const lessons = await uc.all();
    const storage = await CPL.store.idb.estimate();

    // 存储状态提示（如果已经在内存降级，必须让用户知道，而不是等到丢数据才发现）
    const storageLine = dom.h('p', { class: 'cpl-muted' });
    storageLine.textContent = CPL.store.idb.available()
      ? `存储后端：IndexedDB${storage ? `（已用 ${util.bytes(storage.usage || 0)} / 配额约 ${util.bytes(storage.quota || 0)}）` : ''}`
      : CPL.store.localStorageAvailable()
      ? `存储后端：localStorage（IndexedDB 不可用${CPL.store.idbError() ? '：' + CPL.store.idbError() : ''}；容量约 5 MB，请控制内容体积并定期导出备份）`
      : '存储后端：仅内存（localStorage 与 IndexedDB 都不可用，刷新后数据会丢失）';
    main.append(storageLine);

    if (!CPL.store.indexedDBAvailable()) {
      main.append(
        dom.h(
          'div',
          { class: 'cpl-callout cpl-callout--warn' },
          dom.h('div', { class: 'cpl-callout__head' }, dom.h('span', { class: 'cpl-callout__icon', text: '⚠' }), dom.h('span', { class: 'cpl-callout__title', text: '当前浏览环境限制了本地数据库' })),
          dom.h(
            'div',
            { class: 'cpl-callout__body' },
            dom.h('p', {
              text:
                'IndexedDB 在这个环境下不可用（常见原因：在第三方/跨源 iframe 里打开、或浏览器的隐私设置）。自定义内容会退化为存在 localStorage 里，容量约 5 MB——大段正文可能存不下。',
            }),
            dom.h('p', { text: '建议：在独立标签页里直接打开本站；并且定期用「导出全部」备份。' })
          )
        )
      );
    }

    if (CPL.store.idb.available() && navigator.storage && navigator.storage.persist) {
      navigator.storage
        .persisted()
        .then((p) => {
          if (p) return;
          main.append(
            dom.h(
              'div',
              { class: 'cpl-callout cpl-callout--note' },
              dom.h('div', { class: 'cpl-callout__body' }, dom.h('p', { text: '提示：浏览器在存储紧张或长期无访问时可能清掉本地数据（Safari 的策略尤其激进）。可以申请"持久化存储"并定期导出备份。' }),
                dom.h('button', {
                  class: 'cpl-btn cpl-btn--sm',
                  type: 'button',
                  text: '申请持久化存储',
                  onclick: async () => {
                    const granted = await navigator.storage.persist();
                    dom.toast(granted ? '已获得持久化存储许可' : '浏览器拒绝了持久化请求（仍可正常使用，但请定期导出备份）', { kind: granted ? 'ok' : 'warn' });
                  },
                }))
            )
          );
        })
        .catch(() => {});
    }

    // 工具栏
    const bar = dom.h('div', { class: 'cpl-lesson__actions cpl-uc__bar' });
    bar.append(
      dom.h('button', {
        class: 'cpl-btn cpl-btn--primary',
        type: 'button',
        text: '+ 新建课程',
        onclick: () => openEditor(uc.blankLesson(), true),
      }),
      dom.h('button', {
        class: 'cpl-btn',
        type: 'button',
        text: '+ 从模板新建（含 8 段式骨架）',
        onclick: () => openEditor(uc.blankLesson(templateSkeleton()), true),
      }),
      dom.h('button', {
        class: 'cpl-btn',
        type: 'button',
        text: '导入 JSON',
        onclick: async () => {
          try {
            const file = await dom.pickFile('.json,application/json');
            if (!file) return;
            const res = await uc.importJson(file.text, { overwrite: false });
            dom.toast(`导入完成：新增 ${res.added} 个，跳过 ${res.skipped} 个`, { kind: res.added ? 'ok' : 'warn', ms: 6000 });
            if (res.problems.length) {
              CPL.log('warn', '导入问题：', res.problems);
              showProblems(res.problems);
            }
            CPL.nav.render();
          } catch (err) {
            dom.toast(dom.friendlyError(err), { kind: 'error', ms: 8000 });
          }
        },
      }),
      dom.h('button', {
        class: 'cpl-btn',
        type: 'button',
        text: `导出全部（${lessons.length}）`,
        disabled: !lessons.length,
        onclick: () => {
          dom.download(`my-lessons-${new Date().toISOString().slice(0, 10)}.json`, uc.exportAll(lessons), 'application/json');
          dom.toast(`已导出 ${lessons.length} 个课程`, { kind: 'ok' });
        },
      }),
      dom.h('button', {
        class: 'cpl-btn cpl-btn--ghost cpl-btn--sm',
        type: 'button',
        text: '下载模板文件',
        onclick: () => {
          dom.download('my-lesson-template.json', uc.exportOne(uc.blankLesson(templateSkeleton())), 'application/json');
          dom.toast('模板已下载。改好标题与正文后，用「导入 JSON」载入即可。', { kind: 'ok', ms: 6000 });
        },
      })
    );
    main.append(bar);

    // 列表
    if (!lessons.length) {
      main.append(
        dom.h(
          'div',
          { class: 'cpl-card' },
          dom.h('h2', { class: 'cpl-card__title', text: '还没有自定义内容' }),
          dom.h('p', { text: '可以从上面的「新建课程」开始。建议的用法不是"再抄一份教材"，而是把你的项目锚点写下来：' }),
          dom.h(
            'ul',
            { class: 'cpl-list' },
            [
              '「周期性边界 → np.roll + ghost cell」这类一句话锚点',
              '调试过程中定位过的 bug 与排查路径',
              '读 legacy Fortran 时踩到的列约定与隐式类型坑',
              '任何一个你查了文档才想起来的 API',
            ].map((t) => dom.h('li', { text: t }))
          )
        )
      );
    } else {
      const list = dom.h('div', { class: 'cpl-uclist' });
      lessons.forEach((lesson, i) => {
        list.append(renderUserCard(lesson, i, lessons.length, main));
      });
      main.append(list);
    }

    // 贡献到仓库的说明
    main.append(
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '把内容贡献到仓库（可选）' }),
        dom.h('p', { text: '如果你希望这份内容成为站点内置课程（所有人可见），可以按下面的步骤走 GitHub PR：' }),
        dom.h(
          'ol',
          { class: 'cpl-list' },
          [
            dom.h('li', {}, dom.h('span', { text: '点上面的「下载模板文件」得到 JSON，把 lessons[0] 里的字段填好。' })),
            dom.h('li', {}, dom.h('span', { text: '在仓库的 content/user/ 目录里新建一个 .js 文件，参照 content/user/_example.js 的写法（把 JSON 内容贴进 sections）。' })),
            dom.h('li', {}, dom.h('span', { text: '提交 PR。合并后 Actions 会自动重新构建并发布。' })),
          ]
        ),
        dom.h('p', { class: 'cpl-muted', text: '提示：内置课程文件是「数据 + 自注册」，不含任何可执行逻辑，因此审阅时只需要看内容对不对。' })
      )
    );
    main.append(
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: 'AI 辅助写作' }),
        dom.h('p', { class: 'cpl-muted', text: '用 AI 润色正文、生成练习题与 Anki 卡片。注意：AI 生成的内容要自己核对物理与事实正确性再保存。' }),
        (() => {
          const host = dom.h('div', {});
          const panel = CPL.ai.mountPanel(host, {
            mode: 'tutor',
            lessonId: '',
            lesson: {
              title: '我的内容（用户自定义）',
              aiPrompts: [
                '帮我把我写的一段笔记改写成"判据 + 反例"的形式。',
                '根据我这段内容，出 3 道能区分"背过"和"内化了"的判断题。',
                '把这段内容做成 5 张 Anki 卡片（正面问判据，背面给最小例子）。',
              ],
            },
            getCode: () => '',
            getLanguage: () => 'markdown',
          });
          CPL.bus.on('app:navigated-away', () => panel.destroy());
          return host;
        })()
      )
    );
    void md;

    // ── 编辑器（模态） ───────────────────────────────────
    function showProblems(problems) {
      const overlay = dom.h(
        'div',
        { class: 'cpl-modal', onclick: (e) => e.target === overlay && overlay.remove() },
        dom.h(
          'div',
          { class: 'cpl-modal__panel' },
          dom.h('h2', { class: 'cpl-modal__title', text: '导入过程中的问题' }),
          dom.h('ul', { class: 'cpl-list' }, problems.map((p) => dom.h('li', { text: p }))),
          dom.h('button', { class: 'cpl-btn cpl-btn--primary', type: 'button', text: '知道了', onclick: () => overlay.remove() })
        )
      );
      document.body.append(overlay);
    }

    function renderUserCard(lesson, index, total, host) {
      const card = dom.h('article', { class: 'cpl-uc' });
      card.append(
        dom.h(
          'header',
          { class: 'cpl-uc__head' },
          dom.h('div', {}, dom.h('h3', { class: 'cpl-uc__title', text: lesson.title }), lesson.subtitle ? dom.h('p', { class: 'cpl-uc__sub', text: lesson.subtitle }) : null),
          dom.h(
            'div',
            { class: 'cpl-uc__meta' },
            dom.h('span', { class: 'cpl-pill', text: `第 ${lesson.week ?? 99} 周` }),
            dom.h('span', { class: 'cpl-pill', text: `${(lesson.sections || []).length} 小节` }),
            dom.h('span', { class: 'cpl-pill', text: `${(lesson.anki || []).length} 卡片` }),
            dom.h('span', { class: 'cpl-pill', text: new Date(lesson.updatedAt || Date.now()).toLocaleDateString('zh-CN') })
          )
        )
      );

      const actions = dom.h('div', { class: 'cpl-uc__actions' });
      actions.append(
        dom.h('a', { class: 'cpl-btn cpl-btn--primary cpl-btn--sm', href: `#/lesson/${lesson.id}`, text: '打开学习' }),
        dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '编辑', onclick: () => openEditor(lesson, false) }),
        dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '复制', onclick: async () => { await uc.duplicate(lesson.id); CPL.nav.render(); } }),
        dom.h('button', {
          class: 'cpl-btn cpl-btn--sm',
          type: 'button',
          text: '导出',
          onclick: () => dom.download(`${lesson.title}.json`, uc.exportOne(lesson), 'application/json'),
        }),
        dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '↑', 'aria-label': '上移', disabled: index === 0, onclick: async () => { await uc.reorder(lesson.id, -1); CPL.nav.render(); } }),
        dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '↓', 'aria-label': '下移', disabled: index === total - 1, onclick: async () => { await uc.reorder(lesson.id, 1); CPL.nav.render(); } }),
        dom.h('button', {
          class: 'cpl-btn cpl-btn--sm cpl-btn--danger',
          type: 'button',
          text: '删除',
          onclick: async () => {
            if (!window.confirm(`确定删除「${lesson.title}」？此操作不可撤销（建议先导出备份）。`)) return;
            await uc.remove(lesson.id);
            dom.toast('已删除', { kind: 'ok' });
            CPL.nav.render();
          },
        })
      );
      card.append(actions);
      void host;
      return card;
    }

    /** 打开编辑器模态。 */
    function openEditor(initial, isNew) {
      let draft = util.clone(initial);

      const titleInput = dom.h('input', { class: 'cpl-input', value: draft.title, 'aria-label': '课程标题' });
      const subInput = dom.h('input', { class: 'cpl-input', value: draft.subtitle || '', 'aria-label': '副标题' });
      const weekInput = dom.h('input', { class: 'cpl-input', type: 'number', min: '1', max: '40', value: String(draft.week ?? 99), 'aria-label': '周次' });
      const tagsInput = dom.h('input', { class: 'cpl-input', value: (draft.tags || []).join(', '), placeholder: '逗号分隔，例如: 边界条件, Fortran', 'aria-label': '标签' });

      const sectionsHost = dom.h('div', { class: 'cpl-uc__sections' });
      const previewHost = dom.h('div', { class: 'cpl-uc__preview cpl-md' });

      function renderSections() {
        dom.clear(sectionsHost);
        (draft.sections || []).forEach((s, i) => {
          const body = dom.h('textarea', { class: 'cpl-textarea', rows: '8', 'aria-label': `小节 ${i + 1} 正文` });
          body.value = s.body || '';
          body.addEventListener('input', () => {
            s.body = body.value;
            schedulePreview();
          });

          const title = dom.h('input', { class: 'cpl-input cpl-input--sm', value: s.title || '', placeholder: '小节标题', 'aria-label': `小节 ${i + 1} 标题` });
          title.addEventListener('input', () => {
            s.title = title.value;
          });

          const item = dom.h('div', { class: 'cpl-uc__section' });
          item.append(
            dom.h(
              'div',
              { class: 'cpl-uc__section-bar' },
              dom.h('span', { class: 'cpl-uc__section-no', text: `#${i + 1}` }),
              title,
              dom.h('button', {
                class: 'cpl-btn cpl-btn--sm cpl-btn--ghost',
                type: 'button',
                text: '↑',
                'aria-label': '上移小节',
                disabled: i === 0,
                onclick: () => {
                  const t = draft.sections[i - 1];
                  draft.sections[i - 1] = draft.sections[i];
                  draft.sections[i] = t;
                  renderSections();
                  schedulePreview();
                },
              }),
              dom.h('button', {
                class: 'cpl-btn cpl-btn--sm cpl-btn--ghost',
                type: 'button',
                text: '✕',
                'aria-label': '删除小节',
                onclick: () => {
                  draft.sections.splice(i, 1);
                  renderSections();
                  schedulePreview();
                },
              })
            ),
            body
          );
          sectionsHost.append(item);
        });

        sectionsHost.append(
          dom.h('button', {
            class: 'cpl-btn cpl-btn--sm',
            type: 'button',
            text: '+ 添加小节',
            onclick: () => {
              draft.sections.push({ title: '', body: '' });
              renderSections();
              schedulePreview();
            },
          })
        );
      }

      const schedulePreview = util.debounce(() => {
        const text = (draft.sections || []).map((s) => `## ${s.title || '（未命名）'}\n\n${s.body || ''}`).join('\n\n');
        dom.clear(previewHost);
        previewHost.append(md.render(text));
        if (CPL.highlight) CPL.highlight.applyAll(previewHost);
      }, 350);

      // 卡片编辑（简洁：一行一个"正面 | 背面"）
      const cardsArea = dom.h('textarea', {
        class: 'cpl-textarea',
        rows: '5',
        placeholder: '每行一张卡片，用「|」分隔正面与背面：\n什么情况下会发生灾难性抵消？ | 两个相近的大数相减时；有效位被完全吃掉。',
        'aria-label': 'Anki 卡片',
      });
      cardsArea.value = (draft.anki || []).map((c) => `${c.front} | ${c.back}`).join('\n');

      const objectivesArea = dom.h('textarea', { class: 'cpl-textarea', rows: '4', placeholder: '每行一个学习目标', 'aria-label': '学习目标' });
      objectivesArea.value = (draft.objectives || []).join('\n');

      const checklistArea = dom.h('textarea', { class: 'cpl-textarea', rows: '3', placeholder: '每行一个自检项', 'aria-label': '自检清单' });
      checklistArea.value = (draft.checklist || []).join('\n');

      const aiPromptsArea = dom.h('textarea', { class: 'cpl-textarea', rows: '3', placeholder: '每行一个引导问题', 'aria-label': 'AI 引导问题' });
      aiPromptsArea.value = (draft.aiPrompts || []).join('\n');

      const body = dom.h(
        'div',
        { class: 'cpl-uc__editor' },
        dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '标题' }), titleInput),
        dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '副标题' }), subInput),
        dom.h(
          'div',
          { class: 'cpl-uc__row' },
          dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '周次（决定在课表里的位置）' }), weekInput),
          dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '标签' }), tagsInput)
        ),
        dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '学习目标（每行一个）' }), objectivesArea),
        dom.h('h3', { text: '正文小节（Markdown，支持代码块与公式）' }),
        sectionsHost,
        dom.h('h3', { text: 'AI 引导问题（每行一个）' }),
        aiPromptsArea,
        dom.h('h3', { text: 'Anki 卡片（每行一张，正面 | 背面）' }),
        cardsArea,
        dom.h('h3', { text: '自检清单（每行一个）' }),
        checklistArea,
        dom.h('h3', { text: '实时预览' }),
        previewHost
      );

      const saveBtn = dom.h('button', { class: 'cpl-btn cpl-btn--primary', type: 'button', text: isNew ? '创建课程' : '保存修改' });
      const previewBtn = dom.h('button', { class: 'cpl-btn', type: 'button', text: '预览完整课程页' });
      const aiPolishBtn = dom.h('button', { class: 'cpl-btn', type: 'button', text: 'AI 润色当前小节正文' });

      const overlay = dom.h(
        'div',
        {
          class: 'cpl-modal cpl-modal--wide',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-label': isNew ? '新建课程' : '编辑课程',
          onclick: (e) => {
            if (e.target === overlay) close();
          },
        },
        dom.h(
          'div',
          { class: 'cpl-modal__panel cpl-modal__panel--wide' },
          dom.h('h2', { class: 'cpl-modal__title', text: isNew ? '新建课程' : `编辑：${initial.title}` }),
          body,
          dom.h('div', { class: 'cpl-lesson__actions' }, saveBtn, previewBtn, aiPolishBtn, dom.h('button', { class: 'cpl-btn cpl-btn--ghost', type: 'button', text: '取消', onclick: () => close() }))
        )
      );

      function collect() {
        draft.title = titleInput.value.trim() || '未命名课程';
        draft.subtitle = subInput.value.trim();
        draft.week = util.clamp(parseInt(weekInput.value, 10) || 99, 1, 40);
        draft.tags = tagsInput.value
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        draft.objectives = objectivesArea.value.split('\n').map((t) => t.trim()).filter(Boolean);
        draft.checklist = checklistArea.value.split('\n').map((t) => t.trim()).filter(Boolean);
        draft.aiPrompts = aiPromptsArea.value.split('\n').map((t) => t.trim()).filter(Boolean);
        draft.anki = cardsArea.value
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const idx = line.indexOf('|');
            if (idx < 0) return { front: line, back: '（未填写背面）', tags: ['user'] };
            return { front: line.slice(0, idx).trim(), back: line.slice(idx + 1).trim(), tags: ['user'] };
          });
        return draft;
      }

      function close() {
        const releaseFocus = overlay._release;
        overlay.remove();
        document.removeEventListener('keydown', onKey);
        if (releaseFocus) releaseFocus();
      }
      function onKey(e) {
        if (e.key === 'Escape') close();
      }

      saveBtn.addEventListener('click', async () => {
        try {
          const rec = collect();
          await uc.save(rec);
          dom.toast(isNew ? '课程已创建' : '已保存', { kind: 'ok' });
          close();
          CPL.nav.render();
        } catch (err) {
          dom.toast(dom.friendlyError(err), { kind: 'error', ms: 8000 });
        }
      });

      previewBtn.addEventListener('click', async () => {
        const rec = collect();
        await uc.save(rec);
        close();
        CPL.nav.go('lesson', rec.id);
      });

      aiPolishBtn.addEventListener('click', () => {
        if (!CPL.ai.enabled()) {
          dom.toast('AI 助教未启用（站点未配置 apiBase）', { kind: 'warn', ms: 5000 });
          return;
        }
        const first = (draft.sections || [])[0];
        if (!first || !first.body) {
          dom.toast('先写一点正文，再让 AI 润色', { kind: 'warn' });
          return;
        }
        const panelHost = dom.h('div', { class: 'cpl-uc__ai' });
        body.append(panelHost);
        const panel = CPL.ai.mountPanel(panelHost, {
          mode: 'tutor',
          lessonId: '',
          lesson: {
            title: draft.title,
            aiPrompts: [
              '请把下面的正文改写成「判据 + 反例」的形式，保留我的技术细节，不要加我没说过的事实：\n\n' + first.body.slice(0, 1500),
              '根据这段正文，给我 5 张 Anki 卡片（正面问判据，背面给最小例子）。',
              '这段正文里有没有含糊或可能出错的说法？逐条指出来。',
            ],
          },
          getCode: () => first.body,
          getLanguage: () => 'markdown',
        });
        panel.focus();
        panelHost.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      document.body.append(overlay);
      overlay._release = dom.trapFocus(overlay);
      document.addEventListener('keydown', onKey);
      titleInput.focus();
      renderSections();
      schedulePreview();
    }
  });

  /** 8 段式骨架模板。 */
  function templateSkeleton() {
    return {
      title: '我的课程（请改标题）',
      subtitle: '一句话说明这一课解决什么问题',
      tags: ['自定义'],
      objectives: ['能解释 … 的适用条件', '能预测改变参数后结果如何变化', '能举出自己代码里的同类例子'],
      sections: [
        {
          title: '核心概念',
          body: '> [!PHYSICS] 物理直觉\n> 先说"为什么会这样"，再说"数学上怎么写"。\n\n$$f(x) = \\frac{1}{1 + e^{-x}}$$',
        },
        { title: '代码示例', body: '```python\nimport numpy as np\n\ndef demo(n):\n    return np.arange(n, dtype=float)\n```' },
        { title: '常见错误', body: '> [!CAUTION] 易错点\n> 写清错误现象、原因、以及怎么快速发现。' },
      ],
      aiPrompts: ['这一节里最不确定的是哪一句？', '如果把参数放大 10 倍，你预期结果怎么变？'],
      anki: [{ front: '这一节最核心的判据是什么？', back: '（把你的答案写在这里）', tags: ['自定义'] }],
      checklist: ['能用自己的话复述这一节', '能举出一个具体项目或代码片段作为锚点'],
      week: 99,
      module: 7,
    };
  }
  uc.templateSkeleton = templateSkeleton;

  // 注意：不在 'app:mounted' 里重复初始化。
  // 初始化由 99-main.js 的启动流程统一调用（顺序：目录 → 用户内容 → 渲染导航），
  // 否则会和 99-main.js 里的调用重复执行一次 writeIndex + syncCatalog。
})();

/* ===== pieces/92-demos-basics.js ===== */
/* ============================================================================
 * 92-demos-basics.js — 模块 0（零基础入门）的交互式 demo
 *
 * 这里只有一个 demo：code-trace（逐行执行追踪）。
 *
 * 为什么需要它：
 *   零基础的读者最大的障碍是"一行代码到底发生了什么"。光看文字说明很容易
 *   以为自己懂了，但那是识别，不是理解。这个 demo 把一小段程序拆成一行一行，
 *   点一次"下一行"走一步，每一步都用中文说清**这一行做了什么、值变成了什么**。
 *
 * 它的数据全部写在下面 PROGRAMS 里（不是解析真实 Python）：
 *   在浏览器里解析并执行任意 Python 是 Pyodide 的活，那是"代码练习"部分的职责；
 *   这个 demo 的职责是**放慢速度讲清单步语义**，所以用预先写好的逐步说明更可靠，
 *   也不会因为用户改错一个字符就抛异常。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const demos = CPL.demos;

  const PROGRAMS = [
    {
      id: 'first-output',
      label: '第一个程序：让屏幕显示一行字',
      code: [
        '# 井号开头的这一行是注释，Python 完全忽略它',
        'print("你好，世界")',
        'print(2 + 3)',
        'print("2 + 3")',
      ],
      steps: [
        {
          line: 0,
          what: '注释行。Python 读到 # 就把这一行剩下的内容全部丢掉，不执行任何动作。它只写给读代码的人看。',
          state: '还没有任何输出。',
        },
        {
          line: 1,
          what: '调用 print。print 是一个**函数**——一段有名字、可以被反复使用的代码。你给它一个值，它就把这个值显示到屏幕上。这里的值是 "你好，世界"，两边的双引号表示它是一个**字符串**，也就是一段文字。',
          state: '第一行输出：你好，世界',
          newOutput: '你好，世界',
        },
        {
          line: 2,
          what: 'print(2 + 3)：括号里不是文字，而是一个**算式**。Python 先把 2 + 3 算出来得到 5，再把 5 交给 print 显示。所以屏幕上出现的是 5，不是 "2 + 3"。',
          state: '第二行输出：5',
          newOutput: '5',
        },
        {
          line: 3,
          what: 'print("2 + 3")：这次括号里带着双引号，所以它是一个字符串，内容是三个符号 2、空格、+、空格、3。Python 不会去算它，直接把这段文字原样显示。对比上一行，这是**初学者最常混淆的地方**：有没有引号，决定了"算出来"还是"原样输出"。',
          state: '第三行输出：2 + 3',
          newOutput: '2 + 3',
        },
      ],
      takeaway:
        '同一个 print，加不加引号结果完全不同：有引号 → 原样输出这段文字；没引号 → 先算出来，再输出结果。程序就是"按顺序执行的一串指令"，从第一行开始，一行一行往下走。',
    },
    {
      id: 'order-matters',
      label: '执行顺序：为什么顺序不能颠倒',
      code: [
        'print("第一步")',
        'print("第二步")',
        'print("第三步")',
      ],
      steps: [
        { line: 0, what: '执行第一行：显示 第一步。', state: '输出：第一步', newOutput: '第一步' },
        {
          line: 1,
          what: '执行第二行：显示 第二步。注意——Python 是**从上往下**依次执行的，它不会跳着来。',
          state: '输出：第一步、第二步',
          newOutput: '第二步',
        },
        { line: 2, what: '执行第三行：显示 第三步。程序到这里结束。', state: '输出：第一步、第二步、第三步', newOutput: '第三步' },
      ],
      takeaway:
        '把这三行的顺序换一下，屏幕上出现的顺序就跟着换。程序的"顺序"是有意义的信息，不是随便排的。',
    },
    {
      id: 'syntax-error',
      label: '出错会怎样：一个字符写错就停下',
      code: [
        'print("第一行没问题")',
        'print("这一行少了右边的括号"',
        'print("这一行永远不会执行")',
      ],
      steps: [
        { line: 0, what: '执行第一行：显示 第一行没问题。', state: '输出：第一行没问题', newOutput: '第一行没问题' },
        {
          line: 1,
          what: 'Python 准备执行这一行时，发现括号没有配对（左边有一个 (，右边没有 )）。它**在动手执行之前**就拒绝了这个文件，抛出 SyntaxError（语法错误）。"语法"就是这种"括号必须配对、引号必须成对"的书写规则。',
          state: '报错：SyntaxError: \'(\' was never closed',
          error: "SyntaxError: '(' was never closed",
        },
        {
          line: 2,
          what: '这一行不会被跳过——**整个文件都没能开始运行**。注意这和你可能以为的"执行到第二行才出错"不一样：语法错误是在"翻译"阶段就被发现的，所以第一行其实也没有真正执行。这是本 demo 唯一一处为了讲清楚而简化的地方：真实的 SyntaxError 会让你连第一行的输出都看不到。',
          state: '整个程序都没有运行',
        },
      ],
      takeaway:
        '两类错误要分清：**语法错误（SyntaxError）**是书写规则不对，程序根本不会开始运行，Python 会告诉你第几行；**运行时错误**是书写没问题、但执行到某一步做不成（比如除以零），这时前面的输出已经产生了。读报错时先看最后一行，那里写着错误的类型和位置。',
    },
  ];

  demos.register('code-trace', (host, params, api) => {
    const pickId = (params && params.program) || PROGRAMS[0].id;
    const program = PROGRAMS.find((p) => p.id === pickId) || PROGRAMS[0];

    let step = -1; // -1 表示"还没开始"

    const codeHost = dom.h('div', { class: 'cpl-trace__code' });
    const outputHost = dom.h('pre', { class: 'cpl-trace__out', 'aria-live': 'polite' });
    const whatHost = dom.h('p', { class: 'cpl-trace__what' });
    const stateHost = dom.h('p', { class: 'cpl-trace__state' });
    const progressHost = dom.h('div', { class: 'cpl-trace__progress' });

    const lineEls = program.code.map((text, i) => {
      const el = dom.h('div', { class: 'cpl-trace__line' });
      el.append(
        dom.h('span', { class: 'cpl-trace__no', text: String(i + 1) }),
        dom.h('code', { text: text || '\u00a0' })
      );
      codeHost.append(el);
      return el;
    });

    const prevBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '上一步',
      onclick: () => go(step - 1),
    });
    const nextBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm cpl-btn--primary',
      type: 'button',
      text: '下一行',
      onclick: () => go(step + 1),
    });
    const resetBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '从头开始',
      onclick: () => go(-1),
    });

    function render() {
      // 高亮当前行
      lineEls.forEach((el, i) => {
        el.classList.toggle('is-current', i === step);
        el.classList.toggle('is-done', i < step);
      });

      const visible = program.steps.slice(0, step + 1);
      outputHost.textContent = visible.map((s) => s.newOutput).filter(Boolean).join('\n');

      const cur = step >= 0 ? program.steps[step] : null;
      if (!cur) {
        whatHost.textContent = '点"下一行"，从第 1 行开始执行。';
        stateHost.textContent = '';
        stateHost.className = 'cpl-trace__state';
      } else {
        whatHost.textContent = cur.what;
        stateHost.textContent = cur.state || '';
        stateHost.className = 'cpl-trace__state' + (cur.error ? ' is-error' : '');
        if (cur.error) {
          // 报错时把输出区最后一行显示成报错样式（文本本身已包含在 steps 里）
          outputHost.textContent = visible.map((s) => s.newOutput).filter(Boolean).join('\n');
        }
      }

      progressHost.textContent = `第 ${Math.max(step + 1, 0)} / ${program.steps.length} 步`;
      prevBtn.disabled = step <= -1;
      nextBtn.disabled = step >= program.steps.length - 1;
      if (step >= program.steps.length - 1) nextBtn.textContent = '已到最后一步';
      else nextBtn.textContent = '下一行';
    }

    function go(next) {
      step = Math.max(-1, Math.min(next, program.steps.length - 1));
      render();
    }

    host.append(
      dom.h('div', { class: 'cpl-trace__title', text: program.label }),
      codeHost,
      dom.h('div', { class: 'cpl-trace__controls' }, [prevBtn, nextBtn, resetBtn, progressHost]),
      dom.h('div', { class: 'cpl-trace__panels' }, [
        dom.h('div', { class: 'cpl-trace__panel' }, [
          dom.h('h4', { text: '程序输出' }),
          outputHost,
        ]),
        dom.h('div', { class: 'cpl-trace__panel' }, [
          dom.h('h4', { text: '这一行做了什么' }),
          whatHost,
          stateHost,
        ]),
      ]),
      dom.h('div', { class: 'cpl-demo__note', text: program.takeaway })
    );

    render();

    // 让课程页的"重跑/清理"按钮能复位
    if (api && typeof api.onReset === 'function') api.onReset(() => go(-1));
  });
})();

/* ===== pieces/95-nav.js ===== */
/* ============================================================================
 * 95-nav.js — 应用外壳、路由、侧边导航、首页
 *
 * 路由（hash，天然适配 GitHub Pages 子路径，不需要 404 重写）：
 *   #/                     首页 / 学习路径
 *   #/lesson/<id>          课程页
 *   #/mine                 我的内容（模块 7）
 *   #/cards                卡片与 Anki 导出
 *   #/settings             设置 / 数据管理
 *   #/about                关于与许可
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const md = CPL.md;
  const catalog = CPL.catalog;

  const nav = (CPL.nav = CPL.nav || {});

  // ─────────────────────────────────────────────────────────────
  // 路由
  //
  // 注意：CPL.nav 与 CPL.nav.views 在 00-core.js 里已经有占位（因为视图分片
  // 35/40/90 的加载顺序在本文件之前，它们必须在加载期就能 register）。
  // 这里只接管/覆写需要真实 DOM 的那些方法，并保留已注册的 views。
  // ─────────────────────────────────────────────────────────────
  const ROUTES = ['home', 'lesson', 'assess', 'assess-quiz', 'mine', 'cards', 'settings', 'about'];

  nav.parseHash = function parseHash(hash) {
    const raw = String(hash || location.hash || '').replace(/^#\/?/, '');
    if (!raw) return { name: 'home', param: '' };
    const [name, ...rest] = raw.split('/');
    const param = rest.join('/');
    if (!ROUTES.includes(name)) return { name: 'home', param: '', unknown: name };
    return { name, param };
  };

  nav.go = function go(name, param = '') {
    const target = `#/${name}${param ? '/' + param : ''}`;
    if (location.hash === target) nav.render();
    else location.hash = target;
  };

  // 保留 00-core.js 里已注册的视图，不能重新赋值成空对象
  const views = (nav.views = nav.views || {});

  /** 注册一个视图渲染函数：(container, param, route) => void|Promise */
  nav.register = function register(name, fn) {
    views[name] = fn;
  };

  let rendering = false;
  let pending = false;

  nav.render = async function render() {
    if (rendering) {
      // 上一个视图还在渲染（例如某一课正在加载）。这里**必须给出可见反馈**，
      // 否则用户点了链接却觉得"没反应"——这正是真实遇到过的问题。
      // 之前是静默 pending = true; return;
      pending = true;
      nav.showBusy('正在完成上一个页面的加载…');
      return;
    }
    rendering = true;
    const route = nav.parseHash();
    const main = document.getElementById('cpl-main');
    if (!main) {
      rendering = false;
      return;
    }

    // 切换视图时释放上一页占用的资源（demo 的定时器、CodeMirror 实例、AI 流等）
    if (typeof nav._cleanup === 'function') {
      try {
        nav._cleanup();
      } catch (err) {
        CPL.log('warn', '视图清理失败', err);
      }
      nav._cleanup = null;
    }
    // 离开课程页时，让课程视图自己清场（编辑器、demo、AI 面板）
    if (nav._lastRoute === 'lesson' && route.name !== 'lesson' && CPL.lessonView && CPL.lessonView.cleanup) {
      try {
        CPL.lessonView.cleanup();
      } catch (err) {
        CPL.log('warn', '课程页清理失败', err);
      }
    }
    nav._lastRoute = route.name;

    document.documentElement.dataset.cplRoute = route.name;
    nav.highlight(route);
    nav.setDrawerOpen(false);

    const view = views[route.name] || views.home;
    try {
      await view(main, route.param, route);
    } catch (err) {
      CPL.log('error', `渲染视图 ${route.name} 失败`, err);
      dom.clear(main).append(
        dom.errorCard('页面加载失败', dom.friendlyError(err), [
          '刷新页面重试',
          '如果是从 file:// 直接打开，请改用 npm run serve 启动本地服务器',
        ])
      );
    } finally {
      nav.hideBusy();
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: CPL.prefs.get('reducedMotion') ? 'auto' : 'smooth' });
      rendering = false;
      if (pending) {
        pending = false;
        nav.render();
      }
    }
  };

  /**
   * 顶部"忙"提示：只在视图切换被排队、或视图自己声明很慢时出现。
   * 位置固定在页头下方，任何视图都能看到，避免"点了没反应"的错觉。
   */
  nav.showBusy = function showBusy(text) {
    let el = document.getElementById('cpl-busy');
    if (!el) {
      el = dom.h('div', { class: 'cpl-busy', id: 'cpl-busy', role: 'status', 'aria-live': 'polite' });
      el.append(dom.h('span', { class: 'cpl-busy__spinner', 'aria-hidden': 'true' }), dom.h('span', { class: 'cpl-busy__text' }));
      document.body.append(el);
    }
    el.querySelector('.cpl-busy__text').textContent = text || '加载中…';
    el.hidden = false;
  };

  nav.hideBusy = function hideBusy() {
    const el = document.getElementById('cpl-busy');
    if (el) el.hidden = true;
  };

  // ─────────────────────────────────────────────────────────────
  // 应用外壳
  // ─────────────────────────────────────────────────────────────
  nav.buildShell = function buildShell(root) {
    dom.clear(root);

    const icon = (d, extra = '') =>
      dom.svg(
        'svg',
        { viewBox: '0 0 24 24', width: '18', height: '18', 'aria-hidden': 'true', fill: 'none', class: extra },
        dom.svg('path', { d, stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
      );

    const menuBtn = dom.h('button', {
      class: 'cpl-iconbtn cpl-menu-btn',
      type: 'button',
      'aria-label': '打开课程目录',
      'aria-expanded': 'false',
      'aria-controls': 'cpl-sidebar',
      onclick: () => nav.setDrawerOpen(!nav.isDrawerOpen()),
    });
    menuBtn.append(
      dom.svg(
        'svg',
        { viewBox: '0 0 24 24', width: '20', height: '20', 'aria-hidden': 'true', fill: 'none' },
        dom.svg('path', { d: 'M3 6h18M3 12h18M3 18h18', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round' })
      )
    );

    const searchInput = dom.h('input', {
      type: 'search',
      id: 'cpl-search',
      class: 'cpl-search__input',
      placeholder: '搜索课程 / 概念 / 标签…',
      'aria-label': '搜索课程',
      autocomplete: 'off',
      spellcheck: 'false',
    });

    const searchResults = dom.h('div', { class: 'cpl-search__results', hidden: true, role: 'listbox' });

    const searchBox = dom.h(
      'div',
      { class: 'cpl-search' },
      dom.h('span', { class: 'cpl-search__icon', 'aria-hidden': 'true' }, '⌕'),
      searchInput,
      dom.h('kbd', { class: 'cpl-search__kbd', text: '/' }),
      searchResults
    );

    const themeBtn = dom.h('button', {
      class: 'cpl-iconbtn',
      type: 'button',
      'aria-label': '切换主题',
      title: '切换主题（浅色 / 深色 / 跟随系统）',
      onclick: () => CPL.theme.cycle(),
    });
    themeBtn.append(icon('M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'));

    const header = dom.h(
      'header',
      { class: 'cpl-header' },
      menuBtn,
      dom.h(
        'a',
        { class: 'cpl-brand', href: '#/home' },
        dom.h('span', { class: 'cpl-brand__mark', 'aria-hidden': 'true', text: '∫' }),
        dom.h(
          'span',
          { class: 'cpl-brand__text' },
          dom.h('strong', { class: 'cpl-brand__title', text: CPL.config.siteName }),
          dom.h('span', { class: 'cpl-brand__sub', text: CPL.config.siteSubtitle })
        )
      ),
      searchBox,
      dom.h(
        'nav',
        { class: 'cpl-header__actions', 'aria-label': '站点导航' },
        dom.h('a', { class: 'cpl-header__link', href: '#/assess', text: '诊断测评' }),
        dom.h('a', { class: 'cpl-header__link', href: '#/mine', text: '我的内容' }),
        dom.h('a', { class: 'cpl-header__link', href: '#/cards', text: '卡片' }),
        dom.h('a', { class: 'cpl-header__link', href: '#/settings', text: '设置' }),
        themeBtn
      )
    );

    const sidebar = dom.h(
      'aside',
      { class: 'cpl-sidebar', id: 'cpl-sidebar', 'aria-label': '课程目录' },
      dom.h(
        'div',
        { class: 'cpl-progress', id: 'cpl-progress' },
        dom.h('div', { class: 'cpl-progress__bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0' }),
        dom.h('div', { class: 'cpl-progress__meta', text: '加载中…' })
      ),
      dom.h('div', { class: 'cpl-toc', id: 'cpl-toc' }, dom.spinner('正在读取课程清单…'))
    );

    const scrim = dom.h('div', {
      class: 'cpl-scrim',
      hidden: true,
      onclick: () => nav.setDrawerOpen(false),
    });

    const main = dom.h('main', {
      class: 'cpl-main',
      id: 'cpl-main',
      tabindex: '-1',
      'aria-live': 'polite',
    });

    const footer = dom.h(
      'footer',
      { class: 'cpl-footer' },
      dom.h(
        'p',
        {},
        '纯静态 · 无后端 · 无备案 · ',
        dom.h('a', { href: '#/about', text: '关于与许可' }),
        ' · 所有学习数据保存在你自己的浏览器里'
      )
    );

    root.append(dom.h('a', { class: 'cpl-skip', href: '#cpl-main', text: '跳到主内容' }), header, scrim, sidebar, main, footer);

    // 搜索交互
    const runSearch = CPL.util.debounce(() => {
      const q = searchInput.value.trim();
      dom.clear(searchResults);
      if (!q) {
        searchResults.hidden = true;
        return;
      }
      const hits = catalog.search(q, 12);
      if (!hits.length) {
        searchResults.hidden = false;
        searchResults.append(dom.h('div', { class: 'cpl-search__empty', text: `没有匹配「${q}」的课程` }));
        return;
      }
      searchResults.hidden = false;
      for (const l of hits) {
        searchResults.append(
          dom.h(
            'a',
            { class: 'cpl-search__item', href: `#/lesson/${l.id}`, role: 'option' },
            dom.h('span', { class: 'cpl-search__week', text: `W${String(l.week).padStart(2, '0')}` }),
            dom.h('span', { class: 'cpl-search__title', text: l.title }),
            dom.h('span', { class: 'cpl-search__tags', text: (l.tags || []).slice(0, 3).join(' · ') })
          )
        );
      }
    }, 140);

    searchInput.addEventListener('input', runSearch);
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim()) searchResults.hidden = false;
    });
    document.addEventListener('click', (e) => {
      if (!searchBox.contains(e.target)) searchResults.hidden = true;
    });
    searchResults.addEventListener('click', () => {
      searchResults.hidden = true;
    });

    // 键盘快捷键：/ 聚焦搜索，g h 回首页，g m 我的内容
    document.addEventListener('keydown', (e) => {
      const tag = (e.target && e.target.tagName) || '';
      const typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable);
      if (typing) return;
      if (e.key === '/') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      } else if (e.key === '?') {
        nav.showShortcuts();
      } else if (e.key.toLowerCase() === 'g') {
        nav._pendingG = true;
        setTimeout(() => {
          nav._pendingG = false;
        }, 900);
      } else if (nav._pendingG) {
        nav._pendingG = false;
        const k = e.key.toLowerCase();
        if (k === 'h') nav.go('home');
        else if (k === 'm') nav.go('mine');
        else if (k === 'c') nav.go('cards');
        else if (k === 's') nav.go('settings');
      }
    });

    window.addEventListener('hashchange', () => nav.render());

    // 移动端断点变化时关掉抽屉
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && nav.isDrawerOpen()) nav.setDrawerOpen(false);
    });
  };

  // ─────────────────────────────────────────────────────────────
  // 移动端抽屉
  // ─────────────────────────────────────────────────────────────
  nav.isDrawerOpen = () => document.documentElement.dataset.cplDrawer === 'open';

  nav.setDrawerOpen = function setDrawerOpen(open) {
    const root = document.documentElement;
    const sidebar = document.getElementById('cpl-sidebar');
    const scrim = document.querySelector('.cpl-scrim');
    const btn = document.querySelector('.cpl-menu-btn');
    if (open) {
      root.dataset.cplDrawer = 'open';
      if (scrim) scrim.hidden = false;
      if (btn) btn.setAttribute('aria-expanded', 'true');
      const focusTarget = sidebar && sidebar.querySelector('a, button');
      if (focusTarget) focusTarget.focus();
      nav._releaseFocus = sidebar ? dom.trapFocus(sidebar) : null;
    } else {
      delete root.dataset.cplDrawer;
      if (scrim) scrim.hidden = true;
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (nav._releaseFocus) {
        nav._releaseFocus();
        nav._releaseFocus = null;
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 侧边目录
  // ─────────────────────────────────────────────────────────────
  const MODULE_KIND = {
    1: { tag: '概念内化', cls: 'concept' },
    2: { tag: '工具速查', cls: 'tool' },
    3: { tag: 'Fortran', cls: 'fortran' },
    4: { tag: '项目整理', cls: 'project' },
    5: { tag: 'CS 核心', cls: 'cs' },
    6: { tag: '抗遗忘', cls: 'memory' },
    7: { tag: '我的内容', cls: 'user' },
  };

  function statusDot(state) {
    const map = { done: ['已完成', 'done'], doing: ['进行中', 'doing'], todo: ['未开始', 'todo'] };
    const [label, cls] = map[state] || map.todo;
    return dom.h('span', { class: `cpl-dot cpl-dot--${cls}`, title: label, 'aria-label': label });
  }

  nav.renderToc = function renderToc() {
    const host = document.getElementById('cpl-toc');
    if (!host) return;
    dom.clear(host);

    const lessons = catalog.lessons();
    const modules = catalog.modules();
    const stored = CPL.store.get('nav.collapsed', {});

    for (const mod of modules) {
      const modLessons = lessons.filter((l) => l.module === mod.id);
      if (!modLessons.length) continue;
      const kind = MODULE_KIND[mod.id] || { tag: `M${mod.id}`, cls: 'cs' };
      const collapsed = stored[String(mod.id)] === true;

      const head = dom.h(
        'button',
        {
          class: 'cpl-mod__head',
          type: 'button',
          'aria-expanded': collapsed ? 'false' : 'true',
          onclick: () => {
            const next = CPL.store.get('nav.collapsed', {});
            next[String(mod.id)] = !collapsed;
            CPL.store.set('nav.collapsed', next);
            nav.renderToc();
          },
        },
        dom.h('span', { class: `cpl-mod__badge cpl-mod__badge--${kind.cls}`, text: kind.tag }),
        dom.h(
          'span',
          { class: 'cpl-mod__label' },
          dom.h('span', { class: 'cpl-mod__title', text: mod.title || `模块 ${mod.id}` }),
          mod.weeks && mod.weeks[1] ? dom.h('span', { class: 'cpl-mod__weeks', text: `第 ${mod.weeks[0]}–${mod.weeks[1]} 周` }) : null
        ),
        dom.h('span', { class: 'cpl-mod__caret', 'aria-hidden': 'true', text: collapsed ? '▸' : '▾' })
      );
      host.append(head);

      if (collapsed) continue;

      const list = dom.h('ul', { class: 'cpl-toc__list' });
      for (const l of modLessons) {
        const rec = CPL.progress.get(l.id);
        const li = dom.h(
          'li',
          { class: 'cpl-toc__item' },
          dom.h(
            'a',
            { class: 'cpl-toc__link', href: `#/lesson/${l.id}`, dataset: { lessonId: l.id } },
            statusDot(rec.state),
            dom.h(
              'span',
              { class: 'cpl-toc__text' },
              dom.h('span', { class: 'cpl-toc__week', text: l.week ? `W${String(l.week).padStart(2, '0')}` : '——' }),
              dom.h('span', { class: 'cpl-toc__title', text: l.title })
            )
          )
        );
        list.append(li);
      }
      host.append(list);
    }

    if (!lessons.length) {
      host.append(
        dom.errorCard('没有找到任何课程', 'content/ 目录下没有可用的课程文件。', [
          '运行 npm run build 生成清单',
          '确认 content/syllabus.json 存在',
        ])
      );
    }
  };

  nav.highlight = function highlight(route) {
    for (const a of dom.qsa('.cpl-toc__link')) {
      const active = route.name === 'lesson' && a.dataset.lessonId === route.param;
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
  };

  nav.renderProgress = function renderProgress() {
    const host = document.getElementById('cpl-progress');
    if (!host) return;
    const lessons = catalog.lessons();
    const s = CPL.progress.summary(lessons);
    const bar = host.querySelector('.cpl-progress__bar');
    const meta = host.querySelector('.cpl-progress__meta');
    if (bar) {
      bar.style.width = `${s.percent}%`;
      bar.setAttribute('aria-valuenow', String(s.percent));
      bar.parentElement.setAttribute('aria-label', `总体进度 ${s.percent}%`);
    }
    if (meta) {
      meta.textContent = `已完成 ${s.done} / ${s.total} 课 · ${s.percent}%`;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 首页：学习路径
  // ─────────────────────────────────────────────────────────────
  const PATH_STEPS = [
    { title: '诊断测评', weeks: '开始之前 · 约 8 分钟', body: '用 24 道「判据与预测」题测出你已经内化了什么，生成技能清单画像，据此决定从哪开始、哪些可以略过。' },
    { title: '概念内化', weeks: '第 1–4 周', body: '复杂度、内存模型、数值误差、稳定性、收敛阶、并行范式。这些必须内化到能自己推回来。' },
    { title: '工具速查', weeks: '贯穿全程 · 每天 15 分钟', body: 'NumPy、C++ 阅读、Fortran 基础、工具链、AI 辅助。目标只有一个：知道有它，会查。' },
    { title: 'Fortran 编程', weeks: '第 5–7 周', body: '现代 Fortran 与 legacy 代码的阅读、修改、性能优化，落到扩散方程与 Monte Carlo。' },
    { title: '项目知识整理', weeks: '第 8–10 周', body: '把 PRB/CPC 类工作整理成 7 问文档：问题、方法、架构、bug、性能、验证、重做。' },
    { title: 'CS 核心', weeks: '第 11–19 周', body: '数据结构 → 算法 → 系统设计 → OS/网络/数据库 → 并发与性能，CIU 式清单推进。' },
    { title: '系统抗遗忘', weeks: '贯穿全程', body: '项目锚点 + 代码库 + Anki 间隔重复 + 费曼输出。忘记不是归零，是"存档"。' },
    { title: '我的内容', weeks: '贯穿全程', body: '在浏览器里写自己的卡片与课程，IndexedDB 保存，JSON 导入导出。' },
  ];

  nav.register('home', async (main) => {
    const lessons = catalog.lessons();
    const modules = catalog.modules();
    const s = CPL.progress.summary(lessons);

    const hero = dom.h(
      'section',
      { class: 'cpl-hero' },
      dom.h('h1', { class: 'cpl-hero__title', text: '计算物理 × 计算机科学 · 互动学习路径' }),
      dom.h('p', { class: 'cpl-hero__lead' }, '27 周 · 7 大模块 · ', dom.h('strong', { text: `${lessons.length} 节` }), ' 可交互课程。不涉及面试与简历，只谈知识与代码。'),
      dom.h(
        'div',
        { class: 'cpl-hero__stats' },
        statCard('总体进度', `${s.percent}%`, `${s.done} / ${s.total} 课已完成`),
        statCard('已完成', String(s.done), '标记为 done 的课程'),
        statCard('进行中', String(s.doing), '已开始但未完成'),
        statCard('课程总数', String(s.total), `${modules.length} 个模块`)
      ),
      dom.h(
        'div',
        { class: 'cpl-hero__cta' },
        CPL.assess && !CPL.assess.hasTaken()
          ? dom.h('a', {
              class: 'cpl-btn cpl-btn--primary',
              href: '#/assess',
              text: '第一步：做诊断测评，生成你的学习路径 →',
            })
          : dom.h('a', {
              class: 'cpl-btn cpl-btn--primary',
              href: s.done || s.doing ? `#/lesson/${firstUnfinished(lessons)}` : `#/lesson/${lessons[0] ? lessons[0].id : ''}`,
              text: s.done || s.doing ? '继续上次的进度 →' : '从第 1 课开始 →',
            }),
        CPL.assess && !CPL.assess.hasTaken()
          ? dom.h('a', {
              class: 'cpl-btn',
              href: s.done || s.doing ? `#/lesson/${firstUnfinished(lessons)}` : `#/lesson/${lessons[0] ? lessons[0].id : ''}`,
              text: '跳过测评，按周次顺序学',
            })
          : null,
        CPL.assess && CPL.assess.hasTaken()
          ? dom.h('a', { class: 'cpl-btn', href: '#/assess/result', text: '查看我的技能画像与推荐路径' })
          : null,
        dom.h('a', { class: 'cpl-btn', href: '#/cards', text: '导出 Anki 卡片' }),
        dom.h('a', { class: 'cpl-btn', href: '#/mine', text: '写我自己的课程' })
      )
    );

    const pathSection = dom.h(
      'section',
      { class: 'cpl-section' },
      dom.h('h2', { class: 'cpl-section__title', text: '学习路径（7 步）' }),
      dom.h(
        'ol',
        { class: 'cpl-path' },
        PATH_STEPS.map((step, i) =>
          dom.h(
            'li',
            { class: 'cpl-path__step' },
            dom.h('span', { class: 'cpl-path__num', text: String(i + 1) }),
            dom.h(
              'div',
              { class: 'cpl-path__body' },
              dom.h('h3', { class: 'cpl-path__title', text: step.title }),
              dom.h('p', { class: 'cpl-path__weeks', text: step.weeks }),
              dom.h('p', { class: 'cpl-path__text', text: step.body })
            )
          )
        )
      )
    );

    const moduleSection = dom.h('section', { class: 'cpl-section' }, dom.h('h2', { class: 'cpl-section__title', text: '课程地图' }));

    for (const mod of modules) {
      const modLessons = lessons.filter((l) => l.module === mod.id);
      if (!modLessons.length) continue;
      const kind = MODULE_KIND[mod.id] || { tag: `M${mod.id}`, cls: 'cs' };
      const card = dom.h(
        'article',
        { class: 'cpl-modcard' },
        dom.h(
          'header',
          { class: 'cpl-modcard__head' },
          dom.h('span', { class: `cpl-mod__badge cpl-mod__badge--${kind.cls}`, text: kind.tag }),
          dom.h('h3', { class: 'cpl-modcard__title', text: mod.title || `模块 ${mod.id}` }),
          mod.weeks && mod.weeks[1] ? dom.h('span', { class: 'cpl-modcard__weeks', text: `第 ${mod.weeks[0]}–${mod.weeks[1]} 周` }) : null
        ),
        mod.summary ? dom.h('p', { class: 'cpl-modcard__summary', text: mod.summary }) : null,
        dom.h(
          'ul',
          { class: 'cpl-modcard__list' },
          modLessons.map((l) => {
            const rec = CPL.progress.get(l.id);
            return dom.h(
              'li',
              { class: 'cpl-modcard__item' },
              dom.h(
                'a',
                { href: `#/lesson/${l.id}`, class: 'cpl-modcard__link' },
                statusDot(rec.state),
                dom.h('span', { class: 'cpl-modcard__week', text: l.week ? `W${String(l.week).padStart(2, '0')}` : '—' }),
                dom.h('span', { class: 'cpl-modcard__name', text: l.title }),
                dom.h('span', { class: 'cpl-modcard__tags', text: (l.tags || []).slice(0, 3).join(' · ') })
              )
            );
          })
        )
      );
      moduleSection.append(card);
    }

    const principles = dom.h(
      'section',
      { class: 'cpl-section' },
      dom.h('h2', { class: 'cpl-section__title', text: '三条贯穿全站的判断准则' }),
      dom.h(
        'div',
        { class: 'cpl-principles' },
        principleCard(
          '概念性知识：必须内化',
          '复杂度、内存模型、数值误差、稳定性、收敛阶、并行范式、边界条件、调试方法。判据是「能自己推回来」——忘了不用查文档，拿张纸就能重新导出来。'
        ),
        principleCard(
          '工具性细节：知道存在，会查即可',
          '具体 API、语法、库函数、编译参数。判据是「30 秒能查到」——所以每节课都有"查文档挑战"，训练的是检索速度，不是背诵量。'
        ),
        principleCard(
          '抗遗忘：忘记不是归零，是存档',
          '项目锚点 + 代码库 + Anki 间隔重复 + 费曼输出。每节课的卡片都会挂到一具体代码片段或科研场景上，而不是孤立定义。'
        )
      )
    );

    main.append(hero);

    // 掌握度速览 + 下一步（有测评结果时）
    if (CPL.mastery) {
      const prof = CPL.mastery.profile();
      if (prof.hasAssessment) {
        const rec = CPL.mastery.recommend(lessons);
        const nextId = rec.order.find((id) => rec.focus.includes(id)) || rec.order[0];
        const nextMeta = nextId ? catalog.meta(nextId) : null;
        main.append(
          dom.h(
            'section',
            { class: 'cpl-section cpl-nextstep' },
            dom.h('h2', { class: 'cpl-section__title', text: '你的下一步' }),
            dom.h(
              'div',
              { class: 'cpl-nextstep__grid' },
              dom.h(
                'div',
                { class: 'cpl-card' },
                dom.h('h3', { class: 'cpl-card__title', text: `掌握度 ${Math.round(prof.overall * 100)}% · ${CPL.mastery.levelLabel(prof.overallLevel)}` }),
                dom.h('p', {
                  class: 'cpl-muted',
                  text: `已评估 ${prof.assessedCount} / ${prof.totalSkills} 项技能。薄弱 ${prof.weak.length} 项，已掌握 ${prof.strong.length} 项。`,
                }),
                Object.values(prof.byDomain).map((d) =>
                  dom.h(
                    'div',
                    { class: 'cpl-meter' },
                    dom.h('span', { class: 'cpl-meter__label', text: d.label }),
                    dom.h('span', { class: 'cpl-meter__track' }, dom.h('span', { class: 'cpl-meter__fill', style: { width: `${Math.round(d.average * 100)}%` } })),
                    dom.h('span', { class: 'cpl-meter__value', text: `${Math.round(d.average * 100)}%` })
                  )
                ),
                dom.h('p', {}, dom.h('a', { class: 'cpl-btn cpl-btn--sm', href: '#/assess/result', text: '查看完整画像与路径' }))
              ),
              dom.h(
                'div',
                { class: 'cpl-card' },
                dom.h('h3', { class: 'cpl-card__title', text: '推荐现在就去的一课' }),
                nextMeta
                  ? dom.h(
                      'div',
                      {},
                      dom.h('p', { class: 'cpl-nextstep__lesson', text: `W${String(nextMeta.week).padStart(2, '0')} ${nextMeta.title}` }),
                      dom.h('p', { class: 'cpl-muted', text: rec.reason[nextId] || '' }),
                      dom.h('p', {}, dom.h('a', { class: 'cpl-btn cpl-btn--primary', href: `#/lesson/${nextId}`, text: '开始这一课 →' }))
                    )
                  : dom.h('p', { class: 'cpl-muted', text: '课程清单为空，先运行 npm run build 生成内容。' })
              )
            )
          )
        );
      } else {
        main.append(
          dom.h(
            'section',
            { class: 'cpl-section' },
            dom.h(
              'div',
              { class: 'cpl-card cpl-callout cpl-callout--important' },
              dom.h('h2', { class: 'cpl-callout__head' }, '建议的第一步：做一次诊断测评'),
              dom.h(
                'div',
                { class: 'cpl-callout__body' },
                dom.h('p', {
                  text:
                    '24 道题全部是判据与预测型，不做名词默写。做完会生成技能清单画像，并据此重排学习路径：已掌握的快速略过，薄弱项优先补。',
                }),
                dom.h('p', {}, dom.h('a', { class: 'cpl-btn cpl-btn--primary', href: '#/assess', text: '开始诊断（约 8 分钟）→' }))
              )
            )
          )
        );
      }
    }

    main.append(pathSection, moduleSection, principles);
    void md;
  });

  function firstUnfinished(lessons) {
    for (const l of lessons) {
      if (CPL.progress.get(l.id).state !== 'done') return l.id;
    }
    return lessons.length ? lessons[0].id : '';
  }

  function statCard(label, value, hint) {
    return dom.h(
      'div',
      { class: 'cpl-stat' },
      dom.h('span', { class: 'cpl-stat__label', text: label }),
      dom.h('strong', { class: 'cpl-stat__value', text: value }),
      dom.h('span', { class: 'cpl-stat__hint', text: hint })
    );
  }

  function principleCard(title, body) {
    return dom.h(
      'div',
      { class: 'cpl-principle' },
      dom.h('h3', { class: 'cpl-principle__title', text: title }),
      dom.h('p', { class: 'cpl-principle__body', text: body })
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 快捷键帮助
  // ─────────────────────────────────────────────────────────────
  nav.showShortcuts = function showShortcuts() {
    if (document.getElementById('cpl-shortcuts')) return;
    const close = () => overlay.remove();
    const overlay = dom.h(
      'div',
      {
        class: 'cpl-modal',
        id: 'cpl-shortcuts',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': '键盘快捷键',
        onclick: (e) => {
          if (e.target === overlay) close();
        },
      },
      dom.h(
        'div',
        { class: 'cpl-modal__panel' },
        dom.h('h2', { class: 'cpl-modal__title', text: '键盘快捷键' }),
        dom.h(
          'dl',
          { class: 'cpl-keys' },
          [['/', '聚焦搜索'], ['g h', '回到首页'], ['g m', '我的内容'], ['g c', '卡片库'], ['g s', '设置'], ['?', '显示本帮助'], ['Esc', '关闭弹窗 / 抽屉']].flatMap(
            ([k, v]) => [dom.h('dt', {}, dom.h('kbd', { text: k })), dom.h('dd', { text: v })]
          )
        ),
        dom.h('button', { class: 'cpl-btn cpl-btn--primary', type: 'button', text: '知道了', onclick: close })
      )
    );
    document.body.append(overlay);
    const release = dom.trapFocus(overlay);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', onKey);
        release();
      }
    };
    document.addEventListener('keydown', onKey);
    const firstBtn = overlay.querySelector('button');
    if (firstBtn) firstBtn.focus();
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.isDrawerOpen()) nav.setDrawerOpen(false);
  });

  // 进度变化时刷新目录与进度条
  CPL.bus.on('progress:changed', () => {
    nav.renderProgress();
    nav.renderToc();
  });
  CPL.bus.on('catalog:changed', () => {
    nav.renderToc();
    nav.renderProgress();
  });
})();

/* ===== pieces/96-views.js ===== */
/* ============================================================================
 * 96-views.js — 卡片库、设置、关于（#/cards、#/settings、#/about）
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;

  function pageHead(title, lead, crumb) {
    return dom.h(
      'header',
      { class: 'cpl-lesson__head' },
      dom.h('p', { class: 'cpl-lesson__crumb' }, dom.h('a', { href: '#/home', text: '首页' }), ' / ' + (crumb || title)),
      dom.h('h1', { class: 'cpl-lesson__title', text: title }),
      lead ? dom.h('p', { class: 'cpl-lesson__subtitle', text: lead }) : null
    );
  }

  // ═════════════════════════════════════════════════════════════
  // #/cards — 卡片库
  // ═════════════════════════════════════════════════════════════
  CPL.nav.register('cards', async function renderCards(main, param) {
    main.append(
      pageHead(
        '卡片库与 Anki 导出',
        '把课程自带的卡片、你的错题、以及自定义内容的卡片集中导出。导出格式是 Anki 原生支持的 TSV / CSV，导入步骤见 README。',
        '卡片'
      )
    );

    // 先确保用到的课程内容已加载（卡片写在课程文件里）
    const metas = CPL.catalog.lessons();
    const needLoad = metas.slice(0, 60).map((m) => m.id);
    const loaded = await Promise.all(
      needLoad.map((id) => CPL.catalog.load(id).catch(() => null))
    );
    void loaded;

    const userLessons = await CPL.userContent.all();

    const allLessonCards = CPL.anki.collect({});
    const wrongCards = CPL.anki.collect({ source: 'wrong' });
    const userCards = CPL.anki.collectUserCards(userLessons);
    const all = [...allLessonCards, ...wrongCards, ...userCards];

    const stats = dom.h('div', { class: 'cpl-hero__stats' });
    stats.append(
      stat('课程卡片', String(allLessonCards.length)),
      stat('错题卡片', String(wrongCards.length)),
      stat('我的卡片', String(userCards.length)),
      stat('合计', String(all.length))
    );
    main.append(stats);

    const bar = dom.h('div', { class: 'cpl-lesson__actions' });
    bar.append(
      dom.h('button', { class: 'cpl-btn', type: 'button', text: '开始复习（全部）', disabled: !all.length, onclick: () => review(all, '全部卡片') }),
      dom.h('button', { class: 'cpl-btn', type: 'button', text: '只复习错题', disabled: !wrongCards.length, onclick: () => review(wrongCards, '错题重练') }),
      dom.h('button', { class: 'cpl-btn', type: 'button', text: '复习最不熟的', disabled: !all.length, onclick: () => review(CPL.anki.weakCards(all).slice(0, 30), '最不熟的卡片') })
    );
    main.append(bar);

    const exportBar = dom.h('div', { class: 'cpl-lesson__actions' });
    for (const fmt of [
      ['tsv', 'TSV（推荐，Anki 直接导入）'],
      ['csv', 'CSV（Excel 可编辑）'],
      ['md', 'Markdown（贴到任何地方）'],
      ['json', 'JSON（含完整元数据，可再导入）'],
    ]) {
      exportBar.append(
        dom.h('button', {
          class: fmt[0] === 'tsv' ? 'cpl-btn cpl-btn--primary' : 'cpl-btn',
          type: 'button',
          text: `导出全部为 ${fmt[1]}`,
          disabled: !all.length,
          onclick: () => CPL.anki.exportCards(all, fmt[0]),
        })
      );
    }
    main.append(exportBar);

    const reviewHost = dom.h('div', { class: 'cpl-review__mount' });
    main.append(reviewHost);

    let reviewer = null;
    function review(cards, label) {
      if (reviewer) reviewer.destroy();
      dom.clear(reviewHost);
      if (!cards.length) {
        reviewHost.append(dom.h('p', { class: 'cpl-muted', text: '这一叠没有卡片。' }));
        return;
      }
      reviewHost.append(dom.h('h2', { class: 'cpl-ls__title', text: `复习：${label}（${cards.length} 张）` }));
      reviewer = CPL.anki.mountReviewer(reviewHost, cards);
      reviewHost.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    CPL.nav._cleanup = () => reviewer && reviewer.destroy();

    // 按周分组浏览
    const groups = new Map();
    for (const c of all) {
      const key = c.week ? `第 ${String(c.week).padStart(2, '0')} 周` : '未分周';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(c);
    }

    const browse = dom.h('section', { class: 'cpl-ls' });
    browse.append(dom.h('h2', { class: 'cpl-ls__title', text: '按周浏览与导出' }));
    for (const [key, cards] of Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0], 'zh-CN'))) {
      const row = dom.h(
        'div',
        { class: 'cpl-cardrow' },
        dom.h('span', { class: 'cpl-cardrow__label', text: key }),
        dom.h('span', { class: 'cpl-cardrow__count', text: `${cards.length} 张` }),
        dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '复习', onclick: () => review(cards, key) }),
        dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '导出 TSV', onclick: () => CPL.anki.exportCards(cards, 'tsv') })
      );
      browse.append(row);
    }
    main.append(browse);

    const note = dom.h(
      'section',
      { class: 'cpl-card' },
      dom.h('h2', { class: 'cpl-card__title', text: '为什么没有 .apkg 文件' }),
      dom.h('p', {
        text:
          '.apkg 本质是一个内含 SQLite 数据库的 ZIP 包。在纯前端手写 SQLite 二进制格式很容易生成打不开的坏包，所以本平台选择导出 Anki 原生支持的文本格式：导入只要两步（文件 → 导入 → 选 TSV → 指定字段与标签列），比给你一个可能损坏的 .apkg 更可靠。',
      }),
      dom.h('p', { class: 'cpl-muted', text: '导入步骤写在 README 的「Anki 导入」一节，可直接照抄。' })
    );
    main.append(note);

    function stat(label, value) {
      return dom.h('div', { class: 'cpl-stat' }, dom.h('span', { class: 'cpl-stat__label', text: label }), dom.h('strong', { class: 'cpl-stat__value', text: value }));
    }
    void param;
  });

  // ═════════════════════════════════════════════════════════════
  // #/settings — 设置与数据管理
  // ═════════════════════════════════════════════════════════════
  CPL.nav.register('settings', async function renderSettings(main) {
    main.append(pageHead('设置与数据', '所有偏好与数据都只保存在你自己的浏览器里。这里也可以测试 AI 代理连通性、导出/导入/清空本地数据。', '设置'));

    const prefs = CPL.prefs.all();

    // ── 外观 ─────────────────────────────────────────────
    const appearance = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '外观' }));

    appearance.append(
      selectField('主题', ['auto', 'light', 'dark'], prefs.theme, (v) => {
        CPL.theme.set(v);
      }, { auto: '跟随系统', light: '浅色', dark: '深色' }),
      selectField('密度', ['comfortable', 'compact'], prefs.density, (v) => {
        CPL.prefs.set('density', v);
      }, { comfortable: '宽松', compact: '紧凑' }),
      rangeField('字号缩放', 0.85, 1.4, 0.05, prefs.fontScale, (v) => CPL.prefs.set('fontScale', v), (v) => `${Math.round(v * 100)}%`),
      checkField('减少动效（尊重系统的"减少动态效果"设置）', prefs.reducedMotion, (v) => CPL.prefs.set('reducedMotion', v)),
      checkField('允许按需从 CDN 加载可选依赖（Pyodide / KaTeX / CodeMirror）', prefs.enableCdn, (v) => {
        CPL.prefs.set('enableCdn', v);
        dom.toast(v ? '已允许 CDN 依赖，刷新后生效' : '已禁用 CDN 依赖。浏览器内 Python 执行将不可用，公式会退回原生 MathML 渲染。', { kind: 'info', ms: 6000 });
      }),
      checkField('打开课程后自动运行测试（会立刻消耗一次运行时加载）', prefs.autoRunTests, (v) => CPL.prefs.set('autoRunTests', v))
    );
    main.append(appearance);

    // ── AI 助教 ──────────────────────────────────────────
    const aiCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: 'AI 助教' }));
    const usage = CPL.store.scope('aiUsage');
    const today = new Date().toISOString().slice(0, 10);
    const todayUsage = usage.get(today, { count: 0 });

    aiCard.append(
      dom.h(
        'p',
        {},
        dom.h('strong', { text: '代理地址：' }),
        CPL.config.apiBase ? dom.h('code', { class: 'cpl-code-inline', text: CPL.config.apiBase }) : dom.h('span', { class: 'cpl-pill cpl-pill--warn', text: '未配置（离线模式）' })
      ),
      dom.h('p', { class: 'cpl-muted', text: `今日已用：${todayUsage.count} 次 · 前端软限流：每分钟 ${CPL.config.ai.softRatePerMin} 次（真正的限流在服务端）` }),
      dom.h('p', {
        class: 'cpl-muted',
        text:
          '安全说明：API 密钥只存在于 Serverless 环境变量里，前端代码与 GitHub 仓库中都没有密钥。代理会做 Origin 白名单、速率限制、输入长度限制，并统一错误返回（不泄露内部信息）。详见仓库根目录的 SECURITY.md。',
      })
    );

    if (!CPL.config.apiBase) {
      aiCard.append(
        dom.h(
          'div',
          { class: 'cpl-callout cpl-callout--note' },
          dom.h(
            'div',
            { class: 'cpl-callout__body' },
            dom.h('p', { text: '要让 AI 助教工作，需要两步：' }),
            dom.h(
              'ol',
              { class: 'cpl-list' },
              [
                dom.h('li', {}, dom.h('span', { text: '把仓库里的 api/chat.js 部署到 Vercel，并配置环境变量 AI_API_KEY、ALLOWED_ORIGINS。' })),
                dom.h('li', {}, dom.h('span', { text: '把 index.html 里的 apiBase 改成 https://<你的项目>.vercel.app/api/chat。' })),
              ]
            ),
            dom.h('p', { class: 'cpl-muted', text: '完整命令见 README「部署 AI 代理（Vercel）」。' })
          )
        )
      );
    } else {
      const testBtn = dom.h('button', { class: 'cpl-btn', type: 'button', text: '测试连通性' });
      const testOut = dom.h('div', { class: 'cpl-run-output' });
      testBtn.addEventListener('click', async () => {
        testBtn.disabled = true;
        dom.clear(testOut);
        testOut.append(dom.spinner('正在请求代理…'));
        const t0 = performance.now();
        const res = await CPL.ai.request(
          { action: 'chat', messages: [{ role: 'user', content: '连通性测试：请只回复两个字"收到"。' }], context: { lessonId: '', tags: ['connectivity-test'] } },
          { onDelta: () => {} }
        );
        testBtn.disabled = false;
        dom.clear(testOut);
        if (res.ok) {
          testOut.append(dom.h('p', { class: 'cpl-pill cpl-pill--ok', text: `连通正常（${util.seconds(performance.now() - t0)}）` }));
          if (res.text) testOut.append(dom.h('pre', { class: 'cpl-run-stdout', text: res.text.slice(0, 500) }));
        } else {
          testOut.append(
            dom.errorCard('连通失败', res.message || '未知错误', [
              `错误码：${res.code}${res.requestId ? ' · requestId: ' + res.requestId : ''}`,
              '检查 vercel 环境变量与 ALLOWED_ORIGINS 是否包含当前站点域名',
            ])
          );
        }
        return undefined;
      });
      aiCard.append(dom.h('div', { class: 'cpl-lesson__actions' }, testBtn), testOut);
    }
    main.append(aiCard);

    // ── 运行时 ───────────────────────────────────────────
    const rtCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '运行时能力与限制' }));
    const status = CPL.runtimes.pyStatus();
    rtCard.append(
      dom.h(
        'table',
        { class: 'cpl-table cpl-table--compact' },
        dom.h('thead', {}, dom.h('tr', {}, ['语言', '浏览器内执行', '说明'].map((h) => dom.h('th', { text: h })))),
        dom.h(
          'tbody',
          {},
          [
            ['Python', '完整可用', 'Pyodide 314.0.7（CPython 3.14.2 → WASM），支持 numpy / scipy / matplotlib，在 Worker 中运行并有超时保护。'],
            ['Fortran', '不可用（诚实说明）', 'LFortran 的 WASM 版本仍是 alpha，官方明确不保证第三方代码；GitHub Pages 也给不了它需要的跨源隔离头。本平台提供静态检查 + 本地运行命令 + 在线编译器链接。'],
            ['C / C++', '不可用（体积原因）', 'Clang→WASM 压缩后仍需约 20 MB 下载与本地解压，不适合作为默认路径。提供静态检查与本地运行命令。'],
          ].map((r) => dom.h('tr', {}, r.map((c) => dom.h('td', { text: c }))))
        )
      ),
      dom.h('p', { class: 'cpl-muted', text: `当前 Python 运行时状态：${status.ready ? '已就绪' : status.loading ? '加载中' : '未加载'}${status.error ? ' · 上次错误：' + status.error : ''}` })
    );
    rtCard.append(
      dom.h(
        'div',
        { class: 'cpl-lesson__actions' },
        dom.h('button', {
          class: 'cpl-btn',
          type: 'button',
          text: '预加载 Python 运行时',
          onclick: async (e) => {
            const btn = e.target;
            btn.disabled = true;
            btn.textContent = '加载中…';
            try {
              await CPL.runtimes.ensurePython((m) => {
                btn.textContent = m.length > 40 ? m.slice(0, 40) + '…' : m;
              });
              dom.toast('Python 运行时就绪', { kind: 'ok' });
              CPL.nav.render();
            } catch (err) {
              dom.toast(dom.friendlyError(err), { kind: 'error', ms: 8000 });
              btn.disabled = false;
              btn.textContent = '预加载 Python 运行时';
            }
          },
        }),
        dom.h('button', {
          class: 'cpl-btn cpl-btn--ghost',
          type: 'button',
          text: '重置运行时',
          onclick: () => {
            CPL.runtimes.resetPython();
            dom.toast('运行时已重置，下次运行会重新加载', { kind: 'info' });
          },
        })
      )
    );
    main.append(rtCard);

    // ── 数据管理 ─────────────────────────────────────────
    const dataCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '数据管理' }));
    const lessons = await CPL.userContent.all();
    const estimate = await CPL.store.idb.estimate();

    dataCard.append(
      dom.h('p', { class: 'cpl-muted', text: `自定义课程：${lessons.length} 个 · 偏好与进度：localStorage${estimate ? ` · 估算占用：${util.bytes(estimate.usage || 0)}` : ''}` }),
      dom.h(
        'div',
        { class: 'cpl-lesson__actions' },
        dom.h('button', {
          class: 'cpl-btn cpl-btn--primary',
          type: 'button',
          text: '导出全部本地数据（备份）',
          onclick: async () => {
            const payload = {
              prefs: CPL.prefs.all(),
              store: CPL.store.exportAll(),
              userLessons: lessons,
              ankiReviewed: CPL.anki.reviewed(),
              exportedAt: new Date().toISOString(),
            };
            dom.download(`cphys-cs-lab-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json');
            dom.toast('备份已下载', { kind: 'ok' });
          },
        }),
        dom.h('button', {
          class: 'cpl-btn',
          type: 'button',
          text: '从备份导入',
          onclick: async () => {
            try {
              const file = await dom.pickFile('.json,application/json');
              if (!file) return;
              const data = JSON.parse(file.text);
              let restored = 0;
              if (data.store && data.store.data) {
                const res = CPL.store.importAll(data.store);
                restored += res.written;
              }
              if (data.prefs) {
                for (const [k, v] of Object.entries(data.prefs)) CPL.prefs.set(k, v);
              }
              if (Array.isArray(data.userLessons)) {
                for (const l of data.userLessons) {
                  await CPL.userContent.save(l);
                  restored++;
                }
              }
              if (data.ankiReviewed) {
                const s = CPL.store.scope('anki');
                s.set('reviewed', data.ankiReviewed);
              }
              dom.toast(`已恢复 ${restored} 项数据，页面即将刷新`, { kind: 'ok' });
              setTimeout(() => location.reload(), 1200);
            } catch (err) {
              dom.toast(dom.friendlyError(err), { kind: 'error', ms: 8000 });
            }
          },
        }),
        dom.h('button', {
          class: 'cpl-btn cpl-btn--danger',
          type: 'button',
          text: '清空全部本地数据',
          onclick: async () => {
            if (!window.confirm('这会删除：学习进度、自检勾选、笔记、自定义课程、卡片复习记录、偏好设置。确定继续？')) return;
            if (!window.confirm('再确认一次：数据删除后无法恢复（除非你导出过备份）。')) return;
            const n = CPL.store.clearAll();
            try {
              if (CPL.store.idb.available()) {
                await CPL.store.idb.clear('userLessons');
                await CPL.store.idb.clear('anki');
                await CPL.store.idb.clear('drafts');
                await CPL.store.idb.clear('kv');
              }
            } catch (err) {
              CPL.log('warn', '清空 IndexedDB 失败', err);
            }
            dom.toast(`已清空 ${n} 项本地数据，页面即将刷新`, { kind: 'ok' });
            setTimeout(() => location.reload(), 1200);
          },
        })
      )
    );
    main.append(dataCard);

    // ── 诊断测评 ─────────────────────────────────────────
    const assessCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '诊断测评与掌握度' }));
    const history = CPL.assess.history();
    assessCard.append(
      dom.h('p', { class: 'cpl-muted', text: history.length ? `已做过 ${history.length} 次测评，最近一次：${new Date(history[history.length - 1].at).toLocaleString('zh-CN')}（${history[history.length - 1].percent}%）` : '还没有做过诊断测评。' }),
      dom.h(
        'div',
        { class: 'cpl-lesson__actions' },
        dom.h('a', { class: 'cpl-btn cpl-btn--primary', href: '#/assess', text: '去做诊断测评' }),
        dom.h('a', { class: 'cpl-btn', href: '#/assess/result', text: '查看技能画像与推荐路径' }),
        dom.h('button', {
          class: 'cpl-btn cpl-btn--danger',
          type: 'button',
          text: '重置测评与掌握度',
          onclick: () => {
            if (!window.confirm('重置后掌握度画像会清空（课程进度不受影响）。继续？')) return;
            CPL.assess.reset();
            dom.toast('已重置', { kind: 'ok' });
            CPL.nav.render();
          },
        })
      )
    );
    main.append(assessCard);

    // ── 关于本页的日志 ───────────────────────────────────
    const logCard = dom.h('section', { class: 'cpl-card' }, dom.h('h2', { class: 'cpl-card__title', text: '诊断日志' }));
    logCard.append(
      dom.h('p', { class: 'cpl-muted', text: '这些日志只存在内存里，不会发送到任何服务器。遇到问题时可以复制出来自查。' }),
      dom.h('button', {
        class: 'cpl-btn cpl-btn--sm',
        type: 'button',
        text: '复制最近日志',
        onclick: async () => {
          const text = CPL.logHistory()
            .map((e) => `${new Date(e.t).toISOString()} [${e.level}] ${e.args.map((a) => (typeof a === 'string' ? a : dom.friendlyError(a))).join(' ')}`)
            .join('\n');
          const ok = await dom.copyToClipboard(text || '（无日志）');
          dom.toast(ok ? '日志已复制' : '复制失败', { kind: ok ? 'ok' : 'warn' });
        },
      })
    );
    main.append(logCard);

    // ── 小工具 ───────────────────────────────────────────
    function selectField(label, values, current, onChange, labels = {}) {
      const sel = dom.h('select', { class: 'cpl-select', 'aria-label': label });
      for (const v of values) sel.append(dom.h('option', { value: v, text: labels[v] || v, selected: v === current }));
      sel.addEventListener('change', () => onChange(sel.value));
      return dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: label }), sel);
    }

    function rangeField(label, min, max, step, current, onChange, fmt) {
      const out = dom.h('output', { class: 'cpl-ctl__value', text: fmt(current) });
      const input = dom.h('input', {
        type: 'range',
        class: 'cpl-ctl__range',
        min: String(min),
        max: String(max),
        step: String(step),
        value: String(current),
        'aria-label': label,
        oninput: (e) => {
          const v = Number(e.target.value);
          out.textContent = fmt(v);
          onChange(v);
        },
      });
      return dom.h('div', { class: 'cpl-field' }, dom.h('label', { class: 'cpl-ctl' }, dom.h('span', { class: 'cpl-ctl__label', text: label }), input, out));
    }

    function checkField(label, checked, onChange) {
      const input = dom.h('input', { type: 'checkbox', checked, onchange: (e) => onChange(e.target.checked) });
      return dom.h('label', { class: 'cpl-check cpl-field' }, input, dom.h('span', { text: label }));
    }
  });

  // ═════════════════════════════════════════════════════════════
  // #/about — 关于与许可
  // ═════════════════════════════════════════════════════════════
  CPL.nav.register('about', function renderAbout(main) {
    main.append(pageHead('关于本平台', '一个纯静态的互动学习站点：没有后端、没有数据库、没有备案、没有追踪。', '关于'));

    const wrap = dom.h('div', { class: 'cpl-about' });

    wrap.append(
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '它是什么' }),
        dom.h('p', {
          text:
            '面向计算物理与计算机科学的知识学习平台，27 周、7 大模块。每节课包含学习目标、核心概念、工具速查、交互式 demo、代码练习（浏览器内运行）、自动测试、AI 引导式助教与 Anki 卡片。',
        }),
        dom.h('p', { class: 'cpl-muted', text: '平台只介绍知识，不涉及面试、简历、就业等私人事务。' })
      ),
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '三条判断准则' }),
        dom.h('ul', { class: 'cpl-list' }, [
          dom.h('li', {}, dom.h('strong', { text: '概念性知识必须内化' }), dom.h('span', { text: '：复杂度、内存模型、数值误差、稳定性、收敛阶、并行范式、边界条件、调试方法。判据是"能自己推回来"。' })),
          dom.h('li', {}, dom.h('strong', { text: '工具性细节知道存在、会查即可' }), dom.h('span', { text: '：API、语法、库函数、编译参数。判据是"30 秒能查到"。' })),
          dom.h('li', {}, dom.h('strong', { text: '忘记不是归零，是存档' }), dom.h('span', { text: '：项目锚点 + 代码库 + Anki + 费曼输出。' })),
        ])
      ),
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '隐私与数据' }),
        dom.h('ul', { class: 'cpl-list' }, [
          dom.h('li', { text: '没有账号系统，不收集任何个人信息（姓名、邮箱、学校都不需要）。' }),
          dom.h('li', { text: '学习进度、笔记、自定义课程、卡片复习记录全部保存在你自己的浏览器里。' }),
          dom.h('li', { text: '使用 AI 助教时，只会发送"当前课程 id + 你的提问 + 你主动贴出的代码"，以及技能掌握等级。' }),
          dom.h('li', { text: '没有第三方分析脚本、没有埋点、没有广告。' }),
        ])
      ),
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '技术栈与依赖' }),
        dom.h('ul', { class: 'cpl-list' }, [
          dom.h('li', { text: '前端：原生 HTML/CSS/JavaScript，由零依赖构建脚本拼成三个文件（index.html + app.js + app.css）。课程内容按需加载，加课不用重新构建。' }),
          dom.h('li', { text: 'Python 执行：Pyodide 314.0.7（CPython 3.14.2 → WebAssembly），在 Web Worker 中运行。首次约 13.5 MB，之后走浏览器缓存。' }),
          dom.h('li', { text: '公式：默认用浏览器原生 MathML（零依赖、可离线）；开启 CDN 后自动切换到 KaTeX 0.19.0（带 SRI 校验）。' }),
          dom.h('li', { text: '编辑器：CodeMirror 6（从 CDN 按需加载，允许离线退化到纯文本框）。' }),
          dom.h('li', { text: '托管：GitHub Pages（静态）。AI 代理：Vercel Serverless Functions（密钥只在服务端环境变量里）。' }),
        ])
      ),
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '诚实声明：什么在浏览器里跑不了' }),
        dom.h('p', {
          text:
            'Fortran 与 C/C++ 的浏览器内执行在本平台上不可用，这是经过核实的结论而不是偷懒：LFortran 的 WASM 版本仍处于 alpha，官方明确说明不保证第三方代码；Clang→WASM 需要约 20 MB 的下载与本地解压。与其给出一个"点了没反应"的按钮，这里选择提供静态检查、语法陷阱提示、参考实现、可一键复制的本地运行命令，以及官方在线编译器的链接。',
        }),
        dom.h('p', { class: 'cpl-muted', text: 'Python 与 NumPy 在浏览器内是完整可用的，练习与自动测试都真实执行。' })
      ),
      dom.h(
        'section',
        { class: 'cpl-card' },
        dom.h('h2', { class: 'cpl-card__title', text: '验收标准' }),
        dom.h(
          'ul',
          { class: 'cpl-list' },
          [
            '无备案、无自建服务器：全站静态 + Serverless 代理',
            'API 密钥不出现在前端代码、仓库、日志中的任何位置',
            '每节课都有交互式练习与自动测试（由大纲完整性测试保证）',
            'Fortran 模块（5–7 周）与 CS 核心模块（11–19 周）内容完整',
            '用户可添加自定义学习内容，支持 JSON 导入导出往返一致',
            '移动端可用（单栏 + 抽屉导航，触控目标 ≥ 44px）',
            '代码可复现：npm run build && npm test 全绿',
          ].map((t) => dom.h('li', { text: t }))
        )
      )
    );

    if (CPL.config.repoUrl) {
      wrap.append(
        dom.h('p', {}, dom.h('a', { class: 'cpl-btn', href: dom.safeUrl(CPL.config.repoUrl), target: '_blank', rel: 'noopener noreferrer', text: '在 GitHub 上查看源码' }))
      );
    }
    wrap.append(dom.h('p', { class: 'cpl-muted', text: `构建版本：${CPL.VERSION} · 内容清单 schema ${CPL.SCHEMA}` }));

    main.append(wrap);
  });
})();

/* ===== pieces/99-main.js ===== */
/* ============================================================================
 * 99-main.js — 启动
 *
 * 启动顺序（每一步失败都不允许白屏）：
 *   1. 建外壳       → 浏览者立刻看到结构与"正在读取课程清单"
 *   2. 读目录       → manifest.json / syllabus.json（失败退化到内嵌快照）
 *   3. 渲染导航     → 侧边目录 + 进度环
 *   4. 解析路由     → 按 hash 渲染视图
 *   5. 后台预热     → KaTeX（若允许 CDN）、相邻课程预取
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;

  // ─────────────────────────────────────────────────────────────
  // 网站根路径：支持 GitHub Pages 子路径（/repo-name/）
  // index.html 里写的是相对路径，所以这里只需要给"内容目录"算基准。
  // ─────────────────────────────────────────────────────────────
  function siteBase() {
    const path = location.pathname;
    if (path.endsWith('/')) return path;
    const last = path.split('/').pop() || '';
    if (last.includes('.')) return path.slice(0, path.length - last.length);
    return path + '/';
  }
  CPL.siteBase = siteBase();

  /** 把相对路径解析为可 fetch/可加载的绝对 URL（保留 query）。 */
  CPL.resolve = function resolve(rel) {
    try {
      return new URL(rel, new URL(CPL.siteBase, location.href)).href;
    } catch {
      return rel;
    }
  };

  async function boot() {
    await dom.ready();
    CPL.guard('build-shell', () => CPL.nav.buildShell(document.body));

    // 目录初始化：失败也要能进首页
    try {
      await CPL.catalog.init();
    } catch (err) {
      CPL.log('error', '目录初始化失败', err);
      dom.toast('课程清单读取失败，导航可能不完整', { kind: 'error' });
    }

    // 用户自定义内容：必须在目录就绪之后、渲染导航之前完成注册，
    // 这样自定义课程会自动出现在侧边栏与首页课程地图里。
    if (CPL.userContent && typeof CPL.userContent.init === 'function') {
      try {
        await CPL.userContent.init();
      } catch (err) {
        CPL.log('warn', '用户自定义内容初始化失败', dom.friendlyError(err));
      }
    }

    CPL.guard('toc', () => CPL.nav.renderToc());
    CPL.guard('progress', () => CPL.nav.renderProgress());
    CPL.guard('route', () => CPL.nav.render());

    CPL.ready = true;
    document.documentElement.dataset.cplReady = '1';
    CPL.bus.emit('app:mounted');

    // 首次使用：按 CIU 式清单流程引导（诊断测评 → 技能画像 → 学习路径）
    CPL.guard('onboarding', () => maybeOnboard());

    // 后台预热（不阻塞首屏）
    CPL.guard('warmup', () => {
      if (CPL.config.allowCdn && CPL.prefs.get('enableCdn')) CPL.math.warmKatex();
      const route = CPL.nav.parseHash();
      const lessons = CPL.catalog.lessons();
      const idx = lessons.findIndex((l) => l.id === route.param);
      if (idx >= 0) {
        const neighbors = [lessons[idx - 1], lessons[idx + 1]].filter(Boolean).map((l) => l.id);
        CPL.catalog.prefetch(neighbors);
      } else if (lessons.length) {
        CPL.catalog.prefetch([lessons[0].id]);
      }
    });

    if (route_unknown()) {
      dom.toast('找不到该页面，已回到首页', { kind: 'warn' });
    }
    return undefined;
  }

  function route_unknown() {
    return Boolean(CPL.nav.parseHash().unknown);
  }

  // ─────────────────────────────────────────────────────────────
  // 首次使用引导
  //
  // 只在「第一次进入且没有任何进度」时出现一次，之后永久记住。
  // 三个出口都是有效路径：做诊断 / 直接按周次学 / 先随便看看。
  // ─────────────────────────────────────────────────────────────
  function maybeOnboard() {
    if (CPL.prefs.get('onboarded')) return;
    const route = CPL.nav.parseHash();
    // 从课程页直接进来的（比如分享链接）就不要弹了
    if (route.name !== 'home') {
      CPL.prefs.set('onboarded', true);
      return;
    }
    const lessons = CPL.catalog.lessons();
    const summary = CPL.progress.summary(lessons);
    if (summary.done || summary.doing) {
      CPL.prefs.set('onboarded', true);
      return;
    }

    let overlay = null;
    let release = () => {};

    function dismiss() {
      CPL.prefs.set('onboarded', true);
      if (overlay) overlay.remove();
      document.removeEventListener('keydown', onKey);
      release();
    }

    function onKey(e) {
      if (e.key === 'Escape') dismiss();
    }

    overlay = dom.h(
      'div',
      {
        class: 'cpl-modal',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'cpl-welcome-title',
        onclick: (e) => {
          if (e.target === overlay) dismiss();
        },
      },
      dom.h(
        'div',
        { class: 'cpl-modal__panel cpl-welcome' },
        dom.h('h2', { class: 'cpl-modal__title', id: 'cpl-welcome-title', text: '欢迎。这里不教面试，只谈知识与代码。' }),
        dom.h('p', {
          text:
            '平台的判断准则只有三条：概念性知识必须内化（能自己推回来）；工具性细节知道存在、会查即可；忘记不是归零，是存档。',
        }),
        dom.h(
          'div',
          { class: 'cpl-welcome__steps' },
          welcomeStep(1, '先做诊断测评（推荐）', '24 道判据与预测题，约 8 分钟。做完生成技能清单画像，据此跳过已掌握的、优先补薄弱的。'),
          welcomeStep(2, '或者直接按周次顺序学', `从第 1 周的概念内化开始，共 ${lessons.length} 课，每课都有交互 demo、代码练习和自动测试。`),
          welcomeStep(3, '随时可以写自己的内容', '「我的内容」里可以建卡片与课程，数据存在你自己的浏览器里，可导出为 JSON 备份。')
        ),
        dom.h(
          'div',
          { class: 'cpl-assess__actions' },
          dom.h('button', {
            class: 'cpl-btn cpl-btn--primary',
            type: 'button',
            text: '第一步：开始诊断测评 →',
            onclick: () => {
              CPL.prefs.set('onboarded', true);
              overlay.remove();
              document.removeEventListener('keydown', onKey);
              release();
              if (CPL.assess) {
                CPL.assess.start();
                CPL.nav.go('assess-quiz');
              } else {
                CPL.nav.go('assess');
              }
            },
          }),
          dom.h('button', {
            class: 'cpl-btn',
            type: 'button',
            text: '跳过，按周次顺序学',
            onclick: () => {
              const first = lessons[0];
              dismiss();
              if (first) CPL.nav.go('lesson', first.id);
            },
          }),
          dom.h('button', { class: 'cpl-btn cpl-btn--ghost', type: 'button', text: '先看看课程地图', onclick: dismiss })
        )
      )
    );

    document.body.append(overlay);
    release = dom.trapFocus(overlay);
    document.addEventListener('keydown', onKey);
    const firstBtn = overlay.querySelector('button');
    if (firstBtn) firstBtn.focus();
  }

  function welcomeStep(num, title, body) {
    return dom.h(
      'div',
      { class: 'cpl-welcome__step' },
      dom.h('span', { class: 'cpl-path__num', text: String(num) }),
      dom.h('div', {}, dom.h('strong', { text: title }), dom.h('span', { text: body }))
    );
  }

  // 兜底视图：任何未注册的路由都回到首页，而不是空白
  for (const name of ['mine', 'cards', 'settings', 'about']) {
    if (!CPL.nav.views[name]) {
      CPL.nav.register(name, (main) => {
        main.append(
          dom.errorCard('这个页面还没加载出来', `视图 "${name}" 未注册（可能是某个分片没有成功加载）。`, [
            '刷新页面重试',
            '检查浏览器控制台的加载错误',
          ])
        );
      });
    }
  }

  CPL.boot = boot;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CPL.guard('boot', boot), { once: true });
  } else {
    CPL.guard('boot', boot);
  }
})();
