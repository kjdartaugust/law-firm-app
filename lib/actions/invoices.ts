'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { InvoiceStatus } from '@/lib/types';

export async function createInvoice(formData: FormData) {
  const supabase = await createClient();
  const dollars = Number(formData.get('amount') ?? 0);

  const { error } = await supabase.from('invoices').insert({
    client_id: String(formData.get('client_id') ?? ''),
    case_id: String(formData.get('case_id') ?? '') || null,
    amount_cents: Math.round(dollars * 100),
    description: String(formData.get('description') ?? '') || null,
    status: 'sent',
    due_at: formData.get('due_at') ? new Date(String(formData.get('due_at'))).toISOString() : null,
  });
  if (error) return { error: error.message };

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
