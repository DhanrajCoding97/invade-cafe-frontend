// 'use client';
import Badge from '@/app/components/neonblade-ui/badge';
import GridLinesBackground from '../grid-lines-background';
import HeroCtas from '../hero-ctas';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section
      id='hero'
      className='relative min-h-[100dvh] w-full overflow-hidden bg-black sm:min-h-dvh'
    >
      {/* <div
        className='absolute inset-0 z-0'
        style={{
          background: '#000000',
          backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
      `,
          backgroundSize: '40px 40px',
        }}
      /> */}
      <GridLinesBackground />
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
              priority
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
          {/* Text-safety scrim — sits behind heading+subtext only
<div className='pointer-events-none absolute -top-40 -left-40 z-0 h-125 w-125 rounded-full bg-cyan-500/20 blur-[120px]' />
      <div className='pointer-events-none absolute -right-40 -bottom-40 z-0 h-150 w-150 rounded-full bg-fuchsia-500/20 blur-[130px]' />
 <div
            className='pointer-events-none absolute inset-0 -z-10 rounded-[3rem] blur-2xl'
            style={{
              background:
                'radial-gradient(ellipse 100% 80% at center, rgba(0,0,0,0.65) 0%, transparent 75%)',
            }}
          />

 */}

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
        <HeroCtas />
      </div>
    </section>
  );
}
