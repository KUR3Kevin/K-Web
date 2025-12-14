const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  author: {
    type: String,
    default: 'Admin'
  },
  category: {
    type: String,
    enum: ['AI', 'Software', 'Hardware', 'Opinion', 'Tutorial', 'Review'],
    default: 'Opinion'
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  published: {
    type: Boolean,
    default: true
  },
  publishedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
blogPostSchema.index({ published: 1, publishedDate: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
