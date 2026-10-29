import { prefersReducedMotion, select, selectAll, toggleClasses } from './utils.js';
import { initSmoothScroll, ScrollTrigger } from './scroll.js';
import { createErosionRenderer } from './erosion.js';

const clamp = (value, min = -1, max = 1) => Math.min(max, Math.max(min, value));

function updateChapterIndicator(chapterDots, sectionId) {
  chapterDots.forEach(dot => {
    const isActive = dot.getAttribute('href') === `#${sectionId}`;
    const line = select('.indicator-line', dot);
    const text = select('.chapter-text', dot);

    toggleClasses(line, 'w-8', isActive);
    toggleClasses(line, 'bg-primary', isActive);
    toggleClasses(line, 'shadow-[0_0_8px_rgba(16,185,129,0.8)]', isActive);
    toggleClasses(line, 'w-4', !isActive);
    toggleClasses(line, 'bg-outline-variant', !isActive);
    toggleClasses(text, 'opacity-100', isActive);
    toggleClasses(text, 'translate-x-0', isActive);
    toggleClasses(text, 'text-forest', isActive);
    toggleClasses(text, 'font-semibold', isActive);
    toggleClasses(text, 'opacity-0', !isActive);
    toggleClasses(text, '-translate-x-2', !isActive);
  });
}

function findTransition(sections, scrollY, viewportHeight) {
  for (let index = 1; index < sections.length; index += 1) {
    const sectionTop = sections[index].offsetTop;
    const start = sectionTop - viewportHeight;
    const end = sectionTop;
    if (scrollY >= start && scrollY <= end) {
      return {
        index,
        progress: (scrollY - start) / Math.max(1, end - start)
      };
    }
  }
  return null;
}

function findActiveSection(sections, scrollY, viewportHeight) {
  const center = scrollY + viewportHeight * 0.5;
  let activeIndex = 0;
  sections.forEach((section, index) => {
    if (section.offsetTop <= center) activeIndex = index;
  });
  return activeIndex;
}

export async function initScrollTransitions() {
  const sections = selectAll('.editorial-section');
  const chapterDots = selectAll('.chapter-dot');
  const canvas = select('#erosion-canvas');
  if (!sections.length || !canvas) return;

  const renderer = await createErosionRenderer(canvas);
  const lenis = initSmoothScroll();
  const transitionState = {
    boundaryIndex: -1,
    progress: 0,
    targetProgress: 0,
    velocity: 0,
    isActive: false
  };
  let lastScrollY = window.scrollY;
  let lastActiveIndex = -1;

  const update = scrollY => {
    const rawVelocity = clamp((scrollY - lastScrollY) / 54);
    // Keep one signed velocity so a small reverse scroll bends the same scene
    // back instead of starting a second animation.
    transitionState.velocity += (rawVelocity - transitionState.velocity) * 0.28;
    const transition = findTransition(sections, scrollY, window.innerHeight);
    const activeIndex = findActiveSection(sections, scrollY, window.innerHeight);

    if (activeIndex !== lastActiveIndex) {
      updateChapterIndicator(chapterDots, sections[activeIndex].id);
      lastActiveIndex = activeIndex;
    }

    if (transition && !prefersReducedMotion) {
      transitionState.boundaryIndex = transition.index;
      transitionState.targetProgress = clamp(transition.progress, 0, 1);
      transitionState.progress = transitionState.targetProgress;
      transitionState.isActive = true;
      renderer.render(
        transitionState.progress,
        transitionState.velocity,
        transitionState.boundaryIndex
      );
    } else {
      transitionState.isActive = false;
      renderer.clear();
    }

    lastScrollY = scrollY;
  };

  ScrollTrigger.create({
    start: 0,
    end: () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
    onUpdate: self => update(self.scroll())
  });

  chapterDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.querySelector(dot.getAttribute('href'));
      if (!target) return;
      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(target, { immediate: false });
      }
    });
  });

  window.addEventListener('resize', () => ScrollTrigger.refresh());
  update(window.scrollY);
}
