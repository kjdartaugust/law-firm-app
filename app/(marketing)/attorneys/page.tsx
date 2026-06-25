import Link from 'next/link';
import { Mail, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { initials } from '@/lib/utils';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/lib/types';

export const metadata = { title: 'Our Counsel — Lexara Legal' };

export default async function AttorneysPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'lawyer')
    .order('years_experience', { ascending: false });

  const lawyers = (data ?? []) as Profile[];

  return (
    <>
      {/* Header band */}
      <section className="bg-charcoal-950 pt-36 pb-20 text-white">
        <div className="mx-auto max-w-7xl px-5 text-center container-px">
          <Reveal>
            <p className="eyebrow">The Firm</p>
            <h1 className="mt-4 font-serif text-5xl font-bold md:text-6xl">Our Counsel</h1>
            <p className="mx-auto mt-5 max-w-xl text-white/70">
              Seasoned advocates and advisors, each a recognised authority in their field —
              united by a singular commitment to your outcome.
            </p>
            <div className="mx-auto mt-6 hairline" />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 container-px">
        {lawyers.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              Attorney profiles will appear here once added by the firm administrator.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Lawyers can complete their profile from{' '}
              <Link href="/settings" className="text-gold hover:underline">portal settings</Link>.
            </p>
          </div>
        ) : (
          <Stagger className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {lawyers.map((l) => (
              <StaggerItem key={l.id}>
                <article className="group relative h-80 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:shadow-luxe">
                  {/* Default face */}
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center transition-all duration-500 group-hover:-translate-y-4 group-hover:opacity-0">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold/50 bg-gold-sheen/10 font-serif text-2xl font-bold text-gold">
                      {initials(l.full_name || 'A')}
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-semibold">{l.full_name}</h3>
                    <p className="mt-1 text-sm text-gold">{l.title ?? 'Attorney'}</p>
                    {l.years_experience != null && (
                      <p className="mt-3 text-xs uppercase tracking-luxe text-muted-foreground">
                        {l.years_experience} yrs experience
                      </p>
                    )}
                  </div>

                  {/* Hover reveal */}
                  <div className="absolute inset-0 flex translate-y-6 flex-col bg-charcoal-950 p-7 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="font-serif text-xl font-semibold">{l.full_name}</h3>
                    <p className="text-sm text-gold">{l.title ?? 'Attorney'}</p>
                    <p className="mt-4 flex-1 overflow-hidden text-sm leading-relaxed text-white/70">
                      {l.bio || 'A trusted advisor dedicated to achieving exceptional results for every client.'}
                    </p>
                    {l.practice_areas && l.practice_areas.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {l.practice_areas.slice(0, 3).map((p) => (
                          <span key={p} className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-white/70">{p}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-xs text-gold">
                      <Mail className="h-3.5 w-3.5" /> {l.email}
                    </div>
                  </div>
                  <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-white/0 transition-colors duration-500 group-hover:text-gold" />
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <Reveal className="mt-20 text-center">
          <h2 className="font-serif text-3xl font-bold">Ready to engage Lexara?</h2>
          <p className="mt-3 text-muted-foreground">Book a confidential consultation with the right counsel for your matter.</p>
          <Link href="/book" className="mt-6 inline-block"><Button variant="gold" size="lg">Request a Consultation</Button></Link>
        </Reveal>
      </section>
    </>
  );
}
