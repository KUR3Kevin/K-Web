#!/bin/bash

# Tech Insights Setup Script

echo "======================================"
echo "Tech Insights - Setup Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Navigate to backend directory
cd backend || exit

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check if .env exists
if [ ! -f "../.env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp ../.env.example ../.env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit the .env file and configure:"
    echo "   1. MongoDB connection string (MONGODB_URI)"
    echo "   2. Admin username (ADMIN_USERNAME)"
    echo "   3. Admin password hash (ADMIN_PASSWORD_HASH)"
    echo "   4. Session secret (SESSION_SECRET)"
    echo ""
    echo "To generate password hash, run:"
    echo "   node -e \"console.log(require('bcryptjs').hashSync('your-password', 10))\""
    echo ""
else
    echo "✓ .env file already exists"
fi

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit the .env file with your configuration"
echo "2. Make sure MongoDB is running"
echo "3. Update PayPal email in HTML files (optional)"
echo "4. Start the server:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "The site will be available at: http://localhost:5000"
echo ""
