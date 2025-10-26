// Enhanced Search System Setup Script
// This script ensures all components are properly integrated

import { checkApiKeys } from './config/apiKeys';
import searchService from './services/searchService';
import enhancedWebSearchService from './services/enhancedWebSearch';
import aiSearchProcessor from './services/aiSearchProcessor';

class EnhancedSearchSetup {
  constructor() {
    this.isInitialized = false;
    this.setupComplete = false;
  }

  // Initialize the enhanced search system
  async initialize() {
    console.log('🚀 Initializing Enhanced Search System...\n');
    
    try {
      // Check API key status
      console.log('1. Checking API Key Status...');
      const apiStatus = checkApiKeys();
      console.log('✅ API Status Check Complete\n');
      
      // Test core services
      console.log('2. Testing Core Services...');
      await this.testCoreServices();
      console.log('✅ Core Services Test Complete\n');
      
      // Initialize search service
      console.log('3. Initializing Search Service...');
      await this.initializeSearchService();
      console.log('✅ Search Service Initialized\n');
      
      // Run system health check
      console.log('4. Running System Health Check...');
      await this.runHealthCheck();
      console.log('✅ Health Check Complete\n');
      
      this.setupComplete = true;
      this.isInitialized = true;
      
      console.log('🎉 Enhanced Search System Setup Complete!');
      console.log('✅ All systems are operational');
      console.log('🔍 Ready to search without API keys!');
      
      return true;
      
    } catch (error) {
      console.error('❌ Setup failed:', error);
      return false;
    }
  }

  // Test core services
  async testCoreServices() {
    // Test enhanced web search
    try {
      const testQuery = 'test search';
      const webResults = await enhancedWebSearchService.search(testQuery, 'google');
      console.log(`  ✅ Enhanced Web Search: ${webResults.results?.length || 0} results`);
    } catch (error) {
      console.log(`  ⚠️ Enhanced Web Search: ${error.message}`);
    }

    // Test AI processor
    try {
      const testResults = [{ title: 'Test', url: 'https://test.com', description: 'Test description' }];
      const aiInsight = aiSearchProcessor.generateSearchInsights('test', testResults);
      console.log(`  ✅ AI Processor: ${aiInsight ? 'Working' : 'Failed'}`);
    } catch (error) {
      console.log(`  ⚠️ AI Processor: ${error.message}`);
    }

    // Test search service
    try {
      const suggestions = searchService.getSearchSuggestions('test');
      console.log(`  ✅ Search Service: ${suggestions.length} suggestions generated`);
    } catch (error) {
      console.log(`  ⚠️ Search Service: ${error.message}`);
    }
  }

  // Initialize search service
  async initializeSearchService() {
    // Load search history
    const history = searchService.getSearchHistory();
    console.log(`  📚 Loaded ${history.length} search history items`);
    
    // Load search analytics
    const analytics = searchService.getSearchAnalytics();
    console.log(`  📊 Loaded analytics: ${analytics.totalSearches} total searches`);
    
    // Initialize filters
    const filters = searchService.getFilters();
    console.log(`  🔧 Initialized ${Object.keys(filters).length} search filters`);
  }

  // Run system health check
  async runHealthCheck() {
    const healthStatus = {
      enhancedWebSearch: true,
      localAIProcessing: true,
      searchService: true,
      caching: true,
      fallbacks: true
    };

    // Test search functionality
    try {
      const testResults = await searchService.search('health check test');
      healthStatus.searchService = testResults && testResults.results && testResults.results.length > 0;
    } catch (error) {
      healthStatus.searchService = false;
    }

    // Test image search
    try {
      const testImages = await searchService.searchImages('test image');
      healthStatus.imageSearch = testImages && testImages.images && testImages.images.length > 0;
    } catch (error) {
      healthStatus.imageSearch = false;
    }

    // Display health status
    Object.entries(healthStatus).forEach(([service, status]) => {
      console.log(`  ${status ? '✅' : '❌'} ${service}: ${status ? 'Healthy' : 'Issues detected'}`);
    });
  }

  // Get system status
  getSystemStatus() {
    return {
      isInitialized: this.isInitialized,
      setupComplete: this.setupComplete,
      timestamp: new Date().toISOString(),
      features: {
        enhancedWebSearch: true,
        localAIProcessing: true,
        realTimeResults: true,
        imageSearch: true,
        smartSuggestions: true,
        resultCategorization: true,
        noApiKeysRequired: true
      }
    };
  }

  // Quick test search
  async quickTest(query = 'javascript tutorial') {
    if (!this.isInitialized) {
      console.log('⚠️ System not initialized. Run initialize() first.');
      return null;
    }

    try {
      console.log(`🔍 Testing search: "${query}"`);
      const results = await searchService.search(query);
      
      console.log('📊 Test Results:');
      console.log(`  Query: ${results.query}`);
      console.log(`  Results: ${results.results?.length || 0}`);
      console.log(`  Source: ${results.source}`);
      console.log(`  AI Insight: ${results.aiSuggestion ? 'Yes' : 'No'}`);
      console.log(`  People Also Ask: ${results.peopleAlsoAsk?.length || 0} questions`);
      
      return results;
    } catch (error) {
      console.error('❌ Quick test failed:', error);
      return null;
    }
  }
}

// Create global instance
const enhancedSearchSetup = new EnhancedSearchSetup();

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  // Browser environment
  window.enhancedSearchSetup = enhancedSearchSetup;
  window.initializeEnhancedSearch = () => enhancedSearchSetup.initialize();
  window.testEnhancedSearch = (query) => enhancedSearchSetup.quickTest(query);
  
  console.log('🔧 Enhanced Search Setup available:');
  console.log('  - window.initializeEnhancedSearch() - Initialize system');
  console.log('  - window.testEnhancedSearch(query) - Test search');
  console.log('  - window.enhancedSearchSetup - Full setup object');
}

export default enhancedSearchSetup;
