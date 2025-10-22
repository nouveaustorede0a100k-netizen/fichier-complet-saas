import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { fetchGoogleTrends } from "@/lib/trends/fetchGoogleTrends";
import { fetchRedditTrends } from "@/lib/trends/fetchReddit";
import { fetchProductHuntTrends } from "@/lib/trends/fetchProductHunt";
import { mergeAndRankTrends } from "@/lib/trends/mergeAndRankTrends";
import { normalizeKeyword } from "@/lib/trends/normalizeKeyword";
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { topic: rawKeyword = "digital business", country = "US", userId } = await req.json();

    // 1️⃣ Correction + expansion du mot-clé
    const { keyword, variants } = await normalizeKeyword(rawKeyword);
    console.log("🔍 Mot-clé corrigé:", keyword, "Variantes:", variants);

    // 2️⃣ Récupération de tendances multi-sources pour toutes les variantes
    const results = await Promise.all(
      variants.map(async (kw) => {
        const [google, reddit, ph] = await Promise.all([
          fetchGoogleTrends(kw, country),
          fetchRedditTrends(kw),
          fetchProductHuntTrends(kw)
        ]);
        return mergeAndRankTrends(google, reddit, ph);
      })
    );

    // 3️⃣ Fusion globale + passage à l'analyse IA
    const merged = mergeAndRankTrends(...results);

    // 4️⃣ Analyse IA des meilleures tendances
    const prompt = `
      Voici des tendances détectées dans le domaine "${keyword}".
      Analyse-les et classe-les selon leur potentiel business, nouveauté et croissance.
      Réponds STRICTEMENT en JSON : tableau d'objets [{name, scoreGrowth, scorePotential, summary, category}]
    `;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        { role: "system", content: "Tu es un analyste de tendances spécialisé en produits digitaux." },
        { role: "user", content: prompt + JSON.stringify(merged.slice(0, 50)) }
      ],
    });

    const content = completion.choices[0].message.content || "";
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]");
    const json = JSON.parse(content.slice(jsonStart, jsonEnd + 1));

    // 5️⃣ Vérifier le plan utilisateur (placeholder pour l'instant)
    const userPlan = 'free' // TODO: Récupérer le vrai plan utilisateur depuis Supabase

    // 6️⃣ Sauvegarder la recherche si un utilisateur est connecté
    if (userId) {
      try {
        await supabase
          .from('trend_searches')
          .insert({
            user_id: userId,
            query: keyword,
            country: country || null,
            results: json,
            user_plan: userPlan,
            raw_sources: {
              googleCount: results.reduce((acc, r) => acc + r.filter(item => item.type === 'google').length, 0),
              redditCount: results.reduce((acc, r) => acc + r.filter(item => item.type === 'reddit').length, 0),
              phCount: results.reduce((acc, r) => acc + r.filter(item => item.type === 'producthunt').length, 0)
            }
          })
      } catch (dbError) {
        console.warn('Could not save to database:', dbError)
        // Continue without failing
      }
    }

    // 7️⃣ Renvoi de la réponse enrichie
    return NextResponse.json({
      success: true,
      topic: keyword,
      totalAnalyzed: merged.length,
      rankedTrends: json,
      rawSources: {
        googleCount: results.reduce((acc, r) => acc + r.filter(item => item.type === 'google').length, 0),
        redditCount: results.reduce((acc, r) => acc + r.filter(item => item.type === 'reddit').length, 0),
        phCount: results.reduce((acc, r) => acc + r.filter(item => item.type === 'producthunt').length, 0)
      },
      meta: {
        original_keyword: rawKeyword,
        corrected_keyword: keyword,
        variants_searched: variants,
        country: country || 'Global',
        generated_at: new Date().toISOString(),
        user_plan: userPlan
      }
    });

  } catch (err) {
    console.error("❌ Trend API error:", err);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur API de tendance",
        details: process.env.NODE_ENV === 'development' ? (err as Error).message : undefined
      }, 
      { status: 500 }
    );
  }
}
