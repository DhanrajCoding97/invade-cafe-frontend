// app/dashboard/staff/actions/stations.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { StationType, OperationalStatus, PcSpecs } from '@/types';

interface StationPayload {
  type: StationType;
  name: string;
  hourly_rate: number;
  max_players: number;
  cafe_location: string;
  specs?: PcSpecs | null;
}

export async function createStation(payload: StationPayload) {
  const supabase = await createClient();
  const { error } = await supabase.from('stations').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/staff/stations');
}

export async function updateStation(
  id: string,
  payload: Partial<StationPayload>,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('stations')
    .update(payload)
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/staff/stations');
}

export async function updateStationOperationalStatus(
  id: string,
  operational_status: OperationalStatus,
  admin_note?: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('stations')
    .update({ operational_status, admin_note: admin_note ?? null })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/staff/stations');
}

// export async function retireStation(id: string) {
//   const supabase = await createClient();

//   // Get current station state
//   const { data: station, error: fetchError } = await supabase
//     .from('stations')
//     .select('status, operational_status')
//     .eq('id', id)
//     .single();

//   if (fetchError) {
//     throw new Error(fetchError.message);
//   }

//   // Prevent retiring an active session
//   if (station.status === 'booked' || station.status === 'occupied') {
//     throw new Error(
//       'Cannot retire a station with an active or ongoing booking.',
//     );
//   }

//   // Already retired
//   if (station.operational_status === 'retired') {
//     throw new Error('Station is already retired.');
//   }

//   // Soft delete
//   const { error } = await supabase
//     .from('stations')
//     .update({
//       operational_status: 'retired',
//     })
//     .eq('id', id);

//   if (error) {
//     throw new Error(error.message);
//   }

//   revalidatePath('/dashboard/staff/stations');
// }
export async function retireStation(id: string) {
  const supabase = await createClient();

  const { data: station, error: fetchError } = await supabase
    .from('stations')
    .select('operational_status')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (station.operational_status === 'retired') {
    throw new Error('Station is already retired.');
  }

  // Block retiring if there's a live session or an upcoming confirmed/pending
  // booking for this station — mirrors the same "active booking" concept
  // LiveSessionBoard and the slot-conflict checks use, rather than a static
  // status field on the station row.
  const nowIso = new Date().toISOString();
  const { data: activeBookings, error: bookingError } = await supabase
    .from('bookings')
    .select(
      'id, date, start_time, duration_hours, session_started_at, extended_until',
    )
    .eq('station_id', id)
    .in('status', ['pending', 'confirmed']);

  if (bookingError) {
    throw new Error(bookingError.message);
  }

  const hasActiveOrUpcoming = (activeBookings ?? []).some((b) => {
    // live session still running (started but not ended/extended past now)
    if (b.session_started_at) {
      const effectiveEnd = b.extended_until ?? null;
      if (!effectiveEnd || new Date(effectiveEnd) > new Date(nowIso)) {
        return true;
      }
    }
    // scheduled booking that hasn't happened yet
    const bookingStart = new Date(`${b.date}T${b.start_time}`);
    return bookingStart > new Date(nowIso);
  });

  if (hasActiveOrUpcoming) {
    throw new Error(
      'Cannot retire a station with an active or upcoming booking.',
    );
  }

  const { error } = await supabase
    .from('stations')
    .update({ operational_status: 'retired' })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/staff/stations');
}
