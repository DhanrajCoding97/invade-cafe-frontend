// hooks/use-due-sessions.ts
'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { DueSessionBooking } from '@/types';
import { isSessionDue } from '@/lib/helpers/session-due';

export function useDueSessions(bookings: DueSessionBooking[]) {
  const alertedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkDue = () => {
      const now = new Date();

      bookings.forEach((booking) => {
        if (isSessionDue(booking) && !alertedRef.current.has(booking.id)) {
          toast.warning(
            `Session due: ${booking.customer_name ?? 'Customer'} — ${booking.start_time}`,
            { duration: 15000 },
          );

          // Simple audio ping — put a short mp3/wav in /public
          const audio = new Audio('/sounds/notification-audio.mp3');
          audio.play().catch(() => {
            // Autoplay may be blocked until user interacts with the page once — expected, non-fatal
          });
        }
      });
    };

    checkDue(); // run once immediately
    const interval = setInterval(checkDue, 30_000); // check every 30s

    return () => clearInterval(interval);
  }, [bookings]);
}
