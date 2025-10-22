# 🔥 Pipeline d'Analyse de Tendances - Drop Eazy

## Vue d'ensemble

Le module `/api/trends` a été transformé en un pipeline complet d'analyse de tendances qui collecte des données réelles depuis plusieurs sources, les normalise, les score et les analyse avec l'IA.

## 🏗️ Architecture du Pipeline

### 1️⃣ **Normalisation des Mots-Clés** (`/lib/trends/normalizeKeyword.ts`)
- **Fonction** : Corrige les fautes d'orthographe et génère des variantes
- **IA** : Utilise GPT-4o-mini pour la correction et l'expansion
- **Exemple** : "ai tool" → "AI tools" + ["artificial intelligence tools", "AI software", "machine learning tools"]

### 2️⃣ **Collecte Multi-Sources**

#### **Google Trends** (`/lib/trends/fetchGoogleTrends.ts`)
- **Source** : API Google Trends
- **Données** : Sujets liés avec scores de popularité
- **Géolocalisation** : Support des pays (US, FR, etc.)

#### **Reddit** (`/lib/trends/fetchReddit.ts`)
- **Source** : API Reddit publique
- **Données** : Posts populaires du mois avec scores
- **Filtrage** : Tri par popularité et récence

#### **ProductHunt** (`/lib/trends/fetchProductHunt.ts`)
- **Source** : API GraphQL ProductHunt
- **Données** : Produits récents avec votes
- **Token** : Nécessite `PRODUCTHUNT_TOKEN` dans les variables d'environnement

### 3️⃣ **Fusion et Scoring** (`/lib/trends/mergeAndRankTrends.ts`)
- **Déduplication** : Fusion des sujets similaires
- **Scoring** : Calcul de scores moyens pondérés
- **Classement** : Tri par score décroissant

### 4️⃣ **Analyse IA** (dans `/api/trends/route.ts`)
- **Modèle** : GPT-4o-mini
- **Input** : Top 50 tendances fusionnées
- **Output** : Analyse business avec scores de croissance et potentiel

## 📊 Format de Réponse

```json
{
  "success": true,
  "topic": "AI tools",
  "totalAnalyzed": 72,
  "rankedTrends": [
    {
      "name": "AI Video Tools",
      "scoreGrowth": 92,
      "scorePotential": 87,
      "summary": "Très forte traction sur TikTok et PH",
      "category": "Video & AI"
    },
    {
      "name": "AI SEO Tools",
      "scoreGrowth": 75,
      "scorePotential": 82,
      "summary": "Croissance stable et monétisable",
      "category": "SEO & Marketing"
    }
  ],
  "rawSources": {
    "googleCount": 20,
    "redditCount": 30,
    "phCount": 22
  },
  "meta": {
    "original_keyword": "ai tool",
    "corrected_keyword": "AI tools",
    "variants_searched": ["AI tools", "artificial intelligence tools", "AI software"],
    "country": "US",
    "generated_at": "2024-01-01T00:00:00.000Z",
    "user_plan": "free"
  }
}
```

## 🚀 Fonctionnalités Avancées

### ✅ **Correction Intelligente**
- Détecte et corrige les fautes d'orthographe
- Génère des variantes sémantiques
- Support multilingue

### ✅ **Collecte Multi-Sources**
- **Google Trends** : Données de recherche globales
- **Reddit** : Sentiment communautaire et discussions
- **ProductHunt** : Produits émergents et votes

### ✅ **Scoring Quantitatif**
- Scores basés sur la popularité réelle
- Pondération par nombre de mentions
- Déduplication intelligente

### ✅ **Analyse Business**
- Potentiel de croissance évalué par l'IA
- Catégorisation automatique
- Résumés actionables

## 🔧 Configuration Requise

### Variables d'Environnement
```env
OPENAI_API_KEY=your_openai_key
PRODUCTHUNT_TOKEN=your_producthunt_token  # Optionnel
```

### Dépendances
```json
{
  "google-trends-api": "^4.9.0"
}
```

## 🧪 Test du Pipeline

```bash
# Test avec mot-clé simple
curl -X POST http://localhost:3000/api/trends \
  -H "Content-Type: application/json" \
  -d '{"topic": "ai tools", "country": "US"}'

# Test avec mot-clé avec fautes
curl -X POST http://localhost:3000/api/trends \
  -H "Content-Type: application/json" \
  -d '{"topic": "ai tols", "country": "FR"}'
```

## 📈 Avantages du Nouveau Pipeline

1. **Données Réelles** : Plus de simulation, collecte de vraies tendances
2. **Robustesse** : Gestion d'erreurs et fallbacks pour chaque source
3. **Intelligence** : Correction automatique des mots-clés
4. **Complétude** : Analyse multi-sources pour une vue d'ensemble
5. **Actionnable** : Scores et analyses business exploitables

## 🔄 Flux de Données

```
Mot-clé utilisateur
    ↓
Correction IA + Variantes
    ↓
Collecte parallèle (Google + Reddit + ProductHunt)
    ↓
Fusion et déduplication
    ↓
Scoring quantitatif
    ↓
Analyse IA des top tendances
    ↓
Réponse structurée
```

Le pipeline transforme un simple mot-clé en une analyse complète de tendances avec données réelles et insights business ! 🎯
