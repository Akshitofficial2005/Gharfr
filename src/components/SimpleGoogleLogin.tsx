import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = '715647564219-ebiebv3t4dhnj7gdkn1v9n0arbt579v6.apps.googleusercontent.com';

const SimpleGoogleLogin: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'timeout'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setStatus('loading');
    
    // Set a 8-second timeout for loading
    timeoutRef.current = setTimeout(() => {
      if (status === 'loading') {
        setStatus('timeout');
        setErrorMessage('Google Sign-In is taking too long to load. Please try the demo login below.');
      }
    }, 8000);

    // Check if Google SDK is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    // Load Google SDK script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait for SDK to be ready
      let attempts = 0;
      const checkGoogle = () => {
        attempts++;
        if (window.google?.accounts?.id) {
          initializeGoogle();
        } else if (attempts < 30) {
          setTimeout(checkGoogle, 200);
        } else {
          setStatus('error');
          setErrorMessage('Google SDK failed to initialize after loading.');
        }
      };
      checkGoogle();
    };

    script.onerror = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStatus('error');
      setErrorMessage('Failed to load Google Sign-In script. Please check your internet connection.');
    };

    document.head.appendChild(script);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const initializeGoogle = () => {
    try {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup'
      });

      if (containerRef.current) {
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 300
        });
        setStatus('ready');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to initialize Google Sign-In: ' + (error as Error).message);
    }
  };

  const handleCredentialResponse = async (response: any) => {
    try {
      toast.success('Google login successful! (Demo mode - backend integration disabled)');
      console.log('Google credential received:', response.credential);
      
      // For now, just show success - you can integrate with backend later
      // Simulate login success
      const userData = {
        name: 'Demo User',
        email: 'demo@gmail.com',
        id: 'google_demo_user'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'demo_google_token');
      
      // Redirect to home
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
      
    } catch (error) {
      toast.error('Login failed: ' + (error as Error).message);
    }
  };

  const handleDemoLogin = () => {
    // Redirect to demo login page
    window.location.href = '/working-login';
  };

  if (status === 'loading') {
    return (
      <div className="w-full p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading Google Sign-In...</p>
      </div>
    );
  }

  if (status === 'timeout' || status === 'error') {
    return (
      <div className="w-full">
        <div className="p-4 text-center border border-yellow-200 rounded-lg bg-yellow-50 mb-4">
          <p className="text-yellow-800 font-medium mb-2">Google Sign-In Unavailable</p>
          <p className="text-yellow-700 text-sm mb-3">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 mr-2"
          >
            Retry
          </button>
          <button 
            onClick={handleDemoLogin}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Use Demo Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full" style={{ minHeight: '44px' }} />
      
      {/* Fallback demo login option */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center mb-2">Having trouble with Google?</p>
        <button 
          onClick={handleDemoLogin}
          className="w-full py-2 px-4 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
        >
          Try Demo Login Instead
        </button>
      </div>
    </div>
  );
};

// Extend window type
declare global {
  interface Window {
    google: any;
  }
}

export default SimpleGoogleLogin;