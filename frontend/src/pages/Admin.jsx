import { useState, useEffect } from 'react';
import { adminAPI, articlesAPI, blogAPI } from '../services/api';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard stats
  const [stats, setStats] = useState({
    totalArticles: 0,
    pendingArticles: 0,
    totalBlogPosts: 0,
    draftBlogPosts: 0,
  });

  // Pending articles
  const [pendingArticles, setPendingArticles] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Opinion',
    imageUrl: '',
    tags: '',
    published: true,
  });
  const [editingPostId, setEditingPostId] = useState(null);
  const [blogFormMessage, setBlogFormMessage] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  const checkAuthStatus = async () => {
    try {
      await adminAPI.status();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      await adminAPI.login({ username, password });
      setIsAuthenticated(true);
      setPassword('');
    } catch (error) {
      setLoginError(error.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await adminAPI.logout();
      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const dashboardData = await adminAPI.dashboard();
      setStats(dashboardData);

      if (activeTab === 'pending') {
        const articlesData = await articlesAPI.getPending();
        setPendingArticles(articlesData.articles || []);
      } else if (activeTab === 'blog') {
        const blogData = await blogAPI.getAll();
        setBlogPosts(blogData.blogPosts || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleApproveArticle = async (id) => {
    try {
      await articlesAPI.approve(id);
      setPendingArticles(prev => prev.filter(a => a._id !== id));
      loadDashboardData();
    } catch (error) {
      console.error('Error approving article:', error);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await articlesAPI.delete(id);
      setPendingArticles(prev => prev.filter(a => a._id !== id));
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleFetchNews = async () => {
    try {
      await adminAPI.fetchNews();
      alert('News fetch triggered successfully!');
      loadDashboardData();
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to fetch news');
    }
  };

  const handleBlogFormChange = (e) => {
    const { name, value } = e.target;
    setBlogForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setBlogFormMessage('');

    try {
      const blogData = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(t => t.trim()).filter(t => t),
        published: true,
      };

      if (editingPostId) {
        await blogAPI.update(editingPostId, blogData);
        setBlogFormMessage('Blog post updated successfully!');
      } else {
        await blogAPI.create(blogData);
        setBlogFormMessage('Blog post published successfully!');
      }

      // Reset form
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        category: 'Opinion',
        imageUrl: '',
        tags: '',
        published: true,
      });
      setEditingPostId(null);
      loadDashboardData();
    } catch (error) {
      setBlogFormMessage('Error: ' + (error.message || 'Failed to save blog post'));
    }
  };

  const handleSaveDraft = async () => {
    setBlogFormMessage('');

    try {
      const blogData = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(t => t.trim()).filter(t => t),
        published: false,
      };

      await blogAPI.create(blogData);
      setBlogFormMessage('Draft saved successfully!');

      // Reset form
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        category: 'Opinion',
        imageUrl: '',
        tags: '',
        published: true,
      });
      loadDashboardData();
    } catch (error) {
      setBlogFormMessage('Error: ' + (error.message || 'Failed to save draft'));
    }
  };

  const handleEditBlogPost = (post) => {
    setBlogForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl || '',
      tags: post.tags ? post.tags.join(', ') : '',
      published: post.published,
    });
    setEditingPostId(post._id);
    setActiveTab('create-blog');
  };

  const handleDeleteBlogPost = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await blogAPI.delete(id);
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
            {loginError && <div className="error-message">{loginError}</div>}
          </form>
          <a href="/" className="back-link">← Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-body">
      <div className="dashboard-container">
        <header className="admin-header">
          <div className="container">
            <div className="admin-header-content">
              <h1>Admin Dashboard</h1>
              <div className="admin-nav">
                <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View Site</a>
                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Approved Articles</h3>
                <p className="stat-number">{stats.totalArticles}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Articles</h3>
                <p className="stat-number">{stats.pendingArticles}</p>
              </div>
              <div className="stat-card">
                <h3>Published Blog Posts</h3>
                <p className="stat-number">{stats.totalBlogPosts}</p>
              </div>
              <div className="stat-card">
                <h3>Draft Posts</h3>
                <p className="stat-number">{stats.draftBlogPosts}</p>
              </div>
            </div>

            <div className="admin-tabs">
              <button
                className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Articles
              </button>
              <button
                className={`tab-btn ${activeTab === 'blog' ? 'active' : ''}`}
                onClick={() => setActiveTab('blog')}
              >
                Blog Posts
              </button>
              <button
                className={`tab-btn ${activeTab === 'create-blog' ? 'active' : ''}`}
                onClick={() => setActiveTab('create-blog')}
              >
                Create Post
              </button>
              <button
                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
            </div>

            {activeTab === 'pending' && (
              <div className="tab-content active">
                <div className="tab-header">
                  <h2>Pending Articles</h2>
                  <button onClick={handleFetchNews} className="btn btn-primary">Fetch New Articles</button>
                </div>
                <div className="admin-articles-list">
                  {pendingArticles.length === 0 ? (
                    <p>No pending articles</p>
                  ) : (
                    pendingArticles.map((article) => (
                      <div key={article._id} className="admin-article-card">
                        <h4>{article.title}</h4>
                        <p>{article.summary}</p>
                        <div className="article-meta">
                          <span>{article.sourceName}</span>
                          <span>{article.category}</span>
                        </div>
                        <div className="article-actions">
                          <button onClick={() => handleApproveArticle(article._id)} className="btn btn-primary">
                            Approve
                          </button>
                          <button onClick={() => handleDeleteArticle(article._id)} className="btn btn-outline">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="tab-content active">
                <div className="tab-header">
                  <h2>Your Blog Posts</h2>
                </div>
                <div className="admin-blog-list">
                  {blogPosts.length === 0 ? (
                    <p>No blog posts yet</p>
                  ) : (
                    blogPosts.map((post) => (
                      <div key={post._id} className="admin-blog-card">
                        <h4>{post.title}</h4>
                        <p>{post.excerpt}</p>
                        <div className="blog-meta">
                          <span>{post.category}</span>
                          <span>{post.published ? 'Published' : 'Draft'}</span>
                        </div>
                        <div className="blog-actions">
                          <button onClick={() => handleEditBlogPost(post)} className="btn btn-secondary">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteBlogPost(post._id)} className="btn btn-outline">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'create-blog' && (
              <div className="tab-content active">
                <div className="tab-header">
                  <h2>{editingPostId ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
                </div>
                <form onSubmit={handleBlogSubmit} className="blog-form">
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={blogForm.title}
                      onChange={handleBlogFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="excerpt">Excerpt (brief summary) *</label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      rows="3"
                      maxLength="300"
                      value={blogForm.excerpt}
                      onChange={handleBlogFormChange}
                      required
                    />
                    <small>Max 300 characters</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="content">Content *</label>
                    <textarea
                      id="content"
                      name="content"
                      rows="15"
                      value={blogForm.content}
                      onChange={handleBlogFormChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select
                        id="category"
                        name="category"
                        value={blogForm.category}
                        onChange={handleBlogFormChange}
                      >
                        <option value="Opinion">Opinion</option>
                        <option value="AI">AI</option>
                        <option value="Software">Software</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Tutorial">Tutorial</option>
                        <option value="Review">Review</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="imageUrl">Image URL (optional)</label>
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={blogForm.imageUrl}
                        onChange={handleBlogFormChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="tags">Tags (comma-separated)</label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="ai, chatgpt, opinion"
                      value={blogForm.tags}
                      onChange={handleBlogFormChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {editingPostId ? 'Update Post' : 'Publish Post'}
                    </button>
                    <button type="button" onClick={handleSaveDraft} className="btn btn-secondary">
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBlogForm({
                          title: '',
                          excerpt: '',
                          content: '',
                          category: 'Opinion',
                          imageUrl: '',
                          tags: '',
                          published: true,
                        });
                        setEditingPostId(null);
                        setBlogFormMessage('');
                      }}
                      className="btn btn-outline"
                    >
                      Clear Form
                    </button>
                  </div>
                  {blogFormMessage && <div className="form-message">{blogFormMessage}</div>}
                </form>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="tab-content active">
                <div className="tab-header">
                  <h2>Settings</h2>
                </div>
                <div className="settings-content">
                  <h3>News Fetching</h3>
                  <p>Articles are automatically fetched every 2 hours from trusted tech sources.</p>
                  <p>You can manually trigger a fetch using the "Fetch New Articles" button above.</p>

                  <h3>Database</h3>
                  <p>Make sure your MongoDB connection is configured in the backend <code>.env</code> file.</p>

                  <h3>Security</h3>
                  <p>This admin panel is protected with secure session-based authentication using HTTP-only cookies.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Admin;
