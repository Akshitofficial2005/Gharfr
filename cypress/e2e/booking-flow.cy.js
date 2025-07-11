describe('PG Booking Flow', () => {
  beforeEach(() => {
    cy.login(); // Login as demo user
    cy.visit('/');
  });
  
  describe('PG Search and Discovery', () => {
    it('should search for PGs by city', () => {
      cy.searchPGs('Mumbai');
      
      // Should show search results
      cy.get('[data-testid="pg-card"]').should('have.length.at.least', 1);
      cy.contains('Mumbai').should('be.visible');
    });
    
    it('should filter PGs by price range', () => {
      cy.visit('/search');
      
      cy.searchPGs('Delhi', { minPrice: 10000, maxPrice: 20000 });
      
      // Should show filtered results
      cy.get('[data-testid="pg-card"]').should('exist');
      
      // Verify price range
      cy.get('[data-testid="pg-price"]').each(($el) => {
        const price = parseInt($el.text().replace(/[^\d]/g, ''));
        expect(price).to.be.within(10000, 20000);
      });
    });
    
    it('should filter PGs by amenities', () => {
      cy.visit('/search');
      
      cy.searchPGs('Bangalore', { amenities: ['wifi', 'ac'] });
      
      // Should show filtered results
      cy.get('[data-testid="pg-card"]').should('exist');
      
      // Verify amenities are displayed
      cy.get('[data-testid="amenity-wifi"]').should('be.visible');
      cy.get('[data-testid="amenity-ac"]').should('be.visible');
    });
    
    it('should show no results for unavailable locations', () => {
      cy.searchPGs('NonExistentCity');
      
      // Should show no results message
      cy.contains('No PGs found').should('be.visible');
      cy.get('[data-testid="pg-card"]').should('not.exist');
    });
  });
  
  describe('PG Details View', () => {
    it('should display PG details correctly', () => {
      cy.visit('/search');
      cy.searchPGs('Mumbai');
      
      // Click on first PG card
      cy.get('[data-testid="pg-card"]').first().click();
      
      // Should navigate to PG details page
      cy.url().should('include', '/pg/');
      
      // Should display PG information
      cy.get('[data-testid="pg-name"]').should('be.visible');
      cy.get('[data-testid="pg-description"]').should('be.visible');
      cy.get('[data-testid="pg-location"]').should('be.visible');
      cy.get('[data-testid="pg-price"]').should('be.visible');
      cy.get('[data-testid="pg-amenities"]').should('be.visible');
      cy.get('[data-testid="pg-images"]').should('be.visible');
    });
    
    it('should display room types and availability', () => {
      cy.visit('/search');
      cy.searchPGs('Mumbai');
      cy.get('[data-testid="pg-card"]').first().click();
      
      // Should display room types
      cy.get('[data-testid="room-types"]').should('be.visible');
      cy.get('[data-testid="room-type-card"]').should('have.length.at.least', 1);
      
      // Each room type should have price and availability
      cy.get('[data-testid="room-type-card"]').each(($el) => {
        cy.wrap($el).find('[data-testid="room-price"]').should('be.visible');
        cy.wrap($el).find('[data-testid="room-availability"]').should('be.visible');
      });
    });
    
    it('should display reviews and ratings', () => {
      cy.visit('/search');
      cy.searchPGs('Mumbai');
      cy.get('[data-testid="pg-card"]').first().click();
      
      // Should display overall rating
      cy.get('[data-testid="overall-rating"]').should('be.visible');
      
      // Should display reviews section
      cy.get('[data-testid="reviews-section"]').should('be.visible');
      cy.get('[data-testid="review-card"]').should('have.length.at.least', 1);
    });
  });
  
  describe('Booking Process', () => {
    it('should complete booking process successfully', () => {
      cy.visit('/search');
      cy.searchPGs('Mumbai');
      cy.get('[data-testid="pg-card"]').first().click();
      
      // Select room type
      cy.get('[data-testid="room-type-card"]').first().click();
      cy.get('[data-testid="book-now-button"]').click();
      
      // Should navigate to booking page
      cy.url().should('include', '/book/');
      
      // Fill booking details
      cy.get('[data-testid="checkin-date"]').click();
      cy.get('[data-testid="date-next-month"]').click(); // Select next month
      cy.get('[data-testid="date-1"]').click(); // Select 1st day
      
      cy.get('[data-testid="checkout-date"]').click();
      cy.get('[data-testid="date-next-month"]').click(); // Select next month
      cy.get('[data-testid="date-15"]').click(); // Select 15th day
      
      cy.get('[data-testid="guests-select"]').select('1');
      
      // Proceed to payment
      cy.get('[data-testid="proceed-payment"]').click();
      
      // Should navigate to payment page
      cy.url().should('include', '/payment/');
      
      // Verify booking summary
      cy.get('[data-testid="booking-summary"]').should('be.visible');
      cy.get('[data-testid="total-amount"]').should('be.visible');
      
      // Complete payment (mock payment for testing)
      cy.get('[data-testid="payment-method"]').select('upi');
      cy.get('[data-testid="complete-payment"]').click();
      
      // Should show success message
      cy.contains('Booking confirmed').should('be.visible');
      cy.url().should('include', '/booking-confirmed');
    });
    
    it('should validate booking dates', () => {
      cy.visit('/search');
      cy.searchPGs('Mumbai');
      cy.get('[data-testid="pg-card"]').first().click();
      cy.get('[data-testid="room-type-card"]').first().click();
      cy.get('[data-testid="book-now-button"]').click();
      
      // Try to select checkout date before checkin date
      cy.get('[data-testid="checkout-date"]').click();
      cy.get('[data-testid="date-yesterday"]').click(); // Select yesterday
      
      // Should show validation error
      cy.contains('Check-out date must be after check-in date').should('be.visible');
    });
    
    it('should handle unavailable dates', () => {
      cy.visit('/search');
      cy.searchPGs('Mumbai');
      cy.get('[data-testid="pg-card"]').first().click();
      cy.get('[data-testid="room-type-card"]').first().click();
      cy.get('[data-testid="book-now-button"]').click();
      
      // Try to select already booked dates
      cy.get('[data-testid="checkin-date"]').click();
      cy.get('[data-testid="date-unavailable"]').should('have.class', 'disabled');
      
      // Should not be able to select unavailable dates
      cy.get('[data-testid="date-unavailable"]').click();
      cy.get('[data-testid="checkin-date"]').should('have.value', '');
    });
  });
  
  describe('User Booking Management', () => {
    it('should display user bookings', () => {
      cy.visit('/bookings');
      
      // Should display bookings list
      cy.get('[data-testid="bookings-list"]').should('be.visible');
      cy.get('[data-testid="booking-card"]').should('have.length.at.least', 0);
      
      // Each booking should display key information
      cy.get('[data-testid="booking-card"]').each(($el) => {
        cy.wrap($el).find('[data-testid="pg-name"]').should('be.visible');
        cy.wrap($el).find('[data-testid="booking-dates"]').should('be.visible');
        cy.wrap($el).find('[data-testid="booking-status"]').should('be.visible');
        cy.wrap($el).find('[data-testid="booking-amount"]').should('be.visible');
      });
    });
    
    it('should allow booking cancellation', () => {
      cy.visit('/bookings');
      
      // Find a confirmed booking
      cy.get('[data-testid="booking-card"]')
        .contains('Confirmed')
        .parent()
        .find('[data-testid="cancel-booking"]')
        .click();
      
      // Should show confirmation dialog
      cy.get('[data-testid="confirm-cancel"]').should('be.visible');
      cy.get('[data-testid="confirm-cancel-yes"]').click();
      
      // Should show success message
      cy.contains('Booking cancelled successfully').should('be.visible');
      
      // Booking status should update
      cy.get('[data-testid="booking-status"]').should('contain', 'Cancelled');
    });
    
    it('should display booking details', () => {
      cy.visit('/bookings');
      
      // Click on a booking to view details
      cy.get('[data-testid="booking-card"]').first().click();
      
      // Should navigate to booking details
      cy.url().should('include', '/booking/');
      
      // Should display detailed information
      cy.get('[data-testid="booking-details"]').should('be.visible');
      cy.get('[data-testid="pg-details"]').should('be.visible');
      cy.get('[data-testid="payment-details"]').should('be.visible');
      cy.get('[data-testid="booking-timeline"]').should('be.visible');
    });
  });
  
  describe('Reviews and Ratings', () => {
    it('should allow user to leave a review', () => {
      cy.visit('/bookings');
      
      // Find a completed booking
      cy.get('[data-testid="booking-card"]')
        .contains('Completed')
        .parent()
        .find('[data-testid="leave-review"]')
        .click();
      
      // Should open review modal
      cy.get('[data-testid="review-modal"]').should('be.visible');
      
      // Fill review form
      cy.get('[data-testid="rating-cleanliness"]').click();
      cy.get('[data-testid="rating-safety"]').click();
      cy.get('[data-testid="rating-value"]').click();
      cy.get('[data-testid="review-text"]').type('Great experience, would recommend!');
      
      // Submit review
      cy.get('[data-testid="submit-review"]').click();
      
      // Should show success message
      cy.contains('Review submitted successfully').should('be.visible');
    });
    
    it('should validate review form', () => {
      cy.visit('/bookings');
      
      cy.get('[data-testid="booking-card"]')
        .contains('Completed')
        .parent()
        .find('[data-testid="leave-review"]')
        .click();
      
      // Try to submit empty review
      cy.get('[data-testid="submit-review"]').click();
      
      // Should show validation errors
      cy.contains('Please provide ratings').should('be.visible');
      cy.contains('Please write a review').should('be.visible');
    });
  });
});
