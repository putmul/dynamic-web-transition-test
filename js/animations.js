import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, selectAll } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  const sections = selectAll('.editorial-section');

  sections.forEach(section => {
    const content = section.querySelector(':scope > .section-reveal') || section.firstElementChild;
    if (!content) return;

    if (prefersReducedMotion || section.dataset.feature === 'hero') {
      gsap.set(content, { clearProps: 'all' });
      return;
    }

    // Keep the section in the document flow, but reveal its content only
    // once the user has meaningfully entered the next chapter.
    gsap.fromTo(content,
      { autoAlpha: 0, y: 32, filter: 'blur(4px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 54%',
          end: 'top 32%',
          scrub: 0.8,
          invalidateOnRefresh: true
        }
      }
    );
  });
}
