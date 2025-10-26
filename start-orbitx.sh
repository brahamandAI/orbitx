#!/bin/bash

# OrbitX Startup Script
# This ensures everything starts on correct ports

echo ""
echo "🚀 Starting OrbitX..."
echo "=================================================="
echo ""

# Kill any existing processes on ports 3000 and 8002
echo "🧹 Cleaning up old processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8002 | xargs kill -9 2>/dev/null
sleep 2

# Check if ports are free
echo ""
echo "🔍 Checking ports..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3000 still in use!"
    exit 1
fi

if lsof -Pi :8002 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 8002 still in use!"
    exit 1
fi

echo "✅ Ports 3000 and 8002 are free"

# Start proxy server in background
echo ""
echo "🌐 Starting Proxy Server (port 8002)..."
PORT=8002 node server.js > /tmp/orbitx-proxy.log 2>&1 &
PROXY_PID=$!
echo "✅ Proxy server started (PID: $PROXY_PID)"

# Wait for proxy to be ready
echo "⏳ Waiting for proxy server to be ready..."
sleep 3

# Check if proxy is responding
if curl -s http://localhost:8002/health > /dev/null; then
    echo "✅ Proxy server is responding"
else
    echo "❌ Proxy server failed to start"
    kill $PROXY_PID 2>/dev/null
    exit 1
fi

# Start React app (without auto-opening browser)
echo ""
echo "🎨 Starting React App (port 3000)..."
echo "⏳ This will take 10-20 seconds..."
echo ""
PORT=3000 BROWSER=none npm start > /tmp/orbitx-react.log 2>&1 &
REACT_PID=$!

# Wait for React to compile
sleep 15

echo ""
echo "=================================================="
echo "✅ OrbitX Started Successfully!"
echo "=================================================="
echo ""
echo "📋 Services Running:"
echo "   🌐 Proxy Server: http://localhost:8002 (PID: $PROXY_PID)"
echo "   🎨 React App:    http://localhost:3000 (PID: $REACT_PID)"
echo ""
echo "🌐 Open OrbitX in your browser:"
echo ""
echo "   👉 http://localhost:3000 👈"
echo ""
echo "=================================================="
echo ""
echo "📝 Logs:"
echo "   Proxy: tail -f /tmp/orbitx-proxy.log"
echo "   React: tail -f /tmp/orbitx-react.log"
echo ""
echo "🛑 To stop OrbitX:"
echo "   kill $PROXY_PID $REACT_PID"
echo ""
echo "=================================================="
echo ""

# Open browser automatically after 5 seconds
sleep 5
echo "🌐 Opening browser..."

# Detect OS and open browser
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v gnome-open > /dev/null; then
    gnome-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
else
    echo "⚠️ Please manually open: http://localhost:3000"
fi

echo ""
echo "✨ Happy browsing!"
echo ""

# Keep script running
wait


