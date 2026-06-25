import Link from 'next/link';
import { Briefcase, CalendarClock, Receipt, FileText, ArrowRight, ArrowUpRight } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/portal/stat-card';
import { CasesBar } from '@/components/portal/charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import type { Case, Appointment, Invoice } from '@/lib/types';

export const metadata = { title: 'Dashboard — Lexara Legal' };

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: cases }, { data: appts }, { data: invoices }, { count: docCount }] = await Promise.all([
    supabase.from('cases').select('*').order('created_at', { ascending: false }),
    supabase.from('appointments').select('*').gte('scheduled_at', new Date().toISOString()).order('scheduled_at').limit(4),
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

  const casesByStatus = (['open', 'pending', 'closed'] as const).map((s) => ({
    status: s[0].toUpperCase() + s.slice(1),
    count: caseList.filter((c) => c.status === s).length,
  }));

  const firstName = user.profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <>
      {/* Greeting banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-charcoal-950 p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.22),transparent_55%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Private Client Portal</p>
            <h1 className="mt-2 font-serif text-3xl font-bold">Good day, {firstName}.</h1>
            <p className="mt-1 text-sm text-white/60">Here is the state of your affairs with Lexara.</p>
          </div>
          <Link href="/cases/new"><Button variant="gold">Open a Matter</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active matters" value={openCases} icon={Briefcase} hint={`${caseList.length} total`} />
        <StatCard label="Upcoming" value={apptList.length} icon={CalendarClock} hint="appointments" />
        <StatCard label="Documents" value={docCount ?? 0} icon={FileText} hint="in your vault" />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={Receipt} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Matters by status</CardTitle></CardHeader>
          <CardContent><CasesBar data={casesByStatus} /></CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent matters</CardTitle>
            <Link href="/cases" className="text-sm text-gold hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {caseList.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No matters yet.</p>}
            {caseList.slice(0, 5).map((c) => (
              <Link key={c.id} href={`/cases/${c.id}`}
                className="flex items-center justify-between rounded-xl border border-border p-3.5 transition-all hover:border-gold/40 hover:bg-accent/40">
                <div>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.reference} · opened {formatDate(c.opened_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={c.status} />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Upcoming appointments</CardTitle>
          <Link href="/appointments" className="text-sm text-gold hover:underline">Manage</Link>
        </CardHeader>
        <CardContent>
          {apptList.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No upcoming appointments.{' '}
              <Link href="/appointments" className="text-gold hover:underline">Book one <ArrowRight className="inline h-3 w-3" /></Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {apptList.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <p className="text-sm font-medium">{a.subject}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(a.scheduled_at)}</p>
                  </div>
                  <Badge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
