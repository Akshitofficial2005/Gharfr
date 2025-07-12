import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Making API call to forgot password endpoint...');
      console.log('API Base URL:', process.env.REACT_APP_API_URL);
      
      // First, try to wake up the backend with a health check
      try {
        await api.get('/health');
        console.log('Backend is awake');
      } catch (healthError) {
        console.log('Backend might be sleeping, proceeding anyway...');
      }
      
      const response = await api.post('/auth/forgot-password', { email });
      console.log('API call successful:', response);
      setSent(true);
    } catch (error: any) {
      console.error('API call failed:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request
      });
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        setError('Network error: Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;