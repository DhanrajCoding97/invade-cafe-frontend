// lib/queries/dashboard.ts
import { createClient } from '@/lib/supabase/server';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';
import { formatIST } from '../date-list';
export async function getDashboardData() {
  const supabase = await createClient();
  const todayISO = formatIST(new Date(), 'yyyy-MM-dd'); // for DB queries
  const sevenDaysAgo = format(subDays(new Date(), 6), 'yyyy-MM-dd');

  const [
    { data: todayBookings },
    { data: weekBookings },
    { data: activeStations },
    { data: allStations },
  ] = await Promise.all([
    supabase
      .from('bookings')
      .select(
        'id, amount, status, payment_status, start_time, customer_name, device, station_id, profiles(full_name)',
      )
      .eq('date', todayISO),
    supabase
      .from('bookings')
      .select('date, amount, payment_status')
      .gte('date', sevenDaysAgo)
      .lte('date', todayISO)
      .eq('payment_status', 'paid'),
    supabase
      .from('bookings')
      .select('id')
      .eq('date', todayISO)
      .not('session_started_at', 'is', null)
      .is('session_ended_at', null),
    supabase.from('stations').select('id').neq('status', 'maintenance'),
  ]);

  const todayRevenue = (todayBookings ?? [])
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + (b.amount ?? 0), 0);

  const completedToday = (todayBookings ?? []).filter(
    (b) => b.status === 'completed',
  ).length;
  const upcomingToday = (todayBookings ?? []).filter(
    (b) => b.status === 'confirmed',
  ).length;

  const totalStations = allStations?.length ?? 0;
  const liveCount = activeStations?.length ?? 0;
  const occupancyPct =
    totalStations > 0 ? Math.round((liveCount / totalStations) * 100) : 0;

  // Revenue trend — group by day for last 7 days
  const revenueByDay = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const day = format(subDays(new Date(), i), 'yyyy-MM-dd');
    revenueByDay.set(day, 0);
  }
  (weekBookings ?? []).forEach((b) => {
    revenueByDay.set(b.date, (revenueByDay.get(b.date) ?? 0) + (b.amount ?? 0));
  });

  const revenueTrend = Array.from(revenueByDay.entries()).map(
    ([date, revenue]) => ({
      day: format(new Date(date), 'EEE'),
      revenue,
    }),
  );

  const recentBookings = (todayBookings ?? [])
    .filter((b) => b.status === 'confirmed')
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .slice(0, 5);

  return {
    todayRevenue,
    totalBookingsToday: todayBookings?.length ?? 0,
    completedToday,
    upcomingToday,
    liveCount,
    occupancyPct,
    totalStations,
    revenueTrend,
    recentBookings,
  };
}
