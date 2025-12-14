const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { isAuthenticated } = require('../middleware/auth');

// GET approved articles (public)
router.get('/', async (req, res) => {
  try {
    const { category, limit = 20, page = 1 } = req.query;

    const query = { approved: true };
    if (category && category !== 'All') {
      query.category = category;
    }

    const articles = await Article.find(query)
      .sort({ featured: -1, publishedDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET pending articles (admin only)
router.get('/pending', isAuthenticated, async (req, res) => {
  try {
    const articles = await Article.find({ approved: false })
      .sort({ fetchedDate: -1 })
      .limit(100);

    res.json({ articles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH approve article (admin only)
router.patch('/:id/approve', isAuthenticated, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article approved', article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH toggle featured (admin only)
router.patch('/:id/feature', isAuthenticated, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    article.featured = !article.featured;
    await article.save();

    res.json({ message: 'Article featured status updated', article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE article (admin only)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
