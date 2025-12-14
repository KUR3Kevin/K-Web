# Tech Insights - Tech News Aggregation Website

A modern tech news aggregation platform with automated RSS feed fetching, manual article approval, personal blogging, and PayPal donation integration.

## Features

- **Automated News Aggregation**: Fetches tech news from TechCrunch, The Verge, Ars Technica, and more every 2 hours
- **Manual Approval Workflow**: Review and approve articles before they appear on your site
- **Personal Blog**: Write and publish your own opinion pieces on tech topics
- **Category Filtering**: AI, Software, Hardware, Crypto/Stocks
- **Admin Dashboard**: Manage articles and blog posts with ease
- **Responsive Design**: Beautiful UI with black, red, light green, and tan color scheme
- **PayPal Donations**: Integrated donation button for site support

## Tech Stack

### Backend
- **Node.js** + **Express**: Server framework
- **MongoDB** + **Mongoose**: Database
- **RSS Parser**: News feed aggregation
- **Node-cron**: Scheduled news fetching
- **bcryptjs**: Password hashing
- **Express-session**: Admin authentication

### Frontend
- **Vanilla JavaScript**: No framework dependencies
- **HTML5** + **CSS3**: Semantic, responsive design
- **Google Fonts**: Playfair Display, Lora, Cinzel

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd <repo-directory>
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Set up environment variables**
```bash
cp ../.env.example .env
```

Edit `.env` and configure:
- `MONGODB_URI`: Your MongoDB connection string
- `ADMIN_USERNAME`: Your admin username
- `ADMIN_PASSWORD_HASH`: Generate with the command below
- `SESSION_SECRET`: Random secret key

To generate password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

4. **Configure PayPal (optional)**

Edit the following files and replace `YOUR_PAYPAL_EMAIL` with your PayPal email:
- `frontend/public/index.html`
- `frontend/public/pages/about.html`

Or use a PayPal-generated button code.

5. **Start the server**
```bash
# From backend directory
npm start

# Or for development with auto-restart:
npm run dev
```

The server will start on `http://localhost:5000`

## Usage

### Public Pages
- **Homepage**: `/` - Welcome page with features
- **News**: `/news` - Browse approved tech articles
- **Blog**: `/blog` - Read personal blog posts
- **About**: `/about` - Learn about the site and tech interests

### Admin Dashboard
1. Navigate to `/admin`
2. Login with credentials from `.env`
3. **Pending Articles Tab**: Approve or reject fetched articles
4. **Blog Posts Tab**: Manage your blog posts
5. **Create Post Tab**: Write new blog posts
6. **Settings Tab**: Configuration info

### Admin Functions
- **Approve Articles**: Review fetched articles and approve the ones you want to publish
- **Fetch News Manually**: Click "Fetch New Articles" to manually trigger RSS fetching
- **Create Blog Posts**: Write opinion pieces with markdown-like formatting
- **Save Drafts**: Save blog posts without publishing

## Configuration

### News Sources
Edit `backend/services/newsFetcher.js` to add/remove RSS feeds:
```javascript
const RSS_FEEDS = [
  { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
  // Add more feeds here
];
```

### Keywords & Categories
Customize keyword filtering in `backend/services/newsFetcher.js`:
```javascript
const KEYWORDS = {
  AI: ['ai', 'chatgpt', 'claude', ...],
  Software: ['software', 'update', ...],
  // Add more categories/keywords
};
```

### Fetch Schedule
Change the cron schedule in `backend/server.js`:
```javascript
// Current: Every 2 hours
cron.schedule('0 */2 * * *', async () => { ... });

// Example: Every hour
cron.schedule('0 * * * *', async () => { ... });
```

## MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB
brew install mongodb-community  # macOS
# or follow instructions for your OS

# Start MongoDB
brew services start mongodb-community

# Use connection string in .env:
MONGODB_URI=mongodb://localhost:27017/tech-news
```

### MongoDB Atlas (Cloud)
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tech-news
```

## Deployment

### Recommended Platforms
- **Backend**: [Render.com](https://render.com), [Railway.app](https://railway.app), or Heroku
- **Database**: MongoDB Atlas (free tier)

### Environment Variables
Set these on your hosting platform:
- `MONGODB_URI`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`
- `NODE_ENV=production`

### Build Command
```bash
npm install
```

### Start Command
```bash
npm start
```

## Project Structure
```
/
├── backend/
│   ├── server.js              # Express server
│   ├── package.json           # Dependencies
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── models/
│   │   ├── Article.js         # Article schema
│   │   └── BlogPost.js        # Blog post schema
│   ├── routes/
│   │   ├── articles.js        # Article routes
│   │   ├── blog.js            # Blog routes
│   │   └── admin.js           # Admin routes
│   ├── services/
│   │   └── newsFetcher.js     # RSS aggregation
│   └── middleware/
│       └── auth.js            # Authentication
├── frontend/
│   └── public/
│       ├── index.html         # Homepage
│       ├── pages/             # Other HTML pages
│       ├── css/
│       │   └── styles.css     # Main stylesheet
│       └── js/                # JavaScript files
├── .env.example               # Environment template
└── README.md
```

## Customization

### Colors
Edit CSS variables in `frontend/public/css/styles.css`:
```css
:root {
  --color-crimson: #DC143C;
  --color-green: #90EE90;
  --color-tan: #D2B48C;
  /* ... */
}
```

### Typography
Change fonts in HTML files:
```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

### Site Name
Search and replace "Tech Insights" across all files.

## API Endpoints

### Public
- `GET /api/articles` - Get approved articles
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:id` - Get single blog post

### Admin (requires authentication)
- `POST /api/admin/login` - Login
- `POST /api/admin/logout` - Logout
- `GET /api/admin/status` - Check auth status
- `GET /api/admin/dashboard` - Get stats
- `GET /api/articles/pending` - Get unapproved articles
- `PATCH /api/articles/:id/approve` - Approve article
- `DELETE /api/articles/:id` - Delete article
- `POST /api/blog` - Create blog post
- `PATCH /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

## Troubleshooting

### Port already in use
Change `PORT` in `.env` to another port (e.g., 3000, 8080)

### MongoDB connection failed
- Check `MONGODB_URI` is correct
- Ensure MongoDB is running (local) or accessible (Atlas)
- Check firewall/network settings

### Admin login not working
- Verify `ADMIN_PASSWORD_HASH` is correctly generated
- Check browser console for errors
- Clear cookies and try again

### No articles appearing
- Run manual fetch from admin dashboard
- Check RSS feed URLs are accessible
- Review console logs for errors

## Contributing

This is a personal project. Feel free to fork and customize for your own use!

## License

MIT License - feel free to use and modify as needed.

## Support

If you find this project helpful, consider supporting via the PayPal donation button on the site!

---

**Built with Node.js, Express, MongoDB, and passion for technology** 🚀
