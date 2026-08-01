// lib/queries/games.ts

import { createClient } from '@/lib/supabase/client';
import type { GameRow } from '@/types';

export const gameKeys = {
  all: ['games'] as const,
};

export async function fetchGames(): Promise<GameRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}
