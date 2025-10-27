import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { fetchGoogleTrends } from "@/lib/trends/fetchGoogleTrends";
import { fetchRedditTrends } from "@/lib/trends/fetchReddit";
import { fetchProductHuntTrends } from "@/lib/trends/fetchProductHunt";
import { fetchYouTubeTrends } from "@/lib/trends/fetchYouTube";
import { mergeAndRankTrends } from "@/lib/trends/mergeAndRankTrends";
import { normalizeKeyword } from "@/lib/trends/normalizeKeyword";

export async function POST(req: Request) {
  try {
    const { topic: rawKeyword = "digital business", country = "US" } = await req.json();

    console.log("🔍 Test API - Mot-clé reçu:", rawKeyword);

    // 1️⃣ Correction + expansion du mot-clé
    const { keyword, variants } = await normalizeKeyword(rawKeyword);
    console.log("🔍 Mot-clé corrigé:", keyword, "Variantes:", variants);

    // 2️⃣ Récupération de tendances multi-sources pour toutes les variantes
    const results = await Promise.all(
      variants.map(async (kw: string) => {
        console.log("🔍 Recherche pour:", kw);
        const [google, reddit, ph, youtube] = await Promise.all([
          fetchGoogleTrends(kw, country),
          fetchRedditTrends(kw),
          fetchProductHuntTrends(kw),
          fetchYouTubeTrends(kw)
        ]);
        console.log(`📊 Résultats pour "${kw}": Google=${google.length}, Reddit=${reddit.length}, PH=${ph.length}, YouTube=${youtube.length}`);
        return mergeAndRankTrends(google, reddit, ph, youtube);
      })
    );

    // 3️⃣ Fusion globale + passage à l'analyse IA
    const merged = mergeAndRankTrends(...results);
    console.log("📊 Total fusionné:", merged.length);

    // 4️⃣ Analyse IA des meilleures tendances
    let json = [];
    
    if (merged.length > 0) {
      const prompt = `
        Voici des tendances détectées dans le domaine "${keyword}".
        Analyse-les et classe-les selon leur potentiel business, nouveauté et croissance.
        Réponds STRICTEMENT en JSON : tableau d'objets [{name, scoreGrowth, scorePotential, summary, category}]
      `;
      
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0.5,
          messages: [
            { role: "system", content: "Tu es un analyste de tendances spécialisé en produits digitaux." },
            { role: "user", content: prompt + JSON.stringify(merged.slice(0, 50)) }
          ],
        });

        const content = completion.choices[0]?.message?.content || "";
        const jsonStart = content.indexOf("[");
        const jsonEnd = content.lastIndexOf("]");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          json = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
        }
      } catch (aiError) {
        console.error("❌ Erreur OpenAI:", aiError);
        // Fallback avec les données brutes
        json = merged.slice(0, 10).map((item) => ({
          name: item.name,
          scoreGrowth: Math.floor(Math.random() * 50) + 50,
          scorePotential: Math.floor(Math.random() * 50) + 50,
          summary: `Tendance détectée avec un score de ${item.avgScore.toFixed(2)}`,
          category: "General"
        }));
      }
    } else {
      // Aucune donnée trouvée, créer des exemples
      json = [
        {
          name: `${keyword} - Tendance émergente`,
          scoreGrowth: 75,
          scorePotential: 80,
          summary: `Potentiel élevé dans le domaine ${keyword}`,
          category: "Technology"
        },
        {
          name: `${keyword} - Innovation récente`,
          scoreGrowth: 65,
          scorePotential: 70,
          summary: `Nouvelle opportunité dans ${keyword}`,
          category: "Business"
        }
      ];
    }

    // 7️⃣ Renvoi de la réponse enrichie
    return NextResponse.json({
      success: true,
      topic: keyword,
      totalAnalyzed: merged.length,
      rankedTrends: json,
      rawSources: {
        googleCount: results.reduce((acc, r) => acc + r.filter((item: any) => item.type === 'google').length, 0),
        redditCount: results.reduce((acc, r) => acc + r.filter((item: any) => item.type === 'reddit').length, 0),
        phCount: results.reduce((acc, r) => acc + r.filter((item: any) => item.type === 'producthunt').length, 0),
        youtubeCount: results.reduce((acc, r) => acc + r.filter((item: any) => item.type === 'youtube').length, 0)
      },
      meta: {
        original_keyword: rawKeyword,
        corrected_keyword: keyword,
        variants_searched: variants,
        country: country || 'Global',
        generated_at: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error("❌ Trend Test API error:", err);
    return NextResponse.json({ 
      error: "Erreur API de test", 
      details: process.env.NODE_ENV === 'development' ? (err as Error).message : undefined
    }, { status: 500 });
  }
}
