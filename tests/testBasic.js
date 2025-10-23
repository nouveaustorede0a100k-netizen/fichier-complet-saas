const { openai } = require("../lib/openai");
const { supabase } = require("../lib/supabase");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-09-30.clover" });

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

async function testEnvironmentVariables() {
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

async function testSupabase() {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) throw error;
    console.log(colors.green("✅ Supabase connected"), `(${data?.length || 0} users found)`);
    return true;
  } catch (err) {
    console.error(colors.red("❌ Supabase connection failed:"), err.message);
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
      console.log(colors.green("✅ OpenAI connected"), `(Response: ${response.trim()})`);
      return true;
    }
    throw new Error(`Unexpected response: ${response}`);
  } catch (err) {
    console.error(colors.red("❌ OpenAI connection failed:"), err.message);
    return false;
  }
}

async function testStripe() {
  try {
    const products = await stripe.products.list({ limit: 1 });
    console.log(colors.green("✅ Stripe connected"), `(${products.data.length} products found)`);
    return true;
  } catch (err) {
    console.error(colors.red("❌ Stripe connection failed:"), err.message);
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
        console.log(colors.yellow(`⚠️  Table ${table} not accessible or doesn't exist`));
      }
    }
    
    if (results.length > 0) {
      console.log(colors.green("✅ Database schema OK"), `(${results.length}/${tables.length} tables accessible)`);
      return true;
    } else {
      console.error(colors.red("❌ No database tables accessible"));
      return false;
    }
  } catch (err) {
    console.error(colors.red("❌ Database schema test failed:"), err.message);
    return false;
  }
}

async function main() {
  console.log(colors.cyan(colors.bold("\n🔧 TESTS DROP EAZY – Vérification de base\n")));
  console.log(colors.gray("Testing core integrations (no server required)...\n"));

  const results = {
    environment: await testEnvironmentVariables(),
    supabase: await testSupabase(),
    database: await testDatabaseSchema(),
    openai: await testOpenAI(),
    stripe: await testStripe(),
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
    console.log(colors.cyan("💡 Vous pouvez maintenant lancer 'npm run dev' et tester les APIs"));
  } else {
    console.log(colors.red(colors.bold("\n⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.")));
    console.log(colors.gray("\n💡 Conseils pour corriger les erreurs :"));
    console.log(colors.gray("   • Vérifiez vos variables d'environnement dans .env"));
    console.log(colors.gray("   • Vérifiez que Supabase est configuré et les tables créées"));
    console.log(colors.gray("   • Vérifiez que vos clés API sont valides"));
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
