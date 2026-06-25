import { CalendarClock } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarBooking } from '@/components/portal/calendar-booking';
import { AppointmentActions } from '@/components/portal/appointment-actions';
import { formatDateTime } from '@/lib/utils';
import type { Appointment, Profile, Case } from '@/lib/types';

export const metadata = { title: 'Appointments — Lexara Legal' };

export default async function AppointmentsPage({ searchParams }: { searchParams: Promise<{ case?: string }> }) {
  const { case: caseParam } = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();
  const isStaff = user.profile?.role === 'admin' || user.profile?.role === 'lawyer';

  const [{ data: appts }, { data: lawyers }, { data: cases }] = await Promise.all([
    supabase.from('appointments').select('*').order('scheduled_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('role', 'lawyer').order('full_name'),
    supabase.from('cases').select('*').order('created_at', { ascending: false }),
  ]);

  const appointments = (appts ?? []) as Appointment[];
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const upcoming = appointments.filter((a) => new Date(a.scheduled_at).getTime() >= now);
  const past = appointments.filter((a) => new Date(a.scheduled_at).getTime() < now);

  return (
    <>
      <PageHeader title="Appointments" description="Schedule and manage your consultations." />

      <Card className="mb-8">
        <CardHeader><CardTitle>Reserve a consultation</CardTitle></CardHeader>
        <CardContent>
          <CalendarBooking
            lawyers={(lawyers ?? []) as Profile[]}
            cases={(cases ?? []) as Case[]}
            defaultCaseId={caseParam}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Upcoming" items={upcoming} isStaff={isStaff} empty="No upcoming appointments." />
        <Section title="Past" items={past} isStaff={isStaff} empty="No past appointments." />
      </div>
    </>
  );
}

function Section({ title, items, isStaff, empty }: { title: string; items: Appointment[]; isStaff: boolean; empty: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <CalendarClock className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{empty}</p>
          </div>
        ) : (
          items.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-accent/40">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{a.subject}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(a.scheduled_at)} · {a.duration_minutes} min</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={a.status} />
                {isStaff && <AppointmentActions id={a.id} status={a.status} />}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
