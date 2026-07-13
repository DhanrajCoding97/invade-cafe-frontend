'use client';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import { FcGoogle } from 'react-icons/fc';
import { handleOAuthLogin } from '@/lib/auth/oauth';
export default function SignInWithGoogle() {
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
