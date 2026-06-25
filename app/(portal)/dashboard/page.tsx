import Link from 'next/link';
import { Briefcase, CalendarClock, Receipt, FileText, ArrowRight } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/portal/stat-card';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import type { Case, Appointment, Invoice } from '@/lib/types';

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: cases }, { data: appts }, { data: invoices }, { count: docCount }] = await Promise.all([
    supabase.from('cases').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('appointments').select('*').gte('scheduled_at', new Date().toISOString()).order('scheduled_at').limit(5),
    supabase.from('invoices').select('*'),
    supabase.from('documents').select('*', { count: 'exact', head: true }),
  ]);

  const caseList = (cases ?? []) as Case[];
  const apptList = (appts ?? []) as Appointment[];
  const invoiceList = (invoices ?? []) as Invoice[];
  const openCases = caseList.filter((c) => c.status !== 'closed').length;
  const outstanding = invoiceList
    .filter((i) => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount_cents, 0);

  return (
    <>
      <PageHeader
        title={`Good day, ${user.profile?.full_name?.split(' ')[0] ?? 'there'}`}
        description="Here's an overview of your matters and account."
      >
        <Link href="/cases/new"><Button variant="gold">New Case</Button></Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active cases" value={openCases} icon={Briefcase} hint={`${caseList.length} total`} />
        <StatCard label="Upcoming appointments" value={apptList.length} icon={CalendarClock} />
        <StatCard label="Documents" value={docCount ?? 0} icon={FileText} />
        <StatCard label="Outstanding balance" value={formatCurrency(outstanding)} icon={Receipt} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent cases</CardTitle>
            <Link href="/cases" className="text-sm text-gold hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {caseList.length === 0 && <p className="text-sm text-muted-foreground">No cases yet.</p>}
            {caseList.map((c) => (
              <Link key={c.id} href={`/cases/${c.id}`} className="flex items-center justify-between rounded-md border border-border p-3 transition-colors hover:bg-accent">
                <div>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.reference} · opened {formatDate(c.opened_at)}</p>
                </div>
                <Badge status={c.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Upcoming appointments</CardTitle>
            <Link href="/appointments" className="text-sm text-gold hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {apptList.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No upcoming appointments.{' '}
                <Link href="/appointments" className="text-gold hover:underline">Book one <ArrowRight className="inline h-3 w-3" /></Link>
              </div>
            )}
            {apptList.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{a.subject}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(a.scheduled_at)}</p>
                </div>
                <Badge status={a.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
