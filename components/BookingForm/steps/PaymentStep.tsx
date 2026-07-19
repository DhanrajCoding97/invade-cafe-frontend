'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { BookingFormValues } from '@/lib/schemas/BookingFormSchema';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    Razorpay: any;
  }
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
  const { getValues } = useFormContext<BookingFormValues>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // async function handlePay() {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const values = getValues();

  //     const orderRes = await fetch('/api/razorpay/create-order', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         stationId: values.stationId,
  //         device: values.device,
  //         tier: values.tier,
  //         players: values.players,
  //         duration: values.duration,
  //         date: values.date,
  //         startTime: values.startTime,
  //       }),
  //     });

  //     if (!orderRes.ok) {
  //       const body = await orderRes.json().catch(() => null);
  //       throw new Error(body?.error ?? 'Could not create order');
  //     }

  //     const { order, amount, keyId } = await orderRes.json();

  //     const loaded = await loadRazorpayScript();
  //     if (!loaded) throw new Error('Razorpay SDK failed to load');

  //     const rzp = new window.Razorpay({
  //       key: keyId,
  //       amount,
  //       currency: 'INR',
  //       name: 'Invade Cafe',
  //       description: `${values.device?.toUpperCase()} · ${values.duration}hr session`,
  //       order_id: order.id,
  //       theme: { color: '#22d3ee' },
  //       handler: async (response: {
  //         razorpay_payment_id: string;
  //         razorpay_order_id: string;
  //         razorpay_signature: string;
  //       }) => {
  //         const verifyRes = await fetch('/api/razorpay/verify', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify(response),
  //         });

  //         if (!verifyRes.ok) {
  //           setError(
  //             'Payment succeeded but confirmation failed. Contact support.',
  //           );
  //           setLoading(false);
  //           return;
  //         }

  //         const { bookingId } = await verifyRes.json();
  //         onPaymentSuccess(bookingId);
  //       },
  //       modal: { ondismiss: () => setLoading(false) },
  //     });

  //     rzp.on('payment.failed', (resp: any) => {
  //       setError(resp.error?.description ?? 'Payment failed');
  //       setLoading(false);
  //     });

  //     rzp.open();
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Something went wrong');
  //     setLoading(false);
  //   }
  // }

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
    <div className='space-y-4'>
      <p className='text-sm text-white/60'>
        You'll be redirected to Razorpay's secure checkout to complete payment.
      </p>
      {error && <p className='text-sm text-red-400'>{error}</p>}
      <Button
        type='button'
        disabled={loading}
        onClick={handlePay}
        className='w-full'
      >
        {loading ? 'Processing…' : 'Pay & Confirm Booking'}
      </Button>
    </div>
  );
}
