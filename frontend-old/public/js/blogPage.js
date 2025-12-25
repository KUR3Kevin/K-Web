// Blog Page JavaScript

let currentPage = 1;
let isLoading = false;

// Demo blog posts with moral values and tech innovation focus
const demoBlogPosts = [
  {
    _id: 'demo-1',
    title: 'The Ethics of AI Development: Putting Humanity First',
    category: 'Opinion',
    excerpt: 'As artificial intelligence becomes more powerful, we must ensure that human values, dignity, and life remain at the center of technological progress.',
    author: 'Tech Insights Team',
    publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    imageUrl: null,
    content: `In an era where artificial intelligence is advancing at breakneck speed, we face a critical question: Are we developing technology for humanity, or are we allowing technology to reshape humanity in ways we might not want?

The recent surge in AI capabilities has brought incredible opportunities—from medical breakthroughs to educational tools that can help millions. However, with great power comes great responsibility. As developers and consumers of technology, we have a moral obligation to ensure that AI development prioritizes human welfare over profit margins.

**The Human-Centered Approach**

True innovation isn't just about what technology can do—it's about what technology should do. Every algorithm, every neural network, every automated system should be designed with human dignity as its foundation. This means:

- Protecting privacy as a fundamental right, not a luxury
- Ensuring AI systems respect the value of human life and decision-making
- Building technology that enhances human capabilities rather than replacing human judgment in critical areas
- Maintaining transparency in AI decision-making processes

**Moving Beyond the Profit Motive**

The tech industry often gets caught up in the race to market, prioritizing speed and profit over ethical considerations. But sustainable innovation requires a longer view. Companies that build trust through ethical practices and genuine care for user welfare will ultimately be more successful than those that prioritize short-term gains.

As consumers and industry observers, we must support companies and technologies that demonstrate a commitment to moral principles. This isn't just idealism—it's practical wisdom for creating a future where technology truly serves humanity.`
  },
  {
    _id: 'demo-2',
    title: 'Open Source vs. Proprietary Software: The Battle for Digital Freedom',
    category: 'Software',
    excerpt: 'The choice between open source and proprietary software isn\'t just technical—it\'s about who controls our digital future and whether innovation serves the many or the few.',
    author: 'Tech Insights Team',
    publishedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    imageUrl: null,
    content: `The software we use shapes our digital lives, and increasingly, our real lives. The choice between open source and proprietary software represents more than a technical decision—it's a choice about values, freedom, and the kind of digital future we want to create.

**The Power of Community-Driven Development**

Open source software embodies principles that align with human dignity and collective progress. When software is developed openly, with source code available for inspection and modification, several important things happen:

- Innovation accelerates because many minds can contribute to solving problems
- Security improves through transparency and peer review
- Users maintain control over their tools and data
- Knowledge is shared rather than hoarded

Projects like Linux, Firefox, and countless others have shown that community-driven development can create superior products while respecting user freedom.

**The Hidden Costs of Proprietary Lock-in**

Proprietary software often comes with hidden costs beyond the license fee. When we become dependent on closed systems, we surrender control over our digital tools and data. This can lead to:

- Vendor lock-in that makes it difficult to switch to better alternatives
- Privacy concerns when proprietary code can't be audited
- Higher long-term costs as users have no alternatives
- Innovation stagnation when competition is limited

**Finding Balance in a Complex World**

This isn't to say that all proprietary software is inherently evil or that open source is always the answer. Sometimes proprietary solutions provide necessary functionality or support. The key is making informed choices that prioritize long-term value over convenience.

As technology users, we can support open standards, contribute to open source projects, and choose solutions that respect our autonomy. As an industry, we can work toward models that balance innovation incentives with user freedom and community benefit.

The future of software should be one where innovation serves humanity, not the other way around.`
  },
  {
    _id: 'demo-3',
    title: 'Privacy by Design: Why Your Data Matters More Than Their Profits',
    category: 'Opinion',
    excerpt: 'In a world where personal data has become the new oil, we must reclaim our digital privacy and demand that technology companies respect our fundamental right to privacy.',
    author: 'Tech Insights Team',
    publishedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    imageUrl: null,
    content: `Your personal data tells a story—where you go, what you buy, who you talk to, what you think about. This story belongs to you, yet countless companies are building billion-dollar businesses by reading, analyzing, and selling chapters of your life without your meaningful consent.

**The Real Cost of "Free" Services**

When a service is free, you are often the product. Social media platforms, search engines, and countless apps collect vast amounts of personal information, not because they need it to provide their service, but because they can monetize it. This creates several problems:

- Your personal information becomes a commodity traded without your knowledge
- Your behavior is manipulated through algorithmic targeting designed to maximize engagement, not wellbeing
- Security breaches can expose intimate details of your life to criminals or foreign governments
- Your digital footprint can be used to discriminate against you in employment, insurance, or other critical areas

**Privacy as a Human Right**

Privacy isn't about hiding something wrong—it's about maintaining human dignity in a digital age. Privacy gives us:

- The freedom to explore ideas without judgment
- The right to change our minds without being forever defined by past clicks
- Protection from manipulation and coercion
- The space for authentic relationships and genuine self-expression

**Building a Privacy-First Future**

Technology can and should be designed with privacy as a fundamental principle, not an afterthought. This means:

- Collecting only the data necessary to provide a service
- Storing personal information securely and deleting it when no longer needed
- Being transparent about what data is collected and how it's used
- Giving users meaningful control over their personal information
- Choosing business models that don't depend on surveillance

Companies like Signal, DuckDuckGo, and others have proven that it's possible to build successful technology while respecting user privacy. As consumers, we can support these alternatives and demand better from the rest of the industry.

Our digital future doesn't have to be a surveillance dystopia. By choosing privacy-respecting services and supporting legislation that protects our rights, we can ensure that technology serves human flourishing rather than undermining it.`
  },
  {
    _id: 'demo-4',
    title: 'The Sustainability Crisis in Tech: Building for Tomorrow, Not Just Today',
    category: 'Hardware',
    excerpt: 'The tech industry\'s environmental impact is enormous and growing. It\'s time to prioritize sustainable innovation that considers the full lifecycle of our digital tools.',
    author: 'Tech Insights Team',
    publishedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    imageUrl: null,
    content: `Every smartphone, laptop, and server rack in the world represents not just technological achievement, but also extracted minerals, manufacturing emissions, and eventual electronic waste. As our digital lives expand, so does the environmental footprint of the technology that powers them.

**The Hidden Environmental Cost of Innovation**

The tech industry's environmental impact extends far beyond the energy consumption of data centers:

- **Rare Earth Mining**: The minerals required for our devices often come from environmentally destructive mining operations
- **Manufacturing Emissions**: Producing a single smartphone generates as much CO2 as using it for a decade
- **Planned Obsolescence**: Designing products to become obsolete quickly maximizes profits but devastates the environment
- **E-Waste Crisis**: Discarded electronics are one of the fastest-growing waste streams globally

**The True Cost of the "Upgrade Culture"**

Marketing departments have convinced us that we need the latest device every year or two, but this upgrade culture is unsustainable both economically and environmentally. A phone that works perfectly well becomes "obsolete" not because of technical necessity, but because of artificial software limitations and social pressure.

This isn't just an environmental issue—it's a moral one. The resources consumed by unnecessary upgrades could be used to address real human needs rather than manufactured desires.

**Designing for Longevity and Repair**

Sustainable technology design requires a fundamental shift in priorities:

- **Modular Design**: Components that can be easily replaced or upgraded extend device lifespan
- **Right to Repair**: Consumers should be able to fix their devices without voiding warranties or requiring manufacturer approval
- **Software Longevity**: Operating systems and apps should be designed to run efficiently on older hardware
- **Circular Economy**: Manufacturers should take responsibility for the full lifecycle of their products

**Making Sustainable Choices**

As consumers, we can drive change by:

- Using devices longer and resisting unnecessary upgrades
- Supporting companies that prioritize repairability and sustainability
- Buying refurbished devices when replacement is necessary
- Properly recycling electronics at end-of-life

The future of technology doesn't have to come at the expense of our planet. By prioritizing sustainability alongside innovation, we can build a digital future that serves both human needs and environmental stewardship.

True progress means considering not just what we can build, but what we should build—and how we can build it responsibly.`
  },
  {
    _id: 'demo-5',
    title: 'Digital Education: Technology That Empowers Rather Than Replaces',
    category: 'Software',
    excerpt: 'Educational technology should enhance human learning and critical thinking, not replace teachers or turn students into passive consumers of digital content.',
    author: 'Tech Insights Team',
    publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    imageUrl: null,
    content: `The promise of educational technology is compelling: personalized learning, global access to information, and tools that can adapt to each student's needs. However, the reality often falls short of this promise, with technology being used to cut costs rather than improve education.

**Technology as a Tool, Not a Teacher**

The most effective educational technology enhances rather than replaces human instruction. Great teachers provide something that no algorithm can: genuine care, emotional support, and the ability to inspire. Technology should amplify these human qualities, not attempt to substitute for them.

Effective educational technology:

- **Personalizes Learning Pace**: Allowing students to progress at their own speed without holding others back or leaving anyone behind
- **Provides Rich Resources**: Access to simulations, primary sources, and expert perspectives from around the world
- **Facilitates Collaboration**: Connecting students with peers and experts they might never meet otherwise
- **Supports Different Learning Styles**: Visual, auditory, and kinesthetic learners can all find approaches that work for them

**The Dangers of Passive Consumption**

Too much educational technology treats students as passive consumers rather than active learners. When education becomes about watching videos and clicking through predetermined modules, we rob students of the critical thinking skills they'll need in life.

Real learning happens through:

- Wrestling with difficult concepts and making mistakes
- Engaging in discussions and debates with peers
- Creating original work and expressing unique perspectives
- Developing the ability to question, analyze, and synthesize information

**Building Digital Wisdom**

In an age of information overload, students need more than access to facts—they need the wisdom to evaluate sources, think critically, and distinguish between reliable information and misinformation.

Educational technology should help students develop:

- **Information Literacy**: The ability to find, evaluate, and use information effectively
- **Digital Citizenship**: Understanding the ethical and social implications of technology use
- **Creative Problem-Solving**: Using technology as a tool for innovation and expression
- **Collaboration Skills**: Working effectively with others in digital environments

**The Human Element in Digital Learning**

Even as we embrace technology in education, we must remember that learning is fundamentally a human activity. The most powerful educational experiences combine the best of digital tools with meaningful human relationships.

Teachers, parents, and mentors provide the encouragement, accountability, and emotional support that no app can replace. Technology should free them to focus on these uniquely human aspects of education rather than replacing them with automated systems.

The goal of educational technology should be to develop capable, thinking human beings who can use technology wisely—not to create efficient consumers of digital content.

True educational innovation serves human development and prepares students not just for careers, but for lives of meaning, contribution, and continued growth.`
  }
];

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
    // Load demo blog posts when API is not available
    loadDemoBlogPosts();
  } finally {
    isLoading = false;
  }
}

// Load demo blog posts when API is not available
function loadDemoBlogPosts() {
  const blogGrid = document.getElementById('blog-grid');
  const loadMoreContainer = document.getElementById('load-more-container');

  blogGrid.innerHTML = '';

  demoBlogPosts.forEach(post => {
    blogGrid.appendChild(createBlogCard(post));
  });

  // Hide load more button for demo posts
  loadMoreContainer.style.display = 'none';
  isLoading = false;
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
    let post;

    // Check if it's a demo post first
    if (postId.startsWith('demo-')) {
      post = demoBlogPosts.find(p => p._id === postId);
      if (!post) {
        throw new Error('Demo post not found');
      }
    } else {
      const response = await fetch(`/api/blog/${postId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }

      const data = await response.json();
      post = data.post;
    }

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
