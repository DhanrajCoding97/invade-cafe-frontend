import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Missing Razorpay credentials' },
        { status: 500 },
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch');
      return NextResponse.json(
        { error: 'Signature mismatch' },
        { status: 400 },
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = (order.notes ?? {}) as Record<string, string>;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Normalize date — notes.date may arrive as a full ISO timestamp
    // (e.g. '2026-07-19T16:28:28.233Z') depending on how the client serialized it,
    // but everything downstream (DB column, conflict-check math) expects 'yyyy-MM-dd'.
    const datePart = notes.date.slice(0, 10);

    // ---- Conflict check (fast-path UX; the DB exclusion constraint is the real guarantee) ----
    const requestedStart = new Date(`${datePart}T${notes.startTime}`);
    const requestedEnd = new Date(requestedStart);
    requestedEnd.setHours(requestedEnd.getHours() + Number(notes.duration));

    const { data: existingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('id, start_time, duration_hours')
      .eq('station_id', notes.stationId)
      .eq('date', datePart)
      .in('status', ['pending', 'confirmed']);

    if (conflictError) {
      console.error('Conflict check failed:', conflictError);
      return NextResponse.json(
        { error: 'Could not verify slot availability' },
        { status: 500 },
      );
    }

    const hasConflict = (existingBookings ?? []).some((b) => {
      const bStart = new Date(`${datePart}T${b.start_time}`);
      const bEnd = new Date(bStart);
      bEnd.setHours(bEnd.getHours() + Number(b.duration_hours));
      return requestedStart < bEnd && bStart < requestedEnd;
    });

    if (hasConflict) {
      console.error('Double-booking prevented at verify stage:', {
        stationId: notes.stationId,
        date: datePart,
        startTime: notes.startTime,
      });

      let refunded = false;
      try {
        await razorpay.payments.refund(razorpay_payment_id, {
          amount: Number(order.amount),
          speed: 'optimum',
          notes: {
            reason: 'slot_conflict_at_verify',
            stationId: notes.stationId,
            date: datePart,
            startTime: notes.startTime,
          },
        });
        refunded = true;
      } catch (refundErr) {
        console.error('❌ Refund failed — needs manual reconciliation:', {
          razorpay_payment_id,
          error: refundErr,
        });
        await supabase.from('failed_refunds').insert({
          razorpay_payment_id,
          razorpay_order_id,
          user_id: user.id,
          amount: Number(order.amount) / 100,
          reason: 'slot_conflict_at_verify',
          notes,
        });
      }

      return NextResponse.json(
        {
          error: refunded
            ? 'This slot was just booked by someone else. You have been refunded.'
            : 'This slot was just booked by someone else. Refund is being processed manually — our team has been notified.',
          code: 'SLOT_CONFLICT',
          refunded,
        },
        { status: 409 },
      );
    }
    // ---- end conflict check ----

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        station_id: notes.stationId,
        device: notes.device,
        tier: notes.tier || null,
        players: Number(notes.players),
        duration_hours: Number(notes.duration),
        date: datePart,
        start_time: notes.startTime,
        amount: Number(order.amount) / 100,
        razorpay_payment_id,
        razorpay_order_id,
        payment_method: 'razorpay',
        payment_status: 'paid',
        status: 'confirmed',
        user_id: user.id,
      })
      .select('id')
      .single();

    if (error) {
      const isSlotConflict =
        error.code === '23505' ||
        error.message.includes('no_overlapping_bookings');

      if (isSlotConflict) {
        console.error('Double-booking prevented by DB constraint:', {
          stationId: notes.stationId,
          date: datePart,
          startTime: notes.startTime,
        });

        let refunded = false;
        try {
          await razorpay.payments.refund(razorpay_payment_id, {
            amount: Number(order.amount),
            speed: 'optimum',
            notes: { reason: 'slot_conflict_db_constraint' },
          });
          refunded = true;
        } catch (refundErr) {
          console.error('❌ Refund failed:', refundErr);
          await supabase.from('failed_refunds').insert({
            razorpay_payment_id,
            razorpay_order_id,
            user_id: user.id,
            amount: Number(order.amount) / 100,
            reason: 'slot_conflict_db_constraint',
            notes,
          });
        }

        return NextResponse.json(
          {
            error: refunded
              ? 'This slot was just booked by someone else. You have been refunded.'
              : 'This slot was just booked by someone else. Refund is being processed manually.',
            code: 'SLOT_CONFLICT',
            refunded,
          },
          { status: 409 },
        );
      }

      console.error('Supabase Insert Error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err) {
    console.error('VERIFY ROUTE ERROR:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
