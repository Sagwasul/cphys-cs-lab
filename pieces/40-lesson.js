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
