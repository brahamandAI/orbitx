const express = require('express');
const { chromium } = require('playwright');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors());
app.use(express.json());

// Global browser instance
let browser = null;

// Initialize browser
async function initBrowser() {
  if (!browser) {
    console.log('🚀 Launching Playwright browser...');
    browser = await chromium.launch({
      headless: true, // Set to true for production
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
    console.log('✅ Browser launched successfully');
  }
  return browser;
}

// Extract favicon URL from domain
function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (error) {
    return '';
  }
}

// Extract OpenGraph image from HTML
function extractOpenGraphImage(html) {
  try {
    const $ = cheerio.load(html);
    const ogImage = $('meta[property="og:image"]').attr('content') ||
                   $('meta[name="og:image"]').attr('content') ||
                   $('meta[property="twitter:image"]').attr('content');
    return ogImage || '';
  } catch (error) {
    return '';
  }
}

// Fallback results when scraping fails
function getFallbackResults(keyword) {
  const queryLower = keyword.toLowerCase();
  const results = [];
  
  // Check for user's websites first
  const userWebsites = [
    { name: 'foodfly', url: 'https://foodfly.co', title: 'FoodFly - Online Food Delivery' },
    { name: 'subvivah', url: 'https://subvivah.com', title: 'Subvivah - Wedding Planning Platform' },
    { name: 'connectflow', url: 'https://connectflow.co', title: 'ConnectFlow - Business Networking' },
    { name: 'chitbox', url: 'https://chitbox.co.in', title: 'ChitBox - Financial Services' },
    { name: 'tututorbuddy', url: 'https://tututorbuddy.co', title: 'TutuTorbuddy - Online Tutoring' },
    { name: 'brahamand', url: 'https://brahamand.ai', title: 'Brahamand AI - Artificial Intelligence' }
  ];
  
  // Add user's websites if query matches
  userWebsites.forEach(site => {
    if (queryLower.includes(site.name) || site.name.includes(queryLower)) {
      results.push({
        title: site.title,
        description: `Official website for ${site.title} - ${site.name}`,
        url: site.url,
        favicon: getFaviconUrl(site.url),
        image: ''
      });
    }
  });
  
  // Add general search results
  results.push({
    title: `${keyword} - Google Search`,
    description: `Search results for ${keyword} from Google`,
    url: `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
    favicon: getFaviconUrl('google.com'),
    image: ''
  });
  
  results.push({
    title: `${keyword} - Wikipedia`,
    description: `Wikipedia article about ${keyword}`,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(keyword)}`,
    favicon: getFaviconUrl('wikipedia.org'),
    image: ''
  });
  
  // Add technology results for tech queries
  if (['javascript', 'react', 'nodejs', 'python', 'java', 'html', 'css'].some(tech => queryLower.includes(tech))) {
    results.push({
      title: `${keyword} - MDN Web Docs`,
      description: `Official documentation for ${keyword}`,
      url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(keyword)}`,
      favicon: getFaviconUrl('developer.mozilla.org'),
      image: ''
    });
    
    results.push({
      title: `${keyword} - Stack Overflow`,
      description: `Community questions and answers about ${keyword}`,
      url: `https://stackoverflow.com/search?q=${encodeURIComponent(keyword)}`,
      favicon: getFaviconUrl('stackoverflow.com'),
      image: ''
    });
  }
  
  return results.slice(0, 10);
}

// Search Bing
async function searchBing(keyword, page) {
  try {
    console.log(`🔍 Searching Bing for: "${keyword}"`);
    
    const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}`;
    console.log(`📡 Navigating to: ${searchUrl}`);
    
    // Use load instead of networkidle for better reliability
    await page.goto(searchUrl, { 
      waitUntil: 'load',
      timeout: 20000 
    });
    
    // Wait extra 3 seconds for JS content
    await page.waitForTimeout(3000);
    
    console.log('📄 Page loaded, waiting for results...');
    
    // Try multiple selectors with shorter timeouts
    let foundSelector = false;
    const selectors = ['li.b_algo', '.b_algo', '.b_result', '[data-bm]'];
    
    for (const selector of selectors) {
      try {
        console.log(`🔍 Trying selector: ${selector}`);
        await page.waitForSelector(selector, { timeout: 3000 });
        console.log(`✅ Found ${selector} selector`);
        foundSelector = true;
        break;
      } catch (error) {
        console.log(`❌ ${selector} not found, trying next...`);
      }
    }
    
    if (!foundSelector) {
      console.log('❌ No selectors found, trying to get any results...');
    }
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    const results = [];
    
    // Extract Bing results with multiple selectors (reuse selectors from above)
    let foundResults = false;
    
    for (const selector of selectors) {
      console.log(`🔍 Trying selector: ${selector}`);
      const elements = $(selector);
      console.log(`📊 Found ${elements.length} elements with selector: ${selector}`);
      
      if (elements.length > 0) {
        foundResults = true;
        elements.each((index, element) => {
          if (index >= 10) return; // Limit to 10 results
          
          const $el = $(element);
          const titleElement = $el.find('h2 a, .b_title a, h3 a').first();
          const linkElement = $el.find('a').first();
          const descElement = $el.find('.b_caption p, .b_descript, .b_snippet, .b_caption').first();
          
          const title = titleElement.text().trim();
          const url = linkElement.attr('href') || '';
          const description = descElement.text().trim();
          
          // Clean Bing redirect URLs
          let cleanUrl = url;
          if (url.includes('/aclick?ld=')) {
            const urlMatch = url.match(/&u=([^&]+)/);
            if (urlMatch) {
              cleanUrl = decodeURIComponent(urlMatch[1]);
            }
          }
          
          if (title && cleanUrl && cleanUrl.startsWith('http')) {
            results.push({
              title: title,
              description: description || `Search result for ${keyword}`,
              url: cleanUrl,
              favicon: getFaviconUrl(cleanUrl),
              image: ''
            });
          }
        });
        break; // Exit the selector loop once we find results
      }
    }
    
    if (!foundResults) {
      console.log('❌ No results found with any selector');
    }
    
    console.log(`✅ Bing returned ${results.length} results`);
    return results;
    
  } catch (error) {
    console.error('❌ Bing search failed:', error.message);
    return [];
  }
}

// Search DuckDuckGo
async function searchDuckDuckGo(keyword, page) {
  try {
    console.log(`🔍 Searching DuckDuckGo for: "${keyword}"`);
    
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(keyword)}`;
    console.log(`📡 Navigating to: ${searchUrl}`);
    
    await page.goto(searchUrl, { 
      waitUntil: 'load',
      timeout: 20000 
    });
    
    // Wait extra 3 seconds for JS content
    await page.waitForTimeout(3000);
    
    console.log('📄 Page loaded, waiting for results...');
    
    // Try multiple DuckDuckGo selectors
    let foundSelector = false;
    const selectors = ['a.result__a', '.result__a', '.result', '[data-testid="result"]'];
    
    for (const selector of selectors) {
      try {
        console.log(`🔍 Trying DuckDuckGo selector: ${selector}`);
        await page.waitForSelector(selector, { timeout: 3000 });
        console.log(`✅ Found ${selector} selector`);
        foundSelector = true;
        break;
      } catch (error) {
        console.log(`❌ ${selector} not found, trying next...`);
      }
    }
    
    if (!foundSelector) {
      console.log('❌ No DuckDuckGo selectors found, trying to get any results...');
    }
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    const results = [];
    
    // Extract DuckDuckGo results with multiple selectors
    const ddgSelectors = ['a.result__a', '.result__a', '.result', '[data-testid="result"]'];
    let foundDdgResults = false;
    
    for (const selector of ddgSelectors) {
      console.log(`🔍 Trying DuckDuckGo selector: ${selector}`);
      const elements = $(selector);
      console.log(`📊 Found ${elements.length} elements with selector: ${selector}`);
      
      if (elements.length > 0) {
        foundDdgResults = true;
        elements.each((index, element) => {
          if (index >= 10) return; // Limit to 10 results
          
          const $el = $(element);
          const title = $el.text().trim();
          const url = $el.attr('href') || '';
          
          // Find description from sibling elements
          const resultContainer = $el.closest('.result');
          const description = resultContainer.find('.result__snippet, .result__body').text().trim();
          
          if (title && url && url.startsWith('http')) {
            results.push({
              title: title,
              description: description || `Search result for ${keyword}`,
              url: url,
              favicon: getFaviconUrl(url),
              image: ''
            });
          }
        });
        break; // Exit the selector loop once we find results
      }
    }
    
    if (!foundDdgResults) {
      console.log('❌ No DuckDuckGo results found with any selector');
    }
    
    console.log(`✅ DuckDuckGo returned ${results.length} results`);
    return results;
    
  } catch (error) {
    console.error('❌ DuckDuckGo search failed:', error.message);
    return [];
  }
}

// Main search function
async function performSearch(keyword) {
  let browser = null;
  let context = null;
  let page = null;
  
  try {
    browser = await initBrowser();
    context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US'
    });
    
    page = await context.newPage();
    
    let results = [];
    
    // Try Bing first
    results = await searchBing(keyword, page);
    
    // If Bing fails or returns empty, try DuckDuckGo
    if (!results || results.length === 0) {
      console.log('🔄 Bing failed, trying DuckDuckGo...');
      results = await searchDuckDuckGo(keyword, page);
    }
    
    // Filter and clean results
    results = results
      .filter(result => result.title && result.url)
      .slice(0, 10);
    
    // If no results found, provide fallback results
    if (results.length === 0) {
      console.log('🔄 No results found, providing fallback results...');
      results = getFallbackResults(keyword);
    }
    
    console.log(`🎯 Final results: ${results.length}`);
    return results;
    
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    // Return fallback results on error
    return getFallbackResults(keyword);
  } finally {
    try {
      if (page) await page.close();
      if (context) await context.close();
    } catch (error) {
      console.error('❌ Error closing browser resources:', error.message);
    }
  }
}

// Search endpoint
app.get('/search', async (req, res) => {
  try {
    const { q: keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ 
        error: 'Query parameter "q" is required' 
      });
    }
    
    console.log(`\n🔍 Search request: "${keyword}"`);
    
    const results = await performSearch(keyword);
    
    const response = {
      query: keyword,
      results: results,
      timestamp: new Date().toISOString(),
      total: results.length
    };
    
    console.log(`✅ Returning ${results.length} results for "${keyword}"`);
    res.json(response);
    
  } catch (error) {
    console.error('❌ Search endpoint error:', error);
    res.status(500).json({ 
      error: 'Search failed', 
      message: error.message 
    });
  }
});

// Proxy endpoint - Bypass X-Frame-Options and CORS
app.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <h1 style="color: white;">❌ Missing URL Parameter</h1>
            <p style="color: white; font-size: 18px;">Please provide a URL using ?url=https://example.com</p>
            <p style="color: white; margin-top: 20px;">Example: <code style="background: white; padding: 5px; color: black;">/proxy?url=https://google.com</code></p>
          </body>
        </html>
      `);
    }
    
    console.log(`\n🌐 Proxy request for: ${url}`);
    
    // Validate URL
    let targetUrl;
    try {
      targetUrl = new URL(url);
    } catch (error) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; padding: 40px; text-align: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <h1 style="color: white;">❌ Invalid URL</h1>
            <p style="color: white; font-size: 18px;">The provided URL is not valid: ${url}</p>
          </body>
        </html>
      `);
    }
    
    // Initialize browser if needed
    const browserInstance = await initBrowser();
    const context = await browserInstance.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      ignoreHTTPSErrors: true,
      bypassCSP: true
    });
    
    const page = await context.newPage();
    
    try {
      console.log(`📡 Loading: ${url}`);
      
      // Navigate to the URL
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      console.log(`✅ Page loaded: ${url}`);
      
      // Get the full HTML content
      const content = await page.content();
      
      // Close page and context
      await page.close();
      await context.close();
      
      // Modify the HTML to work in iframe
      const modifiedContent = content
        // Remove X-Frame-Options meta tags
        .replace(/<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi, '')
        // Remove CSP meta tags that might block iframe
        .replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '')
        // Add base tag to fix relative URLs
        .replace(/<head>/i, `<head>\n<base href="${url}">\n`)
        // Inject our custom script to fix navigation
        .replace(/<\/body>/i, `
          <script>
            // Fix links to open in parent window
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a');
              if (link && link.href && !link.target) {
                e.preventDefault();
                window.top.location.href = link.href;
              }
            });
          </script>
        </body>`);
      
      // Set headers to allow iframe embedding
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.removeHeader('X-Frame-Options');
      
      console.log(`✅ Proxied successfully: ${url}`);
      res.send(modifiedContent);
      
    } catch (error) {
      console.error(`❌ Proxy error for ${url}:`, error.message);
      
      await page.close();
      await context.close();
      
      // Send error page
      res.status(500).send(`
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 60px;
                text-align: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              .error-box {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 40px;
                border-radius: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                max-width: 600px;
              }
              h1 { font-size: 48px; margin-bottom: 20px; }
              p { font-size: 18px; margin: 10px 0; }
              .url { 
                background: rgba(0, 0, 0, 0.3);
                padding: 10px 20px;
                border-radius: 10px;
                margin: 20px 0;
                word-break: break-all;
              }
              button {
                background: white;
                color: #667eea;
                border: none;
                padding: 15px 30px;
                font-size: 16px;
                border-radius: 10px;
                cursor: pointer;
                margin: 10px;
                font-weight: bold;
                transition: transform 0.2s;
              }
              button:hover {
                transform: scale(1.05);
              }
            </style>
          </head>
          <body>
            <div class="error-box">
              <h1>⚠️ Failed to Load</h1>
              <p>Unable to load the website through proxy</p>
              <div class="url">${url}</div>
              <p style="font-size: 14px; opacity: 0.8;">Error: ${error.message}</p>
              <div style="margin-top: 30px;">
                <button onclick="window.location.reload()">🔄 Retry</button>
                <button onclick="window.open('${url}', '_blank')">🔗 Open Externally</button>
              </div>
            </div>
          </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error('❌ Proxy endpoint error:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; padding: 40px; text-align: center; background: #ff6b6b; color: white;">
          <h1>❌ Proxy Server Error</h1>
          <p style="font-size: 18px;">${error.message}</p>
        </body>
      </html>
    `);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    browser: browser ? 'running' : 'stopped'
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (browser) {
    await browser.close();
    console.log('✅ Browser closed');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  if (browser) {
    await browser.close();
    console.log('✅ Browser closed');
  }
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 OrbitX Server running on http://localhost:${PORT}`);
  console.log(`${'='.repeat(60)}\n`);
  console.log(`📡 Search endpoint: http://localhost:${PORT}/search?q=keyword`);
  console.log(`🌐 Proxy endpoint: http://localhost:${PORT}/proxy?url=https://example.com`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health\n`);
  console.log(`🎯 Example Usage:`);
  console.log(`   Search: http://localhost:${PORT}/search?q=javascript`);
  console.log(`   Proxy: http://localhost:${PORT}/proxy?url=https://google.com\n`);
  console.log(`✨ All websites will now load inside OrbitX! 🎉\n`);
  console.log(`${'='.repeat(60)}\n`);
});

module.exports = app;
