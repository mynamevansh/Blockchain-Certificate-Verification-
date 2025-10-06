echo "🚀 Setting up Tamper-Proof Certificate Verification System..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js found: $(node --version)"
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi
echo "✅ npm found: $(npm --version)"
cd "$(dirname "$0")"
echo "📁 Current directory: $(pwd)"
echo "📦 Installing root dependencies..."
npm install
echo "🖥️  Setting up React frontend..."
cd client
if [ -f "package.json" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    if [ ! -f ".env" ]; then
        echo "📋 Creating .env file..."
        cp .env.example .env
        echo "✅ Created .env file. Please update it with your configuration."
    fi
    echo "✅ Frontend setup complete!"
else
    echo "❌ Frontend package.json not found!"
fi
cd ..
echo "🔧 Backend setup will be added in next phase..."
echo "⛓️  Blockchain setup will be added in next phase..."
echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Update client/.env with your configuration"
echo "   2. Install MetaMask browser extension"
echo "   3. Start the frontend: cd client && npm start"
echo ""
echo "🌐 The application will be available at: http://localhost:3000"
echo ""
echo "📚 For more information, see README.md files in each directory"
