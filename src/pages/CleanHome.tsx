import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Navigation } from 'lucide-react';
import EnhancedPGCard from '../components/EnhancedPGCard';
import LocationSearch from '../components/LocationSearch';
import SearchBar from '../components/SearchBar';
import { PGCardSkeleton } from '../components/Skeletons';
import { mockEnhancedPGs } from '../data/enhancedMockData';
import { LocationSuggestion } from '../services/locationService';

const CleanHome: React.FC = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSearchLocation(location.name);
    handleSearch(location.name);
  };

  const handleSearch = (location?: string) => {
    const searchTerm = location || searchLocation;
    if (searchTerm.trim()) {
      navigate(`/search?location=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/search');
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock location for demo
          setUserLocation('Koramangala, Bangalore');
          setSearchLocation('Koramangala, Bangalore');
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Show top 6 PGs
  const topPGs = mockEnhancedPGs.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect PG
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Discover premium hostels and PGs near you
          </p>
          
          {/* Main Search Box */}
          <SearchBar />
        </div>
      </section>

      {/* Top PGs Section */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Top Rated PGs & Hostels
            </h2>
            <button
              onClick={() => navigate('/search')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <PGCardSkeleton key={i} />
              ))
            ) : (
              topPGs.map(pg => (
                <div key={pg.id} className="group">
                  <EnhancedPGCard pg={pg} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-gray-600">Verified PGs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">50K+</div>
              <div className="text-gray-600">Happy Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">15+</div>
              <div className="text-gray-600">Cities</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CleanHome;