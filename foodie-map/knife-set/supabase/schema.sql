create extension if not exists pgcrypto;

do $$
begin
  create type public.app_role as enum ('user', 'mark', 'super_user');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.request_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mark_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  bio text not null,
  status public.request_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  rejection_notes text,
  rejected_at timestamptz,
  rejected_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.place_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text not null,
  district text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  price_level int not null check (price_level between 1 and 4),
  notes text,
  status public.request_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  rejection_notes text,
  rejected_at timestamptz,
  rejected_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.mark_requests
  add column if not exists rejection_reason text,
  add column if not exists rejection_notes text,
  add column if not exists rejected_at timestamptz,
  add column if not exists rejected_by uuid references public.profiles(id);

alter table public.place_requests
  add column if not exists rejection_reason text,
  add column if not exists rejection_notes text,
  add column if not exists rejected_at timestamptz,
  add column if not exists rejected_by uuid references public.profiles(id);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  district text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  price_level int not null check (price_level between 1 and 4),
  status text not null default 'approved',
  created_by uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  mark_id uuid not null references public.profiles(id) on delete cascade,
  sabor numeric(3,1) not null check (sabor between 1 and 5),
  servicio numeric(3,1) not null check (servicio between 1 and 5),
  higiene numeric(3,1) not null check (higiene between 1 and 5),
  precio_valor numeric(3,1) not null check (precio_valor between 1 and 5),
  autenticidad numeric(3,1) not null check (autenticidad between 1 and 5),
  rapidez numeric(3,1) not null check (rapidez between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  actor_id uuid references public.profiles(id) on delete set null,
  resource_type text not null,
  resource_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

with ranked_places as (
  select
    id,
    row_number() over (
      partition by name, district, address
      order by created_at asc, id asc
    ) as rn
  from public.places
)
delete from public.places p
using ranked_places r
where p.id = r.id
  and r.rn > 1;

create unique index if not exists ux_places_name_district_address
  on public.places(name, district, address);

create index if not exists idx_audit_log_resource on public.audit_log(resource_type, resource_id);
create index if not exists idx_audit_log_actor on public.audit_log(actor_id);
create index if not exists idx_audit_log_created on public.audit_log(created_at);

create index if not exists idx_mark_requests_user on public.mark_requests(user_id);
create index if not exists idx_place_requests_user on public.place_requests(user_id);
create index if not exists idx_reviews_place on public.reviews(place_id);
create index if not exists idx_reviews_mark on public.reviews(mark_id);

create or replace view public.places_with_ks as
with base as (
  select
    p.id,
    p.name,
    p.category,
    p.district,
    p.address,
    p.lat,
    p.lng,
    p.price_level,
    coalesce(avg(r.sabor), 0)::numeric(4,2) as sabor,
    coalesce(avg(r.servicio), 0)::numeric(4,2) as servicio,
    coalesce(avg(r.higiene), 0)::numeric(4,2) as higiene,
    coalesce(avg(r.precio_valor), 0)::numeric(4,2) as precio_valor,
    coalesce(avg(r.autenticidad), 0)::numeric(4,2) as autenticidad,
    coalesce(avg(r.rapidez), 0)::numeric(4,2) as rapidez,
    count(r.id)::int as review_count
  from public.places p
  left join public.reviews r on r.place_id = p.id
  where p.status = 'approved'
  group by p.id
), score as (
  select
    *,
    ((sabor * 0.34) + (servicio * 0.17) + (higiene * 0.19) + (precio_valor * 0.14) + (autenticidad * 0.10) + (rapidez * 0.06)) * 20 as quality_score,
    least(1, (log(10, review_count + 1) / 2)) as confidence_factor
  from base
)
select
  id,
  name,
  category,
  district,
  address,
  lat,
  lng,
  price_level,
  sabor,
  servicio,
  higiene,
  precio_valor,
  autenticidad,
  rapidez,
  review_count,
  round((quality_score * (0.78 + confidence_factor * 0.22))::numeric, 2) as ks_score
from score;

create or replace function public.is_super_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'super_user'
  );
$$;

create or replace function public.is_mark_or_super()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('mark', 'super_user')
  );
$$;

create or replace function public.approve_mark_request(p_request_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
begin
  if not public.is_super_user() then
    raise exception 'forbidden';
  end if;

  select user_id into v_user_id
  from public.mark_requests
  where id = p_request_id and status = 'pending';

  if v_user_id is null then
    raise exception 'request not found or already processed';
  end if;

  update public.mark_requests
  set status = 'approved', reviewed_by = auth.uid(), reviewed_at = now()
  where id = p_request_id;

  update public.profiles
  set role = 'mark', updated_at = now()
  where id = v_user_id;

  insert into public.audit_log (action, actor_id, resource_type, resource_id, details)
  values ('mark_request_approved', auth.uid(), 'mark_requests', p_request_id, 
          jsonb_build_object('user_id', v_user_id));
end;
$$;

create or replace function public.approve_place_request(p_request_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  req record;
begin
  if not public.is_super_user() then
    raise exception 'forbidden';
  end if;

  select * into req
  from public.place_requests
  where id = p_request_id and status = 'pending';

  if req is null then
    raise exception 'request not found or already processed';
  end if;

  insert into public.places (
    name, category, district, address, lat, lng, price_level, status, created_by, approved_by
  )
  values (
    req.name, req.category, req.district, req.address, req.lat, req.lng, req.price_level, 'approved', req.user_id, auth.uid()
  );

  update public.place_requests
  set status = 'approved', reviewed_by = auth.uid(), reviewed_at = now()
  where id = p_request_id;

  insert into public.audit_log (action, actor_id, resource_type, resource_id, details)
  values ('place_request_approved', auth.uid(), 'place_requests', p_request_id, jsonb_build_object('place_name', req.name));
end;
$$;

create or replace function public.reject_mark_request(p_request_id uuid, p_reason text, p_notes text default null)
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
begin
  if not public.is_super_user() then
    raise exception 'forbidden';
  end if;

  select user_id into v_user_id
  from public.mark_requests
  where id = p_request_id and status = 'pending';

  if v_user_id is null then
    raise exception 'request not found or already processed';
  end if;

  update public.mark_requests
  set status = 'rejected', rejected_by = auth.uid(), rejected_at = now(), 
      rejection_reason = p_reason, rejection_notes = p_notes
  where id = p_request_id;

  insert into public.audit_log (action, actor_id, resource_type, resource_id, details)
  values ('mark_request_rejected', auth.uid(), 'mark_requests', p_request_id, 
          jsonb_build_object('reason', p_reason, 'notes', p_notes));
end;
$$;

create or replace function public.reject_place_request(p_request_id uuid, p_reason text, p_notes text default null)
returns void
language plpgsql
security definer
as $$
declare
  v_place_name text;
begin
  if not public.is_super_user() then
    raise exception 'forbidden';
  end if;

  select name into v_place_name
  from public.place_requests
  where id = p_request_id and status = 'pending';

  if v_place_name is null then
    raise exception 'request not found or already processed';
  end if;

  update public.place_requests
  set status = 'rejected', rejected_by = auth.uid(), rejected_at = now(),
      rejection_reason = p_reason, rejection_notes = p_notes
  where id = p_request_id;

  insert into public.audit_log (action, actor_id, resource_type, resource_id, details)
  values ('place_request_rejected', auth.uid(), 'place_requests', p_request_id, 
          jsonb_build_object('place_name', v_place_name, 'reason', p_reason, 'notes', p_notes));
end;
$$;

alter table public.profiles enable row level security;
alter table public.mark_requests enable row level security;
alter table public.place_requests enable row level security;
alter table public.places enable row level security;
alter table public.reviews enable row level security;
alter table public.audit_log enable row level security;

drop policy if exists "profiles self select" on public.profiles;
create policy "profiles self select"
on public.profiles
for select
using (id = auth.uid() or public.is_super_user());

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self"
on public.profiles
for insert
with check (id = auth.uid());

drop policy if exists "mark requests own" on public.mark_requests;
create policy "mark requests own"
on public.mark_requests
for select
using (user_id = auth.uid() or public.is_super_user());

drop policy if exists "mark requests create" on public.mark_requests;
create policy "mark requests create"
on public.mark_requests
for insert
with check (user_id = auth.uid());

drop policy if exists "mark requests super update" on public.mark_requests;
create policy "mark requests super update"
on public.mark_requests
for update
using (public.is_super_user())
with check (public.is_super_user());

drop policy if exists "place requests read" on public.place_requests;
create policy "place requests read"
on public.place_requests
for select
using (user_id = auth.uid() or public.is_super_user());

drop policy if exists "place requests create" on public.place_requests;
create policy "place requests create"
on public.place_requests
for insert
with check (user_id = auth.uid());

drop policy if exists "place requests super update" on public.place_requests;
create policy "place requests super update"
on public.place_requests
for update
using (public.is_super_user())
with check (public.is_super_user());

drop policy if exists "places public read" on public.places;
create policy "places public read"
on public.places
for select
using (status = 'approved' or public.is_super_user());

drop policy if exists "places super mutate" on public.places;
create policy "places super mutate"
on public.places
for all
using (public.is_super_user())
with check (public.is_super_user());

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read"
on public.reviews
for select
using (true);

drop policy if exists "reviews mark insert" on public.reviews;
create policy "reviews mark insert"
on public.reviews
for insert
with check (mark_id = auth.uid() and public.is_mark_or_super());

drop policy if exists "audit_log super read" on public.audit_log;
create policy "audit_log super read"
on public.audit_log
for select
using (public.is_super_user());

grant usage on schema public to anon, authenticated;
grant select on public.places_with_ks to anon, authenticated;
grant select on public.audit_log to authenticated;
grant execute on function public.approve_mark_request(uuid) to authenticated;
grant execute on function public.approve_place_request(uuid) to authenticated;
grant execute on function public.reject_mark_request(uuid, text, text) to authenticated;
grant execute on function public.reject_place_request(uuid, text, text) to authenticated;

-- Seed example places (optional)
insert into public.places (name, category, district, address, lat, lng, price_level, status)
values
  ('La Nueva Palomino', 'Restaurante', 'Yanahuara', 'Leoncio Prado 122', -16.3908, -71.5487, 3, 'approved'),
  ('Kafi Wasi', 'Café', 'Cercado', 'Santa Catalina 210', -16.3982, -71.5365, 2, 'approved')
on conflict (name, district, address) do nothing;

-- Promote initial super user by email (edit email as needed)
update public.profiles
set role = 'super_user', updated_at = now()
where email = 'cvilcasal@gmail.com';
