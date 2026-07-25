
import React from 'react';
import Link from 'next/link';

type ContactLinkProps = {
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
  accent?: string;
  className?: string;
  onReveal?: (data: { icon: HTMLElement; lines: HTMLElement[] }) => void;
};

export const ContactLink = React.forwardRef<HTMLAnchorElement, ContactLinkProps>(
  function ContactLink({ icon, href, children, accent = '#00d4ff', className }, ref) {
    return (
      <Link
        ref={ref}
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={[
          'group flex flex-row items-center gap-3 text-xs sm:text-sm text-[#bcbcbc] transition-colors hover:text-[#00D4FF]',
          className,
        ].filter(Boolean).join(' ')}
      >
        <span
          className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full'
          style={{ background: `${accent}1a`, color: accent }}
        >
          {icon}
        </span>
        <span>{children}</span>
      </Link>
    );
  },
);