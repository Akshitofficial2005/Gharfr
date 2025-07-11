import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Home, 
  IndianRupee, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Clock,
  Target,
  Zap,
  Eye,
  MousePointer,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { businessIntelligenceService, BusinessMetrics, AnalyticsFilter } from '../services/businessIntelligenceService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface EnhancedAnalyticsDashboardProps {
  isAdmin?: boolean;
}

const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({ isAdmin = true }) => {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [userBehavior, setUserBehavior] = useState<any>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<any>(null);
  const [geographicData, setGeographicData] = useState<any>(null);
  const [predictiveData, setPredictiveData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadRealTimeData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const filter: AnalyticsFilter = {
        dateRange: {
          start: getDateRange(selectedTimeRange).start,
          end: getDateRange(selectedTimeRange).end
        }
      };

      const [
        businessMetrics,
        realTime,
        userBehaviorData,
        revenueData,
        geoData,
        predictive
      ] = await Promise.all([
        businessIntelligenceService.getBusinessMetrics(filter),
        businessIntelligenceService.getRealTimeMetrics(),
        businessIntelligenceService.getUserBehaviorAnalytics(filter),
        businessIntelligenceService.getRevenueAnalytics(filter),
        businessIntelligenceService.getGeographicAnalytics(),
        businessIntelligenceService.getPredictiveAnalytics()
      ]);

      setMetrics(businessMetrics);
      setRealTimeData(realTime);
      setUserBehavior(userBehaviorData);
      setRevenueAnalytics(revenueData);
      setGeographicData(geoData);
      setPredictiveData(predictive);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const realTime = await businessIntelligenceService.getRealTimeMetrics();
      setRealTimeData(realTime);
    } catch (error) {
      console.error('Error loading real-time data:', error);
    }
  };

  const getDateRange = (range: string) => {
    const end = new Date();
    const start = new Date();
    
    switch (range) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      case '1y':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 30);
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // Chart configurations
  const revenueChartData = {
    labels: revenueAnalytics?.monthlyTrend?.map((item: any) => item.month) || [],
    datasets: [
      {
        label: 'Revenue',
        data: revenueAnalytics?.monthlyTrend?.map((item: any) => item.revenue) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Bookings',
        data: revenueAnalytics?.monthlyTrend?.map((item: any) => item.bookings) || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      }
    ],
  };

  const conversionFunnelData = {
    labels: userBehavior?.userJourney?.conversionFunnel?.map((step: any) => step.step) || [],
    datasets: [
      {
        label: 'Users',
        data: userBehavior?.userJourney?.conversionFunnel?.map((step: any) => step.users) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
      }
    ],
  };

  const cityPerformanceData = {
    labels: geographicData?.cityPerformance?.map((city: any) => city.city) || [],
    datasets: [
      {
        label: 'Revenue',
        data: geographicData?.cityPerformance?.map((city: any) => city.revenue) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Users',
        data: geographicData?.cityPerformance?.map((city: any) => city.users) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      }
    ],
  };

  const revenueSourceData = {
    labels: revenueAnalytics?.revenueBySource?.map((source: any) => source.source) || [],
    datasets: [
      {
        data: revenueAnalytics?.revenueBySource?.map((source: any) => source.revenue) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      }
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading Advanced Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Advanced analytics and insights for data-driven decisions</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
              
              {/* Export Button */}
              <button
                onClick={() => {
                  // Implement export functionality
                  console.log('Export analytics data');
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'revenue', name: 'Revenue', icon: IndianRupee },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'behavior', name: 'User Behavior', icon: MousePointer },
              { id: 'geographic', name: 'Geographic', icon: MapPin },
              { id: 'predictive', name: 'Predictive', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Metrics Banner */}
        {realTimeData && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Real-time Metrics</h2>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    <span className="text-sm opacity-90">Online Users: </span>
                    <span className="font-bold">{realTimeData.onlineUsers}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-sm opacity-90">Active Bookings: </span>
                    <span className="font-bold">{realTimeData.activeBookings}</span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="w-5 h-5 mr-2" />
                    <span className="text-sm opacity-90">Revenue Today: </span>
                    <span className="font-bold">{formatCurrency(realTimeData.revenueToday)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm">Live</span>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.revenue.total)}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+{metrics.revenue.growth}%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <IndianRupee className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.users.total)}</p>
                    <div className="flex items-center mt-2">
                      <UserCheck className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">{formatNumber(metrics.users.active)} active</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.bookings.total)}</p>
                    <div className="flex items-center mt-2">
                      <Target className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-sm text-blue-600">{metrics.bookings.conversionRate}% conversion</span>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active PGs</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.pgs.active)}</p>
                    <div className="flex items-center mt-2">
                      <Zap className="w-4 h-4 text-purple-500 mr-1" />
                      <span className="text-sm text-purple-600">{metrics.pgs.occupancyRate}% occupancy</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Home className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Bookings Trend</h3>
              <div className="h-80">
                <Line
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index' as const,
                      intersect: false,
                    },
                    scales: {
                      x: {
                        display: true,
                      },
                      y: {
                        type: 'linear' as const,
                        display: true,
                        position: 'left' as const,
                      },
                      y1: {
                        type: 'linear' as const,
                        display: true,
                        position: 'right' as const,
                        grid: {
                          drawOnChartArea: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
              <div className="h-80">
                <Bar
                  data={conversionFunnelData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && revenueAnalytics && (
          <div className="space-y-8">
            {/* Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gross Profit:</span>
                    <span className="font-semibold">{formatCurrency(revenueAnalytics.profitability.grossProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Operating Profit:</span>
                    <span className="font-semibold">{formatCurrency(revenueAnalytics.profitability.operatingProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Net Profit:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(revenueAnalytics.profitability.netProfit)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Margins</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gross Margin:</span>
                    <span className="font-semibold">{revenueAnalytics.profitability.margins.gross}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Operating Margin:</span>
                    <span className="font-semibold">{revenueAnalytics.profitability.margins.operating}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Net Margin:</span>
                    <span className="font-semibold text-green-600">{revenueAnalytics.profitability.margins.net}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Sources</h3>
                <div className="h-40">
                  <Doughnut
                    data={revenueSourceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Monthly Revenue Trend */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
              <div className="h-80">
                <Line
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index' as const,
                      intersect: false,
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Geographic Tab */}
        {activeTab === 'geographic' && geographicData && (
          <div className="space-y-8">
            {/* City Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">City Performance</h3>
              <div className="h-80">
                <Bar
                  data={cityPerformanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* City Performance Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Detailed City Metrics</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {geographicData.cityPerformance.map((city: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {city.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(city.users)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(city.bookings)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(city.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            {city.growth > 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className={city.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                              {city.growth > 0 ? '+' : ''}{city.growth}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Predictive Analytics Tab */}
        {activeTab === 'predictive' && predictiveData && (
          <div className="space-y-8">
            {/* Demand Forecast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Demand Forecast</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next Month:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatNumber(predictiveData.demandForecast.nextMonth)} bookings
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next Quarter:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatNumber(predictiveData.demandForecast.nextQuarter)} bookings
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Optimization</h3>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Price Elasticity:</span> {predictiveData.pricingOptimization.priceElasticity}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Optimization Opportunities:</span> {predictiveData.pricingOptimization.recommendedPrices.length} PGs
                  </div>
                </div>
              </div>
            </div>

            {/* Churn Prediction */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn Risk Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                    <div>
                      <p className="font-medium text-red-900">High-Risk Users Identified</p>
                      <p className="text-sm text-red-700">{predictiveData.churnPrediction.highRiskUsers.length} users at risk of churning</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Take Action
                  </button>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Interventions:</h4>
                  <ul className="space-y-2">
                    {predictiveData.churnPrediction.interventionSuggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
