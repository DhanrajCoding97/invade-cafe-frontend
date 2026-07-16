'use client';
import { REVEAL } from '@/lib/animation-presets';
import { services, Service } from '@/types';
import NeonGlowCornerCutCard from '@/app/components/neonblade-ui/neon-glow-corner-cut-card';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GsapTextAnimation from './GsapTextAnimation';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const tl = tlRef.current;

      // Non-text pieces get added directly, positioned relative to each other
      tl.fromTo(
        eyebrowRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
        0, // starts at t=0 of the sequence
      ).fromTo(
        badgeRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power4.inOut' },
        '-=0.4', // slightly overlaps whatever's already been added at this point
      );

      // Cards, same shared timeline
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.set(cards, { autoAlpha: 0, y: 48 });
        tl.to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            delay: 0.3,
            duration: 0.6,
            ease: 'power4.out',
            stagger: 0.3,
          },
          '>-0.1',
        );
      }

      // Single ScrollTrigger drives the whole timeline
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => tl.play(),
      });
    },
    { scope: sectionRef },
  );
  return (
    <section
      id='services'
      ref={sectionRef}
      className='bg-black py-16 sm:py-20 lg:py-24'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          <div
            ref={eyebrowRef}
            className='h-px w-8 bg-[#00d4ff]  invisible opacity-0'
          />
          <GsapTextAnimation
            animateOnScroll={false} // irrelevant now — timeline prop takes over
            delay={0}
            timeline={tlRef.current}
            position='<' // starts alongside the eyebrow line
          >
            <span className='text-[10px] leading-3.75 text-[#00d4ff] '>
              WHAT WE OFFER
            </span>
          </GsapTextAnimation>
        </div>
        {/* main title */}
        <GsapTextAnimation
          animateOnScroll={false}
          delay={0}
          timeline={tlRef.current}
          position='-=0.3' // starts slightly before the previous item finishes
        >
          <h1 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              SERVICES
            </span>
          </h1>
        </GsapTextAnimation>
        {/* description */}
        <GsapTextAnimation
          animateOnScroll={false}
          delay={0}
          timeline={tlRef.current}
          position='-=0.4' // starts slightly before the previous item finishes
        >
          <p
            ref={descRef}
            className='mx-auto mb-4 text-left text-[clamp(0.75rem,2vw,1.125rem)] text-[#bcbcbc]'
          >
            Everything you need for the ultimate gaming experience.
          </p>
        </GsapTextAnimation>
        {/* snacks badge */}
        <div
          ref={badgeRef}
          className='mb-12 flex justify-start invisible opacity-0'
        >
          <span className='inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-400/5 px-4 py-1.5 text-xs text-green-400'>
            🍿 Snacks & drinks available on-site
          </span>
        </div>

        <div
          ref={cardsRef}
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 '
        >
          {services.map((service) => (
            <NeonGlowCornerCutCard
              key={service.id}
              title={service.title}
              imageSrc={service.imageSrc}
              imageAlt={service.imageAlt}
              colorA={service.color}
              features={service.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
