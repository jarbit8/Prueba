/* ===== LIKES ===== */
document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('liked');
    const countEl = btn.querySelector('.like-count');
    let n = parseInt(countEl.dataset.n);
    if (btn.classList.contains('liked')) { n++; btn.querySelector('.icon').textContent = '❤️'; }
    else { n--; btn.querySelector('.icon').textContent = '🤍'; }
    countEl.dataset.n = n;
    countEl.textContent = n;
  });
});

/* ===== TIPS ===== */
document.querySelectorAll('.tip-amt').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.tip-amounts').querySelectorAll('.tip-amt').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    const sendBtn = btn.closest('.tip-card').querySelector('.tip-send');
    sendBtn.classList.add('active');
    sendBtn.textContent = 'Enviar ' + btn.textContent + ' 🍺';
  });
});

document.querySelectorAll('.tip-send').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!btn.classList.contains('active')) return;
    showToast('🍺 ¡Propina enviada! Gracias por apoyar a Kapac');
    btn.classList.remove('active');
    btn.textContent = 'Enviar propina';
    btn.closest('.tip-card').querySelectorAll('.tip-amt').forEach(b => b.classList.remove('sel'));
  });
});

/* ===== SUBSCRIBE ===== */
document.querySelectorAll('[data-sub]').forEach(btn => {
  btn.addEventListener('click', () => {
    const plan = btn.dataset.sub || 'Cervecero';
    document.getElementById('modalPlan').textContent = plan;
    document.getElementById('modalOverlay').classList.add('show');
  });
});

document.getElementById('modalOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay'))
    document.getElementById('modalOverlay').classList.remove('show');
});

document.getElementById('subForm')?.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('modalOverlay').classList.remove('show');
  showToast('🎉 ¡Suscripción activada! Bienvenido al club');
  e.target.reset();
});

/* ===== UNLOCK POST ===== */
document.querySelectorAll('.unlock-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const media = btn.closest('.post-media');
    media.classList.remove('locked');
    btn.closest('.lock-overlay')?.remove();
    showToast('🔓 ¡Contenido desbloqueado!');
  });
});

/* ===== MSG BUTTON ===== */
document.querySelectorAll('.btn-msg').forEach(btn => {
  btn.addEventListener('click', () => showToast('💬 Abriendo chat con Kapac Beer...'));
});

/* ===== TABS ===== */
document.querySelectorAll('.feed-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.feed-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* ===== COMMENT ===== */
document.querySelectorAll('.comment-btn').forEach(btn => {
  btn.addEventListener('click', () => showToast('💬 Comentarios próximamente'));
});

/* ===== FOLLOW SUGGESTED ===== */
document.querySelectorAll('.sug-follow').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = '✓';
    btn.style.background = 'rgba(0,175,240,.15)';
    showToast('✓ Siguiendo nuevo lote');
  });
});

/* ===== TOAST ===== */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}
