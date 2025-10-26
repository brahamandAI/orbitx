import React, { useState, useEffect } from 'react';
import searchService from '../services/searchService'; // ✅ Using main searchService with Smart Ranking + AI
import ImageSearchResults from './ImageSearchResults';

const EnhancedSearchResults = ({ searchData, onResultClick, onLoadMore }) => {
  const [clusteredResults, setClusteredResults] = useState(null);
  const [activeCluster, setActiveCluster] = useState('all');
  const [resultPreviews, setResultPreviews] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentSearchData, setCurrentSearchData] = useState(null);

  useEffect(() => {
    console.log('🔍 EnhancedSearchResults - Search data received:', searchData);
    console.log('🔍 Search data type:', typeof searchData);
    console.log('🔍 Search data keys:', searchData ? Object.keys(searchData) : 'No data');
    console.log('🔍 Results array:', searchData?.results);
    console.log('🔍 Results length:', searchData?.results?.length);
    
    if (searchData) {
      setCurrentSearchData(searchData);
      if (searchData.clusteredResults) {
        console.log('🔍 Setting clustered results:', searchData.clusteredResults);
        setClusteredResults(searchData.clusteredResults);
      } else if (searchData.categorizedResults) {
        console.log('🔍 Using categorized results as clustered results:', searchData.categorizedResults);
        setClusteredResults(searchData.categorizedResults);
      }
    }
  }, [searchData]);

  const handleResultClick = async (result) => {
    console.log('🔗 Result clicked:', result);
    
    // Track click analytics
    console.log('Result clicked:', result.title);
    
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Default behavior - open in new tab (external)
      window.open(result.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return null;
    }
  };

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const getResultPreview = async (url) => {
    if (resultPreviews[url]) return resultPreviews[url];
    
    try {
      const preview = await searchService.getResultPreview(url);
      if (preview) {
        setResultPreviews(prev => ({ ...prev, [url]: preview }));
      }
    } catch (error) {
      console.error('Preview fetch failed:', error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getClusterIcon = (clusterName) => {
    const icons = {
      general: '🌐',
      news: '📰',
      videos: '🎥',
      images: '🖼️',
      academic: '🎓',
      shopping: '🛒'
    };
    return icons[clusterName] || '📄';
  };

  // eslint-disable-next-line no-unused-vars
  const getClusterTitle = (clusterName) => {
    const titles = {
      general: 'General Results',
      news: 'News & Articles',
      videos: 'Videos',
      images: 'Images',
      academic: 'Academic Sources',
      shopping: 'Shopping'
    };
    return titles[clusterName] || clusterName;
  };

  const getResultsToShow = () => {
    if (!clusteredResults) return [];
    
    if (activeCluster === 'all') {
      return Object.values(clusteredResults).flat();
    }
    
    return clusteredResults[activeCluster] || [];
  };

  const hasMoreResults = () => {
    if (activeCluster === 'images' && currentSearchData?.imageResults) {
      return currentSearchData.imageResults.hasMore;
    } else if (currentSearchData?.webResults) {
      return currentSearchData.webResults.hasMore;
    } else if (currentSearchData) {
      return currentSearchData.hasMore;
    }
    return false;
  };

  const handleImageClick = (image) => {
    console.log('Image clicked:', image.title);
    // Track image click analytics
  };

  const handleLoadMore = async () => {
    if (!currentSearchData || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      if (activeCluster === 'images' && currentSearchData.imageResults) {
        // Load more images
        const moreImageResults = await searchService.loadMoreImageResults(
          currentSearchData.query,
          currentSearchData.source?.replace(' (Combined)', '') || 'duckduckgo',
          currentSearchData.imageResults
        );
        
        setCurrentSearchData(prev => ({
          ...prev,
          imageResults: moreImageResults
        }));
      } else {
        // Load more web results
        const moreWebResults = await searchService.loadMoreWebResults(
          currentSearchData.query,
          currentSearchData.source?.replace(' (Combined)', '') || 'duckduckgo',
          currentSearchData.webResults || currentSearchData
        );
        
        const newClusteredResults = searchService.clusterResults(moreWebResults.results);
        
        setCurrentSearchData(prev => ({
          ...prev,
          webResults: moreWebResults,
          results: moreWebResults.results,
          clusteredResults: newClusteredResults
        }));
        
        setClusteredResults(newClusteredResults);
      }
      
      if (onLoadMore) {
        onLoadMore();
      }
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const generateRelatedQuestions = (query) => {
    const questions = [
      `What is ${query}?`,
      `How does ${query} work?`,
      `Why is ${query} important?`,
      `What are the benefits of ${query}?`,
      `How to use ${query}?`,
      `What are the best practices for ${query}?`,
      `Where can I learn more about ${query}?`
    ];
    
    return questions.slice(0, 4); // Show 4 questions like Google
  };

  const getClusterCounts = () => {
    if (!clusteredResults) return {};
    
    const counts = {};
    Object.keys(clusteredResults).forEach(cluster => {
      counts[cluster] = clusteredResults[cluster].length;
    });
    return counts;
  };

  if (!searchData) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-lg">No search data available</div>
      </div>
    );
  }

  console.log('🔍 EnhancedSearchResults - Final check:', {
    hasResults: !!searchData.results,
    resultsLength: searchData.results?.length,
    searchDataKeys: Object.keys(searchData),
    searchData: searchData
  });

  if (!searchData.results || searchData.results.length === 0) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-lg">No results found for your search</div>
        <div className="text-gray-500 text-sm mt-2">Debug: {JSON.stringify(searchData, null, 2)}</div>
      </div>
    );
  }

  const clusterCounts = getClusterCounts();
  const resultsToShow = getResultsToShow();

  // Handle image search results
  if (activeCluster === 'images' && currentSearchData?.imageResults) {
    return (
      <ImageSearchResults
        imageData={currentSearchData.imageResults}
        onImageClick={handleImageClick}
        onLoadMore={handleLoadMore}
      />
    );
  }

  // Google-style search filter tabs
  const searchFilters = [
    { key: 'all', label: 'All', icon: '🔍' },
    { key: 'images', label: 'Images', icon: '🖼️' },
    { key: 'videos', label: 'Videos', icon: '🎥' },
    { key: 'news', label: 'News', icon: '📰' },
    { key: 'shopping', label: 'Shopping', icon: '🛒' },
    { key: 'academic', label: 'Books', icon: '📚' }
  ];

  return (
    <div className="flex-1 bg-gray-900 overflow-y-auto">
      {/* Google-style Search Filter Bar */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-1 overflow-x-auto py-3 scrollbar-hide">
            {searchFilters.map(filter => {
              const count = filter.key === 'all' 
                ? searchData.results.length 
                : (clusterCounts[filter.key] || 0);
              
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveCluster(filter.key)}
                  disabled={count === 0 && filter.key !== 'all'}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                    activeCluster === filter.key
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                      : count > 0 || filter.key === 'all'
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="text-lg">{filter.icon}</span>
                  <span className="font-medium">{filter.label}</span>
                  {count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeCluster === filter.key 
                        ? 'bg-blue-700' 
                        : 'bg-gray-600 text-gray-200'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto mt-6 px-4">
      {/* Search Info - Google Style */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-300">
            About {searchData.results.length} results ({searchData.searchTime ? `${Date.now() - searchData.searchTime}ms` : '0.5s'})
          </div>
          {searchData.note && (
            <div className="text-xs text-blue-400">
              {searchData.note}
            </div>
          )}
          <div className="flex items-center space-x-2">
            {searchData.smartRanked && (
              <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                🎯 Smart Ranked
              </span>
            )}
            {searchData.crawled && (
              <span className="bg-green-900 text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                🕷️ Real Crawled
              </span>
            )}
            <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
              🌐 Internet Search
            </span>
          </div>
        </div>
        
        {searchData.aiSuggestion && (
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50 rounded-xl p-5 mb-6 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-bold text-white">ब्रह्मांड AI Insight</h3>
                  {searchData.aiSuggestion.source && (
                    <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                      {searchData.aiSuggestion.source}
                    </span>
                  )}
                  {searchData.aiSuggestion.confidence === 'high' && (
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                      ⭐ High Confidence
                    </span>
                  )}
                </div>
                <div className="text-base text-blue-100 leading-relaxed mb-3">
                  {searchData.aiSuggestion.content || searchData.aiSuggestion.summary}
                </div>
                {searchData.aiSuggestion.suggestions && searchData.aiSuggestion.suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-500/30">
                    <div className="text-xs font-medium text-purple-300 mb-2">💡 Related Suggestions:</div>
                    <div className="flex flex-wrap gap-2">
                      {searchData.aiSuggestion.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="bg-purple-800/40 hover:bg-purple-700/60 text-purple-200 px-3 py-1 rounded-full text-xs transition-colors duration-200"
                          onClick={() => window.location.href = `/?q=${encodeURIComponent(suggestion)}`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>


      {/* People Also Ask Section */}
      {searchData.peopleAlsoAsk && searchData.peopleAlsoAsk.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <span>❓</span>
            <span>People also ask</span>
          </h3>
          <div className="space-y-3">
            {searchData.peopleAlsoAsk.map((item, index) => (
              <PeopleAlsoAskItem 
                key={index} 
                question={typeof item === 'string' ? item : item.question}
                answer={typeof item === 'object' ? item.answer : null}
                searchQuery={searchData.query}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Summary */}
      {searchData.searchSummary && (
        <div className="mb-6 bg-blue-900/20 border border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <div className="text-blue-400 text-sm">📊</div>
            <div>
              <div className="text-sm font-medium text-blue-200">Search Summary</div>
              <div className="text-sm text-blue-300 mt-1">
                {searchData.searchSummary}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {resultsToShow.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          resultsToShow.map((result, index) => (
            <SearchResultCard
              key={`${result.url}-${index}`}
              result={result}
              onClick={() => handleResultClick(result)}
              onPreview={() => getResultPreview(result.url)}
              preview={resultPreviews[result.url]}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {resultsToShow.length > 0 && hasMoreResults() && (
        <div className="text-center mt-8">
          <button 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors duration-200 flex items-center mx-auto space-x-2"
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Loading More...</span>
              </>
            ) : (
              <>
                <span>Load More Results</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

// People Also Ask Item Component
const PeopleAlsoAskItem = ({ question, answer, searchQuery }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiAnswer, setAiAnswer] = useState(answer || null);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

  const handleToggle = async () => {
    if (!isExpanded && !aiAnswer) {
      // Generate answer when expanding for the first time
      setIsLoadingAnswer(true);
      try {
        // Smart answer based on question
        const smartAnswer = generateSmartAnswer(question, searchQuery);
        setAiAnswer(smartAnswer);
      } catch (error) {
        console.error('Failed to generate answer:', error);
      } finally {
        setIsLoadingAnswer(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

  const handleSearchClick = () => {
    // Trigger new search with this question
    window.location.href = `/?q=${encodeURIComponent(question)}`;
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden hover:border-gray-500 transition-all duration-200">
      <button
        onClick={handleToggle}
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200"
      >
        <span className="text-gray-200 font-medium flex-1">{question}</span>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="px-5 py-4 bg-gray-750 border-t border-gray-600">
          {isLoadingAnswer ? (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
              <span className="text-sm">Generating answer...</span>
            </div>
          ) : (
            <>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {aiAnswer}
              </p>
              <button
                onClick={handleSearchClick}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
              >
                <span>🔍 Search for this</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Generate smart answer for People Also Ask questions
const generateSmartAnswer = (question, originalQuery) => {
  const questionLower = question.toLowerCase();
  
  // What is questions
  if (questionLower.startsWith('what is')) {
    return `${originalQuery} is a popular topic with multiple aspects. Based on the search results above, you can find comprehensive information about its definition, features, and use cases. Click the results above to learn more.`;
  }
  
  // How does questions
  if (questionLower.startsWith('how does') || questionLower.startsWith('how to')) {
    return `The search results above provide detailed guides and tutorials on how ${originalQuery} works. Look for step-by-step instructions, video tutorials, and practical examples in the results above.`;
  }
  
  // Why questions
  if (questionLower.startsWith('why')) {
    return `Understanding why ${originalQuery} is important helps you make better decisions. The articles and resources above explain the benefits, use cases, and reasons for choosing ${originalQuery}.`;
  }
  
  // Benefits questions
  if (questionLower.includes('benefit')) {
    return `The search results highlight various advantages and benefits of ${originalQuery}. Check the top results for detailed comparisons, user reviews, and expert opinions on its value.`;
  }
  
  // Learning questions
  if (questionLower.includes('learn') || questionLower.includes('tutorial')) {
    return `To learn ${originalQuery}, start with the educational resources in the results above. Look for beginner tutorials, documentation, and hands-on courses that match your skill level.`;
  }
  
  // Best practices questions
  if (questionLower.includes('best')) {
    return `For best practices with ${originalQuery}, refer to the expert guides and documentation in the search results. You'll find industry standards, tips from professionals, and proven approaches.`;
  }
  
  // Default answer
  return `This is a frequently asked question about ${originalQuery}. The search results above contain detailed information to answer this question. Browse through the top results for comprehensive insights.`;
};

const SearchResultCard = ({ result, onClick, onPreview, preview }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewToggle = () => {
    if (!preview && onPreview) {
      onPreview();
    }
    setShowPreview(!showPreview);
  };

  const getDomainFromUrl = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const resultTime = new Date(timestamp);
    const diffInHours = Math.floor((now - resultTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return resultTime.toLocaleDateString();
  };

  const getResultTypeIcon = (type) => {
    const icons = {
      'encyclopedia': '📚',
      'news': '📰',
      'documentation': '📖',
      'code': '💻',
      'shopping': '🛒',
      'guide': '📋',
      'community': '👥',
      'video': '🎥',
      'academic': '🎓',
      'qa': '❓'
    };
    return icons[type] || '🌐';
  };

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 hover:shadow-lg hover:border-gray-500 transition-all duration-200 group">
      {/* Main Result Content */}
      <div className="flex items-start space-x-3">
        {/* Favicon */}
        <div className="flex-shrink-0 mt-1">
          <img
            src={getFaviconUrl(result.url)}
            alt=""
            className="w-4 h-4 rounded-sm"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Result Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* URL and Type */}
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-green-400 text-sm">
                  {getDomainFromUrl(result.url)}
                </span>
                {result.official && (
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center space-x-1">
                    <span>✓</span>
                    <span>Official</span>
                  </span>
                )}
                {result.score && result.score >= 500 && (
                  <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    ⭐ Top Result
                  </span>
                )}
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 text-sm">
                  {getTimeAgo(result.timestamp)}
                </span>
                {result.crawled && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded-full text-xs font-medium">
                      🕷️ Real
                    </span>
                  </>
                )}
                {result.type && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center space-x-1 text-blue-400 text-xs">
                      <span>{getResultTypeIcon(result.type)}</span>
                      <span className="capitalize">{result.type}</span>
                    </span>
                  </>
                )}
              </div>
              
              {/* Title */}
              <h3 className="text-lg text-blue-400 hover:text-blue-300 hover:underline cursor-pointer line-clamp-2 mb-2">
                <span onClick={onClick}>
                  {result.title}
                </span>
              </h3>
              
              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                {result.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={handlePreviewToggle}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors duration-200"
                title="Preview"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors duration-200"
                title="Bookmark"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && preview && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <div className="flex items-start space-x-4">
            {preview.image && (
              <img
                src={preview.image}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-2">{preview.title}</h4>
              <p className="text-gray-300 text-sm">{preview.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Related Links (if available) */}
      {result.related && result.related.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Related Links:</h4>
          <div className="flex flex-wrap gap-2">
            {result.related.slice(0, 3).map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm hover:underline"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchResults;
