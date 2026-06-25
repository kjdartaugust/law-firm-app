# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Sterling & Crane — a full-stack law firm client portal built with **Next.js 16 (App Router, React 19)**, **Supabase** (Postgres + Auth + Storage), and **Tailwind CSS**.

> Next 16 note: `cookies()`/`headers()`, route `params`, and `searchParams` are async — always `await` them. The server Supabase `createClient()` is async (`await createClient()`). Forms use React 19 `useActionState` (not `useFormState`). Linting is ESLint 9 flat config (`eslint.config.mjs`); the lint script is `eslint .`, not `next lint`. Features: client portal, case management, document vault, appointment booking, billing/invoices, secure per-case messaging, lawyer directory, and an admin dashboard. Privacy is enforced primarily in the database via Row Level Security.

## Commands

```bash
npm run dev      # local dev server (http://localhost:3000)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # Next.js / ESLint
```

There is no test suite. If npm hits a corporate TLS/cert error, prefix with `NODE_OPTIONS=--use-system-ca`.

## Environment & database setup

1. Copy `.env.example` → `.env.local` and fill in Supabase keys. `SUPABASE_SERVICE_ROLE_KEY` is server-only — never import it into client code.
2. In the Supabase SQL editor run `supabase/schema.sql` (tables, enums, RLS policies, the `case-documents` Storage bucket, and the `handle_new_user` trigger that auto-creates a `profiles` row on signup), then optionally `supabase/seed.sql` (practice areas).

## Architecture

**Auth & access control is layered:**
- `middleware.ts` → `lib/supabase/middleware.ts` refreshes the session cookie on every request and redirects unauthenticated users away from protected route prefixes (`/dashboard`, `/cases`, `/documents`, `/appointments`, `/billing`, `/messages`, `/admin`, `/settings`).
- `lib/auth.ts` provides `getCurrentUser`, `requireUser`, `requireStaff`, `requireAdmin` for use inside Server Components — these gate the UI.
- **The real security boundary is Postgres RLS** (in `schema.sql`), not the app code. Every table policy keys off `auth.uid()` and the `is_admin()` / `is_staff()` SECURITY DEFINER helpers. Documents/messages inherit access from their parent case. Never rely on app-layer checks alone — add/adjust the matching RLS policy when adding a table or column.

**Supabase clients (`lib/supabase/`):** `client.ts` = browser (anon key), `server.ts` = `createClient()` (cookie-bound, RLS-enforced) and `createAdminClient()` (service role, bypasses RLS — use sparingly). Always pick the cookie-bound `createClient` for user-scoped reads/writes.

**Data flow:** mutations live in `lib/actions/*.ts` as `'use server'` Server Actions (cases, appointments, documents, invoices, messages, profile, auth). They write via the cookie-bound client (so RLS applies), then `revalidatePath`. Reads happen directly in Server Components. Client components are thin and use `useFormState`/`useFormStatus` against these actions.

**Roles** (`user_role` enum): `client`, `lawyer`, `admin`. Role lives on `profiles.role`. The sidebar, admin routes, and several actions branch on it; `client` is the default assigned by the signup trigger.

**Money** is stored as integer cents (`amount_cents`); format with `formatCurrency` in `lib/utils.ts`. **Documents** store only metadata in the `documents` table — the file lives in the private `case-documents` Storage bucket under `{case_id}/{timestamp}-{filename}`, and downloads use short-lived signed URLs from `getDocumentUrl`.

**Routing** uses App Router route groups: `app/(marketing)` (public site + attorney directory + booking), `app/(auth)` (login/signup, shared split-screen layout), `app/(portal)` (authenticated app; layout renders `Sidebar` + `Topbar` and calls `requireUser`). `app/auth/callback/route.ts` exchanges the email-confirmation code for a session.

**Theming:** `next-themes` with `class` dark mode; colors are HSL CSS variables in `app/globals.css` consumed through the Tailwind config. UI primitives are hand-rolled in `components/ui/`. Path alias `@/*` maps to the project root.
