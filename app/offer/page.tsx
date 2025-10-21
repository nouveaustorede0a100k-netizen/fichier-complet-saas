"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { 
  Package, 
  ArrowRight, 
  Loader2, 
  Copy, 
  Check,
  DollarSign,
  Target,
  Users,
  Star,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"

interface Offer {
  title: string
  subtitle: string
  description: string
  price: number
  features: string[]
  benefits: string[]
  objections: string[]
  urgency: string
  social_proof: string[]
}

export default function OfferPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [productName, setProductName] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [loading, setLoading] = useState(false)
  const [offer, setOffer] = useState<Offer | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState("")

  const handleGenerate = async () => {
    if (!productName.trim() || !targetAudience.trim()) {
      setError("Veuillez entrer le nom du produit et le public cible")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productName,
          targetAudience,
          userId: user?.id 
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération')
      }

      const data = await response.json()
      setOffer(data)
    } catch (err) {
      setError("Erreur lors de la génération de l'offre. Veuillez réessayer.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Offer Builder</h1>
          <p className="text-muted-foreground">
            Créez des offres percutantes et convertissantes pour vos produits digitaux avec l'IA
          </p>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Génération d'Offre IA
            </CardTitle>
            <CardDescription>
              Décrivez votre produit et votre public cible pour générer une offre complète
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nom du Produit
                </label>
                <Input
                  placeholder="Ex: Formation Complète en Design UX"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Public Cible
                </label>
                <Input
                  placeholder="Ex: designers débutants, entrepreneurs..."
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Générer l'Offre
                </>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {/* Generated Offer */}
        {offer && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Offre Générée</h2>
              <Button variant="outline" size="sm" onClick={() => router.push("/ads")} className="gap-2">
                Créer des Publicités
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid gap-6">
              {/* Main Offer */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      Offre Principale
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(offer.title, "title")}
                    >
                      {copied === "title" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-2">{offer.title}</h3>
                    <p className="text-xl text-muted-foreground mb-4">{offer.subtitle}</p>
                  </div>
                  <p className="text-foreground text-lg leading-relaxed">{offer.description}</p>
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <span className="text-4xl font-bold text-primary">{offer.price}€</span>
                    <span className="text-muted-foreground">paiement unique</span>
                  </div>
                </CardContent>
              </Card>

              {/* Features & Benefits */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Fonctionnalités
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(offer.features.join("\n"), "features")}
                      >
                        {copied === "features" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {offer.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Bénéfices
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(offer.benefits.join("\n"), "benefits")}
                      >
                        {copied === "benefits" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {offer.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Objections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Gestion des Objections
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(offer.objections.join("\n"), "objections")}
                    >
                      {copied === "objections" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {offer.objections.map((objection, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">
                            Objection {index + 1}
                          </Badge>
                          <p className="text-foreground">{objection}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Urgency & Social Proof */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-orange-500" />
                        Urgence
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(offer.urgency, "urgency")}
                      >
                        {copied === "urgency" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <p className="text-foreground font-medium">{offer.urgency}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Preuve Sociale
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(offer.social_proof.join("\n"), "social_proof")}
                      >
                        {copied === "social_proof" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {offer.social_proof.map((proof, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{proof}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Conseils pour Optimiser vos Offres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Titre accrocheur</h4>
                <p className="text-sm text-muted-foreground">
                  Utilisez des mots puissants et des bénéfices clairs dans votre titre
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Prix psychologique</h4>
                <p className="text-sm text-muted-foreground">
                  Testez différents prix pour trouver le sweet spot de votre marché
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Preuve sociale</h4>
                <p className="text-sm text-muted-foreground">
                  Ajoutez des témoignages et des statistiques pour renforcer la crédibilité
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}