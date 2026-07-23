import { redirect } from 'next/navigation';
import { getCurrentUserRole } from '@/lib/auth/getCurrentUserRole';

export default async function DashboardPage() {
  const { role } = await getCurrentUserRole();

  switch (role) {
    case 'owner':
      redirect('/dashboard/staff');

    case 'staff':
      redirect('/dashboard/staff');

    case 'customer':
      redirect('/dashboard/customer');

    default:
      redirect('/');
  }
}
