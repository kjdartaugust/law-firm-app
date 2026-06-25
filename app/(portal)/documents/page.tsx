import Link from 'next/link';
import { FileText } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { DocumentRow } from '@/components/portal/document-row';
import type { CaseDocument, Case } from '@/lib/types';

export const metadata = { title: 'Documents' };

export default async function DocumentsPage() {
  const user = await requireUser();
  const supabase = createClient();
  const isStaff = user.profile?.role === 'admin' || user.profile?.role === 'lawyer';

  const { data: docs } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
  const documents = (docs ?? []) as CaseDocument[];

  // Map case ids to titles for grouping context.
  const caseIds = [...new Set(documents.map((d) => d.case_id))];
  const { data: cases } = caseIds.length
    ? await supabase.from('cases').select('*').in('id', caseIds)
    : { data: [] };
  const caseMap = new Map((cases as Case[] | null ?? []).map((c) => [c.id, c]));

  return (
    <>
      <PageHeader title="Documents" description="Every file across your matters, stored securely." />
      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No documents yet. Upload files from within a case.</p>
            <Link href="/cases" className="text-sm text-gold hover:underline">Go to cases</Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-2 p-6">
            {documents.map((d) => (
              <div key={d.id}>
                <Link href={`/cases/${d.case_id}`} className="text-xs text-muted-foreground hover:text-foreground">
                  {caseMap.get(d.case_id)?.title ?? 'Case'}
                </Link>
                <DocumentRow doc={d} canDelete={d.uploaded_by === user.id || isStaff} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
