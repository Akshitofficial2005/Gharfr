// Utility functions to safely render location data
export const formatLocationString = (location: any): string => {
  if (!location) return '';
  
  // Handle different location formats
  if (typeof location === 'string') {
    return location;
  }
  
  if (typeof location === 'object') {
    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.pincode) parts.push(location.pincode);
    
    return parts.join(', ');
  }
  
  return '';
};

export const formatShortLocation = (location: any): string => {
  if (!location) return '';
  
  if (typeof location === 'string') {
    return location;
  }
  
  if (typeof location === 'object') {
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    
    return parts.join(', ');
  }
  
  return '';
};

export const safeRenderLocation = (location: any): string => {
  try {
    return formatLocationString(location);
  } catch (error) {
    console.error('Error rendering location:', error);
    return 'Location unavailable';
  }
};