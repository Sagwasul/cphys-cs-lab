/* ============================================================================
 * 65-anki.js — Anki 卡片：生成、预览、每周计划、导出
 *
 * 关于导出格式的诚实说明：
 *   真正的 .apkg 是一个内含 SQLite 数据库（collection.anki2）的 ZIP 包。
 *   在纯前端手写 SQLite 二进制格式风险高且容易生成坏包，所以本平台**不生成 .apkg**，
 *   而是导出 Anki 原生支持的两种文本格式：
 *     · TSV（制表符分隔）—— 最适合 Anki 的「文件 → 导入」，支持标签
 *     · CSV（逗号分隔，带引号转义）—— 适合 Excel/Numbers 先编辑
 *   导入步骤写在 README，两步就能完成，比给出一个可能打不开的 .apkg 更可靠。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;

  const anki = (CPL.anki = {});

  const scope = CPL.store.scope('anki');

  // ─────────────────────────────────────────────────────────────
  // 卡片收集
  // ─────────────────────────────────────────────────────────────
  /**
   * 收集卡片。source:
   *   'lesson'（默认，课程自带卡片）| 'user'（用户自定义课程）| 'wrong'（错题）| 'all'
   */
  anki.collect = function collect({ source = 'lesson', lessonIds = null, lessons = null } = {}) {
    const out = [];
    const list = lessons || CPL.catalog.lessons();

    for (const meta of list) {
      if (lessonIds && !lessonIds.includes(meta.id)) continue;
      const lesson = CPL.catalog.get(meta.id);
      if (!lesson) continue; // 未加载的课程没有卡片内容

      for (const card of lesson.anki || []) {
        out.push({
          id: `${meta.id}#${util.hash(card.front + (card.back || ''))}`,
          lessonId: meta.id,
          week: meta.week,
          deck: `计算物理CS::W${String(meta.week).padStart(2, '0')} ${meta.title}`,
          front: card.front,
          back: card.back,
          tags: ['cphys-cs', `w${meta.week}`, ...(card.tags || []), ...(meta.tags || []).slice(0, 3)],
          source: 'lesson',
        });
      }
    }

    if (source === 'wrong') {
      const wrong = CPL.assess ? CPL.assess.wrongQuestions() : [];
      for (const q of wrong) {
        const skill = CPL.mastery ? CPL.mastery.skill(q.skill) : null;
        out.push({
          id: `wrong#${q.id}`,
          lessonId: q.lesson || '',
          week: 0,
          deck: '计算物理CS::错题重练',
          front: q.q,
          back: `**正确答案：** ${q.options[q.answer]}\n\n**解析：** ${q.explain}`,
          tags: ['cphys-cs', 'wrong', q.skill, ...(skill ? [skill.domain] : [])],
          source: 'wrong',
        });
      }
    }

    return out;
  };

  /** 用户自定义课程里的卡片也要能导出。 */
  anki.collectUserCards = function collectUserCards(userLessons) {
    const out = [];
    for (const lesson of userLessons || []) {
      for (const card of lesson.anki || []) {
        out.push({
          id: `${lesson.id}#${util.hash(card.front + (card.back || ''))}`,
          lessonId: lesson.id,
          week: lesson.week || 0,
          deck: `计算物理CS::我的内容::${lesson.title || lesson.id}`,
          front: card.front,
          back: card.back,
          tags: ['cphys-cs', 'user', ...(card.tags || [])],
          source: 'user',
        });
      }
    }
    return out;
  };

  /** 每周自动生成 5 张（模块 6 的要求）：按本周课程 + 错题权重挑选。 */
  anki.weeklySet = function weeklySet(week, size = null) {
    const n = size || CPL.prefs.get('ankiPerWeek') || 5;
    const weekMeta = CPL.catalog.byWeek(week);
    const cards = anki.collect({ lessons: weekMeta });
    const wrong = anki.collect({ source: 'wrong' });
    // 错题优先，其次按课程顺序
    const merged = [...wrong.slice(0, Math.ceil(n / 2)), ...cards];
    const seen = new Set();
    const picked = [];
    for (const c of merged) {
      if (seen.has(c.front)) continue;
      seen.add(c.front);
      picked.push(c);
      if (picked.length >= n) break;
    }
    return picked;
  };

  /** 学习计划：从第 1 周到第 27 周，每周一叠。 */
  anki.plan = function plan(size) {
    const weeks = Array.from(new Set(CPL.catalog.lessons().map((l) => l.week))).filter((w) => w > 0).sort((a, b) => a - b);
    return weeks.map((w) => ({ week: w, cards: anki.weeklySet(w, size) }));
  };

  // ─────────────────────────────────────────────────────────────
  // 导出
  // ─────────────────────────────────────────────────────────────

  /** 把 Markdown 压成适合 Anki 的 HTML 片段（保留换行与公式可读性）。 */
  function cardHtml(markdown) {
    const html = CPL.md.renderBlocks(markdown || '');
    // Anki 字段里允许 HTML；行内换行用 <br>
    return html.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
  }

  anki.toTsv = function toTsv(cards, { html = true, includeTags = true, deckHeader = true } = {}) {
    const lines = [];
    if (deckHeader) {
      lines.push('#separator:tab');
      lines.push('#html:' + (html ? 'true' : 'false'));
      lines.push('#notetype:Basic');
      if (includeTags) lines.push('#tags column:3');
      lines.push('#deck column:4');
    }
    for (const c of cards) {
      const front = html ? cardHtml(c.front) : c.front.replace(/\n/g, ' ');
      const back = html ? cardHtml(c.back) : c.back.replace(/\n/g, ' ');
      const tags = includeTags ? c.tags.join(' ') : '';
      // 制表符与换行必须清掉，否则一行会被拆成多列
      const clean = (s) => String(s).replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
      if (includeTags) lines.push([clean(front), clean(back), clean(tags), clean(c.deck)].join('\t'));
      else lines.push([clean(front), clean(back)].join('\t'));
    }
    return lines.join('\n') + '\n';
  };

  anki.toCsv = function toCsv(cards, { html = false } = {}) {
    const quote = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const rows = [['front', 'back', 'tags', 'deck', 'lessonId', 'source'].map(quote).join(',')];
    for (const c of cards) {
      rows.push(
        [
          html ? cardHtml(c.front) : c.front,
          html ? cardHtml(c.back) : c.back,
          c.tags.join(' '),
          c.deck,
          c.lessonId,
          c.source,
        ]
          .map(quote)
          .join(',')
      );
    }
    return '\ufeff' + rows.join('\n') + '\n'; // BOM 让 Excel 正确识别 UTF-8
  };

  /** 纯文本（贴到任何地方） */
  anki.toPlain = function toPlain(cards) {
    return cards
      .map(
        (c, i) =>
          `### ${i + 1}. ${c.deck}\n\n**正面**\n${c.front}\n\n**背面**\n${c.back}\n\n标签：${c.tags.join(', ')}\n`
      )
      .join('\n---\n\n');
  };

  /** JSON 备份（含完整元数据，可再次导入本平台） */
  anki.toJson = function toJson(cards) {
    return JSON.stringify({ schema: CPL.SCHEMA, app: 'cphys-cs-lab', kind: 'anki-cards', exportedAt: new Date().toISOString(), count: cards.length, cards }, null, 2);
  };

  anki.export = function exportCards(cards, format = 'tsv') {
    const stamp = new Date().toISOString().slice(0, 10);
    if (!cards.length) {
      dom.toast('没有可导出的卡片', { kind: 'warn' });
      return 0;
    }
    if (format === 'tsv') dom.download(`cphys-cs-cards-${stamp}.txt`, anki.toTsv(cards), 'text/tab-separated-values');
    else if (format === 'csv') dom.download(`cphys-cs-cards-${stamp}.csv`, anki.toCsv(cards), 'text/csv');
    else if (format === 'md') dom.download(`cphys-cs-cards-${stamp}.md`, anki.toPlain(cards), 'text/markdown');
    else if (format === 'json') dom.download(`cphys-cs-cards-${stamp}.json`, anki.toJson(cards), 'application/json');
    dom.toast(`已导出 ${cards.length} 张卡片（${format}）。导入步骤见 README「Anki 导入」。`, { kind: 'ok' });
    return cards.length;
  };

  // ─────────────────────────────────────────────────────────────
  // 复习记录（本地）
  // ─────────────────────────────────────────────────────────────
  anki.reviewed = function reviewed() {
    return scope.get('reviewed', {}); // { cardId: { count, lastAt } }
  };

  anki.markReviewed = function markReviewed(cardId, known) {
    const all = anki.reviewed();
    const rec = all[cardId] || { count: 0, known: 0, unknown: 0 };
    rec.count++;
    rec.lastAt = Date.now();
    if (known) rec.known++;
    else rec.unknown++;
    all[cardId] = rec;
    scope.set('reviewed', all);
    CPL.bus.emit('anki:reviewed', { cardId, known });
    return rec;
  };

  /** 需要重点复习的卡片（答错次数高于答对） */
  anki.weakCards = function weakCards(cards) {
    const rev = anki.reviewed();
    return cards
      .filter((c) => {
        const r = rev[c.id];
        return r && r.unknown > r.known;
      })
      .sort((a, b) => (rev[b.id].unknown - rev[b.id].known) - (rev[a.id].unknown - rev[a.id].known));
  };

  // ─────────────────────────────────────────────────────────────
  // 复习界面
  // ─────────────────────────────────────────────────────────────
  /**
   * 简易复习器：翻卡 + 会/不会 + 键盘快捷键（空格翻面，1 不会，2 会）。
   * @returns {{destroy:Function, stats:Function}}
   */
  anki.mountReviewer = function mountReviewer(host, cards, opts = {}) {
    let index = 0;
    let flipped = false;
    let right = 0;
    let wrong = 0;

    const counter = dom.h('span', { class: 'cpl-review__counter' });
    const cardBox = dom.h('div', { class: 'cpl-review__card', tabindex: '0', role: 'button' });
    const frontEl = dom.h('div', { class: 'cpl-review__face cpl-review__face--front' });
    const backEl = dom.h('div', { class: 'cpl-review__face cpl-review__face--back' });
    const deckEl = dom.h('span', { class: 'cpl-review__deck' });

    const knowBtn = dom.h('button', { class: 'cpl-btn cpl-btn--primary', type: 'button', text: '会（2）' });
    const dontBtn = dom.h('button', { class: 'cpl-btn', type: 'button', text: '不会（1）' });

    function paint() {
      const card = cards[index];
      if (!card) {
        dom.clear(cardBox);
        cardBox.append(dom.h('div', { class: 'cpl-review__done' }, dom.h('h3', { text: '这一叠复习完了' }), dom.h('p', { text: `会 ${right} 张 · 不会 ${wrong} 张` })));
        return;
      }
      counter.textContent = `${index + 1} / ${cards.length} · 会 ${right} · 不会 ${wrong}`;
      deckEl.textContent = card.deck;
      dom.clear(frontEl);
      dom.clear(backEl);
      frontEl.append(CPL.md.render(card.front));
      if (flipped) {
        backEl.append(CPL.md.render(card.back));
        backEl.hidden = false;
      } else {
        backEl.hidden = true;
      }
      if (CPL.highlight) CPL.highlight.applyAll(cardBox);
    }

    function flip() {
      if (!cards[index]) return;
      flipped = !flipped;
      paint();
    }

    function answer(known) {
      if (!cards[index]) return;
      if (known) right++;
      else wrong++;
      anki.markReviewed(cards[index].id, known);
      index++;
      flipped = false;
      paint();
    }

    cardBox.addEventListener('click', flip);
    cardBox.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flip();
      }
    });
    knowBtn.addEventListener('click', () => answer(true));
    dontBtn.addEventListener('click', () => answer(false));

    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (e.key === ' ') {
        e.preventDefault();
        flip();
      } else if (e.key === '1') answer(false);
      else if (e.key === '2') answer(true);
    };
    document.addEventListener('keydown', onKey);

    host.append(
      dom.h('div', { class: 'cpl-review' }, dom.h('div', { class: 'cpl-review__bar' }, deckEl, counter), cardBox, dom.h('div', { class: 'cpl-review__actions' }, dontBtn, knowBtn)),
      dom.h('p', { class: 'cpl-muted', text: '快捷键：空格翻面 · 1 不会 · 2 会' })
    );
    cardBox.append(frontEl, backEl);
    paint();
    if (opts.focus !== false) cardBox.focus();

    return {
      destroy: () => document.removeEventListener('keydown', onKey),
      stats: () => ({ right, wrong, index, total: cards.length }),
    };
  };
})();
