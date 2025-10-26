// Playwright Server - Server-side web crawling
// This runs Playwright on the server side for better performance

const express = require('express');
const { chromium } = require('playwright');

class PlaywrightServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8002;
    this.browser = null;
    this.context = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    console.log('🚀 Initializing Playwright Server...');
    
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    this.context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      ignoreHTTPSErrors: true
    });

    this.setupRoutes();
    this.isInitialized = true;
    console.log('✅ Playwright Server initialized');
  }

  setupRoutes() {
    this.app.use(express.json());

    // CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Search endpoint
    this.app.post('/api/search', async (req, res) => {
      try {
        const { query, engine = 'google' } = req.body;
        
        if (!query) {
          return res.status(400).json({ error: 'Query parameter is required' });
        }

        console.log(`🎭 Server-side search for: "${query}" using ${engine}`);
        
        const results = await this.performSearch(query, engine);
        
        res.json({
          success: true,
          query: query,
          results: results,
          engine: engine,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
          error: 'Search failed', 
          message: error.message 
        });
      }
    });

    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        browser: this.browser ? 'running' : 'stopped',
        timestamp: new Date().toISOString()
      });
    });

    // Get trending topics
    this.app.get('/api/trending/:topic', async (req, res) => {
      try {
        const { topic } = req.params;
        const trendingResults = await this.getTrendingTopics(topic);
        
        res.json({
          success: true,
          topic: topic,
          results: trendingResults,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Trending error:', error);
        res.status(500).json({ 
          error: 'Failed to get trending topics', 
          message: error.message 
        });
      }
    });
  }

  async performSearch(query, engine) {
    const page = await this.context.newPage();
    
    try {
      let searchUrl;
      let selectors;

      switch (engine) {
        case 'google':
          searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
          selectors = {
            results: '.g, .tF2Cxc, .g .yuRUbf',
            title: 'h3, .DKV0Md, .LC20lb',
            link: 'a[href]',
            description: '.VwiC3b, .s3v9rd, .st, .IsZvec'
          };
          break;
        case 'bing':
          searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
          selectors = {
            results: '.b_algo, .b_result',
            title: 'h2 a, .b_title a',
            link: 'a[href]',
            description: '.b_caption p, .b_descript'
          };
          break;
        case 'duckduckgo':
          searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
          selectors = {
            results: '.result, .web-result',
            title: '.result__title a, .result__a',
            link: 'a[href]',
            description: '.result__snippet, .result__body'
          };
          break;
        default:
          searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
          selectors = {
            results: '.g, .tF2Cxc',
            title: 'h3',
            link: 'a[href]',
            description: '.VwiC3b'
          };
      }

      console.log(`🎭 Server navigating to: ${searchUrl}`);
      
      // Navigate with timeout
      await page.goto(searchUrl, { 
        waitUntil: 'networkidle',
        timeout: 20000 
      });

      // Wait for results to load
      await page.waitForSelector(selectors.results, { timeout: 15000 });

      console.log(`🎭 Server page loaded, extracting results...`);

      // Extract results
      const results = await page.evaluate((sel, query) => {
        const resultElements = document.querySelectorAll(sel.results);
        const extractedResults = [];

        resultElements.forEach((element, index) => {
          if (index >= 20) return; // More results

          try {
            let titleElement = element.querySelector(sel.title);
            let linkElement = element.querySelector(sel.link);
            let descElement = element.querySelector(sel.description);

            if (!titleElement && linkElement) {
              titleElement = linkElement;
            }

            if (!linkElement && titleElement) {
              linkElement = titleElement.closest('a') || titleElement.querySelector('a');
            }

            if (titleElement && linkElement) {
              const title = titleElement.textContent?.trim() || '';
              let url = linkElement.getAttribute('href') || '';
              const description = descElement?.textContent?.trim() || '';

              // Clean Google redirect URLs
              if (url.startsWith('/url?q=')) {
                const cleanUrlMatch = url.match(/\/url\?q=([^&]+)/);
                if (cleanUrlMatch) {
                  url = decodeURIComponent(cleanUrlMatch[1]);
                }
              }

              // Skip if it's still a search engine URL or invalid
              if (url && !url.includes('google.com') && !url.includes('bing.com') && 
                  !url.includes('duckduckgo.com') && url.startsWith('http')) {
                
                // Extract domain
                let domain = '';
                try {
                  domain = new URL(url).hostname;
                } catch (e) {
                  domain = url.split('/')[2] || url;
                }

                extractedResults.push({
                  title: title,
                  url: url,
                  description: description || `Search result for "${query}"`,
                  type: 'web',
                  confidence: 'high',
                  source: 'Playwright Server Crawl',
                  domain: domain,
                  crawled: true,
                  timestamp: new Date().toISOString()
                });
              }
            }
          } catch (error) {
            console.log('Error processing element:', error);
          }
        });

        return extractedResults;
      }, selectors, query);

      console.log(`✅ Server extracted ${results.length} results`);
      return results;

    } catch (error) {
      console.log('Server search error:', error.message);
      return [];
    } finally {
      await page.close();
    }
  }

  async getTrendingTopics(topic) {
    const page = await this.context.newPage();
    
    try {
      // Get trending topics from Reddit
      await page.goto(`https://www.reddit.com/r/all/hot.json?limit=10`, {
        waitUntil: 'networkidle',
        timeout: 10000
      });

      const content = await page.content();
      const trendingResults = [];

      // Parse Reddit JSON response
      try {
        const data = JSON.parse(content);
        if (data.data && data.data.children) {
          data.data.children.slice(0, 5).forEach(post => {
            const postData = post.data;
            trendingResults.push({
              title: postData.title,
              url: `https://reddit.com${postData.permalink}`,
              description: `Reddit trending: ${postData.title}`,
              type: 'trending',
              confidence: 'medium',
              source: 'Reddit Server',
              domain: 'reddit.com',
              crawled: true,
              timestamp: new Date().toISOString(),
              isTrending: true
            });
          });
        }
      } catch (parseError) {
        console.log('Error parsing Reddit data:', parseError);
      }

      return trendingResults;

    } catch (error) {
      console.log('Trending topics error:', error.message);
      return [];
    } finally {
      await page.close();
    }
  }

  async start() {
    await this.initialize();
    
    this.app.listen(this.port, () => {
      console.log(`🎭 Playwright Server running on http://localhost:${this.port}`);
      console.log(`📡 Search endpoint: http://localhost:${this.port}/api/search`);
      console.log(`❤️ Health check: http://localhost:${this.port}/api/health`);
    });
  }

  async stop() {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    this.isInitialized = false;
    console.log('🛑 Playwright Server stopped');
  }
}

// Export for use
module.exports = PlaywrightServer;
