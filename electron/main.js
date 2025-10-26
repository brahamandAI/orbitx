const { app, BrowserWindow, BrowserView, ipcMain, session } = require('electron');
const path = require('path');

// Check if in development mode (without electron-is-dev dependency)
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let currentView = null;
const views = new Map(); // Store multiple BrowserViews for tabs

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    title: 'OrbitX Browser',
    backgroundColor: '#1a1a2e',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    show: false, // Don't show until ready
    icon: path.join(__dirname, '../public/icon.png')
  });

  // Load the React app
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('✅ OrbitX Desktop App Ready!');
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Cleanup on close
  mainWindow.on('closed', () => {
    // Clear all views
    views.forEach(view => {
      if (view && !view.isDestroyed()) {
        mainWindow.removeBrowserView(view);
        view.webContents.close();
      }
    });
    views.clear();
    currentView = null;
    mainWindow = null;
  });

  // Prevent external links from opening in the same window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    console.log('🔗 External link requested:', url);
    // Handle in BrowserView instead
    return { action: 'deny' };
  });
}

// Load website in BrowserView (bypasses X-Frame-Options!)
function loadWebsiteInView(url, tabId) {
  console.log(`🌐 Loading website in BrowserView: ${url} (Tab: ${tabId})`);

  // Remove current view if exists
  if (currentView && !currentView.isDestroyed()) {
    mainWindow.removeBrowserView(currentView);
  }

  // Create or get existing view for this tab
  let view = views.get(tabId);
  
  if (!view || view.isDestroyed()) {
    view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true,
        allowRunningInsecureContent: false,
        plugins: true
      }
    });
    views.set(tabId, view);

    // Navigation handlers
    view.webContents.on('did-start-loading', () => {
      console.log('🔄 Loading started:', url);
      mainWindow.webContents.send('website-loading', { tabId, url });
    });

    view.webContents.on('did-finish-load', () => {
      console.log('✅ Loading finished:', url);
      mainWindow.webContents.send('website-loaded', { tabId, url });
    });

    view.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.log('❌ Loading failed:', errorDescription);
      mainWindow.webContents.send('website-error', { 
        tabId, 
        url, 
        error: errorDescription 
      });
    });

    // Handle new window requests
    view.webContents.setWindowOpenHandler(({ url: newUrl }) => {
      console.log('🔗 New window requested:', newUrl);
      // Open in new BrowserView or external browser
      mainWindow.webContents.send('open-new-tab', { url: newUrl });
      return { action: 'deny' };
    });

    // Page title changes
    view.webContents.on('page-title-updated', (event, title) => {
      mainWindow.webContents.send('page-title-updated', { tabId, title });
    });

    // Favicon changes
    view.webContents.on('page-favicon-updated', (event, favicons) => {
      if (favicons && favicons.length > 0) {
        mainWindow.webContents.send('page-favicon-updated', { 
          tabId, 
          favicon: favicons[0] 
        });
      }
    });
  }

  // Set view bounds (below address bar, full window)
  const bounds = mainWindow.getBounds();
  view.setBounds({
    x: 0,
    y: 70, // Space for React UI header
    width: bounds.width,
    height: bounds.height - 70
  });

  // Add view to window
  mainWindow.addBrowserView(view);
  currentView = view;

  // Load the URL
  view.webContents.loadURL(url).catch(err => {
    console.error('❌ Failed to load URL:', err);
    mainWindow.webContents.send('website-error', { 
      tabId, 
      url, 
      error: err.message 
    });
  });

  // Adjust view when window resizes
  mainWindow.on('resize', () => {
    if (view && !view.isDestroyed()) {
      const newBounds = mainWindow.getBounds();
      view.setBounds({
        x: 0,
        y: 70,
        width: newBounds.width,
        height: newBounds.height - 70
      });
    }
  });
}

// Hide current BrowserView (show React app)
function hideCurrentView() {
  if (currentView && !currentView.isDestroyed()) {
    mainWindow.removeBrowserView(currentView);
    currentView = null;
  }
}

// IPC Handlers
ipcMain.handle('load-website', async (event, { url, tabId }) => {
  try {
    console.log(`📡 IPC: load-website - ${url} (Tab: ${tabId})`);
    loadWebsiteInView(url, tabId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error loading website:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('hide-website', async (event) => {
  try {
    console.log('📡 IPC: hide-website');
    hideCurrentView();
    return { success: true };
  } catch (error) {
    console.error('❌ Error hiding website:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('close-tab', async (event, { tabId }) => {
  try {
    console.log(`📡 IPC: close-tab - Tab: ${tabId}`);
    const view = views.get(tabId);
    if (view && !view.isDestroyed()) {
      if (currentView === view) {
        mainWindow.removeBrowserView(view);
        currentView = null;
      }
      view.webContents.close();
      views.delete(tabId);
    }
    return { success: true };
  } catch (error) {
    console.error('❌ Error closing tab:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('navigate-back', async (event, { tabId }) => {
  try {
    const view = views.get(tabId);
    if (view && !view.isDestroyed() && view.webContents.canGoBack()) {
      view.webContents.goBack();
      return { success: true };
    }
    return { success: false, error: 'Cannot go back' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('navigate-forward', async (event, { tabId }) => {
  try {
    const view = views.get(tabId);
    if (view && !view.isDestroyed() && view.webContents.canGoForward()) {
      view.webContents.goForward();
      return { success: true };
    }
    return { success: false, error: 'Cannot go forward' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reload-page', async (event, { tabId }) => {
  try {
    const view = views.get(tabId);
    if (view && !view.isDestroyed()) {
      view.webContents.reload();
      return { success: true };
    }
    return { success: false, error: 'View not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-app-info', async () => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    isPackaged: app.isPackaged,
    platform: process.platform
  };
});

// App ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  console.log('🚀 OrbitX Electron App Started!');
  console.log('📦 Version:', app.getVersion());
  console.log('🖥️ Platform:', process.platform);
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});

console.log('✅ Electron main process loaded');

