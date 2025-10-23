import chalk from "chalk";
import { openai } from "@/lib/openai";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-09-30.clover" });

const endpoints = [
  { 
    name: "Trend Finder", 
    url: "http://localhost:3000/api/trends", 
    payload: { topic: "ai tools", country: "US" },
    requiresAuth: true
  },
  { 
    name: "Product Finder", 
    url: "http://localhost:3000/api/products", 
    payload: { niche: "marketing" },
    requiresAuth: true
  },
  { 
    name: "Offer Builder", 
    url: "http://localhost:3000/api/offers", 
    payload: { niche: "formation IA pour coachs" },
    requiresAuth: true
  },
  { 
    name: "Ad Generator", 
    url: "http://localhost:3000/api/ads", 
    payload: { 
      productName: "formation IA", 
      targetAudience: "coachs", 
      platform: "Facebook" 
    },
    requiresAuth: true
  },
  { 
    name: "Launch Assistant", 
    url: "http://localhost:3000/api/launch", 
    payload: { 
      productName: "formation IA",
      launchDate: "2024-03-01",
      budget: "€5000"
    },
    requiresAuth: true
  },
];

// Mock token pour les tests (en production, il faudrait un vrai token)
const MOCK_AUTH_TOKEN = "mock-token-for-testing";

async function testAPI({ name, url, payload, requiresAuth }: any) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    
    if (requiresAuth) {
      headers["Authorization"] = `Bearer ${MOCK_AUTH_TOKEN}`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Status ${res.status}: ${errorData.error || res.statusText}`);
    }
    
    const data = await res.json();
    console.log(chalk.green(`✅ ${name} OK`), `→ ${Object.keys(data).join(", ")}`);
    return true;
  } catch (err: any) {
    console.error(chalk.red(`❌ ${name} failed:`), err.message);
    return false;
  }
}

async function testSupabase() {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) throw error;
    console.log(chalk.green("✅ Supabase connected"), `(${data?.length || 0} users found)`);
    return true;
  } catch (err: any) {
    console.error(chalk.red("❌ Supabase connection failed:"), err.message);
    return false;
  }
}

async function testOpenAI() {
  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Réponds par OK" }],
      max_tokens: 10
    });
    
    const response = chat.choices[0].message.content;
    if (response?.includes("OK")) {
      console.log(chalk.green("✅ OpenAI connected"), `(Response: ${response.trim()})`);
      return true;
    }
    throw new Error(`Unexpected response: ${response}`);
  } catch (err: any) {
    console.error(chalk.red("❌ OpenAI connection failed:"), err.message);
    return false;
  }
}

async function testStripe() {
  try {
    const products = await stripe.products.list({ limit: 1 });
    console.log(chalk.green("✅ Stripe connected"), `(${products.data.length} products found)`);
    return true;
  } catch (err: any) {
    console.error(chalk.red("❌ Stripe connection failed:"), err.message);
    return false;
  }
}

async function testEnvironmentVariables() {
  const requiredVars = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'STRIPE_SECRET_KEY'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length === 0) {
    console.log(chalk.green("✅ Environment variables OK"), `(${requiredVars.length} variables found)`);
    return true;
  } else {
    console.error(chalk.red("❌ Missing environment variables:"), missing.join(", "));
    return false;
  }
}

async function testDatabaseSchema() {
  try {
    // Test des tables principales
    const tables = ['users', 'results', 'trend_searches', 'product_analyses', 'offers', 'ad_campaigns', 'launches'];
    const results = [];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) throw error;
        results.push(table);
      } catch (err) {
        console.log(chalk.yellow(`⚠️  Table ${table} not accessible or doesn't exist`));
      }
    }
    
    if (results.length > 0) {
      console.log(chalk.green("✅ Database schema OK"), `(${results.length}/${tables.length} tables accessible)`);
      return true;
    } else {
      console.error(chalk.red("❌ No database tables accessible"));
      return false;
    }
  } catch (err: any) {
    console.error(chalk.red("❌ Database schema test failed:"), err.message);
    return false;
  }
}

async function testServerConnection() {
  try {
    const response = await fetch("http://localhost:3000", { 
      method: "GET",
      signal: AbortSignal.timeout(5000) // 5 secondes timeout
    });
    
    if (response.ok) {
      console.log(chalk.green("✅ Server connection OK"), `(Status: ${response.status})`);
      return true;
    } else {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (err: any) {
    console.error(chalk.red("❌ Server connection failed:"), err.message);
    console.log(chalk.yellow("💡 Make sure to run 'npm run dev' in another terminal"));
    return false;
  }
}

async function main() {
  console.log(chalk.cyan.bold("\n🚀 TESTS DROP EAZY – Vérification complète\n"));
  console.log(chalk.gray("Testing all features and integrations...\n"));

  const results: Record<string, boolean> = {
    environment: await testEnvironmentVariables(),
    server: await testServerConnection(),
    supabase: await testSupabase(),
    database: await testDatabaseSchema(),
    openai: await testOpenAI(),
    stripe: await testStripe(),
  };

  console.log(chalk.cyan("\n📡 Testing API Endpoints:\n"));

  for (const ep of endpoints) {
    const ok = await testAPI(ep);
    results[ep.name] = ok;
  }

  const successCount = Object.values(results).filter(Boolean).length;
  const failCount = Object.values(results).filter((v) => !v).length;

  console.log(chalk.cyan.bold("\n📊 RÉSUMÉ DES TESTS:\n"));
  
  // Afficher les résultats détaillés
  Object.entries(results).forEach(([name, success]) => {
    const icon = success ? "✅" : "❌";
    const color = success ? chalk.green : chalk.red;
    console.log(color(`${icon} ${name}`));
  });

  console.log(chalk.yellowBright(`\n🎯 Total: ${successCount} succès ✅  |  ${failCount} échecs ❌`));
  
  if (failCount === 0) {
    console.log(chalk.green.bold("\n🎉 Tous les tests sont passés ! Votre SaaS est prêt pour la production !"));
  } else {
    console.log(chalk.red.bold("\n⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus."));
    console.log(chalk.gray("\n💡 Conseils pour corriger les erreurs :"));
    console.log(chalk.gray("   • Vérifiez que le serveur est démarré : npm run dev"));
    console.log(chalk.gray("   • Vérifiez vos variables d'environnement dans .env"));
    console.log(chalk.gray("   • Vérifiez que Supabase est configuré et les tables créées"));
    console.log(chalk.gray("   • Vérifiez que vos clés API sont valides"));
  }

  console.log(chalk.gray("\n👉 Pour plus de détails, consultez les logs ci-dessus.\n"));
  
  // Exit avec code d'erreur si des tests ont échoué
  process.exit(failCount > 0 ? 1 : 0);
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ Uncaught Exception:'), error);
  process.exit(1);
});

main().catch((error) => {
  console.error(chalk.red('❌ Test suite failed:'), error);
  process.exit(1);
});
