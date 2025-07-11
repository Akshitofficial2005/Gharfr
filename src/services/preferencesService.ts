// User preferences and settings service

export interface UserPreferences {
  preferredGender?: 'male' | 'female';
  preferredLocations: string[];
  priceRange: {
    min: number;
    max: number;
  };
  preferredAmenities: string[];
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    newListings: boolean;
    priceDrops: boolean;
    promotions: boolean;
  };
  savedSearches: SavedSearch[];
  favoriteProperties: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  location: string;
  gender?: 'male' | 'female';
  priceRange: { min: number; max: number };
  amenities: string[];
  createdAt: Date;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredLocations: [],
  priceRange: { min: 5000, max: 25000 },
  preferredAmenities: ['wifi', 'food'],
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    newListings: true,
    priceDrops: true,
    promotions: false,
  },
  savedSearches: [],
  favoriteProperties: [],
};

export class PreferencesService {
  private static STORAGE_KEY = 'ghar_user_preferences';

  // Get user preferences
  static getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
    return DEFAULT_PREFERENCES;
  }

  // Save user preferences
  static savePreferences(preferences: Partial<UserPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  // Update specific preference
  static updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): void {
    const preferences = this.getPreferences();
    preferences[key] = value;
    this.savePreferences(preferences);
  }

  // Save a search
  static saveSearch(search: Omit<SavedSearch, 'id' | 'createdAt'>): SavedSearch {
    const preferences = this.getPreferences();
    const newSearch: SavedSearch = {
      ...search,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    preferences.savedSearches = [newSearch, ...preferences.savedSearches.slice(0, 9)]; // Keep only 10 searches
    this.savePreferences(preferences);
    return newSearch;
  }

  // Delete a saved search
  static deleteSavedSearch(searchId: string): void {
    const preferences = this.getPreferences();
    preferences.savedSearches = preferences.savedSearches.filter(s => s.id !== searchId);
    this.savePreferences(preferences);
  }

  // Add to favorites
  static addToFavorites(propertyId: string): void {
    const preferences = this.getPreferences();
    if (!preferences.favoriteProperties.includes(propertyId)) {
      preferences.favoriteProperties = [propertyId, ...preferences.favoriteProperties];
      this.savePreferences(preferences);
    }
  }

  // Remove from favorites
  static removeFromFavorites(propertyId: string): void {
    const preferences = this.getPreferences();
    preferences.favoriteProperties = preferences.favoriteProperties.filter(id => id !== propertyId);
    this.savePreferences(preferences);
  }

  // Check if property is favorited
  static isFavorite(propertyId: string): boolean {
    const preferences = this.getPreferences();
    return preferences.favoriteProperties.includes(propertyId);
  }

  // Add to preferred locations
  static addPreferredLocation(location: string): void {
    const preferences = this.getPreferences();
    if (!preferences.preferredLocations.includes(location)) {
      preferences.preferredLocations = [location, ...preferences.preferredLocations.slice(0, 9)]; // Keep only 10
      this.savePreferences(preferences);
    }
  }

  // Get search suggestions based on preferences
  static getSearchSuggestions(): string[] {
    const preferences = this.getPreferences();
    return preferences.preferredLocations.slice(0, 5);
  }

  // Export preferences (for backup)
  static exportPreferences(): string {
    return JSON.stringify(this.getPreferences(), null, 2);
  }

  // Import preferences (from backup)
  static importPreferences(data: string): boolean {
    try {
      const preferences = JSON.parse(data);
      this.savePreferences(preferences);
      return true;
    } catch (error) {
      console.error('Error importing preferences:', error);
      return false;
    }
  }

  // Clear all preferences
  static clearPreferences(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
