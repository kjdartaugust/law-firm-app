import Link from 'next/link';
import { Scale } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-gold" />
          <span className="font-serif text-lg font-semibold">Sterling &amp; Crane</span>
        </Link>
        <div>
          <h2 className="font-serif text-3xl font-bold leading-snug">
            Your matter, secured end to end.
          </h2>
          <p className="mt-4 max-w-sm text-primary-foreground/70">
            Access case files, documents, invoices and direct messaging with your attorney —
            all protected by row-level security.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Sterling &amp; Crane LLP
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center p-6">
        <div className="absolute right-6 top-6"><ThemeToggle /></div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
