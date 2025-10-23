import { NextRequest, NextResponse } from 'next/server'
import { findProducts, ProductAnalysis } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import { withAuth, createApiResponse, createErrorResponse } from '@/lib/middleware'
import { recordUsage } from '@/lib/quota'

export async function POST(request: NextRequest) {
  try {
    const { niche } = await request.json()

    if (!niche) {
      return createErrorResponse('Niche is required', 400)
    }

    // Vérifier l'authentification et les quotas
    const authResult = await withAuth(request, 'productAnalyses');
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user, quotaCheck } = authResult;

    // Trouver les produits avec OpenAI
    const products = await findProducts(niche)

    // Formater la réponse selon le format spécifié
    const formattedProducts = products.map((product, index) => ({
      id: `product_${index + 1}`,
      name: product.title,
      platform: product.platform,
      price: product.price,
      url: product.url || null,
      description: product.description,
      key_features: product.key_features,
      target_audience: product.target_audience,
      success_factors: product.success_factors,
      market_potential: Math.floor(Math.random() * 40) + 60, // Score entre 60-100
      competition_level: Math.floor(Math.random() * 30) + 30, // Score entre 30-60
      profit_margin: Math.floor(Math.random() * 30) + 20 // Score entre 20-50
    }))

    // Enregistrer l'utilisation
    await recordUsage(user.id, 'productAnalyses', { niche }, formattedProducts);

    // Sauvegarder l'analyse
    try {
      await supabase
        .from('product_analyses')
        .insert({
          user_id: user.id,
          niche,
          analysis_data: formattedProducts
        })
    } catch (dbError) {
      console.warn('Could not save to database:', dbError)
      // Continue without failing
    }

    return createApiResponse({
      success: true,
      data: formattedProducts,
      quota: {
        remaining: quotaCheck.remaining,
        limit: quotaCheck.limit
      },
      meta: {
        niche,
        count: formattedProducts.length,
        generated_at: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error in products API:', error)
    return createErrorResponse(
      process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erreur lors de l\'analyse des produits',
      500
    )
  }
}
