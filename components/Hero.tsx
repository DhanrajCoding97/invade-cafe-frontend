"use client"
import Badge from "@/app/components/neonblade-ui/badge"
import CornerCutButton from "@/app/components/neonblade-ui/corner-cut-button"
import { DatalinesWithGrid } from "@/app/components/neonblade-ui/datalines-with-grid"
import GlitchText from "@/app/components/neonblade-ui/glitch-text"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { getLenisInstance } from "@/lib/lenisInstance"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Get the global Lenis instance
    const lenis = getLenisInstance()

    // GSAP animations as normal
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    tl.from(".hero-badge", {
      opacity: 0,
      y: -20,
      duration: 0.6,
    })
      .from(
        ".hero-heading",
        {
          opacity: 0,
          y: 40,
          duration: 0.9,
        },
        "-=0.3"
      )
      .from(
        ".hero-subtext",
        {
          opacity: 0,
          y: 20,
          duration: 0.7,
        },
        "-=0.5"
      )
      .from(
        ".hero-cta",
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.15,
        },
        "-=0.4"
      )

    // Ambient drift
    gsap.to(".glow-cyan", {
      x: 30,
      y: 20,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
    gsap.to(".glow-fuchsia", {
      x: -30,
      y: -20,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    // Cleanup
    return () => {
      ScrollTrigger.killAll // Kill ScrollTrigger on unmount (optional, for clean-up)
    }
  }, [])

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
    >
      <div className="glow-cyan pointer-events-none absolute -top-40 -left-40 z-0 h-125 w-125 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="glow-fuchsia pointer-events-none absolute -right-40 -bottom-40 z-0 h-150 w-150 rounded-full bg-fuchsia-500/20 blur-[130px]" />

      <DatalinesWithGrid
        lineColor="#15b4fe"
        shadowColor="#00ff66"
        cellSize={60}
        maxLines={8}
        baseSpeed={1.5}
        lineLength={120}
        spawnProbability={0.04}
        bgGridColor="rgba(0,255,102,0.06)"
        overlay
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="hero-badge">
          <Badge
            responsive
            color="green"
            variant="outline"
            dot="pulse"
            glow={false}
          >
            <Image
              alt="controller icon"
              src={"./headerIcon.svg"}
              height={24}
              width={24}
            />
            Console Rentals Now Available
          </Badge>
        </div>

        <div className="mt-8 max-w-3xl text-center">
          <h1 className="hero-heading bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold text-transparent">
            Invade Gaming Cafe
            {/* <GlitchText customSpeed="3s" mode="active">
            </GlitchText> */}
          </h1>
          <p className="hero-subtext mx-auto mt-2 max-w-xl text-[clamp(0.75rem,2vw,1.125rem)] font-normal text-[#e1ebe8]">
            Laid-back hangout featuring PC and PlayStation games, plus racing
            simulators and VR options.
          </p>
        </div>

        <div className="hero-cta mt-10 flex w-full flex-col items-center justify-center gap-4 xs:flex-row">
          <CornerCutButton
            color="cyan"
            variant="outline"
            hoverEffect="shift"
            fullWidthOnMobile={true}
          >
            Book Now
          </CornerCutButton>
          <CornerCutButton
            onClick={() => getLenisInstance().scrollTo("#pricing")}
            color="green"
            variant="ghost"
            hoverEffect="pulse"
            glowIntensity="high"
            fullWidthOnMobile={true}
          >
            View Pricing
          </CornerCutButton>
        </div>
      </div>
    </section>
  )
}
