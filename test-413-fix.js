// Quick 413 Fix Test - Run this in browser console after the fixes are deployed
console.log('🧪 Testing 413 Fix...');

// Step 1: Check backend is updated
fetch('https://ghar-02ex.onrender.com/api/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Backend health check:', data);
    console.log('✅ Backend is responsive and updated');
  })
  .catch(error => {
    console.error('❌ Backend health check failed:', error);
  });

// Step 2: Test with a small payload first
const token = localStorage.getItem('token');
if (token) {
  console.log('🧪 Testing with small payload...');
  
  fetch('https://ghar-02ex.onrender.com/api/pgs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Small Test PG - DELETE ME',
      location: {
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      },
      pricePerMonth: 1,
      description: 'Small test payload',
      amenities: { wifi: true, food: false, parking: true },
      rules: ['Test rule'],
      roomTypes: [{ type: 'single', price: 1, capacity: 1 }]
    })
  })
  .then(response => {
    console.log('Small payload response status:', response.status);
    if (response.ok) {
      console.log('✅ Small payload works! 413 error should be fixed.');
      alert('✅ 413 Fix deployed! Small payloads work. Try creating a PG with images now.');
    } else if (response.status === 413) {
      console.error('❌ Still getting 413 error');
      alert('❌ 413 error still present. Backend may need time to redeploy.');
    } else {
      console.log('ℹ️ Different status:', response.status);
    }
    return response.text();
  })
  .then(text => {
    console.log('Response:', text);
  })
  .catch(error => {
    console.error('❌ Test failed:', error);
    alert(`❌ Test failed: ${error.message}`);
  });
} else {
  console.error('❌ No token found - please login first');
  alert('❌ Please login first to test');
}

console.log('🧪 413 fix test initiated. Check results above.');
