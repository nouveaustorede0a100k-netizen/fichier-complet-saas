import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'utilisateur depuis les headers (middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()

    // Récupérer les statistiques globales
    const [
      trendSearches,
      productAnalyses,
      adCampaigns,
      keywordSearches
    ] = await Promise.all([
      // Nombre total de recherches de tendances
      supabase
        .from('trend_searches')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
      
      // Nombre total d'analyses de produits
      supabase
        .from('product_analyses')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
      
      // Nombre total de campagnes publicitaires
      supabase
        .from('ad_campaigns')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
      
      // Nombre total de recherches de mots-clés
      supabase
        .from('keyword_searches')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
      
      // Activité récente (dernières 10 activités)
      supabase
        .from('trend_searches')
        .select('id, query, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    // Récupérer aussi l'activité des autres tables
    const [recentProducts, recentAds, recentKeywords] = await Promise.all([
      supabase
        .from('product_analyses')
        .select('id, query, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3),
      
      supabase
        .from('ad_campaigns')
        .select('id, product, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3),
      
      supabase
        .from('keyword_searches')
        .select('id, topic, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3)
    ])

    // Récupérer les activités récentes de tendances avec query
    const { data: recentTrends } = await supabase
      .from('trend_searches')
      .select('id, query, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    // Combiner toutes les activités récentes
    const allRecentActivity = [
      ...(recentTrends || []).map(item => ({
        id: item.id,
        type: 'trend_search',
        title: `Recherche de tendances: ${item.query}`,
        createdAt: item.created_at
      })),
      ...(recentProducts.data || []).map(item => ({
        id: item.id,
        type: 'product_analysis',
        title: `Analyse de produit: ${item.query}`,
        createdAt: item.created_at
      })),
      ...(recentAds.data || []).map(item => ({
        id: item.id,
        type: 'ad_campaign',
        title: `Campagne publicitaire: ${item.product}`,
        createdAt: item.created_at
      })),
      ...(recentKeywords.data || []).map(item => ({
        id: item.id,
        type: 'keyword_search',
        title: `Recherche de mots-clés: ${item.topic}`,
        createdAt: item.created_at
      }))
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      totalSearches: trendSearches.count || 0,
      totalProducts: productAnalyses.count || 0,
      totalAds: adCampaigns.count || 0,
      totalKeywords: keywordSearches.count || 0,
      recentActivity: allRecentActivity
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération des statistiques' 
    }, { status: 500 })
  }
}