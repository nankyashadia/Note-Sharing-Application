#!/bin/bash

# MyNoteSpace - Quick Setup Script
# This script sets up both backend and frontend

echo "════════════════════════════════════════════════"
echo "  ✨ MyNoteSpace - Quick Setup Script"
echo "════════════════════════════════════════════════"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js found: $(node -v)"
echo ""

# Setup Backend
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend || exit

if [ ! -f "package.json" ]; then
    echo "❌ backend/package.json not found!"
    exit 1
fi

echo "Installing backend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

echo -e "${GREEN}✓${NC} Backend setup complete!"
echo ""

# Setup Frontend
echo -e "${BLUE}📦 Setting up Frontend...${NC}"
cd ../frontend || exit

if [ ! -f "package.json" ]; then
    echo "❌ frontend/package.json not found!"
    exit 1
fi

echo "Installing frontend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

echo -e "${GREEN}✓${NC} Frontend setup complete!"
echo ""

cd ..

echo "════════════════════════════════════════════════"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "════════════════════════════════════════════════"
echo ""
echo "To start the application:"
echo ""
echo -e "${YELLOW}1. Start Backend:${NC}"
echo "   cd backend"
echo "   npm start"
echo ""
echo -e "${YELLOW}2. Start Frontend (in new terminal):${NC}"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "Backend will run on: http://localhost:4000"
echo "Frontend will open automatically in your browser"
echo ""
echo "Happy coding! 🚀"
