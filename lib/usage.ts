import { getSupabaseAdmin } from './supabase'

export const USAGE_FEATURES = [
  'trendSearches',
  'products',
  'offers',
  'ads',
  'launchPlans',
  'keywords'
] as const

export type UsageFeature = typeof USAGE_FEATURES[number]

export type PlanKey = 'free' | 'pro' | 'business'

const PLAN_LIMITS: Record<PlanKey, Record<UsageFeature, number>> = {
  free: {
    trendSearches: 10,
    products: 5,
    offers: 5,
    ads: 5,
    launchPlans: 2,
    keywords: 15
  },
  pro: {
    trendSearches: 100,
    products: 60,
    offers: 60,
    ads: 60,
    launchPlans: 30,
    keywords: 120
  },
  business: {
    trendSearches: 500,
    products: 200,
    offers: 200,
    ads: 200,
    launchPlans: 120,
    keywords: 600
  }
}

export interface QuotaCheck {
  allowed: boolean
  remaining: number
  limit: number
}

interface UsageRow {
  id?: string
  user_id: string
  feature: UsageFeature
  period: string
  count: number
}

const PERIOD_FORMATTER = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: '2-digit'
})

function getCurrentPeriod(date = new Date()) {
  const [{ value: year }, , { value: month }] = PERIOD_FORMATTER.formatToParts(date)
  return `${year}-${month}`
}

function getPlanLimit(plan: PlanKey, feature: UsageFeature) {
  return PLAN_LIMITS[plan][feature]
}

export async function resolveUserPlan(userId: string): Promise<PlanKey> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  const plan = (data as any)?.plan
  if (plan === 'pro' || plan === 'business') {
    return plan
  }
  return 'free'
}

async function getUsageRow(userId: string, feature: UsageFeature, period: string): Promise<UsageRow | null> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq('period', period)

  if (!data) {
    return null
  }

  const rows = Array.isArray(data) ? data : [data]
  return (rows[0] as UsageRow) ?? null
}

async function ensureUsageRow(userId: string, feature: UsageFeature, period: string): Promise<UsageRow> {
  const supabase = getSupabaseAdmin()
  const existing = await getUsageRow(userId, feature, period)
  if (existing) {
    return existing
  }
  const { data } = await supabase
    .from('user_usage')
    .insert({ user_id: userId, feature, period, count: 0 })
    .select('*')
    .single()

  return (data as UsageRow) ?? { user_id: userId, feature, period, count: 0 }
}

export async function checkFeatureQuota(userId: string, feature: UsageFeature, planOverride?: PlanKey): Promise<QuotaCheck> {
  const plan = planOverride ?? (await resolveUserPlan(userId))
  const period = getCurrentPeriod()
  const usage = await ensureUsageRow(userId, feature, period)
  const limit = getPlanLimit(plan, feature)
  const remaining = Math.max(0, limit - usage.count)
  return {
    allowed: remaining > 0,
    remaining,
    limit
  }
}

export async function incrementUsageCounter(userId: string, feature: UsageFeature, amount = 1) {
  const supabase = getSupabaseAdmin()
  const period = getCurrentPeriod()
  const usage = await ensureUsageRow(userId, feature, period)
  const newCount = usage.count + amount
  await supabase
    .from('user_usage')
    .update({ count: newCount })
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq('period', period)
  return newCount
}

export async function trackAndGuardUsage(userId: string, feature: UsageFeature) {
  const quota = await checkFeatureQuota(userId, feature)
  if (!quota.allowed) {
    throw new Error('Limite mensuelle atteinte pour cette fonctionnalité')
  }
  const used = await incrementUsageCounter(userId, feature)
  return {
    feature,
    used,
    remaining: Math.max(0, quota.limit - used),
    limit: quota.limit,
    period: getCurrentPeriod()
  }
}

export async function getUserUsageStats(userId: string) {
  const supabase = getSupabaseAdmin()
  const plan = await resolveUserPlan(userId)
  const period = getCurrentPeriod()
  const entries: Record<UsageFeature, { used: number; limit: number }> = {
    trendSearches: { used: 0, limit: getPlanLimit(plan, 'trendSearches') },
    products: { used: 0, limit: getPlanLimit(plan, 'products') },
    offers: { used: 0, limit: getPlanLimit(plan, 'offers') },
    ads: { used: 0, limit: getPlanLimit(plan, 'ads') },
    launchPlans: { used: 0, limit: getPlanLimit(plan, 'launchPlans') },
    keywords: { used: 0, limit: getPlanLimit(plan, 'keywords') }
  }

  const { data } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('period', period)

  if (data) {
    const rows = Array.isArray(data) ? data : [data]
    rows.forEach((row: UsageRow) => {
      if (row && entries[row.feature]) {
        entries[row.feature].used = row.count
      }
    })
  }

  return {
    plan,
    period,
    usage: entries
  }
}
