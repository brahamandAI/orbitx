#!/usr/bin/env node

// Start Playwright Server for OrbitX
// This script starts the Playwright server for enhanced search capabilities

const PlaywrightServer = require('./playwrightServer');

async function startServer() {
  console.log('🚀 Starting OrbitX Playwright Server...');
  console.log('📡 This will enable real browser-based web crawling');
  console.log(`🌐 Server will be available at http://localhost:${process.env.PORT || 8002}`);
  console.log('');
  
  const server = new PlaywrightServer();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down Playwright Server...');
    await server.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down Playwright Server...');
    await server.stop();
    process.exit(0);
  });
  
  try {
    await server.start();
  } catch (error) {
    console.error('❌ Failed to start Playwright Server:', error);
    process.exit(1);
  }
}

// Start the server
startServer().catch(error => {
  console.error('❌ Startup error:', error);
  process.exit(1);
});
