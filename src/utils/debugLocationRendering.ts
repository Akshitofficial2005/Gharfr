// Debug utility to test location rendering and prevent React error #31

import { safeRenderLocation } from './locationUtils';

// Test different location formats
export const testLocationRendering = () => {
  console.log('Testing location rendering...');
  
  // Test cases that might cause React error #31
  const testCases = [
    // Object with all properties
    {
      address: '123 MG Road',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452001',
      coordinates: { lat: 22.7196, lng: 75.8577 }
    },
    // Object with missing properties
    {
      city: 'Indore',
      state: 'Madhya Pradesh'
    },
    // String location
    'Koramangala, Bangalore',
    // Null/undefined
    null,
    undefined,
    // Empty object
    {},
    // Array (should not happen but test anyway)
    ['Indore', 'MP']
  ];
  
  testCases.forEach((testCase, index) => {
    try {
      const result = safeRenderLocation(testCase);
      console.log(`Test ${index + 1}:`, testCase, '→', result);
    } catch (error) {
      console.error(`Test ${index + 1} failed:`, testCase, error);
    }
  });
  
  console.log('Location rendering tests completed');
};

// Function to scan for potential location rendering issues
export const scanForLocationRenderingIssues = () => {
  console.log('Scanning for potential location rendering issues...');
  
  // Check if there are any direct object references in JSX
  const potentialIssues = [];
  
  // This would be used during development to identify issues
  if (process.env.NODE_ENV === 'development') {
    console.warn('Location rendering debug mode active');
    
    // Override console.error to catch React error #31
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('Minified React error #31')) {
        console.error('🚨 REACT ERROR #31 DETECTED - Object being rendered in JSX');
        console.error('This is likely caused by rendering a location object directly');
        console.error('Use safeRenderLocation() or extract specific properties');
      }
      originalError.apply(console, args);
    };
  }
};

// Initialize debug utilities
if (process.env.NODE_ENV === 'development') {
  // Make functions available globally for debugging
  (window as any).testLocationRendering = testLocationRendering;
  (window as any).scanForLocationRenderingIssues = scanForLocationRenderingIssues;
  
  // Auto-scan on load
  scanForLocationRenderingIssues();
}