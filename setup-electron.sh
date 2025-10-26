#!/bin/bash

# OrbitX Desktop App - Setup Script
# Automates the installation and first run

echo ""
echo "🚀 OrbitX Desktop App - Setup"
echo "=================================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo "Please install Node.js from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found!"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "This may take 2-3 minutes..."
echo ""

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Installation failed!"
    echo "Try running: npm install manually"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Build React app
echo "🔨 Building React app..."
echo "This may take 1-2 minutes..."
echo ""

npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed!"
    echo "Try running: npm run build manually"
    exit 1
fi

echo ""
echo "✅ React app built successfully!"
echo ""

# Setup complete
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Start Development Mode:"
echo "   npm run electron-dev"
echo ""
echo "2. Test Production Build:"
echo "   npm run electron"
echo ""
echo "3. Create Installer:"
echo "   npm run dist"
echo ""
echo "=================================================="
echo ""
echo "📚 Documentation:"
echo "   Read: ELECTRON_DESKTOP_APP.md"
echo ""
echo "🎉 OrbitX Desktop App is ready!"
echo ""

# Ask to start
read -p "🚀 Start OrbitX Desktop App now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting OrbitX Desktop App..."
    echo ""
    npm run electron-dev
fi

