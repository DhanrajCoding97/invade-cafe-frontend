// 'use client';

// import React, { useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useGSAP } from '@gsap/react';

// gsap.registerPlugin(ScrollTrigger);

// type CardsRevealProps = {
//   children: React.ReactElement<{
//     ref?: React.Ref<HTMLDivElement>;
//     className?: string;
//   }>;
//   delay?: number;
//   stagger?: number;
//   duration?: number;
//   y?: number;
//   start?: string;
//   triggerRef?: React.RefObject<HTMLElement | null>;
// };

// export default function CardsReveal({
//   children,
//   delay = 0,
//   stagger = 0.15,
//   duration = 0.4,
//   y = 48,
//   start = 'top 80%',
//   triggerRef,
// }: CardsRevealProps) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useGSAP(
//     () => {
//       if (!containerRef.current) return;

//       const cards = Array.from(containerRef.current.children);

//       gsap.set(containerRef.current, {
//         autoAlpha: 1,
//       });

//       gsap.set(cards, {
//         autoAlpha: 0,
//         y,
//       });
//       gsap.to(cards, {
//         autoAlpha: 1,
//         y: 0,
//         duration,
//         stagger,
//         delay,
//         ease: 'power4.out',
//         clearProps: 'transform',
//         scrollTrigger: {
//           trigger: triggerRef?.current ?? containerRef.current,
//           start,
//           once: true,
//         },
//       });
//     },
//     {
//       scope: containerRef,
//       dependencies: [delay, stagger, duration, y, start],
//     },
//   );

//   return React.cloneElement(children, {
//     ref: containerRef,
//     className: [children.props.className, 'opacity-0']
//       .filter(Boolean)
//       .join(' '),
//   });

// }

'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

type CardsRevealProps = {
  children: React.ReactElement<{
    ref?: React.Ref<HTMLDivElement>;
    className?: string;
  }>;
  delay?: number;
  stagger?: number;
  duration?: number;
  y?: number;
  start?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

// export default function CardsReveal({
//   children,
//   delay = 0,
//   stagger = 0.15,
//   duration = 0.4,
//   y = 48,
//   start = 'top 80%',
//   triggerRef,
// }: CardsRevealProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const playedRef = useRef(false); // survives StrictMode's mount-cleanup-mount cycle

//   useGSAP(
//     () => {
//       if (!containerRef.current) return;

//       const cards = Array.from(containerRef.current.children);

//       // Container itself no longer needs to be hidden/shown — only the cards do.
//       gsap.set(containerRef.current, { autoAlpha: 1 });
//       gsap.set(cards, { autoAlpha: 0, y });

//       gsap.to(cards, {
//         autoAlpha: 1,
//         y: 0,
//         duration,
//         stagger,
//         delay,
//         ease: 'power4.out',
//         clearProps: 'transform',
//         scrollTrigger: {
//           trigger: triggerRef?.current ?? containerRef.current,
//           start,
//           once: true,
//         },
//         onStart: () => {
//           playedRef.current = true;
//         },
//       });
//     },
//     { scope: containerRef, dependencies: [delay, stagger, duration, y, start] },
//   );

//   // No permanent Tailwind opacity-0 class — GSAP fully owns visibility.
//   return React.cloneElement(children, { ref: containerRef });
// }

export default function CardsReveal({
  children,
  delay = 0,
  stagger = 0.15,
  duration = 0.4,
  y = 48,
  start = 'top 80%',
  triggerRef,
}: CardsRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cards = Array.from(containerRef.current.children);

      gsap.set(containerRef.current, { autoAlpha: 1 });

      // StrictMode's second mount: already played once, just force-show — don't re-hide and wait on a ScrollTrigger that already passed.
      if (playedRef.current) {
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(cards, { autoAlpha: 0, y });

      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration,
        stagger,
        delay,
        ease: 'power4.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: triggerRef?.current ?? containerRef.current,
          start,
          once: true,
        },
        onStart: () => {
          playedRef.current = true;
        },
      });
    },
    { scope: containerRef, dependencies: [delay, stagger, duration, y, start] },
  );

  return React.cloneElement(children, { ref: containerRef });
}
