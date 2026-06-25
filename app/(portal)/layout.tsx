import { requireUser } from '@/lib/auth';
import { Sidebar } from '@/components/portal/sidebar';
import { Topbar } from '@/components/portal/topbar';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const role = user.profile?.role ?? 'client';

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar profile={user.profile} email={user.email} />
        <main className="flex-1 bg-secondary/30 p-6 lg:p-8">
          <div className="mx-auto max-w-6xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
