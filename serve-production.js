#!/usr/bin/env node
/**
 * Production Server for OrbitX Browser
 * Serves the built React app on port 8002
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8002;

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Enable CORS for API requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'OrbitX Browser',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Handle React routing, return all requests to React app
// Using middleware instead of route to avoid Express v5 path-to-regexp issues
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log('🚀 OrbitX Browser Production Server');
  console.log('====================================');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log('====================================');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});





