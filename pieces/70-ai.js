/* ============================================================================
 * 70-ai.js — AI 助教客户端（引导式提问 / 代码审查 / 掌握度评估）
 *
 * 安全边界（前端这一侧）：
 *   · 前端永远不持有 API 密钥。所有请求打到自己的 Serverless 代理
 *     （api/chat.js），由代理去持有密钥、做 Origin 白名单与速率限制。
 *   · 只发送学习上下文：课程 id、代码、用户提问、技能等级。
 *     不发送姓名、邮箱、学校、IP 之外的任何身份信息（IP 由服务端限流使用）。
 *   · 三处长度限制：单条消息、消息条数、总字符数，均在发送前裁剪。
 *   · 离线降级：未配置 apiBase 时，把课程自带的引导问题当作"本地助教"，
 *     功能不缺失（只是不会动态追问）。
 *
 * 三个动作（与 api/chat.js 的 action 字段对应）：
 *   chat        引导式答疑（默认）
 *   review-code 讲解用户上传的代码 + 反问是否掌握 + 指出风险
 *   assess      根据对话与代码证据评估技能掌握度
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const util = CPL.util;

  const ai = (CPL.ai = {});

  ai.enabled = () => Boolean(CPL.config.apiBase);

  // ─────────────────────────────────────────────────────────────
  // 前端侧的软限流（真正的限流在服务端，这里只是防止误触发连点）
  // ─────────────────────────────────────────────────────────────
  const rate = { hits: [], windowMs: 60000 };

  ai.rateRemaining = function rateRemaining() {
    const now = Date.now();
    rate.hits = rate.hits.filter((t) => now - t < rate.windowMs);
    return Math.max(0, CPL.config.ai.softRatePerMin - rate.hits.length);
  };

  function takeToken() {
    const now = Date.now();
    rate.hits = rate.hits.filter((t) => now - t < rate.windowMs);
    if (rate.hits.length >= CPL.config.ai.softRatePerMin) return false;
    rate.hits.push(now);
    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // 输入裁剪
  // ─────────────────────────────────────────────────────────────
  function truncate(text, max) {
    const s = String(text === undefined || text === null ? '' : text);
    if (s.length <= max) return s;
    return s.slice(0, max - 1) + '…';
  }

  /**
   * 规范化消息数组：限制条数、单条长度、总长度，并且只保留 user/assistant。
   * 客户端不允许指定 system —— system 提示词由服务端注入，防止越权。
   */
  ai.normalizeMessages = function normalizeMessages(messages) {
    const cfg = CPL.config.ai;
    const cleaned = (messages || [])
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: truncate(m.content, cfg.maxInputChars) }));

    let out = cleaned.slice(-cfg.maxMessages);

    // 总长度约束：从最旧的消息开始丢，直到满足上限
    const total = () => out.reduce((n, m) => n + m.content.length, 0);
    while (out.length > 1 && total() > cfg.maxChars) out.shift();
    if (total() > cfg.maxChars && out.length) {
      out[0] = { role: out[0].role, content: truncate(out[0].content, cfg.maxChars) };
    }
    return out;
  };

  // ─────────────────────────────────────────────────────────────
  // 学习上下文：只发"学什么"，不发"我是谁"
  // ─────────────────────────────────────────────────────────────
  /**
   * @param {{lesson?:object, lessonId?:string, skills?:string[], language?:string, code?:string, extra?:object}} ctx
   */
  ai.buildContext = function buildContext(ctx = {}) {
    const lessonId = ctx.lessonId || (ctx.lesson && ctx.lesson.id) || '';
    const meta = lessonId && CPL.catalog ? CPL.catalog.meta(lessonId) : null;
    const lesson = ctx.lesson || (CPL.catalog ? CPL.catalog.get(lessonId) : null);

    const out = {
      lessonId,
      lessonTitle: (lesson && lesson.title) || (meta && meta.title) || '',
      module: (lesson && lesson.module) || (meta && meta.module),
      week: (lesson && lesson.week) || (meta && meta.week),
      objectives: lesson ? (lesson.objectives || []).slice(0, 6) : [],
      tags: meta ? (meta.tags || []).slice(0, 8) : [],
    };

    // 掌握度：只发技能名与等级，不发分数历史
    if (CPL.mastery) {
      const profile = CPL.mastery.toContext();
      out.mastery = profile;
      out.skills = ctx.skills || (lessonId ? CPL.mastery.skillsForLesson(lessonId).map((s) => s.id) : []);
    }
    if (ctx.language) out.language = ctx.language;
    if (ctx.extra) out.extra = ctx.extra;
    return out;
  };

  // ─────────────────────────────────────────────────────────────
  // 统一请求
  // ─────────────────────────────────────────────────────────────
  const ERROR_TEXT = {
    RATE_LIMITED: '请求太频繁了。等一分钟再问，或者先把当前问题想清楚再问。',
    INPUT_TOO_LONG: '内容太长了。把问题缩小到一点，或者只贴最关键的那几十行代码。',
    NOT_ALLOWED_ORIGIN: '这个站点的来源不在代理的白名单里。请检查 api/chat.js 的 ALLOWED_ORIGINS 配置。',
    UPSTREAM_ERROR: '上游模型服务出错了。稍后重试；如果持续失败，检查服务端的 API 密钥与额度。',
    UPSTREAM_TIMEOUT: '模型响应超时。把问题拆小一点再试。',
    NOT_CONFIGURED: '服务端还没配置 AI 密钥（AI_API_KEY）。配置后这个功能才会生效。',
    BAD_REQUEST: '请求格式不对，这通常是前端 bug。',
    INTERNAL: '服务端内部错误。已记录请求 id，细节不会返回给前端。',
  };

  /**
   * 调用代理。
   * @param {object} payload
   * @param {{onDelta?:Function, onStatus?:Function, signal?:AbortSignal}} opts
   * @returns {Promise<{ok:boolean, text:string, code?:string, requestId?:string, usage?:object, message?:string}>}
   */
  ai.request = async function request(payload, opts = {}) {
    if (!ai.enabled()) {
      return { ok: false, code: 'DISABLED', message: 'AI 助教未启用（未配置 apiBase）', text: '' };
    }
    if (!takeToken()) {
      return {
        ok: false,
        code: 'CLIENT_RATE_LIMITED',
        message: '你连点太快了。等一分钟，或者先把问题写清楚再问。',
        text: '',
      };
    }

    const body = {
      action: payload.action || 'chat',
      messages: ai.normalizeMessages(payload.messages),
      context: payload.context || {},
      // 服务端会再次校验这些字段，这里只是"自证清白"
      clientVersion: CPL.VERSION,
    };
    if (payload.code) body.code = truncate(payload.code, CPL.config.ai.maxCodeChars || 8000);
    if (payload.language) body.language = truncate(payload.language, 24);
    if (payload.filename) body.filename = truncate(payload.filename, 120);

    const wantsStream = CPL.config.ai.stream && payload.stream !== false && typeof opts.onDelta === 'function';

    let res;
    try {
      res = await fetch(CPL.config.apiBase, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: wantsStream ? 'text/event-stream' : 'application/json' },
        body: JSON.stringify(body),
        signal: opts.signal,
      });
    } catch (err) {
      if (err && err.name === 'AbortError') return { ok: false, code: 'ABORTED', message: '已取消', text: '' };
      return {
        ok: false,
        code: 'NETWORK',
        message: '无法连接到 AI 代理。检查 apiBase 地址是否正确，以及代理是否已部署。',
        text: '',
      };
    }

    const requestId = res.headers.get('x-request-id') || '';

    if (!res.ok) {
      let code = 'INTERNAL';
      let message = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        if (data && data.error) {
          code = data.error.code || code;
          message = data.error.message || message;
        }
      } catch {
        /* 非 JSON 错误体，保持默认 */
      }
      return {
        ok: false,
        code,
        requestId,
        message: ERROR_TEXT[code] || message,
        text: '',
      };
    }

    const ctype = res.headers.get('content-type') || '';

    // ── 流式（SSE） ──────────────────────────────────────────
    if (wantsStream && ctype.includes('text/event-stream') && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let text = '';
      let done = false;

      try {
        while (!done) {
          const chunk = await reader.read();
          if (chunk.done) break;
          buffer += decoder.decode(chunk.value, { stream: true });
          // 以空行分隔事件
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';
          for (const part of parts) {
            const lines = part.split('\n');
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const data = trimmed.slice(5).trim();
              if (data === '[DONE]') {
                done = true;
                continue;
              }
              let parsed;
              try {
                parsed = JSON.parse(data);
              } catch {
                continue; // 非 JSON 数据帧（心跳等）直接跳过
              }
              if (parsed.error) {
                return { ok: false, code: parsed.error.code || 'UPSTREAM_ERROR', message: ERROR_TEXT[parsed.error.code] || parsed.error.message, text, requestId };
              }
              // 兼容两种常见分片格式：
              //   OpenAI 风格：{ choices: [{ delta: { content } }] }
              //   Vercel AI SDK 风格：{ type: 'text-delta', textDelta }
              const delta = extractDelta(parsed);
              if (delta) {
                text += delta;
                opts.onDelta(delta, text);
              }
              if (parsed.type === 'done' || parsed.done === true) done = true;
            }
          }
        }
      } catch (err) {
        if (err && err.name === 'AbortError') return { ok: true, text: text + '\n\n（已中断）', requestId };
        return { ok: false, code: 'STREAM_ERROR', message: '流式读取中断：' + dom.friendlyError(err), text, requestId };
      }
      return { ok: true, text, requestId };
    }

    // ── 非流式（JSON） ───────────────────────────────────────
    let data;
    try {
      data = await res.json();
    } catch {
      return { ok: false, code: 'BAD_RESPONSE', message: '服务端返回了无法解析的内容。', text: '', requestId };
    }
    if (data && data.error) {
      const code = data.error.code || 'INTERNAL';
      return { ok: false, code, message: ERROR_TEXT[code] || data.error.message, text: '', requestId };
    }
    const text =
      (data && (data.text || (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content))) || '';
    return { ok: true, text, requestId, usage: data && data.usage };
  };

  /** 从分片对象里取出增量文本（兼容多种上游格式）。 */
  function extractDelta(obj) {
    if (!obj || typeof obj !== 'object') return '';
    if (typeof obj.delta === 'string') return obj.delta;
    if (typeof obj.textDelta === 'string') return obj.textDelta;
    if (typeof obj.text === 'string' && obj.type !== 'done') return obj.text;
    if (typeof obj.content === 'string' && !obj.role) return obj.content;
    const choice = obj.choices && obj.choices[0];
    if (choice) {
      if (choice.delta && typeof choice.delta.content === 'string') return choice.delta.content;
      if (choice.message && typeof choice.message.content === 'string') return choice.message.content;
      if (typeof choice.text === 'string') return choice.text;
    }
    return '';
  }

  // ─────────────────────────────────────────────────────────────
  // 离线兜底：本地引导问题库
  // ─────────────────────────────────────────────────────────────
  ai.localPrompts = function localPrompts(lesson) {
    const prompts = (lesson && lesson.aiPrompts) || [];
    if (prompts.length) return prompts;
    return [
      '先说说你自己是怎么理解这一课的？哪一步最不确定？',
      '如果把你现在的参数放大 10 倍，你预期结果会怎么变？为什么？',
      '这段逻辑放到你自己的科研代码里，最可能在哪一步出错？',
    ];
  };

  // ─────────────────────────────────────────────────────────────
  // 三个高层动作
  // ─────────────────────────────────────────────────────────────
  ai.chat = function chat({ messages, lesson, lessonId, code, language, onDelta, onStatus, signal }) {
    return ai.request(
      {
        action: 'chat',
        messages,
        context: ai.buildContext({ lesson, lessonId, language, code: code ? true : undefined }),
        code,
        language,
      },
      { onDelta, onStatus, signal }
    );
  };

  /** 代码审查：讲解 + 反问 + 风险点。要求服务端不直接给完整答案。 */
  ai.reviewCode = function reviewCode({ code, language, filename, lesson, lessonId, question, onDelta, onStatus, signal }) {
    return ai.request(
      {
        action: 'review-code',
        messages: [
          {
            role: 'user',
            content:
              (question ? question + '\n\n' : '') +
              '请对照本课的知识点，分析我上传的代码。要求：\n' +
              '1) 先说清这段代码在做什么（用一两句话，不要逐行复述）；\n' +
              '2) 指出与本节课知识点相关的问题（物理正确性 / 边界条件 / 数值稳定性 / 复杂度 / 内存布局 / 并行竞态 / 数组越界，按相关性挑最要紧的两三个）；\n' +
              '3) 不要直接把改好的完整代码给我，用提问引导我自己发现；\n' +
              '4) 最后给我 1–3 个检验我是否真掌握了的追问。',
          },
        ],
        context: ai.buildContext({ lesson, lessonId, language, code: true }),
        code,
        language,
        filename,
      },
      { onDelta, onStatus, signal }
    );
  };

  /** 掌握度评估：只发技能清单等级与（可选）代码证据，不发个人身份信息。 */
  ai.assess = function assessMastery({ lesson, lessonId, code, language, answers, onDelta, signal }) {
    const skillNames = (lessonId && CPL.mastery ? CPL.mastery.skillsForLesson(lessonId) : []).map((s) => s.name);
    return ai.request(
      {
        action: 'assess',
        messages: [
          {
            role: 'user',
            content: [
              '请根据下面的证据，判断我对这些技能的掌握程度，并给出下一步建议。',
              skillNames.length ? '相关技能：' + skillNames.join('、') : '',
              answers ? '我的自述/回答：' + answers : '',
              code ? '我的代码见附件。' : '',
              '输出要求：①逐技能给出「已掌握 / 基本会 / 薄弱 / 未评估」并说明依据；②指出我最可能自我高估的那一项；③给我 2 个能当场验证的判断题。',
            ]
              .filter(Boolean)
              .join('\n'),
          },
        ],
        context: ai.buildContext({ lesson, lessonId, language, code: code ? true : undefined }),
        code,
        language,
      },
      { onDelta, signal }
    );
  };

  // ─────────────────────────────────────────────────────────────
  // 聊天面板组件（课程页与「我的内容」共用）
  // ─────────────────────────────────────────────────────────────
  /**
   * @param {HTMLElement} host
   * @param {{lesson?:object, lessonId?:string, mode?:'tutor'|'review'|'assess', getCode?:Function, getLanguage?:Function, title?:string, intro?:string}} opts
   * @returns {{destroy:Function, setLesson:Function, focus:Function}}
   */
  ai.mountPanel = function mountPanel(host, opts = {}) {
    const mode = opts.mode || 'tutor';
    const messages = []; // {role, content}
    const controller = { current: null };

    const log = dom.h('div', { class: 'cpl-ai__log', role: 'log', 'aria-live': 'polite', 'aria-label': 'AI 助教对话' });
    const status = dom.h('div', { class: 'cpl-ai__status', hidden: true });
    const input = dom.h('textarea', {
      class: 'cpl-ai__input',
      rows: '3',
      placeholder: mode === 'review' ? '可选：说说你想让助教重点看哪里…' : '把你的问题写清楚：你试了什么、观察到什么、卡在哪一步…',
      'aria-label': '给 AI 助教的消息',
      maxlength: String(CPL.config.ai.maxInputChars),
    });
    const sendBtn = dom.h('button', { class: 'cpl-btn cpl-btn--primary', type: 'button', text: '发送' });
    const stopBtn = dom.h('button', { class: 'cpl-btn', type: 'button', text: '停止', hidden: true });
    const clearBtn = dom.h('button', { class: 'cpl-btn cpl-btn--ghost cpl-btn--sm', type: 'button', text: '清空对话' });
    const counter = dom.h('span', { class: 'cpl-ai__counter', text: `0 / ${CPL.config.ai.maxInputChars}` });

    const promptsHost = dom.h('div', { class: 'cpl-ai__prompts' });

    function renderPrompts() {
      dom.clear(promptsHost);
      const prompts = ai.localPrompts(opts.lesson);
      const lead =
        mode === 'review'
          ? '代码审查：我会先讲清它在做什么，再指出与本节知识点相关的问题，然后用提问引导你自己发现。'
          : mode === 'assess'
          ? '掌握度评估：我会逐技能判断你处在哪一档，并指出你最容易高估的那一项。'
          : '引导式助教：我不直接给答案，先问你几个问题。想不出来时直接说「给我提示」。';
      promptsHost.append(dom.h('p', { class: 'cpl-ai__lead', text: lead }));
      if (prompts.length) {
        promptsHost.append(dom.h('p', { class: 'cpl-ai__lead-label', text: '本课的引导问题：' }));
        const list = dom.h('div', { class: 'cpl-ai__chips' });
        for (const p of prompts) {
          list.append(
            dom.h('button', {
              class: 'cpl-chip',
              type: 'button',
              text: p,
              onclick: () => {
                input.value = p;
                updateCounter();
                input.focus();
              },
            })
          );
        }
        promptsHost.append(list);
      }
    }

    function updateCounter() {
      counter.textContent = `${input.value.length} / ${CPL.config.ai.maxInputChars}`;
      counter.classList.toggle('is-over', input.value.length > CPL.config.ai.maxInputChars * 0.9);
    }

    function bubble(role, content) {
      const node = dom.h(
        'div',
        { class: `cpl-ai__msg cpl-ai__msg--${role}` },
        dom.h('div', { class: 'cpl-ai__role', text: role === 'user' ? '你' : role === 'system' ? '系统' : 'AI 助教' }),
        dom.h('div', { class: 'cpl-ai__content' })
      );
      const contentEl = node.querySelector('.cpl-ai__content');
      if (role === 'assistant') {
        // AI 输出也走 Markdown 渲染器（内部统一转义，不存在直通 HTML）
        contentEl.append(CPL.md.render(content));
        if (CPL.highlight) CPL.highlight.applyAll(contentEl);
      } else {
        contentEl.textContent = content;
      }
      log.append(node);
      log.scrollTop = log.scrollHeight;
      return contentEl;
    }

    function setStatus(text) {
      if (!text) {
        status.hidden = true;
        status.textContent = '';
        return;
      }
      status.hidden = false;
      status.textContent = text;
    }

    async function onSubmit() {
      const text = input.value.trim();
      if (!text && mode !== 'review') {
        dom.toast('先写点什么再发', { kind: 'warn', ms: 1800 });
        return;
      }
      input.value = '';
      updateCounter();
      messages.push({ role: 'user', content: text });
      bubble('user', text || '（请审查当前代码）');

      if (!ai.enabled()) {
        // 离线模式：给出课程自带问题作为"本地助教"，并明确说明原因
        const offline = [
          'AI 助教当前处于**离线模式**（站点未配置 `apiBase` 指向你的 Serverless 代理）。',
          '',
          '在你部署代理之前，这里把你的问题还给你——这些是本课设计好的引导问题：',
          '',
          ...ai.localPrompts(opts.lesson).map((p) => `- ${p}`),
          '',
          '想把问题贴给任意大模型，可以直接复制本页的对话与代码。',
        ].join('\n');
        bubble('assistant', offline);
        return;
      }

      const answerEl = bubble('assistant', '');
      let acc = '';
      sendBtn.disabled = true;
      stopBtn.hidden = false;
      setStatus('思考中…');
      controller.current = new AbortController();

      const code = typeof opts.getCode === 'function' ? opts.getCode() : '';
      const language = typeof opts.getLanguage === 'function' ? opts.getLanguage() : '';

      const useMode = mode === 'review' ? 'reviewCode' : mode === 'assess' ? 'assess' : 'chat';
      const call =
        useMode === 'reviewCode'
          ? ai.reviewCode({ code, language, lesson: opts.lesson, lessonId: opts.lessonId, question: text, onDelta, onStatus: setStatus, signal: controller.current.signal })
          : useMode === 'assess'
          ? ai.assessMastery({ lesson: opts.lesson, lessonId: opts.lessonId, code, language, answers: text, onDelta, signal: controller.current.signal })
          : ai.chat({ messages, lesson: opts.lesson, lessonId: opts.lessonId, code, language, onDelta, onStatus: setStatus, signal: controller.current.signal });

      function onDelta(_delta, full) {
        acc = full;
        dom.clear(answerEl);
        answerEl.append(CPL.md.render(full));
      }

      const result = await call;

      sendBtn.disabled = false;
      stopBtn.hidden = true;
      setStatus('');
      controller.current = null;

      if (!result.ok) {
        dom.clear(answerEl);
        const err = dom.errorCard('助教没能回答', result.message || '未知错误', [
          result.code === 'DISABLED' ? '在 index.html 里把 apiBase 指向你部署好的 /api/chat' : '检查代理是否在线、密钥是否已配置',
          '也可以把问题复制到任意大模型里继续',
        ]);
        answerEl.append(err);
        return;
      }

      // 流式已渲染；非流式需要补渲染
      if (!acc) {
        dom.clear(answerEl);
        answerEl.append(CPL.md.render(result.text || '（空回复）'));
      }
      if (CPL.highlight) CPL.highlight.applyAll(answerEl);
      messages.push({ role: 'assistant', content: result.text || acc });

      // 记录一次使用，便于设置页展示
      const usage = CPL.store.scope('aiUsage');
      const today = new Date().toISOString().slice(0, 10);
      const rec = usage.get(today, { count: 0 });
      rec.count++;
      usage.set(today, rec);

      CPL.bus.emit('ai:answered', { mode: useMode, requestId: result.requestId });
    }

    sendBtn.addEventListener('click', onSubmit);
    input.addEventListener('input', updateCounter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onSubmit();
      }
    });
    stopBtn.addEventListener('click', () => {
      if (controller.current) controller.current.abort();
      setStatus('已停止');
      setTimeout(() => setStatus(''), 1200);
    });
    clearBtn.addEventListener('click', () => {
      messages.length = 0;
      dom.clear(log);
      renderPrompts();
    });

    renderPrompts();
    host.append(promptsHost, log, status, dom.h('div', { class: 'cpl-ai__compose' }, input, dom.h('div', { class: 'cpl-ai__compose-actions' }, counter, clearBtn, stopBtn, sendBtn)));
    updateCounter();

    return {
      destroy() {
        if (controller.current) controller.current.abort();
      },
      setLesson(lesson, lessonId) {
        opts.lesson = lesson;
        opts.lessonId = lessonId;
        renderPrompts();
      },
      focus: () => input.focus(),
      element: host,
    };
  };

  // 补充一个配置项（与 00-core.js 的默认值合并）
  if (CPL.config.ai.maxChars === undefined) {
    CPL.config.ai.maxChars = 12000;
    CPL.config.ai.maxCodeChars = 8000;
  }
  util.hash;
})();
