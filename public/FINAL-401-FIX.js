/**
 * GHAR - 401 Error Fix Script
 * 
 * This script fixes 401 Unauthorized errors by:
 * 1. Checking token validity
 * 2. Clearing invalid tokens
 * 3. Redirecting to login if needed
 * 4. Verifying user role for PG creation
 */

(function() {
  console.log('🔍 Running Ghar 401 Error Fix Script...');
  
  // Create UI for feedback
  const createFixUI = () => {
    // Remove existing UI if present
    const existingUI = document.getElementById('ghar-fix-ui');
    if (existingUI) existingUI.remove();
    
    // Create new UI
    const fixUI = document.createElement('div');
    fixUI.id = 'ghar-fix-ui';
    fixUI.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 15px;
      width: 300px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 10000;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    
    fixUI.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="margin: 0; color: #2563eb;">Ghar 401 Fix</h3>
        <button id="close-fix-ui" style="background: none; border: none; cursor: pointer; font-size: 16px;">✕</button>
      </div>
      <div id="fix-status" style="margin-bottom: 10px;">Checking token status...</div>
      <div id="fix-actions"></div>
    `;
    
    document.body.appendChild(fixUI);
    
    // Add close button handler
    document.getElementById('close-fix-ui').addEventListener('click', () => {
      fixUI.remove();
    });
    
    return {
      setStatus: (message, type = 'info') => {
        const statusEl = document.getElementById('fix-status');
        const colors = {
          info: '#3b82f6',
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b'
        };
        
        statusEl.innerHTML = message;
        statusEl.style.color = colors[type] || colors.info;
      },
      setActions: (actionsHTML) => {
        document.getElementById('fix-actions').innerHTML = actionsHTML;
      }
    };
  };
  
  // Parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };
  
  // Check if token is expired
  const isTokenExpired = (decodedToken) => {
    if (!decodedToken || !decodedToken.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  };
  
  // Create button HTML
  const createButton = (id, text, primary = false) => {
    const style = primary ? 
      'background-color: #2563eb; color: white;' : 
      'background-color: #f3f4f6; color: #1f2937; border: 1px solid #d1d5db;';
    
    return `<button id="${id}" style="${style} padding: 8px 12px; border-radius: 4px; margin-right: 8px; cursor: pointer;">${text}</button>`;
  };
  
  // Main fix function
  const runFix = async () => {
    const ui = createFixUI();
    ui.setStatus('Checking authentication status...', 'info');
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // Check if token exists
    if (!token) {
      ui.setStatus('No authentication token found!', 'error');
      ui.setActions(`
        <p>You need to login to fix this issue.</p>
        ${createButton('fix-login', 'Go to Login', true)}
      `);
      
      document.getElementById('fix-login').addEventListener('click', () => {
        window.location.href = '/login';
      });
      
      return;
    }
    
    // Check if token is Google token
    if (token.startsWith('google_')) {
      ui.setStatus('Using Google fallback token', 'warning');
      ui.setActions(`
        <p>You're using a Google fallback token which may not work with all API endpoints.</p>
        <p>Try logging in again with your credentials.</p>
        ${createButton('fix-login', 'Go to Login', true)}
        ${createButton('fix-continue', 'Continue Anyway')}
      `);
      
      document.getElementById('fix-login').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      });
      
      document.getElementById('fix-continue').addEventListener('click', () => {
        ui.setStatus('Continuing with current token...', 'info');
        setTimeout(() => {
          ui.setStatus('Done! Try your action again.', 'success');
          setTimeout(() => {
            document.getElementById('ghar-fix-ui').remove();
          }, 3000);
        }, 1000);
      });
      
      return;
    }
    
    // Check token format
    const parts = token.split('.');
    if (parts.length !== 3) {
      ui.setStatus('Invalid token format!', 'error');
      ui.setActions(`
        <p>Your token is malformed and needs to be reset.</p>
        ${createButton('fix-reset', 'Reset & Login', true)}
      `);
      
      document.getElementById('fix-reset').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      });
      
      return;
    }
    
    // Decode token
    const decoded = parseJwt(token);
    if (!decoded) {
      ui.setStatus('Could not decode token!', 'error');
      ui.setActions(`
        <p>Your token appears to be corrupted.</p>
        ${createButton('fix-reset', 'Reset & Login', true)}
      `);
      
      document.getElementById('fix-reset').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      });
      
      return;
    }
    
    // Check expiration
    if (isTokenExpired(decoded)) {
      ui.setStatus('Token has expired!', 'error');
      ui.setActions(`
        <p>Your session has expired and you need to login again.</p>
        ${createButton('fix-login', 'Login Again', true)}
      `);
      
      document.getElementById('fix-login').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      });
      
      return;
    }
    
    // Check user role for PG creation
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role !== 'owner' && userData.role !== 'admin') {
          ui.setStatus(`Role issue detected: ${userData.role}`, 'warning');
          ui.setActions(`
            <p>Your account role is '${userData.role}'. Only 'owner' or 'admin' roles can create PG listings.</p>
            <p>Please contact support or use an owner account.</p>
            ${createButton('fix-close', 'Close', true)}
          `);
          
          document.getElementById('fix-close').addEventListener('click', () => {
            document.getElementById('ghar-fix-ui').remove();
          });
          
          return;
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // If we got here, token is valid
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    const days = Math.floor(expiresIn / 86400);
    const hours = Math.floor((expiresIn % 86400) / 3600);
    
    ui.setStatus('Authentication is valid!', 'success');
    ui.setActions(`
      <p>Your token is valid and will expire in ${days} days and ${hours} hours.</p>
      <p>If you're still experiencing issues, try refreshing the page.</p>
      ${createButton('fix-refresh', 'Refresh Page', true)}
      ${createButton('fix-close', 'Close')}
    `);
    
    document.getElementById('fix-refresh').addEventListener('click', () => {
      window.location.reload();
    });
    
    document.getElementById('fix-close').addEventListener('click', () => {
      document.getElementById('ghar-fix-ui').remove();
    });
  };
  
  // Run the fix
  runFix().catch(err => {
    console.error('Error in fix script:', err);
    const ui = createFixUI();
    ui.setStatus('An error occurred while running the fix', 'error');
    ui.setActions(`
      <p>Error details: ${err.message}</p>
      ${createButton('fix-retry', 'Try Again', true)}
      ${createButton('fix-reset', 'Reset & Login')}
    `);
    
    document.getElementById('fix-retry').addEventListener('click', runFix);
    document.getElementById('fix-reset').addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  });
})();