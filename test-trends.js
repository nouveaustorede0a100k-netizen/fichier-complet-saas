#!/usr/bin/env node

/**
 * Script de test pour le module Trend Finder Pro
 * Usage: node test-trends.js
 */

const { fetchGoogleTrends, fetchRedditSignals, fetchProductHunt } = require('./lib/trends/fetchSources');
const { normalize } = require('./lib/trends/normalize');
const { scoreAndExplain } = require('./lib/trends/scoreAndExplain');

// Configuration de test
const TEST_TOPIC = 'fitness';
const TEST_COUNTRY = 'US';
const TEST_RANGE = '30d';

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testGoogleTrends() {
  log('\n🔍 Testing Google Trends...', 'blue');
  try {
    const result = await fetchGoogleTrends(TEST_TOPIC, TEST_COUNTRY, TEST_RANGE);
    
    if (result.error) {
      log(`❌ Google Trends failed: ${result.error}`, 'red');
      return false;
    }
    
    log(`✅ Google Trends: ${result.timeseries.length} data points`, 'green');
    log(`   Average: ${result.averageValue}, Relative Score: ${result.relativeScore}`, 'yellow');
    return result;
  } catch (error) {
    log(`❌ Google Trends error: ${error.message}`, 'red');
    return false;
  }
}

async function testRedditSignals() {
  log('\n🔍 Testing Reddit Signals...', 'blue');
  try {
    const result = await fetchRedditSignals(TEST_TOPIC);
    
    if (result.error) {
      log(`❌ Reddit failed: ${result.error}`, 'red');
      return false;
    }
    
    log(`✅ Reddit: ${result.totalMentions} mentions, ${result.topPosts.length} top posts`, 'green');
    log(`   Avg Score: ${result.avgScore}, Growth: ${result.mentionsGrowth}%`, 'yellow');
    return result;
  } catch (error) {
    log(`❌ Reddit error: ${error.message}`, 'red');
    return false;
  }
}

async function testProductHunt() {
  log('\n🔍 Testing Product Hunt...', 'blue');
  try {
    const result = await fetchProductHunt(TEST_TOPIC);
    
    if (result.error) {
      log(`⚠️ Product Hunt: ${result.error}`, 'yellow');
      return result; // Pas d'erreur fatale
    }
    
    log(`✅ Product Hunt: ${result.totalPosts} posts, ${result.recentLaunches.length} launches`, 'green');
    log(`   Avg Upvotes: ${result.avgUpvotes}, Trend Signal: ${result.trendSignal}`, 'yellow');
    return result;
  } catch (error) {
    log(`❌ Product Hunt error: ${error.message}`, 'red');
    return { recentLaunches: [], avgUpvotes: 0, trendSignal: 0, error: error.message };
  }
}

async function testNormalization(rawSources) {
  log('\n🔄 Testing Normalization...', 'blue');
  try {
    const result = normalize(rawSources);
    
    log(`✅ Normalization complete:`, 'green');
    log(`   Growth Estimate: ${result.rawMetrics.rawGrowthEstimate}`, 'yellow');
    log(`   Velocity: ${result.rawMetrics.velocity}`, 'yellow');
    log(`   Source Diversity: ${result.rawMetrics.sourceDiversity}`, 'yellow');
    
    return result;
  } catch (error) {
    log(`❌ Normalization error: ${error.message}`, 'red');
    return false;
  }
}

async function testAIAnalysis(rawMetrics) {
  log('\n🤖 Testing AI Analysis...', 'blue');
  try {
    const result = await scoreAndExplain(rawMetrics, TEST_TOPIC);
    
    log(`✅ AI Analysis complete:`, 'green');
    log(`   Growth Score: ${result.growthScore}/100`, 'yellow');
    log(`   Market Potential: ${result.marketPotential}/100`, 'yellow');
    log(`   Confidence: ${result.confidenceLevel}/100`, 'yellow');
    log(`   Insights: ${result.actionableInsights?.length || 0}`, 'yellow');
    
    return result;
  } catch (error) {
    log(`❌ AI Analysis error: ${error.message}`, 'red');
    return false;
  }
}

async function runFullTest() {
  log(`${colors.bold}🚀 Starting Trend Finder Pro Test Suite${colors.reset}`);
  log(`Topic: ${TEST_TOPIC}, Country: ${TEST_COUNTRY}, Range: ${TEST_RANGE}`);
  
  const startTime = Date.now();
  
  // Test 1: Sources de données
  const googleTrends = await testGoogleTrends();
  const reddit = await testRedditSignals();
  const productHunt = await testProductHunt();
  
  // Test 2: Normalisation
  const rawSources = { googleTrends, reddit, productHunt };
  const normalizedData = await testNormalization(rawSources);
  
  if (!normalizedData) {
    log('\n❌ Test suite failed at normalization step', 'red');
    return;
  }
  
  // Test 3: Analyse IA
  const aiAnalysis = await testAIAnalysis(normalizedData.rawMetrics);
  
  if (!aiAnalysis) {
    log('\n❌ Test suite failed at AI analysis step', 'red');
    return;
  }
  
  // Résumé final
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  log(`\n${colors.bold}📊 Test Results Summary:${colors.reset}`);
  log(`✅ Google Trends: ${googleTrends ? 'PASS' : 'FAIL'}`, googleTrends ? 'green' : 'red');
  log(`✅ Reddit: ${reddit ? 'PASS' : 'FAIL'}`, reddit ? 'green' : 'red');
  log(`✅ Product Hunt: ${productHunt ? 'PASS' : 'FAIL'}`, productHunt ? 'green' : 'red');
  log(`✅ Normalization: ${normalizedData ? 'PASS' : 'FAIL'}`, normalizedData ? 'green' : 'red');
  log(`✅ AI Analysis: ${aiAnalysis ? 'PASS' : 'FAIL'}`, aiAnalysis ? 'green' : 'red');
  log(`⏱️ Duration: ${duration}ms`, 'blue');
  
  if (googleTrends && reddit && normalizedData && aiAnalysis) {
    log(`\n🎉 All tests passed! Module is ready for production.`, 'green');
  } else {
    log(`\n⚠️ Some tests failed. Check the logs above.`, 'yellow');
  }
}

// Vérifier les variables d'environnement
function checkEnvironment() {
  const required = ['OPENAI_API_KEY'];
  const optional = ['NEXT_PUBLIC_SUPABASE_URL', 'PRODUCTHUNT_TOKEN'];
  
  log('\n🔧 Checking environment variables...', 'blue');
  
  let allGood = true;
  
  required.forEach(key => {
    if (!process.env[key]) {
      log(`❌ Missing required: ${key}`, 'red');
      allGood = false;
    } else {
      log(`✅ ${key}: ${process.env[key].substring(0, 10)}...`, 'green');
    }
  });
  
  optional.forEach(key => {
    if (process.env[key]) {
      log(`✅ ${key}: ${process.env[key].substring(0, 10)}...`, 'green');
    } else {
      log(`⚠️ Optional: ${key} (not set)`, 'yellow');
    }
  });
  
  if (!allGood) {
    log('\n❌ Missing required environment variables. Please check your .env file.', 'red');
    process.exit(1);
  }
}

// Point d'entrée
async function main() {
  try {
    checkEnvironment();
    await runFullTest();
  } catch (error) {
    log(`\n💥 Fatal error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = {
  testGoogleTrends,
  testRedditSignals,
  testProductHunt,
  testNormalization,
  testAIAnalysis,
  runFullTest
};
