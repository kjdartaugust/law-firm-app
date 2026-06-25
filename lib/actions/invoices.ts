'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { stripe, stripeEnabled } from '@/lib/stripe';
import { sendEmail, emailLayout } from '@/lib/email';
import { formatCurrency } from '@/lib/utils';
import type { Invoice, InvoiceStatus, Profile } from '@/lib/types';

export async function createInvoice(formData: FormData) {
  const supabase = await createClient();
  const dollars = Number(formData.get('amount') ?? 0);
  const clientId = String(formData.get('client_id') ?? '');

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      client_id: clientId,
      case_id: String(formData.get('case_id') ?? '') || null,
      amount_cents: Math.round(dollars * 100),
      description: String(formData.get('description') ?? '') || null,
      status: 'sent',
      due_at: formData.get('due_at') ? new Date(String(formData.get('due_at'))).toISOString() : null,
    })
    .select()
    .single();
  if (error) return { error: error.message };

  // Notify the client (best-effort).
  const inv = data as Invoice;
  const { data: client } = await supabase.from('profiles').select('email, full_name').eq('id', clientId).single();
  const c = client as Pick<Profile, 'email' | 'full_name'> | null;
  if (c?.email) {
    await sendEmail({
      to: c.email,
      subject: `New invoice ${inv.number} — ${formatCurrency(inv.amount_cents, inv.currency)}`,
      html: emailLayout(
        'You have a new invoice',
        `<p>Hello ${c.full_name || 'there'},</p>
         <p>Invoice <strong>${inv.number}</strong> for <strong>${formatCurrency(inv.amount_cents, inv.currency)}</strong>
         is now available in your client portal.</p>
         <p>You can review and pay it from the Billing section.</p>`
      ),
    });
  }

  revalidatePath('/billing');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('invoices')
    .update({ status, paid_at: status === 'paid' ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/billing');
  revalidatePath('/admin');
  return { success: true };
}

/**
 * Starts a Stripe Checkout session for an invoice and returns the redirect URL.
 * Falls back to the simulated "mark paid" flow when Stripe isn't configured.
 */
export async function payInvoice(id: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();
  const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single();
  if (error || !data) return { error: error?.message ?? 'Invoice not found' };
  const inv = data as Invoice;
  if (inv.status === 'paid') return { error: 'Invoice already paid' };

  if (!stripeEnabled || !stripe) {
    // No Stripe keys — simulate payment so the demo still works end-to-end.
    return updateInvoiceStatus(id, 'paid');
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: (inv.currency ?? 'usd').toLowerCase(),
          unit_amount: inv.amount_cents,
          product_data: { name: `Invoice ${inv.number}`, description: inv.description ?? undefined },
        },
      },
    ],
    metadata: { invoice_id: inv.id },
    success_url: `${site}/billing?paid=${inv.number}`,
    cancel_url: `${site}/billing`,
  });

  return { url: session.url ?? undefined };
}
