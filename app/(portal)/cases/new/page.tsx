import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { NewCaseForm } from './new-case-form';
import type { PracticeArea, Profile } from '@/lib/types';

export const metadata = { title: 'Open a case' };

export default async function NewCasePage() {
  const supabase = await createClient();
  const [{ data: areas }, { data: lawyers }] = await Promise.all([
    supabase.from('practice_areas').select('*').order('name'),
    supabase.from('profiles').select('*').eq('role', 'lawyer').order('full_name'),
  ]);

  return (
    <>
      <PageHeader title="Open a case" description="Tell us about your matter and we'll get started." />
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <NewCaseForm
            areas={(areas ?? []) as PracticeArea[]}
            lawyers={(lawyers ?? []) as Profile[]}
          />
        </CardContent>
      </Card>
    </>
  );
}
