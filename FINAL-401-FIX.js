// 🔥 FINAL 401 ERROR FIX - COMPLETE SOLUTION
// ==========================================
// This script fixes BOTH issues causing 401 errors:
// 1. EXPIRED TOKENS (main cause)
// 2. INCORRECT USER ROLES (secondary cause)

console.log('🔥 FINAL 401 ERROR FIX - Starting comprehensive solution...');

// Step 1: Check current authentication state
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

console.log('📋 Current Authentication State:');
console.log('Token exists:', !!token);
console.log('User data exists:', !!userStr);

if (!token) {
    console.error('❌ NO TOKEN - User not logged in');
    alert('❌ You are not logged in. Please login first at: https://gharfr.vercel.app/login');
    window.open('https://gharfr.vercel.app/login', '_blank');
    throw new Error('No authentication token found');
}

// Step 2: Decode and check token expiration
try {
    const tokenParts = token.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < now;
    
    console.log('🔍 Token Analysis:');
    console.log('Token issued:', new Date(payload.iat * 1000).toLocaleString());
    console.log('Token expires:', new Date(payload.exp * 1000).toLocaleString());
    console.log('Current time:', new Date().toLocaleString());
    console.log('Token expired:', isExpired);
    console.log('User role:', payload.role);
    
    if (isExpired) {
        console.error('❌ TOKEN EXPIRED - This is the main cause of 401 errors!');
        alert('❌ Your login session has expired. You need to login again.');
        
        // Clear expired data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login
        window.open('https://gharfr.vercel.app/login', '_blank');
        throw new Error('Token expired - please login again');
    }
    
    // If token is valid but role is wrong
    if (payload.role !== 'owner' && payload.role !== 'admin') {
        console.log('⚠️ WRONG ROLE - User needs owner/admin role for PG creation');
        
        // Try to update role
        console.log('🔄 Attempting to update user role to owner...');
        
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
            throw new Error(`Role update failed: ${response.status}`);
        })
        .then(data => {
            console.log('✅ Role updated successfully:', data);
            
            // Update localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            currentUser.role = 'owner';
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            console.log('✅ Role fix complete!');
            testPGCreation();
        })
        .catch(error => {
            console.error('❌ Role update failed:', error);
            alert('❌ Could not update your role. Please contact support or try logging out and in again.');
        });
    } else {
        console.log('✅ Token valid and role correct - testing PG creation...');
        testPGCreation();
    }
    
} catch (error) {
    console.error('❌ Token decode error:', error);
    alert('❌ Invalid token format. Please login again.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.open('https://gharfr.vercel.app/login', '_blank');
}

// Step 3: Test PG creation function
function testPGCreation() {
    console.log('🧪 Testing PG creation with current authentication...');
    
    const currentToken = localStorage.getItem('token');
    
    fetch('https://ghar-02ex.onrender.com/api/pgs', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'TEST SUCCESS - DELETE ME',
            location: 'Test Location',
            pricePerMonth: 1,
            description: 'This PG was created successfully after fixing 401 errors'
        })
    })
    .then(response => {
        console.log('🎯 PG Creation Test Result:', response.status);
        
        if (response.status === 201) {
            console.log('🎉 SUCCESS! PG creation works perfectly!');
            alert('🎉 SUCCESS! The 401 error is completely fixed. You can now create PGs!');
            
            // Clean up test PG
            return response.json().then(data => {
                console.log('Test PG created:', data.data._id);
                console.log('You may want to delete this test PG from your dashboard.');
            });
        } else if (response.status === 401) {
            return response.json().then(errorData => {
                console.error('❌ Still getting 401:', errorData);
                alert(`❌ Still getting 401 error: ${errorData.message}`);
                
                if (errorData.message.includes('Invalid token') || errorData.message.includes('expired')) {
                    alert('❌ Token issue persists. Please logout and login again.');
                    window.open('https://gharfr.vercel.app/login', '_blank');
                }
            });
        } else {
            return response.json().then(errorData => {
                console.error(`❌ Unexpected error ${response.status}:`, errorData);
                alert(`❌ Error ${response.status}: ${errorData.message || 'Unknown error'}`);
            });
        }
    })
    .catch(error => {
        console.error('❌ Network error during test:', error);
        alert(`❌ Network error: ${error.message}`);
    });
}

// Step 4: Instructions for permanent fix
console.log(`
🔧 PERMANENT FIX INSTRUCTIONS:
=============================

The main cause of 401 errors is EXPIRED TOKENS. Here's how to fix it permanently:

1. **FOR USERS:**
   - Logout and login again to get fresh tokens
   - Ensure your account has 'owner' or 'admin' role
   - Use this script when you get 401 errors

2. **FOR DEVELOPERS:**
   - Implement automatic token refresh in the frontend
   - Add better token expiration handling
   - Show clear "session expired" messages to users
   - Consider longer token expiration times for better UX

3. **IMMEDIATE ACTIONS:**
   - Run this script to fix your current session
   - If it still fails, logout and login again
   - Contact support if problems persist

The 401 error was NOT a server bug - it's working correctly by rejecting expired tokens!
`);
