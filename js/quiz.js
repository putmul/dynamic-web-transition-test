import { QUIZ_QUESTIONS } from './data.js';
import { select, selectAll } from './utils.js';

export function initQuiz() {
  const elements = {
    step: select('#quiz-step-text'),
    score: select('#quiz-score-live'),
    progress: select('#quiz-progress-bar'),
    title: select('#quiz-question-title'),
    options: select('#quiz-options-group'),
    feedback: select('#quiz-feedback-box'),
    feedbackTitle: select('#feedback-title'),
    feedbackDescription: select('#feedback-desc'),
    nextButton: select('#btn-quiz-next'),
    activeBlock: select('#quiz-active-block'),
    summaryBlock: select('#quiz-summary-block'),
    finalScore: select('#final-score-val'),
    finalCorrect: select('#final-correct-val'),
    restartButton: select('#btn-quiz-restart'),
    shareButton: select('#btn-quiz-share')
  };

  if (!elements.options) return;

  const state = { questionIndex: 0, score: 0, hasAnswered: false };

  const evaluateAnswer = (option, button, indicator, question) => {
    selectAll('button', elements.options).forEach(optionButton => {
      optionButton.disabled = true;
    });

    if (option.correct) {
      state.score += 100 / QUIZ_QUESTIONS.length;
      button.classList.add('border-primary', 'bg-mint/50', 'text-forest');
      indicator.classList.add('bg-primary', 'border-primary', 'shadow-[0_0_6px_rgba(16,185,129,0.8)]');
      elements.feedbackTitle.textContent = 'Jawaban Tepat';
      elements.feedbackTitle.className = 'font-label text-xs uppercase tracking-widest text-primary font-bold';
    } else {
      button.classList.add('border-error', 'text-error', 'bg-error-container/20');
      indicator.classList.add('bg-error', 'border-error');
      elements.feedbackTitle.textContent = 'Fakta Ilmiah';
      elements.feedbackTitle.className = 'font-label text-xs uppercase tracking-widest text-error font-bold';
    }

    elements.feedbackDescription.textContent = question.explanation;
    elements.feedback.classList.remove('hidden');
    elements.score.textContent = `Skor: ${Math.round(state.score)}`;
    elements.nextButton.classList.remove('hidden');
    elements.nextButton.classList.add('inline-flex');
    elements.nextButton.querySelector('span').textContent = state.questionIndex === QUIZ_QUESTIONS.length - 1
      ? 'Lihat Hasil Evaluasi'
      : 'Pertanyaan Berikutnya';
  };

  const createOptionButton = (option, optionIndex, question) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'w-full text-left p-4 rounded-xl border border-emerald-900/10 hover:border-primary hover:bg-mint/30 transition-all flex items-center justify-between text-xs font-label tracking-wide uppercase text-on-surface bg-white/60';

    const content = document.createElement('div');
    content.className = 'flex items-center gap-4';
    const letter = document.createElement('span');
    letter.className = 'font-mono text-outline font-bold';
    letter.textContent = String.fromCharCode(65 + optionIndex);
    const text = document.createElement('span');
    text.className = 'font-medium';
    text.textContent = option.text;
    const indicator = document.createElement('span');
    indicator.className = 'w-3 h-3 rounded-full border border-outline-variant';
    content.append(letter, text);
    button.append(content, indicator);

    button.addEventListener('click', () => {
      if (state.hasAnswered) return;
      state.hasAnswered = true;
      evaluateAnswer(option, button, indicator, question);
    });
    return button;
  };

  const renderQuestion = questionIndex => {
    const question = QUIZ_QUESTIONS[questionIndex];
    state.hasAnswered = false;
    elements.step.textContent = `Pertanyaan ${questionIndex + 1} dari ${QUIZ_QUESTIONS.length}`;
    elements.progress.style.width = `${((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`;
    elements.title.textContent = question.question;
    elements.feedback.classList.add('hidden');
    elements.nextButton.classList.add('hidden');
    elements.nextButton.classList.remove('inline-flex');
    elements.options.replaceChildren(
      ...question.options.map((option, optionIndex) => createOptionButton(option, optionIndex, question))
    );
  };

  const showSummary = () => {
    elements.activeBlock.classList.add('hidden');
    elements.summaryBlock.classList.remove('hidden');
    elements.summaryBlock.classList.add('flex');
    elements.finalScore.textContent = Math.round(state.score);
    elements.finalCorrect.textContent = `${Math.round(state.score / (100 / QUIZ_QUESTIONS.length))}/${QUIZ_QUESTIONS.length}`;
  };

  const reset = () => {
    state.questionIndex = 0;
    state.score = 0;
    elements.score.textContent = 'Skor: 0';
    elements.summaryBlock.classList.add('hidden');
    elements.summaryBlock.classList.remove('flex');
    elements.activeBlock.classList.remove('hidden');
    renderQuestion(0);
  };

  const share = async () => {
    const shareData = {
      title: 'Skor GreenTech Kampus',
      text: 'Saya berhasil meraih skor optimal di GreenTech Kampus!',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        window.alert('Tautan disalin.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') console.error('Gagal membagikan hasil kuis:', error);
    }
  };

  elements.nextButton.addEventListener('click', () => {
    if (state.questionIndex < QUIZ_QUESTIONS.length - 1) {
      state.questionIndex += 1;
      renderQuestion(state.questionIndex);
    } else {
      showSummary();
    }
  });
  elements.restartButton.addEventListener('click', reset);
  elements.shareButton.addEventListener('click', share);
  renderQuestion(0);
}
