import { type Station } from '@/types';
import { createClient } from '../supabase/client';

export const stationKeys = {
  all: ['stations'] as const,
  available: (device:string,date: string, startTime: string, duration: number) =>
    ['stations', 'available', device, date, startTime, duration] as const,
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
  device,
  date,
  startTime,
  duration,
}: {
  device: string;
  date: string;
  startTime: string;
  duration: number;
}): Promise<Station[]> {
  const supabase = createClient();

  // VR uses a PS5 station
  const stationType = device === 'vr' ? 'ps5' : device;

  const [
    { data: stations, error: stationsError },
    { data: dayBookings, error: bookingsError },
  ] = await Promise.all([
    supabase
      .from('stations')
      .select('id, name, type, hourly_rate, status')
      .eq('type', stationType)
      .neq('status', 'maintenance'),

    supabase
      .from('bookings')
      .select('station_id, start_time, duration_hours, device')
      .eq('date', date)
      .eq('status', 'confirmed'),
  ]);

  if (stationsError) throw stationsError;
  if (bookingsError) throw bookingsError;

  const requestedStart = new Date(`${date}T${startTime}`);
  const requestedEnd = new Date(requestedStart);
  requestedEnd.setHours(requestedEnd.getHours() + duration);

  // -------------------------------------------------------
  // VR HEADSET CHECK
  // Only one PSVR exists. If another VR booking overlaps,
  // don't allow any VR booking during that time.
  // -------------------------------------------------------
  if (device === 'vr') {
    const vrAlreadyBooked = (dayBookings ?? []).some((b) => {
      if (b.device !== 'vr') return false;

      const bStart = new Date(`${date}T${b.start_time}`);
      const bEnd = new Date(bStart);
      bEnd.setHours(bEnd.getHours() + Number(b.duration_hours));

      return requestedStart < bEnd && bStart < requestedEnd;
    });

    if (vrAlreadyBooked) {
      return [];
    }
  }

  // -------------------------------------------------------
  // Find stations that already have overlapping bookings
  // -------------------------------------------------------
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

  return (stations ?? []).filter(
    (station) => !conflictingStationIds.has(station.id),
  );
}