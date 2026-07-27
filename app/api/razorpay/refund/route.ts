import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth/requrireRole';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    await requireRole(['owner', 'staff']);

    const { bookingId } = await req.json();

    const supabase = await createClient();

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 },
      );
    }

    if (booking.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Booking is not paid' },
        { status: 400 },
      );
    }

    // Cash / complimentary bookings don't hit Razorpay
    if (
      booking.payment_method === 'cash' ||
      booking.payment_method === 'complimentary'
    ) {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'refunded',
        })
        .eq('id', bookingId);

      if (updateError) throw updateError;

      return NextResponse.json({ success: true });
    }

    if (!booking.razorpay_payment_id) {
      return NextResponse.json(
        { error: 'Missing Razorpay payment id' },
        { status: 400 },
      );
    }

    // Refund full payment
    const refund = await razorpay.payments.refund(
      booking.razorpay_payment_id,
      {
        amount: Math.round(Number(booking.amount) * 100),
        speed: 'optimum',
        notes: {
          bookingId,
        },
      },
    );

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'refunded',
      })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      refund,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Refund failed',
      },
      { status: 500 },
    );
  }
}