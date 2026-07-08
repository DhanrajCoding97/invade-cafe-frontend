"use client"
import "./pricing-card.css"
import React, { HTMLAttributes, ReactNode, useState } from "react"
import CornerCutButton from "@/app/components/neonblade-ui/corner-cut-button"
// ---- Types -------------------------------------------------

export type NBColor = "cyan" | "pink" | "green" | (string & {})
export type NBSize = "sm" | "md" | "lg" | "xl"
export type NBPricingMode = "fixed" | "per-player" | "tiered"

export interface NBTier {
  label: string
  price: number
}

export interface PricingCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode
  title?: string
  subtitle?: string
  price?: number
  currency?: string
  priceUnit?: string
  pricingMode?: NBPricingMode
  tiers?: NBTier[]
  minPlayers?: number
  maxPlayers?: number
  pricePerPlayer?: number
  featured?: boolean
  featuredLabel?: string
  ctaLabel?: string
  onBook?: (info: { players?: number; tier?: string }) => void
  accentColor?: NBColor
  size?: NBSize
  children?: ReactNode
  playerPriceMap?: Record<number, number>
}

// ---- Helpers -----------------------------------------------

const COLOR_PRESETS: Record<string, string> = {
  cyan: "#00d4e8",
  pink: "#ff00ff",
  green: "#39ff14",
}

const SIZE_MAP = {
  sm: {
    card: "p-5",
    iconBox: "w-16 h-16",
    iconInner: "w-7 h-7",
    title: "text-xl",
    subtitle: "text-xs",
    price: "text-4xl",
  },
  md: {
    card: "p-7",
    iconBox: "w-20 h-20",
    iconInner: "w-9 h-9",
    title: "text-2xl",
    subtitle: "text-sm",
    price: "text-5xl",
  },
  lg: {
    card: "p-9",
    iconBox: "w-24 h-24",
    iconInner: "w-11 h-11",
    title: "text-3xl",
    subtitle: "text-base",
    price: "text-6xl",
  },
  xl: {
    card: "p-11",
    iconBox: "w-28 h-28",
    iconInner: "w-13 h-13",
    title: "text-4xl",
    subtitle: "text-lg",
    price: "text-7xl",
  },
}

// ---- Component ---------------------------------------------

export const PricingCard: React.FC<PricingCardProps> = ({
  icon,
  title,
  subtitle,
  price,
  currency = "₹",
  priceUnit = "/ hr",
  pricingMode = "fixed",
  tiers,
  minPlayers = 1,
  maxPlayers = 4,
  pricePerPlayer = 100,

  featured = false,
  featuredLabel = "Most popular",
  ctaLabel = "Book Now",
  onBook,
  accentColor = "green",
  size = "md",
  children,
  className = "",
  style,
  playerPriceMap,
  ...props
}) => {
  const [players, setPlayers] = useState(minPlayers)
  const [selectedTierIndex, setSelectedTierIndex] = useState(0)
  const accent = COLOR_PRESETS[accentColor] ?? accentColor
  const s = SIZE_MAP[size]

  const computedPrice =
    pricingMode === "per-player"
      ? (playerPriceMap?.[players] ?? pricePerPlayer * players)
      : (price ?? 0)

  // const computedPrice =
  //   pricingMode === "per-player" ? pricePerPlayer * players : (price ?? 0)

  const handleDecrease = () => setPlayers((p) => Math.max(minPlayers, p - 1))
  const handleIncrease = () => setPlayers((p) => Math.min(maxPlayers, p + 1))

  return (
    <div
      className={[
        "pricing-card relative flex h-full flex-col overflow-visible rounded-2xl",
        className,
      ].join(" ")}
      style={
        {
          "--accent": accent,
          background: featured
            ? "linear-gradient(160deg, #0d1b2e 0%, #0a1525 100%)"
            : "linear-gradient(160deg, #0c1624 0%, #091220 100%)",
          border: featured
            ? `2px solid ${accent}`
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: featured
            ? `0 0 32px 0 ${accent}44, 0 8px 40px 0 #000a`
            : "0 4px 32px 0 #0008",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Most popular badge */}
      {featured && (
        <div
          className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 rounded-full px-5 py-1.5 text-sm font-bold whitespace-nowrap text-[#0a1525]"
          style={{ background: accent, boxShadow: `0 0 16px 2px ${accent}88` }}
        >
          {featuredLabel}
        </div>
      )}

      <div
        className={[
          "flex h-full flex-col items-center gap-5 text-center",
          s.card,
        ].join(" ")}
      >
        {/* Icon box */}
        {icon && <>{icon}</>}

        {/* Title */}
        {title && (
          <h3
            className={[
              "leading-tight font-extrabold text-white",
              s.title,
            ].join(" ")}
          >
            {title}
          </h3>
        )}

        {/* Subtitle */}
        {/* {subtitle && (
          <p className={["mb-5 text-white/50", s.subtitle].join(" ")}>
            {subtitle}
          </p>
        )} */}

        {/* Price — fixed or per-player */}
        {pricingMode !== "tiered" && (
          <div className="flex items-center">
            <span
              className={["leading-none font-extrabold", s.price].join(" ")}
              style={{ color: accent }}
            >
              {currency}
              {computedPrice}
            </span>
            <span className="mt-1 text-sm text-[#00d4e8]">{priceUnit}</span>
          </div>
        )}

        {/* Per-player controls */}
        {pricingMode === "per-player" && (
          <div className="flex items-center gap-5">
            <button
              onClick={handleDecrease}
              disabled={players <= minPlayers}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-white/40 hover:text-white disabled:opacity-30"
              aria-label="Decrease players"
            >
              <svg width="14" height="2" viewBox="0 0 14 2" fill="currentColor">
                <rect width="14" height="2" rx="1" />
              </svg>
            </button>
            <span className="min-w-17.5 text-base font-semibold text-white">
              {players} player{players !== 1 ? "s" : ""}
            </span>
            <button
              onClick={handleIncrease}
              disabled={players >= maxPlayers}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-white/40 hover:text-white disabled:opacity-30"
              aria-label="Increase players"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="currentColor"
              >
                <rect x="6" width="2" height="14" rx="1" />
                <rect y="6" width="14" height="2" rx="1" />
              </svg>
            </button>
          </div>
        )}

        {/* Tiered pricing rows */}
        {/* {pricingMode === "tiered" && tiers && (
          <div className="mt-1 w-full">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 text-sm"
                style={{
                  borderBottom:
                    i < tiers.length - 1
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                }}
              >
                <span className="text-white/70">{tier.label}</span>
                <div className="flex items-center gap-1">
                  <div
                    className="flex items-center font-bold"
                    style={{ color: accent }}
                  >
                    <span>{currency}</span>
                    <span>{tier.price}</span>
                  </div>
                  <span className="text-sm text-[#00d4e8]">{priceUnit}</span>
                </div>
              </div>
            ))}
          </div>
        )} */}
        {/* Tiered pricing — now selectable via radio */}
        {pricingMode === "tiered" && tiers && (
          <div className="mt-1 w-full">
            {tiers.map((tier, i) => {
              const isSelected = i === selectedTierIndex
              return (
                <label
                  key={i}
                  className="flex cursor-pointer items-center justify-between py-3 text-sm"
                  style={{
                    borderBottom:
                      i < tiers.length - 1
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                  }}
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name={`tier-${title}`}
                      checked={isSelected}
                      onChange={() => setSelectedTierIndex(i)}
                      className="sr-only"
                    />
                    <span
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                      style={{
                        borderColor: isSelected
                          ? accent
                          : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {isSelected && (
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: accent }}
                        />
                      )}
                    </span>
                    <span
                      className={isSelected ? "text-white" : "text-white/70"}
                    >
                      {tier.label}
                    </span>
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className="flex items-center font-bold"
                      style={{ color: accent }}
                    >
                      <span>{currency}</span>
                      <span>{tier.price}</span>
                    </div>
                    <span className="text-sm text-[#00d4e8]">{priceUnit}</span>
                  </div>
                </label>
              )
            })}
          </div>
        )}

        {/* Custom children */}
        {children}

        {/* Spacer pushes CTA to bottom */}
        {/* <div className="grow" /> */}

        {/* CTA */}
        <CornerCutButton
          className="mt-auto"
          onClick={() =>
            onBook?.({
              players: pricingMode === "per-player" ? players : undefined,
              tier:
                pricingMode === "tiered"
                  ? tiers?.[selectedTierIndex]?.label
                  : undefined,
            })
          }
          color="cyan"
          showArrow
          hoverEffect="shift"
        >
          Book Now
        </CornerCutButton>
      </div>
    </div>
  )
}

export default PricingCard
