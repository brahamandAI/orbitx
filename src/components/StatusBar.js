import React, { useState } from 'react';

const StatusBar = ({ activeTab }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`bg-gray-800 border-t border-gray-700 px-4 py-1 text-xs text-gray-400 transition-all duration-200 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          {activeTab?.url && (
            <span className="text-orbitix-400">{activeTab.url}</span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span>OrbitX Browser</span>
          <span>ब्रह्मांड AI Powered</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
