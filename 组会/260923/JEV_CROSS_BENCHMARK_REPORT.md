# Jev 与开源替代模型跨 Benchmark 结果汇总

更新时间：2026-09-23

## 0. 读表规则

- **MAB、InMind**：评估 memory retrieval 以及检索后的最终回答，分数越高越好。
- **DRB2、DRB1、TTCW**：评估 judge 与人类标注或既有 evaluator 的一致性，不能与 retrieval Recall 直接横向比较。
- **Jev** 是闭源 decision model；目前本地测过的开源替代为 **Nimble-9B、KEV-4B、Laya**。
- 粗体只表示同一张表、同一口径下的最好值。全量、固定子集和协议变体均单独标注。

## 1. 展开总览

### MAB：固定 60 题，Top-5 后回答准确率

| 类型 | 模型 / 方法 | 结果 |
|---|---|---:|
| Jev | query + memory | **45/60 (75.0%)** |
| Jev | memory in state | 44/60 (73.3%) |
| Jev | memory in state + timestamp | **45/60 (75.0%)** |
| 开源 | Nimble-9B | 43/60 (71.7%) |
| 开源 | KEV-4B | 40/60 (66.7%) |
| 开源 | Laya | 19/60 (31.7%) |
| 基线 1 | ReFind 保存答案 | 34/60 (56.7%) |

本次只有一个同 60 题、同任务集合且有保存结果的外部基线。

### InMind：同一 20 题，gold chunk retrieval

| 类型 | 模型 / 方法 | R@1 | R@5 | R@10 | MRR@10 |
|---|---|---:|---:|---:|---:|
| Jev | exchange chunk | **85%** | 90% | 90% | **0.867** |
| Jev | session chunk | 45% | 75% | **100%** | 0.606 |
| 开源 | Nimble-9B，exchange | 70% | **95%** | 95% | 0.774 |
| 开源 | KEV-4B，exchange | 55% | 65% | 70% | 0.606 |
| 开源 | Laya，exchange | 10% | 15% | 15% | 0.113 |

这 20 题没有保存完全相同候选和 chunk 协议的传统 embedding/BM25 排名结果，故不混入不等价 baseline。Jev 全量 125 题结果见第 3 节。

### InMind：全量 125 题，最终回答成功率

| 类型 | 模型 / 方法 | 结果 |
|---|---|---:|
| Jev | exchange Top-5 | 76.0% |
| Jev | exchange Top-10 | **76.8%** |
| Jev | session Top-5 | 60.0% |
| Jev | session Top-10 | 65.6% |
| 开源 | Nimble-9B | 未跑同协议 |
| 开源 | KEV-4B | 未跑同协议 |
| 开源 | Laya | 未跑同协议 |
| 上界 | Backbone，目标事实直接在上下文 | **85.6%** |
| 上界 | Always-in-state | 64.8% |
| 基线 | Naive RAG MiniLM Top-5 | 0.0% |
| 基线 | Naive RAG MiniLM Top-10 | 0.0% |
| 基线 | Naive RAG emb3-large Top-5 | 0.0% |
| 基线 | Naive RAG emb3-large Top-10 | 2.4% |
| 基线 | Naive RAG BM25 Top-5 | 0.0% |
| 基线 | Naive RAG BM25 Top-10 | 1.6% |
| 基线 | A-RAG MiniLM | 3.2% |
| 基线 | A-RAG emb3-large | 8.0% |
| 基线 | xMemory MiniLM | 1.6% |
| 基线 | xMemory emb3-large | 3.2% |
| 基线 | Mem0 MiniLM | 1.6% |
| 基线 | Mem0 emb3-large | 4.0% |
| 基线 | A-MEM MiniLM | 0.8% |
| 基线 | A-MEM emb3-large | 5.6% |
| 基线 | HippoRAG2 MiniLM | 0.0% |
| 基线 | HippoRAG2 emb3-large | 0.8% |
| 基线 | MemoryOS MiniLM | 0.8% |
| 基线 | MemoryOS emb3-large | 5.6% |

基线列使用同一 125 题上的严格 `Recall AND Reminder`；Backbone 和 Always-in-state 是信息可见性上界，不是普通 retrieval 系统。Jev 行是此前 end-to-end answer judge 的 success rate，评测目标相同但没有拆成 Recall 与 Reminder 两步，因此应视为近似对照而非严格同实现复现。

### DRB2：10 个文本任务、739 条 rubric decision

| 类型 | 模型 / 方法 | Accuracy | Macro F1 | Cohen Kappa |
|---|---|---:|---:|---:|
| Jev | full report | 89.17% | 0.8071 | 0.7478 |
| 开源 | Nimble-9B hard-any | 70.64% | 0.5641 | 0.4536 |
| 开源 | KEV-4B hard-any | 68.74% | 0.5494 | 0.4421 |
| 开源 | Laya max-prob | 44.79% | 0.3009 | 0.0415 |
| 基线 1 | Gemini-2.5-Pro evaluator | **90.66%** | **0.8858** | **0.7944** |
| 基线 2 | GPT-5 evaluator | 87.14% | 0.6050 | 0.7032 |
| 基线 3 | 全预测 0 | 70.50% | 0.2757 | 0.0000 |

### DRB1：同一 17/50 题的人类一致性

RACE 行同时输入原始 research task、待评 research report、reference research report 和 task-specific weighted criteria；direct 行移除 reference；holistic 行进一步移除 criteria。这里的 reference 是参考答案文章，不是检索来源文献。

| 类型 | 模型 / 方法 | PAR | OPC | FAP | FAS | Overall |
|---|---|---:|---:|---:|---:|---:|
| Jev | Jev 1.13 RACE | **75.49** | 93.40 | **67.00** | 62.26 | 74.54 |
| Jev | Direct absolute score，reference-free | 73.53 | 93.11 | 62.96 | 59.40 | 72.25 |
| Jev | Holistic 0–100，reference-free + rubric-free | 70.59 | 93.51 | 51.62 | 48.49 | 66.05 |
| 开源 | Nimble-9B | 未测试 | - | - | - | - |
| 开源 | KEV-4B | 未测试 | - | - | - | - |
| 开源 | Laya | 未测试 | - | - | - | - |
| 基线 1 | GPT-5.5 | 73.53 | 95.52 | 66.95 | **65.12** | **75.28** |
| 基线 2 | Gemini-3-Pro | **75.49** | 92.59 | 65.74 | 62.26 | 74.02 |
| 基线 3 | Gemini-3.1-Pro | 72.55 | 93.90 | 64.34 | 57.37 | 72.04 |
| 基线 4 | DeepSeek-v4-Pro | 71.57 | **98.92** | 60.17 | 57.37 | 72.01 |

指标定义：`PAR` 是逐题四系统两两胜负与人类的一致率；`OPC` 是四个系统跨题平均分与人类平均分的 Pearson 相关；`FAP`/`FAS` 是过滤掉人类 ICC 小于 0 的题后，逐题计算四系统 Pearson/Spearman 再取平均；`Overall` 为四项算术平均。本子集 17 题中有 14 题通过 ICC 过滤。

### TTCW：全量 48 stories / 672 items

| 类型 | 模型 / 方法 | Spearman | Kendall | Pairwise |
|---|---|---:|---:|---:|
| Jev | 原始 14 项硬累加，reference-free | 0.1138 | 0.1236 | 0.6944 |
| Jev | 14 个 P(Yes) 直接累加，reference-free | **0.5305** | **0.4569** | **0.7500** |
| Jev | Holistic 0–100，reference-free + rubric-free | 0.2805 | 0.2347 | 0.6667 |
| 开源 | Nimble-9B | 未测试 | - | - |
| 开源 | KEV-4B | 未测试 | - | - |
| 开源 | Laya | 未测试 | - | - |
| Reference-free 基线 | Claude v1.3 | 0.15 | 0.16 | 0.64 |
| Reference-free 基线 | Claude 3 Opus | 0.25 | 0.22 | 0.64 |
| Reference-free 基线 | Claude 3.5 | 0.14 | 0.13 | 0.64 |
| Reference-free 基线 | GPT-4o | 0.16 | 0.14 | 0.64 |
| Reference-free 基线 | Qwen2-72B | -0.12 | -0.11 | 0.58 |
| Reference-based 基线 | Claude 3.5 | 0.49 | 0.44 | **0.75** |
| Reference-based 基线 | GPT-4o | 0.38 | 0.36 | 0.72 |
| Reference-based 基线 | Qwen2-72B | 0.22 | 0.16 | 0.61 |

Jev holistic 不使用 reference 或 rubric，Spearman/Kendall 高于表中全部外部 reference-free 基线，但低于 14 项 `P(Yes)` 软累加。Jev soft-sum 同样不使用 reference，其排序结果达到或略高于这里最强的 reference-based 基线。

## 2. MemoryAgentBench（固定 60 题子集）

协议：ReFind 主表 30 个 converted tasks 各取前 2 题；Top-5 retrieval；统一用 `gpt-4o-mini` 回答；LME 使用原 MAB question-type judge。该结果是确定性方便子集，不是官方 2,800 题全量。

| Retriever | 总体 | EventQA (30) | FC-MH (8) | FC-SH (8) | LME (10) | SH-QA (2) | MH-QA (2) |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Jev，query + memory state** | **45/60 (75.0%)** | 29 | 2 | 8 | 3 | 2 | 1 |
| Jev，memory in state | 44/60 (73.3%) | - | - | - | - | - | - |
| Jev，memory in state + timestamp | **45/60 (75.0%)** | - | - | - | - | - | - |
| Nimble-9B | 43/60 (71.7%) | 28 | 1 | 8 | 3 | 2 | 1 |
| KEV-4B | 40/60 (66.7%) | 27 | 0 | 7 | 4 | 2 | 0 |
| ReFind 保存答案 | 34/60 (56.7%) | 23 | 1 | 2 | 5 | 1 | 2 |
| Laya | 19/60 (31.7%) | 15 | 0 | 2 | 0 | 2 | 0 |

Jev 布局消融：原始 `query + memory` 为 45/60；memory 放 state 为 44/60；再加入真实 timestamp 为 45/60。三种布局几乎持平，且时间题仍为 0/3，说明简单加入时间戳没有解决 temporal reasoning。

注意：Jev retrieval API 本次约花费 `$1.0164`；开源模型在 H20 本地推理。统一回答模型相同，但开源模型因短上下文采用窗口化和 max 聚合。

## 3. InMind

### 3.1 Gold memory retrieval：全量 125 题

每个 query 对全量候选逐条打分。exchange 为一个 user+assistant turn，共 241 个候选；session 为完整 session，共 47 个候选。

| Jev chunk | R@1 | R@5 | R@10 | MRR | 平均 gold rank | 成本/125题 |
|---|---:|---:|---:|---:|---:|---:|
| **Exchange** | **84.8%** | **92.0%** | 94.4% | **0.882** | 5.656 | $1.0425 |
| Session | 49.6% | 82.4% | **96.8%** | 0.645 | **2.872** | $0.7179 |

解释：exchange 更适合精确排首位；session 在较大的 K 上更稳。Exchange 的平均 rank 被少数灾难性失败拉高，中位数仍为 1、P90 为 3。

### 3.2 与开源替代同一 20 题子集

| 模型 / chunk | R@1 | R@5 | R@10 | MRR@10 | 平均 rank |
|---|---:|---:|---:|---:|---:|
| **Jev exchange** | **85%** | 90% | 90% | **0.867** | 11.30 |
| Nimble exchange | 70% | **95%** | **95%** | 0.774 | **2.35** |
| KEV exchange | 55% | 65% | 70% | 0.606 | 35.80 |
| Laya exchange | 10% | 15% | 15% | 0.113 | 116.65 |
| Jev session | **45%** | **75%** | **100%** | **0.606** | **3.10** |
| Nimble session | 5% | 15% | 20% | 0.085 | 15.90 |
| KEV session | 0% | 0% | 0% | 0.000 | 19.25 |
| Laya session | 0% | 0% | 15% | 0.018 | 14.65 |

Jev 与开源模型并非完全相同的长 chunk 实现：Nimble/KEV/Laya 需要窗口化，再对窗口分数聚合。因此 exchange 对比最可信，session 对比应视为实现能力与窗口策略的联合结果。

### 3.3 最终回答成功率：全量 125 题

统一由 `gpt-5-mini` 读取检索内容生成答案并判分：Jev exchange Top-5 为 **76.0%**，Top-10 为 **76.8%**；Jev session Top-5 为 60.0%，Top-10 为 65.6%。

同一 125 题上的历史基线若按严格 `Recall AND Reminder` 计：Backbone 85.6%，A-RAG emb3-large 8.0%，A-MEM emb3-large 5.6%，Mem0 emb3-large 4.0%，xMemory emb3-large 3.2%，naive RAG emb3-large Top-10 2.4%；其余多数为 0%--3.2%。Backbone 是目标事实直接在上下文中的上界，不是 retrieval 系统。

## 4. DRB2：与人类 rubric decision 对齐

范围为 10 个不需要多模态的任务、739 条决策，标签为 `-1/0/1`。Jev 看完整报告、原任务与 blocked reference；开源模型只看重叠短窗口且没有原任务，因此属于不完全对齐的协议变体。

| 模型 | Accuracy | Macro F1 | Cohen Kappa | Satisfied F1 | Blocked F1 |
|---|---:|---:|---:|---:|---:|
| Gemini-2.5-Pro evaluator | **90.66%** | **0.8858** | **0.7944** | **0.8281** | **0.8919** |
| **Jev full report** | 89.17% | 0.8071 | 0.7478 | 0.7829 | 0.6977 |
| GPT-5 evaluator | 87.14% | 0.6050 | 0.7032 | 0.7809 | 0.0976 |
| Nimble hard-any | 70.64% | 0.5641 | 0.4536 | 0.5891 | 0.2727 |
| Nimble max-prob | 70.77% | 0.3555 | 0.1526 | 0.2010 | 0.0270 |
| KEV hard-any | 68.74% | 0.5494 | 0.4421 | 0.6447 | 0.2061 |
| KEV max-prob | 69.82% | 0.3185 | 0.0963 | 0.0914 | 0.0286 |
| Laya hard-any | 31.39% | 0.2069 | 0.0202 | 0.3884 | 0.0000 |
| Laya max-prob | 44.79% | 0.3009 | 0.0415 | 0.3841 | 0.0000 |
| 全预测 0 | 70.50% | 0.2757 | 0.0000 | 0.0000 | 0.0000 |

Jev 的 API 成本为 `$0.01433`，输入 341,227 tokens。它比 GPT-5 的总体 accuracy 和 macro-F1 更高，主要因为 blocked 类判断强得多；Gemini-2.5-Pro 仍是本次最强。

## 5. DRB1：同一 17 题的人类一致性与 RACE 消融

RACE 版本把每个待评报告和 reference report 放在同一个输入中，按相同 rubric 分别打分，再按 `target / (target + reference)` 归一化；另两行分别移除 reference、以及同时移除 reference 与 rubric。Jev 的 32K 上下文只让 RACE 版本完整覆盖 158/200 个 task-model pairs；四个待评模型都完整可评的交集只有 17/50 题，其中 ICC 过滤后保留 14 题。因此这里统一比较该长度选择子集，不代表完整 DRB1 排名。

| Judge / 方法 | PAR | OPC | FAP | FAS | Overall |
|---|---:|---:|---:|---:|---:|
| GPT-5.5 | 73.53 | 95.52 | 66.95 | **65.12** | **75.28** |
| **Jev 1.13 RACE** | **75.49** | 93.40 | **67.00** | 62.26 | 74.54 |
| Jev direct，reference-free | 73.53 | 93.11 | 62.96 | 59.40 | 72.25 |
| Jev holistic，reference/rubric-free | 70.59 | 93.51 | 51.62 | 48.49 | 66.05 |
| Gemini-3-Pro | **75.49** | 92.59 | 65.74 | 62.26 | 74.02 |
| Gemini-3.1-Pro | 72.55 | 93.90 | 64.34 | 57.37 | 72.04 |
| DeepSeek-v4-Pro | 71.57 | **98.92** | 60.17 | 57.37 | 72.01 |

`PAR`：逐题两两胜负一致率。`OPC`：系统级跨题均分的 Pearson。`FAP`：ICC 过滤后逐题 Pearson 的平均。`FAS`：ICC 过滤后逐题 Spearman 的平均。`Overall`：四者均值。

Jev 与 GPT-5.5 的 Overall 只差 0.74 分，并在 PAR/FAP 略高；但覆盖不足是这里最大的限制。整次 Jev 审计成本约 `$0.6817`。

在同一 17 题上，去掉 reference report 与归一化、改为单篇文章绝对打分后，PAR/OPC/FAP/FAS/Overall 为 `73.53/93.11/62.96/59.40/72.25`。相比 RACE 版本，Overall 下降 2.29 分；这次 68/68 篇均可完整评分，成本 `$0.1097`。

进一步去掉全部 task-specific rubric/criteria，只给 query 和单篇文章、用 21 档 `0–100` 概率期望作为总分，得到 `70.59/93.51/51.62/48.49/66.05`。OPC 略升，说明系统级总体强弱仍稳定；FAP/FAS 大幅下降，说明逐题细粒度判断明显依赖 rubric。该版本 68/68 完成，成本仅 `$0.0242`。

## 6. TTCW：原始 Yes/No 量表

范围为全量 48 stories、672 个 story-item；每篇故事独立回答 14 个原始 Yes/No 问题，不给 reference。Jev 用 `P(Yes) >= 0.5` 生成硬判断。

Jev 的 item-level Accuracy / Yes Precision / Yes Recall / Yes F1 为 `0.5625/0.4260/0.8333/0.5638`。

| 模型 / 方法 | 协议 | Spearman | Kendall | Pairwise |
|---|---|---:|---:|---:|
| Jev，原始 14 项硬累加 | Reference-free | 0.1138 | 0.1236 | 0.6944 |
| Jev，14 个 P(Yes) 直接累加 | Reference-free | **0.5305** | **0.4569** | **0.7500** |
| Jev，Holistic 0–100 | Reference-free、rubric-free | 0.2805 | 0.2347 | 0.6667 |
| Claude v1.3 | Reference-free | 0.15 | 0.16 | 0.64 |
| Claude 3 Opus | Reference-free | 0.25 | 0.22 | 0.64 |
| Claude 3.5 | Reference-free | 0.14 | 0.13 | 0.64 |
| GPT-4o | Reference-free | 0.16 | 0.14 | 0.64 |
| Qwen2-72B | Reference-free | -0.12 | -0.11 | 0.58 |
| Claude 3.5 | Reference-based | 0.49 | 0.44 | **0.75** |
| GPT-4o | Reference-based | 0.38 | 0.36 | 0.72 |
| Qwen2-72B | Reference-based | 0.22 | 0.16 | 0.61 |

Holistic 方法只输入故事正文，48/48 完成，成本 `$0.00570`；它优于 Jev 硬累加和全部外部 reference-free 基线的 Spearman/Kendall，但不如 14 项 soft probability sum。Jev 的 soft probability sum 已达到或略高于最强 reference-based 排序结果，但它不是原始 TTCW 二值计分，必须作为补充指标报告。

硬计数的问题主要是校准：Jev 判 Yes 的比例为 66.4%，而人类 gold 只有 33.9%。直接累加概率保留了置信度差异，所以故事排序从 Spearman 0.114 跳到 0.531。总成本 `$0.01214`。

## 7. 综合结论

1. **Retrieval 场景**：Jev 最强的证据来自 InMind exchange-level R@1 84.8% 和 MAB 75.0%。它确实能利用 query-memory 的知识关系，而不只是语义相似度。
2. **开源替代**：Nimble-9B 是当前最可信的替代，MAB 只落后 Jev 3.3 个百分点，InMind exchange R@5 甚至更高；KEV-4B 次之，Laya 明显不足。
3. **Judge 场景**：Jev 在 DRB2 已接近 Gemini/GPT 级 evaluator，并在 DRB1 的可评子集与 GPT-5.5 基本持平；但 DRB1 的 32K 覆盖问题阻止了全量结论。
4. **概率比硬标签更有价值**：TTCW 的 `sum P(Yes)`、InMind/MAB 的连续 usefulness score 都说明，Jev 更适合作为可排序的 decision feature，而不是先阈值化成 Yes/No 再使用。
5. **尚缺的严格实验**：开源三模型还没有 TTCW 和 DRB1；DRB2 的输入也未与 Jev 完全对齐。下一轮最有价值的是让 Nimble 使用与 Jev 相同的完整输入协议，并在 TTCW 上同时报告硬累加、概率累加和校准后的累加。

## 8. 主要结果文件

- MAB Jev：`/Users/ruizheli/Documents/project/memory/run_mabench/results/jev_mabench_probe_top5_per_task2/final_summary.json`
- MAB 开源模型：`laya-inmind/results/mab60-eval-aligned-v1/final_summary.json`
- InMind Jev retrieval：`/Users/ruizheli/Documents/project/mem/always-on-memory/results/jev_inmind_pairwise_probes/summary_full125.md`
- InMind Jev end-to-end：`/Users/ruizheli/Documents/project/mem/always-on-memory/results/jev_inmind_end_to_end/`
- InMind 开源模型：`laya-inmind/results/{nimble9b,kev4b}_inmind_20/summary.json` 与 `laya_typed_decisions_mps_batch8/summary.json`
- DRB2：`drb2-decision-eval/results/REPORT.md`
- DRB1：`drb1-jev-audit/results/jev_race_openrouter/comparison_same_17_tasks.json`
- DRB1 reference-free：`drb1-jev-audit/results/jev_direct_reference_free_17/metrics.json`
- DRB1 holistic：`drb1-jev-audit/results/jev_holistic_reference_free_17/metrics.json`
- TTCW：`ttcw-jev-naive/README.md`
- TTCW holistic：`ttcw-jev-naive/results_holistic/metrics.json`
