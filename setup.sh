#!/bin/bash
echo "🌿 Setting up EcoTrack AI..."
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install
echo ""
echo "✅ Setup complete!"
echo ""
echo "To run the app:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
