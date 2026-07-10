"use client"

import Link from "next/link"
import React from "react"
import { useRef } from "react"
import {
  WhatsappIcon,
  PhoneIcon,
  MailIcon,
  InstagramIcon,
  LocationIcon,
  ClockIcon,
  PhoneIcon3,
  MapArrowIcon,
} from "./svgs"
function InfoCard({
  label,
  children,
  icon,
}: {
  label: string
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
      <div className="mb-2 flex items-center justify-start gap-1">
        {icon}
        <p className="text-[11px] tracking-wide text-white/40 uppercase">
          {label}
        </p>
      </div>
      {children}
    </div>
  )
}

function ContactLink({
  icon,
  href,
  children,
}: {
  icon: React.ReactNode
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 text-sm text-white transition-colors hover:text-[#00d4ff]"
    >
      <span className="text-[#00d4ff]">{icon}</span>
      {children}
    </Link>
  )
}
function HoursRow({
  day,
  time,
  last = false,
}: {
  day: string
  time: string
  last?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-white/60">{day}</span>
      <span className="font-medium text-white">{time}</span>
    </div>
  )
}

export default function Contact() {
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
            FIND US
          </span>
        </div>
        {/* main title */}
        <h2
          ref={titleRef}
          className="mb-2 bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-left text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
        >
          Visit Invade
        </h2>
        {/* description */}
        <p ref={descRef} className="mx-auto text-left text-base text-[#9a9a9a]">
          Our location, hours, and the easiest ways to reach us.
        </p>
        {/* Two-column body */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[0.9fr_1.1fr]">
          {/* Info column */}
          <div className="order-2 flex flex-col gap-4 md:order-1">
            <InfoCard
              label="Address"
              icon={<MapArrowIcon height={32} width={32} />}
            >
              <p className="text-sm text-white">
                Ground Floor, Bhakti Residency, Shop-08/A, Plot Number-06,
                opposite Juinagar Railway Station, Sector 11,
                <br />
                Sanpada, Navi Mumbai, Maharashtra 400705
              </p>
            </InfoCard>

            <InfoCard
              label="Get in touch"
              icon={<PhoneIcon3 height={32} width={32} />}
            >
              <div className="flex flex-col gap-2.5">
                <ContactLink
                  icon={<WhatsappIcon height={20} width={20} />}
                  href="https://wa.me/918291158779"
                >
                  WhatsApp us
                </ContactLink>
                <ContactLink
                  icon={<InstagramIcon height={20} width={20} />}
                  href="https://instagram.com/invadegamingcafe"
                >
                  @invadegamingcafe
                </ContactLink>
                <ContactLink
                  icon={<PhoneIcon height={20} width={20} />}
                  href="tel:+918291158779"
                >
                  +91 82911 58779
                </ContactLink>
                <ContactLink
                  icon={<MailIcon height={20} width={20} />}
                  href="mailto:hello@invadecafe.com"
                >
                  hello@invadecafe.com
                </ContactLink>
              </div>
            </InfoCard>

            <InfoCard label="Hours" icon={<ClockIcon height={20} width={20} />}>
              <HoursRow day="Mon – Sun" time="10 AM – 11 PM" />
            </InfoCard>
          </div>
          {/* Map */}
          <div className="order-1 min-h-85 overflow-hidden rounded-2xl border border-white/10 md:order-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3643.5212078436365!2d73.01288567520483!3d19.05530278214504!2m3!1f0!2f0!3f0!3m2!1i1020!2i768!4f13.1!3m3!1m2!1s0x3be7c17d6e4b5365%3A0x3ef9695a4157527c!2sINVADE%20GAMING%20CAFE!5e1!3m2!1sen!2sin!4v1783675916752!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 340 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
