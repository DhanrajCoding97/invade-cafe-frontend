import { type BookingRow } from '@/types';
export function aggregateBookingTotals(booking: BookingRow) {
  const extensions = booking.session_extensions ?? [];

  const extensionMinutes = extensions.reduce(
    (sum, ext) => sum + Number(ext.minutes),
    0,
  );
  const extensionAmount = extensions.reduce(
    (sum, ext) => sum + Number(ext.amount),
    0,
  );
  const hasPendingExtension = extensions.some(
    (ext) => ext.payment_status === 'pending',
  );

  const totalDurationHours =
    Number(booking.duration_hours ?? 0) + extensionMinutes / 60;
  const totalAmount = Number(booking.amount ?? 0) + extensionAmount;

  return { totalDurationHours, totalAmount, hasPendingExtension, extensions };
}
