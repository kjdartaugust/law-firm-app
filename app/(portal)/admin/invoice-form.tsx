'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createInvoice } from '@/lib/actions/invoices';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select, Label } from '@/components/ui/input';
import type { Profile, Case } from '@/lib/types';

export function InvoiceForm({ clients, cases }: { clients: Profile[]; cases: Case[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [msg, setMsg] = useState<{ ok?: boolean; text: string }>();
  const [pending, start] = useTransition();

  function onSubmit(formData: FormData) {
    setMsg(undefined);
    start(async () => {
      const res = await createInvoice(formData);
      if (res?.error) setMsg({ text: res.error });
      else {
        setMsg({ ok: true, text: 'Invoice created.' });
        formRef.current?.reset();
        router.refresh();
      }
    });
  }

  return (
    <form action={onSubmit} ref={formRef} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="client_id">Client</Label>
        <Select id="client_id" name="client_id" required defaultValue="">
          <option value="" disabled>Select a client…</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name || c.email}</option>)}
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="case_id">Case (optional)</Label>
        <Select id="case_id" name="case_id" defaultValue="">
          <option value="">None</option>
          {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount (USD)</Label>
          <Input id="amount" name="amount" type="number" min="0" step="0.01" required placeholder="1500.00" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due_at">Due date</Label>
          <Input id="due_at" name="due_at" type="date" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={2} placeholder="Legal services rendered…" />
      </div>
      {msg && (
        <p className={`rounded-md px-3 py-2 text-sm ${msg.ok ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-destructive/10 text-destructive'}`}>
          {msg.text}
        </p>
      )}
      <Button type="submit" variant="gold" disabled={pending}>{pending ? 'Creating…' : 'Create invoice'}</Button>
    </form>
  );
}
