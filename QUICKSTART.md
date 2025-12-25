# Quick Start Guide - Tech Insights

Get up and running in 5 minutes!

## 🚀 Super Quick Start

```bash
# 1. Clone and install
git clone <your-repo>
cd <repo-directory>
npm run install-all

# 2. Set up environment
cp .env.example .env

# 3. Generate your admin password hash
node -e "console.log(require('bcryptjs').hashSync('MySecurePassword123!', 10))"
# Copy the output and paste it into .env as ADMIN_PASSWORD_HASH

# 4. Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output and paste it into .env as SESSION_SECRET

# 5. Start development
npm run dev
```

## ⚙️ What Just Happened?

- **Frontend**: Running on `http://localhost:3000` (React + Vite)
- **Backend API**: Running on `http://localhost:5000` (Express)
- **Database**: Using MongoDB (configure in `.env`)

## 📝 Minimum Required Configuration

Edit `.env` with these three critical values:

```bash
MONGODB_URI=mongodb://localhost:27017/tech-news
ADMIN_PASSWORD_HASH=<paste-your-hash-here>
SESSION_SECRET=<paste-your-secret-here>
```

## 🎯 First Steps

1. **Visit** `http://localhost:3000`
2. **Explore** the News and Blog pages
3. **Login to Admin** at `http://localhost:3000/admin`
   - Username: `admin` (or whatever you set in `.env`)
   - Password: Whatever you used to generate the hash

## 🔧 Common Issues

### MongoDB Connection Error
**Problem**: "Failed to connect to MongoDB"

**Solutions**:
```bash
# Using local MongoDB? Make sure it's running:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Or use MongoDB Atlas (cloud):
# 1. Create free account at mongodb.com/cloud/atlas
# 2. Get connection string
# 3. Update MONGODB_URI in .env
```

### Admin Login Not Working
**Problem**: "Invalid credentials"

**Solution**:
```bash
# Regenerate password hash
node -e "console.log(require('bcryptjs').hashSync('NewPassword123', 10))"

# Update ADMIN_PASSWORD_HASH in .env
# Restart backend: npm run dev:backend
```

### Port Already in Use
**Problem**: "Port 3000 or 5000 already in use"

**Solution**:
```bash
# Edit vite.config.js (frontend port)
server: { port: 3001 }

# Edit .env (backend port)
PORT=5001
```

## 🎨 Customization Quick Tips

### Change Site Name
1. Search & replace "Tech Insights" in:
   - `frontend/src/components/Header.jsx`
   - `frontend/src/components/Footer.jsx`
   - `package.json`
   - `README.md`

### Add More RSS Feeds
Edit `backend/services/newsFetcher.js`:
```javascript
const RSS_FEEDS = [
  { url: 'https://your-feed-url.com/rss', name: 'Source Name' },
  // Add more here
];
```

### Change Fetch Schedule
Edit `backend/server.js`:
```javascript
// Change '0 */2 * * *' to your preferred schedule
cron.schedule('0 */1 * * *', ...); // Every hour
cron.schedule('0 */6 * * *', ...); // Every 6 hours
```

## 🚀 Deploying to Production

### 1. Build the Frontend
```bash
npm run build
```

### 2. Set Environment Variables on Your Host
```bash
NODE_ENV=production
MONGODB_URI=<your-atlas-uri>
ADMIN_PASSWORD_HASH=<your-hash>
SESSION_SECRET=<your-secret>
CLIENT_URL=https://yourdomain.com
```

### 3. Start the Server
```bash
npm start
```

### Recommended Hosts
- **Render.com** (Free tier, auto-deploy from Git)
- **Railway.app** (Simple, affordable)
- **Heroku** (Classic choice)

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [SECURITY.md](SECURITY.md) for security best practices
- Explore the codebase:
  - `frontend/src/pages/` - React page components
  - `backend/routes/` - API endpoints
  - `backend/services/newsFetcher.js` - RSS feed logic

## 💡 Pro Tips

1. **Use MongoDB Atlas** for production (free tier available)
2. **Enable HTTPS** in production (Let's Encrypt is free)
3. **Backup your `.env`** in a password manager
4. **Monitor logs** in `backend/*.log` files
5. **Run `npm audit`** regularly for security updates

## 🆘 Need Help?

- Check [README.md](README.md) troubleshooting section
- Review [SECURITY.md](SECURITY.md) for security questions
- Open an issue on GitHub

---

**Happy coding!** 🚀
