import React, { useState, useEffect, useRef } from 'react';
import searchService from '../services/searchService';

const EnhancedSearch = ({ onSearchResults, onSearchStart }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(searchService.getFilters());
  const [selectedApi, setSelectedApi] = useState('duckduckgo');
  const [searchAnalytics, setSearchAnalytics] = useState(null);
  
  const searchInputRef = useRef(null);
  const suggestionRefs = useRef([]);

  useEffect(() => {
    loadSearchData();
  }, []);

  const loadSearchData = () => {
    setSearchHistory(searchService.getSearchHistory(10));
    setSearchAnalytics(searchService.getSearchAnalytics());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      const newSuggestions = searchService.getSearchSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async (searchQuery = query, api = selectedApi) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    
    if (onSearchStart) {
      onSearchStart(searchQuery);
    }

    try {
      let results;
      
      // Check if filters are applied
      const hasFilters = Object.values(filters).some(value => value !== null && value !== 'en' && value !== 'moderate');
      
      if (hasFilters) {
        results = await searchService.searchWithFilters(searchQuery, api);
      } else {
        // Use combined search to get both web and image results
        results = await searchService.searchAll(searchQuery, api);
      }
      
      // Cluster results for better organization
      const clusteredResults = searchService.clusterResults(results.webResults?.results || results.results || []);
      
      if (onSearchResults) {
        onSearchResults({
          ...results,
          results: results.webResults?.results || results.results || [],
          clusteredResults,
          searchTime: Date.now()
        });
      }
      
      // Refresh search data
      loadSearchData();
      
    } catch (error) {
      console.error('Search error:', error);
      if (onSearchResults) {
        onSearchResults({
          query: searchQuery,
          results: [],
          error: 'Search failed. Please try again.',
          source: api
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setShowSuggestions(true);
        suggestionRefs.current[0]?.focus();
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    handleSearch(suggestion.text);
  };

  const handleHistoryClick = (historyItem) => {
    setQuery(historyItem.query);
    setShowSuggestions(false);
    handleSearch(historyItem.query);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    searchService.setFilter(filterType, value);
  };

  const clearFilters = () => {
    searchService.clearFilters();
    setFilters(searchService.getFilters());
  };

  const clearHistory = () => {
    searchService.clearSearchHistory();
    setSearchHistory([]);
  };

  const apiOptions = [
    { value: 'duckduckgo', label: 'DuckDuckGo', icon: '🦆' },
    { value: 'google', label: 'Google', icon: '🔍' },
    { value: 'bing', label: 'Bing', icon: '🔎' },
    { value: 'serpapi', label: 'SerpAPI', icon: '⚡' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-gray-800 rounded-xl border border-gray-700 focus-within:border-blue-500 transition-all duration-200">
          {/* Search Icon */}
          <div className="pl-4 pr-2">
            {isSearching ? (
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search the web with OrbitX..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 py-4 px-2 outline-none"
          />

          {/* API Selector */}
          <div className="px-2">
            <select
              value={selectedApi}
              onChange={(e) => setSelectedApi(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded-lg px-2 py-1 border border-gray-600 focus:border-blue-500 outline-none"
            >
              {apiOptions.map(api => (
                <option key={api.value} value={api.value}>
                  {api.icon} {api.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-r-xl transition-colors duration-200"
          >
            Search
          </button>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2 p-2 text-gray-400 hover:text-white transition-colors duration-200"
            title="Search Filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <h3 className="text-sm font-medium text-gray-300">Recent Searches</h3>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Clear
                  </button>
                </div>
                {searchHistory.slice(0, 5).map((item, index) => (
                  <button
                    key={item.id}
                    ref={el => suggestionRefs.current[index] = el}
                    onClick={() => handleHistoryClick(item)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white">{item.query}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-300 px-3 py-2">Suggestions</h3>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    ref={el => suggestionRefs.current[searchHistory.length + index] = el}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <span className="text-blue-400 mr-3">
                      {suggestion.type === 'history' ? '🕒' : '🔥'}
                    </span>
                    <span className="text-white">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="mt-4 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Search Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
              <select
                value={filters.dateRange || ''}
                onChange={(e) => handleFilterChange('dateRange', e.target.value || null)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 outline-none"
              >
                <option value="">Any time</option>
                <option value="past24h">Past 24 hours</option>
                <option value="pastWeek">Past week</option>
                <option value="pastMonth">Past month</option>
                <option value="pastYear">Past year</option>
              </select>
            </div>

            {/* Site Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Site</label>
              <input
                type="text"
                value={filters.site || ''}
                onChange={(e) => handleFilterChange('site', e.target.value || null)}
                placeholder="e.g., wikipedia.org"
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 outline-none"
              />
            </div>

            {/* File Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">File Type</label>
              <select
                value={filters.fileType || ''}
                onChange={(e) => handleFilterChange('fileType', e.target.value || null)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 outline-none"
              >
                <option value="">Any type</option>
                <option value="pdf">PDF</option>
                <option value="doc">Word Document</option>
                <option value="ppt">PowerPoint</option>
                <option value="xls">Excel</option>
                <option value="txt">Text File</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Analytics (if available) */}
      {searchAnalytics && searchAnalytics.totalSearches > 0 && (
        <div className="mt-4 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Search Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{searchAnalytics.totalSearches}</div>
              <div className="text-sm text-gray-400">Total Searches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{Object.keys(searchAnalytics.searchesByAPI).length}</div>
              <div className="text-sm text-gray-400">APIs Used</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{searchAnalytics.popularQueries.length}</div>
              <div className="text-sm text-gray-400">Unique Queries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{searchHistory.length}</div>
              <div className="text-sm text-gray-400">History Items</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;
