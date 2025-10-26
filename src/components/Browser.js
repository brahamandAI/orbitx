import React, { useState, useCallback, useEffect } from 'react';
import Toolbar from './Toolbar';
import TabBar from './TabBar';
import ContentArea from './ContentArea';
import SettingsPage from './SettingsPage';
import ProfilePage from './ProfilePage';
import HistoryPage from './HistoryPage';
import BookmarksPage from './BookmarksPage';
import DownloadsPage from './DownloadsPage';
import BookmarksBar from './BookmarksBar';
import StatusBar from './StatusBar';
import AIPanel from './AIPanel';
import AuthModal from './AuthModal';
import EnhancedSearchResults from './EnhancedSearchResults';
import SearchAnalytics from './SearchAnalytics';

const Browser = () => {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: 'New Tab',
      url: '',
      favicon: '🌐',
      isActive: true,
      currentPage: 'home', // ✅ Each tab has its own page state
      searchResults: null // ✅ Each tab has its own search results
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [currentPage, setCurrentPage] = useState('home');
  const [searchResults, setSearchResults] = useState(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    name: 'Guest User',
    email: 'guest@orbitx.com',
    isGuest: true,
    loginTime: new Date().toISOString()
  });

  // Check authentication on mount
  useEffect(() => {
    const authData = localStorage.getItem('orbitx_auth');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
        setIsAuthenticated(true);
        setShowAuthModal(false); // Don't show modal if user is already logged in
      } catch (error) {
        console.error('Error parsing auth data:', error);
        // If there's an error parsing, show the modal
        setShowAuthModal(true);
      }
    } else {
      // Only show auth modal if no auth data exists
      setShowAuthModal(true);
    }
  }, []);

  const handleLogin = (formData) => {
    const userData = {
      name: formData.name,
      email: formData.email,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('orbitx_auth', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleGuestMode = () => {
    // Set guest user
    const guestData = {
      name: 'Guest User',
      email: 'guest@orbitx.com',
      isGuest: true,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('orbitx_auth', JSON.stringify(guestData));
    setUser(guestData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    console.log('🚪 Logout clicked - clearing auth data');
    // Clear authentication data
    localStorage.removeItem('orbitx_auth');
    
    // Show login modal after logout
    setUser(null);
    setIsAuthenticated(false);
    setShowAuthModal(true);
    console.log('✅ Logged out - showing login modal');
  };

  const handleShowLogin = () => {
    setShowAuthModal(true);
  };

  const handleTabChange = (tabId) => {
    console.log('🔄 Switching to tab:', tabId);
    const selectedTab = tabs.find(tab => tab.id === tabId);
    
    setTabs(tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
    setActiveTabId(tabId);
    
    // ✅ Restore tab's individual state when switching
    if (selectedTab) {
      console.log('✅ Restoring tab state:', {
        currentPage: selectedTab.currentPage,
        hasSearchResults: !!selectedTab.searchResults
      });
      setCurrentPage(selectedTab.currentPage || 'home');
      setSearchResults(selectedTab.searchResults || null);
    }
  };

  const handleNewTab = useCallback(() => {
    const newTab = {
      id: Date.now(),
      title: 'New Tab',
      url: '',
      favicon: '🌐',
      isActive: true,
      currentPage: 'home', // ✅ Fresh home page for new tab
      searchResults: null // ✅ Fresh state for new tab
    };
    
    console.log('🆕 Creating new tab with fresh home page');
    setTabs(tabs.map(tab => ({ ...tab, isActive: false })));
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setCurrentPage('home'); // Ensure fresh home page loads
    setSearchResults(null); // Clear global search results for new tab
  }, [tabs]);

  const handleCloseTab = (tabId) => {
    if (tabs.length <= 1) return;
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    if (tabId === activeTabId) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTabId(newActiveTab.id);
      setTabs(newTabs.map(tab => ({
        ...tab,
        isActive: tab.id === newActiveTab.id
      })));
    } else {
      setTabs(newTabs);
    }
  };

  const handleAIToggle = () => {
    setIsAIPanelOpen(!isAIPanelOpen);
  };

  const handleDownloadsToggle = () => {
    setCurrentPage(currentPage === 'downloads' ? 'home' : 'downloads');
  };

  const handleBookmarksToggle = () => {
    setShowBookmarks(!showBookmarks);
  };

  const handleSettingsToggle = () => {
    setCurrentPage(currentPage === 'settings' ? 'home' : 'settings');
  };

  const handleProfileToggle = () => {
    setCurrentPage(currentPage === 'profile' ? 'home' : 'profile');
  };

  const handleAnalyticsToggle = () => {
    setShowAnalytics(!showAnalytics);
  };

  const handleHistoryToggle = () => {
    setCurrentPage(currentPage === 'history' ? 'home' : 'history');
  };

  const handleBookmarksPageToggle = () => {
    setCurrentPage(currentPage === 'bookmarks' ? 'home' : 'bookmarks');
  };


  const handleBookmarkClick = (bookmark) => {
    // Create a new tab with the bookmark URL
    const newTab = {
      id: Math.max(...tabs.map(t => t.id)) + 1,
      title: bookmark.title,
      url: bookmark.url,
      favicon: bookmark.favicon,
      isActive: true,
      currentPage: 'home',
      searchResults: null
    };
    
    console.log('🔖 Opening bookmark in new tab:', bookmark.title);
    setTabs(prevTabs => 
      prevTabs.map(tab => ({ ...tab, isActive: false })).concat(newTab)
    );
    setActiveTabId(newTab.id);
    setCurrentPage('home');
    setSearchResults(null);
  };


  const handleSearchResultClick = (result) => {
    console.log('🔗 Opening search result in new OrbitX tab:', result);
    
    // Validate URL
    if (!result.url || result.url === '') {
      console.error('❌ Invalid URL:', result);
      return;
    }
    
    // Create new tab with the search result URL
    const newTab = {
      id: Date.now(),
      title: result.title || 'Loading...',
      url: result.url,
      favicon: result.favicon || '🌐',
      isActive: true,
      currentPage: 'content', // ✅ Set to 'content' not 'home' so iframe loads
      searchResults: null
    };
    
    console.log('🌐 Creating new tab for URL:', result.url);
    setTabs(tabs.map(tab => ({ ...tab, isActive: false })));
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setCurrentPage('content'); // ✅ Set to 'content' to trigger iframe loading
    console.log('✅ Website opened in new OrbitX tab');
  };

  const handleSearchResults = (searchData) => {
    console.log('🔍 Browser - Search results received:', searchData);
    
    if (searchData.type === 'url') {
      // Navigate to URL directly
      console.log('🌐 Navigating to URL:', searchData.url);
      const newTab = {
        id: Date.now(),
        title: searchData.query,
        url: searchData.url,
        favicon: '🌐',
        isActive: true,
        currentPage: 'home',
        searchResults: null
      };
      
      console.log('🌐 Creating new tab:', newTab);
      setTabs(tabs.map(tab => ({ ...tab, isActive: false })));
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      setSearchResults(null);
      setCurrentPage('home');
      console.log('🌐 Tab created and activated');
    } else if (searchData.type === 'search') {
      // ✅ Save search results to CURRENT tab's state
      console.log('🔍 Setting search results:', searchData.results);
      setSearchResults(searchData);
      setCurrentPage('search');
      
      // ✅ Update current tab with search results
      setTabs(tabs.map(tab => 
        tab.id === activeTabId
          ? { ...tab, currentPage: 'search', searchResults: searchData }
          : tab
      ));
    } else {
      // Handle combined search results (web + images)
      console.log('🔍 Setting combined search results:', searchData);
      setSearchResults(searchData);
      setCurrentPage('search');
      
      // ✅ Update current tab with search results
      setTabs(tabs.map(tab => 
        tab.id === activeTabId
          ? { ...tab, currentPage: 'search', searchResults: searchData }
          : tab
      ));
    }
  };

  const handleResultClick = (result) => {
    // Open result in new tab
    const newTab = {
      id: Date.now(),
      title: result.title,
      url: result.url,
      favicon: result.favicon,
      isActive: true,
      currentPage: 'home',
      searchResults: null
    };
    
    console.log('🔗 Opening result in new tab:', result.title);
    setTabs(tabs.map(tab => ({ ...tab, isActive: false })));
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setSearchResults(null);
    setCurrentPage('home');
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+J for downloads
      if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        handleDownloadsToggle();
      }
      // Ctrl+Shift+B for bookmarks
      if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        setShowBookmarks(!showBookmarks);
      }
      // Ctrl+T for new tab
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        handleNewTab();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBookmarks, handleNewTab, handleDownloadsToggle]);

  const activeTab = tabs.find(tab => tab.isActive);

  return (
    <div className="h-screen flex flex-col bg-cosmic-900 overflow-hidden">
      <TabBar 
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={handleTabChange}
        onNewTab={handleNewTab}
        onCloseTab={handleCloseTab}
        onHistoryToggle={handleHistoryToggle}
      />
      <Toolbar 
        onAIToggle={handleAIToggle}
        isAIPanelOpen={isAIPanelOpen}
        activeTab={activeTab}
        onBookmarksToggle={handleBookmarksToggle}
        onDownloadsToggle={handleDownloadsToggle}
        showBookmarks={showBookmarks}
        onSettingsToggle={handleSettingsToggle}
        onProfileToggle={handleProfileToggle}
        onSearchResults={handleSearchResults}
        onHistoryToggle={handleHistoryToggle}
        onBookmarksPageToggle={handleBookmarksPageToggle}
        onLogout={handleLogout}
        onShowLogin={handleShowLogin}
        user={user}
        isAuthenticated={isAuthenticated}
      />
      {showBookmarks && <BookmarksBar onBookmarkClick={handleBookmarkClick} />}
      <div className="flex-1 flex relative overflow-hidden">
            {(currentPage === 'home' || currentPage === 'content') && <ContentArea activeTab={activeTab} onSearchResultClick={handleSearchResultClick} />}   
            {currentPage === 'settings' && <SettingsPage onProfileToggle={handleProfileToggle} onAnalyticsToggle={handleAnalyticsToggle} />}                    
            {currentPage === 'profile' && <ProfilePage onSettingsToggle={handleSettingsToggle} onAnalyticsToggle={handleAnalyticsToggle} />}                    
            {currentPage === 'history' && <HistoryPage />}
            {currentPage === 'bookmarks' && <BookmarksPage onSearchResultClick={handleSearchResultClick} />}
            {currentPage === 'downloads' && <DownloadsPage />}
            {currentPage === 'search' && searchResults && (
              <div className="flex-1 overflow-y-auto bg-gray-900">
                <div className="p-4">
                  <h2 className="text-xl font-bold text-white mb-4">Search Results for: {searchResults.query}</h2>
                  <p className="text-gray-400 mb-4">Found {searchResults.results?.length || 0} results</p>
                </div>
                <EnhancedSearchResults
                  searchData={searchResults}
                  onResultClick={handleResultClick}
                  onLoadMore={() => console.log('Load more requested')}
                />
              </div>
            )}
            {currentPage === 'search' && !searchResults && (
              <div className="flex-1 overflow-y-auto bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Search Results</h3>
                  <p className="text-gray-400">Try searching for something else</p>
                </div>
              </div>
            )}
        <AIPanel 
          isOpen={isAIPanelOpen}
          onClose={() => setIsAIPanelOpen(false)}
        />
        {showAnalytics && (
          <div className="absolute inset-0 bg-gray-900 z-40 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Search Analytics</h2>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="btn-glass p-2 rounded-lg hover:shadow-neon transition-all duration-300"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <SearchAnalytics />
            </div>
          </div>
        )}
      </div>
      <StatusBar activeTab={activeTab} />
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => {
            setShowAuthModal(false);
          }}
          onLogin={handleLogin}
          onGuestMode={handleGuestMode}
        />
      )}
    </div>
  );
};

export default Browser;
