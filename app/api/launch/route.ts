import { NextRequest, NextResponse } from 'next/server'
import { generateLaunchPlan } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { productName, launchDate, budget, userId } = await request.json()

    if (!productName) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
    }

    // Générer le plan de lancement avec OpenAI
    const plan = await generateLaunchPlan(productName, launchDate, budget)

    // Sauvegarder le plan si un utilisateur est connecté
    if (userId) {
      await supabase
        .from('launches')
        .insert({
          user_id: userId,
          title: plan.title,
          launch_plan: plan,
          launch_date: launchDate ? new Date(launchDate).toISOString() : null
        })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error in launch API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du plan de lancement' },
      { status: 500 }
    )
  }
}
