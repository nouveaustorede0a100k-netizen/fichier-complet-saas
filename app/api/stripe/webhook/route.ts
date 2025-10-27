import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const email = session.customer_email
        const priceId = session.metadata?.priceId || session.line_items?.data?.[0]?.price?.id

        if (!email || !priceId) {
          console.error('Missing email or priceId in checkout session')
          break
        }

        // Déterminer le plan basé sur le price ID
        let plan = 'free'
        let monthlyLimit = 100

        if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO) {
          plan = 'pro'
          monthlyLimit = 1000
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS) {
          plan = 'business'
          monthlyLimit = 5000
        }

        // Trouver l'utilisateur par email
        const { data: user, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single()

        if (userError || !user) {
          console.error('User not found for email:', email)
          break
        }

        // Mettre à jour ou créer l'abonnement
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            plan,
            active: true,
            monthly_limit: monthlyLimit,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            updated_at: new Date().toISOString()
          })

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError)
        } else {
          console.log(`Subscription updated for user ${user.id}: ${plan} plan`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const customerId = subscription.customer

        // Récupérer l'utilisateur par customer ID
        const { data: user, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userError || !user) {
          console.error('User not found for customer ID:', customerId)
          break
        }

        // Mettre à jour le statut de l'abonnement
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            active: subscription.status === 'active',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('Error updating subscription status:', updateError)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const customerId = subscription.customer

        // Récupérer l'utilisateur par customer ID
        const { data: user, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userError || !user) {
          console.error('User not found for customer ID:', customerId)
          break
        }

        // Désactiver l'abonnement
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            active: false,
            plan: 'free',
            monthly_limit: 100,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('Error deactivating subscription:', updateError)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}