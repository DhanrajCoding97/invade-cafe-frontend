'use client';
import PricingCard from '@/app/components/neonblade-ui/neon-glow-corner-cut-card/PricingCard';
import { useRouter } from 'next/navigation';
import { VrIcon } from './svgs';
import { PsIcon } from './svgs';
import { RacingSimIcon } from './svgs';
import { PcIcon } from './svgs';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GsapTextAnimation from './GsapTextAnimation';

gsap.registerPlugin(ScrollTrigger);

export default function PricingSection() {
  const router = useRouter();

  const goToBooking = (
    device: string,
    extra?: Record<string, string | number>,
  ) => {
    const params = new URLSearchParams({
      device,
      ...(extra as Record<string, string>),
    });
    router.push(`/?${params.toString()}#booking`);
  };

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
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
            duration: 0.4,
            ease: 'power4.out',
            stagger: 0.3,
          },
          '>+0.6',
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
      id='pricing'
      ref={sectionRef}
      className='bg-black py-16 sm:py-20 lg:py-24'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          <div ref={eyebrowRef} className='h-px w-8 bg-[#00d4ff]' />
          <GsapTextAnimation
            animateOnScroll={false} // irrelevant now — timeline prop takes over
            delay={0}
            timeline={tlRef.current}
            position='<' // starts alongside the eyebrow line
          >
            <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
              WHAT IT COSTS
            </span>
          </GsapTextAnimation>
        </div>
        {/* main title */}
        {/* <GsapTextAnimation
          animateOnScroll={false}
          delay={0}
          timeline={tlRef.current}
          position='-=0.3' // starts slightly before the previous item finishes
        >
          <h1 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'></span>
          </h1>
        </GsapTextAnimation> */}
        <GsapTextAnimation
          animateOnScroll={false}
          delay={0}
          timeline={tlRef.current}
          position='-=0.3' // starts slightly before the previous item finishes
        >
          <h1 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              Pricing
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
            className='mx-auto text-left text-[clamp(0.75rem,2vw,1.125rem)] text-[#bcbcbc]'
          >
            Simple rates, no hidden fees. Pick your setup and start playing.
          </p>
        </GsapTextAnimation>
        <div
          ref={cardsRef}
          className='mt-12 grid w-full max-w-6xl grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4'
        >
          {/* PC Gaming */}
          <PricingCard
            onBook={() => goToBooking('pc')}
            icon={<PcIcon className='h-16 w-16' />}
            title='PC gaming'
            subtitle='Per hour'
            price={80}
            currency='₹'
            priceUnit='/hr'
            pricingMode='fixed'
            accentColor='cyan'
          />

          {/* PS5 — featured */}
          <PricingCard
            icon={<PsIcon className='h-16 w-16 text-white' />}
            title='PS5'
            subtitle='Price scales with players'
            pricingMode='per-player'
            playerPriceMap={{ 1: 100, 2: 160, 3: 240, 4: 300 }}
            pricePerPlayer={100}
            minPlayers={1}
            maxPlayers={4}
            currency='₹'
            priceUnit='/hr'
            featured
            featuredLabel='Most popular'
            accentColor='cyan'
            onBook={({ players }) =>
              goToBooking('ps5', { players: players ?? 1 })
            }
          />

          {/* Racing cockpit — tiered */}
          <PricingCard
            icon={<RacingSimIcon className='h-16 w-16' />}
            title='Racing cockpit'
            subtitle='Single or double rig'
            pricingMode='tiered'
            tiers={[
              { label: 'Single Player', price: 150 },
              { label: 'Multiplayer', price: 300 },
            ]}
            currency='₹'
            accentColor='cyan'
            onBook={({ tier }) =>
              goToBooking('racing', { tier: tier ?? 'Single Player' })
            }
          />

          {/* PSVR */}
          <PricingCard
            icon={<VrIcon className='h-16 w-16 text-white' />}
            title='PSVR'
            subtitle='Per hour'
            price={200}
            currency='₹'
            priceUnit='/hr'
            pricingMode='fixed'
            accentColor='cyan'
            onBook={() => goToBooking('vr')}
          />
        </div>
      </div>
    </section>
  );
}
