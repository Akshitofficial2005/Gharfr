import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterOptions, PG } from '../types';
import { EnhancedFilterOptions, EnhancedPG } from '../types/enhanced';
import SearchFilters from '../components/SearchFilters';
import EnhancedSearchFilters from '../components/EnhancedSearchFilters';
import PGCard from '../components/PGCard';
import EnhancedPGCard from '../components/EnhancedPGCard';
import { PGCardSkeleton, SearchFiltersSkeleton } from '../components/Skeletons';
import { apiService } from '../utils/api';
import { Grid, List, SlidersHorizontal, MapPin } from 'lucide-react';
import { AnalyticsService } from '../services/analyticsService';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<EnhancedFilterOptions>({
    location: searchParams.get('location') || '',
    priceRange: { min: 0, max: 50000 },
    roomType: [],
    amenities: [],
    rating: 0,
    gender: (searchParams.get('gender') as 'male' | 'female' | 'co-ed') || '',
    nearbyColleges: [],
    furnishing: '',
    distance: 10,
    sortBy: 'rating',
  });
  const [filteredPGs, setFilteredPGs] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance' | 'newest'>('rating');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    filterPGs();
  }, [filters, sortBy]);

  // Track initial search from URL params
  useEffect(() => {
    const location = searchParams.get('location');
    if (location) {
      AnalyticsService.getInstance().trackSearch(location, location, filters);
    }
  }, [searchParams]);

  const filterPGs = async () => {
    setLoading(true);
    try {
      const params = {
        city: filters.location,
        minPrice: filters.priceRange.min,
        maxPrice: filters.priceRange.max,
        wifi: filters.amenities.includes('wifi'),
        food: filters.amenities.includes('food'),
        parking: filters.amenities.includes('parking')
      };
      const response = await apiService.getPGs(params);
      setFilteredPGs(response.pgs || []);
    } catch (error) {
      console.error('Failed to load PGs:', error);
      setFilteredPGs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: EnhancedFilterOptions) => {
    setFilters(newFilters);
    
    // Track filter usage
    AnalyticsService.getInstance().track('search_filter_change', {
      filters: newFilters,
      location: newFilters.location,
      priceRange: newFilters.priceRange,
      roomTypes: newFilters.roomType,
      amenities: newFilters.amenities,
      rating: newFilters.rating,
    });
  };

  const handleSearch = () => {
    filterPGs();
    
    // Track search execution
    if (filters.location) {
      AnalyticsService.getInstance().trackSearch(filters.location, filters.location, filters);
    }
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    AnalyticsService.getInstance().track('view_mode_change', { mode });
  };

  const handleSortChange = (sort: 'price' | 'rating' | 'distance' | 'newest') => {
    setSortBy(sort);
    setFilters(prev => ({ ...prev, sortBy: sort }));
    AnalyticsService.getInstance().track('sort_change', { sortBy: sort });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <EnhancedSearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
        />

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {filters.location ? `PGs in ${filters.location}` : 'All PGs'}
            </h1>
            <p className="text-gray-600">
              {loading ? 'Searching...' : `${filteredPGs.length} properties found`}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-5 w-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as 'price' | 'rating' | 'distance' | 'newest')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="rating">Highest Rated</option>
                <option value="price">Price: Low to High</option>
                <option value="distance">Nearest First</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          }`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PGCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPGs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <SlidersHorizontal className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No PGs found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search in a different location
            </p>
            <button
              onClick={() => setFilters({
                location: '',
                priceRange: { min: 0, max: 50000 },
                roomType: [],
                amenities: [],
                rating: 0,
                gender: '',
                nearbyColleges: [],
                furnishing: '',
                distance: 10,
                sortBy: 'rating',
              })}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredPGs.map(pg => (
              <EnhancedPGCard key={pg.id} pg={pg} />
            ))}
          </div>
        )}

        {/* Load More Button (for pagination in real app) */}
        {filteredPGs.length > 0 && filteredPGs.length >= 9 && (
          <div className="text-center mt-8">
            <button className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors">
              Load More PGs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;