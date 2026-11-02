-- Run in Supabase SQL Editor after the migration, as an administrator.
-- Everything below is rolled back, including the harmless test record.
begin;

do $$
begin
  if not (select relrowsecurity from pg_class where oid = 'public.contact_submissions'::regclass) then
    raise exception 'FAIL: RLS is disabled';
  end if;
end $$;

set local role service_role;
do $$
declare
  test_id uuid := 'ba509a4b-e459-4a97-8cf2-8798b83d6fc0';
  first_result jsonb;
  retry_result jsonb;
begin
  first_result := public.store_contact_submission(test_id, 'Demo Person', 'demo@example.com', 'Harmless storage verification.');
  retry_result := public.store_contact_submission(test_id, 'Changed Person', 'other@example.com', 'Changed duplicate must not overwrite.');
  if first_result <> jsonb_build_object('stored', true, 'request_id', test_id) or retry_result <> first_result then
    raise exception 'FAIL: unexpected confirmation';
  end if;
  if (select count(*) from public.contact_submissions where request_id = test_id) <> 1 then
    raise exception 'FAIL: duplicate record';
  end if;
  if (select name from public.contact_submissions where request_id = test_id) <> 'Demo Person' then
    raise exception 'FAIL: duplicate overwrote original';
  end if;
  begin
    perform public.store_contact_submission('79203917-e9e9-42d6-bc4a-22a0c336139b', 'A', 'demo@example.com', 'A valid sample message.');
    raise exception 'FAIL: invalid name accepted';
  exception when check_violation then null;
  end;
end $$;
reset role;

set local role anon;
do $$
begin
  begin perform * from public.contact_submissions; raise exception 'FAIL: anonymous SELECT allowed'; exception when insufficient_privilege then null; end;
  begin insert into public.contact_submissions values ('12f377c0-d09f-4a67-8654-6ec12fad05eb', 'Demo Person', 'demo@example.com', 'A harmless demo message.', now()); raise exception 'FAIL: anonymous INSERT allowed'; exception when insufficient_privilege then null; end;
  begin update public.contact_submissions set name = 'Changed'; raise exception 'FAIL: anonymous UPDATE allowed'; exception when insufficient_privilege then null; end;
  begin delete from public.contact_submissions; raise exception 'FAIL: anonymous DELETE allowed'; exception when insufficient_privilege then null; end;
  begin perform public.store_contact_submission('12f377c0-d09f-4a67-8654-6ec12fad05eb', 'Demo Person', 'demo@example.com', 'A harmless demo message.'); raise exception 'FAIL: anonymous RPC allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;

set local role authenticated;
do $$
begin
  begin perform * from public.contact_submissions; raise exception 'FAIL: authenticated SELECT allowed'; exception when insufficient_privilege then null; end;
  begin perform public.store_contact_submission('12f377c0-d09f-4a67-8654-6ec12fad05eb', 'Demo Person', 'demo@example.com', 'A harmless demo message.'); raise exception 'FAIL: authenticated RPC allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: RLS enabled, anonymous CRUD/RPC denied, authenticated read/RPC denied, duplicate-safe storage and validation verified; test writes rolled back.' as result;
