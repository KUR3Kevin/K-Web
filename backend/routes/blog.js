const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const BlogPost = require('../models/BlogPost');
const { isAuthenticated } = require('../middleware/auth');

// Setup DOMPurify for server-side HTML sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// GET all published blog posts (public)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    // Security: Validate and sanitize inputs
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
    const safePage = Math.max(parseInt(page) || 1, 1);

    const posts = await BlogPost.find({ published: true })
      .sort({ publishedDate: -1 })
      .limit(safeLimit)
      .skip((safePage - 1) * safeLimit)
      .select('-__v');

    const total = await BlogPost.countDocuments({ published: true });

    res.json({
      posts,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET single blog post (public)
router.get('/:id', async (req, res) => {
  try {
    // Security: Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid blog post ID' });
    }

    const post = await BlogPost.findById(req.params.id).select('-__v');

    if (!post || !post.published) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error.message);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// GET all blog posts including drafts (admin only)
router.get('/admin/all', isAuthenticated, async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({ posts });
  } catch (error) {
    console.error('Error fetching all blog posts:', error.message);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// POST create blog post (admin only)
router.post('/', isAuthenticated, [
  // Security: Input validation
  body('title').trim().isLength({ min: 1, max: 200 }).escape(),
  body('content').isLength({ min: 1, max: 50000 }),
  body('excerpt').optional().trim().isLength({ max: 500 }).escape(),
  body('category').trim().isLength({ max: 50 }).escape(),
  body('tags').optional().isArray({ max: 10 }),
  body('tags.*').optional().trim().isLength({ max: 30 }).escape(),
  body('imageUrl').optional().trim().isURL({ require_protocol: true }),
  body('published').optional().isBoolean()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, category, tags, imageUrl, published } = req.body;

    // Security: Sanitize HTML content to prevent XSS
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote'],
      ALLOWED_ATTR: ['href', 'target']
    });

    const post = new BlogPost({
      title,
      content: sanitizedContent,
      excerpt,
      category,
      tags: tags || [],
      imageUrl,
      published: published !== undefined ? published : true,
      author: req.session.username || 'Admin'
    });

    await post.save();

    res.status(201).json({ message: 'Blog post created', post });
  } catch (error) {
    console.error('Error creating blog post:', error.message);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// PATCH update blog post (admin only)
router.patch('/:id', isAuthenticated, async (req, res) => {
  try {
    // Security: Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid blog post ID' });
    }

    // Security: Only allow specific fields to be updated
    const allowedFields = ['title', 'content', 'excerpt', 'category', 'tags', 'imageUrl', 'published'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'content') {
          // Security: Sanitize content
          updates[field] = DOMPurify.sanitize(req.body[field], {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote'],
            ALLOWED_ATTR: ['href', 'target']
          });
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post updated', post });
  } catch (error) {
    console.error('Error updating blog post:', error.message);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// DELETE blog post (admin only)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    // Security: Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid blog post ID' });
    }

    const post = await BlogPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    console.error('Error deleting blog post:', error.message);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

module.exports = router;
