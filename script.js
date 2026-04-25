/* script.js – Kerala Town interactive logic */

// ── HERO DISH DATA ────────────────────────────────────────────────
const dishes = {
  biryani:     { name:'Pothi Chicken Biryani', desc:'Kerala-style biryani wrapped in banana leaf, rich and aromatic.' },
  neychoor:    { name:'Neychoor',              desc:'Fragrant ghee rice served with authentic Kerala sides.' },
  porotta:     { name:'Porotta',               desc:'Soft layered Kerala porotta, perfect with curry.' },
  fishfry:     { name:'Fish Fry',              desc:'Spicy Kerala-style fish fry with bold flavours.' },
  chickenroast:{ name:'Chicken Roast',         desc:'Slow-roasted Kerala chicken with rich masala.' }
};

// ── DOM REFS ──────────────────────────────────────────────────────
const selBtns   = document.querySelectorAll('.sel-btn');
const dishName  = document.getElementById('dish-name');
const dishDesc  = document.getElementById('dish-desc');
const dishInfo  = document.getElementById('dish-info');
const layers    = document.querySelectorAll('.hero-img-layer');
const header    = document.getElementById('site-header');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
const tabBtns   = document.querySelectorAll('.tab-btn');
const panels    = document.querySelectorAll('.menu-panel');

// ── HERO SWITCHER ─────────────────────────────────────────────────
let activeLayer = document.getElementById('layer-biryani');

function switchDish(btn) {
  const dish    = btn.dataset.dish;
  const layerId = btn.dataset.layer;
  const newLayer = document.getElementById(layerId);
  if (!newLayer || newLayer === activeLayer) return;

  // Fade out info
  dishInfo.classList.add('transitioning');

  // Swap active button
  selBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Cross-fade background
  activeLayer.classList.remove('active','zoom-pan');
  newLayer.classList.add('active');
  activeLayer = newLayer;

  // Trigger Ken-Burns on new layer
  setTimeout(() => newLayer.classList.add('zoom-pan'), 50);

  // Update text after short delay
  setTimeout(() => {
    dishName.textContent = dishes[dish].name;
    dishDesc.textContent = dishes[dish].desc;
    dishInfo.classList.remove('transitioning');
  }, 200);
}

selBtns.forEach(btn => {
  btn.addEventListener('click', () => switchDish(btn));
});

// Start Ken-Burns on default layer
setTimeout(() => activeLayer.classList.add('zoom-pan'), 100);

// Auto-cycle every 5 seconds
let cycleIdx = 0;
const btnArr  = Array.from(selBtns);
setInterval(() => {
  cycleIdx = (cycleIdx + 1) % btnArr.length;
  switchDish(btnArr[cycleIdx]);
}, 5000);

// ── STICKY HEADER ─────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}, { passive:true });

// ── MOBILE NAV TOGGLE ─────────────────────────────────────────────
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  const open  = navLinks.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = open ? '0' : '1';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
  });
});

// ── MENU TABS ─────────────────────────────────────────────────────
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

// ── SCROLL REVEAL (simple IntersectionObserver) ───────────────────
const revealEls = document.querySelectorAll(
  '.special-card,.review-card,.why-card,.menu-item,.loc-item'
);
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity .5s ease ${i * 0.05}s, transform .5s ease ${i * 0.05}s`;
  io.observe(el);
});
