'use client';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import type { BookingFormValues } from '@/lib/schemas/BookingFormSchema';
import { getDisplayRate, calculateTotal } from '@/lib/pricing';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
declare global {
  interface Window {
    Razorpay: any;
  }
}

async function fetchStationName(stationId: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stations')
    .select('name')
    .eq('id', stationId)
    .single();
  if (error) throw error;
  return data.name;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface PaymentStepProps {
  onPaymentSuccess: (bookingId: string) => void;
  onSlotConflict: (message: string) => void;
}

export default function PaymentStep({
  onPaymentSuccess,
  onSlotConflict,
}: PaymentStepProps) {
  const { getValues, watch } = useFormContext<BookingFormValues>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const values = watch();

  const { data: stationName, isLoading: stationLoading } = useQuery({
    queryKey: ['station-name', values.stationId],
    queryFn: () => fetchStationName(values.stationId),
    enabled: !!values.stationId,
  });

  const rate = getDisplayRate({
    device: values.device,
    players: values.players,
    tier: values.tier,
    fallbackRate: 0,
  });
  const total = calculateTotal(rate, values.duration);

  async function handlePay() {
    setLoading(true);
    setError(null);

    try {
      const values = getValues();

      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId: values.stationId,
          device: values.device,
          tier: values.tier,
          players: values.players,
          duration: values.duration,
          date: values.date,
          startTime: values.startTime,
        }),
      });

      if (!orderRes.ok) {
        const body = await orderRes.json().catch(() => null);
        throw new Error(body?.error ?? 'Could not create order');
      }

      const { order, amount, keyId } = await orderRes.json();

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay SDK failed to load');

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency: 'INR',
        name: 'Invade Cafe',
        description: `${values.device?.toUpperCase()} · ${values.duration}hr session`,
        order_id: order.id,
        theme: { color: '#22d3ee' },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });

          if (!verifyRes.ok) {
            const body = await verifyRes.json().catch(() => null);

            if (body?.code === 'SLOT_CONFLICT') {
              // Known, already-handled case — payment was refunded (or queued
              // for manual refund) server-side. Send them back to rebook
              // rather than a scary dead-end message.
              setError(body.error);
              setLoading(false);
              onSlotConflict?.(body.error); // e.g. reset to date/time step, invalidate station query
              return;
            }

            // Genuinely unexpected failure — this is the real "contact support" case
            setError(
              body?.error ??
                'Payment succeeded but confirmation failed. Contact support.',
            );
            setLoading(false);
            return;
          }

          const { bookingId } = await verifyRes.json();
          onPaymentSuccess(bookingId);
        },
        modal: { ondismiss: () => setLoading(false) },
      });

      rzp.on('payment.failed', (resp: any) => {
        setError(resp.error?.description ?? 'Payment failed');
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col items-center gap-4 sm:gap-5 w-full'>
      <div className='rounded-xl border border-white/10 bg-white/3 p-4 w-full'>
        <div className='flex flex-col items-start sm:flex-row sm:items-center justify-between text-sm text-[#bcbcbc]'>
          <span>
            {values.device?.toUpperCase()}
            {stationLoading ? '' : ` · ${stationName}`}
          </span>
          <span>
            {values.date ? format(values.date, 'PPP') : '—'}, {values.startTime}
          </span>
        </div>
        <div className='mt-3 flex items-end justify-between border-t border-white/10 pt-3'>
          <span className='text-sm text-[#bcbcbc] '>Total to pay</span>
          <span className='text-xl font-bold text-[#28F1FF]'>₹{total}</span>
        </div>
      </div>

      <div className='w-full flex items-center gap-2 rounded-lg bg-white/3 px-3 py-2.5 text-xs text-[#bcbcbc]'>
        <ShieldCheck className='h-4 w-4 shrink-0 text-[#28F1FF]' />
        <span>
          You'll be redirected to Razorpay's secure checkout. Cards, UPI,
          netbanking and wallets are supported.
        </span>
      </div>

      {error && <p className='text-sm text-red-400'>{error}</p>}
      <CornerCutButton
        className='ml-auto'
        type='button'
        disabled={loading}
        onClick={handlePay}
        color='cyan'
        variant='outline'
        hoverEffect='scan'
        fullWidthOnMobile={true}
      >
        {loading ? 'Processing…' : `Confirm Booking`}
      </CornerCutButton>

      <p className='text-center text-[11px] text-[#bcbcbc] '>
        Payments are processed securely by Razorpay. We never store your card
        details.
      </p>
    </div>
  );
}
