-- Schéma de base de données pour Drop Eazy
-- À exécuter dans l'éditeur SQL de Supabase

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs (étend la table auth.users de Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des projets
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des recherches de tendances
CREATE TABLE public.trend_searches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des analyses de produits
CREATE TABLE public.product_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT,
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des offres
CREATE TABLE public.offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  features JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des campagnes publicitaires
CREATE TABLE public.ad_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  platform TEXT,
  performance_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des lancements
CREATE TABLE public.launches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  launch_plan JSONB,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  launch_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ad_campaigns_updated_at BEFORE UPDATE ON public.ad_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_launches_updated_at BEFORE UPDATE ON public.launches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launches ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own trend searches" ON public.trend_searches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trend searches" ON public.trend_searches FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own product analyses" ON public.product_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own product analyses" ON public.product_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own offers" ON public.offers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own offers" ON public.offers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own offers" ON public.offers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own offers" ON public.offers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ad campaigns" ON public.ad_campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ad campaigns" ON public.ad_campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ad campaigns" ON public.ad_campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ad campaigns" ON public.ad_campaigns FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own launches" ON public.launches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own launches" ON public.launches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own launches" ON public.launches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own launches" ON public.launches FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour créer un profil utilisateur automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
