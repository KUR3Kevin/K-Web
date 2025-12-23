require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env' : '../.env' });
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('mongoose-sanitize');
const winston = require('winston');

const connectDB = require('./config/database');
const { fetchAllNews } = require('./services/newsFetcher');

// Import routes
const articlesRouter = require('./routes/articles');
const blogRouter = require('./routes/blog');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Validate critical environment variables
if (!process.env.SESSION_SECRET) {
  logger.error('FATAL: SESSION_SECRET environment variable is not set');
  console.error('ERROR: SESSION_SECRET must be set in .env file');
  process.exit(1);
}

if (!process.env.ADMIN_PASSWORD_HASH) {
  logger.warn('WARNING: ADMIN_PASSWORD_HASH is not set');
}

// Connect to database
connectDB();

// Security: HTTPS enforcement in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

// Security: Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}));

// Security: CORS configuration
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:5000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      logger.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Security: Request body size limits
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Security: MongoDB injection prevention
app.use(mongoSanitize());

// Session middleware with secure configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Don't use default 'connect.sid'
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));

// API Routes
app.use('/api/articles', articlesRouter);
app.use('/api/blog', blogRouter);
app.use('/api/admin', adminRouter);

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

// Security: 404 handler
app.use((req, res, next) => {
  logger.warn(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not Found' });
});

// Security: Global error handler
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Don't leak error details in production
  const errorMessage = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(err.status || 500).json({ error: errorMessage });
});

// Schedule news fetching every 2 hours
cron.schedule('0 */2 * * *', async () => {
  logger.info('Running scheduled news fetch...');
  try {
    const count = await fetchAllNews();
    logger.info(`Scheduled news fetch complete: ${count} articles`);
  } catch (error) {
    logger.error('Scheduled news fetch failed:', { error: error.message });
  }
});

// Initial news fetch on server start (optional)
setTimeout(async () => {
  logger.info('Running initial news fetch...');
  try {
    const count = await fetchAllNews();
    logger.info(`Initial news fetch complete: ${count} articles`);
  } catch (error) {
    logger.error('Initial news fetch failed:', { error: error.message });
  }
}, 5000); // Wait 5 seconds after server starts

// Start server
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
