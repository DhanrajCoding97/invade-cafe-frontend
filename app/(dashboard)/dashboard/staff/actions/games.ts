// lib/actions/games.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/requrireRole';
import { revalidatePath } from 'next/cache';
import { type GameInput } from '@/types';

export async function createGame(input: GameInput) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();

  const { error } = await supabase.from('games').insert(input);
  if (error) throw new Error(error.message);

  revalidatePath('/games');
  revalidatePath('/dashboard/staff/games');
}

export async function updateGame(id: string, input: GameInput) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();

  const { error } = await supabase.from('games').update(input).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/games');
  revalidatePath('/dashboard/staff/games');
}

export async function deleteGame(id: string) {
  await requireRole(['owner', 'staff']);
  const supabase = await createClient();

  const { data: game } = await supabase
    .from('games')
    .select('image_url')
    .eq('id', id)
    .single();

  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) throw new Error(error.message);

  if (game?.image_url) {
    const path = game.image_url.split('/game-covers/')[1];
    if (path) await supabase.storage.from('game-covers').remove([path]);
  }

  revalidatePath('/games');
  revalidatePath('/dashboard/staff/games');
}
