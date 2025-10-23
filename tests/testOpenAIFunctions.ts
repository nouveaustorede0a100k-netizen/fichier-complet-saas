import chalk from "chalk";
import { 
  analyzeTrends, 
  findProducts, 
  generateOffer, 
  generateAds, 
  generateLaunchPlan 
} from "@/lib/openai";

async function testAnalyzeTrends() {
  try {
    console.log(chalk.blue("🧪 Testing analyzeTrends..."));
    const trends = await analyzeTrends("artificial intelligence");
    
    if (Array.isArray(trends) && trends.length > 0) {
      console.log(chalk.green("✅ analyzeTrends OK"), `(${trends.length} trends generated)`);
      return true;
    } else {
      throw new Error("No trends returned");
    }
  } catch (err: any) {
    console.error(chalk.red("❌ analyzeTrends failed:"), err.message);
    return false;
  }
}

async function testFindProducts() {
  try {
    console.log(chalk.blue("🧪 Testing findProducts..."));
    const products = await findProducts("fitness");
    
    if (Array.isArray(products) && products.length > 0) {
      console.log(chalk.green("✅ findProducts OK"), `(${products.length} products found)`);
      return true;
    } else {
      throw new Error("No products returned");
    }
  } catch (err: any) {
    console.error(chalk.red("❌ findProducts failed:"), err.message);
    return false;
  }
}

async function testGenerateOffer() {
  try {
    console.log(chalk.blue("🧪 Testing generateOffer..."));
    const offer = await generateOffer("digital marketing");
    
    if (offer && offer.title && offer.promise) {
      console.log(chalk.green("✅ generateOffer OK"), `(Title: ${offer.title})`);
      return true;
    } else {
      throw new Error("Invalid offer structure");
    }
  } catch (err: any) {
    console.error(chalk.red("❌ generateOffer failed:"), err.message);
    return false;
  }
}

async function testGenerateAds() {
  try {
    console.log(chalk.blue("🧪 Testing generateAds..."));
    const ads = await generateAds("AI Course", "Entrepreneurs", "Facebook");
    
    if (ads && ads.headlines && ads.descriptions) {
      console.log(chalk.green("✅ generateAds OK"), `(${ads.headlines.length} headlines generated)`);
      return true;
    } else {
      throw new Error("Invalid ads structure");
    }
  } catch (err: any) {
    console.error(chalk.red("❌ generateAds failed:"), err.message);
    return false;
  }
}

async function testGenerateLaunchPlan() {
  try {
    console.log(chalk.blue("🧪 Testing generateLaunchPlan..."));
    const plan = await generateLaunchPlan("AI Course", "2024-03-01", "€5000");
    
    if (plan && plan.title && plan.timeline && plan.budget) {
      console.log(chalk.green("✅ generateLaunchPlan OK"), `(Timeline: ${plan.timeline.length} phases)`);
      return true;
    } else {
      throw new Error("Invalid launch plan structure");
    }
  } catch (err: any) {
    console.error(chalk.red("❌ generateLaunchPlan failed:"), err.message);
    return false;
  }
}

async function main() {
  console.log(chalk.cyan.bold("\n🤖 TESTS DROP EAZY – Fonctions OpenAI\n"));
  console.log(chalk.gray("Testing all OpenAI functions...\n"));

  const results: Record<string, boolean> = {
    analyzeTrends: await testAnalyzeTrends(),
    findProducts: await testFindProducts(),
    generateOffer: await testGenerateOffer(),
    generateAds: await testGenerateAds(),
    generateLaunchPlan: await testGenerateLaunchPlan(),
  };

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
    console.log(chalk.green.bold("\n🎉 Toutes les fonctions OpenAI fonctionnent parfaitement !"));
  } else {
    console.log(chalk.red.bold("\n⚠️  Certaines fonctions OpenAI ont échoué."));
    console.log(chalk.gray("\n💡 Vérifiez que votre clé OPENAI_API_KEY est valide et a des crédits."));
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
