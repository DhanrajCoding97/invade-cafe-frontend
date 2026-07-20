'use client';
import { services } from '@/types';
import NeonGlowCornerCutCard from '@/app/components/neonblade-ui/neon-glow-corner-cut-card';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GsapTextAnimation from './GsapTextAnimation';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowLineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));

  // useGSAP(
  //   () => {
  //     if (!sectionRef.current) return;
  //     const tl = tlRef.current;

  //     // Non-text pieces get added directly, positioned relative to each other
  //     tl.fromTo(
  //       eyebrowRef.current,
  //       { autoAlpha: 0, y: 20 },
  //       { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
  //       0, // starts at t=0 of the sequence
  //     ).fromTo(
  //       badgeRef.current,
  //       { autoAlpha: 0, y: 20 },
  //       { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power4.inOut' },
  //       '-=0.4', // slightly overlaps whatever's already been added at this point
  //     );

  //     // Cards, same shared timeline
  //     const cards = cardsRef.current?.children;
  //     if (cards) {
  //       gsap.set(cards, { autoAlpha: 0, y: 48 });
  //       tl.to(
  //         cards,
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           delay: 0.3,
  //           duration: 0.6,
  //           ease: 'power4.out',
  //           stagger: 0.3,
  //         },
  //         '>-0.1',
  //       );
  //     }

  //     // Single ScrollTrigger drives the whole timeline
  //     ScrollTrigger.create({
  //       trigger: sectionRef.current,
  //       start: 'top 70%',
  //       once: true,
  //       onEnter: () => tl.play(),
  //     });
  //   },
  //   { scope: sectionRef },
  // );
  const linesRef = useRef<{
    eyebrowText?: HTMLElement[];
    heading?: HTMLElement[];
    desc?: HTMLElement[];
  }>({});

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const tl = tlRef.current;
      const lines = linesRef.current;

      // Wait for fonts so SplitText line breaks (and thus trigger start
      // positions) are computed against final layout — matters most on
      // mobile where font swap shifts height proportionally more.
      document.fonts.ready.then(() => {
        tl.clear();

        tl.addLabel('eyebrowStart', 0)
          .fromTo(
            eyebrowLineRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
            'eyebrowStart',
          )
          .to(
            lines.eyebrowText ?? [],
            { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' },
            'eyebrowStart',
          )

          .addLabel('headingStart', '-=0.3')
          .to(
            lines.heading ?? [],
            { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' },
            'headingStart',
          )

          .addLabel('descStart', '-=0.4')
          .to(
            lines.desc ?? [],
            { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' },
            'descStart',
          )

          .addLabel('badgeStart', '-=0.3')
          .fromTo(
            badgeRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power4.inOut' },
            'badgeStart',
          );

        const cards = cardsRef.current?.children;
        if (cards) {
          gsap.set(cards, { autoAlpha: 0, y: 48 });
          tl.addLabel('cardsStart', '-=0.1').to(
            cards,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power4.out',
              stagger: 0.3,
            },
            'cardsStart',
          );
        }

        // Single ScrollTrigger drives the whole sequence
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
          onEnter: () => tl.play(),
        });
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
            ref={eyebrowLineRef}
            className='h-px w-8 bg-[#00d4ff]  invisible opacity-0'
          />
          <GsapTextAnimation
            mode='controlled'
            onLinesReady={(lines) => {
              linesRef.current.eyebrowText = lines;
            }}
          >
            <span className='text-[10px] leading-3.75 text-[#00d4ff] '>
              WHAT WE OFFER
            </span>
          </GsapTextAnimation>
        </div>
        {/* main title */}
        <GsapTextAnimation
          mode='controlled'
          onLinesReady={(lines) => {
            linesRef.current.heading = lines;
          }}
        >
          <h1 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              SERVICES
            </span>
          </h1>
        </GsapTextAnimation>
        {/* description */}
        <GsapTextAnimation
          mode='controlled'
          onLinesReady={(lines) => {
            linesRef.current.desc = lines;
          }}
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
