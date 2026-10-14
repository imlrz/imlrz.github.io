window.JEV_SLIDES = String.raw`
<section class="slide" data-rq="0" data-sec="封面">
  <div class="in">
    <div class="kick">System One Models <span class="dim">· 组会 2026.09.23</span></div>
    <h1 class="title">组会 0923：Jev</h1>
    <ul class="agenda">
      <li><b>RQ1</b>Jev 效果究竟如何？</li>
      <li><b>D1</b>“TA 不一样”</li>
      <li><b>RQ2</b>Jev 是如何出生的？</li>
      <li><b>D2</b>TypeSafe 的理念</li>
      <li><b>RQ3</b>Jev 是否有开源复现？</li>
    </ul>
    <p class="pmeta">李睿哲 · 2026.09.23</p>
    <div class="hint">用 <kbd>↓</kbd> / <kbd>→</kbd> / <kbd>空格</kbd> 翻页，<kbd>↑</kbd> / <kbd>←</kbd> 往回</div>
  </div>
</section>

<section class="slide divider" id="basics" data-rq="basics" data-sec="Jev 概况">
  <div class="in"><div class="rqbig">Jev</div><h2>Jev 概况</h2><p class="question">Input：length / schema。Output：schema。Latency / cost 与 parallel 情况。</p></div>
</section>

<section class="slide" data-rq="basics" data-sec="输入输出">
  <div class="in">
    <div class="kick">Jev 的基本情况</div>
    <h2 class="head">输入输出</h2>
    <p class="lead">一个请求由两部分组成：</p>
    <ul class="b">
      <li><b>state</b>：模型判断所依据的状态，可以是文本、JSON object 或 array。</li>
      <li><b>questions</b>：要针对同一状态回答的一组问题。</li>
    </ul>
    <div class="kv">
      <div><b>32K</b><span>当前最长上下文</span></div>
      <div><b>1 state</b><span>同一请求内共享</span></div>
      <div><b>≥1 question</b><span>未公布上限</span></div>
      <div><b>typed</b><span>返回概率化的结构值</span></div>
      <div><b>$0.042</b><span>/ 1M input tokens</span></div>
      <div><b>free</b><span>output tokens</span></div>
      <div><b>70–500ms</b><span>官方公布的端到端范围</span></div>
      <div><b>parallel</b><span>一次请求返回多个问题</span></div>
    </div>
    <div class="callout">Jev 不以自由文本生成为目标。LLM 按 token 顺序生成字符串；Jev 读取 state，并行回答预先声明的 questions，把概率直接交给程序使用。</div>
    <p class="tiny">官方公布的 193.6× 更快、444.6× 更便宜来自其 workflow eval，是现实增益中偏高的一端。同一请求共享 state 不等于跨请求 prefix cache hit；当前没有 largest-common-subtree caching，相同输入仍按相同 input token cost 计费。</p>
  </div>
</section>

<section class="slide" data-rq="basics" data-sec="请求 → 响应">
  <div class="in">
    <div class="kick">输入输出 <span class="dim">· request → typed answers</span></div>
    <h2 class="head">一个 state，三个 questions，一次返回三种结构值</h2>
    <div class="io-flow">
      <div class="io-box">
        <h3>Request · 任务也是输入</h3>
        <pre class="code"><span class="dim">{</span>
  <span class="key">"state"</span>: {<span class="key">"message"</span>: <span class="str">"I was charged twice..."</span>},
  <span class="key">"questions"</span>: {
    <span class="key">"question1_intent"</span>: {
      <span class="key">"type"</span>: <span class="str">"choice"</span>,
      <span class="key">"instructions"</span>: <span class="str">"Which team should handle this?"</span>,
      <span class="key">"criteria"</span>: {
        <span class="key">"billing"</span>: <span class="str">"Payments / refunds / charges"</span>,
        <span class="key">"technical"</span>: <span class="str">"Product malfunction"</span>,
        <span class="key">"other"</span>: <span class="str">"Everything else"</span>}
    },
    <span class="key">"question2_frustration"</span>: {
      <span class="key">"type"</span>: <span class="str">"score"</span>,
      <span class="key">"criteria"</span>: [<span class="str">"Calm"</span>, <span class="str">"Concerned"</span>, <span class="str">"Angry"</span>]
    },
    <span class="key">"question3_needs_human"</span>: {<span class="key">"type"</span>: <span class="str">"noul"</span>}
  }
<span class="dim">}</span></pre>
      </div>
      <div class="io-mid"><b>Jev</b><span>parallel<br>decision</span></div>
      <div class="io-box">
        <h3>Response · 同名 ID 对应返回</h3>
        <pre class="code"><span class="dim">{</span>
  <span class="key">"answers"</span>: {
    <span class="key">"question1_intent"</span>: {
      <span class="key">"choice"</span>: <span class="str">"billing"</span>,
      <span class="key">"probabilities"</span>: {
        <span class="key">"billing"</span>: <span class="num">.96</span>, <span class="key">"technical"</span>: <span class="num">.02</span>, <span class="key">"other"</span>: <span class="num">.02</span>},
      <span class="key">"confidence"</span>: <span class="num">.94</span>
    },
    <span class="key">"question2_frustration"</span>: {
      <span class="key">"score"</span>: <span class="num">1.72</span>,
      <span class="key">"legend"</span>: {<span class="key">"0"</span>: <span class="str">"Calm"</span>, <span class="key">"1"</span>: <span class="str">"Concerned"</span>, <span class="key">"2"</span>: <span class="str">"Angry"</span>},
      <span class="key">"probabilities"</span>: {<span class="key">"0"</span>: <span class="num">.03</span>, <span class="key">"1"</span>: <span class="num">.22</span>, <span class="key">"2"</span>: <span class="num">.75</span>}
    },
    <span class="key">"question3_needs_human"</span>: {<span class="key">"noul"</span>: <span class="num">.31</span>}
  }
<span class="dim">}</span></pre>
      </div>
    </div>
    <div class="io-types">
      <div class="io-type"><b>Choice → match / route</b><span>最多 255 个 options；返回完整概率分布 + confidence</span></div>
      <div class="io-type"><b>Score → rank / threshold</b><span>2–10 个从低到高的有序 levels；返回概率加权分数</span></div>
      <div class="io-type"><b>Noul → if</b><span>固定 yes / no；返回 P(yes / true)，不单独返回 confidence</span></div>
    </div>
    <p class="tiny">输出一定落在预先声明的 schema 中；但仍可能在合法选项中选错。</p>
  </div>
</section>

<section class="slide divider" id="rq2" data-rq="rq2" data-sec="RQ2：Jev 是如何出生的？">
  <div class="in"><div class="rqbig">RQ2</div><h2>Jev 是如何出生的？</h2><p class="question">LLM-base 基础上的 RLCD；Data Matter；Base Model 的猜测。</p></div>
</section>

<section class="slide" data-rq="architecture" data-sec="官方确认的信息">
  <div class="in">
    <div class="kick">Jev 的架构</div>
    <h2 class="head">LLM 改造？接分类头 / 直接用 logit？</h2>
    <h3 class="sub">目前官方确认的信息：</h3>
    <ul class="b">
      <li>从 pretrained base model 出发，再走 RLCD 后训练；</li>
      <li>TypeSafe 声称采用“new model architecture”和“parallel sampler”；</li>
      <li>TechCrunch 采访将其称为 transformer-based model；</li>
      <li>当前输入是文本或含文本的结构化状态，不是图像 / 音频 / 视频；</li>
      <li>不生成自由字符串；一次请求中的多个问题并行计算；</li>
      <li>它是通用 zero-shot 决策模型，不是每个任务单独训练一个固定 head。</li>
    </ul>
    <div class="callout"><b>可以确定的整体框架：</b>预训练 LLM 的 Transformer 主干 + 面向动态候选的决策读出 + RLCD 后训练。</div>
  </div>
</section>

<section class="slide" data-rq="rq2" data-sec="Base Model 的猜测">
  <div class="in">
    <div class="kick">RQ2 <span class="dim">· Base Model 的猜测</span></div>
    <h2 class="head">Base Model 的猜测：Qwen 3.5</h2>
    <div class="cols wide-left top">
      <div>
        <ul class="b">
          <li>9 个独立 Noul 中，<b>“Are you Qwen?” 为 64%</b>，高于其他模型名；这些问题彼此独立，概率不需要加和为 100%。</li>
          <li>限定在 11 个 Qwen 世代内做 Choice，<b>qwen3_5 为 38%</b>、排名第一，但整体 confidence 只有 32%。</li>
          <li>Nimble-9B 和 Kev-4B 也都选择 Qwen 3.5 作为 base model。</li>
        </ul>
        <figure><div class="frame"><img src="assets/img/11-qwen-generation-choice.png" alt="Jev 在 11 个 Qwen 世代候选中将 qwen3.5 排在第一，概率 38%，confidence 32%"></div><figcaption>限定候选后的 Choice 分布：qwen3_5 排名第一，但并不确定。</figcaption></figure>
        <div class="callout"><span class="tag infer">线索，不是证明</span> 这类自我识别 probe 会受问题措辞、候选集合和训练文本影响；TypeSafe 没有公开确认 base model。</div>
      </div>
      <figure class="tall"><div class="frame"><img src="assets/img/10-base-model-noul-probe.png" alt="分别询问 Jev 是否为 Qwen、ChatGPT、DeepSeek、Gemma、GLM、Claude、Gemini、Kimi 或 Jev 的独立 Noul 结果"></div><figcaption>独立 Noul probes：它们不是一个互斥分类问题。</figcaption></figure>
    </div>
  </div>
</section>

<section class="slide divider" id="algorithm" data-rq="method" data-sec="Jev 的算法">
  <div class="in"><div class="rqbig">03</div><h2>Jev 的算法</h2><p class="question">RLCD vs. RLHF / RLVR</p></div>
</section>

<section class="slide" data-rq="method" data-sec="RLCD vs. RLHF / RLVR">
  <div class="in">
    <div class="kick">Jev 的算法 <span class="dim">· Why RLCD?</span></div>
    <h2 class="head">为什么需要 RLCD：三条路线优化的不是同一件事</h2>
    <table><thead><tr><th>路线</th><th>直接优化什么</th><th>适合什么输出</th><th>主要问题</th></tr></thead><tbody>
      <tr><td>RLHF</td><td>人类更偏好哪个回答</td><td>对话、写作、指令跟随</td><td>偏好不等于可靠；可能谄媚、过度自信、mode dropping</td></tr>
      <tr><td>RLVR</td><td>结果能否被程序验证</td><td>数学、代码等可验证任务</td><td>依赖可靠 verifier；推理采样慢且贵</td></tr>
      <tr class="hi"><td>RLCD</td><td>决策正确，同时概率与真实频率一致</td><td>Choice / Score / Noul</td><td>奖励、优化器和训练过程尚未公开</td></tr>
    </tbody></table>
    <div class="visual-triptych">
      <figure><div class="frame"><img src="assets/img/01-training-paradigm.png" alt="预训练语言模型分别经过 RLHF、RLVR 和 RLCD 后训练"></div><figcaption>三条后训练路线：RLCD 与 RLHF / RLVR 的直接区别首先是任务。</figcaption></figure>
      <figure><div class="frame"><img src="assets/img/08-rlhf-mode-dropping.png" alt="RLHF 将概率质量集中到奖励偏好的模式并压低其他模式的示意图"></div><figcaption>Mode dropping：偏好模式变尖，其他原本可能的模式被压低。</figcaption></figure>
      <figure><div class="frame"><img src="assets/img/09-gan-mode-collapse.png" alt="GAN mode collapse 导致重复生成相似结果的示意图"></div><figcaption>Mode collapse：极端情况下只反复生成一种或少数几种结果。</figcaption></figure>
    </div>
    <div class="callout"><b>Mode dropping ≠ mode collapse。</b>TypeSafe 对 RLHF 的实际用词是前者，并把它称为后者的较轻版本；这是他们对训练目标的解释，不是已经公开的因果消融实验。<a href="https://docs.typesafe.ai/introduction/machine-learning-primer">AI primer ↗</a></div>
  </div>
</section>

<section class="slide" data-rq="method" data-sec="RLCD 是什么">
  <div class="in">
    <div class="kick">Jev 的算法 <span class="dim">· What does RLCD learn?</span></div>
    <h2 class="head">RLCD 要学的不只是答案，而是答案分布</h2>
    <div class="cards two">
      <article class="card"><h4>只有 hard label</h4><div class="formula">y = A</div><p>它只告诉模型谁赢了，无法区分这个样本本来是 <b>60/40</b>，还是 <b>99/1</b>；反复把 A 当确定真值训练，还会把概率推得过尖。</p></article>
      <article class="card accent"><h4>有 probability target</h4><div class="formula">q(A)=0.6, q(B)=0.4</div><p>训练目标不只要求 top-1 正确，还要求预测分布 p 接近目标分布 q；大量报 0.8 的事件最终应约有 80% 发生。</p></article>
    </div>
    <h3 class="sub">如果做开源近似，概率目标 q 可能来自：</h3>
    <div class="kv">
      <div><b>posterior</b><span>可计算后验的合成环境</span></div>
      <div><b>outcomes</b><span>同一条件下重复结果</span></div>
      <div><b>ensemble</b><span>强模型集成的软标签</span></div>
      <div><b>annotators</b><span>多标注者分布</span></div>
    </div>
    <div class="cards two">
      <article class="card pos"><h4><span class="tag fact">官方明确</span></h4><p>输出 typed decisions 和 probabilities；更高概率应对应更高真实正确率。</p></article>
      <article class="card"><h4><span class="tag unknown">仍未公开</span></h4><p>reward、loss、PPO / DPO、on-policy 与否、训练数据和消融均未知；NLL、Brier、KL 和温度校准只是合理近似。</p></article>
    </div>
    <div class="callout"><b>更稳妥的定义：</b>RLCD 是“以校准决策为目标的后训练范式 / 方法族”，目前还不是一个有公开公式、可以照着复现的具体 RL 算法。</div>
    <p class="tiny"><a href="https://docs.typesafe.ai/introduction/machine-learning-primer">AI primer ↗</a> · <a href="https://typesafe.ai/blog/introducing-system-one-models-and-jev">Jev 发布博客 ↗</a></p>
  </div>
</section>

<section class="slide divider" id="data" data-rq="method" data-sec="Jev 的数据">
  <div class="in"><div class="rqbig">04</div><h2>Jev 的数据</h2><p class="question">数据长什么样？</p></div>
</section>

<section class="slide" data-rq="method" data-sec="数据长什么样">
  <div class="in">
    <div class="kick">Jev 的数据</div>
    <h2 class="head">数据长什么样？</h2>
    <div class="cols top">
      <div>
        <h3 class="sub">官方披露：</h3>
        <ul class="b">
          <li>TypeSafe 把自己称为 data research lab；</li>
          <li>CEO 确认后训练数据全部由团队自己合成；</li>
          <li>不使用用户数据训练；</li>
          <li>具体数据规模、生成模型、过滤流程和数据配比未公开。</li>
        </ul>
      </div>
      <figure><div class="frame"><img src="assets/img/02-synthetic-data.png" alt="TypeSafe 对训练数据的说明"></div></figure>
    </div>
  </div>
</section>

<section class="slide divider" id="discussion1" data-rq="discussion1" data-sec="Discussion 1：“TA 不一样”">
  <div class="in"><div class="rqbig">D1</div><h2>“TA 不一样”</h2><p class="question">泛化性、可靠性、成本与时延。</p></div>
</section>

<section class="slide" data-rq="discussion1" data-sec="D1：泛化性">
  <div class="in">
    <div class="kick">Discussion 1 <span class="dim">· 1 / 3</span></div>
    <h2 class="head">泛化性</h2>
    <p class="muted">与固定任务的 BERT classifier 相比，Jev 的底座有更广的通用知识；给它新的问题和候选，它也能直接做判断。</p>
    <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>测试</th><th>设置</th><th>指标</th><th>Jev</th><th>Laya</th></tr></thead><tbody>
      <tr><td>MAB · 60 题</td><td>Top-5 后回答</td><td>正确率</td><td><strong>45/60 · 75.0%</strong></td><td>19/60 · 31.7%</td></tr>
      <tr><td>InMind · 20 题</td><td>exchange</td><td>R@1 / R@5 / R@10</td><td><strong>85 / 90 / 90%</strong></td><td>10 / 15 / 15%</td></tr>
      <tr><td>InMind · 20 题</td><td>session</td><td>R@1 / R@5 / R@10</td><td><strong>45 / 75 / 100%</strong></td><td>0 / 0 / 15%</td></tr>
      <tr><td>DRB2 · 739 条</td><td>Laya hard-any</td><td>Accuracy / Macro F1</td><td><strong>89.17% / 0.8071</strong></td><td>31.39% / 0.2069</td></tr>
      <tr><td>DRB2 · 739 条</td><td>Laya max-prob</td><td>Accuracy / Macro F1</td><td><strong>89.17% / 0.8071</strong></td><td>44.79% / 0.3009</td></tr>
      <tr><td>TTCW · 48 stories</td><td>350-word · 5 档</td><td>Spearman / Kendall / Pairwise</td><td><strong>0.4360 / 0.3583 / 0.7222</strong></td><td>−0.2277 / −0.2472 / 0.3333</td></tr>
      <tr><td>TTCW · 48 stories</td><td>350-word · 21 档</td><td>Spearman / Kendall / Pairwise</td><td><strong>0.4360 / 0.3583 / 0.7222</strong></td><td>−0.3832 / −0.3708 / 0.3333</td></tr>
    </tbody></table></div>
    <div class="callout"><b>怎么理解：</b>Jev 在这些已测任务上明显更强。但底座、训练及长文本处理不同；尤其 DRB2 的完整输入与窗口化输入不能视作同协议消融，优势也不能仅归因于“世界知识”。</div>
    <p class="tiny">来源：<a href="JEV_CROSS_BENCHMARK_REPORT.md">本地交叉测试报告 ↗</a>。MAB 是固定 60 题子集；InMind 的 exchange 粒度比 session 粒度更适合直接比较；TTCW 数值仅对应共同的局部窗口协议。</p>
  </div>
</section>

<section class="slide" data-rq="discussion1" data-sec="D1：可靠性">
  <div class="in">
    <div class="kick">Discussion 1 <span class="dim">· 2 / 3</span></div>
    <h2 class="head">可靠性</h2>
    <p class="muted">我们把“对齐”分成三层；只看选对了没有，还不够。</p>
    <div class="cards">
      <article class="card"><h4>1 · Argmax 对齐</h4><p>排第一的答案是不是对的？</p></article>
      <article class="card"><h4>2 · Top-k 对齐</h4><p>正确答案是不是排在前面？</p></article>
      <article class="card"><h4>3 · 概率对齐</h4><p>给出的概率和实际正确率是否相符？</p></article>
    </div>
    <div class="tbl-wrap"><table class="dense-table"><caption>LME · 同一 10 题</caption><thead><tr><th>模型</th><th>R@1</th><th>R@5</th><th>R@10</th><th>R@20</th><th>R@50</th><th>R@100</th></tr></thead><tbody>
      <tr><td>4B Base</td><td>0.40</td><td>0.60</td><td>0.80</td><td>0.85</td><td>0.90</td><td>1.00</td></tr>
      <tr><td>9B Base</td><td>0.45</td><td>0.65</td><td>0.85</td><td>0.90</td><td>0.95</td><td>0.95</td></tr>
      <tr><td>Jev</td><td>0.45</td><td><strong>0.90</strong></td><td><strong>1.00</strong></td><td><strong>1.00</strong></td><td><strong>1.00</strong></td><td><strong>1.00</strong></td></tr>
    </tbody></table></div>
    <div class="tbl-wrap"><table class="dense-table"><caption>InMind · 全量 125 题 / exchange（不同窗口实现）</caption><thead><tr><th>模型</th><th>R@1</th><th>R@5</th><th>R@10</th></tr></thead><tbody>
      <tr><td>4B Base</td><td>0.056</td><td>0.112</td><td>0.224</td></tr>
      <tr><td>9B Base</td><td>0.536</td><td>0.752</td><td>0.800</td></tr>
      <tr><td>Jev</td><td><strong>0.848</strong></td><td><strong>0.920</strong></td><td><strong>0.944</strong></td></tr>
    </tbody></table></div>
  </div>
</section>

<section class="slide" data-rq="discussion1" data-sec="D1：成本与时延">
  <div class="in">
    <div class="kick">Discussion 1 <span class="dim">· 3 / 3</span></div>
    <h2 class="head">成本与时延</h2>
    <p class="muted">先放我们实测过的 Jev 检索开销；与生成式 LLM 的同协议对照，后面再补。</p>
    <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>实验</th><th>平均候选 / 题</th><th>检索 API 费用 / 题（一次排序）</th><th>单次调用平均时延</th></tr></thead><tbody>
      <tr><td>MAB · 60 题</td><td>447.5</td><td><b>$0.01694</b></td><td>未记录</td></tr>
      <tr><td>InMind · 125 题 / exchange</td><td>241</td><td><b>$0.008340</b></td><td>518 ms</td></tr>
      <tr><td>InMind · 125 题 / session</td><td>47</td><td><b>$0.005743</b></td><td>696 ms</td></tr>
    </tbody></table></div>
    <div class="callout"><b>注意：</b>费用是各实验的 Jev 检索总费用除以题数，不含后续回答 / 判分；MAB 的 447.5 是 26,848 个候选除以 60 题。518 / 696 ms 是单次请求，不是整题端到端时延；没有同协议的生成式 LLM 对照，暂不能说“快了多少倍”。</div>
    <p class="tiny">来源：<a href="JEV_CROSS_BENCHMARK_REPORT.md">MAB 成本汇总 ↗</a>；InMind125 本地原始汇总 <code>always-on-memory/results/jev_inmind_pairwise_probes/summary_full125.md</code>。</p>
  </div>
</section>

<section class="slide divider" id="rq3" data-rq="rq3" data-sec="RQ3：Jev 是否有开源复现？">
  <div class="in"><div class="rqbig">RQ3</div><h2>Jev 是否有开源复现？</h2><p class="question">Kev-4B / Nimble-9B：Base Model、数据、架构、训练方法。</p></div>
</section>

<section class="slide kev-viz-slide" data-rq="reproduction" data-sec="Kev-4B：hidden → pointer">
  <div class="in">
    <div class="kick">Kev-4B <span class="dim">· 架构可视化</span></div>
    <h2 class="head">输入序列 → 最后一层 hidden → pointer head</h2>
    <div id="kev-pointer-viz" class="kev-pointer-viz">
      <div class="kviz-label">输入序列 X · 两个候选的示意</div>
      <div class="kviz-tokens" aria-label="Kev 的输入序列">
        <span data-token="0">&lt;state&gt;</span><span data-token="1">S</span><span data-token="2">&lt;q&gt;</span><span data-token="3">I</span><span data-token="4">&lt;opt&gt;</span><span data-token="5">A</span><span data-token="6">&lt;/opt&gt;₁</span><span data-token="7">&lt;opt&gt;</span><span data-token="8">B</span><span data-token="9">&lt;/opt&gt;₂</span><span data-token="10">&lt;decide&gt;</span>
      </div>
      <div class="kviz-controls" aria-label="查看不同 token 的表示与读出">
        <button type="button" data-select="6">候选 A 结束位</button><button type="button" data-select="9">候选 B 结束位</button><button type="button" data-select="10">decide 位</button>
        <span class="kviz-current" aria-live="polite"></span>
      </div>
      <div class="kviz-middle">
        <div class="kviz-attention">
          <h3>Qwen3.5-4B backbone</h3>
          <div class="kviz-layers" aria-label="24 个 Gated DeltaNet 层和 8 个 self-attention 层，排列示意"></div>
          <div class="kviz-legend"><i class="delta"></i>24 Gated DeltaNet <i class="attn"></i>8 self-attention · 排列示意</div>
          <div class="kviz-label">self-attention 的因果可见性</div>
          <div class="kviz-mask-wrap"><span class="kviz-axis-y">query i ↓</span><div class="kviz-mask" role="img" aria-label="11 个位置的下三角因果可见性矩阵；高亮行为所选 token"></div></div>
          <div class="kviz-note">key j →　仅表示可见性，不是实际 attention 权重</div>
        </div>
        <div class="kviz-hidden">
          <h3>最后一层 hidden 矩阵 H <span>[L × 2560]</span></h3>
          <div class="kviz-hidden-rows"></div>
          <div class="kviz-note">每行 20 格示意 2560 维；不是实际激活值</div>
          <div class="kviz-label">取 h&lt;/opt&gt;₁、h&lt;/opt&gt;₂、h<sub>decide</sub> 三行</div>
        </div>
      </div>
      <div class="kviz-readout">
        <h3>↓ 选中的 hidden 经线性投影变成 q / k</h3>
        <div class="kviz-projection kviz-query">
          <div class="kviz-vector-list"><div class="kviz-vector kviz-h10"><b>h<sub>decide</sub></b><div class="kviz-vector-cells"></div><small>[2560 × 1]</small></div></div>
          <span class="kviz-arr">→</span>
          <div class="kviz-operator"><b>W<sub>q</sub> [256 × 2560]</b><div class="kviz-matrix kviz-wq" aria-label="Wq 的矩阵形状示意"></div><span>W<sub>q</sub> × h<sub>decide</sub> + b<sub>q</sub></span></div>
          <span class="kviz-arr">→</span>
          <div class="kviz-vector-list"><div class="kviz-vector kviz-q"><b>q</b><div class="kviz-vector-cells"></div><small>[256 × 1]</small></div></div>
        </div>
        <div class="kviz-projection kviz-key">
          <div class="kviz-vector-list"><div class="kviz-vector kviz-h6"><b>h<sub>&lt;/opt&gt;₁</sub></b><div class="kviz-vector-cells"></div><small>[2560 × 1]</small></div><div class="kviz-vector kviz-h9"><b>h<sub>&lt;/opt&gt;₂</sub></b><div class="kviz-vector-cells"></div><small>[2560 × 1]</small></div></div>
          <span class="kviz-arr">→</span>
          <div class="kviz-operator"><b>共享 W<sub>k</sub> [256 × 2560]</b><div class="kviz-matrix kviz-wk" aria-label="Wk 的矩阵形状示意"></div><span>W<sub>k</sub> × h<sub>opt,i</sub> + b<sub>k</sub></span></div>
          <span class="kviz-arr">→</span>
          <div class="kviz-vector-list"><div class="kviz-vector kviz-k1"><b>k₁</b><div class="kviz-vector-cells"></div><small>[256 × 1]</small></div><div class="kviz-vector kviz-k2"><b>k₂</b><div class="kviz-vector-cells"></div><small>[256 × 1]</small></div></div>
        </div>
        <div class="kviz-result">q · k₁ / √256 → z₁　｜　q · k₂ / √256 → z₂　→　softmax(z₁, z₂)</div>
        <div class="kviz-note">向量格和矩阵格只表示维度，不是模型的真实权重或激活值</div>
      </div>
    </div>
    <p class="tiny">注意：图中 Q/K 是 pointer head 的投影，不是 Transformer attention 的 Q/K，也不是 KV cache。<a href="https://github.com/jaredpalmer/kev/blob/main/kev/model.py">源码 ↗</a></p>
  </div>
</section>

<section class="slide" data-rq="reproduction" data-sec="Kev-4B：真实数据">
  <div class="in">
    <div class="kick">Kev-4B <span class="dim">· data · decision-v7 基础阶段</span></div>
    <h2 class="head">基础阶段 12,576 条训练数据：公开记录长什么样？</h2>
    <div class="corpus-strip">
      <div><b>10,000</b><span>10 个公开数据集 × 1,000</span></div>
      <div class="plus">+</div><div><b>896</b><span>policy minimal pairs</span></div>
      <div class="plus">+</div><div><b>1,680</b><span>60 种 compositional rule trees</span></div>
    </div>
    <div class="sample-grid">
      <article class="sample"><header><b>Noul</b><span>boolq/train/5158</span></header><dl><dt>state</dt><dd>Freedom of expression in Canada is protected as a “fundamental freedom” by Section 2…</dd><dt>instructions</dt><dd>is there a freedom of speech in canada?</dd><dt>label</dt><dd><strong>true</strong></dd></dl></article>
      <article class="sample"><header><b>Score</b><span>sst5/train/4592</span></header><dl><dt>state</dt><dd>a gripping drama .</dd><dt>criteria</dt><dd>[very negative, negative, neutral, positive, very positive]</dd><dt>label</dt><dd><strong>4 · very positive</strong></dd></dl></article>
      <article class="sample"><header><b>Choice</b><span>composition/…/and(0,1)/…</span></header><dl><dt>policy</dt><dd>Approve when member verified AND shipment verified.</dd><dt>case</dt><dd>shipment=yes; member=yes; routing reference=347（无关）</dd><dt>criteria</dt><dd>accept=允许；reject=不允许</dd><dt>label</dt><dd><strong>accept</strong></dd></dl></article>
    </div>
    <div class="construction two-lane">
      <div><b>公开数据源</b><span>AG News、Amazon Reviews、Banking77、BoolQ、DBpedia14、IMDB、MNLI、SST-5、TREC、Yelp。原始 label 由 Python 转成 Choice / Noul / Score，再随机包装 state、instructions 和 criteria。</span></div>
      <div><b>程序生成数据</b><span>policy 样本和逻辑树都由代码生成；标签由规则直接计算。训练时再打乱候选、插入 none-of-the-above 和无关 distractor。</span></div>
    </div>
    <div class="callout pos"><b>这一基础阶段没有用 LLM 生成数据。</b>数据来自公开 label 和可重放的规则程序；这条 Choice 是在 accept / reject 两个具名候选中选一个。Kev 1.0 后续还加入其他来源。</div>
    <p class="tiny">上面三条均摘自公开 <a href="https://huggingface.co/datasets/jaredpalmer/kev-suites">decision-v7/train.jsonl ↗</a>；为上屏只省略了部分文字，ID 和 label 不变。</p>
  </div>
</section>

<section class="slide nimble-viz-slide" data-rq="reproduction" data-sec="Nimble-9B：hidden → vocabulary logits">
  <div class="in">
    <div class="kick">Nimble-9B <span class="dim">· 架构可视化</span></div>
    <h2 class="head">最后位置的 hidden → 原 LM head → 候选 token</h2>
    <div id="nimble-vocab-viz" class="nimble-vocab-viz">
      <div class="nviz-label">一次请求一个 field · 示例 schema（位置和特征格均为示意）</div>
      <div class="nviz-prompt" aria-label="Nimble 输入序列示意">
        <span>system instruction</span><span>context: 客户消息</span><span>schema: intent</span><span>A=billing · B=technical · C=other</span><span>requested field: intent</span><span class="nviz-last">answer boundary</span>
      </div>
      <div class="nviz-controls" aria-label="选择一个候选查看读出路径">
        <button type="button" data-choice="A">A · billing</button><button type="button" data-choice="B">B · technical</button><button type="button" data-choice="C">C · other</button>
        <span class="nviz-selected" aria-live="polite"></span>
      </div>
      <div class="nviz-middle">
        <div class="nviz-model"><h3>Qwen3.5-9B + LoRA</h3><div class="nviz-label">普通 causal prompt；最后位置可读取前文</div><div class="nviz-mask" role="img" aria-label="六个示意位置的下三角因果可见性；最后一行高亮"></div><div class="nviz-note">可见性，不是实际 attention 权重</div></div>
        <div class="nviz-hidden"><h3>最后一层 H <span>[L × d]</span></h3><div class="nviz-hidden-rows"></div><div class="nviz-note">只取 h<sub>last</sub>；其他位置不直接读出</div></div>
      </div>
      <div class="nviz-projection" aria-label="最后 hidden 经原语言模型词表头投影，再截取候选 logits">
        <div class="nviz-source"><b>h<sub>last</sub></b><div class="nviz-vector"></div><small>[d]</small></div>
        <span class="nviz-arrow" aria-hidden="true">→</span>
        <div class="nviz-head"><b>原 LM head · W<sub>vocab</sub></b><div class="nviz-matrix"></div><small>[|V| × d] · 无新增 head</small></div>
        <span class="nviz-arrow" aria-hidden="true">→</span>
        <div class="nviz-vocab"><b>全词表 logits [|V|]</b><div class="nviz-logits"><span data-code="A">l<sub>A</sub></span><span data-code="B">l<sub>B</sub></span><span data-code="C">l<sub>C</sub></span><span class="nviz-discard">l<sub>the</sub></span><span class="nviz-discard">l<sub>cat</sub></span><span class="nviz-discard">…</span></div></div>
      </div>
      <div class="nviz-gather"><b>gather 候选 token IDs</b><span>→</span><code>[l<sub>A</sub>, l<sub>B</sub>, l<sub>C</sub>]</code><span>→</span><b>softmax → {billing, technical, other}</b></div>
      <div class="nviz-note">A / B / C 要在 answer boundary 各是一个 token。程序读 logits 并映射回选项；不生成答案文本，也不加 Kev 式 pointer head。</div>
    </div>
    <p class="tiny">示意图根据公开代码中的 prompt 构造和 candidate_logits 读出绘制：<a href="https://github.com/bespokelabsai/nimble/blob/main/nimble/scoring/parallel_schema.py">parallel_schema.py ↗</a> · <a href="https://github.com/bespokelabsai/nimble/blob/main/nimble/training/schema_train.py">schema_train.py ↗</a></p>
  </div>
</section>

<section class="slide" data-rq="reproduction" data-sec="Nimble-9B：真实数据">
  <div class="in">
    <div class="kick">Nimble-9B <span class="dim">· 本地归档 2676 版 · data</span></div>
    <h2 class="head">2,676 条训练数据 = 1,338 组 base / counterfactual pairs</h2>
    <div class="kv compact-kv">
      <div><b>34</b><span>training source families</span></div><div><b>10</b><span>domains</span></div><div><b>856</b><span>Choice</span></div><div><b>888</b><span>Noul</span></div><div><b>932</b><span>Score</span></div><div><b>324</b><span>frozen holdout</span></div>
    </div>
    <div class="sample-grid nimble-samples">
      <article class="sample"><header><b>Choice</b><span>scale-diverse-224-007-counterfactual</span></header><dl><dt>state 摘录</dt><dd>“Harbor Bells” 有 title / creator / date / WAV / duration；subject=“coastal sound”；caption 缺失；right cell RB-731 为空。</dd><dt>question</dt><dd>Select the single metadata completeness level…</dd><dt>target</dt><dd><strong>level_3</strong></dd></dl></article>
      <article class="sample"><header><b>Noul</b><span>fast-41-diverse-039-013-counterfactual</span></header><dl><dt>state 摘录</dt><dd>Nadia 和 hiring manager 已确认；Priya 是唯一 required interviewer；roster 记录无人确认。</dd><dt>question</dt><dd>Should the October 13 loop be marked ready…?</dd><dt>target</dt><dd><strong>false</strong></dd></dl></article>
      <article class="sample"><header><b>Score</b><span>scale-diverse-017-002-base</span></header><dl><dt>state 摘录</dt><dd>$120 renewal；72 小时内要求降为 $72 plan；剩 363/365 天；期间已使用 Premium feature。</dd><dt>question</dt><dd>Determine the authorized adjustment impact level…</dd><dt>target</dt><dd><strong>0 · No adjustment</strong></dd></dl></article>
    </div>
    <div class="callout"><b>这些不是简单短文分类。</b>state 中会故意加入时间、否定、冲突记录和无关事实；criteria 是完整的动态 rubric，target 由规则和经验证的事实共同确定。</div>
    <p class="tiny">上面三条均来自官方公开 <a href="https://github.com/bespokelabsai/nimble/blob/main/data/train.jsonl">data/train.jsonl ↗</a>；只对 state 做了摘录，record ID 和 target 未改。</p>
  </div>
</section>

<section class="slide" data-rq="reproduction" data-sec="其他开源实现">
  <div class="in">
    <div class="kick">Jev 的开源复现做法及其性能</div>
    <h2 class="head">其他开源实现</h2>
    <div class="cards">
      <article class="card"><h4>1. Zefan-Cai/Open-Jev</h4><p>Qwen3.5-2B / 9B；rank-8 LoRA + 共享 scalar decision head；80,816 条训练数据；512 条 held-out rows 做温度校准；支持动态问题 / 候选。</p></article>
      <article class="card"><h4>2. Shalimov04/open-jev</h4><p>任务 YAML → LLM teacher 软标签 → mmBERT-small KL 蒸馏 → 事后校准。约 140M 参数，但每个 student 只支持一个固定任务。</p></article>
      <article class="card"><h4>3. 直接读取生成模型 logits</h4><p>JoshuaSP/open-jev 或 TypeSafe System One Adapter。可以测试“只改 readout 能走多远”，但没有证明概率校准。</p></article>
    </div>
    <div class="callout">JevBench 当前快照：Jev 74.4、SemIf 73.1、djev 73.0。这个 benchmark 很新、规模有限，而且公开题可能污染，因此只适合作为快照。</div>
  </div>
</section>

<section class="slide divider" id="rq1" data-rq="rq1" data-sec="RQ1：Jev 效果究竟如何？">
  <div class="in"><div class="rqbig">RQ1</div><h2>Jev 效果究竟如何？</h2><p class="question">InMind / MAB / DRB2 / DRB1 / TTCW</p></div>
</section>

<section class="slide" data-rq="rq1" data-sec="RQ1：MAB">
  <div class="in">
    <h3 class="report-head">MAB：固定 60 题，Top-5 后回答准确率</h3>
    <div class="tbl-wrap"><table><thead><tr><th>模型 / 方法</th><th>输入布局</th><th>Top-5 后回答正确</th></tr></thead><tbody>
      <tr><td>Jev</td><td>query + memory</td><td><strong>45/60 (75.0%)</strong></td></tr>
      <tr><td>Jev</td><td>memory in state</td><td>44/60 (73.3%)</td></tr>
      <tr><td>Jev</td><td>memory in state + timestamp</td><td><strong>45/60 (75.0%)</strong></td></tr>
      <tr><td>ReFind 保存答案 · 基线</td><td>本地测试</td><td>34/60 (56.7%)</td></tr>
    </tbody></table></div>
    <p class="tiny">外部 ReFind 与本地实现细节不同；这张表不包含 Kev、Nimble 及其 Base，它们的同题对照放在 RQ3 后。来源：<a href="UPDATE_BRIEF_20261007.md">本地结果 ↗</a>。</p>
    <details class="mab-evidence"><summary><span class="open-label">展开论文中的外部方法表</span><span class="close-label">收起外部方法表</span></summary><button class="mab-dismiss" type="button" aria-label="关闭外部方法表"></button><div class="mab-sheet"><div class="mab-sheet-head"><b>MemoryAgentBench · 公开方法对比</b><small>点击图片可放大</small></div><figure><div class="frame"><img src="assets/img/07-mab-baselines.png" alt="MemoryAgentBench 各类公开方法的对比结果"></div></figure></div></details>
  </div>
</section>

<section class="slide" data-rq="rq1" data-sec="RQ1：InMind">
  <div class="in">
    <h3 class="report-head">InMind：检索与最终回答</h3>
    <p class="tiny">上表是同一 20 题的 gold chunk 检索；下表是全量 125 题的最终回答成功率。两个指标不能混读。</p>
    <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>同一 20 题 · gold chunk</th><th>R@1</th><th>R@5</th><th>R@10</th><th>MRR@10</th></tr></thead><tbody>
      <tr><td>Jev · exchange</td><td><strong>85%</strong></td><td>90%</td><td>90%</td><td><strong>0.867</strong></td></tr>
      <tr><td>Jev · session</td><td>45%</td><td>75%</td><td><strong>100%</strong></td><td>0.606</td></tr>
    </tbody></table></div>
    <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>全量 125 题 · 最终回答</th><th>Top-5</th><th>Top-10</th></tr></thead><tbody>
      <tr><td>Jev · exchange</td><td><strong>95/125 · 76.0%</strong></td><td><strong>96/125 · 76.8%</strong></td></tr>
      <tr><td>Jev · full session</td><td><strong>75/125 · 60.0%</strong></td><td><strong>82/125 · 65.6%</strong></td></tr>
    </tbody></table></div>
    <details class="inline-evidence"><summary>展开 InMind 论文中的 Application 基线</summary><div class="tbl-wrap"><table class="dense-table"><thead><tr><th>类型</th><th>模型 / 方法</th><th>Application</th></tr></thead><tbody>
      <tr><td>上界</td><td>Backbone (GPT-5-mini)</td><td>84.0%</td></tr>
      <tr><td>Naive RAG</td><td>Dense (MiniLM)</td><td>9.6%</td></tr><tr><td>Naive RAG</td><td>Dense (emb3-large)</td><td>16.0%</td></tr><tr><td>Naive RAG</td><td>BM25</td><td>9.6%</td></tr>
      <tr><td>MiniLM</td><td>A-RAG</td><td>4.8%</td></tr><tr><td>MiniLM</td><td>xMemory</td><td>4.8%</td></tr><tr><td>MiniLM</td><td>Mem0</td><td>3.2%</td></tr><tr><td>MiniLM</td><td>A-Mem</td><td>6.4%</td></tr><tr><td>MiniLM</td><td>HippoRAG 2</td><td>8.8%</td></tr><tr><td>MiniLM</td><td>MemoryOS</td><td>8.0%</td></tr>
      <tr><td>emb3-large</td><td>A-RAG</td><td>7.2%</td></tr><tr><td>emb3-large</td><td>xMemory</td><td>6.4%</td></tr><tr><td>emb3-large</td><td>Mem0</td><td>6.4%</td></tr><tr><td>emb3-large</td><td>A-Mem</td><td>9.6%</td></tr><tr><td>emb3-large</td><td>HippoRAG 2</td><td>5.6%</td></tr><tr><td>emb3-large</td><td>MemoryOS</td><td>14.4%</td></tr>
    </tbody></table></div></details>
    <p class="tiny">论文 Application 基线与本地检索、回答流程不同，只作参考，不当作严格同协议排名。来源：<a href="FOUR_MODEL_COMPARISON_20261014.md">本地补测 ↗</a>。</p>
  </div>
</section>

<section class="slide" data-rq="rq1" data-sec="RQ1：DRB2">
  <div class="in">
    <h3 class="report-head">DRB2：10 个文本任务、739 条 rubric decision</h3>
    <div class="tbl-wrap"><table><thead><tr><th>模型 / 方法</th><th>Accuracy</th><th>Macro F1</th><th>blocked 召回 · 38 gold</th></tr></thead><tbody>
      <tr><td>Jev · 完整输入</td><td><strong>89.17%</strong></td><td>0.8071</td><td>30/38</td></tr>
      <tr><td>Gemini-2.5-Pro · 其他 evaluator 协议</td><td>90.66%</td><td>0.8858</td><td>—</td></tr>
      <tr><td>GPT-5 · 其他 evaluator 协议</td><td>87.14%</td><td>0.6050</td><td>—</td></tr>
    </tbody></table></div>
    <p class="muted">Gemini/GPT 来自其他 evaluator 协议，提供参照，不是严格同输入消融。</p>
    <p class="tiny">来源：<a href="UPDATE_BRIEF_20261007.md">Jev 与外部 evaluator 结果 ↗</a>。</p>
  </div>
</section>

<section class="slide" data-rq="rq1" data-sec="RQ1：DRB1">
  <div class="in">
    <h3 class="report-head">DRB1：同一 17 题的人类一致性</h3>
    <p class="tiny">Overall = PAR、OPC、FAP、FAS 的均值；FAP/FAS 只在 ICC 过滤后的 14 题计算。</p>
    <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>Jev 输入方式</th><th>PAR</th><th>OPC</th><th>FAP</th><th>FAS</th><th>Overall</th></tr></thead><tbody>
      <tr><td>Holistic</td><td>70.59</td><td>93.51</td><td>51.62</td><td>48.49</td><td>66.05</td></tr>
      <tr><td>Direct</td><td>73.53</td><td>93.11</td><td>62.96</td><td>59.40</td><td>72.25</td></tr>
      <tr><td>RACE</td><td>75.49</td><td>93.40</td><td>67.00</td><td>62.26</td><td>74.54</td></tr>
    </tbody></table></div>
    <p class="tiny">Jev API 费用 / 题（同一 17 题；每题评估 4 篇报告）：Holistic <b>$0.00143</b>，Direct <b>$0.00645</b>，RACE <b>$0.01644</b>。由本地逐项 usage 均摊；不含报告生成及其他评估费用。</p>
    <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>原有外部基线 · 17 题</th><th>PAR</th><th>OPC</th><th>FAP</th><th>FAS</th><th>Overall</th></tr></thead><tbody>
      <tr><td>GPT-5.5</td><td>73.53</td><td>95.52</td><td>66.95</td><td>65.12</td><td>75.28</td></tr>
      <tr><td>Gemini-3-Pro</td><td>75.49</td><td>92.59</td><td>65.74</td><td>62.26</td><td>74.02</td></tr>
      <tr><td>Gemini-3.1-Pro</td><td>72.55</td><td>93.90</td><td>64.34</td><td>57.37</td><td>72.04</td></tr>
      <tr><td>DeepSeek-v4-Pro</td><td>71.57</td><td>98.92</td><td>60.17</td><td>57.37</td><td>72.01</td></tr>
    </tbody></table></div>
    <p class="tiny">这是 50 题中 Jev RACE 完整可评的 17 题，不代表 DRB1 全量排名。来源：<a href="JEV_CROSS_BENCHMARK_REPORT.md">交叉测试报告 ↗</a>。</p>
  </div>
</section>

<section class="slide" data-rq="rq1" data-sec="RQ1：TTCW">
  <div class="in">
    <h3 class="report-head">TTCW：48 stories / 672 items</h3>
    <p class="tiny">Jev 的 holistic、14 项 hard Yes 累加、14 项 P(Yes) 累加是三种不同评分函数；下方外部基线协议也不同。</p>
    <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>Jev 评分方法</th><th>Spearman</th><th>Kendall</th><th>Pairwise</th></tr></thead><tbody>
      <tr><td>Holistic</td><td>0.2805</td><td>0.2347</td><td>0.6667</td></tr>
      <tr><td>14 项 hard Yes 数量</td><td>0.1138</td><td>0.1236</td><td>0.6944</td></tr>
      <tr><td>14 项 P(Yes) 累加</td><td><strong>0.5305</strong></td><td><strong>0.4569</strong></td><td><strong>0.7500</strong></td></tr>
    </tbody></table></div>
    <details class="inline-evidence"><summary>展开外部 reference-free / reference-based 基线</summary><div class="tbl-wrap"><table class="dense-table"><thead><tr><th>协议</th><th>模型</th><th>Spearman</th><th>Kendall</th><th>Pairwise</th></tr></thead><tbody>
      <tr><td>Reference-free</td><td>Claude v1.3</td><td>0.15</td><td>0.16</td><td>0.64</td></tr><tr><td>Reference-free</td><td>Claude 3 Opus</td><td>0.25</td><td>0.22</td><td>0.64</td></tr><tr><td>Reference-free</td><td>Claude 3.5</td><td>0.14</td><td>0.13</td><td>0.64</td></tr><tr><td>Reference-free</td><td>GPT-4o</td><td>0.16</td><td>0.14</td><td>0.64</td></tr><tr><td>Reference-free</td><td>Qwen2-72B</td><td>-0.12</td><td>-0.11</td><td>0.58</td></tr>
      <tr><td>Reference-based</td><td>Claude 3.5</td><td>0.49</td><td>0.44</td><td>0.75</td></tr><tr><td>Reference-based</td><td>GPT-4o</td><td>0.38</td><td>0.36</td><td>0.72</td></tr><tr><td>Reference-based</td><td>Qwen2-72B</td><td>0.22</td><td>0.16</td><td>0.61</td></tr>
    </tbody></table></div></details>
    <p class="tiny">来源：<a href="JEV_CROSS_BENCHMARK_REPORT.md">交叉测试报告 ↗</a>。</p>
  </div>
</section>

<section class="slide" data-rq="reproduction" data-sec="MAB：固定 60 题，Top-5 后回答准确率">
  <div class="in">
    <h3 class="report-head">MAB：固定 60 题，Top-5 后回答准确率</h3>
    <p class="tiny"><span class="tag test">10 月 14 日补测</span>四模型都有 60 题答案；下面保留 10 月 7 日的 Jev / 9B Base 输入布局实验。</p>
    <div class="tbl-wrap"><table><thead><tr><th>类型</th><th>模型 / 输入布局</th><th>Top-5 后回答正确</th></tr></thead><tbody>
      <tr><td>Jev</td><td>query + memory</td><td><strong>45/60 (75.0%)</strong></td></tr>
      <tr><td>Jev</td><td>memory in state</td><td>44/60 (73.3%)</td></tr>
      <tr><td>Jev</td><td>memory in state + timestamp</td><td><strong>45/60 (75.0%)</strong></td></tr>
      <tr><td>9B Base · 10/07</td><td>query + memory in state（原布局）</td><td>41/60 (68.3%)</td></tr>
      <tr><td>9B Base · 10/07</td><td>memory in state，query in instruction</td><td>42/60 (70.0%)</td></tr>
      <tr><td>9B Base · 10/07</td><td>memory in state + timestamp</td><td>43/60 (71.7%)</td></tr>
      <tr><td>4B Base · 10/14</td><td>Qwen3.5-4B-Base，原词表头</td><td>34/60 (56.7%)</td></tr>
      <tr><td>早期本地测试</td><td>Nimble-9B（2676 版归档）</td><td>43/60 (71.7%)</td></tr>
      <tr><td>早期本地测试</td><td>KEV-4B（旧快照）</td><td>40/60 (66.7%)</td></tr>
      <tr><td>开源</td><td>Laya</td><td>19/60 (31.7%)</td></tr>
      <tr><td>基线 1</td><td>ReFind 保存答案</td><td>34/60 (56.7%)</td></tr>
    </tbody></table></div>
    <p class="muted">4B Base / KEV 使用 256-token 检索窗口；存档的 9B Base / Nimble 使用 900-token 窗口。所以四者都有分数，但不是完全同窗口的训练消融。9B Base 的三种布局也不是三个模型，最高分不能当作未选择的基线成绩。</p>
    <p class="tiny">来源：<a href="FOUR_MODEL_COMPARISON_20261014.md">10 月 14 日四模型完整结果 ↗</a>；<a href="UPDATE_BRIEF_20261007.md">10 月 7 日布局实验 ↗</a>。外部 ReFind 基线与本地实现细节不同。</p>
    <details class="mab-evidence">
      <summary><span class="open-label">展开外部基线表</span><span class="close-label">收起外部基线表</span></summary>
      <button class="mab-dismiss" type="button" aria-label="关闭外部基线表"></button>
      <div class="mab-sheet">
        <div class="mab-sheet-head"><b>MemoryAgentBench · 公开方法对比</b><small>点击图片可放大</small></div>
        <figure><div class="frame"><img src="assets/img/07-mab-baselines.png" alt="MemoryAgentBench 各类方法在 SH-QA、MH-QA、LME、EventQA、FC-SH 和 FC-MH 上的对比结果"></div></figure>
      </div>
    </details>
  </div>
</section>

<section class="slide" data-rq="reproduction" data-sec="InMind：同一 20 题，gold chunk retrieval">
  <div class="in">
    <div class="kick">RQ3 <span class="dim">· 开源复现与 Base 对照</span></div>
    <h3 class="report-head">InMind：同一 20 题，gold chunk retrieval</h3>
    <p class="tiny"><span class="tag test">10 月 14 日补测</span>从全量 125 题结果中取相同的 20 题；下表均为 exchange / session 的 gold chunk 检索，不是最终回答成功率。</p>
    <div class="tbl-wrap"><table><thead><tr><th>类型</th><th>模型 / 方法</th><th>R@1</th><th>R@5</th><th>R@10</th><th>MRR@10</th></tr></thead><tbody>
      <tr><td>Jev</td><td>exchange chunk</td><td><strong>85%</strong></td><td>90%</td><td>90%</td><td><strong>0.867</strong></td></tr>
      <tr><td>Jev</td><td>session chunk</td><td>45%</td><td>75%</td><td><strong>100%</strong></td><td>0.606</td></tr>
      <tr><td>4B Base</td><td>Qwen3.5-4B-Base，exchange</td><td>5%</td><td>10%</td><td>20%</td><td>0.076</td></tr>
      <tr><td>KEV-4B</td><td>明确切窗的新结果，exchange</td><td>55%</td><td>70%</td><td>75%</td><td>0.613</td></tr>
      <tr><td>9B Base</td><td>Qwen3.5-9B，exchange</td><td>40%</td><td>70%</td><td>75%</td><td>0.520</td></tr>
      <tr><td>Nimble-9B</td><td>2676 版归档，exchange</td><td>65%</td><td><strong>95%</strong></td><td>95%</td><td>0.749</td></tr>
      <tr><td>开源</td><td>Laya，exchange</td><td>10%</td><td>15%</td><td>15%</td><td>0.113</td></tr>
    </tbody></table></div>
    <p class="muted">表中的 Jev / 9B Base 两行与旧快照数值相同；KEV/Nimble 改用此次汇总中的 same20。这里没有把旧 KEV 的静默截断结果混进来。session 粒度的输入处理仍不一致：Base/KEV 明确切窗，Jev 一次读取整个 session。</p>
    <p class="tiny">来源：<a href="FOUR_MODEL_COMPARISON_20261014.md">10 月 14 日四模型完整结果 ↗</a>。</p>
  </div>
</section>

<section class="slide" data-rq="reproduction" data-sec="InMind：全量 125 题，最终回答成功率">
  <div class="in">
    <h3 class="report-head">InMind：全量 125 题，最终回答成功率</h3>
    <p class="tiny"><span class="tag test">10 月 14 日补测</span>四模型均完成相同 125 题 × exchange/session × Top-5/10；沿用 GPT-5-mini prompt 和 judge。表中是<strong>最终回答成功率</strong>，不是检索召回。</p>
    <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>chunk</th><th>检索器</th><th>Top-5 最终成功</th><th>Top-10 最终成功</th></tr></thead><tbody>
      <tr><td>exchange</td><td>Jev</td><td><strong>95/125 · 76.0%</strong></td><td><strong>96/125 · 76.8%</strong></td></tr>
      <tr><td>exchange</td><td>4B Base</td><td>8/125 · 6.4%</td><td>20/125 · 16.0%</td></tr>
      <tr><td>exchange</td><td>KEV-4B</td><td>80/125 · 64.0%</td><td>77/125 · 61.6%</td></tr>
      <tr><td>exchange</td><td>9B Base</td><td>76/125 · 60.8%</td><td>75/125 · 60.0%</td></tr>
      <tr><td>exchange</td><td>Nimble-9B</td><td>94/125 · 75.2%</td><td>90/125 · 72.0%</td></tr>
      <tr><td>session</td><td>Jev · full session</td><td><strong>75/125 · 60.0%</strong></td><td><strong>82/125 · 65.6%</strong></td></tr>
      <tr><td>session</td><td>4B Base · window + max</td><td>1/125 · 0.8%</td><td>2/125 · 1.6%</td></tr>
      <tr><td>session</td><td>KEV-4B · window + max</td><td>0/125 · 0.0%</td><td>2/125 · 1.6%</td></tr>
      <tr><td>session</td><td>9B Base · window + max</td><td>14/125 · 11.2%</td><td>38/125 · 30.4%</td></tr>
      <tr><td>session</td><td>Nimble-9B</td><td>14/125 · 11.2%</td><td>25/125 · 20.0%</td></tr>
    </tbody></table></div>
    <p class="muted">4B Base / KEV 的长 session 明确切为 1,200-token 重叠窗口后取 max；9B/Nimble 使用存档排序；Jev 整个 session 一次输入。四者同任务、同回答流程，但 session 行不是同输入计算对照。</p>
    <details class="inline-evidence"><summary>展开四模型全量 gold chunk 检索召回</summary>
      <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>模型 / chunk</th><th>R@1</th><th>R@5</th><th>R@10</th><th>MRR@10</th></tr></thead><tbody>
        <tr><td>4B Base / exchange</td><td>.056</td><td>.112</td><td>.224</td><td>.092</td></tr><tr><td>KEV-4B / exchange</td><td>.592</td><td>.744</td><td>.768</td><td>.654</td></tr>
        <tr><td>9B Base / exchange</td><td>.536</td><td>.752</td><td>.800</td><td>.635</td></tr><tr><td>Nimble-9B / exchange</td><td>.632</td><td>.912</td><td>.944</td><td>.741</td></tr>
        <tr><td>4B Base / session</td><td>.000</td><td>.000</td><td>.000</td><td>.000</td></tr><tr><td>KEV-4B / session</td><td>.000</td><td>.000</td><td>.032</td><td>.004</td></tr>
        <tr><td>9B Base / session</td><td>.008</td><td>.136</td><td>.464</td><td>.093</td></tr><tr><td>Nimble-9B / session</td><td>.040</td><td>.144</td><td>.280</td><td>.087</td></tr>
      </tbody></table></div>
    </details>
    <p class="tiny">外部方法的 <span class="en">Application</span> 分数见下表，其实现和判分流程与本地实验不同。</p>
    <details class="inline-evidence"><summary>展开 InMind 论文中的完整 Application 基线</summary>
      <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>类型</th><th>模型 / 方法</th><th>Application</th></tr></thead><tbody>
        <tr><td>上界</td><td>Backbone (GPT-5-mini)</td><td>84.0%</td></tr>
        <tr><td>Naive RAG</td><td>Dense (MiniLM)</td><td>9.6%</td></tr><tr><td>Naive RAG</td><td>Dense (emb3-large)</td><td>16.0%</td></tr><tr><td>Naive RAG</td><td>BM25</td><td>9.6%</td></tr>
        <tr><td>MiniLM</td><td>A-RAG</td><td>4.8%</td></tr><tr><td>MiniLM</td><td>xMemory</td><td>4.8%</td></tr><tr><td>MiniLM</td><td>Mem0</td><td>3.2%</td></tr><tr><td>MiniLM</td><td>A-Mem</td><td>6.4%</td></tr><tr><td>MiniLM</td><td>HippoRAG 2</td><td>8.8%</td></tr><tr><td>MiniLM</td><td>MemoryOS</td><td>8.0%</td></tr>
        <tr><td>emb3-large</td><td>A-RAG</td><td>7.2%</td></tr><tr><td>emb3-large</td><td>xMemory</td><td>6.4%</td></tr><tr><td>emb3-large</td><td>Mem0</td><td>6.4%</td></tr><tr><td>emb3-large</td><td>A-Mem</td><td>9.6%</td></tr><tr><td>emb3-large</td><td>HippoRAG 2</td><td>5.6%</td></tr><tr><td>emb3-large</td><td>MemoryOS</td><td>14.4%</td></tr>
      </tbody></table></div>
    </details>
    <p class="tiny">来源：<a href="FOUR_MODEL_COMPARISON_20261014.md">10 月 14 日四模型完整结果 ↗</a>；Jev 旧结果沿用本地保存实验。</p>
  </div>
</section>

<section class="slide" data-rq="reproduction" data-sec="DRB2：10 个文本任务、739 条 rubric decision">
  <div class="in">
    <h3 class="report-head">DRB2：10 个文本任务、739 条 rubric decision</h3>
    <p class="tiny"><span class="tag test">10 月 14 日补测</span>原任务 + blocked reference + 完整待评报告，739 条 gold；四模型现均有完整输入结果。</p>
    <div class="tbl-wrap"><table><thead><tr><th>完整报告输入</th><th>Accuracy</th><th>Macro F1</th><th>blocked 召回 · 38 gold</th></tr></thead><tbody>
      <tr><td>4B Base · Qwen3.5-4B-Base</td><td>32.48%</td><td>0.2134</td><td>0/38</td></tr>
      <tr><td>KEV-4B · pointer head</td><td>79.97%</td><td>0.6538</td><td>13/38</td></tr>
      <tr><td>9B Base · Qwen3.5-9B</td><td>76.32%</td><td>0.5044</td><td>0/38</td></tr>
      <tr><td>Nimble-9B · 本地 2676 版归档</td><td>77.13%</td><td>0.5665</td><td>8/38</td></tr>
      <tr><td>Jev · 既有完整输入结果</td><td><strong>89.17%</strong></td><td><strong>0.8071</strong></td><td><strong>30/38</strong></td></tr>
    </tbody></table></div>
    <div class="callout blue"><b>Accuracy 会掩盖 blocked 类：</b>9B Base 的 76.32% 同时伴随 0/38 blocked 召回；KEV 为 13/38，Jev 为 30/38。4B Base 则几乎把样本都判成 satisfied。</div>
    <details class="inline-evidence"><summary>展开早期窗口化结果与其他 evaluator 基线</summary>
      <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>协议</th><th>模型 / 方法</th><th>Accuracy</th><th>Macro F1</th></tr></thead><tbody>
        <tr><td>早期窗口化</td><td>Nimble-9B · hard-any</td><td>70.64%</td><td>0.5641</td></tr>
        <tr><td>早期窗口化</td><td>KEV-4B · 旧快照</td><td>68.74%</td><td>0.5494</td></tr>
        <tr><td>早期窗口化</td><td>Laya · max-prob</td><td>44.79%</td><td>0.3009</td></tr>
        <tr><td>其他 evaluator 协议</td><td>Gemini-2.5-Pro</td><td>90.66%</td><td>0.8858</td></tr>
        <tr><td>其他 evaluator 协议</td><td>GPT-5</td><td>87.14%</td><td>0.6050</td></tr>
      </tbody></table></div>
    </details>
    <p class="tiny">四模型来源：<a href="FOUR_MODEL_COMPARISON_20261014.md">10 月 14 日完整结果 ↗</a>；<a href="UPDATE_BRIEF_20261007.md">Jev 与早期窗口化结果 ↗</a>。KEV 使用 pointer readout，不能把差值单独归因于后训练。</p>
  </div>
</section>

<section class="slide" data-rq="reproduction" data-sec="DRB1：同一 17/50 题的人类一致性">
  <div class="in">
    <h3 class="report-head">DRB1：同一 17/50 题的人类一致性</h3>
    <p class="tiny"><span class="tag test">10 月 14 日补测</span>17 题 × 每题 4 份报告；四模型均有 holistic / direct / RACE 完整输入结果。Overall = 四项均值，百分制。</p>
    <div class="tbl-wrap compact-results"><table class="dense-table grouped-table"><thead><tr><th>模型</th><th>PAR</th><th>OPC</th><th>FAP</th><th>FAS</th><th>Overall</th></tr></thead><tbody>
      <tr class="group-row"><th colspan="6">Holistic · task + 完整 target report；无 reference / criteria</th></tr>
      <tr><td>4B Base</td><td>57.84</td><td>92.94</td><td>27.75</td><td>19.92</td><td>49.61</td></tr>
      <tr><td>KEV-4B</td><td>70.59</td><td><strong>98.41</strong></td><td>49.76</td><td>45.64</td><td><strong>66.10</strong></td></tr>
      <tr><td>9B Base</td><td>56.86</td><td>75.42</td><td>28.69</td><td>17.59</td><td>44.64</td></tr>
      <tr><td>Nimble · 2676 版</td><td>51.96</td><td>-6.75</td><td>23.89</td><td>14.73</td><td>20.96</td></tr>
      <tr><td>Jev</td><td><strong>70.59</strong></td><td>93.51</td><td><strong>51.62</strong></td><td><strong>48.49</strong></td><td>66.05</td></tr>
      <tr class="group-row"><th colspan="6">Direct · task + 完整 target report + weighted criteria；无 reference</th></tr>
      <tr><td>4B Base</td><td>72.55</td><td>99.53</td><td>55.85</td><td>48.49</td><td>69.11</td></tr>
      <tr><td>KEV-4B</td><td>72.55</td><td><strong>99.83</strong></td><td>54.94</td><td>51.35</td><td>69.67</td></tr>
      <tr><td>9B Base</td><td><strong>77.45</strong></td><td>98.48</td><td>60.06</td><td><strong>62.26</strong></td><td><strong>74.56</strong></td></tr>
      <tr><td>Nimble · 2676 版</td><td>72.55</td><td>99.75</td><td>53.70</td><td>46.16</td><td>68.04</td></tr>
      <tr><td>Jev</td><td>73.53</td><td>93.11</td><td><strong>62.96</strong></td><td>59.40</td><td>72.25</td></tr>
      <tr class="group-row"><th colspan="6">RACE · task + 完整 target / reference report + weighted criteria</th></tr>
      <tr><td>4B Base</td><td>73.53</td><td>98.29</td><td>60.23</td><td>60.83</td><td>73.22</td></tr>
      <tr><td>KEV-4B</td><td>73.53</td><td>96.84</td><td>59.35</td><td>56.54</td><td>71.57</td></tr>
      <tr><td>9B Base</td><td><strong>76.47</strong></td><td><strong>99.33</strong></td><td><strong>67.87</strong></td><td><strong>63.69</strong></td><td><strong>76.84</strong></td></tr>
      <tr><td>Nimble · 2676 版</td><td>74.51</td><td>98.80</td><td>62.72</td><td>58.49</td><td>73.63</td></tr>
      <tr><td>Jev</td><td>75.49</td><td>93.40</td><td>67.00</td><td>62.26</td><td>74.54</td></tr>
    </tbody></table></div>
    <p class="tiny">FAP/FAS 只在 ICC 过滤后保留的 14 题计算。四模型补测：<a href="FOUR_MODEL_COMPARISON_20261014.md">10 月 14 日完整结果 ↗</a>；Jev 使用既有保存结果。KEV 为 pointer readout，其余为候选 token readout。</p>
    <details class="inline-evidence"><summary>展开原有 GPT / Gemini / DeepSeek 基线</summary>
      <p class="tiny">原报告给出以下 17 题结果；这里保留为单独参考，不并入新增的三组输入比较。</p>
      <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>模型</th><th>PAR</th><th>OPC</th><th>FAP</th><th>FAS</th><th>Overall</th></tr></thead><tbody>
        <tr><td>GPT-5.5</td><td>73.53</td><td>95.52</td><td>66.95</td><td>65.12</td><td>75.28</td></tr>
        <tr><td>Gemini-3-Pro</td><td>75.49</td><td>92.59</td><td>65.74</td><td>62.26</td><td>74.02</td></tr>
        <tr><td>Gemini-3.1-Pro</td><td>72.55</td><td>93.90</td><td>64.34</td><td>57.37</td><td>72.04</td></tr>
        <tr><td>DeepSeek-v4-Pro</td><td>71.57</td><td>98.92</td><td>60.17</td><td>57.37</td><td>72.01</td></tr>
      </tbody></table></div>
    </details>
  </div>
</section>

<section class="slide" data-rq="reproduction" data-sec="TTCW：全量 48 stories / 672 items">
  <div class="in">
    <h3 class="report-head">TTCW：全量 48 stories / 672 items</h3>
    <p class="tiny"><span class="tag test">10 月 14 日补测</span>四模型均有 48 篇完整故事 / 672 条二值判断；36 篇模型故事按 12 组排序。每种评分函数只在本组内比较。</p>
    <div class="tbl-wrap compact-results"><table class="dense-table grouped-table"><thead><tr><th>模型</th><th>Spearman</th><th>Kendall</th><th>Pairwise</th></tr></thead><tbody>
      <tr class="group-row"><th colspan="4">Holistic · 无 rubric；21 档 0–100 期望分</th></tr>
      <tr><td>4B Base</td><td>-0.2693</td><td>-0.2472</td><td>0.3889</td></tr>
      <tr><td>KEV-4B</td><td>0.0000</td><td>0.0000</td><td>0.4722</td></tr>
      <tr><td>9B Base</td><td><strong>0.4360</strong></td><td><strong>0.3583</strong></td><td><strong>0.7222</strong></td></tr>
      <tr><td>Nimble · 2676 版</td><td>-0.4553</td><td>-0.3833</td><td>0.3056</td></tr>
      <tr><td>Jev</td><td>0.2805</td><td>0.2347</td><td>0.6667</td></tr>
      <tr class="group-row"><th colspan="4">原始 14 项 Yes/No · hard Yes 数量累加</th></tr>
      <tr><td>4B Base</td><td>0.0417</td><td>0.0417</td><td><strong>0.7778</strong></td></tr>
      <tr><td>KEV-4B</td><td>-0.2083</td><td>-0.2083</td><td>0.6111</td></tr>
      <tr><td>9B Base</td><td><strong>0.1748</strong></td><td><strong>0.1347</strong></td><td>0.7222</td></tr>
      <tr><td>Nimble · 2676 版</td><td>-0.0305</td><td>-0.0403</td><td>0.5833</td></tr>
      <tr><td>Jev</td><td>0.1138</td><td>0.1236</td><td>0.6944</td></tr>
      <tr class="group-row"><th colspan="4">原始 14 项 Yes/No · P(Yes) 累加</th></tr>
      <tr><td>4B Base · T=1</td><td>-0.0305</td><td>-0.0680</td><td>0.4444</td></tr>
      <tr><td>KEV-4B · T=1</td><td>-0.2887</td><td>-0.2722</td><td>0.4167</td></tr>
      <tr><td>9B Base · T=1</td><td>0.1362</td><td>0.0986</td><td>0.5556</td></tr>
      <tr><td>Nimble · T=1</td><td>-0.1027</td><td>-0.0805</td><td>0.5278</td></tr>
      <tr><td>Jev</td><td><strong>0.5305</strong></td><td><strong>0.4569</strong></td><td><strong>0.7500</strong></td></tr>
    </tbody></table></div>
    <p class="tiny">旧结果的 14 项逐项 accuracy：9B Base 0.4554 / Nimble 0.3884 / Jev 0.5625；预测 Yes 比例：0.8125 / 0.9360 / 0.6637，gold 为 0.3393。Nimble 几乎总判 Yes；soft-sum 的开源模型概率未做温度校准。</p>
    <details class="inline-evidence"><summary>展开外部 reference-free / reference-based 排序基线</summary>
      <div class="tbl-wrap"><table class="dense-table"><thead><tr><th>协议</th><th>模型</th><th>Spearman</th><th>Kendall</th><th>Pairwise</th></tr></thead><tbody>
        <tr><td>Reference-free</td><td>Claude v1.3</td><td>0.15</td><td>0.16</td><td>0.64</td></tr><tr><td>Reference-free</td><td>Claude 3 Opus</td><td>0.25</td><td>0.22</td><td>0.64</td></tr>
        <tr><td>Reference-free</td><td>Claude 3.5</td><td>0.14</td><td>0.13</td><td>0.64</td></tr><tr><td>Reference-free</td><td>GPT-4o</td><td>0.16</td><td>0.14</td><td>0.64</td></tr><tr><td>Reference-free</td><td>Qwen2-72B</td><td>-0.12</td><td>-0.11</td><td>0.58</td></tr>
        <tr><td>Reference-based</td><td>Claude 3.5</td><td>0.49</td><td>0.44</td><td>0.75</td></tr><tr><td>Reference-based</td><td>GPT-4o</td><td>0.38</td><td>0.36</td><td>0.72</td></tr><tr><td>Reference-based</td><td>Qwen2-72B</td><td>0.22</td><td>0.16</td><td>0.61</td></tr>
      </tbody></table></div>
    </details>
    <p class="tiny">四模型来源：<a href="FOUR_MODEL_COMPARISON_20261014.md">10 月 14 日完整结果 ↗</a>；<a href="UPDATE_BRIEF_20261007.md">Jev 与旧结果 ↗</a>。外部基线的输入与评分函数另有差异。</p>
  </div>
</section>

<section class="slide" data-rq="reproduction" data-sec="一个最小复现方案">
  <div class="in">
    <div class="kick">Jev 的开源复现做法及其性能</div>
    <h2 class="head">一个最小复现方案</h2>
    <div class="pipe">
      <div class="node"><b>Qwen 2B / 4B</b><span>pretrained LLM backbone</span></div><div class="arr">→</div>
      <div class="node"><b>joint encoding</b><span>state / question / option</span></div><div class="arr">→</div>
      <div class="node"><b>shared scalar head</b><span>每个候选共享</span></div><div class="arr">→</div>
      <div class="node"><b>LoRA</b><span>CE / KL + calibration</span></div>
    </div>
    <ul class="b">
      <li>数据：hard / soft synthetic decision data；</li>
      <li>目标：CE / KL + calibration + permutation consistency；</li>
      <li>事后处理：temperature scaling；</li>
      <li>评测：task-held-out、domain-held-out、option permutation、label paraphrase；</li>
      <li>指标：accuracy / F1、ECE / Brier、risk–coverage 和真实端到端 latency。</li>
    </ul>
    <p class="tiny"><a href="JEV_CROSS_BENCHMARK_REPORT.md">完整交叉测试报告 ↗</a></p>
  </div>
</section>

<section class="slide divider" id="discussion2" data-rq="discussion2" data-sec="Discussion 2：TypeSafe 的理念">
  <div class="in"><div class="rqbig">D2</div><h2>Discussion 2：TypeSafe 的理念</h2><p class="question">System 1 &amp; System 2；The Bitterest Lesson；Damned Benchmark。</p></div>
</section>

<section class="slide" data-rq="philosophy" data-sec="部分名词">
  <div class="in">
    <div class="kick">理念 <span class="dim">· 部分名词</span></div>
    <div class="cards two">
      <article class="card"><h4>System One</h4><p>借用 Kahneman 的 System 1，表示快速、直觉、非长链推理的判断。这里首先是任务 / 接口类别，不是已公开的神经网络架构。</p></article>
      <article class="card"><h4>Machine-native</h4><p>人类消费语言，程序更适合消费类型、概率和控制流。Jev 输出可直接组成 if、match、sort 和 route。</p></article>
      <article class="card"><h4>Type-safe</h4><p>输出保证落在预先声明的结构中；type-safe 不等于 factually correct。</p></article>
      <article class="card"><h4>Calibrated decision</h4><p>在一组样本上，模型报告 0.8 的事件应约有 80% 为真；不表示某个单独答案必然有可验证的“80% 可信度”。</p></article>
      <article class="card"><h4>Intelligence per dollar</h4><p>Jev 不追求所有开放任务的最高能力，而是 System One-shaped workload 中单位成本可获得的有效判断。</p></article>
      <article class="card"><h4>Jevons paradox</h4><p>单位智能越便宜，可能解锁越多过去不值得做的决策，最终增加智能总需求。</p></article>
    </div>
  </div>
</section>

<section class="slide" data-rq="philosophy" data-sec="System One / System Two">
  <div class="in">
    <div class="kick">理念 <span class="dim">· System One / System Two</span></div>
    <div class="cols">
      <div>
        <h2 class="head">System One 强调快速决策，不等于永远不会出错</h2>
        <div class="cards two">
          <article class="card"><h4>System One</h4><p>快速、高频、输出空间已知的判断。</p></article>
          <article class="card"><h4>System Two</h4><p>慢速、审议、长链推理、规划和开放生成。</p></article>
        </div>
        <p>TypeSafe 的观点不是“System 1 天然正确”，而是这类任务可以通过受限输出、概率和程序约束，做得比自由文本更可靠。</p>
      </div>
      <figure><div class="frame"><img src="assets/img/04-system-one-jev-names.png" alt="System One 与 Jev 的命名来源"></div></figure>
    </div>
  </div>
</section>

<section class="slide" data-rq="philosophy" data-sec="The Bitterest Lesson">
  <div class="in">
    <div class="kick">理念 <span class="dim">· The Bitterest Lesson</span></div>
    <h2 class="head">right task &gt; data &gt; compute &gt; algorithms</h2>
    <p class="lead">CEO 的核心观点是：优化器只能让已定义的目标更高，却不能替你决定什么才是对的任务。</p>
    <div class="pipe">
      <div class="node"><b>Right task</b><span>程序真正需要的输出</span></div><div class="arr">→</div>
      <div class="node"><b>Data</b><span>现实决策分布</span></div><div class="arr">→</div>
      <div class="node"><b>Compute</b><span>扩大训练与推理</span></div><div class="arr">→</div>
      <div class="node"><b>Algorithms</b><span>具体优化方法</span></div>
    </div>
    <div class="callout">Jev 的核心叙事是：预训练智能已经足够强，关键是选择适合软件自动化的任务和数据。</div>
    <p class="tiny"><a href="https://typesafe.ai/blog/bitterest-lesson">The Bitterest Lesson ↗</a> · <a href="https://docs.typesafe.ai/introduction/machine-learning-primer">Machine Learning Primer ↗</a></p>
  </div>
</section>

<section class="slide" data-rq="philosophy" data-sec="Damned Benchmark">
  <div class="in">
    <div class="kick">理念 <span class="dim">· Lies, Damned Lies, and Benchmarks</span></div>
    <h2 class="head">公开 benchmark 不只会被训练集泄漏破坏，也会被反复选模型间接过拟合</h2>
    <ul class="b">
      <li>即使没有直接训 benchmark，训相似数据或反复试验后选择最高分 checkpoint，也会把 benchmark 变成训练信号；</li>
      <li>TypeSafe 主张把公开 eval 当作带日期的快照，而不是不断 hill-climb 的长期榜单；</li>
      <li>我们的 MAB 60、InMind same 20、DRB1 same 17 也都只能在当前协议下解读。</li>
    </ul>
    <div class="callout blue">因此比“谁的总分更高”更重要的是：模型在什么输入布局、什么任务粒度、什么读出和聚合方式下有效或失效。</div>
  </div>
</section>

<section class="slide divider" id="open-problem" data-rq="open" data-sec="Open Problem">
  <div class="in"><div class="rqbig">OPEN</div><h2>Open Problem</h2></div>
</section>

<section class="slide" data-rq="open" data-sec="Reasoning / Lctx / Multimodal / Uni-Jev-LLM">
  <div class="in">
    <div class="kick">Open Problem</div>
    <div class="cards two">
      <article class="card"><h4>1. Reasoning Jev</h4><p>能否在不回到长链自回归生成的前提下，引入更稳定、更便宜的内部计算？</p></article>
      <article class="card"><h4>2. Lctx-Jev / Multimodal Jev</h4><p>是否只需更换长上下文或多模态 Base Model，还是需要新的 readout 和训练数据？</p></article>
      <article class="card"><h4>3. Uni-Jev-LLM</h4><p>一个模型能否在 typed parallel decision 与开放生成之间切换，而不牺牲两边的效率和校准？</p></article>
    </div>
  </div>
</section>

<section class="slide" data-rq="open" data-sec="Application">
  <div class="in">
    <div class="kick">Open Problem <span class="dim">· 4. Application</span></div>
    <h2 class="head">4. Application</h2>
    <div class="cards">
      <article class="card accent"><h4>Judge / Scorer</h4><p>对报告、代码、agent trace 和安全规则进行多维评分。</p></article>
      <article class="card blue"><h4>Classify / Label</h4><p>做路由、意图、优先级、policy 和长尾标签。</p></article>
      <article class="card pos"><h4>Jev-PostTrain</h4><p>积累私有 outcome 后，训练更小的专用 decision model。</p></article>
    </div>
  </div>
</section>

<section class="slide divider" data-rq="open" data-sec="结束">
  <div class="in" style="text-align:center">
    <div class="kick" style="justify-content:center">谢谢 <span class="dim">· 组会 0923 · Jev</span></div>
    <p class="muted"><a href="../../index.html">← 返回主页</a></p>
  </div>
</section>
`;
