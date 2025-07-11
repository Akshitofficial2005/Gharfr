import React, { useState, useEffect } from 'react';
// Mock chart components for compilation
const BarChart = ({ children, ...props }: any) => <div className="w-full h-64 bg-gray-100 flex items-center justify-center">Bar Chart</div>;
const LineChart = ({ children, ...props }: any) => <div className="w-full h-64 bg-gray-100 flex items-center justify-center">Line Chart</div>;
const PieChart = ({ children, ...props }: any) => <div className="w-full h-64 bg-gray-100 flex items-center justify-center">Pie Chart</div>;
const Bar = (props: any) => null;
const Line = (props: any) => null;
const Pie = (props: any) => null;
const Cell = (props: any) => null;
const XAxis = (props: any) => null;
const YAxis = (props: any) => null;
const CartesianGrid = (props: any) => null;
const Tooltip = (props: any) => null;
import { TrendingUp, Users, BookOpen, DollarSign, Eye, Clock } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 1250,
    totalBookings: 340,
    totalRevenue: 850000,
    avgBookingValue: 12500,
    conversionRate: 3.2,
    pageViews: 15600
  });

  const bookingTrends = [
    { month: 'Jan', bookings: 45, revenue: 112500 },
    { month: 'Feb', bookings: 52, revenue: 130000 },
    { month: 'Mar', bookings: 48, revenue: 120000 },
    { month: 'Apr', bookings: 61, revenue: 152500 },
    { month: 'May', bookings: 55, revenue: 137500 },
    { month: 'Jun', bookings: 67, revenue: 167500 }
  ];

  const cityData = [
    { name: 'Indore', bookings: 120, color: '#8884d8' },
    { name: 'Mumbai', bookings: 85, color: '#82ca9d' },
    { name: 'Delhi', bookings: 75, color: '#ffc658' },
    { name: 'Bangalore', bookings: 60, color: '#ff7300' }
  ];

  const performanceMetrics = [
    { metric: 'Page Load Time', value: '1.2s', trend: 'down', good: true },
    { metric: 'API Response Time', value: '245ms', trend: 'down', good: true },
    { metric: 'Error Rate', value: '0.8%', trend: 'down', good: true },
    { metric: 'Uptime', value: '99.9%', trend: 'up', good: true }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+8% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{(analytics.totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+15% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+0.3% from last month</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
            <LineChart width={500} height={300} data={bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Revenue by Month</h3>
            <BarChart width={500} height={300} data={bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`₹${(value / 1000).toFixed(0)}K`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>

        {/* City Distribution & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Bookings by City</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={cityData}
                cx={200}
                cy={150}
                outerRadius={80}
                dataKey="bookings"
                label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
              >
                {cityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="text-sm font-medium">{metric.metric}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-bold ${metric.good ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.value}
                    </span>
                    <TrendingUp className={`w-4 h-4 ml-2 ${metric.good ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;