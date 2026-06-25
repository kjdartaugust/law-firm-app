'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNav, adminNavItem } from '@/components/portal/nav-items';
import type { UserRole } from '@/lib/types';

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const nav = getNav(role);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <Link href="/" className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Scale className="h-6 w-6 text-gold" />
        <span className="font-serif text-base font-semibold">Sterling &amp; Crane</span>
      </Link>
      <nav className="flex-1 space-y-1 p-4">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {role === 'admin' && (
          <>
            <div className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Administration
            </div>
            <Link
              href={adminNavItem.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith('/admin') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <adminNavItem.icon className="h-4 w-4" />
              {adminNavItem.label}
            </Link>
          </>
        )}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Settings className="h-4 w-4" /> Settings
        </Link>
      </div>
    </aside>
  );
}
