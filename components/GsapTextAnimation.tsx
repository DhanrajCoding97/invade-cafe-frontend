'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText, ScrollTrigger);

type GsapTextAnimationProps = {
  children: React.ReactElement<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
  }>;
  // 'standalone' = this component owns its own ScrollTrigger (safe for isolated text blocks)
  // 'controlled' = a parent timeline owns the ScrollTrigger; this component just splits
  mode?: 'standalone' | 'controlled';
  delay?: number;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onLinesReady?: (lines: HTMLElement[]) => void;
};

export default function GsapTextAnimation({
  children,
  mode = 'standalone',
  delay = 0,
  triggerRef,
  onLinesReady,
}: GsapTextAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitText[]>([]);
  const lines = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled || !containerRef.current) return;

        splitRef.current = [];
        lines.current = [];

        let elements: HTMLElement[] = [];
        if (containerRef.current.hasAttribute('data-copy-wrapper')) {
          elements = Array.from(containerRef.current.children) as HTMLElement[];
        } else {
          elements = [containerRef.current];
        }

        // Read all textIndents FIRST, before any SplitText writes
        const textIndents = elements.map(
          (el) => window.getComputedStyle(el).textIndent,
        );

        elements.forEach((element, i) => {
          const split = SplitText.create(element, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'line++',
          });
          splitRef.current.push(split);

          const textIndent = textIndents[i];
          if (textIndent && textIndent !== '0px') {
            if (split.lines.length > 0) {
              (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
            }
            element.style.textIndent = '0';
          }
          lines.current.push(...(split.lines as HTMLElement[]));
        });

        gsap.set(lines.current, { y: '100%' });
        gsap.set(elements, { autoAlpha: 1 });

        if (mode === 'controlled') {
          onLinesReady?.(lines.current);
        } else {
          gsap.to(lines.current, {
            y: '0%',
            duration: 1,
            stagger: 0.1,
            ease: 'power4.out',
            delay,
            scrollTrigger: {
              trigger: triggerRef?.current ?? containerRef.current,
              start: 'top 70%',
              once: true,
            },
          });
        }
      });

      return () => {
        cancelled = true;
        splitRef.current.forEach((split) => split?.revert());
      };
    },
    { scope: containerRef, dependencies: [mode, delay] },
  );

  // useGSAP(
  //   () => {
  //     if (!containerRef.current) return;
  //     splitRef.current = [];
  //     lines.current = [];

  //     let elements: HTMLElement[] = [];
  //     if (containerRef.current.hasAttribute('data-copy-wrapper')) {
  //       elements = Array.from(containerRef.current.children) as HTMLElement[];
  //     } else {
  //       elements = [containerRef.current];
  //     }

  //     elements.forEach((element) => {
  //       const split = SplitText.create(element, {
  //         type: 'lines',
  //         mask: 'lines',
  //         linesClass: 'line++',
  //       });
  //       splitRef.current.push(split);

  //       const textIndent = window.getComputedStyle(element).textIndent;
  //       if (textIndent && textIndent !== '0px') {
  //         if (split.lines.length > 0) {
  //           (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
  //         }
  //         element.style.textIndent = '0';
  //       }
  //       lines.current.push(...(split.lines as HTMLElement[]));
  //     });

  //     gsap.set(lines.current, { y: '100%' });
  //     gsap.set(elements, { autoAlpha: 1 });

  //     if (mode === 'controlled') {
  //       // Don't animate or create a ScrollTrigger — just hand the lines to the
  //       // parent, which owns the single shared timeline + ScrollTrigger.
  //       onLinesReady?.(lines.current);
  //     } else {
  //       gsap.to(lines.current, {
  //         y: '0%',
  //         duration: 1,
  //         stagger: 0.1,
  //         ease: 'power4.out',
  //         delay,
  //         scrollTrigger: {
  //           trigger: triggerRef?.current ?? containerRef.current,
  //           start: 'top 70%',
  //           once: true,
  //         },
  //       });
  //     }

  //     return () => {
  //       splitRef.current.forEach((split) => split?.revert());
  //     };
  //   },
  //   { scope: containerRef, dependencies: [mode, delay] },
  // );

  const hiddenClass = 'invisible opacity-0';

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, {
      ref: containerRef,
      className: [children.props.className, hiddenClass]
        .filter(Boolean)
        .join(' '),
    });
  }

  return (
    <div ref={containerRef} data-copy-wrapper='true' className={hiddenClass}>
      {children}
    </div>
  );
}
