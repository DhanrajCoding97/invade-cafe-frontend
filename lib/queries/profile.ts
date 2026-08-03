import { createClient } from '@/lib/supabase/client';

export const profileKeys = {
  me: ['profile', 'me'] as const,
};

export async function fetchMyProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) throw error;

  return data;
}
