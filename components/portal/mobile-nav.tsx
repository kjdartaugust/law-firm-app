'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Settings, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNav, adminNavItem } from '@/components/portal/nav-items';
import type { UserRole } from '@/lib/types';

export function MobileNav({ role }: { role: UserRole }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const nav = getNav(role);

  // Close the drawer whenever the route changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const link = (href: string, label: string, Icon: typeof Settings) => {
    const active = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
          active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[80%] flex-col border-r border-border bg-card shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Link href="/" className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-gold" />
                <span className="font-serif text-base font-semibold">Sterling &amp; Crane</span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {nav.map((item) => link(item.href, item.label, item.icon))}
              {role === 'admin' && (
                <>
                  <div className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Administration
                  </div>
                  {link(adminNavItem.href, adminNavItem.label, adminNavItem.icon)}
                </>
              )}
            </nav>
            <div className="border-t border-border p-4">{link('/settings', 'Settings', Settings)}</div>
          </div>
        </div>
      )}
    </>
  );
}
