'use client';

import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarDays, History, User, Gamepad2 } from 'lucide-react';
import {
  useMyBookings,
  useCancelMyBooking,
} from '@/hooks/use-customer-booking';
import type { BookingRow } from '@/types';
import { useRef } from 'react';
function hoursUntil(booking: BookingRow) {
  const start = new Date(`${booking.date}T${booking.start_time}`);
  return (start.getTime() - Date.now()) / 3_600_000;
}

function UpcomingCard({ booking }: { booking: BookingRow }) {
  const cancelMutation = useCancelMyBooking();
  const hrsLeft = hoursUntil(booking);
  const cancellingRef = useRef(false);
  const canCancel = booking.status === 'confirmed' && hrsLeft >= 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Booking</CardTitle>
        <CardDescription>Your next gaming session</CardDescription>
      </CardHeader>

      <CardContent className='grid grid-cols-2 gap-3 text-sm sm:grid-cols-3'>
        <div>
          <p className='text-muted-foreground'>Device</p>
          <p className='font-medium capitalize'>{booking.device}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>Date</p>
          <p className='font-medium'>{booking.date}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>Time</p>
          <p className='font-medium'>{booking.start_time}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>Duration</p>
          <p className='font-medium'>
            {booking.duration_hours ?? booking.duration}h
          </p>
        </div>
        <div>
          <p className='text-muted-foreground'>Payment</p>
          <p className='font-medium capitalize'>{booking.payment_status}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>Status</p>
          <p className='font-medium capitalize'>{booking.status}</p>
        </div>
      </CardContent>

      <CardFooter className='flex flex-col items-start gap-2'>
        {canCancel ? (
          <button
            onClick={() => {
              if (cancellingRef.current) return;
              if (confirm('Cancel this booking?')) {
                cancellingRef.current = true;
                cancelMutation.mutate(booking.id, {
                  onSettled: () => {
                    cancellingRef.current = false;
                  },
                });
              }
            }}
            disabled={cancelMutation.isPending}
            className='text-sm text-red-500 hover:underline disabled:opacity-50'
          >
            {cancelMutation.isPending ? 'Cancelling…' : 'Cancel Booking'}
          </button>
        ) : // <button
        //   onClick={() => {
        //     if (confirm('Cancel this booking?'))
        //       cancelMutation.mutate(booking.id);
        //   }}
        //   disabled={cancelMutation.isPending}
        //   className='text-sm text-red-500 hover:underline disabled:opacity-50'
        // >
        //   {cancelMutation.isPending ? 'Cancelling…' : 'Cancel Booking'}
        // </button>
        booking.status === 'confirmed' ? (
          <p className='text-xs text-muted-foreground'>
            Cancellation window has passed (within 2 hours of start). Contact
            the cafe to cancel.
          </p>
        ) : null}
        {cancelMutation.isError && (
          <p className='text-xs text-red-500'>{cancelMutation.error.message}</p>
        )}
      </CardFooter>
    </Card>
  );
}

function EmptyUpcoming() {
  return (
    <Card>
      <CardContent className='py-20 text-center'>
        <Gamepad2 className='mx-auto mb-3 h-10 w-10 text-muted-foreground' />
        <p className='font-medium'>No upcoming bookings</p>
        <p className='mb-4 text-sm text-muted-foreground'>
          Book your next session.
        </p>
        <a
          href='/#booking'
          className='inline-block rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-black'
        >
          Book Session
        </a>
      </CardContent>
    </Card>
  );
}

export default function CustomerDashboard() {
  const { data: bookings, isLoading, error } = useMyBookings();
  const { upcoming, history } = useMemo(() => {
    const list = bookings ?? [];
    const now = Date.now();

    return {
      upcoming: list.filter((b) => {
        if (b.status === 'cancelled' || b.status === 'completed') return false;

        const start = new Date(`${b.date}T${b.start_time}`);
        const end = new Date(start);
        end.setHours(end.getHours() + Number(b.duration_hours));

        return end.getTime() >= now;
      }),

      history: list.filter((b) => {
        if (b.status === 'cancelled' || b.status === 'completed') return true;

        const start = new Date(`${b.date}T${b.start_time}`);
        const end = new Date(start);
        end.setHours(end.getHours() + Number(b.duration_hours));

        return end.getTime() < now;
      }),
    };
  }, [bookings]);
  // const { upcoming, history } = useMemo(() => {
  //   const list = bookings ?? [];
  //   const now = Date.now();
  //   return {
  //     upcoming: list.filter((b) => {
  //       const start = new Date(`${b.date}T${b.start_time}`).getTime();
  //       return (
  //         b.status !== 'cancelled' && b.status !== 'completed' && start >= now
  //       );
  //     }),
  //     history: list.filter((b) => {
  //       const start = new Date(`${b.date}T${b.start_time}`).getTime();
  //       return (
  //         b.status === 'cancelled' || b.status === 'completed' || start < now
  //       );
  //     }),
  //   };
  // }, [bookings]);

  return (
    <div className='container mx-auto max-w-6xl py-8'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <p className='text-sm text-muted-foreground'>Welcome back</p>
          <h1 className='text-3xl font-bold'>Customer Dashboard</h1>
        </div>
        <a
          href='/#booking'
          className='rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-black'
        >
          Book Session
        </a>
      </div>

      <Tabs defaultValue='upcoming' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='upcoming'>
            <CalendarDays className='mr-2 h-4 w-4' />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value='history'>
            <History className='mr-2 h-4 w-4' />
            History
          </TabsTrigger>
          <TabsTrigger value='account'>
            <User className='mr-2 h-4 w-4' />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value='upcoming' className='mt-4'>
          {isLoading ? (
            <p className='text-sm text-muted-foreground'>Loading…</p>
          ) : upcoming.length ? (
            <div className='flex flex-col gap-4'>
              {upcoming.map((b) => (
                <UpcomingCard key={b.id} booking={b} />
              ))}
            </div>
          ) : (
            <EmptyUpcoming />
          )}
        </TabsContent>

        <TabsContent value='history' className='mt-4'>
          {history.length ? (
            <div className='space-y-4'>
              {history.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className='pb-3'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <CardTitle className='capitalize'>
                          {booking.device}
                        </CardTitle>
                        <CardDescription>
                          {booking.date} • {booking.start_time}
                        </CardDescription>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold
                  ${
                    booking.status === 'completed'
                      ? 'bg-green-500/15 text-green-400'
                      : booking.status === 'cancelled'
                        ? 'bg-red-500/15 text-red-400'
                        : 'bg-cyan-500/15 text-cyan-400'
                  }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                    <div>
                      <p className='text-muted-foreground'>Duration</p>
                      <p>{booking.duration_hours}h</p>
                    </div>

                    <div>
                      <p className='text-muted-foreground'>Players</p>
                      <p>{booking.players}</p>
                    </div>

                    <div>
                      <p className='text-muted-foreground'>Amount</p>
                      <p>₹{booking.amount}</p>
                    </div>

                    <div>
                      <p className='text-muted-foreground'>Payment</p>
                      <p className='capitalize'>{booking.payment_status}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className='py-16 text-center'>
                <History className='mx-auto mb-3 h-10 w-10 text-muted-foreground' />
                <p className='font-medium'>No booking history</p>
                <p className='text-sm text-muted-foreground'>
                  Your completed and cancelled bookings will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='account' className='mt-4'>
          {/* Account card content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
