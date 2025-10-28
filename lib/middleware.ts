import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseAdmin } from './supabase'
import {
  checkFeatureQuota,
  resolveUserPlan,
  type UsageFeature
} from './usage'

interface WithAuthResult {
  user: any
  subscription: any
  quotaCheck: {
    allowed: boolean
    remaining: number
    limit: number
  }
}

function normaliseHeader(request: NextRequest, key: string) {
  return request.headers.get(key) ?? request.headers.get(key.toLowerCase()) ?? request.headers.get(key.toUpperCase())
}

export function createApiResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export async function withAuth(request: NextRequest, feature?: UsageFeature): Promise<WithAuthResult | NextResponse> {
  const supabase = getSupabaseAdmin()
  const userId = normaliseHeader(request, 'x-user-id')
  if (!userId) {
    return createErrorResponse('Non authentifié', 401)
  }

  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    return createErrorResponse('Utilisateur introuvable', 401)
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  const plan = subscription?.plan ?? (await resolveUserPlan(userId))

  let quotaCheck = { allowed: true, remaining: Infinity, limit: Infinity }

  if (feature) {
    quotaCheck = await checkFeatureQuota(userId, feature, plan)
    if (!quotaCheck.allowed) {
      return createErrorResponse('Limite mensuelle atteinte', 429)
    }
  }

  return {
    user,
    subscription,
    quotaCheck
  }
}
