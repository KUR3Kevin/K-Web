const BlogSuggestion = require('../models/BlogSuggestion');

// Blog post suggestions based on December 2024 tech trends
const BLOG_SUGGESTIONS = [
  {
    title: "Why AI Hardware is Moving Beyond GPUs in 2025",
    summary: "Exploring the shift from GPU-centric AI infrastructure to specialized AI chips and what this means for the industry.",
    suggestedContent: "The AI hardware landscape is rapidly evolving beyond traditional GPUs. Companies like Rabbit with their R1 device are pioneering new approaches to AI processing. This post would explore the limitations of current GPU-based systems, the emergence of specialized AI chips, and the implications for developers and businesses. Topics to cover: Large Action Models, edge computing benefits, cost-effectiveness, and the race between major tech companies to dominate this new hardware frontier.",
    category: "AI",
    tags: ["AI hardware", "GPUs", "specialized chips", "2025 trends", "edge computing"],
    sourceInspiration: "Based on December 2024 trends showing movement beyond GPU-only AI solutions"
  },
  {
    title: "The Rise of AI-Cryptocurrency Integration: A Game Changer",
    summary: "How artificial intelligence and blockchain technology are converging to create new opportunities in crypto markets.",
    suggestedContent: "The integration of AI and cryptocurrency is creating unprecedented opportunities. From AI-powered trading algorithms to blockchain projects like Lightchain Protocol AI, this convergence is reshaping finance. This post would examine real-world applications, investment implications, risks and opportunities, and what this means for the future of both industries. Key areas: predictive analytics for crypto trading, AI-enhanced mining operations, regulatory considerations, and emerging AI-crypto projects.",
    category: "Crypto/Stocks",
    tags: ["AI", "cryptocurrency", "blockchain", "trading", "fintech"],
    sourceInspiration: "December 2024 developments in AI-crypto integration projects"
  },
  {
    title: "Humanoid Robotics: Figure 02 and the Path to Commercial Viability",
    summary: "Analyzing the latest advances in humanoid robotics and their potential real-world applications.",
    suggestedContent: "Figure AI's Figure 02 robot represents a significant leap in humanoid robotics technology. With a $2.6 billion valuation and backing from tech giants, this post would explore what makes this technology viable now, potential applications in manufacturing and services, the competitive landscape, and timeline for mainstream adoption. Discussion points: technical breakthroughs, market readiness, ethical considerations, and investment opportunities in robotics.",
    category: "Hardware",
    tags: ["robotics", "humanoid robots", "Figure AI", "automation", "investment"],
    sourceInspiration: "Figure 02 robot developments and industry backing in 2024"
  },
  {
    title: "MiCA Regulation and the Future of European Crypto Markets",
    summary: "Understanding how Europe's new crypto regulations will impact the global digital asset landscape.",
    suggestedContent: "The European Union's Markets in Crypto-Assets (MiCA) regulation represents a watershed moment for cryptocurrency regulation globally. This post would break down the key provisions, compare them to other regulatory frameworks, analyze the impact on innovation and compliance, and discuss implications for global crypto adoption. Areas to cover: stablecoin regulations, exchange requirements, consumer protection measures, and how other jurisdictions might follow suit.",
    category: "Crypto/Stocks",
    tags: ["regulation", "MiCA", "European Union", "compliance", "stablecoins"],
    sourceInspiration: "December 2024 regulatory developments in crypto markets"
  },
  {
    title: "Layer-2 Solutions: The Infrastructure Powering Crypto's Next Phase",
    summary: "Examining how Layer-2 blockchain solutions are solving scalability issues and enabling mass adoption.",
    suggestedContent: "Layer-2 solutions like Optimism and Arbitrum are gaining traction as they address blockchain scalability challenges. This post would explain the technology in accessible terms, compare different L2 approaches, analyze adoption metrics, and explore implications for DeFi and NFTs. Technical topics made simple: rollup technology, transaction costs, security considerations, and the roadmap for Ethereum scaling.",
    category: "Software",
    tags: ["Layer-2", "blockchain", "scaling", "Ethereum", "DeFi"],
    sourceInspiration: "Growing adoption of Layer-2 solutions in late 2024"
  },
  {
    title: "Solana Mobile's Seeker: Crypto-Native Smartphones Go Mainstream",
    summary: "Analyzing the potential of crypto-native mobile devices and their impact on Web3 adoption.",
    suggestedContent: "The Solana Mobile Seeker smartphone has secured 140,000 pre-orders, signaling growing interest in crypto-native mobile devices. This post would examine what makes a phone 'crypto-native', the features that appeal to users, challenges facing mobile Web3, and whether this represents a viable path to mainstream crypto adoption. Key points: built-in wallet functionality, DApp integration, security considerations, and market potential.",
    category: "Hardware",
    tags: ["Solana", "mobile", "Web3", "smartphones", "adoption"],
    sourceInspiration: "Solana Mobile Seeker pre-order success and crypto mobile trend"
  },
  {
    title: "Bitcoin's $50K Dance: Understanding December 2024 Market Volatility",
    summary: "Deep dive into the factors driving Bitcoin's price movements and what it means for investors.",
    suggestedContent: "Bitcoin's volatility around the $50,000 mark in December 2024 reflects broader market uncertainties and opportunities. This post would analyze the technical and fundamental factors driving price action, institutional adoption trends, regulatory impacts, and what retail investors should consider. Topics: market cycles, institutional vs retail sentiment, macroeconomic factors, and strategic investment approaches.",
    category: "Crypto/Stocks",
    tags: ["Bitcoin", "price analysis", "volatility", "investment", "market trends"],
    sourceInspiration: "Bitcoin price movements and market analysis from December 2024"
  },
  {
    title: "The $199 AI Revolution: How Rabbit R1 is Democratizing AI",
    summary: "Exploring how affordable AI devices are making artificial intelligence accessible to everyone.",
    suggestedContent: "The Rabbit R1's $199 price point represents a significant step toward democratizing AI access. This post would explore how affordable AI hardware changes the landscape, the technology behind Large Action Models, user experience implications, and what this means for AI adoption. Discussion areas: accessibility vs functionality trade-offs, market positioning, competitive response from tech giants, and the future of personal AI devices.",
    category: "AI",
    tags: ["Rabbit R1", "affordable AI", "accessibility", "Large Action Models", "consumer tech"],
    sourceInspiration: "Rabbit R1 launch and market positioning in 2024"
  },
  {
    title: "AI-Enhanced Crypto Mining: Reducing Environmental Impact",
    summary: "How artificial intelligence is making cryptocurrency mining more efficient and environmentally friendly.",
    suggestedContent: "AI integration in crypto mining is addressing environmental concerns through optimized energy usage and carbon footprint reduction. This post would examine specific AI applications in mining operations, energy efficiency gains, sustainability metrics, and the future of green mining. Technical areas: predictive energy management, cooling optimization, renewable energy integration, and ROI analysis for AI-enhanced mining operations.",
    category: "Opinion",
    tags: ["crypto mining", "AI", "sustainability", "energy efficiency", "environment"],
    sourceInspiration: "AI adoption in crypto mining for environmental benefits"
  },
  {
    title: "The $15.7 Trillion AI Market: Beyond the Hype",
    summary: "Analyzing the real opportunities and challenges in the massive AI market opportunity.",
    suggestedContent: "The projected $15.7 trillion AI market represents enormous potential, but separating hype from reality is crucial for investors and entrepreneurs. This post would examine market size calculations, key growth drivers, potential obstacles, and realistic timelines for AI market development. Areas to explore: enterprise vs consumer adoption, geographic differences, technology readiness levels, and investment strategies for different market segments.",
    category: "Opinion",
    tags: ["AI market", "investment", "market analysis", "growth projections", "strategy"],
    sourceInspiration: "Analysis of AI market projections and industry trends"
  },
  {
    title: "Building Your First DApp: A 2025 Developer's Guide",
    summary: "Step-by-step tutorial for developers entering the decentralized application space.",
    suggestedContent: "A comprehensive tutorial covering the fundamentals of decentralized application development in 2025. This post would include setup guides, technology stack recommendations, best practices for smart contract development, and deployment strategies. Practical topics: choosing the right blockchain, development frameworks, testing methodologies, security considerations, and connecting frontend to blockchain backends.",
    category: "Tutorial",
    tags: ["DApp development", "blockchain", "smart contracts", "tutorial", "web3"],
    sourceInspiration: "Growing interest in DApp development and Web3 programming"
  },
  {
    title: "Microsoft and Nvidia's Robotics Investment: Industry Analysis",
    summary: "Examining what Big Tech's robotics investments mean for the industry's future.",
    suggestedContent: "Microsoft and Nvidia's backing of Figure AI signals serious corporate interest in robotics. This post would analyze the strategic implications, technology synergies, competitive landscape, and potential market outcomes. Key analysis points: corporate venture capital trends, technology convergence opportunities, market timing considerations, and implications for robotics startups and established players.",
    category: "Review",
    tags: ["Microsoft", "Nvidia", "robotics investment", "venture capital", "industry analysis"],
    sourceInspiration: "Corporate investment in robotics companies and strategic implications"
  },
  {
    title: "Optimism vs Arbitrum: Layer-2 Platform Comparison",
    summary: "Detailed comparison of leading Layer-2 solutions for Ethereum scaling.",
    suggestedContent: "A technical yet accessible comparison of Optimism and Arbitrum, the leading Layer-2 scaling solutions. This post would compare performance metrics, developer experience, ecosystem development, transaction costs, and security models. Practical insights: when to choose which platform, migration considerations, ecosystem maturity, and future roadmap analysis for both platforms.",
    category: "Review",
    tags: ["Optimism", "Arbitrum", "Layer-2", "comparison", "Ethereum scaling"],
    sourceInspiration: "Layer-2 adoption trends and platform comparison needs"
  },
  {
    title: "AI Agent Revolution: The Next Phase of Artificial Intelligence",
    summary: "Exploring how AI agents are transforming from concept to practical applications.",
    suggestedContent: "AI agents represent the evolution from static AI models to dynamic, action-oriented systems. This post would explore current AI agent capabilities, real-world applications, development frameworks, and future potential. Technical topics made accessible: agent architecture, decision-making processes, integration challenges, and the pathway from current chatbots to autonomous AI agents.",
    category: "AI",
    tags: ["AI agents", "artificial intelligence", "automation", "autonomous systems", "future tech"],
    sourceInspiration: "AI agents identified as the next major trend for 2025"
  },
  {
    title: "The Psychology of Crypto Volatility: Investor Behavior Analysis",
    summary: "Understanding the human factors behind cryptocurrency market movements.",
    suggestedContent: "Cryptocurrency volatility isn't just about technology and regulation—psychology plays a crucial role. This post would examine behavioral finance principles in crypto markets, social media influence, FOMO and fear cycles, and strategies for managing emotional decision-making. Psychological insights: herd mentality, loss aversion, confirmation bias, and developing a rational investment approach in volatile markets.",
    category: "Opinion",
    tags: ["psychology", "investor behavior", "volatility", "behavioral finance", "crypto markets"],
    sourceInspiration: "Market psychology during December 2024 crypto volatility"
  }
];

// Function to populate blog suggestions
async function generateBlogSuggestions() {
  console.log('Generating blog post suggestions...');
  let totalCreated = 0;

  for (const suggestion of BLOG_SUGGESTIONS) {
    try {
      // Check if suggestion already exists
      const existingSuggestion = await BlogSuggestion.findOne({
        title: suggestion.title
      });

      if (existingSuggestion) {
        continue;
      }

      const blogSuggestion = new BlogSuggestion({
        ...suggestion,
        approved: false,
        rejected: false,
        createdFromSuggestion: false
      });

      await blogSuggestion.save();
      totalCreated++;
      console.log(`✓ Created blog suggestion: "${suggestion.title}"`);
    } catch (error) {
      console.error(`Error creating suggestion "${suggestion.title}":`, error.message);
    }
  }

  console.log(`Blog suggestion generation complete. Total new suggestions: ${totalCreated}`);
  return totalCreated;
}

// Function to get pending suggestions
async function getPendingSuggestions(limit = 50) {
  try {
    return await BlogSuggestion.find({
      approved: false,
      rejected: false
    })
    .sort({ createdAt: -1 })
    .limit(limit);
  } catch (error) {
    console.error('Error fetching pending suggestions:', error.message);
    return [];
  }
}

// Function to approve a suggestion
async function approveSuggestion(suggestionId) {
  try {
    const suggestion = await BlogSuggestion.findByIdAndUpdate(
      suggestionId,
      { approved: true, rejected: false },
      { new: true }
    );
    return suggestion;
  } catch (error) {
    console.error('Error approving suggestion:', error.message);
    return null;
  }
}

// Function to reject a suggestion
async function rejectSuggestion(suggestionId) {
  try {
    const suggestion = await BlogSuggestion.findByIdAndUpdate(
      suggestionId,
      { rejected: true, approved: false },
      { new: true }
    );
    return suggestion;
  } catch (error) {
    console.error('Error rejecting suggestion:', error.message);
    return null;
  }
}

module.exports = {
  generateBlogSuggestions,
  getPendingSuggestions,
  approveSuggestion,
  rejectSuggestion
};