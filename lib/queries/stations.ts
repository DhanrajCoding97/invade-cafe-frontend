import { type Station, type StationRow } from '@/types';
import { createClient } from '../supabase/client';
import { parseISTDateTime } from '../date-list';

export const stationKeys = {
  all: ['stations'] as const,

  available: (
    device: string,
    tier: string | undefined,
    date: string,
    startTime: string,
    duration: number,
    excludeBookingId?: string,
  ) =>
    [
      'stations',
      'available',
      device,
      tier ?? null,
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

// export async function fetchAvailableStations({
//   device,
//   date,
//   startTime,
//   duration,
//   excludeBookingId,
// }: {
//   device: string;
//   date: string;
//   startTime: string;
//   duration: number;
//   excludeBookingId?: string;
// }): Promise<Station[]> {
//   const supabase = createClient();

//   let bookingsQuery = supabase
//     .from('bookings')
//     .select(
//       'id, station_id, start_time, duration_hours, extended_until, device',
//     )
//     .eq('date', date)
//     .in('status', ['confirmed']); // see note below on 'pending'

//   if (excludeBookingId) {
//     bookingsQuery = bookingsQuery.neq('id', excludeBookingId);
//   }

//   const stationType = device === 'vr' ? 'ps5' : device;

//   const [
//     { data: stations, error: stationsError },
//     { data: dayBookings, error: bookingsError },
//   ] = await Promise.all([
//     supabase
//       .from('stations')
//       .select('id, name, type, hourly_rate, status')
//       .eq('type', stationType)
//       .eq('operational_status', 'active'),
//     bookingsQuery,
//   ]);

//   if (stationsError) throw stationsError;
//   if (bookingsError) throw bookingsError;

//   // const requestedStart = new Date(`${date}T${startTime}`);
//   const requestedStart = parseISTDateTime(date, startTime);
//   const requestedEnd = new Date(requestedStart);
//   requestedEnd.setHours(requestedEnd.getHours() + duration);

//   function getBookingEnd(b: {
//     start_time: string;
//     duration_hours: number;
//     extended_until: string | null;
//   }) {
//     const bStart = parseISTDateTime(date, b.start_time);
//     const scheduledEnd = new Date(bStart);
//     scheduledEnd.setHours(scheduledEnd.getHours() + Number(b.duration_hours));
//     const extendedEnd = b.extended_until ? new Date(b.extended_until) : null;
//     return extendedEnd && extendedEnd > scheduledEnd
//       ? extendedEnd
//       : scheduledEnd;
//   }

//   if (device === 'vr') {
//     const vrAlreadyBooked = (dayBookings ?? []).some((b) => {
//       if (b.device !== 'vr') return false;
//       const bStart = parseISTDateTime(date, b.start_time);
//       const bEnd = getBookingEnd(b);
//       return requestedStart < bEnd && bStart < requestedEnd;
//     });
//     if (vrAlreadyBooked) return [];
//   }

//   const conflictingStationIds = new Set(
//     (dayBookings ?? [])
//       .filter((b) => {
//         const bStart = new Date(`${date}T${b.start_time}`);
//         const bEnd = getBookingEnd(b);
//         return requestedStart < bEnd && bStart < requestedEnd;
//       })
//       .map((b) => b.station_id),
//   );

//   return (stations ?? []).filter(
//     (station) => !conflictingStationIds.has(station.id),
//   );
// }
// export async function fetchAvailableStations({
//   device,
//   tier,
//   date,
//   startTime,
//   duration,
//   excludeBookingId,
// }: {
//   device: string;
//   tier?: string;
//   date: string;
//   startTime: string;
//   duration: number;
//   excludeBookingId?: string;
// }): Promise<Station[]> {
//   const supabase = createClient();

//   // When editing a group booking, its sibling row must also be excluded
//   // from conflict checks — otherwise a combo booking would appear to
//   // conflict with its own linked station.
//   let excludeIds: string[] = excludeBookingId ? [excludeBookingId] : [];
//   if (excludeBookingId) {
//     const { data: existing } = await supabase
//       .from('bookings')
//       .select('id, group_id')
//       .eq('id', excludeBookingId)
//       .maybeSingle();

//     if (existing?.group_id) {
//       const { data: siblings } = await supabase
//         .from('bookings')
//         .select('id')
//         .eq('group_id', existing.group_id);
//       excludeIds = (siblings ?? []).map((s) => s.id);
//     }
//   }

//   let bookingsQuery = supabase
//     .from('bookings')
//     .select(
//       'id, station_id, start_time, duration_hours, extended_until, device',
//     )
//     .eq('date', date)
//     .in('status', ['confirmed']);

//   if (excludeIds.length) {
//     bookingsQuery = bookingsQuery.not('id', 'in', `(${excludeIds.join(',')})`);
//   }

//   const stationType = device === 'vr' ? 'ps5' : device;

//   const [
//     { data: stations, error: stationsError },
//     { data: dayBookings, error: bookingsError },
//   ] = await Promise.all([
//     supabase
//       .from('stations')
//       .select('id, name, type, hourly_rate, status')
//       .eq('type', stationType)
//       .eq('operational_status', 'active')
//       .order('name'),
//     bookingsQuery,
//   ]);

//   if (stationsError) throw stationsError;
//   if (bookingsError) throw bookingsError;

//   const requestedStart = parseISTDateTime(date, startTime);
//   const requestedEnd = new Date(requestedStart);
//   requestedEnd.setHours(requestedEnd.getHours() + duration);

//   function getBookingEnd(b: {
//     start_time: string;
//     duration_hours: number;
//     extended_until: string | null;
//   }) {
//     const bStart = parseISTDateTime(date, b.start_time);
//     const scheduledEnd = new Date(bStart);
//     scheduledEnd.setHours(scheduledEnd.getHours() + Number(b.duration_hours));
//     const extendedEnd = b.extended_until ? new Date(b.extended_until) : null;
//     return extendedEnd && extendedEnd > scheduledEnd
//       ? extendedEnd
//       : scheduledEnd;
//   }

//   if (device === 'vr') {
//     const vrAlreadyBooked = (dayBookings ?? []).some((b) => {
//       if (b.device !== 'vr') return false;
//       const bStart = parseISTDateTime(date, b.start_time);
//       const bEnd = getBookingEnd(b);
//       return requestedStart < bEnd && bStart < requestedEnd;
//     });
//     if (vrAlreadyBooked) return [];
//   }

//   const conflictingStationIds = new Set(
//     (dayBookings ?? [])
//       .filter((b) => {
//         const bStart = parseISTDateTime(date, b.start_time);
//         const bEnd = getBookingEnd(b);
//         return requestedStart < bEnd && bStart < requestedEnd;
//       })
//       .map((b) => b.station_id),
//   );

//   // --- PC racing multiplayer: return combo entries instead of individual PCs ---
//   // if (device === 'pc' && tier === 'multiplayer') {
//   //   const availablePcs = (stations ?? []).filter(
//   //     (s) => !conflictingStationIds.has(s.id),
//   //   );

//   //   const combos: (Station & {
//   //     isCombo: true;
//   //     comboStationIds: [string, string];
//   //   })[] = [];
//   //   for (let i = 0; i + 1 < availablePcs.length; i += 2) {
//   //     const a = availablePcs[i];
//   //     const b = availablePcs[i + 1];
//   //     combos.push({
//   //       id: `combo:${a.id}:${b.id}`,
//   //       name: `${a.name} + ${b.name}`,
//   //       type: a.type,
//   //       hourly_rate: a.hourly_rate + b.hourly_rate, // fallback only — getDisplayRate handles the real price
//   //       status: a.status,
//   //       isCombo: true,
//   //       comboStationIds: [a.id, b.id],
//   //     } as any);
//   //   }
//   //   return combos as any;
//   // }
//   if (device === 'racing' && tier === 'multiplayer') {
//     const racingStations = stations ?? [];
//     const availableRacing = racingStations.filter(
//       (s) => !conflictingStationIds.has(s.id),
//     );

//     const soloCapableMultiplayer = availableRacing.filter(
//       (s: any) => (s.max_players ?? 1) >= 2,
//     );
//     const pairableRigs = availableRacing.filter(
//       (s: any) => (s.max_players ?? 1) < 2,
//     );

//     const combos: any[] = [];
//     for (let i = 0; i + 1 < pairableRigs.length; i += 2) {
//       const a = pairableRigs[i];
//       const b = pairableRigs[i + 1];
//       combos.push({
//         id: `combo:${a.id}:${b.id}`,
//         name: `${a.name} + ${b.name}`,
//         type: a.type,
//         hourly_rate: a.hourly_rate + b.hourly_rate,
//         status: a.status,
//         isCombo: true,
//         comboStationIds: [a.id, b.id],
//       });
//     }

//     return [...soloCapableMultiplayer, ...combos] as any;
//   }
//   // --- end combo branch ---

//   return (stations ?? []).filter(
//     (station) => !conflictingStationIds.has(station.id),
//   );
// }
export async function fetchAvailableStations({
  device,
  tier,
  date,
  startTime,
  duration,
  excludeBookingId,
}: {
  device: string;
  tier?: string;
  date: string;
  startTime: string;
  duration: number;
  excludeBookingId?: string;
}): Promise<Station[]> {
  const supabase = createClient();

  let excludeIds: string[] = excludeBookingId ? [excludeBookingId] : [];
  if (excludeBookingId) {
    const { data: existing } = await supabase
      .from('bookings')
      .select('id, group_id')
      .eq('id', excludeBookingId)
      .maybeSingle();

    if (existing?.group_id) {
      const { data: siblings } = await supabase
        .from('bookings')
        .select('id')
        .eq('group_id', existing.group_id);
      excludeIds = (siblings ?? []).map((s) => s.id);
    }
  }

  let bookingsQuery = supabase
    .from('bookings')
    .select(
      'id, station_id, start_time, duration_hours, extended_until, device, session_started_at, session_ended_at',
    )
    .eq('date', date)
    .in('status', ['confirmed']);

  if (excludeIds.length) {
    bookingsQuery = bookingsQuery.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  const stationType = device === 'vr' ? 'ps5' : device;

  const [
    { data: stations, error: stationsError },
    { data: dayBookings, error: bookingsError },
  ] = await Promise.all([
    supabase
      .from('stations')
      // specs + max_players added — required to correctly split
      // PS5 (solo-multiplayer-capable) from PC cockpits (must be paired)
      .select('id, name, type, specs, hourly_rate, max_players, status')
      .eq('type', stationType)
      .eq('operational_status', 'active')
      .order('name'),
    bookingsQuery,
  ]);
  console.log('🎮 [AVAILABLE STATIONS] dayBookings:', dayBookings);

  if (stationsError) throw stationsError;
  if (bookingsError) throw bookingsError;

  const requestedStart = parseISTDateTime(date, startTime);
  const requestedEnd = new Date(requestedStart);
  requestedEnd.setHours(requestedEnd.getHours() + duration);

  // function getBookingEnd(b: {
  //   start_time: string;
  //   duration_hours: number;
  //   extended_until: string | null;
  // }) {
  //   const bStart = parseISTDateTime(date, b.start_time);
  //   const scheduledEnd = new Date(bStart);
  //   scheduledEnd.setHours(scheduledEnd.getHours() + Number(b.duration_hours));
  //   const extendedEnd = b.extended_until ? new Date(b.extended_until) : null;
  //   return extendedEnd && extendedEnd > scheduledEnd
  //     ? extendedEnd
  //     : scheduledEnd;
  // }

  function getBookingEnd(b: {
    start_time: string;
    duration_hours: number;
    extended_until: string | null;
    session_started_at?: string | null;
    session_ended_at?: string | null;
  }) {
    const bStart = parseISTDateTime(date, b.start_time);
    const scheduledEnd = new Date(bStart);
    scheduledEnd.setHours(scheduledEnd.getHours() + Number(b.duration_hours));
    const extendedEnd = b.extended_until ? new Date(b.extended_until) : null;
    const baseEnd =
      extendedEnd && extendedEnd > scheduledEnd ? extendedEnd : scheduledEnd;

    // A session that's actively running (started, not yet ended) blocks the
    // station through the current moment even if it's overrun its scheduled
    // or extended end time — it hasn't actually been freed yet.
    const isActiveNow = !!b.session_started_at && !b.session_ended_at;
    if (isActiveNow) {
      const now = new Date();
      return now > baseEnd ? now : baseEnd;
    }

    return baseEnd;
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

  // const conflictingStationIds = new Set(
  //   (dayBookings ?? [])
  //     .filter((b) => {
  //       const bStart = parseISTDateTime(date, b.start_time);
  //       const bEnd = getBookingEnd(b);
  //       return requestedStart < bEnd && bStart < requestedEnd;
  //     })
  //     .map((b) => b.station_id),
  // );
  const conflictingStationIds = new Set(
    (dayBookings ?? [])
      .filter((b) => {
        const bStart = parseISTDateTime(date, b.start_time);
        const bEnd = getBookingEnd(b);
        const overlaps = requestedStart < bEnd && bStart < requestedEnd;
        console.log('🔍 [OVERLAP DEBUG]', {
          bookingId: b.id,
          stationId: b.station_id,
          bookingStartTime: b.start_time,
          bStart: bStart?.getTime?.(), // NaN if invalid — won't throw
          bEnd: bEnd?.getTime?.(),
          requestedStart: requestedStart?.getTime?.(),
          requestedEnd: requestedEnd?.getTime?.(),
          overlaps,
        });
        return overlaps;
      })
      .map((b) => b.station_id),
  );
  // --- Racing multiplayer: PS5 stays solo, PC cockpits get paired ---
  if (device === 'racing' && tier === 'multiplayer') {
    const availableRacing = (stations ?? []).filter(
      (s: any) => !conflictingStationIds.has(s.id),
    );

    const ps5Station = availableRacing.find(
      (s: any) => s.specs?.powered_by === 'ps5' && (s.max_players ?? 1) >= 2,
    );
    const pcStations = availableRacing.filter(
      (s: any) => s.specs?.powered_by === 'pc',
    );

    const result: any[] = [];
    if (ps5Station) result.push(ps5Station);

    for (let i = 0; i + 1 < pcStations.length; i += 2) {
      const a = pcStations[i];
      const b = pcStations[i + 1];
      result.push({
        id: `combo:${a.id}:${b.id}`,
        name: `${a.name} + ${b.name}`,
        type: a.type,
        hourly_rate: a.hourly_rate + b.hourly_rate, // fallback only
        status: a.status,
        isCombo: true,
        comboStationIds: [a.id, b.id],
      });
    }

    return result as any;
  }
  // --- end combo branch ---

  return (stations ?? []).filter(
    (station) => !conflictingStationIds.has(station.id),
  );
}
