// app/dashboard/staff/page.tsx
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/requrireRole';
import LiveSessionBoard from '../components/LiveSessionBoard';

export default async function LiveSessionBoardPage() {
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
    <LiveSessionBoard
      stations={stations ?? []}
      initialBookings={bookings ?? []}
    />
  );
}
