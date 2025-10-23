// Test des APIs Drop Eazy (serveur requis)
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

const endpoints = [
  { 
    name: "Trend Finder", 
    url: "http://localhost:3000/api/trends", 
    payload: { topic: "ai tools", country: "US" }
  },
  { 
    name: "Product Finder", 
    url: "http://localhost:3000/api/products", 
    payload: { niche: "marketing" }
  },
  { 
    name: "Offer Builder", 
    url: "http://localhost:3000/api/offers", 
    payload: { niche: "formation IA pour coachs" }
  },
  { 
    name: "Ad Generator", 
    url: "http://localhost:3000/api/ads", 
    payload: { 
      productName: "formation IA", 
      targetAudience: "coachs", 
      platform: "Facebook" 
    }
  },
  { 
    name: "Launch Assistant", 
    url: "http://localhost:3000/api/launch", 
    payload: { 
      productName: "formation IA",
      launchDate: "2024-03-01",
      budget: "€5000"
    }
  },
];

async function testAPI({ name, url, payload }) {
  console.log(colors.blue(`🧪 Testing ${name}...`));
  
  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url.replace('http://localhost:3000', ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 && response.success !== false) {
            console.log(colors.green(`✅ ${name} OK`), `(Status: ${res.statusCode})`);
            resolve(true);
          } else {
            console.error(colors.red(`❌ ${name} failed:`), `Status ${res.statusCode}`, response.error || 'Unknown error');
            resolve(false);
          }
        } catch (err) {
          console.error(colors.red(`❌ ${name} failed:`), 'Invalid JSON response', data.substring(0, 100));
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error(colors.red(`❌ ${name} failed:`), err.message);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      console.error(colors.red(`❌ ${name} failed:`), 'Request timeout');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
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
  console.log(colors.cyan(colors.bold("\n🚀 TESTS DROP EAZY – APIs End-to-End\n")));
  console.log(colors.gray("Testing all API endpoints (server required)...\n"));

  // Test de connexion au serveur d'abord
  const serverOk = await testServerConnection();
  
  if (!serverOk) {
    console.log(colors.red(colors.bold("\n❌ Serveur non accessible. Arrêt des tests.")));
    console.log(colors.yellow("💡 Lancez 'npm run dev' dans un autre terminal et réessayez."));
    process.exit(1);
  }

  console.log(colors.cyan("\n📡 Testing API Endpoints:\n"));

  const results = {};
  
  for (const ep of endpoints) {
    const ok = await testAPI(ep);
    results[ep.name] = ok;
  }

  const successCount = Object.values(results).filter(Boolean).length;
  const failCount = Object.values(results).filter((v) => !v).length;

  console.log(colors.cyan(colors.bold("\n📊 RÉSUMÉ DES TESTS:\n")));
  
  // Afficher les résultats détaillés
  Object.entries(results).forEach(([name, success]) => {
    const icon = success ? "✅" : "❌";
    const color = success ? colors.green : colors.red;
    console.log(color(`${icon} ${name}`));
  });

  console.log(colors.yellow(colors.bold(`\n🎯 Total: ${successCount} succès ✅  |  ${failCount} échecs ❌`)));
  
  if (failCount === 0) {
    console.log(colors.green(colors.bold("\n🎉 Toutes les APIs fonctionnent parfaitement !")));
    console.log(colors.cyan("💡 Votre SaaS Drop Eazy est prêt pour la production !"));
  } else {
    console.log(colors.red(colors.bold("\n⚠️  Certaines APIs ont échoué.")));
    console.log(colors.gray("\n💡 Conseils pour corriger les erreurs :"));
    console.log(colors.gray("   • Vérifiez que le serveur est bien démarré"));
    console.log(colors.gray("   • Vérifiez vos variables d'environnement"));
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
