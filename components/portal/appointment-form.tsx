'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { bookAppointment } from '@/lib/actions/appointments';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select, Label } from '@/components/ui/input';
import type { Profile, Case } from '@/lib/types';

export function AppointmentForm({
  lawyers,
  cases,
  defaultCaseId,
}: {
  lawyers: Profile[];
  cases: Case[];
  defaultCaseId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  function onSubmit(formData: FormData) {
    setError(undefined);
    start(async () => {
      const res = await bookAppointment(formData);
      if (res?.error) setError(res.error);
      else {
        setDone(true);
        router.refresh();
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-md bg-emerald-100 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
        Your consultation request has been submitted. We&apos;ll confirm shortly.
        <button className="ml-2 underline" onClick={() => setDone(false)}>Book another</button>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required placeholder="e.g. Initial consultation" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="scheduled_at">Preferred date &amp; time</Label>
          <Input id="scheduled_at" name="scheduled_at" type="datetime-local" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duration_minutes">Duration</Label>
          <Select id="duration_minutes" name="duration_minutes" defaultValue="30">
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="lawyer_id">Attorney</Label>
          <Select id="lawyer_id" name="lawyer_id" defaultValue="">
            <option value="">No preference</option>
            {lawyers.map((l) => <option key={l.id} value={l.id}>{l.full_name}</option>)}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="case_id">Related case (optional)</Label>
          <Select id="case_id" name="case_id" defaultValue={defaultCaseId ?? ''}>
            <option value="">None</option>
            {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="Anything we should know in advance?" />
      </div>

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="gold" disabled={pending}>
        {pending ? 'Submitting…' : 'Request appointment'}
      </Button>
    </form>
  );
}
