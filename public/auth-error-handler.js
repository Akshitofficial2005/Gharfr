// Auth error handler
window.handleAuthError = function(error) {
  // Check if error is related to connection issues
  if (error.message && error.message.includes('Failed to fetch')) {
    console.log('Connection to authentication server failed');
    
    // Check if we're offline
    if (!navigator.onLine) {
      return {
        type: 'offline',
        message: 'You are currently offline. Please check your internet connection and try again.'
      };
    }
    
    // Server might be down
    return {
      type: 'server',
      message: 'Authentication server is not responding. Please try again later or contact support.'
    };
  }
  
  // Check for connection refused errors
  if (error.message && (error.message.includes('ERR_CONNECTION_REFUSED') || 
                        error.message.includes('net::ERR_CONNECTION_REFUSED'))) {
    return {
      type: 'connection_refused',
      message: 'Cannot connect to the authentication server. The server might be down or not running.'
    };
  }
  
  // Handle other auth errors
  return {
    type: 'unknown',
    message: 'Authentication failed. Please try again or use another sign-in method.'
  };
};

// Check if the backend API is available
window.checkApiAvailability = function() {
  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('API health check timeout')), 3000);
  });
  
  // Create the fetch promise
  const fetchPromise = fetch('http://localhost:5001/api/health', { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    cache: 'no-cache'
  })
  .then(response => {
    if (!response.ok) throw new Error('API health check failed');
    return true;
  });
  
  // Race the fetch against the timeout
  return Promise.race([fetchPromise, timeoutPromise])
    .catch(error => {
      console.error('API availability check failed:', error);
      
      // Store the error type for better user feedback
      if (error.message && error.message.includes('timeout')) {
        window.apiErrorType = 'timeout';
      } else if (error.message && error.message.includes('Failed to fetch')) {
        window.apiErrorType = 'connection_failed';
      } else if (error.message && error.message.includes('Network Error')) {
        window.apiErrorType = 'network_error';
      } else {
        window.apiErrorType = 'unknown';
      }
      
      return false;
    });
};

// Get API error details
window.getApiErrorDetails = function() {
  switch(window.apiErrorType) {
    case 'timeout':
      return 'The server is taking too long to respond. It might be overloaded.';
    case 'connection_failed':
      return 'Could not connect to the server. It might be down or not running.';
    case 'network_error':
      return 'A network error occurred. Please check your connection.';
    default:
      return 'The server is currently unavailable. Please try again later.';
  }
};