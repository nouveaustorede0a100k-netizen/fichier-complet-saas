"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { 
  Rocket, 
  ArrowRight, 
  Loader2, 
  Copy, 
  Check,
  Calendar,
  Target,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Star
} from "lucide-react"
import { motion } from "framer-motion"

interface LaunchPlan {
  title: string
  description: string
  timeline: Array<{
    phase: string
    duration: string
    tasks: string[]
    priority: string
  }>
  budget: {
    total: number
    breakdown: Array<{
      category: string
      amount: number
      description: string
    }>
  }
  metrics: Array<{
    name: string
    target: string
    description: string
  }>
  checklist: string[]
}

export default function LaunchPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [productName, setProductName] = useState("")
  const [launchDate, setLaunchDate] = useState("")
  const [budget, setBudget] = useState("")
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<LaunchPlan | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState("")

  const handleGenerate = async () => {
    if (!productName.trim()) {
      setError("Veuillez entrer le nom du produit")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productName,
          launchDate,
          budget,
          userId: user?.id 
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération')
      }

      const data = await response.json()
      setPlan(data)
    } catch (err) {
      setError("Erreur lors de la génération du plan de lancement. Veuillez réessayer.")
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'haute': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'moyenne': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'basse': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Launch Assistant</h1>
          <p className="text-muted-foreground">
            Planifiez et exécutez le lancement parfait de votre produit digital avec un plan détaillé
          </p>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Plan de Lancement IA
            </CardTitle>
            <CardDescription>
              Créez un plan de lancement complet et personnalisé pour votre produit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Date de Lancement
                </label>
                <Input
                  type="date"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Budget (optionnel)
                </label>
                <Input
                  placeholder="Ex: 5000€"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
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
                  <Rocket className="w-4 h-4" />
                  Générer le Plan de Lancement
                </>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {/* Generated Plan */}
        {plan && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Plan de Lancement Généré</h2>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")} className="gap-2">
                Retour au Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid gap-6">
              {/* Overview */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Aperçu du Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.title}</h3>
                    <p className="text-muted-foreground text-lg">{plan.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Timeline de Lancement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {plan.timeline.map((phase, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-l-4 border-primary/20 pl-6 relative"
                      >
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full" />
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-foreground">{phase.phase}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{phase.duration}</Badge>
                              <Badge className={getPriorityColor(phase.priority)}>
                                {phase.priority}
                              </Badge>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {phase.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-foreground">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Budget */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Budget de Lancement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-primary/5 rounded-lg">
                      <p className="text-sm text-muted-foreground">Budget Total</p>
                      <p className="text-3xl font-bold text-primary">{plan.budget.total}€</p>
                    </div>
                    <div className="grid gap-3">
                      {plan.budget.breakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium text-foreground">{item.category}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <span className="text-lg font-semibold text-foreground">{item.amount}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Métriques de Succès
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.metrics.map((metric, index) => (
                      <div key={index} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{metric.name}</h4>
                          <Badge variant="outline">{metric.target}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{metric.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Checklist de Lancement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {plan.checklist.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-5 h-5 border-2 border-primary rounded flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Conseils pour un Lancement Réussi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Planifiez à l'avance</h4>
                <p className="text-sm text-muted-foreground">
                  Commencez la préparation 4-6 semaines avant le lancement
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Testez tout</h4>
                <p className="text-sm text-muted-foreground">
                  Vérifiez tous les liens, boutons et processus avant le lancement
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Mesurez les résultats</h4>
                <p className="text-sm text-muted-foreground">
                  Suivez vos métriques pour optimiser les futurs lancements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}