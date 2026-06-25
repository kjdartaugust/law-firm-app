import { Receipt, TrendingUp, Wallet, FileText } from 'lucide-react';
import { format, subMonths, startOfMonth, isSameMonth } from 'date-fns';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { StatCard } from '@/components/portal/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InvoiceActions } from '@/components/portal/invoice-actions';
import { RevenueArea, StatusDonut } from '@/components/portal/charts';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Invoice } from '@/lib/types';

export const metadata = { title: 'Billing — Lexara Legal' };

export default async function BillingPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const isStaff = user.profile?.role === 'admin' || user.profile?.role === 'lawyer';

  const { data } = await supabase.from('invoices').select('*').order('issued_at', { ascending: false });
  const invoices = (data ?? []) as Invoice[];

  const paid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount_cents, 0);
  const outstanding = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount_cents, 0);

  // 6-month billed vs collected series.
  const months = Array.from({ length: 6 }, (_, i) => startOfMonth(subMonths(new Date(), 5 - i)));
  const series = months.map((m) => ({
    month: format(m, 'MMM'),
    billed: invoices.filter((i) => isSameMonth(new Date(i.issued_at), m)).reduce((s, i) => s + i.amount_cents, 0) / 100,
    paid: invoices.filter((i) => i.paid_at && isSameMonth(new Date(i.paid_at), m)).reduce((s, i) => s + i.amount_cents, 0) / 100,
  }));

  const statusData = (['paid', 'sent', 'overdue', 'draft'] as const).map((st) => ({
    name: st[0].toUpperCase() + st.slice(1),
    value: invoices.filter((i) => i.status === st).length,
  }));

  return (
    <>
      <PageHeader title="Billing" description="A clear, considered view of your account." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={Wallet} />
        <StatCard label="Collected to date" value={formatCurrency(paid)} icon={TrendingUp} />
        <StatCard label="Invoices" value={invoices.length} icon={FileText} />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Billed vs. collected</CardTitle></CardHeader>
          <CardContent><RevenueArea data={series} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>By status</CardTitle></CardHeader>
          <CardContent>
            <StatusDonut data={statusData} />
            <div className="mt-4 space-y-1.5">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Receipt className="h-9 w-9 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No invoices yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-luxe text-muted-foreground">
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
                    <tr key={inv.id} className="border-b border-border/60 transition-colors hover:bg-accent/40">
                      <td className="py-4 pr-4">
                        <p className="font-medium">{inv.number}</p>
                        {inv.description && <p className="text-xs text-muted-foreground">{inv.description}</p>}
                      </td>
                      <td className="py-4 pr-4 text-muted-foreground">{formatDate(inv.issued_at)}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{inv.due_at ? formatDate(inv.due_at) : '—'}</td>
                      <td className="py-4 pr-4 font-serif font-semibold">{formatCurrency(inv.amount_cents, inv.currency)}</td>
                      <td className="py-4 pr-4"><Badge status={inv.status} /></td>
                      <td className="py-4"><InvoiceActions id={inv.id} status={inv.status} isStaff={isStaff} /></td>
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
