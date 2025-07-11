// Analytics service for tracking user interactions and improving UX

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

interface UserSession {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  events: AnalyticsEvent[];
  userAgent: string;
  referrer: string;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private currentSession: UserSession | null = null;
  private isInitialized = false;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Initialize analytics
  init(): void {
    if (this.isInitialized) return;

    this.startSession();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  // Start a new session
  private startSession(): void {
    this.currentSession = {
      sessionId: this.generateSessionId(),
      startTime: new Date(),
      lastActivity: new Date(),
      events: [],
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    };

    this.track('session_start', {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
    });
  }

  // Generate a unique session ID
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Setup event listeners for automatic tracking
  private setupEventListeners(): void {
    // Track page views
    window.addEventListener('popstate', () => {
      this.trackPageView();
    });

    // Track user activity
    ['click', 'scroll', 'keypress'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.updateLastActivity();
      });
    });

    // Track when user leaves
    window.addEventListener('beforeunload', () => {
      this.track('session_end', {
        duration: this.getSessionDuration(),
        eventsCount: this.currentSession?.events.length || 0,
      });
    });
  }

  // Track an event
  track(event: string, properties?: Record<string, any>): void {
    if (!this.currentSession) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        sessionId: this.currentSession.sessionId,
        ...properties,
      },
      timestamp: new Date(),
    };

    this.currentSession.events.push(analyticsEvent);
    this.updateLastActivity();

    // In a real app, you would send this to your analytics service
    // console.log('Analytics Event:', analyticsEvent);
  }

  // Track page views
  trackPageView(page?: string): void {
    const currentPage = page || window.location.pathname;
    this.track('page_view', {
      page: currentPage,
      title: document.title,
      url: window.location.href,
    });
  }

  // Track search events
  trackSearch(query: string, location?: string, filters?: any): void {
    this.track('search', {
      query,
      location,
      filters,
      hasResults: true, // This would be determined by search results
    });
  }

  // Track property interactions
  trackPropertyView(propertyId: string, propertyName: string): void {
    this.track('property_view', {
      propertyId,
      propertyName,
    });
  }

  trackPropertyContact(propertyId: string, contactMethod: 'call' | 'whatsapp' | 'email'): void {
    this.track('property_contact', {
      propertyId,
      contactMethod,
    });
  }

  trackPropertyFavorite(propertyId: string, action: 'add' | 'remove'): void {
    this.track('property_favorite', {
      propertyId,
      action,
    });
  }

  // Track booking events
  trackBookingStart(propertyId: string): void {
    this.track('booking_start', {
      propertyId,
    });
  }

  trackBookingComplete(propertyId: string, amount: number): void {
    this.track('booking_complete', {
      propertyId,
      amount,
    });
  }

  // Track user interactions
  trackButtonClick(buttonName: string, location: string): void {
    this.track('button_click', {
      buttonName,
      location,
    });
  }

  trackFormSubmit(formName: string, success: boolean): void {
    this.track('form_submit', {
      formName,
      success,
    });
  }

  // Update last activity time
  private updateLastActivity(): void {
    if (this.currentSession) {
      this.currentSession.lastActivity = new Date();
    }
  }

  // Get session duration in minutes
  private getSessionDuration(): number {
    if (!this.currentSession) return 0;
    return Math.round((Date.now() - this.currentSession.startTime.getTime()) / 60000);
  }

  // Get popular searches (mock implementation)
  getPopularSearches(): string[] {
    // In a real app, this would come from your analytics backend
    return [
      'Koramangala',
      'Whitefield',
      'Electronic City',
      'HSR Layout',
      'Marathahalli'
    ];
  }

  // Get user insights
  getUserInsights(): {
    sessionDuration: number;
    pagesViewed: number;
    searchesPerformed: number;
    propertiesViewed: number;
  } {
    if (!this.currentSession) {
      return {
        sessionDuration: 0,
        pagesViewed: 0,
        searchesPerformed: 0,
        propertiesViewed: 0,
      };
    }

    const events = this.currentSession.events;
    return {
      sessionDuration: this.getSessionDuration(),
      pagesViewed: events.filter(e => e.event === 'page_view').length,
      searchesPerformed: events.filter(e => e.event === 'search').length,
      propertiesViewed: events.filter(e => e.event === 'property_view').length,
    };
  }

  // Export session data (for debugging or support)
  exportSessionData(): string {
    return JSON.stringify(this.currentSession, null, 2);
  }
}

// Create and export singleton instance
export const analytics = AnalyticsService.getInstance();
