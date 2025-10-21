"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  TrendingUp, 
  Search, 
  Package, 
  Megaphone, 
  Rocket,
  ArrowRight,
  BarChart3,
  Users,
  DollarSign,
  Clock
} from "lucide-react"
import { motion } from "framer-motion"

const stats = [
  { label: "Recherches effectuées", value: "12", icon: Search },
  { label: "Produits analysés", value: "48", icon: Package },
  { label: "Offres créées", value: "3", icon: Megaphone },
  { label: "Lancements", value: "1", icon: Rocket }
]

const recentActivities = [
  { action: "Nouvelle recherche de tendances", topic: "IA & Productivité", time: "Il y a 2h" },
  { action: "Analyse de produit terminée", topic: "Formation Excel", time: "Il y a 4h" },
  { action: "Offre générée", topic: "Template Canva", time: "Hier" },
  { action: "Lancement planifié", topic: "Cours de Design", time: "Il y a 2 jours" }
]

const quickActions = [
  {
    title: "Trend Finder",
    description: "Découvrez les niches tendances",
    icon: TrendingUp,
    href: "/trends",
    color: "bg-blue-500"
  },
  {
    title: "Product Finder",
    description: "Analysez des produits gagnants",
    icon: Search,
    href: "/products",
    color: "bg-green-500"
  },
  {
    title: "Offer Builder",
    description: "Créez des offres percutantes",
    icon: Package,
    href: "/offer",
    color: "bg-purple-500"
  },
  {
    title: "Ad Generator",
    description: "Générez des publicités",
    icon: Megaphone,
    href: "/ads",
    color: "bg-orange-500"
  },
  {
    title: "Launch Assistant",
    description: "Planifiez votre lancement",
    icon: Rocket,
    href: "/launch",
    color: "bg-pink-500"
  }
]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenue sur Drop Eazy - Votre assistant IA pour créer des business digitaux rentables
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="p-3 rounded-full bg-primary/10">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-primary" />
                  Actions Rapides
                </CardTitle>
                <CardDescription>
                  Accédez rapidement aux modules principaux de Drop Eazy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="h-auto p-4 w-full justify-start"
                        onClick={() => router.push(action.href)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${action.color} text-white`}>
                            <action.icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-foreground">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Activité Récente
                </CardTitle>
                <CardDescription>
                  Vos dernières actions sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.topic}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Commencer avec Drop Eazy
            </CardTitle>
            <CardDescription>
              Suivez ces étapes pour créer votre premier business digital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Recherchez des tendances</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Utilisez le Trend Finder pour identifier les niches prometteuses
                </p>
                <Button size="sm" variant="outline" onClick={() => router.push("/trends")} className="ml-11">
                  Commencer
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h3 className="font-semibold">Analysez des produits</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Découvrez des produits digitaux qui se vendent bien
                </p>
                <Button size="sm" variant="outline" onClick={() => router.push("/products")} className="ml-11">
                  Analyser
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h3 className="font-semibold">Créez votre offre</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Utilisez l'Offer Builder pour créer une offre percutante
                </p>
                <Button size="sm" variant="outline" onClick={() => router.push("/offer")} className="ml-11">
                  Créer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
