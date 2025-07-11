/**
 * Offline authentication utilities
 */

// Check if we have an offline authenticated user
export const checkOfflineAuth = async () => {
  if (!('caches' in window)) {
    return null;
  }
  
  try {
    const cache = await caches.open('auth-cache');
    const response = await cache.match('/api/auth/offline-user');
    
    if (response) {
      const userData = await response.json();
      return userData;
    }
  } catch (error) {
    console.error('Error checking offline auth:', error);
  }
  
  return null;
};

// Handle Google authentication with offline support
export const handleGoogleAuth = async (credential) => {
  try {
    // Try online authentication first
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ credential })
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Authentication failed');
  } catch (error) {
    console.warn('Online authentication failed, trying offline mode');
    
    // Parse the JWT token for offline authentication
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        
        // Create offline user data
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
        
        return userData;
      }
    } catch (parseError) {
      console.error('Failed to parse credential for offline auth:', parseError);
    }
    
    // Last resort: check if we have previously cached auth
    const offlineUser = await checkOfflineAuth();
    if (offlineUser) {
      return offlineUser;
    }
    
    throw error;
  }
};

export default {
  checkOfflineAuth,
  handleGoogleAuth
};