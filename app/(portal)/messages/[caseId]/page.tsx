import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { MessageComposer } from '@/components/portal/message-composer';
import { cn, formatDateTime, initials } from '@/lib/utils';
import type { Case, Message, Profile } from '@/lib/types';

export default async function ThreadPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: caseRow } = await supabase.from('cases').select('*').eq('id', caseId).single();
  if (!caseRow) notFound();
  const c = caseRow as Case;

  const { data: msgs } = await supabase
    .from('messages')
    .select('*')
    .eq('case_id', c.id)
    .order('created_at', { ascending: true });
  const messages = (msgs ?? []) as Message[];

  // Resolve sender names.
  const senderIds = [...new Set(messages.map((m) => m.sender_id))];
  const { data: profiles } = senderIds.length
    ? await supabase.from('profiles').select('id, full_name').in('id', senderIds)
    : { data: [] };
  const nameMap = new Map((profiles as Pick<Profile, 'id' | 'full_name'>[] | null ?? []).map((p) => [p.id, p.full_name]));

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/messages" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All conversations
      </Link>

      <Card className="flex h-[70vh] flex-col">
        <div className="border-b border-border p-4">
          <h2 className="font-serif text-lg font-semibold">{c.title}</h2>
          <p className="text-xs text-muted-foreground">{c.reference}</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages yet. Start the conversation below.
            </p>
          )}
          {messages.map((m) => {
            const mine = m.sender_id === user.id;
            return (
              <div key={m.id} className={cn('flex gap-2', mine && 'flex-row-reverse')}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials(nameMap.get(m.sender_id) ?? '?')}
                </div>
                <div className={cn('max-w-[75%] rounded-lg px-3 py-2', mine ? 'bg-gold text-white' : 'bg-secondary')}>
                  <p className="whitespace-pre-wrap text-sm">{m.body}</p>
                  <p className={cn('mt-1 text-[10px]', mine ? 'text-white/70' : 'text-muted-foreground')}>
                    {nameMap.get(m.sender_id)} · {formatDateTime(m.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <MessageComposer caseId={c.id} />
      </Card>
    </div>
  );
}
