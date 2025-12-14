const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Article = require('../models/Article');
const BlogPost = require('../models/BlogPost');
const { isAuthenticated } = require('../middleware/auth');

// POST login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple authentication (credentials from .env)
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!validPasswordHash) {
      return res.status(500).json({ error: 'Admin credentials not configured' });
    }

    if (username !== validUsername) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, validPasswordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session
    req.session.isAdmin = true;
    req.session.username = username;

    res.json({ message: 'Login successful', username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
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
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
