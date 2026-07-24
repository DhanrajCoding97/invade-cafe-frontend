'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText, ScrollTrigger);

type TextRevealProps = {
  children: React.ReactElement<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
  }>;
  delay?: number;
  triggerRef?: React.RefObject<HTMLElement | null>;
  start?: string; 
};

export default function TextReveal({
  children,
  delay = 0,
  triggerRef,
  start = 'top 80%',
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const split = SplitText.create(containerRef.current, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line++',
      });

      gsap.set(split.lines, { y: '100%' });
      gsap.set(containerRef.current, { opacity: 1 }); // reveal wrapper, lines still masked

      gsap.to(split.lines, {
        y: '0%',
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        delay,
        scrollTrigger: {
          trigger: triggerRef?.current ?? containerRef.current,
          start,
          once: true,
        },
      });

      return () => split.revert();
    },
    { scope: containerRef, dependencies: [delay, start] },
  );

  return React.cloneElement(children, {
    ref: containerRef,
    className: [children.props.className, 'opacity-0'].filter(Boolean).join(' '),
  });
}