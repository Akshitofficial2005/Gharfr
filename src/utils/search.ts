// Fuzzy search implementation
export const fuzzySearch = (query: string, text: string): number => {
  if (!query || !text) return 0;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match
  if (textLower.includes(queryLower)) {
    return 1;
  }
  
  // Fuzzy matching using Levenshtein distance
  const distance = levenshteinDistance(queryLower, textLower);
  const maxLength = Math.max(queryLower.length, textLower.length);
  
  return 1 - (distance / maxLength);
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Search suggestions
export const getSearchSuggestions = (query: string, data: any[]): string[] => {
  if (!query || query.length < 2) return [];
  
  const suggestions = new Set<string>();
  
  data.forEach(item => {
    // Add city suggestions
    if (item.location?.city && fuzzySearch(query, item.location.city) > 0.6) {
      suggestions.add(item.location.city);
    }
    
    // Add name suggestions
    if (item.name && fuzzySearch(query, item.name) > 0.6) {
      suggestions.add(item.name);
    }
    
    // Add area suggestions
    if (item.location?.address && fuzzySearch(query, item.location.address) > 0.6) {
      const area = item.location.address.split(',')[0];
      suggestions.add(area);
    }
  });
  
  return Array.from(suggestions).slice(0, 5);
};

// Search analytics
export const trackSearch = (query: string, results: number) => {
  const searchData = {
    query,
    results,
    timestamp: new Date().toISOString(),
    userId: localStorage.getItem('userId') || 'anonymous'
  };
  
  // Store in localStorage for now (should be sent to analytics service)
  const searches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  searches.push(searchData);
  
  // Keep only last 100 searches
  if (searches.length > 100) {
    searches.splice(0, searches.length - 100);
  }
  
  localStorage.setItem('searchHistory', JSON.stringify(searches));
};

// Get popular searches
export const getPopularSearches = (): string[] => {
  const searches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  const queryCount: { [key: string]: number } = {};
  
  searches.forEach((search: any) => {
    queryCount[search.query] = (queryCount[search.query] || 0) + 1;
  });
  
  return Object.entries(queryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([query]) => query);
};