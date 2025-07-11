import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Shield, Wifi, Car, Users, CheckCircle, Filter } from 'lucide-react';
import PGCard from '../components/PGCard';
import EnhancedPGCard from '../components/EnhancedPGCard';
import LocationSearch from '../components/LocationSearch';

import { PGCardSkeleton, LoadingSpinner } from '../components/Skeletons';
import { apiService } from '../utils/api';
import { LocationSuggestion } from '../services/locationService';
import { useNotificationHelpers } from '../contexts/NotificationContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [preferredGender, setPreferredGender] = useState<'male' | 'female' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredPGs, setFeaturedPGs] = useState<any[]>([]);
  const { showSuccess, showInfo } = useNotificationHelpers();

  useEffect(() => {
    const savedGender = localStorage.getItem('preferredGender') as 'male' | 'female' | null;
    setPreferredGender(savedGender);
    loadFeaturedPGs();
  }, []);

  const loadFeaturedPGs = async () => {
    try {
      const response = await apiService.getPGs({ limit: 6 });
      setFeaturedPGs(response.pgs || []);
    } catch (error) {
      console.error('Failed to load featured PGs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSearchLocation(location.name);
    showSuccess('Location selected', `Searching for PGs in ${location.name}`);
    navigate(`/search?location=${encodeURIComponent(location.name)}&gender=${preferredGender}`);
  };

  const handleSearch = () => {
    if (searchLocation.trim()) {
      navigate(`/search?location=${encodeURIComponent(searchLocation)}&gender=${preferredGender}`);
    } else {
      navigate(`/search?gender=${preferredGender}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  const popularAreas = [
    'Koramangala', 'Whitefield', 'Electronic City', 'HSR Layout', 
    'Marathahalli', 'BTM Layout', 'Indiranagar', 'Jayanagar'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Perfect Home
              <span className="block text-primary-200">Away From Home</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Premium co-living spaces designed for students and professionals, with all amenities included
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-lg p-2 shadow-lg">
                <LocationSearch
                  value={searchLocation}
                  onChange={setSearchLocation}
                  onSelect={handleLocationSelect}
                  placeholder="🔍 Enter area, locality or landmark..."
                  className="flex-1"
                />
                <button
                  onClick={handleSearch}
                  className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </button>
              </div>

              {preferredGender && (
                <div className="mt-3 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    preferredGender === 'male' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-pink-100 text-pink-800'
                  }`}>
                    Showing {preferredGender === 'male' ? 'Boys' : 'Girls'} PG/Hostels
                  </span>
                </div>
              )}
            </div>

            {/* Popular Areas */}
            <div className="mt-8">
              <p className="text-primary-200 mb-4">Popular Areas in Bangalore:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {popularAreas.map(area => (
                  <button
                    key={area}
                    onClick={() => {
                      setSearchLocation(area);
                      navigate(`/search?location=${encodeURIComponent(area)}&gender=${preferredGender}`);
                    }}
                    className="px-4 py-2 bg-primary-700 hover:bg-primary-600 rounded-full text-sm font-medium transition-colors"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Ghar?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide premium living spaces with all modern amenities and services. Every Ghar property is carefully designed to offer you the best living experience with complete comfort and convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Own Properties</h3>
              <p className="text-gray-600">Every Ghar property is owned and managed by us, ensuring consistent quality and service standards</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Amenities</h3>
              <p className="text-gray-600">High-speed Wi-Fi, modern furniture, and all essential amenities included in every Ghar space</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Move-in Ready</h3>
              <p className="text-gray-600">All our spaces are fully furnished and ready for immediate move-in with zero hassle</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dedicated Support</h3>
              <p className="text-gray-600">Our on-site team and 24/7 support ensure all your needs are met promptly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured PGs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {preferredGender ? `Featured ${preferredGender === 'male' ? 'Boys' : 'Girls'} PGs` : 'Featured PGs'}
            </h2>
            <p className="text-xl text-gray-600">
              Discover our top-rated accommodations in your preferred category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <PGCardSkeleton key={i} />
              ))
            ) : (
              featuredPGs.map(pg => (
                <PGCard key={pg._id} pg={pg} />
              ))
            )}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate(`/search?gender=${preferredGender}`)}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                'View All PGs'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-primary-200">Ghar Properties</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5K+</div>
              <div className="text-primary-200">Happy Residents</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-primary-200">Cities & Growing</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-primary-200">On-site Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Ghar Living?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who call Ghar their home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="bg-primary-600 text-white px-8 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              Explore Our Spaces
            </Link>
            <Link
              to="/register"
              className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              Book a Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;