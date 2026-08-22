import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/requrireRole';
import LiveSessionBoard from './components/LiveSessionBoard';
function getTodayIST() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export default async function LiveSessionBoardPage() {
  const { role } = await requireRole(['staff', 'owner']);
  const supabase = await createClient();

  const today = getTodayIST();
  const [{ data: stations }, { data: bookings }, { data: extensions }] =
    await Promise.all([
      supabase.from('stations').select('id, name, type').order('name'),
      supabase
        .from('bookings')
        .select(`*, profiles!bookings_user_id_fkey (full_name)`)
        .eq('date', today)
        .in('status', ['confirmed', 'completed']),
      supabase
        .from('session_extensions')
        .select('*')
        .eq('payment_status', 'pending'),
    ]);
  return (
    <LiveSessionBoard
      stations={stations ?? []}
      initialBookings={bookings ?? []}
      initialExtensions={extensions ?? []}
    />
  );
}
