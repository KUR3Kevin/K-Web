const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true
  },
  sourceUrl: {
    type: String,
    required: true,
    unique: true
  },
  sourceName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['AI', 'Software', 'Hardware', 'Crypto/Stocks', 'General'],
    default: 'General'
  },
  publishedDate: {
    type: Date,
    required: true
  },
  fetchedDate: {
    type: Date,
    default: Date.now
  },
  approved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
articleSchema.index({ approved: 1, publishedDate: -1 });
articleSchema.index({ sourceUrl: 1 });

module.exports = mongoose.model('Article', articleSchema);
