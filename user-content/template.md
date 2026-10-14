# 我的课程标题（改这里）

## 学习目标

- 能解释 …… 的适用条件与失效场景
- 能预测把参数放大 10 倍后结果如何变化
- 能举出自己代码里的一个同类例子

## 核心概念

在这里写正文。支持 Markdown：

- **粗体**、*斜体*、`行内代码`
- 表格、列表、任务列表 `- [ ]`
- 公式：行内 $E = mc^2$，块级 $$\int_0^1 x^2\,dx = \frac{1}{3}$$
- 提示框：

> [!PHYSICS] 物理直觉
> 先说"为什么会这样"，再说"数学上怎么写"。

> [!NUMERIC] 数值陷阱
> 写清错误现象、原因、以及怎么快速发现它。

### 代码块（建议标注语言，会获得语法高亮）

```python
import numpy as np

def diffusion_1d(n=101, steps=200, r=0.4):
    """一维显式扩散（FTCS）。r = alpha*dt/dx^2 必须 <= 0.5 才稳定。"""
    if r > 0.5:
        raise ValueError(f"r={r} 超过稳定上限 0.5，显式格式会发散")
    u = np.zeros(n)
    u[n // 2] = 1.0
    for _ in range(steps):
        u[1:-1] = u[1:-1] + r * (u[:-2] - 2 * u[1:-1] + u[2:])
    return u
```

```fortran
program diffusion
  implicit none
  integer, parameter :: dp = kind(1.0d0)
  integer, parameter :: n = 101
  real(dp) :: u(n), unew(n), r
  integer :: i, step

  r = 0.4_dp          ! 必须 <= 0.5
  u = 0.0_dp
  u(n/2 + 1) = 1.0_dp

  do step = 1, 200
    unew = u
    do i = 2, n - 1
      unew(i) = u(i) + r * (u(i-1) - 2.0_dp*u(i) + u(i+1))
    end do
    u = unew
  end do

  write(*,'(A,ES12.4)') ' center = ', u(n/2 + 1)
end program diffusion
```

## 我踩过的坑 / 项目锚点

把这一节挂到你自己的科研代码上——这是"忘记不是归零"的具体做法：

- 周期性边界 → `np.roll` + ghost cell（而不是把边界值设为零）
- Fortran 列主序 → 内层循环走第一个下标
- 在循环里 `np.append` → 改成先收集到 list 再 `np.asarray` 一次转换

## 自检（答不上来就说明还没内化）

- 不看笔记，能说出这个概念的适用条件吗？
- 它失效的典型场景是什么？
- 我自己的哪个代码片段里用到了它？

## 延伸阅读

- 教材名 · 第 X 章 —— 只读这一节，重点看什么
- 官方文档：<https://example.com>

---

<!--
  说明：本文件是给人读的 Markdown 版本。
  如果你希望它成为**站点内置课程**（带交互 demo 与自动测试），
  请改用 content/user/_example.js 的内置课程格式，见上一级 README 的「方式 B」。
-->
