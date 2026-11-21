# imlrz.github.io

李睿哲 (Ruizhe Li) 的个人主页 —— 单页、零依赖、可在五种天体主题间实时切换。

> 本科生 @ 中国科学技术大学 · 人工智能与数据科学学院 · 数据科学
> 研究方向：深度研究系统（Deep Research）与智能体记忆（Agent Memory）

## ✨ 五套天体主题，一键切换

右上角的主题按钮打开照片选卡：真实天体影像、配色色条与字体说明放在同一张卡片中，选择保存在 `localStorage`。支持手机、键盘、Escape 和点击遮罩关闭：

| 主题 | 风格 | 说明 |
|------|------|------|
| **Europa · 木卫二** | 米白 · 红陶 | 原 Editorial；暖米色纸张质感 + Fraunces/Newsreader 衬线排版（默认） |
| **Uranus · 天王星** | 等宽 · 荧光 | 原 Terminal；近黑底 + 磷光绿，保留 `$` 提示符、闪烁光标、扫描线纹理 |
| **Neptune · 海王星** | 钴蓝 · 侧栏 | 原 Academic；白底、蓝色强调与左侧固定栏布局 |
| **Earth · 地球** | 午夜蓝 · 金 | 原 Starry Night；保留 Canvas 粒子动画（漩涡星辰 / 弯月 / 流星）+ 玻璃拟态卡片 |
| **Lemmon · 莱蒙彗星** | 深青绿 · 浅绿 | 新主题；取自 Jetriever 论文的 `#245B56`、`#5B6763`、`#EDF4F1`，配青蓝辅助色 |

每个主题拥有独立的配色、字体与版式。现有内部 ID `editorial`、`terminal`、`academic`、`starry` 保留以兼容已保存的偏好，新主题 ID 为 `lemmon`。浏览器禁用本地存储时也可正常切换。

照片保存在 `assets/themes/`，署名与原始链接见 [照片来源](assets/themes/credits.html)。木卫二与海王星使用增强色观测影像；主题色是设计解释，不是天体颜色的精确测量。图片仅缩小为 WebP，不作额外染色。

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
- 《星月夜》画布动画见 `starry-night.js`，仅在切到 Earth 主题时按需懒加载

## 📁 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 全部页面、五套主题样式、i18n 字典与交互逻辑 |
| `starry-night.js` | 星月夜 Canvas 粒子系统（按需加载） |
| `assets/themes/` | 五张天体照片缩略图与署名页 |

## 🚀 本地预览

组会目录可通过 `/组会/` 或 `/group-meeting/` 访问；英文别名的日期链接也会保留查询参数与页码锚点，跳转到同一份中文路径资料（例如 `/group-meeting/260923/` → `/组会/260923/`）。新增组会日期时，同步添加对应的英文别名页。

`/talk/` 中的 2026.11.18 讲座提供 Slides 与 Bilibili 视频链接，slides 封面也可直接打开录像。

直接用浏览器打开 `index.html` 即可，无需服务器。
