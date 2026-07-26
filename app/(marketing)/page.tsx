
import dynamic from 'next/dynamic';
import HeroSection from '@/components/pages/Hero';
import ServicesSection from '@/components/pages/Services';
// import ReviewsSection from "@/components/Reviews"
import TestimonialSection from '@/components/pages/Reviews';
import PricingSection from '@/components/pages/Pricing';
import GallerySection from '@/components/pages/Gallery';
import Contact from '@/components/pages/Contact';
import BookingSection from '@/components/pages/Booking';
// import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { GallerySkeleton } from '@/components/skeletons/GallerySkeleton';
// const Gallery = dynamic(() => import('@/components/pages/Gallery'), {
//   loading: () => <GallerySkeleton />,
// });
export default async function Page() {
  return (
    <>
      <HeroSection />
      <div className="min-h-screen w-full bg-black relative">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 0.5px, transparent 0.5px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 0.5px, transparent 0.5px),
              radial-gradient(ellipse 60% 50% at 50% 30%, rgba(0,212,255,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 80% 80%, rgba(254,17,255,0.04) 0%, transparent 70%)
            `,
            backgroundSize: '50px 50px, 50px 50px, 100% 100%, 100% 100%',
          }}
        />
        <ServicesSection />
        <PricingSection />
        <GallerySection />
        <TestimonialSection />
        <BookingSection />
        <Contact />

        <Separator />
      </div>
      {/* <Footer /> */}
    </>
  );
}
