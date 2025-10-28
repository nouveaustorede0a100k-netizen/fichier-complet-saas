import { getSupabaseAdmin } from './supabase'
import {
  checkFeatureQuota,
  incrementUsageCounter,
  type UsageFeature
} from './usage'

type Payload = Record<string, unknown> | unknown[] | null

function safePayload(payload: Payload) {
  if (!payload) return null
  try {
    return JSON.parse(JSON.stringify(payload))
  } catch (error) {
    console.warn('[quota] Could not serialise payload:', error)
    return null
  }
}

export async function recordUsage(
  userId: string,
  feature: UsageFeature,
  requestPayload?: Payload,
  responsePayload?: Payload
) {
  const supabase = getSupabaseAdmin()
  const quota = await checkFeatureQuota(userId, feature)
  if (!quota.allowed) {
    throw new Error('Limite mensuelle atteinte pour cette fonctionnalité')
  }

  await incrementUsageCounter(userId, feature)

  try {
    await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        feature,
        request: safePayload(requestPayload),
        response: safePayload(responsePayload),
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.warn('[quota] Unable to store usage log:', error)
  }
}
