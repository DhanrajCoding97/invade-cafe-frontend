// lib/extension-pricing.ts
const EXTENSION_PRICE_PER_30MIN: Record<string, number> = {
  pc: 50,
  ps5: 60,
  racing: 100,
  vr: 100,
};

export function getExtensionAmount(deviceType: string, minutes: number) {
  const unitPrice = EXTENSION_PRICE_PER_30MIN[deviceType] ?? 50;
  return Math.round((minutes / 30) * unitPrice);
}
