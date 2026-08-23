export default function PrivacyPage() {
  return (
    <div className='relative min-h-screen bg-black text-white'>
      <div
        className='pointer-events-none fixed inset-0 z-0 opacity-60'
        style={{
          backgroundImage:
            'linear-gradient(rgba(40,241,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(40,241,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className='relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20'>
        <header className='mb-12'>
          <div className='mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#28F1FF]'>
            <span className='h-2 w-2 shrink-0 bg-[#28F1FF] shadow-[0_0_8px_var(--tw-shadow-color)] shadow-[#28F1FF]' />
            Legal // Document 02
          </div>
          <h1 className='mb-2 text-[clamp(2rem,5vw,2.75rem)] font-extrabold leading-tight tracking-tight'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              Privacy Policy
            </span>
          </h1>
          <p className='font-mono text-xs uppercase tracking-wider text-white/40'>
            Last updated: August 2026
          </p>
        </header>

        <p className='mb-10 text-white/70'>
          This policy explains what information Invade Gaming Café collects, how
          it&rsquo;s used, and the rights you have over it.
        </p>

        <nav className='mb-12 border border-white/10 bg-white/[0.02] p-5 sm:p-6'>
          <p className='mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40'>
            On this page
          </p>
          <ol className='columns-1 gap-x-8 text-sm text-white/70 sm:columns-2'>
            {[
              ['collect', 'Information We Collect'],
              ['use', 'How We Use Your Information'],
              ['payments', 'Payment Information'],
              ['sharing', 'Data Sharing'],
              ['cookies', 'Cookies'],
              ['retention', 'Data Retention'],
              ['security', 'Security'],
              ['rights', 'Your Rights'],
              ['contact', 'Contact'],
            ].map(([id, label]) => (
              <li key={id} className='mb-1.5 break-inside-avoid'>
                <a
                  href={`#${id}`}
                  className='border-b border-transparent hover:border-[#28F1FF] hover:text-[#28F1FF]'
                >
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <Clause n='01' id='collect' title='Information We Collect'>
          <p>We may collect:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Google account information (when signing in with Google)</li>
            <li>Booking history</li>
            <li>Payment references</li>
            <li>Device/browser information</li>
          </ul>
        </Clause>

        <Clause n='02' id='use' title='How We Use Your Information'>
          <p>Your information is used to:</p>
          <ul>
            <li>Create bookings</li>
            <li>Manage your account</li>
            <li>Contact you about bookings</li>
            <li>Process payments</li>
            <li>Improve our services</li>
            <li>Prevent fraud</li>
          </ul>
        </Clause>

        <Clause n='03' id='payments' title='Payment Information'>
          <p>Online payments are securely processed through Razorpay.</p>
          <Highlight>
            We never store{' '}
            <strong className='text-[#28F1FF]'>card numbers</strong>,{' '}
            <strong className='text-[#28F1FF]'>CVV</strong>,{' '}
            <strong className='text-[#28F1FF]'>UPI PIN</strong>, or{' '}
            <strong className='text-[#28F1FF]'>banking credentials</strong>.
          </Highlight>
        </Clause>

        <Clause n='04' id='sharing' title='Data Sharing'>
          <p>We may share limited information with:</p>
          <ul>
            <li>Razorpay</li>
            <li>Hosting providers</li>
            <li>Government authorities when legally required</li>
          </ul>
          <p className='font-mono text-xs uppercase tracking-wider text-[#FE11FF]'>
            We never sell customer information.
          </p>
        </Clause>

        <Clause n='05' id='cookies' title='Cookies'>
          <p>We use cookies to:</p>
          <ul>
            <li>Keep users logged in</li>
            <li>Improve website performance</li>
            <li>Remember preferences</li>
          </ul>
        </Clause>

        <Clause n='06' id='retention' title='Data Retention'>
          <p>
            Booking records may be retained for accounting, legal, and customer
            support purposes.
          </p>
        </Clause>

        <Clause n='07' id='security' title='Security'>
          <p>
            We use reasonable technical and organisational measures to protect
            customer information. No online system can guarantee absolute
            security.
          </p>
        </Clause>

        <Clause n='08' id='rights' title='Your Rights'>
          <p>You may request:</p>
          <ul>
            <li>Access to your data</li>
            <li>Correction of inaccurate information</li>
            <li>
              Deletion of your account (subject to legal record-keeping
              requirements)
            </li>
          </ul>
        </Clause>

        <Clause n='09' id='contact' title='Contact'>
          <p>For questions regarding this Privacy Policy:</p>
          <div className='mt-4 border border-[#28F1FF]/30 bg-[#28F1FF]/5 p-6 text-center font-mono'>
            <a
              href='mailto:Invadegamingcafe@gmail.com'
              className='text-[#28F1FF] hover:underline'
            >
              Invadegamingcafe@gmail.com
            </a>
          </div>
        </Clause>

        <footer className='mt-16 border-t border-white/10 pt-6 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-white/40'>
          Invade Gaming Café // System Document // Rev. Aug 2026
        </footer>
      </div>
    </div>
  );
}

function Clause({
  n,
  id,
  title,
  children,
}: {
  n: string;
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className='mb-10 scroll-mt-8'>
      <h2 className='mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#28F1FF] sm:text-base'>
        <span className='font-mono text-xs text-[#FE11FF]'>{n}</span>
        {title}
      </h2>
      <div className='space-y-3 text-sm text-white/70 [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed [&_ul]:space-y-1.5'>
        {children}
      </div>
    </section>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className='my-4 border-l-2 border-[#28F1FF] bg-[#28F1FF]/5 px-4 py-3 text-sm text-white/80'>
      {children}
    </div>
  );
}
