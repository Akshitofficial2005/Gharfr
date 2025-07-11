describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.logout(); // Ensure clean state
  });
  
  describe('User Registration', () => {
    it('should register a new user successfully', () => {
      cy.visit('/register');
      
      const userData = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        phone: '9876543210',
        password: 'password123'
      };
      
      cy.fillRegistrationForm(userData);
      
      // Should redirect to dashboard after successful registration
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome').should('be.visible');
      
      // Should have token in localStorage
      cy.window().its('localStorage.token').should('exist');
    });
    
    it('should show validation errors for invalid data', () => {
      cy.visit('/register');
      
      // Try to submit empty form
      cy.get('[data-testid="register-button"]').click();
      
      // Should show validation errors
      cy.contains('Name is required').should('be.visible');
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });
    
    it('should not register user with existing email', () => {
      cy.visit('/register');
      
      const userData = {
        name: 'Test User',
        email: 'user@demo.com', // Existing demo user
        phone: '9876543210',
        password: 'password123'
      };
      
      cy.fillRegistrationForm(userData);
      
      // Should show error message
      cy.contains('Email already exists').should('be.visible');
    });
  });
  
  describe('User Login', () => {
    it('should login with valid credentials', () => {
      cy.visit('/login');
      
      cy.fillLoginForm('user@demo.com', 'demo123');
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome').should('be.visible');
      
      // Should have user data in localStorage
      cy.window().its('localStorage.user').should('exist');
    });
    
    it('should show error for invalid credentials', () => {
      cy.visit('/login');
      
      cy.fillLoginForm('invalid@email.com', 'wrongpassword');
      
      // Should show error message
      cy.contains('Invalid credentials').should('be.visible');
      
      // Should remain on login page
      cy.url().should('include', '/login');
    });
    
    it('should redirect to login when accessing protected routes', () => {
      cy.visit('/dashboard');
      
      // Should redirect to login
      cy.url().should('include', '/login');
      cy.contains('Please login').should('be.visible');
    });
  });
  
  describe('Password Reset', () => {
    it('should request password reset', () => {
      cy.visit('/forgot-password');
      
      cy.get('[data-testid="email-input"]').type('user@demo.com');
      cy.get('[data-testid="reset-button"]').click();
      
      // Should show success message
      cy.contains('Password reset email sent').should('be.visible');
    });
    
    it('should validate email format for password reset', () => {
      cy.visit('/forgot-password');
      
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="reset-button"]').click();
      
      // Should show validation error
      cy.contains('Please enter a valid email').should('be.visible');
    });
  });
  
  describe('Logout', () => {
    it('should logout user and clear session', () => {
      // Login first
      cy.login();
      cy.visit('/dashboard');
      
      // Verify user is logged in
      cy.contains('Welcome').should('be.visible');
      
      // Logout
      cy.get('[data-testid="logout-button"]').click();
      
      // Should redirect to home page
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Should clear localStorage
      cy.window().its('localStorage.token').should('not.exist');
      cy.window().its('localStorage.user').should('not.exist');
      
      // Should not be able to access protected routes
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });
  });
  
  describe('Session Management', () => {
    it('should maintain session across page reloads', () => {
      cy.login();
      cy.visit('/dashboard');
      
      // Verify logged in
      cy.contains('Welcome').should('be.visible');
      
      // Reload page
      cy.reload();
      
      // Should still be logged in
      cy.contains('Welcome').should('be.visible');
      cy.url().should('include', '/dashboard');
    });
    
    it('should handle expired token gracefully', () => {
      // Set expired token
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'expired.jwt.token');
        win.localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
      });
      
      cy.visit('/dashboard');
      
      // Should redirect to login
      cy.url().should('include', '/login');
      cy.contains('Session expired').should('be.visible');
    });
  });
});
