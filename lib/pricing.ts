// lib/pricing.ts
const PS5_PLAYER_RATES: Record<number, number> = {
  1: 100,
  2: 160,
  3: 240,
  4: 300,
};
const RACING_TIER_RATES = { single: 150, multiplayer: 300 } as const;

interface RateArgs {
  device: 'pc' | 'ps5' | 'vr' | 'racing' | undefined;
  players?: number;
  tier?: 'single' | 'multiplayer';
  fallbackRate: number; // station.hourly_rate — used for pc/vr
}

export function getDisplayRate({
  device,
  players,
  tier,
  fallbackRate,
}: RateArgs): number {
  if (device === 'ps5') return PS5_PLAYER_RATES[players ?? 1] ?? fallbackRate;
  if (device === 'racing') return RACING_TIER_RATES[tier ?? 'single'];
  return fallbackRate;
}

export function calculateTotal(rate: number, durationHours: number): number {
  return rate * durationHours;
}
