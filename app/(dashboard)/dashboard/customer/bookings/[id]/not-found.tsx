'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className='bg-white dark:bg-black min-h-dvh flex flex-col items-center justify-center'>
      <div className='py-8 px-4 mx-auto max-w-7xl lg:py-16 lg:px-6'>
        <div className='mx-auto max-w-screen-sm text-center'>
          <h1 className='mb-4 text-6xl sm:text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500'>
            404
          </h1>
          <p className='mb-4 text-2xl sm:text-3xl tracking-tight font-bold bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            Booking not found.
          </p>
          <p className='mb-4 text-sm sm:text-lg lg:text-xl font-light text-gray-500 dark:text-gray-400'>
            The Booking you're looking for doesn't exist.You'll find lots to
            explore on the home page.{' '}
          </p>
          <Link
            href='/dashboard/customer'
            className='inline-flex hover:underline underline-offset-2 text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
