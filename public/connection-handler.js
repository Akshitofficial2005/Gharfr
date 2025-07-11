// Connection handler for API and WebSocket connections

// Store connection states
window.connectionState = {
  api: {
    available: null,
    lastChecked: null,
    error: null
  },
  websocket: {
    available: null,
    lastChecked: null,
    error: null
  }
};

// Check API availability
window.checkApiAvailability = function(url = 'http://localhost:5001/api/health') {
  window.connectionState.api.lastChecked = Date.now();
  
  return fetch(url, { 
    method: 'HEAD',
    cache: 'no-cache',
    mode: 'cors',
    signal: AbortSignal.timeout(3000) // 3 second timeout
  })
  .then(response => {
    window.connectionState.api.available = response.ok;
    window.connectionState.api.error = null;
    return response.ok;
  })
  .catch(error => {
    window.connectionState.api.available = false;
    window.connectionState.api.error = error.message || 'Connection failed';
    console.warn('API connection check failed:', error);
    return false;
  });
};

// Check WebSocket availability
window.checkWebSocketAvailability = function(url = 'ws://localhost:3000/ws') {
  window.connectionState.websocket.lastChecked = Date.now();
  
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(url);
      
      const timeoutId = setTimeout(() => {
        ws.close();
        window.connectionState.websocket.available = false;
        window.connectionState.websocket.error = 'Connection timeout';
        resolve(false);
      }, 3000);
      
      ws.onopen = () => {
        clearTimeout(timeoutId);
        ws.close();
        window.connectionState.websocket.available = true;
        window.connectionState.websocket.error = null;
        resolve(true);
      };
      
      ws.onerror = (error) => {
        clearTimeout(timeoutId);
        window.connectionState.websocket.available = false;
        window.connectionState.websocket.error = error.message || 'Connection failed';
        console.warn('WebSocket connection check failed:', error);
        resolve(false);
      };
    } catch (error) {
      window.connectionState.websocket.available = false;
      window.connectionState.websocket.error = error.message || 'Connection failed';
      console.warn('WebSocket connection check failed:', error);
      resolve(false);
    }
  });
};

// Handle Google auth errors
window.handleGoogleAuthError = function(error) {
  // Check if API is available
  if (window.connectionState.api.available === false) {
    return {
      type: 'server_down',
      message: 'Authentication server is not running. Please try again later.',
      details: window.connectionState.api.error || 'Connection refused'
    };
  }
  
  // Check if we're offline
  if (!navigator.onLine) {
    return {
      type: 'offline',
      message: 'You are currently offline. Please check your internet connection.',
      details: 'No network connection'
    };
  }
  
  // Handle specific error messages
  if (error.message && error.message.includes('Failed to fetch')) {
    return {
      type: 'connection_failed',
      message: 'Failed to connect to authentication server.',
      details: 'The server at localhost:5001 is not responding'
    };
  }
  
  return {
    type: 'unknown',
    message: 'Authentication failed. Please try again later.',
    details: error.message || 'Unknown error'
  };
};

// Initialize connection checks
window.addEventListener('load', () => {
  // Check connections on page load
  window.checkApiAvailability();
  
  // Don't check WebSocket in service worker context
  if (typeof window.checkWebSocketAvailability === 'function' && 
      typeof navigator.serviceWorker === 'object') {
    window.checkWebSocketAvailability();
  }
});