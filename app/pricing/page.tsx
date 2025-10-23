'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Crown, Zap, Star } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Gratuit',
    price: 0,
    period: 'toujours',
    description: 'Parfait pour commencer',
    features: [
      '3 recherches de tendances par mois',
      '1 analyse de produit par mois',
      '1 offre générée par mois',
      '0 campagne publicitaire',
      '1 plan de lancement par mois',
      'Support par email'
    ],
    limitations: [
      'Pas de campagnes publicitaires',
      'Quotas limités',
      'Pas d\'export de données'
    ],
    buttonText: 'Commencer gratuitement',
    buttonVariant: 'outline' as const,
    popular: false,
    color: 'border-gray-200'
  },
  {
    name: 'Pro',
    price: 29,
    period: 'mois',
    description: 'Pour les entrepreneurs sérieux',
    features: [
      'Recherches de tendances illimitées',
      'Analyses de produits illimitées',
      'Offres illimitées',
      '10 campagnes publicitaires par mois',
      'Plans de lancement illimités',
      'Support prioritaire',
      'Export des données',
      'API access'
    ],
    limitations: [],
    buttonText: 'Passer au Pro',
    buttonVariant: 'default' as const,
    popular: true,
    color: 'border-blue-500',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
  },
  {
    name: 'Premium',
    price: 79,
    period: 'mois',
    description: 'Pour les agences et équipes',
    features: [
      'Tout du plan Pro',
      'Campagnes publicitaires illimitées',
      'Assistant de lancement avancé',
      'Intégrations API complètes',
      'Support téléphonique',
      'Formation personnalisée',
      'Comptes d\'équipe',
      'Analytics avancés'
    ],
    limitations: [],
    buttonText: 'Passer au Premium',
    buttonVariant: 'default' as const,
    popular: false,
    color: 'border-purple-500',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
  }
]

export default function PricingPage() {
  const { user, loading } = useAuth()
  const [processing, setProcessing] = useState<string | null>(null)

  const handleUpgrade = async (planName: string, priceId?: string) => {
    if (!user) {
      // Rediriger vers la page de connexion
      window.location.href = '/auth'
      return
    }

    if (planName === 'Gratuit') {
      // Le plan gratuit est déjà actif
      return
    }

    if (!priceId) {
      console.error('Price ID not found for plan:', planName)
      return
    }

    setProcessing(planName)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          priceId,
          userId: user.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement')
      }

      // Rediriger vers Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Error upgrading plan:', error)
      alert('Erreur lors de la mise à niveau. Veuillez réessayer.')
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan Drop Eazy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Débloquez tout le potentiel de votre business digital avec nos outils IA puissants
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''} ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Le plus populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  {plan.description}
                </CardDescription>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">€{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500 line-through">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.buttonVariant}
                  size="lg"
                  onClick={() => handleUpgrade(plan.name, plan.stripePriceId)}
                  disabled={processing === plan.name}
                >
                  {processing === plan.name ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      {plan.name === 'Pro' && <Crown className="w-4 h-4 mr-2" />}
                      {plan.name === 'Premium' && <Zap className="w-4 h-4 mr-2" />}
                      {plan.buttonText}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions fréquentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-gray-600">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                Les changements prennent effet immédiatement.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Que se passe-t-il si je dépasse mes quotas ?
              </h3>
              <p className="text-gray-600">
                Vous recevrez une notification et pourrez upgrader votre plan 
                pour continuer à utiliser les fonctionnalités.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Puis-je annuler mon abonnement ?
              </h3>
              <p className="text-gray-600">
                Oui, vous pouvez annuler votre abonnement à tout moment depuis 
                votre dashboard. Aucun frais d'annulation.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mes données sont-elles sécurisées ?
              </h3>
              <p className="text-gray-600">
                Absolument. Nous utilisons un chiffrement de niveau bancaire 
                et ne partageons jamais vos données avec des tiers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à transformer votre business ?
          </h2>
          <p className="text-gray-600 mb-8">
            Rejoignez des milliers d'entrepreneurs qui utilisent Drop Eazy pour réussir
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Essayer gratuitement
              </Button>
            </Link>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Crown className="w-5 h-5 mr-2" />
              Commencer avec Pro
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
