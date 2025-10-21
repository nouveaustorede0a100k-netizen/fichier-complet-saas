"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { 
  Megaphone, 
  ArrowRight, 
  Loader2, 
  Copy, 
  Check,
  Target,
  DollarSign,
  Users,
  TrendingUp,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"

interface Ad {
  platform: string
  headlines: string[]
  descriptions: string[]
  call_to_action: string[]
  target_audience: string
  budget_suggestion: string
}

export default function AdsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [offerTitle, setOfferTitle] = useState("")
  const [platform, setPlatform] = useState("")
  const [loading, setLoading] = useState(false)
  const [ads, setAds] = useState<Ad | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState("")

  const handleGenerate = async () => {
    if (!offerTitle.trim() || !platform.trim()) {
      setError("Veuillez entrer le titre de l'offre et la plateforme")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          offerTitle,
          platform,
          userId: user?.id 
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération')
      }

      const data = await response.json()
      setAds(data)
    } catch (err) {
      setError("Erreur lors de la génération des publicités. Veuillez réessayer.")
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
          <h1 className="text-3xl font-bold text-foreground">Ad Generator</h1>
          <p className="text-muted-foreground">
            Générez des publicités performantes et convertissantes pour vos produits digitaux
          </p>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Génération de Publicités IA
            </CardTitle>
            <CardDescription>
              Créez des publicités accrocheuses et performantes pour différentes plateformes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Titre de l'Offre
                </label>
                <Input
                  placeholder="Ex: Formation Complète en Design UX"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Plateforme
                </label>
                <Input
                  placeholder="Ex: Facebook, Google, Instagram, LinkedIn..."
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
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
                  <Megaphone className="w-4 h-4" />
                  Générer les Publicités
                </>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {/* Generated Ads */}
        {ads && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Publicités Générées pour {ads.platform}
              </h2>
              <Button variant="outline" size="sm" onClick={() => router.push("/launch")} className="gap-2">
                Plan de Lancement
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid gap-6">
              {/* Headlines */}
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      Titres Accrocheurs
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(ads.headlines.join("\n"), "headlines")}
                    >
                      {copied === "headlines" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {ads.headlines.map((headline, index) => (
                      <div key={index} className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-foreground">{headline}</p>
                          <Badge variant="outline" className="ml-2">
                            {index + 1}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Descriptions */}
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      Descriptions
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(ads.descriptions.join("\n"), "descriptions")}
                    >
                      {copied === "descriptions" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {ads.descriptions.map((description, index) => (
                      <div key={index} className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <div className="flex items-start justify-between">
                          <p className="text-foreground">{description}</p>
                          <Badge variant="outline" className="ml-2">
                            {index + 1}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Call to Actions */}
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                      Appels à l'Action
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(ads.call_to_action.join("\n"), "cta")}
                    >
                      {copied === "cta" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {ads.call_to_action.map((cta, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium border border-purple-200 dark:border-purple-800">
                          {cta}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Target Audience & Budget */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Public Cible
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-foreground">{ads.target_audience}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Suggestion de Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-foreground">{ads.budget_suggestion}</p>
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
              <Megaphone className="w-5 h-5 text-primary" />
              Conseils pour Optimiser vos Publicités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Testez différents titres</h4>
                <p className="text-sm text-muted-foreground">
                  Utilisez plusieurs variations pour identifier les plus performantes
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Ciblez précisément</h4>
                <p className="text-sm text-muted-foreground">
                  Affinez votre public cible pour maximiser la pertinence de vos annonces
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Budget progressif</h4>
                <p className="text-sm text-muted-foreground">
                  Commencez petit et augmentez le budget sur les campagnes performantes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}