'use client';
import { useRef } from 'react';
import { services } from '@/types';
import NeonGlowCornerCutCard from '@/app/components/neonblade-ui/neon-glow-corner-cut-card';
import LineReveal from '../gsap/LineReveal';
import TextReveal from '../gsap/TextReveal';
import CardsReveal from '../gsap/CardReveal';

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
          <LineReveal triggerRef={sectionRef} delay={0}>
            <div className='h-px w-8 bg-[#00d4ff]' />
          </LineReveal>
          <TextReveal triggerRef={sectionRef} delay={0.15}>
            <span className='text-[10px] leading-3.75 text-[#00d4ff] '>
              WHAT WE OFFER
            </span>
          </TextReveal>
        </div>
        {/* main title */}
        <TextReveal triggerRef={sectionRef} delay={0.25}>
          <h1 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              SERVICES
            </span>
          </h1>
        </TextReveal>
        {/* description */}
        <TextReveal triggerRef={sectionRef} delay={0.55}>
          <p className='mx-auto mb-4 text-left text-[clamp(0.8rem,2vw,1.125rem)] text-[#bcbcbc]'>
            Everything you need for the ultimate gaming experience.
          </p>
        </TextReveal>
        {/* snacks badge */}
        <LineReveal triggerRef={sectionRef} delay={0.65} duration={0.4}>
          <div className='flex justify-start invisible opacity-0'>
            <span className='inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-400/5 px-4 py-1.5 text-xs text-green-400'>
              🍿 Snacks & drinks available on-site
            </span>
          </div>
        </LineReveal>
        <CardsReveal triggerRef={sectionRef} delay={0.85} stagger={0.45}>
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
        </CardsReveal>
      </div>
    </section>
  );
}
