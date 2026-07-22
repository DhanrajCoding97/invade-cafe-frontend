'use client';

import { useEffect, useRef } from 'react';

export interface DatalinesWithGridProps {
  lineColor?: string;
  shadowColor?: string;
  bgGridColor?: string;
  cellSize?: number;
  maxLines?: number;
  baseSpeed?: number;
  lineLength?: number;
  spawnProbability?: number;
  overlay?: boolean;
}

function hexToRgbA(hex: string, alpha: number): string {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return (
      'rgba(' +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
      ',' +
      alpha +
      ')'
    );
  }
  if (hex.startsWith('rgb')) {
    return hex
      .replace('rgb', 'rgba')
      .replace(')', `, ${alpha})`)
      .replace(',,', ',');
  }
  return hex;
}

function DatalinesCanvas({
  lineColor = '00f3ff#',
  shadowColor = '#00f3ff',
  cellSize = 50,
  maxLines = 15,
  baseSpeed = 2,
  lineLength = 150,
  spawnProbability = 0.1,
}: Omit<DatalinesWithGridProps, 'bgGridColor'>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect the user's motion preference — skip the animation loop entirely.
    // const prefersReducedMotion = window.matchMedia(
    //   '(prefers-reduced-motion: reduce)',
    // ).matches;
    // if (prefersReducedMotion) return;

    // Soft signal for low-end devices (not universally supported — treated as
    // a bonus reduction, not the primary lever).
    const deviceMemory = (navigator as any).deviceMemory;
    const isLowEnd = typeof deviceMemory === 'number' && deviceMemory <= 4;
    const effectiveMaxLines = isLowEnd ? Math.min(maxLines, 3) : maxLines;

    let animationFrameId: number;
    let startId: number | ReturnType<typeof setTimeout>;
    let isVisible = true;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    interface DataLine {
      x: number;
      y: number;
      history: { x: number; y: number }[];
      dx: number;
      dy: number;
      speed: number;
      lineLengthPx: number;
    }

    let lines: DataLine[] = [];

    // Frame-rate cap — this background doesn't need 60fps to read as smooth,
    // and halving the frame count roughly halves main-thread cost per second.
    const FRAME_INTERVAL = 1000 / 30;
    let lastTime = 0;

    const draw = (time: number = 0) => {
      animationFrameId = requestAnimationFrame(draw);

      if (!isVisible) return;
      if (time - lastTime < FRAME_INTERVAL) return;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (
        Math.random() < spawnProbability &&
        lines.length < effectiveMaxLines
      ) {
        lines.push({
          x: Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize,
          y: -cellSize,
          history: [],
          dx: 0,
          dy: 1,
          speed: baseSpeed,
          lineLengthPx: Math.floor(
            Math.random() * lineLength * 0.5 + lineLength * 0.75,
          ),
        });
      }

      lines.forEach((line) => {
        line.history.push({ x: line.x, y: line.y });

        const historyLimit = Math.max(
          2,
          Math.ceil(line.lineLengthPx / line.speed),
        );
        if (line.history.length > historyLimit) {
          line.history.shift();
        }

        line.x += line.dx * line.speed;
        line.y += line.dy * line.speed;

        if (line.x % cellSize === 0 && line.y % cellSize === 0) {
          const max_x = Math.floor(canvas.width / cellSize) * cellSize;
          if (line.x <= 0 && line.dx === -1) {
            line.dx = 0;
            line.dy = 1;
          } else if (line.x >= max_x && line.dx === 1) {
            line.dx = 0;
            line.dy = 1;
          } else {
            if (line.dy === 1) {
              if (Math.random() < 0.3) {
                line.dy = 0;
                line.dx = Math.random() < 0.5 ? 1 : -1;
              }
            } else {
              if (Math.random() < 0.6) {
                line.dy = 1;
                line.dx = 0;
              }
            }
          }
        }

        if (line.history.length < 2) return;

        const h = line.history;
        const tail = h[0];
        const head = h[h.length - 1];

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 1.5;

        const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        grad.addColorStop(0, hexToRgbA(lineColor, 0));
        grad.addColorStop(0.6, hexToRgbA(lineColor, 0.35));
        grad.addColorStop(1, hexToRgbA(lineColor, 0.9));

        ctx.beginPath();
        ctx.moveTo(h[0].x, h[0].y);
        for (let i = 1; i < h.length; i++) ctx.lineTo(h[i].x, h[i].y);
        ctx.strokeStyle = grad;
        ctx.shadowBlur = 0;
        ctx.stroke();

        const headCount = Math.max(2, Math.ceil(20 / Math.max(1, line.speed)));
        const headIdx = Math.max(0, h.length - 1 - headCount);
        ctx.beginPath();
        ctx.moveTo(h[headIdx].x, h[headIdx].y);
        for (let i = headIdx + 1; i < h.length; i++) ctx.lineTo(h[i].x, h[i].y);
        ctx.strokeStyle = hexToRgbA(lineColor, 0.95);
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      lines = lines.filter((line) => {
        if (line.history.length === 0) return true;
        const tail = line.history[0];
        return tail.y < canvas.height + cellSize * 2;
      });
    };

    // Don't let the draw loop compete with hydration / initial paint —
    // start once the browser has idle time, with a hard fallback timeout.
    if ('requestIdleCallback' in window) {
      startId = (window as any).requestIdleCallback(() => draw(), {
        timeout: 1000,
      });
    } else {
      startId = setTimeout(() => draw(), 200);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      io.disconnect();
      cancelAnimationFrame(animationFrameId);
      if ('cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(startId);
      } else {
        clearTimeout(startId as ReturnType<typeof setTimeout>);
      }
    };
  }, [
    lineColor,
    shadowColor,
    cellSize,
    maxLines,
    baseSpeed,
    lineLength,
    spawnProbability,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className='pointer-events-none absolute inset-0 z-10 h-full w-full'
    />
  );
}

export function DatalinesWithGrid({
  lineColor = '#00f3ff',
  shadowColor = '#00f3ff',
  cellSize = 50,
  maxLines = 10,
  baseSpeed = 2,
  lineLength = 150,
  spawnProbability = 0.1,
  bgGridColor = 'rgba(255,255,255,0.05)',
  overlay = false,
}: DatalinesWithGridProps) {
  return (
    <div
      className='absolute inset-0 z-0 overflow-hidden'
      style={{
        // Single CSS background replaces the previous hundreds-of-divs grid —
        // no extra DOM nodes, no resize-driven re-render, painted once by the browser.
        backgroundImage: `
          linear-gradient(to right, ${bgGridColor} 0.5px, transparent 0.5px),
          linear-gradient(to bottom, ${bgGridColor} 0.5px, transparent 0.5px)
        `,
        backgroundSize: `${cellSize}px ${cellSize}px`,
      }}
    >
      <DatalinesCanvas
        lineColor={lineColor}
        shadowColor={shadowColor}
        cellSize={cellSize}
        maxLines={maxLines}
        baseSpeed={baseSpeed}
        lineLength={lineLength}
        spawnProbability={spawnProbability}
      />
      {overlay && (
        <>
          <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]' />
          <div className='pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-black/80 via-transparent to-black' />
        </>
      )}
    </div>
  );
}
