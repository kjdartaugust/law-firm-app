import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { MessageComposer } from '@/components/portal/message-composer';
import { MessageThread } from '@/components/portal/message-thread';
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

  // Resolve sender names into a plain record for the client thread.
  const senderIds = [...new Set(messages.map((m) => m.sender_id))];
  const { data: profiles } = senderIds.length
    ? await supabase.from('profiles').select('id, full_name').in('id', senderIds)
    : { data: [] };
  const participants: Record<string, string> = {};
  for (const p of (profiles as Pick<Profile, 'id' | 'full_name'>[] | null ?? [])) {
    participants[p.id] = p.full_name;
  }
  // Ensure the current user's name is available for their own outgoing messages.
  if (user.profile?.full_name) participants[user.id] = user.profile.full_name;

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

        <MessageThread
          caseId={c.id}
          currentUserId={user.id}
          initialMessages={messages}
          participants={participants}
        />

        <MessageComposer caseId={c.id} />
      </Card>
    </div>
  );
}
