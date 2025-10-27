'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap, Star, CheckCircle2, ArrowRight } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { Footer } from '@/components/footer'
import { motion } from 'framer-motion'

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">Tarification</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Commencez gratuitement et passez au niveau supérieur quand vous êtes prêt
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`relative h-full flex flex-col ${
                  key === 'pro' 
                    ? 'ring-2 ring-primary shadow-2xl scale-105 border-primary' 
                    : 'hover:shadow-lg transition-all'
                }`}
              >
                {key === 'pro' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      Populaire
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    {key === 'free' && <Crown className="w-8 h-8 text-muted-foreground" />}
                    {key === 'pro' && <Zap className="w-8 h-8 text-primary" />}
                    {key === 'business' && <Star className="w-8 h-8 text-purple-500" />}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {key === 'free' && 'Parfait pour commencer'}
                    {key === 'pro' && 'Pour les professionnels'}
                    {key === 'business' && 'Pour les entreprises'}
                  </CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price === 0 ? 'Gratuit' : `€${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/mois</span>
                    )}
                  </div>
                  {key !== 'free' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Facturation mensuelle • Annulation à tout moment
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-6 flex-1 flex flex-col">
                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
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
                        className="w-full text-lg py-6"
                        onClick={() => plan.priceId && checkout(plan.priceId)}
                        disabled={!plan.priceId || processing === plan.priceId}
                      >
                        {processing === plan.priceId ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Traitement...
                          </>
                        ) : (
                          <>
                            Choisir {plan.name}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {key !== 'free' && (
                    <p className="text-xs text-center text-muted-foreground">
                      💳 Paiement sécurisé via Stripe
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold text-foreground">
              Questions fréquentes
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Puis-je changer de plan à tout moment ?",
                answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement."
              },
              {
                question: "Que se passe-t-il si je dépasse ma limite ?",
                answer: "Vous recevrez une notification quand vous approchez de votre limite. Vous pourrez upgrader votre plan pour continuer."
              },
              {
                question: "Puis-je annuler mon abonnement ?",
                answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre dashboard. Vous conserverez l'accès jusqu'à la fin de votre période."
              },
              {
                question: "Y a-t-il un essai gratuit ?",
                answer: "Oui, le plan Free vous permet d'essayer toutes les fonctionnalités sans carte bancaire. Parfait pour commencer !"
              },
              {
                question: "Les données sont-elles sécurisées ?",
                answer: "Absolument. Nous utilisons un cryptage SSL et stockons toutes les données de manière sécurisée conforme au RGPD."
              },
              {
                question: "Quel support est inclus ?",
                answer: "Le plan Free inclut le support email. Les plans Pro et Business incluent un support prioritaire et dédié."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {faq.answer}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à commencer ?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Rejoignez des milliers d'entrepreneurs qui créent des business digitaux rentables
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => window.location.href = '/dashboard'}
                className="text-lg px-8 py-6"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
