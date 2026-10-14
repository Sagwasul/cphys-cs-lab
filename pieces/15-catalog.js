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

      const cleanup = () => {
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
