// Ultimate 401 Debug & Fix Script - Run this in browser console
console.log('🔧 Ultimate 401 Debug & Fix Script Starting...');

// Step 1: Check current state
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

console.log('📋 Current Authentication State:');
console.log('Token exists:', !!token);
console.log('Token length:', token ? token.length : 0);
console.log('User data exists:', !!userStr);

if (userStr) {
    try {
        const user = JSON.parse(userStr);
        console.log('Current user:', user.email);
        console.log('Current role:', user.role);
        console.log('User ID:', user._id || user.id);
    } catch (e) {
        console.error('❌ Corrupted user data:', e);
        localStorage.removeItem('user');
        alert('❌ Corrupted user data removed. Please refresh and login again.');
        return;
    }
}

if (!token) {
    console.error('❌ No token found');
    alert('❌ No authentication token. Please login again.');
    return;
}

// Step 2: Test token validity
console.log('🧪 Testing token validity...');
fetch('https://ghar-02ex.onrender.com/api/auth/profile', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log('Profile endpoint response status:', response.status);
    
    if (response.status === 401) {
        console.error('❌ Token is invalid/expired');
        
        // Try to refresh by logging out and back in
        const confirmRefresh = confirm('🔄 Your session has expired. Would you like to logout and login again to refresh your session?');
        if (confirmRefresh) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return;
    }
    
    if (!response.ok) {
        throw new Error(`Profile fetch failed: ${response.status}`);
    }
    
    return response.json();
})
.then(data => {
    if (!data) return;
    
    console.log('✅ Token is valid. Fresh user data:', data);
    
    // Update localStorage with fresh data
    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ Updated localStorage with fresh user data');
        console.log('Fresh user role:', data.user.role);
    }
    
    // Step 3: Ensure user has correct role
    const currentUser = data.user;
    if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
        console.log('🔄 User needs role update. Current role:', currentUser.role);
        
        // Update role to owner
        return fetch('https://ghar-02ex.onrender.com/api/auth/update-role', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: 'owner' })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Role update failed: ${response.status}`);
        })
        .then(roleData => {
            console.log('✅ Role updated successfully:', roleData);
            
            // Update localStorage with new role
            currentUser.role = 'owner';
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            alert('✅ Your role has been updated to "owner". You can now create PGs!');
            return currentUser;
        });
    } else {
        console.log('✅ User already has correct role:', currentUser.role);
        return currentUser;
    }
})
.then(finalUser => {
    if (!finalUser) return;
    
    // Step 4: Test PG creation with fresh token and role
    console.log('🧪 Testing PG creation with fresh authentication...');
    
    return fetch('https://ghar-02ex.onrender.com/api/pgs', {
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
            pricePerMonth: 1,
            description: 'Final test after role refresh',
            amenities: { wifi: true, food: false, parking: true },
            rules: ['Test rule'],
            roomTypes: [{ type: 'single', price: 1, capacity: 1 }]
        })
    });
})
.then(response => {
    if (!response) return;
    
    console.log('Final PG creation test status:', response.status);
    
    if (response.status === 201) {
        console.log('🎉 SUCCESS! PG creation works perfectly!');
        alert('🎉 SUCCESS! The 401 error is completely fixed. You can now create PGs!');
    } else if (response.status === 401) {
        console.error('❌ Still getting 401 after all fixes');
        alert('❌ Still getting 401. Your session may be corrupted. Please logout and login again.');
    } else if (response.status === 413) {
        console.error('❌ Getting 413 - payload too large');
        alert('❌ Getting 413 error - try with smaller images or wait for deployment.');
    } else {
        console.error(`❌ Unexpected status: ${response.status}`);
        alert(`❌ Unexpected error: ${response.status}. Check console for details.`);
    }
    
    return response.text();
})
.then(text => {
    if (text) {
        console.log('Final response:', text);
    }
})
.catch(error => {
    console.error('❌ Error in authentication process:', error);
    
    if (error.message.includes('Failed to fetch')) {
        alert('❌ Network error. Check your connection or try again in a moment.');
    } else {
        alert(`❌ Authentication error: ${error.message}`);
    }
});

console.log('🔧 Ultimate debug script initiated. Check results above.');
