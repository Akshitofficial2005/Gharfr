import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '715647564219-ebiebv3t4dhnj7gdkn1v9n0arbt579v6.apps.googleusercontent.com';

const SimpleGoogleLogin: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'timeout'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { setUser } = useAuth();
  const navigate = useNavigate();

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
      
      console.log('Initializing Google with Client ID:', GOOGLE_CLIENT_ID);
      console.log('Current domain:', window.location.hostname);
      
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup',
        context: 'signin',
        itp_support: true
      });

      if (containerRef.current) {
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 300,
          logo_alignment: 'left'
        });
        setStatus('ready');
        console.log('Google Sign-In button rendered successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
      setStatus('error');
      setErrorMessage('Failed to initialize Google Sign-In: ' + (error as Error).message);
    }
  };

  const handleCredentialResponse = async (response: any) => {
    try {
      console.log('Google credential response received:', response);
      const loadingToast = toast.loading('Signing in with Google...');
      
      // Send the credential to our backend
      const apiResponse = await fetch(`${process.env.REACT_APP_API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential
        })
      });

      const data = await apiResponse.json();
      console.log('Backend response:', data);

      if (apiResponse.ok) {
        // Store user data and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update auth context
        setUser(data.user);
        
        toast.dismiss(loadingToast);
        toast.success(`Welcome back, ${data.user.name}!`);
        
        // Navigate to home page
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.error || 'Google login failed');
      }
    } catch (error) {
      toast.error('Google login failed: ' + (error as Error).message);
      console.error('Google login error:', error);
    }
  };

  const handleManualGoogleLogin = () => {
    try {
      if (window.google?.accounts?.id) {
        console.log('Manually triggering Google prompt');
        window.google.accounts.id.prompt((notification: any) => {
          console.log('Google prompt notification:', notification);
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google prompt was not displayed or skipped');
            toast.error('Google Sign-In was blocked or cancelled. Please allow popups for this site.');
          }
        });
      } else {
        toast.error('Google Sign-In is not available. Please refresh the page.');
      }
    } catch (error) {
      console.error('Manual Google login error:', error);
      toast.error('Failed to open Google Sign-In');
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
      
      {/* Manual trigger button if automatic button doesn't work */}
      <div className="mt-2">
        <button 
          onClick={handleManualGoogleLogin}
          className="w-full py-2 px-4 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Click here if Google button doesn't work
        </button>
      </div>
      
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