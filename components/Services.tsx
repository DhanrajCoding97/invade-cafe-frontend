"use client"

import { services, Service } from "@/types"
import NeonGlowCornerCutCard from "@/app/components/neonblade-ui/neon-glow-corner-cut-card"
import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  // gsap scrollTrigger animation
  useGSAP(
    () => {
      gsap.from(
        [
          eyebrowRef.current,
          titleRef.current,
          descRef.current,
          badgeRef.current,
        ],
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      )

      const cards = cardsRef.current?.children
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          y: 50,
          duration: 0.6,
          delay: 0.6,
          ease: "sine.inOut",
          stagger: 0.3,
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
    <section ref={sectionRef} className="min-h-screen bg-black px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* sub title */}
        <div ref={eyebrowRef} className="my-4 flex items-center gap-4">
          <div className="h-px w-8 bg-[#00d4ff]" />
          <span className="text-[10px] leading-3.75 text-[#00d4ff]">
            WHAT WE OFFER
          </span>
        </div>
        {/* main title */}
        <h2
          ref={titleRef}
          className="mb-2 bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-left text-5xl font-extrabold text-transparent"
        >
          SERVICES
        </h2>
        {/* description */}
        <p
          ref={descRef}
          className="mx-auto mb-4 text-left text-base text-[#9a9a9a]"
        >
          Everything you need for the ultimate gaming experience.
        </p>
        {/* snacks badge */}
        <div ref={badgeRef} className="mb-12 flex justify-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-400/5 px-4 py-1.5 text-xs text-green-400">
            🍿 Snacks & drinks available on-site
          </span>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => (
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
