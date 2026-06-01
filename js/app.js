/* ===== PROGRESS (localStorage) ===== */
const Progress = {
  get() { return JSON.parse(localStorage.getItem('eng_progress') || '{}'); },
  set(data) { localStorage.setItem('eng_progress', JSON.stringify(data)); },
  markDone(lessonId) {
    const p = this.get();
    p[lessonId] = true;
    this.set(p);
    this.render();
  },
  isDone(lessonId) { return !!this.get()[lessonId]; },
  render() {
    document.querySelectorAll('.lesson-link').forEach(el => {
      const id = el.dataset.lesson;
      if (id && this.isDone(id)) el.classList.add('done');
    });
    this.renderProgressBars();
  },
  renderProgressBars() {
    const p = this.get();
    document.querySelectorAll('[data-progress-level]').forEach(bar => {
      const level   = bar.dataset.progressLevel;
      const lessons = JSON.parse(bar.dataset.lessons || '[]');
      if (!lessons.length) return;
      const done = lessons.filter(id => p[id]).length;
      bar.style.width = Math.round((done / lessons.length) * 100) + '%';
    });
  }
};

/* ===== SIDEBAR NAV ===== */
function initSidebar() {
  const links = document.querySelectorAll('.lesson-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const target = link.dataset.target;
      if (target) showLesson(target);
    });
  });
}

/* ===== LESSON SWITCHER ===== */
function showLesson(id) {
  document.querySelectorAll('.lesson-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById(id);
  if (panel) {
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  Progress.markDone(id);
}

/* ===== QUIZ ENGINE ===== */
function initQuizzes() {
  document.querySelectorAll('.quiz-section').forEach(section => {
    const questions = section.querySelectorAll('.quiz-question');
    const submitBtn = section.querySelector('.quiz-submit');
    const scoreEl   = section.querySelector('.quiz-score');

    questions.forEach(q => {
      q.querySelectorAll('.quiz-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          if (q.dataset.answered) return;
          q.dataset.answered = '1';
          const correct = opt.dataset.correct === '1';
          opt.classList.add(correct ? 'correct' : 'wrong');
          if (!correct) {
            q.querySelectorAll('.quiz-opt[data-correct="1"]').forEach(c => c.classList.add('correct'));
          }
          const fb = q.querySelector('.quiz-feedback');
          if (fb) {
            fb.classList.add('show', correct ? 'ok' : 'bad');
            fb.textContent = correct
              ? '✓ ' + (q.dataset.explanation || '¡Correcto!')
              : '✗ ' + (q.dataset.explanation || 'Incorrecto. La respuesta correcta está marcada.');
          }
        });
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        let score = 0;
        questions.forEach(q => {
          if (q.querySelector('.quiz-opt.correct')) score++;
        });
        if (scoreEl) {
          scoreEl.querySelector('.score-num').textContent = score + '/' + questions.length;
          const pct = Math.round((score / questions.length) * 100);
          scoreEl.querySelector('p').textContent =
            pct >= 80 ? '¡Excelente trabajo! 🎉' :
            pct >= 60 ? 'Bien, sigue practicando.' : 'Repasa la lección e intenta de nuevo.';
          scoreEl.classList.add('show');
        }
      });
    }
  });
}

/* ===== FLASHCARD ENGINE ===== */
function initFlashcards() {
  document.querySelectorAll('.flashcard-deck').forEach(deck => {
    const cards = JSON.parse(deck.dataset.cards || '[]');
    let index = 0;
    const wrapper  = deck.querySelector('.flashcard-wrapper');
    const front    = deck.querySelector('.flashcard-front');
    const back     = deck.querySelector('.flashcard-back');
    const progress = deck.querySelector('.fc-progress');

    function renderCard() {
      if (!cards.length) return;
      const c = cards[index];
      wrapper.classList.remove('flipped');
      front.querySelector('.card-word').textContent = c.en;
      front.querySelector('.card-ipa').textContent  = c.ipa || '';
      back.querySelector('.card-trans').textContent  = c.es;
      back.querySelector('.card-ex').textContent     = c.example || '';
      if (progress) progress.textContent = (index + 1) + ' / ' + cards.length;
    }

    wrapper.addEventListener('click', () => wrapper.classList.toggle('flipped'));

    deck.querySelector('.fc-btn.know')?.addEventListener('click', () => {
      index = (index + 1) % cards.length;
      renderCard();
    });
    deck.querySelector('.fc-btn.review')?.addEventListener('click', () => {
      const card = cards.splice(index, 1)[0];
      cards.push(card);
      renderCard();
    });
    deck.querySelector('.fc-btn.next')?.addEventListener('click', () => {
      index = (index + 1) % cards.length;
      renderCard();
    });
    deck.querySelector('.fc-btn.prev')?.addEventListener('click', () => {
      index = (index - 1 + cards.length) % cards.length;
      renderCard();
    });

    renderCard();
  });
}

/* ===== PRONUNCIATION (speech) ===== */
function initPronunciation() {
  document.querySelectorAll('[data-speak]').forEach(el => {
    el.addEventListener('click', () => {
      const text = el.dataset.speak;
      if ('speechSynthesis' in window) {
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = 'en-US';
        utt.rate = 0.85;
        speechSynthesis.speak(utt);
      }
    });
  });
}

/* ===== FILL IN THE BLANK ===== */
function initFillBlanks() {
  document.querySelectorAll('.fill-blank').forEach(ex => {
    const input   = ex.querySelector('input');
    const btn     = ex.querySelector('.check-btn');
    const fb      = ex.querySelector('.blank-feedback');
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const correct = (input.dataset.answer || '').toLowerCase().trim();
      const answer  = input.value.toLowerCase().trim();
      input.style.borderColor = answer === correct ? 'var(--basic)' : '#ef4444';
      fb.textContent  = answer === correct ? '✓ ¡Correcto!' : '✗ Respuesta: ' + input.dataset.answer;
      fb.style.color  = answer === correct ? 'var(--basic-dark)' : '#b91c1c';
      fb.style.display = 'block';
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initQuizzes();
  initFlashcards();
  initPronunciation();
  initFillBlanks();
  Progress.render();

  // show first lesson by default
  const first = document.querySelector('.lesson-link');
  if (first) first.click();
});
