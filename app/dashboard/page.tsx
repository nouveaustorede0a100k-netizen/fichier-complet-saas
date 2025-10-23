'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Package, 
  Gift, 
  Megaphone, 
  Rocket, 
  BarChart3, 
  Plus,
  ArrowRight,
  Crown,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  trendSearches: number
  productAnalyses: number
  offers: number
  adCampaigns: number
  launchPlans: number
  plan: string
  quota: {
    trendSearches: { used: number; limit: number }
    productAnalyses: { used: number; limit: number }
    offers: { used: number; limit: number }
    adCampaigns: { used: number; limit: number }
    launchPlans: { used: number; limit: number }
  }
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
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
              Veuillez vous connecter pour accéder à votre dashboard
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

  const modules = [
    {
      id: 'trends',
      title: 'Trend Finder Pro',
      description: 'Découvrez les tendances montantes',
      icon: TrendingUp,
      href: '/trends',
      color: 'bg-blue-500',
      quota: stats?.quota.trendSearches
    },
    {
      id: 'products',
      title: 'Product Finder',
      description: 'Trouvez des produits gagnants',
      icon: Package,
      href: '/products',
      color: 'bg-green-500',
      quota: stats?.quota.productAnalyses
    },
    {
      id: 'offers',
      title: 'Offer Builder',
      description: 'Créez des offres percutantes',
      icon: Gift,
      href: '/offers',
      color: 'bg-purple-500',
      quota: stats?.quota.offers
    },
    {
      id: 'ads',
      title: 'Ad Generator',
      description: 'Générez des publicités efficaces',
      icon: Megaphone,
      href: '/ads',
      color: 'bg-orange-500',
      quota: stats?.quota.adCampaigns
    },
    {
      id: 'launch',
      title: 'Launch Assistant',
      description: 'Planifiez vos lancements',
      icon: Rocket,
      href: '/launch',
      color: 'bg-red-500',
      quota: stats?.quota.launchPlans
    }
  ]

  const isFreePlan = stats?.plan === 'free'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bonjour {user.email?.split('@')[0]} ! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Voici un aperçu de votre activité sur Drop Eazy
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isFreePlan ? "secondary" : "default"}>
                {isFreePlan ? "Plan Gratuit" : "Plan Pro"}
              </Badge>
              {isFreePlan && (
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Crown className="w-4 h-4 mr-2" />
                    Passer au Pro
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {modules.map((module) => {
            const Icon = module.icon
            const quota = module.quota
            const isUnlimited = quota?.limit === -1
            const percentage = isUnlimited ? 100 : (quota?.used || 0) / (quota?.limit || 1) * 100

            return (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${module.color} text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {isUnlimited ? 'Illimité' : `${quota?.used || 0}/${quota?.limit || 0}`}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilisation</span>
                      <span>{isUnlimited ? 'Illimité' : `${quota?.used || 0}/${quota?.limit || 0}`}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Accédez rapidement à vos outils préférés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {modules.map((module) => {
                  const Icon = module.icon
                  return (
                    <Link key={module.id} href={module.href}>
                      <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50">
                        <Icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{module.title}</span>
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                Statistiques
              </CardTitle>
              <CardDescription>
                Votre activité récente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recherches de tendances</span>
                  <span className="font-semibold">{stats?.trendSearches || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Analyses de produits</span>
                  <span className="font-semibold">{stats?.productAnalyses || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Offres créées</span>
                  <span className="font-semibold">{stats?.offers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Campagnes publicitaires</span>
                  <span className="font-semibold">{stats?.adCampaigns || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plans de lancement</span>
                  <span className="font-semibold">{stats?.launchPlans || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Banner for Free Users */}
        {isFreePlan && (
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Débloquez tout le potentiel de Drop Eazy</h3>
                  <p className="text-purple-100">
                    Passez au plan Pro pour des générations illimitées et des fonctionnalités avancées
                  </p>
                </div>
                <Link href="/pricing">
                  <Button variant="secondary" size="lg">
                    Voir les plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}