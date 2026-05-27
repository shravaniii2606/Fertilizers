create extension if not exists "pgcrypto";

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  batch_number text not null,
  number_of_bags integer not null check (number_of_bags > 0),
  product_name text,
  product_price numeric(12, 2),
  product_expiry date,
  manufacturer text,
  bag_weight text,
  bag_ids text[] not null default '{}',
  qr_codes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.batches
add column if not exists qr_codes jsonb not null default '[]'::jsonb;

create index if not exists batches_created_at_idx on public.batches (created_at desc);
create index if not exists batches_batch_number_idx on public.batches (batch_number);

create table if not exists public.dealer_scan_records (
  id uuid primary key default gen_random_uuid(),
  decoded_text text not null,
  decoded_payload jsonb not null default '{}'::jsonb,
  bag_id text,
  batch_number text,
  product_name text,
  number_of_bags integer,
  manufacturer text,
  bag_weight text,
  matched_batch_id uuid,
  scanned_at timestamptz not null default timezone('utc', now())
);

create index if not exists dealer_scan_records_scanned_at_idx on public.dealer_scan_records (scanned_at desc);
create index if not exists dealer_scan_records_batch_number_idx on public.dealer_scan_records (batch_number);
create index if not exists dealer_scan_records_bag_id_idx on public.dealer_scan_records (bag_id);

alter table public.batches enable row level security;

drop policy if exists "Allow anon insert batches" on public.batches;
create policy "Allow anon insert batches"
on public.batches
for insert
to anon
with check (true);

drop policy if exists "Allow anon select batches" on public.batches;
create policy "Allow anon select batches"
on public.batches
for select
to anon
using (true);

create table if not exists public.farmers (
  id uuid primary key default gen_random_uuid(),
  aadhar_id text not null,
  farmer_name text not null,
  district text,
  last_transaction date,
  fertilizer_received text,
  total_received text,
  status text,
  land_size text,
  crop_type text,
  monthly_limit text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists farmers_created_at_idx on public.farmers (created_at desc);
create index if not exists farmers_aadhar_id_idx on public.farmers (aadhar_id);

alter table public.farmers enable row level security;

drop policy if exists "Allow anon select farmers" on public.farmers;
create policy "Allow anon select farmers"
on public.farmers
for select
to anon
using (true);
