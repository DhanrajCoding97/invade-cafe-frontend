import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';
import { getDisplayRate } from '@/lib/pricing';
import { getCafeSettings } from '@/lib/server/cafe-settitngs';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const settings = await getCafeSettings();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Missing Razorpay environment variables' },
        { status: 500 },
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const { stationId, device, tier, players, duration, date, startTime } =
      await req.json();

    const { data: station, error } = await supabase
      .from('stations')
      .select('hourly_rate, operational_status')
      .eq('id', stationId)
      .single();

    if (error || !station) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }
    if (station.operational_status !== 'active') {
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
      settings,
    });
    const amountPaise = Math.round(rate * duration * 100);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `bk_${user.id.slice(0, 8)}_${Date.now()}`,
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
      keyId,
    });
  } catch (err) {
    console.error('CREATE ORDER ROUTE ERROR:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
