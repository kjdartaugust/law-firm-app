'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();
  const areas = String(formData.get('practice_areas') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: String(formData.get('full_name') ?? ''),
      phone: String(formData.get('phone') ?? '') || null,
      title: String(formData.get('title') ?? '') || null,
      bio: String(formData.get('bio') ?? '') || null,
      practice_areas: areas.length ? areas : null,
      years_experience: formData.get('years_experience')
        ? Number(formData.get('years_experience'))
        : null,
    })
    .eq('id', user.id);
  if (error) return { error: error.message };

  revalidatePath('/settings');
  revalidatePath('/dashboard');
  return { success: true };
}

/** Admin-only: change a user's role. */
export async function setUserRole(userId: string, role: UserRole) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) return { error: error.message };

  revalidatePath('/admin');
  return { success: true };
}
