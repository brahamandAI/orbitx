import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import searchService from '../services/searchService'; // ✅ Using main searchService with Smart Ranking + AI

const Toolbar = ({ onAIToggle, isAIPanelOpen, activeTab, onBookmarksToggle, onDownloadsToggle, showBookmarks, onSettingsToggle, onProfileToggle, onSearchResults, onHistoryToggle, onBookmarksPageToggle, onLogout, onShowLogin, user, isAuthenticated }) => {
  const [searchValue, setSearchValue] = useState(activeTab?.url || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    if (showUserMenu || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showMobileMenu]);
  
  // Lottie animation data
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

  const settingsAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 180,
    w: 200,
    h: 200,
    nm: "Settings Gear Animation",
    layers: [{
      ty: 4,
      nm: "Gear",
      ks: {
        o: {a: 0, k: 100},
        r: {a: 1, k: [{t: 0, s: [0]}, {t: 180, s: [360]}]},
        p: {a: 0, k: [100, 100, 0]},
        a: {a: 0, k: [0, 0, 0]},
        s: {a: 1, k: [{t: 0, s: [100, 100, 100]}, {t: 90, s: [110, 110, 100]}, {t: 180, s: [100, 100, 100]}]}
      },
      shapes: [{
        ty: "gr",
        it: [{
          d: 1,
          ty: "el",
          s: {a: 0, k: [50, 50]},
          p: {a: 0, k: [0, 0]},
          nm: "Outer Circle"
        }, {
          ty: "st",
          c: {a: 0, k: [0, 0.831, 1, 1]},
          o: {a: 0, k: 100},
          w: {a: 0, k: 3},
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
        nm: "Outer Circle"
      }, {
        ty: "gr",
        it: [{
          d: 1,
          ty: "el",
          s: {a: 0, k: [20, 20]},
          p: {a: 0, k: [0, 0]},
          nm: "Inner Circle"
        }, {
          ty: "fl",
          c: {a: 0, k: [0.7, 0.3, 1, 1]},
          o: {a: 0, k: 100},
          r: 1,
          nm: "Fill 1"
        }, {
          ty: "tr",
          p: {a: 0, k: [0, 0]},
          a: {a: 0, k: [0, 0]},
          s: {a: 0, k: [100, 100]},
          r: {a: 0, k: 0},
          o: {a: 0, k: 100},
          nm: "Transform"
        }],
        nm: "Inner Circle"
      }],
      ip: 0,
      op: 180,
      st: 0
    }],
    markers: []
  };

  const handleSearch = async (e) => {
    console.log('🔍 Search button clicked!', e);
    e.preventDefault();
    console.log('🔍 Search value:', searchValue);
    
    // Safety check for undefined searchValue
    if (!searchValue || !searchValue.trim()) {
      console.log('⚠️ No search value, returning');
      return;
    }
    
    console.log('🔍 Starting search...');
    setIsSearching(true);
    setShowSuggestions(false);
    
    try {
        // Check if it's a URL or search query
        const isUrl = isValidUrl(searchValue);
        console.log('🔍 Is URL?', isUrl);
        console.log('🔍 Search value:', searchValue);
        console.log('🔍 URL detection details:', {
          hasDot: searchValue.includes('.'),
          hasProtocol: searchValue.startsWith('http://') || searchValue.startsWith('https://'),
          hasSpaces: searchValue.includes(' '),
          domainPattern: /^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/.test(searchValue)
        });
      
      if (isUrl) {
        // Navigate to URL
        const url = formatUrl(searchValue);
        console.log('🔍 Navigating to URL:', url);
        if (onSearchResults) {
          onSearchResults({ type: 'url', url: url, query: searchValue });
        }
      } else {
        // Perform web search
        console.log('🔍 Performing web search for:', searchValue);
        const searchResponse = await searchService.search(searchValue);
        console.log('Toolbar - Search Response:', searchResponse);
        
        // Check if response is an array or object with results property
        const resultsArray = Array.isArray(searchResponse) ? searchResponse : (searchResponse.results || []);
        console.log('Toolbar - Results Array:', resultsArray);
        
        if (onSearchResults) {
          console.log('🔍 Calling onSearchResults with:', {
            type: 'search', 
            results: resultsArray, 
            clusteredResults: searchResponse.categorizedResults || [],
            aiSuggestion: searchResponse.aiSuggestion || {},
            peopleAlsoAsk: searchResponse.peopleAlsoAsk || [],
            searchSummary: searchResponse.searchSummary || '',
            query: searchValue,
            searchTime: Date.now(),
            source: searchResponse.source || 'Enhanced Search'
          });
          onSearchResults({ 
            type: 'search', 
            results: resultsArray, 
            clusteredResults: searchResponse.categorizedResults || [],
            aiSuggestion: searchResponse.aiSuggestion || {},
            peopleAlsoAsk: searchResponse.peopleAlsoAsk || [],
            searchSummary: searchResponse.searchSummary || '',
            query: searchValue,
            searchTime: Date.now(),
            source: searchResponse.source || 'Enhanced Search'
          });
        } else {
          console.log('⚠️ onSearchResults is not defined!');
        }
      }
    } catch (error) {
      console.error('❌ Search error:', error);
    } finally {
      console.log('🔍 Search completed, setting isSearching to false');
      setIsSearching(false);
    }
  };

  // Check if input is a valid URL
  const isValidUrl = (input) => {
    // Must have a dot and be a proper domain format
    const hasDot = input.includes('.');
    const hasProtocol = input.startsWith('http://') || input.startsWith('https://');
    const hasSpaces = input.includes(' ');
    
    // If it has protocol, it's a URL
    if (hasProtocol) return true;
    
    // If it has spaces, it's definitely a search query (not a URL)
    if (hasSpaces) return false;
    
    // Must have a dot and look like a domain
    if (!hasDot) return false;
    
    // More flexible domain pattern - allows domains like robustrix.com
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/;
    return domainPattern.test(input);
  };

  // Format URL properly
  const formatUrl = (input) => {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      return input;
    }
    return `https://${input}`;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    console.log('🔤 Input changed:', value);
    
    // Always get suggestions (shows popular/trending when empty)
    const suggestions = searchService.getSearchSuggestions(value);
    console.log('💡 Suggestions generated:', suggestions);
    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion.text);
    setShowSuggestions(false);
    // Use setTimeout to ensure state is updated before calling handleSearch
    setTimeout(() => {
      handleSearch({ preventDefault: () => {} });
    }, 0);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  const handleForward = () => {
    if (window.history.length > 1) {
      window.history.forward();
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        console.log('Voice recognition started');
        setSearchValue('Listening...');
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchValue(transcript);
        // Use setTimeout to ensure state is updated before calling handleSearch
        setTimeout(() => {
          handleSearch({ preventDefault: () => {} });
        }, 0);
      };
      
      recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        setSearchValue('');
      };
      
      recognition.onend = () => {
        console.log('Voice recognition ended');
      };
      
      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser');
    }
  };

  return (
    <div className="toolbar-glass px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6 shadow-glass overflow-x-auto">
      {/* Logo */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 floating-element flex-shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden flex items-center justify-center glass-panel border border-neon-blue/30 shadow-neon">
          <video 
            src="/orbitxlogo.mp4" 
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
            title="OrbitX Logo"
          />
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="aurora-text font-bold text-sm md:text-lg lg:text-xl">OrbitX</span>
          <span className="text-[10px] md:text-xs text-neon-blue/70 font-medium">AI Browser</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
        <button
          onClick={handleBack}
          className="btn-glass p-2 md:p-3 rounded-lg md:rounded-xl group hover:shadow-neon transition-all duration-300"
          title="Back"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-neon-blue transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={handleForward}
          className="btn-glass p-2 md:p-3 rounded-lg md:rounded-xl group hover:shadow-neon transition-all duration-300"
          title="Forward"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-neon-blue transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <button
          onClick={handleReload}
          className="btn-glass p-2 md:p-3 rounded-lg md:rounded-xl group hover:shadow-neon transition-all duration-300"
          title="Reload"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-neon-purple transition-all duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-3xl relative min-w-0">
        <form onSubmit={(e) => {
          console.log('🔍 Form submitted!', e);
          handleSearch(e);
        }} className="relative group">
          <div className="relative">
            {/* Animated border on focus */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-focus-within:opacity-75 transition duration-500 animate-pulse"></div>
            <div className="relative shimmer-effect">
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 md:pl-4 flex items-center pointer-events-none">
              {isSearching ? (
                <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-neon-blue border-t-transparent rounded-full"></div>
              ) : (
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                  <Lottie 
                    animationData={searchAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              onFocus={() => {
                console.log('🎯 Search bar focused');
                // Load suggestions when focused
                const suggestions = searchService.getSearchSuggestions(searchValue);
                setSearchSuggestions(suggestions);
                setShowSuggestions(suggestions.length > 0);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
              placeholder="Search the cosmos..."
              className="search-bar w-full pl-8 sm:pl-10 md:pl-12 pr-16 sm:pr-20 md:pr-24 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <div className="absolute inset-y-0 right-0 pr-1 sm:pr-2 md:pr-4 flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
              {/* AI Search Button */}
              <button
                type="button"
                onClick={() => {
                  console.log('🔍 AI Search button clicked!');
                  if (searchValue && searchValue.trim()) {
                    console.log('🔍 Calling handleSearch from AI button');
                    handleSearch({ preventDefault: () => {} });
                  } else {
                    console.log('🔍 Setting default search value');
                    setSearchValue('AI powered search');
                    // Use setTimeout to ensure state is updated before calling handleSearch
                    setTimeout(() => {
                      handleSearch({ preventDefault: () => {} });
                    }, 0);
                  }
                }}
                className="hidden sm:block btn-glass p-1.5 sm:p-2 rounded-full hover:shadow-neon transition-all duration-300 group"
                title="AI Search"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-neon-purple transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
              {/* Voice Mode Button */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className="hidden sm:block btn-glass p-1.5 sm:p-2 rounded-full hover:shadow-neon transition-all duration-300 group"
                title="Voice Mode"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-neon-pink transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              {/* Search Button */}
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary p-1.5 sm:p-2 rounded-full disabled:opacity-50"
                title="Search"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            </div>
          </div>
        </form>

        {/* Search Suggestions Dropdown - Enhanced Google Style */}
        {console.log('🎨 Rendering suggestions dropdown:', { showSuggestions, suggestionsCount: searchSuggestions.length })}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div 
            className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border-2 border-gray-700/50 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()}
          >
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(suggestion);
                }}
                className={`w-full text-left px-5 py-4 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 flex items-center space-x-4 group border-b border-gray-700/30 ${index === 0 ? 'rounded-t-2xl' : ''} ${index === searchSuggestions.length - 1 ? 'rounded-b-2xl border-b-0' : ''}`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">
                    {suggestion.icon || (suggestion.type === 'history' ? '🕒' : suggestion.type === 'popular' ? '🔥' : suggestion.type === 'trending' ? '📈' : '🔍')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white text-base font-medium group-hover:text-blue-300 transition-colors">{suggestion.text}</span>
                  {suggestion.type && (
                    <div className="flex items-center mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
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
                <svg className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Powered by Robustrix Badge */}
      <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-gray-900 rounded-lg leading-none flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 font-bold text-xs sm:text-sm animate-gradient-x tracking-wider">
              Powered by STARTUP ROBUSTRIX
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
        {/* Bookmarks Button */}
        <button
          onClick={onBookmarksToggle}
          className={`hidden md:block btn-glass p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300 group ${
            showBookmarks 
              ? 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon' 
              : 'hover:shadow-neon'
          }`}
          title="Bookmarks"
        >
          <svg className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-all duration-300 group-hover:scale-110 ${
            showBookmarks ? 'text-white' : 'text-gray-300 group-hover:text-neon-blue'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        {/* Settings Button */}
        <button
          onClick={onSettingsToggle}
          className="hidden md:block btn-glass p-2 md:p-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 group"
          title="Settings"
        >
          <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6">
            <Lottie 
              animationData={settingsAnimation}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </button>

        {/* Downloads Button */}
        <button
          onClick={onDownloadsToggle}
          className="hidden sm:block btn-glass p-2 md:p-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 group"
          title="Downloads"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-300 group-hover:text-neon-orange transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>

        {/* History Button */}
        <button
          onClick={onHistoryToggle}
          className="hidden sm:block btn-glass p-2 md:p-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 group"
          title="History"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-300 group-hover:text-neon-green transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Bookmarks Page Button */}
        <button
          onClick={onBookmarksPageToggle}
          className="hidden lg:block btn-glass p-2 md:p-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 group"
          title="Bookmarks Manager"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-300 group-hover:text-neon-purple transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        {/* User Menu */}
        {isAuthenticated && user && (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="btn-glass p-2 md:p-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300"
              title={`Logged in as ${user.name}`}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </button>
            
            {/* User Dropdown Menu */}
            {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 z-[9997]">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{user.name}</h3>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    {user.isGuest && (
                      <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-full">Guest Mode</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onProfileToggle();
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSettingsToggle();
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-white/10 my-2"></div>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🚪 Logout button clicked in Toolbar');
                      setShowUserMenu(false);
                      setTimeout(() => {
                        if (onLogout) {
                          console.log('🚪 Calling onLogout function');
                          onLogout();
                        } else {
                          console.error('❌ onLogout function not provided');
                        }
                      }, 100);
                    }}
                    className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 flex items-center space-x-3 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* Quick Logout Button - For Testing */}
        {isAuthenticated && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🚪 Quick Logout clicked');
              if (onLogout) {
                onLogout();
              }
            }}
            className="hidden md:block btn-glass p-2 md:p-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 group"
            title="Logout"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-red-400 group-hover:text-red-300 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}

        {/* Login Button - Show when not authenticated */}
        {!isAuthenticated && (
          <button
            onClick={onShowLogin}
            className="hidden md:block btn-glass p-2 md:p-3 rounded-lg md:rounded-xl hover:shadow-neon transition-all duration-300 group"
            title="Login"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-300 group-hover:text-neon-blue transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </button>
        )}

        {/* AI Assistant Button */}
        <button
          onClick={onAIToggle}
          className={`ai-button p-2 sm:p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 group relative overflow-hidden ${
            isAIPanelOpen 
              ? 'shadow-cosmic scale-105' 
              : 'hover:scale-105'
          }`}
          title="ब्रह्मांड AI Assistant"
        >
          <div className="relative z-10">
            <img 
              src="/brahamand-ai.gif" 
              alt="ब्रह्मांड AI" 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 transition-transform duration-300 group-hover:scale-110 rounded-lg md:rounded-xl"
            />
          </div>
          {isAIPanelOpen && (
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-20 rounded-xl md:rounded-2xl animate-pulse"></div>
          )}
        </button>

        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="md:hidden relative" ref={mobileMenuRef}>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="btn-glass p-2 rounded-lg hover:shadow-neon transition-all duration-300"
            title="Menu"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 z-[9999]">
              <div className="p-4">
                <h3 className="text-white font-bold mb-4 text-lg flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Quick Menu</span>
                </h3>
                
                <div className="space-y-2">
                  {/* Bookmarks */}
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onBookmarksToggle();
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>Bookmarks Bar</span>
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onSettingsToggle();
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </button>

                  {/* Downloads */}
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onDownloadsToggle();
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Downloads</span>
                  </button>

                  {/* History */}
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onHistoryToggle();
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>History</span>
                  </button>

                  {/* Bookmarks Manager */}
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onBookmarksPageToggle();
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Bookmarks Manager</span>
                  </button>

                  {isAuthenticated && (
                    <>
                      <div className="border-t border-white/10 my-2"></div>
                      
                      {/* Profile */}
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          onProfileToggle();
                        }}
                        className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 flex items-center space-x-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span>Profile ({user?.name || 'User'})</span>
                      </button>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 flex items-center space-x-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </>
                  )}

                  {!isAuthenticated && (
                    <>
                      <div className="border-t border-white/10 my-2"></div>
                      
                      {/* Login */}
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          onShowLogin();
                        }}
                        className="w-full text-left px-4 py-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-200 flex items-center space-x-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Login</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
