# Four-Model Supplementary Results, 2026-10-14

All 30 free shards / 10 groups and all four paid stages completed. New outputs were coverage-checked and synchronized to the Mac. Historical results are reused, not rerun.

## Identity and Comparison Boundaries

4B Base is Qwen/Qwen3.5-4B-Base revision 1001bb4d826a52d1f399e183466143f4da7b741b, with its original vocabulary head and no adapter. It is not the earlier Qwen3.5-4B instruction checkpoint.
9B without LoRA is Qwen/Qwen3.5-9B revision c202236235762e1c871ad0ccb60c8ee5ba337b9a. Nimble uses its archived published adapter on that backbone.
DRB/TTCW match full semantic inputs, choices, aggregation and human-consistency metrics. KEV uses its trained pointer interface; Base/Nimble use the frozen candidate-token schema. This is an application comparison, not an identical-architecture training ablation.
InMind uses the same 125 task IDs, all 241 exchanges / 47 sessions per task, and Top5/10 answering protocol. New Base4/KEV explicitly window sessions at 1,200 tokens with 200 overlap; historical 9B/Nimble rankings are reused. Old silently truncated KEV scores are excluded from the main tables.
MAB uses the same 60 questions, Top5, task-specific generation and native scoring. Base4/KEV retrieval windows are 256 tokens, whereas archived Nimble/9B windows are 900 tokens. Do not interpret this row as a fully matched retrieval-window ablation.

## InMind Retrieval: full125

| Model / Chunk | R@1 | R@5 | R@10 | MRR@10 |
| --- | --- | --- | --- | --- |
| 4B Base / turn_exchange | 0.056 | 0.112 | 0.224 | 0.092 |
| 4B Base / session | 0.000 | 0.000 | 0.000 | 0.000 |
| KEV-4B / turn_exchange | 0.592 | 0.744 | 0.768 | 0.654 |
| KEV-4B / session | 0.000 | 0.000 | 0.032 | 0.004 |
| 9B without LoRA / turn_exchange | 0.536 | 0.752 | 0.800 | 0.635 |
| 9B without LoRA / session | 0.008 | 0.136 | 0.464 | 0.093 |
| Nimble-9B / turn_exchange | 0.632 | 0.912 | 0.944 | 0.741 |
| Nimble-9B / session | 0.040 | 0.144 | 0.280 | 0.087 |

## InMind Retrieval: same20

| Model / Chunk | R@1 | R@5 | R@10 | MRR@10 |
| --- | --- | --- | --- | --- |
| 4B Base / turn_exchange | 0.050 | 0.100 | 0.200 | 0.076 |
| 4B Base / session | 0.000 | 0.000 | 0.000 | 0.000 |
| KEV-4B / turn_exchange | 0.550 | 0.700 | 0.750 | 0.613 |
| KEV-4B / session | 0.000 | 0.000 | 0.000 | 0.000 |
| 9B without LoRA / turn_exchange | 0.400 | 0.700 | 0.750 | 0.520 |
| 9B without LoRA / session | 0.000 | 0.150 | 0.300 | 0.093 |
| Nimble-9B / turn_exchange | 0.650 | 0.950 | 0.950 | 0.749 |
| Nimble-9B / session | 0.050 | 0.150 | 0.200 | 0.085 |

## InMind Final Answer Success

Each cell is 125 queries scored with the frozen context-recall AND answer-warning binary judge; it is not R@K. Same gpt-5-mini generation/judging gateway and prompts, different evaluation dates.

| Model | Exchange Top5 | Exchange Top10 | Session Top5 | Session Top10 |
| --- | --- | --- | --- | --- |
| 4B Base | 0.064 | 0.160 | 0.008 | 0.016 |
| KEV-4B | 0.640 | 0.616 | 0.000 | 0.016 |
| 9B without LoRA | 0.608 | 0.600 | 0.112 | 0.304 |
| Nimble-9B | 0.752 | 0.720 | 0.112 | 0.200 |

## MAB60 Final Answers

All 60 questions; historical KEV/Nimble/9B answers reused. Retrieval-window differences remain as described above.

| Metric | 4B Base | KEV-4B | 9B without LoRA | Nimble-9B |
| --- | --- | --- | --- | --- |
| Accuracy | 0.567 (34/60) | 0.667 (40/60) | 0.683 (41/60) | 0.717 (43/60) |
| EventQA | 0.833 | 0.900 | 0.933 | 0.933 |
| FC-MH | 0.125 | 0.000 | 0.125 | 0.125 |
| FC-SH | 0.250 | 0.875 | 0.875 | 1.000 |
| LME | 0.400 | 0.400 | 0.300 | 0.300 |
| SH-QA | 0.500 | 1.000 | 1.000 | 1.000 |
| MH-QA | 0.500 | 0.000 | 0.000 | 0.500 |

## DRB1 Full Inputs

Each mode: 17 tasks x 4 target reports. FAP/FAS retain 14 tasks under the original ICC filter. Overall is the mean of PAR, OPC, FAP, FAS.

| Mode / Metric | 4B Base | KEV-4B | 9B without LoRA | Nimble-9B |
| --- | --- | --- | --- | --- |
| holistic / PAR | 57.84 | 70.59 | 56.86 | 51.96 |
| holistic / OPC | 92.94 | 98.41 | 75.42 | -6.75 |
| holistic / FAP | 27.75 | 49.76 | 28.69 | 23.89 |
| holistic / FAS | 19.92 | 45.64 | 17.59 | 14.73 |
| holistic / Overall | 49.61 | 66.10 | 44.64 | 20.96 |
| direct / PAR | 72.55 | 72.55 | 77.45 | 72.55 |
| direct / OPC | 99.53 | 99.83 | 98.48 | 99.75 |
| direct / FAP | 55.85 | 54.94 | 60.06 | 53.70 |
| direct / FAS | 48.49 | 51.35 | 62.26 | 46.16 |
| direct / Overall | 69.11 | 69.67 | 74.56 | 68.04 |
| race / PAR | 73.53 | 73.53 | 76.47 | 74.51 |
| race / OPC | 98.29 | 96.84 | 99.33 | 98.80 |
| race / FAP | 60.23 | 59.35 | 67.87 | 62.72 |
| race / FAS | 60.83 | 56.54 | 63.69 | 58.49 |
| race / Overall | 73.22 | 71.57 | 76.84 | 73.63 |

## DRB2 Full Inputs

Same 10 tasks and 739 rubric labels; overall macro-F1 is over the three labels, not averaged per task.

| Metric | 4B Base | KEV-4B | 9B without LoRA | Nimble-9B |
| --- | --- | --- | --- | --- |
| accuracy | 0.325 | 0.800 | 0.763 | 0.771 |
| macro_f1 | 0.213 | 0.654 | 0.504 | 0.567 |
| cohen_kappa | 0.068 | 0.585 | 0.529 | 0.527 |

## TTCW Full Stories

48 full stories / 672 binary decisions. Rankings use 36 model stories in 12 plots. Holistic and hard/soft 14-item sums are distinct scoring methods. Constant-ranking plots follow the frozen evaluator's zero-correlation convention.

| Spearman | 4B Base | KEV-4B | 9B without LoRA | Nimble-9B |
| --- | --- | --- | --- | --- |
| holistic | -0.269 | -0.000 | 0.436 | -0.455 |
| hard14 | 0.042 | -0.208 | 0.175 | -0.031 |
| soft14 | -0.031 | -0.289 | 0.136 | -0.103 |

## Native14: L1 / L2 / L3

The original 1,145 evaluation records; no calibration-set fitting. L1 keeps argmax; L2 keeps all within-item ranks, with uniform random probability completions (2,000 samples); L3 retains raw probabilities. All native metrics are oriented higher-is-better. Model-specific historical sampling seeds are retained; small subsets are not leaderboard estimates.

| Benchmark (n) | 4B Base | KEV-4B | 9B without LoRA | Nimble-9B |
| --- | --- | --- | --- | --- |
| glue_sst2 (60) | 0.817 / 0.817 / 0.817 | 0.883 / 0.883 / 0.883 | 0.933 / 0.933 / 0.933 | 0.850 / 0.850 / 0.850 |
| mmlu_computer_security (60) | 0.850 / 0.850 / 0.850 | 0.700 / 0.700 / 0.700 | 0.833 / 0.833 / 0.833 | 0.800 / 0.800 / 0.800 |
| glue_cola (60) | 0.420 / 0.420 / 0.420 | 0.474 / 0.474 / 0.474 | 0.680 / 0.680 / 0.680 | 0.623 / 0.623 / 0.623 |
| truthfulqa_mc2 (50) | 0.542 / 0.612 / 0.700 | 0.550 / 0.640 / 0.722 | 0.544 / 0.643 / 0.763 | 0.568 / 0.646 / 0.795 |
| glue_stsb (200) | 0.502 / 0.754 / 0.856 | 0.447 / 0.879 / 0.880 | 0.459 / 0.858 / 0.883 | 0.437 / 0.806 / 0.822 |
| blue_biosses (20) | 0.030 / 0.008 / 0.923 | 0.118 / 0.551 / 0.540 | 0.415 / 0.710 / 0.789 | 0.270 / 0.613 / 0.695 |
| semeval_ordinal_sentiment (60) | 0.754 / 0.802 / 0.817 | 0.755 / 0.808 / 0.858 | 0.755 / 0.803 / 0.850 | 0.749 / 0.806 / 0.854 |
| wassa_emoint (80) | 0.259 / 0.525 / 0.639 | 0.372 / 0.635 / 0.715 | 0.376 / 0.465 / 0.617 | 0.340 / 0.556 / 0.738 |
| wmt23_qe_en_hi (60) | -0.009 / 0.179 / 0.280 | 0.088 / 0.174 / 0.186 | -0.013 / -0.019 / -0.031 | 0.081 / 0.350 / 0.436 |
| esci (155) | 0.830 / 0.830 / 0.910 | 0.868 / 0.868 / 0.913 | 0.864 / 0.864 / 0.892 | 0.870 / 0.870 / 0.896 |
| beir_scifact_rerank (100) | 0.719 / 0.721 / 0.810 | 0.751 / 0.750 / 0.869 | 0.713 / 0.712 / 0.896 | 0.782 / 0.784 / 0.943 |
| civil_comments_toxicity (80) | 0.700 / 0.700 / 0.739 | 0.663 / 0.663 / 0.741 | 0.726 / 0.725 / 0.798 | 0.700 / 0.701 / 0.805 |
| asap_aes_set1 (80) | 0.017 / -0.001 / 0.010 | 0.046 / 0.016 / 0.044 | 0.061 / 0.028 / 0.095 | 0.021 / 0.013 / 0.026 |
| helpsteer2_helpfulness (80) | 0.006 / 0.104 / 0.089 | 0.145 / 0.324 / 0.374 | 0.273 / 0.278 / 0.422 | 0.338 / 0.426 / 0.504 |

## Native14: Degradation L3-to-L1 / L3-to-L2

Absolute metric differences, not percentages. Positive means performance loss; negative means the random completion improved the point estimate.

| Benchmark | 4B Base | KEV-4B | 9B without LoRA | Nimble-9B |
| --- | --- | --- | --- | --- |
| glue_sst2 | +0.000 / +0.000 | +0.000 / +0.000 | -0.000 / -0.000 | +0.000 / +0.000 |
| mmlu_computer_security | +0.000 / +0.000 | +0.000 / +0.000 | -0.000 / -0.000 | -0.000 / -0.000 |
| glue_cola | +0.000 / +0.000 | +0.000 / +0.000 | -0.000 / -0.000 | +0.000 / +0.000 |
| truthfulqa_mc2 | +0.158 / +0.088 | +0.172 / +0.082 | +0.219 / +0.120 | +0.227 / +0.149 |
| glue_stsb | +0.354 / +0.102 | +0.433 / +0.001 | +0.424 / +0.025 | +0.384 / +0.016 |
| blue_biosses | +0.894 / +0.916 | +0.422 / -0.011 | +0.374 / +0.079 | +0.425 / +0.082 |
| semeval_ordinal_sentiment | +0.062 / +0.014 | +0.103 / +0.050 | +0.095 / +0.047 | +0.105 / +0.048 |
| wassa_emoint | +0.380 / +0.114 | +0.344 / +0.080 | +0.241 / +0.151 | +0.398 / +0.182 |
| wmt23_qe_en_hi | +0.289 / +0.101 | +0.098 / +0.011 | -0.017 / -0.012 | +0.355 / +0.086 |
| esci | +0.080 / +0.080 | +0.045 / +0.045 | +0.027 / +0.028 | +0.026 / +0.026 |
| beir_scifact_rerank | +0.091 / +0.089 | +0.118 / +0.119 | +0.183 / +0.185 | +0.161 / +0.159 |
| civil_comments_toxicity | +0.039 / +0.039 | +0.078 / +0.078 | +0.073 / +0.073 | +0.105 / +0.104 |
| asap_aes_set1 | -0.006 / +0.011 | -0.002 / +0.028 | +0.034 / +0.068 | +0.006 / +0.013 |
| helpsteer2_helpfulness | +0.083 / -0.015 | +0.229 / +0.050 | +0.149 / +0.144 | +0.166 / +0.077 |

Full bootstrap uncertainty and native metric names are retained in FOUR_MODEL_COMPARISON.json; no cross-benchmark mean is reported.

## Completion and Cost

New paid calls: 3070; usage-based estimated cost 120.96 CNY, approved ceiling 180 CNY. Provider actual charges remain unverified. No new Jev call.
Each InMind paid model completed 500 answers + 500 judgments; MAB completed 60 answers + 10 LME judgments. Historical 9B calls are excluded from this round's cost.
All GPU workers and the supervisor finished normally. No additional inference or paid rerun is needed.

## Provenance

Machine-readable source paths and SHA-256 values, all metrics and bootstrap statistics: FOUR_MODEL_COMPARISON.json. Scope/readout details: PROTOCOL.md. Paid-record checks: paid/AUDIT.json.
One inherited Nimble TTCW14 metric metadata field says adapter-free; the archived full-input protocol and source directory identify it as Nimble. Its cached labels are not silently changed. This metadata mismatch should remain visible when citing that source.
