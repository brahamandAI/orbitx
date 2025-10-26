import React, { useState, useEffect } from 'react';

const BookmarksBar = ({ onBookmarkClick }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', favicon: '🔖' });

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem('orbitix_bookmarks') || '[]');
    if (savedBookmarks.length === 0) {
      // Default bookmarks if none saved
      const defaultBookmarks = [
        { id: 1, title: 'Google', url: 'https://google.com', favicon: '🔍' },
        { id: 2, title: 'GitHub', url: 'https://github.com', favicon: '🐙' },
        { id: 3, title: 'YouTube', url: 'https://youtube.com', favicon: '📺' },
        { id: 4, title: 'Twitter', url: 'https://twitter.com', favicon: '🐦' },
        { id: 5, title: 'Reddit', url: 'https://reddit.com', favicon: '🤖' },
        { id: 6, title: 'Stack Overflow', url: 'https://stackoverflow.com', favicon: '💻' },
        { id: 7, title: 'Medium', url: 'https://medium.com', favicon: '📝' },
        { id: 8, title: 'Dev.to', url: 'https://dev.to', favicon: '👨‍💻' }
      ];
      setBookmarks(defaultBookmarks);
      localStorage.setItem('orbitix_bookmarks', JSON.stringify(defaultBookmarks));
    } else {
      setBookmarks(savedBookmarks);
    }
  };

  const saveBookmarks = (bookmarksList) => {
    localStorage.setItem('orbitix_bookmarks', JSON.stringify(bookmarksList));
    setBookmarks(bookmarksList);
  };

  const handleBookmarkClick = (bookmark) => {
    if (onBookmarkClick) {
      onBookmarkClick(bookmark);
    } else {
      // Fallback: open in new tab
      window.open(bookmark.url, '_blank');
    }
  };

  const handleAddBookmark = () => {
    if (newBookmark.title && newBookmark.url) {
      const bookmark = {
        id: Date.now(),
        title: newBookmark.title,
        url: newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`,
        favicon: newBookmark.favicon
      };
      
      const updatedBookmarks = [...bookmarks, bookmark];
      saveBookmarks(updatedBookmarks);
      setNewBookmark({ title: '', url: '', favicon: '🔖' });
      setShowAddForm(false);
    }
  };

  const handleDeleteBookmark = (id, e) => {
    e.stopPropagation();
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this bookmark?')) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
      saveBookmarks(updatedBookmarks);
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
      return '🔖';
    } catch {
      return '🔖';
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center space-x-3 overflow-x-auto">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex items-center space-x-2 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors duration-200 group min-w-0 relative"
        >
          <button
            onClick={() => handleBookmarkClick(bookmark)}
            className="flex items-center space-x-2 min-w-0 flex-1"
            title={`${bookmark.title} - ${bookmark.url}`}
          >
            <span className="text-sm flex-shrink-0">{bookmark.favicon}</span>
            <span className="text-sm text-gray-300 group-hover:text-white truncate">
              {bookmark.title}
            </span>
          </button>
          
          {/* Delete Button */}
          <button
            onClick={(e) => handleDeleteBookmark(bookmark.id, e)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-600 rounded"
            title="Delete bookmark"
          >
            <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      
      {/* Add Bookmark Button */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-3 py-1 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors duration-200"
          title="Add Bookmark"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm">Add</span>
        </button>
      ) : (
        <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-700">
          <input
            type="text"
            placeholder="Title"
            value={newBookmark.title}
            onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
            className="w-20 px-2 py-1 text-xs bg-gray-600 text-white rounded border-none outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleAddBookmark()}
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
            className="w-32 px-2 py-1 text-xs bg-gray-600 text-white rounded border-none outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleAddBookmark()}
          />
          <button
            onClick={handleAddBookmark}
            className="p-1 text-green-400 hover:text-green-300"
            title="Add"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={() => setShowAddForm(false)}
            className="p-1 text-red-400 hover:text-red-300"
            title="Cancel"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default BookmarksBar;
