// import * as React from 'react';
// import { cva, type VariantProps } from 'class-variance-authority';
// import { Slot } from 'radix-ui';

// import { cn } from '@/lib/utils';

// const buttonVariants = cva(
//   "tracking-wider group/button inline-flex cursor-pointer shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
//   {
//     variants: {
//       variant: {
//         default: 'bg-primary text-primary-foreground hover:bg-primary/80',
//         outline:
//           'border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
//         secondary:
//           'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
//         ghost:
//           'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
//         destructive:
//           'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
//         link: 'text-primary underline-offset-4 hover:underline',
//         action:
//           'py-1 px-0.5 bg-transparent border-transparent shadow-md text-muted-foreground hover:bg-secondary transition-all duration-300 ease-in group',
//         'icon-plain':
//           'group bg-transparent border-transparent shadow-none text-current hover:bg-transparent hover:text-current focus-visible:ring-0 focus-visible:border-transparent active:translate-y-0',
//       },
//       size: {
//         default:
//           'h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
//         xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
//         sm: 'h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
//         lg: 'h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
//         icon: 'size-9',
//         'icon-xs':
//           "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
//         'icon-sm':
//           'size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md',
//         'icon-lg': 'size-10',
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//     },
//   },
// );

// function Button({
//   className,
//   variant = 'default',
//   size = 'default',
//   asChild = false,
//   ...props
// }: React.ComponentProps<'button'> &
//   VariantProps<typeof buttonVariants> & {
//     asChild?: boolean;
//   }) {
//   const Comp = asChild ? Slot.Root : 'button';

//   return (
//     <Comp
//       data-slot='button'
//       data-variant={variant}
//       data-size={size}
//       className={cn(buttonVariants({ variant, size, className }))}
//       {...props}
//     />
//   );
// }

// export { Button, buttonVariants };
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const CORNER_CLIP_DOUBLE =
  '[clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]';

const CORNER_CLIP_SINGLE =
  '[clip-path:polygon(0_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%)]';

const buttonVariants = cva(
  "tracking-wider group/button inline-flex cursor-pointer shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline:
          'border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline',
        action:
          'py-1 px-0.5 bg-transparent border-transparent shadow-md text-muted-foreground hover:bg-secondary transition-all duration-300 ease-in group',
        'icon-plain':
          'group bg-transparent border-transparent shadow-none text-current hover:bg-transparent hover:text-current focus-visible:ring-0 focus-visible:border-transparent active:translate-y-0',
        // cyber: cn(
        //   CORNER_CLIP_SINGLE,
        //   'rounded-none border-none bg-[#28F1FF] font-mono font-bold uppercase text-black',
        //   'shadow-[0_0_18px_-4px_rgba(40,241,255,0.9)]',
        //   'hover:bg-[#5DF6FF] hover:shadow-[0_0_28px_-2px_rgba(40,241,255,1)]',
        //   'focus-visible:ring-[#28F1FF]/40',
        //   'data-[glow=off]:shadow-none data-[glow=off]:hover:shadow-none',
        // ),
        cyber: cn(
          CORNER_CLIP_SINGLE,
          'rounded-none border-none bg-[#28F1FF] font-mono font-bold uppercase text-black',
          'transition-all duration-200',
          'shadow-[0_0_18px_-4px_rgba(40,241,255,0.9)]',
          'hover:bg-white hover:shadow-[0_0_30px_2px_rgba(40,241,255,1)]',
          'active:bg-[#28F1FF] active:shadow-[0_0_18px_-4px_rgba(40,241,255,0.9)]',
          'focus-visible:ring-[#28F1FF]/40',
          'data-[glow=off]:shadow-none data-[glow=off]:hover:shadow-none',
        ),
        'cyber-outline': cn(
          CORNER_CLIP_DOUBLE,
          'rounded-none border border-[#28F1FF]/50 bg-[#0a1416] font-mono font-bold uppercase text-[#28F1FF]',
          '[text-shadow:0_0_8px_rgba(40,241,255,0.7)]',
          'hover:border-[#28F1FF] hover:bg-[#28F1FF]/10 hover:shadow-[0_0_18px_-6px_rgba(40,241,255,0.8)]',
          'focus-visible:ring-[#28F1FF]/40',
        ),
      },
      size: {
        default:
          'h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
        lg: 'h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-9',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  glow = true,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    glow?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={size}
      data-glow={glow ? 'on' : 'off'}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
