import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Gérer les événements
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const userId = session.metadata?.userId

          if (userId) {
            // Déterminer le plan basé sur le price ID
            const priceId = subscription.items.data[0].price.id
            let plan = 'free'

            if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
              plan = 'pro'
            } else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
              plan = 'premium'
            }

            // Mettre à jour l'utilisateur dans Supabase
            await supabase
              .from('users')
              .update({ 
                plan: plan,
                stripe_customer_id: session.customer as string
              })
              .eq('id', userId)

            console.log(`User ${userId} upgraded to ${plan} plan`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Récupérer l'utilisateur par customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          const priceId = subscription.items.data[0].price.id
          let plan = 'free'

          if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
            plan = 'pro'
          } else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
            plan = 'premium'
          }

          await supabase
            .from('users')
            .update({ plan: plan })
            .eq('id', user.id)

          console.log(`User ${user.id} plan updated to ${plan}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Récupérer l'utilisateur par customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          // Rétrograder vers le plan gratuit
          await supabase
            .from('users')
            .update({ plan: 'free' })
            .eq('id', user.id)

          console.log(`User ${user.id} downgraded to free plan`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Récupérer l'utilisateur par customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          // Optionnel: envoyer un email de notification
          console.log(`Payment failed for user ${user.id}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
