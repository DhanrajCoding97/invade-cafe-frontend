import { Orbitron, Rajdhani } from 'next/font/google';

export const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

export const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
});
