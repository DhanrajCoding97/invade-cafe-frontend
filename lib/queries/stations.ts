import { type Station } from '@/types';
import { createClient } from '../supabase/client';

export const stationKeys = {
  all: ['stations'] as const,
  available: (date: string, startTime: string, duration: number) =>
    ['stations', 'available', date, startTime, duration] as const,
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

export async function fetchAvailableStations({
  date,
  startTime,
  duration,
}: {
  date: string; // 'yyyy-MM-dd'
  startTime: string; // 'HH:mm'
  duration: number;
}): Promise<Station[]> {
  const supabase = createClient();

  const [
    { data: stations, error: stationsError },
    { data: dayBookings, error: bookingsError },
  ] = await Promise.all([
    supabase
      .from('stations')
      .select('id, name, type, hourly_rate, status')
      .neq('status', 'maintenance'),
    supabase
      .from('bookings')
      .select('station_id, start_time, duration_hours')
      .eq('date', date)
      .eq('status', 'confirmed'),
  ]);

  if (stationsError) throw stationsError;
  if (bookingsError) throw bookingsError;

  const requestedStart = new Date(`${date}T${startTime}`);
  const requestedEnd = new Date(requestedStart);
  requestedEnd.setHours(requestedEnd.getHours() + duration);

  const conflictingStationIds = new Set(
    (dayBookings ?? [])
      .filter((b) => {
        const bStart = new Date(`${date}T${b.start_time}`);
        const bEnd = new Date(bStart);
        bEnd.setHours(bEnd.getHours() + Number(b.duration_hours));
        return requestedStart < bEnd && bStart < requestedEnd;
      })
      .map((b) => b.station_id),
  );

  return (stations ?? []).filter((s) => !conflictingStationIds.has(s.id));
}
