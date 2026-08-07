export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen'>
      {/* Simple navbar */}
      {/* Customer sidebar (optional) */}
      {children}
    </main>
  );
}
