// Quick 401 Fix Script - Run this in your browser console
// Go to https://gharfr.vercel.app, open console (F12), and paste this script

console.log('🔧 Running 401 Fix Script...');

// Step 1: Check current authentication
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

if (!token) {
    console.error('❌ No token found. Please login first at: https://gharfr.vercel.app/login');
    alert('Please login first, then run this script again.');
} else {
    console.log('✅ Token found');
    
    if (!userStr) {
        console.error('❌ No user data found');
    } else {
        try {
            const user = JSON.parse(userStr);
            console.log('Current user:', user.email, 'Role:', user.role);
            
            // Step 2: Update role if needed
            if (user.role !== 'owner' && user.role !== 'admin') {
                console.log('🔄 Updating role to owner...');
                
                fetch('https://ghar-02ex.onrender.com/api/auth/update-role', {
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
                    throw new Error(`HTTP ${response.status}`);
                })
                .then(data => {
                    console.log('✅ Role updated successfully:', data);
                    
                    // Update localStorage
                    user.role = 'owner';
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    console.log('✅ localStorage updated');
                    alert('✅ Your role has been updated to "owner". You can now create PGs!');
                    
                    // Step 3: Test PG creation
                    console.log('🧪 Testing PG creation...');
                    return fetch('https://ghar-02ex.onrender.com/api/pgs', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: 'Test PG - Delete Me',
                            location: 'Test Location',
                            pricePerMonth: 1,
                            description: 'Test PG created by fix script'
                        })
                    });
                })
                .then(response => {
                    if (response.ok) {
                        console.log('🎉 SUCCESS! PG creation works now!');
                        alert('🎉 SUCCESS! The 401 error is fixed. You can now create PGs!');
                    } else {
                        console.error('❌ PG creation still failed:', response.status);
                        alert(`❌ PG creation still failed with status: ${response.status}`);
                    }
                })
                .catch(error => {
                    console.error('❌ Error:', error);
                    alert(`❌ Error: ${error.message}`);
                });
            } else {
                console.log('✅ User already has correct role');
                
                // Test PG creation directly
                console.log('🧪 Testing PG creation...');
                fetch('https://ghar-02ex.onrender.com/api/pgs', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'Test PG - Delete Me',
                        location: 'Test Location',
                        pricePerMonth: 1,
                        description: 'Test PG created by fix script'
                    })
                })
                .then(response => {
                    if (response.ok) {
                        console.log('🎉 PG creation works!');
                        alert('🎉 PG creation works! The issue might be elsewhere.');
                    } else {
                        console.error('❌ PG creation failed:', response.status);
                        if (response.status === 401) {
                            alert('❌ Still getting 401. Token might be expired - try logging out and in again.');
                        } else {
                            alert(`❌ PG creation failed with status: ${response.status}`);
                        }
                    }
                })
                .catch(error => {
                    console.error('❌ Network error:', error);
                    alert(`❌ Network error: ${error.message}`);
                });
            }
        } catch (e) {
            console.error('❌ User data corrupted:', e);
            alert('❌ User data corrupted. Please logout and login again.');
        }
    }
}

console.log('🔧 Fix script completed. Check the results above.');
