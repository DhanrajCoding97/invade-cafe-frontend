import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { CafeSettings } from '@/types';

async function fetchCafeSettings(): Promise<CafeSettings> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cafe_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
}

export function useCafeSettings() {
  return useQuery({
    queryKey: ['cafe-settings'],
    queryFn: fetchCafeSettings,
    staleTime: 5 * 60_000, // rates don't change often — avoid refetching every render
  });
}
