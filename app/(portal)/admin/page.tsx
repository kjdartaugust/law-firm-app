import { Users, Briefcase, Receipt, CalendarClock } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { StatCard } from '@/components/portal/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoleControl } from '@/components/portal/role-control';
import { InvoiceForm } from './invoice-form';
import { formatCurrency, formatDate, initials } from '@/lib/utils';
import type { Profile, Case, Invoice, Appointment } from '@/lib/types';

export const metadata = { title: 'Admin' };

export default async function AdminPage() {
  await requireAdmin();
  const supabase = createClient();

  const [{ data: users }, { data: cases }, { data: invoices }, { data: appts }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('cases').select('*').order('created_at', { ascending: false }),
    supabase.from('invoices').select('*'),
    supabase.from('appointments').select('*').gte('scheduled_at', new Date().toISOString()),
  ]);

  const userList = (users ?? []) as Profile[];
  const caseList = (cases ?? []) as Case[];
  const invoiceList = (invoices ?? []) as Invoice[];
  const apptList = (appts ?? []) as Appointment[];

  const clients = userList.filter((u) => u.role === 'client');
  const revenue = invoiceList.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount_cents, 0);
  const openCases = caseList.filter((c) => c.status !== 'closed').length;

  return (
    <>
      <PageHeader title="Admin dashboard" description="Firm-wide management and oversight." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={userList.length} icon={Users} hint={`${clients.length} clients`} />
        <StatCard label="Open cases" value={openCases} icon={Briefcase} hint={`${caseList.length} total`} />
        <StatCard label="Revenue collected" value={formatCurrency(revenue)} icon={Receipt} />
        <StatCard label="Upcoming appts" value={apptList.length} icon={CalendarClock} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Users &amp; roles</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">User</th>
                    <th className="pb-3 pr-4 font-medium">Joined</th>
                    <th className="pb-3 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u) => (
                    <tr key={u.id} className="border-b border-border/60">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                            {initials(u.full_name || u.email || '?')}
                          </div>
                          <div>
                            <p className="font-medium">{u.full_name || '—'}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{formatDate(u.created_at)}</td>
                      <td className="py-3"><RoleControl userId={u.id} role={u.role} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle>Create invoice</CardTitle></CardHeader>
          <CardContent>
            <InvoiceForm clients={clients} cases={caseList} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>All cases</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {caseList.length === 0 && <p className="text-sm text-muted-foreground">No cases yet.</p>}
          {caseList.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.reference} · opened {formatDate(c.opened_at)}</p>
              </div>
              <Badge status={c.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
