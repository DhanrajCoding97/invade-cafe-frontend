// lib/session-due.ts
import { type DueCheckBooking } from '@/types';

const DUE_WINDOW_MS = 5 * 60 * 1000; // matches useDueSessions' 5-minute alert window
// grace period after which we stop calling it "just due" for card styling —
// separate from the toast's window; the card should stay highlighted longer
const CARD_DUE_GRACE_MS = 60 * 60 * 1000; // 1hr — tune as needed

export function isSessionDue(booking: DueCheckBooking): boolean {
  if (booking.status !== 'confirmed' || booking.session_started_at) {
    return false;
  }

  const startDateTime = new Date(`${booking.date}T${booking.start_time}`);
  const now = new Date();

  return (
    now >= startDateTime &&
    now.getTime() - startDateTime.getTime() < CARD_DUE_GRACE_MS
  );
}

export function minutesOverdue(booking: DueCheckBooking): number {
  const startDateTime = new Date(`${booking.date}T${booking.start_time}`);
  return Math.max(
    0,
    Math.round((Date.now() - startDateTime.getTime()) / 60000),
  );
}
