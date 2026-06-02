/* ===== BEER DATA ===== */
const beers = [
  {
    id: 1,
    name: "Kapac Dorada",
    age: "4.8%",
    emoji: "🌾",
    bg: "linear-gradient(160deg,#2e1c08,#8a5c14,#c8930a)",
    loc: "📍 Cervecería Kapac · Lima, 2km",
    tags: ["Golden Lager","Refrescante","IBU 18","330ml"],
    bio: "Soy rubia, ligera y siempre lista para una tarde de verano ☀️ Me llevo bien con todos. Dicen que soy la más popular del grupo — no me quejo 💁‍♀️",
    abv: "4.8%", ibu: "18", ml: "330ml", tipo: "Golden Lager",
    maridaje: "Ceviche, pollo a la brasa, pizza",
    color: "#c8930a"
  },
  {
    id: 2,
    name: "Kapac Negra",
    age: "6.2%",
    emoji: "☕",
    bg: "linear-gradient(160deg,#0d0500,#3d1500,#1a0808)",
    loc: "📍 Cervecería Kapac · Lima, 2km",
    tags: ["Dark Stout","Intensa","IBU 32","330ml"],
    bio: "Oscura, misteriosa y con carácter 🖤 No soy para todos — y eso me gusta. Si buscas algo fácil, pasa a la siguiente. Si buscas algo que recuerdes... soy yo.",
    abv: "6.2%", ibu: "32", ml: "330ml", tipo: "Dark Stout",
    maridaje: "Chocolate negro, costillas, quesos curados",
    color: "#3d1500"
  },
  {
    id: 3,
    name: "Kapac Trigo",
    age: "5.0%",
    emoji: "🍋",
    bg: "linear-gradient(160deg,#1a2e08,#4a8c14,#8ac830)",
    loc: "📍 Cervecería Kapac · Lima, 2km",
    tags: ["Wheat Ale","Cítrica","IBU 14","330ml"],
    bio: "Fresca, afrutada y con un toque cítrico que te sorprende 🍊 Soy el plan perfecto para quien quiere algo distinto sin complicarse la vida. Naranja + coriandro = yo 🌿",
    abv: "5.0%", ibu: "14", ml: "330ml", tipo: "Wheat Ale",
    maridaje: "Ensaladas, mariscos, comida thai",
    color: "#8ac830"
  },
  {
    id: 4,
    name: "Kapac Roja",
    age: "6.8%",
    emoji: "🔥",
    bg: "linear-gradient(160deg,#1a0808,#8a1414,#d42020)",
    loc: "📍 Cervecería Kapac · Lima, 2km",
    tags: ["Red IPA","Lupulada","IBU 55","330ml"],
    bio: "Intensa, atrevida y con un amargor que no olvidas 🌶️ IBU 55 — no apta para cobardes. Si has llegado hasta aquí, ya me conoces. Swipe right si te animas. 😈",
    abv: "6.8%", ibu: "55", ml: "330ml", tipo: "Red IPA",
    maridaje: "Carnes a la parrilla, especias, burguer",
    color: "#d42020"
  },
  {
    id: 5,
    name: "Kapac Barleywine",
    age: "11%",
    emoji: "👑",
    bg: "linear-gradient(160deg,#0d0d1a,#1a1060,#3a20a0)",
    loc: "📍 Cervecería Kapac · Lima, 2km",
    tags: ["Barleywine","Premium","IBU 70","500ml"],
    bio: "Solo para los que saben de verdad 👑 11% de alcohol, 18 meses de maduración. Soy una experiencia, no solo una cerveza. Edición limitada — porque no todo el mundo merece lo mejor.",
    abv: "11%", ibu: "70", ml: "500ml", tipo: "Barleywine",
    maridaje: "Foie gras, queso azul, postres de toffee",
    color: "#6b40e0"
  },
];

/* ===== STATE ===== */
let currentIdx = 0;
let likes = 0;
let isDragging = false, startX = 0, startY = 0, currentX = 0;
let activeCard = null;
let currentBeer = null;

/* ===== RENDER DECK ===== */
function renderDeck() {
  const stack = document.getElementById('cardStack');
  const empty = document.getElementById('emptyState');
  stack.innerHTML = '';

  const remaining = beers.slice(currentIdx);
  if (!remaining.length) {
    stack.style.display = 'none';
    empty.classList.add('show');
    document.querySelector('.actions').style.opacity = '.35';
    document.querySelector('.actions').style.pointerEvents = 'none';
    return;
  }

  stack.style.display = 'block';
  empty.classList.remove('show');
  document.querySelector('.actions').style.opacity = '1';
  document.querySelector('.actions').style.pointerEvents = 'all';

  [...remaining].reverse().slice(0, 3).reverse().forEach((beer, i) => {
    const card = createCard(beer);
    if (i === 0) { card.style.zIndex = 10; initDrag(card, beer); }
    stack.appendChild(card);
  });
}

function createCard(beer) {
  const card = document.createElement('div');
  card.className = 'beer-card';
  card.dataset.id = beer.id;
  card.innerHTML = `
    <div class="card-img">
      <div class="card-bg" style="background:${beer.bg}">${beer.emoji}</div>
      <div class="card-gradient"></div>
      <div class="card-info">
        <div class="card-name-row">
          <span class="card-name">${beer.name}</span>
          <span class="card-age">${beer.age}</span>
        </div>
        <div class="card-loc">${beer.loc}</div>
        <div class="card-tags">${beer.tags.map(t=>`<span class="card-tag">${t}</span>`).join('')}</div>
        <div class="card-bio">${beer.bio.slice(0,80)}...</div>
      </div>
      <div class="stamp stamp-like">LIKE</div>
      <div class="stamp stamp-nope">NOPE</div>
      <div class="stamp stamp-super">SÚPER</div>
    </div>
  `;

  // tap info
  card.querySelector('.card-bio').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isDragging) openInfo(beer);
  });

  return card;
}

/* ===== DRAG / SWIPE ===== */
function initDrag(card, beer) {
  card.addEventListener('mousedown', dragStart);
  card.addEventListener('touchstart', dragStart, { passive: true });

  function dragStart(e) {
    if (e.target.closest('.card-bio')) return;
    isDragging = false;
    activeCard = card;
    currentBeer = beer;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX;
    startY = pt.clientY;
    currentX = 0;
    card.style.transition = 'none';

    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchmove', dragMove, { passive: false });
    window.addEventListener('touchend', dragEnd);
  }

  function dragMove(e) {
    if (!activeCard) return;
    if (e.cancelable) e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    currentX = pt.clientX - startX;
    const dy = pt.clientY - startY;
    if (Math.abs(currentX) > 5) isDragging = true;
    const rotate = currentX * 0.08;
    activeCard.style.transform = `translateX(${currentX}px) translateY(${dy * 0.3}px) rotate(${rotate}deg)`;

    const likeStamp  = activeCard.querySelector('.stamp-like');
    const nopeStamp  = activeCard.querySelector('.stamp-nope');
    const threshold  = 60;
    likeStamp.style.opacity = currentX > threshold ? Math.min((currentX - threshold) / 50, 1) : 0;
    nopeStamp.style.opacity = currentX < -threshold ? Math.min((-currentX - threshold) / 50, 1) : 0;
  }

  function dragEnd() {
    window.removeEventListener('mousemove', dragMove);
    window.removeEventListener('mouseup', dragEnd);
    window.removeEventListener('touchmove', dragMove);
    window.removeEventListener('touchend', dragEnd);

    if (!activeCard) return;
    const threshold = 90;

    if (currentX > threshold) {
      triggerLike();
    } else if (currentX < -threshold) {
      triggerNope();
    } else {
      activeCard.style.transition = 'transform .4s cubic-bezier(.32,1.25,.55,1)';
      activeCard.style.transform = 'translateX(0) rotate(0)';
      activeCard.querySelector('.stamp-like').style.opacity = 0;
      activeCard.querySelector('.stamp-nope').style.opacity = 0;
    }
    activeCard = null;
    setTimeout(() => { isDragging = false; }, 50);
  }
}

/* ===== ACTIONS ===== */
function triggerLike(superLike = false) {
  const card = document.querySelector('.beer-card:last-child');
  const beer = beers[currentIdx];
  if (!card || !beer) return;

  card.style.transition = 'none';
  card.querySelector('.stamp-like').style.opacity = superLike ? 0 : 1;
  card.querySelector('.stamp-super').style.opacity = superLike ? 1 : 0;

  setTimeout(() => {
    card.classList.add('swipe-right');
    card.addEventListener('animationend', () => {
      card.remove();
      currentIdx++;
      likes++;
      updateLikesBadge();
      renderDeck();
      // 40% chance of match
      if (Math.random() < 0.4) {
        setTimeout(() => showMatch(beer), 200);
      }
    }, { once: true });
  }, 50);
}

function triggerNope() {
  const card = document.querySelector('.beer-card:last-child');
  if (!card) return;
  card.querySelector('.stamp-nope').style.opacity = 1;
  setTimeout(() => {
    card.classList.add('swipe-left');
    card.addEventListener('animationend', () => {
      card.remove();
      currentIdx++;
      renderDeck();
    }, { once: true });
  }, 50);
}

function triggerSuper() {
  triggerLike(true);
}

function triggerRewind() {
  if (currentIdx <= 0) return;
  currentIdx--;
  likes = Math.max(0, likes - 1);
  updateLikesBadge();
  renderDeck();
  showToast('↩ Volviste atrás');
}

function updateLikesBadge() {
  const badge = document.getElementById('likesBadge');
  if (badge) badge.textContent = likes;
}

/* ===== MATCH ===== */
function showMatch(beer) {
  const screen = document.getElementById('matchScreen');
  const avatar = screen.querySelector('.match-avatar.beer');
  avatar.textContent = beer.emoji;
  avatar.style.background = beer.bg;
  screen.classList.add('show');
}

/* ===== INFO PANEL ===== */
function openInfo(beer) {
  const panel = document.getElementById('infoPanel');
  const hero  = panel.querySelector('.panel-hero');
  hero.style.background = beer.bg;
  hero.querySelector('.panel-emoji').textContent = beer.emoji;
  panel.querySelector('.panel-name').textContent  = beer.name;
  panel.querySelector('.panel-pct').textContent   = beer.age;
  panel.querySelector('.panel-loc').textContent   = beer.loc;
  panel.querySelector('.panel-bio-text').textContent = beer.bio;

  // stats
  panel.querySelector('.ps-abv').textContent  = beer.abv;
  panel.querySelector('.ps-ibu').textContent  = beer.ibu;
  panel.querySelector('.ps-ml').textContent   = beer.ml;

  // tags
  const tagsCont = panel.querySelector('.panel-tags');
  tagsCont.innerHTML = beer.tags.map(t => `<span class="panel-tag">${t}</span>`).join('');

  // maridaje
  panel.querySelector('.panel-maridaje').textContent = beer.maridaje;

  panel.classList.add('show');
}

/* ===== TOAST ===== */
function showToast(msg) {
  let t = document.getElementById('miniToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'miniToast';
    t.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:.5rem 1.25rem;border-radius:50px;font-size:.82rem;font-weight:600;z-index:200;transition:opacity .3s;white-space:nowrap;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._t);
  t._t = setTimeout(() => t.style.opacity = '0', 2000);
}

/* ===== FILTERS ===== */
function initFilters() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      showToast('Filtro: ' + chip.textContent);
    });
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderDeck();
  initFilters();

  // Buttons
  document.getElementById('btnNope') ?.addEventListener('click', triggerNope);
  document.getElementById('btnLike') ?.addEventListener('click', () => triggerLike());
  document.getElementById('btnSuper')?.addEventListener('click', triggerSuper);
  document.getElementById('btnRewind')?.addEventListener('click', triggerRewind);
  document.getElementById('btnBoost')?.addEventListener('click', () => showToast('🚀 ¡Boost activado! +10 descubrimientos'));

  // Match screen
  document.getElementById('matchClose')?.addEventListener('click', () => document.getElementById('matchScreen').classList.remove('show'));
  document.getElementById('matchMsg')?.addEventListener('click', () => {
    document.getElementById('matchScreen').classList.remove('show');
    showToast('💬 Pedido enviado — ¡que disfrutes!');
  });

  // Info panel
  document.getElementById('panelClose')?.addEventListener('click', () => document.getElementById('infoPanel').classList.remove('show'));
  document.getElementById('panelNope')?.addEventListener('click', () => {
    document.getElementById('infoPanel').classList.remove('show');
    triggerNope();
  });
  document.getElementById('panelLike')?.addEventListener('click', () => {
    document.getElementById('infoPanel').classList.remove('show');
    triggerLike();
  });

  // Reload
  document.getElementById('reloadBtn')?.addEventListener('click', () => {
    currentIdx = 0; likes = 0;
    updateLikesBadge();
    renderDeck();
  });

  // Info icon taps on locked cards
  document.addEventListener('click', e => {
    const card = e.target.closest('.beer-card');
    if (card && !isDragging) {
      const beer = beers.find(b => b.id == card.dataset.id);
      if (beer) openInfo(beer);
    }
  });
});
