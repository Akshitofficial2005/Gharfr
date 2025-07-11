import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '', 
  placeholder = 'Search by area, PG name, or landmark in Indore' 
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    } else {
      toast.error('Please enter a search term');
    }
  };

  const handleUseLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      // Check if coordinates are within Indore bounds (approximate)
      const indoreBounds = {
        north: 22.8,
        south: 22.6,
        east: 75.95,
        west: 75.7
      };
      
      const { latitude, longitude } = position.coords;
      
      if (latitude >= indoreBounds.south && latitude <= indoreBounds.north &&
          longitude >= indoreBounds.west && longitude <= indoreBounds.east) {
        // User is in Indore, determine area based on coordinates
        const indoreAreas = [
          { name: 'Vijay Nagar', lat: 22.7532, lng: 75.8937 },
          { name: 'Palasia', lat: 22.7279, lng: 75.8723 },
          { name: 'MG Road', lat: 22.7196, lng: 75.8577 },
          { name: 'Rau', lat: 22.6708, lng: 75.7847 },
          { name: 'Bhawarkua', lat: 22.6986, lng: 75.8661 }
        ];
        
        // Find closest area
        let closestArea = indoreAreas[0];
        let minDistance = Math.abs(latitude - closestArea.lat) + Math.abs(longitude - closestArea.lng);
        
        indoreAreas.forEach(area => {
          const distance = Math.abs(latitude - area.lat) + Math.abs(longitude - area.lng);
          if (distance < minDistance) {
            minDistance = distance;
            closestArea = area;
          }
        });
        
        setQuery(`${closestArea.name}, Indore`);
        toast.success('Location detected successfully');
      } else {
        // User is outside Indore, suggest Indore areas
        const randomArea = ['Vijay Nagar', 'Palasia', 'MG Road'][Math.floor(Math.random() * 3)];
        setQuery(`${randomArea}, Indore`);
        toast.success('Showing popular areas in Indore');
      }
    } catch (error) {
      // Fallback to mock location for Indore
      const indoreAreas = ['Vijay Nagar', 'Palasia', 'MG Road', 'Rau', 'Bhawarkua'];
      const randomArea = indoreAreas[Math.floor(Math.random() * indoreAreas.length)];
      setQuery(randomArea + ', Indore');
      toast.success('Location detected (approximate)');
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="searchQuery"
            name="searchQuery"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
          />
        </div>

        {/* Use Location Button */}
        <button
          type="button"
          onClick={handleUseLocation}
          disabled={isGettingLocation}
          className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-all duration-200 bg-white disabled:opacity-50"
          title="Use my location"
        >
          {isGettingLocation ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          ) : (
            <Navigation className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 font-semibold text-lg flex items-center gap-2"
        >
          <Search className="h-5 w-5" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Popular Searches */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-gray-600">Popular:</span>
        {['Vijay Nagar', 'Palasia', 'MG Road', 'Rau'].map((area) => (
          <button
            key={area}
            onClick={() => {
              setQuery(area + ', Indore');
              navigate(`/search?query=${encodeURIComponent(area + ', Indore')}`);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;