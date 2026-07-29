import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/requrireRole';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  keyId && keySecret
    ? new Razorpay({ key_id: keyId, key_secret: keySecret })
    : null;

export async function POST(req: Request) {
  if (!razorpay) {
    return NextResponse.json(
      { error: 'Missing Razorpay environment variables' },
      { status: 500 },
    );
  }

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
    const refund = await razorpay.payments.refund(
      paymentId,
      amount ? { amount } : {},
    );
    return NextResponse.json(refund);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.error?.description ?? 'Refund failed' },
      { status: err?.statusCode ?? 500 },
    );
  }
}
