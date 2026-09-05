// lib/date-ist.ts
import { formatInTimeZone } from 'date-fns-tz';
export const IST = 'Asia/Kolkata';

// export function parseISTDateTime(dateStr: string, timeStr: string): Date {
//   // dateStr: "yyyy-MM-dd", timeStr: "HH:mm" — combines into a correct UTC instant
//   return new Date(`${dateStr}T${timeStr}:00+05:30`);
// }
export function parseISTDateTime(dateStr: string, timeStr: string): Date {
  // dateStr: "yyyy-MM-dd"
  // timeStr: may arrive as "HH:mm" (from a form/UI) or "HH:mm:ss" (from a
  // Postgres `time` column, which always includes seconds) — normalize to
  // "HH:mm:ss" before building the ISO string, since appending our own
  // ":00" onto an already-seconds-included string produces an invalid date.
  const timeParts = timeStr.split(':');
  const normalizedTime = timeParts.length === 2 ? `${timeStr}:00` : timeStr; // add seconds only if missing

  return new Date(`${dateStr}T${normalizedTime}+05:30`);
}
export function formatIST(date: Date, formatStr: string): string {
  return formatInTimeZone(date, IST, formatStr);
}

export function todayIST(): string {
  return formatIST(new Date(), 'yyyy-MM-dd');
}

export function startOfTodayIST(): Date {
  // midnight IST, expressed as a correct UTC instant
  const todayStr = todayIST(); // "2026-08-13"
  return new Date(`${todayStr}T00:00:00+05:30`);
}

export function startOfMonthIST(): Date {
  const todayStr = todayIST();
  const [year, month] = todayStr.split('-');
  return new Date(`${year}-${month}-01T00:00:00+05:30`);
}
