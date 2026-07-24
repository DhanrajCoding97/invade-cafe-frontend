
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
const Gallery = dynamic(() => import('@/components/pages/Gallery'), {
  loading: () => <GallerySkeleton />,
});
export default async function Page() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <Gallery />
      <TestimonialSection />
      <BookingSection />
      <Contact />
      <Separator />
      {/* <Footer /> */}
    </>
  );
}
