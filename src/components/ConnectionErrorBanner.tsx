import React from 'react';

interface ConnectionErrorBannerProps {
  errorType: 'api' | 'websocket' | 'both' | 'auth';
  message?: string;
  onDismiss?: () => void;
}

const ConnectionErrorBanner: React.FC<ConnectionErrorBannerProps> = ({ 
  errorType, 
  message, 
  onDismiss 
}) => {
  // Default messages based on error type
  const getDefaultMessage = () => {
    switch (errorType) {
      case 'api':
        return 'Cannot connect to the server. The API server might be down.';
      case 'websocket':
        return 'WebSocket connection failed. Real-time features are disabled.';
      case 'both':
        return 'Connection issues detected. Some features may not work properly.';
      case 'auth':
        return 'Authentication server is not responding. Login with Google may not work.';
      default:
        return 'Connection error. Please try again later.';
    }
  };

  const displayMessage = message || getDefaultMessage();

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">{displayMessage}</p>
          {errorType === 'api' && (
            <p className="mt-2 text-xs text-yellow-600">
              Make sure the backend server is running at localhost:5001
            </p>
          )}
          {errorType === 'websocket' && (
            <p className="mt-2 text-xs text-yellow-600">
              WebSocket server at localhost:3000/ws is not responding
            </p>
          )}
          {errorType === 'auth' && (
            <p className="mt-2 text-xs text-yellow-600">
              You can still use email/password login if available
            </p>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="mt-2 text-xs text-yellow-700 font-medium hover:text-yellow-600 focus:outline-none"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionErrorBanner;