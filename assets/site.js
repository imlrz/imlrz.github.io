const initializeSite = (() => {
  const root = document.documentElement;
  const themeAssets = new URL('themes/', document.currentScript.src);
  const skyScript = new URL('../starry-night.js', document.currentScript.src);
  const themes = {
    editorial: { name: 'Europa', photo: 'europa', color: '#f4efe6' },
    terminal: { name: 'Uranus', photo: 'uranus', color: '#0a0d0b' },
    academic: { name: 'Neptune', photo: 'neptune', color: '#fbfbfc' },
    starry: { name: 'Earth', photo: 'earth', color: '#0a1628' },
    lemmon: { name: 'Lemmon', photo: 'lemmon', color: '#f7faf8' },
  };

  function readPreference(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function savePreference(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  }

  function applyTheme(id) {
    root.dataset.theme = Object.hasOwn(themes, id) ? id : 'editorial';
    const theme = themes[root.dataset.theme];
    document.getElementById('meta-theme').content = theme.color;
    return theme;
  }

  function applyLanguage(value) {
    const language = value === 'zh' ? 'zh' : 'en';
    root.dataset.lang = language;
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    return language;
  }

  // Apply stored preferences before CSS and the first paint.
  applyTheme(readPreference('rl-theme'));
  applyLanguage(readPreference('rl-lang'));

  const controls = `
<!-- starry background (lazy) -->
<canvas id="starry-canvas" aria-hidden="true"></canvas>
<svg id="starry-sil" aria-hidden="true" viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0,220 L0,155 Q120,125 240,145 Q360,165 480,135 Q560,115 680,130 Q800,145 920,115 Q1020,90 1120,125 Q1260,160 1380,140 L1440,148 L1440,220Z"/>
  <path d="M0,220 L0,178 L80,178 L80,155 L86,140 L92,155 L92,178 L200,180 L200,165 L212,165 L212,180 L340,182 L340,128 L344,108 L348,128 L348,182 L480,184 L480,168 L496,168 L496,184 L640,186 L720,183 L720,160 L728,150 L736,160 L736,183 L880,186 L920,184 L920,170 L936,170 L936,184 L1080,186 L1080,172 L1088,162 L1096,172 L1096,186 L1260,188 L1360,186 L1440,188 L1440,220Z"/>
</svg>

<!-- ── controls ── -->
<div class="controls">
  <div class="theme-wrap">
    <button class="ctrl" id="theme-btn" type="button" aria-label="Choose a theme" aria-haspopup="dialog" aria-controls="theme-dialog" aria-expanded="false">
      <img class="ctrl-photo" id="theme-photo" src="${themeAssets}europa.webp" alt="" width="24" height="24">
      <span id="theme-name">Europa</span>
      <svg class="ctrl-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>
    </button>
  </div>
  <button class="ctrl" id="lang-btn" type="button" aria-label="Switch language"><span id="lang-label">中</span></button>
</div>

<dialog class="theme-dialog" id="theme-dialog" aria-labelledby="theme-dialog-title" aria-describedby="theme-dialog-description">
  <div class="theme-dialog-header">
    <div>
      <p class="theme-dialog-eyebrow" data-i18n="themeEyebrow">A change of atmosphere</p>
      <h2 id="theme-dialog-title" data-i18n="themeTitle">Choose your world.</h2>
      <p class="theme-dialog-subtitle" id="theme-dialog-description" data-i18n="themeDescription">Five celestial palettes, each with its own typography and rhythm.</p>
    </div>
    <button class="theme-close" id="theme-close" type="button" aria-label="Close theme picker">
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15"/></svg>
    </button>
  </div>
  <div class="theme-grid" role="group" aria-label="Themes" id="theme-options">
    <button class="theme-opt" type="button" data-set="editorial" aria-pressed="true" aria-labelledby="theme-europa-name" aria-describedby="theme-europa-description">
      <span class="theme-photo"><img src="${themeAssets}europa.webp" alt="Europa photographed by Galileo, with pale ice and reddish-brown markings; enhanced color" width="480" height="480" decoding="async"></span>
      <span class="theme-check" aria-hidden="true">✓</span>
      <span class="theme-card-body">
        <span class="theme-card-name" id="theme-europa-name">Europa</span>
        <span class="theme-card-subtitle" id="theme-europa-description" data-i18n="thEd">Ivory &amp; terracotta<br>Editorial serif</span>
        <span class="theme-palette" aria-hidden="true"><i></i><i></i><i></i></span>
      </span>
    </button>
    <button class="theme-opt" type="button" data-set="terminal" aria-pressed="false" aria-labelledby="theme-uranus-name" aria-describedby="theme-uranus-description">
      <span class="theme-photo"><img src="${themeAssets}uranus.webp" alt="Pale blue-green Uranus photographed by Voyager 2" width="480" height="480" decoding="async"></span>
      <span class="theme-check" aria-hidden="true">✓</span>
      <span class="theme-card-body">
        <span class="theme-card-name" id="theme-uranus-name">Uranus</span>
        <span class="theme-card-subtitle" id="theme-uranus-description" data-i18n="thTe">Phosphor on black<br>Monospace terminal</span>
        <span class="theme-palette" aria-hidden="true"><i></i><i></i><i></i></span>
      </span>
    </button>
    <button class="theme-opt" type="button" data-set="academic" aria-pressed="false" aria-labelledby="theme-neptune-name" aria-describedby="theme-neptune-description">
      <span class="theme-photo"><img src="${themeAssets}neptune.webp" alt="Neptune photographed by Voyager 2; blue color enhanced to reveal atmospheric features" width="480" height="480" decoding="async"></span>
      <span class="theme-check" aria-hidden="true">✓</span>
      <span class="theme-card-body">
        <span class="theme-card-name" id="theme-neptune-name">Neptune</span>
        <span class="theme-card-subtitle" id="theme-neptune-description" data-i18n="thAc">Cobalt &amp; white<br>Modern academic</span>
        <span class="theme-palette" aria-hidden="true"><i></i><i></i><i></i></span>
      </span>
    </button>
    <button class="theme-opt" type="button" data-set="starry" aria-pressed="false" aria-labelledby="theme-earth-name" aria-describedby="theme-earth-description">
      <span class="theme-photo"><img src="${themeAssets}earth.webp" alt="The Blue Marble photograph of Earth taken by the Apollo 17 crew" width="480" height="480" decoding="async"></span>
      <span class="theme-check" aria-hidden="true">✓</span>
      <span class="theme-card-body">
        <span class="theme-card-name" id="theme-earth-name">Earth</span>
        <span class="theme-card-subtitle" id="theme-earth-description" data-i18n="thSt">Midnight &amp; gold<br>A sky in motion</span>
        <span class="theme-palette" aria-hidden="true"><i></i><i></i><i></i></span>
      </span>
    </button>
    <button class="theme-opt" type="button" data-set="lemmon" aria-pressed="false" aria-labelledby="theme-lemmon-name" aria-describedby="theme-lemmon-description">
      <span class="theme-photo"><img src="${themeAssets}lemmon.webp" alt="Comet C/2025 A6 (Lemmon), photographed by Chuck Ayoub with a green coma and a long tail" width="480" height="480" decoding="async"></span>
      <span class="theme-check" aria-hidden="true">✓</span>
      <span class="theme-card-body">
        <span class="theme-card-name" id="theme-lemmon-name">Lemmon</span>
        <span class="theme-card-subtitle" id="theme-lemmon-description" data-i18n="thLe">Forest teal &amp; mint<br>The Jetriever palette</span>
        <span class="theme-palette" aria-hidden="true"><i></i><i></i><i></i></span>
      </span>
    </button>
  </div>
  <div class="theme-dialog-footer">
    <p class="theme-status"><span data-i18n="themeCurrent">Current world:</span> <output id="theme-current" aria-live="polite">Europa</output></p>
    <p class="theme-credits"><a href="${themeAssets}credits.html" target="_blank" rel="noopener" data-i18n="themeCredits">Photographs &amp; credits</a><span aria-hidden="true"> · </span><span data-i18n="themePhotoNote">Europa &amp; Neptune: enhanced color</span></p>
  </div>
</dialog>
  `;
  const sharedTranslations = {
    navHome: '主页', navTalks: '讲座', navMeetings: '组会',
    themeEyebrow:'换一种氛围', themeTitle:'选择你的星球。',
    themeDescription:'五种天体配色，各有自己的字体与阅读节奏。',
    themeCurrent:'当前主题：', themeCredits:'照片来源与署名',
    themePhotoNote:'木卫二与海王星：增强色影像',
    thEd:'木卫二 · 米白与红陶<br>衬线书页',
    thTe:'天王星 · 深底荧光绿<br>等宽终端',
    thAc:'海王星 · 钴蓝与白<br>现代学术',
    thSt:'地球 · 午夜蓝与金<br>流动星空',
    thLe:'莱蒙彗星 · 深青绿与薄荷<br>Jetriever 论文配色',
  };

  return function initializeSite(pageTranslations) {
    document.body.insertAdjacentHTML('afterbegin', controls);

    const themeButton = document.getElementById('theme-btn');
    const themeDialog = document.getElementById('theme-dialog');
    const themeOptions = [...themeDialog.querySelectorAll('.theme-opt')];
    const themeClose = document.getElementById('theme-close');
    const languageButton = document.getElementById('lang-btn');
    const translations = { ...sharedTranslations, ...pageTranslations };
    const defaultText = [...document.querySelectorAll('[data-i18n]')].map(element => [element, element.innerHTML]);
    let skyLoaded = false;

    function showTheme(id) {
      const theme = applyTheme(id);
      document.getElementById('theme-name').textContent = theme.name;
      document.getElementById('theme-current').textContent = theme.name;
      document.getElementById('theme-photo').src = new URL(`${theme.photo}.webp`, themeAssets);
      themeOptions.forEach(option => option.setAttribute('aria-pressed', option.dataset.set === root.dataset.theme));

      if (root.dataset.theme === 'starry' && !skyLoaded) {
        const script = document.createElement('script');
        script.src = skyScript;
        document.body.append(script);
        skyLoaded = true;
      }
    }

    function showLanguage(value) {
      const chinese = applyLanguage(value) === 'zh';
      for (const [element, english] of defaultText) {
        element.innerHTML = chinese ? (translations[element.dataset.i18n] ?? english) : english;
      }
      document.getElementById('lang-label').textContent = chinese ? 'EN' : '中';
      themeButton.setAttribute('aria-label', chinese ? '选择主题' : 'Choose a theme');
      themeClose.setAttribute('aria-label', chinese ? '关闭主题选择' : 'Close theme picker');
      document.getElementById('theme-options').setAttribute('aria-label', chinese ? '主题' : 'Themes');
      languageButton.setAttribute('aria-label', chinese ? 'Switch to English' : '切换到中文');
    }

    languageButton.addEventListener('click', () => {
      showLanguage(root.dataset.lang === 'en' ? 'zh' : 'en');
      savePreference('rl-lang', root.dataset.lang);
    });

    themeButton.addEventListener('click', () => {
      themeDialog.showModal();
      themeButton.setAttribute('aria-expanded', 'true');
      document.body.classList.add('theme-dialog-open');
      themeOptions.find(option => option.dataset.set === root.dataset.theme).focus({ preventScroll: true });
    });

    themeOptions.forEach((option, index) => {
      option.addEventListener('click', () => {
        showTheme(option.dataset.set);
        savePreference('rl-theme', root.dataset.theme);
        themeDialog.close();
      });
      option.addEventListener('keydown', event => {
        let next;
        const last = themeOptions.length - 1;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = last;
        if (next !== undefined) {
          event.preventDefault();
          themeOptions[next].focus();
        }
      });
    });

    themeClose.addEventListener('click', () => themeDialog.close());
    themeDialog.addEventListener('close', () => {
      themeButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('theme-dialog-open');
      themeButton.focus({ preventScroll: true });
    });

    // Close only when both ends of the click are on the backdrop.
    let backdropPointer = false;
    function isOutsideDialog(event) {
      const rect = themeDialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    }
    themeDialog.addEventListener('pointerdown', event => {
      backdropPointer = event.target === themeDialog && isOutsideDialog(event);
    });
    themeDialog.addEventListener('click', event => {
      if (backdropPointer && event.target === themeDialog && isOutsideDialog(event)) themeDialog.close();
      backdropPointer = false;
    });

    showTheme(root.dataset.theme);
    showLanguage(root.dataset.lang);

    window.addEventListener('storage', event => {
      if (event.key === 'rl-theme' || event.key === null) showTheme(readPreference('rl-theme'));
      if (event.key === 'rl-lang' || event.key === null) showLanguage(readPreference('rl-lang'));
    });
    window.addEventListener('pageshow', event => {
      if (!event.persisted) return;
      const theme = readPreference('rl-theme');
      const language = readPreference('rl-lang');
      if (theme && theme !== root.dataset.theme) showTheme(theme);
      if (language && language !== root.dataset.lang) showLanguage(language);
    });
  };
})();
