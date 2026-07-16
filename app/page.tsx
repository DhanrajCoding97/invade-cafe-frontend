import HeroSection from '@/components/Hero';
import ServicesSection from '@/components/Services';
// import ReviewsSection from "@/components/Reviews"
import TestimonialSection from '@/components/Reviews';
import PricingSection from '@/components/Pricing';
import GallerySection from '@/components/Gallery';
import Contact from '@/components/Contact';
import BookingSection from '@/components/Booking';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
export default function Page() {
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
      <Footer />
    </>
  );
}
