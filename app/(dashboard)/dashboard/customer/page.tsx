'use client';
import { useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  History,
  User2,
  Gamepad2,
  LogOut,
  Mail,
  Phone,
  Trophy,
  Clock3,
  Wallet,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Badge from '@/app/components/neonblade-ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  useMyBookings,
  useCancelMyBooking,
} from '@/hooks/use-customer-booking';
import { useMyProfile } from '@/hooks/use-my-profile';
import { useRefundPercent } from '@/hooks/use-refund-percent';
import type { BookingRow } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { handleSignOut } from '@/lib/auth/oauth';

function hoursUntil(booking: BookingRow) {
  const start = new Date(`${booking.date}T${booking.start_time}`);
  return (start.getTime() - Date.now()) / 3_600_000;
}

function UpcomingCard({ booking }: { booking: BookingRow }) {
  const cancelMutation = useCancelMyBooking();
  const { data } = useRefundPercent();

  const refundPercent = data?.refundPercent ?? 100;

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
          // <button
          //   onClick={() => {
          //     if (cancellingRef.current) return;
          //     if (confirm('Cancel this booking?')) {
          //       cancellingRef.current = true;
          //       cancelMutation.mutate(booking.id, {
          //         onSettled: () => {
          //           cancellingRef.current = false;
          //         },
          //       });
          //     }
          //   }}
          //   disabled={cancelMutation.isPending}
          //   className='text-sm text-red-500 hover:underline disabled:opacity-50'
          // >
          //   {cancelMutation.isPending ? 'Cancelling…' : 'Cancel Booking'}
          // </button>
          // <AlertDialog>
          //   <AlertDialogTrigger asChild>
          //     <Button variant='destructive'>Cancel Booking</Button>
          //   </AlertDialogTrigger>
          //   <AlertDialogContent size='sm'>
          //     <AlertDialogHeader>
          //       <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
          //         <Trash2Icon />
          //       </AlertDialogMedia>
          //       <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
          //       {refundp}
          //       <AlertDialogDescription>
          //         This will permanently cancel your booking.Full refund for
          //         first few cancellations then 90%
          //       </AlertDialogDescription>
          //     </AlertDialogHeader>
          //     <AlertDialogFooter>
          //       <AlertDialogCancel variant='ghost'>Cancel</AlertDialogCancel>
          //       <AlertDialogAction
          //         variant='destructive'
          //         disabled={cancelMutation.isPending}
          //         onClick={() => {
          //           if (cancellingRef.current) return;

          //           cancellingRef.current = true;

          //           cancelMutation.mutate(booking.id, {
          //             onSettled: () => {
          //               cancellingRef.current = false;
          //             },
          //           });
          //         }}
          //       >
          //         {cancelMutation.isPending
          //           ? 'Cancelling...'
          //           : 'Cancel Booking'}
          //       </AlertDialogAction>
          //     </AlertDialogFooter>
          //   </AlertDialogContent>
          // </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!canCancel}>Cancel Booking</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel booking?</AlertDialogTitle>

                <AlertDialogDescription>
                  This will permanently cancel your booking. You will receive a{' '}
                  <strong>{refundPercent}% refund</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Keep Booking</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => cancelMutation.mutate(booking.id)}
                >
                  Cancel Booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
        <Link
          href='/#booking'
          className='inline-block rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-black'
        >
          Book Session
        </Link>
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <Card className='border-cyan-500/10 bg-black/30'>
      <CardContent className='flex flex-col items-center gap-2 py-6'>
        {icon}
        <p className='text-sm text-muted-foreground'>{title}</p>
        <p className='text-2xl font-bold text-cyan-400'>{value}</p>
      </CardContent>
    </Card>
  );
}

export default function CustomerDashboard() {
  const { data: profile } = useMyProfile();
  const { data: bookings, isLoading, error } = useMyBookings();
  const { upcoming, history, stats } = useMemo(() => {
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
      stats: {
        bookings: list.length,
        hoursPlayed: list.reduce(
          (total, booking) => total + Number(booking.duration_hours ?? 0),
          0,
        ),
        totalSpent: list.reduce(
          (total, booking) => total + Number(booking.amount ?? 0),
          0,
        ),
      },
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
      <div className='mb-8 flex flex-col items-center justify-between'>
        <p className='text-xl text-muted-foreground tracking-wider'>
          Welcome back,
          <span className='text-2xl font-black text-[#00F3FF] tracking-wider'>
            {profile?.full_name ? ` ${profile.full_name}` : ''}{' '}
          </span>
        </p>
        {/* <a
          href='/#booking'
          className='rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-black'
        >
          Book Session
        </a> */}
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
            <User2 className='mr-2 h-4 w-4' />
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
              <Link
                href='/#booking'
                className='rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-black'
              >
                Book Session
              </Link>
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

        <TabsContent value='account' className='mt-4 flex flex-col gap-4'>
          {/* Account card content */}
          <Card className='border-cyan-500/20 bg-zinc-900/50 backdrop-blur p-3 sm:p-4 lg:p-5'>
            <CardHeader>
              <CardTitle className='p-0'>Profile</CardTitle>
            </CardHeader>

            <CardContent className='flex items-center gap-2 sm:gap-4 lg:gap-6'>
              <Avatar className='h-14 w-14 sm:h-20 sm:w-20'>
                <AvatarImage src={profile?.avatar_url ?? ''} />
                <AvatarFallback>
                  {profile?.full_name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className='flex-1 space-y-4'>
                <div>
                  <h3 className='text-xl font-semibold text-cyan-400'>
                    {profile?.full_name.name}
                  </h3>
                </div>

                <div className='space-y-3 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <Mail size={16} />
                    {profile?.email}
                  </div>

                  <div className='flex items-center gap-2'>
                    <Phone size={16} />
                    {profile?.phone || 'No phone number'}
                  </div>

                  <div>
                    Member Since{' '}
                    <span className='text-white'>
                      {new Date(profile?.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-cyan-500/20 bg-zinc-900/50 p-2 sm:p-3 lg:p-5'>
            <CardHeader>
              <CardTitle>Gaming Stats</CardTitle>
            </CardHeader>

            <CardContent className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <StatCard
                icon={<Trophy />}
                title='Bookings'
                value={stats.bookings}
              />

              <StatCard
                icon={<Clock3 />}
                title='Hours Played'
                value={stats.hoursPlayed}
              />

              <StatCard
                icon={<Wallet />}
                title='Total Spent'
                value={`₹${stats.totalSpent}`}
              />
            </CardContent>
          </Card>

          <Card className='border-cyan-500/20 bg-zinc-900/50 p-2 sm:p-3 lg:p-5'>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                Booking Reminders
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                Promotional Emails
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className='border-cyan-500/20 bg-zinc-900/50 p-2 sm:p-3 lg:p-5'>
            <CardHeader>
              <CardTitle>Connected Account</CardTitle>
            </CardHeader>

            <CardContent className='flex items-center justify-between'>
              <span>Google</span>

              <Badge
                responsive
                variant='outline'
                dot='pulse'
                glow={true}
                size='sm'
              >
                Connected
              </Badge>
            </CardContent>
          </Card>

          <Button
            variant='outline'
            className='w-full gap-2'
            onClick={handleSignOut}
          >
            <LogOut size={18} />
            Sign Out
          </Button>

          {/* {onDelete && (
            <Card className='border-red-500/30 bg-red-950/10'>
              <CardHeader>
                <CardTitle className='text-red-400'>Danger Zone</CardTitle>
              </CardHeader>

              <CardContent>
                <Button
                  variant='destructive'
                  className='gap-2'
                  onClick={onDelete}
                >
                  <Trash2Icon size={16} />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          )} */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
