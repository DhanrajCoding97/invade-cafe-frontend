export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen p-4'>
      {/* Simple navbar */}
      {/* Customer sidebar (optional) */}
      {children}
    </main>
  );
}
