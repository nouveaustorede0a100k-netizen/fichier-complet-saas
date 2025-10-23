// Test complet de Drop Eazy SaaS
const { spawn } = require('child_process');
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

let serverProcess = null;

function startServer() {
  console.log(colors.blue("🚀 Starting development server..."));
  
  return new Promise((resolve, reject) => {
    serverProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });

    let serverReady = false;
    let timeout = setTimeout(() => {
      if (!serverReady) {
        console.error(colors.red("❌ Server startup timeout"));
        reject(new Error('Server startup timeout'));
      }
    }, 30000); // 30 secondes timeout

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(colors.gray(output.trim()));
      
      if (output.includes('Ready') || output.includes('started server on')) {
        serverReady = true;
        clearTimeout(timeout);
        console.log(colors.green("✅ Server started successfully"));
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(colors.red(data.toString().trim()));
    });

    serverProcess.on('error', (err) => {
      console.error(colors.red("❌ Failed to start server:"), err.message);
      clearTimeout(timeout);
      reject(err);
    });

    serverProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(colors.red(`❌ Server exited with code ${code}`));
        clearTimeout(timeout);
        reject(new Error(`Server exited with code ${code}`));
      }
    });
  });
}

function stopServer() {
  if (serverProcess) {
    console.log(colors.blue("🛑 Stopping development server..."));
    serverProcess.kill('SIGTERM');
    serverProcess = null;
  }
}

async function testEnvironmentVariables() {
  console.log(colors.blue("🔍 Testing environment variables..."));
  
  const requiredVars = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'STRIPE_SECRET_KEY'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length === 0) {
    console.log(colors.green("✅ Environment variables OK"), `(${requiredVars.length} variables found)`);
    return true;
  } else {
    console.error(colors.red("❌ Missing environment variables:"), missing.join(", "));
    return false;
  }
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
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.error(colors.red("❌ Server connection timeout"));
      resolve(false);
    });
  });
}

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

async function main() {
  console.log(colors.cyan(colors.bold("\n🚀 TESTS DROP EAZY – Vérification complète\n")));
  console.log(colors.gray("Testing all features and integrations...\n"));

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

  const results = {
    environment: await testEnvironmentVariables(),
  };

  if (!results.environment) {
    console.log(colors.red(colors.bold("\n❌ Variables d'environnement manquantes. Arrêt des tests.")));
    console.log(colors.yellow("💡 Configurez votre fichier .env et réessayez."));
    process.exit(1);
  }

  try {
    // Démarrer le serveur
    await startServer();
    
    // Attendre que le serveur soit prêt
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Tester la connexion
    results.server = await testServerConnection();
    
    if (!results.server) {
      console.log(colors.red(colors.bold("\n❌ Serveur non accessible. Arrêt des tests.")));
      return;
    }

    console.log(colors.cyan("\n📡 Testing API Endpoints:\n"));

    // Tester toutes les APIs
    for (const ep of endpoints) {
      const ok = await testAPI(ep);
      results[ep.name] = ok;
    }

  } catch (error) {
    console.error(colors.red("❌ Error during testing:"), error.message);
  } finally {
    // Arrêter le serveur
    stopServer();
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
    console.log(colors.green(colors.bold("\n🎉 Tous les tests sont passés ! Votre SaaS est prêt pour la production !")));
  } else {
    console.log(colors.red(colors.bold("\n⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.")));
    console.log(colors.gray("\n💡 Conseils pour corriger les erreurs :"));
    console.log(colors.gray("   • Vérifiez vos variables d'environnement"));
    console.log(colors.gray("   • Vérifiez que Supabase est configuré"));
    console.log(colors.gray("   • Vérifiez que vos clés API sont valides"));
  }

  console.log(colors.gray("\n👉 Pour plus de détails, consultez les logs ci-dessus.\n"));
  
  // Exit avec code d'erreur si des tests ont échoué
  process.exit(failCount > 0 ? 1 : 0);
}

// Gestion des erreurs et arrêt propre
process.on('SIGINT', () => {
  console.log(colors.yellow('\n🛑 Arrêt des tests...'));
  stopServer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(colors.yellow('\n🛑 Arrêt des tests...'));
  stopServer();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(colors.red('❌ Unhandled Rejection at:'), promise, colors.red('reason:'), reason);
  stopServer();
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(colors.red('❌ Uncaught Exception:'), error);
  stopServer();
  process.exit(1);
});

main().catch((error) => {
  console.error(colors.red('❌ Test suite failed:'), error);
  stopServer();
  process.exit(1);
});
