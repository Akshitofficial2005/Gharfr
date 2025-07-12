// COMPREHENSIVE FIX - Run this in browser console
console.log('🔧 COMPREHENSIVE FIX - Running both authentication and PG visibility fixes...');

// Part 1: Authentication Fix
console.log('🔐 Part 1: Authentication Fix...');

// Clear corrupted tokens
localStorage.removeItem('token');
localStorage.removeItem('user');
sessionStorage.clear();
console.log('✅ Cleared all auth data');

// Test server status
fetch('https://ghar-02ex.onrender.com/api/emergency-test')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Server status:', data);
    
    if (data.environment.jwtSecretExists) {
      console.log('✅ JWT Secret is configured');
      
      // Part 2: PG Visibility Test
      console.log('🏠 Part 2: Testing PG visibility...');
      
      // Check if approved PGs are now visible on homepage
      fetch('https://ghar-02ex.onrender.com/api/pgs')
        .then(response => response.json())
        .then(pgData => {
          console.log('📋 Homepage PGs:', pgData.pgs ? pgData.pgs.length : 0, 'found');
          console.log('PG data sample:', pgData.pgs ? pgData.pgs.slice(0, 2) : 'No PGs');
          
          if (pgData.pgs && pgData.pgs.length > 0) {
            console.log('✅ Approved PGs are now visible on homepage!');
          } else {
            console.log('ℹ️ No approved PGs visible yet. They may need re-approval.');
          }
        })
        .catch(error => {
          console.error('❌ Error checking PGs:', error);
        });
      
      // Prompt for fresh login
      const doLogin = confirm('🔄 Auth data cleared. Click OK to be redirected to login page for fresh authentication.');
      if (doLogin) {
        window.location.href = '/login';
      }
    } else {
      console.error('❌ Server configuration issue - JWT Secret missing');
      alert('❌ Server configuration issue detected. Contact admin.');
    }
  })
  .catch(error => {
    console.error('❌ Server not responding:', error);
    alert('❌ Server not responding. Please try again in a few minutes.');
  });

console.log('🔧 Comprehensive fix initiated. Check results above.');
