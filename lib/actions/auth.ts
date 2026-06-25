'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type AuthState = { error?: string } | undefined;

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirect') ?? '/dashboard');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  redirect(redirectTo || '/dashboard');
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const fullName = String(formData.get('full_name') ?? '');

  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: 'client' },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback`,
    },
  });
  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
