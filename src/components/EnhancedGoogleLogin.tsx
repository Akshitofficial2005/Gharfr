import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
    handleAuthError: (error: any) => { type: string; message: string };
    checkApiAvailability: () => Promise<boolean>;
  }
}

const EnhancedGoogleLogin: React.FC = () => {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check API availability
    if (window.checkApiAvailability) {
      window.checkApiAvailability().then(available => {
        setApiAvailable(available);
      });
    }

    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '715647564219-ebiebv3t4dhnj7gdkn1v9n0arbt579v6.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup'
        });

        window.google.accounts.id.renderButton(
          document.getElementById('enhanced-google-signin'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 300
          }
        );
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // Check if we're online
      if (!navigator.onLine) {
        throw new Error('You are offline. Please check your internet connection.');
      }
      
      // Check if API is available
      const isApiAvailable = await window.checkApiAvailability();
      if (!isApiAvailable) {
        throw new Error('Authentication server is not responding. Please try again later.');
      }
      
      console.log('Google credential received');
      
      // Use the authAPI service
      const result = await authAPI.googleLogin(response.credential);
      
      // Type assertion to help TypeScript understand the structure
      const authData = result.data as { user: any; token: string };
      
      if (authData) {
        const { user, token } = authData;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Show appropriate message based on token type
        if (token.startsWith('google_')) {
          toast.success(`Welcome ${user.name}! (Development Mode)`);
        } else {
          toast.success(`Welcome ${user.name}!`);
        }
        
        // Use timeout to ensure toast is visible before redirect
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Use the global error handler if available
      if (window.handleAuthError) {
        const errorInfo = window.handleAuthError(error);
        setErrorMessage(errorInfo.message);
        toast.error(errorInfo.message);
      } else {
        setErrorMessage('Login failed. Please try again.');
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Make handleCredentialResponse available globally
  window.handleCredentialResponse = handleCredentialResponse;

  return (
    <div className="w-full">
      {apiAvailable === false && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          <p className="font-medium">Authentication server is currently unavailable</p>
          <p className="text-sm">You can still sign in, but some features may be limited</p>
        </div>
      )}
      
      <div id="enhanced-google-signin" className="w-full"></div>
      
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          <p>{errorMessage}</p>
          <button 
            className="mt-2 text-sm text-blue-600 hover:underline"
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      )}
      
      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Authenticating...</span>
        </div>
      )}
    </div>
  );
};

export default EnhancedGoogleLogin;