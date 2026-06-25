import Link from 'next/link';
import { MessagesSquare, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Case } from '@/lib/types';

export const metadata = { title: 'Messages' };

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('cases').select('*').order('created_at', { ascending: false });
  const cases = (data ?? []) as Case[];

  return (
    <>
      <PageHeader title="Messages" description="Secure conversations, organized by case." />
      {cases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <MessagesSquare className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Open a case to start a secure conversation with your attorney.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {cases.map((c) => (
            <Link key={c.id} href={`/messages/${c.id}`}>
              <Card className="transition-colors hover:bg-accent">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-gold">
                      <MessagesSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.reference}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge status={c.status} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
