import React from 'react';

const TabBar = ({ tabs, activeTabId, onTabChange, onNewTab, onCloseTab }) => {
  return (
    <div className="glass-panel border-b border-white/20 flex items-center px-1 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 space-x-1 sm:space-x-2 overflow-x-auto backdrop-blur-md scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center min-w-0 max-w-[120px] sm:max-w-[150px] md:max-w-xs px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-t-lg md:rounded-t-xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
            tab.isActive
              ? 'tab-active-glass text-white'
              : 'tab-glass text-gray-300 hover:text-white hover:border-neon-blue/30'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {/* Active tab glow effect */}
          {tab.isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-t-lg md:rounded-t-xl"></div>
          )}
          
          {/* Favicon */}
          <div className="flex-shrink-0 mr-1 sm:mr-2 md:mr-3 relative z-10">
            <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-md md:rounded-lg flex items-center justify-center ${
              tab.isActive ? 'bg-neon-blue/20 shadow-neon' : 'bg-glass-light'
            }`}>
              <span className="text-xs sm:text-sm">{tab.favicon}</span>
            </div>
          </div>
          
          {/* Tab Title */}
          <div className="flex-1 min-w-0 relative z-10">
            <span className={`text-xs sm:text-sm font-medium truncate block ${
              tab.isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
            }`}>
              {tab.title || 'New Tab'}
            </span>
          </div>
          
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(tab.id);
            }}
            className={`flex-shrink-0 ml-1 sm:ml-2 p-1 sm:p-1.5 rounded-full transition-all duration-300 relative z-10 ${
              tab.isActive 
                ? 'hover:bg-neon-blue/20 opacity-100' 
                : 'hover:bg-glass-light opacity-0 group-hover:opacity-100'
            }`}
            title="Close tab"
          >
            <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
              tab.isActive 
                ? 'text-white hover:text-neon-pink' 
                : 'text-gray-400 hover:text-white'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      
      {/* New Tab Button */}
      <button
        onClick={onNewTab}
        className="flex-shrink-0 p-2 sm:p-2.5 md:p-3 rounded-lg md:rounded-xl btn-glass hover:shadow-neon transition-all duration-300 group"
        title="New tab"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-300 group-hover:text-neon-green group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default TabBar;
