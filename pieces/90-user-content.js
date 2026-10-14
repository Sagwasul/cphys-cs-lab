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
