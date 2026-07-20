import React, { useRef } from 'react';
import GsapTextAnimation from './GsapTextAnimation';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger);

type ContactLinkProps = {
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
  accent?: string;
  className?: string;
  timeline?: gsap.core.Timeline;
  position?: string | number;
};

export const ContactLink = React.forwardRef<
  HTMLAnchorElement,
  ContactLinkProps
>(function ContactLink(
  { icon, href, children, accent = '#00d4ff', className, timeline, position },
  ref,
) {
  const iconRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!iconRef.current) return;

      gsap.set(iconRef.current, { autoAlpha: 0, y: 20, scale: 0.8 });

      if (timeline) {
        timeline.to(
          iconRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power4.out',
          },
          position ?? '>',
        );
      } else {
        // fallback if ContactLink is ever used without a shared timeline
        gsap.to(iconRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power4.out',
        });
      }
    },
    { scope: iconRef, dependencies: [timeline, position] },
  );
  return (
    <Link
      ref={ref}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={[
        'group flex flex-row items-center gap-3 text-xs sm:text-sm text-[#bcbcbc] transition-colors hover:text-[#00D4FF]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* <span
        ref={iconRef}
        className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110'
        style={{ background: `${accent}1a`, color: accent }}
      >
        {icon}
      </span> */}
      <span
        ref={iconRef}
        className='invisible flex h-8 w-8 shrink-0 items-center justify-center rounded-full'
        style={{ background: `${accent}1a`, color: accent }}
      >
        {icon}
      </span>

      <GsapTextAnimation>
        <span>{children}</span>
      </GsapTextAnimation>
    </Link>
  );
});
