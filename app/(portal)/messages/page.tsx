import Link from 'next/link';
import { MessagesSquare, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Case } from '@/lib/types';

export const metadata = { title: 'Messages — Lexara Legal' };

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('cases').select('*').order('created_at', { ascending: false });
  const cases = (data ?? []) as Case[];

  return (
    <>
      <PageHeader title="Messages" description="Confidential conversations, organised by matter." />
      {cases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-sheen/15 text-gold">
              <MessagesSquare className="h-7 w-7" />
            </div>
            <p className="text-muted-foreground">Open a matter to begin a secure conversation with your counsel.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {cases.map((c) => (
            <Link key={c.id} href={`/messages/${c.id}`}>
              <Card className="group transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-luxe">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-sheen/15 text-gold">
                      <MessagesSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-serif font-semibold">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.reference}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge status={c.status} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
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
