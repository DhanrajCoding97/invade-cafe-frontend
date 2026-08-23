import HeroSection from '@/components/pages/Hero';
import GamesCatalogSection from '@/components/pages/GamesCatalogSection';
import ServicesSection from '@/components/pages/Services';
import TestimonialSection from '@/components/pages/Reviews';
import PricingSection from '@/components/pages/Pricing';
import GallerySection from '@/components/pages/Gallery';
import Contact from '@/components/pages/Contact';
import BookingSection from '@/components/pages/Booking';
import { Footer } from '@/components/pages/Footer';
export default async function Page() {
  return (
    <>
      <HeroSection />
      <div
        className='relative min-h-screen w-full bg-black'
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(0,243,255,0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(0,243,255,0.06) 1px,
              transparent 1px
            ),
            radial-gradient(
              ellipse 60% 50% at 50% 30%,
              rgba(0,212,255,0.06) 0%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 50% 40% at 80% 80%,
              rgba(254,17,255,0.04) 0%,
              transparent 70%
            )
          `,
          backgroundSize: '60px 50px, 50px 50px, 100% 100%, 100% 100%',
        }}
      >
        <div className='relative'>
          <ServicesSection />
          <GamesCatalogSection />
          <PricingSection />
          <GallerySection />
          <TestimonialSection />
          <BookingSection />
          <Contact />
          <Footer />
        </div>
      </div>
    </>
  );
}
