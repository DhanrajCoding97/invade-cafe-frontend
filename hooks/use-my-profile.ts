'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useMyProfile() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, email, phone, created_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return data;
    },
  });
}
