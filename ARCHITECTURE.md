# Architecture du Projet - Drop Eazy SaaS

## 📁 Structure des Clients API

Tous les clients API sont centralisés dans `/lib/clients/` :

```
lib/clients/
├── index.ts           # Export centralisé de tous les clients
├── openai.ts          # Client OpenAI
├── supabase.ts        # Client Supabase (frontend + admin)
├── stripe.ts          # Client Stripe (server + client)
├── google-trends.ts   # Client Google Trends API
├── producthunt.ts     # Client ProductHunt GraphQL API
├── reddit.ts          # Client Reddit JSON API
└── youtube.ts         # Client YouTube Data API
```

## 🔐 Variables d'Environnement

### Obligatoires

```bash
# OpenAI (IA)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Optionnelles (pour les tendances)

```bash
# Google Trends
# (Utilise google-trends-api, pas de clé requise)

# ProductHunt
PRODUCTHUNT_TOKEN=phc_...

# YouTube
YOUTUBE_API_KEY=AIza...

# Reddit
# (API publique, pas de clé requise)
```

## 🏗️ Architecture des Routes API

### Routes existantes avec clients centralisés

| Route | Client utilisé | Tracking | Usage |
|-------|---------------|----------|-------|
| `/api/products` | OpenAI | ✅ | `lib/usage.ts` |
| `/api/ads` | OpenAI | ✅ | `lib/usage.ts` |
| `/api/keywords` | OpenAI | ✅ | `lib/usage.ts` |
| `/api/trends` | Google/Reddit/PH/YT | ✅ | `lib/usage.ts` |
| `/api/offers` | OpenAI | ✅ | `lib/usage.ts` |
| `/api/launch` | OpenAI | ✅ | `lib/usage.ts` |

### Stripe (Paiements)

| Route | Client utilisé | Tracking | Usage |
|-------|---------------|----------|-------|
| `/api/stripe/checkout` | Stripe | ❌ | Direct |
| `/api/stripe/create-checkout-session` | Stripe | ❌ | Direct |
| `/api/stripe/webhook` | Stripe | ❌ | Webhook Stripe |

## 🔄 Flux d'Utilisation

### 1. Analyse de Produits

```
Client → /api/products → OpenAI Client → Usage Tracker → Supabase
```

### 2. Génération de Publicités

```
Client → /api/ads → OpenAI Client → Usage Tracker → Supabase
```

### 3. Analyse de Tendances

```
Client → /api/trends → Multi-clients (Google/Reddit/PH/YT) → OpenAI → Usage Tracker → Supabase
```

### 4. Processus de Paiement

```
Client → /api/stripe/checkout → Stripe Client → Webhook → Supabase (subscription)
```

## 📊 Tracking d'Usage

### Système de Quotas

Défini dans `lib/usage.ts` :

```typescript
const USAGE_LIMITS = {
  free: 100,
  pro: 1000,
  business: 5000
}
```

### Fonctions de Tracking

- `trackAndGuardUsage()` : Vérifie et incrémente le compteur
- `getUserUsageStats()` : Récupère les stats d'usage
- `canUseFeature()` : Vérifie si une feature est accessible

## 🔧 Clients API Centralisés

### OpenAI (`lib/clients/openai.ts`)

```typescript
import { openaiClient } from '@/lib/clients/openai';

// Singleton avec gestion d'erreurs
const openai = openaiClient;
```

### Supabase (`lib/clients/supabase.ts`)

```typescript
import { supabaseClient, supabaseAdminClient } from '@/lib/clients/supabase';

// Client frontend
const supabase = supabaseClient;

// Client admin
const supabaseAdmin = supabaseAdminClient;
```

### Stripe (`lib/clients/stripe.ts`)

```typescript
import { stripeClient, stripePromise } from '@/lib/clients/stripe';

// Client serveur
const stripe = stripeClient;

// Client frontend (promise)
const stripeP = stripePromise;
```

### Tendances (`lib/clients/*.ts`)

```typescript
import { 
  fetchGoogleTrends, 
  fetchProductHuntTrends,
  fetchRedditTrends,
  fetchYouTubeTrends 
} from '@/lib/clients';
```

## 🧪 Tests

### Variables d'environnement de test

```bash
# .env.test
OPENAI_API_KEY=sk-test-key
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
STRIPE_SECRET_KEY=sk_test_...
```

### Exécution des tests

```bash
npm run test
npm run test:trends
npm run test:complete
```

## ✅ Checklist de Déploiement

- [ ] Toutes les variables d'env sont définies dans Vercel
- [ ] Webhook Stripe est configuré
- [ ] Supabase tables sont créées
- [ ] OpenAI API key est valide
- [ ] Stripe plan IDs sont configurés
- [ ] Tracking d'usage fonctionne
- [ ] Les routes API sont accessibles

## 🔍 Vérification de l'Architecture

### Fichiers à vérifier

1. **Clients centraux** : `/lib/clients/*.ts`
2. **Compatibilité** : `/lib/openai.ts`, `/lib/supabase.ts`, `/lib/stripe.ts`
3. **Routes API** : `/app/api/**/route.ts`
4. **Tracking** : `/lib/usage.ts`
5. **Variables** : `env.example`

### Commandes de vérification

```bash
# Vérifier la structure
tree lib/clients/

# Vérifier les imports
grep -r "lib/clients" app/api/

# Vérifier les variables
npm run check:env
```

---

**Dernière mise à jour** : {{ date }}
**Version** : 1.0.0
**Architecture** : Centralisée avec clients API modulaires

