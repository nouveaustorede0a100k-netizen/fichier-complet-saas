import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const { priceId, email } = await request.json()

    if (!priceId || !email) {
      return NextResponse.json({ 
        error: 'priceId et email sont requis' 
      }, { status: 400 })
    }

    // Vérifier que l'email existe dans Supabase
    const supabase = getSupabaseAdmin()
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Utilisateur non trouvé' 
      }, { status: 404 })
    }

    // Créer la session de checkout
    const { session, error } = await createCheckoutSession({
      priceId,
      customerEmail: email,
      successUrl: `${SITE_URL}/dashboard?success=true`,
      cancelUrl: `${SITE_URL}/pricing?canceled=true`,
      metadata: {
        user_id: user.id,
        email: email
      }
    })

    if (error || !session) {
      console.error('Stripe checkout error:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la création de la session de paiement' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      url: session.url 
    })

  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur' 
    }, { status: 500 })
  }
}
