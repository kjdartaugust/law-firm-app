import { Receipt } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { StatCard } from '@/components/portal/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InvoiceActions } from '@/components/portal/invoice-actions';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Invoice } from '@/lib/types';

export const metadata = { title: 'Billing' };

export default async function BillingPage() {
  const user = await requireUser();
  const supabase = createClient();
  const isStaff = user.profile?.role === 'admin' || user.profile?.role === 'lawyer';

  const { data } = await supabase.from('invoices').select('*').order('issued_at', { ascending: false });
  const invoices = (data ?? []) as Invoice[];

  const paid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount_cents, 0);
  const outstanding = invoices
    .filter((i) => i.status === 'sent' || i.status === 'overdue')
    .reduce((s, i) => s + i.amount_cents, 0);

  return (
    <>
      <PageHeader title="Billing" description="Invoices and payment history for your matters." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={Receipt} />
        <StatCard label="Paid to date" value={formatCurrency(paid)} icon={Receipt} />
        <StatCard label="Invoices" value={invoices.length} icon={Receipt} />
      </div>

      <Card>
        <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No invoices yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Invoice</th>
                    <th className="pb-3 pr-4 font-medium">Issued</th>
                    <th className="pb-3 pr-4 font-medium">Due</th>
                    <th className="pb-3 pr-4 font-medium">Amount</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/60">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{inv.number}</p>
                        {inv.description && <p className="text-xs text-muted-foreground">{inv.description}</p>}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{formatDate(inv.issued_at)}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{inv.due_at ? formatDate(inv.due_at) : '—'}</td>
                      <td className="py-3 pr-4 font-medium">{formatCurrency(inv.amount_cents, inv.currency)}</td>
                      <td className="py-3 pr-4"><Badge status={inv.status} /></td>
                      <td className="py-3"><InvoiceActions id={inv.id} status={inv.status} isStaff={isStaff} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
