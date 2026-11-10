begin;
create table public.station_managers(id uuid primary key references public.station_editors(id) on delete cascade);
create table public.station_invites(email text primary key, manager boolean not null, expires_at timestamptz not null);
alter table public.station_managers enable row level security;
alter table public.station_invites enable row level security;
revoke all on public.station_managers,public.station_invites from public,anon,authenticated;
insert into public.station_managers select id from public.station_editors where id='d6f9181f-9363-48bc-ab2f-93253ac1c777';
create function public.station_team(action text default 'list',address text default '',is_manager boolean default false)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); target uuid; inbox text:=lower(trim(address)); result jsonb;
begin
 perform pg_advisory_xact_lock(16963823);
 if action='claim' then
   select lower(email) into inbox from auth.users where id=actor and email_confirmed_at is not null;
   delete from public.station_invites where email=inbox and expires_at>now() returning manager into is_manager;
   if found then
     insert into public.station_editors values(actor) on conflict do nothing;
     if is_manager then insert into public.station_managers values(actor) on conflict do nothing; end if;
   end if;
   return jsonb_build_object('manager',exists(select from public.station_managers where id=actor));
 end if;
 if not exists(select from public.station_managers where id=actor) then raise exception 'Manager access required';end if;
 select id into target from auth.users where lower(email)=inbox;
 if action='invite' then
   if inbox is null or inbox !~ '^[^ @]+@[^ @]+\.[^ @]+$' or length(inbox)>254 then raise exception 'Invalid email';end if;
   if exists(select from public.station_editors where id=target) then raise exception 'Already a member';end if;
   insert into public.station_invites values(inbox,is_manager,now()+interval '7 days') on conflict(email) do update set manager=excluded.manager,expires_at=excluded.expires_at;
 elsif action='remove' then
   if target=actor then raise exception 'Cannot remove yourself';end if;
   delete from public.station_invites where email=inbox;delete from public.station_editors where id=target;
 elsif action<>'list' then raise exception 'Unknown action';end if;
 select coalesce(jsonb_agg(to_jsonb(x) order by x.email),'[]'::jsonb) into result from (
 select u.email,m.id is not null manager,false pending,u.id=actor self from public.station_editors e join auth.users u on u.id=e.id left join public.station_managers m on m.id=e.id
 union all select i.email,i.manager,true,false from public.station_invites i where i.expires_at>now()) x;
 return result;
end $$;
revoke all on function public.station_team(text,text,boolean) from public,anon;
grant execute on function public.station_team(text,text,boolean) to authenticated;
commit;
