// hooks/use-realtime-customers.ts
'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { customerKeys } from '@/lib/queries/customers';

export function useRealtimeCustomers() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    // Listens on whichever table actually holds role/profile changes.
    // If customers are rows in a `profiles` table (common with Supabase
    // auth setups) rather than a `customers` table, change `table` below
    // to match — this must be the real table name, not the query key.
    const channel = supabase
      .channel('admin-customers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles', // <-- confirm this matches your actual table
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: customerKeys.all,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
