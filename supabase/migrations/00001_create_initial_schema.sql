-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('guest', 'scientist', 'policymaker', 'admin');

-- Create dataset type enum
CREATE TYPE public.dataset_type AS ENUM ('oceanographic', 'fish_survey', 'otolith_image', 'edna', 'species_data');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  role public.user_role NOT NULL DEFAULT 'scientist'::public.user_role,
  full_name TEXT,
  organization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create datasets table
CREATE TABLE public.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type public.dataset_type NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT,
  file_size BIGINT,
  file_format TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  location_lat DECIMAL(10, 8),
  location_lon DECIMAL(11, 8),
  collection_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create species table
CREATE TABLE public.species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scientific_name TEXT NOT NULL UNIQUE,
  common_name TEXT,
  habitat TEXT,
  conservation_status TEXT,
  distribution_range TEXT,
  biological_characteristics TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create fish identification records table
CREATE TABLE public.fish_identifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  identified_species_id UUID REFERENCES public.species(id) ON DELETE SET NULL,
  confidence_score DECIMAL(5, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create oceanographic data table
CREATE TABLE public.oceanographic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lon DECIMAL(11, 8) NOT NULL,
  measurement_date TIMESTAMPTZ NOT NULL,
  temperature DECIMAL(5, 2),
  salinity DECIMAL(5, 2),
  ph DECIMAL(4, 2),
  oxygen_level DECIMAL(5, 2),
  current_speed DECIMAL(5, 2),
  current_direction DECIMAL(5, 2),
  depth DECIMAL(8, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create fish survey data table
CREATE TABLE public.fish_survey_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
  species_id UUID REFERENCES public.species(id) ON DELETE SET NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lon DECIMAL(11, 8) NOT NULL,
  survey_date DATE NOT NULL,
  abundance INTEGER,
  biomass DECIMAL(10, 2),
  size_range TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-8wr0fb8sswld_marine_images', 'app-8wr0fb8sswld_marine_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for datasets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-8wr0fb8sswld_datasets', 'app-8wr0fb8sswld_datasets', false)
ON CONFLICT (id) DO NOTHING;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Create trigger function to sync new users to profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.id::text),
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'scientist'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger to sync users
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fish_identifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oceanographic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fish_survey_data ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT TO anon USING (true);

-- Datasets policies
CREATE POLICY "Admins have full access to datasets" ON datasets
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Scientists can create datasets" ON datasets
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can view all datasets" ON datasets
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own datasets" ON datasets
  FOR UPDATE TO authenticated USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete their own datasets" ON datasets
  FOR DELETE TO authenticated USING (uploaded_by = auth.uid());

CREATE POLICY "Public can view approved datasets" ON datasets
  FOR SELECT TO anon USING (status = 'approved');

-- Species policies
CREATE POLICY "Anyone can view species" ON species
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage species" ON species
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Fish identifications policies
CREATE POLICY "Users can view their own identifications" ON fish_identifications
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Users can create identifications" ON fish_identifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Oceanographic data policies
CREATE POLICY "Anyone can view oceanographic data" ON oceanographic_data
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert oceanographic data" ON oceanographic_data
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can manage oceanographic data" ON oceanographic_data
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Fish survey data policies
CREATE POLICY "Anyone can view fish survey data" ON fish_survey_data
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert fish survey data" ON fish_survey_data
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can manage fish survey data" ON fish_survey_data
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Storage policies for marine images
CREATE POLICY "Anyone can view marine images" ON storage.objects
  FOR SELECT USING (bucket_id = 'app-8wr0fb8sswld_marine_images');

CREATE POLICY "Authenticated users can upload marine images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app-8wr0fb8sswld_marine_images');

CREATE POLICY "Users can update their own marine images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'app-8wr0fb8sswld_marine_images');

CREATE POLICY "Users can delete their own marine images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'app-8wr0fb8sswld_marine_images');

-- Storage policies for datasets
CREATE POLICY "Authenticated users can view datasets" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'app-8wr0fb8sswld_datasets');

CREATE POLICY "Authenticated users can upload datasets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app-8wr0fb8sswld_datasets');

CREATE POLICY "Admins can manage dataset files" ON storage.objects
  FOR ALL TO authenticated USING (bucket_id = 'app-8wr0fb8sswld_datasets' AND is_admin(auth.uid()));

-- Insert sample species data
INSERT INTO public.species (scientific_name, common_name, habitat, conservation_status, distribution_range, biological_characteristics) VALUES
('Thunnus albacares', 'Yellowfin Tuna', 'Pelagic waters, tropical and subtropical oceans', 'Near Threatened', 'Worldwide in tropical and subtropical seas', 'Large migratory fish, can reach 2.4m length and 200kg weight'),
('Katsuwonus pelamis', 'Skipjack Tuna', 'Tropical and warm-temperate waters', 'Least Concern', 'Circumglobal in tropical and warm-temperate waters', 'Medium-sized pelagic fish, important commercial species'),
('Sardinella longiceps', 'Indian Oil Sardine', 'Coastal waters, continental shelf', 'Least Concern', 'Indo-Pacific: Red Sea and East Africa to Indonesia', 'Small pelagic fish, forms large schools'),
('Rastrelliger kanagurta', 'Indian Mackerel', 'Coastal and offshore waters', 'Least Concern', 'Indo-West Pacific: Red Sea to Indonesia', 'Important food fish, coastal pelagic species'),
('Scomberomorus commerson', 'Narrow-barred Spanish Mackerel', 'Coastal and offshore waters', 'Near Threatened', 'Indo-West Pacific: Red Sea to Australia', 'Large predatory fish, popular game fish');

-- Create indexes for better performance
CREATE INDEX idx_datasets_type ON datasets(type);
CREATE INDEX idx_datasets_uploaded_by ON datasets(uploaded_by);
CREATE INDEX idx_datasets_created_at ON datasets(created_at DESC);
CREATE INDEX idx_oceanographic_location ON oceanographic_data(location_lat, location_lon);
CREATE INDEX idx_oceanographic_date ON oceanographic_data(measurement_date DESC);
CREATE INDEX idx_fish_survey_location ON fish_survey_data(location_lat, location_lon);
CREATE INDEX idx_fish_survey_date ON fish_survey_data(survey_date DESC);
CREATE INDEX idx_fish_survey_species ON fish_survey_data(species_id);