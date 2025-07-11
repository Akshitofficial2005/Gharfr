import React, { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '715647564219-ebiebv3t4dhnj7gdkn1v9n0arbt579v6.apps.googleusercontent.com';

const WorkingGoogleLogin: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [buttonRendered, setButtonRendered] = useState(false);

  const handleCredentialResponse = useCallback(async (response: any) => {
    if (!isMountedRef.current) return;
    try {
      const result = await authAPI.googleLogin(response.credential);
      const authData = result.data as { user: any; token: string };
      if (authData && isMountedRef.current) {
        const { user, token } = authData;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success(`Welcome ${user.name}!`);
        setTimeout(() => {
          if (isMountedRef.current) {
            window.location.href = '/';
          }
        }, 1000);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      if (isMountedRef.current) {
        toast.error('Login failed. Please try again.');
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    setError(null);
    setButtonRendered(false);

    // Simple timeout to stop loading if button doesn't render
    const loadingTimeout = setTimeout(() => {
      if (!buttonRendered && isMountedRef.current) {
        setIsLoading(false);
        setError('Google Sign-In is taking too long to load. Please refresh the page.');
      }
    }, 5000);

    const loadGoogleScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google?.accounts?.id) {
          resolve();
          return;
        }
        
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript) {
          let attempts = 0;
          const checkGoogle = () => {
            attempts++;
            if (window.google?.accounts?.id) {
              resolve();
            } else if (attempts > 50) {
              reject(new Error('Google SDK failed to load after 5 seconds'));
            } else {
              setTimeout(checkGoogle, 100);
            }
          };
          checkGoogle();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          let attempts = 0;
          const checkGoogle = () => {
            attempts++;
            if (window.google?.accounts?.id) {
              resolve();
            } else if (attempts > 30) {
              reject(new Error('Google SDK not available after script load'));
            } else {
              setTimeout(checkGoogle, 100);
            }
          };
          checkGoogle();
        };
        script.onerror = () => {
          reject(new Error('Failed to load Google script'));
        };
        document.head.appendChild(script);
      });
    };

    const initializeGoogleSignIn = async () => {
      try {
        await loadGoogleScript();
        
        if (!isMountedRef.current || !containerRef.current) return;
        if (!window.google?.accounts?.id) {
          throw new Error('Google SDK not available');
        }

        // Clear container
        containerRef.current.innerHTML = '';

        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup'
        });

        // Render button
        if (containerRef.current && isMountedRef.current) {
          window.google.accounts.id.renderButton(
            containerRef.current,
            {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              width: 300
            }
          );
          
          setButtonRendered(true);
          setIsLoading(false);
          clearTimeout(loadingTimeout);
        }
      } catch (err: any) {
        console.error('Google Sign-In setup error:', err);
        if (isMountedRef.current) {
          setError(err.message || 'Failed to load Google Sign-In');
          setIsLoading(false);
          clearTimeout(loadingTimeout);
        }
      }
    };

    // Initialize with small delay
    const timeoutId = setTimeout(initializeGoogleSignIn, 100);
    
    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);
      clearTimeout(loadingTimeout);
    };
  }, [handleCredentialResponse, retryKey]);

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
    setError(null);
    setIsLoading(true);
    setButtonRendered(false);
  };

  if (error) {
    return (
      <div className="w-full p-4 text-center border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 font-medium mb-2">Google Sign-In Error</p>
        <p className="text-red-500 text-sm mb-3">{error}</p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading && !buttonRendered) {
    return (
      <div className="w-full p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading Google Sign-In...</p>
      </div>
    );
  }

  return (
    <div className="w-full google-login-wrapper" key={`google-login-${retryKey}`}>
      <div 
        ref={containerRef} 
        className="w-full google-signin-container"
        style={{ minHeight: '44px' }}
      />
    </div>
  );
};

export default WorkingGoogleLogin;