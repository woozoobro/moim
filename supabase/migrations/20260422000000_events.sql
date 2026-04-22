create table public.events (
  id text primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  location text,
  host_name text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create index events_starts_at_idx on public.events (starts_at);
create index events_owner_id_idx on public.events (owner_id);

alter table public.events enable row level security;

create policy "events_public_read"
  on public.events
  for select
  to anon, authenticated
  using (true);

create policy "events_auth_insert"
  on public.events
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "events_owner_update"
  on public.events
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "events_owner_delete"
  on public.events
  for delete
  to authenticated
  using (owner_id = auth.uid());
