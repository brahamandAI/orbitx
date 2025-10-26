import React, { useState, useEffect } from 'react';
import searchService from '../services/searchService';

const SearchAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = () => {
    setIsLoading(true);
    const data = searchService.getSearchAnalytics();
    setAnalytics(data);
    setIsLoading(false);
  };

  // eslint-disable-next-line no-unused-vars
  const getTimeRangeLabel = (range) => {
    const labels = {
      '24h': 'Last 24 Hours',
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      'all': 'All Time'
    };
    return labels[range] || range;
  };

  const getPopularQueriesChart = () => {
    if (!analytics || !analytics.popularQueries) return null;

    const maxCount = Math.max(...analytics.popularQueries.map(([, count]) => count));
    
    return (
      <div className="space-y-2">
        {analytics.popularQueries.slice(0, 8).map(([query, count], index) => (
          <div key={query} className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-medium truncate">{query}</span>
                <span className="text-gray-400 text-sm">{count} searches</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getAPIDistributionChart = () => {
    if (!analytics || !analytics.searchesByAPI) return null;

    const total = Object.values(analytics.searchesByAPI).reduce((sum, count) => sum + count, 0);
    const apiData = Object.entries(analytics.searchesByAPI).map(([api, count]) => ({
      api,
      count,
      percentage: (count / total) * 100
    }));

    const colors = {
      'duckduckgo': 'bg-yellow-500',
      'google': 'bg-blue-500',
      'bing': 'bg-green-500',
      'serpapi': 'bg-purple-500'
    };

    return (
      <div className="space-y-3">
        {apiData.map(({ api, count, percentage }) => (
          <div key={api} className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${colors[api] || 'bg-gray-500'}`}></div>
              <span className="text-white text-sm font-medium capitalize">{api}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 text-sm">{count} searches</span>
                <span className="text-gray-400 text-sm">{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`${colors[api] || 'bg-gray-500'} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getSearchTrends = () => {
    // This would typically come from a backend with time-series data
    const mockTrends = [
      { day: 'Mon', searches: 12 },
      { day: 'Tue', searches: 18 },
      { day: 'Wed', searches: 15 },
      { day: 'Thu', searches: 22 },
      { day: 'Fri', searches: 28 },
      { day: 'Sat', searches: 8 },
      { day: 'Sun', searches: 5 }
    ];

    const maxSearches = Math.max(...mockTrends.map(t => t.searches));

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Search Trends</h3>
          <div className="text-sm text-gray-400">Last 7 days</div>
        </div>
        
        <div className="flex items-end space-x-2 h-32">
          {mockTrends.map((trend, index) => (
            <div key={trend.day} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-700 rounded-t mb-2 relative group">
                <div
                  className="bg-blue-500 rounded-t transition-all duration-500 group-hover:bg-blue-400"
                  style={{ height: `${(trend.searches / maxSearches) * 100}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {trend.searches} searches
                </div>
              </div>
              <span className="text-gray-400 text-xs">{trend.day}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!analytics || analytics.totalSearches === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Search Data Yet</h3>
        <p className="text-gray-400">Start searching to see analytics and insights</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Search Analytics</h1>
            <p className="text-gray-400 mt-2">Insights and trends from your search activity</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 outline-none"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            
            <button
              onClick={loadAnalytics}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Searches</p>
              <p className="text-3xl font-bold text-white mt-2">{analytics.totalSearches}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Unique Queries</p>
              <p className="text-3xl font-bold text-white mt-2">{analytics.popularQueries.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">APIs Used</p>
              <p className="text-3xl font-bold text-white mt-2">{Object.keys(analytics.searchesByAPI).length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">History Items</p>
              <p className="text-3xl font-bold text-white mt-2">{analytics.recentSearches.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Queries */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Popular Search Queries</h3>
          {getPopularQueriesChart()}
        </div>

        {/* API Distribution */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Search API Distribution</h3>
          {getAPIDistributionChart()}
        </div>

        {/* Search Trends */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 lg:col-span-2">
          {getSearchTrends()}
        </div>

        {/* Recent Searches */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Searches</h3>
          <div className="space-y-3">
            {analytics.recentSearches.slice(0, 10).map((search, index) => (
              <div key={search.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{search.query}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(search.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAnalytics;
