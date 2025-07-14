/**
 * Token Refresher Utility
 * 
 * This utility helps manage authentication tokens:
 * - Validates token format before use
 * - Refreshes expired tokens
 * - Provides clean error handling for auth issues
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * Validates if a token is properly formatted
 * @param {string} token - JWT token to validate
 * @returns {boolean} - Whether token is valid format
 */
export const isValidTokenFormat = (token) => {
  if (!token) return false;
  
  // Check if token has the correct JWT format (3 parts separated by dots)
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Gets a valid token, refreshing if needed
 * @returns {Promise<string|null>} - Valid token or null if unavailable
 */
export const getValidToken = async () => {
  try {
    // Get current token
    const token = localStorage.getItem('token');
    
    // Check if token exists and has valid format
    if (!token || !isValidTokenFormat(token)) {
      console.warn('Token missing or malformed - redirecting to login');
      return null;
    }
    
    // For Google tokens, just return as is (they're handled differently)
    if (token.startsWith('google_')) {
      return token;
    }
    
    // Try to refresh the token if needed
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Token is still valid
        return token;
      } else {
        // Token is invalid or expired, try to refresh
        console.log('Token validation failed, attempting refresh');
        return await refreshToken(token);
      }
    } catch (error) {
      console.error('Error validating token:', error);
      return token; // Return existing token as fallback
    }
  } catch (error) {
    console.error('Error in getValidToken:', error);
    return null;
  }
};

/**
 * Attempts to refresh an expired token
 * @param {string} currentToken - Current token to refresh
 * @returns {Promise<string|null>} - New token or null if refresh failed
 */
export const refreshToken = async (currentToken) => {
  try {
    // Try to refresh the token
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const newToken = data.token;
      
      // Update localStorage
      localStorage.setItem('token', newToken);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return newToken;
    } else {
      // If refresh fails, clear storage and return null
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

/**
 * Gets authorization headers with a valid token
 * @returns {Promise<Object>} - Headers object with Authorization if token available
 */
export const getAuthHeaders = async () => {
  const token = await getValidToken();
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};