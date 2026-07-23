// src/app/dashboard/layout.tsx
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen w-screen overflow-hidden bg-black'>
      {/* 1. Sidebar Panel */}
      <aside className='w-64 bg-slate-900 text-white flex flex-col p-4 hidden md:flex'>
        <div className='text-xl font-bold mb-8'>Admin Panel</div>
        <nav className='flex flex-col gap-2'>
          <a href='/dashboard' className='hover:bg-slate-800 p-2 rounded'>
            Overview
          </a>
          <a
            href='/dashboard/settings'
            className='hover:bg-slate-800 p-2 rounded'
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* 2. Main Work Area Container */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        {/* Top Header Bar */}
        <header className='h-16 bg-slate-900 border-b border-gray-200 flex items-center justify-between px-6'>
          <h1 className='text-lg font-semibold text-gray-700'>Dashboard</h1>
          <button className='text-sm bg-blue-600 text-white px-3 py-1.5 rounded'>
            Logout
          </button>
        </header>

        {/* Scrollable Dashboard Page Content */}
        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
