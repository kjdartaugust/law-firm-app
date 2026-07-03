import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Keep-alive — a daily lightweight Supabase read so the free-tier project
 * never crosses the 7-day inactivity threshold that triggers an auto-pause.
 * Fired by a Vercel Cron (see vercel.json). Additive: touches nothing else.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Optional auth: if CRON_SECRET is set, require the bearer token Vercel Cron sends.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Not configured — succeed and skip rather than erroring.
  if (!url || !key) {
    return NextResponse.json({ ok: true, skipped: 'supabase-not-configured' });
  }

  try {
    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    // Cheapest possible read: a head/count against an existing table.
    const { count, error } = await supabase
      .from('practice_areas')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return NextResponse.json({ ok: true, pinged: true, count: count ?? 0 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
