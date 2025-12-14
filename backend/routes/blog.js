const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { isAuthenticated } = require('../middleware/auth');

// GET all published blog posts (public)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const posts = await BlogPost.find({ published: true })
      .sort({ publishedDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await BlogPost.countDocuments({ published: true });

    res.json({
      posts,
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

// GET single blog post (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post || !post.published) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all blog posts including drafts (admin only)
router.get('/admin/all', isAuthenticated, async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create blog post (admin only)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, imageUrl, published } = req.body;

    const post = new BlogPost({
      title,
      content,
      excerpt,
      category,
      tags: tags || [],
      imageUrl,
      published: published !== undefined ? published : true,
      author: 'Admin' // You can customize this later
    });

    await post.save();

    res.status(201).json({ message: 'Blog post created', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update blog post (admin only)
router.patch('/:id', isAuthenticated, async (req, res) => {
  try {
    const updates = req.body;

    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post updated', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE blog post (admin only)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
