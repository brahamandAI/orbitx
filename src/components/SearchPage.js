import React, { useState } from 'react';
import EnhancedSearch from './EnhancedSearch';
import EnhancedSearchResults from './EnhancedSearchResults';
import SearchAnalytics from './SearchAnalytics';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchStart = (query) => {
    setIsSearching(true);
    setSearchQuery(query);
    setSearchResults(null);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleResultClick = (result) => {
    // Track result clicks for analytics
    console.log('Result clicked:', result.title, result.url);
    
    // You can add more tracking logic here
    // For example, send to analytics service
  };

  const tabs = [
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <h1 className="text-xl font-bold text-white">OrbitX Search Engine</h1>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Interface */}
            <EnhancedSearch
              onSearchResults={handleSearchResults}
              onSearchStart={handleSearchStart}
            />

            {/* Search Results */}
            {searchResults && (
              <EnhancedSearchResults
                searchData={searchResults}
                onResultClick={handleResultClick}
              />
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="text-center py-12">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="text-white text-lg">Searching for "{searchQuery}"...</span>
                </div>
                <p className="text-gray-400 mt-2">This may take a few seconds</p>
              </div>
            )}

            {/* Empty State */}
            {!searchResults && !isSearching && (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">🚀</div>
                <h2 className="text-3xl font-bold text-white mb-4">Welcome to OrbitX Search</h2>
                <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                  Your personal search engine with AI-powered insights, advanced filters, 
                  and comprehensive analytics. Start searching to explore the web like never before.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
                    <p className="text-gray-400 text-sm">
                      Get intelligent insights and suggestions powered by advanced AI
                    </p>
                  </div>
                  
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Multiple APIs</h3>
                    <p className="text-gray-400 text-sm">
                      Search across Google, Bing, DuckDuckGo, and more for comprehensive results
                    </p>
                  </div>
                  
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
                    <p className="text-gray-400 text-sm">
                      Track your search patterns and get insights into your search behavior
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <SearchAnalytics />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">OrbitX Search</h3>
              <p className="text-gray-400 text-sm">
                A modern, AI-powered search engine built with React and advanced web technologies.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>AI-Powered Insights</li>
                <li>Advanced Filters</li>
                <li>Search Analytics</li>
                <li>Multiple APIs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">APIs</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Google Custom Search</li>
                <li>Bing Search API</li>
                <li>DuckDuckGo</li>
                <li>SerpAPI</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Technology</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>React 18</li>
                <li>Tailwind CSS</li>
                <li>OpenAI API</li>
                <li>Local Storage</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 OrbitX Search Engine. Built with ❤️ for better search experiences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;
