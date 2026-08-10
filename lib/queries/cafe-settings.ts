import { createClient } from '../supabase/client';
import { CafeSettingsForm } from '@/types';

export async function fetchCafeSettings(): Promise<CafeSettingsForm> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cafe_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
}

export async function updateCafeSettings(values: CafeSettingsForm) {
  const supabase = createClient();
  const { error } = await supabase
    .from('cafe_settings')
    .update(values)
    .eq('id', 1);
  if (error) throw new Error(error.message);
}
