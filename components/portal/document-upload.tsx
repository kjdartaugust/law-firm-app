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
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/30 bg-gold-sheen/5 px-4 py-10 text-center transition-all hover:border-gold/60 hover:bg-gold-sheen/10">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-sheen/15 text-gold">
          <Upload className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium">Drop a file or click to upload</span>
        <span className="text-xs text-muted-foreground">PDF, images and documents · up to 25 MB</span>
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
