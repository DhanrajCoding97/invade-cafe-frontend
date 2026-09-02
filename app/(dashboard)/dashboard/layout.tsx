import { ThemeProvider } from 'next-themes';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ThemeProvider
    //   attribute='class'
    //   defaultTheme='system'
    //   enableSystem
    //   disableTransitionOnChange
    // >
    // </ThemeProvider>
    <>{children}</>
  );
}
