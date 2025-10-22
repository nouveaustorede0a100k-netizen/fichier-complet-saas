# 🚀 Drop Eazy API Documentation

## Vue d'ensemble

Les 5 routes API de Drop Eazy sont maintenant entièrement fonctionnelles et connectées à OpenAI. Chaque route génère du contenu personnalisé pour les infopreneurs.

## 📊 Routes API

### 1. `/api/trends` - Analyse des tendances

**Méthode:** `POST`

**Body JSON:**
```json
{
  "topic": "ai tools",
  "country": "US",
  "userId": "optional"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "name": "ai tools - Tendance 1",
      "score": 85,
      "growth": "+85%",
      "description": "Stratégie recommandée par l'IA",
      "related_terms": ["insight1", "insight2", "insight3", "insight4"],
      "opportunities": ["opportunité1", "opportunité2"],
      "risks": ["risque1", "risque2"],
      "confidence": 90,
      "next_steps": ["étape1", "étape2"]
    }
  ],
  "meta": {
    "topic": "ai tools",
    "country": "US",
    "generated_at": "2024-01-01T00:00:00.000Z",
    "user_plan": "free"
  }
}
```

### 2. `/api/products` - Recherche de produits

**Méthode:** `POST`

**Body JSON:**
```json
{
  "niche": "fitness",
  "userId": "optional"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "product_1",
      "name": "Programme Fitness 30 jours",
      "platform": "Gumroad",
      "price": "€97",
      "url": "https://example.com",
      "description": "Description du produit",
      "key_features": ["feature1", "feature2"],
      "target_audience": "Débutants en fitness",
      "success_factors": ["facteur1", "facteur2"],
      "market_potential": 85,
      "competition_level": 45,
      "profit_margin": 35
    }
  ],
  "meta": {
    "niche": "fitness",
    "count": 1,
    "generated_at": "2024-01-01T00:00:00.000Z",
    "user_plan": "free"
  }
}
```

### 3. `/api/offers` - Génération d'offres

**Méthode:** `POST`

**Body JSON:**
```json
{
  "niche": "coaching",
  "userId": "optional"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "offer_1234567890",
    "title": "Coaching Personnalisé",
    "promise": "Transformez votre vie en 90 jours",
    "benefits": ["bénéfice1", "bénéfice2", "bénéfice3"],
    "sales_page": "Contenu de la page de vente",
    "email_copy": "Séquence d'emails",
    "price": "€197",
    "conversion_rate": 12,
    "urgency_level": 2,
    "social_proof": ["500+ clients satisfaits", "4.8/5 étoiles"]
  },
  "meta": {
    "niche": "coaching",
    "generated_at": "2024-01-01T00:00:00.000Z",
    "user_plan": "free"
  }
}
```

### 4. `/api/ads` - Création de publicités

**Méthode:** `POST`

**Body JSON:**
```json
{
  "productName": "Formation Marketing",
  "targetAudience": "Entrepreneurs",
  "platform": "Facebook",
  "userId": "optional"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "ad_campaign_1234567890",
    "platform": "Facebook",
    "headlines": ["Titre 1", "Titre 2"],
    "descriptions": ["Description 1", "Description 2"],
    "call_to_action": ["Découvrir", "En savoir plus"],
    "target_audience": "Entrepreneurs",
    "budget_suggestion": "€500-1000/mois",
    "estimated_reach": 35000,
    "estimated_clicks": 750,
    "estimated_conversions": 35,
    "ctr": "2.14",
    "cpc": "€1.25",
    "creative_suggestions": ["Utiliser des couleurs vives", "Mettre en avant les bénéfices"]
  },
  "meta": {
    "product_name": "Formation Marketing",
    "platform": "Facebook",
    "generated_at": "2024-01-01T00:00:00.000Z",
    "user_plan": "free"
  }
}
```

### 5. `/api/launch` - Plans de lancement

**Méthode:** `POST`

**Body JSON:**
```json
{
  "productName": "Mon Produit",
  "launchDate": "2024-03-01",
  "budget": "€5000",
  "userId": "optional"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "launch_plan_1234567890",
    "title": "Plan de lancement Mon Produit",
    "description": "Description du plan",
    "timeline": [
      {
        "id": "phase_1",
        "phase": "Préparation",
        "duration": "2 semaines",
        "tasks": ["Tâche 1", "Tâche 2"],
        "priority": "Haute",
        "status": "pending",
        "completion_percentage": 0
      }
    ],
    "budget": {
      "total": 5000,
      "breakdown": [
        {
          "id": "budget_item_1",
          "category": "Marketing",
          "amount": 2500,
          "description": "Publicités et promotion",
          "percentage": 50
        }
      ]
    },
    "metrics": [
      {
        "id": "metric_1",
        "name": "Ventes",
        "target": "100 unités",
        "description": "Objectif de vente",
        "current_value": 0,
        "progress_percentage": 0
      }
    ],
    "checklist": [
      {
        "id": "checklist_item_1",
        "task": "Créer la page de vente",
        "completed": false,
        "due_date": null
      }
    ],
    "launch_date": "2024-03-01T00:00:00.000Z",
    "status": "draft",
    "success_probability": 85,
    "risk_factors": ["Concurrence accrue", "Changements de marché"],
    "success_factors": ["Marketing efficace", "Qualité du produit"]
  },
  "meta": {
    "product_name": "Mon Produit",
    "launch_date": "2024-03-01T00:00:00.000Z",
    "generated_at": "2024-01-01T00:00:00.000Z",
    "user_plan": "free"
  }
}
```

## 🔧 Fonctionnalités

### ✅ Implémentées

- **Intégration OpenAI complète** : Toutes les routes utilisent les fonctions OpenAI existantes
- **Format JSON standardisé** : Réponses cohérentes avec `success`, `data`, et `meta`
- **Gestion d'erreurs robuste** : Messages d'erreur détaillés en développement
- **Sauvegarde Supabase** : Persistance des données pour les utilisateurs connectés
- **Vérification du plan utilisateur** : Placeholder prêt pour l'implémentation
- **Logs détaillés** : Traçabilité complète des opérations

### 🚀 Prêtes pour l'utilisation

Toutes les routes sont maintenant fonctionnelles et peuvent être testées immédiatement. Elles génèrent du contenu réel via OpenAI et retournent des réponses structurées exploitables par le frontend.

## 🧪 Test des routes

Vous pouvez tester chaque route avec curl ou Postman :

```bash
# Test de la route trends
curl -X POST http://localhost:3000/api/trends \
  -H "Content-Type: application/json" \
  -d '{"topic": "ai tools", "country": "US"}'

# Test de la route products
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"niche": "fitness"}'
```

## 📝 Notes importantes

- Assurez-vous que `OPENAI_API_KEY` est configuré dans vos variables d'environnement
- Les routes gèrent automatiquement les erreurs et continuent de fonctionner même si Supabase est indisponible
- Le plan utilisateur est actuellement en placeholder - à implémenter selon vos besoins de monétisation
