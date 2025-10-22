"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  MessageSquare, 
  ExternalLink,
  Copy,
  Check
} from "lucide-react"
import { useState } from "react"

export function TrendCard({ trend, onSave, onAnalyze }) {
  const [copied, setCopied] = useState("")
  
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
    if (score >= 40) return "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400"
    return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400"
  }

  const getScoreIcon = (score) => {
    if (score >= 60) return <TrendingUp className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{trend.topic}</CardTitle>
            <CardDescription>
              {trend.country} • {trend.range} • {new Date(trend.timestamp).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {trend.cached && (
              <Badge variant="outline" className="text-xs">
                Cached
              </Badge>
            )}
            <Badge className={getScoreColor(trend.scores.growth)}>
              {getScoreIcon(trend.scores.growth)}
              {trend.scores.growth}/100
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Scores principaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Croissance</span>
            </div>
            <div className="text-2xl font-bold text-primary">{trend.scores.growth}</div>
            <div className="text-xs text-muted-foreground">/100</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Potentiel Marché</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">{trend.scores.marketPotential}</div>
            <div className="text-xs text-muted-foreground">/100</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Confiance</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{trend.scores.confidence}</div>
            <div className="text-xs text-muted-foreground">/100</div>
          </div>
        </div>

        {/* Sources disponibles */}
        <div>
          <h4 className="font-semibold mb-3">Sources Analysées</h4>
          <div className="flex flex-wrap gap-2">
            {trend.sources.googleTrends.available && (
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                Google Trends
              </Badge>
            )}
            {trend.sources.reddit.available && (
              <Badge variant="outline" className="gap-1">
                <MessageSquare className="w-3 h-3" />
                Reddit ({trend.sources.reddit.totalMentions})
              </Badge>
            )}
            {trend.sources.productHunt.available && (
              <Badge variant="outline" className="gap-1">
                <Target className="w-3 h-3" />
                Product Hunt ({trend.sources.productHunt.totalPosts})
              </Badge>
            )}
          </div>
        </div>

        {/* Insights IA */}
        {trend.aiAnalysis.actionableInsights && trend.aiAnalysis.actionableInsights.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Insights Actionables</h4>
            <ul className="space-y-2">
              {trend.aiAnalysis.actionableInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pièges potentiels */}
        {trend.aiAnalysis.potentialPitfalls && trend.aiAnalysis.potentialPitfalls.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-orange-600">Pièges à Éviter</h4>
            <ul className="space-y-2">
              {trend.aiAnalysis.potentialPitfalls.map((pitfall, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground">{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stratégie recommandée */}
        {trend.aiAnalysis.recommendedStrategy && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-2 text-primary">Stratégie Recommandée</h4>
            <p className="text-sm text-foreground">{trend.aiAnalysis.recommendedStrategy}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button 
            size="sm" 
            onClick={() => onAnalyze(trend.topic)}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Analyser Plus
          </Button>
          
          {onSave && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onSave(trend)}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Sauvegarder
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => copyToClipboard(JSON.stringify(trend, null, 2), 'trend')}
            className="gap-2"
          >
            {copied === 'trend' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Copier
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
