// hooks/useRealtimeBookingSync.ts
'use client';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useRealtimeBookingSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    // Guard against stale channels from a previous (unclean) mount —
    // e.g. React StrictMode double-invoke or Fast Refresh in dev.
    const existing = supabase
      .getChannels()
      .find((ch) => ch.topic === 'realtime:bookings-sync');
    if (existing) {
      supabase.removeChannel(existing);
    }

    const channel = supabase
      .channel('bookings-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
          queryClient.invalidateQueries({ queryKey: ['stations'] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
