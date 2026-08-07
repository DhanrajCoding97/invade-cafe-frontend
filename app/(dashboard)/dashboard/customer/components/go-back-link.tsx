'use client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GoBackLink() {
  return (
    <Link href='/dashboard/customer' className='flex items-center gap-2'>
      {' '}
      <ArrowLeft size={16} />
      Go back
    </Link>
  );
}
