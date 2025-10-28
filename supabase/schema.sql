-- ===========================================
-- SCHEMA SUPABASE POUR DROP EAZY SAAS
-- ===========================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLE PROFILES (utilisateurs)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- TABLE SUBSCRIPTIONS (abonnements)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  active BOOLEAN NOT NULL DEFAULT false,
  monthly_limit INTEGER NOT NULL DEFAULT 100,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- TABLE USER_USAGE (tracking d'usage)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.user_usage (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period TEXT NOT NULL, -- Format: YYYY-MM
  feature TEXT NOT NULL, -- 'products', 'ads', 'keywords', etc.
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, period, feature)
);

-- ===========================================
-- TABLE PRODUCT_ANALYSES (analyses de produits)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.product_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- TABLE AD_CAMPAIGNS (campagnes publicitaires)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product TEXT NOT NULL,
  audience TEXT NOT NULL,
  platform TEXT NOT NULL,
  campaign_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- TABLE KEYWORD_SEARCHES (recherches de mots-clés)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.keyword_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  keywords_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- TABLE TREND_SEARCHES (recherches de tendances)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.trend_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  country TEXT,
  results JSONB NOT NULL,
  raw_sources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- TABLE OFFERS (offres générées)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  features JSONB,
  sales_page TEXT,
  email_copy TEXT,
  offer_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- TABLE LAUNCHES (plans de lancement)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.launches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  launch_plan JSONB NOT NULL,
  launch_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- TABLE USAGE_LOGS (historique d'utilisation)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  request JSONB,
  response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEXES POUR PERFORMANCE
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_user_period ON public.user_usage(user_id, period);
CREATE INDEX IF NOT EXISTS idx_product_analyses_user_id ON public.product_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_id ON public.ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_keyword_searches_user_id ON public.keyword_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_trend_searches_user_id ON public.trend_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_offers_user_id ON public.offers(user_id);
CREATE INDEX IF NOT EXISTS idx_launches_user_id ON public.launches(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politiques RLS pour les subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Politiques RLS pour user_usage
CREATE POLICY "Users can view own usage" ON public.user_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.user_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.user_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques RLS pour product_analyses
CREATE POLICY "Users can view own product analyses" ON public.product_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own product analyses" ON public.product_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour ad_campaigns
CREATE POLICY "Users can view own ad campaigns" ON public.ad_campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ad campaigns" ON public.ad_campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour keyword_searches
CREATE POLICY "Users can view own keyword searches" ON public.keyword_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keyword searches" ON public.keyword_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour trend_searches
CREATE POLICY "Users can view own trend searches" ON public.trend_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trend searches" ON public.trend_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own offers" ON public.offers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own offers" ON public.offers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour launches
CREATE POLICY "Users can view own launches" ON public.launches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own launches" ON public.launches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour usage_logs
CREATE POLICY "Users can view own usage logs" ON public.usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs" ON public.usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- FONCTIONS UTILITAIRES
-- ===========================================

-- Fonction pour créer un profil utilisateur
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
  
  -- Créer un abonnement gratuit par défaut
  INSERT INTO public.subscriptions (user_id, plan, active, monthly_limit)
  VALUES (NEW.id, 'free', true, 100);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour obtenir les statistiques d'usage d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_usage_stats(user_uuid UUID)
RETURNS TABLE (
  feature TEXT,
  current_count BIGINT,
  monthly_limit INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uu.feature,
    uu.count as current_count,
    s.monthly_limit
  FROM public.user_usage uu
  JOIN public.subscriptions s ON s.user_id = uu.user_id
  WHERE uu.user_id = user_uuid 
    AND uu.period = TO_CHAR(NOW(), 'YYYY-MM')
  ORDER BY uu.feature;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;