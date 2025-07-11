import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Clock, Navigation } from 'lucide-react';
import { LocationService, LocationSuggestion } from '../services/locationService';
import { AnalyticsService } from '../services/analyticsService';

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (location: LocationSuggestion) => void;
  placeholder?: string;
  className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Enter area, locality or landmark...",
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentLocationSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (value.length >= 2) {
        setIsLoading(true);
        try {
          const results = await LocationService.searchLocations(value);
          setSuggestions(results);
        } catch (error) {
          console.error('Error searching locations:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const formattedName = suggestion.name;
    onChange(formattedName);
    setIsOpen(false);
    onSelect?.(suggestion);
    
    // Add to recent searches
    addToRecentSearches(formattedName);
    
    // Track location selection
    AnalyticsService.getInstance().track('location_suggestion_selected', {
      selectedLocation: formattedName,
      locationType: suggestion.type,
      suggestionRank: suggestions.indexOf(suggestion) + 1
    });
  };

  const handleRecentSearchClick = (search: string) => {
    onChange(search);
    setIsOpen(false);
    
    // Track recent search usage
    AnalyticsService.getInstance().track('recent_location_selected', {
      selectedLocation: search
    });
  };

  const addToRecentSearches = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentLocationSearches', JSON.stringify(updated));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = suggestions.length + (recentSearches.length > 0 ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : -1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : totalItems - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else {
            const recentIndex = selectedIndex - suggestions.length;
            handleRecentSearchClick(recentSearches[recentIndex]);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Delay closing to allow clicking on suggestions
    setTimeout(() => setIsOpen(false), 150);
  };

  const getCurrentLocation = async () => {
    try {
      const coords = await LocationService.getCurrentLocation();
      const nearbyLocations = await LocationService.getNearbyLocations(coords);
      if (nearbyLocations.length > 0) {
        handleSuggestionClick(nearbyLocations[0]);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
          title="Use current location"
        >
          <Navigation className="h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="p-3 text-center text-gray-500">
              <Search className="h-5 w-5 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          )}

          {!isLoading && suggestions.length === 0 && value.length >= 2 && (
            <div className="p-3 text-center text-gray-500">
              No locations found for "{value}"
            </div>
          )}

          {!isLoading && suggestions.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b">
                Locations
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  ref={el => { suggestionRefs.current[index] = el; }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-3 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex items-center space-x-3 ${
                    selectedIndex === index ? 'bg-primary-50 text-primary-700' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    {suggestion.type === 'area' && <MapPin className="h-4 w-4 text-primary-500" />}
                    {suggestion.type === 'landmark' && <span className="text-lg">🏛️</span>}
                    {suggestion.type === 'metro_station' && <span className="text-lg">🚇</span>}
                    {suggestion.type === 'university' && <span className="text-lg">🎓</span>}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{suggestion.name}</div>
                    <div className="text-sm text-gray-500">
                      {suggestion.city}, {suggestion.state}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && value.length < 2 && recentSearches.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b">
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={search}
                  ref={el => { suggestionRefs.current[suggestions.length + index] = el; }}
                  onClick={() => handleRecentSearchClick(search)}
                  className={`px-3 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex items-center space-x-3 ${
                    selectedIndex === suggestions.length + index ? 'bg-primary-50 text-primary-700' : ''
                  }`}
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{search}</span>
                </div>
              ))}
            </div>
          )}

          {!isLoading && value.length < 2 && recentSearches.length === 0 && (
            <div className="p-3 text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Start typing to search for locations</p>
              <p className="text-xs text-gray-400 mt-1">Try "Koramangala", "Whitefield", or "HSR Layout"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
