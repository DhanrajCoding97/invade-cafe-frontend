'use client';
import { Phone } from 'lucide-react';
import Link from 'next/link';

export default function ContactLink() {
  return (
    <Link
      aria-label='Call Invade Gaming Cafe'
      href='/dashboard/customer'
      className='flex items-center gap-2 py-2 hover:underline underline-offset-4 text-cyan-500'
    >
      <Phone size={16} aria-hidden='true' />
      Need help with this booking? Contact for help.
    </Link>
  );
}
