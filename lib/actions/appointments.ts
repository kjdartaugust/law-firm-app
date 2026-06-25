'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import type { AppointmentStatus } from '@/lib/types';

export async function bookAppointment(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = createClient();
  const { error } = await supabase.from('appointments').insert({
    client_id: user.id,
    lawyer_id: String(formData.get('lawyer_id') ?? '') || null,
    case_id: String(formData.get('case_id') ?? '') || null,
    subject: String(formData.get('subject') ?? ''),
    notes: String(formData.get('notes') ?? '') || null,
    scheduled_at: new Date(String(formData.get('scheduled_at'))).toISOString(),
    duration_minutes: Number(formData.get('duration_minutes') ?? 30),
    status: 'requested',
  });
  if (error) return { error: error.message };

  revalidatePath('/appointments');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const supabase = createClient();
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/appointments');
  return { success: true };
}
