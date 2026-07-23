import { requireRole } from '@/lib/auth/requrireRole';

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(['owner', 'staff']);

  return <>{children}</>;
}
