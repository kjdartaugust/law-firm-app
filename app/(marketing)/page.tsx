import Link from 'next/link';
import {
  Scale, ShieldCheck, FileText, CalendarClock, MessagesSquare, Receipt,
  Building2, Heart, Home, Lightbulb, Briefcase, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const practiceAreas = [
  { icon: Building2, name: 'Corporate Law', desc: 'M&A, governance and commercial contracts.' },
  { icon: Heart, name: 'Family Law', desc: 'Divorce, custody, adoption and estates.' },
  { icon: Scale, name: 'Criminal Defense', desc: 'Trial defense, appeals and representation.' },
  { icon: Home, name: 'Real Estate', desc: 'Transactions, leasing, zoning and disputes.' },
  { icon: Lightbulb, name: 'Intellectual Property', desc: 'Patents, trademarks and licensing.' },
  { icon: Briefcase, name: 'Employment Law', desc: 'Workplace disputes and compliance.' },
];

const features = [
  { icon: ShieldCheck, title: 'Secure Client Portal', desc: 'Bank-grade access controls protect every case file.' },
  { icon: FileText, title: 'Document Vault', desc: 'Upload, store and share documents with row-level privacy.' },
  { icon: CalendarClock, title: 'Easy Scheduling', desc: 'Book consultations and track every appointment.' },
  { icon: MessagesSquare, title: 'Secure Messaging', desc: 'Talk directly with your attorney, on the record.' },
  { icon: Receipt, title: 'Transparent Billing', desc: 'View invoices and payment history any time.' },
  { icon: Scale, title: 'Case Tracking', desc: 'Follow your matter from open to resolution.' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 py-20 container-px md:grid-cols-2 md:py-28">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs font-medium text-gold">
              <Scale className="h-3.5 w-3.5" /> Attorneys at Law · Est. 1998
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-balance md:text-5xl">
              Distinguished legal counsel, delivered with modern clarity.
            </h1>
            <p className="mt-5 max-w-md text-base text-primary-foreground/70">
              Sterling &amp; Crane pairs decades of courtroom experience with a secure digital
              portal — so you always know where your case stands.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book"><Button variant="gold" size="lg">Book a Consultation</Button></Link>
              <Link href="/attorneys">
                <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Meet Our Attorneys
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm">
              <div><div className="font-serif text-2xl font-bold text-gold">25+</div><div className="text-primary-foreground/60">Years of practice</div></div>
              <div><div className="font-serif text-2xl font-bold text-gold">1,200+</div><div className="text-primary-foreground/60">Cases resolved</div></div>
              <div><div className="font-serif text-2xl font-bold text-gold">98%</div><div className="text-primary-foreground/60">Client retention</div></div>
            </div>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <div className="relative h-80 w-full max-w-sm rounded-2xl border border-gold/20 bg-gradient-to-br from-primary-foreground/10 to-transparent p-8 shadow-2xl">
              <Scale className="h-16 w-16 text-gold" />
              <p className="mt-6 font-serif text-xl leading-relaxed">
                &ldquo;The duty of a lawyer is to advance the client&rsquo;s cause with diligence,
                discretion and unwavering integrity.&rdquo;
              </p>
              <p className="mt-4 text-sm text-primary-foreground/60">— Firm Charter, 1998</p>
            </div>
          </div>
        </div>
      </section>

      {/* Practice areas */}
      <section id="practice-areas" className="mx-auto max-w-7xl py-20 container-px">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold">Practice Areas</h2>
          <p className="mt-3 text-muted-foreground">Comprehensive representation across the matters that affect your life and business.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((a) => (
            <Card key={a.name} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-gold">
                  <a.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold">{a.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Portal features */}
      <section id="approach" className="border-y border-border bg-secondary/50">
        <div className="mx-auto max-w-7xl py-20 container-px">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold">A portal built for peace of mind</h2>
            <p className="mt-3 text-muted-foreground">Every client receives secure, 24/7 access to their matter.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-card p-6">
                <f.icon className="h-6 w-6 text-gold" />
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl py-20 text-center container-px">
        <h2 className="font-serif text-3xl font-bold">Ready to discuss your matter?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Schedule a confidential consultation today. Our team will review your situation and outline your options.
        </p>
        <Link href="/book" className="mt-8 inline-block">
          <Button variant="gold" size="lg">
            Book a Consultation <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </>
  );
}
