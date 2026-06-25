import Link from 'next/link';
import { CalendarClock, ShieldCheck, Clock } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { CalendarBooking } from '@/components/portal/calendar-booking';
import { Reveal } from '@/components/motion/reveal';
import type { Profile, Case } from '@/lib/types';

export const metadata = { title: 'Request a Consultation — Lexara Legal' };

export default async function BookPage() {
  const user = await getCurrentUser();

  return (
    <>
      <section className="bg-charcoal-950 pt-36 pb-20 text-white">
        <div className="mx-auto max-w-3xl px-5 text-center container-px">
          <Reveal>
            <p className="eyebrow">Private Consultation</p>
            <h1 className="mt-4 font-serif text-5xl font-bold md:text-6xl">Reserve your time</h1>
            <p className="mx-auto mt-5 max-w-xl text-white/70">
              Choose a date that suits you. Every consultation is confidential and conducted
              with the discretion our clients expect.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Strictly confidential</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /> 30–90 minutes</span>
              <span className="inline-flex items-center gap-2"><CalendarClock className="h-4 w-4 text-gold" /> Flexible scheduling</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 container-px">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe md:p-10">
          {user ? (
            <BookingPanel userId={user.id} />
          ) : (
            <div className="py-12 text-center">
              <h2 className="font-serif text-2xl font-bold">Sign in to reserve</h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                A Lexara account keeps your matter secure and lets you track every appointment,
                document and invoice in one place.
              </p>
              <div className="mt-7 flex justify-center gap-3">
                <Link href="/signup"><Button variant="gold" size="lg">Create account</Button></Link>
                <Link href="/login"><Button variant="outline" size="lg">Sign in</Button></Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

async function BookingPanel({ userId }: { userId: string }) {
  const supabase = await createClient();
  const [{ data: lawyers }, { data: cases }] = await Promise.all([
    supabase.from('profiles').select('*').eq('role', 'lawyer').order('full_name'),
    supabase.from('cases').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
  ]);

  return <CalendarBooking lawyers={(lawyers ?? []) as Profile[]} cases={(cases ?? []) as Case[]} />;
}
