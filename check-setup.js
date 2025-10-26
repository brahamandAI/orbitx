#!/usr/bin/env node

/**
 * OrbitX Setup Checker
 * Verifies that everything is running on correct ports
 */

const http = require('http');

console.log('\n🔍 OrbitX Setup Checker\n');
console.log('='.repeat(60));

function checkPort(port, name, expectedContent) {
  return new Promise((resolve) => {
    console.log(`\n📋 Checking ${name} on port ${port}...`);
    
    http.get(`http://localhost:${port}`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${name} is running on port ${port}`);
          
          if (expectedContent) {
            if (data.includes(expectedContent)) {
              console.log(`   Content verified: ${expectedContent} found`);
            } else {
              console.log(`   ⚠️ Warning: Expected content not found`);
            }
          }
          
          resolve({ port, name, status: 'running', ok: true });
        } else {
          console.log(`⚠️ ${name} responded with status ${res.statusCode}`);
          resolve({ port, name, status: 'error', ok: false });
        }
      });
    }).on('error', (error) => {
      console.log(`❌ ${name} is NOT running on port ${port}`);
      console.log(`   Error: ${error.message}`);
      resolve({ port, name, status: 'not_running', ok: false });
    });
  });
}

async function runChecks() {
  const results = {
    proxyServer: null,
    reactApp: null
  };
  
  // Check Proxy Server (port 8002)
  results.proxyServer = await checkPort(8002, 'Proxy Server', null);
  
  // Check React App (port 3000)
  results.reactApp = await checkPort(3000, 'React App', 'OrbitX');
  
  // Analysis
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Analysis:\n');
  
  let allGood = true;
  const issues = [];
  
  // Check if both are running
  if (!results.proxyServer.ok) {
    allGood = false;
    issues.push('❌ Proxy Server is not running');
    console.log('❌ Proxy Server Issue:');
    console.log('   Start it with: npm run search-server');
  }
  
  if (!results.reactApp.ok) {
    allGood = false;
    issues.push('❌ React App is not running');
    console.log('❌ React App Issue:');
    console.log('   Start it with: npm start');
  }
  
  // Check if ports are correct
  if (results.proxyServer.ok && results.reactApp.ok) {
    console.log('✅ Both services are running on correct ports!');
    console.log('\n📱 Access OrbitX at: http://localhost:3000');
    console.log('🔧 Proxy API at: http://localhost:8002');
  }
  
  // Final verdict
  console.log('\n' + '='.repeat(60));
  
  if (allGood) {
    console.log('\n🎉 Perfect Setup! Everything is configured correctly!\n');
    console.log('You can now:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Search for any website');
    console.log('3. Click results to browse inside OrbitX\n');
  } else {
    console.log('\n⚠️ Setup Issues Found:\n');
    issues.forEach(issue => console.log(`   ${issue}`));
    console.log('\n🔧 Quick Fix:\n');
    
    if (!results.proxyServer.ok && !results.reactApp.ok) {
      console.log('   Start everything with one command:');
      console.log('   npm run orbitx\n');
      console.log('   Or manually in two terminals:');
      console.log('   Terminal 1: npm run search-server');
      console.log('   Terminal 2: npm start\n');
    } else if (!results.proxyServer.ok) {
      console.log('   Terminal 1: npm run search-server\n');
    } else if (!results.reactApp.ok) {
      console.log('   Terminal 2: npm start\n');
    }
  }
  
  console.log('='.repeat(60) + '\n');
  
  return allGood;
}

// Run the checks
runChecks().then((success) => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('\n❌ Check failed:', error.message);
  process.exit(1);
});

