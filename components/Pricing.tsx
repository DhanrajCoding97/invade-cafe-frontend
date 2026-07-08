"use client"
import PricingCard from "@/app/components/neonblade-ui/neon-glow-corner-cut-card/PricingCard"
import { useRouter } from "next/navigation"
import { VrIcon } from "./svgs"
import { PsIcon } from "./svgs"
import { RacingSimIcon } from "./svgs"
import { PcIcon } from "./svgs"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export default function PricingSection() {
  const router = useRouter()

  const goToBooking = (
    device: string,
    extra?: Record<string, string | number>
  ) => {
    const params = new URLSearchParams({
      device,
      ...(extra as Record<string, string>),
    })
    router.push(`/?${params.toString()}#booking`)
  }

  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  // gsap scrollTrigger animation
  useGSAP(
    () => {
      gsap.from([eyebrowRef.current, titleRef.current, descRef.current], {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      })

      const cards = cardsRef.current?.children
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          y: 50,
          duration: 0.4,
          delay: 0.6,
          ease: "power2.inOut",
          stagger: 0.33,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        })
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="min-h-screen bg-black px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* sub title */}
        <div ref={eyebrowRef} className="my-4 flex items-center gap-4">
          <div className="h-px w-8 bg-[#00d4ff]" />
          <span className="text-[10px] leading-3.75 text-[#00d4ff]">
            WHAT IT COSTS
          </span>
        </div>
        {/* main title */}
        <h2
          ref={titleRef}
          className="mb-2 bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-left text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold text-transparent"
        >
          Pricing
        </h2>
        {/* description */}
        <p ref={descRef} className="mx-auto text-left text-base text-[#9a9a9a]">
          Simple rates, no hidden fees. Pick your setup and start playing.
        </p>
        <div
          ref={cardsRef}
          className="grid w-full max-w-6xl grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* PC Gaming */}
          <PricingCard
            onBook={() => goToBooking("pc")}
            icon={<PcIcon className="h-16 w-16" />}
            title="PC gaming"
            subtitle="Per hour"
            price={80}
            currency="₹"
            priceUnit="/hr"
            pricingMode="fixed"
            accentColor="cyan"
          />

          {/* PS5 — featured */}
          <PricingCard
            icon={<PsIcon className="h-16 w-16 text-white" />}
            title="PS5"
            subtitle="Price scales with players"
            pricingMode="per-player"
            playerPriceMap={{ 1: 100, 2: 160, 3: 240, 4: 300 }}
            pricePerPlayer={100}
            minPlayers={1}
            maxPlayers={4}
            currency="₹"
            priceUnit="/hr"
            featured
            featuredLabel="Most popular"
            accentColor="cyan"
            onBook={({ players }) =>
              goToBooking("ps5", { players: players ?? 1 })
            }
          />

          {/* Racing cockpit — tiered */}
          <PricingCard
            icon={<RacingSimIcon className="h-16 w-16" />}
            title="Racing cockpit"
            subtitle="Single or double rig"
            pricingMode="tiered"
            tiers={[
              { label: "Single Player", price: 150 },
              { label: "Multiplayer", price: 300 },
            ]}
            currency="₹"
            accentColor="cyan"
            onBook={({ tier }) =>
              goToBooking("racing", { tier: tier ?? "Single Player" })
            }
          />

          {/* PSVR */}
          <PricingCard
            icon={<VrIcon className="h-16 w-16 text-white" />}
            title="PSVR"
            subtitle="Per hour"
            price={200}
            currency="₹"
            priceUnit="/hr"
            pricingMode="fixed"
            accentColor="cyan"
            onBook={() => goToBooking("vr")}
          />
        </div>
      </div>
    </section>
  )
}
