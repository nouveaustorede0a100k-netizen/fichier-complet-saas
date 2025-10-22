"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function TrendChart({ timeseries, topic }) {
  if (!timeseries || timeseries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Évolution Google Trends
          </CardTitle>
          <CardDescription>
            Données d'intérêt pour "{topic}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Aucune donnée disponible
          </div>
        </CardContent>
      </Card>
    )
  }

  // Formater les données pour Recharts
  const chartData = timeseries.map(item => ({
    date: item.date,
    value: item.value,
    rawValue: item.rawValue
  }))

  // Trouver les valeurs min/max pour le tooltip
  const maxValue = Math.max(...timeseries.map(item => item.value))
  const minValue = Math.min(...timeseries.map(item => item.value))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Score: <span className="font-bold">{data.value}/100</span>
          </p>
          {data.rawValue !== undefined && (
            <p className="text-muted-foreground text-sm">
              Valeur brute: {data.rawValue}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Évolution Google Trends
        </CardTitle>
        <CardDescription>
          Intérêt relatif pour "{topic}" (normalisé sur 0-100)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Légende et informations */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-foreground">Score Max</div>
            <div className="text-primary font-bold">{maxValue}/100</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-foreground">Score Min</div>
            <div className="text-muted-foreground font-bold">{minValue}/100</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-foreground">Période</div>
            <div className="text-muted-foreground font-bold">{timeseries.length} points</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
