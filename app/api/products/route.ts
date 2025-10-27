import { NextRequest, NextResponse } from 'next/server'
import { findProducts } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import { trackAndGuardUsage } from '@/lib/usage'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query requise' }, { status: 400 })
    }

    // Récupérer l'utilisateur depuis les headers (middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier et tracker l'usage
    const usageStats = await trackAndGuardUsage(userId, 'products')

    // Générer l'analyse des produits
    const products = await findProducts(query)

    // Formater la réponse
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
      market_potential: Math.floor(Math.random() * 40) + 60,
      competition_level: Math.floor(Math.random() * 30) + 30,
      profit_margin: Math.floor(Math.random() * 30) + 20
    }))

    // Sauvegarder dans la base de données
    try {
      await supabase
        .from('product_analyses')
        .insert({
          user_id: userId,
          query,
          analysis_data: formattedProducts,
          created_at: new Date().toISOString()
        })
    } catch (dbError) {
      console.warn('Could not save to database:', dbError)
    }

    return NextResponse.json({
      success: true,
      query,
      products: formattedProducts,
      usage: usageStats,
      meta: {
        count: formattedProducts.length,
        generated_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Products API error:', error)
    
    if (error instanceof Error && error.message.includes('Limite mensuelle atteinte')) {
      return NextResponse.json({ 
        error: error.message,
        code: 'QUOTA_EXCEEDED'
      }, { status: 429 })
    }

    return NextResponse.json({ 
      error: 'Erreur lors de l\'analyse des produits' 
    }, { status: 500 })
  }
}