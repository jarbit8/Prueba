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

/* ===== POST TIP BUTTON (opens sidebar tip card) ===== */
document.querySelectorAll('.post-tip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tipCard = document.querySelector('.tip-card');
    if (tipCard) tipCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('🎁 Selecciona un monto para enviar una propina');
  });
});

/* ===== PROFILE TIP BUTTON ===== */
document.querySelector('.btn-tip')?.addEventListener('click', () => {
  const tipCard = document.querySelector('.tip-card');
  if (tipCard) tipCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast('🎁 Selecciona un monto en el panel derecho');
});

/* ===== TIPS ===== */
document.querySelectorAll('.tip-amt').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.tip-amounts').querySelectorAll('.tip-amt').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    const sendBtn = btn.closest('.tip-card').querySelector('.tip-send');
    sendBtn.classList.add('active');
    sendBtn.textContent = 'Enviar ' + btn.textContent + ' 🎨';
  });
});

document.querySelectorAll('.tip-send').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!btn.classList.contains('active')) return;
    showToast('🎨 ¡Propina enviada! Gracias por apoyar a Valeria');
    btn.classList.remove('active');
    btn.textContent = 'Enviar propina';
    btn.closest('.tip-card').querySelectorAll('.tip-amt').forEach(b => b.classList.remove('sel'));
  });
});

/* ===== SUBSCRIBE ===== */
document.querySelectorAll('[data-sub]').forEach(btn => {
  btn.addEventListener('click', () => {
    const plan = btn.dataset.sub || 'Coleccionista';
    document.getElementById('modalPlan').textContent = plan;
    document.getElementById('modalOverlay').classList.add('show');
  });
});

document.getElementById('modalOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay'))
    document.getElementById('modalOverlay').classList.remove('show');
});

document.getElementById('modalClose')?.addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.remove('show');
});

document.getElementById('subForm')?.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('modalOverlay').classList.remove('show');
  showToast('🎉 ¡Suscripción activada! Bienvenido/a a la galería de Valeria');
  e.target.reset();
});

/* ===== SUBSCRIPTION TIERS ===== */
document.querySelectorAll('.sub-tier').forEach(tier => {
  tier.addEventListener('click', () => {
    const name = tier.querySelector('.tier-name')?.textContent || 'Coleccionista';
    document.getElementById('modalPlan').textContent = name;
    document.getElementById('modalOverlay').classList.add('show');
  });
});

/* ===== UNLOCK POST ===== */
document.querySelectorAll('.unlock-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const media = btn.closest('.post-media');
    media.classList.remove('locked');
    btn.closest('.lock-overlay')?.remove();
    showToast('🔓 ¡Contenido desbloqueado! Disfruta la colección');
  });
});

/* ===== MSG BUTTON ===== */
document.querySelectorAll('.btn-msg').forEach(btn => {
  btn.addEventListener('click', () => showToast('💬 Abriendo chat con Valeria Morales...'));
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
    const name = btn.closest('.sug-item')?.querySelector('.sug-name')?.textContent || 'artista';
    btn.textContent = '✓';
    btn.classList.add('done');
    showToast('✓ Siguiendo a ' + name);
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
