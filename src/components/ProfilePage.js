import React, { useState } from 'react';

const ProfilePage = ({ onSettingsToggle, onAnalyticsToggle }) => {
  const [profile, setProfile] = useState({
    name: 'Cosmic Explorer',
    email: 'explorer@orbitx.com',
    avatar: '👨‍🚀',
    bio: 'Exploring the digital cosmos with AI-powered browsing',
    location: 'Earth, Milky Way',
    joinDate: 'January 2024',
    preferences: {
      theme: 'cosmic',
      language: 'en',
      timezone: 'UTC+5:30'
    },
    stats: {
      tabsOpened: 1247,
      searchesPerformed: 3892,
      aiInteractions: 156,
      bookmarksCreated: 89
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Opened your first tab', icon: '🚀', unlocked: true },
    { id: 2, name: 'Search Master', description: 'Performed 100 searches', icon: '🔍', unlocked: true },
    { id: 3, name: 'AI Explorer', description: 'Used AI assistant 50 times', icon: '🤖', unlocked: true },
    { id: 4, name: 'Bookmark Collector', description: 'Created 50 bookmarks', icon: '⭐', unlocked: true },
    { id: 5, name: 'Speed Demon', description: 'Opened 1000 tabs', icon: '⚡', unlocked: true },
    { id: 6, name: 'Cosmic Wanderer', description: 'Used browser for 30 days', icon: '🌌', unlocked: false },
    { id: 7, name: 'Privacy Guardian', description: 'Blocked 1000 ads', icon: '🛡️', unlocked: false },
    { id: 8, name: 'Voice Commander', description: 'Used voice search 25 times', icon: '🎤', unlocked: false }
  ];

  const recentActivity = [
    { action: 'Opened new tab', time: '2 minutes ago', icon: '➕' },
    { action: 'Used AI search', time: '15 minutes ago', icon: '🤖' },
    { action: 'Created bookmark', time: '1 hour ago', icon: '⭐' },
    { action: 'Changed theme', time: '3 hours ago', icon: '🎨' },
    { action: 'Updated profile', time: '1 day ago', icon: '👤' }
  ];

  return (
    <div className="h-full overflow-y-auto bg-cosmic-900">
      <div className="p-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="glass-panel p-8 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-2xl glass-panel border border-neon-purple/30 shadow-neon flex items-center justify-center text-4xl">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.avatar}
                      onChange={(e) => handleInputChange('avatar', e.target.value)}
                      className="w-full h-full text-center text-3xl bg-transparent border-none outline-none"
                      placeholder="👤"
                    />
                  ) : (
                    <span>{profile.avatar}</span>
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="aurora-text text-4xl font-bold bg-transparent border-none outline-none"
                      placeholder="Your Name"
                    />
                  ) : (
                    <h1 className="aurora-text text-4xl font-bold">{profile.name}</h1>
                  )}
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="text-gray-300 text-lg bg-transparent border-none outline-none"
                      placeholder="your@email.com"
                    />
                  ) : (
                    <p className="text-gray-300 text-lg">{profile.email}</p>
                  )}
                  <p className="text-neon-purple/70 text-sm font-medium">Member since {profile.joinDate}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="btn-primary px-6 py-3 rounded-xl hover:shadow-neon transition-all duration-300"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-glass px-6 py-3 rounded-xl hover:shadow-neon transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-glass px-6 py-3 rounded-xl hover:shadow-neon transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <span className="text-3xl">📝</span>
                <span>About</span>
              </h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-medium text-white mb-2">Bio</label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full p-4 rounded-xl glass-panel border border-white/20 text-white bg-transparent focus:border-neon-blue focus:outline-none resize-none"
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-white mb-2">Location</label>
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full p-4 rounded-xl glass-panel border border-white/20 text-white bg-transparent focus:border-neon-blue focus:outline-none"
                      placeholder="Your location"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300 text-lg leading-relaxed">{profile.bio}</p>
                  <div className="flex items-center space-x-2 text-neon-blue/70">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{profile.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <span className="text-3xl">📊</span>
                <span>Your Statistics</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl glass-panel border border-neon-blue/20">
                  <div className="text-3xl mb-2">📑</div>
                  <div className="text-2xl font-bold text-neon-blue">{profile.stats.tabsOpened.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Tabs Opened</div>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-panel border border-neon-purple/20">
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="text-2xl font-bold text-neon-purple">{profile.stats.searchesPerformed.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Searches</div>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-panel border border-neon-pink/20">
                  <div className="text-3xl mb-2">🤖</div>
                  <div className="text-2xl font-bold text-neon-pink">{profile.stats.aiInteractions}</div>
                  <div className="text-sm text-gray-300">AI Interactions</div>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-panel border border-neon-green/20">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-2xl font-bold text-neon-green">{profile.stats.bookmarksCreated}</div>
                  <div className="text-sm text-gray-300">Bookmarks</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <span className="text-3xl">🏆</span>
                <span>Achievements</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      achievement.unlocked
                        ? 'glass-panel border-neon-blue/30 shadow-neon'
                        : 'glass-panel border-white/10 opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2 text-center">{achievement.icon}</div>
                    <div className="text-sm font-bold text-white text-center mb-1">{achievement.name}</div>
                    <div className="text-xs text-gray-300 text-center">{achievement.description}</div>
                    {achievement.unlocked && (
                      <div className="absolute top-2 right-2 text-neon-green text-lg">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Preferences */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                <span className="text-2xl">⚙️</span>
                <span>Preferences</span>
              </h2>
              
              <div className="space-y-4">
                <div className="p-3 rounded-xl glass-panel">
                  <div className="text-sm text-gray-300 mb-1">Theme</div>
                  <div className="text-white font-medium capitalize">{profile.preferences.theme}</div>
                </div>
                
                <div className="p-3 rounded-xl glass-panel">
                  <div className="text-sm text-gray-300 mb-1">Language</div>
                  <div className="text-white font-medium">{profile.preferences.language.toUpperCase()}</div>
                </div>
                
                <div className="p-3 rounded-xl glass-panel">
                  <div className="text-sm text-gray-300 mb-1">Timezone</div>
                  <div className="text-white font-medium">{profile.preferences.timezone}</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                <span className="text-2xl">📈</span>
                <span>Recent Activity</span>
              </h2>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-xl glass-panel">
                    <span className="text-lg">{activity.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{activity.action}</div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-panel p-6 rounded-2xl border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                <span className="text-2xl">⚡</span>
                <span>Quick Actions</span>
              </h2>
              
              <div className="space-y-3">
                <button 
                  onClick={onSettingsToggle}
                  className="w-full btn-glass p-3 rounded-xl hover:shadow-neon transition-all duration-300 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🎨</span>
                    <span className="text-white font-medium">Change Theme</span>
                  </div>
                </button>
                
                <button 
                  onClick={onSettingsToggle}
                  className="w-full btn-glass p-3 rounded-xl hover:shadow-neon transition-all duration-300 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🔒</span>
                    <span className="text-white font-medium">Privacy Settings</span>
                  </div>
                </button>
                
                <button 
                  onClick={onAnalyticsToggle}
                  className="w-full btn-glass p-3 rounded-xl hover:shadow-neon transition-all duration-300 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📊</span>
                    <span className="text-white font-medium">View Analytics</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => {
                    const dataStr = JSON.stringify(profile, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'orbitx-profile-data.json';
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full btn-glass p-3 rounded-xl hover:shadow-neon transition-all duration-300 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📤</span>
                    <span className="text-white font-medium">Export Data</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;