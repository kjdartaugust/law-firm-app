/**
 * Seed Lexara Legal with demo data: practice areas, loginable lawyer accounts,
 * a demo client, and a populated portal (matters, invoices, appointments, messages).
 *
 * Usage:
 *   1) Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 *   2) npm run seed
 *
 * Safe to re-run — existing users are reused and rows are upserted.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// --- Load .env.local (no extra deps) ---------------------------------------
try {
  const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {
  // fall back to ambient env
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key || url.includes('your-project')) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const PASSWORD = 'Lexara2026!';
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&h=400&q=80`;

const PRACTICE_AREAS = [
  ['Corporate & M&A', 'corporate', 'Mergers, acquisitions, governance and commercial contracts.', 'Building2'],
  ['Private Client', 'private-client', 'Estates, family matters and generational wealth.', 'Heart'],
  ['Litigation', 'litigation', 'Trial advocacy, appeals and dispute resolution.', 'Scale'],
  ['Real Estate', 'real-estate', 'Acquisitions, development, leasing and zoning.', 'Home'],
  ['Intellectual Property', 'ip', 'Patents, trademarks, licensing and protection.', 'Lightbulb'],
  ['Employment', 'employment', 'Executive contracts, compliance and disputes.', 'Briefcase'],
];

const LAWYERS = [
  { email: 'adrian.holloway@lexara.legal', full_name: 'Adrian Holloway', title: 'Managing Partner',
    years_experience: 24, practice_areas: ['Corporate & M&A', 'Litigation'], avatar: img('photo-1560250097-0b93528c311a'),
    bio: 'Adrian leads the firm and its corporate practice, advising boards and founders through landmark transactions with calm, decisive judgment.' },
  { email: 'vivian.reyes@lexara.legal', full_name: 'Vivian Reyes', title: 'Partner, Litigation',
    years_experience: 19, practice_areas: ['Litigation', 'Employment'], avatar: img('photo-1573496359142-b8d87734a5a2'),
    bio: 'A formidable trial advocate, Vivian has secured defining verdicts for clients in high-stakes commercial and employment disputes.' },
  { email: 'marcus.bennett@lexara.legal', full_name: 'Marcus Bennett', title: 'Partner, Real Estate',
    years_experience: 16, practice_areas: ['Real Estate', 'Corporate & M&A'], avatar: img('photo-1472099645785-5658abf4ff4e'),
    bio: 'Marcus structures complex acquisitions and developments, bringing precision and pragmatism to every closing.' },
  { email: 'priya.anand@lexara.legal', full_name: 'Priya Anand', title: 'Senior Counsel, IP',
    years_experience: 14, practice_areas: ['Intellectual Property'], avatar: img('photo-1580489944761-15a19d654956'),
    bio: 'Priya protects the ideas that define her clients — from patent portfolios to global trademark strategy.' },
  { email: 'eleanor.whitmore@lexara.legal', full_name: 'Eleanor Whitmore', title: 'Partner, Private Client',
    years_experience: 21, practice_areas: ['Private Client', 'Real Estate'], avatar: img('photo-1551836022-deb4988cc6c0'),
    bio: 'Eleanor counsels families and individuals on estates and succession with discretion and genuine care.' },
];

const CLIENT = { email: 'client@lexara.legal', full_name: 'Jonathan Pierce' };

async function findUserByEmail(email) {
  let page = 1;
  for (;;) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 1000) return null;
    page += 1;
  }
}

async function ensureUser(email, full_name, role) {
  const existing = await findUserByEmail(email);
  if (existing) return existing.id;
  const { data, error } = await db.auth.admin.createUser({
    email, password: PASSWORD, email_confirm: true, user_metadata: { full_name, role },
  });
  if (error) throw error;
  return data.user.id;
}

const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString();
const daysAhead = (n) => new Date(Date.now() + n * 864e5).toISOString();

async function main() {
  console.log('→ Seeding practice areas…');
  for (const [name, slug, description, icon] of PRACTICE_AREAS) {
    await db.from('practice_areas').upsert({ name, slug, description, icon }, { onConflict: 'slug' });
  }

  console.log('→ Seeding lawyers…');
  const lawyerIds = {};
  for (const l of LAWYERS) {
    const id = await ensureUser(l.email, l.full_name, 'lawyer');
    lawyerIds[l.email] = id;
    await db.from('profiles').update({
      role: 'lawyer', full_name: l.full_name, email: l.email, title: l.title,
      bio: l.bio, practice_areas: l.practice_areas, years_experience: l.years_experience, avatar_url: l.avatar,
    }).eq('id', id);
    console.log(`   ✓ ${l.full_name}`);
  }

  console.log('→ Seeding demo client + portal data…');
  const clientId = await ensureUser(CLIENT.email, CLIENT.full_name, 'client');
  await db.from('profiles').update({ full_name: CLIENT.full_name, email: CLIENT.email, phone: '(212) 555-0148' }).eq('id', clientId);

  const adrian = lawyerIds['adrian.holloway@lexara.legal'];
  const vivian = lawyerIds['vivian.reyes@lexara.legal'];

  // Fresh matters for the demo client (clear prior demo rows first for idempotency).
  await db.from('cases').delete().eq('client_id', clientId);
  const caseSpecs = [
    { title: 'Pierce Holdings — Series B Financing', description: 'Lead counsel on a $40M Series B raise, including term sheet negotiation and closing.', status: 'open', practice_area: 'Corporate & M&A', lawyer_id: adrian, opened_at: daysAgo(28) },
    { title: 'Commercial Lease Dispute — 5th Ave', description: 'Representation in a landlord dispute over a flagship retail lease.', status: 'pending', practice_area: 'Litigation', lawyer_id: vivian, opened_at: daysAgo(74) },
    { title: 'Estate Plan & Trust Formation', description: 'Establishment of a family trust and updated estate plan.', status: 'closed', practice_area: 'Private Client', lawyer_id: adrian, opened_at: daysAgo(210), closed_at: daysAgo(45) },
  ];
  const cases = [];
  for (const spec of caseSpecs) {
    const { data } = await db.from('cases').insert({ ...spec, client_id: clientId }).select().single();
    cases.push(data);
  }

  // Invoices across recent months (drives the billing charts).
  await db.from('invoices').delete().eq('client_id', clientId);
  const invoiceSpecs = [
    { amount_cents: 1250000, status: 'paid', description: 'Series B — legal services (retainer)', issued_at: daysAgo(120), paid_at: daysAgo(110), case_id: cases[0].id },
    { amount_cents: 480000, status: 'paid', description: 'Litigation — discovery phase', issued_at: daysAgo(75), paid_at: daysAgo(60), case_id: cases[1].id },
    { amount_cents: 320000, status: 'sent', description: 'Litigation — motion practice', issued_at: daysAgo(20), due_at: daysAhead(10), case_id: cases[1].id },
    { amount_cents: 150000, status: 'overdue', description: 'Estate plan — final filings', issued_at: daysAgo(50), due_at: daysAgo(5), case_id: cases[2].id },
  ];
  for (const inv of invoiceSpecs) {
    await db.from('invoices').insert({ ...inv, client_id: clientId, currency: 'USD' });
  }

  // Appointments.
  await db.from('appointments').delete().eq('client_id', clientId);
  await db.from('appointments').insert([
    { client_id: clientId, lawyer_id: adrian, case_id: cases[0].id, subject: 'Series B closing review', scheduled_at: daysAhead(3), duration_minutes: 60, status: 'confirmed' },
    { client_id: clientId, lawyer_id: vivian, case_id: cases[1].id, subject: 'Litigation strategy session', scheduled_at: daysAhead(9), duration_minutes: 90, status: 'requested' },
    { client_id: clientId, lawyer_id: adrian, case_id: cases[2].id, subject: 'Estate plan signing', scheduled_at: daysAgo(48), duration_minutes: 30, status: 'completed' },
  ]);

  // A short message thread on the active matter.
  await db.from('messages').delete().eq('case_id', cases[0].id);
  await db.from('messages').insert([
    { case_id: cases[0].id, sender_id: clientId, body: 'Hi Adrian — are we still on track to close by month end?', created_at: daysAgo(2) },
    { case_id: cases[0].id, sender_id: adrian, body: 'We are. The revised term sheet looks strong; I will circulate the signature pages tomorrow.', created_at: daysAgo(1) },
  ]);

  console.log('\n✓ Seed complete.\n');
  console.log('  Lawyer logins (password for all):', PASSWORD);
  LAWYERS.forEach((l) => console.log(`   • ${l.email}`));
  console.log(`  Demo client login: ${CLIENT.email} / ${PASSWORD}`);
  console.log('\n  Tip: to explore the admin dashboard, set one profile\'s role to \'admin\' in Supabase.');
}

main().catch((e) => {
  console.error('✗ Seed failed:', e.message ?? e);
  process.exit(1);
});
