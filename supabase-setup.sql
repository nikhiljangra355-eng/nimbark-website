-- Nimbark Research Insights — enquiries table
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query → paste → Run

create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  phone      text not null,
  service    text,
  message    text,
  status     text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

-- Helpful index for the admin dashboard (newest first)
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- Lock the table down: the website accesses it ONLY through the serverless
-- functions using the service_role key, which bypasses RLS. Enabling RLS with
-- no policies means the anon/public keys can neither read nor write anything.
alter table public.enquiries enable row level security;
