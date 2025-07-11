// Enhanced search service with comprehensive filtering and location-based features

import { EnhancedFilterOptions, EnhancedPG, College } from '../types/enhanced';

export interface SearchLocation {
  name: string;
  type: 'area' | 'college' | 'landmark';
  coordinates?: { lat: number; lng: number };
  colleges?: College[];
}

export class EnhancedSearchService {
  private static colleges: College[] = [
    { id: '1', name: 'SGSITS (SATI)', distance: 0, type: 'engineering' },
    { id: '2', name: 'IIT Indore', distance: 0, type: 'engineering' },
    { id: '3', name: 'IIPS Indore', distance: 0, type: 'medical' },
    { id: '4', name: 'DAVV University', distance: 0, type: 'commerce' },
    { id: '5', name: 'Medicaps University', distance: 0, type: 'engineering' },
    { id: '6', name: 'Acropolis Institute', distance: 0, type: 'engineering' },
    { id: '7', name: 'Prestige Institute', distance: 0, type: 'commerce' },
    { id: '8', name: 'IIM Indore', distance: 0, type: 'commerce' },
  ];

  private static popularAreas: SearchLocation[] = [
    {
      name: 'Vijay Nagar',
      type: 'area',
      coordinates: { lat: 22.7532, lng: 75.8937 },
      colleges: [
        { id: '1', name: 'SGSITS (SATI)', distance: 2.5, type: 'engineering' },
        { id: '5', name: 'Medicaps University', distance: 1.8, type: 'engineering' },
      ]
    },
    {
      name: 'Geeta Bhawan Square',
      type: 'area',
      coordinates: { lat: 22.7251, lng: 75.8735 },
      colleges: [
        { id: '4', name: 'DAVV University', distance: 3.2, type: 'commerce' },
        { id: '7', name: 'Prestige Institute', distance: 2.1, type: 'commerce' },
      ]
    },
    {
      name: 'Rau',
      type: 'area',
      coordinates: { lat: 22.6726, lng: 75.8449 },
      colleges: [
        { id: '2', name: 'IIT Indore', distance: 1.5, type: 'engineering' },
        { id: '8', name: 'IIM Indore', distance: 2.0, type: 'commerce' },
      ]
    },
    {
      name: 'Bhanwarkuan',
      type: 'area',
      coordinates: { lat: 22.6969, lng: 75.8669 },
      colleges: [
        { id: '3', name: 'IIPS Indore', distance: 1.2, type: 'medical' },
        { id: '6', name: 'Acropolis Institute', distance: 3.5, type: 'engineering' },
      ]
    },
    {
      name: 'Palasia Square',
      type: 'landmark',
      coordinates: { lat: 22.7196, lng: 75.8577 },
    },
    {
      name: 'Rajwada',
      type: 'landmark',
      coordinates: { lat: 22.7196, lng: 75.8577 },
    }
  ];

  // Get location suggestions based on search query
  static getLocationSuggestions(query: string): SearchLocation[] {
    if (!query.trim()) {
      return this.popularAreas.slice(0, 5);
    }

    const suggestions: SearchLocation[] = [];
    
    // Add area suggestions
    const areaMatches = this.popularAreas.filter(area => 
      area.name.toLowerCase().includes(query.toLowerCase())
    );
    suggestions.push(...areaMatches);

    // Add college suggestions
    const collegeMatches = this.colleges
      .filter(college => college.name.toLowerCase().includes(query.toLowerCase()))
      .map(college => ({
        name: `Near ${college.name}`,
        type: 'college' as const,
        colleges: [college]
      }));
    suggestions.push(...collegeMatches);

    return suggestions.slice(0, 8);
  }

  // Get colleges for location-based filtering
  static getColleges(): College[] {
    return this.colleges;
  }

  // Get popular search areas
  static getPopularAreas(): SearchLocation[] {
    return this.popularAreas;
  }

  // Calculate distance between two coordinates (Haversine formula)
  static calculateDistance(
    lat1: number, lng1: number, 
    lat2: number, lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Filter PGs based on enhanced criteria
  static filterPGs(pgs: EnhancedPG[], filters: EnhancedFilterOptions): EnhancedPG[] {
    return pgs.filter(pg => {
      // Location filter
      if (filters.location) {
        const locationMatch = pg.location.address.toLowerCase().includes(filters.location.toLowerCase()) ||
                             pg.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
                             pg.location.landmarks.some(landmark => 
                               landmark.toLowerCase().includes(filters.location.toLowerCase())
                             );
        if (!locationMatch) return false;
      }

      // College proximity filter
      if (filters.nearbyColleges.length > 0) {
        const hasNearbyCollege = pg.location.nearbyColleges.some(college =>
          filters.nearbyColleges.includes(college.id)
        );
        if (!hasNearbyCollege) return false;
      }

      // Price range filter
      const minPrice = Math.min(...pg.roomTypes.map(room => room.baseRent));
      if (minPrice < filters.priceRange.min || minPrice > filters.priceRange.max) {
        return false;
      }

      // Gender filter
      if (filters.gender && pg.gender !== filters.gender) {
        return false;
      }

      // Room type filter
      if (filters.roomType.length > 0) {
        const hasMatchingRoomType = pg.roomTypes.some(room => 
          filters.roomType.some(filterRoom => filterRoom.type === room.type)
        );
        if (!hasMatchingRoomType) return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          pg.amenities[amenity as keyof typeof pg.amenities]
        );
        if (!hasAllAmenities) return false;
      }

      // Furnishing filter
      if (filters.furnishing) {
        const hasFurnishingType = pg.roomTypes.some(room => 
          room.furnishing === filters.furnishing
        );
        if (!hasFurnishingType) return false;
      }

      // Rating filter
      if (filters.rating > 0 && pg.rating < filters.rating) {
        return false;
      }

      return true;
    });
  }

  // Sort PGs based on criteria
  static sortPGs(pgs: EnhancedPG[], sortBy: string, userLocation?: { lat: number; lng: number }): EnhancedPG[] {
    return [...pgs].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const aMinPrice = Math.min(...a.roomTypes.map(room => room.baseRent));
          const bMinPrice = Math.min(...b.roomTypes.map(room => room.baseRent));
          return aMinPrice - bMinPrice;
        
        case 'rating':
          return b.rating - a.rating;
        
        case 'distance':
          if (!userLocation) return 0;
          const aDistance = this.calculateDistance(
            userLocation.lat, userLocation.lng,
            a.location.coordinates.lat, a.location.coordinates.lng
          );
          const bDistance = this.calculateDistance(
            userLocation.lat, userLocation.lng,
            b.location.coordinates.lat, b.location.coordinates.lng
          );
          return aDistance - bDistance;
        
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        
        default:
          return 0;
      }
    });
  }

  // Get recommended PGs based on student preferences
  static getRecommendedPGs(
    pgs: EnhancedPG[], 
    studentPreferences: any,
    userLocation?: { lat: number; lng: number }
  ): EnhancedPG[] {
    const filters: EnhancedFilterOptions = {
      location: '',
      nearbyColleges: [],
      priceRange: { min: 0, max: studentPreferences.maxBudget || 50000 },
      gender: studentPreferences.preferredGender || '',
      roomType: [], // Will filter by room type in the filtering logic
      amenities: studentPreferences.preferredAmenities || [],
      furnishing: '',
      rating: 3.5, // Minimum rating for recommendations
      distance: studentPreferences.maxDistance || 10,
      sortBy: 'rating'
    };

    let filtered = this.filterPGs(pgs, filters);
    
    // Additional filtering by room type if specified
    if (studentPreferences.preferredRoomType) {
      filtered = filtered.filter(pg => 
        pg.roomTypes.some(room => room.type === studentPreferences.preferredRoomType)
      );
    }
    
    // If user location is available, filter by distance
    if (userLocation && studentPreferences.maxDistance) {
      filtered = filtered.filter(pg => {
        const distance = this.calculateDistance(
          userLocation.lat, userLocation.lng,
          pg.location.coordinates.lat, pg.location.coordinates.lng
        );
        return distance <= studentPreferences.maxDistance;
      });
    }

    return this.sortPGs(filtered, 'rating', userLocation).slice(0, 10);
  }
}
