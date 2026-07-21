import { createClient } from '@/lib/supabase/server';
import SignInWithGoogle from './SignInWithGoogle';
import SignOutButton from './SignOutButton';

export default async function AuthSlot() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? <SignOutButton /> : <SignInWithGoogle />;
}
