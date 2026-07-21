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
ScrollTrigger.config({ ignoreMobileResize: true });

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
  const eyebrowLineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));

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
          );

        const cards = cardsRef.current?.children;
        if (cards) {
          gsap.set(cards, { autoAlpha: 0, y: 48 });
          tl.addLabel('cardsStart', '-=0.05').to(
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
      id='pricing'
      ref={sectionRef}
      className='bg-black py-16 sm:py-20 lg:py-24'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          <div ref={eyebrowLineRef} className='h-px w-8 bg-[#00d4ff]' />
          <GsapTextAnimation
            mode='controlled'
            onLinesReady={(lines) => {
              linesRef.current.eyebrowText = lines;
            }}
          >
            <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
              WHAT IT COSTS
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
              Pricing
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
