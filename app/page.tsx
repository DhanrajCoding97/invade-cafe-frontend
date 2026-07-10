import HeroSection from "@/components/Hero"
import ServicesSection from "@/components/Services"
// import ReviewsSection from "@/components/Reviews"
import TestimonialSection from "@/components/Reviews"
import PricingSection from "@/components/Pricing"
import GallerySection from "@/components/Gallery"
import Contact from "@/components/Contact"
export default function Page() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <TestimonialSection />
      <GallerySection />
      <Contact />
    </>
  )
}
