import React, { useState, useEffect, useCallback } from 'react';

const BookmarksPage = ({ onSearchResultClick }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', favicon: '🔖' });

  const loadBookmarks = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem('orbitix_bookmarks') || '[]');
    setBookmarks(savedBookmarks);
  };

  const saveBookmarks = (bookmarksList) => {
    localStorage.setItem('orbitix_bookmarks', JSON.stringify(bookmarksList));
    setBookmarks(bookmarksList);
  };

  const filterBookmarks = useCallback(() => {
    if (!searchTerm) {
      setFilteredBookmarks(bookmarks);
    } else {
      const filtered = bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBookmarks(filtered);
    }
  }, [bookmarks, searchTerm]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterBookmarks();
  }, [filterBookmarks]);

  const handleAddBookmark = () => {
    if (newBookmark.title && newBookmark.url) {
      const bookmark = {
        id: Date.now(),
        title: newBookmark.title,
        url: newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`,
        favicon: newBookmark.favicon,
        dateAdded: new Date().toISOString()
      };
      
      const updatedBookmarks = [...bookmarks, bookmark];
      saveBookmarks(updatedBookmarks);
      setNewBookmark({ title: '', url: '', favicon: '🔖' });
      setShowAddForm(false);
    }
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setNewBookmark({
      title: bookmark.title,
      url: bookmark.url,
      favicon: bookmark.favicon
    });
    setShowAddForm(true);
  };

  const handleUpdateBookmark = () => {
    if (newBookmark.title && newBookmark.url && editingBookmark) {
      const updatedBookmarks = bookmarks.map(bookmark =>
        bookmark.id === editingBookmark.id
          ? {
              ...bookmark,
              title: newBookmark.title,
              url: newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`,
              favicon: newBookmark.favicon
            }
          : bookmark
      );
      saveBookmarks(updatedBookmarks);
      setEditingBookmark(null);
      setNewBookmark({ title: '', url: '', favicon: '🔖' });
      setShowAddForm(false);
    }
  };

  const handleDeleteBookmark = (id) => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
      saveBookmarks(updatedBookmarks);
    }
  };

  const handleBookmarkClick = (bookmark) => {
    if (onSearchResultClick) {
      onSearchResultClick({ url: bookmark.url, title: bookmark.title });
    } else {
      window.open(bookmark.url, '_blank');
    }
  };

  const getFaviconFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      if (domain.includes('google')) return '🔍';
      if (domain.includes('github')) return '🐙';
      if (domain.includes('youtube')) return '📺';
      if (domain.includes('twitter')) return '🐦';
      if (domain.includes('reddit')) return '🤖';
      if (domain.includes('stackoverflow')) return '💻';
      if (domain.includes('medium')) return '📝';
      if (domain.includes('dev.to')) return '👨‍💻';
      if (domain.includes('facebook')) return '📘';
      if (domain.includes('instagram')) return '📷';
      if (domain.includes('linkedin')) return '💼';
      if (domain.includes('amazon')) return '🛒';
      if (domain.includes('netflix')) return '🎬';
      if (domain.includes('spotify')) return '🎵';
      if (domain.includes('wikipedia')) return '📚';
      if (domain.includes('stackoverflow')) return '❓';
      return '🔖';
    } catch {
      return '🔖';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full overflow-y-auto bg-cosmic-900">
      <div className="p-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="glass-panel p-8 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-2xl glass-panel border border-neon-blue/30 shadow-neon flex items-center justify-center">
                  <span className="text-3xl">🔖</span>
                </div>
                <div>
                  <h1 className="aurora-text text-4xl font-bold">Bookmarks</h1>
                  <p className="text-gray-300 text-lg">{bookmarks.length} bookmarks saved</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary px-6 py-3 rounded-xl hover:shadow-neon transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Bookmark</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Search and Add Form */}
          <div className="glass-panel p-6 rounded-2xl border border-white/20 mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search bookmarks..."
                  className="w-full p-3 rounded-xl glass-panel border border-white/20 text-white bg-transparent focus:border-neon-blue focus:outline-none"
                />
              </div>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="mt-6 p-4 rounded-xl glass-panel border border-neon-blue/30">
                <h3 className="text-lg font-bold text-white mb-4">
                  {editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newBookmark.title}
                    onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                    className="p-3 rounded-xl glass-panel border border-white/20 text-white bg-transparent focus:border-neon-blue focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={newBookmark.url}
                    onChange={(e) => {
                      const url = e.target.value;
                      setNewBookmark({ 
                        ...newBookmark, 
                        url: url,
                        favicon: getFaviconFromUrl(url)
                      });
                    }}
                    className="p-3 rounded-xl glass-panel border border-white/20 text-white bg-transparent focus:border-neon-blue focus:outline-none"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Icon"
                      value={newBookmark.favicon}
                      onChange={(e) => setNewBookmark({ ...newBookmark, favicon: e.target.value })}
                      className="flex-1 p-3 rounded-xl glass-panel border border-white/20 text-white bg-transparent focus:border-neon-blue focus:outline-none"
                    />
                    <button
                      onClick={editingBookmark ? handleUpdateBookmark : handleAddBookmark}
                      className="btn-primary px-4 py-3 rounded-xl"
                    >
                      {editingBookmark ? 'Update' : 'Add'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingBookmark(null);
                        setNewBookmark({ title: '', url: '', favicon: '🔖' });
                      }}
                      className="btn-glass px-4 py-3 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bookmarks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.length === 0 ? (
              <div className="col-span-full glass-panel p-12 rounded-2xl border border-white/20 text-center">
                <div className="text-6xl mb-4">🔖</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Bookmarks Found</h3>
                <p className="text-gray-300">
                  {searchTerm ? 'No bookmarks match your search criteria.' : 'Start adding bookmarks to see them here.'}
                </p>
              </div>
            ) : (
              filteredBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="glass-panel p-6 rounded-2xl border border-white/20 hover:shadow-neon transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl glass-panel border border-white/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                        {bookmark.favicon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-neon-blue transition-colors duration-300 truncate">
                          {bookmark.title}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">{bookmark.url}</p>
                        {bookmark.dateAdded && (
                          <p className="text-xs text-gray-500 mt-1">
                            Added {formatDate(bookmark.dateAdded)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBookmarkClick(bookmark)}
                        className="p-2 rounded-lg glass-panel hover:shadow-neon transition-all duration-300"
                        title="Open bookmark"
                      >
                        <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleEditBookmark(bookmark)}
                        className="p-2 rounded-lg glass-panel hover:shadow-neon transition-all duration-300"
                        title="Edit bookmark"
                      >
                        <svg className="w-4 h-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        className="p-2 rounded-lg glass-panel hover:shadow-neon transition-all duration-300 text-red-400 hover:text-red-300"
                        title="Delete bookmark"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBookmarkClick(bookmark)}
                    className="w-full btn-glass p-3 rounded-xl hover:shadow-neon transition-all duration-300 text-left"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-white font-medium">Visit Website</span>
                      <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Statistics */}
          {bookmarks.length > 0 && (
            <div className="mt-8 glass-panel p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Bookmark Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl glass-panel border border-neon-blue/20">
                  <div className="text-2xl font-bold text-neon-blue">{bookmarks.length}</div>
                  <div className="text-sm text-gray-300">Total Bookmarks</div>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-panel border border-neon-purple/20">
                  <div className="text-2xl font-bold text-neon-purple">
                    {new Set(bookmarks.map(b => new URL(b.url).hostname)).size}
                  </div>
                  <div className="text-sm text-gray-300">Unique Domains</div>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-panel border border-neon-pink/20">
                  <div className="text-2xl font-bold text-neon-pink">
                    {bookmarks.filter(b => b.url.includes('https')).length}
                  </div>
                  <div className="text-sm text-gray-300">Secure Sites</div>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-panel border border-neon-green/20">
                  <div className="text-2xl font-bold text-neon-green">
                    {bookmarks.filter(b => {
                      const date = new Date(b.dateAdded || Date.now());
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return date > weekAgo;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-300">Added This Week</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;
