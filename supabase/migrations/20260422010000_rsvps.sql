create table public.rsvps (
  id bigserial primary key,
  event_id text not null references public.events (id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  unique (event_id, email)
);

create index rsvps_event_id_idx on public.rsvps (event_id);

alter table public.rsvps enable row level security;

create policy "rsvps_public_read"
  on public.rsvps
  for select
  to anon, authenticated
  using (true);

create policy "rsvps_public_insert"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (true);

alter publication supabase_realtime add table public.rsvps;
