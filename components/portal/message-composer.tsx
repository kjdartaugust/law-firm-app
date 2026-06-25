'use client';

import { useRef, useState, useTransition } from 'react';
import { Send } from 'lucide-react';
import { sendMessage } from '@/lib/actions/messages';
import { Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function MessageComposer({ caseId }: { caseId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  function onSubmit(formData: FormData) {
    setError(undefined);
    start(async () => {
      const res = await sendMessage(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form action={onSubmit} ref={formRef} className="border-t border-border p-4">
      <input type="hidden" name="case_id" value={caseId} />
      <div className="flex items-end gap-2">
        <Textarea
          name="body"
          rows={2}
          required
          placeholder="Write a secure message…"
          className="min-h-[44px] flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <Button type="submit" variant="gold" size="icon" disabled={pending} aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </form>
  );
}
