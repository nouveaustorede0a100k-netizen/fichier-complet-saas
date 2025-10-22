import { NextRequest, NextResponse } from 'next/server'
import { generateLaunchPlan, LaunchPlanAnalysis } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { productName, launchDate, budget, userId } = await request.json()

    if (!productName) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
    }

    // Vérifier le plan utilisateur (placeholder pour l'instant)
    const userPlan = 'free' // TODO: Récupérer le vrai plan utilisateur depuis Supabase

    // Générer le plan de lancement avec OpenAI
    const plan = await generateLaunchPlan(productName, launchDate, budget)

    // Formater la réponse selon le format spécifié
    const formattedPlan = {
      id: `launch_plan_${Date.now()}`,
      title: plan.title,
      description: plan.description,
      timeline: plan.timeline.map((phase, index) => ({
        id: `phase_${index + 1}`,
        phase: phase.phase,
        duration: phase.duration,
        tasks: phase.tasks,
        priority: phase.priority,
        status: 'pending',
        completion_percentage: 0
      })),
      budget: {
        total: plan.budget.total,
        breakdown: plan.budget.breakdown.map((item, index) => ({
          id: `budget_item_${index + 1}`,
          category: item.category,
          amount: item.amount,
          description: item.description,
          percentage: Math.round((item.amount / plan.budget.total) * 100)
        }))
      },
      metrics: plan.metrics.map((metric, index) => ({
        id: `metric_${index + 1}`,
        name: metric.name,
        target: metric.target,
        description: metric.description,
        current_value: 0,
        progress_percentage: 0
      })),
      checklist: plan.checklist.map((item, index) => ({
        id: `checklist_item_${index + 1}`,
        task: item,
        completed: false,
        due_date: null
      })),
      launch_date: launchDate ? new Date(launchDate).toISOString() : null,
      status: 'draft',
      success_probability: Math.floor(Math.random() * 30) + 70, // Probabilité entre 70-100%
      risk_factors: [
        'Concurrence accrue',
        'Changements de marché',
        'Problèmes techniques'
      ],
      success_factors: [
        'Marketing efficace',
        'Qualité du produit',
        'Timing optimal'
      ]
    }

    // Sauvegarder le plan si un utilisateur est connecté
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('launches')
          .insert({
            user_id: userId,
            title: formattedPlan.title,
            launch_plan: formattedPlan,
            launch_date: formattedPlan.launch_date,
            user_plan: userPlan
          })
          .select()
          .single()

        if (error) throw error

        formattedPlan.id = data.id
      } catch (dbError) {
        console.warn('Could not save to database:', dbError)
        // Continue without failing
      }
    }

    return NextResponse.json({
      success: true,
      data: formattedPlan,
      meta: {
        product_name: productName,
        launch_date: formattedPlan.launch_date,
        generated_at: new Date().toISOString(),
        user_plan: userPlan
      }
    })
  } catch (error) {
    console.error('Error in launch API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la génération du plan de lancement',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}
