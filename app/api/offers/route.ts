import { NextRequest, NextResponse } from 'next/server'
import { generateOffer, OfferAnalysis } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { niche, userId } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    // Vérifier le plan utilisateur (placeholder pour l'instant)
    const userPlan = 'free' // TODO: Récupérer le vrai plan utilisateur depuis Supabase

    // Générer l'offre avec OpenAI
    const offer = await generateOffer(niche)

    // Formater la réponse selon le format spécifié
    const formattedOffer = {
      id: `offer_${Date.now()}`,
      title: offer.title,
      promise: offer.promise,
      benefits: offer.benefits,
      sales_page: offer.sales_page,
      email_copy: offer.email_copy,
      price: `€${Math.floor(Math.random() * 200) + 50}`, // Prix entre 50-250€
      conversion_rate: Math.floor(Math.random() * 15) + 5, // Taux entre 5-20%
      urgency_level: Math.floor(Math.random() * 3) + 1, // Niveau entre 1-3
      social_proof: [
        '500+ clients satisfaits',
        '4.8/5 étoiles',
        'Recommandé par les experts'
      ]
    }

    // Sauvegarder l'offre si un utilisateur est connecté
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('offers')
          .insert({
            user_id: userId,
            title: formattedOffer.title,
            description: formattedOffer.promise,
            price: formattedOffer.price,
            features: formattedOffer.benefits,
            sales_page: formattedOffer.sales_page,
            email_copy: formattedOffer.email_copy,
            user_plan: userPlan
          })
          .select()
          .single()

        if (error) throw error

        formattedOffer.id = data.id
      } catch (dbError) {
        console.warn('Could not save to database:', dbError)
        // Continue without failing
      }
    }

    return NextResponse.json({
      success: true,
      data: formattedOffer,
      meta: {
        niche,
        generated_at: new Date().toISOString(),
        user_plan: userPlan
      }
    })
  } catch (error) {
    console.error('Error in offers API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la génération de l\'offre',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}
