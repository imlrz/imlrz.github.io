(() => {
  const root = document.getElementById('kev-pointer-viz');
  if (!root) return;

  const names = ['<state>', 'S', '<q>', 'I', '<opt>', 'A', '</opt>₁', '<opt>', 'B', '</opt>₂', '<decide>'];
  const layers = root.querySelector('.kviz-layers');
  for (let i = 0; i < 32; i++) {
    const layer = document.createElement('span');
    if (i % 4 === 3) layer.className = 'attn';
    layers.appendChild(layer);
  }

  root.querySelectorAll('.kviz-matrix').forEach(matrix => {
    for (let i = 0; i < 48; i++) matrix.appendChild(document.createElement('span'));
  });
  root.querySelectorAll('.kviz-vector-cells').forEach(vector => {
    for (let i = 0; i < 10; i++) vector.appendChild(document.createElement('span'));
  });

  const mask = root.querySelector('.kviz-mask');
  const hidden = root.querySelector('.kviz-hidden-rows');
  const cells = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = 0; j < names.length; j++) {
      const cell = document.createElement('span');
      if (j <= i) cell.classList.add('visible');
      mask.appendChild(cell);
      cells.push(cell);
    }
    const row = document.createElement('div');
    row.className = 'kviz-hidden-row';
    const label = document.createElement('span');
    label.className = 'kviz-hidden-row-label';
    label.textContent = `h${i}`;
    const features = document.createElement('span');
    features.className = 'features';
    for (let k = 0; k < 20; k++) features.appendChild(document.createElement('span'));
    row.append(label, features);
    hidden.appendChild(row);
  }

  const rows = [...hidden.children];
  const controls = [...root.querySelectorAll('[data-select]')];
  const tokens = [...root.querySelectorAll('[data-token]')];
  const vectorPaths = [
    ['.kviz-h10', 10], ['.kviz-q', 10],
    ['.kviz-h6', 6], ['.kviz-k1', 6],
    ['.kviz-h9', 9], ['.kviz-k2', 9],
  ].map(([selector, position]) => [root.querySelector(selector), position]);

  function select(position) {
    controls.forEach(button => button.setAttribute('aria-pressed', Number(button.dataset.select) === position ? 'true' : 'false'));
    tokens.forEach((token, i) => {
      token.classList.toggle('is-readout', [6, 9, 10].includes(i));
      token.classList.toggle('is-selected', i === position);
    });
    cells.forEach((cell, index) => {
      const row = Math.floor(index / names.length);
      const column = index % names.length;
      cell.classList.toggle('selected', row === position && column <= position);
    });
    rows.forEach((row, i) => {
      row.classList.toggle('readout', [6, 9, 10].includes(i));
      row.classList.toggle('selected', i === position);
    });
    root.querySelector('.kviz-query').classList.toggle('is-active', position === 10);
    root.querySelector('.kviz-key').classList.toggle('is-active', position !== 10);
    vectorPaths.forEach(([element, at]) => element.classList.toggle('is-active', at === position));
    root.querySelector('.kviz-current').textContent = `位置 ${position} · ${names[position]} · 可读到 0–${position} · 最后一层 h${position}`;
    mask.setAttribute('aria-label', `因果可见性矩阵；当前高亮位置 ${position}，可读取位置 0 到 ${position}`);
  }

  controls.forEach(button => button.addEventListener('click', () => select(Number(button.dataset.select))));
  select(10);
})();
