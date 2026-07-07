"use client"
import HeroSection from "@/components/Hero"
import ServicesSection from "@/components/Services"
import Badge from "./components/neonblade-ui/badge"
import CornerCutButton from "./components/neonblade-ui/corner-cut-button"
import { DatalinesWithGrid } from "./components/neonblade-ui/datalines-with-grid"
import GlitchText from "./components/neonblade-ui/glitch-text"
import Reviews from "@/components/Reviews"
import ReviewsSection from "@/components/Reviews"
import PricingSection from "@/components/Pricing"
// import Badge from "./components/ui/elements/Badge"

export default function Page() {
  return (
    // <section className="relative h-screen w-full overflow-hidden bg-black">
    //   {/* Ambient glow blobs - add these BEFORE the DatalinesWithGrid, or right after, z-0 */}
    //   <div className="pointer-events-none absolute -top-40 -left-40 z-0 h-125 w-125 rounded-full bg-cyan-500/20 blur-[120px]" />
    //   <div className="pointer-events-none absolute -right-40 -bottom-40 z-0 h-150 w-150 rounded-full bg-fuchsia-500/20 blur-[130px]" />

    //   <DatalinesWithGrid
    //     lineColor="#15b4fe"
    //     shadowColor="#00ff66"
    //     cellSize={60}
    //     maxLines={8}
    //     baseSpeed={1.5}
    //     lineLength={120}
    //     spawnProbability={0.04}
    //     bgGridColor="rgba(0,255,102,0.06)"
    //     overlay
    //   />
    //   <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
    //     <Badge
    //       color="green"
    //       size="md"
    //       variant="outline"
    //       dot="pulse"
    //       glow={false}
    //     >
    //       🎮 PC & Console Rentals Now Available
    //     </Badge>
    //     <div className="text-center">
    //       <h1 className="bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-5xl font-extrabold text-transparent">
    //         <GlitchText mode="hover">Invade Gaming Cafe</GlitchText>
    //       </h1>
    //       <span className="mt-2 block text-base leading-relaxed text-[#28F1FF]">
    //         Your Local Gaming Arena
    //       </span>
    //       <p className="my-4 text-lg font-semibold text-[#B6B6B6]">
    //         Laid-back hangout featuring PC and PlayStation games, plus racing
    //         simulators and VR options.
    //       </p>
    //     </div>
    //     <div className="flex items-center justify-center gap-4">
    //       <CornerCutButton color="cyan" showArrow hoverEffect="shift">
    //         Book Now
    //       </CornerCutButton>
    //       <CornerCutButton
    //         color="green"
    //         variant="ghost"
    //         hoverEffect="pulse"
    //         glowIntensity="high"
    //       >
    //         View Pricing
    //       </CornerCutButton>
    //     </div>
    //   </div>
    // </section>

    // <section className="relative h-screen w-full overflow-hidden bg-black">
    //   <div className="pointer-events-none absolute -top-40 -left-40 z-0 h-125 w-125 rounded-full bg-cyan-500/20 blur-[120px]" />
    //   <div className="pointer-events-none absolute -right-40 -bottom-40 z-0 h-150 w-150 rounded-full bg-fuchsia-500/20 blur-[130px]" />

    //   <DatalinesWithGrid
    //     lineColor="#15b4fe"
    //     shadowColor="#00ff66"
    //     cellSize={60}
    //     maxLines={8}
    //     baseSpeed={1.5}
    //     lineLength={120}
    //     spawnProbability={0.04}
    //     bgGridColor="rgba(0,255,102,0.06)"
    //     overlay
    //   />

    //   <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
    //     <Badge
    //       color="green"
    //       size="md"
    //       variant="outline"
    //       dot="pulse"
    //       glow={false}
    //     >
    //       🎮 PC & Console Rentals Now Available
    //     </Badge>
    //     <div className="mt-8 max-w-3xl text-center">
    //       <h1 className="bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-6xl font-extrabold text-transparent md:text-7xl lg:text-8xl">
    //         <GlitchText mode="hover">Invade Gaming Cafe</GlitchText>
    //       </h1>
    //       <p className="mx-auto mt-6 max-w-xl text-lg font-normal text-[#B6B6B6]">
    //         Laid-back hangout featuring PC and PlayStation games, plus racing
    //         simulators and VR options.
    //       </p>
    //     </div>
    //     <div className="mt-10 flex items-center justify-center gap-4">
    //       <CornerCutButton color="cyan" showArrow hoverEffect="shift">
    //         Book Now
    //       </CornerCutButton>
    //       <CornerCutButton
    //         color="green"
    //         variant="ghost"
    //         hoverEffect="pulse"
    //         glowIntensity="high"
    //       >
    //         View Pricing
    //       </CornerCutButton>
    //     </div>
    //   </div>
    // </section>
    <>
      <HeroSection />
      <ServicesSection />
      <ReviewsSection />
      <PricingSection />
    </>
  )
}
