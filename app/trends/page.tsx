"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Search, 
  ArrowRight, 
  Loader2, 
  BarChart3,
  Target,
  Zap,
  Globe
} from "lucide-react"
import { motion } from "framer-motion"

interface Trend {
  name: string
  score: number
  growth: number
  related_terms: string[]
  category: string
  description: string
}

const mockTrends: Trend[] = [
  {
    name: "IA & Productivité",
    score: 95,
    growth: 23,
    category: "Technologie",
    description: "L'intelligence artificielle transforme la productivité au travail",
    related_terms: ["ChatGPT", "Automatisation", "Outils IA", "Efficacité"]
  },
  {
    name: "Formation en Ligne",
    score: 88,
    growth: 18,
    category: "Éducation",
    description: "L'apprentissage en ligne explose avec de nouvelles plateformes",
    related_terms: ["Cours en ligne", "E-learning", "Formation", "Compétences"]
  },
  {
    name: "Bien-être Mental",
    score: 82,
    growth: 31,
    category: "Santé",
    description: "Focus croissant sur la santé mentale et le bien-être",
    related_terms: ["Méditation", "Thérapie", "Mindfulness", "Stress"]
  },
  {
    name: "Écologie & Durabilité",
    score: 79,
    growth: 15,
    category: "Environnement",
    description: "Conscience écologique et mode de vie durable",
    related_terms: ["Écologie", "Zéro déchet", "Énergies vertes", "Consommation responsable"]
  }
]

export default function TrendsPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [trends, setTrends] = useState<Trend[]>([])
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Veuillez entrer un mot-clé ou une thématique")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulation d'une recherche IA
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Pour l'instant, on utilise des données mockées
      // Plus tard, on intégrera l'API OpenAI
      setTrends(mockTrends)
    } catch (err) {
      setError("Erreur lors de l'analyse des tendances. Veuillez réessayer.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 20) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (growth > 10) return <ArrowRight className="w-4 h-4 text-yellow-500" />
    return <ArrowRight className="w-4 h-4 text-red-500 rotate-180" />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Trend Finder</h1>
          <p className="text-muted-foreground">
            Découvrez les niches et tendances montantes pour créer des produits digitaux rentables
          </p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Recherche de Tendances
            </CardTitle>
            <CardDescription>
              Entrez un mot-clé, une compétence ou une thématique pour analyser les opportunités de marché
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Ex: design, nutrition, IA, productivité, bien-être..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyse...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Analyser
                  </>
                )}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {/* Results Section */}
        {trends.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Tendances Découvertes ({trends.length})
              </h2>
              <Badge variant="outline" className="gap-1">
                <Zap className="w-3 h-3" />
                Analyse IA
              </Badge>
            </div>

            <div className="grid gap-6">
              {trends.map((trend, index) => (
                <motion.div
                  key={trend.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:border-primary transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-foreground">{trend.name}</h3>
                            <Badge variant="secondary">{trend.category}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{trend.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {trend.related_terms.map((term, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {term}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Score de tendance</p>
                              <p className="text-2xl font-bold text-foreground">{trend.score}%</p>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${getScoreColor(trend.score)}`} />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getGrowthIcon(trend.growth)}
                            <span className="text-sm font-medium text-foreground">+{trend.growth}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            Opportunité élevée
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            Marché global
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="gap-2">
                          Analyser plus
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Conseils pour Maximiser vos Résultats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Mots-clés spécifiques</h4>
                <p className="text-sm text-muted-foreground">
                  Utilisez des termes précis plutôt que des mots génériques pour des résultats plus ciblés
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Analyse des scores</h4>
                <p className="text-sm text-muted-foreground">
                  Les tendances avec un score supérieur à 80% offrent les meilleures opportunités
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Croissance continue</h4>
                <p className="text-sm text-muted-foreground">
                  Surveillez les tendances avec une croissance positive pour des opportunités durables
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
