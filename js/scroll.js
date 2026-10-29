import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  if (prefersReducedMotion) return null;

  const lenis = new Lenis({
    lerp: 0.04,
    wheelMultiplier: 0.28,
    touchMultiplier: 0.65,
    smoothWheel: true,
    anchors: true,
    virtualScroll: data => {
      const maxDelta = 54;
      data.deltaY = Math.sign(data.deltaY) * Math.min(Math.abs(data.deltaY), maxDelta);
      data.deltaX = Math.sign(data.deltaX) * Math.min(Math.abs(data.deltaX), maxDelta);
    }
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export { gsap, ScrollTrigger };
