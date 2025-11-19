-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Jednostki OSP
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wnioski o dołączenie
CREATE TABLE join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_name TEXT NOT NULL,
  president_title TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profil użytkownika (rozszerzenie Supabase Auth)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin_jednostki', 'ratownik')),
  firefighter_role TEXT CHECK (firefighter_role IN ('strażak', 'dowódca', 'kierowca', 'strażak_kpp')),
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zdarzenia (z powiązaniem do jednostki)
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Podstawowe dane zdarzenia
  type TEXT NOT NULL,
  title TEXT,
  location TEXT NOT NULL,
  commander TEXT,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'CONTROLLED', 'COMPLETED')),
  
  -- Czasy
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE,
  controlled_time TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Dane JSON
  checklist JSONB DEFAULT '[]',
  casualties JSONB DEFAULT '[]',
  notes JSONB DEFAULT '[]',
  photos JSONB DEFAULT '[]',
  rotation_board JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy dla wydajności
CREATE INDEX idx_incidents_unit_id ON incidents(unit_id);
CREATE INDEX idx_incidents_created_by ON incidents(created_by);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_user_profiles_unit_id ON user_profiles(unit_id);
CREATE INDEX idx_join_requests_status ON join_requests(status);

-- Row Level Security (RLS)
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla units
CREATE POLICY "Użytkownicy widzą swoją jednostkę"
  ON units FOR SELECT
  USING (
    id IN (
      SELECT unit_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Polityki RLS dla user_profiles
CREATE POLICY "Użytkownicy widzą swój profil"
  ON user_profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admini jednostki widzą profile w swojej jednostce"
  ON user_profiles FOR SELECT
  USING (
    unit_id IN (
      SELECT unit_id FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin_jednostki'
    )
  );

-- Polityki RLS dla incidents
CREATE POLICY "Użytkownicy widzą zdarzenia swojej jednostki"
  ON incidents FOR SELECT
  USING (
    unit_id IN (
      SELECT unit_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Użytkownicy mogą tworzyć zdarzenia dla swojej jednostki"
  ON incidents FOR INSERT
  WITH CHECK (
    unit_id IN (
      SELECT unit_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Użytkownicy mogą edytować zdarzenia swojej jednostki"
  ON incidents FOR UPDATE
  USING (
    unit_id IN (
      SELECT unit_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Polityki RLS dla join_requests (publiczne tworzenie, tylko super admin widzi)
CREATE POLICY "Każdy może utworzyć wniosek"
  ON join_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Super admin widzi wszystkie wnioski"
  ON join_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Funkcja do automatycznego tworzenia profilu po rejestracji
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, full_name)
  VALUES (
    NEW.id,
    'ratownik',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger dla nowych użytkowników
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

