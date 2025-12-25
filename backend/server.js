// Load .env file only in development (Render provides env vars directly)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../.env' });
}
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs'); // Added for debugging
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

// DEBUGGING LOGS FOR DEPLOYMENT
console.log('--- STARTUP DEBUGGING ---');
console.log('Current Directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
const frontendPath = path.join(__dirname, '../frontend/dist');
console.log('Frontend Dist Path:', frontendPath);
console.log('Frontend Dist Exists:', fs.existsSync(frontendPath));
if (fs.existsSync(frontendPath)) {
  console.log('Frontend Dist Contents:', fs.readdirSync(frontendPath));
} else {
  console.error('CRITICAL: frontend/dist does not exist! Build might have failed.');
}
console.log('-------------------------');

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
let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  logger.error('FATAL: SESSION_SECRET environment variable is not set');
  console.error('ERROR: SESSION_SECRET must be set in .env file');
  // FALLBACK FOR DEBUGGING - REMOVE IN STRICT PRODUCTION
  console.warn('USING FALLBACK SESSION SECRET. UNSAFE FOR PRODUCTION.');
  sessionSecret = 'fallback-secret-key-for-debugging-only';
  // process.exit(1); // Commented out to prevent crash loop during debug
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
  secret: sessionSecret,
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

// API Routes (must come before static file serving)
app.use('/api/articles', articlesRouter);
app.use('/api/blog', blogRouter);
app.use('/api/admin', adminRouter);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Development: Serve old frontend or show message
  app.get('/', (req, res) => {
    res.send(`
      <h1>Development Mode</h1>
      <p>Run the React frontend separately with: <code>cd frontend && npm run dev</code></p>
      <p>API is running on port ${PORT}</p>
      <p>Frontend will run on port 3000</p>
    `);
  });
}

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
