import type { BookingRow } from '@/types';

export function getExtendedDuration(booking: BookingRow): {
  label: string;
  hasPendingExtension: boolean;
} {
  const baseHours = booking.duration_hours ?? booking.duration;
  const extensions = booking.session_extensions ?? [];

  if (!baseHours) return { label: '—', hasPendingExtension: false };

  const extraMinutes = extensions.reduce(
    (sum, e) => sum + Number(e.minutes),
    0,
  );
  const baseMinutes = Number(baseHours) * 60;
  const totalMinutes = baseMinutes + extraMinutes;

  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const label = mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;

  const hasPendingExtension = extensions.some(
    (e) => e.payment_status === 'pending',
  );

  return { label, hasPendingExtension };
}

export function getExtendedTotal(booking: BookingRow): {
  total: number;
  extensionTotal: number;
  pendingExtension: { amount: number } | undefined;
} {
  const extensions = booking.session_extensions ?? [];
  const extensionTotal = extensions.reduce(
    (sum, e) => sum + Number(e.amount),
    0,
  );
  const pendingExtension = extensions.find(
    (e) => e.payment_status === 'pending',
  );

  return {
    total: Number(booking.amount) + extensionTotal,
    extensionTotal,
    pendingExtension,
  };
}