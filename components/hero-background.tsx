'use client';
import GridLinesBackground from './grid-lines-background';
import { usePrefersReducedMotion } from '@/hooks/use-prefer-reduced-motion';

export default function HeroBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) return null; // static image underneath already covers this case
  return <GridLinesBackground />;
}
