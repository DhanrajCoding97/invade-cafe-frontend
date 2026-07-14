// lib/pageTransition.ts
'use client';
import gsap from 'gsap';

let blockEls: HTMLElement[] = [];

export function registerBlocks(container: HTMLElement) {
  blockEls = Array.from(container.querySelectorAll<HTMLElement>('.block'));
}

function coverTransition(): Promise<void> {
  return new Promise((resolve) => {
    if (blockEls.length === 0) return resolve();
    gsap.set(blockEls, { visibility: 'visible', scaleY: 0 });
    gsap.to(blockEls, {
      scaleY: 1,
      duration: 1,
      stagger: { each: 0.1, from: 'start', grid: [2, 4], axis: 'x' },
      ease: 'power4.inOut',
      onComplete: () => resolve(),
    });
  });
}

export function revealTransition(): Promise<void> {
  return new Promise((resolve) => {
    if (blockEls.length === 0) return resolve();
    gsap.set(blockEls, { visibility: 'visible', scaleY: 1 });
    gsap.to(blockEls, {
      scaleY: 0,
      duration: 1,
      stagger: { each: 0.1, from: 'start', grid: [2, 4], axis: 'x' },
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.set(blockEls, { visibility: 'hidden' });
        resolve();
      },
    });
  });
}

/** Cover the screen, run the scroll while hidden, then reveal. */
export async function playSectionTransition(scrollFn: () => void) {
  await coverTransition();
  scrollFn();
  await revealTransition();
}
