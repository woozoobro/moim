insert into storage.buckets (id, name, public)
values ('event-covers', 'event-covers', true)
on conflict (id) do nothing;

create policy "event_covers_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'event-covers');

create policy "event_covers_auth_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'event-covers');
