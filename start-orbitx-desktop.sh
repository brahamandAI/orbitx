#!/bin/bash

# OrbitX Desktop Launcher for Headless Server
# Uses Xvfb (X Virtual Frame Buffer) to provide a virtual display

echo "🚀 Starting OrbitX Desktop App with Virtual Display..."
echo "=================================================="

# Kill any existing Xvfb or Electron processes on our display
killall Xvfb 2>/dev/null
sleep 1

# Set display number
export DISPLAY=:99

# Start Xvfb in the background
echo "📺 Starting virtual display (Xvfb)..."
Xvfb :99 -screen 0 1920x1080x24 -ac +extension GLX +render -noreset &
XVFB_PID=$!
sleep 2

# Check if Xvfb started successfully
if ps -p $XVFB_PID > /dev/null; then
    echo "✅ Virtual display started (PID: $XVFB_PID)"
else
    echo "❌ Failed to start virtual display"
    exit 1
fi

echo "🖥️ Display server ready on $DISPLAY"
echo "🚀 Launching Electron app..."
echo ""

# Change to project directory
cd /home/orbitx/htdocs/orbitx.zone/orbitx

# Run Electron
npm run electron

# Cleanup when done
echo ""
echo "🧹 Cleaning up..."
kill $XVFB_PID 2>/dev/null
echo "✅ Done!"

