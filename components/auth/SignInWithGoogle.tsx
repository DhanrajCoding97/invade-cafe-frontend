'use client';
import dynamic from 'next/dynamic';

const CornerCutButton = dynamic(
  () => import('@/app/components/neonblade-ui/corner-cut-button'),
  {
    ssr: false,
  },
);
import { FcGoogle } from 'react-icons/fc';
import { handleOAuthLogin } from '@/lib/auth/oauth';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import styles from '@/app/components/neonblade-ui/navbar/navbar.module.css';
import { useState } from 'react';
export default function SignInWithGoogle() {
  const [loginOpen, SetLoginOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <Dialog open={loginOpen} onOpenChange={SetLoginOpen}>
      <DialogTrigger asChild>
        <button
          className={styles['nbr-mobile-item']}
          onClick={() => SetLoginOpen(true)}
        >
          Login
        </button>
      </DialogTrigger>
      <DialogContent className='z-9999 w-full max-w-[90vw] border border-primary/30 bg-black p-0 shadow-glow-cyan [&>button]:hidden'>
        {/* Background grid */}
        <div className='absolute inset-0 pointer-events-none bg-grid opacity-60' />

        {/* Top glow line */}
        <div className='absolute top-0 left-0 h-0.5 w-full bg-linear-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_var(--cyan)]' />

        <div className='relative flex flex-col items-center px-4 py-9 sm:p-10'>
          {/* Logo / avatar area */}
          <div className='group relative mb-10'>
            <div className='absolute inset-0 scale-150 rounded-full border border-primary/20 duration-3000 animate-ping' />
            <div className='absolute inset-0 scale-125 rounded-full border border-accent/30 animate-pulse' />

            <div className='relative flex h-28 w-28 items-center justify-center'>
              <div className='absolute inset-0 rotate-45 border-2 border-accent/50 bg-muted transition-transform duration-700 group-hover:rotate-90' />
              <div className='absolute inset-1 -rotate-45 border border-primary/30 bg-black transition-transform duration-700 group-hover:rotate-0' />

              <div className='relative z-10 flex flex-col items-center'>
                <Image
                  src='/images/invade-logo.png'
                  alt='Invade Cafe Logo'
                  height={70}
                  width={70}
                />
              </div>
            </div>

            {/* HUD brackets */}
            <div className='absolute -top-4 -left-4 h-6 w-6 border-t-2 border-l-2 border-primary' />
            <div className='absolute -bottom-4 -right-4 h-6 w-6 border-b-2 border-r-2 border-primary' />
          </div>

          {/* Headline */}
          <div className='mb-10 text-center'>
            <DialogTitle
              className='text-[clamp(1.688rem,.7174rem+3.913vw,2rem)] font-bold leading-none tracking-tighter text-foreground uppercase'
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              System Access
            </DialogTitle>
            <DialogDescription asChild>
              <div className='mt-3 inline-flex items-center gap-2 border border-primary/20 bg-muted px-3 py-1'>
                <span className='h-2 w-2 animate-pulse rounded-full bg-accent' />
                <p
                  className='text-[10px] font-mono uppercase tracking-[0.25em] text-primary'
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Node: INVADE_CAFE_INTERNAL
                </p>
              </div>
            </DialogDescription>
          </div>
          <CornerCutButton
            cornerSize={12}
            size={isMobile ? 'sm' : 'md'}
            color='cyan'
            variant='ghost'
            hoverEffect='pulse'
            onClick={handleOAuthLogin}
          >
            Continue with
            <FcGoogle />
          </CornerCutButton>
          {/* Footer / metadata */}
          <div className='mt-12 w-full'>
            <div className='mb-6 flex items-center justify-between opacity-40'>
              <div className='h-px flex-1 bg-linear-to-r from-transparent to-primary' />
              <div className='mx-3 flex gap-1'>
                <div className='h-3 w-1 bg-primary' />
                <div className='h-3 w-1 bg-primary/50' />
                <div className='h-3 w-1 bg-primary/20' />
              </div>
              <div className='h-px flex-1 bg-linear-to-l from-transparent to-primary' />
            </div>

            <p
              className='text-center text-[9px] font-mono leading-relaxed uppercase tracking-widest text-muted-foreground'
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Security Protocol v2.48 //{' '}
              <span className='text-primary/70'>Authorized use only</span>
              <br />
              Read{' '}
              <a
                href='#'
                className='text-foreground underline decoration-primary/30 transition-colors hover:text-primary'
              >
                Terms
              </a>{' '}
              &amp;{' '}
              <a
                href='#'
                className='text-foreground underline decoration-primary/30 transition-colors hover:text-primary'
              >
                Privacy
              </a>{' '}
              policies
            </p>
          </div>
        </div>

        {/* Corner status data */}
        <div className='absolute bottom-3 left-4 flex gap-1.5'>
          <div className='h-1.5 w-1.5 bg-accent shadow-[0_0_5px_var(--accent)]' />
          <div className='h-1.5 w-1.5 bg-accent/20' />
          <div className='h-1.5 w-1.5 bg-accent/20' />
        </div>
        <div className='absolute top-3 right-5'>
          <span
            className='text-[9px] font-mono tracking-tighter text-primary/40'
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ID: CAFE-8842-X
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
