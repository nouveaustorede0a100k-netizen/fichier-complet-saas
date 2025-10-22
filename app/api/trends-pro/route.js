import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchGoogleTrends, fetchRedditSignals, fetchProductHunt } from '@/lib/trends/fetchSources';
import { normalize } from '@/lib/trends/normalize';
import { scoreAndExplain } from '@/lib/trends/scoreAndExplain';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Rate limiting simple (en mémoire)
const rateLimit = new Map();

/**
 * Vérifie le rate limiting
 */
function checkRateLimit(identifier) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requêtes par minute
  
  if (!rateLimit.has(identifier)) {
    rateLimit.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const userLimit = rateLimit.get(identifier);
  
  if (now > userLimit.resetTime) {
    userLimit.count = 1;
    userLimit.resetTime = now + windowMs;
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

/**
 * Vérifie le cache Supabase
 */
async function getCachedResult(topic, country, range) {
  try {
    const { data, error } = await supabase
      .from('trend_cache')
      .select('result_json, updated_at')
      .eq('topic', topic)
      .eq('country', country)
      .eq('range', range)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // Vérifier si le cache est encore valide (< 6h)
    const cacheAge = Date.now() - new Date(data.updated_at).getTime();
    const maxCacheAge = 6 * 60 * 60 * 1000; // 6 heures
    
    if (cacheAge < maxCacheAge) {
      console.log('📦 Returning cached result');
      return { ...data.result_json, cached: true };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error checking cache:', error);
    return null;
  }
}

/**
 * Sauvegarde le résultat dans le cache
 */
async function saveToCache(topic, country, range, result) {
  try {
    const { error } = await supabase
      .from('trend_cache')
      .upsert({
        topic,
        country,
        range,
        result_json: result,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('❌ Error saving to cache:', error);
    } else {
      console.log('💾 Result saved to cache');
    }
  } catch (error) {
    console.error('❌ Error saving to cache:', error);
  }
}

/**
 * Sauvegarde dans l'historique utilisateur
 */
async function saveToHistory(userId, topic, country, range, result) {
  if (!userId) return;
  
  try {
    const { error } = await supabase
      .from('trend_history')
      .insert({
        user_id: userId,
        topic,
        country,
        range,
        result_json: result
      });
    
    if (error) {
      console.error('❌ Error saving to history:', error);
    }
  } catch (error) {
    console.error('❌ Error saving to history:', error);
  }
}

export async function POST(request) {
  try {
    const { topic, country = 'US', range = '30d', userId } = await request.json();
    
    // Validation des paramètres
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    
    const cleanTopic = topic.trim();
    const validCountries = ['US', 'FR', 'GB', 'DE', 'CA', 'AU', 'global'];
    const validRanges = ['7d', '30d', '90d'];
    
    if (!validCountries.includes(country)) {
      return NextResponse.json(
        { error: `Invalid country. Must be one of: ${validCountries.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (!validRanges.includes(range)) {
      return NextResponse.json(
        { error: `Invalid range. Must be one of: ${validRanges.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Rate limiting
    const clientId = userId || request.ip || 'anonymous';
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    console.log(`🚀 Starting trend analysis for: ${cleanTopic} (${country}, ${range})`);
    
    // Vérifier le cache
    const cachedResult = await getCachedResult(cleanTopic, country, range);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }
    
    // Récupérer les données de toutes les sources en parallèle
    console.log('📊 Fetching data from all sources...');
    const [googleTrends, reddit, productHunt] = await Promise.allSettled([
      fetchGoogleTrends(cleanTopic, country, range),
      fetchRedditSignals(cleanTopic),
      fetchProductHunt(cleanTopic)
    ]);
    
    // Traiter les résultats
    const rawSources = {
      googleTrends: googleTrends.status === 'fulfilled' ? googleTrends.value : { timeseries: [], relativeScore: 0, averageValue: 0, error: googleTrends.reason?.message },
      reddit: reddit.status === 'fulfilled' ? reddit.value : { totalMentions: 0, topPosts: [], avgScore: 0, mentionsGrowth: 0, error: reddit.reason?.message },
      productHunt: productHunt.status === 'fulfilled' ? productHunt.value : { recentLaunches: [], avgUpvotes: 0, trendSignal: 0, error: productHunt.reason?.message }
    };
    
    // Normaliser les données
    console.log('🔄 Normalizing data...');
    const normalizedData = normalize(rawSources);
    
    // Analyser avec l'IA
    console.log('🤖 Running AI analysis...');
    const aiAnalysis = await scoreAndExplain(normalizedData.rawMetrics, cleanTopic);
    
    // Construire la réponse finale
    const result = {
      ok: true,
      topic: cleanTopic,
      country,
      range,
      timestamp: new Date().toISOString(),
      scores: {
        growth: aiAnalysis.growthScore,
        marketPotential: aiAnalysis.marketPotential,
        confidence: aiAnalysis.confidenceLevel
      },
      timeseries: rawSources.googleTrends.timeseries || [],
      sources: {
        googleTrends: {
          available: rawSources.googleTrends.timeseries?.length > 0,
          averageValue: rawSources.googleTrends.averageValue || 0,
          relativeScore: rawSources.googleTrends.relativeScore || 0,
          error: rawSources.googleTrends.error
        },
        reddit: {
          available: (rawSources.reddit.topPosts?.length || 0) > 0,
          totalMentions: rawSources.reddit.totalMentions || 0,
          avgScore: rawSources.reddit.avgScore || 0,
          mentionsGrowth: rawSources.reddit.mentionsGrowth || 0,
          topPosts: (rawSources.reddit.topPosts || []).slice(0, 5),
          subreddits: rawSources.reddit.subreddits || [],
          error: rawSources.reddit.error
        },
        productHunt: {
          available: (rawSources.productHunt.recentLaunches?.length || 0) > 0,
          totalPosts: rawSources.productHunt.totalPosts || 0,
          avgUpvotes: rawSources.productHunt.avgUpvotes || 0,
          trendSignal: rawSources.productHunt.trendSignal || 0,
          recentLaunches: (rawSources.productHunt.recentLaunches || []).slice(0, 5),
          error: rawSources.productHunt.error
        }
      },
      aiAnalysis: {
        actionableInsights: aiAnalysis.actionableInsights || [],
        potentialPitfalls: aiAnalysis.potentialPitfalls || [],
        recommendedStrategy: aiAnalysis.recommendedStrategy || '',
        nextSteps: aiAnalysis.nextSteps || []
      },
      metadata: {
        sourcesUsed: normalizedData.metadata.sourcesUsed,
        normalizationDate: normalizedData.metadata.normalizationDate,
        rawMetrics: normalizedData.rawMetrics
      },
      cached: false
    };
    
    // Sauvegarder en cache et historique
    await Promise.allSettled([
      saveToCache(cleanTopic, country, range, result),
      saveToHistory(userId, cleanTopic, country, range, result)
    ]);
    
    console.log('✅ Trend analysis complete');
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Error in trends API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        ok: false 
      },
      { status: 500 }
    );
  }
}

// Méthode GET pour récupérer l'historique utilisateur
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('trend_history')
      .select('topic, country, range, result_json, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      ok: true,
      history: data || [],
      count: data?.length || 0
    });
    
  } catch (error) {
    console.error('❌ Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
