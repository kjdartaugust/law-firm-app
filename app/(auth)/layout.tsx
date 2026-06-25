import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <Image
          src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1400&q=80"
          alt="Lexara Legal"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-charcoal-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,168,76,0.22),transparent_55%)]" />

        <div className="relative">
          <Logo tone="light" showTagline />
        </div>
        <div className="relative">
          <h2 className="font-serif text-4xl font-bold leading-tight">
            Your matter, <span className="gold-text">secured end to end.</span>
          </h2>
          <p className="mt-5 max-w-sm text-white/70">
            Access case files, documents, invoices and direct messaging with your counsel —
            protected by bank-grade, row-level security.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-luxe text-white/70 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-gold" /> Privileged &amp; Confidential
          </div>
        </div>
        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} Lexara Legal LLP
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center bg-background p-6">
        <div className="absolute right-6 top-6"><ThemeToggle /></div>
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          {children}
        </div>
      </div>
    </div>
  );
}
