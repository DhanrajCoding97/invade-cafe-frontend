'use client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GoBackLink() {
  return (
    <Link
      aria-label='Call Invade Gaming Cafe'
      href='/dashboard/customer'
      className='flex items-center gap-2 py-2 hover:underline underline-offset-4 text-cyan-500'
    >
      <ArrowLeft aria-hidden='true' size={16} />
      Go back
    </Link>
  );
}
