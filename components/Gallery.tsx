"use client"

import { useRef } from "react"
import GallerySlider from "./Slider"
export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="bg-black px-4 py-8 sm:min-h-screen sm:px-6 sm:py-12 lg:px-8 lg:py-20"
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
          className="mb-2 bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-left text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
        >
          Pricing
        </h2>
        {/* description */}
        <p ref={descRef} className="mx-auto text-left text-base text-[#9a9a9a]">
          Simple rates, no hidden fees. Pick your setup and start playing.
        </p>
      </div>
      <div>
        <GallerySlider />
      </div>
    </section>
  )
}
