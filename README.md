# imlrz.github.io

李睿哲 (Ruizhe Li) 的个人主页 —— 单页、零依赖、可在四种视觉主题间实时切换。

> 本科生 @ 中国科学技术大学 · 人工智能与数据科学学院 · 数据科学
> 研究方向：深度研究系统（Deep Research）与智能体记忆（Agent Memory）

## ✨ 四套主题，一键切换

右上角的主题按钮可在四种完全不同的设计语言之间切换，选择保存在 `localStorage`：

| 主题 | 风格 | 说明 |
|------|------|------|
| **Editorial** | 米白 · 衬线 | 暖米色纸张质感 + Fraunces/Newsreader 衬线排版，学术、克制、隽永（默认） |
| **Terminal** | 等宽 · 荧光 | 近黑底 + 磷光绿，命令行美学：`$` 提示符、闪烁光标、扫描线纹理 |
| **Academic** | 浅色 · 侧栏 | 仿顶尖 ML 研究者主页的左侧固定栏布局，头像 + 链接 + 卡片化论文列表 |
| **Starry Night** | 梵高 · 画布 | 保留原《星月夜》Canvas 粒子动画（漩涡星辰 / 弯月 / 流星）+ 玻璃拟态卡片 |

每个主题拥有独立的配色、字体与版式——不是简单换肤，而是四种排版结构。

## 🌐 中英双语

右上角语言按钮在中 / EN 间切换；所有正文通过 `data-i18n` 标记，英文为 DOM 默认、中文由 JS 字典覆盖，切换即时且保存偏好。

## 📄 内容板块

- **About** —— 研究简介与兴趣标签
- **News** —— 近期动态
- **Publications** —— 论文列表（含 arXiv / Code / Website / Dataset 链接）
  - *DeepResearch Bench II: Diagnosing Deep Research Agents via Rubrics from Expert Reports*，arXiv:2601.08536（共同一作）
- **Projects** —— DeepResearch-Bench-II、Diabetica、Eat-at-USTC、Claude Code 源码精读
- **Education · Service · Skills** —— 教育背景、学生工作与志愿服务、技能

## 🛠 技术栈

- 纯 HTML / CSS / JavaScript，**零构建、零依赖**
- 主题与语言均通过根元素 `data-theme` / `data-lang` 属性 + CSS 自定义属性驱动
- `<head>` 内联脚本预读 `localStorage`，避免主题闪烁（FOUC）
- Google Fonts：Fraunces · Newsreader · JetBrains Mono · Bricolage Grotesque · Source Serif 4 · Cormorant Garamond
- 遵循前端设计规范：**UI 元素一律纯色 + 阴影 / 描边，不使用渐变**；噪点 / 扫描线 / 点阵仅作纹理
- `IntersectionObserver` 滚动渐入；`prefers-reduced-motion` 降级
- 《星月夜》画布动画见 `starry-night.js`，仅在切到 Starry 主题时按需懒加载

## 📁 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 全部页面、四套主题样式、i18n 字典与交互逻辑 |
| `starry-night.js` | 星月夜 Canvas 粒子系统（按需加载） |

## 🚀 本地预览

直接用浏览器打开 `index.html` 即可，无需服务器。
