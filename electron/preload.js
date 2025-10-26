const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Check if running in Electron
  isElectron: true,

  // Load website in BrowserView
  loadWebsite: (url, tabId) => ipcRenderer.invoke('load-website', { url, tabId }),

  // Hide website view (show React app)
  hideWebsite: () => ipcRenderer.invoke('hide-website'),

  // Close tab
  closeTab: (tabId) => ipcRenderer.invoke('close-tab', { tabId }),

  // Navigation
  goBack: (tabId) => ipcRenderer.invoke('navigate-back', { tabId }),
  goForward: (tabId) => ipcRenderer.invoke('navigate-forward', { tabId }),
  reload: (tabId) => ipcRenderer.invoke('reload-page', { tabId }),

  // App info
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),

  // Event listeners
  onWebsiteLoading: (callback) => {
    ipcRenderer.on('website-loading', (event, data) => callback(data));
  },

  onWebsiteLoaded: (callback) => {
    ipcRenderer.on('website-loaded', (event, data) => callback(data));
  },

  onWebsiteError: (callback) => {
    ipcRenderer.on('website-error', (event, data) => callback(data));
  },

  onOpenNewTab: (callback) => {
    ipcRenderer.on('open-new-tab', (event, data) => callback(data));
  },

  onPageTitleUpdated: (callback) => {
    ipcRenderer.on('page-title-updated', (event, data) => callback(data));
  },

  onPageFaviconUpdated: (callback) => {
    ipcRenderer.on('page-favicon-updated', (event, data) => callback(data));
  },

  // Remove listeners
  removeListener: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

console.log('✅ Electron preload script loaded');
console.log('🔐 electronAPI exposed to renderer');

