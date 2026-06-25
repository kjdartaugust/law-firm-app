import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Lexara monogram — a gold serif "L" inside a thin gold ring. */
export function LexaraMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border border-gold/60 bg-gold-sheen/10 font-serif font-bold text-gold',
        className
      )}
      aria-hidden
    >
      L
    </span>
  );
}

export function Logo({
  href = '/',
  className,
  tone = 'default',
  showTagline = false,
}: {
  href?: string;
  className?: string;
  tone?: 'default' | 'light';
  showTagline?: boolean;
}) {
  return (
    <Link href={href} className={cn('group inline-flex items-center gap-3', className)}>
      <LexaraMark className="h-9 w-9 text-lg transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-serif text-lg font-bold tracking-wide',
            tone === 'light' ? 'text-white' : 'text-foreground'
          )}
        >
          Lexara<span className="text-gold"> Legal</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              'mt-1 text-[10px] uppercase tracking-luxe',
              tone === 'light' ? 'text-white/60' : 'text-muted-foreground'
            )}
          >
            Distinguished Counsel
          </span>
        )}
      </span>
    </Link>
  );
}
