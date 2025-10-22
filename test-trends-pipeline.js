// Test du nouveau pipeline de tendances
// Usage: node test-trends-pipeline.js

const testTrendsPipeline = async () => {
  const baseUrl = 'http://localhost:3000';
  
  const testCases = [
    {
      name: "Test mot-clé simple",
      data: { topic: "ai tools", country: "US" }
    },
    {
      name: "Test avec fautes d'orthographe",
      data: { topic: "ai tols", country: "US" }
    },
    {
      name: "Test mot-clé français",
      data: { topic: "outils ia", country: "FR" }
    },
    {
      name: "Test niche spécifique",
      data: { topic: "fitness apps", country: "US" }
    }
  ];

  console.log('🚀 Test du Pipeline de Tendances Drop Eazy\n');

  for (const testCase of testCases) {
    console.log(`\n📊 ${testCase.name}`);
    console.log(`Mot-clé: "${testCase.data.topic}"`);
    console.log(`Pays: ${testCase.data.country}`);
    console.log('─'.repeat(50));

    try {
      const response = await fetch(`${baseUrl}/api/trends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ Succès!`);
        console.log(`Mot-clé corrigé: "${result.topic}"`);
        console.log(`Total analysé: ${result.totalAnalyzed} tendances`);
        console.log(`Sources: Google(${result.rawSources.googleCount}) Reddit(${result.rawSources.redditCount}) PH(${result.rawSources.phCount})`);
        
        if (result.rankedTrends && result.rankedTrends.length > 0) {
          console.log(`\n🏆 Top 3 tendances:`);
          result.rankedTrends.slice(0, 3).forEach((trend, index) => {
            console.log(`${index + 1}. ${trend.name}`);
            console.log(`   Croissance: ${trend.scoreGrowth}/100 | Potentiel: ${trend.scorePotential}/100`);
            console.log(`   Résumé: ${trend.summary}`);
            console.log(`   Catégorie: ${trend.category}`);
          });
        }

        if (result.meta.variants_searched && result.meta.variants_searched.length > 1) {
          console.log(`\n🔍 Variantes recherchées: ${result.meta.variants_searched.join(', ')}`);
        }
      } else {
        console.log(`❌ Erreur: ${result.error}`);
        if (result.details) {
          console.log(`Détails: ${result.details}`);
        }
      }
    } catch (error) {
      console.log(`❌ Erreur réseau: ${error.message}`);
    }

    console.log('\n' + '='.repeat(60));
  }

  console.log('\n🎯 Test terminé!');
};

// Exécuter les tests
testTrendsPipeline().catch(console.error);
