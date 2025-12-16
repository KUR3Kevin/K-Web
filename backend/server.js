require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env' : '../.env' });
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const connectDB = require('./config/database');
const { fetchAllNews } = require('./services/newsFetcher');

// Import routes
const articlesRouter = require('./routes/articles');
const blogRouter = require('./routes/blog');
const adminRouter = require('./routes/admin');
const mobileRouter = require('./routes/mobile');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'tech-news-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));

// API Routes
app.use('/api/articles', articlesRouter);
app.use('/api/blog', blogRouter);
app.use('/api/admin', adminRouter);
app.use('/api/mobile', mobileRouter);

// Manual trigger for news fetch (admin only)
app.post('/api/admin/fetch-news', async (req, res) => {
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const count = await fetchAllNews();
    res.json({ message: `Fetched ${count} new articles` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.get('/news', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/pages/news.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/pages/blog.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/pages/about.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/pages/admin.html'));
});

// Schedule news fetching every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('Running scheduled news fetch...');
  try {
    await fetchAllNews();
  } catch (error) {
    console.error('Scheduled news fetch failed:', error.message);
  }
});

// Initial news fetch on server start (optional)
setTimeout(async () => {
  console.log('Running initial news fetch...');
  try {
    await fetchAllNews();
  } catch (error) {
    console.error('Initial news fetch failed:', error.message);
  }
}, 5000); // Wait 5 seconds after server starts

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});
