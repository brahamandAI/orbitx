import React, { useState } from 'react';

const DownloadsPage = () => {
  const [filter, setFilter] = useState('all'); // all, completed, inProgress
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');

  // Mock downloads data
  const [downloads] = useState([
    { 
      id: 1, 
      name: 'OrbitX_Setup.exe', 
      size: '125.3 MB', 
      status: 'completed', 
      time: new Date(Date.now() - 120000),
      type: 'application',
      icon: '📦',
      progress: 100
    },
    { 
      id: 2, 
      name: 'Vacation_Photos.zip', 
      size: '543.8 MB', 
      status: 'completed', 
      time: new Date(Date.now() - 300000),
      type: 'archive',
      icon: '🗂️',
      progress: 100
    },
    { 
      id: 3, 
      name: 'Project_Presentation.pdf', 
      size: '8.2 MB', 
      status: 'completed', 
      time: new Date(Date.now() - 600000),
      type: 'document',
      icon: '📄',
      progress: 100
    },
    { 
      id: 4, 
      name: 'Tutorial_Video.mp4', 
      size: '1.2 GB', 
      status: 'inProgress', 
      time: new Date(),
      type: 'video',
      icon: '🎥',
      progress: 65
    },
    { 
      id: 5, 
      name: 'Wallpaper_4K.jpg', 
      size: '12.5 MB', 
      status: 'completed', 
      time: new Date(Date.now() - 900000),
      type: 'image',
      icon: '🖼️',
      progress: 100
    },
    { 
      id: 6, 
      name: 'Music_Album.zip', 
      size: '256.7 MB', 
      status: 'completed', 
      time: new Date(Date.now() - 1800000),
      type: 'archive',
      icon: '🎵',
      progress: 100
    },
    { 
      id: 7, 
      name: 'Software_Update.dmg', 
      size: '3.4 GB', 
      status: 'completed', 
      time: new Date(Date.now() - 3600000),
      type: 'application',
      icon: '⚙️',
      progress: 100
    },
    { 
      id: 8, 
      name: 'Design_Assets.sketch', 
      size: '89.1 MB', 
      status: 'completed', 
      time: new Date(Date.now() - 7200000),
      type: 'design',
      icon: '🎨',
      progress: 100
    }
  ]);

  const filteredDownloads = downloads.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  }).sort((a, b) => {
    return sortBy === 'newest' ? b.time - a.time : a.time - b.time;
  });

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this download?')) {
      console.log('Deleting download:', id);
    }
  };

  const handleOpenFile = (id) => {
    console.log('Opening file:', id);
  };

  const handleShowInFolder = (id) => {
    console.log('Showing in folder:', id);
  };

  const clearAllDownloads = () => {
    if (window.confirm('Clear all completed downloads from the list?')) {
      console.log('Clearing all downloads');
    }
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📥</span>
            </div>
            <h1 className="text-2xl font-black text-white">Downloads</h1>
          </div>

          {/* Filter by Status */}
          <div className="space-y-2 mb-6">
            <p className="text-gray-400 text-sm font-bold mb-2">FILTER</p>
            {[
              { value: 'all', label: 'All Downloads', icon: '📋', count: downloads.length },
              { value: 'completed', label: 'Completed', icon: '✅', count: downloads.filter(d => d.status === 'completed').length },
              { value: 'inProgress', label: 'In Progress', icon: '⏳', count: downloads.filter(d => d.status === 'inProgress').length }
            ].map(item => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                  filter === item.value
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  filter === item.value ? 'bg-white/20' : 'bg-gray-700'
                }`}>
                  {item.count}
                </span>
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
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-lg">{sort.icon}</span>
                <span className="font-medium">{sort.label}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
              <span>Open Folder</span>
            </button>
            <button
              onClick={clearAllDownloads}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">
                {filter === 'all' && 'All Downloads'}
                {filter === 'completed' && 'Completed Downloads'}
                {filter === 'inProgress' && 'Downloads in Progress'}
              </h2>
              <p className="text-gray-400">
                {filteredDownloads.length} {filteredDownloads.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Downloads List */}
          {filteredDownloads.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                <span className="text-6xl">📥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No Downloads</h3>
              <p className="text-gray-500">Your downloaded files will appear here</p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredDownloads.map((download) => (
                <div
                  key={download.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:bg-gray-700/50 hover:border-green-500/50 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-3xl">
                      {download.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-lg truncate mb-1">{download.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{download.size}</span>
                        <span>•</span>
                        <span>{formatTime(download.time)}</span>
                        {download.status === 'inProgress' && (
                          <>
                            <span>•</span>
                            <span className="text-blue-400 font-bold">{download.progress}%</span>
                          </>
                        )}
                      </div>
                      {download.status === 'inProgress' && (
                        <div className="mt-2 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                            style={{ width: `${download.progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div>
                      {download.status === 'completed' ? (
                        <span className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg font-bold text-sm flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Complete</span>
                        </span>
                      ) : (
                        <span className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg font-bold text-sm flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          <span>Downloading</span>
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => handleOpenFile(download.id)}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-all"
                        title="Open file"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleShowInFolder(download.id)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                        title="Show in folder"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(download.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDownloads.map((download) => (
                <div
                  key={download.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-700/50 hover:border-green-500/50 transition-all group text-center"
                >
                  <div className="text-6xl mb-4">{download.icon}</div>
                  <p className="text-white font-bold mb-2 truncate">{download.name}</p>
                  <p className="text-gray-400 text-sm mb-2">{download.size}</p>
                  <p className="text-gray-500 text-xs mb-3">{formatTime(download.time)}</p>
                  
                  {download.status === 'inProgress' && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden mb-1">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                          style={{ width: `${download.progress}%` }}
                        />
                      </div>
                      <p className="text-blue-400 font-bold text-sm">{download.progress}%</p>
                    </div>
                  )}

                  <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => handleOpenFile(download.id)}
                      className="px-3 py-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-all text-sm"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(download.id)}
                      className="px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;

