'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { useMyProfile } from '@/hooks/use-my-profile';
import Link from 'next/link';

type SignOutButtonProps = {
  name?: string;
  avatar?: string;
};

export default function SignOutButton({ name, avatar }: SignOutButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { data: profile } = useMyProfile();

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [open]);

  const handleSignOut = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error('Failed to sign out');
      return;
    }

    setOpen(false);
    toast.success('Signed out successfully');
    router.refresh();
  };

  const fullName = profile?.full_name ?? name ?? 'User';

  return (
    <div ref={wrapRef} className='relative w-fit'>
      {/* =========================
          MOBILE — < 768px
          ========================= */}
      <div className='flex flex-col min-[880px]:hidden'>
        {/* Account */}
        <div className='flex items-center gap-3 px-2 py-3'>
          <Avatar className='relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400/60 bg-black text-sm font-bold text-cyan-400'>
            <AvatarImage src={profile?.avatar_url ?? avatar ?? ''} />
            <AvatarFallback>
              {fullName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span className='truncate text-xs font-bold uppercase tracking-wider text-cyan-400'>
            {fullName}
          </span>
        </div>

        {/* Dashboard */}
        <Link
          href='/dashboard'
          className='flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-cyan-400/10 hover:text-cyan-400'
        >
          Dashboard
        </Link>

        {/* Logout */}
        <button
          type='button'
          onClick={handleSignOut}
          className='flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-cyan-400/10 hover:text-cyan-400'
        >
          <LogOut className='h-3.5 w-3.5' />
          Logout
        </button>
      </div>

      {/* =========================
          DESKTOP — >= 768px
          ========================= */}
      <div className='relative hidden min-[880px]:block'>
        <Avatar
          onClick={() => setOpen((value) => !value)}
          aria-label='User account menu'
          aria-expanded={open}
          aria-haspopup='menu'
          className='relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-cyan-400/60 bg-black text-sm font-bold text-cyan-400 transition-all duration-200 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,212,255,0.45)]'
        >
          <AvatarImage src={profile?.avatar_url ?? avatar ?? ''} />
          <AvatarFallback>{fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Desktop Dropdown */}
        {open && (
          <div
            role='menu'
            className='absolute right-0 top-[calc(100%+0.5rem)] z-50 w-52 overflow-hidden border border-cyan-400/50 bg-black/95 p-1 shadow-[0_0_20px_rgba(0,212,255,0.2)] backdrop-blur-md'
          >
            {/* Name */}
            <div className='border-b border-cyan-400/20 px-3 py-2'>
              <p className='truncate text-xs font-bold uppercase tracking-wider text-cyan-400'>
                {fullName}
              </p>
            </div>

            {/* Dashboard */}
            <Link
              href='/dashboard'
              role='menuitem'
              onClick={() => setOpen(false)}
              className='flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-cyan-400/10 hover:text-cyan-400'
            >
              Dashboard
            </Link>

            {/* Logout */}
            <button
              type='button'
              role='menuitem'
              onClick={handleSignOut}
              className='flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-cyan-400/10 hover:text-cyan-400'
            >
              <LogOut className='h-3.5 w-3.5' />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
