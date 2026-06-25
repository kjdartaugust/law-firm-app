'use client';

import { useState, useTransition } from 'react';
import { Download, Trash2, FileText, FileImage, FileType, Eye, X } from 'lucide-react';
import { getDocumentUrl, deleteDocument } from '@/lib/actions/documents';
import { formatBytes, formatDate } from '@/lib/utils';
import type { CaseDocument } from '@/lib/types';

function DocIcon({ mime, className }: { mime: string | null; className?: string }) {
  if (mime?.startsWith('image/')) return <FileImage className={className} />;
  if (mime === 'application/pdf') return <FileType className={className} />;
  return <FileText className={className} />;
}
const isPreviewable = (mime: string | null) => !!mime && (mime.startsWith('image/') || mime === 'application/pdf');

export function DocumentCard({
  doc, caseTitle, canDelete,
}: { doc: CaseDocument; caseTitle?: string; canDelete: boolean }) {
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [, start] = useTransition();

  async function open(preview: boolean) {
    setBusy(true);
    const res = await getDocumentUrl(doc.storage_path);
    setBusy(false);
    if (!('url' in res) || !res.url) return;
    if (preview) setPreviewUrl(res.url);
    else window.open(res.url, '_blank');
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/40 p-5 shadow-glass backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-luxe dark:bg-white/5">
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold-sheen/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
        <div className="relative flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-sheen/15 text-gold">
            <DocIcon mime={doc.mime_type} className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {isPreviewable(doc.mime_type) && (
              <button onClick={() => open(true)} disabled={busy} aria-label="Preview"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50">
                <Eye className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => open(false)} disabled={busy} aria-label="Download"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50">
              <Download className="h-4 w-4" />
            </button>
            {canDelete && (
              <button onClick={() => start(() => void deleteDocument(doc.id, doc.storage_path))} aria-label="Delete"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <p className="relative mt-4 truncate text-sm font-semibold">{doc.name}</p>
        <p className="relative mt-1 text-xs text-muted-foreground">
          {doc.size_bytes ? formatBytes(doc.size_bytes) : ''} · {formatDate(doc.created_at)}
        </p>
        {caseTitle && <p className="relative mt-2 truncate text-[11px] uppercase tracking-wide text-gold">{caseTitle}</p>}
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0" onClick={() => setPreviewUrl(null)} />
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <p className="truncate text-sm font-medium">{doc.name}</p>
              <button onClick={() => setPreviewUrl(null)} aria-label="Close preview"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
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
