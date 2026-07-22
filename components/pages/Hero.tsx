'use client';
import dynamic from 'next/dynamic';
import Badge from '@/app/components/neonblade-ui/badge';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import { DatalinesWithGrid } from '@/app/components/neonblade-ui/datalines-with-grid';
import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenisInstance } from '@/lib/lenisInstance';
import { playSectionTransition } from '@/lib/PageTransition';

// const DatalinesWithGrid = dynamic(
//   () =>
//     import('@/app/components/neonblade-ui/datalines-with-grid').then(
//       (m) => m.DatalinesWithGrid,
//     ),
//   { ssr: false },
// );
import Image from 'next/image';

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <section
      id='hero'
      className='relative min-h-[94vh] w-full overflow-hidden bg-black sm:min-h-screen'
    >
      <div className='glow-cyan pointer-events-none absolute -top-40 -left-40 z-0 h-125 w-125 rounded-full bg-cyan-500/20 blur-[120px]' />
      <div className='glow-fuchsia pointer-events-none absolute -right-40 -bottom-40 z-0 h-150 w-150 rounded-full bg-fuchsia-500/20 blur-[130px]' />
      <DatalinesWithGrid
        lineColor='#38FA14'
        shadowColor='#071F02'
        cellSize={isMobile ? 40 : 60}
        maxLines={isMobile ? 4 : 8}
        baseSpeed={1.5}
        lineLength={isMobile ? 80 : 120}
        spawnProbability={isMobile ? 0.03 : 0.04}
        bgGridColor='rgba(0,255,102,0.06)'
        overlay
      />
      <div className='absolute inset-0 z-10 flex flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-12 lg:px-8 lg:py-20'>
        <div className='hero-badge '>
          <Badge
            responsive
            color='green'
            variant='outline'
            dot='pulse'
            glow={false}
          >
            <Image
              alt='controller icon'
              src={'./headerIcon.svg'}
              height={24}
              width={24}
              style={{ width: 24, height: 24 }}
            />
            Console Rentals Now Available
          </Badge>
        </div>
        <div className='relative mt-8 max-w-3xl text-center '>
          {/* Text-safety scrim — sits behind heading+subtext only */}
          <div
            className='pointer-events-none absolute inset-0 -z-10 rounded-[3rem] blur-2xl'
            style={{
              background:
                'radial-gradient(ellipse 100% 80% at center, rgba(0,0,0,0.65) 0%, transparent 75%)',
            }}
          />
          {/* <GsapTextAnimation delay={0}>
            <h1 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
              <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
                Invade Gaming Cafe
              </span>
            </h1>
          </GsapTextAnimation> */}
          <h1 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
            <span className='line-mask'>
              <span
                className='line-inner bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent'
                style={{ animationDelay: '0.1s' }}
              >
                Invade Gaming Cafe
              </span>
            </span>
          </h1>
          {/* <GsapTextAnimation delay={0.4}>
            <p className='hero-subtext invisible opacity-0  mx-auto mt-2 max-w-xl text-[clamp(0.75rem,2vw,1.125rem)] text-[#bcbcbc] font-normal'>
              Laid-back hangout featuring PC and PlayStation games, plus racing
              simulators and VR options.
            </p>
          </GsapTextAnimation> */}
          <span className='line-mask'>
            <span className='line-inner' style={{ animationDelay: '0.4s' }}>
              Laid-back hangout featuring PC and PlayStation games, plus racing
              simulators and VR options.
            </span>
          </span>
        </div>
        <div className=' mt-10 flex w-full flex-col items-center justify-center gap-4 xs:flex-row'>
          <CornerCutButton
            className=' hero-cta-book-now'
            onClick={() =>
              playSectionTransition(() => {
                getLenisInstance().scrollTo('#booking', {
                  offset: 40,
                });
              })
            }
            color='cyan'
            variant='solid'
            showArrow
            hoverEffect='shift'
            fullWidthOnMobile={true}
          >
            Book Now
          </CornerCutButton>
          <CornerCutButton
            className=' hero-cta-pricing'
            onClick={() =>
              playSectionTransition(() => {
                getLenisInstance().scrollTo('#pricing', {
                  offset: 40,
                });
              })
            }
            color='green'
            variant='ghost'
            hoverEffect='pulse'
            glowIntensity='high'
            fullWidthOnMobile={true}
          >
            View Pricing
          </CornerCutButton>
        </div>
      </div>
    </section>
  );
}
