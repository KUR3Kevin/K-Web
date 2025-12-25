import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { articlesAPI } from '../services/api';

function News() {
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const categories = ['All', 'AI', 'Software', 'Hardware', 'Crypto/Stocks'];

  useEffect(() => {
    fetchArticles();
  }, [currentCategory, currentPage]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await articlesAPI.getAll();

      // Filter by category
      let filteredArticles = currentCategory === 'All'
        ? data.articles
        : data.articles.filter(a => a.category === currentCategory);

      // Set featured article (first one or marked as featured)
      if (currentPage === 1 && filteredArticles.length > 0) {
        const featured = filteredArticles.find(a => a.featured) || filteredArticles[0];
        setFeaturedArticle(featured);
        filteredArticles = filteredArticles.filter(a => a._id !== featured._id);
      }

      setArticles(filteredArticles);
      setHasMore(data.pagination && data.pagination.page < data.pagination.pages);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setCurrentPage(1);
    setFeaturedArticle(currentCategory === 'All' ? null : featuredArticle);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const formatRelativeTime = (dateString) => {
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
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div>
      <Header />

      <main className="news-page">
        <div className="container">
          <div className="page-header">
            <h2>Latest Tech News</h2>
            <p>Curated articles from trusted tech sources</p>
          </div>

          <div className="filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${currentCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {featuredArticle && currentCategory === 'All' && (
            <div className="featured-article visible">
              {featuredArticle.imageUrl && (
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="featured-article-content">
                <span className={`category-badge ${featuredArticle.category.replace('/', '')}`}>
                  {featuredArticle.category}
                </span>
                <h3>{featuredArticle.title}</h3>
                <p>{truncateText(featuredArticle.summary, 200)}</p>
                <div className="article-meta">
                  <span className="source">{featuredArticle.sourceName}</span>
                  <span className="date">{formatRelativeTime(featuredArticle.publishedDate)}</span>
                </div>
                <a
                  href={featuredArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Read Full Article
                </a>
              </div>
            </div>
          )}

          <div className="articles-grid">
            {loading && articles.length === 0 ? (
              <div className="loading">Loading articles...</div>
            ) : articles.length === 0 ? (
              <div className="loading">No articles found. Check back soon!</div>
            ) : (
              articles.map((article) => (
                <div key={article._id} className="article-card">
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="article-card-content">
                    <span className={`category-badge ${article.category.replace('/', '')}`}>
                      {article.category}
                    </span>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-summary">{truncateText(article.summary, 150)}</p>
                    <div className="article-meta">
                      <span className="source">{article.sourceName}</span>
                      <span className="date">{formatRelativeTime(article.publishedDate)}</span>
                    </div>
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="read-more"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {hasMore && (
            <div className="load-more-container">
              <button
                className="btn btn-secondary"
                onClick={handleLoadMore}
                disabled={loading}
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default News;
