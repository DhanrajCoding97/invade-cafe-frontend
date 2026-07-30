'use client';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
// import './corner-cut-button.css';
import styles from './corner-cut-button.module.css';
import { cn } from '@/lib/utils';
import Link from 'next/link';
// ---- Types -------------------------------------------------

/** Named color presets or any valid CSS color string (e.g. "#ff4400", "hsl(180,100%,50%)") */
export type CCBColor = 'cyan' | 'pink' | 'green' | (string & {});

/** Button size */
export type CCBSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Visual style variant */
export type CCBVariant = 'solid' | 'outline' | 'ghost';

/** Which corner is cut */
export type CCBCorner =
  'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'all';

/**
 * Hover animation preset:
 * - `glow`    — neon glow + white background flash (default for solid)
 * - `shift`   — bg color shift on hover (solid→white, outline→filled)
 * - `shine`   — diagonal shine sweep across the button
 * - `pulse`   — continuously pulsing glow while hovered
 * - `scan`    — a scan line travels top→bottom while hovered
 * - `flicker` — neon flicker effect while hovered
 * - `none`    — no hover animation
 */
export type CCBHoverEffect =
  | 'glow'
  | 'shift'
  | 'shine'
  | 'pulse'
  | 'scan'
  | 'flicker'
  | 'default'
  | 'none';

/** Controls the spread radius of the neon glow */
export type CCBGlowIntensity = 'low' | 'medium' | 'high';

// ---- Maps --------------------------------------------------

const COLOR_PRESETS: Record<string, string> = {
  cyan: '#00f3ff',
  pink: '#ff00ff',
  green: '#39ff14',
};

const SIZE_CLASSES: Record<CCBSize, string> = {
  xs: 'px-4 py-2 text-xs',
  sm: 'px-6 py-3 text-xs',
  md: 'px-8 py-4 text-sm',
  lg: 'px-10 py-5 text-base',
  xl: 'px-12 py-6 text-lg',
};

const CORNER_CLASSES: Record<CCBCorner, string> = {
  'bottom-right': styles['ccb-clip-br'],
  'bottom-left': styles['ccb-clip-bl'],
  'top-right': styles['ccb-clip-tr'],
  'top-left': styles['ccb-clip-tl'],
  all: styles['ccb-clip-all'],
};

const HOVER_CLASSES: Record<CCBHoverEffect, string> = {
  glow: styles['ccb-hover-glow'],
  shift: styles['ccb-hover-shift'],
  shine: styles['ccb-hover-shine'],
  pulse: styles['ccb-hover-pulse'],
  scan: styles['ccb-hover-scan'],
  flicker: styles['ccb-hover-flicker'],
  default: styles['ccb-hover-default'],
  none: '',
};

const GLOW_SIZES: Record<CCBGlowIntensity, number> = {
  low: 8,
  medium: 15,
  high: 28,
};

// ---- Component props ---------------------------------------

export interface CornerCutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  onClick?: () => void;

  /**
   * When true, the button stretches to full width on mobile (below `sm`)
   * and reverts to content-sized on larger screens.
   * @default false
   */
  fullWidthOnMobile?: boolean;

  /**
   * Button accent color.
   * Use a preset name ("cyan" | "pink" | "green") or any CSS color value.
   * @default "cyan"
   */
  color?: CCBColor;

  /**
   * Button size controlling padding and font size.
   * @default "md"
   */
  size?: CCBSize;

  /**
   * Visual variant.
   * - `solid`   — filled with the accent color (matches the Hero "Explore Components" button)
   * - `outline` — transparent background with a 1.5 px accent border
   * - `ghost`   — subtle tinted background with accent text
   * @default "solid"
   */
  variant?: CCBVariant;

  /**
   * Which corner receives the diagonal cut.
   * @default "bottom-right"
   */
  corner?: CCBCorner;

  /**
   * Size of the corner cut in pixels.
   * @default 20
   */
  cornerSize?: number;

  /**
   * Hover animation/effect.
   * @default "default"
   */
  hoverEffect?: CCBHoverEffect;

  /**
   * Glow spread intensity for effects that use a neon glow.
   * @default "medium"
   */
  glowIntensity?: CCBGlowIntensity;

  /**
   * When true an → arrow is appended that slides right on hover.
   * @default false
   */
  showArrow?: boolean;

  /**
   * Hover effect color. Overrides the element color on hover (for glow and shift effects).
   */
  hoverColor?: CCBColor;

  /**
   * When true, a solid button with 'shift' effect becomes outlined on hover.
   * @default false
   */
  hoverOutlined?: boolean;

  /**
   * Overrides the button text color.
   * Use a preset name ("cyan" | "pink" | "green") or any CSS color value.
   * Defaults to `black` for solid variant and the accent color for outline/ghost.
   */
  textColor?: CCBColor;
}

interface CornerCutLinkProps
  extends
    React.ComponentProps<typeof Link>,
    Omit<CornerCutButtonProps, 'onClick' | 'type' | 'asChild'> {}

export function CornerCutLink({
  href,
  children,
  ...props
}: CornerCutLinkProps) {
  return (
    <div className='...same wrapper...'>
      <Link href={href} className='...same button classes...'>
        {/* shine */}
        {/* scan */}
        {/* content */}
      </Link>
    </div>
  );
}

// ---- Component ---------------------------------------------

export const CornerCutButton: React.FC<CornerCutButtonProps> = ({
  children,
  onClick,
  fullWidthOnMobile,
  color = 'cyan',
  size = 'md',
  variant = 'solid',
  corner = 'bottom-right',
  cornerSize = 20,
  hoverEffect = 'default',
  glowIntensity = 'medium',
  showArrow = false,
  hoverColor,
  hoverOutlined = false,
  textColor,
  className = '',
  style,
  type = 'button',
  ...props
}) => {
  const resolvedColor = COLOR_PRESETS[color] ?? color;
  const resolvedHoverColor = hoverColor
    ? (COLOR_PRESETS[hoverColor] ?? hoverColor)
    : undefined;
  const resolvedTextColor = textColor
    ? (COLOR_PRESETS[textColor] ?? textColor)
    : undefined;
  const glowSize = GLOW_SIZES[glowIntensity];

  // Ghost variant needs color-mix background — not expressible in Tailwind
  const ghostStyle =
    variant === 'ghost'
      ? {
          backgroundColor: 'color-mix(in srgb, var(--ccb-color) 12%, #000)',
          color: 'var(--ccb-color)',
        }
      : undefined;

  return (
    <div
      className={cn(
        'group/ccb relative p-px',
        fullWidthOnMobile
          ? 'flex w-full sm:inline-flex sm:w-auto'
          : 'inline-flex',
        styles[`ccb-wrapper-${hoverEffect}`],
        hoverEffect === 'flicker' && styles['ccb-wrapper'],
        className,
      )}
      style={
        {
          '--ccb-color': resolvedColor,
          '--ccb-hover-color': resolvedHoverColor ?? resolvedColor,
          '--ccb-hover-bg': resolvedHoverColor ?? '#ffffff',
          '--ccb-corner-size': `${cornerSize}px`,
          '--ccb-glow-size': `${glowSize}px`,
          ...(resolvedTextColor
            ? { '--ccb-text-color': resolvedTextColor }
            : {}),
          ...style,
        } as React.CSSProperties
      }
    >
      {/* Border frame: 1px ring on all edges including the diagonal */}
      <div
        className={[
          'pointer-events-none absolute inset-0 z-0 transition-[background,opacity] duration-300',
          CORNER_CLASSES[corner],
          variant === 'outline' ? 'bg-(--ccb-color)' : 'bg-white/8',
          variant === 'solid' && hoverOutlined && hoverEffect === 'shift'
            ? 'group-hover/ccb:bg-(--ccb-hover-color)'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden='true'
      />

      <button
        type={type}
        onClick={onClick}
        className={cn(
          'group font-orbitron relative flex-1 cursor-pointer overflow-hidden font-bold tracking-wider uppercase transition-all',
          SIZE_CLASSES[size],
          CORNER_CLASSES[corner],
          HOVER_CLASSES[hoverEffect],
          styles[`ccb-${variant}`],
          hoverOutlined && styles['ccb-hover-outlined'],
          variant === 'solid' &&
            cn(
              'bg-(--ccb-color)',
              resolvedTextColor ? 'text-(--ccb-text-color)' : 'text-black',
            ),
          variant === 'outline' &&
            cn(
              'bg-black',
              resolvedTextColor
                ? 'text-(--ccb-text-color)'
                : 'text-(--ccb-color)',
            ),
        )}
        style={{
          ...ghostStyle,
          ...(resolvedTextColor && variant === 'ghost'
            ? { color: resolvedTextColor }
            : {}),
        }}
        {...props}
      >
        {/* Shine sweep layer — only rendered when needed */}
        {hoverEffect === 'shine' && (
          <span className={styles['ccb-shine-layer']} aria-hidden='true' />
        )}

        {/* Scan line layer — only rendered when needed */}
        {hoverEffect === 'scan' && (
          <span className={styles['ccb-scan-layer']} aria-hidden='true' />
        )}

        {/* Content sits above decorative layers */}
        <span
          className={[
            'relative z-10 flex items-center gap-2',
            fullWidthOnMobile ? 'justify-center' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
          {showArrow && (
            <span
              className='inline-block transition-transform group-hover:translate-x-1'
              aria-hidden='true'
            >
              →
            </span>
          )}
        </span>
      </button>
    </div>
  );
};

export default CornerCutButton;
