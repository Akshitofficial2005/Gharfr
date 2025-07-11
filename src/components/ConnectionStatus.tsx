import React, { useEffect, useState } from 'react';

interface ConnectionState {
  api: {
    available: boolean | null;
    lastChecked: number | null;
    error: string | null;
  };
  websocket: {
    available: boolean | null;
    lastChecked: number | null;
    error: string | null;
  };
}

declare global {
  interface Window {
    connectionState: ConnectionState;
    checkApiAvailability: () => Promise<boolean>;
    checkWebSocketAvailability: () => Promise<boolean>;
  }
}

const ConnectionStatus: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);
  const [wsStatus, setWsStatus] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the connection handler is available
    if (window.connectionState) {
      setApiStatus(window.connectionState.api.available);
      setWsStatus(window.connectionState.websocket.available);
      
      // Show banner if either connection is down
      if (window.connectionState.api.available === false || 
          window.connectionState.websocket.available === false) {
        setShowBanner(true);
      }
    }

    // Set up periodic checks
    const checkConnections = async () => {
      if (typeof window.checkApiAvailability === 'function') {
        const apiAvailable = await window.checkApiAvailability();
        setApiStatus(apiAvailable);
      }
      
      if (typeof window.checkWebSocketAvailability === 'function') {
        const wsAvailable = await window.checkWebSocketAvailability();
        setWsStatus(wsAvailable);
      }
      
      // Update banner visibility
      if (window.connectionState) {
        setShowBanner(
          window.connectionState.api.available === false || 
          window.connectionState.websocket.available === false
        );
      }
    };

    // Check connections every 30 seconds
    const intervalId = setInterval(checkConnections, 30000);
    
    // Initial check
    checkConnections();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Don't render anything if all connections are good
  if (!showBanner) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 fixed bottom-4 right-4 max-w-md rounded shadow-lg z-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700 font-medium">
            Connection Issues Detected
          </p>
          <div className="mt-2 text-xs text-yellow-700">
            {apiStatus === false && (
              <p>• API server is not responding. Some features may not work.</p>
            )}
            {wsStatus === false && (
              <p>• WebSocket connection failed. Real-time updates are disabled.</p>
            )}
          </div>
          <div className="mt-3">
            <button
              onClick={() => setShowBanner(false)}
              className="text-xs text-yellow-700 font-medium hover:text-yellow-600 focus:outline-none"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;