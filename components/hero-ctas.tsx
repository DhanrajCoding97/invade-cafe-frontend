'use client';
import dynamic from 'next/dynamic';

const CornerCutButton = dynamic(
  () => import('@/app/components/neonblade-ui/corner-cut-button'),
  {
    ssr: false,
  },
);
export default function HeroCtas() {
  return (
    <div className='mt-8 sm:mt-10 flex w-full flex-col items-center justify-center gap-4 xs:flex-row'>
      <CornerCutButton
        className='hero-cta-book-now'
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
        className='hero-cta-pricing min-h-13.5 text-[15px] font-semibold tracking-[0.08em]'
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
  );
}
