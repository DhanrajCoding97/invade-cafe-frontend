// app/dashboard/staff/page.tsx
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/requrireRole';
import LiveSessionBoard from './components/LiveSessionBoard';

export default async function StaffDashboard() {
  const { role } = await requireRole(['staff', 'owner']);
  const supabase = await createClient();

  const today = new Date().toISOString().slice(0, 10);

  const [{ data: stations }, { data: bookings }] = await Promise.all([
    supabase.from('stations').select('id, name, type').order('name'),
    supabase
      .from('bookings')
      .select(
        `
    *,
    profiles!bookings_user_id_fkey (
      full_name
    )
  `,
      )
      .eq('date', today)
      .in('status', ['confirmed', 'completed']),
  ]);

  return (
    <div className='flex flex-col gap-6 p-6 mt-14'>
      <LiveSessionBoard
        stations={stations ?? []}
        initialBookings={bookings ?? []}
      />
      {role === 'owner' && (
        <p className='text-xs text-neutral-500'>
          Owner-only panels (role mgmt, pricing, tournaments) go here next.
        </p>
      )}
    </div>
  );
}
