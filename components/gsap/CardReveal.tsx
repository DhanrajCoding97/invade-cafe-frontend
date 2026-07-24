'use client';

import React,{ useRef } from 'react';
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

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cards = Array.from(containerRef.current.children);

      gsap.set(containerRef.current, {
        autoAlpha: 1,
      });

      gsap.set(cards, {
        autoAlpha: 0,
        y,
      });

      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration,
        stagger,
        delay,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: triggerRef?.current ?? containerRef.current,
          start,
          once: true,
        },
      });
    },
    {
      scope: containerRef,
      dependencies: [delay, stagger, duration, y, start],
    },
  );

  return React.cloneElement(children, {
  ref: containerRef,
  className: [children.props.className, 'opacity-0']
    .filter(Boolean)
    .join(' '),
});

//   return children.type
//     ? children &&
//         ({
//           ...children,
//           props: {
//             ...children.props,
//             ref: containerRef,
//             className: [children.props.className, 'opacity-0']
//               .filter(Boolean)
//               .join(' '),
//           },
//         } as React.ReactElement)
//     : children;
}