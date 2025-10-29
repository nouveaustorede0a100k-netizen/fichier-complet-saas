# 🚀 Guide de Déploiement Vercel

## Option 1 : Déploiement via Vercel CLI (Recommandé)

### Étape 1 : Installer et se connecter à Vercel CLI

```bash
# Installer Vercel CLI globalement (optionnel)
npm install -g vercel

# OU utiliser npx (sans installation)
# Se connecter à Vercel
npx vercel login
```

### Étape 2 : Déployer le projet

```bash
# Depuis la racine du projet
cd "/Users/free/Downloads/Front - Drop Eazy saas"

# Premier déploiement (prévisualisation)
npx vercel

# OU déploiement en production directement
npx vercel --prod
```

**Pendant le déploiement, vous devrez répondre à quelques questions :**
- ✅ **Set up and deploy?** → `Y`
- ✅ **Which scope?** → Sélectionnez votre compte
- ✅ **Link to existing project?** → `N` (pour la première fois)
- ✅ **Project name?** → `Front - Drop Eazy saas` (ou appuyez sur Entrée pour le nom par défaut)
- ✅ **Directory?** → `.` (racine du projet)
- ✅ **Override settings?** → `N`

---

## Option 2 : Déploiement via Vercel Dashboard (Plus simple)

### Étape 1 : Connecter le repository GitHub

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur **"Add New..."** → **"Project"**
4. **Import Git Repository** : Sélectionnez `nouveaustorede0a100k-netizen/fichier-complet-saas`
5. Cliquez sur **"Import"**

### Étape 2 : Configurer le projet

Dans les paramètres de configuration :
- **Framework Preset** : Next.js (détecté automatiquement)
- **Root Directory** : `.` (racine)
- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Install Command** : `npm install --legacy-peer-deps`

### Étape 3 : Ajouter les variables d'environnement

⚠️ **IMPORTANT** : Avant de déployer, ajoutez toutes les variables d'environnement !

Dans **Settings** → **Environment Variables**, ajoutez :

**Supabase :**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**OpenAI :**
- `OPENAI_API_KEY`
- `OPENAI_MODEL=gpt-4o-mini`

**Stripe :**
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRICE_PRO`
- `NEXT_PUBLIC_STRIPE_PRICE_BUSINESS`

**App :**
- `NEXT_PUBLIC_APP_URL=https://votre-projet.vercel.app`
- `NODE_ENV=production`

### Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine (2-5 minutes)
3. Votre application sera disponible sur `https://votre-projet.vercel.app`

---

## ✅ Après le déploiement

### 1. Vérifier le build
- Consultez les logs dans Vercel Dashboard → Deployments
- Vérifiez qu'il n'y a pas d'erreurs de build

### 2. Tester l'application
- Visitez l'URL de production
- Testez les fonctionnalités principales

### 3. Configurer le Webhook Stripe (si paiements activés)
1. Dans Stripe Dashboard → Webhooks
2. Créer un endpoint : `https://votre-projet.vercel.app/api/stripe/webhook`
3. Sélectionner les événements nécessaires
4. Copier le secret et l'ajouter dans Vercel comme `STRIPE_WEBHOOK_SECRET`
5. Redéployer si nécessaire

### 4. Configurer un domaine personnalisé (optionnel)
- Dans Vercel Dashboard → Settings → Domains
- Ajoutez votre domaine personnalisé

---

## 🔧 Commande rapide (si déjà connecté)

Si vous êtes déjà connecté à Vercel CLI :

```bash
cd "/Users/free/Downloads/Front - Drop Eazy saas"
npx vercel --prod
```

---

## 🆘 Dépannage

### Erreur : "The specified token is not valid"
➡️ Exécutez `npx vercel login` pour vous reconnecter

### Erreur de build sur Vercel
➡️ Vérifiez que toutes les variables d'environnement sont configurées
➡️ Consultez les logs de build dans Vercel Dashboard

### Erreur : "Module not found"
➡️ Vérifiez que le build passe localement : `npm run build`
➡️ Vérifiez que tous les fichiers dans `/lib` sont présents

---

## 📝 Note importante

Le projet est déjà configuré avec :
- ✅ `vercel.json` avec les bonnes commandes de build
- ✅ Tous les fichiers nécessaires dans `/lib`
- ✅ Configuration TypeScript correcte

Il ne reste plus qu'à :
1. Se connecter à Vercel (CLI ou Dashboard)
2. Configurer les variables d'environnement
3. Déployer !

