// import React, { useRef } from 'react';
// import gsap from 'gsap';
// import { SplitText } from 'gsap/SplitText';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useGSAP } from '@gsap/react';

// gsap.registerPlugin(SplitText, ScrollTrigger);

// type GsapTextAnimationProps = {
//   children: React.ReactElement<{
//     ref?: React.Ref<HTMLElement>;
//     className?: string;
//   }>;
//   animateOnScroll: boolean;
//   delay: number;
//   triggerRef?: React.RefObject<HTMLElement | null>;
//   timeline?: gsap.core.Timeline; // when provided, this component adds itself here instead of creating its own trigger
//   position?: string | number; // GSAP timeline position param, e.g. '<', '-=0.3', 0.5
//   completeLabel?: string;
// };

// export default function GsapTextAnimation({
//   children,
//   animateOnScroll = true,
//   delay = 0,
//   triggerRef,
//   timeline,
//   position,
//   completeLabel,
// }: GsapTextAnimationProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const elementRef = useRef<HTMLElement[]>([]);
//   const splitRef = useRef<SplitText[]>([]);
//   const lines = useRef<HTMLElement[]>([]);

//   useGSAP(
//     () => {
//       if (!containerRef.current) return;
//       splitRef.current = [];
//       elementRef.current = [];
//       lines.current = [];

//       let elements: HTMLElement[] = [];
//       if (containerRef.current.hasAttribute('data-copy-wrapper')) {
//         elements = Array.from(containerRef.current.children) as HTMLElement[];
//       } else {
//         elements = [containerRef.current];
//       }

//       elements.forEach((element) => {
//         elementRef.current.push(element);

//         const split = SplitText.create(element, {
//           type: 'lines',
//           mask: 'lines',
//           linesClass: 'line++',
//         });

//         splitRef.current.push(split);

//         const computedStyle = window.getComputedStyle(element);
//         const textIndent = computedStyle.textIndent;
//         if (textIndent && textIndent !== '0px') {
//           if (split.lines.length > 0) {
//             (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
//           }
//           element.style.textIndent = '0';
//         }
//         lines.current.push(...(split.lines as HTMLElement[]));
//       });

//       gsap.set(lines.current, { y: '100%' });
//       gsap.set(elements, { autoAlpha: 1 });

//       const animationProps = {
//         y: '0%',
//         duration: 1,
//         stagger: 0.1,
//         ease: 'power4.out',
//       };

//       if (timeline) {
//         // Parent owns the ScrollTrigger — just slot our reveal into their sequence
//         const tween = timeline.to(
//           lines.current,
//           animationProps,
//           position ?? '>',
//         );

//         if (completeLabel) {
//           timeline.addLabel(completeLabel, tween.endTime(false));
//         }
//       } else if (animateOnScroll) {
//         gsap.to(lines.current, {
//           ...animationProps,
//           delay,
//           scrollTrigger: {
//             trigger: triggerRef?.current ?? containerRef.current,
//             start: 'top 70%',
//             once: true,
//           },
//         });
//       } else {
//         gsap.to(lines.current, { ...animationProps, delay });
//       }

//       return () => {
//         splitRef.current.forEach((split) => split?.revert());
//       };
//     },
//     {
//       scope: containerRef,
//       dependencies: [animateOnScroll, delay, timeline, position],
//     },
//   );

//   const hiddenClass = 'invisible opacity-0';

//   if (React.Children.count(children) === 1) {
//     return React.cloneElement(children, {
//       ref: containerRef,
//       className: [children.props.className, hiddenClass]
//         .filter(Boolean)
//         .join(' '),
//     });
//   }

//   return (
//     <div ref={containerRef} data-copy-wrapper='true' className={hiddenClass}>
//       {children}
//     </div>
//   );
// }

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
  //                lines and hands them back via onLinesReady
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
      splitRef.current = [];
      lines.current = [];

      let elements: HTMLElement[] = [];
      if (containerRef.current.hasAttribute('data-copy-wrapper')) {
        elements = Array.from(containerRef.current.children) as HTMLElement[];
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        const split = SplitText.create(element, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'line++',
        });
        splitRef.current.push(split);

        const textIndent = window.getComputedStyle(element).textIndent;
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
        // Don't animate or create a ScrollTrigger — just hand the lines to the
        // parent, which owns the single shared timeline + ScrollTrigger.
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

      return () => {
        splitRef.current.forEach((split) => split?.revert());
      };
    },
    { scope: containerRef, dependencies: [mode, delay] },
  );

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
