import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const GoogleLoginTest: React.FC = () => {
  const handleSuccess = async (credentialResponse: any) => {
    try {
      console.log('Google Login Success:', credentialResponse);
      
      // Send to backend for verification
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Welcome ${data.user.name}!`);
        window.location.href = '/';
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    }
  };

  const handleError = () => {
    console.log('Google Login Failed');
    toast.error('Google login failed');
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Google Login Test</h2>
      <div className="max-w-sm">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          auto_select={false}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
        />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Client ID:</strong> 715647564219-ebiebv3t4dhnj7gdkn1v9n0arbt579v6.apps.googleusercontent.com</p>
        <p><strong>Current URL:</strong> {window.location.origin}</p>
      </div>
    </div>
  );
};

export default GoogleLoginTest;