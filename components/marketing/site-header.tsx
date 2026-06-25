import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';
import { FloatingNav } from '@/components/marketing/floating-nav';

const links = [
  { href: '/#practice', label: 'Practice' },
  { href: '/attorneys', label: 'Attorneys' },
  { href: '/#approach', label: 'Approach' },
  { href: '/book', label: 'Consultation' },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <FloatingNav
      links={links}
      cta={
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard">
              <Button size="sm" variant="gold">Client Portal</Button>
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
      }
    />
  );
}
