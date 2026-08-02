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

export async function updateStationStatus(
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

export async function deleteStation(id: string) {
  const supabase = await createClient();
  // guard: block delete if currently booked
  const { data: station } = await supabase
    .from('stations')
    .select('status')
    .eq('id', id)
    .single();
  if (station?.status === 'booked') {
    throw new Error('Cannot delete a station with an active booking');
  }
  const { error } = await supabase.from('stations').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/staff/stations');
}
