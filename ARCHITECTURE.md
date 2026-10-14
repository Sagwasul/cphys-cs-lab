# 架构与设计决策

本文档解释**为什么这样写**，以及每个看似奇怪的设计背后避开了什么坑。
如果你要改这块代码，先读这里能省不少时间。

---

## 1. 产物与源码的分层

```
pieces/*.js  +  pieces/*.css          （源码分片，人工维护）
        │
        │  scripts/build.mjs  （零依赖，只用 Node 内置模块）
        ▼
index.html + app.js + app.css + manifest.json   （构建产物，已提交，可直接发布）
        ▲
        │  浏览器运行时按需加载（不参与构建）
        │
   content/**/*.js                     （课程内容，加课不用重新构建）
```

**为什么课程内容不参与构建？**

加一节课只应该新增一个文件，而不是"重新构建整个站点"——后者会让课堂上的增量修改变成一次构建 + 部署循环。
因此课程文件是**自注册的经典脚本**，浏览器在打开某课时用 `<script src>` 动态加载它：

```js
// content/cs-core/week-11-*.js
(function () {
  'use strict';
  CPL.registerLesson({ id: 'week-11-...', /* ... */ });
})();
```

**为什么用经典脚本而不是 ES 模块？**

- 经典脚本的 `<script async=false>` 语义保证按插入顺序执行，不需要维护依赖图；
- 可以在 `file://` 下加载（虽然 `manifest.json` 仍需 HTTP，见下文）；
- **最重要**：课程文件因此只能是**数据**，不能有 `import` / `export` / 逻辑入口。
  这让"审阅别人提交的课程内容"变成看内容对不对，而不是审代码。
  构建脚本与测试都会强制这一条。

**为什么不内联进 `app.js`？**

参考项目 [Schuture/ai-systems-playground](https://github.com/Schuture/ai-systems-playground) 是把所有 labs 拼进单个 33 万字节的 `app.js`。
本项目不这么做：课程总数会持续增长，全部内联会让**每次打开首页都下载所有课程正文**。
按需加载后，首页只需要 `app.js`（约 450 KB）+ `manifest.json`（几 KB）。

---

## 2. 分片加载顺序：一个必须理解的约束

分片按**文件名排序**拼接，因此文件名前缀就是加载顺序：

```
07-manifest.snapshot.js   ← 构建期生成的目录快照（必须最先，只写全局变量）
07-syllabus.snapshot.js   ← 大纲快照
00-core.js                ← 命名空间、配置、事件总线、工具函数
05-dom.js                 ← DOM 构造与转义工具
10-store.js               ← 持久化
15-catalog.js             ← 课程注册表与按需加载
20-markdown.js            ← Markdown 渲染
25-math.js                ← LaTeX → MathML
30-mastery.js             ← 掌握度引擎
35-assessment.js          ← 诊断测评（调用 CPL.nav.register）
40-lesson.js              ← 课程页（调用 CPL.nav.register）
50-tests.js               ← 测试运行器
55-highlight.js           ← 语法高亮
60-runtimes.js            ← Pyodide Worker + 静态检查
62-editor.js              ← CodeMirror
65-anki.js                ← 卡片
70-ai.js                  ← AI 助理
80-plot.js                ← 绘图
82-demos.js / 83-demos-cs.js  ← 交互 demo 注册
85-theme.js               ← 主题
90-user-content.js        ← 自定义内容（调用 CPL.nav.register）
95-nav.js                 ← 外壳与路由
96-views.js               ← 卡片库/设置/关于
99-main.js                ← 启动（必须最后）
```

### 坑 1：视图分片比 `95-nav.js` 先加载

`35-assessment.js` / `40-lesson.js` / `90-user-content.js` 在加载期就要调用 `CPL.nav.register(...)`，
但 `CPL.nav` 是在 `95-nav.js` 里创建的。

**解法**：`00-core.js` 里先建立一个**最小占位**（`views` 对象 + `register` + `go`），
`95-nav.js` 再接管真实实现，并且**不重新赋值 `nav.views`**（否则会丢掉已注册的视图）：

```js
// 95-nav.js
const views = (nav.views = nav.views || {});   // 不能写成 = {}
```

### 坑 2：跨分片的惰性引用

`20-markdown.js` 排在 `25-math.js` 与 `55-highlight.js` **之前**。如果写成：

```js
const math = CPL.math;   // ❌ 此时是 undefined，永远都是 undefined
```

那么所有公式渲染都会抛 `Cannot read properties of undefined`。必须惰性取值：

```js
const mathOf = () => CPL.math;      // ✅ 调用时才读
```

这个 bug 真的发生过，并且被 `tests/core/02-markdown.test.mjs` 抓到了。
**规则：分片之间只能通过 `CPL.xxx` 在运行时取值，不要在加载期缓存成常量。**

### 坑 3：构建期生成的快照文件

`pieces/07-manifest.snapshot.js` 与 `pieces/07-syllabus.snapshot.js` 由构建脚本**覆盖写入**（见 `.gitignore`）。
它们让 `fetch('manifest.json')` 失败时导航仍能渲染（例如 `file://` 直开、离线发行版、CDN 抖动）。

---

## 3. 安全设计

### 3.1 渲染层：自研 Markdown 渲染器

引入 `marked` / `markdown-it` 会带来"默认直通 HTML"的面。这里从设计上**不产生未转义输出**：

| 位置 | 规则 |
| --- | --- |
| 文本 | `dom.esc` 转义 `& < > " '` |
| 属性 | `dom.escAttr` 额外编码控制字符 |
| URL | `dom.safeUrl` 拦 `javascript:` / `vbscript:` / `file:`；`data:` 只放行 `data:image/*;base64,` |
| 代码块语言名 | 过滤为 `[\w+#.-]` |
| 外链 | 加 `target="_blank" rel="noopener noreferrer external"` |
| 数学 | 默认自研 MathML（全转义）；KaTeX 路径显式 `trust: false` 并带 SRI |

### 3.2 执行层：Worker + 硬超时

Python 在 `Worker` 里运行（无 DOM），12 秒硬超时后 `terminate()` 并**重建干净实例**（不是复用被污染的那个）。

**诚实说明**：Worker 内的 API 屏蔽（`subprocess` / `socket` / `os.system` / 文件写）是"防误用"，
**不是安全沙箱**——Pyodide 有 `js` 桥。真正的边界是 Worker + 超时 + 不执行不可信第三方代码。
见 `SECURITY.md` 第 7 节。

### 3.3 代理层：服务端权威

`api/chat.js` 的所有限制都在服务端重新执行一遍（客户端可以改自己的 JS）。
关键点是**客户端传的 `system` 消息一律丢弃**，system 提示词由服务端注入：

```js
if (m.role !== 'user' && m.role !== 'assistant') continue;   // 丢弃 system
```

`max_tokens` / `temperature` / `model` 也全部由服务端决定——否则调用方可以指定一个超贵的模型。

---

## 4. 课程数据契约（8 段式）

`tests/content/01-integrity.test.mjs` 逐课强制以下结构。
**为什么要用测试强制而不是靠自觉？** 因为"每节课都有交互练习与自动测试"是本项目的验收标准之一，
只有机器检查才算真的保证。

| 字段 | 要求 | 强制方式 |
| --- | --- | --- |
| `//__CPL_META__` | 必须在**文件第一行** | 构建期正则 + 测试 |
| `objectives` | ≥1，可检验动词 | 构建期契约 |
| `concepts` / `sections` | ≥1 | 两者至少有一个 |
| `demo` / `sections` | `demo.kind` 必须在 `CPL.demos` 里注册过 | 测试（防拼错） |
| `exercise` / `sections` | 有 starter 与 solution 且不同 | 测试 |
| `tests` | ≥1；python 类型**必须真含 `assert`** | 测试 |
| 计时断言 | 必须是**比值**，不能是绝对耗时 | 测试（否则换机器就失败） |
| `aiPrompts` | ≥1，且**每条以 `？` 结尾** | 测试（保证是引导式提问） |
| `anki` | ≥1，正反面非空 | 测试 |
| `reading` | ≥1，URL 必须 http(s) | 测试 |
| `checklist` | ≥1 | 测试 |
| 禁止构造 | 无 `import` / `export` / `eval` / `new Function` / `document.write` | 构建期 + 测试（会先剥注释和字符串再扫） |
| 体积 | ≤ 200 KB | 测试 |

### 测试运行时的设计细节

Python 测试的 `assert` 字符串会被拼成这样执行：

```python
import io as _cpl_io, traceback as _cpl_tb
_cpl_user = "<用户代码的 JSON 转义>"
_cpl_test = "<断言代码的 JSON 转义>"
_cpl_ns = {}
try:
    exec(compile(_cpl_user, "<你的代码>", "exec"), _cpl_ns)
    exec(compile(_cpl_test, "<测试>", "exec"), _cpl_ns)
except AssertionError as _cpl_e:
    print("__CPL_FAIL__" + str(_cpl_e)[:600])
except BaseException as _cpl_e:
    print("__CPL_FAIL__" + type(_cpl_e).__name__ + ": " + str(_cpl_e))
```

因此**断言代码是自包含的**（不能依赖外部变量、不能用 `global`），
但它可以调用用户代码里定义的函数——这正是我们需要的。

外层再由 `buildRunCode()` 包一层 stdout/stderr 捕获。**空行不能加缩进**：
多行字符串里会多出尾随空格，而空行加缩进本身在 Python 里就是 `IndentationError`。

---

## 5. 前端侧的三个"诚实降级"

这块的设计原则是：**不假装能力存在**。

| 场景 | 行为 |
| --- | --- |
| 未配 `apiBase` | AI 助教显示"离线模式"并给出课程自带的引导问题，**不白屏、不静默失败** |
| 浏览器不支持 Fortran/C++ 执行 | 明确说明原因 + 静态检查 + 本地运行命令 + 官方在线编译器链接，**不给假按钮** |
| 禁用第三方 CDN | 公式退回原生 MathML、编辑器退回纯文本框、Python 执行不可用，**其余功能完整** |
| IndexedDB 被阻止（Safari 跨源 iframe） | 检测**真实的 open 异常**（不只是 `typeof`），退化为 localStorage，并在「我的内容」页面显示警告横幅 |
| `manifest.json` 拉取失败 | 用构建期内嵌快照渲染导航，课程正文等网络恢复 |

---

## 6. 已知取舍（为什么不做某些事）

| 没做的事 | 原因 |
| --- | --- |
| 引入 Vite / 打包器 | 零依赖是硬约束，`scripts/build.mjs` 拼接已经够用；引入打包器会让"加一节课"变成构建流程问题 |
| 用 React / Vue | 页面结构简单（外壳 + 视图切换），原生 DOM 足够；框架会让产物体积翻几倍 |
| 引入第三方 Markdown 库 | 默认 HTML 直通是 XSS 面；自研渲染器从设计上不产生未转义输出 |
| 生成 `.apkg` | 纯前端手写 SQLite 二进制容易产出打不开的坏包；Anki 原生支持 TSV 导入，两步完成 |
| 浏览器内跑 Fortran / C++ | 见 README「运行时能力与限制」 |
| 用 IndexedDB 存全部状态 | 进度/偏好是小对象，`localStorage` 同步读写更简单；只有大对象（自定义课程）走 IndexedDB |
| 把 CSP 作为主要 XSS 防线 | `script-src` 必须允许 `'unsafe-inline'`（课程内容是运行时注入的经典脚本），且 GitHub Pages 无法自定义响应头。因此主要防线在渲染层转义 |

---

## 7. 如果你要扩展

| 想做的事 | 改哪里 |
| --- | --- |
| 加一节新课程 | `content/<folder>/<name>.js`，照 `content/labs/_template.js`。`npm run build && npm test` |
| 加一种交互 demo | `pieces/82-demos.js` 或 `pieces/83-demos-cs.js` 里 `CPL.demos.register('kind', fn)` |
| 加一个技能到清单 | `pieces/30-mastery.js` 的 `SKILLS` 数组；记得在 `pieces/35-assessment.js` 里加对应题目（测试会检查覆盖度） |
| 换 AI 提供方 | 只需改环境变量（`AI_PROVIDER` / `AI_BASE_URL` / `AI_MODEL`），代码不用动 |
| 换执行引擎 | 实现 `CPL.runtimes.runPython(code, opts)` 的返回契约（`{ok, stdout, stderr, ms, message}`）即可 |
| 加页面 | 在任意分片里 `CPL.nav.register('name', (main, param) => {...})`，并把 `name` 加进 `95-nav.js` 的 `ROUTES` |
| 加样式 | 新建 `pieces/XX-*.css`（文件名决定拼接顺序） |
