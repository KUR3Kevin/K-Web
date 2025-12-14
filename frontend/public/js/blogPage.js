// Blog Page JavaScript

let currentPage = 1;
let isLoading = false;

// Fetch and display blog posts
async function fetchBlogPosts(page = 1, append = false) {
  if (isLoading) return;

  isLoading = true;
  const blogGrid = document.getElementById('blog-grid');
  const loadMoreContainer = document.getElementById('load-more-container');

  if (!append) {
    blogGrid.innerHTML = '<div class="loading">Loading blog posts...</div>';
  }

  try {
    const response = await fetch(`/api/blog?page=${page}&limit=10`);

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const data = await response.json();

    if (!append) {
      blogGrid.innerHTML = '';
    } else {
      const loadingIndicator = blogGrid.querySelector('.loading');
      if (loadingIndicator) loadingIndicator.remove();
    }

    if (data.posts.length === 0 && page === 1) {
      blogGrid.innerHTML = '<div class="loading">No blog posts yet. Check back soon!</div>';
      loadMoreContainer.style.display = 'none';
      return;
    }

    data.posts.forEach(post => {
      blogGrid.appendChild(createBlogCard(post));
    });

    // Handle pagination
    if (data.pagination && data.pagination.page < data.pagination.pages) {
      loadMoreContainer.style.display = 'block';
    } else {
      loadMoreContainer.style.display = 'none';
    }

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    blogGrid.innerHTML = '<div class="loading">Error loading blog posts. Please try again later.</div>';
  } finally {
    isLoading = false;
  }
}

// Create blog card
function createBlogCard(post) {
  const card = document.createElement('div');
  card.className = 'blog-card';

  const imageHtml = post.imageUrl
    ? `<img src="${post.imageUrl}" alt="${post.title}" onerror="this.style.display='none'">`
    : '';

  card.innerHTML = `
    ${imageHtml}
    <div class="blog-card-content">
      <span class="category-badge ${post.category}">${post.category}</span>
      <h3 class="blog-title">${post.title}</h3>
      <p class="blog-excerpt">${post.excerpt}</p>
      <div class="blog-meta">
        <span class="author">${post.author}</span>
        <span class="date">${formatRelativeTime(post.publishedDate)}</span>
      </div>
      <a href="#" class="read-more" data-post-id="${post._id}">Read Full Post</a>
    </div>
  `;

  // Add click event to read more link
  const readMoreLink = card.querySelector('.read-more');
  readMoreLink.addEventListener('click', (e) => {
    e.preventDefault();
    showBlogPost(post._id);
  });

  return card;
}

// Show full blog post in modal
async function showBlogPost(postId) {
  try {
    const response = await fetch(`/api/blog/${postId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    const data = await response.json();
    const post = data.post;

    const modal = document.getElementById('blog-post-modal');
    const content = document.getElementById('blog-post-content');

    const imageHtml = post.imageUrl
      ? `<img src="${post.imageUrl}" alt="${post.title}">`
      : '';

    const tagsHtml = post.tags && post.tags.length > 0
      ? `<p><strong>Tags:</strong> ${post.tags.join(', ')}</p>`
      : '';

    content.innerHTML = `
      ${imageHtml}
      <span class="category-badge ${post.category}">${post.category}</span>
      <h2>${post.title}</h2>
      <div class="blog-meta" style="border-top: none; padding-top: 0;">
        <span class="author">${post.author}</span>
        <span class="date">${formatRelativeTime(post.publishedDate)}</span>
      </div>
      <div class="blog-content">
        ${formatBlogContent(post.content)}
      </div>
      ${tagsHtml}
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

  } catch (error) {
    console.error('Error fetching blog post:', error);
    alert('Error loading blog post. Please try again.');
  }
}

// Format blog content (convert line breaks to paragraphs)
function formatBlogContent(content) {
  // Simple formatting: convert double line breaks to paragraphs
  return content
    .split('\n\n')
    .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

// Format relative time
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initial load
  fetchBlogPosts(currentPage);

  // Load more button
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      fetchBlogPosts(currentPage, true);
    });
  }

  // Close modal
  const closeModalBtn = document.getElementById('close-modal');
  const modal = document.getElementById('blog-post-modal');

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // Close modal when clicking outside content
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
});
