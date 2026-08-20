import HeroBackground from '../hero-background';
import HeroCtas from '../hero-ctas';
import Image from 'next/image';
export default function HeroSection() {
  return (
    <section
      id='hero'
      className='relative min-h-dvh w-full overflow-hidden bg-black sm:min-h-dvh'
    >
      <div
        className='absolute inset-0 z-0'
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%), #000000',
        }}
      />
      <HeroBackground />

      <div className='absolute inset-0 z-10 flex flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-12 lg:px-8 lg:py-20'>
        <div className='hero-badge mb-4 sm:mb-2 inline-flex items-center gap-2 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#22C55E]'>
          <span className='relative flex h-2 w-2'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75' />
            <span className='relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]' />
          </span>
          <Image
            priority
            alt='controller icon'
            src='/headerIcon.svg'
            height={16}
            width={16}
            style={{ width: 16, height: 16 }}
          />
          Console Rentals Now Available
        </div>

        <div className='relative mt:6 sm:mt-7 min-w-[90dvw] sm:max-w-3xl text-center'>
          <h1 className='w-full text-[clamp(2.25rem,8vw,3.75rem)] font-extrabold leading-[1.05]'>
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
            <p
              className='line-inner text-center pt-4 max-w-[80ch]  text-[clamp(0.8rem,2.2vw,1.125rem)] leading-normal sm:leading-[1.65] text-[#bcbcbc]'
              style={{ animationDelay: '0.4s' }}
            >
              Laid-back hangout featuring PC and PlayStation games, plus racing
              simulators and VR options.
            </p>
          </span>
        </div>
        <HeroCtas />
      </div>
    </section>
  );
}
