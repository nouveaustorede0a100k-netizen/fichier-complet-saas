# 🚀 Trend Finder Pro - Module d'Analyse de Tendances

Module complet d'analyse de tendances pour Drop Eazy, intégrant Google Trends, Reddit et Product Hunt avec intelligence artificielle.

## 📋 Fonctionnalités

- ✅ **Analyse multi-sources** : Google Trends, Reddit, Product Hunt
- ✅ **Intelligence artificielle** : Scoring et insights avec OpenAI GPT-4
- ✅ **Cache intelligent** : Résultats mis en cache 6h pour optimiser les performances
- ✅ **Historique utilisateur** : Sauvegarde des analyses précédentes
- ✅ **Interface interactive** : Graphiques temps réel avec Recharts
- ✅ **Rate limiting** : Protection contre l'abus (10 req/min)
- ✅ **Fallbacks robustes** : Fonctionne même si certaines APIs sont indisponibles

## 🛠️ Installation

### 1. Dépendances

```bash
npm install google-trends-api snoowrap recharts date-fns
```

### 2. Variables d'environnement

Créez un fichier `.env` avec les variables suivantes :

```env
# OpenAI (OBLIGATOIRE)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4  # ou gpt-3.5-turbo pour économiser

# Supabase (OBLIGATOIRE)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Pour les opérations serveur

# Product Hunt (OPTIONNEL)
PRODUCTHUNT_TOKEN=your-producthunt-token-here

# Reddit (OPTIONNEL - pour plus de précision)
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
REDDIT_REFRESH_TOKEN=your-reddit-refresh-token
```

### 3. Configuration Supabase

Exécutez le schéma SQL dans l'éditeur SQL de Supabase :

```sql
-- Voir le fichier supabase-trends-schema.sql
```

### 4. Configuration Product Hunt (Optionnel)

1. Allez sur [Product Hunt API](https://api.producthunt.com/v2/docs)
2. Créez une application
3. Générez un token d'accès
4. Ajoutez-le à vos variables d'environnement

### 5. Configuration Reddit (Optionnel)

1. Allez sur [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Créez une nouvelle application (script)
3. Notez le Client ID et Secret
4. Générez un refresh token avec [PRAW](https://praw.readthedocs.io/)

## 🚀 Utilisation

### API Endpoint

**POST** `/api/trends-pro`

```json
{
  "topic": "fitness",
  "country": "US",
  "range": "30d",
  "userId": "optional-user-id"
}
```

**Réponse :**

```json
{
  "ok": true,
  "topic": "fitness",
  "country": "US",
  "range": "30d",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "scores": {
    "growth": 82,
    "marketPotential": 74,
    "confidence": 85
  },
  "timeseries": [
    {
      "date": "2024-01-01",
      "value": 75,
      "rawValue": 85
    }
  ],
  "sources": {
    "googleTrends": {
      "available": true,
      "averageValue": 75,
      "relativeScore": 15
    },
    "reddit": {
      "available": true,
      "totalMentions": 150,
      "avgScore": 25,
      "mentionsGrowth": 12,
      "topPosts": [...]
    },
    "productHunt": {
      "available": true,
      "totalPosts": 8,
      "avgUpvotes": 45,
      "trendSignal": 60,
      "recentLaunches": [...]
    }
  },
  "aiAnalysis": {
    "actionableInsights": [
      "Le fitness montre une croissance stable de 15% sur 30 jours",
      "Reddit montre un engagement élevé avec 150 mentions cette semaine",
      "Product Hunt indique 8 nouveaux produits fitness lancés récemment"
    ],
    "potentialPitfalls": [
      "Concurrence élevée - différenciez votre offre",
      "Saisonnalité possible - préparez des variations"
    ],
    "recommendedStrategy": "Approche rapide basée sur la forte demande actuelle",
    "nextSteps": [
      "Analyser la concurrence directe",
      "Créer un MVP rapidement",
      "Tester sur Reddit d'abord"
    ]
  },
  "cached": false
}
```

### Frontend

Accédez à `/trends-pro` pour l'interface utilisateur complète.

## 🔧 Architecture

```
/lib/trends/
├── fetchSources.js    # Récupération données (Google, Reddit, Product Hunt)
├── normalize.js       # Normalisation et nettoyage des données
└── scoreAndExplain.js # Analyse IA avec OpenAI

/app/api/trends-pro/
└── route.js           # Endpoint principal

/components/
├── TrendCard.jsx      # Carte d'affichage d'une tendance
└── TrendChart.jsx     # Graphique temps réel

/app/trends-pro/
└── page.tsx           # Page frontend interactive
```

## 📊 Sources de Données

### Google Trends
- **Librairie** : `google-trends-api`
- **Données** : Intérêt dans le temps, scores relatifs
- **Limitations** : Rate limiting, données normalisées

### Reddit
- **API** : JSON public + Snoowrap (fallback)
- **Données** : Posts, scores, commentaires, croissance
- **Limitations** : Rate limiting, données publiques uniquement

### Product Hunt
- **API** : GraphQL officielle
- **Données** : Launches récents, upvotes, tendances
- **Limitations** : Token requis, limite de requêtes

## 🤖 Intelligence Artificielle

### Prompt OpenAI

Le module utilise un prompt structuré pour analyser les métriques :

```
Tu es un analyste produit expert spécialisé dans l'identification de niches rentables pour les infopreneurs.

MÉTRIQUES BRUTES:
- Score Google Trends: 75/100
- Engagement Reddit: 25/100
- Score Product Hunt: 45/100
- Croissance estimée: 15%
- Vélocité: 60/100
- ...

TÂCHE: Analyse et fournis une évaluation complète pour un infopreneur.
```

### Scoring

- **Growth Score** (1-100) : Potentiel de croissance
- **Market Potential** (1-100) : Taille et accessibilité du marché
- **Confidence Level** (1-100) : Confiance dans l'analyse

## 🚦 Rate Limiting

- **Limite** : 10 requêtes par minute par utilisateur
- **Identification** : User ID ou IP
- **Storage** : En mémoire (Map)
- **Reset** : Toutes les minutes

## 💾 Cache

- **Storage** : Table Supabase `trend_cache`
- **Durée** : 6 heures
- **Clé** : `topic + country + range`
- **Nettoyage** : Automatique via fonction SQL

## 🧪 Tests

### Test unitaire simple

```javascript
// test-trends.js
const { fetchGoogleTrends } = require('./lib/trends/fetchSources');

async function testGoogleTrends() {
  try {
    const result = await fetchGoogleTrends('fitness', 'US', '30d');
    console.log('✅ Google Trends test passed:', result);
  } catch (error) {
    console.error('❌ Google Trends test failed:', error);
  }
}

testGoogleTrends();
```

### Test de l'API

```bash
curl -X POST http://localhost:3000/api/trends-pro \
  -H "Content-Type: application/json" \
  -d '{"topic": "fitness", "country": "US", "range": "30d"}'
```

## 🐛 Dépannage

### Erreurs communes

1. **"Invalid supabaseUrl"**
   - Vérifiez `NEXT_PUBLIC_SUPABASE_URL` dans `.env`

2. **"No response from OpenAI"**
   - Vérifiez `OPENAI_API_KEY` et votre quota

3. **"Reddit API error: 429"**
   - Rate limiting Reddit, utilisez Snoowrap ou attendez

4. **"Product Hunt API error: 401"**
   - Vérifiez `PRODUCTHUNT_TOKEN`

### Logs

Le module logge toutes les étapes importantes :

```
🔍 Fetching Google Trends for: fitness (US, 30d)
📊 Fetching data from all sources...
🔄 Normalizing data...
🤖 Running AI analysis...
✅ AI analysis complete: { growthScore: 82, marketPotential: 74 }
💾 Result saved to cache
```

## 📈 Performance

- **Cache hit** : ~50ms
- **Cache miss** : ~3-5s (selon les APIs)
- **Fallback** : ~1-2s (Google Trends + IA uniquement)
- **Mémoire** : ~10MB pour le rate limiting

## 🔒 Sécurité

- ✅ Variables d'environnement sécurisées
- ✅ Rate limiting côté serveur
- ✅ Validation des entrées
- ✅ Gestion d'erreurs robuste
- ✅ Pas d'exposition des clés API côté client

## 🚀 Déploiement

1. Configurez les variables d'environnement sur Vercel
2. Exécutez le schéma SQL sur Supabase
3. Testez l'endpoint `/api/trends-pro`
4. Vérifiez l'interface `/trends-pro`

## 📝 Changelog

### v1.0.0
- ✅ Intégration Google Trends, Reddit, Product Hunt
- ✅ Analyse IA avec OpenAI
- ✅ Cache Supabase
- ✅ Interface frontend complète
- ✅ Rate limiting et sécurité

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.
