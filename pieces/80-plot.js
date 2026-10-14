/* ============================================================================
 * 80-plot.js — 零依赖 Canvas 绘图：折线 / 散点 / log-log / 热力图 / 柱状
 *
 * 为什么自己写：
 *   课程里到处要"画一张 log-log 图看斜率"，引入 Plotly/Chart.js 会破坏
 *   "无依赖 + 可离线" 的约束，而且体积远大于需要的功能。
 * 支持：
 *   · 线性与对数坐标（x/y 各自独立）
 *   · 网格 + 1-2-5 刻度 + 对数刻度自动取 10 的幂
 *   · 多序列折线/散点、标注文本、参考斜率线
 *   · log-log 自动拟合斜率（用 CPL.util.slope，输出到图注）
 *   · 悬停读书：鼠标靠近时显示最近数据点
 *   · 高 DPI、窗口尺寸变化自动重绘
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const util = CPL.util;

  const plot = (CPL.plot = {});

  const PALETTE = ['#3b5bdb', '#e8590c', '#0ca678', '#ae3ec9', '#f08c00', '#1098ad', '#c2255c', '#495057'];

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function theme() {
    return {
      text: cssVar('--cpl-text', '#16191d'),
      muted: cssVar('--cpl-text-mute', '#78818f'),
      grid: cssVar('--cpl-border', '#dfe3e9'),
      axis: cssVar('--cpl-border-strong', '#c3cad4'),
      bg: cssVar('--cpl-bg-elev', '#fff'),
      accent: cssVar('--cpl-accent', '#3b5bdb'),
      warn: cssVar('--cpl-warn', '#a45c00'),
      ok: cssVar('--cpl-ok', '#12805c'),
      danger: cssVar('--cpl-danger', '#bf2c2c'),
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 刻度生成
  // ─────────────────────────────────────────────────────────────
  /** 线性轴：1-2-5 序列，按可用像素选步长。 */
  plot.linTicks = function linTicks(min, max, target = 6) {
    if (!(max > min)) return { ticks: [min], step: 1 };
    const raw = (max - min) / Math.max(1, target);
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
    const ticks = [];
    const start = Math.ceil(min / step) * step;
    for (let v = start; v <= max + step * 1e-9; v += step) {
      ticks.push(Math.abs(v) < step * 1e-9 ? 0 : v);
      if (ticks.length > 200) break;
    }
    return { ticks, step };
  };

  /** 对数轴：10 的幂，跨度小时补 2/5。 */
  plot.logTicks = function logTicks(min, max) {
    const ticks = [];
    const lo = Math.floor(Math.log10(Math.max(min, Number.MIN_VALUE)));
    const hi = Math.ceil(Math.log10(Math.max(max, Number.MIN_VALUE)));
    for (let e = lo; e <= hi; e++) {
      const base = Math.pow(10, e);
      ticks.push(base);
      if (hi - lo <= 3) {
        ticks.push(2 * base, 5 * base);
      }
    }
    return ticks.filter((t) => t >= min * 0.999 && t <= max * 1.001);
  };

  /** 让坐标轴"漂亮"地包住数据。 */
  function niceDomain(values, scale, padRatio = 0.06) {
    const finite = values.filter((v) => Number.isFinite(v));
    if (!finite.length) return scale === 'log' ? [1, 10] : [0, 1];
    let lo = Math.min(...finite);
    let hi = Math.max(...finite);
    if (scale === 'log') {
      lo = lo <= 0 ? Math.min(...finite.filter((v) => v > 0), 1) : lo;
      hi = hi <= 0 ? lo * 10 : hi;
      const logLo = Math.log10(lo) - padRatio;
      const logHi = Math.log10(hi) + padRatio;
      return [Math.pow(10, logLo), Math.pow(10, logHi)];
    }
    if (lo === hi) {
      const d = Math.abs(lo) * 0.1 || 1;
      return [lo - d, hi + d];
    }
    const pad = (hi - lo) * padRatio;
    return [lo - pad, hi + pad];
  }

  // ─────────────────────────────────────────────────────────────
  // 绘图主体
  // ─────────────────────────────────────────────────────────────
  /**
   * @param {HTMLElement} container
   * @param {{
   *   series: Array<{name:string, points:Array<[number,number]>, color?:string, type?:'line'|'scatter', dash?:boolean, width?:number}>,
   *   xScale?: 'linear'|'log', yScale?: 'linear'|'log',
   *   xLabel?: string, yLabel?: string, title?: string,
   *   annotations?: Array<{x:number,y:number,text:string,color?:string}>,
   *   fitSlope?: boolean, height?: number, caption?: string,
   *   hover?: boolean
   * }} opts
   */
  plot.mount = function mount(container, opts = {}) {
    const state = {
      opts,
      hover: null,
      geom: null,
      disposed: false,
    };

    const wrap = CPL.dom.h('figure', { class: 'cpl-plot' });
    const canvas = CPL.dom.h('canvas', {
      class: 'cpl-plot__canvas',
      role: 'img',
      'aria-label': opts.title || '数据图',
    });
    canvas.style.height = `${opts.height || 320}px`;
    const caption = CPL.dom.h('figcaption', { class: 'cpl-plot__caption' });
    const tip = CPL.dom.h('div', { class: 'cpl-plot__tip', hidden: true });
    wrap.append(canvas, tip, caption);
    container.append(wrap);

    const ctx = canvas.getContext('2d');

    function draw() {
      if (state.disposed) return;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(240, rect.width || wrap.clientWidth || 600);
      const h = opts.height || 320;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const t = theme();
      const series = (opts.series || []).filter((s) => s && Array.isArray(s.points) && s.points.length);
      const pad = { l: 62, r: 16, t: opts.title ? 30 : 14, b: 42 };

      const xs = series.flatMap((s) => s.points.map((p) => p[0]));
      const ys = series.flatMap((s) => s.points.map((p) => p[1]));
      const xScale = opts.xScale || 'linear';
      const yScale = opts.yScale || 'linear';
      const [x0, x1] = niceDomain(xs, xScale);
      const [y0, y1] = niceDomain(ys, yScale);

      const px = (x) => {
        const v = xScale === 'log' ? Math.log10(Math.max(x, Number.MIN_VALUE)) : x;
        const a = xScale === 'log' ? Math.log10(Math.max(x0, Number.MIN_VALUE)) : x0;
        const b = xScale === 'log' ? Math.log10(Math.max(x1, Number.MIN_VALUE)) : x1;
        return pad.l + ((v - a) / (b - a || 1)) * (w - pad.l - pad.r);
      };
      const py = (y) => {
        const v = yScale === 'log' ? Math.log10(Math.max(y, Number.MIN_VALUE)) : y;
        const a = yScale === 'log' ? Math.log10(Math.max(y0, Number.MIN_VALUE)) : y0;
        const b = yScale === 'log' ? Math.log10(Math.max(y1, Number.MIN_VALUE)) : y1;
        return h - pad.b - ((v - a) / (b - a || 1)) * (h - pad.t - pad.b);
      };

      state.geom = { px, py, x0, x1, y0, y1, w, h, pad, series };

      // 背景
      ctx.fillStyle = t.bg;
      ctx.fillRect(0, 0, w, h);

      // 网格与刻度
      ctx.font = '11px ui-monospace, monospace';
      ctx.textBaseline = 'middle';
      const xTicks = xScale === 'log' ? plot.logTicks(x0, x1) : plot.linTicks(x0, x1, Math.max(3, Math.floor((w - pad.l - pad.r) / 90))).ticks;
      const yTicks = yScale === 'log' ? plot.logTicks(y0, y1) : plot.linTicks(y0, y1, Math.max(3, Math.floor((h - pad.t - pad.b) / 46))).ticks;

      ctx.strokeStyle = t.grid;
      ctx.lineWidth = 1;
      for (const xt of xTicks) {
        const X = Math.round(px(xt)) + 0.5;
        if (X < pad.l - 1 || X > w - pad.r + 1) continue;
        ctx.beginPath();
        ctx.moveTo(X, pad.t);
        ctx.lineTo(X, h - pad.b);
        ctx.stroke();
      }
      for (const yt of yTicks) {
        const Y = Math.round(py(yt)) + 0.5;
        if (Y < pad.t - 1 || Y > h - pad.b + 1) continue;
        ctx.beginPath();
        ctx.moveTo(pad.l, Y);
        ctx.lineTo(w - pad.r, Y);
        ctx.stroke();
      }

      // 轴
      ctx.strokeStyle = t.axis;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(pad.l + 0.5, pad.t);
      ctx.lineTo(pad.l + 0.5, h - pad.b + 0.5);
      ctx.lineTo(w - pad.r, h - pad.b + 0.5);
      ctx.stroke();

      // 刻度标签
      ctx.fillStyle = t.muted;
      ctx.textAlign = 'right';
      for (const yt of yTicks) {
        const Y = py(yt);
        if (Y < pad.t - 1 || Y > h - pad.b + 1) continue;
        ctx.fillText(plot.fmtTick(yt), pad.l - 6, Y);
      }
      ctx.textAlign = 'center';
      for (const xt of xTicks) {
        const X = px(xt);
        if (X < pad.l - 1 || X > w - pad.r + 1) continue;
        ctx.fillText(plot.fmtTick(xt), X, h - pad.b + 14);
      }

      // 轴标题
      ctx.fillStyle = t.text;
      ctx.font = '12px system-ui, sans-serif';
      if (opts.xLabel) {
        ctx.textAlign = 'center';
        ctx.fillText(opts.xLabel, pad.l + (w - pad.l - pad.r) / 2, h - 8);
      }
      if (opts.yLabel) {
        ctx.save();
        ctx.translate(13, pad.t + (h - pad.t - pad.b) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText(opts.yLabel, 0, 0);
        ctx.restore();
      }
      if (opts.title) {
        ctx.textAlign = 'left';
        ctx.font = '13px system-ui, sans-serif';
        ctx.fillStyle = t.text;
        ctx.fillText(opts.title, pad.l - 40, 16);
      }

      // 数据
      series.forEach((s, idx) => {
        const color = s.color || PALETTE[idx % PALETTE.length];
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = s.width || 2;
        ctx.setLineDash(s.dash ? [6, 4] : []);
        const pts = s.points.map(([x, y]) => [px(x), py(y)]);
        if ((s.type || 'line') === 'line' && pts.length > 1) {
          ctx.beginPath();
          pts.forEach(([X, Y], i) => (i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y)));
          ctx.stroke();
        }
        if ((s.type || 'line') === 'scatter' || pts.length <= 40) {
          ctx.setLineDash([]);
          for (const [X, Y] of pts) {
            ctx.beginPath();
            ctx.arc(X, Y, (s.type || 'line') === 'scatter' ? 3.4 : 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.setLineDash([]);
      });

      // 标注
      for (const a of opts.annotations || []) {
        const X = px(a.x);
        const Y = py(a.y);
        ctx.fillStyle = a.color || t.accent;
        ctx.font = '600 12px system-ui, sans-serif';
        ctx.textAlign = a.align || 'left';
        ctx.fillText(a.text, X + (a.dx || 4), Y + (a.dy || -6));
      }

      // 图例
      if (series.length > 1 || opts.legend !== false) {
        let lx = pad.l + 6;
        const ly = pad.t + 6;
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'left';
        series.forEach((s, idx) => {
          const color = s.color || PALETTE[idx % PALETTE.length];
          ctx.fillStyle = color;
          ctx.fillRect(lx, ly - 4, 10, 3);
          ctx.fillStyle = t.text;
          const label = s.name || `序列 ${idx + 1}`;
          ctx.fillText(label, lx + 14, ly);
          lx += ctx.measureText(label).width + 34;
          if (lx > w - pad.r - 60) lx = pad.l + 6;
        });
      }

      // 悬停标记
      if (state.hover) {
        const { X, Y, label } = state.hover;
        ctx.strokeStyle = t.accent;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(X, pad.t);
        ctx.lineTo(X, h - pad.b);
        ctx.moveTo(pad.l, Y);
        ctx.lineTo(w - pad.r, Y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = t.accent;
        ctx.beginPath();
        ctx.arc(X, Y, 4, 0, Math.PI * 2);
        ctx.fill();
        tip.hidden = false;
        tip.textContent = label;
        tip.style.left = `${Math.min(Math.max(X + 10, 6), w - 150)}px`;
        tip.style.top = `${Math.max(Y - 34, 4)}px`;
      } else {
        tip.hidden = true;
      }

      // 图注：自动拟合斜率
      if (opts.fitSlope && series.length) {
        const s = series[0];
        const lx = s.points.map((p) => Math.log10(p[0]));
        const ly = s.points.map((p) => Math.log10(Math.max(p[1], Number.MIN_VALUE)));
        const k = util.slope(lx, ly);
        const r = util.pearson(lx, ly);
        caption.textContent = `log-log 拟合斜率 ≈ ${k.toFixed(3)}（相关系数 r = ${Number.isFinite(r) ? r.toFixed(4) : 'n/a'}）${
          opts.caption ? ' · ' + opts.caption : ''
        }`;
        caption.hidden = false;
      } else if (opts.caption) {
        caption.textContent = opts.caption;
        caption.hidden = false;
      } else {
        caption.hidden = true;
      }
    }

    // 悬停
    if (opts.hover !== false) {
      canvas.addEventListener('mousemove', (e) => {
        const g = state.geom;
        if (!g) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        // 找最近数据点（按 x 距离，比较各序列）
        let best = null;
        g.series.forEach((s, idx) => {
          for (const [x, y] of s.points) {
            const d = Math.abs(g.px(x) - mx);
            if (!best || d < best.d) best = { d, x, y, idx };
          }
        });
        if (best && best.d < 24) {
          const name = g.series[best.idx].name || '';
          state.hover = {
            X: g.px(best.x),
            Y: g.py(best.y),
            label: `${name ? name + ' · ' : ''}x=${util.fmtNum(best.x, 4)}, y=${util.fmtNum(best.y, 4)}`,
          };
        } else {
          state.hover = null;
        }
        draw();
      });
      canvas.addEventListener('mouseleave', () => {
        state.hover = null;
        draw();
      });
    }

    // 尺寸变化重绘
    const offTheme = CPL.bus.on('theme:changed', () => draw());
    if (typeof ResizeObserver === 'function') {
      const ro = new ResizeObserver(util.debounce(() => draw(), 90));
      ro.observe(wrap);
      state.dispose = () => {
        state.disposed = true;
        offTheme();
        ro.disconnect();
      };
    } else {
      const onResize = util.debounce(() => draw(), 120);
      window.addEventListener('resize', onResize);
      state.dispose = () => {
        state.disposed = true;
        offTheme();
        window.removeEventListener('resize', onResize);
      };
    }

    draw();
    return {
      update(next) {
        Object.assign(opts, next || {});
        if (next && next.series) opts.series = next.series;
        draw();
      },
      redraw: draw,
      dispose: () => state.dispose && state.dispose(),
      element: wrap,
    };
  };

  plot.fmtTick = function fmtTick(v) {
    const a = Math.abs(v);
    if (a === 0) return '0';
    if (a >= 1e5 || a < 1e-3) {
      const e = Math.round(Math.log10(a));
      const m = v / Math.pow(10, e);
      return Math.abs(m - 1) < 1e-9 ? `10^${e}` : `${Number(m.toPrecision(2))}·10^${e}`;
    }
    if (a >= 1000) return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return String(Number(v.toPrecision(3)));
  };

  // ─────────────────────────────────────────────────────────────
  // 柱状图（用于"操作次数对比"这类场景）
  // ─────────────────────────────────────────────────────────────
  plot.bars = function bars(container, { items = [], max, height = 220, unit = '' } = {}) {
    const wrap = CPL.dom.h('div', { class: 'cpl-bars', role: 'img', 'aria-label': '柱状对比图' });
    const top = max || Math.max(...items.map((i) => i.value), 1);
    for (const item of items) {
      const pct = Math.max(1, (item.value / top) * 100);
      wrap.append(
        CPL.dom.h(
          'div',
          { class: 'cpl-bars__row' },
          CPL.dom.h('span', { class: 'cpl-bars__label', text: item.label }),
          CPL.dom.h(
            'span',
            { class: 'cpl-bars__track' },
            CPL.dom.h('span', {
              class: 'cpl-bars__fill',
              style: {
                width: `${pct}%`,
                background: item.color || 'var(--cpl-accent)',
                height: `${Math.max(8, Math.min(20, height / Math.max(items.length, 1) / 1.8))}px`,
              },
            })
          ),
          CPL.dom.h('span', { class: 'cpl-bars__value', text: `${util.fmtNum(item.value, 4)}${unit}` })
        )
      );
    }
    container.append(wrap);
    return wrap;
  };

  // ─────────────────────────────────────────────────────────────
  // 热力图（哈希探测序列、内存布局等）
  // ─────────────────────────────────────────────────────────────
  plot.heatmap = function heatmap(container, { rows = [], cols = [], values = [], cell = 22, xLabel = '', yLabel = '' } = {}) {
    const wrap = CPL.dom.h('div', { class: 'cpl-heatmap-wrap' });
    const table = CPL.dom.h('table', { class: 'cpl-heatmap' });
    const max = Math.max(...values.flat().filter(Number.isFinite), 1);
    const head = CPL.dom.h('tr', {}, CPL.dom.h('th', { class: 'cpl-heatmap__corner', text: yLabel ? `${yLabel} \\ ${xLabel}` : '' }));
    for (const c of cols) head.append(CPL.dom.h('th', { class: 'cpl-heatmap__col', text: String(c) }));
    table.append(CPL.dom.h('thead', {}, head));

    const body = CPL.dom.h('tbody');
    rows.forEach((r, ri) => {
      const tr = CPL.dom.h('tr', {}, CPL.dom.h('th', { class: 'cpl-heatmap__row', text: String(r) }));
      cols.forEach((c, ci) => {
        const v = values[ri] ? values[ri][ci] : 0;
        const ratio = max ? Math.max(0, Math.min(1, v / max)) : 0;
        tr.append(
          CPL.dom.h('td', {
            class: 'cpl-heatmap__cell',
            style: {
              width: `${cell}px`,
              height: `${cell}px`,
              background: `color-mix(in srgb, var(--cpl-accent) ${Math.round(ratio * 100)}%, var(--cpl-bg-sunken))`,
            },
            title: `${r} / ${c} = ${v}`,
            text: '',
          })
        );
      });
      body.append(tr);
    });
    table.append(body);
    wrap.append(table);
    container.append(wrap);
    return wrap;
  };
})();
