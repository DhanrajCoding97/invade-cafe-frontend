import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='flex min-h-screen items-center justify-center bg-black text-white'>
      Welcome {user?.email}
    </div>
  );
}
