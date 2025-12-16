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

      // This will be replaced with actual PayPal form
      alert('PayPal donation form will open here. Please configure your PayPal email in the HTML files.');
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

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
  setupDonateButton();
  addPageTransitions();
});
