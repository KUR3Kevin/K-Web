const mongoose = require('mongoose');

const blogSuggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true,
    maxlength: 500
  },
  suggestedContent: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['AI', 'Software', 'Hardware', 'Opinion', 'Tutorial', 'Review', 'Crypto/Stocks'],
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
  sourceInspiration: {
    type: String,
    default: ''
  },
  approved: {
    type: Boolean,
    default: false
  },
  rejected: {
    type: Boolean,
    default: false
  },
  createdFromSuggestion: {
    type: Boolean,
    default: false
  },
  relatedBlogPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
    default: null
  },
  fetchedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
blogSuggestionSchema.index({ approved: 1, createdAt: -1 });
blogSuggestionSchema.index({ rejected: 1 });

module.exports = mongoose.model('BlogSuggestion', blogSuggestionSchema);