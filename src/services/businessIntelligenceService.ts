// Advanced Business Intelligence Service

export interface BusinessMetrics {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
    forecast: number[];
  };
  users: {
    total: number;
    active: number;
    new: number;
    retention: number;
    churn: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    conversionRate: number;
  };
  pgs: {
    total: number;
    active: number;
    pending: number;
    occupancyRate: number;
    averageRating: number;
  };
  financial: {
    commission: number;
    expenses: number;
    profit: number;
    cashFlow: number[];
  };
}

export interface AnalyticsFilter {
  dateRange: {
    start: string;
    end: string;
  };
  location?: string[];
  pgType?: string[];
  userSegment?: string[];
  priceRange?: [number, number];
}

export interface UserBehaviorAnalytics {
  sessionMetrics: {
    averageSessionDuration: number;
    bounceRate: number;
    pagesPerSession: number;
    exitRate: number;
  };
  userJourney: {
    landingPages: Array<{ page: string; count: number; conversionRate: number }>;
    exitPages: Array<{ page: string; count: number }>;
    conversionFunnel: Array<{ step: string; users: number; dropOff: number }>;
  };
  searchBehavior: {
    topKeywords: Array<{ keyword: string; count: number; conversions: number }>;
    filterUsage: Record<string, number>;
    searchToBookingTime: number;
  };
}

export interface PredictiveAnalytics {
  demandForecast: {
    nextMonth: number;
    nextQuarter: number;
    seasonalTrends: Array<{ month: string; demandIndex: number }>;
  };
  pricingOptimization: {
    recommendedPrices: Array<{ pgId: string; currentPrice: number; suggestedPrice: number; confidence: number }>;
    priceElasticity: number;
  };
  churnPrediction: {
    highRiskUsers: Array<{ userId: string; churnProbability: number; reasons: string[] }>;
    interventionSuggestions: string[];
  };
}

class BusinessIntelligenceService {
  private static instance: BusinessIntelligenceService;
  
  public static getInstance(): BusinessIntelligenceService {
    if (!BusinessIntelligenceService.instance) {
      BusinessIntelligenceService.instance = new BusinessIntelligenceService();
    }
    return BusinessIntelligenceService.instance;
  }

  // Get comprehensive business metrics
  async getBusinessMetrics(filter: AnalyticsFilter): Promise<BusinessMetrics> {
    try {
      const response = await fetch('/api/analytics/business-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filter)
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch business metrics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      return this.getMockBusinessMetrics();
    }
  }

  // Get user behavior analytics
  async getUserBehaviorAnalytics(filter: AnalyticsFilter): Promise<UserBehaviorAnalytics> {
    try {
      const response = await fetch('/api/analytics/user-behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filter)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user behavior analytics:', error);
      return this.getMockUserBehaviorAnalytics();
    }
  }

  // Get predictive analytics
  async getPredictiveAnalytics(): Promise<PredictiveAnalytics> {
    try {
      const response = await fetch('/api/analytics/predictive');
      return await response.json();
    } catch (error) {
      console.error('Error fetching predictive analytics:', error);
      return this.getMockPredictiveAnalytics();
    }
  }

  // Real-time dashboard data
  async getRealTimeMetrics(): Promise<{
    onlineUsers: number;
    activeBookings: number;
    revenueToday: number;
    topPerformingPGs: Array<{ id: string; name: string; bookingsToday: number }>;
  }> {
    try {
      const response = await fetch('/api/analytics/real-time');
      return await response.json();
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      return {
        onlineUsers: Math.floor(Math.random() * 500) + 100,
        activeBookings: Math.floor(Math.random() * 50) + 20,
        revenueToday: Math.floor(Math.random() * 100000) + 25000,
        topPerformingPGs: [
          { id: '1', name: 'Green Valley PG', bookingsToday: 8 },
          { id: '2', name: 'Sunrise Residency', bookingsToday: 6 },
          { id: '3', name: 'Urban Living PG', bookingsToday: 5 }
        ]
      };
    }
  }

  // Cohort analysis for user retention
  async getCohortAnalysis(period: 'weekly' | 'monthly'): Promise<{
    cohorts: Array<{
      period: string;
      users: number;
      retention: number[];
    }>;
  }> {
    try {
      const response = await fetch(`/api/analytics/cohort?period=${period}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching cohort analysis:', error);
      return this.getMockCohortAnalysis();
    }
  }

  // Revenue analytics with detailed breakdown
  async getRevenueAnalytics(filter: AnalyticsFilter): Promise<{
    totalRevenue: number;
    revenueGrowth: number;
    revenueBySource: Array<{ source: string; revenue: number; percentage: number }>;
    monthlyTrend: Array<{ month: string; revenue: number; bookings: number }>;
    profitability: {
      grossProfit: number;
      operatingProfit: number;
      netProfit: number;
      margins: { gross: number; operating: number; net: number };
    };
  }> {
    try {
      const response = await fetch('/api/analytics/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filter)
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return this.getMockRevenueAnalytics();
    }
  }

  // Geographic analytics
  async getGeographicAnalytics(): Promise<{
    cityPerformance: Array<{
      city: string;
      users: number;
      bookings: number;
      revenue: number;
      growth: number;
    }>;
    heatmapData: Array<{
      lat: number;
      lng: number;
      intensity: number;
    }>;
  }> {
    try {
      const response = await fetch('/api/analytics/geographic');
      return await response.json();
    } catch (error) {
      console.error('Error fetching geographic analytics:', error);
      return this.getMockGeographicAnalytics();
    }
  }

  // Custom report generation
  async generateCustomReport(config: {
    metrics: string[];
    dimensions: string[];
    filters: AnalyticsFilter;
    format: 'json' | 'csv' | 'pdf';
  }): Promise<{ reportId: string; downloadUrl: string }> {
    try {
      const response = await fetch('/api/analytics/custom-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      return await response.json();
    } catch (error) {
      console.error('Error generating custom report:', error);
      throw error;
    }
  }

  // A/B testing analytics
  async getABTestResults(): Promise<{
    activeTests: Array<{
      id: string;
      name: string;
      status: 'running' | 'completed';
      variants: Array<{
        name: string;
        traffic: number;
        conversions: number;
        conversionRate: number;
        significance: number;
      }>;
    }>;
  }> {
    try {
      const response = await fetch('/api/analytics/ab-tests');
      return await response.json();
    } catch (error) {
      console.error('Error fetching A/B test results:', error);
      return { activeTests: [] };
    }
  }

  // Export analytics data
  async exportData(
    type: 'business-metrics' | 'user-behavior' | 'revenue',
    format: 'csv' | 'excel' | 'pdf',
    filter: AnalyticsFilter
  ): Promise<{ downloadUrl: string }> {
    try {
      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, format, filter })
      });
      return await response.json();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Mock data generators for development
  private getMockBusinessMetrics(): BusinessMetrics {
    return {
      revenue: {
        total: 2500000,
        monthly: 450000,
        growth: 15.5,
        forecast: [500000, 520000, 540000, 565000, 580000, 600000]
      },
      users: {
        total: 15000,
        active: 8500,
        new: 1200,
        retention: 78.5,
        churn: 12.3
      },
      bookings: {
        total: 3500,
        pending: 45,
        confirmed: 3200,
        cancelled: 255,
        conversionRate: 18.7
      },
      pgs: {
        total: 850,
        active: 720,
        pending: 35,
        occupancyRate: 82.4,
        averageRating: 4.2
      },
      financial: {
        commission: 375000,
        expenses: 125000,
        profit: 250000,
        cashFlow: [50000, 75000, 100000, 125000, 150000, 175000]
      }
    };
  }

  private getMockUserBehaviorAnalytics(): UserBehaviorAnalytics {
    return {
      sessionMetrics: {
        averageSessionDuration: 480, // 8 minutes
        bounceRate: 35.2,
        pagesPerSession: 4.8,
        exitRate: 28.5
      },
      userJourney: {
        landingPages: [
          { page: '/home', count: 5200, conversionRate: 22.1 },
          { page: '/search', count: 3800, conversionRate: 35.4 },
          { page: '/pg-details', count: 2100, conversionRate: 45.8 }
        ],
        exitPages: [
          { page: '/search', count: 1800 },
          { page: '/pg-details', count: 1200 },
          { page: '/booking', count: 800 }
        ],
        conversionFunnel: [
          { step: 'Landing', users: 10000, dropOff: 0 },
          { step: 'Search', users: 7500, dropOff: 25 },
          { step: 'PG Details', users: 4500, dropOff: 40 },
          { step: 'Booking Form', users: 2250, dropOff: 50 },
          { step: 'Payment', users: 1350, dropOff: 40 },
          { step: 'Confirmation', users: 1200, dropOff: 11 }
        ]
      },
      searchBehavior: {
        topKeywords: [
          { keyword: 'PG near me', count: 3500, conversions: 450 },
          { keyword: 'girls PG', count: 2800, conversions: 380 },
          { keyword: 'working women PG', count: 2200, conversions: 320 }
        ],
        filterUsage: {
          'price': 8500,
          'location': 7200,
          'amenities': 5800,
          'gender': 5200,
          'rating': 3200
        },
        searchToBookingTime: 1200 // 20 minutes average
      }
    };
  }

  private getMockPredictiveAnalytics(): PredictiveAnalytics {
    return {
      demandForecast: {
        nextMonth: 1850,
        nextQuarter: 5200,
        seasonalTrends: [
          { month: 'Jan', demandIndex: 0.8 },
          { month: 'Feb', demandIndex: 0.9 },
          { month: 'Mar', demandIndex: 1.2 },
          { month: 'Apr', demandIndex: 1.1 },
          { month: 'May', demandIndex: 0.7 },
          { month: 'Jun', demandIndex: 1.4 },
          { month: 'Jul', demandIndex: 1.6 },
          { month: 'Aug', demandIndex: 1.3 },
          { month: 'Sep', demandIndex: 1.1 },
          { month: 'Oct', demandIndex: 0.9 },
          { month: 'Nov', demandIndex: 0.8 },
          { month: 'Dec', demandIndex: 0.6 }
        ]
      },
      pricingOptimization: {
        recommendedPrices: [
          { pgId: 'pg1', currentPrice: 12000, suggestedPrice: 13500, confidence: 0.85 },
          { pgId: 'pg2', currentPrice: 8000, suggestedPrice: 7500, confidence: 0.92 },
          { pgId: 'pg3', currentPrice: 15000, suggestedPrice: 16000, confidence: 0.78 }
        ],
        priceElasticity: -0.8
      },
      churnPrediction: {
        highRiskUsers: [
          { userId: 'user1', churnProbability: 0.85, reasons: ['Poor rating given', 'No recent activity', 'Support complaints'] },
          { userId: 'user2', churnProbability: 0.72, reasons: ['Payment issues', 'Search without booking'] }
        ],
        interventionSuggestions: [
          'Send personalized offers to high-risk users',
          'Implement retention campaign',
          'Improve customer support response time'
        ]
      }
    };
  }

  private getMockCohortAnalysis() {
    return {
      cohorts: [
        { period: '2025-01', users: 1000, retention: [100, 85, 70, 60, 55, 50, 48] },
        { period: '2025-02', users: 1200, retention: [100, 88, 72, 62, 58, 53] },
        { period: '2025-03', users: 1500, retention: [100, 90, 75, 65, 60] },
        { period: '2025-04', users: 1800, retention: [100, 92, 78, 68] },
        { period: '2025-05', users: 2000, retention: [100, 95, 80] },
        { period: '2025-06', users: 2200, retention: [100, 97] },
        { period: '2025-07', users: 2500, retention: [100] }
      ]
    };
  }

  private getMockRevenueAnalytics() {
    return {
      totalRevenue: 2500000,
      revenueGrowth: 25.5,
      revenueBySource: [
        { source: 'Booking Commission', revenue: 1750000, percentage: 70 },
        { source: 'Listing Fees', revenue: 500000, percentage: 20 },
        { source: 'Premium Features', revenue: 250000, percentage: 10 }
      ],
      monthlyTrend: [
        { month: 'Jan', revenue: 180000, bookings: 280 },
        { month: 'Feb', revenue: 220000, bookings: 340 },
        { month: 'Mar', revenue: 280000, bookings: 420 },
        { month: 'Apr', revenue: 320000, bookings: 480 },
        { month: 'May', revenue: 380000, bookings: 560 },
        { month: 'Jun', revenue: 450000, bookings: 650 },
        { month: 'Jul', revenue: 520000, bookings: 750 }
      ],
      profitability: {
        grossProfit: 2000000,
        operatingProfit: 1500000,
        netProfit: 1200000,
        margins: { gross: 80, operating: 60, net: 48 }
      }
    };
  }

  private getMockGeographicAnalytics() {
    return {
      cityPerformance: [
        { city: 'Bangalore', users: 5500, bookings: 1200, revenue: 850000, growth: 28 },
        { city: 'Mumbai', users: 4200, bookings: 950, revenue: 720000, growth: 22 },
        { city: 'Delhi', users: 3800, bookings: 800, revenue: 650000, growth: 18 },
        { city: 'Pune', users: 2500, bookings: 550, revenue: 420000, growth: 35 },
        { city: 'Hyderabad', users: 2200, bookings: 480, revenue: 380000, growth: 40 }
      ],
      heatmapData: [
        { lat: 12.9716, lng: 77.5946, intensity: 0.9 }, // Bangalore
        { lat: 19.0760, lng: 72.8777, intensity: 0.8 }, // Mumbai
        { lat: 28.7041, lng: 77.1025, intensity: 0.7 }, // Delhi
        { lat: 18.5204, lng: 73.8567, intensity: 0.6 }, // Pune
        { lat: 17.3850, lng: 78.4867, intensity: 0.5 }  // Hyderabad
      ]
    };
  }
}

// Export singleton instance
export const businessIntelligenceService = BusinessIntelligenceService.getInstance();
