import React, { useState } from 'react';
import searchService from '../services/searchService';

const SearchDemo = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const searchResults = await searchService.search(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const demoQueries = [
    'JavaScript tutorial',
    'React hooks',
    'Python programming',
    'Machine learning',
    'Web development',
    'Data science',
    'Artificial intelligence',
    'Mobile app development'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          🔍 OrbitX Search Engine Demo
        </h1>
        <p className="text-gray-400 text-lg">
          Search like Google with AI-powered insights and smart results
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex items-center bg-gray-800 rounded-xl border border-gray-700 focus-within:border-blue-500 transition-all duration-200">
          <div className="pl-4 pr-2">
            {isSearching ? (
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search the web with OrbitX..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 py-4 px-2 outline-none"
          />
          
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-r-xl transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Demo Queries */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Try these searches:</h3>
        <div className="flex flex-wrap gap-2">
          {demoQueries.map((demoQuery, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(demoQuery);
                handleSearch();
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {demoQuery}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {results && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-2">
              Search Results for "{results.query}"
            </h2>
            <p className="text-gray-400">
              {results.results.length} results from {results.source}
              {results.note && (
                <span className="ml-2 text-blue-400">• {results.note}</span>
              )}
            </p>
          </div>

          <div className="space-y-4">
            {results.results.map((result, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={result.favicon}
                      alt=""
                      className="w-6 h-6 rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200 mb-2">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {result.title}
                      </a>
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-green-400 text-sm">
                        {new URL(result.url).hostname}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 text-sm">
                        {result.timestamp ? new Date(result.timestamp).toLocaleDateString() : 'Recently'}
                      </span>
                      {result.type && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="text-blue-400 text-xs bg-blue-900 px-2 py-1 rounded">
                            {result.type}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-gray-300">
                      {result.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Suggestion */}
          {results.aiSuggestion && (
            <div className="bg-blue-900 border border-blue-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-200 mb-2">
                🤖 AI Insight
              </h3>
              <p className="text-blue-100">
                {results.aiSuggestion.content}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-2">Real Web Search</h3>
          <p className="text-gray-400 text-sm">
            Get actual web results like Google with smart categorization and filtering.
          </p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
          <p className="text-gray-400 text-sm">
            Smart suggestions, insights, and contextual information for every search.
          </p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
          <p className="text-gray-400 text-sm">
            Track search patterns, popular queries, and user behavior insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchDemo;