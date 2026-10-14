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
