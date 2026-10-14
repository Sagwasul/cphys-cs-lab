// scripts/lib/manifest.mjs
//
// 生成内容清单（manifest.json）。
//
// 为什么需要它：
//   1. 浏览器需要一份"有哪些课、文件在哪"的索引才能按需加载课程脚本；
//   2. 每课带一个内容指纹，用于缓存失效与"内容是否被改过"的自检；
//   3. tests/ 用它做大纲完整性校验（哪一课缺 demo / 缺测试）。
//
// 本文件刻意不 import 任何 Node 专有模块，因此浏览器与 Node 都能用。

/**
 * 一份课程文件里必须声明的元数据（用轻量契约标记写在自己文件里）：
 *
 *   //__CPL_META__ {"id":"lab-01-complexity-memory","module":1,"week":1,"title":"复杂度与内存模型","tags":["big-O"]}
 *
 * 这样解析无需执行课程代码（不 eval、不 import），构建与测试都安全。
 */

const META_RE = /^\s*\/\/__CPL_META__\s*(\{.*\})\s*$/m;

/** FNV-1a 32-bit：零依赖、跨环境一致，用于内容指纹。 */
export function fingerprint(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export function parseMeta(source) {
  const m = META_RE.exec(source);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

/** 课程文件必须满足的最低契约；缺项会被 tests/ 拦下。 */
export function validateLessonSource(source, relPath) {
  const problems = [];
  const meta = parseMeta(source);
  if (!meta) {
    problems.push(`${relPath}: 缺少 //__CPL_META__ {...} 元数据行`);
    return { meta: null, problems };
  }
  for (const key of ['id', 'module', 'week', 'title']) {
    if (meta[key] === undefined || meta[key] === '') {
      problems.push(`${relPath}: 元数据缺少 "${key}"`);
    }
  }
  if (typeof meta.week === 'number' && (meta.week < 1 || meta.week > 99)) {
    // 99 是约定的"不占用正式周次"，排在课表末尾（用户自定义内容常用）
    problems.push(`${relPath}: week=${meta.week} 超出 1..99`);
  }
  // 课程文件在被 <script> 标签加载时会成为非模块脚本，
  // 因此绝不允许出现 ESM 语法（否则浏览器直接抛 SyntaxError）。
  if (/^\s*export\s+(default|const|function|class|\{)/m.test(source)) {
    problems.push(`${relPath}: 含 ESM "export" 语法，课程文件必须用 CPL.registerLesson({...}) 自注册`);
  }
  if (/^\s*import\s+[^\n]*from\s+['"]/m.test(source)) {
    problems.push(`${relPath}: 含 ESM "import ... from" 语法，课程文件必须自包含`);
  }
  if (!/CPL\.registerLesson\s*\(/.test(source)) {
    problems.push(`${relPath}: 未调用 CPL.registerLesson(...)`);
  }
  return { meta, problems };
}

/** 目录名 → 模块归属，用于在缺 manifest 时兜底。 */
export const FOLDER_MODULE = {
  labs: 1,
  fortran: 3,
  projects: 4,
  'cs-core': 5,
  meta: 0,
  user: 7,
};

/**
 * @param {{readFile:(p:string)=>string, listDir:(dir:string)=>string[]}} io
 * @param {string} contentRoot  例如 "content"
 * @returns {{lessons:Array, modules:Array, generatedAt:string, count:number}}
 */
export function buildManifest(io, contentRoot = 'content') {
  const lessons = [];
  const problems = [];

  for (const folder of Object.keys(FOLDER_MODULE)) {
    let files = [];
    try {
      files = io.listDir(`${contentRoot}/${folder}`);
    } catch {
      continue;
    }
    for (const name of files) {
      if (!name.endsWith('.js')) continue;
      if (name.startsWith('_')) continue; // _template.js 等内部文件不发布
      const rel = `${contentRoot}/${folder}/${name}`;
      const source = io.readFile(rel);
      const { meta, problems: p } = validateLessonSource(source, rel);
      problems.push(...p);
      if (!meta) continue;
      lessons.push({
        id: meta.id,
        module: meta.module ?? FOLDER_MODULE[folder],
        week: meta.week,
        title: meta.title,
        subtitle: meta.subtitle || '',
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        folder,
        file: rel,
        fingerprint: fingerprint(source),
        bytes: source.length,
      });
    }
  }

  lessons.sort((a, b) => a.week - b.week || String(a.id).localeCompare(String(b.id)));

  const dupes = lessons.map((l) => l.id).filter((id, i, arr) => arr.indexOf(id) !== i);
  if (dupes.length) problems.push(`重复的课程 id: ${[...new Set(dupes)].join(', ')}`);

  return {
    manifest: {
      schema: 1,
      generatedAt: new Date().toISOString(),
      count: lessons.length,
      lessons,
    },
    problems,
  };
}
