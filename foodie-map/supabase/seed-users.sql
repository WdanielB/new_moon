-- Knife Set · seed de roles para usuarios de prueba
-- Paso 1: crea estos usuarios desde Supabase Auth (Dashboard > Authentication > Users)
--   1) mark.test@knifeset.app
--   2) cvilcasal@gmail.com
-- (puede ser con Email/Password o Google)
--
-- Paso 2: ejecuta este SQL para sincronizar perfiles y roles.

insert into public.profiles (id, email, full_name, role)
select u.id, u.email, coalesce(u.raw_user_meta_data ->> 'full_name', 'Mark Test'), 'mark'::public.app_role
from auth.users u
where u.email = 'mark.test@knifeset.app'
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = 'mark',
  updated_at = now();

insert into public.profiles (id, email, full_name, role)
select u.id, u.email, coalesce(u.raw_user_meta_data ->> 'full_name', 'Admin KS'), 'super_user'::public.app_role
from auth.users u
where u.email = 'cvilcasal@gmail.com'
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = 'super_user',
  updated_at = now();

-- Verificación rápida
select id, email, role, created_at, updated_at
from public.profiles
where email in ('mark.test@knifeset.app', 'cvilcasal@gmail.com')
order by email;
