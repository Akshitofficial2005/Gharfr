// Enhanced analytics tracking
interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  timestamp: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private userId: string | null = null;

  constructor() {
    this.userId = localStorage.getItem('userId');
    this.loadStoredEvents();
  }

  private loadStoredEvents() {
    const stored = localStorage.getItem('analyticsEvents');
    if (stored) {
      this.events = JSON.parse(stored);
    }
  }

  private saveEvents() {
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
    localStorage.setItem('analyticsEvents', JSON.stringify(this.events));
  }

  track(event: string, category: string, action: string, label?: string, value?: number) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      userId: this.userId || undefined,
      timestamp: new Date().toISOString()
    };

    this.events.push(analyticsEvent);
    this.saveEvents();

    // Send to analytics service (mock for now)
    this.sendToAnalytics(analyticsEvent);
  }

  private async sendToAnalytics(event: AnalyticsEvent) {
    try {
      // Mock analytics endpoint
      console.log('Analytics Event:', event);
      
      // In production, send to your analytics service
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Specific tracking methods
  trackPageView(page: string) {
    this.track('page_view', 'navigation', 'view', page);
  }

  trackSearch(query: string, results: number) {
    this.track('search', 'user_action', 'search', query, results);
  }

  trackBooking(pgId: string, amount: number) {
    this.track('booking', 'conversion', 'book', pgId, amount);
  }

  trackError(error: string, page: string) {
    this.track('error', 'system', 'error', `${page}: ${error}`);
  }

  trackPerformance(metric: string, value: number) {
    this.track('performance', 'system', metric, undefined, value);
  }

  // Get analytics insights
  getSearchInsights() {
    const searchEvents = this.events.filter(e => e.category === 'user_action' && e.action === 'search');
    const queries = searchEvents.map(e => e.label).filter(Boolean);
    
    return {
      totalSearches: searchEvents.length,
      uniqueQueries: Array.from(new Set(queries)).length,
      popularQueries: this.getTopQueries(queries),
      avgResultsPerSearch: searchEvents.reduce((sum, e) => sum + (e.value || 0), 0) / searchEvents.length
    };
  }

  private getTopQueries(queries: (string | undefined)[]): string[] {
    const queryCount: { [key: string]: number } = {};
    
    queries.forEach(query => {
      if (query) {
        queryCount[query] = (queryCount[query] || 0) + 1;
      }
    });

    return Object.entries(queryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query]) => query);
  }

  getConversionRate() {
    const bookings = this.events.filter(e => e.category === 'conversion').length;
    const pageViews = this.events.filter(e => e.category === 'navigation').length;
    
    return pageViews > 0 ? (bookings / pageViews) * 100 : 0;
  }

  getUserJourney() {
    return this.events
      .filter(e => e.category === 'navigation')
      .map(e => ({ page: e.label, timestamp: e.timestamp }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}

export const analytics = new AnalyticsService();