import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PreferencesService, SavedSearch, UserPreferences } from '../services/preferencesService';
import { AnalyticsService } from '../services/analyticsService';
import { useNotificationHelpers } from '../contexts/NotificationContext';
import { 
  Settings as SettingsIcon, 
  Heart, 
  Search, 
  Bell, 
  Trash2, 
  Edit, 
  Star,
  MapPin,
  IndianRupee
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotificationHelpers();
  
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'preferences' | 'searches' | 'favorites'>('preferences');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load user data
    loadUserData();
    
    // Track page view
    AnalyticsService.getInstance().trackPageView('/settings');
  }, [user, navigate]);

  const loadUserData = () => {
    const prefs = PreferencesService.getPreferences();
    setPreferences(prefs);
    setSavedSearches(prefs.savedSearches);
    setFavorites(prefs.favoriteProperties);
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    if (!preferences) return;

    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    PreferencesService.savePreferences(updatedPreferences);
    
    AnalyticsService.getInstance().track('preference_changed', {
      preference: key,
      value: value
    });
    
    showSuccess('Preferences updated', 'Your settings have been saved');
  };

  const handleDeleteSearch = (searchId: string) => {
    PreferencesService.deleteSavedSearch(searchId);
    loadUserData(); // Reload data
    
    AnalyticsService.getInstance().track('saved_search_deleted', { searchId });
    showSuccess('Search deleted', 'Saved search has been removed');
  };

  const handleSearchClick = (search: SavedSearch) => {
    const searchParams = new URLSearchParams({
      location: search.location || '',
      minPrice: search.priceRange?.min?.toString() || '0',
      maxPrice: search.priceRange?.max?.toString() || '50000',
    });

    AnalyticsService.getInstance().track('saved_search_used', {
      searchId: search.id,
      searchName: search.name
    });

    navigate(`/search?${searchParams.toString()}`);
  };

  const handleRemoveFavorite = (propertyId: string) => {
    PreferencesService.removeFromFavorites(propertyId);
    loadUserData(); // Reload data
    
    AnalyticsService.getInstance().trackPropertyFavorite(propertyId, 'remove');
    showSuccess('Removed from favorites', 'Property removed from your favorites');
  };

  if (!user) {
    return null;
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your preferences, saved searches, and favorites</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'preferences', name: 'Preferences', icon: SettingsIcon },
                { id: 'searches', name: 'Saved Searches', icon: Search },
                { id: 'favorites', name: 'Favorites', icon: Heart }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                  {tab.id === 'searches' && savedSearches.length > 0 && (
                    <span className="bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs">
                      {savedSearches.length}
                    </span>
                  )}
                  {tab.id === 'favorites' && favorites.length > 0 && (
                    <span className="bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                      {favorites.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                        <p className="text-sm text-gray-500">Receive updates about your bookings and new properties</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notifications.emailAlerts}
                        onChange={(e) => handlePreferenceChange('notifications', {
                          ...preferences.notifications,
                          emailAlerts: e.target.checked
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900">SMS Notifications</label>
                        <p className="text-sm text-gray-500">Receive SMS updates for booking confirmations</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notifications.smsAlerts}
                        onChange={(e) => handlePreferenceChange('notifications', {
                          ...preferences.notifications,
                          smsAlerts: e.target.checked
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900">Marketing Communications</label>
                        <p className="text-sm text-gray-500">Receive promotions and special offers</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notifications.promotions}
                        onChange={(e) => handlePreferenceChange('notifications', {
                          ...preferences.notifications,
                          promotions: e.target.checked
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900">New Listings</label>
                        <p className="text-sm text-gray-500">Get notified when new properties matching your preferences are listed</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notifications.newListings}
                        onChange={(e) => handlePreferenceChange('notifications', {
                          ...preferences.notifications,
                          newListings: e.target.checked
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900">Price Drops</label>
                        <p className="text-sm text-gray-500">Get alerted when properties you're interested in drop their prices</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notifications.priceDrops}
                        onChange={(e) => handlePreferenceChange('notifications', {
                          ...preferences.notifications,
                          priceDrops: e.target.checked
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Search Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Price Range
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="number"
                            placeholder="Min"
                            value={preferences.priceRange.min}
                            onChange={(e) => handlePreferenceChange('priceRange', {
                              ...preferences.priceRange,
                              min: parseInt(e.target.value) || 0
                            })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Max"
                            value={preferences.priceRange.max}
                            onChange={(e) => handlePreferenceChange('priceRange', {
                              ...preferences.priceRange,
                              max: parseInt(e.target.value) || 50000
                            })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Gender
                      </label>
                      <select
                        value={preferences.preferredGender || ''}
                        onChange={(e) => handlePreferenceChange('preferredGender', e.target.value || undefined)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">No preference</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Searches Tab */}
            {activeTab === 'searches' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Your Saved Searches</h3>
                  <p className="text-sm text-gray-500">{savedSearches.length} saved searches</p>
                </div>
                
                {savedSearches.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved searches</h3>
                    <p className="text-gray-500 mb-6">Save your searches to quickly find PGs that match your preferences</p>
                    <button
                      onClick={() => navigate('/search')}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Start Searching
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedSearches.map((search) => (
                      <div key={search.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{search.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {search.location && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {search.location}
                                </div>
                              )}
                              {search.priceRange && (
                                <div className="flex items-center">
                                  <IndianRupee className="h-4 w-4 mr-1" />
                                  ₹{search.priceRange.min?.toLocaleString()} - ₹{search.priceRange.max?.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleSearchClick(search)}
                              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                            >
                              Search
                            </button>
                            <button
                              onClick={() => handleDeleteSearch(search.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete search"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Your Favorite Properties</h3>
                  <p className="text-sm text-gray-500">{favorites.length} favorites</p>
                </div>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-500 mb-6">Start browsing and add properties to your favorites for quick access</p>
                    <button
                      onClick={() => navigate('/search')}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Browse Properties
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favorites.map((propertyId) => (
                      <div key={propertyId} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Property #{propertyId}</h4>
                            <p className="text-sm text-gray-500">View property details and check availability</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/pg/${propertyId}`)}
                              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleRemoveFavorite(propertyId)}
                              className="text-red-600 hover:text-red-700"
                              title="Remove from favorites"
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
