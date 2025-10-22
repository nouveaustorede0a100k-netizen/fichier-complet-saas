# 🚀 Guide de Déploiement - Drop Eazy SaaS

## ✅ Déploiement Automatique via GitHub

Votre application Drop Eazy est maintenant configurée pour se déployer automatiquement sur Vercel à chaque push vers la branche `main`.

### 📊 Dernières Fonctionnalités Déployées

- **🔥 Pipeline de Tendances Complet** : Collecte multi-sources (Google Trends, Reddit, ProductHunt)
- **🧠 Correction Intelligente** : Détection et correction automatique des mots-clés
- **📈 Analyse IA Avancée** : GPT-4o-mini pour l'analyse des tendances
- **🛡️ Gestion d'Erreurs Robuste** : Toutes les routes API sont sécurisées
- **🌍 Support Géolocalisation** : Analyse par pays (US, FR, etc.)

## 🔧 Configuration Vercel

### Variables d'Environnement Obligatoires

1. **OPENAI_API_KEY** - Votre clé API OpenAI
2. **NEXT_PUBLIC_SUPABASE_URL** - URL de votre projet Supabase
3. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Clé anonyme Supabase

### Variables Optionnelles

- **PRODUCTHUNT_TOKEN** - Pour l'analyse ProductHunt (recommandé)
- **SUPABASE_SERVICE_ROLE_KEY** - Pour les opérations serveur
- **STRIPE_*** - Pour les paiements (si activé)

## 🎯 URLs des Routes API

Une fois déployé, vos routes API seront disponibles à :

```
https://votre-app.vercel.app/api/trends
https://votre-app.vercel.app/api/products
https://votre-app.vercel.app/api/offers
https://votre-app.vercel.app/api/ads
https://votre-app.vercel.app/api/launch
```

## 🧪 Test du Déploiement

```bash
# Test de la route trends avec le nouveau pipeline
curl -X POST https://votre-app.vercel.app/api/trends \
  -H "Content-Type: application/json" \
  -d '{"topic": "ai tools", "country": "US"}'
```

## 📁 Structure du Projet

```
Drop Eazy SaaS/
├── app/api/                    # Routes API Next.js
│   ├── trends/route.ts         # Pipeline de tendances complet
│   ├── products/route.ts       # Recherche de produits
│   ├── offers/route.ts         # Génération d'offres
│   ├── ads/route.ts           # Création de publicités
│   └── launch/route.ts        # Plans de lancement
├── lib/trends/                 # Modules de collecte de données
│   ├── fetchGoogleTrends.ts   # Google Trends API
│   ├── fetchReddit.ts         # Reddit API
│   ├── fetchProductHunt.ts    # ProductHunt GraphQL
│   ├── mergeAndRankTrends.ts  # Fusion et scoring
│   └── normalizeKeyword.ts    # Correction IA des mots-clés
├── components/                 # Composants React
├── app/                       # Pages Next.js
└── docs/                      # Documentation
```

## 🔄 Processus de Déploiement

1. **Développement Local** : `npm run dev`
2. **Commit & Push** : `git add . && git commit -m "..." && git push`
3. **Déploiement Automatique** : Vercel détecte les changements
4. **Build & Deploy** : Vercel construit et déploie automatiquement
5. **Variables d'Env** : Configurées dans le dashboard Vercel

## 🚨 Dépannage

### Erreur de Build
- Vérifiez que toutes les dépendances sont dans `package.json`
- Assurez-vous que les variables d'environnement sont configurées

### Erreur API
- Vérifiez les clés API dans Vercel
- Consultez les logs Vercel pour plus de détails

### Performance
- Le pipeline de tendances peut prendre 10-30 secondes
- Les requêtes sont mises en cache automatiquement

## 📞 Support

- **Documentation API** : `API_DOCUMENTATION.md`
- **Pipeline de Tendances** : `TRENDS_PIPELINE_DOCUMENTATION.md`
- **Tests** : `test-trends-pipeline.js`

---

🎉 **Votre SaaS Drop Eazy est maintenant déployé avec un pipeline de tendances professionnel !**
