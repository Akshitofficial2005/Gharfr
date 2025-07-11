import toast from 'react-hot-toast';

// Network error handling
export class NetworkError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

export const handleApiError = (error: any): string => {
  // Check for offline status first
  if (!navigator.onLine) {
    return 'You are currently offline. Please check your internet connection.';
  }

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please login to continue.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return message || 'An unexpected error occurred.';
    }
  } else if (error.request) {
    // Network error - check if it's a connection refused error
    if (error.message && error.message.includes('Network Error')) {
      return 'Cannot connect to the server. The service might be down or your connection might be blocked.';
    }
    if (error.message && error.message.includes('Failed to fetch')) {
      return 'Failed to connect to the authentication server. Please try again later.';
    }
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};

// Retry mechanism
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError!;
};

// Graceful fallbacks
export const withFallback = <T>(
  fn: () => T,
  fallback: T,
  onError?: (error: Error) => void
): T => {
  try {
    return fn();
  } catch (error) {
    onError?.(error as Error);
    return fallback;
  }
};

// User-friendly error messages
export const showUserError = (error: any): void => {
  const message = handleApiError(error);
  toast.error(message);
};

export const showNetworkError = (): void => {
  toast.error('Network connection lost. Please check your internet connection.', {
    duration: 5000,
    icon: '📡'
  });
};

// Check API availability
export const checkApiAvailability = async (url: string = 'http://localhost:5001/api/health'): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(url, { 
      method: 'GET',
      signal: controller.signal,
      mode: 'cors',
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('API availability check failed:', error);
    return false;
  }
};

// Global error handler
export const setupGlobalErrorHandler = (): void => {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service
      // Example: Sentry.captureException(event.error);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service
      // Example: Sentry.captureException(event.reason);
    }
  });

  // Network status monitoring
  window.addEventListener('online', () => {
    toast.success('Connection restored', { icon: '✅' });
  });

  window.addEventListener('offline', () => {
    showNetworkError();
  });
};