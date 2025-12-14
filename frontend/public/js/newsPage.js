// News Page JavaScript

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
    articlesGrid.innerHTML = '<div class="loading">Error loading articles. Please try again later.</div>';
  } finally {
    isLoading = false;
  }
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
