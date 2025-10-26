// API Keys Configuration - Enhanced Self-Contained System
// 🚀 NO EXTERNAL API KEYS REQUIRED!
// This system works completely without external API dependencies
// All search functionality is provided by enhanced web scraping and local AI processing

export const API_KEYS = {
  // Google Custom Search API (Optional - for premium results)
  // Get from: https://console.cloud.google.com/
  GOOGLE_API_KEY: process.env.REACT_APP_GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY_HERE',
  GOOGLE_SEARCH_ENGINE_ID: process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID || 'YOUR_GOOGLE_SEARCH_ENGINE_ID_HERE',
  
  // Bing Search API (Optional - for premium results)
  // Get from: https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/
  BING_API_KEY: process.env.REACT_APP_BING_API_KEY || 'YOUR_BING_API_KEY_HERE',
  
  // SerpAPI (Optional - for premium results)
  // Get from: https://serpapi.com/
  SERPAPI_KEY: process.env.REACT_APP_SERPAPI_KEY || 'YOUR_SERPAPI_KEY_HERE',
  
  // DuckDuckGo - No API key needed (Free) - PRIMARY SEARCH METHOD
  DUCKDUCKGO_ENABLED: true,
  
  // OpenAI API (Optional - for enhanced AI features)
  // Get from: https://platform.openai.com/api-keys
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || '',
  
  // Brahamand AI API (Primary AI Service)
  // Get from: https://brahamand.ai
  BRAHAMAND_AI_API_KEY: process.env.REACT_APP_BRAHAMAND_AI_API_KEY || '',
  BRAHAMAND_AI_BASE_URL: process.env.REACT_APP_BRAHAMAND_AI_BASE_URL || 'https://api.brahamand.ai',
  
  // Enhanced Web Search - No API key needed (PRIMARY METHOD)
  ENHANCED_WEB_SEARCH_ENABLED: true,
  
  // Local AI Processing - No API key needed (PRIMARY METHOD)
  LOCAL_AI_PROCESSING_ENABLED: true
};

// Enhanced API Status Check
export const checkApiKeys = () => {
  const status = {
    // Primary methods (no API keys needed)
    enhancedWebSearch: API_KEYS.ENHANCED_WEB_SEARCH_ENABLED,
    localAIProcessing: API_KEYS.LOCAL_AI_PROCESSING_ENABLED,
    duckduckgo: API_KEYS.DUCKDUCKGO_ENABLED,
    
    // Optional premium methods
    google: API_KEYS.GOOGLE_API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE',
    bing: API_KEYS.BING_API_KEY !== 'YOUR_BING_API_KEY_HERE',
    serpapi: API_KEYS.SERPAPI_KEY !== 'YOUR_SERPAPI_KEY_HERE',
    openai: API_KEYS.OPENAI_API_KEY && API_KEYS.OPENAI_API_KEY.startsWith('sk-'),
    brahamandAI: API_KEYS.BRAHAMAND_AI_API_KEY && API_KEYS.BRAHAMAND_AI_API_KEY.length > 0
  };
  
  console.log('🔑 Enhanced Search System Status:', status);
  console.log('✅ Primary search methods are active (no API keys required)');
  console.log('💡 Optional premium methods available with API keys');
  return status;
};

export default API_KEYS;
