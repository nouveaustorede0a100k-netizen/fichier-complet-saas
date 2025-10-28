import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { getSupabaseAdmin } from '@/lib/supabase'
import { trackAndGuardUsage } from '@/lib/usage'

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic requis' }, { status: 400 })
    }

    // Récupérer l'utilisateur depuis les headers (middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier et tracker l'usage
    const usageStats = await trackAndGuardUsage(userId, 'keywords')

    // Générer les mots-clés avec OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en SEO et marketing digital. Génère des mots-clés pertinents pour des recherches de tendances et du marketing digital.'
        },
        {
          role: 'user',
          content: `Génère 20 mots-clés pertinents pour le sujet: "${topic}". Inclus des variantes, des synonymes, et des termes liés. Réponds en JSON: {"keywords": ["mot1", "mot2", ...], "categories": {"cat1": ["mot1", "mot2"], "cat2": ["mot3", "mot4"]}}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const content = completion.choices[0]?.message?.content || '{}'
    let keywordsData
    
    try {
      keywordsData = JSON.parse(content)
    } catch {
      // Fallback si le JSON n'est pas valide
      keywordsData = {
        keywords: [
          topic,
          `${topic} trends`,
          `${topic} marketing`,
          `${topic} business`,
          `${topic} opportunities`
        ],
        categories: {
          "Primary": [topic],
          "Marketing": [`${topic} marketing`, `${topic} advertising`],
          "Business": [`${topic} business`, `${topic} opportunities`]
        }
      }
    }

    // Sauvegarder dans la base de données
    try {
      const supabase = getSupabaseAdmin()
      await supabase
        .from('keyword_searches')
        .insert({
          user_id: userId,
          topic,
          keywords_data: keywordsData,
          created_at: new Date().toISOString()
        })
    } catch (dbError) {
      console.warn('Could not save to database:', dbError)
    }

    return NextResponse.json({
      success: true,
      topic,
      keywords: keywordsData.keywords || [],
      categories: keywordsData.categories || {},
      usage: usageStats,
      meta: {
        count: keywordsData.keywords?.length || 0,
        generated_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Keywords API error:', error)
    
    if (error instanceof Error && error.message.includes('Limite mensuelle atteinte')) {
      return NextResponse.json({ 
        error: error.message,
        code: 'QUOTA_EXCEEDED'
      }, { status: 429 })
    }

    return NextResponse.json({ 
      error: 'Erreur lors de la génération des mots-clés' 
    }, { status: 500 })
  }
}
