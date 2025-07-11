import React, { useState } from 'react';
import { FilterOptions } from '../types';
import { Search, MapPin, Filter, X } from 'lucide-react';

interface SearchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onSearch: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, onSearch }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleLocationChange = (location: string) => {
    onFiltersChange({ ...filters, location });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: { min, max } });
  };

  const handleRoomTypeChange = (roomType: string, checked: boolean) => {
    const updatedRoomTypes = checked
      ? [...filters.roomType, roomType]
      : filters.roomType.filter(type => type !== roomType);
    onFiltersChange({ ...filters, roomType: updatedRoomTypes });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const updatedAmenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity);
    onFiltersChange({ ...filters, amenities: updatedAmenities });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, rating });
  };

  const clearFilters = () => {
    onFiltersChange({
      location: '',
      priceRange: { min: 0, max: 50000 },
      roomType: [],
      amenities: [],
      rating: 0,
    });
  };

  const roomTypes = ['single', 'double', 'triple', 'dormitory'];
  const amenities = ['wifi', 'food', 'laundry', 'parking', 'gym', 'ac', 'powerBackup', 'security'];
  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Basic Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filters.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
          
          <button
            onClick={onSearch}
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t pt-4 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range (per month)</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange.max)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange(filters.priceRange.min, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="50000"
                />
              </div>
            </div>
          </div>

          {/* Room Types */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Room Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {roomTypes.map(type => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.roomType.includes(type)}
                    onChange={(e) => handleRoomTypeChange(type, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {amenity === 'wifi' ? 'Wi-Fi' : 
                     amenity === 'ac' ? 'AC' : 
                     amenity === 'powerBackup' ? 'Power Backup' : 
                     amenity}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Minimum Rating</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.rating >= rating
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {rating}+ ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;