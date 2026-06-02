/* ===== MODAL ===== */
function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const form = document.getElementById('subForm');

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.openModal || '';
      const planName = document.getElementById('modalPlanName');
      if (planName && plan) planName.textContent = plan;
      overlay.classList.add('show');
    });
  });

  closeBtn?.addEventListener('click', () => overlay.classList.remove('show'));
  overlay?.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    overlay.classList.remove('show');
    showToast('🎉 ¡Bienvenido al club!', 'Tu primera caja de Kapac está en camino.');
    form.reset();
  });
}

/* ===== TOAST ===== */
function showToast(title, sub) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.t-title').textContent = title;
  toast.querySelector('.t-sub').textContent   = sub;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ===== FAQ ===== */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ===== LOCKED FEED CLICK ===== */
function initFeed() {
  document.querySelectorAll('.feed-card.locked').forEach(card => {
    card.addEventListener('click', () => {
      const overlay = document.getElementById('modalOverlay');
      const planName = document.getElementById('modalPlanName');
      if (planName) planName.textContent = 'Cervecero';
      overlay?.classList.add('show');
    });
  });
}

/* ===== SCROLL REVEAL ===== */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ===== COUNTER ===== */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = '1';
      const target = parseInt(entry.target.dataset.count);
      const suffix = entry.target.dataset.suffix || '';
      let cur = 0;
      const step = target / (1400 / 16);
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        entry.target.textContent = Math.round(cur).toLocaleString() + suffix;
      }, 16);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initModal();
  initFaq();
  initFeed();
  initReveal();
  initCounters();
});
