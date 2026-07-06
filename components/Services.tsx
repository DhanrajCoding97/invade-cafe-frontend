"use client"

import Image from "next/image"
import { services, Service } from "@/types"
import NeonGlowCornerCutCard from "@/app/components/neonblade-ui/neon-glow-corner-cut-card"
const colorMap: Record<Service["color"], string> = {
  cyan: "#28F1FF",
  pink: "#FE11FF",
  purple: "#A96BFF",
  amber: "#FFC145",
}

interface ServiceCardProps {
  service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
  const accent = colorMap[service.color]

  return (
    <div
      className="relative overflow-hidden rounded border transition-transform duration-200 hover:-translate-y-1"
      style={{
        borderColor: accent,
        clipPath: "polygon(0 12px, 12px 0, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <div
        className="relative h-37.5 w-full border-b"
        style={{ borderColor: accent }}
      >
        <Image
          src={service.imageSrc}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />
      </div>

      <div className="relative p-6 pb-16">
        <h3
          className="mb-3 text-lg font-extrabold tracking-wide uppercase"
          style={{ color: accent }}
        >
          {service.title}
        </h3>

        <ul className="space-y-2">
          {service.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-[#d0d0d0]"
            >
              <span
                className="h-1.25 w-1.25 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section className="min-h-screen bg-black px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-center text-5xl font-extrabold text-transparent">
          Our Services
        </h2>

        <p className="mx-auto mb-4 text-center text-base text-[#9a9a9a]">
          Everything you need for the ultimate gaming experience.
        </p>

        <div className="mb-12 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-400/5 px-4 py-1.5 text-xs text-green-400">
            🍿 Snacks & drinks available on-site
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            // <ServiceCard key={service.id} service={service} />
            <NeonGlowCornerCutCard
              key={service.id}
              title={service.title}
              imageSrc={service.imageSrc}
              imageAlt={service.imageAlt}
              colorA={service.color}
              features={service.features}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
