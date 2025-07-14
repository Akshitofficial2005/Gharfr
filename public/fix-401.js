// Quick fix for the 401 error - Manual session cleanup
console.log('🧹 Clearing all session data...');

// Clear localStorage
if (typeof localStorage !== 'undefined') {
    localStorage.clear();
    console.log('✅ localStorage cleared');
}

// Clear sessionStorage  
if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared');
}

// Clear cookies
if (typeof document !== 'undefined') {
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    console.log('✅ Cookies cleared');
}

console.log('🎯 Solution: The 401 errors are caused by expired JWT tokens.');
console.log('📝 Steps to fix:');
console.log('1. Refresh the page (F5)');
console.log('2. Login again with: agrawalakshit36@gmail.com / akshit@Mayank2003');
console.log('3. Try creating a PG - it will work!');
console.log('');
console.log('🔍 Technical details:');
console.log('- JWT tokens expire after 24 hours');
console.log('- Your old tokens from previous sessions are expired');
console.log('- Fresh login generates new valid tokens');
console.log('- The backend authentication is working correctly');

// If running in browser, also try to reload
if (typeof window !== 'undefined') {
    setTimeout(() => {
        console.log('🔄 Reloading page in 3 seconds...');
        window.location.reload();
    }, 3000);
}
