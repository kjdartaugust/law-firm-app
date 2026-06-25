'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { sendEmail, emailLayout } from '@/lib/email';
import { formatDateTime } from '@/lib/utils';
import type { AppointmentStatus } from '@/lib/types';

export async function bookAppointment(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();
  const subject = String(formData.get('subject') ?? '');
  const scheduledAt = new Date(String(formData.get('scheduled_at'))).toISOString();

  const { error } = await supabase.from('appointments').insert({
    client_id: user.id,
    lawyer_id: String(formData.get('lawyer_id') ?? '') || null,
    case_id: String(formData.get('case_id') ?? '') || null,
    subject,
    notes: String(formData.get('notes') ?? '') || null,
    scheduled_at: scheduledAt,
    duration_minutes: Number(formData.get('duration_minutes') ?? 30),
    status: 'requested',
  });
  if (error) return { error: error.message };

  if (user.email) {
    await sendEmail({
      to: user.email,
      subject: `Consultation request received — ${subject}`,
      html: emailLayout(
        'We received your consultation request',
        `<p>Hello ${user.profile?.full_name || 'there'},</p>
         <p>Your request for <strong>${subject}</strong> on <strong>${formatDateTime(scheduledAt)}</strong>
         has been received. Our team will confirm the appointment shortly.</p>`
      ),
    });
  }

  revalidatePath('/appointments');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/appointments');
  return { success: true };
}
