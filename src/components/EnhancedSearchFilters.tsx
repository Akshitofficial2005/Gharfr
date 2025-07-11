import React, { useState, useEffect } from 'react';
import { MapPin, Filter, X, ChevronDown, Users, Home, Wifi, Car, Utensils, Dumbbell, Shield, Zap, GraduationCap } from 'lucide-react';
import { EnhancedFilterOptions, College } from '../types/enhanced';
import { EnhancedSearchService } from '../services/enhancedSearchService';

interface EnhancedSearchFiltersProps {
  filters: EnhancedFilterOptions;
  onFiltersChange: (filters: EnhancedFilterOptions) => void;
  onSearch: () => void;
  showAdvanced?: boolean;
}

const EnhancedSearchFilters: React.FC<EnhancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  showAdvanced = true
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    setColleges(EnhancedSearchService.getColleges());
  }, []);

  const handleFilterChange = (key: keyof EnhancedFilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleArrayFilterToggle = (key: keyof EnhancedFilterOptions, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    onFiltersChange({
      location: '',
      nearbyColleges: [],
      priceRange: { min: 0, max: 50000 },
      gender: '',
      roomType: [],
      amenities: [],
      furnishing: '',
      rating: 0,
      distance: 10,
      sortBy: 'rating'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.nearbyColleges.length > 0) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) count++;
    if (filters.gender) count++;
    if (filters.roomType.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.furnishing) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  const amenityOptions = [
    { key: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { key: 'meals', label: 'Meals', icon: Utensils },
    { key: 'ac', label: 'AC', icon: Zap },
    { key: 'laundry', label: 'Laundry', icon: Shield },
    { key: 'parking', label: 'Parking', icon: Car },
    { key: 'gym', label: 'Gym', icon: Dumbbell },
    { key: 'security', label: '24/7 Security', icon: Shield },
    { key: 'powerBackup', label: 'Power Backup', icon: Zap },
  ];

  const roomTypeOptions = [
    { key: 'single', label: 'Single Room', icon: Home },
    { key: 'double', label: 'Double Sharing', icon: Users },
    { key: 'triple', label: 'Triple Sharing', icon: Users },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Basic Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by area, college, or landmark..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
          
          <button
            onClick={onSearch}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t pt-4 space-y-6">
          {/* Price Range & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range (Monthly)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min || ''}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    min: parseInt(e.target.value) || 0
                  })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max || ''}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    max: parseInt(e.target.value) || 50000
                  })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Gender Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender Preference
              </label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All</option>
                <option value="male">Boys Only</option>
                <option value="female">Girls Only</option>
                <option value="co-ed">Co-ed</option>
              </select>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furnishing
              </label>
              <select
                value={filters.furnishing}
                onChange={(e) => handleFilterChange('furnishing', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All</option>
                <option value="fully-furnished">Fully Furnished</option>
                <option value="semi-furnished">Semi Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Nearby Colleges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Near Colleges
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {colleges.map((college) => (
                <label key={college.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.nearbyColleges.includes(college.id)}
                    onChange={() => handleArrayFilterToggle('nearbyColleges', college.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700 truncate">{college.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Room Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {roomTypeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = filters.roomType.some(rt => rt.type === option.key);
                return (
                  <button
                    key={option.key}
                    onClick={() => {
                      const newRoomTypes = isSelected
                        ? filters.roomType.filter(rt => rt.type !== option.key)
                        : [...filters.roomType, { type: option.key } as any];
                      handleFilterChange('roomType', newRoomTypes);
                    }}
                    className={`p-3 rounded-lg border transition-colors flex flex-col items-center gap-2 ${
                      isSelected 
                        ? 'bg-primary-100 border-primary-500 text-primary-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenityOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = filters.amenities.includes(option.key);
                return (
                  <button
                    key={option.key}
                    onClick={() => handleArrayFilterToggle('amenities', option.key)}
                    className={`p-3 rounded-lg border transition-colors flex flex-col items-center gap-2 ${
                      isSelected 
                        ? 'bg-primary-100 border-primary-500 text-primary-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Minimum Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange('rating', rating)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    filters.rating >= rating
                      ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {rating}⭐
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSearch();
                  setShowFilters(false);
                }}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchFilters;
