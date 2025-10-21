import { NextRequest, NextResponse } from 'next/server'
import { analyzeTrends } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { query, userId } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Analyser les tendances avec OpenAI
    const analysis = await analyzeTrends(query)

    // Sauvegarder la recherche si un utilisateur est connecté
    if (userId) {
      await supabase
        .from('trend_searches')
        .insert({
          user_id: userId,
          query,
          results: analysis
        })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in trends API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse des tendances' },
      { status: 500 }
    )
  }
}
