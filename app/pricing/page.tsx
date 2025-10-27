'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap, Star } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe'

export default function PricingPage() {
  const { user, loading: authLoading } = useAuth()
  const [processing, setProcessing] = useState<string | null>(null)

  const checkout = async (priceId: string) => {
    if (!user?.email) {
      alert('Veuillez vous connecter pour continuer')
      return
    }

    setProcessing(priceId)
    
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId, 
          email: user.email 
        }),
      })
      
      const { url, error } = await res.json()
      
      if (error) {
        throw new Error(error)
      }
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Erreur lors de la création de la session de paiement')
    } finally {
      setProcessing(null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Commencez gratuitement et passez au niveau supérieur quand vous êtes prêt
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <Card 
              key={key} 
              className={`relative ${
                key === 'pro' 
                  ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                  : 'hover:shadow-lg transition-shadow'
              }`}
            >
              {key === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Populaire
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  {key === 'free' && <Crown className="w-8 h-8 text-gray-400" />}
                  {key === 'pro' && <Zap className="w-8 h-8 text-blue-500" />}
                  {key === 'business' && <Star className="w-8 h-8 text-purple-500" />}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {key === 'free' && 'Parfait pour commencer'}
                  {key === 'pro' && 'Pour les professionnels'}
                  {key === 'business' && 'Pour les entreprises'}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === 0 ? 'Gratuit' : `€${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/mois</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  {key === 'free' ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled
                    >
                      Plan actuel
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => plan.priceId && checkout(plan.priceId)}
                      disabled={!plan.priceId || processing === plan.priceId}
                    >
                      {processing === plan.priceId ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Traitement...
                        </>
                      ) : (
                        `Choisir ${plan.name}`
                      )}
                    </Button>
                  )}
                </div>

                {key !== 'free' && (
                  <p className="text-xs text-gray-500 text-center">
                    Facturation mensuelle • Annulation à tout moment
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-gray-600">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                Les changements prennent effet immédiatement.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Que se passe-t-il si je dépasse ma limite ?
              </h3>
              <p className="text-gray-600">
                Vous recevrez une notification quand vous approchez de votre limite. 
                Vous pourrez upgrader votre plan pour continuer à utiliser le service.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Puis-je annuler mon abonnement ?
              </h3>
              <p className="text-gray-600">
                Oui, vous pouvez annuler votre abonnement à tout moment depuis votre dashboard. 
                Vous conserverez l'accès jusqu'à la fin de votre période de facturation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}