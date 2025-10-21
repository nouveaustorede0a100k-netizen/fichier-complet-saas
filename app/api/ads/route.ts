import { NextRequest, NextResponse } from 'next/server'
import { generateAds } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { offerTitle, platform, userId, offerId } = await request.json()

    if (!offerTitle || !platform) {
      return NextResponse.json({ error: 'Offer title and platform are required' }, { status: 400 })
    }

    // Générer les publicités avec OpenAI
    const ads = await generateAds(offerTitle, platform)

    // Sauvegarder la campagne si un utilisateur est connecté
    if (userId) {
      const { data, error } = await supabase
        .from('ad_campaigns')
        .insert({
          user_id: userId,
          offer_id: offerId,
          title: offerTitle,
          content: JSON.stringify(ads),
          platform
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ ...ads, id: data.id })
    }

    return NextResponse.json(ads)
  } catch (error) {
    console.error('Error in ads API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération des publicités' },
      { status: 500 }
    )
  }
}
