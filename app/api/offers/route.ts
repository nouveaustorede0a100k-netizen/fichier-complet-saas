import { NextRequest, NextResponse } from 'next/server'
import { generateOffer, OfferAnalysis } from '@/lib/openai'
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
    const authResult = await withAuth(request, 'offers');
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user, quotaCheck } = authResult;

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

    // Enregistrer l'utilisation
    await recordUsage(user.id, 'offers', { niche }, formattedOffer);

    // Sauvegarder l'offre
    try {
      const { data, error } = await supabase
        .from('offers')
        .insert({
          user_id: user.id,
          title: formattedOffer.title,
          description: formattedOffer.promise,
          price: formattedOffer.price,
          features: formattedOffer.benefits,
          sales_page: formattedOffer.sales_page,
          email_copy: formattedOffer.email_copy
        })
        .select()
        .single()

      if (error) throw error

      formattedOffer.id = data.id
    } catch (dbError) {
      console.warn('Could not save to database:', dbError)
      // Continue without failing
    }

    return createApiResponse({
      success: true,
      data: formattedOffer,
      quota: {
        remaining: quotaCheck.remaining,
        limit: quotaCheck.limit
      },
      meta: {
        niche,
        generated_at: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error in offers API:', error)
    return createErrorResponse(
      process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erreur lors de la génération de l\'offre',
      500
    )
  }
}
