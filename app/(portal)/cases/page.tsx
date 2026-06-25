import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Case, CaseStatus } from '@/lib/types';

const FILTERS: { label: string; value: CaseStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Closed', value: 'closed' },
];

export default async function CasesPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createClient();
  let query = supabase.from('cases').select('*').order('created_at', { ascending: false });
  const active = searchParams.status ?? 'all';
  if (active !== 'all') query = query.eq('status', active as CaseStatus);

  const { data } = await query;
  const cases = (data ?? []) as Case[];

  return (
    <>
      <PageHeader title="Cases" description="Track every matter from open to resolution.">
        <Link href="/cases/new"><Button variant="gold">New Case</Button></Link>
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === 'all' ? '/cases' : `/cases?status=${f.value}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              active === f.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-accent'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {cases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No cases found for this filter.</p>
            <Link href="/cases/new"><Button>Open your first case</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cases.map((c) => (
            <Link key={c.id} href={`/cases/${c.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="truncate font-medium">{c.title}</h3>
                      <Badge status={c.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {c.reference}
                      {c.practice_area ? ` · ${c.practice_area}` : ''} · opened {formatDate(c.opened_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
