'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label } from '@/components/ui/input';
import type { Profile } from '@/lib/types';

export function SettingsForm({
  profile, email, showLawyerFields,
}: { profile: Profile | null; email?: string; showLawyerFields: boolean }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok?: boolean; text: string }>();
  const [pending, start] = useTransition();

  function onSubmit(formData: FormData) {
    setMsg(undefined);
    start(async () => {
      const res = await updateProfile(formData);
      if (res?.error) setMsg({ text: res.error });
      else {
        setMsg({ ok: true, text: 'Profile updated.' });
        router.refresh();
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ''} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={email ?? ''} disabled />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={profile?.phone ?? ''} placeholder="(212) 555-0000" />
        </div>
      </div>

      {showLawyerFields && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={profile?.title ?? ''} placeholder="Senior Partner" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="years_experience">Years of experience</Label>
              <Input id="years_experience" name="years_experience" type="number" min="0" defaultValue={profile?.years_experience ?? ''} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="practice_areas">Practice areas (comma-separated)</Label>
            <Input id="practice_areas" name="practice_areas" defaultValue={profile?.practice_areas?.join(', ') ?? ''} placeholder="Corporate Law, Real Estate" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={4} defaultValue={profile?.bio ?? ''} />
          </div>
        </>
      )}

      {msg && (
        <p className={`rounded-md px-3 py-2 text-sm ${msg.ok ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-destructive/10 text-destructive'}`}>
          {msg.text}
        </p>
      )}
      <Button type="submit" variant="gold" disabled={pending}>{pending ? 'Saving…' : 'Save changes'}</Button>
    </form>
  );
}
