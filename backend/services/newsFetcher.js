const Parser = require('rss-parser');
const Article = require('../models/Article');

const parser = new Parser({
  timeout: 10000,
  headers: {'User-Agent': 'TechNewsAggregator/1.0'}
});

// RSS feed sources
const RSS_FEEDS = [
  { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
  { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge' },
  { url: 'https://arstechnica.com/feed/', name: 'Ars Technica' },
  { url: 'https://venturebeat.com/category/ai/feed/', name: 'VentureBeat AI' },
  { url: 'https://www.wired.com/feed/rss', name: 'Wired' }
];

// Keywords for categorization and filtering
const KEYWORDS = {
  AI: ['ai', 'artificial intelligence', 'chatgpt', 'claude', 'gpt-4', 'gpt-5', 'openai', 'anthropic',
       'machine learning', 'deep learning', 'neural network', 'llm', 'gemini', 'copilot'],
  Software: ['software', 'update', 'windows 11', 'windows', 'macos', 'linux', 'app', 'application',
             'release', 'version', 'patch', 'microsoft', 'google', 'apple'],
  Hardware: ['nvidia', 'gpu', 'processor', 'chip', 'hardware', 'device', 'smartphone', 'laptop',
             'amd', 'intel', 'apple silicon', 'm1', 'm2', 'm3', 'm4'],
  'Crypto/Stocks': ['dogecoin', 'bitcoin', 'ethereum', 'crypto', 'cryptocurrency', 'stock', 'ipo',
                    'market', 'investment', 'ai bubble', 'valuation', 'tesla', 'spacex']
};

// Determine category based on title and content
function categorizeArticle(title, contentSnippet) {
  const text = `${title} ${contentSnippet}`.toLowerCase();

  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return 'General';
}

// Check if article is relevant to tech interests
function isRelevantArticle(title, contentSnippet) {
  const text = `${title} ${contentSnippet}`.toLowerCase();

  // Include all tech-related content
  const allKeywords = Object.values(KEYWORDS).flat();
  return allKeywords.some(keyword => text.includes(keyword));
}

// Fetch articles from a single feed
async function fetchFromFeed(feedUrl, sourceName) {
  try {
    console.log(`Fetching from ${sourceName}...`);
    const feed = await parser.parseURL(feedUrl);
    const articles = [];

    for (const item of feed.items.slice(0, 20)) { // Limit to 20 most recent
      // Check if article is relevant
      if (!isRelevantArticle(item.title, item.contentSnippet || '')) {
        continue;
      }

      // Check if article already exists
      const existingArticle = await Article.findOne({ sourceUrl: item.link });
      if (existingArticle) {
        continue;
      }

      const category = categorizeArticle(item.title, item.contentSnippet || '');

      // Extract image from content or use default
      let imageUrl = '';
      if (item.enclosure && item.enclosure.url) {
        imageUrl = item.enclosure.url;
      } else if (item['media:thumbnail']) {
        imageUrl = item['media:thumbnail'].$.url;
      } else if (item.content && item.content.includes('<img')) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      const article = {
        title: item.title,
        summary: item.contentSnippet ? item.contentSnippet.substring(0, 300) : item.title,
        sourceUrl: item.link,
        sourceName: sourceName,
        imageUrl: imageUrl,
        category: category,
        publishedDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        approved: false,
        featured: false
      };

      articles.push(article);
    }

    return articles;
  } catch (error) {
    console.error(`Error fetching from ${sourceName}:`, error.message);
    return [];
  }
}

// Main function to fetch from all feeds
async function fetchAllNews() {
  console.log('Starting news fetch from all sources...');
  let totalFetched = 0;

  for (const feed of RSS_FEEDS) {
    const articles = await fetchFromFeed(feed.url, feed.name);

    if (articles.length > 0) {
      try {
        await Article.insertMany(articles, { ordered: false });
        totalFetched += articles.length;
        console.log(`✓ Saved ${articles.length} new articles from ${feed.name}`);
      } catch (error) {
        // Handle duplicate key errors gracefully
        if (error.code === 11000) {
          console.log(`Some articles from ${feed.name} already exist, skipped duplicates`);
        } else {
          console.error(`Error saving articles from ${feed.name}:`, error.message);
        }
      }
    }
  }

  console.log(`News fetch complete. Total new articles: ${totalFetched}`);
  return totalFetched;
}

module.exports = { fetchAllNews };
