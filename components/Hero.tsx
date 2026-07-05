"use client"
import Badge from "@/app/components/neonblade-ui/badge"
import CornerCutButton from "@/app/components/neonblade-ui/corner-cut-button"
import { DatalinesWithGrid } from "@/app/components/neonblade-ui/datalines-with-grid"
import GlitchText from "@/app/components/neonblade-ui/glitch-text"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Image from "next/image"

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
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

      // subtle ambient drift on the glow blobs, runs forever
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
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
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

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
        <div className="hero-badge">
          <Badge
            color="green"
            size="md"
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
          <h1 className="hero-heading bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-6xl font-extrabold text-transparent md:text-7xl lg:text-8xl">
            <GlitchText mode="hover">Invade Gaming Cafe</GlitchText>
          </h1>
          <p className="hero-subtext mx-auto mt-6 max-w-xl text-lg font-normal text-[#B6B6B6]">
            Laid-back hangout featuring PC and PlayStation games, plus racing
            simulators and VR options.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="hero-cta">
            <CornerCutButton color="cyan" showArrow hoverEffect="shift">
              Book Now
            </CornerCutButton>
          </div>
          <div className="hero-cta">
            <CornerCutButton
              color="green"
              variant="ghost"
              hoverEffect="pulse"
              glowIntensity="high"
            >
              View Pricing
            </CornerCutButton>
          </div>
        </div>
      </div>
    </section>
  )
}
