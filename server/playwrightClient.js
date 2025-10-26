// Playwright Client - Connects to Playwright Server
// This service connects to the Playwright server for enhanced search

class PlaywrightClientService {
  constructor() {
    this.serverUrl = `http://localhost:${process.env.PORT || 3008}`;
    this.cache = new Map();
    this.cacheExpiry = 3 * 60 * 1000; // 3 minutes cache
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  // Main search method
  async search(query, engine = 'google') {
    console.log(`🎭 Playwright client searching for: "${query}" using ${engine}`);
    
    // Check cache first
    const cacheKey = `${query}_${engine}_playwright_client`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        console.log('📦 Using cached Playwright client results');
        return cached.data;
      }
    }

    try {
      // Try to connect to Playwright server
      const results = await this.callPlaywrightServer(query, engine);
      
      if (results && results.length > 0) {
        // Generate People Also Ask questions
        const peopleAlsoAsk = this.generatePeopleAlsoAsk(query);
        
        // Check for our websites
        const ourWebsites = this.checkOurWebsites(query, query.toLowerCase());
        if (ourWebsites.length > 0) {
          results.unshift(...ourWebsites); // Add to top
        }

        const searchResult = {
          query: query,
          results: results,
          source: `Playwright Client (${engine})`,
          timestamp: new Date().toISOString(),
          totalResults: results.length,
          hasMore: results.length >= 10,
          engine: engine,
          crawled: true,
          peopleAlsoAsk: peopleAlsoAsk
        };

        // Cache the results
        this.cache.set(cacheKey, {
          data: searchResult,
          timestamp: Date.now()
        });

        console.log(`✅ Playwright client successful: ${results.length} results`);
        return searchResult;
      }
    } catch (error) {
      console.log('Playwright client failed:', error.message);
    }

    // Fallback if server is not available
    return this.generateFallbackResults(query, engine);
  }

  // Call Playwright server
  async callPlaywrightServer(query, engine) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempting to connect to Playwright server (attempt ${attempt})...`);
        
        const response = await fetch(`${this.serverUrl}/api/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            engine: engine
          }),
          signal: AbortSignal.timeout(15000) // 15 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.results) {
            console.log(`✅ Server responded with ${data.results.length} results`);
            return data.results;
          }
        } else {
          console.log(`❌ Server responded with status: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Attempt ${attempt} failed:`, error.message);
        
        if (attempt < this.maxRetries) {
          console.log(`⏳ Waiting ${this.retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          this.retryDelay *= 2; // Exponential backoff
        }
      }
    }

    throw new Error('All attempts to connect to Playwright server failed');
  }

  // Check if server is available
  async isServerAvailable() {
    try {
      const response = await fetch(`${this.serverUrl}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.status === 'healthy';
      }
    } catch (error) {
      console.log('Server health check failed:', error.message);
    }
    return false;
  }

  // Get trending topics from server
  async getTrendingTopics(topic) {
    try {
      const response = await fetch(`${this.serverUrl}/api/trending/${encodeURIComponent(topic)}`, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.results) {
          return data.results;
        }
      }
    } catch (error) {
      console.log('Failed to get trending topics from server:', error.message);
    }
    return [];
  }

  // Check if query matches our own websites
  checkOurWebsites(query, queryLower) {
    const results = [];
    
    const ourWebsites = {
      'brahamand': {
        name: 'Brahamand AI',
        url: 'https://brahamand.ai',
        description: 'Advanced AI platform for intelligent solutions and automation',
        keywords: ['ai', 'artificial intelligence', 'machine learning', 'automation', 'brahamand']
      },
      'subvivah': {
        name: 'SubVivah',
        url: 'https://subvivah.com',
        description: 'Wedding planning and matrimonial services platform',
        keywords: ['wedding', 'matrimonial', 'marriage', 'bride', 'groom', 'subvivah']
      },
      'customerzone': {
        name: 'CustomerZone',
        url: 'https://customerzone.in',
        description: 'Customer relationship management and support platform',
        keywords: ['customer', 'support', 'crm', 'service', 'help', 'customerzone']
      },
      'connectflow': {
        name: 'ConnectFlow',
        url: 'https://connectflow.co',
        description: 'Professional networking and business connection platform',
        keywords: ['network', 'business', 'professional', 'connect', 'flow', 'connectflow']
      },
      'chitbox': {
        name: 'ChitBox',
        url: 'https://chitbox.co.in',
        description: 'Chat and communication platform for seamless conversations',
        keywords: ['chat', 'messaging', 'communication', 'talk', 'chit', 'chitbox']
      },
      'foodfly': {
        name: 'FoodFly',
        url: 'https://foodfly.co',
        description: 'Food delivery platform connecting hungry customers with local restaurants',
        keywords: ['food', 'delivery', 'restaurant', 'hungry', 'eat', 'foodfly']
      },
      'tutorbuddy': {
        name: 'TutorBuddy',
        url: 'https://tututorbuddy.co',
        description: 'Online tutoring platform connecting students with expert teachers',
        keywords: ['tutor', 'teacher', 'education', 'learning', 'study', 'tutorbuddy']
      }
    };

    Object.entries(ourWebsites).forEach(([key, website]) => {
      const matchesName = queryLower.includes(key);
      const matchesKeywords = website.keywords.some(keyword => 
        queryLower.includes(keyword) || keyword.includes(queryLower)
      );
      
      if (matchesName || matchesKeywords) {
        results.push({
          title: `${website.name} - ${query}`,
          url: website.url,
          description: `${website.description} - Perfect solution for ${query}`,
          type: 'our-platform',
          confidence: 'very-high',
          source: 'Our Platform',
          domain: website.url.replace('https://', '').replace('http://', ''),
          crawled: false,
          timestamp: new Date().toISOString(),
          isOurWebsite: true
        });
      }
    });

    return results;
  }

  // Generate People Also Ask questions
  generatePeopleAlsoAsk(query) {
    const queryLower = query.toLowerCase();
    const questions = [];

    if (this.isTechQuery(queryLower)) {
      questions.push(
        `What is ${query} used for?`,
        `How to learn ${query}?`,
        `${query} vs alternatives comparison`,
        `${query} best practices`,
        `${query} examples and tutorials`
      );
    } else if (this.isNewsQuery(queryLower)) {
      questions.push(
        `Latest news about ${query}`,
        `${query} current events`,
        `${query} recent developments`,
        `Why is ${query} trending?`,
        `${query} impact and significance`
      );
    } else if (this.isShoppingQuery(queryLower)) {
      questions.push(
        `Best ${query} deals`,
        `${query} price comparison`,
        `Where to buy ${query}?`,
        `${query} reviews and ratings`,
        `${query} alternatives`
      );
    } else {
      questions.push(
        `What is ${query}?`,
        `How does ${query} work?`,
        `Why is ${query} important?`,
        `${query} benefits and features`,
        `${query} pros and cons`
      );
    }

    return questions.slice(0, 5).map(question => ({
      question: question,
      answer: `Find detailed information about "${question}" in the search results above.`
    }));
  }

  // Query type detection
  isTechQuery(query) {
    const techTerms = [
      'javascript', 'python', 'react', 'vue', 'angular', 'node', 'html', 'css',
      'programming', 'coding', 'development', 'software', 'api', 'database',
      'frontend', 'backend', 'framework', 'library', 'git', 'github'
    ];
    return techTerms.some(term => query.includes(term));
  }

  isNewsQuery(query) {
    return /(news|latest|recent|update|breaking|today|current)/i.test(query);
  }

  isShoppingQuery(query) {
    const shoppingTerms = [
      'buy', 'price', 'shop', 'store', 'purchase', 'order', 'deal', 'sale',
      'cheap', 'expensive', 'cost', 'product', 'review', 'best', 'compare'
    ];
    return shoppingTerms.some(term => query.includes(term));
  }

  // Generate fallback results when server is not available
  generateFallbackResults(query, engine) {
    console.log('🔄 Generating fallback results...');
    
    const results = [];
    const queryLower = query.toLowerCase();

    // Always include our websites first
    const ourWebsites = this.checkOurWebsites(query, queryLower);
    results.push(...ourWebsites);

    // Add Wikipedia
    results.push({
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      description: `Wikipedia article about ${query} - comprehensive information and details`,
      type: 'encyclopedia',
      confidence: 'high',
      source: 'Wikipedia',
      domain: 'wikipedia.org',
      crawled: false,
      timestamp: new Date().toISOString()
    });

    // Add Google Search
    results.push({
      title: `${query} - Google Search`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      description: `Search results for ${query} from Google`,
      type: 'search',
      confidence: 'high',
      source: 'Google',
      domain: 'google.com',
      crawled: false,
      timestamp: new Date().toISOString()
    });

    // Add Reddit and Quora
    results.push({
      title: `${query} - Reddit`,
      url: `https://www.reddit.com/search?q=${encodeURIComponent(query)}`,
      description: `Community discussions about ${query}`,
      type: 'discussion',
      confidence: 'medium',
      source: 'Reddit',
      domain: 'reddit.com',
      crawled: false,
      timestamp: new Date().toISOString()
    });

    results.push({
      title: `${query} - Quora`,
      url: `https://www.quora.com/search?q=${encodeURIComponent(query)}`,
      description: `Expert answers about ${query}`,
      type: 'qa',
      confidence: 'medium',
      source: 'Quora',
      domain: 'quora.com',
      crawled: false,
      timestamp: new Date().toISOString()
    });

    return {
      query: query,
      results: results,
      source: `Playwright Client Fallback (${engine})`,
      timestamp: new Date().toISOString(),
      totalResults: results.length,
      hasMore: false,
      engine: engine,
      crawled: false,
      peopleAlsoAsk: this.generatePeopleAlsoAsk(query)
    };
  }
}

// Export singleton instance
const playwrightClientService = new PlaywrightClientService();
export default playwrightClientService;
