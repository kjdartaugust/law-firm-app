import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';

/** Returns the current auth user + profile, or null if signed out. */
export async function getCurrentUser(): Promise<{ id: string; email?: string; profile: Profile | null } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { id: user.id, email: user.email, profile: profile ?? null };
}

/** Use in protected Server Components — redirects to /login when signed out. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

/** Requires the current user to be staff (lawyer or admin). */
export async function requireStaff() {
  const user = await requireUser();
  if (user.profile?.role !== 'admin' && user.profile?.role !== 'lawyer') {
    redirect('/dashboard');
  }
  return user;
}

/** Requires the current user to be an admin. */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.profile?.role !== 'admin') redirect('/dashboard');
  return user;
}
