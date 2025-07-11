// Location service for providing search suggestions and location-based features

export interface LocationSuggestion {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'area' | 'landmark' | 'metro_station' | 'university';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Mock location data for Bangalore
const mockLocations: LocationSuggestion[] = [
  // Popular Areas
  { id: '1', name: 'Koramangala', city: 'Bangalore', state: 'Karnataka', type: 'area', coordinates: { lat: 12.9279, lng: 77.6271 } },
  { id: '2', name: 'Whitefield', city: 'Bangalore', state: 'Karnataka', type: 'area', coordinates: { lat: 12.9698, lng: 77.7500 } },
  { id: '3', name: 'Electronic City', city: 'Bangalore', state: 'Karnataka', type: 'area', coordinates: { lat: 12.8451, lng: 77.6677 } },
  { id: '4', name: 'HSR Layout', city: 'Bangalore', state: 'Karnataka', type: 'area', coordinates: { lat: 12.9116, lng: 77.6364 } },
  { id: '5', name: 'Marathahalli', city: 'Bangalore', state: 'Karnataka', type: 'area', coordinates: { lat: 12.9591, lng: 77.6974 } },
  { id: '6', name: 'BTM Layout', city: 'Bangalore', state: 'Karnataka', type: 'area', coordinates: { lat: 12.9165, lng: 77.6101 } },
  { id: '7', name: 'Indiranagar', city: 'Bangalore', state: 'Karnataka', type: 'area', coordinates: { lat: 12.9716, lng: 77.6412 } },
  { id: '8', name: 'Jayanagar', city: 'Bangalore', state: 'Karnataka', type: 'area', coordinates: { lat: 12.9237, lng: 77.5838 } },
  { id: '9', name: 'Banashankari', city: 'Bangalore', state: 'Karnataka', type: 'area', coordinates: { lat: 12.9081, lng: 77.5739 } },
  { id: '10', name: 'Rajajinagar', city: 'Bangalore', state: 'Karnataka', type: 'area', coordinates: { lat: 12.9915, lng: 77.5520 } },
  
  // Landmarks
  { id: '11', name: 'Cubbon Park', city: 'Bangalore', state: 'Karnataka', type: 'landmark', coordinates: { lat: 12.9762, lng: 77.5993 } },
  { id: '12', name: 'Lalbagh Botanical Garden', city: 'Bangalore', state: 'Karnataka', type: 'landmark', coordinates: { lat: 12.9507, lng: 77.5848 } },
  { id: '13', name: 'UB City Mall', city: 'Bangalore', state: 'Karnataka', type: 'landmark', coordinates: { lat: 12.9716, lng: 77.6033 } },
  { id: '14', name: 'Forum Mall Koramangala', city: 'Bangalore', state: 'Karnataka', type: 'landmark', coordinates: { lat: 12.9279, lng: 77.6271 } },
  
  // Metro Stations
  { id: '15', name: 'MG Road Metro Station', city: 'Bangalore', state: 'Karnataka', type: 'metro_station', coordinates: { lat: 12.9759, lng: 77.6046 } },
  { id: '16', name: 'Indiranagar Metro Station', city: 'Bangalore', state: 'Karnataka', type: 'metro_station', coordinates: { lat: 12.9716, lng: 77.6412 } },
  { id: '17', name: 'Whitefield Metro Station', city: 'Bangalore', state: 'Karnataka', type: 'metro_station', coordinates: { lat: 12.9698, lng: 77.7500 } },
  
  // Universities/Colleges
  { id: '18', name: 'IISc Bangalore', city: 'Bangalore', state: 'Karnataka', type: 'university', coordinates: { lat: 13.0217, lng: 77.5645 } },
  { id: '19', name: 'Christ University', city: 'Bangalore', state: 'Karnataka', type: 'university', coordinates: { lat: 12.9342, lng: 77.6064 } },
  { id: '20', name: 'Bangalore University', city: 'Bangalore', state: 'Karnataka', type: 'university', coordinates: { lat: 13.0143, lng: 77.5673 } },
];

export class LocationService {
  // Search for locations based on query
  static searchLocations(query: string, limit: number = 10): Promise<LocationSuggestion[]> {
    return new Promise((resolve) => {
      if (!query || query.length < 2) {
        resolve([]);
        return;
      }

      const filteredLocations = mockLocations
        .filter(location => 
          location.name.toLowerCase().includes(query.toLowerCase()) ||
          location.city.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit);

      // Simulate API delay
      setTimeout(() => {
        resolve(filteredLocations);
      }, 300);
    });
  }

  // Get popular locations
  static getPopularLocations(): LocationSuggestion[] {
    return mockLocations.filter(location => location.type === 'area').slice(0, 8);
  }

  // Get nearby locations (mock implementation)
  static getNearbyLocations(coordinates: { lat: number; lng: number }, radius: number = 5): Promise<LocationSuggestion[]> {
    return new Promise((resolve) => {
      // Mock implementation - in real app, this would use geolocation APIs
      const nearbyLocations = mockLocations
        .filter(location => location.coordinates)
        .slice(0, 5);

      setTimeout(() => {
        resolve(nearbyLocations);
      }, 500);
    });
  }

  // Get current location (mock implementation)
  static getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            // Fallback to Bangalore coordinates
            resolve({ lat: 12.9716, lng: 77.5946 });
          }
        );
      } else {
        // Fallback to Bangalore coordinates
        resolve({ lat: 12.9716, lng: 77.5946 });
      }
    });
  }

  // Format location for display
  static formatLocation(location: LocationSuggestion): string {
    const typeEmoji = {
      area: '📍',
      landmark: '🏛️',
      metro_station: '🚇',
      university: '🎓'
    };

    return `${typeEmoji[location.type]} ${location.name}, ${location.city}`;
  }
}
