(() => {
  const root = document.getElementById('nimble-vocab-viz');
  if (!root) return;

  const mask = root.querySelector('.nviz-mask');
  const hidden = root.querySelector('.nviz-hidden-rows');
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const cell = document.createElement('span');
      if (col <= row) cell.classList.add('visible');
      if (row === 5 && col <= row) cell.classList.add('last');
      mask.appendChild(cell);
    }
    const item = document.createElement('div');
    item.className = 'nviz-hidden-row';
    if (row === 5) item.classList.add('last');
    const label = document.createElement('span');
    label.className = 'nviz-row-label';
    label.textContent = row === 5 ? 'h_last' : `h${row}`;
    const features = document.createElement('span');
    features.className = 'nviz-features';
    for (let i = 0; i < 16; i++) features.appendChild(document.createElement('span'));
    item.append(label, features);
    hidden.appendChild(item);
  }
  for (let i = 0; i < 10; i++) root.querySelector('.nviz-vector').appendChild(document.createElement('span'));
  for (let i = 0; i < 60; i++) root.querySelector('.nviz-matrix').appendChild(document.createElement('span'));

  const choices = {A: 'billing', B: 'technical', C: 'other'};
  const buttons = [...root.querySelectorAll('[data-choice]')];
  function select(code) {
    buttons.forEach(button => button.setAttribute('aria-pressed', button.dataset.choice === code ? 'true' : 'false'));
    root.querySelectorAll('.nviz-logits [data-code]').forEach(item => item.classList.toggle('is-selected', item.dataset.code === code));
    root.querySelector('.nviz-selected').textContent = `追踪 ${code}：l_${code} → ${choices[code]}`;
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.choice)));
  select('B');
})();
