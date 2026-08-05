import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/requrireRole';
import { refundPayment } from '@/app/actions/refund';

export async function POST(req: Request) {
  let auth;
  try {
    auth = await requireRole(['owner']);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { paymentId, amount, reason } = await req.json();
  if (!paymentId || typeof paymentId !== 'string') {
    return NextResponse.json(
      { error: 'paymentId is required' },
      { status: 400 },
    );
  }

  try {
    const refund = await refundPayment(paymentId, {
      amount,
      refundedBy: auth.user.id,
      reason,
    });
    return NextResponse.json(refund);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Refund failed' },
      { status: 500 },
    );
  }
}
