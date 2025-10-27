import { NextRequest, NextResponse } from 'next/server'
import { generateAds } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import { trackAndGuardUsage } from '@/lib/usage'

export async function POST(request: NextRequest) {
  try {
    const { product, audience, platform } = await request.json()

    if (!product || !audience || !platform) {
      return NextResponse.json({ 
        error: 'Product, audience et platform sont requis' 
      }, { status: 400 })
    }

    // Récupérer l'utilisateur depuis les headers (middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier et tracker l'usage
    const usageStats = await trackAndGuardUsage(userId, 'ads')

    // Générer les publicités
    const ads = await generateAds(product, audience, platform)

    // Formater la réponse
    const formattedAds = {
      platform: ads.platform,
      headlines: ads.headlines,
      descriptions: ads.descriptions,
      call_to_action: ads.call_to_action,
      target_audience: ads.target_audience,
      budget_suggestion: ads.budget_suggestion,
      generated_at: new Date().toISOString()
    }

    // Sauvegarder dans la base de données
    try {
      await supabase
        .from('ad_campaigns')
        .insert({
          user_id: userId,
          product,
          audience,
          platform,
          campaign_data: formattedAds,
          created_at: new Date().toISOString()
        })
    } catch (dbError) {
      console.warn('Could not save to database:', dbError)
    }

    return NextResponse.json({
      success: true,
      product,
      audience,
      platform,
      ads: formattedAds,
      usage: usageStats
    })

  } catch (error) {
    console.error('Ads API error:', error)
    
    if (error instanceof Error && error.message.includes('Limite mensuelle atteinte')) {
      return NextResponse.json({ 
        error: error.message,
        code: 'QUOTA_EXCEEDED'
      }, { status: 429 })
    }

    return NextResponse.json({ 
      error: 'Erreur lors de la génération des publicités' 
    }, { status: 500 })
  }
}