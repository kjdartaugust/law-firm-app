# Sterling & Crane — Law Firm Client Portal

A sophisticated full-stack law firm web application built with **Next.js 14 (App Router)**,
**Supabase** (Postgres, Auth, Storage) and **Tailwind CSS**.

## Features

- 🔐 **Secure client portal** — email/password auth with session-cookie middleware
- 📁 **Case management** — open / pending / closed matters with references
- 📄 **Document vault** — uploads to private Supabase Storage with signed-URL downloads
- 📅 **Appointment booking** — request, confirm and complete consultations
- 🧾 **Billing & invoices** — outstanding balances, payment tracking
- 👩‍⚖️ **Lawyer profiles & practice areas** — public attorney directory
- 💬 **Secure messaging** — per-case conversations between client and attorney
- 🛡️ **Admin dashboard** — firm oversight, role management, invoice creation
- 🌗 **Premium UI** — professional legal theme with dark / light mode
- 🔒 **Row Level Security** — privacy enforced in Postgres, not just the app

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
```

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` (tables, RLS policies, Storage bucket, signup trigger).
3. Optionally run `supabase/seed.sql` to add practice areas.
4. Copy your project URL + anon key (and the service-role key) into `.env.local`.

### Run

```bash
npm run dev      # http://localhost:3000
```

The first account you create is a `client`. To make yourself an `admin`, update your row in
the `profiles` table (`role = 'admin'`); thereafter you can manage roles from the admin dashboard.

## Architecture

See [CLAUDE.md](./CLAUDE.md) for a detailed architecture overview. In short: Server Components
read data through a cookie-bound Supabase client (RLS-enforced); mutations are `'use server'`
Server Actions in `lib/actions/`; access control is layered across middleware, `lib/auth.ts`
helpers and — authoritatively — Postgres RLS policies.

## Deploy to Vercel

1. Push to a Git repository and import it into Vercel.
2. Add the same environment variables from `.env.example` in the Vercel project settings
   (set `NEXT_PUBLIC_SITE_URL` to your production URL).
3. Add `https://your-app.vercel.app/auth/callback` to Supabase → Authentication → URL Configuration.

Deploy. That's it.
