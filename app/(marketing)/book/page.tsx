import Link from 'next/link';
import { CalendarClock } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppointmentForm } from '@/components/portal/appointment-form';
import type { Profile, Case } from '@/lib/types';

export const metadata = { title: 'Book a Consultation — Sterling & Crane' };

export default async function BookPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl py-16 container-px">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-gold">
          <CalendarClock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-serif text-3xl font-bold">Book a Consultation</h1>
        <p className="mt-2 text-muted-foreground">
          Schedule a confidential meeting with one of our attorneys.
        </p>
      </div>

      <Card className="mt-8">
        <CardContent className="p-6">
          {user ? (
            <BookingForm userId={user.id} />
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Please sign in or create an account to request a consultation. It keeps your
                matter secure and lets you track everything in one place.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/signup"><Button variant="gold">Create account</Button></Link>
                <Link href="/login"><Button variant="outline">Sign in</Button></Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function BookingForm({ userId }: { userId: string }) {
  const supabase = await createClient();
  const [{ data: lawyers }, { data: cases }] = await Promise.all([
    supabase.from('profiles').select('*').eq('role', 'lawyer').order('full_name'),
    supabase.from('cases').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
  ]);

  return <AppointmentForm lawyers={(lawyers ?? []) as Profile[]} cases={(cases ?? []) as Case[]} />;
}
