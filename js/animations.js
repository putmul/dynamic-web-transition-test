import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, selectAll } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  if (prefersReducedMotion) return;

  const sections = selectAll('.editorial-section');
  sections.forEach(section => {
    const content = section.firstElementChild;
    if (!content) return;

    gsap.fromTo(content,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          once: true
        }
      }
    );
  });
}
