// Simple version without MongoDB - just to see the website working
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.get('/news', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/pages/news.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/pages/blog.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/pages/about.html'));
});

// Mock API endpoints so pages don't error
app.get('/api/articles', (req, res) => {
  res.json({ articles: [], pagination: { page: 1, total: 0, pages: 0 } });
});

app.get('/api/blog', (req, res) => {
  res.json({ posts: [], pagination: { page: 1, total: 0, pages: 0 } });
});

// Start server
app.listen(PORT, () => {
  console.log('=======================================');
  console.log('✓ Server running successfully!');
  console.log('=======================================');
  console.log(`Open your browser to: http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
  console.log('=======================================');
});
