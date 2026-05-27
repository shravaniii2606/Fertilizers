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
