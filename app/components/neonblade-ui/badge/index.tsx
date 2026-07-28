'use client';

import React, { HTMLAttributes, ReactNode } from 'react';
import styles from './badge.module.css';
import { cn } from '@/lib/utils';

// ---- Types -------------------------------------------------

export type BadgeColor = 'cyan' | 'pink' | 'green' | (string & {});
export type BadgeSize = 'xs' | 'sm' | 'md';
export type BadgeVariant = 'solid' | 'outline' | 'ghost';
export type BadgeShape = 'pill' | 'rectangle' | 'corner-cut';
export type BadgeCorner =
  'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'all';
export type BadgeDot = 'none' | 'solid' | 'pulse' | 'flicker';

// ---- Maps --------------------------------------------------

const COLOR_PRESETS: Record<string, string> = {
  cyan: '#00f3ff',
  pink: '#ff00ff',
  green: '#39ff14',
};

const CORNER_CLIP: Record<BadgeCorner, string> = {
  'bottom-right': styles['bdg-clip-br'],
  'bottom-left': styles['bdg-clip-bl'],
  'top-right': styles['bdg-clip-tr'],
  'top-left': styles['bdg-clip-tl'],
  all: styles['bdg-clip-all'],
};
// Size: padding + font-size + gap for inner badge content
const INNER_SIZE: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-[9px] gap-2',
  sm: 'px-2.5 py-1 text-[10px] gap-[5px]',
  md: 'px-3.5 py-[5px] text-[11px] gap-[6px]',
};

// const RESPONSIVE_INNER_SIZE =
//   "px-2 py-0.5 text-[9px] gap-1 min-[340px]:px-2.5 min-[340px]:py-1 min-[340px]:text-[8px] min-[340px]:gap-[5px] md:px-3.5 md:py-[5px] text-[9px] md:text-[14px] md:gap-[6px]"

const RESPONSIVE_INNER_SIZE =
  'px-1.5 py-1 gap-1 sm:gap-2 text-[9px] sm:text-[10px] md:px-3 md:py-[5px] tracking-whider';

const RESPONSIVE_DOT_SIZE =
  'w-[2px] h-[2px] min-[340px]:w-[6px] min-[340px]:h-[6px] md:w-[7px] md:h-[7px]';

// Dot dimensions per badge size
const DOT_SIZE: Record<BadgeSize, string> = {
  xs: 'w-[5px] h-[5px]',
  sm: 'w-[6px] h-[6px]',
  md: 'w-[7px] h-[7px]',
};

// ---- Component props ---------------------------------------

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  color?: BadgeColor;
  variant?: BadgeVariant;
  shape?: BadgeShape;
  corner?: BadgeCorner;
  cornerSize?: number;
  dot?: BadgeDot;
  glow?: boolean;
  size?: BadgeSize;
  responsive?: boolean;
}

// ---- Component ---------------------------------------------

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'green',
  variant = 'outline',
  shape = 'pill',
  corner = 'bottom-right',
  cornerSize = 8,
  dot = 'none',
  glow = false,
  size = 'sm',
  className = '',
  style,
  responsive,
  ...props
}) => {
  const resolvedColor = COLOR_PRESETS[color] ?? color;
  const clipClass = shape === 'corner-cut' ? CORNER_CLIP[corner] : '';
  const roundedClass = shape === 'pill' ? 'rounded-full' : '';

  // Border frame: 1px ring on all edges including diagonal
  const frameClass = cn(
    'absolute inset-0 pointer-events-none z-0',
    roundedClass,
    clipClass,
    variant === 'outline' ? 'bg-[var(--bdg-color)]' : 'bg-white/[0.08]',
  );

  // Inner badge content
  const innerClass = cn(
    'relative z-[1] inline-flex items-center font-orbitron font-bold tracking-[0.1em] uppercase whitespace-nowrap select-none leading-none',
    responsive ? RESPONSIVE_INNER_SIZE : INNER_SIZE[size],
    roundedClass,
    clipClass,
    variant === 'solid' && 'bg-[var(--bdg-color)] text-black',
    variant === 'outline' && 'bg-black text-[var(--bdg-color)]',
    variant === 'ghost' && 'text-[var(--bdg-color)]',
    glow && styles['bdg-glow'],
  );

  // Ghost variant needs color-mix background (not expressible in Tailwind)
  const ghostStyle =
    variant === 'ghost'
      ? {
          backgroundColor: 'color-mix(in srgb, var(--bdg-color) 12%, #000)',
        }
      : undefined;

  const dotAnimClass = cn(
    dot === 'pulse' && styles['bdg-dot-pulse'],
    dot === 'flicker' && styles['bdg-dot-flicker'],
  );

  return (
    <span
      className={cn(
        'relative inline-flex p-px align-middle',
        roundedClass,
        className,
      )}
      style={
        {
          '--bdg-color': resolvedColor,
          '--bdg-corner-size': `${cornerSize}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Border frame */}
      <span className={frameClass} aria-hidden='true' />

      {/* Inner content */}
      <span className={innerClass} style={ghostStyle}>
        {dot !== 'none' && (
          <span
            className={cn(
              'inline-block shrink-0 rounded-full bg-[var(--bdg-color)]',
              responsive ? RESPONSIVE_DOT_SIZE : DOT_SIZE[size],
              dotAnimClass,
            )}
            aria-hidden='true'
          />
        )}
        {children}
      </span>
    </span>
  );
};

export default Badge;
