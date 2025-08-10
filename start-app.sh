#!/bin/bash

echo "🚀 Starting InfinityFire Application..."
echo "======================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please run: cp env.example .env"
    echo "Then edit .env with your actual credentials"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client
    npm install
    cd ..
fi

echo ""
echo "✅ Dependencies are ready!"
echo ""
echo "🌐 Starting applications..."
echo ""
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both applications"
echo ""

# Start backend in background
echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend application..."
cd client
npm start &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

# Cleanup on exit
trap "echo ''; echo '🛑 Stopping applications...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM 