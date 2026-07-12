import React, { HTMLAttributes, ReactNode } from 'react';
import { FcGoogle } from 'react-icons/fc';
import './border-beam.css';

// ---- Types -------------------------------------------------

/** Named color presets or any valid CSS color string */
export type BBCColor = 'cyan' | 'pink' | 'green' | (string & {});

/** Card size — controls padding, icon box and font sizes */
export type BBCSize = 'sm' | 'md' | 'lg' | 'xl';

/** Which corner receives the diagonal cut */
export type BBCCorner =
  'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'all';

/**
 * Beam animation variant:
 * - `single`          — one conic-gradient beam spinning clockwise (default)
 * - `dual`            — two beams (beamColor + beamColorB) rotating in opposite directions
 * - `gradient-sweep`  — wide blending beam that fades from beamColor into beamColorB
 * - `rainbow`         — multi-color neon beam with continuous hue-rotation
 * - `pulse`           — single beam that breathes in opacity while spinning
 */
export type BBCVariant =
  'single' | 'dual' | 'gradient-sweep' | 'rainbow' | 'pulse';

/** Ambient neon glow on the inner card surface */
export type BBCGlowIntensity = 'none' | 'low' | 'medium' | 'high';

/** Content layout mode for the card body */
export type BBCType = 'default' | 'marquee';

// ---- Maps --------------------------------------------------

const COLOR_PRESETS: Record<string, string> = {
  cyan: '#00f3ff',
  pink: '#ff00ff',
  green: '#39ff14',
};

const CORNER_CLASSES: Record<BBCCorner, string> = {
  'bottom-right': 'bbc-clip-br',
  'bottom-left': 'bbc-clip-bl',
  'top-right': 'bbc-clip-tr',
  'top-left': 'bbc-clip-tl',
  all: 'bbc-clip-all',
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

export interface BorderBeamCornerCutCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  icon?: ReactNode;
  title?: string;
  description?: string;

  /** Card content layout — "default" for icon/title/description, "marquee" for review cards */
  type?: BBCType;

  beamColor?: BBCColor;
  beamColorB?: BBCColor;
  variant?: BBCVariant;
  duration?: number;
  durationB?: number;
  borderWidth?: number | string;
  size?: BBCSize;
  corner?: BBCCorner;
  cornerSize?: number;
  glowIntensity?: BBCGlowIntensity;
  bgColor?: string;
  innerClassName?: string;

  // ---- Review / marquee-mode props ----
  reviewerName?: string;
  reviewerInitial?: string;
  reviewRating?: number;
  reviewText?: string;
  showGoogleIcon?: boolean;
}

// ---- Size maps (move padding/sizing out of CSS) -----------

const INNER_PADDING: Record<BBCSize, string> = {
  sm: 'p-5',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};
const ICON_BOX_SIZE: Record<BBCSize, string> = {
  sm: 'w-9 h-9',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
  xl: 'w-16 h-16',
};
const ICON_SIZE: Record<BBCSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-9 h-9',
};
const TITLE_SIZE: Record<BBCSize, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-[1.375rem]',
  xl: 'text-[1.625rem]',
};
const DESC_SIZE: Record<BBCSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

// ---- Component ---------------------------------------------

export const BorderBeamCornerCutCard: React.FC<
  BorderBeamCornerCutCardProps
> = ({
  children,
  icon,
  title,
  description,
  type = 'default',
  beamColor = 'pink',
  beamColorB = 'cyan',
  variant = 'single',
  duration = 4,
  durationB = 6,
  borderWidth = '2px',
  size = 'md',
  corner = 'bottom-right',
  cornerSize = 20,
  glowIntensity = 'medium',
  bgColor,
  className = '',
  innerClassName = '',
  reviewerName,
  reviewerInitial,
  reviewRating = 5,
  reviewText,
  showGoogleIcon = true,
  style,
  ...props
}) => {
  const resolvedA = COLOR_PRESETS[beamColor] ?? beamColor;
  const resolvedB = COLOR_PRESETS[beamColorB] ?? beamColorB;
  const borderWidthValue =
    typeof borderWidth === 'number' ? `${borderWidth}px` : borderWidth;
  const cornerClass = CORNER_CLASSES[corner];
  const isMarquee = type === 'marquee';

  const outerClasses = [
    'bbc-wrapper',
    'relative w-full overflow-hidden bg-white/[0.05]',
    `bbc-variant-${variant}`,
    glowIntensity !== 'none' ? `bbc-glow-${glowIntensity}` : '',
    cornerClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={outerClasses}
      style={
        {
          '--bbc-beam-color': resolvedA,
          '--bbc-beam-color-b': resolvedB,
          '--bbc-corner-size': `${cornerSize}px`,
          '--bbc-duration': `${duration}s`,
          '--bbc-duration-b': `${durationB}s`,
          padding: borderWidthValue,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Primary spinning beam */}
      <div className='bbc-beam' aria-hidden='true' />

      {/* Secondary beam — only for “dual” variant */}
      {variant === 'dual' && <div className='bbc-beam-b' aria-hidden='true' />}

      {/* Inner content card */}
      <div
        className={[
          'bbc-inner',
          'relative z-10 flex h-full w-full flex-col',
          cornerClass,
          isMarquee ? 'gap-3 p-5' : INNER_PADDING[size],
          innerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ backgroundColor: bgColor ?? 'var(--background, #050505)' }}
      >
        {isMarquee ? (
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
            <p className='line-clamp-4 text-sm leading-relaxed text-white/60'>
              {reviewText}
            </p>
            {children}
          </>
        ) : (
          <>
            {icon && (
              <div
                className={[
                  'bbc-icon-box',
                  'mb-6 flex shrink-0 items-center justify-center rounded-[4px] border border-white/10 bg-black transition-[border-color,box-shadow] duration-300',
                  ICON_BOX_SIZE[size],
                ].join(' ')}
              >
                <span
                  className={[
                    'bbc-icon',
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
                  'bbc-title',
                  'font-orbitron mb-3 leading-[1.3] font-bold text-white transition-[text-shadow] duration-300',
                  TITLE_SIZE[size],
                ].join(' ')}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                className={[
                  'flex-grow leading-[1.65] text-white/60',
                  DESC_SIZE[size],
                ].join(' ')}
              >
                {description}
              </p>
            )}
            {children}
          </>
        )}
      </div>
    </div>
  );
};

export default BorderBeamCornerCutCard;
