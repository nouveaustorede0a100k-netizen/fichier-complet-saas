#!/bin/bash

# Script de déploiement Drop Eazy sur Vercel
echo "🚀 Déploiement de Drop Eazy sur Vercel..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet."
    exit 1
fi

# Vérifier que Git est configuré
if ! git remote -v | grep -q "origin"; then
    echo "❌ Erreur: Aucun remote 'origin' trouvé. Configurez Git d'abord."
    exit 1
fi

echo "✅ Configuration Git détectée"

# Pousser les changements vers GitHub
echo "📤 Poussage des changements vers GitHub..."
git add .
git commit -m "🚀 Deploy: Pipeline de tendances complet" || echo "Aucun changement à commiter"
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Changements poussés vers GitHub avec succès"
    echo ""
    echo "🎯 Vercel devrait maintenant déployer automatiquement votre application"
    echo "📊 Nouvelles fonctionnalités déployées:"
    echo "   - Pipeline de tendances multi-sources (Google Trends, Reddit, ProductHunt)"
    echo "   - Correction intelligente des mots-clés"
    echo "   - Analyse IA des tendances avec GPT-4o-mini"
    echo "   - 5 routes API améliorées avec gestion d'erreurs robuste"
    echo ""
    echo "🔧 N'oubliez pas de configurer les variables d'environnement sur Vercel:"
    echo "   - OPENAI_API_KEY (obligatoire)"
    echo "   - NEXT_PUBLIC_SUPABASE_URL (obligatoire)"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY (obligatoire)"
    echo "   - PRODUCTHUNT_TOKEN (optionnel)"
    echo ""
    echo "📖 Consultez env.example.txt pour la liste complète des variables"
else
    echo "❌ Erreur lors du push vers GitHub"
    exit 1
fi
