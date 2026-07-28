import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useProfile(userId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', userId!)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
  });
}
