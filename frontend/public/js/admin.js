// Admin Dashboard JavaScript

let currentTab = 'pending';

// Check authentication status on load
async function checkAuth() {
  try {
    const response = await fetch('/api/admin/status', {
      credentials: 'include'
    });

    const data = await response.json();

    if (data.authenticated) {
      showDashboard();
      loadDashboardData();
    } else {
      showLogin();
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    showLogin();
  }
}

// Show login form
function showLogin() {
  document.getElementById('login-container').style.display = 'flex';
  document.getElementById('dashboard-container').style.display = 'none';
}

// Show dashboard
function showDashboard() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('dashboard-container').style.display = 'block';
}

// Handle login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('login-error');

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      showDashboard();
      loadDashboardData();
    } else {
      errorDiv.textContent = data.error || 'Login failed';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorDiv.textContent = 'Login failed. Please try again.';
  }
});

// Handle logout
document.getElementById('logout-btn')?.addEventListener('click', async () => {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include'
    });

    showLogin();
  } catch (error) {
    console.error('Logout error:', error);
  }
});

// Load dashboard data
async function loadDashboardData() {
  await loadStats();
  await loadPendingArticles();
  await loadBlogPosts();
}

// Load dashboard stats
async function loadStats() {
  try {
    const response = await fetch('/api/admin/dashboard', {
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      const stats = data.stats;

      document.getElementById('total-articles').textContent = stats.totalArticles || 0;
      document.getElementById('pending-articles').textContent = stats.pendingArticles || 0;
      document.getElementById('total-blog-posts').textContent = stats.totalBlogPosts || 0;
      document.getElementById('draft-blog-posts').textContent = stats.draftBlogPosts || 0;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Load pending articles
async function loadPendingArticles() {
  const container = document.getElementById('pending-articles-list');
  container.innerHTML = '<div class="loading">Loading pending articles...</div>';

  try {
    const response = await fetch('/api/articles/pending', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to load pending articles');
    }

    const data = await response.json();

    container.innerHTML = '';

    if (data.articles.length === 0) {
      container.innerHTML = '<div class="loading">No pending articles. Click "Fetch New Articles" to get more.</div>';
      return;
    }

    data.articles.forEach(article => {
      container.appendChild(createPendingArticleCard(article));
    });

  } catch (error) {
    console.error('Error loading pending articles:', error);
    container.innerHTML = '<div class="loading">Error loading pending articles.</div>';
  }
}

// Create pending article card
function createPendingArticleCard(article) {
  const card = document.createElement('div');
  card.className = 'admin-article-card';
  card.id = `article-${article._id}`;

  const imageHtml = article.imageUrl
    ? `<img src="${article.imageUrl}" alt="${article.title}" onerror="this.style.display='none'">`
    : '';

  card.innerHTML = `
    ${imageHtml}
    <div class="admin-article-content">
      <span class="category-badge ${article.category.replace('/', '')}">${article.category}</span>
      <h4>${article.title}</h4>
      <p>${article.summary.substring(0, 200)}...</p>
      <div class="article-meta">
        <span class="source">${article.sourceName}</span>
        <span class="date">${new Date(article.publishedDate).toLocaleDateString()}</span>
      </div>
      <a href="${article.sourceUrl}" target="_blank" rel="noopener noreferrer" class="read-more">View Source</a>
      <div class="admin-article-actions">
        <button class="btn-approve" onclick="approveArticle('${article._id}')">Approve</button>
        <button class="btn-reject" onclick="rejectArticle('${article._id}')">Reject</button>
      </div>
    </div>
  `;

  return card;
}

// Approve article
async function approveArticle(articleId) {
  try {
    const response = await fetch(`/api/articles/${articleId}/approve`, {
      method: 'PATCH',
      credentials: 'include'
    });

    if (response.ok) {
      document.getElementById(`article-${articleId}`).remove();
      await loadStats();

      // Check if no more pending articles
      const container = document.getElementById('pending-articles-list');
      if (container.children.length === 0) {
        container.innerHTML = '<div class="loading">No pending articles. Great job!</div>';
      }
    } else {
      alert('Failed to approve article');
    }
  } catch (error) {
    console.error('Error approving article:', error);
    alert('Error approving article');
  }
}

// Reject article
async function rejectArticle(articleId) {
  if (!confirm('Are you sure you want to reject this article?')) {
    return;
  }

  try {
    const response = await fetch(`/api/articles/${articleId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      document.getElementById(`article-${articleId}`).remove();
      await loadStats();

      // Check if no more pending articles
      const container = document.getElementById('pending-articles-list');
      if (container.children.length === 0) {
        container.innerHTML = '<div class="loading">No pending articles. Great job!</div>';
      }
    } else {
      alert('Failed to reject article');
    }
  } catch (error) {
    console.error('Error rejecting article:', error);
    alert('Error rejecting article');
  }
}

// Fetch new articles
document.getElementById('fetch-news-btn')?.addEventListener('click', async function() {
  this.disabled = true;
  this.textContent = 'Fetching...';

  try {
    const response = await fetch('/api/admin/fetch-news', {
      method: 'POST',
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      await loadPendingArticles();
      await loadStats();
    } else {
      alert('Failed to fetch news');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    alert('Error fetching news');
  } finally {
    this.disabled = false;
    this.textContent = 'Fetch New Articles';
  }
});

// Load blog posts
async function loadBlogPosts() {
  const container = document.getElementById('blog-posts-list');
  container.innerHTML = '<div class="loading">Loading blog posts...</div>';

  try {
    const response = await fetch('/api/blog/admin/all', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to load blog posts');
    }

    const data = await response.json();

    container.innerHTML = '';

    if (data.posts.length === 0) {
      container.innerHTML = '<div class="loading">No blog posts yet. Create one!</div>';
      return;
    }

    data.posts.forEach(post => {
      container.appendChild(createBlogPostCard(post));
    });

  } catch (error) {
    console.error('Error loading blog posts:', error);
    container.innerHTML = '<div class="loading">Error loading blog posts.</div>';
  }
}

// Create blog post card
function createBlogPostCard(post) {
  const card = document.createElement('div');
  card.className = 'admin-article-card';
  card.id = `blog-${post._id}`;

  const statusBadge = post.published
    ? '<span class="category-badge AI">Published</span>'
    : '<span class="category-badge General">Draft</span>';

  card.innerHTML = `
    <div class="admin-article-content" style="flex: 1;">
      ${statusBadge}
      <span class="category-badge ${post.category}">${post.category}</span>
      <h4>${post.title}</h4>
      <p>${post.excerpt}</p>
      <div class="article-meta">
        <span class="author">${post.author}</span>
        <span class="date">${new Date(post.publishedDate).toLocaleDateString()}</span>
      </div>
      <div class="admin-article-actions">
        <button class="btn-small btn-secondary" onclick="editBlogPost('${post._id}')">Edit</button>
        <button class="btn-small btn-reject" onclick="deleteBlogPost('${post._id}')">Delete</button>
      </div>
    </div>
  `;

  return card;
}

// Edit blog post
async function editBlogPost(postId) {
  try {
    const response = await fetch(`/api/blog/${postId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to load blog post');
    }

    const data = await response.json();
    const post = data.post;

    // Switch to create blog tab
    switchTab('create-blog');

    // Populate form
    document.getElementById('edit-post-id').value = post._id;
    document.getElementById('blog-title').value = post.title;
    document.getElementById('blog-excerpt').value = post.excerpt;
    document.getElementById('blog-content').value = post.content;
    if (quill) {
      quill.root.innerHTML = post.content;
    }
    document.getElementById('blog-category').value = post.category;
    document.getElementById('blog-image').value = post.imageUrl || '';
    document.getElementById('blog-tags').value = post.tags ? post.tags.join(', ') : '';

    // Change button text
    document.querySelector('#blog-post-form button[type="submit"]').textContent = 'Update Post';

  } catch (error) {
    console.error('Error loading blog post for edit:', error);
    alert('Error loading blog post');
  }
}

// Delete blog post
async function deleteBlogPost(postId) {
  if (!confirm('Are you sure you want to delete this blog post?')) {
    return;
  }

  try {
    const response = await fetch(`/api/blog/${postId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      document.getElementById(`blog-${postId}`).remove();
      await loadStats();
    } else {
      alert('Failed to delete blog post');
    }
  } catch (error) {
    console.error('Error deleting blog post:', error);
    alert('Error deleting blog post');
  }
}

// Handle blog post form submission
document.getElementById('blog-post-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const postId = document.getElementById('edit-post-id').value;
  const formData = {
    title: document.getElementById('blog-title').value,
    excerpt: document.getElementById('blog-excerpt').value,
    content: document.getElementById('blog-content').value,
    category: document.getElementById('blog-category').value,
    imageUrl: document.getElementById('blog-image').value,
    tags: document.getElementById('blog-tags').value.split(',').map(t => t.trim()).filter(t => t),
    published: true
  };

  const messageDiv = document.getElementById('blog-form-message');

  try {
    const url = postId ? `/api/blog/${postId}` : '/api/blog';
    const method = postId ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      messageDiv.className = 'form-message success';
      messageDiv.textContent = postId ? 'Blog post updated successfully!' : 'Blog post published successfully!';

      // Reset form
      setTimeout(() => {
        document.getElementById('blog-post-form').reset();
        document.getElementById('edit-post-id').value = '';
        if (quill) {
          quill.setContents([]);
        }
        messageDiv.textContent = '';
        document.querySelector('#blog-post-form button[type="submit"]').textContent = 'Publish Post';
      }, 2000);

      // Reload blog posts
      await loadBlogPosts();
      await loadStats();
    } else {
      const data = await response.json();
      messageDiv.className = 'form-message error';
      messageDiv.textContent = data.error || 'Failed to save blog post';
    }
  } catch (error) {
    console.error('Error saving blog post:', error);
    messageDiv.className = 'form-message error';
    messageDiv.textContent = 'Error saving blog post';
  }
});

// Save as draft
document.getElementById('save-draft-btn')?.addEventListener('click', async () => {
  const postId = document.getElementById('edit-post-id').value;
  const formData = {
    title: document.getElementById('blog-title').value,
    excerpt: document.getElementById('blog-excerpt').value,
    content: document.getElementById('blog-content').value,
    category: document.getElementById('blog-category').value,
    imageUrl: document.getElementById('blog-image').value,
    tags: document.getElementById('blog-tags').value.split(',').map(t => t.trim()).filter(t => t),
    published: false
  };

  const messageDiv = document.getElementById('blog-form-message');

  try {
    const url = postId ? `/api/blog/${postId}` : '/api/blog';
    const method = postId ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      messageDiv.className = 'form-message success';
      messageDiv.textContent = 'Draft saved successfully!';

      // Reset form
      setTimeout(() => {
        document.getElementById('blog-post-form').reset();
        document.getElementById('edit-post-id').value = '';
        if (quill) {
          quill.setContents([]);
        }
        messageDiv.textContent = '';
        document.querySelector('#blog-post-form button[type="submit"]').textContent = 'Publish Post';
      }, 2000);

      await loadBlogPosts();
      await loadStats();
    } else {
      messageDiv.className = 'form-message error';
      messageDiv.textContent = 'Failed to save draft';
    }
  } catch (error) {
    console.error('Error saving draft:', error);
    messageDiv.className = 'form-message error';
    messageDiv.textContent = 'Error saving draft';
  }
});

// Clear form
document.getElementById('clear-form-btn')?.addEventListener('click', () => {
  document.getElementById('blog-post-form').reset();
  document.getElementById('edit-post-id').value = '';
  if (quill) {
    quill.setContents([]);
  }
  document.getElementById('blog-form-message').textContent = '';
  document.querySelector('#blog-post-form button[type="submit"]').textContent = 'Publish Post';
});

// Tab switching
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    }
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  document.getElementById(`${tabName}-tab`).classList.add('active');
  currentTab = tabName;
}

// Tab button event listeners
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// Initialize Quill Rich Text Editor
let quill;

function initQuill() {
  if (document.getElementById('blog-content-editor')) {
    quill = new Quill('#blog-content-editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean']
        ]
      },
      placeholder: 'Write your blog post content here...'
    });

    // Sync Quill content with hidden textarea
    quill.on('text-change', function() {
      document.getElementById('blog-content').value = quill.root.innerHTML;
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  // Initialize Quill after DOM is loaded
  setTimeout(initQuill, 100);
});
