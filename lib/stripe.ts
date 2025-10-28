import Stripe from 'stripe'
import { randomUUID } from 'crypto'

const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2024-06-20'

interface CheckoutSessionParams {
  priceId: string
  customerEmail: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

class MockStripe {
  public customers = {
    create: async ({ email }: { email: string; metadata?: Record<string, string> }) => {
      return { id: `cus_${randomUUID()}`, email }
    }
  }

  public checkout = {
    sessions: {
      create: async (params: Stripe.Checkout.SessionCreateParams) => {
        return {
          id: `cs_${randomUUID()}`,
          url: params.success_url ?? 'https://example.com/success',
          ...params
        }
      }
    }
  }

  public webhooks = {
    constructEvent: (body: string) => {
      try {
        return JSON.parse(body)
      } catch (error) {
        throw new Error(`Invalid webhook payload: ${String(error)}`)
      }
    }
  }
}

const hasStripeSecret = Boolean(process.env.STRIPE_SECRET_KEY)

export const stripe: Stripe | MockStripe = hasStripeSecret
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: STRIPE_API_VERSION })
  : new MockStripe()

export type SubscriptionPlanKey = 'free' | 'pro' | 'business'

export interface SubscriptionPlan {
  name: string
  price: number
  priceId?: string
  features: string[]
}

const DEFAULT_PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_mock_pro'
const DEFAULT_BUSINESS_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS || 'price_mock_business'

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanKey, SubscriptionPlan> = {
  free: {
    name: 'Starter',
    price: 0,
    features: [
      '10 recherches de tendances / mois',
      '5 analyses produits / mois',
      'Support communautaire'
    ]
  },
  pro: {
    name: 'Pro',
    price: 49,
    priceId: DEFAULT_PRO_PRICE_ID,
    features: [
      '100 recherches de tendances / mois',
      '60 analyses produits / mois',
      'Automatisations avancées',
      'Support prioritaire'
    ]
  },
  business: {
    name: 'Business',
    price: 149,
    priceId: DEFAULT_BUSINESS_PRICE_ID,
    features: [
      '500 recherches de tendances / mois',
      '200 analyses produits / mois',
      'Comptes collaborateurs',
      'Success manager dédié'
    ]
  }
}

export async function createCheckoutSession({
  priceId,
  customerEmail,
  successUrl,
  cancelUrl,
  metadata
}: CheckoutSessionParams) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: metadata ?? {}
    })

    return { session, error: null }
  } catch (error) {
    return { session: null, error }
  }
}
