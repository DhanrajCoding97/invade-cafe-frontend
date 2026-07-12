// lib/animationPresets.ts
export const REVEAL = {
  header: {
    duration: 0.6,
    stagger: 0.15,
    y: 30,
    ease: 'power2.out',
  },
  cards: {
    duration: 0.5,
    stagger: 0.12,
    y: 40,
    ease: 'power2.out',
  },
} as const;
