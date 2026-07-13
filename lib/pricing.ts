// lib/pricing.ts
const PS5_PLAYER_RATES: Record<number, number> = {
  1: 100,
  2: 160,
  3: 240,
  4: 300,
};

const PC_RATE = 80;
const PSVR_RATE = 200;

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
  switch (device) {
    case 'pc':
      return PC_RATE;

    case 'vr':
      return PSVR_RATE;

    case 'ps5':
      return PS5_PLAYER_RATES[players ?? 1] ?? fallbackRate;

    case 'racing':
      return RACING_TIER_RATES[tier ?? 'single'];

    default:
      return fallbackRate;
  }
}

export function calculateTotal(rate: number, durationHours: number): number {
  return rate * durationHours;
}
