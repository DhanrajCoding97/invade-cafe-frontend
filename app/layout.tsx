import { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import AuthSlot from '@/components/auth/AuthSlot';
import { Orbitron } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import SmoothScroll from '@/components/transitions/SmoothScroll';
import NavBar from './components/neonblade-ui/navbar';
import { Providers } from '@/providers/QueryProvider';
const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '600', '900'],
});

export const metadata: Metadata = {
  title: 'Invade Gaming Cafe',
  description:
    'Level up at Invade Gaming Cafe. Experience powerful gaming PCs, PS5, PSVR, Sim Racing, and book your gaming session online in seconds.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn('antialiased dark', orbitron.variable)}
    >
      <body>
        <SmoothScroll>
          <NavBar
            variant='standard'
            position='fixed'
            transparency='transparent'
            color='cyan'
            logoText='Invade'
            scrollEffect
            hideOnScroll
            navAlign='center'
            items={[
              { label: 'Home', href: '#hero' },
              { label: 'Services', href: '#services' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Gallery', href: '#gallery' },
              { label: 'Testimonials', href: '#testimonials' },
              { label: 'Booking', href: '#booking' },
              { label: 'Contact', href: '#contact' },
            ]}
            authSlot={<AuthSlot />}
          />
          <Providers>{children}</Providers>
        </SmoothScroll>
        <Toaster />
      </body>
    </html>
  );
}
