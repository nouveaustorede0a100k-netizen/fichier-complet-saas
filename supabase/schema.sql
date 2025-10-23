-- Drop Eazy SaaS - Schéma de base de données Supabase
-- Ce fichier contient toutes les tables nécessaires pour le fonctionnement du SaaS

-- Table des utilisateurs (étend la table auth.users de Supabase)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des résultats (pour tracker l'utilisation des quotas)
CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  module TEXT NOT NULL CHECK (module IN ('trendSearches', 'productAnalyses', 'offers', 'adCampaigns', 'launchPlans')),
  input JSONB NOT NULL,
  output_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des recherches de tendances (cache et historique)
CREATE TABLE IF NOT EXISTS trend_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  country TEXT,
  results JSONB NOT NULL,
  raw_sources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des analyses de produits
CREATE TABLE IF NOT EXISTS product_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  niche TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des offres générées
CREATE TABLE IF NOT EXISTS offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  features JSONB,
  sales_page TEXT,
  email_copy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des campagnes publicitaires
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  content JSONB NOT NULL,
  target_audience TEXT,
  budget_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des plans de lancement
CREATE TABLE IF NOT EXISTS launches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  launch_plan JSONB NOT NULL,
  launch_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de cache des tendances (pour optimiser les performances)
CREATE TABLE IF NOT EXISTS trend_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  country TEXT NOT NULL,
  range TEXT DEFAULT 'month',
  result_json JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(topic, country, range)
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_results_user_id ON results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_module ON results(module);
CREATE INDEX IF NOT EXISTS idx_results_created_at ON results(created_at);
CREATE INDEX IF NOT EXISTS idx_trend_searches_user_id ON trend_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_trend_searches_created_at ON trend_searches(created_at);
CREATE INDEX IF NOT EXISTS idx_product_analyses_user_id ON product_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_offers_user_id ON offers(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_id ON ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_launches_user_id ON launches(user_id);
CREATE INDEX IF NOT EXISTS idx_trend_cache_topic_country ON trend_cache(topic, country);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Sécurité au niveau des lignes
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_cache ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques RLS pour results
CREATE POLICY "Users can view own results" ON results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results" ON results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour trend_searches
CREATE POLICY "Users can view own trend searches" ON trend_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trend searches" ON trend_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour product_analyses
CREATE POLICY "Users can view own product analyses" ON product_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own product analyses" ON product_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour offers
CREATE POLICY "Users can view own offers" ON offers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own offers" ON offers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own offers" ON offers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own offers" ON offers
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour ad_campaigns
CREATE POLICY "Users can view own ad campaigns" ON ad_campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ad campaigns" ON ad_campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ad campaigns" ON ad_campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ad campaigns" ON ad_campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour launches
CREATE POLICY "Users can view own launches" ON launches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own launches" ON launches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own launches" ON launches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own launches" ON launches
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour trend_cache (lecture publique, écriture authentifiée)
CREATE POLICY "Anyone can view trend cache" ON trend_cache
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert trend cache" ON trend_cache
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update trend cache" ON trend_cache
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Fonction pour créer un utilisateur automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer un utilisateur automatiquement
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Vue pour les statistiques utilisateur
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.email,
  u.plan,
  u.created_at,
  COALESCE(ts.count, 0) as trend_searches_count,
  COALESCE(pa.count, 0) as product_analyses_count,
  COALESCE(o.count, 0) as offers_count,
  COALESCE(ac.count, 0) as ad_campaigns_count,
  COALESCE(l.count, 0) as launches_count
FROM users u
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM results 
  WHERE module = 'trendSearches' 
  GROUP BY user_id
) ts ON u.id = ts.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM results 
  WHERE module = 'productAnalyses' 
  GROUP BY user_id
) pa ON u.id = pa.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM results 
  WHERE module = 'offers' 
  GROUP BY user_id
) o ON u.id = o.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM results 
  WHERE module = 'adCampaigns' 
  GROUP BY user_id
) ac ON u.id = ac.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM results 
  WHERE module = 'launchPlans' 
  GROUP BY user_id
) l ON u.id = l.user_id;

-- Politique RLS pour la vue user_stats
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = id);
