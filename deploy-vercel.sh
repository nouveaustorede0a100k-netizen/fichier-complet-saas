#!/bin/bash

# 🚀 Script de déploiement Vercel
# Usage: ./deploy-vercel.sh [--prod]

set -e

echo "🚀 Déploiement sur Vercel..."
echo ""

# Vérifier si on est connecté à Vercel
if ! npx vercel whoami &>/dev/null; then
    echo "⚠️  Vous n'êtes pas connecté à Vercel."
    echo "📝 Connexion à Vercel..."
    npx vercel login
fi

# Vérifier le build local avant de déployer
echo "🔨 Vérification du build local..."
npm run build

echo ""
echo "✅ Build local réussi !"
echo ""

# Déployer
if [ "$1" == "--prod" ]; then
    echo "🌐 Déploiement en PRODUCTION..."
    npx vercel --prod
else
    echo "🧪 Déploiement en PREVIEW..."
    npx vercel
fi

echo ""
echo "✅ Déploiement terminé !"
echo "📋 N'oubliez pas de configurer les variables d'environnement dans Vercel Dashboard"
echo "📖 Consultez VERCEL_SETUP.md pour les détails"
