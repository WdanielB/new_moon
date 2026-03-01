-- Seed file mapped to schema-pro.sql
-- Useful for local testing of algorithm and UI components

-- 1. Profiles
-- Insert fake users (need actual UUIDs that match what Supabase Auth would create if doing it locally)
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'super@knifeset.com', '{"full_name": "Admin Supremo"}'),
  ('22222222-2222-2222-2222-222222222222', 'mark@knifeset.com',  '{"full_name": "Mark Tester"}'),
  ('33333333-3333-3333-3333-333333333333', 'user@knifeset.com',  '{"full_name": "Common User"}');

INSERT INTO public.profiles (id, email, full_name, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'super@knifeset.com', 'Admin Supremo', 'super_user'),
  ('22222222-2222-2222-2222-222222222222', 'mark@knifeset.com', 'Mark Tester', 'mark'),
  ('33333333-3333-3333-3333-333333333333', 'user@knifeset.com', 'Common User', 'user');

-- 2. Places
-- a) Place 1: Highly Consistent (Sigma ~ 0) -> Titanium
INSERT INTO public.places (
  id, name, description, category, district, address, lat, lng, 
  google_maps_url, is_franchise, status, social_networks
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Café Consistence',
  'A cafe that never changes its quality.',
  'Café', 'Miraflores', 'Av. Consistencia 123', -12.121, -77.029,
  'https://maps.google.com/?q=-12.121,-77.029', false, 'approved',
  '{"instagram": "@cafeconsistence"}'
);

-- b) Place 2: Volatile (Sigma > 2.5) -> Risky
INSERT INTO public.places (
  id, name, description, category, district, address, lat, lng, 
  google_maps_url, is_franchise, status, social_networks
) VALUES (
  '10000000-0000-0000-0000-000000000002',
  'Ruleta de Sabor',
  'One day extremely good, the next day terrible.',
  'Restaurante', 'Barranco', 'Av. Volatil 456', -12.145, -77.022,
  'https://maps.google.com/?q=-12.145,-77.022', true, 'approved',
  '{"instagram": "@ruletasabor", "tiktok": "@ruleta_food"}'
);

-- 3. Events (Agenda)
INSERT INTO public.events (
  id, name, description, event_type, location, start_date, end_date, 
  status, social_networks
) VALUES (
  '20000000-0000-0000-0000-000000000001',
  'Feria Gastronómica Mistura 2026',
  'The biggest food fair in LatAm.',
  'fair', 'Costa Verde', '2026-09-01T10:00:00Z', '2026-09-10T22:00:00Z', 
  'approved', '{"instagram": "@mistura_oficial"}'
);

-- 4. Reviews (This will trigger the algorithm RPC)

-- a) Reviews for Café Consistence (Score: 9, 9, 8)
-- Mean ~8.66, StdDev ~0.47 (High consistency, so final score should be close to mean, ~8.54)
INSERT INTO public.reviews (reviewer_id, review_type, place_id, overall_score, rubric_scores, comment, visit_date)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'place', '10000000-0000-0000-0000-000000000001', 9, '{"taste": 9, "service": 9, "ambiance": 9}', 'Always perfect.', '2026-01-10'),
  ('11111111-1111-1111-1111-111111111111', 'place', '10000000-0000-0000-0000-000000000001', 9, '{"taste": 9, "service": 9, "ambiance": 9}', 'Consistent as always.', '2026-01-15'),
  ('22222222-2222-2222-2222-222222222222', 'place', '10000000-0000-0000-0000-000000000001', 8, '{"taste": 8, "service": 8, "ambiance": 8}', 'Slightly off today, but still great.', '2026-02-01');

-- b) Reviews for Ruleta de Sabor (Score: 10, 3, 9)
-- Mean ~7.33, StdDev ~3.09 (Volatile, penalty applied: 7.33 - (0.25 * 3.09) = 7.33 - 0.77 \approx 6.56 final score)
INSERT INTO public.reviews (reviewer_id, review_type, place_id, overall_score, rubric_scores, comment, visit_date)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'place', '10000000-0000-0000-0000-000000000002', 10, '{"taste": 10, "service": 10, "ambiance": 10}', 'Best experience ever!', '2026-01-05'),
  ('11111111-1111-1111-1111-111111111111', 'place', '10000000-0000-0000-0000-000000000002', 3, '{"taste": 3, "service": 2, "ambiance": 5}', 'Chef changed? Terrible today.', '2026-01-20'),
  ('22222222-2222-2222-2222-222222222222', 'place', '10000000-0000-0000-0000-000000000002', 9, '{"taste": 9, "service": 8, "ambiance": 9}', 'Okay, they recovered.', '2026-02-10');

-- c) Reviews for Event: Mistura (Score: 8, 7)
INSERT INTO public.reviews (reviewer_id, review_type, event_id, overall_score, rubric_scores, comment, visit_date)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'event', '20000000-0000-0000-0000-000000000001', 8, '{"experience": 8, "organization": 7, "price": 8}', 'Good layout this year.', '2026-09-02'),
  ('11111111-1111-1111-1111-111111111111', 'event', '20000000-0000-0000-0000-000000000001', 7, '{"experience": 7, "organization": 6, "price": 9}', 'Bit crowded, cheap entry.', '2026-09-03');
