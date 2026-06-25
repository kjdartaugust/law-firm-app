'use client';

import { useState, useTransition } from 'react';
import { payInvoice, updateInvoiceStatus } from '@/lib/actions/invoices';
import { Button } from '@/components/ui/button';
import type { InvoiceStatus } from '@/lib/types';

export function InvoiceActions({
  id, status, isStaff,
}: { id: string; status: InvoiceStatus; isStaff: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();

  function pay() {
    setError(undefined);
    start(async () => {
      const res = await payInvoice(id);
      if (res && 'error' in res && res.error) setError(res.error);
      else if (res && 'url' in res && res.url) window.location.href = res.url; // Stripe Checkout
      // else: simulated payment succeeded; revalidation refreshes the row.
    });
  }

  if (status === 'paid') return null;

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="gold" disabled={pending} onClick={pay}>
        {pending ? '…' : 'Pay now'}
      </Button>
      {isStaff && status !== 'overdue' && (
        <Button
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() => start(() => void updateInvoiceStatus(id, 'overdue'))}
        >
          Mark overdue
        </Button>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
