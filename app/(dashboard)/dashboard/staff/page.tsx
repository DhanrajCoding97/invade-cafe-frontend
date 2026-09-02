import { getDashboardData } from '@/lib/queries/dashboard';
import { KpiCard } from '../components/KpiCard';
import { RevenueChartClient } from '../components/charts/RevenueChartClient';
import Link from 'next/link';
import { formatIST } from '@/lib/date-list';
import { getCurrentUserRole } from '@/lib/auth/getCurrentUserRole';
export default async function StaffDashboardPage() {
  const { user } = await getCurrentUserRole();
  const data = await getDashboardData();
  const today = formatIST(new Date(), 'd MMM • EEEE');
  return (
    <div className='space-y-4 lg:space-y-6'>
      <div>
        <h2 className='text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-extrabold'>
          <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            Welcome back&#44; {user.user_metadata.full_name}
          </span>
        </h2>
        <p className='max-w-[80ch] text-[clamp(0.875rem,0.8rem+0.3vw,1rem)] leading-6 text-[#bcbcbc]'>
          Here's an overview of your cafe's bookings, revenue, and activity.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        <KpiCard label="Today's Revenue" value={`₹${data.todayRevenue}`} />
        <KpiCard
          label="Today's Bookings"
          value={String(data.totalBookingsToday)}
          subtext={`${data.completedToday} completed · ${data.upcomingToday} upcoming`}
        />
        <KpiCard label='Live Sessions' value={String(data.liveCount)} />
        <KpiCard
          label='Occupancy'
          value={`${data.occupancyPct}%`}
          subtext={`${data.liveCount} / ${data.totalStations} stations`}
        />
      </div>
      <RevenueChartClient data={data.revenueTrend} />
      <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-sm font-semibold text-white/80'>
            Upcoming Bookings
          </h3>
          <Link
            href='/dashboard/staff/bookings'
            className='text-xs text-cyan-400'
          >
            View all →
          </Link>
        </div>
        <div className='space-y-2'>
          {data.recentBookings.length === 0 ? (
            <p className='text-sm text-white/40'>No upcoming bookings today.</p>
          ) : (
            data.recentBookings.map((b: any) => (
              <div
                key={b.id}
                className='flex items-center justify-between text-sm py-2 border-t border-white/5 first:border-0'
              >
                <span className='text-white/70'>
                  {b.start_time.slice(0, 5)}
                </span>
                <span className='text-white'>
                  {b.profiles?.full_name ?? b.customer_name ?? 'Guest'}
                </span>
                <span className='text-white/50'>{b.device?.toUpperCase()}</span>
                <span
                  className={
                    b.payment_status === 'paid'
                      ? 'text-green-400'
                      : 'text-amber-400'
                  }
                >
                  {b.payment_status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className='flex flex-wrap gap-3'>
        <Link
          href='/dashboard/staff/bookings/new'
          className='rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-black'
        >
          + Manual Booking
        </Link>
        <Link
          href='/dashboard/staff/live-sessions'
          className='rounded-lg bg-white/10 px-4 py-2 text-sm text-white'
        >
          Live Sessions
        </Link>
      </div>
    </div>
  );
}
