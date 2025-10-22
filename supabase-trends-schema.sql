-- Schéma pour le module Trend Finder Pro
-- À exécuter dans l'éditeur SQL de Supabase

-- Table de cache des tendances
CREATE TABLE IF NOT EXISTS public.trend_cache (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  topic TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  range TEXT DEFAULT '30d',
  result_json JSONB NOT NULL,
  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Index pour recherche rapide
  UNIQUE(topic, country, range)
);

-- Table d'historique des recherches utilisateur
CREATE TABLE IF NOT EXISTS public.trend_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  range TEXT DEFAULT '30d',
  result_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_trend_cache_topic ON public.trend_cache(topic);
CREATE INDEX IF NOT EXISTS idx_trend_cache_updated ON public.trend_cache(updated_at);
CREATE INDEX IF NOT EXISTS idx_trend_history_user ON public.trend_history(user_id);
CREATE INDEX IF NOT EXISTS idx_trend_history_created ON public.trend_history(created_at);

-- RLS (Row Level Security)
ALTER TABLE public.trend_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_history ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Anyone can read trend cache" ON public.trend_cache FOR SELECT USING (true);
CREATE POLICY "Anyone can insert trend cache" ON public.trend_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update trend cache" ON public.trend_cache FOR UPDATE USING (true);

CREATE POLICY "Users can view own trend history" ON public.trend_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trend history" ON public.trend_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fonction pour nettoyer le cache (supprimer les entrées > 6h)
CREATE OR REPLACE FUNCTION public.cleanup_old_trend_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.trend_cache 
  WHERE updated_at < NOW() - INTERVAL '6 hours';
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_trend_cache_updated_at 
  BEFORE UPDATE ON public.trend_cache 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
