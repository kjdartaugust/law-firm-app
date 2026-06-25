'use client';

import { useRef, useState, useTransition } from 'react';
import { Upload } from 'lucide-react';
import { uploadDocument } from '@/lib/actions/documents';
import { Button } from '@/components/ui/button';

export function DocumentUpload({ caseId }: { caseId: string }) {
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(formData: FormData) {
    setError(undefined);
    start(async () => {
      const res = await uploadDocument(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form action={onSubmit} ref={formRef} className="space-y-3">
      <input type="hidden" name="case_id" value={caseId} />
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-8 text-center transition-colors hover:bg-accent">
        <Upload className="h-6 w-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Click to choose a file (max 25 MB)</span>
        <input
          type="file"
          name="file"
          className="hidden"
          onChange={(e) => e.target.files?.length && formRef.current?.requestSubmit()}
        />
      </label>
      {pending && <p className="text-sm text-muted-foreground">Uploading…</p>}
      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
    </form>
  );
}
