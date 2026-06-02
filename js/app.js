/* ===== AGE GATE ===== */
function initAgeGate() {
  if (sessionStorage.getItem('age_ok')) return;
  const gate = document.getElementById('ageGate');
  if (!gate) return;
  gate.style.display = 'flex';
  document.getElementById('ageYes').addEventListener('click', () => {
    sessionStorage.setItem('age_ok', '1');
    gate.style.opacity = '0';
    gate.style.transition = 'opacity .5s';
    setTimeout(() => gate.remove(), 500);
  });
  document.getElementById('ageNo').addEventListener('click', () => {
    gate.innerHTML = '<div style="text-align:center;padding:2rem;"><h2 style="font-family:Georgia,serif;color:#d4a017;margin-bottom:1rem;">Lo sentimos</h2><p style="color:#9e8a6a;">Este sitio es exclusivo para mayores de edad. Hasta pronto.</p></div>';
  });
}

/* ===== NAV SCROLL ===== */
function initNav() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(13,10,6,.97)';
    } else {
      nav.style.background = 'rgba(13,10,6,.85)';
    }
  });

  // burger
  const burger = document.getElementById('navBurger');
  const links  = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '70px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(13,10,6,.97)';
      links.style.padding = '1rem 1.5rem 1.5rem';
      links.style.gap = '.5rem';
      links.style.borderBottom = '1px solid rgba(212,160,23,.15)';
    });
  }

  // smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const el = document.querySelector(a.getAttribute('href'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (links && window.innerWidth < 900) links.style.display = 'none';
    });
  });
}

/* ===== PARTICLES ===== */
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left  = Math.random() * 100 + '%';
    p.style.bottom = '-10px';
    p.style.width  = (Math.random() * 3 + 1) + 'px';
    p.style.height = (Math.random() * 3 + 1) + 'px';
    p.style.animationDuration  = (Math.random() * 8 + 5) + 's';
    p.style.animationDelay     = (Math.random() * 8) + 's';
    container.appendChild(p);
  }
}

/* ===== BUBBLES ===== */
function initBubbles() {
  const container = document.querySelector('.bubbles');
  if (!container) return;
  for (let i = 0; i < 6; i++) {
    const b = document.createElement('div');
    b.className = 'bubble-item';
    const size = Math.random() * 8 + 4;
    b.style.width  = size + 'px';
    b.style.height = size + 'px';
    b.style.left   = (Math.random() * 60 - 30) + 'px';
    b.style.animationDuration = (Math.random() * 3 + 2) + 's';
    b.style.animationDelay    = (Math.random() * 3) + 's';
    container.appendChild(b);
  }
}

/* ===== CART ===== */
let cartCount = 0;
function initCart() {
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      cartCount++;
      const name = btn.closest('.product-card').querySelector('.product-name').textContent;
      showToast(name);
    });
  });
}

function showToast(productName) {
  const toast = document.getElementById('cartToast');
  if (!toast) return;
  toast.querySelector('.toast-title').textContent = '¡Agregado al pedido!';
  toast.querySelector('.toast-sub').textContent = productName + ' — ' + cartCount + (cartCount === 1 ? ' producto' : ' productos');
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ===== SCROLL REVEAL ===== */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===== FORM ===== */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✓ Enviado — ¡Te contactamos pronto!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Enviar Pedido';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });

  const orderForm = document.getElementById('orderForm');
  if (!orderForm) return;
  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = orderForm.querySelector('button[type="submit"]');
    btn.textContent = '✓ ¡Listo! Te contactamos';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      btn.textContent = 'Quiero mi caja';
      btn.style.background = '';
      orderForm.reset();
    }, 4000);
  });
}

/* ===== COUNTER ANIMATION ===== */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = '1';
      const target = parseInt(entry.target.dataset.count);
      const duration = 1600;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        entry.target.textContent = Math.round(current) + (entry.target.dataset.suffix || '');
      }, 16);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initAgeGate();
  initNav();
  initParticles();
  initBubbles();
  initCart();
  initReveal();
  initForm();
  initCounters();
});
