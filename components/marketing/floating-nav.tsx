'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/brand';
import { cn } from '@/lib/utils';

export function FloatingNav({
  links,
  cta,
}: {
  links: { href: string; label: string }[];
  cta: ReactNode;
}) {
  const pathname = usePathname();
  const overHero = pathname === '/'; // only the homepage has a dark full-bleed hero
  const [scrolledPast, setScrolledPast] = useState(false);
  const [open, setOpen] = useState(false);
  const scrolled = scrolledPast || !overHero; // solid styling everywhere except the top of home

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          'flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500',
          scrolled
            ? 'border border-border/60 bg-background/80 shadow-luxe backdrop-blur-xl'
            : 'border border-transparent bg-transparent'
        )}
      >
        <Logo tone={scrolled ? 'default' : 'light'} />

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium tracking-wide transition-colors',
                scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">{cta}</div>

        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden',
            scrolled ? 'text-foreground' : 'text-white'
          )}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-4 right-4 top-20 rounded-2xl border border-border bg-background/95 p-4 shadow-luxe backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 border-t border-border pt-3">{cta}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
