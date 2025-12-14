# Quick Start Guide - Tech Insights

Get your tech news website up and running in 5 minutes!

## Prerequisites
- Node.js installed (v14+)
- MongoDB installed locally OR MongoDB Atlas account (free)

## Step 1: Run Setup Script
```bash
./setup.sh
```

This will:
- Install all dependencies
- Create `.env` file from template

## Step 2: Configure Environment

### Option A: Local MongoDB
If you have MongoDB installed locally:
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
# or: sudo systemctl start mongod       # Linux

# .env file will use: mongodb://localhost:27017/tech-news
```

### Option B: MongoDB Atlas (Cloud - Free)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string
4. Edit `.env` and update `MONGODB_URI`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tech-news
   ```

### Generate Admin Password
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

Copy the output and paste it in `.env` as `ADMIN_PASSWORD_HASH`.

### Edit .env File
```bash
# Open .env and configure:
MONGODB_URI=your-mongodb-connection-string
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=paste-hash-here
SESSION_SECRET=change-to-random-string
```

## Step 3: Start the Server
```bash
cd backend
npm start
```

You should see:
```
MongoDB Connected: ...
Server running on port 5000
Frontend: http://localhost:5000
API: http://localhost:5000/api
```

## Step 4: Visit Your Site
Open browser and go to:
- **Homepage**: http://localhost:5000
- **Admin Dashboard**: http://localhost:5000/admin

Login with credentials from `.env`

## Step 5: Fetch Your First Articles
1. Go to admin dashboard
2. Click "Fetch New Articles" button
3. Wait for articles to load
4. Approve the ones you like!
5. Visit the news page to see them live

## Optional: Configure PayPal Donations

Edit these files and replace `YOUR_PAYPAL_EMAIL`:
- `frontend/public/index.html` (line ~79)
- `frontend/public/pages/about.html` (line ~137)

Replace with your actual PayPal email address.

## Customization Ideas

### Change Site Name
Search and replace "Tech Insights" in all files with your site name.

### Change Colors
Edit `frontend/public/css/styles.css`:
```css
:root {
  --color-crimson: #DC143C;  /* Change to your color */
  --color-green: #90EE90;    /* Change to your color */
  --color-tan: #D2B48C;      /* Change to your color */
}
```

### Add More News Sources
Edit `backend/services/newsFetcher.js`:
```javascript
const RSS_FEEDS = [
  { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
  { url: 'https://your-source.com/feed/', name: 'Your Source' },
];
```

## Troubleshooting

### Port 5000 already in use?
Change port in `.env`:
```
PORT=3000
```

### Can't connect to MongoDB?
- Check MongoDB is running: `brew services list` (macOS)
- Verify connection string in `.env`
- For Atlas: Check IP whitelist (allow 0.0.0.0/0 for testing)

### No articles showing?
1. Check admin dashboard for pending articles
2. Click "Fetch New Articles" manually
3. Approve some articles
4. Visit `/news` page

## Development Mode

For auto-restart on file changes:
```bash
npm run dev
```

## Next Steps

1. ✅ Write your first blog post from admin dashboard
2. ✅ Customize the About page with your info
3. ✅ Approve some articles
4. ✅ Share your site!

## Need Help?

Check the full [README.md](README.md) for detailed documentation.

---

Happy curating! 🚀
