import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth, createApiResponse, createErrorResponse } from '@/lib/middleware'
import { QUOTA_LIMITS } from '@/lib/quota'

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await withAuth(request, 'trendSearches');
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    // Récupérer le plan de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user plan:', userError)
      return createErrorResponse('Erreur lors de la récupération du plan utilisateur', 500)
    }

    const plan = userData?.plan || 'free'
    const today = new Date().toISOString().split('T')[0]

    // Compter les utilisations du jour pour chaque module
    const [trendSearches, productAnalyses, offers, adCampaigns, launchPlans] = await Promise.all([
      supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('module', 'trendSearches')
        .gte('created_at', `${today}T00:00:00.000Z`),
      
      supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('module', 'productAnalyses')
        .gte('created_at', `${today}T00:00:00.000Z`),
      
      supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('module', 'offers')
        .gte('created_at', `${today}T00:00:00.000Z`),
      
      supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('module', 'adCampaigns')
        .gte('created_at', `${today}T00:00:00.000Z`),
      
      supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('module', 'launchPlans')
        .gte('created_at', `${today}T00:00:00.000Z`)
    ])

    // Compter les utilisations totales
    const [totalTrendSearches, totalProductAnalyses, totalOffers, totalAdCampaigns, totalLaunchPlans] = await Promise.all([
      supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('module', 'trendSearches'),
      
      supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('module', 'productAnalyses'),
      
      supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('module', 'offers'),
      
      supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('module', 'adCampaigns'),
      
      supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('module', 'launchPlans')
    ])

    const limits = QUOTA_LIMITS[plan as keyof typeof QUOTA_LIMITS]

    const stats = {
      trendSearches: totalTrendSearches.count || 0,
      productAnalyses: totalProductAnalyses.count || 0,
      offers: totalOffers.count || 0,
      adCampaigns: totalAdCampaigns.count || 0,
      launchPlans: totalLaunchPlans.count || 0,
      plan,
      quota: {
        trendSearches: {
          used: trendSearches.count || 0,
          limit: limits.trendSearches
        },
        productAnalyses: {
          used: productAnalyses.count || 0,
          limit: limits.productAnalyses
        },
        offers: {
          used: offers.count || 0,
          limit: limits.offers
        },
        adCampaigns: {
          used: adCampaigns.count || 0,
          limit: limits.adCampaigns
        },
        launchPlans: {
          used: launchPlans.count || 0,
          limit: limits.launchPlans
        }
      }
    }

    return createApiResponse(stats)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return createErrorResponse(
      process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erreur lors de la récupération des statistiques',
      500
    )
  }
}
