begin;

create table public.contact_submissions (
  request_id uuid primary key,
  name text not null check (char_length(btrim(name)) between 2 and 80),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  message text not null check (char_length(btrim(message)) between 10 and 1000),
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;
-- No anonymous/authenticated RLS policies. Revoke default API grants as well.
revoke all on public.contact_submissions from public, anon, authenticated;
grant select, insert on public.contact_submissions to service_role;

-- A single RPC transaction serializes duplicate inserts through the primary key.
-- SECURITY INVOKER deliberately preserves the caller's role and RLS restrictions.
create function public.store_contact_submission(
  p_request_id uuid, p_name text, p_email text, p_message text
) returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  stored_id uuid;
begin
  insert into public.contact_submissions (request_id, name, email, message)
  values (p_request_id, p_name, p_email, p_message)
  on conflict (request_id) do nothing;

  select request_id into strict stored_id
  from public.contact_submissions where request_id = p_request_id;

  return jsonb_build_object('stored', true, 'request_id', stored_id);
end;
$$;

revoke all on function public.store_contact_submission(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.store_contact_submission(uuid, text, text, text) to service_role;

commit;
