// Simple Playwright test to verify it works
const { chromium } = require('playwright');

async function testPlaywright() {
  console.log('🚀 Testing Playwright...');
  
  try {
    const browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('✅ Browser launched');
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    console.log('✅ Page created');
    
    console.log('📡 Navigating to Bing...');
    await page.goto('https://www.bing.com/search?q=javascript', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    console.log('📄 Page loaded');
    
    // Wait for results
    await page.waitForTimeout(3000);
    
    // Get page title
    const title = await page.title();
    console.log(`📋 Page title: ${title}`);
    
    // Get page content length
    const content = await page.content();
    console.log(`📊 Page content length: ${content.length}`);
    
    // Check for search results
    const results = await page.$$('li.b_algo');
    console.log(`🔍 Found ${results.length} result elements`);
    
    if (results.length > 0) {
      const firstResult = results[0];
      const titleText = await firstResult.$eval('h2 a', el => el.textContent);
      console.log(`📝 First result title: ${titleText}`);
    }
    
    await browser.close();
    console.log('✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPlaywright();

