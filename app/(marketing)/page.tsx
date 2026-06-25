import Link from 'next/link';
import {
  Scale, ShieldCheck, FileText, CalendarClock, MessagesSquare, Receipt,
  Building2, Heart, Home, Lightbulb, Briefcase, ArrowRight, Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParallaxHero } from '@/components/motion/parallax-hero';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2400&q=80';

const practiceAreas = [
  { icon: Building2, name: 'Corporate & M&A', desc: 'Transactions, governance and complex commercial counsel.' },
  { icon: Heart, name: 'Private Client', desc: 'Estates, family matters and generational wealth.' },
  { icon: Scale, name: 'Litigation', desc: 'Trial advocacy, appeals and dispute resolution.' },
  { icon: Home, name: 'Real Estate', desc: 'Acquisitions, development, leasing and zoning.' },
  { icon: Lightbulb, name: 'Intellectual Property', desc: 'Patents, trademarks, licensing and protection.' },
  { icon: Briefcase, name: 'Employment', desc: 'Executive contracts, compliance and disputes.' },
];

const features = [
  { icon: ShieldCheck, title: 'Confidential by design', desc: 'Row-level security guards every file, message and record.' },
  { icon: FileText, title: 'Document vault', desc: 'Encrypted storage with signed, time-limited access.' },
  { icon: CalendarClock, title: 'Effortless scheduling', desc: 'Reserve consultations and track every engagement.' },
  { icon: MessagesSquare, title: 'Private messaging', desc: 'Speak directly with your counsel, on the record.' },
  { icon: Receipt, title: 'Transparent billing', desc: 'Clear invoices and real-time payment history.' },
  { icon: Scale, title: 'Matter tracking', desc: 'Follow your case from intake to resolution.' },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <ParallaxHero image={HERO_IMAGE}>
        <div className="mx-auto w-full max-w-6xl container-px">
          <div className="max-w-2xl">
            <Reveal direction="up">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-luxe text-gold backdrop-blur">
                <Scale className="h-3.5 w-3.5" /> Distinguished Counsel · Est. 1998
              </span>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h1 className="mt-7 font-serif text-5xl font-bold leading-[1.05] text-white text-balance md:text-7xl">
                Law, practiced as a <span className="gold-text">private art.</span>
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
                Lexara Legal pairs decades of courtroom mastery with a portal that feels less
                like a law firm and more like private banking — so you always know exactly
                where your matter stands.
              </p>
            </Reveal>
            <Reveal direction="up" delay={0.32}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/book"><Button variant="gold" size="lg">Request a Consultation</Button></Link>
                <Link href="/attorneys"><Button variant="light" size="lg">Meet the Counsel <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
            </Reveal>
          </div>
        </div>
      </ParallaxHero>

      {/* ------------------------------------------------------------- Stats bar */}
      <section className="border-b border-border bg-charcoal-950 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-10 container-px md:grid-cols-4">
          {[
            ['27+', 'Years of practice'],
            ['1,800+', 'Matters resolved'],
            ['$4.2B', 'Transactions advised'],
            ['98%', 'Client retention'],
          ].map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.08} className="text-center">
              <div className="font-serif text-3xl font-bold text-gold md:text-4xl">{n}</div>
              <div className="mt-1 text-xs uppercase tracking-luxe text-white/50">{l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Practice areas */}
      <section id="practice" className="mx-auto max-w-7xl px-5 py-24 container-px md:py-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Practice Areas</p>
          <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">Counsel across every consequence</h2>
          <p className="mt-4 text-muted-foreground">
            From the boardroom to the courtroom, our partners advise on the matters that
            define your business and your legacy.
          </p>
          <div className="mx-auto mt-6 hairline" />
        </Reveal>

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((a) => (
            <StaggerItem key={a.name}>
              <div className="group h-full rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-luxe">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-sheen/15 text-gold transition-colors group-hover:bg-gold-sheen group-hover:text-charcoal-950">
                  <a.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-serif text-xl font-semibold">{a.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* -------------------------------------------------------------- Approach */}
      <section id="approach" className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 container-px md:grid-cols-2 md:py-32">
          <Reveal direction="right">
            <p className="eyebrow">The Lexara Standard</p>
            <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
              A portal built for peace of mind
            </h2>
            <p className="mt-5 text-muted-foreground">
              Every client receives secure, around-the-clock access to their matter —
              documents, invoices, appointments and direct counsel, all in one calm,
              considered place.
            </p>
            <div className="mt-8">
              <Link href="/signup"><Button variant="gold" size="lg">Open Your Portal</Button></Link>
            </div>
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <f.icon className="h-6 w-6 text-gold" />
                  <h3 className="mt-4 font-serif text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ------------------------------------------------------------ Testimonial */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center container-px md:py-32">
        <Reveal>
          <Quote className="mx-auto h-10 w-10 text-gold" />
          <p className="mt-8 font-serif text-2xl font-medium leading-relaxed md:text-3xl">
            “Lexara handled our acquisition with a discretion and precision I had only
            ever read about. It felt less like retaining a firm and more like gaining a
            trusted member of the board.”
          </p>
          <div className="mt-8">
            <p className="font-semibold">Eleanor V. Whitmore</p>
            <p className="text-sm text-muted-foreground">Chief Executive, Meridian Holdings</p>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------------------- CTA */}
      <section className="relative overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center container-px md:py-28">
          <Reveal>
            <p className="eyebrow">Begin</p>
            <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
              Discuss your matter, in confidence
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/70">
              Schedule a private consultation. We will review your situation, outline your
              options, and chart a path forward — with no obligation.
            </p>
            <Link href="/book" className="mt-9 inline-block">
              <Button variant="gold" size="lg">Request a Consultation <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
