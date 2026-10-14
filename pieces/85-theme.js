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
