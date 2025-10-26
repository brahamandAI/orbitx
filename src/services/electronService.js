/**
 * Electron Service
 * Handles communication between React and Electron
 */

class ElectronService {
  constructor() {
    this.isElectron = this.checkElectron();
    this.listeners = new Map();
    
    if (this.isElectron) {
      console.log('✅ Running in Electron Desktop App');
      this.setupListeners();
    } else {
      console.log('ℹ️ Running in Web Browser');
    }
  }

  // Check if running in Electron
  checkElectron() {
    return !!(window && window.electronAPI);
  }

  // Setup event listeners
  setupListeners() {
    if (!this.isElectron) return;

    // Website loading events
    window.electronAPI.onWebsiteLoading((data) => {
      console.log('🔄 Website loading:', data);
      this.emit('website-loading', data);
    });

    window.electronAPI.onWebsiteLoaded((data) => {
      console.log('✅ Website loaded:', data);
      this.emit('website-loaded', data);
    });

    window.electronAPI.onWebsiteError((data) => {
      console.log('❌ Website error:', data);
      this.emit('website-error', data);
    });

    window.electronAPI.onOpenNewTab((data) => {
      console.log('🔗 Open new tab requested:', data);
      this.emit('open-new-tab', data);
    });

    window.electronAPI.onPageTitleUpdated((data) => {
      console.log('📝 Page title updated:', data);
      this.emit('page-title-updated', data);
    });

    window.electronAPI.onPageFaviconUpdated((data) => {
      console.log('🎨 Page favicon updated:', data);
      this.emit('page-favicon-updated', data);
    });
  }

  // Load website in Electron BrowserView
  async loadWebsite(url, tabId) {
    if (!this.isElectron) {
      console.warn('⚠️ Not in Electron, cannot load in BrowserView');
      return { success: false, error: 'Not in Electron' };
    }

    try {
      console.log(`📡 Loading website: ${url} (Tab: ${tabId})`);
      const result = await window.electronAPI.loadWebsite(url, tabId);
      console.log('✅ Load website result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error loading website:', error);
      return { success: false, error: error.message };
    }
  }

  // Hide website view (show React app)
  async hideWebsite() {
    if (!this.isElectron) return { success: false };

    try {
      const result = await window.electronAPI.hideWebsite();
      console.log('✅ Hide website result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error hiding website:', error);
      return { success: false, error: error.message };
    }
  }

  // Close tab
  async closeTab(tabId) {
    if (!this.isElectron) return { success: false };

    try {
      const result = await window.electronAPI.closeTab(tabId);
      console.log(`✅ Close tab result: ${tabId}`, result);
      return result;
    } catch (error) {
      console.error('❌ Error closing tab:', error);
      return { success: false, error: error.message };
    }
  }

  // Navigation methods
  async goBack(tabId) {
    if (!this.isElectron) return { success: false };
    return await window.electronAPI.goBack(tabId);
  }

  async goForward(tabId) {
    if (!this.isElectron) return { success: false };
    return await window.electronAPI.goForward(tabId);
  }

  async reload(tabId) {
    if (!this.isElectron) return { success: false };
    return await window.electronAPI.reload(tabId);
  }

  // Get app info
  async getAppInfo() {
    if (!this.isElectron) {
      return {
        name: 'OrbitX Browser',
        version: '1.0.0',
        platform: 'web',
        isPackaged: false
      };
    }

    try {
      return await window.electronAPI.getAppInfo();
    } catch (error) {
      console.error('❌ Error getting app info:', error);
      return null;
    }
  }

  // Event emitter
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`❌ Error in listener for ${event}:`, error);
      }
    });
  }

  // Cleanup
  cleanup() {
    this.listeners.clear();
    if (this.isElectron) {
      window.electronAPI.removeListener('website-loading');
      window.electronAPI.removeListener('website-loaded');
      window.electronAPI.removeListener('website-error');
      window.electronAPI.removeListener('open-new-tab');
      window.electronAPI.removeListener('page-title-updated');
      window.electronAPI.removeListener('page-favicon-updated');
    }
  }
}

// Create singleton instance
const electronService = new ElectronService();

export default electronService;

