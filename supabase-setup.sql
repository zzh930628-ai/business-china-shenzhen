create extension if not exists "pgcrypto";

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  submission_id text not null unique,
  trip_name text not null default 'Business China YLP Immersion Programme - Shenzhen',
  amount_sgd numeric(10, 2) not null default 2650,
  payee text not null default 'Sing-China',
  full_name text not null,
  email text not null,
  contact_number text not null,
  company_designation text not null,
  require_invoice text not null,
  invoice_name text,
  payment_proof_path text not null,
  payment_proof_name text not null,
  payment_proof_type text,
  payment_proof_size bigint,
  status text not null default 'pending_payment_verification',
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;

drop policy if exists "anon insert registrations" on public.registrations;
create policy "anon insert registrations"
on public.registrations
for insert
to anon
with check (true);

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

drop policy if exists "anon upload payment proofs" on storage.objects;
create policy "anon upload payment proofs"
on storage.objects
for insert
to anon
with check (bucket_id = 'payment-proofs');
