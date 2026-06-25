import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessagesSquare, CalendarPlus } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentUpload } from '@/components/portal/document-upload';
import { DocumentRow } from '@/components/portal/document-row';
import { CaseStatusControl } from '@/components/portal/case-status-control';
import { formatDate } from '@/lib/utils';
import type { Case, CaseDocument, Profile } from '@/lib/types';

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: caseRow } = await supabase.from('cases').select('*').eq('id', id).single();
  if (!caseRow) notFound();
  const c = caseRow as Case;

  const [{ data: docs }, { data: lawyer }, { data: client }] = await Promise.all([
    supabase.from('documents').select('*').eq('case_id', c.id).order('created_at', { ascending: false }),
    c.lawyer_id ? supabase.from('profiles').select('*').eq('id', c.lawyer_id).single() : Promise.resolve({ data: null }),
    supabase.from('profiles').select('*').eq('id', c.client_id).single(),
  ]);

  const documents = (docs ?? []) as CaseDocument[];
  const isStaff = user.profile?.role === 'admin' || user.profile?.role === 'lawyer';

  return (
    <>
      <Link href="/cases" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to cases
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold">{c.title}</h1>
            <Badge status={c.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {c.reference}
            {c.practice_area ? ` · ${c.practice_area}` : ''} · opened {formatDate(c.opened_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/messages/${c.id}`}><Button variant="outline"><MessagesSquare className="h-4 w-4" /> Messages</Button></Link>
          <Link href={`/appointments?case=${c.id}`}><Button variant="outline"><CalendarPlus className="h-4 w-4" /> Book</Button></Link>
          {isStaff && <CaseStatusControl caseId={c.id} status={c.status} />}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Matter details</CardTitle></CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {c.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <DocumentUpload caseId={c.id} />
              <div className="space-y-2">
                {documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
                ) : (
                  documents.map((d) => (
                    <DocumentRow key={d.id} doc={d} canDelete={d.uploaded_by === user.id || isStaff} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Parties</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Client</p>
                <p className="font-medium">{(client as Profile | null)?.full_name ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Attorney</p>
                <p className="font-medium">{(lawyer as Profile | null)?.full_name ?? 'Not yet assigned'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
