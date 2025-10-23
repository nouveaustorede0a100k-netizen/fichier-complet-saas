// Test simple des variables d'environnement et connexions de base
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

function testEnvironmentVariables() {
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

function testSupabaseURL() {
  console.log(colors.blue("🔍 Testing Supabase URL..."));
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    console.error(colors.red("❌ NEXT_PUBLIC_SUPABASE_URL not found"));
    return false;
  }

  if (url.startsWith('https://') && url.includes('.supabase.co')) {
    console.log(colors.green("✅ Supabase URL format OK"), `(${url})`);
    return true;
  } else {
    console.error(colors.red("❌ Invalid Supabase URL format"), `(${url})`);
    return false;
  }
}

function testOpenAIKey() {
  console.log(colors.blue("🔍 Testing OpenAI API key..."));
  
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error(colors.red("❌ OPENAI_API_KEY not found"));
    return false;
  }

  if (key.startsWith('sk-') && key.length > 20) {
    console.log(colors.green("✅ OpenAI API key format OK"), `(${key.substring(0, 10)}...)`);
    return true;
  } else {
    console.error(colors.red("❌ Invalid OpenAI API key format"), `(${key.substring(0, 10)}...)`);
    return false;
  }
}

function testStripeKey() {
  console.log(colors.blue("🔍 Testing Stripe secret key..."));
  
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error(colors.red("❌ STRIPE_SECRET_KEY not found"));
    return false;
  }

  if (key.startsWith('sk_') && key.length > 20) {
    console.log(colors.green("✅ Stripe secret key format OK"), `(${key.substring(0, 10)}...)`);
    return true;
  } else {
    console.error(colors.red("❌ Invalid Stripe secret key format"), `(${key.substring(0, 10)}...)`);
    return false;
  }
}

function testSupabaseKey() {
  console.log(colors.blue("🔍 Testing Supabase anon key..."));
  
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    console.error(colors.red("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not found"));
    return false;
  }

  if (key.startsWith('eyJ') && key.length > 100) {
    console.log(colors.green("✅ Supabase anon key format OK"), `(${key.substring(0, 20)}...)`);
    return true;
  } else {
    console.error(colors.red("❌ Invalid Supabase anon key format"), `(${key.substring(0, 20)}...)`);
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
  console.log(colors.cyan(colors.bold("\n🔧 TESTS DROP EAZY – Vérification de base\n")));
  console.log(colors.gray("Testing environment variables and basic connections...\n"));

  const results = {
    environment: testEnvironmentVariables(),
    supabaseUrl: testSupabaseURL(),
    supabaseKey: testSupabaseKey(),
    openaiKey: testOpenAIKey(),
    stripeKey: testStripeKey(),
    server: await testServerConnection(),
  };

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
    console.log(colors.green(colors.bold("\n🎉 Tous les tests de base sont passés !")));
    console.log(colors.cyan("💡 Votre configuration est prête pour le développement"));
  } else {
    console.log(colors.red(colors.bold("\n⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.")));
    console.log(colors.gray("\n💡 Conseils pour corriger les erreurs :"));
    console.log(colors.gray("   • Vérifiez votre fichier .env"));
    console.log(colors.gray("   • Assurez-vous que toutes les clés API sont valides"));
    console.log(colors.gray("   • Pour tester le serveur, lancez 'npm run dev'"));
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
