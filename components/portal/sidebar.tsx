'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand';
import { getNav, adminNavItem } from '@/components/portal/nav-items';
import type { UserRole } from '@/lib/types';

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const nav = getNav(role);

  const linkClass = (active: boolean) =>
    cn(
      'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300',
      active
        ? 'bg-gold-sheen/15 text-foreground shadow-sm ring-1 ring-gold/30'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    );

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={linkClass(active)}>
              <item.icon className={cn('h-4 w-4', active && 'text-gold')} />
              {item.label}
            </Link>
          );
        })}

        {role === 'admin' && (
          <>
            <div className="px-3 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-luxe text-muted-foreground">
              Administration
            </div>
            <Link href={adminNavItem.href} className={linkClass(pathname.startsWith('/admin'))}>
              <adminNavItem.icon className={cn('h-4 w-4', pathname.startsWith('/admin') && 'text-gold')} />
              {adminNavItem.label}
            </Link>
          </>
        )}
      </nav>
      <div className="border-t border-border p-4">
        <Link href="/settings" className={linkClass(pathname.startsWith('/settings'))}>
          <Settings className={cn('h-4 w-4', pathname.startsWith('/settings') && 'text-gold')} /> Settings
        </Link>
      </div>
    </aside>
  );
}
