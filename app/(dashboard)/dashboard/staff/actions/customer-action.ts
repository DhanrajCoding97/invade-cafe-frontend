'use server';

import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/requrireRole';

export async function updateUserRole(
  userId: string,
  role: 'owner' | 'staff' | 'customer',
) {
  await requireRole(['owner']);

  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) throw new Error(error.message);
}
