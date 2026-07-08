"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Create a single Lenis instance outside the component scope
let lenis: Lenis | null = null

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Ensure Lenis is only created once
    if (!lenis) {
      lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
      })

      lenis.on("scroll", ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis!.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    }

    // Cleanup on component unmount
    return () => {
      gsap.ticker.remove((time) => {
        lenis!.raf(time * 1000)
      })
      lenis?.destroy()
      lenis = null
    }
  }, [])

  return children
}
