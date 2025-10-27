# 🚀 Drop Eazy - SaaS de Découverte de Tendances

> **Plateforme tout-en-un pour découvrir les tendances émergentes, analyser les produits digitaux gagnants, et générer des stratégies marketing complètes.**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.76.1-green)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-purple)](https://openai.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)

## ✨ Fonctionnalités

### 🔍 **Trend Finder Pro**
- Analyse multi-sources (Google Trends, Reddit, Product Hunt, YouTube)
- Normalisation intelligente des mots-clés
- Scoring et classement automatique des tendances
- Analyse IA des opportunités business

### 📦 **Product Finder**
- Découverte de produits digitaux performants
- Analyse des niches rentables
- Recommandations basées sur l'IA

### 🎯 **Offer Builder**
- Génération d'offres complètes
- Pages de vente optimisées
- Séquences d'emails marketing

### 📢 **Ad Generator**
- Création de publicités multi-plateformes
- Optimisation des angles marketing
- Suggestions de budget

### 🚀 **Launch Assistant**
- Plans de lancement détaillés
- Timeline et budgets
- Métriques de suivi

## 🛠️ Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Paiements**: Stripe
- **IA**: OpenAI GPT-4o-mini
- **Déploiement**: Vercel

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase
- Clé API OpenAI
- Compte Stripe (optionnel)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/drop-eazy.git
cd drop-eazy
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
```bash
cp .env.example .env.local
```

Remplir le fichier `.env.local` avec vos clés :

```env
# Supabase (OBLIGATOIRE)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# OpenAI (OBLIGATOIRE)
OPENAI_API_KEY=sk-...

# Stripe (OBLIGATOIRE pour les paiements)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# APIs optionnelles
YOUTUBE_API_KEY=AIza...
PRODUCTHUNT_TOKEN=phc_...

# Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configuration de la base de données
Exécuter le script SQL dans Supabase :
```sql
-- Voir le fichier supabase/schema.sql
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📊 Structure du projet

```
drop-eazy/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # Routes API
│   ├── dashboard/         # Dashboard utilisateur
│   ├── trends/           # Module tendances
│   ├── products/         # Module produits
│   ├── offer/            # Module offres
│   ├── ads/              # Module publicités
│   ├── launch/           # Module lancement
│   └── auth/             # Authentification
├── components/            # Composants React
│   ├── ui/               # Composants UI (shadcn/ui)
│   └── auth/             # Composants d'authentification
├── lib/                   # Services et utilitaires
│   ├── supabase.ts       # Client Supabase
│   ├── openai.ts         # Service OpenAI
│   ├── stripe.ts         # Configuration Stripe
│   └── trends/           # Modules de tendances
├── hooks/                 # Hooks React personnalisés
├── types/                 # Types TypeScript
├── contexts/              # Contextes React
└── middleware.ts          # Middleware d'authentification
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run start            # Serveur de production
npm run lint             # Linter ESLint

# Tests
npm run test:basic       # Tests de base
npm run test:apis        # Tests des APIs
npm run test:complete    # Tests complets
npm run test:e2e         # Tests end-to-end

# Déploiement
npm run deploy:vercel    # Déploiement sur Vercel
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Connecter le repository**
```bash
   vercel --prod
   ```

2. **Configurer les variables d'environnement** dans le dashboard Vercel

3. **Déployer**
   ```bash
   git push origin main
   ```

### Variables d'environnement Vercel

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service Supabase | ✅ |
| `OPENAI_API_KEY` | Clé API OpenAI | ✅ |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | ✅ |
| `YOUTUBE_API_KEY` | Clé API YouTube | ❌ |
| `PRODUCTHUNT_TOKEN` | Token Product Hunt | ❌ |

## 🔐 Sécurité

- ✅ Authentification Supabase
- ✅ Middleware de protection des routes
- ✅ Validation des clés API côté serveur
- ✅ Gestion des erreurs centralisée
- ✅ Rate limiting par utilisateur
- ✅ Types TypeScript stricts

## 📈 Monitoring

- **Logs**: Console + Vercel Analytics
- **Erreurs**: Gestionnaire d'erreurs global
- **Performance**: Next.js Analytics
- **Quotas**: Système de quotas intégré

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation**: [Wiki du projet](https://github.com/votre-username/drop-eazy/wiki)
- **Issues**: [GitHub Issues](https://github.com/votre-username/drop-eazy/issues)
- **Email**: support@dropeazy.com

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [OpenAI](https://openai.com/) - Intelligence Artificielle
- [Stripe](https://stripe.com/) - Paiements
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI

---

**Fait avec ❤️ par l'équipe Drop Eazy**