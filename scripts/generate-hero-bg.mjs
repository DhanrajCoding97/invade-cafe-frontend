// scripts/generate-hero-bg.mjs
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const WIDTH = 2400;
const HEIGHT = 1350; // match your hero's rough aspect ratio
const OUT_DIR = path.resolve('public/hero-bg');

function drawBlob(ctx, cx, cy, radius, color) {
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

async function generate() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Blobs — radial gradients are already soft, no blur filter needed
  drawBlob(
    ctx,
    WIDTH * 0.15,
    HEIGHT * 0.1,
    WIDTH * 0.5,
    'rgba(0,212,255,0.20)',
  );
  drawBlob(
    ctx,
    WIDTH * 0.85,
    HEIGHT * 0.95,
    WIDTH * 0.55,
    'rgba(217,17,255,0.15)',
  );
  drawBlob(
    ctx,
    WIDTH * 0.5,
    HEIGHT * 0.3,
    WIDTH * 0.45,
    'rgba(0,212,255,0.06)',
  );
  drawBlob(
    ctx,
    WIDTH * 0.8,
    HEIGHT * 0.8,
    WIDTH * 0.4,
    'rgba(254,17,255,0.04)',
  );

  // Grid lines
  const gridSizeX = 60;
  const gridSizeY = 50;
  ctx.strokeStyle = 'rgba(0,243,255,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= WIDTH; x += gridSizeX) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= HEIGHT; y += gridSizeY) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  const pngBuffer = canvas.toBuffer('image/png');
  await fs.mkdir(OUT_DIR, { recursive: true });

  await sharp(pngBuffer)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(path.join(OUT_DIR, 'hero-bg-desktop.webp'));

  await sharp(pngBuffer)
    .resize(900, null, { withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(path.join(OUT_DIR, 'hero-bg-mobile.webp'));
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
