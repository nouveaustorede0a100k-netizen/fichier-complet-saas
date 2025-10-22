'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, BarChart3, Filter, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { TrendCard } from '@/components/TrendCard'

export default function TrendsPage() {
  const [query, setQuery] = useState('')
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const { user } = useAuth()

  const analyzeTrends = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          userId: user?.id
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse des tendances')
      }

      const data = await response.json()
      // Enrichir les données avec des informations supplémentaires pour l'affichage
      const enrichedTrends = data.map((trend: any, index: number) => ({
        ...trend,
        category: ['Technologie', 'Éducation', 'Santé', 'Business', 'Lifestyle'][index % 5],
        volume: Math.floor(Math.random() * 200000) + 10000,
        chartData: generateChartData()
      }))
      setTrends(enrichedTrends)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil']
    return months.map((month, index) => ({
      month,
      value: Math.floor(Math.random() * 80) + 20 + (index * 10)
    }))
  }

  const filteredTrends = trends.filter(trend => {
    if (filter === 'all') return true
    return trend.category?.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Discover Exploding Topics</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Découvrez les tendances émergentes et les opportunités de marché avec l'IA
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Search Trends"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeTrends()}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="technologie">Technologie</option>
                  <option value="éducation">Éducation</option>
                  <option value="santé">Santé</option>
                  <option value="business">Business</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
                <Button onClick={analyzeTrends} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? 'Analyse...' : 'Analyser'}
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-600">
                  PRO
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        {trends.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                Tendances Découvertes ({filteredTrends.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Zap className="w-4 h-4" />
                <span>Analyse IA</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrends.map((trend, index) => (
                <TrendCard 
                  key={index} 
                  trend={trend}
                  onAnalyzeMore={() => {
                    // Fonctionnalité à implémenter
                    console.log('Analyser plus:', trend.name)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* État vide */}
        {trends.length === 0 && !loading && (
          <div className="text-center py-16">
            <BarChart3 className="w-20 h-20 mx-auto text-gray-400 mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Commencez votre analyse</h3>
            <p className="text-gray-600 text-lg mb-8">
              Entrez un mot-clé ou une thématique pour découvrir les tendances émergentes
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => setQuery('IA & Productivité')}
                variant="outline"
                className="px-6"
              >
                IA & Productivité
              </Button>
              <Button 
                onClick={() => setQuery('Formation en Ligne')}
                variant="outline"
                className="px-6"
              >
                Formation en Ligne
              </Button>
              <Button 
                onClick={() => setQuery('E-commerce')}
                variant="outline"
                className="px-6"
              >
                E-commerce
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}