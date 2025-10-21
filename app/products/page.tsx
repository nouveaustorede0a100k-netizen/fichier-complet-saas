"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { 
  Search, 
  ArrowRight, 
  Loader2, 
  Star, 
  TrendingUp, 
  DollarSign,
  Target,
  Users,
  BarChart3
} from "lucide-react"
import { motion } from "framer-motion"

interface Product {
  name: string
  category: string
  market_size: string
  competition_level: string
  profit_potential: number
  difficulty: number
  description: string
  target_audience: string[]
}

export default function ProductsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Veuillez entrer une catégorie ou un type de produit")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          category: query,
          userId: user?.id 
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      setError("Erreur lors de l'analyse des produits. Veuillez réessayer.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return "text-green-500"
    if (difficulty <= 6) return "text-yellow-500"
    return "text-red-500"
  }

  const getProfitColor = (profit: number) => {
    if (profit >= 7) return "text-green-500"
    if (profit >= 4) return "text-yellow-500"
    return "text-red-500"
  }

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 3) return "Facile"
    if (difficulty <= 6) return "Moyen"
    return "Difficile"
  }

  const getProfitText = (profit: number) => {
    if (profit >= 7) return "Élevé"
    if (profit >= 4) return "Moyen"
    return "Faible"
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Product Finder</h1>
          <p className="text-muted-foreground">
            Découvrez des produits digitaux rentables et analysez leur potentiel de marché
          </p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Analyse de Produits
            </CardTitle>
            <CardDescription>
              Entrez une catégorie ou un type de produit pour analyser les opportunités de marché
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Ex: formations en ligne, templates, ebooks, logiciels, applications..."
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
                    <Search className="w-4 h-4" />
                    Analyser
                  </>
                )}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {/* Results Section */}
        {products.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Opportunités Découvertes ({products.length})
              </h2>
              <Button variant="outline" size="sm" onClick={() => router.push("/offer")} className="gap-2">
                Créer une Offre
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:border-primary transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                            <Badge variant="secondary">{product.category}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{product.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {product.target_audience.map((audience, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {audience}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Potentiel de profit</p>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span className={`text-2xl font-bold ${getProfitColor(product.profit_potential)}`}>
                                {product.profit_potential}/10
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {getProfitText(product.profit_potential)}
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Difficulté</p>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-muted-foreground" />
                              <span className={`text-2xl font-bold ${getDifficultyColor(product.difficulty)}`}>
                                {product.difficulty}/10
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {getDifficultyText(product.difficulty)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Taille du marché</p>
                            <p className="font-medium capitalize">{product.market_size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Niveau de concurrence</p>
                            <p className="font-medium capitalize">{product.competition_level}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {product.target_audience.length} segments
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
                <h4 className="font-semibold text-foreground">Potentiel de profit élevé</h4>
                <p className="text-sm text-muted-foreground">
                  Privilégiez les produits avec un score de 7+ pour maximiser vos revenus
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Difficulté de création</h4>
                <p className="text-sm text-muted-foreground">
                  Commencez par des produits faciles (score 1-3) pour vos premiers lancements
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Marché et concurrence</h4>
                <p className="text-sm text-muted-foreground">
                  Équilibrez entre un marché suffisamment grand et une concurrence modérée
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}