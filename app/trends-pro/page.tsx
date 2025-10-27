"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendCard } from "@/components/TrendCard"
import { TrendChart } from "@/components/TrendChart"
import { 
  Search, 
  Loader2, 
  TrendingUp, 
  AlertCircle,
  History,
  BarChart3
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function TrendsProPage() {
  const { user } = useAuth()
  const [topic, setTopic] = useState("")
  const [country, setCountry] = useState("US")
  const [range, setRange] = useState("30d")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentTrend, setCurrentTrend] = useState<any>(null)
  const [history, setHistory] = useState([])

  // Charger l'historique au montage
  useEffect(() => {
    if (user) {
      loadHistory()
    }
  }, [user])

  // Charger l'historique depuis l'API
  const loadHistory = async () => {
    try {
      const response = await fetch(`/api/trends-pro?userId=${user?.id}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
      }
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  // Analyser une tendance
  const analyzeTrend = async () => {
    if (!topic.trim()) {
      setError("Veuillez entrer un topic à analyser")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/trends-pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          country,
          range,
          userId: user?.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'analyse')
      }

      const data = await response.json()
      setCurrentTrend(data)
      
      // Recharger l'historique
      if (user) {
        loadHistory()
      }

      // Sauvegarder dans localStorage pour la persistance
      localStorage.setItem('lastTrendAnalysis', JSON.stringify(data))
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse')
      console.error('Error analyzing trend:', err)
    } finally {
      setLoading(false)
    }
  }


  // Charger la dernière analyse depuis localStorage
  useEffect(() => {
    const lastAnalysis = localStorage.getItem('lastTrendAnalysis')
    if (lastAnalysis) {
      try {
        setCurrentTrend(JSON.parse(lastAnalysis))
      } catch (error) {
        console.error('Error parsing last analysis:', error)
      }
    }
  }, [])

  const countries = [
    { value: 'US', label: '🇺🇸 États-Unis' },
    { value: 'FR', label: '🇫🇷 France' },
    { value: 'GB', label: '🇬🇧 Royaume-Uni' },
    { value: 'DE', label: '🇩🇪 Allemagne' },
    { value: 'CA', label: '🇨🇦 Canada' },
    { value: 'AU', label: '🇦🇺 Australie' },
    { value: 'global', label: '🌍 Global' }
  ]

  const ranges = [
    { value: '7d', label: '7 derniers jours' },
    { value: '30d', label: '30 derniers jours' },
    { value: '90d', label: '90 derniers jours' }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Trend Finder Pro</h1>
          <p className="text-muted-foreground">
            Analysez les tendances de marché avec des données Google Trends, Reddit et Product Hunt
          </p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Analyse de Tendance
            </CardTitle>
            <CardDescription>
              Entrez un topic pour analyser sa popularité et son potentiel de marché
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Ex: fitness, crypto, design, marketing..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && analyzeTrend()}
                  className="w-full"
                />
              </div>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Pays" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  {ranges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={analyzeTrend} 
              disabled={loading || !topic.trim()} 
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Analyser la Tendance
                </>
              )}
            </Button>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Current Analysis */}
        <AnimatePresence>
          {currentTrend && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Analyse de "{currentTrend?.topic || 'Tendances'}"
                </h2>
                <div className="flex items-center gap-2">
                  {currentTrend?.cached && (
                    <Badge variant="outline">Cached</Badge>
                  )}
                  <Badge variant="secondary">
                    {currentTrend?.sourcesUsed?.length || 0} sources
                  </Badge>
                </div>
              </div>

              {/* Trend Card */}
              <TrendCard 
                trend={currentTrend}
              />

              {/* Chart */}
              {currentTrend.timeseries && currentTrend.timeseries.length > 0 && (
                <TrendChart 
                  timeseries={currentTrend.timeseries} 
                  topic={currentTrend.topic} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Section */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Historique des Analyses
              </CardTitle>
              <CardDescription>
                Vos dernières recherches de tendances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {history.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <p className="font-medium text-foreground">{item.topic}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.country} • {item.range} • {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {item.result_json?.scores?.growth || 0}/100
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCurrentTrend(item.result_json)}
                      >
                        Voir
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Conseils pour Optimiser vos Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Choisissez des topics spécifiques</h4>
                <p className="text-sm text-muted-foreground">
                  "fitness" plutôt que "santé", "crypto trading" plutôt que "crypto"
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Analysez plusieurs pays</h4>
                <p className="text-sm text-muted-foreground">
                  Comparez les tendances entre différents marchés pour identifier les opportunités
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Surveillez la régularité</h4>
                <p className="text-sm text-muted-foreground">
                  Les tendances durables sont plus prometteuses que les pics temporaires
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
