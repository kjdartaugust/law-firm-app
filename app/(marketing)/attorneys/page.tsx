import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { initials } from '@/lib/utils';
import type { Profile } from '@/lib/types';

export const metadata = { title: 'Our Attorneys — Sterling & Crane' };

export default async function AttorneysPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'lawyer')
    .order('years_experience', { ascending: false });

  const lawyers = (data ?? []) as Profile[];

  return (
    <div className="mx-auto max-w-7xl py-16 container-px">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-4xl font-bold">Our Attorneys</h1>
        <p className="mt-3 text-muted-foreground">
          Seasoned advocates committed to your outcome. Get to know the team behind Sterling &amp; Crane.
        </p>
      </div>

      {lawyers.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Attorney profiles will appear here once added by the firm administrator.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((l) => (
            <Card key={l.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                    {initials(l.full_name || 'A')}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold">{l.full_name}</h3>
                    <p className="text-sm text-gold">{l.title ?? 'Attorney'}</p>
                  </div>
                </div>
                {l.bio && <p className="mt-4 text-sm text-muted-foreground line-clamp-4">{l.bio}</p>}
                {l.practice_areas && l.practice_areas.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {l.practice_areas.map((p) => (
                      <span key={p} className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-accent-foreground">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
                {l.years_experience != null && (
                  <p className="mt-4 text-xs text-muted-foreground">{l.years_experience} years of experience</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
