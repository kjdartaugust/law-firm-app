'use client';

import { useTransition } from 'react';
import { updateInvoiceStatus } from '@/lib/actions/invoices';
import { Button } from '@/components/ui/button';
import type { InvoiceStatus } from '@/lib/types';

export function InvoiceActions({
  id, status, isStaff,
}: { id: string; status: InvoiceStatus; isStaff: boolean }) {
  const [pending, start] = useTransition();
  const set = (s: InvoiceStatus) => start(() => void updateInvoiceStatus(id, s));

  if (status === 'paid') return null;

  return (
    <div className="flex gap-2">
      {/* Clients can "pay" (simulated); staff can also send/mark overdue. */}
      <Button size="sm" variant="gold" disabled={pending} onClick={() => set('paid')}>
        {pending ? '…' : 'Pay now'}
      </Button>
      {isStaff && status !== 'overdue' && (
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => set('overdue')}>Mark overdue</Button>
      )}
    </div>
  );
}
