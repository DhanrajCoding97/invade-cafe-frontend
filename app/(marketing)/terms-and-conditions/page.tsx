export default function TermsAndConditionsPage() {
  return (
    <div className='relative min-h-screen bg-black text-white'>
      {/* background grid, same treatment as hero */}
      <div
        className='pointer-events-none fixed inset-0 z-0 opacity-60'
        style={{
          backgroundImage:
            'linear-gradient(rgba(40,241,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(40,241,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className='relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20'>
        {/* header */}
        <header className='mb-12'>
          <div className='mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#28F1FF]'>
            <span className='h-2 w-2 shrink-0 bg-[#28F1FF] shadow-[0_0_8px_var(--tw-shadow-color)] shadow-[#28F1FF]' />
            Legal // Document 01
          </div>
          <h1 className='mb-2 text-[clamp(2rem,5vw,2.75rem)] font-extrabold leading-tight tracking-tight'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              Terms &amp; Conditions
            </span>
          </h1>
          <p className='font-mono text-xs uppercase tracking-wider text-white/40'>
            Last updated: August 2026
          </p>
        </header>

        <p className='mb-10 text-white/70'>
          Welcome to Invade Gaming Café. By accessing our website, creating an
          account, or making a booking, you agree to these Terms &amp;
          Conditions. If you do not agree with these Terms, please do not use
          our website or services.
        </p>

        {/* table of contents */}
        <nav className='mb-12 border border-white/10 bg-white/[0.02] p-5 sm:p-6'>
          <p className='mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40'>
            On this page
          </p>
          <ol className='columns-1 gap-x-8 text-sm text-white/70 sm:columns-2'>
            {[
              ['eligibility', 'Eligibility'],
              ['accounts', 'User Accounts'],
              ['bookings', 'Bookings'],
              ['payments', 'Payments'],
              ['modifications', 'Booking Modifications'],
              ['responsibilities', 'Customer Responsibilities'],
              ['damage', 'Damage to Equipment'],
              ['house-rules', 'House Rules'],
              ['availability', 'Service Availability'],
              ['ip', 'Intellectual Property'],
              ['liability', 'Limitation of Liability'],
              ['termination', 'Termination'],
              ['refunds', 'Refund & Cancellation Policy'],
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

        <Clause n='01' id='eligibility' title='Eligibility'>
          <ul>
            <li>
              Customers must be 14 years of age or older to use our gaming
              systems.
            </li>
            <li>
              Customers under 18 should have permission from a parent or
              guardian where applicable.
            </li>
            <li>
              Management reserves the right to request proof of age if
              necessary.
            </li>
          </ul>
        </Clause>

        <Clause n='02' id='accounts' title='User Accounts'>
          <p>When creating an account, you agree to:</p>
          <ul>
            <li>Provide accurate information.</li>
            <li>Keep your account credentials secure.</li>
            <li>Be responsible for all bookings made through your account.</li>
          </ul>
          <p>
            We reserve the right to suspend accounts involved in fraud or
            misuse.
          </p>
        </Clause>

        <Clause n='03' id='bookings' title='Bookings'>
          <p>
            Bookings are subject to availability. A booking becomes confirmed
            after:
          </p>
          <ul>
            <li>Successful online payment, or</li>
            <li>Confirmation by café staff for manual/offline bookings.</li>
          </ul>
          <Highlight>
            Please arrive at least 10 minutes before your booking. Late arrivals
            may reduce your play time. No-shows may not be eligible for refunds.
          </Highlight>
        </Clause>

        <Clause n='04' id='payments' title='Payments'>
          <p>We accept:</p>
          <ul>
            <li>Razorpay</li>
            <li>Cash (where applicable)</li>
            <li>Manual UPI (where applicable)</li>
          </ul>
          <p>
            Online payments are securely processed through Razorpay. We do not
            store card or UPI credentials.
          </p>
        </Clause>

        <Clause n='05' id='modifications' title='Booking Modifications'>
          <p>
            Bookings may be modified depending on availability. Management
            reserves the right to reject modifications that create scheduling
            conflicts.
          </p>
        </Clause>

        <Clause n='06' id='responsibilities' title='Customer Responsibilities'>
          <p>Customers agree to:</p>
          <ul>
            <li>Handle equipment carefully.</li>
            <li>Follow staff instructions.</li>
            <li>Respect other players.</li>
            <li>Maintain appropriate behaviour.</li>
            <li>
              Keep food and drinks away from gaming equipment unless permitted.
            </li>
          </ul>
        </Clause>

        <Clause n='07' id='damage' title='Damage to Equipment'>
          <p>
            Customers may be responsible for repair or replacement costs
            resulting from intentional misuse or negligence.
          </p>
        </Clause>

        <Clause n='08' id='house-rules' title='House Rules'>
          <p>While visiting Invade Gaming Café:</p>
          <ul>
            <li>Guests aged 14 years and above are welcome.</li>
            <li>Please check game availability with the service desk.</li>
            <li>Do not use gaming equipment with dirty hands.</li>
            <li>Respect fellow gamers.</li>
            <li>Keep noise levels reasonable.</li>
            <li>Return controllers and accessories after use.</li>
            <li>
              No switching stations during Sim Racing unless approved by staff.
            </li>
            <li>Dispose of waste responsibly.</li>
            <li>CCTV surveillance is active throughout the premises.</li>
          </ul>
        </Clause>

        <Clause n='09' id='availability' title='Service Availability'>
          <p>We may temporarily suspend bookings because of:</p>
          <ul>
            <li>Maintenance</li>
            <li>Equipment failure</li>
            <li>Internet outages</li>
            <li>Safety concerns</li>
            <li>Unforeseen circumstances</li>
          </ul>
        </Clause>

        <Clause n='10' id='ip' title='Intellectual Property'>
          <p>
            All branding, website content, logos, and graphics belong to Invade
            Gaming Café unless otherwise stated.
          </p>
        </Clause>

        <Clause n='11' id='liability' title='Limitation of Liability'>
          <p>Invade Gaming Café is not responsible for:</p>
          <ul>
            <li>Loss of personal belongings</li>
            <li>Interruptions caused by third-party services</li>
            <li>Delays outside our control</li>
          </ul>
        </Clause>

        <Clause n='12' id='termination' title='Termination'>
          <p>
            We reserve the right to refuse service or terminate accounts that
            violate these Terms.
          </p>
        </Clause>

        <Clause n='13' id='refunds' title='Refund & Cancellation Policy'>
          <p className='mb-4 font-mono text-xs uppercase tracking-wider text-white/40'>
            Last updated: August 2026
          </p>

          <SubHeading>Cancellation Window</SubHeading>
          <p>
            Customers may cancel bookings up to 2 hours before the scheduled
            start time. Cancellations made less than 2 hours before the booking
            are not eligible for refunds.
          </p>

          <SubHeading>Monthly Cancellation Policy</SubHeading>
          <p>Each customer receives:</p>
          <ul>
            <li>1st cancellation → 100% refund</li>
            <li>2nd cancellation → 100% refund</li>
            <li>3rd cancellation → 100% refund</li>
          </ul>
          <Highlight>
            Beginning with the 4th cancellation in the same calendar month,
            refunds will be processed after deducting a 15% cancellation fee
            (customers receive an 85% refund). The cancellation count resets
            automatically at the start of each new calendar month.
          </Highlight>

          <SubHeading>Daily Cancellation Limit</SubHeading>
          <p>
            Customers may cancel only one booking per calendar day. If a
            cancellation has already been made on that day, additional
            cancellations are not permitted until the following day.
          </p>

          <SubHeading>Refund Method</SubHeading>
          <p>
            Online payments are refunded to the original payment method. Refund
            processing generally takes 5–7 business days, depending on the
            customer&rsquo;s bank or payment provider.
          </p>

          <SubHeading>Non-refundable Situations</SubHeading>
          <p>Refunds are not provided for:</p>
          <ul>
            <li>Cancellations made within 2 hours of the booking time</li>
            <li>No-shows</li>
            <li>Bookings cancelled because of customer misconduct</li>
            <li>Fraudulent bookings</li>
          </ul>

          <SubHeading>Café Cancellation</SubHeading>
          <p>
            If Invade Gaming Café cancels a booking because of equipment
            failure, maintenance, or operational issues, customers will receive
            either a full refund, or the option to reschedule.
          </p>
        </Clause>

        <Clause n='14' id='contact' title='Contact'>
          <p>For questions regarding these Terms:</p>
          <div className='mt-4 border border-[#28F1FF]/30 bg-[#28F1FF]/5 p-6 text-center font-mono'>
            <a
              href='tel:+918291158779'
              className='text-[#28F1FF] hover:underline'
            >
              +91 82911 58779
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

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className='mt-5 mb-2 text-sm font-semibold text-white'>{children}</h3>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className='my-4 border-l-2 border-[#FE11FF] bg-[#FE11FF]/5 px-4 py-3 text-sm text-white/80'>
      {children}
    </div>
  );
}
