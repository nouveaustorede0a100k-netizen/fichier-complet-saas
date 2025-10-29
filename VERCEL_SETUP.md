# 🔧 Configuration Manuelle Vercel - Actions Requises

## ⚠️ OBLIGATOIRE : Configurer les Variables d'Environnement

Après le déploiement sur Vercel, vous DEVEZ configurer manuellement les variables d'environnement dans le dashboard Vercel.

### 📍 Où aller :
1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **Front - Drop Eazy saas**
3. Allez dans **Settings** → **Environment Variables**

### 🔑 Variables à ajouter :

#### 🗄️ SUPABASE (OBLIGATOIRE)
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Où les trouver :**
- https://supabase.com/dashboard/project/[PROJECT_ID]/settings/api
- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé publique (anon key)
- `SUPABASE_SERVICE_ROLE_KEY` : Clé privée (service_role key) ⚠️ SECRETE

#### 🤖 OPENAI (OBLIGATOIRE)
```
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
```

**Où les trouver :**
- https://platform.openai.com/api-keys
- Créez une nouvelle clé API et copiez-la

#### 💳 STRIPE (OBLIGATOIRE pour les paiements)
```
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_... en production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (ou pk_live_... en production)
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_BUSINESS=price_...
```

**Où les trouver :**
- https://dashboard.stripe.com/apikeys
- **Keys** : Récupérez Secret Key et Publishable Key
- **Products** : Créez vos produits et récupérez les Price IDs
- **Webhooks** : Configurez un webhook endpoint `/api/stripe/webhook` et récupérez le secret

#### 🎥 YOUTUBE (OPTIONNEL - pour les tendances vidéo)
```
YOUTUBE_API_KEY=AIza...
```

#### 🚀 PRODUCT HUNT (OPTIONNEL - pour les tendances produits)
```
PRODUCTHUNT_TOKEN=phc_...
```

#### 🌐 CONFIGURATION APP
```
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
NODE_ENV=production
```

---

## ⚙️ Configuration du Webhook Stripe (OBLIGATOIRE pour les paiements)

### 1. Dans Stripe Dashboard
1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur **Add endpoint**
3. **Endpoint URL** : `https://votre-domaine.vercel.app/api/stripe/webhook`
4. **Events to send** : Sélectionnez :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copiez le **Signing secret** (commence par `whsec_`)
6. Ajoutez-le dans Vercel comme `STRIPE_WEBHOOK_SECRET`

---

## 📝 Instructions Détaillées

### 1. Configurer les Variables d'Environnement
1. Connectez-vous à [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** (⚙️) → **Environment Variables**
4. Cliquez sur **Add New**
5. Pour chaque variable :
   - Entrez le **Name** (ex: `OPENAI_API_KEY`)
   - Entrez la **Value** (votre clé)
   - Sélectionnez **Environment(s)** :
     - ✅ Production
     - ✅ Preview (optionnel)
     - ✅ Development (optionnel)
   - Cliquez sur **Save**
6. **IMPORTANT** : Après avoir ajouté toutes les variables, allez dans **Deployments** et redéployez la dernière version (ou poussez un nouveau commit)

### 2. Vérifier le Build
Après avoir configuré les variables d'environnement :
1. Allez dans **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Vérifiez que le build réussit ✅

### 3. Tester les Fonctionnalités
Une fois le déploiement réussi, testez :
- ✅ Page d'accueil se charge
- ✅ Authentification fonctionne (Supabase)
- ✅ Tendances s'affichent (OpenAI)
- ✅ Paiements fonctionnent (Stripe)

---

## 🚨 Erreurs Communes

### "supabaseKey is required"
➡️ Ajoutez `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans Vercel

### "OPENAI_API_KEY environment variable is required"
➡️ Ajoutez `OPENAI_API_KEY` dans Vercel

### "STRIPE_SECRET_KEY is required"
➡️ Ajoutez `STRIPE_SECRET_KEY` dans Vercel

### "Module not found"
➡️ Vérifiez que le build passe localement (`npm run build`)
➡️ Vérifiez que tous les fichiers existent dans `/lib`

---

## ✅ Checklist de Déploiement

Avant de considérer le déploiement comme terminé :

- [ ] Variables d'environnement Supabase configurées
- [ ] Variables d'environnement OpenAI configurées
- [ ] Variables d'environnement Stripe configurées (si paiements activés)
- [ ] Webhook Stripe configuré (si paiements activés)
- [ ] Build Vercel réussit sans erreur
- [ ] Application accessible sur l'URL Vercel
- [ ] Authentification fonctionne
- [ ] Fonctionnalités principales testées

---

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les **logs** dans Vercel (Deployments → cliquer sur un déploiement)
2. Vérifiez que toutes les variables d'environnement sont bien définies
3. Testez localement avec `npm run build` pour identifier les erreurs

---

**Note importante** : Les variables d'environnement doivent être configurées pour chaque environnement (Production, Preview, Development) séparément si vous voulez qu'elles soient disponibles partout.

