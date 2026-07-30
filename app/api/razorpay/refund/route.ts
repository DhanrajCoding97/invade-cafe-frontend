// import Razorpay from 'razorpay';
// import { NextResponse } from 'next/server';
// import { requireRole } from '@/lib/auth/requrireRole';
// import { createClient } from '@/lib/supabase/server'; // adjust to your actual server client import

// const keyId = process.env.RAZORPAY_KEY_ID;
// const keySecret = process.env.RAZORPAY_KEY_SECRET;

// const razorpay =
//   keyId && keySecret
//     ? new Razorpay({ key_id: keyId, key_secret: keySecret })
//     : null;

// export async function POST(req: Request) {
//   if (!razorpay) {
//     return NextResponse.json(
//       { error: 'Missing Razorpay environment variables' },
//       { status: 500 },
//     );
//   }

//   try {
//     await requireRole(['owner', 'staff']);
//   } catch {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { paymentId, amount } = await req.json();
//   if (!paymentId || typeof paymentId !== 'string') {
//     return NextResponse.json(
//       { error: 'paymentId is required' },
//       { status: 400 },
//     );
//   }

//   const supabase = await createClient();

//   // Look up the booking by payment id and check current status BEFORE calling Razorpay
//   const { data: booking, error: fetchError } = await supabase
//     .from('bookings')
//     .select('id, payment_status')
//     .eq('razorpay_payment_id', paymentId)
//     .single();

//   if (fetchError || !booking) {
//     return NextResponse.json(
//       { error: 'Booking not found for this payment' },
//       { status: 404 },
//     );
//   }

//   if (booking.payment_status === 'refunded') {
//     return NextResponse.json(
//       { error: 'This booking has already been refunded' },
//       { status: 409 },
//     );
//   }

//   try {
//     const refund = await razorpay.payments.refund(
//       paymentId,
//       amount ? { amount } : {},
//     );

//     // Update the DB status right here, now that we've confirmed the refund succeeded
//     const { error: updateError } = await supabase
//       .from('bookings')
//       .update({ payment_status: 'refunded' })
//       .eq('id', booking.id);

//     if (updateError) {
//       // Refund went through on Razorpay's side but DB update failed —
//       // log this loudly, it needs manual reconciliation
//       console.error('Refund succeeded but DB update failed:', updateError, {
//         bookingId: booking.id,
//         paymentId,
//       });
//     }

//     return NextResponse.json(refund);
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err?.error?.description ?? 'Refund failed' },
//       { status: err?.statusCode ?? 500 },
//     );
//   }
// }

// api/razorpay/refund/route.ts — now just an auth+parsing wrapper
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/requrireRole';
import { refundPayment } from '@/app/actions/refund';

export async function POST(req: Request) {
  try {
    await requireRole(['owner', 'staff']);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { paymentId, amount } = await req.json();
  if (!paymentId || typeof paymentId !== 'string') {
    return NextResponse.json(
      { error: 'paymentId is required' },
      { status: 400 },
    );
  }

  try {
    const refund = await refundPayment(paymentId, amount);
    return NextResponse.json(refund);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Refund failed' },
      { status: 500 },
    );
  }
}
