# 🚀 Configuration Drop Eazy - Sources de Données Réelles

Ce guide vous explique comment configurer Drop Eazy pour utiliser des sources de données réelles (Google Trends, Reddit, Product Hunt).

## 📋 Prérequis

- Node.js 18+ installé
- Comptes API pour les services externes
- Fichier `.env.local` configuré

## 🔑 1. Obtenir les Clés API

### OpenAI (OBLIGATOIRE)
1. Allez sur [OpenAI Platform](https://platform.openai.com/)
2. Créez un compte ou connectez-vous
3. Allez dans "API Keys"
4. Créez une nouvelle clé API
5. Copiez la clé (format: `sk-...`)

### Supabase (OBLIGATOIRE)
1. Allez sur [Supabase](https://supabase.com/)
2. Créez un nouveau projet
3. Allez dans "Settings" > "API"
4. Copiez :
   - Project URL (format: `https://xxxxx.supabase.co`)
   - Anon public key (format: `eyJhbGciOi...`)

### Product Hunt (OBLIGATOIRE pour les tendances)
1. Allez sur [Product Hunt Developers](https://www.producthunt.com/developers)
2. Créez un compte développeur
3. Créez une nouvelle application
4. Copiez le token (format: `phc_...`)

### Stripe (OBLIGATOIRE pour les paiements)
1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com/)
2. Créez un compte ou connectez-vous
3. Allez dans "Developers" > "API Keys"
4. Copiez :
   - Secret key (format: `sk_test_...`)
   - Publishable key (format: `pk_test_...`)

## ⚙️ 2. Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# OpenAI (OBLIGATOIRE)
OPENAI_API_KEY=sk-... (votre clé OpenAI)

# Supabase (OBLIGATOIRE)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi... (votre clé Supabase)

# Product Hunt (OBLIGATOIRE pour les tendances)
PRODUCTHUNT_TOKEN=phc_... (votre token Product Hunt)

# Stripe (OBLIGATOIRE pour les paiements)
STRIPE_SECRET_KEY=sk_test_... (votre clé secrète Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (votre clé publique Stripe)

# Webhook Stripe (OBLIGATOIRE pour les paiements)
STRIPE_WEBHOOK_SECRET=whsec_... (votre secret webhook Stripe)
```

## 🗄️ 3. Configuration de la Base de Données

Exécutez le script SQL dans `supabase/schema.sql` pour créer les tables nécessaires :

1. Allez sur votre projet Supabase
2. Allez dans "SQL Editor"
3. Copiez le contenu de `supabase/schema.sql`
4. Exécutez le script

## 🧪 4. Tests de Configuration

### Test de Base (Sans serveur)
```bash
npm run test:basic
```
Vérifie que toutes les variables d'environnement sont correctement configurées.

### Test des Tendances (Serveur requis)
```bash
# Terminal 1 : Démarrer le serveur
npm run dev

# Terminal 2 : Tester les tendances
npm run test:trends
```
Teste l'intégration avec Google Trends, Reddit et Product Hunt.

### Test Complet
```bash
npm run test:complete
```
Lance tous les tests automatiquement.

## 🚀 5. Démarrage de l'Application

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# L'application sera accessible sur http://localhost:3000
```

## 📊 6. Fonctionnalités Disponibles

### Trend Finder Pro
- **Google Trends** : Sujets de recherche populaires
- **Reddit** : Posts les plus votés du mois
- **Product Hunt** : Produits les plus récents et populaires
- **IA OpenAI** : Analyse et classement des tendances

### Pipeline de Données
1. **Normalisation** : Correction des mots-clés avec IA
2. **Collecte** : Récupération multi-sources en parallèle
3. **Fusion** : Déduplication et scoring des tendances
4. **Analyse** : Enrichissement avec insights business
5. **Stockage** : Sauvegarde dans Supabase

## 🔧 7. Dépannage

### Erreur "Environment variables missing"
- Vérifiez que le fichier `.env.local` existe
- Vérifiez que toutes les variables sont définies
- Redémarrez le serveur de développement

### Erreur "Google Trends fetch error"
- Vérifiez votre connexion internet
- L'API Google Trends peut être temporairement indisponible

### Erreur "Reddit fetch error"
- Reddit peut limiter les requêtes
- Vérifiez votre connexion internet

### Erreur "ProductHunt fetch error"
- Vérifiez que votre token Product Hunt est valide
- Vérifiez que votre application est approuvée

### Erreur "OpenAI connection failed"
- Vérifiez que votre clé API OpenAI est valide
- Vérifiez que vous avez des crédits disponibles

## 📈 8. Optimisation des Performances

### Cache des Tendances
Les tendances sont automatiquement mises en cache pour éviter les requêtes répétées.

### Rate Limiting
- Google Trends : Pas de limite officielle
- Reddit : Limite de 60 requêtes/minute
- Product Hunt : Limite selon votre plan
- OpenAI : Limite selon votre plan

### Quotas Utilisateurs
- Plan Gratuit : 3 recherches de tendances/jour
- Plan Pro : Illimité
- Plan Premium : Illimité + fonctionnalités avancées

## 🚀 9. Déploiement

### Vercel (Recommandé)
1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement dans Vercel
3. Déployez automatiquement

### Variables d'Environnement Vercel
Ajoutez toutes les variables de votre `.env.local` dans les paramètres Vercel.

## 📞 10. Support

Si vous rencontrez des problèmes :
1. Consultez les logs du serveur (`npm run dev`)
2. Vérifiez les tests (`npm run test:basic`)
3. Consultez la documentation des APIs externes
4. Vérifiez que vos clés API sont valides

---

**🎉 Félicitations ! Votre Drop Eazy est maintenant connecté à des sources de données réelles !**
