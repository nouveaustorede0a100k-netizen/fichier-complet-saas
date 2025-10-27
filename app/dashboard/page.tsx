'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Package, 
  Megaphone, 
  Search, 
  Crown, 
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface UsageStats {
  used: number
  limit: number
  remaining: number
  plan: string
  resetDate: string
}

interface DashboardStats {
  totalSearches: number
  totalProducts: number
  totalAds: number
  totalKeywords: number
  recentActivity: Array<{
    id: string
    type: string
    title: string
    createdAt: string
  }>
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch usage stats
      const usageRes = await fetch('/api/dashboard/usage')
      if (usageRes.ok) {
        const usageData = await usageRes.json()
        setUsageStats(usageData.usage?.[0] || null)
      }

      // Fetch dashboard stats
      const statsRes = await fetch('/api/dashboard/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setDashboardStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connexion requise
          </h1>
          <p className="text-gray-600 mb-6">
            Veuillez vous connecter pour accéder à votre dashboard
          </p>
          <Link href="/auth">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    )
  }

  const usagePercentage = usageStats ? (usageStats.used / usageStats.limit) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user.full_name || user.email} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Voici un aperçu de votre activité et de vos outils
          </p>
        </div>

        {/* Usage Stats */}
        {usageStats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Utilisation du mois</span>
                <Badge variant={usageStats.plan === 'free' ? 'secondary' : 'default'}>
                  Plan {usageStats.plan}
                </Badge>
              </CardTitle>
              <CardDescription>
                {usageStats.used} / {usageStats.limit} requêtes utilisées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={usagePercentage} className="h-2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{usageStats.remaining} requêtes restantes</span>
                  <span>Reset le {new Date(usageStats.resetDate).toLocaleDateString()}</span>
                </div>
                {usageStats.plan === 'free' && usagePercentage > 80 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Crown className="w-5 h-5 text-blue-500 mr-2" />
                    <div>
                        <p className="text-blue-800 font-medium">
                          Vous approchez de votre limite !
                        </p>
                        <p className="text-blue-600 text-sm">
                          Passez au plan Pro pour des requêtes illimitées
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link href="/pricing">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          Voir les plans
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                  </div>
                </CardContent>
              </Card>
        )}

          {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/trends">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <CardTitle className="text-lg">Trend Finder</CardTitle>
                <CardDescription>
                  Découvrez les tendances montantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardStats?.totalSearches || 0}
                </div>
                <p className="text-sm text-gray-600">recherches effectuées</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/products">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Package className="w-8 h-8 text-green-500" />
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                <CardTitle className="text-lg">Product Finder</CardTitle>
                <CardDescription>
                  Analysez les produits gagnants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {dashboardStats?.totalProducts || 0}
                          </div>
                <p className="text-sm text-gray-600">analyses créées</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/ads">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Megaphone className="w-8 h-8 text-purple-500" />
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                <CardTitle className="text-lg">Ad Generator</CardTitle>
                <CardDescription>
                  Générez des publicités performantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {dashboardStats?.totalAds || 0}
                </div>
                <p className="text-sm text-gray-600">campagnes créées</p>
              </CardContent>
            </Link>
            </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/keywords">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Search className="w-8 h-8 text-orange-500" />
                  <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
                <CardTitle className="text-lg">Keyword Tool</CardTitle>
                <CardDescription>
                  Trouvez les bons mots-clés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {dashboardStats?.totalKeywords || 0}
                </div>
                <p className="text-sm text-gray-600">recherches effectuées</p>
              </CardContent>
            </Link>
            </Card>
        </div>

        {/* Recent Activity */}
        {dashboardStats?.recentActivity && dashboardStats.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                {dashboardStats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 capitalize">{activity.type}</p>
                  </div>
                </div>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upgrade CTA for Free users */}
        {usageStats?.plan === 'free' && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Crown className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Prêt à passer au niveau supérieur ?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Débloquez toutes les fonctionnalités avec un plan Pro ou Business. 
                  Requêtes illimitées, support prioritaire et bien plus encore.
                </p>
                <Link href="/pricing">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                    Voir les plans
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