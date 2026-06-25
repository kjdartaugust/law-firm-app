'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn, formatDateTime, initials } from '@/lib/utils';
import type { Message } from '@/lib/types';

export function MessageThread({
  caseId,
  currentUserId,
  initialMessages,
  participants,
}: {
  caseId: string;
  currentUserId: string;
  initialMessages: Message[];
  participants: Record<string, string>;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [names, setNames] = useState<Record<string, string>>(participants);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Live-subscribe to new messages on this case (RLS scopes what we receive).
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${caseId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `case_id=eq.${caseId}` },
        async (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));

          // Resolve an unknown sender's name once.
          if (!names[msg.sender_id]) {
            const { data } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', msg.sender_id)
              .single();
            if (data?.full_name) setNames((n) => ({ ...n, [msg.sender_id]: data.full_name }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  // Keep the latest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No messages yet. Start the conversation below.
        </p>
      )}
      {messages.map((m) => {
        const mine = m.sender_id === currentUserId;
        const name = names[m.sender_id] ?? '…';
        return (
          <div key={m.id} className={cn('flex gap-2', mine && 'flex-row-reverse')}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {initials(name === '…' ? '?' : name)}
            </div>
            <div className={cn('max-w-[75%] rounded-lg px-3 py-2', mine ? 'bg-gold text-white' : 'bg-secondary')}>
              <p className="whitespace-pre-wrap text-sm">{m.body}</p>
              <p className={cn('mt-1 text-[10px]', mine ? 'text-white/70' : 'text-muted-foreground')}>
                {name} · {formatDateTime(m.created_at)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
