import './commands';
import '@testing-library/cypress/add-commands';

// Configure Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore certain errors that don't affect functionality
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  return true;
});

// Custom commands for authentication
Cypress.Commands.add('login', (email = 'user@demo.com', password = 'demo123') => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.data.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.data.user));
  });
});

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
});

// Custom commands for API testing
Cypress.Commands.add('apiRequest', (method, url, body = null) => {
  const token = window.localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    headers,
    failOnStatusCode: false
  });
});

// Custom commands for common UI interactions
Cypress.Commands.add('fillLoginForm', (email, password) => {
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

Cypress.Commands.add('fillRegistrationForm', (userData) => {
  cy.get('[data-testid="name-input"]').type(userData.name);
  cy.get('[data-testid="email-input"]').type(userData.email);
  cy.get('[data-testid="phone-input"]').type(userData.phone);
  cy.get('[data-testid="password-input"]').type(userData.password);
  cy.get('[data-testid="confirm-password-input"]').type(userData.password);
  cy.get('[data-testid="register-button"]').click();
});

Cypress.Commands.add('searchPGs', (city, filters = {}) => {
  cy.get('[data-testid="search-input"]').type(city);
  
  if (filters.minPrice) {
    cy.get('[data-testid="min-price-input"]').type(filters.minPrice.toString());
  }
  
  if (filters.maxPrice) {
    cy.get('[data-testid="max-price-input"]').type(filters.maxPrice.toString());
  }
  
  if (filters.amenities) {
    filters.amenities.forEach(amenity => {
      cy.get(`[data-testid="amenity-${amenity}"]`).click();
    });
  }
  
  cy.get('[data-testid="search-button"]').click();
});

// Custom commands for waiting
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('[data-testid="loading"]').should('not.exist');
  cy.get('body').should('be.visible');
});

Cypress.Commands.add('waitForApiResponse', (alias) => {
  cy.wait(alias);
  cy.get('[data-testid="loading"]').should('not.exist');
});
