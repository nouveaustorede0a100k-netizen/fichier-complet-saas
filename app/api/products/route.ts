import { NextRequest, NextResponse } from 'next/server'
import { analyzeProducts } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { category, userId } = await request.json()

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    // Analyser les produits avec OpenAI
    const analysis = await analyzeProducts(category)

    // Sauvegarder l'analyse si un utilisateur est connecté
    if (userId) {
      await supabase
        .from('product_analyses')
        .insert({
          user_id: userId,
          product_name: category,
          category,
          analysis_data: analysis
        })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse des produits' },
      { status: 500 }
    )
  }
}
