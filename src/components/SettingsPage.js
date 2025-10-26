import React, { useState, useEffect } from 'react';

const SettingsPage = ({ onProfileToggle, onAnalyticsToggle }) => {
  const [settings, setSettings] = useState({
    theme: 'cosmic',
    language: 'en',
    searchEngine: 'google',
    aiAssistant: true,
    voiceControl: false,
    autoComplete: true,
    adBlocker: true,
    privacyMode: false,
    notifications: true,
    darkMode: true,
    homepage: 'orbitx',
    tabBehavior: 'new',
    clearCacheOnExit: false,
    saveBrowsingHistory: true,
    showBookmarksBar: true
  });

  const [activeSection, setActiveSection] = useState('appearance');

  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-700/50 hover:bg-gray-800/30 px-4 rounded-lg transition-all">
      <div className="flex-1">
        <p className="text-white font-medium text-lg">{label}</p>
        {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
          checked ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-600'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            checked ? 'transform translate-x-7' : ''
          }`}
        />
      </button>
    </div>
  );

  const SelectOption = ({ value, onChange, options, label, description }) => (
    <div className="py-4 border-b border-gray-700/50 hover:bg-gray-800/30 px-4 rounded-lg transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white font-medium text-lg">{label}</p>
          {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const sections = [
    { id: 'appearance', icon: '🎨', label: 'Appearance' },
    { id: 'search', icon: '🔍', label: 'Search Engine' },
    { id: 'privacy', icon: '🔒', label: 'Privacy & Security' },
    { id: 'advanced', icon: '⚙️', label: 'Advanced' },
    { id: 'about', icon: 'ℹ️', label: 'About OrbitX' }
  ];

  return (
    <div className="h-full flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚙️</span>
            </div>
            <h1 className="text-2xl font-black text-white">Settings</h1>
          </div>

          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          
          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Appearance</h2>
                <p className="text-gray-400">Customize how OrbitX looks</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 space-y-2">
                <ToggleSwitch
                  checked={settings.darkMode}
                  onChange={(val) => handleSettingChange('darkMode', val)}
                  label="Dark Mode"
                  description="Use dark theme across OrbitX"
                />

                <SelectOption
                  value={settings.theme}
                  onChange={(val) => handleSettingChange('theme', val)}
                  label="Theme"
                  description="Choose your preferred color theme"
                  options={[
                    { value: 'cosmic', label: '🌌 Cosmic' },
                    { value: 'neon', label: '⚡ Neon' },
                    { value: 'glass', label: '🔮 Glass' },
                    { value: 'aurora', label: '🌅 Aurora' },
                    { value: 'dark', label: '🌙 Dark' },
                    { value: 'light', label: '☀️ Light' }
                  ]}
                />

                <ToggleSwitch
                  checked={settings.showBookmarksBar}
                  onChange={(val) => handleSettingChange('showBookmarksBar', val)}
                  label="Show Bookmarks Bar"
                  description="Display bookmarks bar below address bar"
                />

                <SelectOption
                  value={settings.homepage}
                  onChange={(val) => handleSettingChange('homepage', val)}
                  label="Homepage"
                  description="Page to show on new tab"
                  options={[
                    { value: 'orbitx', label: 'OrbitX New Tab' },
                    { value: 'blank', label: 'Blank Page' },
                    { value: 'custom', label: 'Custom URL' }
                  ]}
                />
              </div>
            </div>
          )}

          {/* Search Engine Section */}
          {activeSection === 'search' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Search Engine</h2>
                <p className="text-gray-400">Manage your search preferences</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 space-y-2">
                <SelectOption
                  value={settings.searchEngine}
                  onChange={(val) => handleSettingChange('searchEngine', val)}
                  label="Default Search Engine"
                  description="Search engine to use in address bar"
                  options={[
                    { value: 'google', label: '🔎 Google' },
                    { value: 'bing', label: '🔍 Bing' },
                    { value: 'duckduckgo', label: '🦆 DuckDuckGo' },
                    { value: 'yandex', label: '📍 Yandex' }
                  ]}
                />

                <ToggleSwitch
                  checked={settings.aiAssistant}
                  onChange={(val) => handleSettingChange('aiAssistant', val)}
                  label="AI Search Assistant"
                  description="Get AI-powered search suggestions and answers"
                />

                <ToggleSwitch
                  checked={settings.autoComplete}
                  onChange={(val) => handleSettingChange('autoComplete', val)}
                  label="Autocomplete"
                  description="Show search suggestions as you type"
                />

                <ToggleSwitch
                  checked={settings.voiceControl}
                  onChange={(val) => handleSettingChange('voiceControl', val)}
                  label="Voice Search"
                  description="Enable voice input for searches"
                />
              </div>
            </div>
          )}

          {/* Privacy & Security Section */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Privacy & Security</h2>
                <p className="text-gray-400">Control your privacy and security settings</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 space-y-2">
                <ToggleSwitch
                  checked={settings.privacyMode}
                  onChange={(val) => handleSettingChange('privacyMode', val)}
                  label="Privacy Mode"
                  description="Don't save browsing history or cookies"
                />

                <ToggleSwitch
                  checked={settings.adBlocker}
                  onChange={(val) => handleSettingChange('adBlocker', val)}
                  label="Ad Blocker"
                  description="Block advertisements and trackers"
                />

                <ToggleSwitch
                  checked={settings.saveBrowsingHistory}
                  onChange={(val) => handleSettingChange('saveBrowsingHistory', val)}
                  label="Save Browsing History"
                  description="Keep record of visited websites"
                />

                <ToggleSwitch
                  checked={settings.clearCacheOnExit}
                  onChange={(val) => handleSettingChange('clearCacheOnExit', val)}
                  label="Clear Cache on Exit"
                  description="Automatically clear cache when closing browser"
                />

                <div className="pt-4">
                  <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all transform hover:scale-105">
                    Clear Browsing Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Section */}
          {activeSection === 'advanced' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Advanced</h2>
                <p className="text-gray-400">Advanced browser settings</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 space-y-2">
                <SelectOption
                  value={settings.language}
                  onChange={(val) => handleSettingChange('language', val)}
                  label="Language"
                  description="Browser display language"
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'hi', label: 'हिन्दी (Hindi)' },
                    { value: 'es', label: 'Español' },
                    { value: 'fr', label: 'Français' }
                  ]}
                />

                <SelectOption
                  value={settings.tabBehavior}
                  onChange={(val) => handleSettingChange('tabBehavior', val)}
                  label="New Tab Behavior"
                  description="What happens when opening new tabs"
                  options={[
                    { value: 'new', label: 'Open New Tab Page' },
                    { value: 'blank', label: 'Open Blank Page' },
                    { value: 'last', label: 'Reopen Last Closed Tab' }
                  ]}
                />

                <ToggleSwitch
                  checked={settings.notifications}
                  onChange={(val) => handleSettingChange('notifications', val)}
                  label="Notifications"
                  description="Allow websites to show notifications"
                />

                <div className="pt-4 space-y-3">
                  <button 
                    onClick={onAnalyticsToggle}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
                  >
                    📊 View Analytics
                  </button>
                  <button className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all transform hover:scale-105">
                    🔄 Reset All Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">About OrbitX</h2>
                <p className="text-gray-400">Browser information and updates</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center">
                  <video
                    src="/orbitxlogo.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
                <h3 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  OrbitX Browser
                </h3>
                <p className="text-gray-400 mb-6">Version 1.0.0</p>
                
                <div className="space-y-3 text-left max-w-md mx-auto mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">🚀 AI-Powered Search</span>
                    <span className="text-green-400 font-bold">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">⚡ Fast Performance</span>
                    <span className="text-green-400 font-bold">Optimized</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">🔒 Secure Browsing</span>
                    <span className="text-green-400 font-bold">Protected</span>
                  </div>
                </div>

                <button 
                  onClick={onProfileToggle}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  👤 View Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
