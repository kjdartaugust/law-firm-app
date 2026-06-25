import Link from 'next/link';
import { Scale } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between container-px">
        <Link href="/" className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-gold" />
          <span className="font-serif text-lg font-semibold tracking-tight">Sterling &amp; Crane</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/#practice-areas" className="hover:text-foreground">Practice Areas</Link>
          <Link href="/attorneys" className="hover:text-foreground">Attorneys</Link>
          <Link href="/#approach" className="hover:text-foreground">Our Approach</Link>
          <Link href="/book" className="hover:text-foreground">Book Consultation</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard">
              <Button size="sm">Client Portal</Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" variant="gold">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
