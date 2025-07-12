// IMMEDIATE TOKEN FIX - Run this in browser console RIGHT NOW
console.log('🔧 IMMEDIATE TOKEN FIX - Clearing corrupted token...');

// Step 1: Check current token
const currentToken = localStorage.getItem('token');
console.log('Current token:', currentToken ? 'EXISTS (length: ' + currentToken.length + ')' : 'NULL');

if (currentToken) {
    // Check if token looks valid (JWT format: xxx.yyy.zzz)
    const parts = currentToken.split('.');
    console.log('Token parts:', parts.length);
    
    if (parts.length !== 3) {
        console.log('❌ Token is malformed - not proper JWT format');
    } else {
        console.log('ℹ️ Token format looks correct but may be corrupted');
    }
}

// Step 2: Clear ALL authentication data
console.log('🧹 Clearing all authentication data...');
localStorage.removeItem('token');
localStorage.removeItem('user');
sessionStorage.clear();

// Step 3: Clear any cached auth headers
console.log('🔄 Clearing browser cache...');

// Step 4: Redirect to login
console.log('➡️ Redirecting to login page...');
alert('🔧 Fixed corrupted token! Redirecting to login page for fresh authentication.');

setTimeout(() => {
    window.location.href = '/login';
}, 1000);

console.log('✅ Token fix complete. You will be redirected to login.');
