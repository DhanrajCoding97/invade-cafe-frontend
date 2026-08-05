export const FREE_CANCELLATIONS = 3;
export const REDUCED_REFUND_PERCENT = 85; // pick the real number once, use everywhere

export function getRefundPercentForCount(monthlyCancelledCount: number) {
  return monthlyCancelledCount < FREE_CANCELLATIONS
    ? 100
    : REDUCED_REFUND_PERCENT;
}
