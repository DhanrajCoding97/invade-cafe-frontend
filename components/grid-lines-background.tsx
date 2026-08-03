'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DatalinesWithGrid = dynamic(
  () =>
    import('@/app/components/neonblade-ui/datalines-with-grid').then(
      (m) => m.DatalinesWithGrid,
    ),
  { ssr: false },
);

export default function GridLinesBackground() {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: 500 });
      return () => cancelIdleCallback(id);
    }
    // Safari fallback — no requestIdleCallback support
    const id = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(id);
  }, []);
  if (!ready) return null;

  return (
    <DatalinesWithGrid
      lineColor='#FFF'
      shadowColor='#071F02'
      cellSize={isMobile ? 40 : 60}
      maxLines={isMobile ? 4 : 8}
      baseSpeed={2}
      lineLength={isMobile ? 80 : 120}
      spawnProbability={isMobile ? 0.03 : 0.04}
      bgGridColor='rgba(0,255,102,0.06)'
      overlay
      isMobile={isMobile}
    />
  );
}
