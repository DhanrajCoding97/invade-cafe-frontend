// // lib/extension-pricing.ts
// import { useQuery } from '@tanstack/react-query';
// import { createClient } from '@/lib/supabase/client';

// export interface ExtensionPricingRow {
//   device: string;
//   tier: string | null;
//   duration_minutes: number;
//   price: number;
// }

// async function fetchExtensionPricing(): Promise<ExtensionPricingRow[]> {
//   const supabase = createClient();
//   const { data, error } = await supabase.from('extension_pricing').select('*');
//   if (error) throw error;
//   return data ?? [];
// }

// export function useExtensionPricing() {
//   return useQuery({
//     queryKey: ['extension-pricing'],
//     queryFn: fetchExtensionPricing,
//     staleTime: 5 * 60_000, // pricing rarely changes — 5 min is plenty
//   });
// }

// /**
//  * Looks up the exact extension price for a device/tier/duration combo.
//  * `tier` should be null for pc/vr, '1p'-'4p' for ps5, 'single'/'multiplayer' for racing —
//  * matching the shape of your extension_pricing table.
//  */
// export function getExtensionAmount(
//   pricing: ExtensionPricingRow[] | undefined,
//   device: string,
//   tier: string | null,
//   minutes: number,
// ): number {
//   const row = pricing?.find(
//     (r) =>
//       r.device === device && r.tier === tier && r.duration_minutes === minutes,
//   );

//   if (!row) {
//     console.warn(
//       `No extension price found for device=${device} tier=${tier} minutes=${minutes}`,
//     );
//     return 0;
//   }

//   return row.price;
// }

// lib/extension-pricing.ts
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface ExtensionPricingRow {
  device: string;
  tier: string | null;
  duration_minutes: number;
  price: number;
}

async function fetchExtensionPricing(): Promise<ExtensionPricingRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('extension_pricing').select('*');
  if (error) throw error;
  return data ?? [];
}

export function useExtensionPricing() {
  return useQuery({
    queryKey: ['extension-pricing'],
    queryFn: fetchExtensionPricing,
    staleTime: 5 * 60_000,
  });
}

/**
 * Resolves a booking's device + players/tier into the tier-key used by
 * extension_pricing ('1p'-'4p' for ps5, 'single'/'multiplayer' for racing,
 * null for pc/vr).
 */
export function resolveExtensionTier(
  device: string,
  players: number | null | undefined,
  tier: string | null | undefined,
): string | null {
  if (device === 'ps5') {
    const p = players ?? 1;
    return `${Math.min(Math.max(p, 1), 4)}p`; // clamp to 1p-4p just in case
  }

  if (device === 'racing') {
    return tier ?? 'single'; // fall back to single if somehow unset
  }

  // pc / vr have no tier
  return null;
}

export function getExtensionAmount(
  pricing: ExtensionPricingRow[] | undefined,
  device: string,
  tier: string | null,
  minutes: number,
): number {
  const row = pricing?.find(
    (r) =>
      r.device === device && r.tier === tier && r.duration_minutes === minutes,
  );

  if (!row) {
    console.warn(
      `No extension price found for device=${device} tier=${tier} minutes=${minutes}`,
    );
    return 0;
  }

  return row.price;
}
