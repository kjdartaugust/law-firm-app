import Link from 'next/link';
import { Scale } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 py-12 container-px md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-gold" />
            <span className="font-serif text-base font-semibold">Sterling &amp; Crane</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Trusted counsel for individuals and enterprises since 1998.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Firm</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/attorneys" className="hover:text-foreground">Attorneys</Link></li>
            <li><Link href="/#practice-areas" className="hover:text-foreground">Practice Areas</Link></li>
            <li><Link href="/#approach" className="hover:text-foreground">Our Approach</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Clients</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/login" className="hover:text-foreground">Client Portal</Link></li>
            <li><Link href="/book" className="hover:text-foreground">Book a Consultation</Link></li>
            <li><Link href="/signup" className="hover:text-foreground">Open an Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1 Liberty Plaza, Suite 4100</li>
            <li>New York, NY 10006</li>
            <li>(212) 555-0182</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sterling &amp; Crane LLP. All rights reserved. Attorney advertising.
      </div>
    </footer>
  );
}
