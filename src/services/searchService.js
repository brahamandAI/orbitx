// Enhanced Search Service - No API Keys Required
import enhancedWebSearchService from './enhancedWebSearch';
import realWebCrawlerService from './realWebCrawler';
import aiSearchProcessor from './aiSearchProcessor';
import aiService from './aiService';
import smartResultRanker from './smartResultRanker';

class SearchService {
  constructor() {
    // No API keys needed - using enhanced web search service

    // Search analytics and history
    this.searchHistory = this.loadSearchHistory();
    this.searchAnalytics = this.loadSearchAnalytics();
    this.searchSuggestions = this.loadSearchSuggestions();
    
    // Search filters
    this.filters = {
      dateRange: null,
      site: null,
      fileType: null,
      language: 'en',
      safeSearch: 'moderate'
    };
  }

  // Main search method - No API Keys Required
  async search(query, preferredEngine = 'google', startIndex = 1) {
    console.log(`🔍 Enhanced search for: "${query}" using ${preferredEngine} (start: ${startIndex})`);
    
    // Track search analytics
    this.trackSearch(query, preferredEngine);
    
    // Add to search history
    this.addToHistory(query);
    
          try {
            console.log('📡 Calling real web crawler service...');
            console.log('📡 Real crawler service object:', realWebCrawlerService);
            console.log('📡 Real crawler search method:', typeof realWebCrawlerService.search);

            // Use real web crawler service first (no API keys required)
            let enhancedResults = await realWebCrawlerService.search(query, preferredEngine);
            console.log('📡 Real crawler results received:', enhancedResults);
            console.log('📡 Real crawler results type:', typeof enhancedResults);
            console.log('📡 Real crawler results length:', enhancedResults?.results?.length);

            // If real crawler fails, fallback to enhanced search
            if (!enhancedResults || !enhancedResults.results || enhancedResults.results.length === 0) {
              console.log('📡 Real crawler failed, trying enhanced web search...');
              enhancedResults = await enhancedWebSearchService.search(query, preferredEngine);
              console.log('📡 Enhanced results received:', enhancedResults);
            } else {
              console.log('✅ Real crawler provided results, using them!');
            }
      
      if (enhancedResults && enhancedResults.results && enhancedResults.results.length > 0) {
        console.log('✅ Processing results...');
        
        // 🚀 SMART RANKING: Improve result quality WITHOUT API keys!
        console.log('🎯 Applying Smart Result Ranking...');
        const rankedResults = smartResultRanker.improveResults(enhancedResults.results, query);
        console.log('✅ Smart Ranking complete:', rankedResults.length, 'results');
        
        // 🤖 Generate AI insight using OpenAI or fallback
        console.log('🤖 Generating AI insights for search results...');
        const aiInsight = await this.generateAIInsight(query, rankedResults);
        console.log('✅ AI Insight generated:', aiInsight);
        
        // Generate people also ask
        const peopleAlsoAsk = aiSearchProcessor.generatePeopleAlsoAsk(query);
        
        // Categorize results
        const categorizedResults = aiSearchProcessor.categorizeResults(rankedResults);
        
        const finalResult = {
          ...enhancedResults,
          results: rankedResults, // ✅ Use ranked results
          aiSuggestion: aiInsight,
          peopleAlsoAsk: peopleAlsoAsk,
          categorizedResults: categorizedResults,
          startIndex: startIndex,
          hasMore: enhancedResults.hasMore || rankedResults.length >= 10,
          searchSummary: aiSearchProcessor.generateResultSummary(rankedResults),
          smartRanked: true // Indicator that results are ranked
        };
        
        console.log('✅ Final search result with Smart Ranking:', finalResult);
        return finalResult;
      } else {
        console.log('⚠️ No results from enhanced search, using fallback');
      }
    } catch (error) {
      console.error('❌ Enhanced search failed:', error);
    }
    
    // Fallback to local database if all else fails
    console.log('🔄 Using fallback results...');
    const fallbackResult = await this.getEnhancedFallbackResults(query);
    console.log('🔄 Fallback result:', fallbackResult);
    return fallbackResult;
  }
  
  // Simple test method
  async testSearch(query) {
    console.log('🧪 Testing search with query:', query);
    try {
      const result = await this.search(query);
      console.log('🧪 Test result:', result);
      return result;
    } catch (error) {
      console.error('🧪 Test error:', error);
      return null;
    }
  }

  // Generate AI insights for search results using OpenAI or fallback
  async generateAIInsight(query, searchResults) {
    try {
      console.log('🤖 Generating AI insights with real AI service...');
      // Try to use real AI service (OpenAI or Brahamand AI)
      const aiInsights = await aiService.generateSearchInsights(query, searchResults);
      console.log('✅ AI insights generated:', aiInsights);
      
      // Format AI insights for search results
      return {
        content: aiInsights.summary || aiInsights.content,
        source: 'AI-Powered Insights',
        keyPoints: aiInsights.keyPoints || [],
        confidence: aiInsights.confidence || 'high',
        suggestions: aiInsights.suggestions || []
      };
    } catch (error) {
      console.log('⚠️ Real AI failed, using local processor:', error);
      // Fallback to local AI processor
      try {
        const localInsights = aiSearchProcessor.generateSearchInsights(query, searchResults);
        return {
          content: localInsights.summary,
          source: 'Local AI Processor',
          keyPoints: localInsights.keyPoints || [],
          confidence: 'medium'
        };
      } catch (fallbackError) {
        console.error('AI insight generation failed:', fallbackError);
        return {
          content: `Found ${searchResults.length} results for "${query}". Here are the most relevant findings.`,
          source: 'Basic Insights',
          keyPoints: searchResults.slice(0, 3).map(r => r.title),
          confidence: 'medium'
        };
      }
    }
  }
  
  // Keep old method for backward compatibility
  generateMockAIInsight(query, searchResults) {
    return aiSearchProcessor.generateSearchInsights(query, searchResults);
  }

  // Image search - using real web crawler
  async searchImages(query, preferredEngine = 'google', startIndex = 1) {
    console.log(`🖼️ Image search for: "${query}" using ${preferredEngine}`);
    
    try {
      // Try real web crawler first
      const imageResults = await realWebCrawlerService.searchImages(query, preferredEngine);
      if (imageResults && imageResults.images && imageResults.images.length > 0) {
        return imageResults;
      }
      
      // Fallback to enhanced search
      const enhancedImageResults = await enhancedWebSearchService.searchImages(query, preferredEngine);
      return enhancedImageResults;
    } catch (error) {
      console.error('Image search failed:', error);
      return await this.getEnhancedFallbackImages(query);
    }
  }

  // Get search suggestions
  getSearchSuggestions(query, limit = 5) {
    // If no query, return popular/trending suggestions
    if (!query || query.length < 2) {
      const popular = [
        'JavaScript tutorial',
        'React hooks',
        'Python programming',
        'Web development',
        'AI and machine learning',
        'FoodFly',
        'ChitBox',
        'TutorBuddy'
      ];
      return popular.slice(0, limit).map(text => ({ text, type: 'popular' }));
    }
    
    const suggestions = this.searchSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
    
    // Return in format that Toolbar expects: { text, type }
    return suggestions.slice(0, limit).map(text => ({ 
      text, 
      type: 'history' 
    }));
  }

  // Add search suggestion
  addSearchSuggestion(suggestion) {
    if (!this.searchSuggestions.includes(suggestion)) {
      this.searchSuggestions.unshift(suggestion);
      this.searchSuggestions = this.searchSuggestions.slice(0, 100); // Keep only 100 suggestions
      this.saveSearchSuggestions();
    }
  }

  // Search analytics
  trackSearch(query, engine) {
    const searchData = {
      query,
      engine,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    this.searchAnalytics.push(searchData);
    
    // Keep only last 1000 searches
    if (this.searchAnalytics.length > 1000) {
      this.searchAnalytics = this.searchAnalytics.slice(-1000);
    }
    
    this.saveSearchAnalytics();
  }

  // Get search analytics
  getSearchAnalytics() {
    return {
      totalSearches: this.searchAnalytics.length,
      recentSearches: this.searchAnalytics.slice(-10),
      topQueries: this.getTopQueries(),
      engineUsage: this.getEngineUsage()
    };
  }

  // Get top queries
  getTopQueries() {
    const queryCounts = {};
    this.searchAnalytics.forEach(search => {
      queryCounts[search.query] = (queryCounts[search.query] || 0) + 1;
    });
    
    return Object.entries(queryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
  }

  // Get engine usage
  getEngineUsage() {
    const engineCounts = {};
    this.searchAnalytics.forEach(search => {
      engineCounts[search.engine] = (engineCounts[search.engine] || 0) + 1;
    });
    
    return engineCounts;
  }

  // Search history
  addToHistory(query) {
    const historyItem = {
      query,
      timestamp: new Date().toISOString()
    };
    
    // Remove duplicate if exists
    this.searchHistory = this.searchHistory.filter(item => item.query !== query);
    
    // Add to beginning
    this.searchHistory.unshift(historyItem);
    
    // Keep only last 100 searches
    if (this.searchHistory.length > 100) {
    this.searchHistory = this.searchHistory.slice(0, 100);
    }
    
    this.saveSearchHistory();
  }

  // Get search history
  getSearchHistory(limit = 20) {
    return this.searchHistory.slice(0, limit);
  }

  // Clear search history
  clearSearchHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  // Enhanced fallback results (no API needed)
  async getEnhancedFallbackResults(query) {
    console.log('🔄 Using enhanced fallback results');
    
    // Generate mock results based on query
    const mockResults = this.generateMockResults(query);
    
    return {
      query: query,
      results: mockResults,
      totalResults: mockResults.length,
      hasMore: false,
      startIndex: 1,
      source: 'Enhanced Fallback'
    };
  }

  // Generate mock results
  generateMockResults(query) {
    const baseResults = [
      {
        title: `Learn about ${query} - Complete Guide`,
        url: `https://example.com/learn-${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Comprehensive guide to ${query}. Find tutorials, examples, and best practices.`,
        type: 'tutorial'
      },
      {
        title: `${query} Documentation - Official`,
        url: `https://docs.example.com/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Official documentation for ${query}. API reference, guides, and examples.`,
        type: 'documentation'
      },
      {
        title: `${query} Examples and Code Samples`,
        url: `https://github.com/examples/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Practical examples and code samples for ${query}. Open source projects and tutorials.`,
        type: 'examples'
      },
      {
        title: `${query} Community Forum`,
        url: `https://community.example.com/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Join the ${query} community. Ask questions, share knowledge, and get help.`,
        type: 'community'
      },
      {
        title: `${query} Best Practices Guide`,
        url: `https://bestpractices.example.com/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Learn the best practices for ${query}. Tips, tricks, and common pitfalls to avoid.`,
        type: 'guide'
      }
    ];

    return baseResults;
  }

  // Enhanced fallback images
  async getEnhancedFallbackImages(query) {
    console.log('🖼️ Using enhanced fallback images');
    
    const mockImages = [
      {
        title: `${query} - Image 1`,
        url: `https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=${encodeURIComponent(query)}`,
        thumbnail: `https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=${encodeURIComponent(query)}`,
        source: 'Placeholder',
        width: 300,
        height: 200
      },
      {
        title: `${query} - Image 2`,
        url: `https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=${encodeURIComponent(query)}`,
        thumbnail: `https://via.placeholder.com/150x100/7C3AED/FFFFFF?text=${encodeURIComponent(query)}`,
        source: 'Placeholder',
        width: 300,
        height: 200
      },
      {
        title: `${query} - Image 3`,
        url: `https://via.placeholder.com/300x200/059669/FFFFFF?text=${encodeURIComponent(query)}`,
        thumbnail: `https://via.placeholder.com/150x100/059669/FFFFFF?text=${encodeURIComponent(query)}`,
        source: 'Placeholder',
        width: 300,
        height: 200
      }
    ];

    return {
      query: query,
      images: mockImages,
      totalImages: mockImages.length,
      hasMore: false,
      startIndex: 1,
      source: 'Enhanced Fallback Images'
    };
  }

  // Local storage methods
  loadSearchHistory() {
    try {
      const stored = localStorage.getItem('orbitix_search_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveSearchHistory() {
    try {
      localStorage.setItem('orbitix_search_history', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  loadSearchAnalytics() {
    try {
      const stored = localStorage.getItem('orbitix_search_analytics');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveSearchAnalytics() {
    try {
      localStorage.setItem('orbitix_search_analytics', JSON.stringify(this.searchAnalytics));
    } catch (error) {
      console.error('Failed to save search analytics:', error);
    }
  }

  loadSearchSuggestions() {
    try {
      const stored = localStorage.getItem('orbitix_search_suggestions');
      return stored ? JSON.parse(stored) : [
        'javascript tutorial',
        'react components',
        'python programming',
        'css styling',
        'html basics',
        'node.js server',
        'mongodb database',
        'git version control',
        'api development',
        'web design'
      ];
    } catch {
      return [];
    }
  }

  saveSearchSuggestions() {
    try {
      localStorage.setItem('orbitix_search_suggestions', JSON.stringify(this.searchSuggestions));
    } catch (error) {
      console.error('Failed to save search suggestions:', error);
    }
  }
}

const searchService = new SearchService();
export default searchService;