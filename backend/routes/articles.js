const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { isAuthenticated } = require('../middleware/auth');

// GET approved articles (public)
router.get('/', async (req, res) => {
  try {
    const { category, limit = 20, page = 1 } = req.query;

    // Security: Validate and sanitize inputs to prevent MongoDB injection
    const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);

    const query = { approved: true };

    // Security: Only allow string values and validate against allowed categories
    const allowedCategories = ['AI', 'Software', 'Hardware', 'Crypto/Stocks', 'General'];
    if (category && typeof category === 'string' && category !== 'All') {
      if (allowedCategories.includes(category)) {
        query.category = category;
      }
    }

    const articles = await Article.find(query)
      .sort({ featured: -1, publishedDate: -1 })
      .limit(safeLimit)
      .skip((safePage - 1) * safeLimit)
      .select('-__v'); // Don't return version field

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit)
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// GET pending articles (admin only)
router.get('/pending', isAuthenticated, async (req, res) => {
  try {
    const articles = await Article.find({ approved: false })
      .sort({ fetchedDate: -1 })
      .limit(100)
      .select('-__v');

    res.json({ articles });
  } catch (error) {
    console.error('Error fetching pending articles:', error.message);
    res.status(500).json({ error: 'Failed to fetch pending articles' });
  }
});

// PATCH approve article (admin only)
router.patch('/:id/approve', isAuthenticated, async (req, res) => {
  try {
    // Security: Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    ).select('-__v');

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article approved', article });
  } catch (error) {
    console.error('Error approving article:', error.message);
    res.status(500).json({ error: 'Failed to approve article' });
  }
});

// PATCH toggle featured (admin only)
router.patch('/:id/feature', isAuthenticated, async (req, res) => {
  try {
    // Security: Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    article.featured = !article.featured;
    await article.save();

    res.json({ message: 'Article featured status updated', article });
  } catch (error) {
    console.error('Error updating article feature status:', error.message);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// DELETE article (admin only)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    // Security: Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }

    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted' });
  } catch (error) {
    console.error('Error deleting article:', error.message);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

module.exports = router;
