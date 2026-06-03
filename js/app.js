/* ===== MOBILE MENU ===== */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
});

/* ===== NAV CTA ===== */
document.querySelector('.nav-cta').addEventListener('click', () => {
  showToast('// FAN ZONE coming soon · Stay tuned');
});

/* ===== JOIN FORM ===== */
document.getElementById('joinBtn').addEventListener('click', () => {
  const val = document.getElementById('joinInput').value.trim();
  if (!val) { showToast('// Ingresa tu nick y juego primero'); return; }
  showToast('// Postulación recibida — te contactamos en 96h. GG');
  document.getElementById('joinInput').value = '';
});

/* ===== TOAST ===== */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3500);
}
