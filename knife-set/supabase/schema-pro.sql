-- Schema Knife Set Pro (PostgreSQL / Supabase)
-- Includes Places, Events (Agenda), Reviews, Users, and the Consistency Algorithm

-- 1. Create custom types/enums
CREATE TYPE user_role AS ENUM ('user', 'mark', 'super_user');
CREATE TYPE review_type AS ENUM ('place', 'event');

-- 2. Profiles (Extend Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Places (Gastronomic points)
CREATE TABLE public.places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  
  -- New fields (Pro)
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  google_maps_url TEXT,
  interior_photos TEXT[] DEFAULT '{}',
  social_networks JSONB DEFAULT '{}'::jsonb, -- e.g., {"instagram": "...", "tiktok": "..."}
  menu_url TEXT,
  hours JSONB DEFAULT '{}'::jsonb, -- e.g., {"monday": "09:00-18:00", ...}
  is_franchise BOOLEAN DEFAULT FALSE,
  
  -- Calculated metrics
  average_score NUMERIC(4,2) DEFAULT 0,
  consistency_score NUMERIC(4,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Events (Agenda - Fairs, Concerts)
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- e.g., 'fair', 'concert', 'cultural'
  location TEXT NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  -- New fields (Pro)
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  google_maps_url TEXT,
  photos TEXT[] DEFAULT '{}',
  social_networks JSONB DEFAULT '{}'::jsonb,
  
  -- Calculated metrics
  average_score NUMERIC(4,2) DEFAULT 0,
  consistency_score NUMERIC(4,2) DEFAULT 0, -- useful for recurring events
  total_reviews INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Reviews (Polymorphic: Places or Events)
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES public.profiles(id) NOT NULL,
  review_type review_type NOT NULL,
  
  -- Target references (one should be null, the other not null based on review_type)
  place_id UUID REFERENCES public.places(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  
  -- General score (the one used for consistency math)
  overall_score NUMERIC(4,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 10),
  
  -- Detailed Rubric (JSON allows flexible schemas based on target)
  -- For places: {"taste": 9, "service": 8, "ambiance": 7, "value": 8}
  -- For events: {"experience": 8, "organization": 7, "price": 9}
  rubric_scores JSONB NOT NULL,
  
  comment TEXT,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_target CHECK (
    (review_type = 'place' AND place_id IS NOT NULL AND event_id IS NULL) OR
    (review_type = 'event' AND event_id IS NOT NULL AND place_id IS NULL)
  )
);

-- 6. Requests (Place / Mark status)
CREATE TABLE public.place_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  place_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.mark_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. THE ALGORITHM: Consistency Math (RPC)
-- Calculates Average - (Lambda * Standard Deviation)
CREATE OR REPLACE FUNCTION calculate_target_score_and_consistency(
    p_target_id UUID,
    p_type review_type
)
RETURNS void AS $$
DECLARE
    v_avg NUMERIC;
    v_stddev NUMERIC;
    v_count INTEGER;
    v_lambda NUMERIC := 0.25; -- Penalty factor
    v_final_score NUMERIC;
BEGIN
    -- 1. Calculate stats from reviews
    SELECT 
        COALESCE(AVG(overall_score), 0),
        COALESCE(stddev_pop(overall_score), 0),
        COUNT(*)
    INTO v_avg, v_stddev, v_count
    FROM public.reviews
    WHERE 
        (p_type = 'place' AND place_id = p_target_id) OR
        (p_type = 'event' AND event_id = p_target_id);

    -- 2. Apply algorithm: Score = Average - (Lambda * StdDev)
    -- If only 1 review, stddev is 0, so score = avg.
    v_final_score := GREATEST(0, v_avg - (v_lambda * v_stddev));

    -- 3. Update the corresponding table
    IF p_type = 'place' THEN
        UPDATE public.places
        SET 
            average_score = ROUND(v_final_score, 2),
            consistency_score = ROUND(v_stddev, 2), -- the raw variance/stddev is the consistency metric (lower is better, 0 is titanium)
            total_reviews = v_count,
            updated_at = NOW()
        WHERE id = p_target_id;
    ELSIF p_type = 'event' THEN
        UPDATE public.events
        SET 
            average_score = ROUND(v_final_score, 2),
            consistency_score = ROUND(v_stddev, 2),
            total_reviews = v_count,
            updated_at = NOW()
        WHERE id = p_target_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Triggers to run the algorithm automatically on review changes
CREATE OR REPLACE FUNCTION trigger_update_target_score()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM calculate_target_score_and_consistency(
            COALESCE(NEW.place_id, NEW.event_id), 
            NEW.review_type
        );
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM calculate_target_score_and_consistency(
            COALESCE(OLD.place_id, OLD.event_id), 
            OLD.review_type
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_changed
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION trigger_update_target_score();

-- 9. Row Level Security (RLS)

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Super users can do everything to profiles
-- (Note: In a real app, you'd want a secure way to bootstrap the first super_user, e.g., via SQL or checking a specific email)

-- Places
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved places are viewable by everyone." ON public.places FOR SELECT USING (status = 'approved');
CREATE POLICY "Pending places viewable by creator or super_user." ON public.places FOR SELECT USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_user')
);
CREATE POLICY "Super users can insert places." ON public.places FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_user')
);
CREATE POLICY "Super users can update places." ON public.places FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_user')
);

-- Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved events are viewable by everyone." ON public.events FOR SELECT USING (status = 'approved');
CREATE POLICY "Pending events viewable by creator or super_user." ON public.events FOR SELECT USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_user')
);
-- Allow super_users to manage events
CREATE POLICY "Super users can manage events." ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_user')
);

-- Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone." ON public.reviews FOR SELECT USING (true);
CREATE POLICY "MARKs can insert reviews." ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('mark', 'super_user'))
);
CREATE POLICY "Users can update their own reviews." ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- Requests
ALTER TABLE public.place_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own place_requests." ON public.place_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super users see all place_requests." ON public.place_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_user')
);
CREATE POLICY "Any user can request a place." ON public.place_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super users can update place_requests." ON public.place_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_user')
);

ALTER TABLE public.mark_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own mark_requests." ON public.mark_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super users see all mark_requests." ON public.mark_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_user')
);
CREATE POLICY "Any user can request MARK status." ON public.mark_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super users can update mark_requests." ON public.mark_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_user')
);
