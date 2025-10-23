import { NextRequest, NextResponse } from 'next/server'
import { generateAds, AdAnalysis } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import { withAuth, createApiResponse, createErrorResponse } from '@/lib/middleware'
import { recordUsage } from '@/lib/quota'

export async function POST(request: NextRequest) {
  try {
    const { productName, targetAudience, platform } = await request.json()

    if (!productName || !targetAudience || !platform) {
      return createErrorResponse('Product name, target audience and platform are required', 400)
    }

    // Vérifier l'authentification et les quotas
    const authResult = await withAuth(request, 'adCampaigns');
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user, quotaCheck } = authResult;

    // Générer les publicités avec OpenAI
    const ads = await generateAds(productName, targetAudience, platform)

    // Formater la réponse selon le format spécifié
    const formattedAds = {
      id: `ad_campaign_${Date.now()}`,
      platform: ads.platform,
      headlines: ads.headlines,
      descriptions: ads.descriptions,
      call_to_action: ads.call_to_action,
      target_audience: ads.target_audience,
      budget_suggestion: ads.budget_suggestion,
      estimated_reach: Math.floor(Math.random() * 50000) + 10000, // Portée entre 10k-60k
      estimated_clicks: Math.floor(Math.random() * 1000) + 100, // Clics entre 100-1100
      estimated_conversions: Math.floor(Math.random() * 50) + 10, // Conversions entre 10-60
      ctr: (Math.random() * 3 + 1).toFixed(2), // CTR entre 1-4%
      cpc: `€${(Math.random() * 2 + 0.5).toFixed(2)}`, // CPC entre 0.5-2.5€
      creative_suggestions: [
        'Utiliser des couleurs vives',
        'Mettre en avant les bénéfices',
        'Ajouter des témoignages clients'
      ]
    }

    // Enregistrer l'utilisation
    await recordUsage(user.id, 'adCampaigns', { productName, targetAudience, platform }, formattedAds);

    // Sauvegarder la campagne
    try {
      const { data, error } = await supabase
        .from('ad_campaigns')
        .insert({
          user_id: user.id,
          product_name: productName,
          platform: formattedAds.platform,
          content: JSON.stringify(formattedAds),
          target_audience: formattedAds.target_audience,
          budget_suggestion: formattedAds.budget_suggestion
        })
        .select()
        .single()

      if (error) throw error

      formattedAds.id = data.id
    } catch (dbError) {
      console.warn('Could not save to database:', dbError)
      // Continue without failing
    }

    return createApiResponse({
      success: true,
      data: formattedAds,
      quota: {
        remaining: quotaCheck.remaining,
        limit: quotaCheck.limit
      },
      meta: {
        product_name: productName,
        platform,
        generated_at: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error in ads API:', error)
    return createErrorResponse(
      process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erreur lors de la génération des publicités',
      500
    )
  }
}
