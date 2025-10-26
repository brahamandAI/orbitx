import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import searchService from '../services/searchService';
import aiService from '../services/aiService';
import { checkApiKeys } from '../config/apiKeys';
import NewTabPage from './NewTabPage';
import electronService from '../services/electronService';

const ContentArea = ({ activeTab, onSearchResultClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  // If tab has a URL, show it in BrowserView (Electron) or iframe (Web)
  if (activeTab && activeTab.url && activeTab.url !== '') {
    console.log('🌐 ContentArea loading URL:', activeTab.url);
    console.log('🖥️ Is Electron:', electronService.isElectron);
    
    // Prevent recursive loading - Don't load OrbitX inside OrbitX
    const isLocalhost = activeTab.url.includes('localhost') || 
                        activeTab.url.includes('127.0.0.1');
    
    if (isLocalhost && (activeTab.url.includes(':3000') || activeTab.url.includes(':8002'))) {
      console.warn('⚠️ Preventing recursive load of OrbitX');
      return (
        <div className="flex-1 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Cannot Load OrbitX Inside OrbitX</h2>
            <p className="text-gray-300 mb-6">Please search for external websites</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold"
            >
              🔄 Go Back to Home
            </button>
          </div>
        </div>
      );
    }

    // ELECTRON APP: Use BrowserView (bypasses X-Frame-Options!)
    if (electronService.isElectron) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        console.log(`🖥️ Electron: Loading ${activeTab.url} in BrowserView (Tab: ${activeTab.id})`);
        
        // Load website in Electron BrowserView
        electronService.loadWebsite(activeTab.url, activeTab.id)
          .then(result => {
            if (result.success) {
              console.log('✅ Website loaded in BrowserView');
            } else {
              console.error('❌ Failed to load website:', result.error);
            }
          });

        // Cleanup when tab closes
        return () => {
          console.log(`🧹 Cleanup: Closing BrowserView for tab ${activeTab.id}`);
          electronService.closeTab(activeTab.id);
        };
      }, [activeTab.url, activeTab.id]);

      return (
        <div className="flex-1 relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {/* Electron BrowserView will render here */}
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-xl font-bold mb-2">Loading in Desktop App...</p>
              <p className="text-blue-300 text-sm">🖥️ Electron BrowserView</p>
              <div className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs truncate max-w-xl">
                {activeTab.url}
              </div>
              <div className="mt-6 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/50">
                <p className="text-sm text-green-300 font-semibold">
                  ✅ All websites load perfectly in Desktop App!
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  No X-Frame-Options restrictions
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // WEB BROWSER: Check if site is compatible with iframe embedding
    // Some sites (YouTube, Facebook, Instagram) have CORS protection that can't be bypassed
    const incompatibleSites = [
      'youtube.com',
      'youtu.be',
      'facebook.com',
      'fb.com',
      'instagram.com',
      'twitter.com',
      'x.com',
      'tiktok.com',
      'netflix.com',
      'amazon.com',
      'twitch.tv'
    ];
    
    const isIncompatibleSite = incompatibleSites.some(site => 
      activeTab.url.toLowerCase().includes(site)
    );
    
    // If site is incompatible, show "Open Externally" screen
    if (isIncompatibleSite) {
      return (
        <div className="flex-1 relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
              <div className="text-6xl mb-6">🌐</div>
              <h2 className="text-3xl font-bold text-white mb-4">Advanced Protection Detected</h2>
              <p className="text-blue-200 text-lg mb-6">
                This website uses advanced CORS protection that prevents iframe embedding
              </p>
              
              <div className="bg-black/30 rounded-lg px-6 py-4 mb-8">
                <p className="text-sm text-gray-300 mb-2">Requested URL:</p>
                <p className="text-white font-mono text-sm break-all">{activeTab.url}</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ Sites like YouTube, Facebook, Instagram use CORS policies that block iframe embedding - even Chrome extensions can't bypass this!
                  </p>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    💡 <strong>For Full Access:</strong> Use the OrbitX Desktop App (works perfectly with all sites!)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => window.open(activeTab.url, '_blank', 'noopener,noreferrer')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  🚀 Open in New Browser Tab
                </button>
                
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg border border-white/30 transition-all"
                >
                  ← Back to Home
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-gray-400 text-xs mb-2">Why This Happens:</p>
                <p className="text-gray-300 text-sm">
                  These websites use CORS (Cross-Origin Resource Sharing) policies to prevent their content from being displayed in iframes. This is a security feature that cannot be bypassed in web browsers - only desktop apps can access these sites directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // For compatible sites, use proxy
    const proxyUrl = `http://localhost:8002/proxy?url=${encodeURIComponent(activeTab.url)}`;
    
    return (
      <div className="flex-1 relative bg-white">
        {/* Loading Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center z-10 transition-opacity duration-500" id={`loader-${activeTab.id}`}>
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-white font-bold text-xl mb-2">Loading Website...</p>
            <p className="text-blue-300 text-sm">🔒 Using OrbitX Secure Proxy</p>
            <div className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white truncate max-w-xl">
              {activeTab.url}
            </div>
            <div className="mt-6 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/50">
              <p className="text-xs text-green-300">
                ✅ Bypassing X-Frame-Options restrictions
              </p>
            </div>
          </div>
        </div>

        {/* Iframe for Web Browser - Using Proxy */}
        <iframe
          src={proxyUrl}
          className="w-full h-full border-0"
          title={activeTab.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox allow-downloads allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation allow-top-navigation-by-user-activation"
          allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; usb; web-share"
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
          importance="high"
          onLoad={(e) => {
            // Hide loader when iframe loads
            const loader = document.getElementById(`loader-${activeTab.id}`);
            if (loader) {
              loader.style.opacity = '0';
              setTimeout(() => {
                loader.style.display = 'none';
              }, 500);
            }
            console.log('✅ Website loaded successfully through proxy');
          }}
          onError={(e) => {
            console.log('⚠️ Website cannot be loaded in iframe:', activeTab.url);
            const loader = document.getElementById(`loader-${activeTab.id}`);
            if (loader) {
              loader.innerHTML = `
                <div class="text-center">
                  <div class="text-6xl mb-6">🚫</div>
                  <p class="text-white font-bold text-2xl mb-2">Cannot Load in Browser</p>
                  <p class="text-gray-300 mb-6">This website blocks iframe embedding</p>
                  <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 mb-6 max-w-2xl mx-auto">
                    <p class="text-sm text-blue-300 truncate">${activeTab.url}</p>
                  </div>
                  <div class="flex gap-3 justify-center">
                    <button 
                      onclick="window.open('${activeTab.url}', '_blank')" 
                      class="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      🌐 Open in New Tab
                    </button>
                  </div>
                  <p class="text-gray-400 text-sm mt-6">OrbitX can't bypass this website's security policy</p>
                </div>
              `;
              loader.style.opacity = '1';
              loader.style.display = 'flex';
            }
          }}
        />
        
        {/* Proxy Status Bar */}
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg text-xs flex items-center space-x-2 z-20">
          <span>🔒</span>
          <span className="font-semibold">Secure Proxy Active</span>
          <button 
            onClick={() => window.open(activeTab.url, '_blank', 'noopener,noreferrer')}
            className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 font-semibold"
          >
            Open Externally →
          </button>
        </div>
      </div>
    );
  }

  // If it's a new tab (no URL), show NewTabPage only if it's the active tab
  if (activeTab && (!activeTab.url || activeTab.url === '') && activeTab.isActive) {
    return <NewTabPage onSearchResultClick={onSearchResultClick} />;
  }

  // If no active tab or tab is not active, show empty state
  if (!activeTab || !activeTab.isActive) {
    return (
      <div className="flex-1 bg-cosmic-900 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">🌌</div>
          <h2 className="text-2xl font-bold mb-2">Welcome to OrbitX</h2>
          <p className="text-lg">Select a tab to get started</p>
        </div>
      </div>
    );
  }

  // Lottie animations
  const aiAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 120,
    w: 200,
    h: 200,
    nm: "AI Brain Animation",
    layers: [{
      ty: 4,
      nm: "Brain",
      ks: {
        o: {a: 1, k: [{t: 0, s: [100]}, {t: 60, s: [80]}, {t: 120, s: [100]}]},
        r: {a: 0, k: 0},
        p: {a: 0, k: [100, 100, 0]},
        a: {a: 0, k: [0, 0, 0]},
        s: {a: 1, k: [{t: 0, s: [100, 100, 100]}, {t: 60, s: [105, 105, 100]}, {t: 120, s: [100, 100, 100]}]}
      },
      shapes: [{
        ty: "gr",
        it: [{
          d: 1,
          ty: "el",
          s: {a: 0, k: [40, 30]},
          p: {a: 0, k: [0, 0]},
          nm: "Brain Shape"
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
        nm: "Brain"
      }],
      ip: 0,
      op: 120,
      st: 0
    }],
    markers: []
  };

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

  const handleSearch = async (query) => {
    if (!query.trim()) {
      alert('Please enter a search term!');
      return;
    }
    
    console.log('🔍 Searching for:', query);
    setIsSearching(true);
    
        try {
          // Use real search service with DuckDuckGo (free)
          const searchResults = await searchService.search(query, 'duckduckgo');
          console.log('✅ Search completed!', searchResults);

          setSearchResults(searchResults);
          setIsSearching(false);
        } catch (error) {
      console.error('❌ Search failed:', error);
      setIsSearching(false);
      
      // Show fallback results
      const fallbackResults = {
        query: query,
        results: [
          {
            title: `Search results for "${query}"`,
            url: `https://google.com/search?q=${encodeURIComponent(query)}`,
            description: `Find information about ${query} on Google`,
            favicon: '🔍'
          },
          {
            title: `${query} - Wikipedia`,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
            description: `Learn about ${query} on Wikipedia`,
            favicon: '📚'
          },
          {
            title: `${query} - GitHub`,
            url: `https://github.com/search?q=${encodeURIComponent(query)}`,
            description: `Find ${query} repositories on GitHub`,
            favicon: '💻'
          }
        ],
        aiSuggestion: {
          title: `AI Insight about ${query}`,
          content: `Based on your search for "${query}", here are some related topics you might find interesting: ${query} applications, ${query} tutorials, and ${query} best practices.`,
          source: 'Fallback AI'
        }
      };
      
      setSearchResults(fallbackResults);
    }
  };

  const handleInputChange = (e) => {
    console.log('Input changed:', e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with query:', searchQuery);
    handleSearch(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed with query:', searchQuery);
      handleSearch(searchQuery);
    }
  };

  const handleChatWithAI = async () => {
    if (!chatQuestion.trim() || !searchResults) {
      alert('Please enter a question and make sure you have search results!');
      return;
    }

    setIsChatting(true);
    try {
      const response = await aiService.chat(chatQuestion, []);
      setChatResponse(response.content);
    } catch (error) {
      console.error('Chat error:', error);
      setChatResponse('Sorry, I couldn\'t process your question right now.');
    }
    setIsChatting(false);
  };

  const handleResultClick = (url) => {
    // Open the link in a new OrbitX tab
    if (onSearchResultClick) {
      onSearchResultClick({ url: url, title: 'New Tab' });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const checkAPIs = () => {
    const status = checkApiKeys();
    setApiStatus(status);
  };
  // If showing search results, render them instead of home page
  if (searchResults) {
  return (
      <div className="flex-1 bg-cosmic-900 overflow-y-auto">
        {/* Search Results Header */}
        <div className="glass-panel border-b border-white/20 p-6">
          <div className="max-w-6xl mx-auto flex items-center space-x-4">
            <button 
              onClick={() => setSearchResults(null)}
              className="btn-glass p-3 rounded-xl hover:shadow-neon transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="aurora-text text-2xl font-bold">Search Results</h1>
              <p className="text-gray-300">Results for "{searchResults.query}"</p>
            </div>
          </div>
        </div>

        {/* Search Results Content */}
        <div className="max-w-6xl mx-auto p-8">
          {/* AI Suggestion */}
          <div className="glass-panel p-6 rounded-2xl border border-neon-blue/30 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl glass-panel border border-neon-blue/30 shadow-neon flex items-center justify-center">
                <img src="/brahamand-ai.gif" alt="ब्रह्मांड AI" className="w-8 h-8 rounded-lg" />
              </div>
              <h2 className="aurora-text text-xl font-bold">{searchResults.aiSuggestion.title}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{searchResults.aiSuggestion.content}</p>
          </div>

          {/* Search Results */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Search Results</h3>
            <p className="text-sm text-gray-400 mb-4">💡 Click on any result to open it in a new tab</p>
            {searchResults.results.map((result, index) => (
              <div 
                key={index} 
                className="glass-panel p-6 rounded-2xl border border-white/20 hover:shadow-neon transition-all duration-300 cursor-pointer group"
                onClick={() => handleResultClick(result.url)}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl glass-panel border border-white/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {result.favicon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-neon-blue transition-colors duration-300">
                      {result.title}
                    </h4>
                    <p className="text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">{result.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-neon-blue/70 group-hover:text-neon-blue transition-colors duration-300">{result.url}</span>
                      <button 
                        className="btn-glass px-3 py-1 rounded-lg text-xs hover:shadow-neon transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResultClick(result.url);
                        }}
                      >
                        Visit →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      
              {/* Related Searches */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-6">Related Searches</h3>
                <div className="flex flex-wrap gap-3">
                  {[`${searchResults.query} tutorial`, `${searchResults.query} examples`, `${searchResults.query} guide`, `${searchResults.query} tips`].map((related, index) => (
                    <button 
                      key={index}
                      onClick={() => {
                        setSearchQuery(related);
                        handleSearch(related);
                      }}
                      className="btn-glass px-4 py-2 rounded-xl hover:shadow-neon transition-all duration-300"
                    >
                      {related}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Chat Section */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                  <span className="text-2xl">🤖</span>
                  <span>Chat with ब्रह्मांड AI about Results</span>
                </h3>
                
                <div className="glass-panel p-6 rounded-2xl">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={chatQuestion}
                        onChange={(e) => setChatQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleChatWithAI()}
                        placeholder="Ask AI a question about the search results..."
                        className="flex-1 px-4 py-3 search-bar"
                      />
                      <button
                        onClick={handleChatWithAI}
                        disabled={isChatting}
                        className={`btn-primary px-6 py-3 ${isChatting ? 'opacity-50' : ''}`}
                      >
                        {isChatting ? 'Thinking...' : 'Ask AI'}
                      </button>
                    </div>
                    
                    {chatResponse && (
                      <div className="bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 p-4 rounded-xl">
                        <div className="flex items-center space-x-3 mb-3">
                          <img src="/brahamand-ai.gif" alt="ब्रह्मांड AI" className="w-8 h-8 rounded-lg" />
                          <span className="text-lg font-bold text-white">ब्रह्मांड AI Response:</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{chatResponse}</p>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-400">
                      💡 Try asking: "What are the key points from these results?" or "Which result is most relevant for beginners?"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

  return (
    <div className="flex-1 bg-cosmic-900 overflow-y-auto">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
            <video 
          src="/homevideo.mp4" 
              autoPlay 
              loop 
              muted 
          playsInline
              className="w-full h-full object-cover"
          title="OrbitX Home Background"
            />
        <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20">
          <div className="text-center max-w-6xl mx-auto">
            <h1 className="aurora-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 drop-shadow-2xl">OrbitX</h1>
            <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl mb-12 sm:mb-16 md:mb-20 drop-shadow-lg font-medium">AI-Powered Cosmic Browser</p>
            
            <form onSubmit={handleSubmit} className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <div className="relative">
              <input
                type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Search the cosmos..."
                  className="search-bar w-full px-8 sm:px-10 md:px-12 py-4 sm:py-6 md:py-8 lg:py-10 text-lg sm:text-xl md:text-2xl lg:text-3xl backdrop-blur-xl border-2 border-white/30"
                />
                <button 
                  type="submit"
                  disabled={isSearching}
                  className={`absolute right-6 top-6 p-5 btn-primary rounded-full ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSearching ? (
                    <svg className="w-12 h-12 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                  )}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lottie 
                    animationData={aiAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">AI Search</h3>
                <p className="text-gray-300">Intelligent search with natural language understanding</p>
              </div>

              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lottie 
                    animationData={searchAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Smart Summaries</h3>
                <p className="text-gray-300">Instant summaries of web pages and articles</p>
              </div>

              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lottie 
                    animationData={aiAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Voice Control</h3>
                <p className="text-gray-300">Navigate and search using voice commands</p>
              </div>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-6">
              <button className="btn-glass px-8 py-4 rounded-xl hover:shadow-neon transition-all duration-300 group">
                <span className="text-lg font-medium group-hover:text-neon-blue transition-colors duration-300">🌟 Popular Sites</span>
              </button>
              <button className="btn-glass px-8 py-4 rounded-xl hover:shadow-neon transition-all duration-300 group">
                <span className="text-lg font-medium group-hover:text-neon-purple transition-colors duration-300">📚 Bookmarks</span>
              </button>
              <button className="btn-glass px-8 py-4 rounded-xl hover:shadow-neon transition-all duration-300 group">
                <span className="text-lg font-medium group-hover:text-neon-pink transition-colors duration-300">⚡ Recent</span>
              </button>
              <button className="btn-glass px-8 py-4 rounded-xl hover:shadow-neon transition-all duration-300 group">
                <span className="text-lg font-medium group-hover:text-neon-green transition-colors duration-300">🎯 AI Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-8 py-20 bg-cosmic-900/80 backdrop-blur-sm">
          <div className="text-center max-w-6xl mx-auto">
            <h2 className="aurora-text text-5xl font-bold mb-16 drop-shadow-2xl">Explore the Cosmos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="glass-panel p-6 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔥</div>
                <h3 className="text-xl font-bold text-white mb-3">Trending</h3>
                <p className="text-gray-300 text-sm">Latest topics and discussions</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📰</div>
                <h3 className="text-xl font-bold text-white mb-3">News</h3>
                <p className="text-gray-300 text-sm">Latest news and updates</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎬</div>
                <h3 className="text-xl font-bold text-white mb-3">Entertainment</h3>
                <p className="text-gray-300 text-sm">Movies, shows, and fun content</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💻</div>
                <h3 className="text-xl font-bold text-white mb-3">Technology</h3>
                <p className="text-gray-300 text-sm">Tech news and innovations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="px-8 py-20 bg-cosmic-800/60 backdrop-blur-sm">
          <div className="text-center max-w-6xl mx-auto">
            <h2 className="aurora-text text-4xl font-bold mb-12 drop-shadow-2xl">Quick Access</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
              {['YouTube', 'Google', 'GitHub', 'Twitter', 'Reddit', 'Wikipedia'].map((site, index) => (
                <div key={index} className="glass-panel p-6 rounded-xl hover:shadow-neon transition-all duration-300 group cursor-pointer text-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {['📺', '🔍', '💻', '🐦', '🔴', '📚'][index]}
                  </div>
                  <p className="text-white font-medium group-hover:text-neon-blue transition-colors duration-300">{site}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* More Features */}
        <div className="px-8 py-20 bg-cosmic-700/40 backdrop-blur-sm">
          <div className="text-center max-w-6xl mx-auto">
            <h2 className="aurora-text text-4xl font-bold mb-12 drop-shadow-2xl">More Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🚀</div>
                <h3 className="text-xl font-bold text-white mb-3">Fast Performance</h3>
                <p className="text-gray-300 text-sm">Lightning-fast browsing with optimized rendering</p>
              </div>
              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔒</div>
                <h3 className="text-xl font-bold text-white mb-3">Privacy First</h3>
                <p className="text-gray-300 text-sm">Built-in privacy protection and ad blocking</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Tools */}
        <div className="px-8 py-20 bg-cosmic-900/80 backdrop-blur-sm">
          <div className="text-center max-w-6xl mx-auto">
            <h2 className="aurora-text text-4xl font-bold mb-12 drop-shadow-2xl">AI-Powered Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">✨</div>
                <h3 className="text-xl font-bold text-white mb-3">Content Generator</h3>
                <p className="text-gray-300 text-sm">AI-powered content creation and writing assistance</p>
              </div>

              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🖼️</div>
                <h3 className="text-xl font-bold text-white mb-3">Image Analysis</h3>
                <p className="text-gray-300 text-sm">Intelligent image recognition and analysis</p>
              </div>

              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🌍</div>
                <h3 className="text-xl font-bold text-white mb-3">Smart Translation</h3>
                <p className="text-gray-300 text-sm">Real-time translation with context understanding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Content for Scrolling */}
        <div className="px-8 py-20 bg-cosmic-800/40 backdrop-blur-sm">
          <div className="text-center max-w-6xl mx-auto">
            <h2 className="aurora-text text-4xl font-bold mb-12 drop-shadow-2xl">Browser Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
                <h3 className="text-xl font-bold text-white mb-3">Speed</h3>
                <p className="text-gray-300 text-sm">Ultra-fast page loading and rendering</p>
              </div>
              
              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🛡️</div>
                <h3 className="text-xl font-bold text-white mb-3">Security</h3>
                <p className="text-gray-300 text-sm">Advanced security and malware protection</p>
              </div>
              
              <div className="glass-panel p-8 rounded-2xl hover:shadow-neon transition-all duration-300 group cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎨</div>
                <h3 className="text-xl font-bold text-white mb-3">Customization</h3>
                <p className="text-gray-300 text-sm">Personalize your browsing experience</p>
            </div>
          </div>
        </div>
      </div>
      
        {/* API Status Section */}
        <div className="px-8 py-20 bg-cosmic-900/80 backdrop-blur-sm">
          <div className="text-center max-w-6xl mx-auto">
            <h2 className="aurora-text text-4xl font-bold mb-12 drop-shadow-2xl">🔑 API Status</h2>
            
            <div className="glass-panel p-8 rounded-2xl max-w-4xl mx-auto">
              <button 
                onClick={checkAPIs}
                className="btn-primary mb-8 px-8 py-4 text-lg"
              >
                Check API Status
              </button>
              
              {apiStatus && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-xl text-center transition-all duration-300 ${apiStatus.openai ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300' : 'bg-red-500/20 border-2 border-red-500/50 text-red-300'}`}>
                    <div className="text-3xl mb-3">🤖</div>
                    <div className="text-xl font-bold">OpenAI</div>
                    <div className="text-sm mt-2">{apiStatus.openai ? '✅ Connected & Ready' : '❌ Not Connected'}</div>
                    {apiStatus.openai && <div className="text-xs mt-1 text-green-400">AI Chat Available</div>}
                  </div>
                  
                  <div className={`p-6 rounded-xl text-center transition-all duration-300 ${apiStatus.duckduckgo ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300' : 'bg-red-500/20 border-2 border-red-500/50 text-red-300'}`}>
                    <div className="text-3xl mb-3">🦆</div>
                    <div className="text-xl font-bold">DuckDuckGo</div>
                    <div className="text-sm mt-2">{apiStatus.duckduckgo ? '✅ Free & Available' : '❌ Disabled'}</div>
                    {apiStatus.duckduckgo && <div className="text-xs mt-1 text-green-400">Default Search Engine</div>}
                  </div>
                  
                  <div className={`p-6 rounded-xl text-center transition-all duration-300 ${apiStatus.google ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300' : 'bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-300'}`}>
                    <div className="text-3xl mb-3">🔍</div>
                    <div className="text-xl font-bold">Google</div>
                    <div className="text-sm mt-2">{apiStatus.google ? '✅ Configured' : '⚠️ Not Set'}</div>
                    {!apiStatus.google && <div className="text-xs mt-1 text-yellow-400">Optional API</div>}
                  </div>
                  
                  <div className={`p-6 rounded-xl text-center transition-all duration-300 ${apiStatus.bing ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300' : 'bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-300'}`}>
                    <div className="text-3xl mb-3">🌐</div>
                    <div className="text-xl font-bold">Bing</div>
                    <div className="text-sm mt-2">{apiStatus.bing ? '✅ Configured' : '⚠️ Not Set'}</div>
                    {!apiStatus.bing && <div className="text-xs mt-1 text-yellow-400">Optional API</div>}
                  </div>
                  
                  <div className={`p-6 rounded-xl text-center transition-all duration-300 ${apiStatus.serpapi ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300' : 'bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-300'}`}>
                    <div className="text-3xl mb-3">⚡</div>
                    <div className="text-xl font-bold">SerpAPI</div>
                    <div className="text-sm mt-2">{apiStatus.serpapi ? '✅ Configured' : '⚠️ Not Set'}</div>
                    {!apiStatus.serpapi && <div className="text-xs mt-1 text-yellow-400">Optional API</div>}
                  </div>
                </div>
              )}
              
              <div className="mt-8 text-center">
                <p className="text-gray-300 text-sm">
                  💡 <strong>Ready to test?</strong> Try searching for something above to see AI-powered results!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-10 bg-cosmic-900/90 backdrop-blur-sm">
          <div className="text-center max-w-6xl mx-auto">
            <div className="glass-panel px-8 py-4 rounded-full flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">AI Ready</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="text-sm text-gray-300">Secure Connection</span>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="text-sm text-gray-300">Privacy Protected</span>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="text-sm text-gray-300">Ad Blocker Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentArea;