'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, FileText, CalendarClock,
  Receipt, MessagesSquare, Users, Settings, Scale, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';

const baseNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cases', label: 'Cases', icon: Briefcase },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/appointments', label: 'Appointments', icon: CalendarClock },
  { href: '/billing', label: 'Billing', icon: Receipt },
  { href: '/messages', label: 'Messages', icon: MessagesSquare },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const nav = [...baseNav];
  if (role === 'lawyer' || role === 'admin') {
    nav.push({ href: '/attorneys', label: 'Directory', icon: Users });
  }

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
              href="/admin"
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith('/admin') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Dashboard
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
