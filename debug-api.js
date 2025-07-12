// Simple test to check what API URL the frontend is actually using
console.log('=== API Configuration Test ===');
console.log('REACT_APP_API_URL from env:', process.env.REACT_APP_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All env vars starting with REACT_APP_:', 
  Object.keys(process.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .reduce((obj, key) => ({ ...obj, [key]: process.env[key] }), {})
);

// Test fetch to see what URL is actually being used
const testAPI = async () => {
  try {
    const response = await fetch('/api/health');
    console.log('Relative API call result:', response.url);
  } catch (error) {
    console.log('Relative API call failed:', error.message);
  }
  
  try {
    const response = await fetch('https://ghar-02ex.onrender.com/api/health');
    console.log('Direct API call result:', await response.json());
  } catch (error) {
    console.log('Direct API call failed:', error.message);
  }
};

// Add this to the frontend temporarily for debugging
if (typeof window !== 'undefined') {
  window.testAPI = testAPI;
  window.envTest = () => {
    console.log('Current API Base URL:', process.env.REACT_APP_API_URL);
  };
}
