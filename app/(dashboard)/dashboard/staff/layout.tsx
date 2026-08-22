import { requireRole } from '@/lib/auth/requrireRole';
import React from 'react';
import { rajdhani } from '@/lib/fonts';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { ServiceWorkerRegistrar } from '../components/ServiceWorkerRegistrar';
export default async function StaffDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = await requireRole(['staff', 'owner']);
  return (
    <div className={rajdhani.className}>
      <SidebarProvider>
        <ServiceWorkerRegistrar />

        <AppSidebar role={role} user={user} />

        <SidebarInset className='h-dvh overflow-hidden'>
          <SidebarTrigger className='fixed left-3 top-3 z-40 md:hidden' />

          <main className='flex-1 overflow-y-auto overscroll-contain px-3 pt-14 pb-5 sm:px-6 md:py-8'>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
