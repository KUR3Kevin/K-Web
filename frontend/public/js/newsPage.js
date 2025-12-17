// News Page JavaScript

// Demo articles for when API is not available
const demoArticles = [
  {
    _id: 'demo-article-1',
    title: 'Apple Vision Pro Gets Major Update: Spatial Computing Revolution Continues',
    summary: 'Apple releases visionOS 2.0 with enhanced productivity features and improved hand tracking. The update focuses on making spatial computing more accessible for everyday users while maintaining privacy standards.',
    category: 'Hardware',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    publishedDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    imageUrl: null,
    featured: true
  },
  {
    _id: 'demo-article-2',
    title: 'Open Source AI Models Gain Momentum: Hugging Face Reports 50% Growth',
    summary: 'Community-driven AI development shows strong growth as developers seek alternatives to proprietary models. Focus on transparency and collaborative improvement drives adoption.',
    category: 'AI',
    sourceName: 'Ars Technica',
    sourceUrl: 'https://arstechnica.com',
    publishedDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    imageUrl: null
  },
  {
    _id: 'demo-article-3',
    title: 'Signal Introduces New Privacy Features: Quantum-Resistant Encryption',
    summary: 'Messaging app Signal implements post-quantum cryptography to protect against future threats. The update reinforces the platform\'s commitment to user privacy and digital rights.',
    category: 'Software',
    sourceName: 'Wired',
    sourceUrl: 'https://wired.com',
    publishedDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    imageUrl: null
  },
  {
    _id: 'demo-article-4',
    title: 'Framework Laptop Announces Modular Graphics Card System',
    summary: 'Sustainable laptop manufacturer introduces swappable GPU modules, extending device lifespan and reducing e-waste. The innovation supports right-to-repair principles.',
    category: 'Hardware',
    sourceName: 'The Verge',
    sourceUrl: 'https://theverge.com',
    publishedDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    imageUrl: null
  },
  {
    _id: 'demo-article-5',
    title: 'Mozilla Firefox Focus on Privacy: Enhanced Tracking Protection Released',
    summary: 'Firefox introduces stricter default privacy settings and improved anti-tracking technology. The browser continues its mission to provide a privacy-first web experience.',
    category: 'Software',
    sourceName: 'Mozilla Blog',
    sourceUrl: 'https://blog.mozilla.org',
    publishedDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    imageUrl: null
  },
  {
    _id: 'demo-article-6',
    title: 'EU Digital Rights Act Passes: New Standards for Tech Companies',
    summary: 'European Union establishes comprehensive digital rights framework requiring tech companies to prioritize user privacy and ethical AI development.',
    category: 'Opinion',
    sourceName: 'European Commission',
    sourceUrl: 'https://ec.europa.eu',
    publishedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    imageUrl: null
  },
  {
    _id: 'demo-article-7',
    title: 'DuckDuckGo Email Protection Reaches 10 Million Users',
    summary: 'Privacy-focused search engine\'s email protection service gains widespread adoption. Users value tracker blocking and email forwarding without data collection.',
    category: 'Software',
    sourceName: 'DuckDuckGo Blog',
    sourceUrl: 'https://duckduckgo.com/blog',
    publishedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    imageUrl: null
  },
  {
    _id: 'demo-article-8',
    title: 'Ethical AI Research Consortium Publishes New Guidelines',
    summary: 'Leading researchers release comprehensive guidelines for responsible AI development. The framework emphasizes human-centered design and transparency in algorithmic decision-making.',
    category: 'AI',
    sourceName: 'MIT Technology Review',
    sourceUrl: 'https://technologyreview.com',
    publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    imageUrl: null
  },
  {
    _id: 'demo-article-9',
    title: 'Fairphone Releases Sustainable Smartphone with 8-Year Support Promise',
    summary: 'Dutch company Fairphone announces new device designed for longevity and repairability. The phone features modular components and ethically sourced materials.',
    category: 'Hardware',
    sourceName: 'Fairphone Blog',
    sourceUrl: 'https://fairphone.com/blog',
    publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    imageUrl: null
  },
  {
    _id: 'demo-article-10',
    title: 'Decentralized Social Networks See 200% User Growth',
    summary: 'Alternative social platforms built on open protocols gain traction as users seek more control over their data and digital communities.',
    category: 'Software',
    sourceName: 'Mastodon Blog',
    sourceUrl: 'https://blog.joinmastodon.org',
    publishedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    imageUrl: null
  }
];

let currentPage = 1;
let currentCategory = 'All';
let isLoading = false;

// Fetch and display articles
async function fetchArticles(category = 'All', page = 1, append = false) {
  if (isLoading) return;

  isLoading = true;
  const articlesGrid = document.getElementById('articles-grid');
  const loadMoreContainer = document.getElementById('load-more-container');

  if (!append) {
    articlesGrid.innerHTML = '<div class="loading">Loading articles...</div>';
  }

  try {
    const categoryParam = category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
    const response = await fetch(`/api/articles?page=${page}&limit=20${categoryParam}`);

    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }

    const data = await response.json();

    if (!append) {
      articlesGrid.innerHTML = '';
    } else {
      // Remove loading indicator if it exists
      const loadingIndicator = articlesGrid.querySelector('.loading');
      if (loadingIndicator) loadingIndicator.remove();
    }

    if (data.articles.length === 0 && page === 1) {
      articlesGrid.innerHTML = '<div class="loading">No articles found. Check back soon!</div>';
      loadMoreContainer.style.display = 'none';
      return;
    }

    // Display featured article (first one on first page)
    if (page === 1 && data.articles.length > 0) {
      const featured = data.articles.find(article => article.featured) || data.articles[0];
      displayFeaturedArticle(featured);

      // Remove featured from regular grid
      const articlesToDisplay = data.articles.filter(a => a._id !== featured._id);
      articlesToDisplay.forEach(article => {
        articlesGrid.appendChild(createArticleCard(article));
      });
    } else {
      data.articles.forEach(article => {
        articlesGrid.appendChild(createArticleCard(article));
      });
    }

    // Handle pagination
    if (data.pagination && data.pagination.page < data.pagination.pages) {
      loadMoreContainer.style.display = 'block';
    } else {
      loadMoreContainer.style.display = 'none';
    }

  } catch (error) {
    console.error('Error fetching articles:', error);
    // Load demo articles when API is not available
    loadDemoArticles(category);
  } finally {
    isLoading = false;
  }
}

// Load demo articles when API is not available
function loadDemoArticles(category = 'All') {
  const articlesGrid = document.getElementById('articles-grid');
  const loadMoreContainer = document.getElementById('load-more-container');

  articlesGrid.innerHTML = '';

  // Filter articles by category
  let filteredArticles = category === 'All'
    ? demoArticles
    : demoArticles.filter(article => article.category === category);

  if (filteredArticles.length === 0) {
    articlesGrid.innerHTML = '<div class="loading">No articles found for this category.</div>';
    loadMoreContainer.style.display = 'none';
    return;
  }

  // Display featured article if on "All" category
  if (category === 'All') {
    const featured = filteredArticles.find(article => article.featured) || filteredArticles[0];
    displayFeaturedArticle(featured);

    // Remove featured from regular grid
    filteredArticles = filteredArticles.filter(a => a._id !== featured._id);
  }

  // Add remaining articles to grid
  filteredArticles.forEach(article => {
    articlesGrid.appendChild(createArticleCard(article));
  });

  // Hide load more button for demo articles
  loadMoreContainer.style.display = 'none';
  isLoading = false;
}

// Display featured article
function displayFeaturedArticle(article) {
  const featuredContainer = document.getElementById('featured-article');

  const imageHtml = article.imageUrl
    ? `<img src="${article.imageUrl}" alt="${article.title}" onerror="this.style.display='none'">`
    : '';

  featuredContainer.innerHTML = `
    ${imageHtml}
    <div class="featured-article-content">
      <span class="category-badge ${article.category.replace('/', '')}">${article.category}</span>
      <h3>${article.title}</h3>
      <p>${truncateText(article.summary, 200)}</p>
      <div class="article-meta">
        <span class="source">${article.sourceName}</span>
        <span class="date">${formatRelativeTime(article.publishedDate)}</span>
      </div>
      <a href="${article.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Read Full Article</a>
    </div>
  `;

  featuredContainer.classList.add('visible');
}

// Create article card
function createArticleCard(article) {
  const card = document.createElement('div');
  card.className = 'article-card';

  const imageHtml = article.imageUrl
    ? `<img src="${article.imageUrl}" alt="${article.title}" onerror="this.style.display='none'">`
    : '';

  card.innerHTML = `
    ${imageHtml}
    <div class="article-card-content">
      <span class="category-badge ${article.category.replace('/', '')}">${article.category}</span>
      <h3 class="article-title">${article.title}</h3>
      <p class="article-summary">${truncateText(article.summary, 150)}</p>
      <div class="article-meta">
        <span class="source">${article.sourceName}</span>
        <span class="date">${formatRelativeTime(article.publishedDate)}</span>
      </div>
      <a href="${article.sourceUrl}" target="_blank" rel="noopener noreferrer" class="read-more">Read More</a>
    </div>
  `;

  return card;
}

// Format relative time (same as main.js but included here for independence)
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  const months = Math.floor(diffInSeconds / 2592000);
  return `${months} month${months !== 1 ? 's' : ''} ago`;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initial load
  fetchArticles(currentCategory, currentPage);

  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update category and reset page
      currentCategory = btn.dataset.category;
      currentPage = 1;

      // Hide featured article when filtering
      if (currentCategory !== 'All') {
        document.getElementById('featured-article').classList.remove('visible');
      }

      // Fetch filtered articles
      fetchArticles(currentCategory, currentPage);
    });
  });

  // Load more button
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      fetchArticles(currentCategory, currentPage, true);
    });
  }
});
