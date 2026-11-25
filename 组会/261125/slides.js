(function () {
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
    window.addEventListener('pointerdown', () => root.classList.add('laser-down'), { passive: true });
    window.addEventListener('pointerup', () => root.classList.remove('laser-down'), { passive: true });
  }

  function initSyncVideos() {
    document.querySelectorAll('[data-sync-group]').forEach((wrap) => {
      const btn = wrap.querySelector('[data-sync-play]');
      const vids = Array.from(wrap.querySelectorAll('video'));
      if (!btn || !vids.length) return;
      btn.addEventListener('click', () => {
        vids.forEach((v) => {
          v.currentTime = 0;
          v.play().catch(() => {});
        });
      });
    });
  }

  function initStepGalleries() {
    document.querySelectorAll('[data-step-gallery]').forEach((gal) => {
      const img = gal.querySelector('[data-gal-img]');
      const cap = gal.querySelector('[data-gal-cap]');
      const btns = Array.from(gal.querySelectorAll('[data-gal-src]'));
      if (!img || !btns.length) return;
      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          btns.forEach((b) => b.classList.toggle('on', b === btn));
          img.src = btn.dataset.galSrc;
          if (cap && btn.dataset.galCap) cap.textContent = btn.dataset.galCap;
        });
      });
    });
  }

  function init() {
    initLaser();
    initSyncVideos();
    initStepGalleries();

    const deck = document.getElementById('deck');
    const slides = Array.from(deck.querySelectorAll('.slide'));
    const rail = document.getElementById('rail');
    const curEl = document.getElementById('cur');
    const totEl = document.getElementById('tot');
    const secEl = document.getElementById('secname');
    const prevB = document.getElementById('prev');
    const nextB = document.getElementById('next');
    const bar = document.getElementById('bar');
    const rqBtns = Array.from(document.querySelectorAll('.rqnav button'));
    const sorter = document.getElementById('sorter');
    const sorterGrid = document.getElementById('sorter-grid');
    const modal = document.getElementById('notes-modal');
    const lb = document.getElementById('lb');
    const lbImg = lb.querySelector('img');

    // Takeaway Dock Elements
    const tkDock = document.getElementById('tk-dock');
    const tkToggle = document.getElementById('tk-toggle');
    const tkClose = document.getElementById('tk-close');
    const tkDrawer = document.getElementById('tk-drawer');
    const tkCnt = document.getElementById('tk-cnt');
    const tkDrawerSub = document.getElementById('tk-drawer-sub');
    const tkDots = Array.from(document.querySelectorAll('#tk-dots i'));
    const tkEmpty = document.getElementById('tk-empty');
    const tkItems = Array.from(document.querySelectorAll('#tk-list .tk-item'));
    const tkToast = document.getElementById('tk-toast');
    const tkFlyer = document.getElementById('tk-flyer');
    const finalSlide = slides[slides.length - 1];

    const TK_LABELS = {
      5: 'P05 · 三功能器闭环',
      7: 'P07 · 四种传统派别',
      21: 'P21 · 四关评测维度',
      31: 'P31 · Agentic 范式图',
    };

    let idx = 0;
    let lastPaintedIdx = -1;
    let pulseTimer = null;
    let toastTimer = null;
    let flyerTimer = null;
    totEl.textContent = slides.length;

    function clearTkTransient() {
      clearTimeout(pulseTimer);
      clearTimeout(toastTimer);
      clearTimeout(flyerTimer);
      if (tkToast) tkToast.classList.remove('is-visible');
      if (tkFlyer) {
        tkFlyer.classList.remove('is-flying');
        tkFlyer.innerHTML = '';
      }
    }

    function setTkOpen(open) {
      if (!tkDock) return;
      tkDock.classList.toggle('is-open', open);
      if (tkToggle) tkToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (tkDrawer) tkDrawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    function showTkToast(text) {
      if (!tkToast) return;
      clearTimeout(toastTimer);
      tkToast.textContent = text;
      tkToast.classList.add('is-visible');
      toastTimer = setTimeout(() => {
        tkToast.classList.remove('is-visible');
      }, 1800);
    }

    function triggerFlyCapture(itemEl, minIdx) {
      if (!tkFlyer || !itemEl) return;
      clearTkTransient();
      const cloneHtml = itemEl.innerHTML
        .replace(/tk-pine/g, 'fly-pine')
        .replace(/tk-brass/g, 'fly-brass');
      tkFlyer.innerHTML = cloneHtml;
      tkFlyer.classList.remove('is-flying');
      void tkFlyer.offsetWidth;
      tkFlyer.classList.add('is-flying');

      pulseTimer = setTimeout(() => {
        if (tkToggle) {
          tkToggle.classList.remove('is-pulsing');
          void tkToggle.offsetWidth;
          tkToggle.classList.add('is-pulsing');
        }
        itemEl.classList.remove('just-added');
        void itemEl.offsetWidth;
        itemEl.classList.add('just-added');
        const listEl = document.getElementById('tk-list');
        if (listEl && tkDock.classList.contains('is-open')) {
          listEl.scrollTo({ top: listEl.scrollHeight, behavior: 'smooth' });
        }
        showTkToast(`+ 已记入 Takeaway · ${TK_LABELS[minIdx] || ''}`);
      }, 520);

      flyerTimer = setTimeout(() => {
        tkFlyer.classList.remove('is-flying');
        tkFlyer.innerHTML = '';
      }, 860);
    }

    function triggerFinalUnfold() {
      if (!finalSlide || !finalSlide.classList.contains('takeaway-stage')) return;
      finalSlide.classList.remove('is-unfolding');
      void finalSlide.offsetWidth;
      finalSlide.classList.add('is-unfolding');
    }

    function syncTakeaway(prevIdx, curIdx) {
      if (!tkDock) return;
      if (prevIdx !== curIdx) {
        clearTkTransient();
      }
      const isCover = curIdx === 0;
      const isFinale = curIdx === slides.length - 1;

      tkDock.classList.toggle('is-hidden', isCover);
      tkDock.classList.toggle('is-released', isFinale);
      if (isCover || isFinale) {
        setTkOpen(false);
      }

      let count = 0;
      let newlyUnlockedItem = null;
      let newlyUnlockedMin = null;

      tkItems.forEach((item, i) => {
        const minIdx = parseInt(item.dataset.tkMin, 10);
        const unlocked = curIdx >= minIdx;
        item.classList.toggle('is-unlocked', unlocked);
        if (tkDots[i]) tkDots[i].classList.toggle('on', unlocked);
        if (unlocked) count++;
        if (
          prevIdx >= 0 &&
          prevIdx < minIdx &&
          curIdx >= minIdx &&
          curIdx - prevIdx <= 2 &&
          !isFinale
        ) {
          newlyUnlockedItem = item;
          newlyUnlockedMin = minIdx;
        }
      });

      if (tkCnt) tkCnt.textContent = `${count}/4`;
      if (tkDrawerSub) tkDrawerSub.textContent = `已收录 ${count} / 4 项`;
      if (tkEmpty) tkEmpty.classList.toggle('is-gone', count > 0);

      if (newlyUnlockedItem) {
        triggerFlyCapture(newlyUnlockedItem, newlyUnlockedMin);
      }
      if (isFinale && prevIdx !== curIdx) {
        triggerFinalUnfold();
      }
    }

    if (tkToggle) {
      tkToggle.addEventListener('click', () => setTkOpen(!tkDock.classList.contains('is-open')));
    }
    if (tkClose) {
      tkClose.addEventListener('click', () => setTkOpen(false));
    }

    document.querySelectorAll('[data-jump]').forEach((el) => {
      el.addEventListener('click', () => {
        const target = parseInt(el.dataset.jump, 10);
        if (!Number.isNaN(target)) go(target);
      });
    });

    slides.forEach((s, i) => {
      const chap = s.dataset.chap || 'cover';
      const isDisc = chap === 'd1' || chap === 'd2';
      const dot = document.createElement('i');
      dot.title = `P${i + 1} · ${s.dataset.title || ''}`;
      if (s.classList.contains('divider')) dot.dataset.d = '1';
      if (isDisc) dot.classList.add('disc');
      dot.addEventListener('click', () => go(i));
      rail.appendChild(dot);

      const card = document.createElement('button');
      card.type = 'button';
      card.className = `sorter-card${isDisc ? ' disc' : ''}`;
      card.innerHTML = `<b>P${String(i + 1).padStart(2, '0')} · ${chap.toUpperCase()}</b><span>${s.dataset.title || ''}</span>`;
      card.addEventListener('click', () => {
        sorter.classList.remove('open');
        go(i);
      });
      sorterGrid.appendChild(card);
    });

    const dots = Array.from(rail.children);
    const cards = Array.from(sorterGrid.children);

    function paint() {
      if (idx === lastPaintedIdx) return;
      const prevIdx = lastPaintedIdx;
      lastPaintedIdx = idx;

      curEl.textContent = idx + 1;
      secEl.textContent = slides[idx].dataset.title || '';
      bar.style.width = `${(idx / Math.max(1, slides.length - 1)) * 100}%`;
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));
      cards.forEach((c, i) => c.classList.toggle('on', i === idx));
      prevB.disabled = idx === 0;
      nextB.disabled = idx === slides.length - 1;
      const chap = slides[idx].dataset.chap || 'cover';
      rqBtns.forEach((b) => b.classList.toggle('on', b.dataset.go === chap));
      history.replaceState(null, '', `#${idx + 1}`);

      syncTakeaway(prevIdx, idx);
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

    document.getElementById('btn-grid').addEventListener('click', () => sorter.classList.toggle('open'));
    document.getElementById('sorter-close').addEventListener('click', () => sorter.classList.remove('open'));

    function toggleNotes() {
      if (modal.open) {
        modal.close();
      } else {
        const note = slides[idx].querySelector('.speaker-note');
        document.getElementById('nm-title').textContent = `P${idx + 1} · ${slides[idx].dataset.title || ''}`;
        document.getElementById('nm-body').innerHTML = note
          ? note.innerHTML
          : '<p>结合页面图解与核心关键词自然展开即可。</p>';
        modal.showModal();
      }
    }

    document.getElementById('btn-notes').addEventListener('click', toggleNotes);
    document.getElementById('nm-close').addEventListener('click', () => modal.close());

    document.querySelectorAll('.zoomable').forEach((el) => {
      el.addEventListener('click', () => {
        const img = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (!img) return;
        lbImg.src = img.currentSrc || img.src;
        lb.classList.add('open');
        lb.classList.remove('zoom');
      });
    });

    lb.addEventListener('click', (e) => {
      if (e.target === lbImg) lb.classList.toggle('zoom');
      else lb.classList.remove('open', 'zoom');
    });

    const m = location.hash.match(/(\d+)/);
    if (m) {
      const start = Math.max(0, Math.min(slides.length - 1, parseInt(m[1], 10) - 1));
      go(start, true);
    } else {
      paint();
    }

    window.addEventListener('keydown', (e) => {
      if (lb.classList.contains('open')) {
        if (e.key === 'Escape') lb.classList.remove('open', 'zoom');
        return;
      }
      if (sorter.classList.contains('open')) {
        if (e.key === 'Escape' || e.key === 'g' || e.key === 'G') sorter.classList.remove('open');
        return;
      }
      if (modal.open) return;

      if (e.key === 'Escape' && tkDock && tkDock.classList.contains('is-open')) {
        setTkOpen(false);
        return;
      }

      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        if (e.target && ['VIDEO', 'BUTTON', 'A'].includes(e.target.tagName) && e.key === ' ') return;
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
      } else if (e.key === 't' || e.key === 'T') {
        if (idx > 0 && idx < slides.length - 1 && tkDock) {
          setTkOpen(!tkDock.classList.contains('is-open'));
        }
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
