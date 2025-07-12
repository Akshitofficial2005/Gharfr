// EMERGENCY DIAGNOSIS & FIX - Run this in browser console
console.log('🚨 EMERGENCY DIAGNOSIS STARTING...');

// Test 1: Check if backend is responding at all
console.log('🧪 Test 1: Backend health check...');
fetch('https://ghar-02ex.onrender.com/api/emergency-test')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Backend is responding:', data);
    console.log('Environment check:', data.environment);
    
    if (!data.environment.jwtSecretExists) {
      console.error('❌ JWT_SECRET missing from environment!');
      alert('❌ Server configuration issue detected. The JWT secret is missing.');
      return;
    }
    
    // Test 2: Try emergency login
    console.log('🧪 Test 2: Testing emergency login...');
    
    const email = prompt('Enter your email for emergency login test:');
    const password = prompt('Enter your password:');
    
    if (email && password) {
      fetch('https://ghar-02ex.onrender.com/api/auth/emergency-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(response => {
        console.log('Emergency login response status:', response.status);
        return response.json();
      })
      .then(loginData => {
        console.log('Emergency login result:', loginData);
        
        if (loginData.token) {
          console.log('✅ Emergency login successful!');
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('user', JSON.stringify(loginData.user));
          alert('✅ Emergency login successful! Try creating PG now.');
        } else {
          console.error('❌ Emergency login failed');
          alert('❌ Emergency login failed. Check credentials.');
        }
      })
      .catch(error => {
        console.error('❌ Emergency login error:', error);
        alert('❌ Emergency login failed: ' + error.message);
      });
    }
  })
  .catch(error => {
    console.error('❌ Backend not responding:', error);
    alert('❌ Backend server is not responding. Check server status.');
  });

console.log('🚨 Emergency diagnosis initiated...');
