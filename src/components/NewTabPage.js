import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Lottie from 'lottie-react';
import searchService from '../services/searchService'; // ✅ Using main searchService with Smart Ranking + AI
import EnhancedSearchResults from './EnhancedSearchResults';

const NewTabPage = ({ onSearchResultClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [topSites] = useState([
    { name: 'Google', url: 'https://google.com', icon: '🔍', color: 'blue' },
    { name: 'YouTube', url: 'https://youtube.com', icon: '📺', color: 'red' },
    { name: 'GitHub', url: 'https://github.com', icon: '💻', color: 'gray' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦', color: 'blue' },
    { name: 'Reddit', url: 'https://reddit.com', icon: '🔴', color: 'orange' },
    { name: 'Wikipedia', url: 'https://wikipedia.org', icon: '📚', color: 'gray' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '❓', color: 'orange' },
    { name: 'Amazon', url: 'https://amazon.com', icon: '🛒', color: 'orange' }
  ]);

  const [myWebsites] = useState([
    { 
      name: 'FoodFly', 
      url: 'https://foodfly.co', 
      icon: '🍕', 
      logo: '/foodfly.jpeg',
      description: 'Food delivery platform connecting hungry customers with local restaurants',
      color: 'orange'
    },
    { 
      name: 'SubVivah', 
      url: 'https://subvivah.com', 
      icon: '💒', 
      logo: '/subvivah.jpeg',
      customLogo: true,
      description: 'Wedding planning and matrimonial services platform',
      color: 'pink'
    },
    { 
      name: 'ConnectFlow', 
      url: 'http://connectflow.co.in/', 
      icon: '🌐', 
      logo: '/connectflow.jpeg',
      description: 'Professional networking and business connection platform',
      color: 'blue'
    },
    { 
      name: 'ChitBox', 
      url: 'https://chitbox.co', 
      icon: '💬', 
      logo: '/chitbox.mp4',
      isVideo: true,
      description: 'Chat and communication platform for seamless conversations',
      color: 'green'
    },
    { 
      name: 'TutorBuddy', 
      url: 'https://tututorbuddy.co', 
      icon: '🎓', 
      logo: '/tutorbuddy.jpeg',
      description: 'Online tutoring platform connecting students with expert teachers',
      color: 'purple'
    },
    { 
      name: 'Brahamand AI', 
      url: 'https://brahamand.ai', 
      icon: '🤖', 
      logo: '/brahamand-ai.gif',
      description: 'Advanced AI platform for intelligent solutions and automation',
      color: 'cyan'
    }
  ]);

  useEffect(() => {
    // Load recent searches and bookmarks from localStorage
    const recent = searchService.getSearchHistory(8);
    setRecentSearches(recent);
    
    const savedBookmarks = JSON.parse(localStorage.getItem('orbitix_bookmarks') || '[]');
    setBookmarks(savedBookmarks);
    
    // Reset search results when new tab loads
    setSearchResults(null);

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('📱 PWA install prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('✅ OrbitX is running as installed app');
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle Escape key to go back to home
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && searchResults) {
        setSearchResults(null);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [searchResults]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      console.log('Empty query, skipping search');
      return;
    }
    
    console.log('🔍 NewTabPage handleSearch called with query:', query);
    setIsSearching(true);
    try {
      console.log('📡 Fetching search results...');
      const searchResponse = await searchService.search(query);
      console.log('✅ Search response received:', searchResponse);
      
      // Check if response is an array or object with results property
      const resultsArray = Array.isArray(searchResponse) ? searchResponse : (searchResponse.results || []);
      console.log('📋 Results array:', resultsArray);
      
      const searchData = {
        results: resultsArray,
        clusteredResults: searchResponse.categorizedResults || [],
        aiSuggestion: searchResponse.aiSuggestion || {},
        peopleAlsoAsk: searchResponse.peopleAlsoAsk || [],
        searchSummary: searchResponse.searchSummary || '',
        query: query,
        searchTime: Date.now(),
        source: searchResponse.source || 'Simple Search'
      };
      console.log('💾 Setting search results state:', searchData);
      setSearchResults(searchData);
    } catch (error) {
      console.error('❌ Search error:', error);
    } finally {
      console.log('✅ Search completed, isSearching set to false');
      setIsSearching(false);
    }
  };

  const handleSiteClick = (site) => {
    // Open site in new OrbitX tab
    if (onSearchResultClick) {
      onSearchResultClick({ url: site.url, title: site.title || site.name });
    } else {
      window.open(site.url, '_blank');
    }
  };

  const handleWebsiteClick = (website) => {
    // Open website in OrbitX internal tab
    console.log('Opening website in OrbitX:', website.url);
    if (onSearchResultClick) {
      // Use OrbitX internal tab system
      onSearchResultClick({ 
        url: website.url, 
        title: website.name,
        description: website.description,
        favicon: website.logo 
      });
    } else {
      // Fallback: open in external tab if internal system not available
      window.open(website.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRecentSearchClick = (search) => {
    setSearchQuery(search.query);
    handleSearch(search.query);
  };

  const handleBookmarkClick = (bookmark) => {
    // Open bookmark in new OrbitX tab
    if (onSearchResultClick) {
      onSearchResultClick({ url: bookmark.url, title: bookmark.title || bookmark.name });
    } else {
      window.open(bookmark.url, '_blank');
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser. Please use Chrome.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      console.log('🎤 Voice search started...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎤 Voice input:', transcript);
      setSearchQuery(transcript);
      setIsListening(false);
      handleSearch(transcript);
    };

    recognition.onerror = (event) => {
      console.error('🎤 Voice search error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('🎤 Voice search ended');
    };

    recognition.start();
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('OrbitX is already installed or installation is not available on this browser.');
      return;
    }

    console.log('📱 Installing OrbitX...');
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`📱 User response: ${outcome}`);
    
    if (outcome === 'accepted') {
      console.log('✅ OrbitX installed successfully!');
    } else {
      console.log('❌ Installation cancelled');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  // Lottie animations
  const searchAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 90,
    w: 200,
    h: 200,
    nm: "Search Animation",
    layers: [{
      ty: 4,
      nm: "Search Icon",
      ks: {
        o: {a: 0, k: 100},
        r: {a: 1, k: [{t: 0, s: [0]}, {t: 90, s: [360]}]},
        p: {a: 0, k: [100, 100, 0]},
        a: {a: 0, k: [0, 0, 0]},
        s: {a: 1, k: [{t: 0, s: [100, 100, 100]}, {t: 45, s: [110, 110, 100]}, {t: 90, s: [100, 100, 100]}]}
      },
      shapes: [{
        ty: "gr",
        it: [{
          d: 1,
          ty: "el",
          s: {a: 0, k: [30, 30]},
          p: {a: 0, k: [0, 0]},
          nm: "Ellipse Path 1"
        }, {
          ty: "st",
          c: {a: 0, k: [0, 0.831, 1, 1]},
          o: {a: 0, k: 100},
          w: {a: 0, k: 4},
          lc: 2,
          lj: 2,
          ml: 4,
          nm: "Stroke 1"
        }, {
          ty: "tr",
          p: {a: 0, k: [0, 0]},
          a: {a: 0, k: [0, 0]},
          s: {a: 0, k: [100, 100]},
          r: {a: 0, k: 0},
          o: {a: 0, k: 100},
          nm: "Transform"
        }],
        nm: "Ellipse 1"
      }, {
        ty: "gr",
        it: [{
          ty: "rc",
          d: 1,
          s: {a: 0, k: [15, 4]},
          p: {a: 0, k: [0, 0]},
          r: {a: 0, k: 45},
          nm: "Rectangle Path 1"
        }, {
          ty: "st",
          c: {a: 0, k: [0, 0.831, 1, 1]},
          o: {a: 0, k: 100},
          w: {a: 0, k: 4},
          lc: 2,
          lj: 2,
          ml: 4,
          nm: "Stroke 1"
        }, {
          ty: "tr",
          p: {a: 0, k: [21, 21]},
          a: {a: 0, k: [0, 0]},
          s: {a: 0, k: [100, 100]},
          r: {a: 0, k: 0},
          o: {a: 0, k: 100},
          nm: "Transform"
        }],
        nm: "Rectangle 1"
      }],
      ip: 0,
      op: 90,
      st: 0
    }],
    markers: []
  };

  // Render suggestions dropdown using Portal (appears on top of everything!)
  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0 || !searchInputRef.current) return null;

    const rect = searchInputRef.current.getBoundingClientRect();

    return createPortal(
      <div 
        className="fixed bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border-2 border-gray-700/50 rounded-2xl shadow-2xl max-h-96 overflow-y-auto"
        style={{ 
          zIndex: 999999,
          top: `${rect.bottom + 16}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              setSearchQuery(suggestion.text);
              setShowSuggestions(false);
              handleSearch(suggestion.text);
            }}
            className={`w-full text-left px-6 py-5 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 flex items-center space-x-5 group border-b border-gray-700/30 ${index === 0 ? 'rounded-t-2xl' : ''} ${index === suggestions.length - 1 ? 'rounded-b-2xl border-b-0' : ''}`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-3xl">
                {suggestion.icon || (suggestion.type === 'history' ? '🕒' : suggestion.type === 'popular' ? '🔥' : suggestion.type === 'trending' ? '📈' : '🔍')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-white text-xl font-medium group-hover:text-blue-300 transition-colors block">{suggestion.text}</span>
              {suggestion.type && (
                <div className="flex items-center mt-2">
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                    suggestion.type === 'history' ? 'bg-blue-500/20 text-blue-300' :
                    suggestion.type === 'popular' ? 'bg-orange-500/20 text-orange-300' :
                    suggestion.type === 'trending' ? 'bg-pink-500/20 text-pink-300' :
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {suggestion.type === 'history' ? '📍 Recent' : 
                     suggestion.type === 'popular' ? '⭐ Popular' : 
                     suggestion.type === 'trending' ? '🔥 Trending' : 
                     '💡 Suggested'}
                  </span>
                </div>
              )}
            </div>
            <svg className="w-6 h-6 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-blue-400 group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>,
      document.body
    );
  };

  if (searchResults) {
    console.log('🎯 Rendering EnhancedSearchResults with data:', searchResults);
    return (
      <EnhancedSearchResults 
        searchData={searchResults} 
        onResultClick={(result) => {
          console.log('🔗 Result clicked:', result);
          if (onSearchResultClick) {
            onSearchResultClick(result);
          } else {
            // Fallback to external window if no handler provided
            window.open(result.url, '_blank');
          }
          setSearchResults(null);
        }}
      />
    );
  }

  return (
    <>
    {renderSuggestions()}
    <div className="flex-1 bg-transparent overflow-y-auto relative min-h-0">
      {/* Background Video - Made Transparent */}
      <div className="absolute inset-0 z-0 opacity-20">
        <video 
          src="/homevideo.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
          title="OrbitX New Tab Background"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-start py-4 sm:py-6 md:py-8">
        <div className="text-center max-w-6xl mx-auto px-2 sm:px-4 md:px-6 w-full">
          {/* Logo and Search */}
          <div className="mb-4 sm:mb-6 md:mb-8 relative" style={{ zIndex: 10000 }}>
            <h1 className="aurora-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 drop-shadow-2xl animate-pulse">OrbitX</h1>
            
            {/* Search Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }} className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8">
              <div className="relative" id="search-bar-container">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);

                    // Always get suggestions (shows popular/trending when empty)
                    const newSuggestions = searchService.getSearchSuggestions(value);
                    setSuggestions(newSuggestions);
                    setShowSuggestions(newSuggestions.length > 0);
                  }}
                  onFocus={() => {
                    // Always show suggestions on focus (popular/trending when empty)
                    const newSuggestions = searchService.getSearchSuggestions(searchQuery);
                    setSuggestions(newSuggestions);
                    setShowSuggestions(newSuggestions.length > 0);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                  placeholder="Search the cosmos..."
                  className="search-bar w-full px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 lg:py-6 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border-2 border-white/10 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 bg-white/5 backdrop-blur-sm"
                />
                <div className="absolute left-2 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8">
                    <Lottie 
                      animationData={searchAnimation}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
                <div className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                  {/* Voice Search Button */}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`hidden sm:block p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 ${
                      isListening 
                        ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                        : 'bg-blue-500/30 hover:bg-blue-500/50 backdrop-blur-sm'
                    }`}
                    title="Voice Search (Click & Speak)"
                  >
                    {isListening ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </button>

                  {/* Search Button */}
                  <button 
                    type="submit"
                    disabled={isSearching}
                    className={`p-2 sm:p-2.5 md:p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl ${isSearching ? 'opacity-50' : ''}`}
                    title="Search"
                  >
                    {isSearching ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Top Sites */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Quick Access</h2>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto">
              {topSites.map((site, index) => (
                <div
                  key={index}
                  onClick={() => handleSiteClick(site)}
                  className="glass-panel p-2 sm:p-3 md:p-4 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 cursor-pointer group text-center"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                    {site.icon}
                  </div>
                  <p className="text-white text-xs sm:text-sm font-medium group-hover:text-neon-blue transition-colors duration-300 truncate">
                    {site.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Digital Universe */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 md:mb-4 flex items-center justify-center space-x-2 sm:space-x-3">
              <span className="text-2xl sm:text-3xl">🚀</span>
              <span>Our Digital Universe</span>
            </h2>
            <p className="text-center text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              Explore our innovative platforms designed to revolutionize your digital experience
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
              {myWebsites.map((website, index) => (
                <div
                  key={index}
                  onClick={() => handleWebsiteClick(website)}
                  className="relative group cursor-pointer"
                >
                  {/* Unique Card Design for each website */}
                  <div className={`glass-panel p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl hover:shadow-neon transition-all duration-500 cursor-pointer group border-2 hover:scale-105 transform ${
                    index === 0 ? 'border-orange-400/30 hover:border-orange-400/60 bg-gradient-to-br from-orange-500/10 to-red-500/10' :
                    index === 1 ? 'border-pink-400/30 hover:border-pink-400/60 bg-gradient-to-br from-pink-500/10 to-rose-500/10' :
                    index === 2 ? 'border-blue-400/30 hover:border-blue-400/60 bg-gradient-to-br from-blue-500/10 to-indigo-500/10' :
                    index === 3 ? 'border-green-400/30 hover:border-green-400/60 bg-gradient-to-br from-green-500/10 to-emerald-500/10' :
                    index === 4 ? 'border-purple-400/30 hover:border-purple-400/60 bg-gradient-to-br from-purple-500/10 to-violet-500/10' :
                    'border-cyan-400/30 hover:border-cyan-400/60 bg-gradient-to-br from-cyan-500/10 to-teal-500/10'
                  }`}>
                    
                    {/* Floating Background Elements */}
                    <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                      <div className={`w-8 h-8 rounded-full ${
                        index === 0 ? 'bg-orange-400' :
                        index === 1 ? 'bg-pink-400' :
                        index === 2 ? 'bg-blue-400' :
                        index === 3 ? 'bg-green-400' :
                        index === 4 ? 'bg-purple-400' :
                        'bg-cyan-400'
                      } animate-pulse`}></div>
                    </div>
                    
                    {/* Logo Container with Unique Styling */}
                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-4 sm:mb-5 md:mb-6">
                      <div className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl glass-panel border-2 flex items-center justify-center group-hover:scale-110 transition-all duration-300 overflow-hidden ${
                        index === 0 ? 'border-orange-400/40 bg-orange-500/10' :
                        index === 1 ? 'border-pink-400/40 bg-pink-500/10' :
                        index === 2 ? 'border-blue-400/40 bg-blue-500/10' :
                        index === 3 ? 'border-green-400/40 bg-green-500/10' :
                        index === 4 ? 'border-purple-400/40 bg-purple-500/10' :
                        'border-cyan-400/40 bg-cyan-500/10'
                      }`}>
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
                          index === 0 ? 'bg-orange-400' :
                          index === 1 ? 'bg-pink-400' :
                          index === 2 ? 'bg-blue-400' :
                          index === 3 ? 'bg-green-400' :
                          index === 4 ? 'bg-purple-400' :
                          'bg-cyan-400'
                        }`}></div>
                        
                        {website.customLogo && website.name === 'SubVivah' ? (
                          // Custom SVG Logo for SubVivah
                          <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              {/* Background Circle */}
                              <circle cx="50" cy="50" r="48" fill="url(#subvivah-gradient)" />
                              <defs>
                                <linearGradient id="subvivah-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                                  <stop offset="50%" style={{ stopColor: '#f43f5e', stopOpacity: 1 }} />
                                  <stop offset="100%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
                                </linearGradient>
                              </defs>
                              {/* Wedding Rings */}
                              <circle cx="38" cy="45" r="12" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
                              <circle cx="62" cy="45" r="12" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
                              {/* Diamond/Heart */}
                              <path d="M 50 35 L 45 40 L 50 45 L 55 40 Z" fill="white" opacity="0.9" />
                              {/* Text S */}
                              <text x="50" y="72" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial">S</text>
                            </svg>
                          </div>
                        ) : website.isVideo ? (
                          <video 
                            src={website.logo} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-cover rounded-lg md:rounded-xl"
                            alt={`${website.name} logo`}
                          />
                        ) : (
                          <img 
                            src={website.logo} 
                            alt={`${website.name} logo`}
                            className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain rounded-lg md:rounded-xl"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        )}
                        <span className="text-2xl sm:text-3xl md:text-4xl hidden">{website.icon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                          index === 0 ? 'text-orange-300 group-hover:text-orange-200' :
                          index === 1 ? 'text-pink-300 group-hover:text-pink-200' :
                          index === 2 ? 'text-blue-300 group-hover:text-blue-200' :
                          index === 3 ? 'text-green-300 group-hover:text-green-200' :
                          index === 4 ? 'text-purple-300 group-hover:text-purple-200' :
                          'text-cyan-300 group-hover:text-cyan-200'
                        }`}>
                          {website.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 truncate">
                          {website.url}
                        </p>
                      </div>
                    </div>
                    
                    {/* Description with Enhanced Typography */}
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed group-hover:text-white transition-colors duration-300 mb-4 sm:mb-5 md:mb-6">
                      {website.description}
                    </p>
                    
                    {/* Bottom Section with Creative Elements */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          Visit Website
                        </span>
                        <div className="w-2 h-2 rounded-full bg-gray-400 group-hover:bg-white transition-colors duration-300"></div>
                        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          →
                        </span>
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-xs text-green-400 font-medium">Live</span>
                      </div>
                    </div>
                    
                    {/* Hover Effect Overlay */}
                    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                      index === 0 ? 'bg-orange-400' :
                      index === 1 ? 'bg-pink-400' :
                      index === 2 ? 'bg-blue-400' :
                      index === 3 ? 'bg-green-400' :
                      index === 4 ? 'bg-purple-400' :
                      'bg-cyan-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>



          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 md:mb-8">Recent Searches</h2>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-4xl mx-auto">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="btn-glass px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300"
                  >
                    <span className="text-white text-xs sm:text-sm">{search.query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bookmarks */}
          {bookmarks.length > 0 && (
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 md:mb-8">Bookmarks</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                {bookmarks.slice(0, 8).map((bookmark, index) => (
                  <div
                    key={index}
                    onClick={() => handleBookmarkClick(bookmark)}
                    className="glass-panel p-3 sm:p-4 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="text-lg sm:text-xl md:text-2xl">{bookmark.icon || '🔖'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm sm:text-base font-medium truncate group-hover:text-neon-blue transition-colors duration-300">
                          {bookmark.title}
                        </p>
                        <p className="text-gray-400 text-[10px] sm:text-xs truncate">{bookmark.url}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions - Simplified on mobile */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3 mb-6 sm:mb-8 md:mb-10">
            <button className="btn-glass px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 group">
              <span className="text-xs sm:text-sm md:text-lg font-medium group-hover:text-neon-blue transition-colors duration-300">🌟 Sites</span>
            </button>
            <button className="btn-glass px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 group">
              <span className="text-xs sm:text-sm md:text-lg font-medium group-hover:text-neon-purple transition-colors duration-300">📚 Books</span>
            </button>
            <button className="btn-glass px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 group">
              <span className="text-xs sm:text-sm md:text-lg font-medium group-hover:text-neon-pink transition-colors duration-300">⚡ Recent</span>
            </button>
            <button className="btn-glass px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 group">
              <span className="text-xs sm:text-sm md:text-lg font-medium group-hover:text-neon-green transition-colors duration-300">🎯 AI</span>
            </button>
          </div>

          {/* Install App Banner */}
          {showInstallPrompt && (
            <div className="mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative glass-panel p-4 sm:p-6 rounded-2xl border-2 border-neon-blue/30 shadow-neon">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex items-center justify-center glass-panel border border-neon-blue/30 shadow-neon">
                        <video 
                          src="/orbitxlogo.mp4" 
                          autoPlay 
                          loop 
                          muted 
                          className="w-full h-full object-cover"
                          title="OrbitX Logo"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-1">
                          📱 Install OrbitX Browser
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm">
                          Install OrbitX as an app for faster access and offline features!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={handleInstallClick}
                        className="btn-primary px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg md:rounded-xl hover:shadow-cosmic transition-all duration-300 group text-xs sm:text-sm md:text-base font-bold"
                      >
                        <span className="flex items-center space-x-1 sm:space-x-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span className="hidden sm:inline">Install</span>
                        </span>
                      </button>
                      <button
                        onClick={() => setShowInstallPrompt(false)}
                        className="btn-glass p-2 rounded-lg hover:shadow-neon transition-all duration-300"
                        title="Dismiss"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
                    <span className="flex items-center space-x-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Offline Access</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Faster Load</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Native App Feel</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 bg-transparent border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg md:rounded-xl glass-panel border border-neon-blue/30 shadow-neon flex items-center justify-center overflow-hidden">
                  <img 
                    src="/robustrix.jpeg" 
                    alt="STARTUP ROBUSTRIX Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="text-xl sm:text-2xl hidden">⚡</span>
                </div>
                <div className="text-center">
                  <h3 className="aurora-text text-base sm:text-xl md:text-2xl font-bold cursor-pointer hover:text-neon-blue transition-colors duration-300" 
                      onClick={() => {
                        if (onSearchResultClick) {
                          onSearchResultClick({ url: 'https://therobustrix.com', title: 'STARTUP ROBUSTRIX' });
                        } else {
                          window.open('https://therobustrix.com', '_blank');
                        }
                      }}>
                    STARTUP ROBUSTRIX
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1 cursor-pointer hover:text-neon-blue transition-colors duration-300"
                     onClick={() => {
                       if (onSearchResultClick) {
                         onSearchResultClick({ url: 'https://therobustrix.com', title: 'STARTUP ROBUSTRIX' });
                       } else {
                         window.open('https://therobustrix.com', '_blank');
                       }
                     }}>
                    www.therobustrix.com
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-4xl mx-auto leading-relaxed px-4">
                <span className="text-neon-blue font-semibold">All digital platforms showcased above</span> are proudly 
                <span className="text-neon-purple font-semibold"> developed and engineered by STARTUP ROBUSTRIX</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-6 sm:mb-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🌐</div>
                  <h4 className="text-white text-sm sm:text-base font-semibold mb-1 sm:mb-2">Digital Platforms</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">FoodFly • SubVivah • ConnectFlow • ChitBox • TutorBuddy • Brahamand AI</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🚀</div>
                  <h4 className="text-white text-sm sm:text-base font-semibold mb-1 sm:mb-2">Innovation</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">Cutting-edge technology • Custom development • Expert engineering</p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                  <span className="cursor-pointer hover:text-neon-blue transition-colors duration-300" 
                      onClick={() => {
                        if (onSearchResultClick) {
                          onSearchResultClick({ url: 'https://therobustrix.com', title: 'STARTUP ROBUSTRIX' });
                        } else {
                          window.open('https://therobustrix.com', '_blank');
                        }
                      }}>
                  Powered by STARTUP ROBUSTRIX
                </span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <span>© 2024 STARTUP ROBUSTRIX</span>
                <div className="w-px h-4 bg-white/20"></div>
                <span>All Rights Reserved</span>
                <div className="w-px h-4 bg-white/20"></div>
                <span>Made in India 🇮🇳</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NewTabPage;
