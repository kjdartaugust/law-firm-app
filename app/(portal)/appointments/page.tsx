import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppointmentForm } from '@/components/portal/appointment-form';
import { AppointmentActions } from '@/components/portal/appointment-actions';
import { formatDateTime } from '@/lib/utils';
import type { Appointment, Profile, Case } from '@/lib/types';

export const metadata = { title: 'Appointments' };

export default async function AppointmentsPage({ searchParams }: { searchParams: { case?: string } }) {
  const user = await requireUser();
  const supabase = createClient();
  const isStaff = user.profile?.role === 'admin' || user.profile?.role === 'lawyer';

  const [{ data: appts }, { data: lawyers }, { data: cases }] = await Promise.all([
    supabase.from('appointments').select('*').order('scheduled_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('role', 'lawyer').order('full_name'),
    supabase.from('cases').select('*').order('created_at', { ascending: false }),
  ]);

  const appointments = (appts ?? []) as Appointment[];
  const now = Date.now();
  const upcoming = appointments.filter((a) => new Date(a.scheduled_at).getTime() >= now);
  const past = appointments.filter((a) => new Date(a.scheduled_at).getTime() < now);

  return (
    <>
      <PageHeader title="Appointments" description="Schedule and manage your consultations." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Upcoming" items={upcoming} isStaff={isStaff} empty="No upcoming appointments." />
          <Section title="Past" items={past} isStaff={isStaff} empty="No past appointments." />
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle>Book a consultation</CardTitle></CardHeader>
          <CardContent>
            <AppointmentForm
              lawyers={(lawyers ?? []) as Profile[]}
              cases={(cases ?? []) as Case[]}
              defaultCaseId={searchParams.case}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Section({
  title, items, isStaff, empty,
}: { title: string; items: Appointment[]; isStaff: boolean; empty: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          items.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
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
