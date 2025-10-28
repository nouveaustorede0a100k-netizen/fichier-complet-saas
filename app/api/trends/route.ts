import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { fetchGoogleTrends } from "@/lib/trends/fetchGoogleTrends";
import { fetchRedditTrends } from "@/lib/trends/fetchReddit";
import { fetchProductHuntTrends } from "@/lib/trends/fetchProductHunt";
import { fetchYouTubeTrends } from "@/lib/trends/fetchYouTube";
import { mergeAndRankTrends } from "@/lib/trends/mergeAndRankTrends";
import { normalizeKeyword } from "@/lib/trends/normalizeKeyword";
import { getSupabaseAdmin } from '@/lib/supabase';
import { withAuth, createApiResponse, createErrorResponse } from '@/lib/middleware';
import { recordUsage } from '@/lib/quota';

export async function POST(req: NextRequest) {
  try {
    const { topic: rawKeyword = "digital business", country = "US" } = await req.json();

    // Vérifier l'authentification et les quotas
    const authResult = await withAuth(req, 'trendSearches');
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user, quotaCheck } = authResult;

    // 1️⃣ Correction + expansion du mot-clé
    const { keyword, variants } = await normalizeKeyword(rawKeyword);
    console.log("🔍 Mot-clé corrigé:", keyword, "Variantes:", variants);

    // 2️⃣ Récupération de tendances multi-sources pour toutes les variantes
    const results = await Promise.all(
      variants.map(async (kw: string) => {
        const [google, reddit, ph, youtube] = await Promise.all([
          fetchGoogleTrends(kw, country),
          fetchRedditTrends(kw),
          fetchProductHuntTrends(kw),
          fetchYouTubeTrends(kw)
        ]);
        return mergeAndRankTrends(google, reddit, ph, youtube);
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

    const content = completion.choices[0]?.message?.content || "";
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]");
    const json = JSON.parse(content.slice(jsonStart, jsonEnd + 1));

    // 5️⃣ Enregistrer l'utilisation
    await recordUsage(user.id, 'trendSearches', { topic: rawKeyword, country }, json);

    // 6️⃣ Sauvegarder la recherche
      try {
        const supabase = getSupabaseAdmin()
        await supabase
          .from('trend_searches')
          .insert({
          user_id: user.id,
          query: keyword,
          country: country || null,
          results: json,
          raw_sources: {
            googleCount: results.reduce((acc, r) => acc + r.filter((item: any) => item.type === 'google').length, 0),
            redditCount: results.reduce((acc, r) => acc + r.filter((item: any) => item.type === 'reddit').length, 0),
            phCount: results.reduce((acc, r) => acc + r.filter((item: any) => item.type === 'producthunt').length, 0),
            youtubeCount: results.reduce((acc, r) => acc + r.filter((item: any) => item.type === 'youtube').length, 0)
          }
          })
      } catch (dbError) {
        console.warn('Could not save to database:', dbError)
        // Continue without failing
      }

    // 7️⃣ Renvoi de la réponse enrichie
    return createApiResponse({
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
      quota: {
        remaining: quotaCheck.remaining,
        limit: quotaCheck.limit
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
    console.error("❌ Trend API error:", err);
    return createErrorResponse(
      process.env.NODE_ENV === 'development' ? (err as Error).message : "Erreur API de tendance",
      500
    );
  }
}
