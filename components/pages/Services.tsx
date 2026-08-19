'use client';
import { useRef } from 'react';
import { services } from '@/types';
import dynamic from 'next/dynamic';
const NeonGlowCornerCutCard = dynamic(
  () => import('@/app/components/neonblade-ui/neon-glow-corner-cut-card'),
  {
    ssr: false,
  },
);
import LineReveal from '../gsap/LineReveal';
import TextReveal from '../gsap/TextReveal';
import CardsReveal from '../gsap/CardReveal';
import { FriesIcon } from '../svgs';

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id='services'
      ref={sectionRef}
      className='px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py:16 lg:py-20'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          {/* <LineReveal triggerRef={sectionRef} delay={0}>
          </LineReveal> */}
          <div className='h-px w-8 bg-[#00d4ff]' />
          {/* <TextReveal triggerRef={sectionRef} delay={0.15}></TextReveal> */}
          <span className='text-[10px] leading-3.75 text-[#00d4ff] '>
            WHAT WE OFFER
          </span>
        </div>
        {/* main title */}
        <h2 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
          <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            SERVICES
          </span>
        </h2>
        {/* <TextReveal triggerRef={sectionRef} delay={0.25}>
        </TextReveal> */}
        {/* description */}
        {/* <TextReveal triggerRef={sectionRef} delay={0.55}>
        </TextReveal> */}
        {/* Everything you need for the ultimate gaming experience. */}
        <p className='py-2 max-w-[80ch] text-left text-[clamp(0.78rem,2.2vw,1.125rem)] leading-[1.65] text-[#bcbcbc]'>
          From high-performance gaming PCs running the latest esports titles to
          PS5 consoles, immersive VR headsets, and full sim racing rigs with
          force-feedback wheels, Invade Gaming Cafe brings every major gaming
          setup under one roof. No need to own expensive hardware — just walk
          in, pick your station, and start playing within minutes.
        </p>
        {/* snacks badge */}
        {/* <LineReveal triggerRef={sectionRef} delay={0.65} duration={0.4}>
        </LineReveal> */}
        <div className='flex justify-start pt-2'>
          <span className='inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-400/5 px-4 py-1.5 text-xs text-green-400'>
            <FriesIcon className='h-4 w-4' /> Snacks & drinks available on-site
          </span>
        </div>
        {/* <CardsReveal triggerRef={sectionRef} delay={0.85} stagger={0.45}>
        </CardsReveal> */}
        <div className='mt-8 md:mt-10 lg:mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 '>
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
