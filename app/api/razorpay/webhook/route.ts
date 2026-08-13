// // api/razorpay/webhook/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import crypto from 'crypto';
// import { createBookingFromPayment } from '@/lib/razorpay/create-booking-from-payment';

// export async function POST(req: NextRequest) {
//   try {
//     const rawBody = await req.text(); // must use raw text — signature is computed over the exact bytes
//     const signature = req.headers.get('x-razorpay-signature');
//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//       console.error('Missing RAZORPAY_WEBHOOK_SECRET');
//       return NextResponse.json(
//         { error: 'Server misconfigured' },
//         { status: 500 },
//       );
//     }

//     if (!signature) {
//       return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
//     }

//     const expectedSignature = crypto
//       .createHmac('sha256', webhookSecret)
//       .update(rawBody)
//       .digest('hex');

//     if (expectedSignature !== signature) {
//       console.error('Webhook signature mismatch');
//       return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
//     }

//     const event = JSON.parse(rawBody);

//     if (event.event === 'payment.captured') {
//       const payment = event.payload.payment.entity;
//       const razorpay_payment_id: string = payment.id;
//       const razorpay_order_id: string = payment.order_id;

//       // Webhook has no session — notes carry booking context, but not a Supabase user.
//       // We still need a user_id for the insert, so pull it from the order notes
//       // if you store it there, OR look it up via the order — adjust based on
//       // what you have available. Simplest: store userId in order notes at creation time.
//       const razorpayModule = await import('razorpay');
//       const razorpay = new razorpayModule.default({
//         key_id: process.env.RAZORPAY_KEY_ID!,
//         key_secret: process.env.RAZORPAY_KEY_SECRET!,
//       });
//       const order = await razorpay.orders.fetch(razorpay_order_id);
//       const notes = (order.notes ?? {}) as Record<string, string>;

//       if (!notes.userId) {
//         console.error(
//           'Webhook: order missing userId in notes, cannot create booking',
//           {
//             razorpay_order_id,
//           },
//         );
//         // Still 200 — Razorpay will retry on non-2xx, and this isn't a transient error.
//         // Log for manual reconciliation instead.
//         return NextResponse.json({
//           received: true,
//           warning: 'missing userId in notes',
//         });
//       }

//       const result = await createBookingFromPayment({
//         razorpay_payment_id,
//         razorpay_order_id,
//         userId: notes.userId,
//       });

//       if (!result.ok) {
//         console.error('Webhook booking creation failed:', result.body);
//         // Return 200 anyway — this is now a business-logic outcome (e.g. slot
//         // conflict + refund already handled inside createBookingFromPayment),
//         // not a webhook delivery failure. Returning non-2xx here would just
//         // cause Razorpay to retry the same payment repeatedly.
//       }
//     }

//     return NextResponse.json({ received: true });
//   } catch (err) {
//     console.error('WEBHOOK ROUTE ERROR:', err);
//     // Non-2xx here is correct — this IS a transient/processing error worth Razorpay retrying.
//     return NextResponse.json(
//       { error: err instanceof Error ? err.message : 'Unknown error' },
//       { status: 500 },
//     );
//   }
// }
// api/razorpay/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createBookingFromPayment } from '@/lib/razorpay/create-booking-from-payment';
import { reconcileRefundFromWebhook } from '@/lib/razorpay/reconcile-refund';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Missing RAZORPAY_WEBHOOK_SECRET');
      return NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500 },
      );
    }
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Webhook signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const supabase = await createServiceRoleClient();

    // ---- Dedupe: derive a stable key per entity, not per delivery attempt ----
    let eventKey: string | null = null;
    if (event.event === 'payment.captured') {
      eventKey = `payment.captured:${event.payload.payment.entity.id}`;
    } else if (
      event.event === 'refund.processed' ||
      event.event === 'refund.failed'
    ) {
      eventKey = `${event.event}:${event.payload.refund.entity.id}`;
    }

    if (eventKey) {
      const { error: dedupeError } = await supabase
        .from('webhook_events')
        .insert({
          event_key: eventKey,
          event_type: event.event,
          payload: event,
        });

      if (dedupeError) {
        if (dedupeError.code === '23505') {
          // Already processed this exact event — safe no-op, still ack with 200
          return NextResponse.json({ received: true, duplicate: true });
        }
        // Unexpected DB error on the dedupe write itself — treat as transient
        console.error('Webhook dedupe insert failed:', dedupeError);
        return NextResponse.json(
          { error: 'Dedupe check failed' },
          { status: 500 },
        );
      }
    }

    // ---- payment.captured ----
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpay_payment_id: string = payment.id;
      const razorpay_order_id: string = payment.order_id;

      const order = await razorpay.orders.fetch(razorpay_order_id);
      const notes = (order.notes ?? {}) as Record<string, string>;

      if (!notes.userId) {
        console.error(
          'Webhook: order missing userId in notes, cannot create booking',
          {
            razorpay_order_id,
          },
        );
        return NextResponse.json({
          received: true,
          warning: 'missing userId in notes',
        });
      }

      const result = await createBookingFromPayment({
        razorpay_payment_id,
        razorpay_order_id,
        userId: notes.userId,
        supabase,
      });

      if (!result.ok) {
        console.error('Webhook booking creation failed:', result.body);
        // Slot-conflict outcomes are already handled (refunded) inside
        // createBookingFromPayment. Anything else here (e.g. a genuine DB
        // error) means payment was captured but nothing was created or
        // refunded — flag for manual reconciliation rather than silently
        // dropping it.
        if (result.status === 500) {
          await supabase.from('failed_refunds').insert({
            razorpay_payment_id,
            razorpay_order_id,
            user_id: notes.userId,
            amount: Number(payment.amount) / 100,
            reason: 'booking_creation_failed_webhook',
            notes: result.body,
          });
        }
      }
    }

    // ---- refund.processed / refund.failed ----
    if (event.event === 'refund.processed' || event.event === 'refund.failed') {
      const refund = event.payload.refund.entity;
      await reconcileRefundFromWebhook({
        razorpay,
        razorpay_refund_id: refund.id,
        razorpay_payment_id: refund.payment_id,
        status: event.event === 'refund.processed' ? 'processed' : 'failed',
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('WEBHOOK ROUTE ERROR:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
