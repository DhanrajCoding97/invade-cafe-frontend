'use server';

import { createClient } from '@/lib/supabase/server';
import { type CafeSettings } from '@/types';
export async function getCafeSettings(): Promise<CafeSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cafe_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    throw new Error('Failed to load cafe settings');
  }

  return data;
}
