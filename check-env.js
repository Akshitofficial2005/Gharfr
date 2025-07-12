// Check frontend environment variables
console.log('=== VERCEL ENVIRONMENT CHECK ===');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('REACT_APP_GOOGLE_CLIENT_ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check if variables are properly set
if (process.env.REACT_APP_GOOGLE_CLIENT_ID === 'YOUR_PRODUCTION_GOOGLE_CLIENT_ID') {
  console.log('❌ Google Client ID not set properly!');
} else {
  console.log('✅ Google Client ID is set');
}