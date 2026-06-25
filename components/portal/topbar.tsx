import { signOut } from '@/lib/actions/auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileNav } from '@/components/portal/mobile-nav';
import { Badge } from '@/components/ui/badge';
import { initials } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import type { Profile } from '@/lib/types';

export function Topbar({ profile, email }: { profile: Profile | null; email?: string }) {
  const name = profile?.full_name || email || 'Account';
  const role = profile?.role ?? 'client';

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav role={role} />
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="font-serif text-base font-semibold leading-none">{name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {profile?.role && profile.role !== 'client' && (
          <Badge className="bg-gold/15 text-gold">{profile.role}</Badge>
        )}
        <ThemeToggle />
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {initials(name)}
        </div>
        <form action={signOut}>
          <button
            type="submit"
            aria-label="Sign out"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
