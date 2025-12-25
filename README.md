# Tech Insights - Secure Full-Stack Tech News Platform

A modern, security-hardened tech news aggregation platform built with React, Express, and MongoDB. Features automated RSS feed fetching, manual article approval, personal blogging with XSS prevention, and production-ready security measures.

## 🔒 Security Features

This application has been architected with security as the top priority:

### Authentication & Authorization
- ✅ Secure session-based authentication with HTTP-only cookies
- ✅ Bcrypt password hashing (cost factor: 10)
- ✅ Rate limiting on login endpoint (5 attempts per 15 minutes)
- ✅ Timing attack prevention
- ✅ CSRF protection ready (csrf-csrf package included)

### XSS Prevention
- ✅ **react-markdown** with **rehype-sanitize** for safe content rendering
- ✅ AI-generated markdown content rendered securely
- ✅ No `dangerouslySetInnerHTML` usage
- ✅ Content Security Policy (CSP) headers

### API Security
- ✅ Rate limiting on authentication endpoints
- ✅ Input validation and sanitization (express-validator)
- ✅ MongoDB injection prevention (mongoose-sanitize)
- ✅ Request body size limits (100kb)
- ✅ Secure CORS configuration

### Infrastructure Security
- ✅ Helmet.js for comprehensive security headers
- ✅ HTTPS enforcement in production
- ✅ Secure session configuration
- ✅ Environment variable protection
- ✅ Structured logging with Winston
- ✅ No sensitive data in client-side code

## 🏗️ Architecture

### Backend (Express.js + MongoDB)
- Production-ready Node.js server
- Secure session management
- RESTful API with rate limiting
- Automated news fetching every 2 hours
- Comprehensive error handling

### Frontend (React + Vite)
- Modern React with React Router
- Fast HMR with Vite
- Secure markdown rendering
- Component-based architecture
- Production-optimized builds

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies**
```bash
git clone <your-repo-url>
cd <repo-directory>
npm run install-all
```

2. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and set:
- `MONGODB_URI` - Your MongoDB connection string
- `ADMIN_PASSWORD_HASH` - Generate with: `node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"`
- `SESSION_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `CLIENT_URL` - Your production domain

3. **Run in development**
```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
npm run dev:backend  # Backend on port 5000
npm run dev:frontend # Frontend on port 3000
```

### Production Build

```bash
# Build frontend
npm run build

# Start production server (serves React build + API)
NODE_ENV=production npm start
```

## 📁 Project Structure

```
/
├── backend/
│   ├── server.js              # Express server with security
│   ├── package.json
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── models/
│   │   ├── Article.js         # Article schema
│   │   └── BlogPost.js        # Blog post schema
│   ├── routes/
│   │   ├── articles.js        # Article API routes
│   │   ├── blog.js            # Blog API routes
│   │   └── admin.js           # Admin routes with auth
│   ├── services/
│   │   └── newsFetcher.js     # RSS aggregation service
│   └── middleware/
│       └── auth.js            # Authentication middleware
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Router setup
│   │   ├── components/        # Shared components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── News.jsx
│   │   │   ├── Blog.jsx       # XSS-protected rendering
│   │   │   ├── About.jsx
│   │   │   └── Admin.jsx      # Secure admin panel
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   └── index.css          # Global styles
│   ├── vite.config.js         # Vite config with proxy
│   └── package.json
├── .env.example               # Environment template
├── .gitignore
├── package.json               # Root scripts
├── README.md
└── SECURITY.md
```

## 🔐 Security Best Practices

### Before Deployment

1. **Generate Strong Secrets**
```bash
# SESSION_SECRET (32+ random characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ADMIN_PASSWORD_HASH
node -e "console.log(require('bcryptjs').hashSync('YOUR-SECURE-PASSWORD', 10))"
```

2. **Set Environment Variables**
- Never commit `.env` to version control
- Use different secrets for dev/production
- Store production `.env` securely (password manager)

3. **Enable HTTPS**
- Use Let's Encrypt for free SSL certificates
- Configure reverse proxy (nginx/Apache)
- Set `NODE_ENV=production`

4. **Database Security**
- Enable MongoDB authentication
- Use IP whitelisting
- Enable encryption at rest

## 📚 API Endpoints

### Public Endpoints
```
GET  /api/articles              # Get approved articles
GET  /api/blog                  # Get published blog posts
GET  /api/blog/:id              # Get single blog post
```

### Admin Endpoints (Authentication Required)
```
POST  /api/admin/login          # Admin login
POST  /api/admin/logout         # Admin logout
GET   /api/admin/status         # Check auth status
GET   /api/admin/dashboard      # Get dashboard stats
POST  /api/admin/fetch-news     # Manually fetch news
GET   /api/articles/pending     # Get unapproved articles
PATCH /api/articles/:id/approve # Approve article
DELETE /api/articles/:id        # Delete article
POST  /api/blog                 # Create blog post
PATCH /api/blog/:id             # Update blog post
DELETE /api/blog/:id            # Delete blog post
```

## 🎨 Features

### News Aggregation
- Automated fetching from TechCrunch, The Verge, Ars Technica, Wired, VentureBeat
- Smart categorization (AI, Software, Hardware, Crypto/Stocks)
- Manual approval workflow
- Featured article display

### Blog Platform
- Markdown-based blog posts
- **XSS-protected rendering** with react-markdown + rehype-sanitize
- Category and tag support
- Draft/publish workflow
- Image URL support

### Admin Dashboard
- Real-time statistics
- Approve/reject articles
- Create/edit/delete blog posts
- Manual news fetch trigger
- Secure session management

## 🔧 Configuration

### News Sources
Edit `backend/services/newsFetcher.js` to customize RSS feeds:
```javascript
const RSS_FEEDS = [
  { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
  // Add more feeds
];
```

### Fetch Schedule
Modify cron schedule in `backend/server.js`:
```javascript
// Every 2 hours (default)
cron.schedule('0 */2 * * *', async () => { ... });

// Every hour
cron.schedule('0 * * * *', async () => { ... });
```

## 🚀 Deployment

### Recommended Platforms
- **Backend**: Render.com, Railway.app, or Heroku
- **Database**: MongoDB Atlas (free tier)
- **CDN**: Cloudflare (optional)

### Environment Variables for Production
```bash
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-uri>
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt-hash>
SESSION_SECRET=<random-32-char-string>
CLIENT_URL=https://yourdomain.com
PORT=5000
```

### Build Commands
```bash
# Build command
npm run build

# Start command
npm start
```

## 📝 Development Scripts

```bash
npm run install-all   # Install all dependencies
npm run dev           # Run frontend & backend concurrently
npm run dev:backend   # Run backend only (port 5000)
npm run dev:frontend  # Run frontend only (port 3000)
npm run build         # Build React app for production
npm start             # Start production server
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Verify `MONGODB_URI` in `.env`
- Check MongoDB is running (local) or accessible (Atlas)
- Ensure IP whitelist includes your server IP

### Admin Login Not Working
- Verify `ADMIN_PASSWORD_HASH` is correctly generated
- Check browser console for errors
- Clear cookies and try again
- Check `security.log` for login attempts

### Build Errors
- Delete `node_modules` and run `npm run install-all`
- Clear frontend cache: `cd frontend && rm -rf node_modules .vite dist`
- Ensure Node.js version is 16+

## 📊 Monitoring

Log files (in `backend/`):
- `error.log` - Application errors
- `combined.log` - All requests
- `security.log` - Authentication events

## 🤝 Contributing

This is a personal project. Feel free to fork and customize!

## 📄 License

MIT License - See LICENSE file

## 🆘 Support

For security issues, please see SECURITY.md for responsible disclosure.

---

**Built with security, performance, and user privacy in mind** 🔒
