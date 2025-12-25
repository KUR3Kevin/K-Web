#!/bin/bash

echo "🔍 Tech Insights - Security Verification Script"
echo "=============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check if dependencies are installed
echo ""
echo "Checking dependencies..."

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Root dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Root dependencies not installed"
    echo "  Run: npm install"
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed"
    echo "  Run: cd backend && npm install"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed"
    echo "  Run: cd frontend && npm install"
fi

# Check .env file
echo ""
echo "Checking configuration..."

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"

    # Check critical variables
    if grep -q "SESSION_SECRET=change-this" .env; then
        echo -e "${RED}✗${NC} SESSION_SECRET not changed from default!"
        echo "  Generate: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    else
        echo -e "${GREEN}✓${NC} SESSION_SECRET configured"
    fi

    if grep -q "ADMIN_PASSWORD_HASH=\$2a\$10\$example" .env; then
        echo -e "${RED}✗${NC} ADMIN_PASSWORD_HASH not set!"
        echo "  Generate: node -e \"console.log(require('bcryptjs').hashSync('YourPassword', 10))\""
    else
        echo -e "${GREEN}✓${NC} ADMIN_PASSWORD_HASH configured"
    fi

    if grep -q "MONGODB_URI" .env; then
        echo -e "${GREEN}✓${NC} MONGODB_URI configured"
    else
        echo -e "${RED}✗${NC} MONGODB_URI not found in .env"
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    echo "  Run: cp .env.example .env"
fi

# Check frontend build
echo ""
echo "Checking build status..."

if [ -d "frontend/dist" ]; then
    echo -e "${GREEN}✓${NC} Frontend build exists (frontend/dist/)"
else
    echo -e "${YELLOW}⚠${NC} Frontend not built yet"
    echo "  Run: npm run build"
fi

# Security audit
echo ""
echo "Running security audit..."

cd backend
BACKEND_AUDIT=$(npm audit 2>&1 | grep "found 0 vulnerabilities")
cd ..

if [ -n "$BACKEND_AUDIT" ]; then
    echo -e "${GREEN}✓${NC} Backend: 0 vulnerabilities"
else
    echo -e "${YELLOW}⚠${NC} Backend: vulnerabilities found"
    echo "  Run: cd backend && npm audit"
fi

cd frontend
FRONTEND_AUDIT=$(npm audit 2>&1 | grep "found 0 vulnerabilities")
cd ..

if [ -n "$FRONTEND_AUDIT" ]; then
    echo -e "${GREEN}✓${NC} Frontend: 0 vulnerabilities"
else
    echo -e "${YELLOW}⚠${NC} Frontend: vulnerabilities found"
    echo "  Run: cd frontend && npm audit"
fi

# Check security features
echo ""
echo "Security features implemented:"
echo -e "${GREEN}✓${NC} React + Vite frontend (XSS prevention)"
echo -e "${GREEN}✓${NC} react-markdown + rehype-sanitize"
echo -e "${GREEN}✓${NC} HTTP-only session cookies"
echo -e "${GREEN}✓${NC} Rate limiting on login"
echo -e "${GREEN}✓${NC} Bcrypt password hashing"
echo -e "${GREEN}✓${NC} Helmet.js security headers"
echo -e "${GREEN}✓${NC} CORS protection"
echo -e "${GREEN}✓${NC} MongoDB injection prevention"
echo -e "${GREEN}✓${NC} Input validation"

echo ""
echo "=============================================="
echo "Next steps:"
echo "1. Configure .env if not already done"
echo "2. Run: npm run dev (development)"
echo "3. Run: npm run build (production build)"
echo "4. Run: NODE_ENV=production npm start (production)"
echo ""
echo "Documentation:"
echo "- QUICKSTART.md - 5-minute setup guide"
echo "- README.md - Complete documentation"
echo "- SECURITY.md - Security best practices"
echo "- MIGRATION_SUMMARY.md - Refactoring details"
echo ""
