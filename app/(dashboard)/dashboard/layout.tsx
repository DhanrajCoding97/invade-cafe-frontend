// src/app/dashboard/layout.tsx
import { requireRole } from '@/lib/auth/requrireRole';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { ModeToggle } from './components/ModeToggle';
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = await requireRole(['staff', 'owner']);
  return (
    <ThemeProvider
    attribute='class'
    defaultTheme='system'
    enableSystem
    disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar role={role} user={user} />

        <SidebarInset className='h-dvh overflow-hidden'>
          <header className='flex h-14 items-center border-b px-4'>
            <SidebarTrigger />
            <ModeToggle />
          </header>

          <main className='p-6 flex-1 overflow-y-auto overscroll-contain'>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

// <SidebarProvider>
//   <AppSidebar role={role} user={user} />
//   <main className='flex flex-col gap-6 p-6'>{children}</main>
// </SidebarProvider>