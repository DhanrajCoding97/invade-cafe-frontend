// import { createClient } from '@/lib/supabase/server';
// import { redirect } from 'next/navigation';

// type Role = 'owner' | 'staff' | 'customer';

// export async function requireRole(allowed: Role[]) {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) redirect('/');

//   const { data: profile, error } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('id', user.id)
//     .single();

//   if (error || !profile) redirect('/');

//   if (!allowed.includes(profile.role as Role)) {
//     redirect('/dashboard');
//   }

//   return { user, role: profile.role as Role };
// }
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type Role = 'owner' | 'staff' | 'customer';

export async function requireRole<T extends Role>(allowed: readonly T[]) {
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

  const role = profile.role as Role;

  if (!allowed.includes(role as T)) {
    redirect('/dashboard');
  }

  return {
    user,
    role: role as T,
  };
}
