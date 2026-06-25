import { NextResponse } from 'next/server';
import { stripe, stripeEnabled } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Stripe webhook — marks an invoice paid when its Checkout session completes.
 * Configure the endpoint URL + STRIPE_WEBHOOK_SECRET in your Stripe dashboard.
 */
export async function POST(request: Request) {
  if (!stripeEnabled || !stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');
  if (!secret || !signature) {
    return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
  }

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { metadata?: { invoice_id?: string } };
    const invoiceId = session.metadata?.invoice_id;
    if (invoiceId) {
      // Service-role client: the webhook has no user session.
      const admin = createAdminClient();
      await admin
        .from('invoices')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', invoiceId);
    }
  }

  return NextResponse.json({ received: true });
}
