import { NextRequest } from 'next/server'
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createApiResponse, createErrorResponse } from '@/lib/middleware'

const SUCCESS_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json()

    if (!priceId || !userId) {
      return createErrorResponse('Price ID and User ID are required', 400)
    }

    const supabase = getSupabaseAdmin()
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, email, stripe_customer_id')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return createErrorResponse('User not found', 404)
    }

    let customerId = user.stripe_customer_id as string | null

    if (!customerId && 'customers' in stripe) {
      const customer = await (stripe as any).customers.create({
        email: user.email,
        metadata: { userId }
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${SUCCESS_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SUCCESS_URL}/pricing?canceled=true`,
      customer: customerId ?? undefined,
      customer_email: user.email,
      metadata: {
        userId,
        priceId
      }
    })

    const plan = Object.values(SUBSCRIPTION_PLANS).find((subscriptionPlan) => subscriptionPlan.priceId === priceId)

    return createApiResponse({
      sessionId: session.id,
      url: (session as any).url ?? null,
      plan: plan?.name ?? 'custom'
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return createErrorResponse(
      process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erreur lors de la création de la session de paiement',
      500
    )
  }
}
