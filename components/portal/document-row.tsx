'use client';

import { useState, useTransition } from 'react';
import { Download, Trash2, FileText } from 'lucide-react';
import { getDocumentUrl, deleteDocument } from '@/lib/actions/documents';
import { formatBytes, formatDate } from '@/lib/utils';
import type { CaseDocument } from '@/lib/types';

export function DocumentRow({ doc, canDelete }: { doc: CaseDocument; canDelete: boolean }) {
  const [busy, setBusy] = useState(false);
  const [, start] = useTransition();

  async function download() {
    setBusy(true);
    const res = await getDocumentUrl(doc.storage_path);
    setBusy(false);
    if ('url' in res && res.url) window.open(res.url, '_blank');
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-border p-3">
      <div className="flex min-w-0 items-center gap-3">
        <FileText className="h-5 w-5 shrink-0 text-gold" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{doc.name}</p>
          <p className="text-xs text-muted-foreground">
            {doc.size_bytes ? formatBytes(doc.size_bytes) : ''} · {formatDate(doc.created_at)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={download}
          disabled={busy}
          aria-label="Download"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
        </button>
        {canDelete && (
          <button
            onClick={() => start(() => void deleteDocument(doc.id, doc.storage_path))}
            aria-label="Delete"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
