'use client';

import { useState, useTransition } from 'react';
import { Download, Trash2, FileText, Eye, X } from 'lucide-react';
import { getDocumentUrl, deleteDocument } from '@/lib/actions/documents';
import { formatBytes, formatDate } from '@/lib/utils';
import type { CaseDocument } from '@/lib/types';

function isPreviewable(mime: string | null) {
  if (!mime) return false;
  return mime.startsWith('image/') || mime === 'application/pdf';
}

export function DocumentRow({ doc, canDelete }: { doc: CaseDocument; canDelete: boolean }) {
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [, start] = useTransition();
  const previewable = isPreviewable(doc.mime_type);

  async function openUrl(preview: boolean) {
    setBusy(true);
    const res = await getDocumentUrl(doc.storage_path);
    setBusy(false);
    if (!('url' in res) || !res.url) return;
    if (preview) setPreviewUrl(res.url);
    else window.open(res.url, '_blank');
  }

  return (
    <>
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
          {previewable && (
            <button
              onClick={() => openUrl(true)}
              disabled={busy}
              aria-label="Preview"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => openUrl(false)}
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

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${doc.name}`}
        >
          <div className="absolute inset-0" onClick={() => setPreviewUrl(null)} />
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <p className="truncate text-sm font-medium">{doc.name}</p>
              <button
                onClick={() => setPreviewUrl(null)}
                aria-label="Close preview"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-muted/30">
              {doc.mime_type === 'application/pdf' ? (
                <iframe src={previewUrl} title={doc.name} className="h-[80vh] w-full" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt={doc.name} className="mx-auto max-h-[80vh] w-auto" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
