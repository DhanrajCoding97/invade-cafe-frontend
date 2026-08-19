'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

type LineRevealProps = {
  children: React.ReactElement<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
  }>;
  delay?: number;
  duration?: number;
  start?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

// export default function LineReveal({
//   children,
//   delay = 0,
//   duration = 0.5,
//   start = 'top 80%',
//   triggerRef,
// }: LineRevealProps) {
//   const elRef = useRef<HTMLDivElement>(null);

//   useGSAP(
//     () => {
//       if (!elRef.current) return;

//       gsap.fromTo(
//         elRef.current,
//         { autoAlpha: 0, y: 20 },
//         {
//           autoAlpha: 1,
//           y: 0,
//           duration,
//           delay,
//           ease: 'power4.inOut',
//           scrollTrigger: {
//             trigger: triggerRef?.current ?? elRef.current,
//             start,
//             once: true,
//           },
//         },
//       );
//     },
//     { scope: elRef, dependencies: [delay, duration, start] },
//   );

//   return React.cloneElement(children, {
//     ref: elRef,
//     className: [children.props.className, 'opacity-0']
//       .filter(Boolean)
//       .join(' '),
//   });
// }
// LineReveal.tsx
export default function LineReveal({
  children,
  delay = 0,
  duration = 0.5,
  start = 'top 80%',
  triggerRef,
}: LineRevealProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!elRef.current) return;
      gsap.set(elRef.current, { autoAlpha: 0, y: 20 }); // hide client-side only, right before animating
      gsap.to(elRef.current, {
        autoAlpha: 1,
        y: 0,
        duration,
        delay,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: triggerRef?.current ?? elRef.current,
          start,
          once: true,
        },
      });
    },
    { scope: elRef, dependencies: [delay, duration, start] },
  );

  return React.cloneElement(children, { ref: elRef }); // no className hack anymore
}
