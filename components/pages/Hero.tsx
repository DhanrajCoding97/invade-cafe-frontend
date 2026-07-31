'use client';
import Badge from '@/app/components/neonblade-ui/badge';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import { DatalinesWithGrid } from '@/app/components/neonblade-ui/datalines-with-grid';
import { useEffect, useState } from 'react';

import Image from 'next/image';

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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
      className='relative min-h-[94dvh] w-full overflow-hidden bg-black sm:min-h-dvh'
    >
      <div className='pointer-events-none absolute -top-40 -left-40 z-0 h-125 w-125 rounded-full bg-cyan-500/20 blur-[120px]' />
      <div className='pointer-events-none absolute -right-40 -bottom-40 z-0 h-150 w-150 rounded-full bg-fuchsia-500/20 blur-[130px]' />
      <DatalinesWithGrid
        lineColor='#38FA14'
        shadowColor='#071F02'
        cellSize={isMobile ? 40 : 60}
        maxLines={isMobile ? 4 : 8}
        baseSpeed={2}
        lineLength={isMobile ? 80 : 120}
        spawnProbability={isMobile ? 0.03 : 0.04}
        bgGridColor='rgba(0,255,102,0.06)'
        overlay
        isMobile={isMobile}
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
              src={'/headerIcon.svg'}
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
          <span className='line-mask'>
            <span
              className='line-inner text-white  text-[clamp(0.8rem,2vw,1.125rem)]'
              style={{ animationDelay: '0.4s' }}
            >
              Laid-back hangout featuring PC and PlayStation games, plus racing
              simulators and VR options.
            </span>
          </span>
        </div>
        <div className=' mt-10 flex w-full flex-col items-center justify-center gap-4 xs:flex-row'>
          <CornerCutButton
            className=' hero-cta-book-now'
            onClick={() => {
              document.querySelector('#booking')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
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
            onClick={() => {
              document.querySelector('#pricing')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
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
