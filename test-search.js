// Test script for the search engine server
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSearch(query) {
  try {
    console.log(`🔍 Testing search for: "${query}"`);
    
    const response = await fetch(`http://localhost:${process.env.PORT || 8002}/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ Search successful!`);
    console.log(`📊 Query: ${data.query}`);
    console.log(`📈 Total results: ${data.total}`);
    console.log(`⏰ Timestamp: ${data.timestamp}`);
    console.log('\n🎯 Results:');
    
    data.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   🔗 URL: ${result.url}`);
      console.log(`   📝 Description: ${result.description}`);
      console.log(`   🖼️ Favicon: ${result.favicon}`);
    });
    
    return data;
    
  } catch (error) {
    console.error(`❌ Search failed: ${error.message}`);
    return null;
  }
}

async function testHealth() {
  try {
    console.log('🏥 Testing health endpoint...');
    
    const response = await fetch(`http://localhost:${process.env.PORT || 8002}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Health check successful!');
    console.log(`📊 Status: ${data.status}`);
    console.log(`🌐 Browser: ${data.browser}`);
    console.log(`⏰ Timestamp: ${data.timestamp}`);
    
    return data;
    
  } catch (error) {
    console.error(`❌ Health check failed: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Search Engine Tests\n');
  
  // Test health endpoint
  await testHealth();
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test various searches
  const testQueries = [
    'foodfly',
    'javascript',
    'react',
    'nodejs',
    'orbitx'
  ];
  
  for (const query of testQueries) {
    await testSearch(query);
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testSearch, testHealth };
