// lib/bookingDraft.ts
import { STEPS, type Step } from '@/components/BookingForm';
import { BookingFormValues } from './schemas/BookingFormSchema';
const DRAFT_KEY = 'booking_draft_v1';
const DRAFT_TTL_MS = 10 * 60 * 1000; // 10 min — don't restore stale drafts

export function saveBookingDraft(values: BookingFormValues, step: Step) {
  sessionStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({ values, step, savedAt: Date.now() }),
  );
}

export function loadBookingDraft(): {
  values: BookingFormValues;
  step: Step;
} | null {
  const raw = sessionStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > DRAFT_TTL_MS) {
      sessionStorage.removeItem(DRAFT_KEY);
      return null;
    }
    // dates come back as strings from JSON — rehydrate
    parsed.values.date = new Date(parsed.values.date);
    return parsed;
  } catch {
    return null;
  }
}

export function clearBookingDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}
