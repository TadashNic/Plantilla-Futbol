// script.js
// Handles rendering player circles for formations and the substitutions panel.
// Formations available: 4-3-3, 4-4-2, 5-3-2

const formations = {
  "4-3-3": { defs: 4, mids: 3, fwds: 3 },
  "4-4-2": { defs: 4, mids: 4, fwds: 2 },
  "5-3-2": { defs: 5, mids: 3, fwds: 2 }
};

// Color map
const colors = {
  portero: '#e74c3c', // rojo
  defensa: '#f1c40f', // amarillo
  medio: '#9b59b6',   // morado
  delantera: '#3498db'// azul
};

// Utility to create a player DOM node
function createPlayer(role, idx) {
  const wrapper = document.createElement('div');
  wrapper.className = 'player';
  wrapper.dataset.role = role;

  const circle = document.createElement('div');
  circle.className = `circle ${role}`;
  // number in middle (editable)
  const number = document.createElement('div');
  number.className = 'number';
  number.contentEditable = 'true';
  number.innerText = '#';
  circle.appendChild(number);

  const name = document.createElement('input');
  name.type = 'text';
  name.className = 'player-name';
  name.placeholder = 'Nombre';

  wrapper.appendChild(circle);
  wrapper.appendChild(name);

  return wrapper;
}

function clearPitch() {
  const overlay = document.getElementById('players');
  overlay.innerHTML = '';
}

function renderFormation(key) {
  const overlay = document.getElementById('players');
  const img = document.getElementById('pitchImg');
  const imgWrap = document.querySelector('.img-wrap');
  clearPitch();
  const f = formations[key];
  
  // Wait for image to load to get actual dimensions
  if (!img.complete) {
    img.onload = () => renderFormation(key);
    return;
  }
  
  // ensure the overlay matches the rendered image size exactly
  overlay.style.position = 'absolute';
  overlay.style.width = img.clientWidth + 'px';
  overlay.style.height = img.clientHeight + 'px';
  overlay.style.left = img.offsetLeft + 'px';
  overlay.style.top = img.offsetTop + 'px';
  overlay.style.pointerEvents = 'auto';
  
  const width = overlay.clientWidth;
  const height = overlay.clientHeight;

  // vertical positions (as percentages of pitch height)
  // Adjust these values in CSS if alignment needs tuning (see comments in style.css)
  const positions = {
    portero: 88,   // near bottom
    defensa: 68,
    medio: 50,
    delantera: 30
  };

  // create goalkeeper
  const g = createPlayer('portero', 1);
  placeElement(g, 50, positions.portero);
  overlay.appendChild(g);

  // helpers to distribute players horizontally across the pitch area
  function distribute(count, yPercent, roleName) {
    const spacing = 100 / (count + 1);
    for (let i = 1; i <= count; i++) {
      const x = spacing * i;
      const p = createPlayer(roleName);
      placeElement(p, x, yPercent);
      overlay.appendChild(p);
    }
  }

  distribute(f.defs, positions.defensa, 'defensa');
  distribute(f.mids, positions.medio, 'medio');
  distribute(f.fwds, positions.delantera, 'delantera');
}

// placeElement: positions an element absolutely inside #pitch using percentages
function placeElement(el, xPercent, yPercent) {
  el.style.position = 'absolute';
  // center each player by translating -50% -50%
  el.style.left = xPercent + '%';
  el.style.top = yPercent + '%';
  el.style.transform = 'translate(-50%, -50%)';
  // allow inputs to be interactive
  el.style.pointerEvents = 'auto';
}

// Render the 7 substitution slots in #CAMBIOS
function renderSubs() {
  const subs = document.getElementById('CAMBIOS');
  subs.innerHTML = '';
  const order = [ // color roles for the 7 subs
    'portero',
    'defensa','defensa',
    'medio','medio',
    'delantera','delantera'
  ];

  order.forEach((role)=>{
    const wrapper = document.createElement('div');
    wrapper.className = 'sub';

    const circle = document.createElement('div');
    circle.className = `circle ${role}`;
    const number = document.createElement('div');
    number.className = 'number';
    number.contentEditable = 'true';
    number.innerText = '#';
    circle.appendChild(number);

    const name = document.createElement('input');
    name.type = 'text';
    name.className = 'player-name';
    name.placeholder = 'Nombre';

    wrapper.appendChild(circle);
    wrapper.appendChild(name);
    subs.appendChild(wrapper);
  });
}

// hookup controls
window.addEventListener('DOMContentLoaded', ()=>{
  const select = document.getElementById('formation');
  const btn = document.getElementById('applyFormation');
  btn.addEventListener('click', ()=>{
    renderFormation(select.value);
  });

  // initial render
  renderFormation(select.value);
  renderSubs();
});
