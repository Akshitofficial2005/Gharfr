import React, { useState } from 'react';
import { Filter, X, MapPin, IndianRupee, Users, Star } from 'lucide-react';

interface FilterProps {
  onFiltersChange: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AdvancedFilters: React.FC<FilterProps> = ({ onFiltersChange, isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    priceRange: [5000, 25000],
    roomType: '',
    gender: '',
    amenities: [] as string[],
    rating: 0,
    availability: true
  });

  const amenitiesList = ['wifi', 'food', 'parking', 'gym', 'ac', 'laundry', 'security'];

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    const newFilters = { ...filters, amenities: newAmenities };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      priceRange: [5000, 25000],
      roomType: '',
      gender: '',
      amenities: [],
      rating: 0,
      availability: true
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Advanced Filters</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <IndianRupee className="w-4 h-4 inline mr-1" />
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="3000"
                max="30000"
                step="1000"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
              <span className="text-sm">₹{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Room Type
            </label>
            <select
              value={filters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Any</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2">Gender Preference</label>
            <div className="flex space-x-2">
              {['Any', 'Male', 'Female'].map(gender => (
                <button
                  key={gender}
                  onClick={() => handleFilterChange('gender', gender === 'Any' ? '' : gender.toLowerCase())}
                  className={`px-3 py-1 rounded-full text-sm ${
                    (gender === 'Any' && !filters.gender) || filters.gender === gender.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {amenitiesList.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`p-2 text-sm rounded-lg capitalize ${
                    filters.amenities.includes(amenity)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {amenity === 'wifi' ? 'Wi-Fi' : amenity === 'ac' ? 'AC' : amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Star className="w-4 h-4 inline mr-1" />
              Minimum Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange('rating', rating)}
                  className={`p-1 ${filters.rating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <button
              onClick={clearFilters}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;