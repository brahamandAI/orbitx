#!/usr/bin/env node

/**
 * OrbitX Proxy Test Script
 * Tests if the proxy server is working correctly
 */

const http = require('http');

const PROXY_URL = 'http://localhost:8002';
const TEST_SITES = [
  'https://google.com',
  'https://github.com',
  'https://wikipedia.org'
];

console.log('\n🧪 OrbitX Proxy Test Suite\n');
console.log('='.repeat(60));

// Test 1: Health Check
function testHealth() {
  return new Promise((resolve, reject) => {
    console.log('\n📋 Test 1: Server Health Check');
    console.log('Checking: ' + PROXY_URL + '/health');
    
    http.get(PROXY_URL + '/health', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'healthy') {
            console.log('✅ Server is healthy');
            console.log('   Status:', json.status);
            console.log('   Browser:', json.browser);
            resolve(true);
          } else {
            console.log('❌ Server unhealthy');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Health check failed:', error.message);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.log('❌ Connection failed:', error.message);
      console.log('💡 Make sure server is running: npm run search-server');
      resolve(false);
    });
  });
}

// Test 2: Proxy Endpoint
function testProxy(url) {
  return new Promise((resolve, reject) => {
    const proxyUrl = `${PROXY_URL}/proxy?url=${encodeURIComponent(url)}`;
    console.log('\n🌐 Testing:', url);
    console.log('   Via:', proxyUrl);
    
    const startTime = Date.now();
    
    http.get(proxyUrl, (res) => {
      const duration = Date.now() - startTime;
      let dataLength = 0;
      
      res.on('data', (chunk) => {
        dataLength += chunk.length;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Success!');
          console.log('   Status:', res.statusCode);
          console.log('   Size:', (dataLength / 1024).toFixed(2), 'KB');
          console.log('   Time:', duration, 'ms');
          resolve(true);
        } else {
          console.log('❌ Failed with status:', res.statusCode);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.log('❌ Error:', error.message);
      resolve(false);
    });
  });
}

// Run all tests
async function runTests() {
  let passed = 0;
  let failed = 0;
  
  // Test health
  const healthOk = await testHealth();
  if (healthOk) passed++; else failed++;
  
  if (!healthOk) {
    console.log('\n❌ Server not running. Please start it first:');
    console.log('   npm run search-server\n');
    process.exit(1);
  }
  
  // Test proxy with multiple sites
  console.log('\n📋 Test 2: Proxy Functionality');
  console.log('-'.repeat(60));
  
  for (const site of TEST_SITES) {
    const proxyOk = await testProxy(site);
    if (proxyOk) passed++; else failed++;
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary');
  console.log('   ✅ Passed:', passed);
  console.log('   ❌ Failed:', failed);
  console.log('   Total:', passed + failed);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Proxy is working perfectly!\n');
    console.log('You can now start OrbitX:');
    console.log('   npm start\n');
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above.\n');
  }
  
  console.log('='.repeat(60) + '\n');
}

// Run
runTests().catch(error => {
  console.error('\n❌ Test suite error:', error);
  process.exit(1);
});

