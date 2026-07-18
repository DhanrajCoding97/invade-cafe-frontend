import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type Role = 'owner' | 'staff' | 'customer';

export async function requireRole(allowed: Role[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile) redirect('/');

  if (!allowed.includes(profile.role as Role)) {
    redirect('/dashboard');
  }

  return { user, role: profile.role as Role };
}
