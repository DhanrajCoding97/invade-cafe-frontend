import { createClient } from '@/lib/supabase/server';
import AuthSlot from '@/components/auth/AuthSlot';
import NavBar from '../components/neonblade-ui/navbar';

export default async function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navItems = [
    { label: 'Home', href: '/#hero' },
    { label: 'Services', href: '/#services' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Booking', href: '/#booking' },
    { label: 'Contact', href: '/#contact' },
  ];

  if (user) {
    navItems.push({
      label: 'Dashboard',
      href: '/dashboard',
    });
  }
  return (
    <>
      <NavBar
        variant='standard'
        position='fixed'
        transparency='transparent'
        color='cyan'
        logoText='Invade'
        scrollEffect
        hideOnScroll
        navAlign='center'
        items={navItems}
        authSlot={<AuthSlot />}
      />
      {children}
    </>
  );
}
