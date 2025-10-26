import React, { useState, useEffect, useCallback } from 'react';
import searchService from '../services/searchService';

const HistoryPage = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list'); // list or grid

  const loadHistory = () => {
    const history = searchService.getSearchHistory(100);
    setSearchHistory(history);
  };

  const filterHistory = useCallback(() => {
    let filtered = [...searchHistory];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.query.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (selectedDate) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          filterDate.setDate(now.getDate() - 1);
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }

      if (selectedDate !== 'all') {
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.timestamp);
          return itemDate >= filterDate;
        });
      }
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredHistory(filtered);
  }, [searchHistory, searchTerm, selectedDate, sortBy]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [filterHistory]);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all search history?')) {
      searchService.clearSearchHistory();
      setSearchHistory([]);
      setFilteredHistory([]);
    }
  };

  const deleteItem = (index) => {
    if (window.confirm('Delete this search from history?')) {
      const newHistory = searchHistory.filter((_, i) => i !== index);
      setSearchHistory(newHistory);
      localStorage.setItem('orbitix_search_history', JSON.stringify(newHistory));
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSearchIcon = (query) => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('youtube') || lowerQuery.includes('video')) return '🎥';
    if (lowerQuery.includes('github') || lowerQuery.includes('code')) return '💻';
    if (lowerQuery.includes('news') || lowerQuery.includes('article')) return '📰';
    if (lowerQuery.includes('shopping') || lowerQuery.includes('buy')) return '🛒';
    if (lowerQuery.includes('weather')) return '🌤️';
    if (lowerQuery.includes('map') || lowerQuery.includes('location')) return '🗺️';
    if (lowerQuery.includes('image') || lowerQuery.includes('photo')) return '🖼️';
    return '🔍';
  };

  // Group history by date
  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = formatDate(item.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div className="h-full flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📚</span>
            </div>
            <h1 className="text-2xl font-black text-white">History</h1>
          </div>

          {/* Filter by Date */}
          <div className="space-y-2 mb-6">
            <p className="text-gray-400 text-sm font-bold mb-2">FILTER BY DATE</p>
            {[
              { value: 'all', label: 'All Time', icon: '📅' },
              { value: 'today', label: 'Today', icon: '☀️' },
              { value: 'yesterday', label: 'Yesterday', icon: '🌙' },
              { value: 'week', label: 'Last 7 Days', icon: '📆' },
              { value: 'month', label: 'Last Month', icon: '📊' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setSelectedDate(filter.value)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  selectedDate === filter.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-lg">{filter.icon}</span>
                <span className="font-medium">{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="space-y-2 mb-6">
            <p className="text-gray-400 text-sm font-bold mb-2">SORT BY</p>
            {[
              { value: 'newest', label: 'Newest First', icon: '⬇️' },
              { value: 'oldest', label: 'Oldest First', icon: '⬆️' }
            ].map(sort => (
              <button
                key={sort.value}
                onClick={() => setSortBy(sort.value)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  sortBy === sort.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-lg">{sort.icon}</span>
                <span className="font-medium">{sort.label}</span>
              </button>
            ))}
          </div>

          {/* Clear History Button */}
          <button
            onClick={clearHistory}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear All History</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-black text-white mb-4">Search History</h2>
            
            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search in history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-4 pl-12 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
                <svg className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-gray-400 mt-4">
              {filteredHistory.length} {filteredHistory.length === 1 ? 'search' : 'searches'} found
            </p>
          </div>

          {/* History Items */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                <span className="text-6xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No History Found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try a different search term' : 'Your search history will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date}>
                  <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>{date}</span>
                  </h3>

                  {viewMode === 'list' ? (
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                              <span className="text-3xl">{getSearchIcon(item.query)}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-lg truncate">{item.query}</p>
                                <p className="text-gray-400 text-sm">{formatTime(item.timestamp)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteItem(index)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all group text-center"
                        >
                          <span className="text-5xl mb-3 block">{getSearchIcon(item.query)}</span>
                          <p className="text-white font-medium mb-2 truncate">{item.query}</p>
                          <p className="text-gray-400 text-sm">{formatTime(item.timestamp)}</p>
                          <button
                            onClick={() => deleteItem(index)}
                            className="mt-3 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
