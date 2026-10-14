/* ============================================================================
 * 83-demos-cs.js — 模块 5（CS 核心）与模块 3（Fortran）的交互式 demo
 *
 * 每个 demo 都是真实的交互控件 + 真实计算，不是静态截图。
 * 全部零依赖（用 80-plot.js 的 Canvas 绘图与 82-demos.js 的控件工厂）。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;
  const plot = CPL.plot;
  const demos = CPL.demos;

  // ── 复用 82-demos.js 里的控件工厂（这里重新定义一份，避免跨分片私有依赖） ──
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
    return { el: dom.h('label', { class: 'cpl-ctl' }, dom.h('span', { class: 'cpl-ctl__label', text: label }), input, out), input };
  }

  function checkbox({ label, checked, onChange }) {
    const input = dom.h('input', { type: 'checkbox', checked, onchange: (e) => onChange(e.target.checked) });
    return dom.h('label', { class: 'cpl-check cpl-check--inline' }, input, dom.h('span', { text: label }));
  }

  function panel(title, ...children) {
    return dom.h('section', { class: 'cpl-demo__panel' }, title ? dom.h('h4', { class: 'cpl-demo__panel-title', text: title }) : null, ...children.filter(Boolean));
  }

  function table(headers, rows) {
    return dom.h(
      'table',
      { class: 'cpl-table cpl-table--compact' },
      dom.h('thead', {}, dom.h('tr', {}, headers.map((h) => dom.h('th', { text: h })))),
      dom.h(
        'tbody',
        {},
        rows.map((r) => dom.h('tr', {}, r.map((c) => dom.h('td', { text: c === null || c === undefined ? '—' : String(c) }))))
      )
    );
  }

  function fmtOps(n) {
    if (!Number.isFinite(n)) return '∞';
    const a = Math.abs(n);
    if (a >= 1e15) return n.toExponential(2);
    if (a >= 1e6) return n.toExponential(3);
    return Math.round(n).toLocaleString('en-US');
  }

  function human(ns) {
    const s = ns / 1e9;
    if (s < 1e-6) return `${(ns).toFixed(0)} ns`;
    if (s < 1e-3) return `${(s * 1e6).toFixed(1)} µs`;
    if (s < 1) return `${(s * 1e3).toFixed(1)} ms`;
    if (s < 60) return `${s.toFixed(2)} s`;
    if (s < 3600) return `${(s / 60).toFixed(1)} min`;
    if (s < 86400) return `${(s / 3600).toFixed(1)} h`;
    if (s < 86400 * 365) return `${(s / 86400).toFixed(1)} 天`;
    return `${(s / 86400 / 365).toExponential(2)} 年`;
  }

  const NS_PER_OP = 1.2;

  // ═════════════════════════════════════════════════════════════
  // 通用：复杂度对照表 + 增长曲线（几乎所有 CS 课都能用）
  // ═════════════════════════════════════════════════════════════
  const TERMS = {
    'O(1)': () => 1,
    'O(log N)': (N) => Math.log2(Math.max(N, 2)),
    'O(√N)': (N) => Math.sqrt(N),
    'O(N)': (N) => N,
    'O(N log N)': (N) => N * Math.log2(Math.max(N, 2)),
    'O(N^1.5)': (N) => Math.pow(N, 1.5),
    'O(N²)': (N) => N * N,
    'O(N³)': (N) => N * N * N,
    'O(2^N)': (N) => Math.pow(2, Math.min(N, 1024)),
  };

  demos.register('complexity-table', (host, params, api) => {
    const presets = params.presets || ['O(N)', 'O(N log N)', 'O(N²)'];
    const active = new Set(presets);
    const state = { N: params.N || 1e6, memBytesPerElem: params.memBytesPerElem || 8 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const tableHost = dom.h('div', {});
    let view = null;

    const nSlider = slider({
      label: '输入规模 N',
      min: 1,
      max: 9,
      step: 0.1,
      value: Math.log10(state.N),
      format: (v) => `10^${Number(v).toFixed(1)} = ${fmtOps(Math.pow(10, v))}`,
      onInput: (v) => {
        state.N = Math.pow(10, v);
        refresh();
      },
    });

    const toggles = dom.h('div', { class: 'cpl-demo__toggles' });
    for (const key of Object.keys(TERMS)) {
      toggles.append(
        checkbox({
          label: key,
          checked: active.has(key),
          onChange: (on) => {
            if (on) active.add(key);
            else active.delete(key);
            refresh();
          },
        })
      );
    }

    function refresh() {
      const N = state.N;
      dom.clear(tableHost);
      const rows = Array.from(active).map((key) => {
        const ops = TERMS[key](N);
        const mem = /N\^?[23²³]/.test(key) ? N * N * state.memBytesPerElem : /N/.test(key) ? N * state.memBytesPerElem : 0;
        return [
          key,
          fmtOps(ops),
          human(ops * NS_PER_OP),
          mem && mem < 1e18 ? util.bytes(mem) : '—',
          Number.isFinite(ops) && ops > 1e12 ? '不可行' : ops > 1e9 ? '勉强' : '可行',
        ];
      });
      tableHost.append(
        table(['复杂度', `N = ${fmtOps(N)} 时的操作数`, '按 ~1.2 ns/次估算', '线性存储内存', '判据'], rows)
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const series = Array.from(active).map((key, i) => ({
        name: key,
        color: ['#3b5bdb', '#e8590c', '#0ca678', '#ae3ec9', '#f08c00', '#1098ad', '#c2255c', '#495057'][i % 8],
        points: Array.from({ length: 33 }, (_, k) => {
          const n = Math.pow(10, 1 + k * 0.25);
          return [n, Math.max(TERMS[key](n), 1e-9)];
        }),
      }));
      view = plot.mount(canvasHost, {
        series,
        xScale: 'log',
        yScale: 'log',
        xLabel: 'N（log）',
        yLabel: '操作数（log）',
        height: 280,
        caption: 'log-log 图的斜率就是指数：斜率 1 = 线性，2 = 平方，N log N 会缓慢上翘。',
      });
    }

    host.append(panel('参数', nSlider.el, toggles), panel('量级判断', tableHost), panel('增长曲线', canvasHost));
    refresh();
    api.on && api.on('ask', () => `在 N = ${fmtOps(state.N)} 时，你选中的这几条里哪一条最先变得不可行？把它的操作数和"1 秒能跑 10⁹ 次操作"这个经验值比一下。`);
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 动态数组扩容：倍数 vs 固定增量
  // ═════════════════════════════════════════════════════════════
  demos.register('amortized-array', (host, params) => {
    const state = { N: params.N || 2000, factor: params.factor || 2 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    const tableHost = dom.h('div', {});
    let view = null;

    const nSlider = slider({ label: '追加次数 N', min: 100, max: 20000, step: 100, value: state.N, format: (v) => String(Math.round(v)), onInput: (v) => { state.N = Math.round(v); refresh(); } });
    const fSlider = slider({
      label: '扩容策略',
      min: 2,
      max: 100,
      value: Math.round(state.factor * 10),
      format: (v) => (Number(v) >= 100 ? '每次 +1（灾难）' : `容量 × ${(Number(v) / 10).toFixed(1)}`),
      onInput: (v) => {
        state.factor = Number(v) / 10;
        refresh();
      },
    });

    function simulate(N, factor) {
      let capacity = 1;
      let size = 0;
      let copies = 0;
      let reallocs = 0;
      const trace = [];
      for (let i = 0; i < N; i++) {
        if (size === capacity) {
          const next = factor >= 10 ? capacity + Math.max(1, Math.round(capacity / 10)) : Math.max(capacity + 1, Math.floor(capacity * factor));
          copies += size;
          capacity = next;
          reallocs++;
        }
        size++;
        if (i % Math.max(1, Math.floor(N / 200)) === 0 || i === N - 1) trace.push([i + 1, Math.max(copies, 1)]);
      }
      return { copies, reallocs, finalCapacity: capacity, trace };
    }

    function refresh() {
      const N = state.N;
      const doubling = simulate(N, 2);
      const current = simulate(N, state.factor);
      const fixed = simulate(N, 100); // 每次 +1

      dom.clear(outHost);
      outHost.append(
        dom.h('p', {
          text: `在 N = ${N.toLocaleString()} 次追加下，总元素搬运次数：`,
        }),
        table(
          ['扩容策略', '扩容次数', '总搬运次数', '摊销到每次追加', '对比'],
          [
            ['× 2（推荐）', doubling.reallocs, doubling.copies.toLocaleString(), (doubling.copies / N).toFixed(2), '基准'],
            [`× ${state.factor.toFixed(1)}（当前选择）`, current.reallocs, current.copies.toLocaleString(), (current.copies / N).toFixed(2), `${(current.copies / Math.max(doubling.copies, 1)).toFixed(2)}× 基准`],
            ['每次 +1（错误做法）', fixed.reallocs, fixed.copies.toLocaleString(), (fixed.copies / N).toFixed(1), `${(fixed.copies / Math.max(doubling.copies, 1)).toFixed(0)}× 基准`],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '看"摊销到每次追加"这一列：倍数扩容下它是常数（约 2），而"每次 +1"下它随 N 线性增长——这就是 O(1) 摊销与 O(N) 的区别。',
        })
      );

      dom.clear(tableHost);
      tableHost.append(
        table(['N', '× 2 总搬运', '每次 +1 总搬运'], [100, 1000, 5000, 20000].map((n) => [n.toLocaleString(), simulate(n, 2).copies.toLocaleString(), simulate(n, 100).copies.toLocaleString()]))
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [
          { name: '× 2（摊销常数）', points: doubling.trace, color: '#0ca678' },
          { name: `× ${state.factor.toFixed(1)}`, points: current.trace, color: '#3b5bdb' },
          { name: '每次 +1', points: fixed.trace, color: '#c2255c' },
        ],
        xScale: 'linear',
        yScale: 'log',
        xLabel: '追加次数',
        yLabel: '累计搬运元素数（log）',
        height: 260,
      });
    }

    host.append(panel('参数', nSlider.el, fSlider.el), panel('累计搬运代价', canvasHost), panel('数值对照', outHost, tableHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 哈希表：负载因子 vs 探测次数
  // ═════════════════════════════════════════════════════════════
  demos.register('hash-probe', (host, params) => {
    const state = { m: params.m || 512, alpha: params.alpha || 0.7, n: 0 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    const mSlider = slider({ label: '槽数 m', min: 5, max: 11, step: 1, value: Math.log2(state.m), format: (v) => `2^${Math.round(v)} = ${Math.pow(2, Math.round(v))}`, onInput: (v) => { state.m = Math.pow(2, Math.round(v)); refresh(); } });
    const aSlider = slider({ label: '负载因子 α', min: 10, max: 95, value: Math.round(state.alpha * 100), format: (v) => Number(v) / 100 === 1 ? '1.00' : (Number(v) / 100).toFixed(2), onInput: (v) => { state.alpha = Number(v) / 100; refresh(); } });

    function probeStats(m, alpha) {
      const n = Math.max(1, Math.floor(m * alpha));
      // 用真实哈希（FNV-1a）插入，统计成功/不成功的探测次数
      const table = new Array(m).fill(null);
      const hash = (k) => {
        let h = 0x811c9dc5;
        const s = String(k);
        for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
        return h >>> 0;
      };
      let maxProbe = 0;
      let totalProbe = 0;
      for (let k = 0; k < n; k++) {
        let idx = hash('key' + k) % m;
        let p = 0;
        while (table[idx] !== null) { idx = (idx + 1) % m; p++; if (p > m) break; }
        table[idx] = k;
        totalProbe += p + 1;
        maxProbe = Math.max(maxProbe, p + 1);
      }
      // 不成功查找的平均探测次数：对全部 m 个起点取平均
      let failProbe = 0;
      for (let start = 0; start < m; start++) {
        let idx = start;
        let p = 0;
        while (table[idx] !== null && p < m) { idx = (idx + 1) % m; p++; }
        failProbe += p + 1;
      }
      failProbe /= m;
      // 把探测序列可视化成热力（前 32 个槽的占用与探测长度）
      const cells = table.slice(0, 64).map((v, i) => ({ index: i, occupied: v !== null }));
      return { n, avgSuccess: totalProbe / n, maxProbe, avgFail: failProbe, cells };
    }

    function refresh() {
      const m = Math.round(state.m);
      const alpha = state.alpha;
      const stats = probeStats(m, alpha);

      const theoSuccess = 0.5 * (1 + 1 / (1 - Math.min(alpha, 0.999)));
      const theoFail = 0.5 * (1 + 1 / Math.pow(1 - Math.min(alpha, 0.999), 2));

      dom.clear(outHost);
      outHost.append(
        table(
          ['指标', '实测', '理论（开放寻址公式）'],
          [
            ['元素数 n', stats.n.toLocaleString(), `m × α = ${(m * alpha).toFixed(0)}`],
            ['成功查找平均探测', stats.avgSuccess.toFixed(3), theoSuccess.toFixed(3)],
            ['不成功查找平均探测', stats.avgFail.toFixed(3), theoFail.toFixed(3)],
            ['最长探测序列', stats.maxProbe, '—'],
            ['判据', stats.avgFail > 10 ? '⚠ 该扩容了' : stats.avgFail > 4 ? '接近临界' : '健康', '工程上常在 α≈0.7 扩容'],
          ]
        )
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const ptsFail = [];
      const ptsSuccess = [];
      for (let a = 0.05; a < 0.99; a += 0.02) {
        ptsFail.push([a, 0.5 * (1 + 1 / Math.pow(1 - a, 2))]);
        ptsSuccess.push([a, 0.5 * (1 + 1 / (1 - a))]);
      }
      view = plot.mount(canvasHost, {
        series: [
          { name: '不成功查找（理论）', points: ptsFail, color: '#c2255c' },
          { name: '成功查找（理论）', points: ptsSuccess, color: '#0ca678' },
          { name: `你在 α=${alpha.toFixed(2)} 的实测（不成功）`, points: [[alpha, stats.avgFail]], color: '#3b5bdb', type: 'scatter' },
        ],
        xScale: 'linear',
        yScale: 'linear',
        xLabel: '负载因子 α',
        yLabel: '期望探测次数',
        height: 280,
        annotations: [{ x: 0.7, y: stats.avgFail, text: 'α = 0.7', color: '#a45c00' }],
        caption: '看曲线的形状：α 超过 0.7 之后探测次数迅速上翘，收益（省下的内存）远不及代价。',
      });
    }

    host.append(panel('参数', mSlider.el, aSlider.el), panel('实测 vs 理论', outHost), panel('探测次数曲线', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 链表 vs 数组：插入/查找代价与缓存效应
  // ═════════════════════════════════════════════════════════════
  demos.register('list-vs-array', (host, params) => {
    const state = { N: params.N || 20000 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    const nSlider = slider({ label: '元素个数 N', min: 3, max: 6, step: 0.2, value: Math.log10(state.N), format: (v) => `10^${Number(v).toFixed(1)} = ${fmtOps(Math.pow(10, v))}`, onInput: (v) => { state.N = Math.round(Math.pow(10, v)); refresh(); } });

    function measure() {
      const N = state.N;
      // 数组（Float64Array）：连续内存
      const arr = new Float64Array(N);
      for (let i = 0; i < N; i++) arr[i] = i;
      let t0 = performance.now();
      let s = 0;
      for (let i = 0; i < N; i++) s += arr[i];
      const arrSum = performance.now() - t0;

      // 数组随机访问
      const idx = new Int32Array(N);
      let seed = 12345;
      for (let i = 0; i < N; i++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; idx[i] = seed % N; }
      t0 = performance.now();
      let s2 = 0;
      for (let i = 0; i < N; i++) s2 += arr[idx[i]];
      const arrRandom = performance.now() - t0;

      // "链表"：用对象数组模拟指针追逐（每个节点是一个对象，带 next 下标）
      const nodes = new Array(N);
      for (let i = 0; i < N; i++) nodes[i] = { value: i, next: i + 1 < N ? i + 1 : -1 };
      t0 = performance.now();
      let s3 = 0;
      let cur = 0;
      let guard = 0;
      while (cur !== -1 && guard++ < N + 10) { s3 += nodes[cur].value; cur = nodes[cur].next; }
      const listTraverse = performance.now() - t0;

      // 中间插入：数组要搬移，链表只改指针
      const half = Math.floor(N / 2);
      t0 = performance.now();
      const arr2 = Array.from(arr);
      arr2.splice(half, 0, -1);
      const arrInsert = performance.now() - t0;

      t0 = performance.now();
      nodes[half].next = half + 1;
      nodes[half] = { value: -1, next: half + 1 };
      const listInsert = performance.now() - t0;

      void s; void s2; void s3; void arr2; void listInsert;

      return { N, arrSum, arrRandom, listTraverse, arrInsert, listInsert: Math.max(listInsert, 0.0005) };
    }

    function refresh() {
      const r = measure();
      const N = r.N;

      dom.clear(outHost);
      outHost.append(
        table(
          ['操作', '实测耗时', '每次操作', '理论复杂度', '说明'],
          [
            ['数组顺序求和', `${r.arrSum.toFixed(3)} ms`, `${((r.arrSum * 1e6) / N).toFixed(2)} ns`, 'O(N)', '连续内存，一条 cache line 用满'],
            ['数组随机访问', `${r.arrRandom.toFixed(3)} ms`, `${((r.arrRandom * 1e6) / N).toFixed(2)} ns`, 'O(N)', '每次都可能 cache miss'],
            ['链表遍历（对象数组）', `${r.listTraverse.toFixed(3)} ms`, `${((r.listTraverse * 1e6) / N).toFixed(2)} ns`, 'O(N)', '指针追逐，缓存不友好'],
            ['数组中间插入', `${r.arrInsert.toFixed(3)} ms`, '—', 'O(N)', '需要搬移后半段'],
            ['链表中间插入（改指针）', `${r.listInsert.toFixed(3)} ms`, '—', 'O(1)', '找到位置才是瓶颈'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '结论不是"链表比数组快"或"数组比链表快"，而是：**理论复杂度只描述缩放，实际速度还取决于缓存是否命中。** 同样是 O(N) 的遍历，链表因为指针追逐可能慢好几倍。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const scale = [1e3, 3e3, 1e4, 3e4, 1e5].filter((n) => n <= 200000);
      const series = [
        { name: '数组顺序访问', color: '#0ca678', points: scale.map((n) => [n, (n * (r.arrSum * 1e6)) / N]) },
        { name: '数组随机访问', color: '#3b5bdb', points: scale.map((n) => [n, (n * (r.arrRandom * 1e6)) / N]) },
        { name: '链表遍历', color: '#c2255c', points: scale.map((n) => [n, (n * (r.listTraverse * 1e6)) / N]) },
      ];
      view = plot.mount(canvasHost, {
        series,
        xScale: 'log',
        yScale: 'log',
        xLabel: 'N（log）',
        yLabel: '预计耗时 ns（log）',
        height: 260,
        caption: '三条线斜率相同（都是 O(N)），但截距不同——这个差距就是缓存局部性的贡献。',
      });
    }

    const btn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '重新测量（本机实测）',
      onclick: () => {
        btn.disabled = true;
        setTimeout(() => { refresh(); btn.disabled = false; }, 20);
      },
    });

    host.append(panel('参数', nSlider.el, dom.h('div', { class: 'cpl-demo__actions' }, btn)), panel('本机实测', outHost), panel('缩放趋势', canvasHost));
    btn.disabled = true;
    setTimeout(() => { refresh(); btn.disabled = false; }, 30);
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 排序算法对比（比较与交换次数，真实排序）
  // ═════════════════════════════════════════════════════════════
  demos.register('sort-compare', (host, params) => {
    const state = { N: params.N || 400, pattern: 'random' };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    const counters = { cmp: 0, swap: 0 };
    const reset = () => { counters.cmp = 0; counters.swap = 0; };
    const less = (a, b) => { counters.cmp++; return a < b; };
    const swap = (a, i, j) => { counters.swap++; const t = a[i]; a[i] = a[j]; a[j] = t; };

    function insertionSort(a) { for (let i = 1; i < a.length; i++) { let j = i; while (j > 0 && less(a[j], a[j - 1])) { swap(a, j, j - 1); j--; } } return a; }
    function mergeSort(a) {
      if (a.length <= 1) return a;
      const mid = a.length >> 1;
      const l = mergeSort(a.slice(0, mid));
      const r = mergeSort(a.slice(mid));
      const out = [];
      let i = 0; let j = 0;
      while (i < l.length && j < r.length) out.push(less(r[j], l[i]) ? r[j++] : l[i++]);
      while (i < l.length) out.push(l[i++]);
      while (j < r.length) out.push(r[j++]);
      return out;
    }
    function quickSort(a, lo = 0, hi = a.length - 1) {
      if (lo >= hi) return a;
      const mid = (lo + hi) >> 1;
      // 三数取中，避免有序输入下退化
      if (less(a[mid], a[lo])) swap(a, mid, lo);
      if (less(a[hi], a[lo])) swap(a, hi, lo);
      if (less(a[hi], a[mid])) swap(a, hi, mid);
      const pivot = a[mid];
      let i = lo; let j = hi;
      while (i <= j) {
        while (less(a[i], pivot)) i++;
        while (less(pivot, a[j])) j--;
        if (i <= j) { swap(a, i, j); i++; j--; }
      }
      quickSort(a, lo, j);
      quickSort(a, i, hi);
      return a;
    }
    function heapSort(a) {
      const n = a.length;
      const sift = (start, end) => {
        let root = start;
        while (root * 2 + 1 <= end) {
          let child = root * 2 + 1;
          if (child + 1 <= end && less(a[child], a[child + 1])) child++;
          if (less(a[root], a[child])) { swap(a, root, child); root = child; } else return;
        }
      };
      for (let s = (n - 2) >> 1; s >= 0; s--) sift(s, n - 1);
      for (let e = n - 1; e > 0; e--) { swap(a, 0, e); sift(0, e - 1); }
      return a;
    }

    function makeData(N, pattern) {
      const a = new Float64Array(N);
      for (let i = 0; i < N; i++) a[i] = i;
      if (pattern === 'random') {
        let seed = 42;
        for (let i = N - 1; i > 0; i--) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; const j = seed % (i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; }
      } else if (pattern === 'sorted') {
        // 已有序
      } else if (pattern === 'reverse') {
        a.reverse();
      } else if (pattern === 'few') {
        for (let i = 0; i < N; i++) a[i] = i % 5;
      }
      return a;
    }

    const algos = [
      { name: '插入排序', fn: insertionSort, theory: 'O(N²)', best: 'O(N)（近乎有序）' },
      { name: '归并排序', fn: mergeSort, theory: 'O(N log N)', best: 'O(N log N)' },
      { name: '快速排序（三数取中）', fn: quickSort, theory: 'O(N log N) 期望', best: 'O(N log N)' },
      { name: '堆排序', fn: heapSort, theory: 'O(N log N)', best: 'O(N log N)' },
    ];

    const nSlider = slider({ label: '数据规模 N', min: 2, max: 5, step: 0.1, value: Math.log10(state.N), format: (v) => fmtOps(Math.pow(10, v)), onInput: (v) => { state.N = Math.round(Math.pow(10, v)); run(); } });

    const patSelect = dom.h(
      'select',
      { class: 'cpl-select', 'aria-label': '数据分布' },
      [
        ['random', '随机'],
        ['sorted', '已经有序（插入排序的最好情况）'],
        ['reverse', '完全逆序（快排的坏情况之一）'],
        ['few', '大量重复（三路快排的场景）'],
      ].map(([v, label]) => dom.h('option', { value: v, text: label }))
    );
    patSelect.addEventListener('change', () => { state.pattern = patSelect.value; run(); });

    function run() {
      const N = state.N;
      const rows = [];
      const points = { random: [], sorted: [], reverse: [], few: [] };
      for (const algo of algos) {
        reset();
        const data = makeData(N, state.pattern);
        const t0 = performance.now();
        const sorted = algo.fn(data);
        const ms = performance.now() - t0;
        // 校验正确性（顺带统计）
        let ok = true;
        for (let i = 1; i < sorted.length; i++) if (sorted[i - 1] > sorted[i]) { ok = false; break; }
        rows.push([
          algo.name,
          algo.theory,
          ms.toFixed(2) + ' ms',
          counters.cmp.toLocaleString(),
          counters.swap.toLocaleString(),
          ok ? '✓' : '✗ 排序结果错误',
        ]);

        // 缩放到不同 N 的预计比较次数
        for (const n of [1e2, 1e3, 1e4, 1e5]) {
          const factor = algo.name.includes('插入') ? n * n / (N * N) : (n * Math.log2(n)) / (N * Math.log2(Math.max(N, 2)));
          points.random.push([n, counters.cmp * factor]);
        }
      }

      dom.clear(outHost);
      outHost.append(
        table(['算法', '最坏复杂度', '本机耗时', '比较次数', '交换次数', '结果'], rows),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '比较次数才是跨机器可比的量。注意"已经有序"这一行：插入排序退化成 O(N)，而朴素快排（不取中）会退化成 O(N²)——这就是选择基准的重要性。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [
          { name: '插入排序 ∝ N²', points: [1e2, 1e3, 1e4, 1e5].map((n) => [n, n * n]), color: '#e8590c' },
          { name: '归并/快排/堆排 ∝ N log N', points: [1e2, 1e3, 1e4, 1e5].map((n) => [n, n * Math.log2(n)]), color: '#0ca678' },
        ],
        xScale: 'log',
        yScale: 'log',
        xLabel: 'N（log）',
        yLabel: '比较次数量级（log）',
        height: 260,
        caption: '两条参考线的斜率差就是"平方"与"N log N"的差距。',
      });
    }

    host.append(
      panel('参数', nSlider.el, dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '数据分布' }), patSelect)),
      panel('实测对比', outHost),
      panel('量级参考线', canvasHost)
    );
    run();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 二分查找边界（lower_bound / upper_bound）
  // ═════════════════════════════════════════════════════════════
  demos.register('binary-search', (host, params) => {
    const state = { target: params.target ?? 3, array: [1, 2, 3, 3, 3, 5, 8, 8, 13, 21, 34] };
    const outHost = dom.h('div', {});
    const traceHost = dom.h('div', {});

    const arrInput = dom.h('input', { class: 'cpl-input', value: state.array.join(', '), 'aria-label': '有序数组' });
    const tInput = dom.h('input', { class: 'cpl-input', type: 'number', value: String(state.target), 'aria-label': '目标值' });

    function parseArr() {
      return arrInput.value
        .split(/[,\s]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n));
    }

    function lowerBound(a, x) {
      let lo = 0; let hi = a.length;
      const trace = [];
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        trace.push({ lo, hi, mid, a: a[mid], move: a[mid] < x ? 'lo = mid+1（mid 太小）' : 'hi = mid（mid 可能就是答案）' });
        if (a[mid] < x) lo = mid + 1;
        else hi = mid;
      }
      return { index: lo, trace };
    }

    function upperBound(a, x) {
      let lo = 0; let hi = a.length;
      const trace = [];
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        trace.push({ lo, hi, mid, a: a[mid], move: a[mid] <= x ? 'lo = mid+1（mid 还可以更右）' : 'hi = mid' });
        if (a[mid] <= x) lo = mid + 1;
        else hi = mid;
      }
      return { index: lo, trace };
    }

    function refresh() {
      const a = parseArr();
      const x = Number(tInput.value);
      dom.clear(outHost);
      dom.clear(traceHost);

      if (!a.length) {
        outHost.append(dom.errorCard('数组为空', '请输入至少一个数字。'));
        return;
      }
      const sorted = a.slice().sort((p, q) => p - q);
      const isSorted = a.every((v, i) => i === 0 || a[i - 1] <= v);

      const lb = lowerBound(a, x);
      const ub = upperBound(a, x);
      const exact = a.findIndex((v) => v === x);

      outHost.append(
        table(
          ['查询', '返回值', '含义', '元素是否存在'],
          [
            ['lower_bound(a, x)', lb.index, `第一个 >= ${x} 的位置（插入点）`, exact >= 0 ? `存在，首次出现在 ${exact}` : '不存在（可插入位置）'],
            ['upper_bound(a, x)', ub.index, `第一个 > ${x} 的位置`, exact >= 0 ? `存在，共 ${ub.index - lb.index} 个` : '不存在'],
            ['相等元素区间', `[${lb.index}, ${ub.index})`, `长度 ${ub.index - lb.index}`, '—'],
          ]
        ),
        !isSorted ? dom.h('div', { class: 'cpl-callout cpl-callout--caution' }, dom.h('div', { class: 'cpl-callout__body' }, dom.h('p', { text: '⚠ 输入数组不是有序的。二分查找的前提是有序，此时结果无意义。' }))) : null,
        dom.h('p', { class: 'cpl-demo__intro', text: `左闭右开区间写法下，循环条件用 lo < hi，退出时 lo == hi 就是答案。比较次数：⌈log₂(${a.length + 1})⌉ = ${Math.ceil(Math.log2(a.length + 1))} 次。` })
      );

      // 展示 lower_bound 的搜索过程
      const steps = dom.h('ol', { class: 'cpl-trace' });
      lb.trace.forEach((t, i) => {
        const inRange = t.mid >= t.lo && t.mid < t.hi;
        steps.append(
          dom.h(
            'li',
            { class: 'cpl-trace__item' },
            dom.h('span', { class: 'cpl-trace__idx', text: `#${i + 1}` }),
            dom.h('span', { class: 'cpl-mono', text: `lo=${t.lo} hi=${t.hi} mid=${t.mid} a[mid]=${t.a}` }),
            dom.h('span', { class: 'cpl-trace__move', text: ` → ${inRange ? t.move : '（区间收敛）'}` })
          )
        );
      });
      traceHost.append(dom.h('h4', { text: 'lower_bound 的搜索轨迹（每一步区间怎么收缩）' }), steps);
    }

    arrInput.addEventListener('input', util.debounce(refresh, 300));
    tInput.addEventListener('input', util.debounce(refresh, 300));

    host.append(
      panel('输入', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '有序数组（逗号分隔）' }), arrInput), dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '目标值 x' }), tInput)),
      panel('结果', outHost),
      panel('搜索过程', traceHost)
    );
    refresh();
  });

  // ═════════════════════════════════════════════════════════════
  // 图遍历：BFS / DFS / Dijkstra
  // ═════════════════════════════════════════════════════════════
  demos.register('graph-traverse', (host, params) => {
    const defaultEdges = params.edges || [
      [0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 5], [2, 3, 8], [3, 4, 3], [2, 4, 10], [4, 5, 2], [3, 5, 6],
    ];
    const edges = defaultEdges.slice();
    const n = Math.max(...edges.flatMap((e) => [e[0], e[1]])) + 1;

    const adj = new Map();
    for (let i = 0; i < n; i++) adj.set(i, []);
    for (const [u, v, w] of edges) {
      adj.get(u).push({ to: v, w });
      adj.get(v).push({ to: u, w });
    }

    const state = { source: 0, algo: 'dijkstra' };
    const outHost = dom.h('div', {});
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    let view = null;

    function bfs(src) {
      const dist = new Array(n).fill(Infinity);
      const order = [];
      const q = [src];
      dist[src] = 0;
      while (q.length) {
        const u = q.shift();
        order.push(u);
        for (const { to } of adj.get(u)) {
          if (dist[to] === Infinity) { dist[to] = dist[u] + 1; q.push(to); }
        }
      }
      return { dist, order, unit: '边数' };
    }

    function dfs(src) {
      const dist = new Array(n).fill(Infinity);
      const order = [];
      const stack = [src];
      dist[src] = 0;
      while (stack.length) {
        const u = stack.pop();
        order.push(u);
        for (const { to } of adj.get(u)) {
          if (dist[to] === Infinity) { dist[to] = dist[u] + 1; stack.push(to); }
        }
      }
      return { dist, order, unit: '边数（不保证最短）' };
    }

    function dijkstra(src) {
      const dist = new Array(n).fill(Infinity);
      const done = new Array(n).fill(false);
      const order = [];
      dist[src] = 0;
      for (let iter = 0; iter < n; iter++) {
        let u = -1;
        for (let i = 0; i < n; i++) if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
        if (u === -1 || dist[u] === Infinity) break;
        done[u] = true;
        order.push(u);
        for (const { to, w } of adj.get(u)) {
          if (dist[u] + w < dist[to]) dist[to] = dist[u] + w;
        }
      }
      return { dist, order, unit: '权重和' };
    }

    const srcSelect = dom.h('select', { class: 'cpl-select', 'aria-label': '起点' }, Array.from({ length: n }, (_, i) => dom.h('option', { value: String(i), text: `节点 ${i}` })));
    srcSelect.addEventListener('change', () => { state.source = Number(srcSelect.value); refresh(); });

    const patSelect = dom.h('select', { class: 'cpl-select', 'aria-label': '算法' },
      [['dijkstra', 'Dijkstra（非负权最短路径）'], ['bfs', 'BFS（按边数最短）'], ['dfs', 'DFS（深度优先）']].map(([v, t]) => dom.h('option', { value: v, text: t })));
    patSelect.addEventListener('change', () => { state.algo = patSelect.value; refresh(); });

    function refresh() {
      const src = state.source;
      const res = state.algo === 'dijkstra' ? dijkstra(src) : state.algo === 'bfs' ? bfs(src) : dfs(src);

      dom.clear(outHost);
      outHost.append(
        table(
          ['节点', '距离 / 层级', '是否可达'],
          Array.from({ length: n }, (_, i) => [String(i), res.dist[i] === Infinity ? '∞' : String(res.dist[i]), res.dist[i] === Infinity ? '不可达' : '可达'])
        ),
        dom.h('p', { class: 'cpl-demo__intro', text: `度量方式：${res.unit}。访问顺序：${res.order.join(' → ')}` }),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            state.algo === 'dijkstra'
              ? 'Dijkstra 的贪心前提是"已确定点的距离不会再被改进"。这条性质依赖所有边权非负——加一条负权边试试（把上面的边权改成负数），预测结果会发生什么。'
              : state.algo === 'bfs'
              ? 'BFS 只在"每条边代价相同"时给出最短路径（按边数）。边权不等时它给出的不是最小代价路径——这正是需要 Dijkstra 的原因。'
              : 'DFS 用栈实现，访问顺序依赖邻居的入栈顺序。它的用途是连通性、拓扑排序、找环，而不是最短路径。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      // 把每个节点的距离画成柱状（用 plot.bars 更直观）
      plot.bars(canvasHost, {
        items: Array.from({ length: n }, (_, i) => ({
          label: `节点 ${i}`,
          value: res.dist[i] === Infinity ? 0 : res.dist[i],
          color: i === src ? '#0ca678' : res.dist[i] === Infinity ? '#c2255c' : '#3b5bdb',
        })),
        max: Math.max(...res.dist.filter(Number.isFinite), 1),
      });
    }

    host.append(
      panel('参数', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '算法' }), patSelect), dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '起点' }), srcSelect)),
      panel('结果', outHost),
      panel('到各节点的距离', canvasHost)
    );
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 动态规划表格（背包 / LIS / 编辑距离）
  // ═════════════════════════════════════════════════════════════
  demos.register('dp-table', (host, params) => {
    const state = { items: params.items || [[2, 3], [3, 4], [4, 5], [5, 6]], capacity: params.capacity || 8, show: 'knapsack' };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});

    function knapsack(items, capacity) {
      const n = items.length;
      const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
      for (let i = 1; i <= n; i++) {
        const [w, v] = items[i - 1];
        for (let c = 0; c <= capacity; c++) {
          dp[i][c] = dp[i - 1][c];
          if (c >= w && dp[i - 1][c - w] + v > dp[i][c]) dp[i][c] = dp[i - 1][c - w] + v;
        }
      }
      // 回溯选中的物品
      const chosen = [];
      let c = capacity;
      for (let i = n; i >= 1; i--) {
        if (dp[i][c] !== dp[i - 1][c]) { chosen.push(i - 1); c -= items[i - 1][0]; }
      }
      return { dp, value: dp[n][capacity], chosen: chosen.reverse() };
    }

    function lis(arr) {
      const n = arr.length;
      const dp = new Array(n).fill(1);
      const prev = new Array(n).fill(-1);
      for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
          if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) { dp[i] = dp[j] + 1; prev[i] = j; }
        }
      }
      let best = 0;
      for (let i = 1; i < n; i++) if (dp[i] > dp[best]) best = i;
      const seq = [];
      for (let k = best; k !== -1; k = prev[k]) seq.push(arr[k]);
      return { dp: [dp], value: dp[best] || 0, seq: seq.reverse() };
    }

    function editDistance(a, b) {
      const m = a.length;
      const n = b.length;
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
      return { dp, value: dp[m][n] };
    }

    function refresh() {
      dom.clear(outHost);
      if (state.show === 'knapsack') {
        const r = knapsack(state.items, state.capacity);
        outHost.append(
          dom.h('p', { text: `物品（重量, 价值）：${state.items.map(([w, v]) => `(${w},${v})`).join(' ')} · 背包容量 ${state.capacity}` }),
          dom.h('p', {}, dom.h('strong', { text: `最大价值 = ${r.value}` }), dom.h('span', { text: ` · 选中的物品下标：${r.chosen.join(', ') || '（无）'}` })),
          dpTable(r.dp, ['i \\ c', ...Array.from({ length: state.capacity + 1 }, (_, c) => String(c))], ['0', ...state.items.map((_, i) => `物品${i + 1}`)], r.dp)
        );
      } else if (state.show === 'lis') {
        const arr = [10, 9, 2, 5, 3, 7, 101, 18];
        const r = lis(arr);
        outHost.append(
          dom.h('p', { text: `数组：${arr.join(', ')}` }),
          dom.h('p', {}, dom.h('strong', { text: `最长递增子序列长度 = ${r.value}` }), dom.h('span', { text: ` · 一个解：${r.seq.join(' → ')}` })),
          dpTable(r.dp, ['i', ...arr.map((_, i) => String(i))], ['dp[i]'], r.dp)
        );
      } else {
        const a = 'kitten';
        const b = 'sitting';
        const r = editDistance(a, b);
        outHost.append(
          dom.h('p', { text: `把 "${a}" 变成 "${b}"` }),
          dom.h('p', {}, dom.h('strong', { text: `编辑距离 = ${r.value}` })),
          dpTable(r.dp, ['', ...b.split('')], ['', ...a.split('')], r.dp)
        );
      }
    }

    function dpTable(dp, colHeaders, rowHeaders, values) {
      const max = Math.max(...values.flat(), 1);
      const tableEl = dom.h('table', { class: 'cpl-table cpl-table--compact cpl-dptable' });
      const head = dom.h('tr', {}, colHeaders.map((h) => dom.h('th', { text: String(h) })));
      tableEl.append(dom.h('thead', {}, head));
      const body = dom.h('tbody');
      for (let i = 0; i < dp.length; i++) {
        const tr = dom.h('tr', {}, dom.h('th', { text: String(rowHeaders[i] ?? i) }));
        for (let j = 0; j < dp[i].length; j++) {
          const ratio = max ? dp[i][j] / max : 0;
          tr.append(
            dom.h('td', {
              style: { background: `color-mix(in srgb, var(--cpl-accent) ${Math.round(ratio * 55)}%, var(--cpl-bg-elev))` },
              title: `dp[${i}][${j}] = ${dp[i][j]}`,
              text: String(dp[i][j]),
            })
          );
        }
        body.append(tr);
      }
      tableEl.append(body);
      return dom.h('div', { class: 'cpl-table-wrap' }, tableEl);
    }

    const capSlider = slider({ label: '背包容量', min: 3, max: 15, step: 1, value: state.capacity, format: (v) => String(Math.round(v)), onInput: (v) => { state.capacity = Math.round(v); refresh(); } });
    const kindSel = dom.h('select', { class: 'cpl-select', 'aria-label': 'DP 问题' },
      [['knapsack', '0/1 背包'], ['lis', '最长递增子序列 LIS'], ['edit', '编辑距离']].map(([v, t]) => dom.h('option', { value: v, text: t })));
    kindSel.addEventListener('change', () => { state.show = kindSel.value; refresh(); });

    host.append(panel('参数', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: 'DP 问题' }), kindSel), capSlider.el), panel('DP 表格（颜色深浅 = 数值大小）', outHost), panel(null, canvasHost));
    refresh();
  });

  // ═════════════════════════════════════════════════════════════
  // 缓存命中率与延迟
  // ═════════════════════════════════════════════════════════════
  demos.register('cache-hit', (host, params) => {
    const state = { hit: params.hit || 0.8, hitsMs: params.hitMs || 1, missMs: params.missMs || 100, qps: params.qps || 1000 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    function refresh() {
      const avg = state.hit * state.hitsMs + (1 - state.hit) * state.missMs;
      const p99Approx = state.missMs; // 最坏情况近似
      const loadOnBackend = state.qps * (1 - state.hit);

      dom.clear(outHost);
      outHost.append(
        table(
          ['指标', '数值', '说明'],
          [
            ['平均延迟', `${avg.toFixed(2)} ms`, `${state.hit.toFixed(2)}×${state.hitsMs} + ${(1 - state.hit).toFixed(2)}×${state.missMs}`],
            ['尾延迟（未命中时）', `${p99Approx} ms`, '这是用户实际感受到的"偶尔卡一下"'],
            ['后端 QPS', loadOnBackend.toFixed(0), `缓存挡掉了 ${(state.hit * 100).toFixed(0)}% 的请求`],
            ['命中率再提升 5% 的收益', `${(avg - ((state.hit + 0.05) * state.hitsMs + (1 - state.hit - 0.05) * state.missMs)).toFixed(2)} ms`, avg > 0 ? `降低 ${(((avg - ((state.hit + 0.05) * state.hitsMs + (1 - state.hit - 0.05) * state.missMs)) / avg) * 100).toFixed(0)}%` : '—'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text: `关键数量级直觉：命中率从 80% 提到 95%，平均延迟从 ${(0.8 * 1 + 0.2 * 100).toFixed(1)} ms 降到 ${(0.95 * 1 + 0.05 * 100).toFixed(2)} ms——命中率的小幅提升在高未命中代价下收益极大。这也是"缓存不是优化，而是架构"的原因。`,
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const pts = [];
      for (let h = 0; h <= 1.0001; h += 0.02) pts.push([h, h * state.hitsMs + (1 - h) * state.missMs]);
      view = plot.mount(canvasHost, {
        series: [
          { name: '平均延迟', points: pts, color: '#3b5bdb' },
          { name: `当前命中率 ${(state.hit * 100).toFixed(0)}%`, points: [[state.hit, avg]], color: '#c2255c', type: 'scatter' },
        ],
        xScale: 'linear',
        yScale: 'linear',
        xLabel: '缓存命中率',
        yLabel: '平均延迟 (ms)',
        height: 260,
        caption: '曲线左端陡峭：命中率低于 80% 时，每掉几个百分点延迟就明显上升。',
      });
    }

    const hSlider = slider({ label: '命中率', min: 0, max: 100, step: 1, value: Math.round(state.hit * 100), format: (v) => `${Math.round(v)}%`, onInput: (v) => { state.hit = Number(v) / 100; refresh(); } });
    const hitSlider = slider({ label: '命中耗时 (ms)', min: 0.1, max: 20, step: 0.1, value: state.hitsMs, format: (v) => `${Number(v).toFixed(1)} ms`, onInput: (v) => { state.hitsMs = Number(v); refresh(); } });
    const missSlider = slider({ label: '未命中耗时 (ms)', min: 5, max: 2000, step: 5, value: state.missMs, format: (v) => `${Math.round(v)} ms`, onInput: (v) => { state.missMs = Number(v); refresh(); } });
    const qpsSlider = slider({ label: '总 QPS', min: 10, max: 100000, step: 10, value: state.qps, format: (v) => `${Math.round(v)}/s`, onInput: (v) => { state.qps = Math.round(v); refresh(); } });

    host.append(panel('参数', hSlider.el, hitSlider.el, missSlider.el, qpsSlider.el), panel('延迟与负载', outHost), panel('命中率-延迟曲线', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // CAP 权衡滑块
  // ═════════════════════════════════════════════════════════════
  demos.register('cap-tradeoff', (host) => {
    const state = { partition: true, choice: 'CP', scenario: 'transfer' };
    const outHost = dom.h('div', {});

    const scenarios = {
      transfer: {
        name: '银行转账',
        write: '扣款与入账必须同时成功或同时失败',
        tolerant: false,
        reason: '出现"钱扣了但对方没收到，且系统认为成功"是不可接受的。因此分区期间宁可拒绝服务（选 CP）。',
      },
      feed: {
        name: '社交动态 / 点赞数',
        write: '发一条动态、点一个赞',
        tolerant: true,
        reason: '点赞数短暂不一致没人会受伤，但发不出内容用户立刻走人。因此选 AP，用最终一致收尾。',
      },
      inventory: {
        name: '秒杀库存扣减',
        write: '库存 -1（不能超卖）',
        tolerant: false,
        reason: '超卖要赔付、要道歉。选 CP：分区时拒绝下单，或者用预扣 + 异步确认。',
      },
      iot: {
        name: '传感器数据上报',
        write: '温度读数入库',
        tolerant: true,
        reason: '丢几个点比全部丢弃好。选 AP，允许短暂丢失/乱序，后续用时间戳校正。',
      },
    };

    function refresh() {
      const s = scenarios[state.scenario];
      const p = state.partition;
      const consistent = p ? state.choice === 'CP' : true;
      const available = p ? state.choice === 'AP' : true;

      dom.clear(outHost);
      outHost.append(
        table(
          ['维度', '当前状态', '说明'],
          [
            ['场景', s.name, s.write],
            ['是否发生网络分区 (P)', p ? '是' : '否', p ? '分区不可避免，此时必须在 C 与 A 之间取舍' : '没有分区时，C 与 A 可以同时满足'],
            ['一致性 (C)', consistent ? '保证' : '放弃（允许读到旧数据）', consistent ? '分区期间拒绝部分请求以维持一致' : '分区两侧各自继续服务，事后合并'],
            ['可用性 (A)', available ? '保证' : '放弃（返回错误）', available ? '所有请求都有响应（可能是旧数据）' : '部分请求返回失败'],
            ['业务是否容忍不一致', s.tolerant ? '容忍' : '不容忍', '这一条决定了正确选择'],
            ['结论', s.tolerant ? '选 AP（或最终一致）' : '选 CP（宁可拒绝服务）', s.reason],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text: p && state.choice === (s.tolerant ? 'CP' : 'AP')
            ? '⚠ 当前选择与业务语义不匹配。CAP 的取舍由"业务能不能容忍不一致"决定，不是技术偏好。'
            : '当前选择与业务语义一致。',
        })
      );
    }

    const scenSel = dom.h('select', { class: 'cpl-select', 'aria-label': '业务场景' },
      Object.entries(scenarios).map(([k, v]) => dom.h('option', { value: k, text: v.name })));
    scenSel.addEventListener('change', () => { state.scenario = scenSel.value; refresh(); });

    const partBox = checkbox({ label: '模拟网络分区发生', checked: state.partition, onChange: (v) => { state.partition = v; refresh(); } });
    const chooseBtns = dom.h('div', { class: 'cpl-demo__actions' });
    for (const [value, label] of [['CP', '优先一致性（拒绝部分请求）'], ['AP', '优先可用性（允许旧数据）']]) {
      chooseBtns.append(
        dom.h('button', {
          class: `cpl-btn cpl-btn--sm${state.choice === value ? ' cpl-btn--primary' : ''}`,
          type: 'button',
          text: label,
          dataset: { choice: value },
          onclick: () => {
            state.choice = value;
            for (const b of chooseBtns.children) b.classList.toggle('cpl-btn--primary', b.dataset.choice === value);
            refresh();
          },
        })
      );
    }

    host.append(panel('参数', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '业务场景' }), scenSel), dom.h('div', { class: 'cpl-demo__toggles' }, partBox), dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '分区期间的选择' }), chooseBtns)), panel('权衡结果', outHost));
    refresh();
  });

  // ═════════════════════════════════════════════════════════════
  // Fortran 数组：循环顺序与内存布局
  // ═════════════════════════════════════════════════════════════
  demos.register('fortran-layout', (host, params) => {
    const state = { n: params.n || 512 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    const nSlider = slider({ label: '矩阵阶数 n（n×n）', min: 64, max: 2048, step: 64, value: state.n, format: (v) => `${Math.round(v)} × ${Math.round(v)} = ${(Math.round(v) ** 2 / 1e6).toFixed(2)} M 元素`, onInput: (v) => { state.n = Math.round(v); refresh(); } });

    function measure() {
      const n = state.n;
      // Fortran 列主序：内存里 A[i + j*n]（i 连续）
      const A = new Float64Array(n * n);
      for (let i = 0; i < A.length; i++) A[i] = (i % 97) * 0.01;

      // 列优先遍历（Fortran 的正确顺序：内层走 i）
      let t0 = performance.now();
      let s1 = 0;
      for (let j = 0; j < n; j++) {
        const base = j * n;
        for (let i = 0; i < n; i++) s1 += A[base + i];
      }
      const colMajor = performance.now() - t0;

      // 行优先遍历（在列主序存储上是"错误"顺序：内层走 j，跨步 n）
      t0 = performance.now();
      let s2 = 0;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) s2 += A[j * n + i];
      }
      const rowMajor = performance.now() - t0;

      void s1; void s2;
      return { colMajor, rowMajor, ratio: rowMajor / Math.max(colMajor, 0.001) };
    }

    function refresh() {
      const r = measure();
      const n = state.n;
      const bytes = n * n * 8;

      dom.clear(outHost);
      outHost.append(
        table(
          ['遍历顺序', '本机实测', '相对倍数', '说明'],
          [
            ['内层走 i（Fortran 正确顺序）', `${r.colMajor.toFixed(2)} ms`, '1.00×', '内存连续，每条 cache line 用满'],
            ['内层走 j（顺序写反）', `${r.rowMajor.toFixed(2)} ms`, `${r.ratio.toFixed(2)}×`, '跨步 n×8 字节，每次搬 cache line 只用 8 字节'],
          ]
        ),
        dom.h('p', { class: 'cpl-demo__intro', text: `数据量：${n}×${n} float64 = ${util.bytes(bytes)}。此时已经远超 L2/L3 缓存容量，所以顺序的影响会被放大。` }),
        dom.h(
          'div',
          { class: 'cpl-callout cpl-callout--physics' },
          dom.h('div', { class: 'cpl-callout__head' }, dom.h('span', { class: 'cpl-callout__icon', text: '⚛' }), dom.h('span', { class: 'cpl-callout__title', text: '对应到 Fortran 代码' })),
          dom.h(
            'div',
            { class: 'cpl-callout__body' },
            dom.h('pre', { class: 'cpl-pre', html: CPL.highlight ? CPL.highlight.render(
              '! 正确：内层走第一个下标（列主序连续）\n' +
                'do j = 1, n\n  do i = 1, n\n    s = s + A(i, j)\n  end do\nend do\n\n' +
                '! 慢：内层走第二个下标（每次跨 n 个元素）\n' +
                'do i = 1, n\n  do j = 1, n\n    s = s + A(i, j)\n  end do\nend do',
              'fortran'
            ) : '' })
          )
        )
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const sizes = [64, 128, 256, 512, 1024, 2048].filter((s) => s <= 2048);
      const ptsCol = [];
      const ptsRow = [];
      for (const s of sizes) {
        // 用当前测得的"每元素代价"外推（避免这里再跑 6 次大循环）
        const cells = s * s;
        const curCells = n * n;
        ptsCol.push([cells, (r.colMajor / curCells) * cells]);
        ptsRow.push([cells, (r.rowMajor / curCells) * cells]);
      }
      view = plot.mount(canvasHost, {
        series: [
          { name: '列优先（内层 i）', points: ptsCol, color: '#0ca678' },
          { name: '行优先（内层 j）', points: ptsRow, color: '#c2255c' },
        ],
        xScale: 'log',
        yScale: 'log',
        xLabel: '矩阵元素数（log）',
        yLabel: '预计耗时 ms（log）',
        height: 260,
        caption: '两条线斜率相同（都是 O(N²) 次加法），但截距差好几倍——差距来自缓存，不来自算法。',
      });
    }

    const btn = dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '重新测量', onclick: () => { btn.disabled = true; setTimeout(() => { refresh(); btn.disabled = false; }, 20); } });

    host.append(panel('参数', nSlider.el, dom.h('div', { class: 'cpl-demo__actions' }, btn)), panel('实测', outHost), panel('缩放', canvasHost));
    host.append(panel('脚本演示', dom.h('div', { class: 'cpl-demo__actions' },
      dom.h('button', { class: 'cpl-btn cpl-btn--sm', type: 'button', text: '复制 Fortran 测试代码', onclick: async (e) => {
        const code = 'program layout_bench\n  implicit none\n  integer, parameter :: dp = kind(1.0d0)\n  integer :: n, i, j\n  real(dp), allocatable :: A(:,:)\n  real(dp) :: s, t0, t1\n  n = 1024\n  allocate(A(n,n))\n  call random_number(A)\n\n  ! 列优先：内层走 i\n  call cpu_time(t0)\n  s = 0.0_dp\n  do j = 1, n\n    do i = 1, n\n      s = s + A(i,j)\n    end do\n  end do\n  call cpu_time(t1)\n  write(*,\'(A,F10.4,A)\') " column-major: ", t1-t0, " s"\n\n  ! 行优先：内层走 j\n  call cpu_time(t0)\n  s = 0.0_dp\n  do i = 1, n\n    do j = 1, n\n      s = s + A(i,j)\n    end do\n  end do\n  call cpu_time(t1)\n  write(*,\'(A,F10.4,A)\') " row-major:    ", t1-t0, " s"\n  deallocate(A)\nend program layout_bench';
        const ok = await dom.copyToClipboard(code);
        e.target.textContent = ok ? '已复制' : '失败';
        setTimeout(() => { e.target.textContent = '复制 Fortran 测试代码'; }, 1600);
      } }),
      dom.h('code', { class: 'cpl-code-inline', text: 'gfortran -O3 layout.f90 -o layout && ./layout' })
    )));
    btn.disabled = true;
    setTimeout(() => { refresh(); btn.disabled = false; }, 30);
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // Monte Carlo 收敛：误差 ~ 1/√N
  // ═════════════════════════════════════════════════════════════
  demos.register('monte-carlo', (host) => {
    const state = { N: 100000, dim: 1 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;
    let rng = 123456789;
    const rand = () => {
      rng ^= rng << 13; rng >>>= 0;
      rng ^= rng >> 17;
      rng ^= rng << 5; rng >>>= 0;
      return rng / 4294967296;
    };

    const nSlider = slider({
      label: '采样数 N',
      min: 2,
      max: 7,
      step: 0.1,
      value: Math.log10(state.N),
      format: (v) => `10^${Number(v).toFixed(1)} ≈ ${fmtOps(Math.pow(10, v))}`,
      onInput: (v) => { state.N = Math.round(Math.pow(10, v)); refresh(); },
    });
    const dSel = dom.h('select', { class: 'cpl-select', 'aria-label': '积分维度' },
      [[1, '∫₀¹ x² dx = 1/3（1 维）'], [4, '4 维超立方体上的同类积分'], [8, '8 维（维数灾难演示）']].map(([v, t]) => dom.h('option', { value: String(v), text: t })));
    dSel.addEventListener('change', () => { state.dim = Number(dSel.value); refresh(); });

    function refresh() {
      const N = state.N;
      const dim = state.dim;
      const exact = 1 / 3;
      rng = 123456789;
      let sum = 0;
      let sumSq = 0;
      const trace = [];
      const step = Math.max(1, Math.floor(N / 120));
      for (let i = 1; i <= N; i++) {
        let v = 1;
        for (let d = 0; d < dim; d++) {
          const u = rand();
          v *= u * u;
        }
        sum += v;
        sumSq += v * v;
        if (i % step === 0 || i === N) {
          const mean = sum / i;
          trace.push([i, Math.abs(mean - exact) || 1e-12]);
        }
      }
      const mean = sum / N;
      const variance = sumSq / N - mean * mean;
      const stderr = Math.sqrt(Math.max(variance, 0) / N);
      const error = Math.abs(mean - exact);

      dom.clear(outHost);
      outHost.append(
        table(
          ['量', '数值', '说明'],
          [
            ['精确值', exact.toFixed(10), dim === 1 ? '∫₀¹ x² dx' : `${dim} 维类比`],
            ['MC 估计', mean.toFixed(10), `N = ${N.toLocaleString()}`],
            ['实际误差', error.toExponential(3), '—'],
            ['理论标准误 σ/√N', stderr.toExponential(3), `σ ≈ ${Math.sqrt(Math.max(variance, 0)).toFixed(4)}`],
            ['误差是否在 1σ 内', error <= stderr ? '是 ✓' : error <= 3 * stderr ? '在 3σ 内' : '超出 3σ（检查随机数质量）', 'MC 误差是随机的，偶尔超出 1σ 正常'],
            ['误差量级 ~ N^(-1/2)', `${(error * Math.sqrt(N)).toFixed(4)}`, '这个乘积应大致稳定在 σ 附近'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '关键结论：**Monte Carlo 的误差按 1/√N 下降，与维度无关。** 这是它在高维问题上胜过网格法的原因——但也意味着想多要一位有效数字，采样数要乘 100。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [
          { name: '实测误差', points: trace, color: '#3b5bdb' },
          {
            name: '参考线 ∝ N^(-1/2)',
            points: trace.map(([n]) => [n, Math.max(stderr * Math.sqrt(N) / Math.sqrt(n), 1e-12)]),
            color: '#c2255c',
            dash: true,
          },
        ],
        xScale: 'log',
        yScale: 'log',
        xLabel: '采样数 N（log）',
        yLabel: '误差（log）',
        height: 280,
        fitSlope: true,
        caption: '拟合斜率应接近 −0.5。这是"误差 ∝ 1/√N"的直接证据。',
      });
    }

    host.append(panel('参数', nSlider.el, dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '维度' }), dSel)), panel('数值对照', outHost), panel('误差收敛', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 并行加速比（Amdahl 定律 + 实测模型）
  // ═════════════════════════════════════════════════════════════
  demos.register('amdahl', (host) => {
    const state = { parallelFraction: 0.9, cores: 8, overheadPerCore: 0.02 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    function speedup(p, n, overhead) {
      // Amdahl + 线性通信开销项：现实里加速比会先升后降
      const ideal = 1 / ((1 - p) + p / n);
      return ideal / (1 + overhead * (n - 1));
    }

    function refresh() {
      const p = state.parallelFraction;
      const maxIdeal = 1 / (1 - p);
      const rows = [1, 2, 4, 8, 16, 32, 64, 128].map((n) => {
        const s = speedup(p, n, state.overheadPerCore);
        return [String(n), s.toFixed(2), `${((s / n) * 100).toFixed(0)}%`, n > 1 ? `${(Math.min(1 / (1 - p), n) - s).toFixed(2)}` : '—'];
      });

      dom.clear(outHost);
      outHost.append(
        table(['核数 n', '加速比 S(n)', '并行效率 S/n', '与理想值的差距'], rows),
        dom.h('p', { class: 'cpl-demo__intro', text: `不可并行部分占 ${((1 - p) * 100).toFixed(0)}%，所以 Amdahl 上限是 ${maxIdeal.toFixed(2)}×。即使核数到无穷，也突破不了这个数。` })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      const ns = Array.from({ length: 60 }, (_, i) => 1 + i * 2);
      view = plot.mount(canvasHost, {
        series: [
          { name: '理想线性加速', points: ns.map((n) => [n, n]), color: '#868e96', dash: true },
          { name: `Amdahl 上限 ${maxIdeal.toFixed(1)}×`, points: ns.map((n) => [n, maxIdeal]), color: '#a45c00', dash: true },
          { name: 'Amdahl（无开销）', points: ns.map((n) => [n, 1 / ((1 - p) + p / n)]), color: '#3b5bdb' },
          { name: `含通信开销 ${(state.overheadPerCore * 100).toFixed(0)}%/核`, points: ns.map((n) => [n, speedup(p, n, state.overheadPerCore)]), color: '#c2255c' },
        ],
        xScale: 'log',
        yScale: 'log',
        xLabel: '核数 n（log）',
        yLabel: '加速比（log）',
        height: 300,
        caption: '红线的下降段就是"加核反而更慢"——现实中 MPI 程序常见这个形状。',
      });
    }

    const pSlider = slider({ label: '可并行比例', min: 50, max: 99, step: 0.5, value: state.parallelFraction * 100, format: (v) => `${Number(v).toFixed(1)}%`, onInput: (v) => { state.parallelFraction = Number(v) / 100; refresh(); } });
    const cSlider = slider({ label: '核心数', min: 1, max: 128, step: 1, value: state.cores, format: (v) => String(Math.round(v)), onInput: (v) => { state.cores = Math.round(v); refresh(); } });
    const oSlider = slider({ label: '每核通信开销', min: 0, max: 20, step: 0.5, value: state.overheadPerCore * 100, format: (v) => `${Number(v).toFixed(1)}%`, onInput: (v) => { state.overheadPerCore = Number(v) / 100; refresh(); } });

    host.append(panel('参数', pSlider.el, cSlider.el, oSlider.el), panel('加速比表', outHost), panel('加速比曲线', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 数值格式对照（float32 / float64 / 累加误差）
  // ═════════════════════════════════════════════════════════════
  demos.register('float-format', (host) => {
    const outHost = dom.h('div', {});
    const input = dom.h('input', { class: 'cpl-input', value: '0.1', 'aria-label': '要检查的数值' });
    const countSlider = slider({ label: '累加次数', min: 1, max: 7, step: 1, value: 6, format: (v) => fmtOps(Math.pow(10, Math.round(v))), onInput: () => refresh() });

    function refresh() {
      const v = Number(input.value) || 0;
      const n = Math.round(Math.pow(10, Number(countSlider.input.value)));

      const f32 = new Float32Array(1);
      f32[0] = v;
      const asF32 = f32[0];

      // float32 累加
      const arr32 = new Float32Array(n);
      arr32.fill(asF32);
      let s32 = 0;
      for (let i = 0; i < n; i++) s32 = Math.fround(s32 + arr32[i]);

      // float64 累加
      let s64 = 0;
      for (let i = 0; i < n; i++) s64 += v;

      // Kahan
      let sk = 0;
      let c = 0;
      for (let i = 0; i < n; i++) {
        const y = v - c;
        const t = sk + y;
        c = t - sk - y;
        sk = t;
      }

      const exact = v * n;
      const rel = (x) => (exact !== 0 ? Math.abs((x - exact) / exact) : 0);

      dom.clear(outHost);
      outHost.append(
        table(
          ['表示 / 累加方式', '结果', '相对误差', '说明'],
          [
            ['精确值 v × n', exact.toPrecision(17), '0', '数学上的结果'],
            ['float32 单次表示', asF32.toPrecision(9), rel(asF32 - v + v) === 0 ? `${Math.abs(asF32 - v).toExponential(2)}（绝对）` : '—', `float32 的相对精度 ε ≈ ${Number.EPSILON.toExponential(1)}（其实是 float64）`],
            ['float32 累加', s32.toPrecision(9), rel(s32).toExponential(3), '误差 ∝ n·ε₃₂，ε₃₂ ≈ 1.2e-7'],
            ['float64 累加（朴素）', s64.toPrecision(17), rel(s64).toExponential(3), '误差 ∝ n·ε₆₄，ε₆₄ ≈ 2.2e-16'],
            ['float64 累加（Kahan）', sk.toPrecision(17), rel(sk).toExponential(3), '补偿求和，误差基本与 n 无关'],
            ['机器 epsilon (float64)', Number.EPSILON.toExponential(6), '—', '1 + ε/2 ≠ 1 的最小 ε'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '把累加次数的滑块拉大，观察误差怎么长：**朴素累加是随 n 线性增长的，Kahan 基本不动。** 这不是"浮点不精确"这种笼统结论，而是可预测的 n·ε 量级——所以你可以事先估计它会不会毁掉你的结果。',
        })
      );
    }

    input.addEventListener('input', util.debounce(refresh, 250));
    host.append(panel('参数', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '被累加的值 v' }), input), countSlider.el), panel('数值对照', outHost));
    refresh();
  });

  // ═════════════════════════════════════════════════════════════
  // 收敛阶研究：误差 vs 步长 log-log
  // ═════════════════════════════════════════════════════════════
  demos.register('convergence-study', (host, params) => {
    const state = { scheme: params.scheme || 'rk4', T: 1.0 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    // 用 y' = -y, y(0) = 1，精确解 e^{-t} 做收敛研究
    function solve(scheme, h) {
      const n = Math.round(state.T / h);
      let y = 1;
      let t = 0;
      for (let i = 0; i < n; i++) {
        const f = (tt, yy) => -yy;
        if (scheme === 'euler') {
          y = y + h * f(t, y);
        } else if (scheme === 'heun') {
          const k1 = f(t, y);
          const k2 = f(t + h, y + h * k1);
          y = y + (h / 2) * (k1 + k2);
        } else if (scheme === 'rk4') {
          const k1 = f(t, y);
          const k2 = f(t + h / 2, y + (h / 2) * k1);
          const k3 = f(t + h / 2, y + (h / 2) * k2);
          const k4 = f(t + h, y + h * k3);
          y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
        }
        t += h;
      }
      return y;
    }

    const SCHEMES = {
      euler: { name: '前向欧拉（一阶）', theory: 1 },
      heun: { name: 'Heun / 梯形法（二阶）', theory: 2 },
      rk4: { name: '经典 RK4（四阶）', theory: 4 },
    };

    const exact = Math.exp(-state.T);

    const sel = dom.h('select', { class: 'cpl-select', 'aria-label': '时间推进格式' },
      Object.entries(SCHEMES).map(([k, v]) => dom.h('option', { value: k, text: v.name, selected: k === state.scheme })));
    sel.addEventListener('change', () => { state.scheme = sel.value; refresh(); });

    function refresh() {
      const hs = [];
      for (let k = 2; k <= 7; k++) hs.push(Math.pow(10, -k / 2));
      const errors = hs.map((h) => Math.abs(solve(state.scheme, h) - exact));
      const lx = hs.map((h) => Math.log10(h));
      const ly = errors.map((e) => Math.log10(Math.max(e, 1e-17)));
      const slope = util.slope(lx, ly);
      const r = util.pearson(lx, ly);

      dom.clear(outHost);
      outHost.append(
        table(
          ['步长 h', '数值解', '绝对误差', 'log₁₀(误差)'],
          hs.map((h, i) => [h.toExponential(1), solve(state.scheme, h).toPrecision(10), errors[i].toExponential(3), ly[i].toFixed(4)])
        ),
        table(
          ['量', '数值', '说明'],
          [
            ['拟合斜率', slope.toFixed(4), '斜率 ≈ 收敛阶（负号只表示 h 减小时误差减小）'],
            ['相关系数 r', Number.isFinite(r) ? r.toFixed(6) : 'n/a', '接近 −1 才说明确实是幂律关系'],
            ['理论阶数', String(SCHEMES[state.scheme].theory), '对应格式的名义精度'],
            ['实测阶数', Math.abs(slope).toFixed(2), Math.abs(Math.abs(slope) - SCHEMES[state.scheme].theory) < 0.25 ? '✓ 与理论一致' : '⚠ 与理论不符，检查 h 是否进入渐近区'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '如果实测阶数低于理论值，常见原因：h 还不够小（未进入渐近区）、右端函数不够光滑、或者最差的那一环（往往是一阶的边界处理）在拖后腿。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [
          { name: `${SCHEMES[state.scheme].name} 实测`, points: hs.map((h, i) => [h, Math.max(errors[i], 1e-17)]), color: '#3b5bdb' },
          { name: `参考斜率 ${SCHEMES[state.scheme].theory}`, points: hs.map((h) => [h, Math.pow(h, SCHEMES[state.scheme].theory)]), color: '#868e96', dash: true },
        ],
        xScale: 'log',
        yScale: 'log',
        xLabel: '步长 h（log）',
        yLabel: '绝对误差（log）',
        height: 300,
        caption: '斜率就是收敛阶。灰虚线是理论参考线，两条平行即说明格式达到了名义阶数。',
      });
    }

    host.append(panel('参数', dom.h('div', { class: 'cpl-field' }, dom.h('span', { class: 'cpl-label', text: '时间推进格式（求解 y\' = −y）' }), sel), dom.h('p', { class: 'cpl-muted', text: `精确解 y(${state.T}) = e^(−${state.T}) = ${exact.toPrecision(12)}` })), panel('误差表与拟合', outHost), panel('log-log 收敛图', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 稳定性：显式扩散的稳定性条件
  // ═════════════════════════════════════════════════════════════
  demos.register('stability-diffusion', (host) => {
    const state = { N: 50, r: 0.4, steps: 200 };
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    const outHost = dom.h('div', {});
    let view = null;

    function run() {
      const N = state.N;
      const r = state.r;
      let u = new Float64Array(N);
      // 初始：中心一个尖峰
      for (let i = 0; i < N; i++) u[i] = Math.abs(i - N / 2) < 2 ? 1 : 0;
      const initial = Array.from(u);
      let maxVal = 1;
      let minVal = 0;
      let blewUp = false;
      const energyTrace = [];

      for (let s = 0; s < state.steps; s++) {
        const next = new Float64Array(N);
        // Dirichlet 边界 (u=0)
        next[0] = 0;
        next[N - 1] = 0;
        for (let i = 1; i < N - 1; i++) {
          next[i] = u[i] + r * (u[i - 1] - 2 * u[i] + u[i + 1]);
        }
        u = next;
        const l2 = Math.sqrt(u.reduce((a, v) => a + v * v, 0) / N);
        energyTrace.push([s + 1, Math.max(l2, 1e-16)]);
        maxVal = Math.max(maxVal, ...u);
        minVal = Math.min(minVal, ...u);
        if (!Number.isFinite(maxVal) || Math.abs(maxVal) > 1e6) { blewUp = true; break; }
      }

      const stable = r <= 0.5;
      dom.clear(outHost);
      outHost.append(
        table(
          ['量', '数值', '说明'],
          [
            ['显式格式参数 r = αΔt/Δx²', r.toFixed(3), '稳定性条件由它决定'],
            ['稳定性条件', 'r ≤ 0.5', '一维显式 FTCS 的 von Neumann 条件'],
            ['当前状态', stable ? '稳定' : '不稳定（应当发散）', stable ? '解的光滑化符合物理' : '高频模态被放大，数值解爆炸'],
            ['最大值', Number.isFinite(maxVal) ? maxVal.toExponential(3) : '∞', '初始最大值为 1'],
            ['最小值', Number.isFinite(minVal) ? minVal.toExponential(3) : '−∞', '物理上应当非负且不超过初值'],
            ['是否爆炸', blewUp ? '是（已中断）' : '否', blewUp ? 'r > 0.5 时数值解指数增长' : '未出现指数增长'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text: stable
            ? '当前 r ≤ 0.5，数值解平滑地衰减到零——这与"扩散把尖峰抹平"的物理一致。'
            : '当前 r > 0.5，你会看到数值解出现高频振荡并指数增长。**这不是 bug，而是显式格式的稳定性限制**：时间步必须小于 Δx²/(2α)。这也解释了为什么隐式格式值得付出解线性方程组的代价。',
        })
      );

      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [
          { name: 'L2 范数（log）', points: energyTrace, color: stable ? '#0ca678' : '#c2255c' },
          { name: '初始 L2', points: [[1, Math.sqrt(initial.reduce((a, v) => a + v * v, 0) / N)]], color: '#868e96', type: 'scatter' },
        ],
        xScale: 'linear',
        yScale: 'log',
        xLabel: '时间步',
        yLabel: 'L2 范数（log）',
        height: 280,
        caption: stable ? 'L2 单调下降：扩散耗散能量。' : 'L2 指数上升：不稳定的典型特征。',
      });
    }

    const nSlider = slider({ label: '网格点数 N', min: 20, max: 200, step: 10, value: state.N, format: (v) => String(Math.round(v)), onInput: (v) => { state.N = Math.round(v); refresh(); } });
    const rSlider = slider({ label: 'r = αΔt/Δx²', min: 5, max: 80, step: 1, value: state.r * 100, format: (v) => (Number(v) / 100).toFixed(2), onInput: (v) => { state.r = Number(v) / 100; refresh(); } });
    const sSlider = slider({ label: '时间步数', min: 20, max: 1000, step: 20, value: state.steps, format: (v) => String(Math.round(v)), onInput: (v) => { state.steps = Math.round(v); refresh(); } });

    // 修正表格里的一个占位错误（写法保持简单直白）
    function refresh() {
      run();
    }

    host.append(panel('参数', nSlider.el, rSlider.el, sSlider.el), panel('稳定性诊断', outHost), panel('L2 范数随时间', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 通用：参数扫描表（ratio/性能分析类课程反复用到）
  // ═════════════════════════════════════════════════════════════
  demos.register('sweep', (host, params) => {
    const spec = params.spec || { label: '参数', min: 1, max: 64, step: 1, value: 4 };
    const formula = params.formula === 'speedup' ? (n) => n : (n) => Math.log2(n);
    const state = { x: spec.value };
    const outHost = dom.h('div', {});
    const canvasHost = dom.h('div', { class: 'cpl-demo__canvas' });
    let view = null;

    function refresh() {
      const xs = [];
      for (let v = spec.min; v <= spec.max; v += spec.step) xs.push(v);
      const pts = xs.map((v) => [v, Math.max(formula(v), 1e-6)]);
      dom.clear(outHost);
      outHost.append(table([spec.label, '结果'], xs.slice(0, 16).map((v) => [String(v), formula(v).toFixed(3)])));
      dom.clear(canvasHost);
      if (view) view.dispose();
      view = plot.mount(canvasHost, {
        series: [{ name: params.label || '结果', points: pts, color: '#3b5bdb' }],
        xScale: 'linear',
        yScale: 'linear',
        xLabel: spec.label,
        yLabel: params.label || '结果',
        height: 240,
      });
    }

    const s = slider({ label: spec.label, min: spec.min, max: spec.max, step: spec.step, value: spec.value, format: (v) => String(v), onInput: (v) => { state.x = v; refresh(); } });
    host.append(panel('参数', s.el, dom.h('p', { class: 'cpl-muted', text: params.note || '' })), panel('扫描结果', outHost), panel('曲线', canvasHost));
    refresh();
    return () => view && view.dispose();
  });

  // ═════════════════════════════════════════════════════════════
  // 系统设计：请求链路与瓶颈定位
  // ═════════════════════════════════════════════════════════════
  demos.register('request-chain', (host, params) => {
    const defaults = params.stages || [
      { name: 'DNS 解析', ms: 20, cacheable: true },
      { name: 'TCP + TLS 握手', ms: 60, cacheable: true },
      { name: 'CDN（静态资源）', ms: 15, cacheable: true },
      { name: '负载均衡', ms: 2, cacheable: false },
      { name: '应用服务', ms: 40, cacheable: false },
      { name: '缓存查询', ms: 3, cacheable: false },
      { name: '数据库查询', ms: 80, cacheable: false },
      { name: '序列化与传输', ms: 12, cacheable: false },
    ];
    const stages = defaults.map((s) => Object.assign({}, s));
    const outHost = dom.h('div', {});

    function refresh() {
      const total = stages.reduce((a, s) => a + (s.enabled === false ? 0 : s.ms), 0);
      const sorted = stages.slice().sort((a, b) => b.ms - a.ms);
      const top = sorted[0];
      const top3 = sorted.slice(0, 3).reduce((a, s) => a + s.ms, 0);

      dom.clear(outHost);
      const list = dom.h('div', { class: 'cpl-cmdlist' });
      for (const s of stages) {
        const input = dom.h('input', { type: 'range', min: '0', max: '300', step: '1', value: String(s.ms), class: 'cpl-ctl__range', 'aria-label': s.name + ' 耗时' });
        input.addEventListener('input', (e) => {
          s.ms = Number(e.target.value);
          refresh();
        });
        const box = dom.h('input', { type: 'checkbox', checked: s.enabled !== false, onchange: (e) => { s.enabled = e.target.checked; refresh(); } });
        const value = dom.h('code', { class: 'cpl-cmd__code', text: `${s.ms} ms` });
        list.append(
          dom.h(
            'div',
            { class: 'cpl-cmd' },
            dom.h('label', { class: 'cpl-check' }, box, dom.h('span', { text: s.name })),
            input,
            value
          )
        );
      }

      outHost.append(
        list,
        table(
          ['指标', '数值', '说明'],
          [
            ['端到端总延迟', `${total} ms`, '各阶段之和（串行链路）'],
            ['最大瓶颈', `${top.name}（${top.ms} ms）`, `占 ${((top.ms / Math.max(total, 1)) * 100).toFixed(0)}%`],
            ['前 3 大耗时占比', `${((top3 / Math.max(total, 1)) * 100).toFixed(0)}%`, '优化这里收益最大；优化最小的那几项几乎无效'],
            ['若瓶颈减半', `${(total - top.ms / 2).toFixed(0)} ms`, `总体降低 ${(((top.ms / 2) / Math.max(total, 1)) * 100).toFixed(0)}%`],
            ['可缓存阶段总耗时', `${stages.filter((s) => s.cacheable && s.enabled !== false).reduce((a, s) => a + s.ms, 0)} ms`, '这部分第一次访问才有，后续命中缓存可省掉'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '这是"先测量再优化"的练习：拖动滑块，找出当前最大的那一项。注意一个常见误区——把每个阶段都优化 10% 的收益，远小于把最大的那一项砍掉一半。',
        })
      );
    }

    host.append(panel('链路各阶段耗时（可拖动）', outHost));
    refresh();
  });

  // ═════════════════════════════════════════════════════════════
  // 并发竞态（用 Atomics 无法在单线程演示，用交错调度模拟）
  // ═════════════════════════════════════════════════════════════
  demos.register('race-condition', (host) => {
    const state = { threads: 4, increments: 10000, locked: false, atomic: false };
    const outHost = dom.h('div', {});

    function simulate() {
      // 用"读-改-写三步交错"来模拟竞态：每次尝试有概率被打断
      const threads = state.threads;
      const per = state.increments;
      let counter = 0;
      let lostUpdates = 0;
      let collisions = 0;

      if (state.atomic) {
        // 原子：无丢失
        let total = 0;
        for (let t = 0; t < threads; t++) total += per;
        return { expected: total, actual: total, lostUpdates: 0, collisions: 0 };
      }

      if (state.locked) {
        // 加锁：串行化，结果正确但耗时增加（用"锁竞争次数"体现）
        let total = 0;
        for (let t = 0; t < threads; t++) {
          for (let i = 0; i < per; i++) {
            total++;
            if (Math.random() < 0.001) collisions++;
          }
        }
        return { expected: threads * per, actual: total, lostUpdates: 0, collisions };
      }

      // 无保护：模拟交错
      let expected = threads * per;
      let progress = new Array(threads).fill(0);
      let done = 0;
      let guard = 0;
      // 用一个"读到旧值"的概率模型来描述真实竞态
      const lostProb = 1 - 1 / threads;
      while (done < threads && guard++ < expected * 2 + 1000) {
        for (let t = 0; t < threads; t++) {
          if (progress[t] >= per) continue;
          // 读
          const read = counter;
          progress[t]++;
          if (progress[t] === per) done++;
          // 有概率在写回之前被另一个线程插入（丢失更新）
          if (Math.random() < 0.5 * lostProb) {
            lostUpdates++;
            counter = read + 1; // 基于旧值写回 → 覆盖了别人的更新
          } else {
            counter = counter + 1;
          }
        }
      }
      return { expected, actual: counter, lostUpdates, collisions };
    }

    function refresh() {
      const r = simulate();
      dom.clear(outHost);
      const loss = r.expected - r.actual;
      outHost.append(
        table(
          ['量', '数值', '说明'],
          [
            ['线程数', state.threads, '—'],
            ['每线程自增次数', state.increments.toLocaleString(), '—'],
            ['期望结果', r.expected.toLocaleString(), 'threads × increments'],
            ['实际结果', r.actual.toLocaleString(), '—'],
            ['丢失的更新', loss.toLocaleString(), `占 ${((loss / Math.max(r.expected, 1)) * 100).toFixed(2)}%`],
            ['保护措施', state.atomic ? '原子操作（无锁）' : state.locked ? '互斥锁' : '无保护', state.atomic ? 'CPU 提供原子指令，无丢失' : state.locked ? '结果正确，代价是锁竞争与串行化' : '结果错误且不可复现'],
            ['诊断', loss > 0 ? '⚠ 结果随运行变化 = 竞态的典型标志' : '✓ 结果确定', loss > 0 ? '修法：加锁 / 原子操作 / 每线程局部累加后归约' : '—'],
          ]
        ),
        dom.h('p', {
          class: 'cpl-demo__intro',
          text:
            '`x = x + 1` 在机器层面是 load → add → store 三步。两个线程交错执行会丢失更新。**结果随运行变化**是竞态最可靠的标志（比"结果不对"更可靠，因为有时恰好是对的）。高性能数值计算里最常用的修法不是加锁，而是每个线程各自累加到局部变量，最后归约。',
        })
      );
    }

    const tSlider = slider({ label: '线程数', min: 2, max: 16, step: 1, value: state.threads, format: (v) => String(Math.round(v)), onInput: (v) => { state.threads = Math.round(v); refresh(); } });
    const iSlider = slider({ label: '每线程自增次数', min: 1000, max: 100000, step: 1000, value: state.increments, format: (v) => Math.round(v).toLocaleString(), onInput: (v) => { state.increments = Math.round(v); refresh(); } });
    const lockBox = checkbox({ label: '加互斥锁', checked: state.locked, onChange: (v) => { state.locked = v; refresh(); } });
    const atomicBox = checkbox({ label: '改用原子操作', checked: state.atomic, onChange: (v) => { state.atomic = v; refresh(); } });

    host.append(
      panel('参数', tSlider.el, iSlider.el, dom.h('div', { class: 'cpl-demo__toggles' }, lockBox, atomicBox)),
      panel('模拟结果', outHost)
    );
    refresh();
  });
})();
