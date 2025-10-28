import OpenAI from 'openai'

type ChatCompletionParams = {
  model: string
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  temperature?: number
  max_tokens?: number
}

interface MockChoice {
  message: { content: string }
}

interface MockChatCompletion {
  choices: MockChoice[]
}

class MockOpenAI {
  public readonly chat = {
    completions: {
      create: async ({ messages }: ChatCompletionParams): Promise<MockChatCompletion> => {
        const lastMessage = messages[messages.length - 1]?.content ?? ''
        const keywords = extractKeywords(lastMessage)
        const response = {
          keywords,
          categories: buildKeywordCategories(keywords)
        }
        return {
          choices: [{ message: { content: JSON.stringify(response) } }]
        }
      }
    }
  }
}

const shouldUseLiveOpenAI = Boolean(process.env.OPENAI_API_KEY)

export const openai: OpenAI | MockOpenAI = shouldUseLiveOpenAI
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : new MockOpenAI()

const FALLBACK_PLATFORMS = ['Amazon', 'Etsy', 'Gumroad', 'Shopify', 'Udemy']

const FALLBACK_AUDIENCES = ['Entrepreneurs', 'Freelancers', 'Coachs', 'Créateurs de contenu']

function createSeed(topic: string) {
  let hash = 0
  for (let i = 0; i < topic.length; i += 1) {
    hash = (hash << 5) - hash + topic.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateList(topic: string, count: number) {
  const seed = createSeed(topic)
  return Array.from({ length: count }).map((_, index) => {
    const value = seededRandom(seed + index)
    return `${capitalize(topic)} ${index + 1} ${value.toString(36).slice(2, 6)}`
  })
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function extractKeywords(text: string) {
  const matches = text.match(/[A-Za-zÀ-ÿ0-9]+/g) || []
  const keyword = matches.slice(-2).join(' ') || 'marketing'
  const base = keyword.toLowerCase()
  return Array.from(new Set([
    base,
    `${base} trends`,
    `${base} ideas`,
    `${base} strategies`,
    `${base} automation`,
    `${base} growth`
  ]))
}

function buildKeywordCategories(keywords: string[]) {
  const categories: Record<string, string[]> = {
    Core: [],
    Expansion: [],
    Advanced: []
  }
  keywords.forEach((keyword, index) => {
    if (index < 2) categories.Core.push(keyword)
    else if (index < 4) categories.Expansion.push(keyword)
    else categories.Advanced.push(keyword)
  })
  return categories
}

function createTrend(topic: string, index: number) {
  const baseScore = 60 + Math.floor(seededRandom(createSeed(`${topic}-${index}`)) * 40)
  return {
    name: `${capitalize(topic)} Insight ${index + 1}`,
    scoreGrowth: baseScore,
    scorePotential: Math.min(100, baseScore + 10),
    summary: `Idée de croissance pour ${topic} axée sur la stratégie ${index + 1}.`,
    category: index % 2 === 0 ? 'Opportunité' : 'Croissance'
  }
}

function createProduct(topic: string, index: number) {
  const seed = createSeed(`${topic}-${index}`)
  return {
    title: `${capitalize(topic)} Toolkit ${index + 1}`,
    platform: FALLBACK_PLATFORMS[index % FALLBACK_PLATFORMS.length],
    price: `${49 + (index * 20)}`,
    url: `https://example.com/${topic.replace(/\s+/g, '-')}/${index + 1}`,
    description: `Solution ${topic} prête à lancer avec un positionnement unique (${index + 1}).`,
    key_features: generateList(topic, 3),
    target_audience: FALLBACK_AUDIENCES[index % FALLBACK_AUDIENCES.length],
    success_factors: generateList(`${topic} success`, 3)
  }
}

function createOffer(topic: string) {
  const seed = createSeed(topic)
  const benefits = generateList(`${topic} benefit`, 3)
  return {
    title: `${capitalize(topic)} Master Offer`,
    promise: `Transformez votre approche ${topic} en 30 jours sans complexité.`,
    benefits,
    sales_page: `Page de vente complète mettant en avant ${benefits[0]?.toLowerCase()}.`,
    email_copy: `Campagne email en 5 messages pour convertir sur ${topic}.`
  }
}

function createAds(product: string, audience: string, platform: string) {
  const base = `${product} pour ${audience}`
  const headlines = generateList(base, 3)
  return {
    platform,
    headlines,
    descriptions: headlines.map((title) => `${title} - Proposition irrésistible pour ${audience}.`),
    call_to_action: ['Découvrir maintenant', 'Réserver ma place', 'Tester gratuitement'],
    target_audience: audience,
    budget_suggestion: `${(headlines.length * 50).toFixed(0)}€ / semaine`
  }
}

function createLaunchPlan(product: string, launchDate?: string, budget?: string) {
  const phases = ['Préparation', 'Pré-lancement', 'Lancement', 'Optimisation']
  return {
    title: `${product} Launch Plan`,
    description: `Plan de lancement structuré pour ${product}.`,
    timeline: phases.map((phase, index) => ({
      phase,
      duration: index === 0 ? '1 semaine' : '2 semaines',
      tasks: generateList(`${phase} ${product}`, 3),
      priority: index === 0 ? 'haute' : 'moyenne'
    })),
    budget: {
      total: Number.parseInt(budget || '5000', 10),
      breakdown: [
        { category: 'Acquisition', amount: 0.4, description: 'Campagnes payantes' },
        { category: 'Contenu', amount: 0.35, description: 'Création de contenus premium' },
        { category: 'Outils', amount: 0.25, description: 'Stack technique et automatisations' }
      ].map((entry) => ({
        category: entry.category,
        amount: Math.round(entry.amount * Number.parseInt(budget || '5000', 10)),
        description: entry.description
      }))
    },
    metrics: ['Leads', 'Conversions', 'ROI'].map((metric) => ({
      name: metric,
      target: `${metric === 'ROI' ? '150%' : '1000+'}`,
      description: `Indicateur clé pour suivre ${metric.toLowerCase()}.`
    })),
    checklist: generateList(`${product} checklist`, 5)
  }
}

async function tryLiveCall<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!shouldUseLiveOpenAI) {
    return fallback()
  }
  try {
    return await fn()
  } catch (error) {
    console.warn('[openai] Falling back to mock implementation:', error)
    return fallback()
  }
}

export async function analyzeTrends(topic: string) {
  return tryLiveCall(async () => {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.5,
      messages: [
        { role: 'system', content: 'Tu es un analyste de tendances spécialisé en SaaS.' },
        {
          role: 'user',
          content: `Analyse les tendances du sujet "${topic}". Retourne un JSON avec [{"name","scoreGrowth","scorePotential","summary","category"}].`
        }
      ]
    }) as any

    const raw = completion.choices?.[0]?.message?.content ?? '[]'
    return JSON.parse(raw)
  }, () => Array.from({ length: 5 }).map((_, index) => createTrend(topic, index)))
}

export async function findProducts(topic: string) {
  return tryLiveCall(async () => {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.6,
      messages: [
        { role: 'system', content: 'Tu es un expert en analyse de produits digitaux.' },
        {
          role: 'user',
          content: `Génère 5 produits gagnants pour le marché ${topic}. Réponds en JSON: [{"title","platform","price","url","description","key_features","target_audience","success_factors"}]`
        }
      ]
    }) as any

    const raw = completion.choices?.[0]?.message?.content ?? '[]'
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
    }
    return Array.from({ length: 5 }).map((_, index) => createProduct(topic, index))
  }, () => Array.from({ length: 5 }).map((_, index) => createProduct(topic, index)))
}

export async function generateOffer(topic: string) {
  return tryLiveCall(async () => {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'Tu es copywriter spécialisé en offres irrésistibles.' },
        {
          role: 'user',
          content: `Crée une offre irrésistible pour ${topic}. Réponds en JSON: {"title","promise","benefits","sales_page","email_copy"}`
        }
      ]
    }) as any

    const raw = completion.choices?.[0]?.message?.content ?? '{}'
    return JSON.parse(raw)
  }, () => createOffer(topic))
}

export async function generateAds(product: string, audience: string, platform: string) {
  return tryLiveCall(async () => {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'Tu es media buyer senior spécialisé en funnels SaaS.' },
        {
          role: 'user',
          content: `Génère des publicités pour ${product} ciblant ${audience} sur ${platform}. Réponds en JSON: {"platform","headlines","descriptions","call_to_action","target_audience","budget_suggestion"}`
        }
      ]
    }) as any

    const raw = completion.choices?.[0]?.message?.content ?? '{}'
    return JSON.parse(raw)
  }, () => createAds(product, audience, platform))
}

export async function generateLaunchPlan(product: string, launchDate?: string, budget?: string) {
  return tryLiveCall(async () => {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.6,
      messages: [
        { role: 'system', content: 'Tu es un stratège de lancement de produits digitaux.' },
        {
          role: 'user',
          content: `Élabore un plan de lancement pour ${product} (date: ${launchDate || 'à définir'}, budget: ${budget || '5000€'}). Réponds en JSON: {"title","description","timeline","budget":{"total","breakdown"},"metrics","checklist"}`
        }
      ]
    }) as any

    const raw = completion.choices?.[0]?.message?.content ?? '{}'
    return JSON.parse(raw)
  }, () => createLaunchPlan(product, launchDate, budget))
}

