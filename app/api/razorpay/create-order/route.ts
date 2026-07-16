import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';
import { getDisplayRate } from '@/lib/pricing';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log(process.env);

console.log({
  keyId,
  hasSecret: !!keySecret,
});

if (!keyId || !keySecret) {
  NextResponse.json(
    { error: 'Missing Razorpay environment variables' },
    { status: 500 },
  );
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});
export async function POST(req: NextRequest) {
  const { stationId, device, tier, players, duration, date, startTime } =
    await req.json();

  const supabase = await createClient();
  const { data: station, error } = await supabase
    .from('stations')
    .select('hourly_rate, status')
    .eq('id', stationId)
    .single();

  if (error || !station) {
    return NextResponse.json({ error: 'Station not found' }, { status: 404 });
  }
  if (station.status !== 'available') {
    return NextResponse.json(
      { error: 'Station no longer available' },
      { status: 409 },
    );
  }

  // Recompute price server-side — the client's own duration/tier/players
  // is only a request, the rate calc here is what actually gets charged.
  const rate = getDisplayRate({
    device,
    players,
    tier,
    fallbackRate: station.hourly_rate,
  });
  const amountPaise = Math.round(rate * duration * 100);

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: `bk_${Date.now()}`,
    notes: {
      stationId,
      device,
      tier: tier ?? '',
      players: String(players ?? 1),
      duration: String(duration),
      date,
      startTime,
    },
  });

  return NextResponse.json({
    order,
    amount: amountPaise,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
