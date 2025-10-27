import { NextRequest, NextResponse } from 'next/server'
import { getUserUsageStats } from '@/lib/usage'

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'utilisateur depuis les headers (middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer les statistiques d'usage
    const usageStats = await getUserUsageStats(userId)

    return NextResponse.json({
      success: true,
      usage: usageStats
    })

  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération des statistiques d\'usage' 
    }, { status: 500 })
  }
}
