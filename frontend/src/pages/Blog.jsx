import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogAPI } from '../services/api';

function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const data = await blogAPI.getAll();
      setBlogPosts(data.blogPosts || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (postId) => {
    try {
      const post = await blogAPI.getById(postId);
      setSelectedPost(post);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div>
      <Header />

      <main className="blog-page">
        <div className="container">
          <div className="page-header">
            <h2>Personal Tech Blog</h2>
            <p>My thoughts, opinions, and insights on the tech world</p>
          </div>

          <div className="blog-grid">
            {loading ? (
              <div className="loading">Loading blog posts...</div>
            ) : blogPosts.length === 0 ? (
              <div className="loading">No blog posts yet. Check back soon!</div>
            ) : (
              blogPosts.map((post) => (
                <div
                  key={post._id}
                  className="blog-card"
                  onClick={() => handlePostClick(post._id)}
                  style={{ cursor: 'pointer' }}
                >
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="blog-card-content">
                    <span className={`category-badge ${post.category}`}>
                      {post.category}
                    </span>
                    <h3 className="blog-title">{post.title}</h3>
                    <p className="blog-excerpt">{truncateText(post.excerpt, 150)}</p>
                    <div className="blog-meta">
                      <span className="date">{formatDate(post.createdAt)}</span>
                      {post.tags && post.tags.length > 0 && (
                        <div className="tags">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Blog Post Modal with XSS Prevention */}
      {showModal && selectedPost && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content blog-post-full">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="blog-post-content">
              <h1>{selectedPost.title}</h1>
              <div className="blog-post-meta">
                <span className={`category-badge ${selectedPost.category}`}>
                  {selectedPost.category}
                </span>
                <span className="date">{formatDate(selectedPost.createdAt)}</span>
              </div>
              {selectedPost.imageUrl && (
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="blog-post-image"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="blog-post-body">
                {/* XSS Prevention: Use ReactMarkdown with rehype-sanitize */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                >
                  {selectedPost.content}
                </ReactMarkdown>
              </div>
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="blog-post-tags">
                  {selectedPost.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Blog;
