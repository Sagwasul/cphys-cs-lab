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
