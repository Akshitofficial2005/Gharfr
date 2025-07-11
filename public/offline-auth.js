// Offline authentication helper for service worker

// Handle Google authentication in offline mode
window.handleOfflineGoogleAuth = function(credential) {
  try {
    // Parse the JWT token
    const parts = credential.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Create user data
    const userData = {
      user: {
        id: payload.sub || 'offline-user',
        name: payload.name || 'Offline User',
        email: payload.email || 'offline@example.com',
        role: 'user',
        phone: '',
        picture: payload.picture || '',
        createdAt: new Date().toISOString()
      },
      token: 'offline_' + Date.now(),
      offline: true
    };
    
    // Store in localStorage for offline use
    localStorage.setItem('offline_user', JSON.stringify(userData));
    localStorage.setItem('offline_token', userData.token);
    
    return userData;
  } catch (error) {
    console.error('Offline auth error:', error);
    return null;
  }
};

// Check if we're in offline mode
window.isOfflineMode = function() {
  return !navigator.onLine;
};

// Register offline auth handler
window.addEventListener('load', function() {
  // Check if we're offline and have a stored user
  if (!navigator.onLine && localStorage.getItem('offline_user')) {
    console.log('Offline mode detected with stored user');
  }
  
  // Listen for online/offline events
  window.addEventListener('online', function() {
    console.log('Back online');
  });
  
  window.addEventListener('offline', function() {
    console.log('Offline mode activated');
  });
  
  // Listen for messages from service worker
  navigator.serviceWorker.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'GET_AUTH_DATA') {
      // Send auth data from localStorage back to service worker
      const userData = localStorage.getItem('offline_user');
      const token = localStorage.getItem('offline_token');
      
      if (userData && token) {
        try {
          const user = JSON.parse(userData);
          event.ports[0].postMessage({
            user: user,
            token: token,
            offline: true
          });
          return;
        } catch (e) {
          console.error('Error parsing stored user data:', e);
        }
      }
      
      // No valid data found
      event.ports[0].postMessage({ error: 'No auth data available' });
    }
  });
});

// Remove fetch override