// Quick role update utility for testing
// Run this in browser console to update user role

const updateUserRole = async () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Current token:', token ? token.substring(0, 20) + '...' : 'No token');
  console.log('Current user:', user ? JSON.parse(user) : 'No user');
  
  if (!token) {
    console.error('No token found. Please login first.');
    return;
  }
  
  try {
    // Try to update role to owner
    const response = await fetch('https://ghar-02ex.onrender.com/api/auth/update-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role: 'owner' })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Role update successful:', result);
      
      // Update localStorage with new user data
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
        console.log('✅ Local storage updated with new role');
      }
      
      // Refresh page to apply changes
      window.location.reload();
    } else {
      const error = await response.json();
      console.error('❌ Role update failed:', error);
    }
  } catch (error) {
    console.error('❌ Error updating role:', error);
  }
};

// Export for browser console use
window.updateUserRole = updateUserRole;

console.log('Role update utility loaded. Run updateUserRole() in console to update your role to owner.');
