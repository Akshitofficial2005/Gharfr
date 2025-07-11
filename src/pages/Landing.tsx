import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users2, UserX } from 'lucide-react';
import { hapticFeedback } from '../utils/haptics';
import EnhancedButton from '../components/EnhancedButton';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  
  useEffect(() => {
    // Check if user has already selected gender preference
    const savedGender = localStorage.getItem('preferredGender');
    if (savedGender) {
      navigate('/home');
    }
  }, [navigate]);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    hapticFeedback.success();
    setSelectedGender(gender);
    localStorage.setItem('preferredGender', gender);
    // Add a small delay for visual feedback
    setTimeout(() => {
      navigate('/home');
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-scaleIn backdrop-blur-sm">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 group">
              <Home className="h-10 w-10 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">Ghar</span>
            </div>
          </div>

          {/* Welcome Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Ghar
          </h1>
          <p className="text-gray-600 mb-8">
            Premium co-living spaces designed for modern living
          </p>

          {/* Gender Toggle */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-800 mb-6">
              I'm looking for:
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleGenderSelect('male')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                  selectedGender === 'male'
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-blue-200'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 bg-white hover:shadow-blue-100'
                }`}
              >
                <Users2 className={`h-6 w-6 transition-transform duration-300 ${selectedGender === 'male' ? 'scale-110' : ''}`} />
                <span className="text-lg font-medium">Boys PG/Hostels</span>
              </button>

              <button
                onClick={() => handleGenderSelect('female')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                  selectedGender === 'female'
                    ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 shadow-pink-200'
                    : 'border-gray-200 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 bg-white hover:shadow-pink-100'
                }`}
              >
                <UserX className={`h-6 w-6 transition-transform duration-300 ${selectedGender === 'female' ? 'scale-110' : ''}`} />
                <span className="text-lg font-medium">Girls PG/Hostels</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                You can change this preference anytime in settings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
