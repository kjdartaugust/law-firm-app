import Link from 'next/link';
import { FileText, ShieldCheck } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { Button } from '@/components/ui/button';
import { DocumentCard } from '@/components/portal/document-card';
import { formatBytes } from '@/lib/utils';
import type { CaseDocument, Case } from '@/lib/types';

export const metadata = { title: 'Document Vault — Lexara Legal' };

export default async function DocumentsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const isStaff = user.profile?.role === 'admin' || user.profile?.role === 'lawyer';

  const { data: docs } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
  const documents = (docs ?? []) as CaseDocument[];

  const caseIds = [...new Set(documents.map((d) => d.case_id))];
  const { data: cases } = caseIds.length
    ? await supabase.from('cases').select('*').in('id', caseIds)
    : { data: [] };
  const caseMap = new Map((cases as Case[] | null ?? []).map((c) => [c.id, c]));
  const totalBytes = documents.reduce((s, d) => s + (d.size_bytes ?? 0), 0);

  return (
    <>
      <PageHeader title="Document Vault" description="Every file across your matters, encrypted and access-controlled.">
        <div className="hidden items-center gap-2 rounded-full border border-gold/30 bg-gold-sheen/10 px-4 py-2 text-xs text-gold sm:flex">
          <ShieldCheck className="h-4 w-4" /> {documents.length} files · {formatBytes(totalBytes)}
        </div>
      </PageHeader>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center backdrop-blur">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-sheen/15 text-gold">
            <FileText className="h-7 w-7" />
          </div>
          <p className="text-muted-foreground">Your vault is empty. Upload files from within a matter.</p>
          <Link href="/cases"><Button variant="gold">Go to matters</Button></Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((d) => (
            <DocumentCard
              key={d.id}
              doc={d}
              caseTitle={caseMap.get(d.case_id)?.title}
              canDelete={d.uploaded_by === user.id || isStaff}
            />
          ))}
        </div>
      )}
    </>
  );
}
