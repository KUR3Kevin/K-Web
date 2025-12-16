const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const BlogPost = require('../models/BlogPost');

// GET all approved articles (mobile optimized)
router.get('/articles', async (req, res) => {
  try {
    const { category, limit = 20, page = 1, featured } = req.query;

    const query = { approved: true };
    if (category && category !== 'All') {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }

    const articles = await Article.find(query)
      .select('title summary category sourceName sourceUrl imageUrl publishedDate featured')
      .sort({ featured: -1, publishedDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
          hasMore: parseInt(page) < Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET single article (mobile)
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .select('title summary category sourceName sourceUrl imageUrl publishedDate featured approved')
      .lean();

    if (!article || !article.approved) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    res.json({
      success: true,
      data: { article }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET featured article
router.get('/featured', async (req, res) => {
  try {
    const article = await Article.findOne({ approved: true, featured: true })
      .select('title summary category sourceName sourceUrl imageUrl publishedDate featured')
      .sort({ publishedDate: -1 })
      .lean();

    if (!article) {
      // If no featured article, return the most recent one
      const latestArticle = await Article.findOne({ approved: true })
        .select('title summary category sourceName sourceUrl imageUrl publishedDate featured')
        .sort({ publishedDate: -1 })
        .lean();

      return res.json({
        success: true,
        data: { article: latestArticle }
      });
    }

    res.json({
      success: true,
      data: { article }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET all published blog posts (mobile optimized)
router.get('/blog', async (req, res) => {
  try {
    const { category, limit = 10, page = 1 } = req.query;

    const query = { published: true };
    if (category && category !== 'All') {
      query.category = category;
    }

    const posts = await BlogPost.find(query)
      .select('title excerpt category author imageUrl publishedDate tags')
      .sort({ publishedDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
          hasMore: parseInt(page) < Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET single blog post (mobile)
router.get('/blog/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .select('title content excerpt category author imageUrl publishedDate tags')
      .lean();

    if (!post || !post.published) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET available categories
router.get('/categories', async (req, res) => {
  try {
    const articleCategories = await Article.distinct('category', { approved: true });
    const blogCategories = await BlogPost.distinct('category', { published: true });

    const allCategories = [...new Set([...articleCategories, ...blogCategories])];

    res.json({
      success: true,
      data: {
        categories: allCategories.sort()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET app stats (for mobile dashboard)
router.get('/stats', async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments({ approved: true });
    const totalBlogPosts = await BlogPost.countDocuments({ published: true });
    const categories = await Article.distinct('category', { approved: true });

    res.json({
      success: true,
      data: {
        totalArticles,
        totalBlogPosts,
        categories: categories.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search articles and blog posts
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20, page = 1 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const searchRegex = new RegExp(q, 'i');

    // Search articles
    const articles = await Article.find({
      approved: true,
      $or: [
        { title: searchRegex },
        { summary: searchRegex },
        { sourceName: searchRegex }
      ]
    })
    .select('title summary category sourceName sourceUrl imageUrl publishedDate')
    .sort({ publishedDate: -1 })
    .limit(parseInt(limit))
    .lean();

    // Search blog posts
    const blogPosts = await BlogPost.find({
      published: true,
      $or: [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { tags: searchRegex }
      ]
    })
    .select('title excerpt category author imageUrl publishedDate tags')
    .sort({ publishedDate: -1 })
    .limit(parseInt(limit))
    .lean();

    res.json({
      success: true,
      data: {
        articles,
        blogPosts,
        total: articles.length + blogPosts.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
