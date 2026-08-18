import { Metadata } from 'next';
import GamesClient from './components/gameClient';
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.invadegamingcafe.com';
export const metadata: Metadata = {
  title: 'Gaming Stations: PCs, PS5, VR & Sim Racing',
  description:
    'Browse our full game library across PC, PS5, PSVR, and sim racing stations at Invade Gaming Cafe. Filter by category and book your session online.',
  alternates: {
    canonical: `${baseUrl}/games`,
  },
  openGraph: {
    title: 'Gaming Stations | Invade Gaming Cafe',
    description:
      'Browse our full game library across PC, PS5, PSVR, and sim racing stations. Filter by category and book online.',
    url: `${baseUrl}/games`,
    images: ['/og-image2.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaming Stations | Invade Gaming Cafe',
    description:
      'Browse our full game library across PC, PS5, PSVR, and sim racing stations.',
    images: ['/og-image.jpg'],
  },
};

export default function GamesPage() {
  return <GamesClient />;
}
