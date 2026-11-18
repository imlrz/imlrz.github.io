(function () {
  function renderPipelines() {
    document.querySelectorAll('[data-pipeline]').forEach((mount) => {
      const mode = mount.dataset.pipeline;
      const hlExtract = mode === 'rq2' || mode === 'storage';
      const hlRet = mode === 'rq2' || mode === 'storage' || mode === 'rq3';
      const hlLLM = mode === 'rq2' || mode === 'storage';
      const verified = mode === 'rq3';
      const isStorage = mode === 'storage';
      const isPlanB = mode === 'planb';

      let topQueryHTML = `
        <div class="query-drop">
          <div class="query-drop-cell">
            <div class="q-chip">Query</div>
            <div class="q-down"></div>
          </div>
        </div>
      `;

      if (isStorage) {
        topQueryHTML = `
          <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:5px;padding-left:60px;">
            <div style="border:1.5px dashed #9aa8a3;padding:5px 14px;color:#7b8783;font-size:14.5px;">
              间接 Query：“周末做马卡龙？”
            </div>
            <span style="color:#5b6763;font-weight:700;">→</span>
            <div style="display:flex;flex-direction:column;align-items:center;">
              <div style="border:2px solid #245B56;background:#EDF4F1;color:#245B56;padding:5px 16px;font-weight:700;font-size:15.5px;">
                Direct Query：“我对什么过敏？”
              </div>
              <div class="q-down" style="background:#245B56;"></div>
            </div>
          </div>
        `;
      }

      mount.innerHTML = `
        <div class="pipe-wrap" style="${isPlanB ? 'border:1.8px dashed #8A9692;padding:18px 20px 14px;background:#fafcfb;position:relative;' : ''}">
          ${isPlanB ? `<div style="position:absolute;top:-12px;left:22px;background:#ffffff;padding:0 10px;font-size:12.5px;font-weight:700;color:#5B6763;">外置检索范式（“需要时再去翻笔记本”）——真的所有记忆都要走这一步吗？</div>` : ''}
          ${topQueryHTML}

          <div class="pipe-grid">
            <div>
              <div class="p-node">
                <div class="p-node-head"><span>Dialogue</span><span>47 Sess.</span></div>
                <div class="mini-chat">
                  <div class="mc-u">我对树坚果过敏</div>
                  <div class="mc-a">好，我记下了</div>
                  <div class="mc-u">周末去露营……</div>
                  <div class="mc-a">装备清单如下……</div>
                </div>
              </div>
              <div class="p-node-foot">session</div>
            </div>

            <div>
              <div class="p-stage ${hlExtract ? 'hl-yellow' : ''}">
                ${verified ? '<div class="st-badge">✓ 已排除</div>' : (hlExtract ? '<div class="st-badge" style="color:#9A7618;">? 待排查</div>' : '')}
                <div class="st-name">extract</div>
                <div class="st-line"></div>
                <div class="st-sub">Chunk / Note<br>Graph / Fact</div>
              </div>
              <div class="p-node-foot">&nbsp;</div>
            </div>

            <div>
              <div class="p-node">
                <div class="p-node-head"><span>Memory Bank</span><span>Index</span></div>
                <div class="mini-store">
                  <div class="ms-row"><i class="ms-dot"></i>露营偏好与日程</div>
                  <div class="ms-row gold"><i class="ms-dot"></i>树坚果过敏史</div>
                  <div class="ms-row"><i class="ms-dot"></i>Python 环境配置</div>
                  <div class="ms-row"><i class="ms-dot"></i>书单与电影记录</div>
                </div>
              </div>
              <div class="p-node-foot">storage</div>
            </div>

            <div>
              <div class="p-stage ${hlRet ? 'hl-red' : ''}">
                ${hlRet ? '<div class="st-badge" style="color:#A64452;">● 核心瓶颈</div>' : ''}
                <div class="st-name">retriever</div>
                <div class="st-line"></div>
                <div class="st-sub">(Embedding)<br>(BM25)</div>
              </div>
              <div class="p-node-foot">&nbsp;</div>
            </div>

            <div>
              <div class="p-node">
                <div class="p-node-head"><span>Retrieved</span><span>Top-k</span></div>
                <div class="mini-ctx">
                  <div class="mctx-card">Chunk #1 · 烘焙烤箱预热</div>
                  <div class="mctx-card">Chunk #2 · 周末甜点计划</div>
                  <div class="mctx-card">Chunk #3 · 厨房工具清单</div>
                </div>
              </div>
              <div class="p-node-foot">context</div>
            </div>

            <div>
              <div class="p-stage ${hlLLM ? 'hl-yellow' : ''}">
                ${verified ? '<div class="st-badge">✓ 已排除</div>' : (hlLLM ? '<div class="st-badge" style="color:#9A7618;">? 待排查</div>' : '')}
                <div class="st-name">LLM</div>
                <div class="st-line"></div>
                <div class="st-sub">Reasoning</div>
              </div>
              <div class="p-node-foot">&nbsp;</div>
            </div>

            <div>
              <div class="p-node">
                <div class="p-node-head"><span>Assistant</span><span>Output</span></div>
                <div class="mini-ans">
                  <b>Answer</b>
                  <span>基于当前问题与召回片段生成最终回复</span>
                </div>
              </div>
              <div class="p-node-foot">answer</div>
            </div>
          </div>
        </div>
      `;
    });
  }

  function initLaser() {
    const dot = document.getElementById('laser-dot');
    if (!dot) return;
    const root = document.documentElement;

    const move = (e) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!dot.classList.contains('visible')) dot.classList.add('visible');
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('mouseenter', move, { passive: true });
    document.addEventListener('mouseleave', () => dot.classList.remove('visible'));
    window.addEventListener('blur', () => {
      dot.classList.remove('visible');
      root.classList.remove('laser-down');
    });
    window.addEventListener('pointerdown', () => root.classList.add('laser-down'), { passive: true });
    window.addEventListener('pointerup', () => root.classList.remove('laser-down'), { passive: true });
    window.addEventListener('pointercancel', () => root.classList.remove('laser-down'), { passive: true });
  }

  function initInteractions() {
    // 1. P3: Independent Horizontal Swipe / Drag Answer Track per Example (No Buttons)
    document.querySelectorAll('[data-ans-slider]').forEach((slider) => {
      const track = slider.querySelector('.ans-track');
      const dots = Array.from(slider.querySelectorAll('.ans-dots i'));
      if (!track) return;

      const syncDots = () => {
        const w = track.clientWidth || 1;
        const page = track.scrollLeft > w * 0.45 ? 1 : 0;
        dots.forEach((d, idx) => d.classList.toggle('on', idx === page));
      };

      track.addEventListener('scroll', syncDots, { passive: true });

      track.addEventListener(
        'wheel',
        (e) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.stopPropagation();
          }
        },
        { passive: true }
      );

      let dragging = false;
      let startX = 0;
      let startScroll = 0;

      track.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        dragging = true;
        startX = e.clientX;
        startScroll = track.scrollLeft;
        track.classList.add('dragging');
        track.setPointerCapture?.(e.pointerId);
      });

      track.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        track.scrollLeft = startScroll - dx;
      });

      const finishDrag = (e) => {
        if (!dragging) return;
        dragging = false;
        const dx = e.clientX - startX;
        track.classList.remove('dragging');
        const maxLeft = track.scrollWidth - track.clientWidth;
        let targetLeft;
        if (dx < -18) targetLeft = maxLeft;
        else if (dx > 18) targetLeft = 0;
        else targetLeft = track.scrollLeft > maxLeft * 0.5 ? maxLeft : 0;
        track.scrollTo({ left: targetLeft, behavior: 'smooth' });
      };

      track.addEventListener('pointerup', finishDrag);
      track.addEventListener('pointercancel', finishDrag);
    });

    // 2. P5: Paper Focus Tabs
    const paperTabs = Array.from(document.querySelectorAll('[data-paper-tab]'));
    const paperShots = Array.from(document.querySelectorAll('[data-paper-card]'));
    const paperNote = document.getElementById('p5-takeaway');
    const paperNotesMap = {
      all: '悬停或点击上方标签切换焦点 · 点击任一截图全屏放大',
      bm25: 'BM25 Wins at Scale（USTC & Metastone）：跨 28 个规模梯度，词面检索在大语料下持续反超复杂图与稠密方案',
      refind: 'ReFind（USTC & MetaStone）：不建摘要与图谱，直接搜索原始聊天记录，MAB 六任务均分第一（58.2）',
      rawrag: 'RAW-RAG：直接对原始对话做 RAG，在 4 大记忆基准的 6 / 7 项设置中击败复杂 Agentic Memory',
      memtax: 'Memory Tax：结构化记忆抽取往往造成信息损耗与高成本，净收益在多场景下为负'
    };
    paperTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.paperTab;
        paperTabs.forEach((t) => t.classList.toggle('active', t === tab));
        paperShots.forEach((s) => {
          if (key === 'all') {
            s.classList.remove('is-focused', 'is-dimmed');
          } else {
            const match = s.dataset.paperCard === key;
            s.classList.toggle('is-focused', match);
            s.classList.toggle('is-dimmed', !match);
          }
        });
        if (paperNote) paperNote.textContent = paperNotesMap[key] || paperNotesMap.all;
      });
    });

    // 3. P8: KDE 3-Bench vs +InMind Switch
    const p8Switch = document.getElementById('p8-switch');
    if (p8Switch) {
      const img = document.getElementById('p8-kde-img');
      const cap = document.getElementById('p8-kde-cap');
      const btns = Array.from(p8Switch.querySelectorAll('button'));
      p8Switch.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        const st = b ? b.dataset.st : (p8Switch.dataset.state === '0' ? '1' : '0');
        p8Switch.dataset.state = st;
        btns.forEach((btn) => btn.classList.toggle('active', btn.dataset.st === st));
        if (st === '0') {
          img.src = 'assets/bge_3bench_kde.png';
          cap.innerHTML = '<b>现有 3 个基准 Target 显著右移</b> &ensp;·&ensp; 仅靠表面余弦相似度即可分离目标记忆';
        } else {
          img.src = 'assets/bge_4bench_kde.png';
          cap.innerHTML = '<b>对比 InMind（右一，Δ = +0.001）</b> &ensp;·&ensp; 目标记忆与背景噪声完全重合，切断表面相似性捷径';
        }
      });
    }

    // 4. P10: Domain Specimen Switcher
    const domBtns = Array.from(document.querySelectorAll('[data-dom]'));
    const domOut = document.getElementById('p10-specimen');
    const domData = {
      med: '<b>医疗健康：</b>记忆「正在服用卡马西平」 · 提问「早餐喝西柚汁好吗？」 · 知识桥：西柚抑制 CYP3A4 致血药浓度升高',
      food: '<b>食品消费：</b>记忆「查出树坚果过敏」 · 提问「周末想做马卡龙，有食谱吗？」 · 知识桥：传统马卡龙以杏仁粉（树坚果）制作',
      child: '<b>育儿安全：</b>记忆「家里有个两岁宝宝」 · 提问「想买套巴克磁力球解压」 · 知识桥：幼儿误吞多颗高强磁珠可致肠穿孔',
      halal: '<b>宗教饮食：</b>记忆「严格遵循清真（Halal）饮食」 · 提问「新开的胶囊药直接吞服吗？」 · 知识桥：药用明胶胶囊常含猪源明胶',
      pet: '<b>居家生活：</b>记忆「家里养了一只猫」 · 提问「客厅茶几摆几支百合怎么养？」 · 知识桥：百合全株及花粉对猫可致急性肾衰'
    };
    domBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        domBtns.forEach((b) => b.classList.toggle('active', b === btn));
        if (domOut) domOut.innerHTML = domData[btn.dataset.dom] || '';
      });
    });

    // 5. Generic 2-Panel View Switches (P15, P20, P24)
    document.querySelectorAll('[data-view-switch]').forEach((sw) => {
      const targetId = sw.dataset.viewSwitch;
      const host = document.getElementById(targetId);
      const btns = Array.from(sw.querySelectorAll('button'));
      sw.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        const st = b ? b.dataset.st : (sw.dataset.state === '0' ? '1' : '0');
        sw.dataset.state = st;
        btns.forEach((btn) => btn.classList.toggle('active', btn.dataset.st === st));
        if (host) {
          Array.from(host.children).forEach((pane, idx) => {
            pane.style.display = String(idx) === st ? '' : 'none';
          });
        }
      });
    });

    // 6. P19: Paradigm Card Trace Selector
    const paraCards = Array.from(document.querySelectorAll('[data-para]'));
    const paraTrace = document.getElementById('p19-trace');
    const paraMap = {
      a: '<b>A. Naïve RAG 轨迹：</b>Query「养猫准备建议」 → 向量召回宠物开销、猫砂盆 →「家里有百合」排在百名之外（Indirect 9.6%）',
      b: '<b>B. Graph RAG 轨迹：</b>对话图谱仅有「用户—拥有—百合」，缺少外部常识边「百合—剧毒—猫」，游走无法连通（Indirect 8.8%）',
      c: '<b>C. Agentic RAG 轨迹：</b>LLM 拆解子查询搜「宠物经验 / 居住空间 / 过敏」，未在见到记忆前凭空猜出搜「植物」（Indirect 4.8%）',
      d: '<b>D. Memory System 轨迹：</b>高频近期话题进入常驻画像；仅提过一次的低频高危记录留存检索层，再次落入相似度盲区（Indirect 8.0%）'
    };
    paraCards.forEach((c) => {
      c.addEventListener('click', () => {
        paraCards.forEach((x) => x.classList.toggle('active', x === c));
        if (paraTrace) paraTrace.innerHTML = paraMap[c.dataset.para] || '';
      });
    });
  }

  function init() {
    initLaser();
    renderPipelines();
    initInteractions();

    const deck = document.getElementById('deck');
    const slides = Array.from(deck.querySelectorAll('.slide'));
    const bar = document.getElementById('bar');
    const rail = document.getElementById('rail');
    const curEl = document.getElementById('cur');
    const totEl = document.getElementById('tot');
    const secEl = document.getElementById('secname');
    const prevB = document.getElementById('prev');
    const nextB = document.getElementById('next');
    const rqBtns = Array.from(document.querySelectorAll('.rqnav button'));
    const sorter = document.getElementById('sorter');
    const sorterGrid = document.getElementById('sorter-grid');
    const lb = document.getElementById('lb');
    const lbImg = lb.querySelector('img');
    const modal = document.getElementById('notes-modal');

    let idx = 0;
    totEl.textContent = slides.length;

    slides.forEach((s, i) => {
      const dot = document.createElement('i');
      dot.title = `${i + 1}. ${s.dataset.title || ''}`;
      if (s.classList.contains('divider')) dot.dataset.d = '1';
      dot.addEventListener('click', () => go(i));
      rail.appendChild(dot);

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'sorter-card';
      card.innerHTML = `<b>SLIDE ${String(i + 1).padStart(2, '0')}</b><span>${s.dataset.title || ''}</span>`;
      card.addEventListener('click', () => {
        sorter.classList.remove('open');
        go(i);
      });
      sorterGrid.appendChild(card);
    });

    const dots = Array.from(rail.children);
    const cards = Array.from(sorterGrid.children);

    function paint() {
      curEl.textContent = idx + 1;
      secEl.textContent = slides[idx].dataset.title || '';
      bar.style.width = `${(idx / Math.max(1, slides.length - 1)) * 100}%`;
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));
      cards.forEach((c, i) => c.classList.toggle('on', i === idx));
      prevB.disabled = idx === 0;
      nextB.disabled = idx === slides.length - 1;
      const chap = slides[idx].dataset.chap || 'intro';
      rqBtns.forEach((b) => b.classList.toggle('on', b.dataset.go === chap));
      history.replaceState(null, '', `#${idx + 1}`);
    }

    function go(i, instant) {
      idx = Math.max(0, Math.min(slides.length - 1, i));
      if (instant) {
        deck.style.scrollBehavior = 'auto';
        deck.scrollTop = slides[idx].offsetTop;
        deck.style.scrollBehavior = '';
      } else {
        slides[idx].scrollIntoView({ behavior: 'smooth' });
      }
      paint();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            idx = slides.indexOf(e.target);
            paint();
          }
        });
      },
      { root: deck, threshold: 0.55 }
    );
    slides.forEach((s) => io.observe(s));

    prevB.addEventListener('click', () => go(idx - 1));
    nextB.addEventListener('click', () => go(idx + 1));

    rqBtns.forEach((b) => {
      b.addEventListener('click', () => {
        const target = slides.findIndex((s) => s.dataset.chap === b.dataset.go);
        if (target >= 0) go(target);
      });
    });

    document.getElementById('btn-grid').addEventListener('click', () => {
      sorter.classList.toggle('open');
    });
    document.getElementById('sorter-close').addEventListener('click', () => {
      sorter.classList.remove('open');
    });

    function toggleNotes() {
      if (modal.open) {
        modal.close();
      } else {
        const note = slides[idx].querySelector('.speaker-note');
        document.getElementById('nm-title').textContent = `P${idx + 1} · ${slides[idx].dataset.title || ''}`;
        document.getElementById('nm-body').innerHTML = note ? note.innerHTML : '按页面关键词与交互开关自然展开即可。';
        modal.showModal();
      }
    }

    document.getElementById('btn-notes').addEventListener('click', toggleNotes);
    document.getElementById('nm-close').addEventListener('click', () => modal.close());

    document.querySelectorAll('.zoomable, .paper-shot').forEach((el) => {
      el.addEventListener('click', () => {
        const img = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (!img) return;
        lbImg.src = img.currentSrc || img.src;
        lb.classList.add('open');
      });
    });
    lb.addEventListener('click', () => lb.classList.remove('open'));

    const m = location.hash.match(/(\d+)/);
    if (m) {
      const start = Math.max(0, Math.min(slides.length - 1, parseInt(m[1], 10) - 1));
      go(start, true);
    } else {
      paint();
    }

    window.addEventListener('keydown', (e) => {
      if (lb.classList.contains('open')) {
        if (e.key === 'Escape') lb.classList.remove('open');
        return;
      }
      if (sorter.classList.contains('open')) {
        if (e.key === 'Escape' || e.key === 'g' || e.key === 'G') sorter.classList.remove('open');
        return;
      }
      if (modal.open) return;

      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        go(idx + 1);
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        go(idx - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        go(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        go(slides.length - 1);
      } else if (e.key === 'g' || e.key === 'G') {
        sorter.classList.toggle('open');
      } else if (e.key === 'n' || e.key === 'N') {
        toggleNotes();
      } else if (e.key === 'l' || e.key === 'L') {
        document.documentElement.classList.toggle('laser-mode');
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
