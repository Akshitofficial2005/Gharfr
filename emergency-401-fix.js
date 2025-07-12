// EMERGENCY 401 FIX - Run this immediately in browser console
console.log('🚨 EMERGENCY 401 FIX - Running...');

// Step 1: Clear all auth data and start fresh
console.log('🧹 Clearing all authentication data...');
localStorage.removeItem('token');
localStorage.removeItem('user');
sessionStorage.clear();

// Step 2: Force reload to clear any cached data
console.log('🔄 Forcing page reload to clear cache...');
setTimeout(() => {
    window.location.reload(true);
}, 2000);

alert('🚨 EMERGENCY FIX: Clearing all auth data and reloading page. Please login again after reload.');

// Note: After page reloads, user needs to login again to get fresh token
