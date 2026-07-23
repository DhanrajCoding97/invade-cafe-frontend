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
export default async function Page() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <GallerySection />
      <TestimonialSection />
      <BookingSection />
      <Contact />
      <Separator />
      {/* <Footer /> */}
    </>
  );
}
