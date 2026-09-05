// hooks/use-realtime-session-board.ts
'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Booking } from '@/types';

export function useRealtimeSessionBoard(
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    // Guard against stale channels from a previous (unclean) mount —
    // e.g. React StrictMode double-invoke or Fast Refresh in dev.
    const existing = supabase
      .getChannels()
      .find((ch) => ch.topic === 'realtime:session-board');
    if (existing) {
      supabase.removeChannel(existing);
    }

    const channel = supabase
      .channel('session-board')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          setBookings((prev) => {
            if (payload.eventType === 'INSERT')
              return [...prev, payload.new as Booking];
            if (payload.eventType === 'UPDATE')
              return prev.map((b) =>
                b.id === payload.new.id
                  ? ({ ...b, ...payload.new } as Booking)
                  : b,
              );
            if (payload.eventType === 'DELETE')
              return prev.filter((b) => b.id !== payload.old.id);
            return prev;
          });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'session_extensions' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['session-extensions'] });
        },
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(
            '[session-board] realtime channel failed:',
            status,
            err,
          );
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, setBookings]);
}
