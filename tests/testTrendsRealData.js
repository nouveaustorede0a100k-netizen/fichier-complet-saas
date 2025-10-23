// Test des nouvelles fonctionnalités de tendances avec données réelles
const https = require('https');
const http = require('http');

// Couleurs pour la console
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`
};

async function testTrendsAPI() {
  console.log(colors.blue("🧪 Testing Trends API with real data sources..."));
  
  const testCases = [
    { topic: "ai tools", country: "US" },
    { topic: "crypto", country: "US" },
    { topic: "fitness", country: "FR" }
  ];

  const results = [];

  for (const testCase of testCases) {
    console.log(colors.cyan(`\n🔍 Testing: "${testCase.topic}" (${testCase.country})`));
    
    try {
      const response = await fetch('http://localhost:3000/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(colors.red(`❌ API Error (${response.status}):`), errorData.error || 'Unknown error');
        results.push({ testCase, success: false, error: errorData.error });
        continue;
      }

      const data = await response.json();
      
      if (data.success && data.rankedTrends && data.rankedTrends.length > 0) {
        console.log(colors.green(`✅ Success!`));
        console.log(colors.gray(`   • Topic: ${data.topic}`));
        console.log(colors.gray(`   • Total analyzed: ${data.totalAnalyzed}`));
        console.log(colors.gray(`   • Ranked trends: ${data.rankedTrends.length}`));
        console.log(colors.gray(`   • Google sources: ${data.rawSources?.googleCount || 0}`));
        console.log(colors.gray(`   • Reddit sources: ${data.rawSources?.redditCount || 0}`));
        console.log(colors.gray(`   • ProductHunt sources: ${data.rawSources?.phCount || 0}`));
        
        // Afficher les 3 meilleures tendances
        console.log(colors.blue("   📈 Top trends:"));
        data.rankedTrends.slice(0, 3).forEach((trend, index) => {
          console.log(colors.gray(`      ${index + 1}. ${trend.name} (Growth: ${trend.scoreGrowth}%, Potential: ${trend.scorePotential}%)`));
        });
        
        results.push({ testCase, success: true, data });
      } else {
        console.error(colors.red(`❌ Invalid response structure`));
        results.push({ testCase, success: false, error: 'Invalid response structure' });
      }
    } catch (error) {
      console.error(colors.red(`❌ Network error:`), error.message);
      results.push({ testCase, success: false, error: error.message });
    }
  }

  return results;
}

async function testServerConnection() {
  console.log(colors.blue("🔍 Testing server connection..."));
  
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        console.log(colors.green("✅ Server connection OK"), `(Status: ${res.statusCode})`);
        resolve(true);
      } else {
        console.error(colors.red("❌ Server returned status"), res.statusCode);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.error(colors.red("❌ Server connection failed:"), err.message);
      console.log(colors.yellow("💡 Make sure to run 'npm run dev' in another terminal"));
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.error(colors.red("❌ Server connection timeout"));
      resolve(false);
    });
  });
}

async function main() {
  console.log(colors.cyan(colors.bold("\n🚀 TESTS DROP EAZY – Tendances avec Données Réelles\n")));
  console.log(colors.gray("Testing real data integration (Google Trends, Reddit, ProductHunt)...\n"));

  // Test de connexion au serveur d'abord
  const serverOk = await testServerConnection();
  
  if (!serverOk) {
    console.log(colors.red(colors.bold("\n❌ Serveur non accessible. Arrêt des tests.")));
    console.log(colors.yellow("💡 Lancez 'npm run dev' dans un autre terminal et réessayez."));
    process.exit(1);
  }

  console.log(colors.cyan("\n📡 Testing Real Data Sources:\n"));

  const results = await testTrendsAPI();

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log(colors.cyan(colors.bold("\n📊 RÉSUMÉ DES TESTS:\n")));
  
  // Afficher les résultats détaillés
  results.forEach((result, index) => {
    const { testCase, success } = result;
    const icon = success ? "✅" : "❌";
    const color = success ? colors.green : colors.red;
    console.log(color(`${icon} Test ${index + 1}: "${testCase.topic}" (${testCase.country})`));
    
    if (!success && result.error) {
      console.log(colors.gray(`   Error: ${result.error}`));
    }
  });

  console.log(colors.yellow(colors.bold(`\n🎯 Total: ${successCount} succès ✅  |  ${failCount} échecs ❌`)));
  
  if (failCount === 0) {
    console.log(colors.green(colors.bold("\n🎉 Toutes les sources de données fonctionnent parfaitement !")));
    console.log(colors.cyan("💡 Votre pipeline de tendances multi-sources est opérationnel !"));
  } else {
    console.log(colors.red(colors.bold("\n⚠️  Certains tests ont échoué.")));
    console.log(colors.gray("\n💡 Conseils pour corriger les erreurs :"));
    console.log(colors.gray("   • Vérifiez que le serveur est bien démarré"));
    console.log(colors.gray("   • Vérifiez vos variables d'environnement (.env.local)"));
    console.log(colors.gray("   • Vérifiez que vos clés API sont valides"));
    console.log(colors.gray("   • Consultez les logs du serveur pour plus de détails"));
  }

  console.log(colors.gray("\n👉 Pour plus de détails, consultez les logs ci-dessus.\n"));
  
  // Exit avec code d'erreur si des tests ont échoué
  process.exit(failCount > 0 ? 1 : 0);
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error(colors.red('❌ Unhandled Rejection at:'), promise, colors.red('reason:'), reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(colors.red('❌ Uncaught Exception:'), error);
  process.exit(1);
});

main().catch((error) => {
  console.error(colors.red('❌ Test suite failed:'), error);
  process.exit(1);
});
