// Final 401 Fix Verification - Run this in browser console
console.log('🎯 Final 401 Fix Verification...');

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('Current auth state:');
console.log('- Token exists:', !!token);
console.log('- User exists:', !!user);

if (user) {
    try {
        const userData = JSON.parse(user);
        console.log('- User role:', userData.role);
        console.log('- User email:', userData.email);
    } catch (e) {
        console.error('User data corrupted');
    }
}

if (!token) {
    alert('❌ Please login first at https://gharfr.vercel.app/login');
} else {
    // Test with small payload first
    console.log('🧪 Testing PG creation...');
    
    fetch('https://ghar-02ex.onrender.com/api/pgs', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Final Test PG - DELETE ME',
            location: {
                address: 'Test Address',
                city: 'Test City', 
                state: 'Test State',
                pincode: '123456'
            },
            pricePerMonth: 1000,
            description: 'Final test to verify 401 fix',
            amenities: { wifi: true, food: false, parking: true },
            rules: ['Test rule'],
            roomTypes: [{ type: 'single', price: 1000, capacity: 1 }]
        })
    })
    .then(response => {
        console.log('🎯 Final test result:', response.status);
        
        if (response.status === 201) {
            console.log('🎉 SUCCESS! 401 error is completely fixed!');
            alert('🎉 PERFECT! 401 error fixed! You can now create PGs successfully!');
        } else if (response.status === 401) {
            console.log('❌ Still getting 401 - trying logout/login...');
            alert('🔄 Still getting 401. Please logout and login again for fresh token.');
        } else if (response.status === 413) {
            console.log('ℹ️ Getting 413 - payload size issue (images too large)');
            alert('ℹ️ 401 fixed! If you get 413 error, use smaller images.');
        } else {
            console.log(`ℹ️ Different status: ${response.status}`);
            alert(`ℹ️ 401 likely fixed! Status: ${response.status}`);
        }
        
        return response.text();
    })
    .then(text => {
        console.log('Response details:', text);
    })
    .catch(error => {
        console.error('❌ Network error:', error);
        alert(`❌ Network error: ${error.message}`);
    });
}

console.log('🎯 Verification test initiated. Results above.');
