// Enhanced Main JavaScript with smooth animations and interactions

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
  // Enhanced smooth scrolling
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading animations to elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        entry.target.style.opacity = '1';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.feature-card, .article-card, .blog-card, .cta-section');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Add subtle parallax effect to hero section only
  window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.2;
      heroSection.style.transform = `translateY(${rate}px)`;
    }
  });
});

// Format date to relative time (e.g., "2 hours ago")
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

// Truncate text to specific length
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Show error message
function showError(message, containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<div class="error-message">${message}</div>`;
  }
}

// Enhanced donate button handler with glass effect
function setupDonateButton() {
  const donateBtn = document.getElementById('donateBtn');
  if (donateBtn) {
    donateBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Add click effect
      donateBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        donateBtn.style.transform = '';
      }, 150);

      // Open PayPal donation page
      const paypalUrl = 'https://www.paypal.com/donate/?business=marselk96johnsonjr@outlook.com&currency_code=USD';
      window.open(paypalUrl, '_blank');
    });
  }
}

// Enhanced page transitions
function addPageTransitions() {
  const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();

        // Add fade out effect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease-out';

        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });
}

// Article Modal System
function createArticleModal() {
  // Create modal HTML
  const modalHTML = `
    <div id="articleModal" class="modal">
      <div class="modal-content">
        <button class="modal-close" onclick="closeArticleModal()">&times;</button>
        <div class="modal-header">
          <h2 class="modal-title" id="modalTitle"></h2>
          <div class="modal-meta" id="modalMeta"></div>
        </div>
        <div class="modal-body" id="modalBody"></div>
        <div class="modal-footer">
          <a id="modalReadMore" href="#" target="_blank" class="btn btn-primary">Read Full Article</a>
          <button onclick="closeArticleModal()" class="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openArticleModal(title, summary, source, date, url) {
  const modal = document.getElementById('articleModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  const modalBody = document.getElementById('modalBody');
  const modalReadMore = document.getElementById('modalReadMore');

  // Populate modal content
  modalTitle.textContent = title;
  modalMeta.innerHTML = `<strong>Source:</strong> ${source} | <strong>Date:</strong> ${date}`;
  modalBody.innerHTML = `
    <p>${summary}</p>
    <p><strong>About this article:</strong></p>
    <p>This article covers important developments in the tech industry. Our team curates content that reflects innovation, ethical practices, and meaningful progress in technology - prioritizing human values over profit margins.</p>
    <p>We believe in technology that serves humanity, promotes fairness, and respects life. Click "Read Full Article" below to view the complete story from the original source.</p>
  `;
  modalReadMore.href = url;

  // Show modal with animation
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
  const modal = document.getElementById('articleModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('articleModal');
  if (modal && e.target === modal) {
    closeArticleModal();
  }
});

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
  createArticleModal();
  setupDonateButton();
  addPageTransitions();
  setupArticleClickHandlers();
});

// Setup article click handlers
function setupArticleClickHandlers() {
  // Add click handlers to all "Read More" links
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('read-more') || e.target.closest('.article-card')) {
      e.preventDefault();

      const articleCard = e.target.closest('.article-card');
      if (articleCard) {
        const title = articleCard.querySelector('.article-title')?.textContent || 'Tech Article';
        const summary = articleCard.querySelector('.article-summary')?.textContent || 'Exciting developments in technology...';
        const source = articleCard.querySelector('.source')?.textContent || 'Tech News';
        const date = articleCard.querySelector('.article-meta')?.textContent?.split('|')[1]?.trim() || 'Recent';
        const url = articleCard.querySelector('.read-more')?.href || '#';

        openArticleModal(title, summary, source, date, url);
      }
    }
  });
}
