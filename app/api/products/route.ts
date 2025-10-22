import { NextRequest, NextResponse } from 'next/server'
import { findProducts, ProductAnalysis } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { niche, userId } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    // Vérifier le plan utilisateur (placeholder pour l'instant)
    const userPlan = 'free' // TODO: Récupérer le vrai plan utilisateur depuis Supabase

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

    // Sauvegarder l'analyse si un utilisateur est connecté
    if (userId) {
      try {
        await supabase
          .from('product_analyses')
          .insert({
            user_id: userId,
            niche,
            analysis_data: formattedProducts,
            user_plan: userPlan
          })
      } catch (dbError) {
        console.warn('Could not save to database:', dbError)
        // Continue without failing
      }
    }

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      meta: {
        niche,
        count: formattedProducts.length,
        generated_at: new Date().toISOString(),
        user_plan: userPlan
      }
    })
  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de l\'analyse des produits',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}
