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
