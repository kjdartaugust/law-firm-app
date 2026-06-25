-- ============================================================================
-- Law Firm App — Database schema with Row Level Security
-- Run this in the Supabase SQL editor (or via the CLI) on a fresh project.
-- ============================================================================

-- Extensions ----------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('client', 'lawyer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type case_status as enum ('open', 'pending', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type appointment_status as enum ('requested', 'confirmed', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  avatar_url text,
  role user_role not null default 'client',
  -- lawyer-specific
  title text,
  bio text,
  practice_areas text[],
  years_experience int,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- practice_areas  (firm-wide catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.practice_areas (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- cases
-- ---------------------------------------------------------------------------
create table if not exists public.cases (
  id uuid primary key default uuid_generate_v4(),
  reference text not null unique default ('CASE-' || upper(substr(uuid_generate_v4()::text, 1, 8))),
  title text not null,
  description text,
  status case_status not null default 'open',
  practice_area text,
  client_id uuid not null references public.profiles(id) on delete cascade,
  lawyer_id uuid references public.profiles(id) on delete set null,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- documents  (metadata; files live in Storage bucket 'case-documents')
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  case_id uuid not null references public.cases(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- appointments
-- ---------------------------------------------------------------------------
create table if not exists public.appointments (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  lawyer_id uuid references public.profiles(id) on delete set null,
  case_id uuid references public.cases(id) on delete set null,
  subject text not null,
  notes text,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 30,
  status appointment_status not null default 'requested',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- invoices
-- ---------------------------------------------------------------------------
create table if not exists public.invoices (
  id uuid primary key default uuid_generate_v4(),
  number text not null unique default ('INV-' || to_char(now(), 'YYYY') || '-' || upper(substr(uuid_generate_v4()::text, 1, 6))),
  case_id uuid references public.cases(id) on delete set null,
  client_id uuid not null references public.profiles(id) on delete cascade,
  amount_cents bigint not null default 0,
  currency text not null default 'USD',
  status invoice_status not null default 'draft',
  description text,
  issued_at timestamptz not null default now(),
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- messages  (secure 1:1 thread per case between client & lawyer)
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  case_id uuid not null references public.cases(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ===========================================================================
-- Helper: is the current user an admin?  (SECURITY DEFINER avoids RLS recursion)
-- ===========================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'lawyer')
  );
$$;

-- ===========================================================================
-- Trigger: create a profile row automatically on signup
-- ===========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
alter table public.profiles       enable row level security;
alter table public.practice_areas enable row level security;
alter table public.cases          enable row level security;
alter table public.documents      enable row level security;
alter table public.appointments   enable row level security;
alter table public.invoices       enable row level security;
alter table public.messages       enable row level security;

-- ---- profiles --------------------------------------------------------------
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (
    id = auth.uid()
    or role = 'lawyer'            -- lawyer profiles are public (directory)
    or public.is_staff()
  );

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (id = auth.uid() or public.is_admin());

-- ---- practice_areas (public read, admin write) -----------------------------
drop policy if exists "practice_areas_read" on public.practice_areas;
create policy "practice_areas_read" on public.practice_areas
  for select using (true);

drop policy if exists "practice_areas_write" on public.practice_areas;
create policy "practice_areas_write" on public.practice_areas
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- cases -----------------------------------------------------------------
drop policy if exists "cases_select" on public.cases;
create policy "cases_select" on public.cases
  for select using (
    client_id = auth.uid()
    or lawyer_id = auth.uid()
    or public.is_staff()
  );

drop policy if exists "cases_insert" on public.cases;
create policy "cases_insert" on public.cases
  for insert with check (client_id = auth.uid() or public.is_staff());

drop policy if exists "cases_update" on public.cases;
create policy "cases_update" on public.cases
  for update using (lawyer_id = auth.uid() or public.is_staff());

drop policy if exists "cases_delete" on public.cases;
create policy "cases_delete" on public.cases
  for delete using (public.is_admin());

-- ---- documents -------------------------------------------------------------
-- A user may see a document if they can see its parent case.
drop policy if exists "documents_select" on public.documents;
create policy "documents_select" on public.documents
  for select using (
    exists (
      select 1 from public.cases c
      where c.id = documents.case_id
        and (c.client_id = auth.uid() or c.lawyer_id = auth.uid() or public.is_staff())
    )
  );

drop policy if exists "documents_insert" on public.documents;
create policy "documents_insert" on public.documents
  for insert with check (
    uploaded_by = auth.uid()
    and exists (
      select 1 from public.cases c
      where c.id = documents.case_id
        and (c.client_id = auth.uid() or c.lawyer_id = auth.uid() or public.is_staff())
    )
  );

drop policy if exists "documents_delete" on public.documents;
create policy "documents_delete" on public.documents
  for delete using (uploaded_by = auth.uid() or public.is_staff());

-- ---- appointments ----------------------------------------------------------
drop policy if exists "appointments_select" on public.appointments;
create policy "appointments_select" on public.appointments
  for select using (
    client_id = auth.uid() or lawyer_id = auth.uid() or public.is_staff()
  );

drop policy if exists "appointments_insert" on public.appointments;
create policy "appointments_insert" on public.appointments
  for insert with check (client_id = auth.uid() or public.is_staff());

drop policy if exists "appointments_update" on public.appointments;
create policy "appointments_update" on public.appointments
  for update using (
    client_id = auth.uid() or lawyer_id = auth.uid() or public.is_staff()
  );

-- ---- invoices --------------------------------------------------------------
drop policy if exists "invoices_select" on public.invoices;
create policy "invoices_select" on public.invoices
  for select using (client_id = auth.uid() or public.is_staff());

drop policy if exists "invoices_write" on public.invoices;
create policy "invoices_write" on public.invoices
  for all using (public.is_staff()) with check (public.is_staff());

-- ---- messages --------------------------------------------------------------
drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages
  for select using (
    exists (
      select 1 from public.cases c
      where c.id = messages.case_id
        and (c.client_id = auth.uid() or c.lawyer_id = auth.uid() or public.is_staff())
    )
  );

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.cases c
      where c.id = messages.case_id
        and (c.client_id = auth.uid() or c.lawyer_id = auth.uid() or public.is_staff())
    )
  );

-- ===========================================================================
-- Storage bucket + policies for private case documents
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('case-documents', 'case-documents', false)
on conflict (id) do nothing;

-- Files are stored under  {case_id}/{filename}. Access mirrors case access.
drop policy if exists "docs_storage_select" on storage.objects;
create policy "docs_storage_select" on storage.objects
  for select using (
    bucket_id = 'case-documents'
    and exists (
      select 1 from public.cases c
      where c.id::text = (storage.foldername(name))[1]
        and (c.client_id = auth.uid() or c.lawyer_id = auth.uid() or public.is_staff())
    )
  );

drop policy if exists "docs_storage_insert" on storage.objects;
create policy "docs_storage_insert" on storage.objects
  for insert with check (
    bucket_id = 'case-documents'
    and exists (
      select 1 from public.cases c
      where c.id::text = (storage.foldername(name))[1]
        and (c.client_id = auth.uid() or c.lawyer_id = auth.uid() or public.is_staff())
    )
  );

drop policy if exists "docs_storage_delete" on storage.objects;
create policy "docs_storage_delete" on storage.objects
  for delete using (
    bucket_id = 'case-documents'
    and (owner = auth.uid() or public.is_staff())
  );

-- ===========================================================================
-- Realtime — broadcast message inserts so threads update live.
-- (RLS still applies to which rows each client receives.)
-- ===========================================================================
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; end $$;
