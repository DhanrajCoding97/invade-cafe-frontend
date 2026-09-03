import { type Station, type StationRow } from '@/types';
import { createClient } from '../supabase/client';
import { parseISTDateTime } from '../date-list';

export const stationKeys = {
  all: ['stations'] as const,
  available: (
    device: string,
    date: string,
    startTime: string,
    duration: number,
    excludeBookingId?: string,
  ) =>
    [
      'stations',
      'available',
      device,
      date,
      startTime,
      duration,
      excludeBookingId ?? null,
    ] as const,
};

export async function fetchAllStations(): Promise<Station[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stations')
    .select('id, name, type, hourly_rate, status')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchAdminStations(): Promise<StationRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .order('type', { ascending: true })
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAvailableStations({
  device,
  date,
  startTime,
  duration,
  excludeBookingId,
}: {
  device: string;
  date: string;
  startTime: string;
  duration: number;
  excludeBookingId?: string;
}): Promise<Station[]> {
  const supabase = createClient();

  let bookingsQuery = supabase
    .from('bookings')
    .select(
      'id, station_id, start_time, duration_hours, extended_until, device',
    )
    .eq('date', date)
    .in('status', ['confirmed']); // see note below on 'pending'

  if (excludeBookingId) {
    bookingsQuery = bookingsQuery.neq('id', excludeBookingId);
  }

  const stationType = device === 'vr' ? 'ps5' : device;

  const [
    { data: stations, error: stationsError },
    { data: dayBookings, error: bookingsError },
  ] = await Promise.all([
    supabase
      .from('stations')
      .select('id, name, type, hourly_rate, status')
      .eq('type', stationType)
      .eq('operational_status', 'active'),
    bookingsQuery,
  ]);

  if (stationsError) throw stationsError;
  if (bookingsError) throw bookingsError;

  // const requestedStart = new Date(`${date}T${startTime}`);
  const requestedStart = parseISTDateTime(date, startTime);
  const requestedEnd = new Date(requestedStart);
  requestedEnd.setHours(requestedEnd.getHours() + duration);

  function getBookingEnd(b: {
    start_time: string;
    duration_hours: number;
    extended_until: string | null;
  }) {
    const bStart = parseISTDateTime(date, b.start_time);
    const scheduledEnd = new Date(bStart);
    scheduledEnd.setHours(scheduledEnd.getHours() + Number(b.duration_hours));
    const extendedEnd = b.extended_until ? new Date(b.extended_until) : null;
    return extendedEnd && extendedEnd > scheduledEnd
      ? extendedEnd
      : scheduledEnd;
  }

  if (device === 'vr') {
    const vrAlreadyBooked = (dayBookings ?? []).some((b) => {
      if (b.device !== 'vr') return false;
      const bStart = parseISTDateTime(date, b.start_time);
      const bEnd = getBookingEnd(b);
      return requestedStart < bEnd && bStart < requestedEnd;
    });
    if (vrAlreadyBooked) return [];
  }

  const conflictingStationIds = new Set(
    (dayBookings ?? [])
      .filter((b) => {
        const bStart = new Date(`${date}T${b.start_time}`);
        const bEnd = getBookingEnd(b);
        return requestedStart < bEnd && bStart < requestedEnd;
      })
      .map((b) => b.station_id),
  );

  return (stations ?? []).filter(
    (station) => !conflictingStationIds.has(station.id),
  );
}
