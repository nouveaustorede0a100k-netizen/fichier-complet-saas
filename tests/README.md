# 🧪 Tests Drop Eazy - Guide Complet

Ce dossier contient tous les scripts de test pour vérifier le bon fonctionnement de votre SaaS Drop Eazy.

## 📋 Scripts Disponibles

### 1. Tests de Base (Sans serveur)
```bash
npm run test:basic
```
**Teste :**
- ✅ Variables d'environnement
- ✅ Format des clés API (OpenAI, Supabase, Stripe)
- ✅ Connexion au serveur local (si démarré)

### 2. Tests des APIs (Serveur requis)
```bash
npm run test:apis
```
**Teste :**
- ✅ Connexion au serveur local
- ✅ Route `/api/trends` - Trend Finder
- ✅ Route `/api/products` - Product Finder  
- ✅ Route `/api/offers` - Offer Builder
- ✅ Route `/api/ads` - Ad Generator
- ✅ Route `/api/launch` - Launch Assistant

### 3. Tests Complets (Recommandé)
```bash
npm run test:complete
# ou simplement
npm run test
```
**Teste :**
- ✅ Tous les tests de base
- ✅ Démarre automatiquement le serveur de développement
- ✅ Teste toutes les APIs
- ✅ Arrête proprement le serveur

### 4. Tests Rapides
```bash
npm run test:all
```
**Exécute :**
- Tests de base + Tests APIs (serveur doit être démarré manuellement)

## 🚀 Utilisation Recommandée

### 1. Vérification Initiale
```bash
# 1. Vérifier la configuration de base
npm run test:basic

# 2. Si OK, lancer les tests complets
npm run test:complete
```

### 2. Tests Rapides (Serveur déjà démarré)
```bash
# Dans un terminal : npm run dev
# Dans un autre terminal :
npm run test:apis
```

### 3. Avant Déploiement
```bash
# Tests complets avant mise en production
npm run test
```

## 🔧 Configuration Requise

### Variables d'Environnement
Créez un fichier `.env` à la racine avec :
```env
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Optionnel
STRIPE_WEBHOOK_SECRET=whsec_...
PRODUCTHUNT_TOKEN=...
```

### Base de Données
Exécutez le script SQL dans `supabase/schema.sql` pour créer les tables.

## 📊 Interprétation des Résultats

### ✅ Succès
- Tous les tests passent
- Votre SaaS est prêt pour la production

### ❌ Échecs
- Vérifiez les erreurs affichées
- Consultez les conseils dans les logs
- Corrigez les problèmes avant de continuer

### ⚠️ Avertissements
- Certains tests peuvent échouer temporairement
- Vérifiez la connectivité réseau
- Assurez-vous que les services externes sont accessibles

## 🐛 Dépannage

### Erreur "Environment variables missing"
```bash
# Vérifiez votre fichier .env
cat .env

# Redémarrez votre terminal
source ~/.bashrc  # ou ~/.zshrc
```

### Erreur "Server connection failed"
```bash
# Démarrez le serveur dans un terminal
npm run dev

# Dans un autre terminal, lancez les tests
npm run test:apis
```

### Erreur "API failed: Status 401"
- Vérifiez que vos clés API sont valides
- Vérifiez que Supabase est configuré
- Vérifiez que les tables sont créées

### Erreur "API failed: Status 500"
- Consultez les logs du serveur (`npm run dev`)
- Vérifiez que OpenAI est accessible
- Vérifiez que Stripe est configuré

## 🎯 Exemples de Sortie

### Test Réussi
```
🔧 TESTS DROP EAZY – Vérification de base

🔍 Testing environment variables...
✅ Environment variables OK (4 variables found)
🔍 Testing Supabase URL...
✅ Supabase URL format OK (https://abc123.supabase.co)
🔍 Testing Supabase anon key...
✅ Supabase anon key format OK (eyJhbGciOiJIUzI1NiIs...)
🔍 Testing OpenAI API key...
✅ OpenAI API key format OK (sk-abc123...)
🔍 Testing Stripe secret key...
✅ Stripe secret key format OK (sk_test_abc123...)

📊 RÉSUMÉ DES TESTS:

✅ environment
✅ supabaseUrl
✅ supabaseKey
✅ openaiKey
✅ stripeKey

🎯 Total: 5 succès ✅  |  0 échecs ❌

🎉 Tous les tests de base sont passés !
💡 Votre configuration est prête pour le développement
```

### Test Échoué
```
🔧 TESTS DROP EAZY – Vérification de base

🔍 Testing environment variables...
❌ Missing environment variables: OPENAI_API_KEY, STRIPE_SECRET_KEY

📊 RÉSUMÉ DES TESTS:

❌ environment
❌ supabaseUrl
❌ supabaseKey
❌ openaiKey
❌ stripeKey

🎯 Total: 0 succès ✅  |  5 échecs ❌

⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.

💡 Conseils pour corriger les erreurs :
   • Vérifiez votre fichier .env
   • Assurez-vous que toutes les clés API sont valides
   • Pour tester le serveur, lancez 'npm run dev'
```

## 🔄 Intégration CI/CD

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:basic
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
```

### Vercel
Les tests peuvent être exécutés dans Vercel en ajoutant un script de build :
```json
{
  "scripts": {
    "build": "npm run test:basic && next build"
  }
}
```

## 📝 Logs Détaillés

Les tests affichent des logs colorés :
- 🟢 **Vert** : Succès
- 🔴 **Rouge** : Erreur
- 🟡 **Jaune** : Avertissement
- 🔵 **Bleu** : Information
- 🔵 **Cyan** : Titre/Section

## 🎯 Objectif

Ces tests vous permettent de :
1. **Vérifier** que tout fonctionne avant le déploiement
2. **Détecter** les problèmes rapidement
3. **Valider** les intégrations externes
4. **Assurer** la qualité de votre SaaS
5. **Automatiser** la vérification dans CI/CD

---

**💡 Conseil :** Exécutez `npm run test` avant chaque déploiement pour vous assurer que tout fonctionne parfaitement !

**🚀 Votre SaaS Drop Eazy est maintenant équipé d'un système de tests robuste et professionnel !**