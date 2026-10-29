import { initAnimations } from './animations.js';
import { initCalculator } from './calculator.js';
import { initQuiz } from './quiz.js';
import { initScrollTransitions } from './transitions.js';

function initGlobalActions() {
  document
    .querySelector('#btn-print-report')
    ?.addEventListener('click', () => window.print());
}

function initApp() {
  initAnimations();
  initScrollTransitions();
  initCalculator();
  initQuiz();
  initGlobalActions();
}

initApp();
