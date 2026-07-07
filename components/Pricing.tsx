"use client"
import PricingCard from "@/app/components/neonblade-ui/neon-glow-corner-cut-card/PricingCard"
import { useRouter } from "next/navigation"
import { VrIcon } from "./svgs"
import { PsIcon } from "./svgs"
import { RacingSimIcon } from "./svgs"
import { PcIcon } from "./svgs"
export default function PricingSection() {
  const router = useRouter()
  const handleSubmit = () => {
    console.log("clicked")
    router.push("/#booking")
  }
  return (
    <section className="min-h-screen bg-black px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* sub title */}
        <div
          // ref={eyebrowRef}
          className="my-4 flex items-center gap-4"
        >
          <div className="h-px w-8 bg-[#00d4ff]" />
          <span className="text-[10px] leading-3.75 text-[#00d4ff]">
            WHAT IT COSTS
          </span>
        </div>
        {/* main title */}
        <h2
          //   ref={titleRef}
          className="mb-2 bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-left text-5xl font-extrabold text-transparent"
        >
          Pricing
        </h2>
        {/* description */}
        <p
          //   ref={descRef}
          className="mx-auto text-left text-base text-[#9a9a9a]"
        >
          Simple rates, no hidden fees. Pick your setup and start playing.
        </p>
        <div className="mt-12 grid w-full max-w-6xl grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* PC Gaming */}
          <PricingCard
            onBook={() => alert("Booking PC gaming...")}
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
            pricePerPlayer={100}
            minPlayers={1}
            maxPlayers={6}
            currency="₹"
            priceUnit="/hr"
            featured
            featuredLabel="Most popular"
            accentColor="cyan"
            onBook={handleSubmit}
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
            onBook={() => alert("Booking Racing cockpit...")}
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
            onBook={() => alert("Booking PSVR...")}
          />
        </div>
      </div>
    </section>
  )
}
