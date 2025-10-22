'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3, Globe } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface TrendCardProps {
  trend: {
    name: string
    score: number
    growth: string
    description: string
    related_terms: string[]
    opportunities: string[]
    risks: string[]
    category?: string
    volume?: number
    chartData?: Array<{ month: string; value: number }>
  }
  onAnalyzeMore?: () => void
}

export function TrendCard({ trend, onAnalyzeMore }: TrendCardProps) {
  // Générer des données de graphique simulées si pas fournies
  const chartData = trend.chartData || [
    { month: 'Jan', value: 20 },
    { month: 'Fév', value: 35 },
    { month: 'Mar', value: 45 },
    { month: 'Avr', value: 60 },
    { month: 'Mai', value: 75 },
    { month: 'Juin', value: 85 },
    { month: 'Juil', value: 95 }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold">{trend.name}</CardTitle>
              {trend.category && (
                <Badge variant="secondary" className="text-xs">
                  {trend.category}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {trend.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Métriques principales */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {trend.volume ? `${(trend.volume / 1000).toFixed(0)}K` : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">Volume</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(trend.score)}`}>
                {trend.growth}
              </div>
              <div className="text-xs text-muted-foreground">Croissance</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(trend.score)} ${getScoreColor(trend.score)}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              Score: {trend.score}%
            </div>
          </div>
        </div>

        {/* Graphique de tendance */}
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mots-clés liés */}
        <div className="flex flex-wrap gap-1">
          {trend.related_terms.slice(0, 4).map((term, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {term}
            </Badge>
          ))}
        </div>

        {/* Indicateurs de marché */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <BarChart3 className="w-4 h-4" />
            <span>Opportunité élevée</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600">
            <Globe className="w-4 h-4" />
            <span>Marché global</span>
          </div>
        </div>

        {/* Bouton d'action */}
        <div className="flex justify-end pt-2">
          <Button 
            onClick={onAnalyzeMore}
            variant="outline" 
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Analyser plus →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
