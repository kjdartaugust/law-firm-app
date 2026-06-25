'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCase } from '@/lib/actions/cases';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select, Label } from '@/components/ui/input';
import type { PracticeArea, Profile } from '@/lib/types';

export function NewCaseForm({ areas, lawyers }: { areas: PracticeArea[]; lawyers: Profile[] }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  function onSubmit(formData: FormData) {
    setError(undefined);
    start(async () => {
      const res = await createCase(formData);
      if (res?.error) setError(res.error);
      else router.push('/cases');
    });
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Case title</Label>
        <Input id="title" name="title" required placeholder="e.g. Commercial lease dispute" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="practice_area">Practice area</Label>
          <Select id="practice_area" name="practice_area" defaultValue="">
            <option value="">Select an area…</option>
            {areas.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lawyer_id">Preferred attorney (optional)</Label>
          <Select id="lawyer_id" name="lawyer_id" defaultValue="">
            <option value="">No preference</option>
            {lawyers.map((l) => <option key={l.id} value={l.id}>{l.full_name}</option>)}
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Describe your matter</Label>
        <Textarea id="description" name="description" rows={5} placeholder="Provide as much detail as you're comfortable sharing…" />
      </div>

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? 'Opening…' : 'Open case'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
