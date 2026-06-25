import Link from 'next/link';
import { Briefcase, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Case, CaseStatus } from '@/lib/types';

export const metadata = { title: 'Matters — Lexara Legal' };

const FILTERS: { label: string; value: CaseStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In progress', value: 'pending' },
  { label: 'Resolved', value: 'closed' },
];

export default async function CasesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from('cases').select('*').order('created_at', { ascending: false });
  const active = status ?? 'all';
  if (active !== 'all') query = query.eq('status', active as CaseStatus);

  const { data } = await query;
  const cases = (data ?? []) as Case[];

  return (
    <>
      <PageHeader title="Matters" description="Track every engagement from intake to resolution.">
        <Link href="/cases/new"><Button variant="gold">Open a Matter</Button></Link>
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === 'all' ? '/cases' : `/cases?status=${f.value}`}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-all',
              active === f.value
                ? 'border-gold bg-gold-sheen/15 font-medium text-gold'
                : 'border-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {cases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-sheen/15 text-gold">
              <Briefcase className="h-7 w-7" />
            </div>
            <p className="text-muted-foreground">No matters found for this filter.</p>
            <Link href="/cases/new"><Button variant="gold">Open your first matter</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cases.map((c) => (
            <Link key={c.id} href={`/cases/${c.id}`}>
              <Card className="group transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-luxe">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-sheen/15 text-gold">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="truncate font-serif text-lg font-semibold">{c.title}</h3>
                        <Badge status={c.status} />
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {c.reference}
                        {c.practice_area ? ` · ${c.practice_area}` : ''} · opened {formatDate(c.opened_at)}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-gold" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
