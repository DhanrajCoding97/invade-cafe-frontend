import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await req.json();

    console.log('===== VERIFY PAYMENT =====');
    console.log({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('Missing Razorpay env vars');
      return NextResponse.json(
        { error: 'Missing Razorpay credentials' },
        { status: 500 },
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    console.log('Expected:', expectedSignature);
    console.log('Received:', razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch');
      return NextResponse.json(
        { error: 'Signature mismatch' },
        { status: 400 },
      );
    }

    console.log('✅ Signature verified');

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.fetch(razorpay_order_id);

    console.log('Fetched order:', order);

    const notes = (order.notes ?? {}) as Record<string, string>;

    console.log('Order notes:', notes);

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log('Auth user:', user);
    console.log('Auth user id:', user?.id);
    console.log('Inserting user_id:', user?.id);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        station_id: notes.stationId,
        device: notes.device,
        tier: notes.tier || null,
        players: Number(notes.players),
        duration_hours: Number(notes.duration),
        date: notes.date,
        start_time: notes.startTime,
        amount: Number(order.amount) / 100,
        razorpay_payment_id,
        razorpay_order_id,
        status: 'confirmed',
        user_id: user.id,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);

      return NextResponse.json(
        {
          error: error.message,
          details: error,
        },
        { status: 500 },
      );
    }

    console.log('Booking created:', booking);

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
    });
  } catch (err) {
    console.error('VERIFY ROUTE ERROR:', err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
