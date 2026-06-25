import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessagesSquare, CalendarPlus, User2, Scale } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentUpload } from '@/components/portal/document-upload';
import { DocumentRow } from '@/components/portal/document-row';
import { CaseStatusControl } from '@/components/portal/case-status-control';
import { CaseTimeline } from '@/components/portal/case-timeline';
import { formatDate, initials } from '@/lib/utils';
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
  const lawyerP = lawyer as Profile | null;
  const clientP = client as Profile | null;

  return (
    <>
      <Link href="/cases" className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Back to matters
      </Link>

      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-charcoal-950 p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.18),transparent_55%)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Badge status={c.status} />
              <span className="text-xs uppercase tracking-luxe text-white/50">{c.reference}</span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold">{c.title}</h1>
            <p className="mt-2 text-sm text-white/60">
              {c.practice_area ? `${c.practice_area} · ` : ''}opened {formatDate(c.opened_at)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/messages/${c.id}`}><Button variant="light" size="sm"><MessagesSquare className="h-4 w-4" /> Messages</Button></Link>
            <Link href={`/appointments?case=${c.id}`}><Button variant="light" size="sm"><CalendarPlus className="h-4 w-4" /> Book</Button></Link>
            {isStaff && <CaseStatusControl caseId={c.id} status={c.status} />}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Matter details</CardTitle></CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {c.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Glass document vault */}
          <Card>
            <CardHeader><CardTitle>Document vault</CardTitle></CardHeader>
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
            <CardHeader><CardTitle>Status tracker</CardTitle></CardHeader>
            <CardContent>
              <CaseTimeline status={c.status} openedAt={c.opened_at} closedAt={c.closed_at} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Parties</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Party icon={User2} role="Client" name={clientP?.full_name ?? '—'} sub={clientP?.email} />
              <Party icon={Scale} role="Counsel" name={lawyerP?.full_name ?? 'Not yet assigned'} sub={lawyerP?.title ?? undefined} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Party({ icon: Icon, role, name, sub }: { icon: typeof User2; role: string; name: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-sheen/15 font-serif text-sm font-bold text-gold">
        {name && name !== '—' && name !== 'Not yet assigned' ? initials(name) : <Icon className="h-4 w-4" />}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-luxe text-muted-foreground">{role}</p>
        <p className="text-sm font-medium">{name}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}
