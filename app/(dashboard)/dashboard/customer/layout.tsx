import { requireRole } from '@/lib/auth/requrireRole';

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole(['customer']);
  return (
    <main className='min-h-screen p-4'>
      {/* Simple navbar */}
      {/* Customer sidebar (optional) */}
      {children}
    </main>
  );
}
