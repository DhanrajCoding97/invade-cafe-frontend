'use client';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import { FcGoogle } from 'react-icons/fc';
import { createClient } from '@/lib/supabase/client';
export default function SignInWithGoogle() {
  const handleOAuthLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };
  return (
    <div>
      <CornerCutButton
        cornerSize={0}
        size='sm'
        color='cyan'
        variant='outline'
        hoverEffect='default'
        onClick={handleOAuthLogin}
      >
        Login
        <FcGoogle />
      </CornerCutButton>
    </div>
  );
}
