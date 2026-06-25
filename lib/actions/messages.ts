'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export async function sendMessage(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const caseId = String(formData.get('case_id') ?? '');
  const body = String(formData.get('body') ?? '').trim();
  if (!caseId || !body) return { error: 'Message cannot be empty.' };

  const supabase = createClient();
  const { error } = await supabase.from('messages').insert({
    case_id: caseId,
    sender_id: user.id,
    body,
  });
  if (error) return { error: error.message };

  revalidatePath(`/messages/${caseId}`);
  revalidatePath('/messages');
  return { success: true };
}
