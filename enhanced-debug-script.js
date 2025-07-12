// Enhanced 401 Debug Script - Run this in browser console
console.log('🔍 Enhanced 401 Debug Script Starting...');

// Step 1: Check current localStorage
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

console.log('📋 Current localStorage state:');
console.log('Token exists:', !!token);
console.log('User data exists:', !!userStr);

if (userStr) {
    try {
        const user = JSON.parse(userStr);
        console.log('Current user role:', user.role);
        console.log('User email:', user.email);
        console.log('User ID:', user._id || user.id);
    } catch (e) {
        console.error('Error parsing user data:', e);
    }
}

// Step 2: Test authentication with backend
if (token) {
    console.log('🧪 Testing authentication with backend...');
    
    fetch('https://ghar-02ex.onrender.com/api/auth/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Profile response status:', response.status);
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Profile fetch failed: ${response.status}`);
        }
    })
    .then(data => {
        console.log('✅ Backend user data:', data);
        
        // Update localStorage with fresh backend data
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('✅ Updated localStorage with fresh user data');
        }
        
        // Step 3: Test PG creation with current token
        console.log('🧪 Testing PG creation...');
        return fetch('https://ghar-02ex.onrender.com/api/pgs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Debug Test PG - DELETE ME',
                location: {
                    address: 'Test Address',
                    city: 'Test City',
                    state: 'Test State',
                    pincode: '123456'
                },
                pricePerMonth: 1,
                description: 'Debug test PG - please delete'
            })
        });
    })
    .then(response => {
        console.log('PG creation response status:', response.status);
        if (response.ok) {
            console.log('🎉 SUCCESS! PG creation works!');
            alert('🎉 SUCCESS! PG creation works now!');
            return response.json();
        } else {
            console.error('❌ PG creation failed with status:', response.status);
            return response.text().then(text => {
                console.error('Error response:', text);
                throw new Error(`PG creation failed: ${response.status} - ${text}`);
            });
        }
    })
    .then(data => {
        console.log('PG creation response:', data);
    })
    .catch(error => {
        console.error('❌ Error in process:', error);
        
        // If auth failed, try to refresh the role
        if (error.message.includes('401') || error.message.includes('403')) {
            console.log('🔄 Auth failed, attempting role refresh...');
            
            fetch('https://ghar-02ex.onrender.com/api/auth/update-role', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: 'owner' })
            })
            .then(response => response.json())
            .then(data => {
                console.log('✅ Role update response:', data);
                
                // Update localStorage
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                currentUser.role = 'owner';
                localStorage.setItem('user', JSON.stringify(currentUser));
                
                alert('✅ Role refreshed! Please try creating PG again.');
            })
            .catch(roleError => {
                console.error('❌ Role update failed:', roleError);
                alert('❌ Please logout and login again to refresh your session.');
            });
        } else {
            alert(`❌ Error: ${error.message}`);
        }
    });
} else {
    console.error('❌ No token found - please login first');
    alert('❌ Please login first');
}

console.log('🔍 Debug script completed. Check results above.');
