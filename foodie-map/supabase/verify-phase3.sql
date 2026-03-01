-- Knife Set · Fase 3 smoke checks
-- Ejecutar en Supabase SQL Editor con sesión admin/super_user activa.

-- 1) Verificar roles clave
select email, role, updated_at
from public.profiles
where email in ('mark.test@knifeset.app', 'cvilcasal@gmail.com')
order by email;

-- 2) Verificar requests pendientes/rechazadas/aprobadas
select 'mark_requests' as source, status, count(*) as total
from public.mark_requests
group by status
union all
select 'place_requests' as source, status, count(*) as total
from public.place_requests
group by status
order by source, status;

-- 3) Verificar campos de rechazo llenados cuando status = rejected
select
  id,
  user_id,
  status,
  to_jsonb(mark_requests) ->> 'rejection_reason' as rejection_reason,
  to_jsonb(mark_requests) ->> 'rejected_by' as rejected_by,
  to_jsonb(mark_requests) ->> 'rejected_at' as rejected_at
from public.mark_requests
where status = 'rejected'
order by created_at desc
limit 10;

select
  id,
  name,
  status,
  to_jsonb(place_requests) ->> 'rejection_reason' as rejection_reason,
  to_jsonb(place_requests) ->> 'rejected_by' as rejected_by,
  to_jsonb(place_requests) ->> 'rejected_at' as rejected_at
from public.place_requests
where status = 'rejected'
order by created_at desc
limit 10;

-- 4) Verificar audit log de fase 3
select action, resource_type, resource_id, actor_id, details, created_at
from public.audit_log
where action in (
  'mark_request_approved',
  'mark_request_rejected',
  'place_request_approved',
  'place_request_rejected'
)
order by created_at desc
limit 50;

-- 5) Verificar vista KS disponible
select id, name, category, district, ks_score, review_count
from public.places_with_ks
order by ks_score desc nulls last
limit 20;
