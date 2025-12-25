const express = require('express');
const router = express.Router();
const BlogSuggestion = require('../models/BlogSuggestion');
const BlogPost = require('../models/BlogPost');
const { isAuthenticated } = require('../middleware/auth');
const { generateBlogSuggestions, getPendingSuggestions, approveSuggestion, rejectSuggestion } = require('../services/blogSuggestor');

// GET pending blog suggestions (admin only)
router.get('/pending', isAuthenticated, async (req, res) => {
  try {
    const suggestions = await getPendingSuggestions();
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all blog suggestions (admin only)
router.get('/all', isAuthenticated, async (req, res) => {
  try {
    const suggestions = await BlogSuggestion.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST generate new blog suggestions (admin only)
router.post('/generate', isAuthenticated, async (req, res) => {
  try {
    const count = await generateBlogSuggestions();
    res.json({
      message: `Generated ${count} new blog suggestions`,
      count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH approve blog suggestion (admin only)
router.patch('/:id/approve', isAuthenticated, async (req, res) => {
  try {
    const suggestion = await approveSuggestion(req.params.id);

    if (!suggestion) {
      return res.status(404).json({ error: 'Blog suggestion not found' });
    }

    res.json({
      message: 'Blog suggestion approved',
      suggestion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH reject blog suggestion (admin only)
router.patch('/:id/reject', isAuthenticated, async (req, res) => {
  try {
    const suggestion = await rejectSuggestion(req.params.id);

    if (!suggestion) {
      return res.status(404).json({ error: 'Blog suggestion not found' });
    }

    res.json({
      message: 'Blog suggestion rejected',
      suggestion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create blog post from suggestion (admin only)
router.post('/:id/create-post', isAuthenticated, async (req, res) => {
  try {
    const suggestion = await BlogSuggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({ error: 'Blog suggestion not found' });
    }

    if (!suggestion.approved) {
      return res.status(400).json({ error: 'Blog suggestion must be approved first' });
    }

    // Create blog post from suggestion
    const blogPost = new BlogPost({
      title: suggestion.title,
      content: suggestion.suggestedContent,
      excerpt: suggestion.summary,
      category: suggestion.category,
      tags: suggestion.tags || [],
      imageUrl: suggestion.imageUrl || '',
      published: true,
      author: 'Admin'
    });

    await blogPost.save();

    // Mark suggestion as used
    suggestion.createdFromSuggestion = true;
    suggestion.relatedBlogPostId = blogPost._id;
    await suggestion.save();

    res.status(201).json({
      message: 'Blog post created from suggestion',
      blogPost,
      suggestion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE blog suggestion (admin only)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const suggestion = await BlogSuggestion.findByIdAndDelete(req.params.id);

    if (!suggestion) {
      return res.status(404).json({ error: 'Blog suggestion not found' });
    }

    res.json({ message: 'Blog suggestion deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET stats for dashboard
router.get('/stats', isAuthenticated, async (req, res) => {
  try {
    const pendingCount = await BlogSuggestion.countDocuments({
      approved: false,
      rejected: false
    });

    const approvedCount = await BlogSuggestion.countDocuments({
      approved: true
    });

    const rejectedCount = await BlogSuggestion.countDocuments({
      rejected: true
    });

    const createdPostsCount = await BlogSuggestion.countDocuments({
      createdFromSuggestion: true
    });

    res.json({
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      createdPosts: createdPostsCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;