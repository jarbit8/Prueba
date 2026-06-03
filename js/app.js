/* ===== MOBILE MENU ===== */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
});

/* ===== MEMBERSHIP BUTTONS ===== */
document.querySelectorAll('.plan-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('💪 Plan ' + btn.dataset.plan + ' seleccionado — te contactamos hoy');
  });
});

/* ===== CTA BUTTON ===== */
document.getElementById('ctaBtn').addEventListener('click', () => {
  showToast('🔥 ¡7 días gratis activados! Nos vemos en el gym');
});

/* ===== NAV CTA ===== */
document.querySelector('.nav-cta').addEventListener('click', () => {
  document.getElementById('membresias').scrollIntoView({ behavior: 'smooth' });
});

/* ===== TOAST ===== */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3500);
}
