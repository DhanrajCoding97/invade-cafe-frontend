import { createClient } from '@/lib/supabase/client';

export async function handleOAuthLogin(next: string = '/') {
  const supabase = createClient();

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
}
