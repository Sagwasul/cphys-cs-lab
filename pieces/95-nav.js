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
