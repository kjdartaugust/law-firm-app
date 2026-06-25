import { requireUser } from '@/lib/auth';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsForm } from './settings-form';

export const metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const user = await requireUser();
  const isLawyer = user.profile?.role === 'lawyer' || user.profile?.role === 'admin';

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and account details." />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm profile={user.profile} email={user.email} showLawyerFields={isLawyer} />
        </CardContent>
      </Card>
    </>
  );
}
