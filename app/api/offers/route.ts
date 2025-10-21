import { NextRequest, NextResponse } from 'next/server'
import { generateOffer } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { productName, targetAudience, userId, projectId } = await request.json()

    if (!productName || !targetAudience) {
      return NextResponse.json({ error: 'Product name and target audience are required' }, { status: 400 })
    }

    // Générer l'offre avec OpenAI
    const offer = await generateOffer(productName, targetAudience)

    // Sauvegarder l'offre si un utilisateur est connecté
    if (userId) {
      const { data, error } = await supabase
        .from('offers')
        .insert({
          user_id: userId,
          project_id: projectId,
          title: offer.title,
          description: offer.description,
          price: offer.price,
          features: offer.features
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ ...offer, id: data.id })
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error in offers API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'offre' },
      { status: 500 }
    )
  }
}
