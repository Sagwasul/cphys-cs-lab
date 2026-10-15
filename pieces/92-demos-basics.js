/* ============================================================================
 * 92-demos-basics.js — 模块 0（零基础入门）的交互式 demo
 *
 * 这里只有一个 demo：code-trace（逐行执行追踪）。
 *
 * 为什么需要它：
 *   零基础的读者最大的障碍是"一行代码到底发生了什么"。光看文字说明很容易
 *   以为自己懂了，但那是识别，不是理解。这个 demo 把一小段程序拆成一行一行，
 *   点一次"下一行"走一步，每一步都用中文说清**这一行做了什么、值变成了什么**。
 *
 * 它的数据全部写在下面 PROGRAMS 里（不是解析真实 Python）：
 *   在浏览器里解析并执行任意 Python 是 Pyodide 的活，那是"代码练习"部分的职责；
 *   这个 demo 的职责是**放慢速度讲清单步语义**，所以用预先写好的逐步说明更可靠，
 *   也不会因为用户改错一个字符就抛异常。
 * ==========================================================================*/
(function () {
  'use strict';
  const CPL = window.CPL;
  const dom = CPL.dom;
  const demos = CPL.demos;

  const PROGRAMS = [
    {
      id: 'first-output',
      label: '第一个程序：让屏幕显示一行字',
      code: [
        '# 井号开头的这一行是注释，Python 完全忽略它',
        'print("你好，世界")',
        'print(2 + 3)',
        'print("2 + 3")',
      ],
      steps: [
        {
          line: 0,
          what: '注释行。Python 读到 # 就把这一行剩下的内容全部丢掉，不执行任何动作。它只写给读代码的人看。',
          state: '还没有任何输出。',
        },
        {
          line: 1,
          what: '调用 print。print 是一个**函数**——一段有名字、可以被反复使用的代码。你给它一个值，它就把这个值显示到屏幕上。这里的值是 "你好，世界"，两边的双引号表示它是一个**字符串**，也就是一段文字。',
          state: '第一行输出：你好，世界',
          newOutput: '你好，世界',
        },
        {
          line: 2,
          what: 'print(2 + 3)：括号里不是文字，而是一个**算式**。Python 先把 2 + 3 算出来得到 5，再把 5 交给 print 显示。所以屏幕上出现的是 5，不是 "2 + 3"。',
          state: '第二行输出：5',
          newOutput: '5',
        },
        {
          line: 3,
          what: 'print("2 + 3")：这次括号里带着双引号，所以它是一个字符串，内容是三个符号 2、空格、+、空格、3。Python 不会去算它，直接把这段文字原样显示。对比上一行，这是**初学者最常混淆的地方**：有没有引号，决定了"算出来"还是"原样输出"。',
          state: '第三行输出：2 + 3',
          newOutput: '2 + 3',
        },
      ],
      takeaway:
        '同一个 print，加不加引号结果完全不同：有引号 → 原样输出这段文字；没引号 → 先算出来，再输出结果。程序就是"按顺序执行的一串指令"，从第一行开始，一行一行往下走。',
    },
    {
      id: 'order-matters',
      label: '执行顺序：为什么顺序不能颠倒',
      code: [
        'print("第一步")',
        'print("第二步")',
        'print("第三步")',
      ],
      steps: [
        { line: 0, what: '执行第一行：显示 第一步。', state: '输出：第一步', newOutput: '第一步' },
        {
          line: 1,
          what: '执行第二行：显示 第二步。注意——Python 是**从上往下**依次执行的，它不会跳着来。',
          state: '输出：第一步、第二步',
          newOutput: '第二步',
        },
        { line: 2, what: '执行第三行：显示 第三步。程序到这里结束。', state: '输出：第一步、第二步、第三步', newOutput: '第三步' },
      ],
      takeaway:
        '把这三行的顺序换一下，屏幕上出现的顺序就跟着换。程序的"顺序"是有意义的信息，不是随便排的。',
    },
    {
      id: 'syntax-error',
      label: '出错会怎样：一个字符写错就停下',
      code: [
        'print("第一行没问题")',
        'print("这一行少了右边的括号"',
        'print("这一行永远不会执行")',
      ],
      steps: [
        { line: 0, what: '执行第一行：显示 第一行没问题。', state: '输出：第一行没问题', newOutput: '第一行没问题' },
        {
          line: 1,
          what: 'Python 准备执行这一行时，发现括号没有配对（左边有一个 (，右边没有 )）。它**在动手执行之前**就拒绝了这个文件，抛出 SyntaxError（语法错误）。"语法"就是这种"括号必须配对、引号必须成对"的书写规则。',
          state: '报错：SyntaxError: \'(\' was never closed',
          error: "SyntaxError: '(' was never closed",
        },
        {
          line: 2,
          what: '这一行不会被跳过——**整个文件都没能开始运行**。注意这和你可能以为的"执行到第二行才出错"不一样：语法错误是在"翻译"阶段就被发现的，所以第一行其实也没有真正执行。这是本 demo 唯一一处为了讲清楚而简化的地方：真实的 SyntaxError 会让你连第一行的输出都看不到。',
          state: '整个程序都没有运行',
        },
      ],
      takeaway:
        '两类错误要分清：**语法错误（SyntaxError）**是书写规则不对，程序根本不会开始运行，Python 会告诉你第几行；**运行时错误**是书写没问题、但执行到某一步做不成（比如除以零），这时前面的输出已经产生了。读报错时先看最后一行，那里写着错误的类型和位置。',
    },
  ];

  demos.register('code-trace', (host, params, api) => {
    const pickId = (params && params.program) || PROGRAMS[0].id;
    const program = PROGRAMS.find((p) => p.id === pickId) || PROGRAMS[0];

    let step = -1; // -1 表示"还没开始"

    const codeHost = dom.h('div', { class: 'cpl-trace__code' });
    const outputHost = dom.h('pre', { class: 'cpl-trace__out', 'aria-live': 'polite' });
    const whatHost = dom.h('p', { class: 'cpl-trace__what' });
    const stateHost = dom.h('p', { class: 'cpl-trace__state' });
    const progressHost = dom.h('div', { class: 'cpl-trace__progress' });

    const lineEls = program.code.map((text, i) => {
      const el = dom.h('div', { class: 'cpl-trace__line' });
      el.append(
        dom.h('span', { class: 'cpl-trace__no', text: String(i + 1) }),
        dom.h('code', { text: text || '\u00a0' })
      );
      codeHost.append(el);
      return el;
    });

    const prevBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '上一步',
      onclick: () => go(step - 1),
    });
    const nextBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm cpl-btn--primary',
      type: 'button',
      text: '下一行',
      onclick: () => go(step + 1),
    });
    const resetBtn = dom.h('button', {
      class: 'cpl-btn cpl-btn--sm',
      type: 'button',
      text: '从头开始',
      onclick: () => go(-1),
    });

    function render() {
      // 高亮当前行
      lineEls.forEach((el, i) => {
        el.classList.toggle('is-current', i === step);
        el.classList.toggle('is-done', i < step);
      });

      const visible = program.steps.slice(0, step + 1);
      outputHost.textContent = visible.map((s) => s.newOutput).filter(Boolean).join('\n');

      const cur = step >= 0 ? program.steps[step] : null;
      if (!cur) {
        whatHost.textContent = '点"下一行"，从第 1 行开始执行。';
        stateHost.textContent = '';
        stateHost.className = 'cpl-trace__state';
      } else {
        whatHost.textContent = cur.what;
        stateHost.textContent = cur.state || '';
        stateHost.className = 'cpl-trace__state' + (cur.error ? ' is-error' : '');
        if (cur.error) {
          // 报错时把输出区最后一行显示成报错样式（文本本身已包含在 steps 里）
          outputHost.textContent = visible.map((s) => s.newOutput).filter(Boolean).join('\n');
        }
      }

      progressHost.textContent = `第 ${Math.max(step + 1, 0)} / ${program.steps.length} 步`;
      prevBtn.disabled = step <= -1;
      nextBtn.disabled = step >= program.steps.length - 1;
      if (step >= program.steps.length - 1) nextBtn.textContent = '已到最后一步';
      else nextBtn.textContent = '下一行';
    }

    function go(next) {
      step = Math.max(-1, Math.min(next, program.steps.length - 1));
      render();
    }

    host.append(
      dom.h('div', { class: 'cpl-trace__title', text: program.label }),
      codeHost,
      dom.h('div', { class: 'cpl-trace__controls' }, [prevBtn, nextBtn, resetBtn, progressHost]),
      dom.h('div', { class: 'cpl-trace__panels' }, [
        dom.h('div', { class: 'cpl-trace__panel' }, [
          dom.h('h4', { text: '程序输出' }),
          outputHost,
        ]),
        dom.h('div', { class: 'cpl-trace__panel' }, [
          dom.h('h4', { text: '这一行做了什么' }),
          whatHost,
          stateHost,
        ]),
      ]),
      dom.h('div', { class: 'cpl-demo__note', text: program.takeaway })
    );

    render();

    // 让课程页的"重跑/清理"按钮能复位
    if (api && typeof api.onReset === 'function') api.onReset(() => go(-1));
  });
})();
