/* ============================================================================
 * 82-demos.js — 交互式 demo 注册表与内置 demo
 *
 * 每个 demo 是一个函数：(host, params, api) => cleanup?
 *   · host  要挂载进去的容器
 *   · params 课程里 demo.params 传入的初始参数
 *   · api   { on(kind, fn) 注册「发给 AI 助教的问题」、lesson 当前课程、setParam }
 *
 * 课程文件只需写 demo: { kind: 'growth-curve', params: {...} }，
 * 渲染逻辑与调参 UI 都在这里，课程内容保持"只有知识、没有框架代码"。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;
  const plot = CPL.plot;

  const demos = (CPL.demos = {});

  const registry = new Map();

  demos.register = (kind, fn) => registry.set(kind, fn);
  demos.has = (kind) => registry.has(kind);
  demos.kinds = () => Array.from(registry.keys());

  /** 挂载 demo；失败时展示错误卡而不是让整页崩掉。 */
  demos.mount = function mount(kind, host, params = {}, api = {}) {
    const fn = registry.get(kind);
    if (!fn) {
      host.append(
        dom.errorCard(`没有找到 demo「${kind}」`, '可能是课程内容里的 kind 拼写有误，或对应分片未加载。', [
          `已注册的 demo：${demos.kinds().join(', ') || '（无）'}`,
        ])
      );
      return null;
    }
    try {
      return fn(host, params, api) || null;
    } catch (err) {
      CPL.log('error', `demo ${kind} 渲染失败`, err);
      host.append(dom.errorCard('这个 demo 没能渲染出来', dom.friendlyError(err), ['刷新页面重试']));
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 通用控件工厂
  // ─────────────────────────────────────────────────────────────
  function slider({ label, min, max, step = 1, value, format = (v) => String(v), onInput }) {
    const out = dom.h('output', { class: 'cpl-ctl__value', text: format(value) });
    const input = dom.h('input', {
      type: 'range',
      class: 'cpl-ctl__range',
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(value),
      'aria-label': label,
      oninput: (e) => {
        const v = Number(e.target.value);
        out.textContent = format(v);
        onInput(v);
      },
    });
    return {
      el: dom.h('label', { class: 'cpl-ctl' }, dom.h('span', { class: 'cpl-ctl__label', text: label }), input, out),
      input,
      set(v) {
        input.value = String(v);
        out.textContent = format(Number(v));
      },
    };
  }

  function checkbox({ label, checked, onChange, hint }) {
    const input = dom.h('input', {
      type: 'checkbox',
      checked,
      onchange: (e) => onChange(e.target.checked),
    });
    const el = dom.h(
      'label',
      { class: 'cpl-check cpl-check--inline' },
      input,
      dom.h('span', {}, dom.h('span', { text: label }), hint ? dom.h('small', { class: 'cpl-ctl__hint', text: ` ${hint}` }) : null)
    );
    return { el, input };
  }

  function panel(title, ...children) {
    return dom.h(
      'section',
      { class: 'cpl-demo__panel' },
      title ? dom.h('h4', { class: 'cpl-demo__panel-title', text: title }) : null,
      ...children
    );
  }

  // ─────────────────────────────────────────────────────────────
  // demo 1：复杂度增长曲线
  // ─────────────────────────────────────────────────────────────
  const COMPLEXITIES = [
    { key: 'O(1)', color: '#868e96', f: () => 1 },
    { key: 'O(log N)', color: '#0ca678', f: (N) => Math.log2(N) },
    { key: 'O(N)', color: '#3b5bdb', f: (N) => N },
    { key: 'O(N log N)', color: '#1098ad', f: (N) => N * Math.log2(N) },
    { key: 'O(N²)', color: '#e8590c', f: (N) => N * N },
    { key: 'O(2^N)', color: '#c2255c', f: (N) => Math.pow(2, N) },
  ];

  /** 一次"基本操作"的粗略耗时估计（现代 CPU 上跑 JS 循环的量级）。 */
  const NS_PER_OP = 1.2;

  function humanTime(ns) {
    if (!Number.isFinite(ns)) return '∞';
    const s = ns / 1e9;
    if (s < 1e-6) return `${(ns).toFixed(1)} ns`;
    if (s < 1e-3) return `${(s * 1e6).toFixed(1)} µs`;
    if (s < 1) return `${(s * 1e3).toFixed(1)} ms`;
    if (s < 60) return `${s.toFixed(2)} s`;
    if (s < 3600) return `${(s / 60).toFixed(1)} min`;
    if (s < 86400) return `${(s / 3600).toFixed(2)} h`;
    if (s < 86400 * 365) return `${(s / 86400).toFixed(1)} 天`;
    return `${(s / 86400 / 365).toFixed(1)} 年`;
  }

  demos.register('growth-curve', (host, params, api) => {
    const state = {
      N: params.N || 1e5,
      active: new Set(['O(N)', 'O(N log N)', 'O(N²)']),
      measure: false,
      measured: null,
    };

    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const tableHost = dom.h('div', { class: 'cpl-demo__table' });
    const noteHost = dom.h('div', { class: 'cpl-demo__note' });

    const nSlider = slider({
      label: '输入规模 N',
      min: 2,
      max: 8,
      step: 0.05,
      value: Math.log10(state.N),
      format: (v) => `10^${Number(v).toFixed(2)} ≈ ${util.fmtNum(Math.pow(10, v), 3)}`,
      onInput: (v) => {
        state.N = Math.pow(10, v);
        refresh();
      },
    });

    const toggles = dom.h('div', { class: 'cpl-demo__toggles' });
    for (const c of COMPLEXITIES) {
      const cb = checkbox({
        label: c.key,
        checked: state.active.has(c.key),
        onChange: (on) => {
          if (on) state.active.add(c.key);
          else state.active.delete(c.key);
          refresh();
        },
      });
      toggles.append(cb.el);
    }

    const measureBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '实测一下 O(N) 与 O(N²)（真跑代码）',
      onclick: runMeasurement,
    });

    let view = null;

    function runMeasurement() {
      // 真跑：证明"理论量级"不是纸面结论。上限保护避免把页面卡死。
      const N = Math.min(Math.round(state.N), 40000);
      const arr = new Float64Array(N);
      for (let i = 0; i < N; i++) arr[i] = i;

      const t0 = performance.now();
      let s1 = 0;
      for (let i = 0; i < N; i++) s1 += arr[i];
      const t1 = performance.now() - t0;

      const t2s = performance.now();
      let s2 = 0;
      // 只跑 N/20 规模的外层，避免 O(N²) 在 4e4 时把浏览器钉死
      const M = Math.max(1, Math.round(N / 20));
      for (let i = 0; i < M; i++) {
        for (let j = 0; j < M; j++) s2 += 1;
      }
      const t2 = (performance.now() - t2s) * 400; // 按 N² 折算回同规模

      state.measured = { N, linearMs: t1, quadraticMs: t2 };
      noteHost.textContent = `实测（N=${N.toLocaleString()}）：O(N) 求和 ${t1.toFixed(2)} ms；O(N²) 等规模折算约 ${t2.toFixed(1)} ms（放大 ${(t2 / Math.max(t1, 0.001)).toFixed(0)} 倍）。校验和 ${s1.toFixed(0)} / ${s2.toFixed(0)}`;
      refresh();
    }

    function series() {
      const out = [];
      for (const c of COMPLEXITIES) {
        if (!state.active.has(c.key)) continue;
        const pts = [];
        for (let e = 1; e <= 8.001; e += 0.25) {
          const N = Math.pow(10, e);
          pts.push([N, Math.max(c.f(N), Number.MIN_VALUE)]);
        }
        out.push({ name: c.key, points: pts, color: c.color, type: 'line' });
      }
      // 当前 N 的竖线（用两个点画出来）
      if (state.N) {
        out.push({
          name: `当前 N`,
          points: [
            [state.N, 1],
            [state.N, 1e18],
          ],
          color: 'var(--cpl-text-mute)',
          dash: true,
          width: 1,
        });
      }
      return out;
    }

    function refresh() {
      dom.clear(tableHost);
      dom.clear(canvasHost);
      if (view) view.dispose();

      view = plot.mount(canvasHost, {
        series: series(),
        xScale: 'log',
        yScale: 'log',
        xLabel: 'N（log）',
        yLabel: '基本操作次数（log）',
        height: 300,
        caption: 'log-log 上：斜率 1 = O(N)，斜率 2 = O(N²)，斜率 ~1 但整体抬高 = O(N log N)',
      });

      // 当前 N 下的数量级表
      const N = state.N;
      const rows = COMPLEXITIES.filter((c) => state.active.has(c.key)).map((c) => {
        const ops = c.f(N);
        const seconds = ops * NS_PER_OP / 1e9;
        const mem = c.key === 'O(N)' || c.key === 'O(N log N)' ? N * 8 : c.key === 'O(N²)' ? N * N * 8 : 0;
        return [
          c.key,
          util.fmtNum(ops, 3),
          humanTime(ops * NS_PER_OP),
          mem ? util.bytes(mem) : '—',
        ];
      });

      const table = dom.h(
        'table',
        { class: 'cpl-table cpl-table--compact' },
        dom.h(
          'thead',
          {},
          dom.h(
            'tr',
            {},
            dom.h('th', { text: '复杂度' }),
            dom.h('th', { text: `N = ${util.fmtNum(N, 3)} 时的操作数` }),
            dom.h('th', { text: `按 ~${NS_PER_OP} ns/次估算耗时` }),
            dom.h('th', { text: '若每元素 8 字节的内存' })
          )
        ),
        dom.h(
          'tbody',
          {},
          rows.map((r) => dom.h('tr', {}, r.map((c) => dom.h('td', { text: c }))))
        )
      );
      tableHost.append(table);
    }

    host.append(
      panel(
        '参数',
        nSlider.el,
        toggles,
        dom.h('div', { class: 'cpl-demo__actions' }, measureBtn),
        dom.h('p', {
          class: 'cpl-ctl__hint',
          text:
            '提示：表格里的"估算耗时"是把操作数乘以一个典型的单次操作耗时得到的量级估计，用来判断"这台机器上还行不行"，不是精确预测。点上面的按钮会真的跑一次给你看。',
        })
      ),
      panel('数量级对比', canvasHost),
      panel(null, tableHost, noteHost)
    );

    refresh();

    api.on && api.on('ask', () => '为什么 O(N²) 在 N=10⁴ 就已经很难受了？把 N 再放大 10 倍，耗时变化多少倍？');

    return () => view && view.dispose();
  });

  // ─────────────────────────────────────────────────────────────
  // demo 2：内存模型探针（寻址代价与缓存局部性）
  // ─────────────────────────────────────────────────────────────
  demos.register('memory-model', (host, params, api) => {
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const out = dom.h('div', { class: 'cpl-demo__note' });
    let view = null;

    const strides = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

    function bench(stride) {
      const N = 1 << 22; // 4M 个 float64 = 32 MB，超过 L3 常见容量
      const n = stride === 1 ? 3 : 2;
      let best = Infinity;
      for (let trial = 0; trial < n; trial++) {
        const t0 = performance.now();
        let acc = 0;
        const count = Math.floor(N / stride);
        for (let i = 0; i < count; i++) acc += i;
        best = Math.min(best, performance.now() - t0);
      }
      void N;
      return best;
    }

    /**
     * 更真实的缓存实验：构造一个"每次跳 stride 个元素"的数组遍历，
     * 比较顺序访问与跨步访问的带宽差异。
     */
    function strideBench(stride) {
      const elements = 1 << 20; // 1M
      const data = new Float64Array(elements);
      for (let i = 0; i < elements; i++) data[i] = i * 0.5;
      const step = stride;
      const rounds = Math.max(1, Math.floor(8 / Math.log2(Math.max(stride, 2))));
      let best = Infinity;
      for (let r = 0; r < rounds; r++) {
        let acc = 0;
        const t0 = performance.now();
        for (let i = 0; i < elements; i += step) acc += data[i];
        const dt = performance.now() - t0;
        best = Math.min(best, dt);
        void acc;
      }
      return best;
    }

    const runBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '运行内存带宽实验（约 1 秒）',
      onclick: () => {
        runBtn.disabled = true;
        runBtn.textContent = '测量中…';
        setTimeout(() => {
          const pts = [];
          const rows = [];
          for (const s of strides) {
            const ms = strideBench(s);
            const bytesTouched = (1 << 20) * 8 / s;
            pts.push([s * 8, bytesTouched / (ms / 1000) / 1e9]); // x: 跨步字节数, y: 有效带宽 GB/s
            rows.push([`${s} × 8 B = ${s * 8} B`, `${ms.toFixed(2)} ms`, `${(bytesTouched / (ms / 1000) / 1e9).toFixed(3)} GB/s`]);
          }
          dom.clear(out);
          out.append(
            dom.h('p', {
              text:
                '这是本机实测，绝对值随机器变化，但趋势稳定：跨步一旦超过缓存行（通常 64 B），有效带宽明显下降——因为每次访问都要搬进一整条 cache line，只用到了其中一小部分。',
            })
          );
          dom.clear(canvasHost);
          if (view) view.dispose();
          view = plot.mount(canvasHost, {
            series: [{ name: '有效带宽', points: pts, color: '#e8590c', type: 'line' }],
            xScale: 'log',
            yScale: 'linear',
            xLabel: '跨步字节数（log）',
            yLabel: '有效带宽 (GB/s)',
            height: 260,
          });
          const tbl = dom.h(
            'table',
            { class: 'cpl-table cpl-table--compact' },
            dom.h('thead', {}, dom.h('tr', {}, ['跨步', '耗时', '有效带宽'].map((h) => dom.h('th', { text: h })))),
            dom.h('tbody', {}, rows.map((r) => dom.h('tr', {}, r.map((c) => dom.h('td', { text: c })))))
          );
          out.append(tbl);
          runBtn.disabled = false;
          runBtn.textContent = '重新测量';
        }, 30);
      },
    });

    host.append(
      panel(
        '缓存局部性实验',
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '同一个数组、同样数量的元素，只改变"访问跨步"，有效带宽就会掉一个量级。这就是为什么 Fortran 的列主序（第一维连续）和 C 的行主序（最后一维连续）会让同一段公式差好几倍性能。',
        }),
        dom.h('div', { class: 'cpl-demo__actions' }, runBtn),
        out,
        canvasHost
      )
    );

    api.on && api.on('ask', () => '你测到的带宽随跨步怎么变化？把它和"数组维度顺序"联系起来：改一下 Fortran 里 do 循环的嵌套顺序，性能会变吗？');
    void bench;

    return () => view && view.dispose();
  });

  // ─────────────────────────────────────────────────────────────
  // demo 3：浮点误差累加
  // ─────────────────────────────────────────────────────────────
  function kahanSum(arr) {
    let sum = 0;
    let c = 0;
    for (let i = 0; i < arr.length; i++) {
      const y = arr[i] - c;
      const t = sum + y;
      c = t - sum - y;
      sum = t;
    }
    return sum;
  }

  function naiveSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    return sum;
  }

  demos.register('float-error', (host, params, api) => {
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const resultHost = dom.h('div', { class: 'cpl-demo__note' });
    let view = null;
    let n = params.n || 10000;

    const valueSel = dom.h(
      'select',
      { class: 'cpl-select', 'aria-label': '被累加的值' },
      [
        { v: '0.1', label: '0.1（二进制无限循环小数）' },
        { v: '1e-8', label: '1e-8（与小量相加被吞掉）' },
        { v: '0.333333333333', label: '0.333333333333（截断的 1/3）' },
      ].map((o) => dom.h('option', { value: o.v, text: o.label }))
    );

    const nSlider = slider({
      label: '累加次数',
      min: 1,
      max: 6,
      step: 0.02,
      value: Math.log10(n),
      format: (v) => `10^${Number(v).toFixed(2)} = ${util.fmtNum(Math.pow(10, v), 3)} 次`,
      onInput: (v) => {
        n = Math.round(Math.pow(10, v));
        refresh();
      },
    });

    function refresh() {
      const v = Number(valueSel.value);
      const count = Math.min(n, 2e6);
      const arr = new Float64Array(count);
      arr.fill(v);
      const naive = naiveSum(arr);
      const kahan = kahanSum(arr);
      const exact = v * count;

      const series = [];
      const ptsNaive = [];
      const ptsKahan = [];
      let s1 = 0;
      let s2 = 0;
      let c = 0;
      for (let i = 1; i <= count; i++) {
        s1 += v;
        const y = v - c;
        const t = s2 + y;
        c = t - s2 - y;
        s2 = t;
        if (i === 1 || i % Math.max(1, Math.floor(count / 120)) === 0 || i === count) {
          ptsNaive.push([i, Math.abs(s1 - v * i) || Number.MIN_VALUE]);
          ptsKahan.push([i, Math.abs(s2 - v * i) || Number.MIN_VALUE]);
        }
      }
      series.push({ name: '朴素累加误差', points: ptsNaive, color: '#e8590c' });
      series.push({ name: 'Kahan 补偿误差', points: ptsKahan, color: '#0ca678' });

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series,
        xScale: 'log',
        yScale: 'log',
        xLabel: '累加次数（log）',
        yLabel: '与精确值的偏差（log）',
        height: 280,
        caption: '误差归零的点会被画在下界处（0 无法画在 log 轴上）',
      });

      dom.clear(resultHost);
      const rows = [
        ['精确值 v×n', exact.toPrecision(17)],
        ['朴素累加', naive.toPrecision(17)],
        ['Kahan 补偿', kahan.toPrecision(17)],
        ['朴素相对误差', exact !== 0 ? Math.abs((naive - exact) / exact).toExponential(3) : '—'],
        ['Kahan 相对误差', exact !== 0 ? Math.abs((kahan - exact) / exact).toExponential(3) : '—'],
        ['机器 epsilon (float64)', Number.EPSILON.toExponential(6)],
      ];
      resultHost.append(
        dom.h(
          'table',
          { class: 'cpl-table cpl-table--compact' },
          dom.h('thead', {}, dom.h('tr', {}, [dom.h('th', { text: '量' }), dom.h('th', { text: '值' })])),
          dom.h('tbody', {}, rows.map((r) => dom.h('tr', {}, dom.h('td', { text: r[0] }), dom.h('td', { class: 'cpl-mono', text: r[1] }))))
        )
      );
      resultHost.append(
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '朴素累加的误差随 n 近似线性增长（n·ε），Kahan 补偿把误差压到基本与 n 无关。注意：这不是"浮点不精确"这种笼统结论，而是可预测的 n·ε 量级。',
        })
      );
    }

    valueSel.addEventListener('change', refresh);

    host.append(
      panel(
        '参数',
        dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '累加的值 v' }), valueSel),
        nSlider.el
      ),
      panel('误差随累加次数的增长', canvasHost),
      panel('数值对照', resultHost)
    );

    refresh();
    api.on && api.on('ask', () => '你的朴素累加误差是 n·ε 的量级吗？把 n 放大 100 倍，误差涨了多少倍？你论文里哪个求和是这个形状？');
    return () => view && view.dispose();
  });
})();
