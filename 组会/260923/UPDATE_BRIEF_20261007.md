# 组会 0923 Jev 幻灯片更新说明（2026-10-07）

交给修改 `index.html` / `slides.js` 的 agent。目标是加入 2026-10-06 至 07 的本地 Base 对照和 Base/Nimble/Jev 完整输入比较，同时修正 KEV、Nimble 的版本与训练叙述。**这是给 agent 的实施说明，不代表页面已经修改。**

## 先看页面结构

- 可见幻灯片来自同目录的 `slides.js` (`window.JEV_SLIDES`)；`index.html` 在末尾执行 `deck.innerHTML=window.JEV_SLIDES`。因此请修改 `slides.js` 中的表格、说明和结论。`index.html` 前半部的静态 `<section>` 不是浏览器最终显示的内容，不要只改那里。
- `index.html` 中的 `outlineOrder` 决定导航和可见顺序。若新增/更名 `data-sec`，同步更新它；若沿用现有节名，则无需动导航。保留现有 RQ 结构和无标签页的叙事方式。
- 这是 9 月 23 日组会材料，新增实验必须显式标为“10 月 7 日补充”，避免让观众以为它们在原组会时已完成。

## 证据层级和模型身份

1. 本地实测：下表指向本机结果 JSON；除 Jev 既有调用外，新的 Base/Nimble 决策在本地 GPU 上跑。Jev 旧结果复用，没有重新付费调用。
2. Base 不是名为 `Qwen3.5-9B-Base` 的另一个发布模型，而是 **Nimble 所用的 `Qwen/Qwen3.5-9B` 同一 revision `c202236235762e1c871ad0ccb60c8ee5ba337b9a`，不加载 LoRA**，保留相同的 schema 和候选 token 读出。页面统一写“Qwen3.5-9B（无适配器，下称 Base）”。
3. 这批 Nimble 本地权重是 9 月 21 日归档的 2,676 条训练数据版本；远端 `provenance.json` 记录 adapter SHA-256 `ba7e28acb97f973e80fa51f3aa6fc6f75ea4081b89632ed45d8e5f3a1d7bfa6b`。官方仓库在 9 月 24 日又更新了默认 9B checkpoint；**不要把本地成绩冠为最新 checkpoint 的成绩**。模型卡把早期版本标为 `original-2676`，但本地归档未保存 Hugging Face commit，因此建议表中写“本地归档 Nimble-9B（2676 版）”。
4. 本地 Base/Nimble 的候选概率由原始 logits 直接 softmax，即 T=1。早期 Nimble 官方曾给该版本拟合 T=2.179；当前模型卡默认新 checkpoint 用 T=1。**本地所有概率期望分都是未温度校准的读出，不可直接声称复现官方旧版 API 的校准概率**。温度不改变 hard argmax 和 DRB2 的硬判定，但可能改变 DRB1 的概率期望分、TTCW holistic 期望分和 TTCW 14 项 soft-sum，进而改变其排序指标。
5. KEV-4B 现有 MAB/InMind/DRB2 成绩是以前保存的实验，不属于本轮完整输入 Base/Nimble/Jev 比较；不能填入新同协议列。官方 KEV-4B 模型卡已更新为 Kev 1.0，多阶段数据与 T=2.41；页面现有“两阶段 + T=2.14”只适用于旧发布快照，不能再标成当前 KEV-4B 的完整训练配方。
6. Jev 可在一次请求中给多个字段打分；本地 Base/Nimble 对每个字段分别构造 schema 并前向。数据、语义问题和最终指标尽量对齐，但调用结构、概率校准与计算量并非完全相同；页面用“同数据/同输入内容对照”，不要写“完全同协议、同计算”。

## 应上屏的新增数据

### MAB 60：Top-5 检索后最终回答准确率

保留页面已有 Jev/Nimble/KEV 等行，增加 Base 三种布局。相同 60 题，Base 的两种新布局用相同的 GPT-4o-mini 回答和 GPT-4o LongMemEval judge。布局不是三个独立模型，也不要挑最优布局当作无选择偏差的整体 Base 成绩。

| Base 检索布局 | 正确 | 准确率 |
| --- | ---: | ---: |
| query + memory in state（原布局） | 41/60 | 68.3% |
| memory in state, query in instruction | 42/60 | 70.0% |
| memory in state + timestamp | 43/60 | 71.7% |

来源：`/Users/ruizheli/Documents/project/tranformer-as-retriever/base-evaluation/full-deck-20261006/PROTOCOL.md` 和 `results/mab_layouts_eval/final_summary.json`。注意 Base 最好布局 43/60 与旧 Nimble 43/60 数值相同，协议/检索输入不能自动视作完全一致。

### InMind 20：gold chunk 检索

在现有 20 题表中加 Base 两行，不要把它和 125 题数字混为同一子集。

| Base chunk | R@1 | R@5 | R@10 | MRR@10 |
| --- | ---: | ---: | ---: | ---: |
| exchange | 40% | 70% | 75% | 0.520 |
| session | 0% | 15% | 30% | 0.093 |

来源：`/Users/ruizheli/Documents/project/tranformer-as-retriever/base-evaluation/results/base9b-20261006/inmind/summary.json`。Base 长 session 采用 1,200-token 重叠窗口 + max 聚合；Jev 整个 session 一次输入，**session 行不是同输入计算对照**。

### InMind 125：检索与最终回答

现有全量最终回答表可增加 Base 四行；Base/Jev 的回答生成和评分沿用历史 `gpt-5-mini` prompt，但检索候选、长 session 处理仍有差异。不要把 gold recall 当成最终回答成功率。

| Base chunk | 检索 R@1 | R@5 | R@10 | MRR@10 | Top-5 最终成功 | Top-10 最终成功 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| exchange | 0.536 | 0.752 | 0.800 | 0.635 | 76/125 = 60.8% | 75/125 = 60.0% |
| session | 0.008 | 0.136 | 0.464 | 0.093 | 14/125 = 11.2% | 38/125 = 30.4% |

Jev 旧 end-to-end 结果：exchange Top-5 `95/125=76.0%`、Top-10 `96/125=76.8%`；session Top-5 `75/125=60.0%`、Top-10 `82/125=65.6%`。来源：`/Users/ruizheli/Documents/project/tranformer-as-retriever/base-evaluation/full-deck-20261006/results/inmind125/summary.json`、`results/inmind125/e2e/summary.json`，Jev 数字见现有 `slides.js` / 其原始结果。建议 125 题页重点展示最终回答，检索表可压缩成脚注/次表。

### DRB1：同一 17 题、每题四份报告

按 **holistic / direct / RACE 三种输入协议分别成组**，不要把三种方法混成一行。三模型每组均覆盖 17 题 x 4 报告；FAP/FAS 只在原规则保留的 14 题上计算。Overall 是 PAR、OPC、FAP、FAS 四项均值，单位是百分制。RACE 输入 task + 完整 target report + 完整 reference report + weighted criteria；direct 无 reference；holistic 无 reference 和 criteria。

| 协议 | 模型 | PAR | OPC | FAP | FAS | Overall |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Holistic | Base | 56.86 | 75.42 | 28.69 | 17.59 | 44.64 |
| Holistic | Nimble | 51.96 | -6.75 | 23.89 | 14.73 | 20.96 |
| Holistic | Jev | 70.59 | 93.51 | 51.62 | 48.49 | 66.05 |
| Direct | Base | 77.45 | 98.48 | 60.06 | 62.26 | 74.56 |
| Direct | Nimble | 72.55 | 99.75 | 53.70 | 46.16 | 68.04 |
| Direct | Jev | 73.53 | 93.11 | 62.96 | 59.40 | 72.25 |
| RACE | Base | 76.47 | 99.33 | 67.87 | 63.69 | 76.84 |
| RACE | Nimble | 74.51 | 98.80 | 62.72 | 58.49 | 73.63 |
| RACE | Jev | 75.49 | 93.40 | 67.00 | 62.26 | 74.54 |

来源：Base `.../base-evaluation/full-deck-20261006/results/drb_full/drb1/{holistic,direct,race}/metrics.json`；Nimble `.../base-evaluation/aligned-full-20261007/results/nimble_drb1/{holistic,direct,race}/metrics.json`；Jev `.../drb1-jev-audit/results/jev_{holistic_reference_free_17,direct_reference_free_17,race_openrouter}/metrics.json`。Nimble RACE 本地 1,708/1,708 criterion 文件、68/68 pair 文件已核对。原表的 GPT-5.5/Gemini 等基线可以保留，但要核对其 RACE 输入协议再与相应分组并列。

### DRB2：10 个文本任务、739 条 rubric decision

替换现有“Nimble 70.64%”主展示：这是旧窗口化输入，**新完整报告输入**是 77.13%。同表加 Base；旧 Nimble/KEV 如需保留，应放“早期窗口化/非同输入补充”，不能直接夹在 full-report 主比较里。

| 完整输入模型 | Accuracy | Macro-F1 | blocked 类召回（38 条 gold） |
| --- | ---: | ---: | ---: |
| Base | 76.32% | 0.5044 | 0/38 |
| Nimble | 77.13% | 0.5665 | 8/38 |
| Jev | 89.17% | 0.8071 | 30/38 |

旧 KEV 窗口化结果为 68.74% / 0.5494，不能声称是完整报告同协议。Gemini-2.5-Pro、GPT-5 现有基线可保留并标明其输入/评分协议。来源：Base `.../base-evaluation/full-deck-20261006/results/drb_full/drb2/metrics.json`；Nimble `.../base-evaluation/aligned-full-20261007/results/nimble_drb2/metrics.json`；Jev `.../drb2-decision-eval/results/metrics.json` 的 `Jev full report`。建议突出 blocked 召回，否则 accuracy 掩盖了 Base 的失败。

### TTCW：48 篇完整故事、12 组排序

必须拆分为 **无 rubric 的 holistic 21 档期望分** 和 **原始 14 项 Yes/No 的 hard/soft 累加**；不要让观众以为是同一评分函数。所有新 Base/Nimble 输入完整故事，Jev 旧结果也为完整故事。外部 reference-free/reference-based 基线继续单独标注，不要合并口径。

| 方法 | 模型 | Spearman | Kendall | Pairwise |
| --- | --- | ---: | ---: | ---: |
| Holistic 0–100 | Base | 0.4360 | 0.3583 | 0.7222 |
| Holistic 0–100 | Nimble | -0.4553 | -0.3833 | 0.3056 |
| Holistic 0–100 | Jev | 0.2805 | 0.2347 | 0.6667 |
| 14 项 hard Yes 累加 | Base | 0.1748 | 0.1347 | 0.7222 |
| 14 项 hard Yes 累加 | Nimble | -0.0305 | -0.0403 | 0.5833 |
| 14 项 hard Yes 累加 | Jev | 0.1138 | 0.1236 | 0.6944 |
| 14 项 P(Yes) 累加 | Base | 0.1362 | 0.0986 | 0.5556 |
| 14 项 P(Yes) 累加 | Nimble | -0.1027 | -0.0805 | 0.5278 |
| 14 项 P(Yes) 累加 | Jev | 0.5305 | 0.4569 | 0.7500 |

14 项逐项准确率：Base 0.4554，Nimble 0.3884，Jev 0.5625；预测 Yes 比例为 0.8125 / 0.9360 / 0.6637，gold Yes 比例 0.3393。这是解释 Nimble collapse 的关键，不要只显示故事级 Spearman。来源：`.../base-evaluation/aligned-full-20261007/results/{base_ttcw_holistic,nimble_ttcw_holistic,nimble_ttcw14}/metrics.json`、`.../base-evaluation/full-deck-20261006/results/ttcw14/metrics.json`、`.../ttcw-jev-naive/results{,_holistic}/metrics.json`。

## KEV / Nimble：研究内容怎么更新

### 共同点和机制差异

- 两者都以 Qwen3.5 做 backbone，并用 LoRA 更新模型内部投影；不是“前面层完全冻结、只在末尾训分类头”。KEV 的原始 backbone 权重冻结，但多个内部模块有可训练 LoRA；Nimble 同理。因此“只是加 head”不对。
- Nimble-9B 保留 LM vocabulary head，从 A/B/C 等受限候选 token 的 logits 做 softmax，再映射回 typed choice / Noul / Score；没有新 pointer head。它在 2,676 条合成且模型审核、无人类复核的训练样本上做 hard-label candidate CE，1 epoch，LoRA r16。**不是 Jev 概率蒸馏，也没有证明 RLCD 复现**。其官方 324 条同源 holdout agreement 292/324=90.12%，与 Qwen3.5-9B 的 215/324=66.36% 比较，只说明合成标签匹配；本轮跨任务结果不能由此预测。
- KEV-4B 使用 Qwen3.5-4B-Base + LoRA + pointer head，以问题最终位置和候选结束位置的 hidden states 打 K 个 logits；不靠 LM 生成答案。其公开基础配方是 hard-label CE，后接数据/技能训练与单温度校准；**单温度不能改变候选排序，更不等于概率级 RLCD**。
- 这两条开源路线证明 typed decision 的部分能力可以用受限读出 + SFT 获得，但不能据此推断 Jev 的闭源架构、训练数据或 RLCD 细节。`Nimble/KEV 是 Jev 的完整复现`、`Jev 的优势已经归因于 RLCD` 都是越证据的说法。

### 版本警告（改页时务必处理）

- 现有 `slides.js` 的 KEV“2 epochs v7 + delta 1 epoch + T=2.14”是早期快照。当前 [KEV-4B 模型卡](https://huggingface.co/jaredpalmer/kev-4b)称 2026-09-24 的 Kev 1.0 还训练了 real documents、hard skills、developer tooling，默认 T=2.41，长文档可服务不等于 64k 效果已验证（卡片的 validated context 为 8,192）。如果更新成“当前 KEV”，必须同步改数据、训练、版本、温度和模型卡引用；**不要把旧本地成绩贴在新版模型卡配方下**。更保守的做法是保留旧架构解释，但在页眉明确“本地测试时的 KEV 快照”，将新版另列“截至 10 月 7 日的官方更新”，不填本地新分数。
- 现有 Nimble 数据/训练页与 2,676 版基本对应；当前 [Nimble 仓库](https://github.com/bespokelabsai/nimble)和[模型卡](https://huggingface.co/bespokelabs/Bespoke-Nimble-9B)已经说明 9 月 24 日默认 checkpoint 更新。请为本地表格固定“2676 版归档”，不要拿最新模型卡的新增能力替代本地实测。
- 官方模型卡自身给出的分数都是**发布方报告**；本地 MAB/InMind/DRB/TTCW 是**我们复现/迁移测试**。视觉上用不同证据标签，并在脚注附源链接。

## 建议改页顺序与验收

1. 先改 `slides.js` 的 RQ1：MAB / InMind / DRB2 / DRB1 / TTCW 五页，新增 Base 与完整输入 Nimble；旧 KEV 行加协议标记，删除 Nimble “未测试”。DRB1 可拆成三个窄表或三组行，保证列头和协议一一对应；TTCW 同样按 holistic / 14-hard / 14-soft 分组。
2. 改 RQ3 的版本标签与模型对照：保留架构差异，但把 KEV 当前与旧快照分开，Nimble 标明 2676 版。更新任何“开源最强”“只有 Jev 能做到”之类结论：本轮 Base 在 DRB1 direct/RACE 和 TTCW holistic 反超 Jev，Nimble 仅在 DRB2 略高于 Base，Jev 在 DRB2 与 TTCW 14-soft 明显领先。不要宣称一种模型全面领先。
3. 在 RQ1 结论处写清：**更大 backbone / 更多 SFT 不保证跨任务迁移；输入协议、候选读出和聚合函数对结果有强影响**。这些是小子集/特定任务观察，不是总体模型能力排序或因果归因。
4. 更新任何新增结果的来源链接到本说明和本地指标文件。检查页面里残留的“未测试”、`70.64%` 被误标为 full report、以及旧 `T=2.14` 被写作当前 KEV。
5. 验收时运行 `node --check slides.js`；检查 `outlineOrder` 与可见 `data-sec` 无缺项/重复；桌面和窄屏逐页查看表格是否溢出、强调色是否只标同协议组内最佳、脚注可读。不要改了 `index.html` 静态表却没改 `slides.js`。

## 本地来源入口

- 完整输入协议与总表：`/Users/ruizheli/Documents/project/tranformer-as-retriever/base-evaluation/aligned-full-20261007/PROTOCOL.md`
- Base 其余任务协议、成本与结果：`/Users/ruizheli/Documents/project/tranformer-as-retriever/base-evaluation/full-deck-20261006/PROTOCOL.md`
- Jev 既有 DRB1/2/TTCW 指标：`/Users/ruizheli/Documents/project/tranformer-as-retriever/drb1-jev-audit/results/`、`drb2-decision-eval/results/metrics.json`、`ttcw-jev-naive/results/`
- 官方 KEV：[GitHub](https://github.com/jaredpalmer/kev)、[KEV-4B 模型卡](https://huggingface.co/jaredpalmer/kev-4b)
- 官方 Nimble：[GitHub](https://github.com/bespokelabsai/nimble)、[Nimble-9B 模型卡](https://huggingface.co/bespokelabs/Bespoke-Nimble-9B)
