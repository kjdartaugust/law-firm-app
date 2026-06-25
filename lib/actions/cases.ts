'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import type { CaseStatus } from '@/lib/types';

export async function createCase(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();
  const isStaff = user.profile?.role === 'admin' || user.profile?.role === 'lawyer';

  const { error } = await supabase.from('cases').insert({
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    practice_area: String(formData.get('practice_area') ?? '') || null,
    client_id: isStaff ? String(formData.get('client_id') ?? user.id) : user.id,
    lawyer_id: String(formData.get('lawyer_id') ?? '') || null,
    status: 'open',
  });
  if (error) return { error: error.message };

  revalidatePath('/cases');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateCaseStatus(caseId: string, status: CaseStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('cases')
    .update({ status, closed_at: status === 'closed' ? new Date().toISOString() : null })
    .eq('id', caseId);
  if (error) return { error: error.message };

  revalidatePath('/cases');
  revalidatePath(`/cases/${caseId}`);
  return { success: true };
}

export async function assignLawyer(caseId: string, lawyerId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('cases')
    .update({ lawyer_id: lawyerId || null })
    .eq('id', caseId);
  if (error) return { error: error.message };

  revalidatePath(`/cases/${caseId}`);
  revalidatePath('/admin');
  return { success: true };
}
