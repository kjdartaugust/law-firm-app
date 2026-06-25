import Link from 'next/link';
import { Logo } from '@/components/brand';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-charcoal-950 text-white/70">
      <div className="mx-auto max-w-7xl px-5 py-16 container-px">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo tone="light" showTagline />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Private counsel for individuals and enterprises who expect discretion,
              precision and an outcome — delivered with the calm of a trusted advisor.
            </p>
          </div>
          <FooterCol title="Firm" links={[['Attorneys', '/attorneys'], ['Practice Areas', '/#practice'], ['Our Approach', '/#approach']]} />
          <FooterCol title="Clients" links={[['Client Portal', '/login'], ['Book a Consultation', '/book'], ['Open an Account', '/signup']]} />
          <FooterCol title="Contact" links={[['1 Liberty Plaza, NY', '#'], ['(212) 555-0182', '#'], ['hello@lexara.legal', '#']]} />
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Lexara Legal LLP. All rights reserved. Attorney advertising.</p>
          <p className="tracking-luxe">PRIVILEGED &amp; CONFIDENTIAL</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="eyebrow mb-4">{title}</h4>
      <ul className="space-y-3 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-white/60 transition-colors hover:text-gold">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
