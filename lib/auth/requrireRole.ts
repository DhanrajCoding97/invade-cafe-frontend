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
// import { createClient } from '@/lib/supabase/server';
// import { redirect } from 'next/navigation';
// import { cache } from 'react';
// export type Role = 'owner' | 'staff' | 'customer';

// export async function requireRole<T extends Role>(allowed: readonly T[]) {
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

//   const role = profile.role as Role;

//   if (!allowed.includes(role as T)) {
//     redirect('/dashboard');
//   }

//   return {
//     user,
//     role: role as T,
//   };
// }
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export type Role = 'owner' | 'staff' | 'customer';

// Cached with NO arguments, so it dedupes reliably across every call site
// within a single request — regardless of what `allowed` array each caller
// passes. This is the part actually worth caching (the two Supabase calls).
const getAuthenticatedUser = cache(async () => {
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

  return {
    user,
    role: profile.role as Role,
  };
});

export async function requireRole<T extends Role>(allowed: readonly T[]) {
  const { user, role } = await getAuthenticatedUser();

  if (!allowed.includes(role as T)) {
    redirect('/dashboard');
  }

  return {
    user,
    role: role as T,
  };
}
