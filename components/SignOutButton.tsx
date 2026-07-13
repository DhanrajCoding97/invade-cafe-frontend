// 'use client';
// import { useRouter } from 'next/navigation';
// import { signOut } from '@/app/actions/auth';

// export default function SignOutButton() {
//   const router = useRouter();
//   const handleSignOut = async () => {
//     await signOut();
//     toast.success('Signed out successfully');
//     router.push('/');
//   };

//   return (
//     <CornerCutButton
//       type='submit'
//       cornerSize={0}
//       size='sm'
//       color='cyan'
//       variant='outline'
//       hoverEffect='default'
//       onClick={handleSignOut}
//     >
//       Logout
//       {/* <FcGoogle /> */}
//     </CornerCutButton>
//   );
// }

'use client';
import { toast } from 'sonner';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.refresh();
  };

  return (
    <CornerCutButton
      type='submit'
      cornerSize={0}
      size='sm'
      color='cyan'
      variant='outline'
      hoverEffect='default'
      onClick={handleSignOut}
    >
      Logout
      {/* <FcGoogle /> */}
    </CornerCutButton>
  );
}
