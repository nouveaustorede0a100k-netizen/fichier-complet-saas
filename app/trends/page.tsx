'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, TrendingUp, Globe, BarChart3, Lightbulb, Target } from 'lucide-react'
import Link from 'next/link'

interface TrendResult {
  name: string
  scoreGrowth: number
  scorePotential: number
  summary: string
  category: string
}

interface TrendsResponse {
  success: boolean
  topic: string
  totalAnalyzed: number
  rankedTrends: TrendResult[]
  rawSources: {
    googleCount: number
    redditCount: number
    phCount: number
  }
  quota: {
    remaining: number
    limit: number
  }
  meta: {
    original_keyword: string
    corrected_keyword: string
    variants_searched: string[]
    country: string
    generated_at: string
  }
}

export default function TrendsPage() {
  const { user, loading } = useAuth()
  const [topic, setTopic] = useState('')
  const [country, setCountry] = useState('US')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TrendsResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token

      if (!token) {
        setError('Veuillez vous connecter pour utiliser cette fonctionnalité')
        setLoading(false)
        return
      }

      const response = await fetch('/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic, country })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la recherche de tendances')
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Veuillez vous connecter pour utiliser Trend Finder Pro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth">
              <Button className="w-full">Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-8 h-8 mr-3 text-blue-600" />
                Trend Finder Pro
              </h1>
              <p className="text-gray-600 mt-2">
                Découvrez les tendances montantes avec l'IA et des données multi-sources
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">← Retour au dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Rechercher des tendances</CardTitle>
                <CardDescription>
                  Entrez un mot-clé pour découvrir les tendances émergentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Mot-clé ou sujet</Label>
                <Input
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="ex: intelligence artificielle, crypto, fitness..."
                      required
                />
              </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">🇺🇸 États-Unis</SelectItem>
                        <SelectItem value="FR">🇫🇷 France</SelectItem>
                        <SelectItem value="GB">🇬🇧 Royaume-Uni</SelectItem>
                        <SelectItem value="DE">🇩🇪 Allemagne</SelectItem>
                        <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                        <SelectItem value="AU">🇦🇺 Australie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading || !topic.trim()}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analyser les tendances
                      </>
                    )}
                </Button>
                </form>

                {results && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-800">
                        Quota restant: {results.quota.remaining}/{results.quota.limit}
                      </span>
                      <Badge variant="outline" className="text-green-700">
                        {results.quota.limit === -1 ? 'Illimité' : 'Limité'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {error && (
              <Alert className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {results && (
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Résultats de l'analyse
                    </CardTitle>
                    <CardDescription>
                      Mot-clé: "{results.meta.corrected_keyword}" • 
                      {results.meta.original_keyword !== results.meta.corrected_keyword && 
                        ` (corrigé depuis "${results.meta.original_keyword}")`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{results.totalAnalyzed}</div>
                        <div className="text-sm text-blue-800">Tendances analysées</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{results.rawSources.googleCount}</div>
                        <div className="text-sm text-green-800">Sources Google</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{results.rawSources.redditCount + results.rawSources.phCount}</div>
                        <div className="text-sm text-orange-800">Sources communautaires</div>
              </div>
            </div>
          </CardContent>
        </Card>

                {/* Trends List */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-600" />
                    Tendances classées par potentiel
                  </h3>
                  
                  {results.rankedTrends.map((trend, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {trend.name}
                            </h4>
                            <p className="text-gray-600 mb-3">{trend.summary}</p>
                            <Badge variant="outline" className="text-xs">
                              {trend.category}
                            </Badge>
                          </div>
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Croissance</div>
                              <div className="text-xl font-bold text-green-600">{trend.scoreGrowth}/100</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Potentiel</div>
                              <div className="text-xl font-bold text-blue-600">{trend.scorePotential}/100</div>
                            </div>
              </div>
            </div>
            
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Globe className="w-4 h-4 mr-1" />
                            {results.meta.country}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Lightbulb className="w-4 h-4 mr-1" />
                            Score global: {Math.round((trend.scoreGrowth + trend.scorePotential) / 2)}/100
                          </div>
                        </div>
                      </CardContent>
                    </Card>
              ))}
            </div>
          </div>
        )}

            {!results && !error && (
              <Card>
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Prêt à découvrir les tendances ?
                  </h3>
                  <p className="text-gray-600">
                    Entrez un mot-clé dans le formulaire pour commencer l'analyse
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}