import React from 'react';
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { orbitron } from '@/lib/fonts';
import './globals.css';
import { cn } from '@/lib/utils';
import SmoothScroll from '@/components/transitions/SmoothScroll';
import { Providers } from '@/providers/QueryProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const baseUrl =
  process.env.Next_PUBLIC_BASE_URL ?? 'https://www.invadegamingcafe.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Invade Gaming Cafe | PC, PS5, VR & Sim Racing in Navi Mumbai',
    template: '%s | Invade Gaming Cafe',
  },
  description:
    'Invade Gaming Cafe in Sanpada, Navi Mumbai offers gaming PCs, PS5, VR and immersive sim racing near Juinagar Railway Station. Book your session online.',
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'Invade Gaming Cafe',
    description:
      'Level up at Invade Gaming Cafe. Powerful gaming PCs, PS5, PSVR, Sim Racing — book online in seconds.',
    url: baseUrl,
    siteName: 'Invade Gaming Cafe',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invade Gaming Cafe',
    description:
      'Level up at Invade Gaming Cafe. Powerful gaming PCs, PS5, PSVR, Sim Racing — book online.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#business`,
    name: 'Invade Gaming Cafe',
    description:
      'Gaming cafe in Sanpada, Navi Mumbai offering high-performance gaming PCs, PS5, PSVR, and Sim Racing stations with online booking.',
    url: baseUrl,
    image: `${baseUrl}/og-image.jpg`,
    telephone: '+91-8291158779',
    priceRange: '₹80 - ₹200',
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        'Ground Floor, Bhakti Residency, Shop-08/A, Plot Number-06, Opposite Juinagar Railway Station, Sector 11',
      addressLocality: 'Sanpada, Navi Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400705',
      addressCountry: 'IN',
    },
    hasMap:
      'https://www.google.com/maps/search/?api=1&query=Invade+Gaming+Cafe+Sanpada+Navi+Mumbai',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '10:00',
      closes: '23:00',
    },
    sameAs: [
      'https://www.instagram.com/invadegamingcafe',
      'https://www.facebook.com/people/Invade-Gaming-Cafe/61563134337524/',
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        name: 'PC Gaming Session',
        priceCurrency: 'INR',
        price: '80',
      },
      {
        '@type': 'Offer',
        name: 'PS5 Gaming Session',
        priceCurrency: 'INR',
        price: '100',
      },
      {
        '@type': 'Offer',
        name: 'Sim Racing Session',
        priceCurrency: 'INR',
        price: '150',
      },
      {
        '@type': 'Offer',
        name: 'VR Gaming Session',
        priceCurrency: 'INR',
        price: '200',
      },
    ],
  };
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('antialiased dark', orbitron.variable)}>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <Providers>{children}</Providers>
        </SmoothScroll>
        <Toaster
          position='bottom-right'
          toastOptions={{ className: 'z-[99999]' }}
          richColors
          closeButton
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
