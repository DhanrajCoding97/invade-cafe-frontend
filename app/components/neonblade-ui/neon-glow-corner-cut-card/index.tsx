'use client';

import React, { HTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import './neonglow-cornercut-card.css';

// ---- Types -------------------------------------------------

export type NGCCColor =
  'cyan' | 'teal' | 'pink' | 'green' | 'amber' | (string & {});
export type NGCCSize = 'sm' | 'md' | 'lg' | 'xl';
export type NGCCCorner =
  'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'all';
export type NGCCHoverEffect =
  'gradient' | 'solid' | 'glow-only' | 'pulse' | 'trace' | 'none';
export type NGCCGlowIntensity = 'low' | 'medium' | 'high';
export type NGCCImageOverlay = 'bottom' | 'full' | 'none';

/** Content layout mode for the card body */
export type NGCCType = 'default' | 'marquee';

// ---- Maps --------------------------------------------------

const COLOR_PRESETS: Record<string, string> = {
  cyan: '#00f3ff',
  pink: '#ff00ff',
  green: '#39ff14',
  amber: '#FFC145',
  teal: '#008080',
};

const CORNER_CLASSES: Record<NGCCCorner, string> = {
  'bottom-right': 'ngcc-clip-br',
  'bottom-left': 'ngcc-clip-bl',
  'top-right': 'ngcc-clip-tr',
  'top-left': 'ngcc-clip-tl',
  all: 'ngcc-clip-all',
};

const HOVER_CLASSES: Record<NGCCHoverEffect, string> = {
  gradient: 'ngcc-hover-gradient',
  solid: 'ngcc-hover-solid',
  'glow-only': 'ngcc-hover-glow-only',
  pulse: 'ngcc-hover-pulse',
  trace: 'ngcc-hover-trace',
  none: 'ngcc-hover-none',
};

const GLOW_SIZES: Record<NGCCGlowIntensity, { glow: number; blur: number }> = {
  low: { glow: 8, blur: 4 },
  medium: { glow: 15, blur: 7 },
  high: { glow: 28, blur: 14 },
};

const IMAGE_OVERLAY_CLASSES: Record<NGCCImageOverlay, string> = {
  bottom: 'ngcc-img-overlay-bottom',
  full: 'ngcc-img-overlay-full',
  none: '',
};

// ---- Star rating (self-contained, no external dep) ---------

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className='flex items-center gap-0.5'
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox='0 0 20 20'
          className='h-3.5 w-3.5'
          fill={i < rating ? '#facc15' : '#3f3f46'}
        >
          <path d='M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z' />
        </svg>
      ))}
    </div>
  );
}

// ---- Component props ---------------------------------------

export interface NeonGlowCornerCutCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  icon?: ReactNode;
  title?: string;

  /** Card content layout — "default" for icon/title/features, "marquee" for review cards */
  type?: NGCCType;

  /** Bulleted feature list, rendered with a colored dot matching colorA (type="default" only) */
  features?: string[];

  colorA?: NGCCColor;
  colorB?: NGCCColor;
  size?: NGCCSize;
  corner?: NGCCCorner;
  cornerSize?: number;
  hoverEffect?: NGCCHoverEffect;
  glowIntensity?: NGCCGlowIntensity;
  bgColor?: string;

  imageSrc?: string;
  imageAlt?: string;
  imageHeight?: number;
  imageOverlay?: NGCCImageOverlay;
  topContent?: ReactNode;

  // ---- Review / marquee-mode props ----
  reviewerName?: string;
  reviewerInitial?: string;
  reviewRating?: number;
  reviewText?: string;
  showGoogleIcon?: boolean;
}

const CARD_PADDING: Record<NGCCSize, string> = {
  sm: 'p-5',
  md: 'p-8',
  lg: 'p-10',
  xl: 'p-12',
};
const ICON_BOX_SIZE: Record<NGCCSize, string> = {
  sm: 'w-9 h-9',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
  xl: 'w-16 h-16',
};
const ICON_SIZE: Record<NGCCSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-9 h-9',
};
const TITLE_SIZE: Record<NGCCSize, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-[1.375rem]',
  xl: 'text-[1.625rem]',
};
const FEATURE_SIZE: Record<NGCCSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

// ---- Component ---------------------------------------------

export const NeonGlowCornerCutCard: React.FC<NeonGlowCornerCutCardProps> = ({
  children,
  icon,
  title,
  type = 'default',
  features,
  colorA = 'cyan',
  colorB = 'pink',
  size = 'md',
  corner = 'bottom-right',
  cornerSize = 20,
  hoverEffect = 'gradient',
  glowIntensity = 'medium',
  bgColor,
  imageSrc,
  imageAlt,
  imageHeight = 420,
  imageOverlay = 'bottom',
  topContent,
  reviewerName,
  reviewerInitial,
  reviewRating = 5,
  reviewText,
  showGoogleIcon = true,
  className = '',
  style,
  ...props
}) => {
  const resolvedA = COLOR_PRESETS[colorA] ?? colorA;
  const resolvedB = COLOR_PRESETS[colorB] ?? colorB;
  const { glow, blur } = GLOW_SIZES[glowIntensity];
  const isMediaMode = Boolean(imageSrc);
  const isMarquee = type === 'marquee';

  if (isMediaMode && !imageAlt) {
    console.warn(
      'NeonGlowCornerCutCard: imageAlt is required when imageSrc is set for accessibility.',
    );
  }

  const featureList = features && features.length > 0 && (
    <ul className='space-y-2'>
      {features.map((feature) => (
        <li
          key={feature}
          className={[
            'flex items-center gap-2 font-semibold text-white',
            FEATURE_SIZE[size],
          ].join(' ')}
        >
          <span className='h-1 w-1 shrink-0 rounded-full bg-white' />
          {feature}
        </li>
      ))}
    </ul>
  );

  const marqueeContent = (
    <>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold'
            style={{
              backgroundColor: `${resolvedA}1a`,
              color: resolvedA,
            }}
          >
            {reviewerInitial ?? reviewerName?.charAt(0) ?? '?'}
          </div>
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold text-white'>
              {reviewerName}
            </p>
            <StarRating rating={reviewRating} />
          </div>
        </div>
        {showGoogleIcon && <FcGoogle size={24} />}
      </div>
      <p className='mt-3 line-clamp-4 text-sm leading-relaxed text-[#9a9a9a]'>
        {reviewText}
      </p>
      {children}
    </>
  );

  return (
    <div
      className={['relative h-full p-px', HOVER_CLASSES[hoverEffect], className]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--ngcc-color-a': resolvedA,
          '--ngcc-color-b': resolvedB,
          '--ngcc-corner-size': `${cornerSize}px`,
          '--ngcc-glow-size': `${glow}px`,
          '--ngcc-glow-blur': `${blur}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div
        className='ngcc-glow pointer-events-none absolute -inset-0.5 z-0 rounded-[3px]'
        aria-hidden='true'
      />

      <div
        className={[
          'ngcc-border-frame',
          'pointer-events-none absolute inset-0 z-[5] bg-white/10 transition-[background,opacity] duration-300',
          CORNER_CLASSES[corner],
        ].join(' ')}
        aria-hidden='true'
      />

      <div
        className={[
          'ngcc-card group relative z-10 flex h-full flex-col overflow-hidden transition-shadow duration-300',
          CORNER_CLASSES[corner],
          isMediaMode ? '' : isMarquee ? 'gap-3 p-5' : CARD_PADDING[size],
        ].join(' ')}
        style={{
          backgroundColor: bgColor ?? '#0a0a0a',
          minHeight: isMediaMode ? imageHeight : undefined,
        }}
      >
        {isMediaMode ? (
          <>
            <Image
              src={imageSrc!}
              alt={imageAlt ?? ''}
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              className='object-cover transition-transform duration-500 ease-out group-hover:scale-110'
            />

            {imageOverlay !== 'none' && (
              <div
                className={[
                  'absolute inset-0',
                  IMAGE_OVERLAY_CLASSES[imageOverlay],
                ].join(' ')}
                aria-hidden='true'
              />
            )}

            {topContent && (
              <div className='relative z-20 flex justify-center px-5 pt-5'>
                {topContent}
              </div>
            )}

            <div
              className={[
                'relative z-20 flex flex-1 flex-col justify-end',
                CARD_PADDING[size],
              ].join(' ')}
            >
              {icon && (
                <div
                  className={[
                    'ngcc-icon-box mb-4 flex shrink-0 items-center justify-center rounded-[4px] border border-white/10 bg-black/40 backdrop-blur-sm',
                    ICON_BOX_SIZE[size],
                  ].join(' ')}
                >
                  <span
                    className={[
                      'flex items-center justify-center text-white/90',
                      ICON_SIZE[size],
                    ].join(' ')}
                  >
                    {icon}
                  </span>
                </div>
              )}

              {title && (
                <h3
                  className={[
                    'ngcc-title font-orbitron mb-3 leading-[1.3] font-bold text-white',
                    TITLE_SIZE[size],
                  ].join(' ')}
                >
                  {title}
                </h3>
              )}

              {featureList}
              {children}
            </div>
          </>
        ) : isMarquee ? (
          marqueeContent
        ) : (
          <>
            {icon && (
              <div
                className={[
                  'ngcc-icon-box mb-6 flex shrink-0 items-center justify-center rounded-[4px] border border-white/10 bg-black transition-[border-color,box-shadow] duration-300',
                  ICON_BOX_SIZE[size],
                ].join(' ')}
              >
                <span
                  className={[
                    'flex items-center justify-center text-white/70 transition-colors duration-300',
                    ICON_SIZE[size],
                  ].join(' ')}
                >
                  {icon}
                </span>
              </div>
            )}

            {title && (
              <h3
                className={[
                  'ngcc-title font-orbitron mb-3 leading-[1.3] font-bold text-white transition-[text-shadow] duration-300',
                  TITLE_SIZE[size],
                ].join(' ')}
              >
                {title}
              </h3>
            )}

            {featureList}
            {children}
          </>
        )}
      </div>
    </div>
  );
};

export default NeonGlowCornerCutCard;
