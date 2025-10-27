// ===========================================
// TYPES CENTRALISÉS - DROP EAZY SAAS
// ===========================================

// ===========================================
// TYPES UTILISATEUR & AUTHENTIFICATION
// ===========================================

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_plan: 'free' | 'pro' | 'premium'
  stripe_customer_id?: string
  created_at: string
  updated_at?: string
}

export interface Profile {
  id: string
  full_name?: string
  avatar_url?: string
  subscription_plan: 'free' | 'pro' | 'premium'
  stripe_customer_id?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

// ===========================================
// TYPES QUOTAS & LIMITES
// ===========================================

export interface QuotaLimits {
  trendSearches: { used: number; limit: number }
  productAnalyses: { used: number; limit: number }
  offerGenerations: { used: number; limit: number }
  adCampaigns: { used: number; limit: number }
  launchPlans: { used: number; limit: number }
}

export interface QuotaCheck {
  allowed: boolean
  remaining: number
  limit: number
  resetDate?: string
}

// ===========================================
// TYPES TENDANCES
// ===========================================

export interface TrendResult {
  name: string
  scoreGrowth: number
  scorePotential: number
  summary: string
  category: string
  metadata?: {
    description?: string
    publishedAt?: string
    channelTitle?: string
    comments?: number
  }
}

export interface TrendsResponse {
  success: boolean
  topic: string
  totalAnalyzed: number
  rankedTrends: TrendResult[]
  rawSources: {
    googleCount: number
    redditCount: number
    phCount: number
    youtubeCount: number
  }
  quota: {
    remaining: number
    limit: number
  }
  meta: {
    original_keyword: string
    corrected_keyword: string
    variants_searched: string[]
    country: string
    generated_at: string
  }
}

export interface TrendSource {
  name: string
  value: number
  type: 'google' | 'reddit' | 'producthunt' | 'youtube'
  description?: string
  publishedAt?: string
  channelTitle?: string
  comments?: number
  tagline?: string
}

// ===========================================
// TYPES PRODUITS
// ===========================================

export interface Product {
  id?: string
  title: string
  platform: string
  price: string
  url?: string
  description: string
  key_features: string[]
  target_audience: string
  success_factors: string[]
  created_at?: string
}

export interface ProductAnalysis {
  title: string
  platform: string
  price: string
  url?: string
  description: string
  key_features: string[]
  target_audience: string
  success_factors: string[]
}

// ===========================================
// TYPES OFFRES
// ===========================================

export interface Offer {
  id?: string
  title: string
  promise: string
  benefits: string[]
  sales_page: string
  email_copy: string
  created_at?: string
}

export interface OfferAnalysis {
  title: string
  promise: string
  benefits: string[]
  sales_page: string
  email_copy: string
}

// ===========================================
// TYPES PUBLICITÉS
// ===========================================

export interface Ad {
  id?: string
  platform: string
  headlines: string[]
  descriptions: string[]
  call_to_action: string[]
  target_audience: string
  budget_suggestion: string
  created_at?: string
}

export interface AdAnalysis {
  platform: string
  headlines: string[]
  descriptions: string[]
  call_to_action: string[]
  target_audience: string
  budget_suggestion: string
}

// ===========================================
// TYPES LANCEMENT
// ===========================================

export interface LaunchPlan {
  id?: string
  title: string
  description: string
  timeline: LaunchPhase[]
  budget: LaunchBudget
  metrics: LaunchMetric[]
  checklist: string[]
  created_at?: string
}

export interface LaunchPhase {
  phase: string
  duration: string
  tasks: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface LaunchBudget {
  total: number
  breakdown: LaunchBudgetItem[]
}

export interface LaunchBudgetItem {
  category: string
  amount: number
  description: string
}

export interface LaunchMetric {
  name: string
  target: string
  description: string
}

export interface LaunchPlanAnalysis {
  title: string
  description: string
  timeline: LaunchPhase[]
  budget: LaunchBudget
  metrics: LaunchMetric[]
  checklist: string[]
}

// ===========================================
// TYPES DASHBOARD
// ===========================================

export interface DashboardStats {
  user: User
  quotas: QuotaLimits
  recentActivity: {
    trends: number
    products: number
    offers: number
    ads: number
    launches: number
  }
  totalUsage: {
    trendSearches: { used: number; limit: number }
    productAnalyses: { used: number; limit: number }
    offerGenerations: { used: number; limit: number }
    adCampaigns: { used: number; limit: number }
    launchPlans: { used: number; limit: number }
  }
}

// ===========================================
// TYPES API RESPONSES
// ===========================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  quota?: {
    remaining: number
    limit: number
  }
}

export interface ApiError {
  success: false
  error: string
  code?: string
  details?: any
}

// ===========================================
// TYPES STRIPE
// ===========================================

export interface StripePlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  popular?: boolean
}

export interface CheckoutSession {
  id: string
  url: string
}

// ===========================================
// TYPES FORMULAIRES
// ===========================================

export interface TrendSearchForm {
  topic: string
  country: string
}

export interface ProductSearchForm {
  niche: string
  platform?: string
}

export interface OfferForm {
  idea: string
  target_audience?: string
}

export interface AdForm {
  product: string
  target_audience: string
  platform: string
}

export interface LaunchForm {
  product: string
  launch_date?: string
  budget?: string
}

// ===========================================
// TYPES UTILITAIRES
// ===========================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams {
  query?: string
  category?: string
  dateFrom?: string
  dateTo?: string
}

// ===========================================
// TYPES ENVIRONNEMENT
// ===========================================

export interface EnvironmentConfig {
  supabase: {
    url: string
    anonKey: string
  }
  openai: {
    apiKey: string
    model?: string
  }
  stripe: {
    secretKey: string
    publishableKey: string
    webhookSecret: string
  }
  youtube?: {
    apiKey: string
  }
  productHunt?: {
    token: string
  }
}
