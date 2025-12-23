const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const Article = require('../models/Article');
const BlogPost = require('../models/BlogPost');
const { isAuthenticated } = require('../middleware/auth');
const { fetchAllNews } = require('../services/newsFetcher');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' })
  ]
});

// Security: Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded for login', {
      ip: req.ip,
      username: req.body.username
    });
    res.status(429).json({ error: 'Too many login attempts. Please try again in 15 minutes.' });
  }
});

// POST login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Security: Input validation
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      logger.warn('Invalid login attempt - missing or invalid credentials', { ip: req.ip });
      return res.status(400).json({ error: 'Invalid request' });
    }

    if (username.length > 50 || password.length > 100) {
      logger.warn('Invalid login attempt - credentials too long', { ip: req.ip });
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Simple authentication (credentials from .env)
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!validPasswordHash) {
      logger.error('Admin password hash not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Security: Validate password hash format (bcrypt)
    if (!validPasswordHash.startsWith('$2a$') && !validPasswordHash.startsWith('$2b$') || validPasswordHash.length < 60) {
      logger.error('Invalid admin password hash format');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Security: Prevent timing attacks - always check password even if username is wrong
    const isValidUsername = (username === validUsername);
    const isValidPassword = await bcrypt.compare(password, validPasswordHash);

    if (!isValidUsername || !isValidPassword) {
      logger.warn('Failed login attempt', {
        ip: req.ip,
        username: username,
        timestamp: new Date().toISOString()
      });
      // Use a slight delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session
    req.session.isAdmin = true;
    req.session.username = username;

    logger.info('Successful login', {
      ip: req.ip,
      username: username,
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Login successful', username });
  } catch (error) {
    logger.error('Login error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST logout
router.post('/logout', (req, res) => {
  const username = req.session?.username;
  req.session.destroy((err) => {
    if (err) {
      logger.error('Logout error:', { error: err.message });
      return res.status(500).json({ error: 'Logout failed' });
    }
    logger.info('User logged out', { username });
    res.clearCookie('sessionId');
    res.json({ message: 'Logout successful' });
  });
});

// GET check auth status
router.get('/status', (req, res) => {
  if (req.session && req.session.isAdmin) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

// GET dashboard stats (admin only)
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const stats = {
      totalArticles: await Article.countDocuments({ approved: true }),
      pendingArticles: await Article.countDocuments({ approved: false }),
      totalBlogPosts: await BlogPost.countDocuments({ published: true }),
      draftBlogPosts: await BlogPost.countDocuments({ published: false })
    };

    res.json({ stats });
  } catch (error) {
    logger.error('Dashboard stats error:', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST manual trigger for news fetch (admin only)
router.post('/fetch-news', isAuthenticated, async (req, res) => {
  try {
    logger.info('Manual news fetch triggered', {
      username: req.session.username,
      ip: req.ip
    });

    const count = await fetchAllNews();

    logger.info('Manual news fetch completed', {
      count,
      username: req.session.username
    });

    res.json({ message: `Fetched ${count} new articles` });
  } catch (error) {
    logger.error('Manual news fetch error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
