import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Home, 
  Calendar, 
  IndianRupee, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  Shield,
  Bell,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Star,
  Flag,
  UserCheck,
  FileText,
  CreditCard,
  Gift,
  Target,
  Zap,
  Award
} from 'lucide-react';
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
import { adminAPI } from '../services/api';

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

// Force redeploy comment: 2025-07-12 12:00:00
interface AdminStats {
  totalUsers: number;
  totalPGs: number;
  pendingApprovals: number;
  revenue: number;
}

interface PGItem {
  id: string;
  name: string;
  location: string;
  status: string;
  price: number;
  images: string[];
  owner: string;
  createdAt: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface BookingItem {
  id: string;
  userId: string;
  pgId: string;
  userName: string;
  pgName: string;
  totalAmount: number;
  status: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'users' | 'bookings' | 'analytics' | 'approvals' | 'system'>('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPGs: 0,
    pendingApprovals: 0,
    revenue: 0
  });
  const [pgs, setPgs] = useState<PGItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [bookingStatusData, setBookingStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      try {
        const statsData = await adminAPI.getDashboardStats() as AdminStats;
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to load dashboard stats');
      }

      // Fetch PGs
      try {
        const pgsData = await adminAPI.getAllPGs(1, 10) as { pgs: PGItem[] };
        setPgs(pgsData.pgs || []);
      } catch (error) {
        console.error('Error fetching PGs:', error);
        toast.error('Failed to load PGs data');
      }

      // Fetch users
      try {
        const usersData = await adminAPI.getAllUsers(1, 10) as { users: UserItem[] };
        setUsers(usersData?.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users data');
        setUsers([]); // Set empty array on error
      }

      // Fetch bookings
      try {
        const bookingsData = await adminAPI.getAllBookings(1, 10) as { bookings: BookingItem[] };
        setBookings(bookingsData?.bookings || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings data');
        setBookings([]);
      }

      // Fetch system alerts
      try {
        const alertsData = await adminAPI.getSystemAlerts() as { alerts: SystemAlert[] };
        setSystemAlerts(alertsData?.alerts || []);
      } catch (error) {
        console.error('Error fetching system alerts:', error);
        // Don't show toast for alerts as it's not critical
        setSystemAlerts([]);
      }

      // Fetch analytics data
      try {
        const userAnalytics = await adminAPI.getUserAnalytics() as any;
        if (userAnalytics && userAnalytics.datasets && Array.isArray(userAnalytics.datasets)) {
          setUserGrowthData(userAnalytics);
        } else {
          console.error('Invalid user analytics data received:', userAnalytics);
          setUserGrowthData(null);
        }
      } catch (error) {
        console.error('Error fetching user analytics:', error);
        setUserGrowthData(null);
      }

      try {
        const revenueAnalytics = await adminAPI.getRevenueAnalytics() as any;
        if (revenueAnalytics && revenueAnalytics.datasets && Array.isArray(revenueAnalytics.datasets)) {
          setRevenueData(revenueAnalytics);
        } else {
          console.error('Invalid revenue analytics data received:', revenueAnalytics);
          setRevenueData(null);
        }
      } catch (error) {
        console.error('Error fetching revenue analytics:', error);
        setRevenueData(null);
      }

      try {
        const bookingAnalytics = await adminAPI.getBookingAnalytics() as any;
        if (bookingAnalytics && bookingAnalytics.datasets && Array.isArray(bookingAnalytics.datasets)) {
          setBookingStatusData(bookingAnalytics);
        } else {
          console.error('Invalid booking analytics data received:', bookingAnalytics);
          setBookingStatusData(null);
        }
      } catch (error) {
        console.error('Error fetching booking analytics:', error);
        setBookingStatusData(null);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePG = async (id: string) => {
    try {
      console.log(`Approving PG ${id}`);
      const response = await adminAPI.approvePG(id);
      console.log('Approve response:', response);
      
      toast.success('PG approved successfully');
      
      // Refresh PGs data
      const pgsData = await adminAPI.getAllPGs(1, 10) as { pgs: PGItem[] };
      setPgs(pgsData.pgs || []);
    } catch (error) {
      console.error('Error approving PG:', error);
      toast.error(`Failed to approve PG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRejectPG = async (id: string) => {
    try {
      const reason = prompt('Please provide a reason for rejection:');
      if (!reason || reason.trim() === '') {
        toast.error('Rejection reason is required');
        return;
      }
      
      console.log(`Rejecting PG ${id} with reason: ${reason}`);
      const response = await adminAPI.rejectPG(id, reason);
      console.log('Reject response:', response);
      
      toast.success('PG rejected successfully');
      
      // Refresh PGs data
      const pgsData = await adminAPI.getAllPGs(1, 10) as { pgs: PGItem[] };
      setPgs(pgsData.pgs || []);
    } catch (error) {
      console.error('Error rejecting PG:', error);
      toast.error(`Failed to reject PG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleToggleUserStatus = async (id: string) => {
    try {
      await adminAPI.toggleUserStatus(id);
      toast.success('User status updated successfully');
      // Refresh users data
      try {
        const usersData = await adminAPI.getAllUsers(1, 10) as { users: UserItem[] };
        setUsers(usersData?.users || []);
      } catch (refreshError) {
        console.error('Error refreshing users data:', refreshError);
        // Don't show another toast, just log the error
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await adminAPI.resolveAlert(id);
      toast.success('Alert resolved successfully');
      // Refresh alerts data
      const alertsData = await adminAPI.getSystemAlerts() as { alerts: SystemAlert[] };
      setSystemAlerts(alertsData.alerts || []);
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  const handleExportReport = async () => {
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ghar Admin Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-item { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
            .section { margin-bottom: 30px; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .date { color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Ghar Platform - Admin Report</h1>
            <p class="date">Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h2>Platform Statistics</h2>
            <div class="stats">
              <div class="stat-item">
                <h3>Total Users</h3>
                <p>${stats.totalUsers}</p>
              </div>
              <div class="stat-item">
                <h3>Total Properties</h3>
                <p>${stats.totalPGs}</p>
              </div>
              <div class="stat-item">
                <h3>Total Revenue</h3>
                <p>₹{stats.revenue !== undefined && stats.revenue !== null ? stats.revenue.toLocaleString() : '0'}</p>
              </div>
              <div class="stat-item">
                <h3>Pending Approvals</h3>
                <p>${stats.pendingApprovals}</p>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Recent PG Listings</h2>
            ${pgs.slice(0, 5).map(pg => `
              <div class="item">
                <h4>${pg.name}</h4>
                <p>Location: ${pg.location}</p>
                <p>Status: ${pg.status}</p>
                <p>Price: ₹${pg.price}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2>Recent Users</h2>
            ${users.slice(0, 5).map(user => `
              <div class="item">
                <h4>${user.name}</h4>
                <p>Email: ${user.email}</p>
                <p>Role: ${user.role}</p>
                <p>Status: ${user.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            `).join('')}
          </div>
        </body>
        </html>
      `;

      // Create and download PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }

      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to generate report');
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers !== undefined && stats.totalUsers !== null ? stats.totalUsers.toLocaleString() : '0'}</p>
              <p className="text-xs text-green-600 mt-1">Active platform users</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPGs}</p>
              <p className="text-xs text-blue-600 mt-1">{stats.pendingApprovals} pending approval</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Home className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.revenue !== undefined && stats.revenue !== null ? stats.revenue.toLocaleString() : '0'}</p>
              <p className="text-xs text-green-600 mt-1">Total earnings</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <IndianRupee className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-gray-900">98.5%</p>
              <p className="text-xs text-green-600 mt-1">All systems operational</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">User Growth</h3>
          {userGrowthData && userGrowthData.datasets && Array.isArray(userGrowthData.datasets) ? (
            <Line data={userGrowthData} options={{ responsive: true, maintainAspectRatio: false }} height={120} />
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500">Loading chart...</div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Booking Status</h3>
          {bookingStatusData && bookingStatusData.datasets && Array.isArray(bookingStatusData.datasets) ? (
            <Doughnut data={bookingStatusData} options={{ responsive: true, maintainAspectRatio: false }} height={120} />
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500">Loading chart...</div>
          )}
        </div>
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">System Alerts</h3>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {(systemAlerts && Array.isArray(systemAlerts) && systemAlerts.length > 0) ? systemAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                alert.type === 'error' ? 'bg-red-50' : 
                alert.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
              }`}>
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.resolved ? 'bg-green-500' : 
                  alert.type === 'error' ? 'bg-red-500' : 
                  alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.timestamp ? new Date(alert.timestamp).toLocaleString() : ''}</p>
                </div>
                {!alert.resolved && (
                  <button 
                    onClick={() => handleResolveAlert(alert.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                  >
                    Resolve
                  </button>
                )}
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No system alerts</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveTab('approvals')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="text-center">
                <CheckCircle className="w-6 h-6 mx-auto text-gray-600 mb-2" />
                <span className="text-sm font-medium">Approve Listings</span>
                <p className="text-xs text-gray-500">{stats.pendingApprovals} pending</p>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
            >
              <div className="text-center">
                <UserCheck className="w-6 h-6 mx-auto text-gray-600 mb-2" />
                <span className="text-sm font-medium">Manage Users</span>
                <p className="text-xs text-gray-500">{users.length} total</p>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
            >
              <div className="text-center">
                <BarChart3 className="w-6 h-6 mx-auto text-gray-600 mb-2" />
                <span className="text-sm font-medium">Analytics Report</span>
                <p className="text-xs text-gray-500">Generate</p>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors"
            >
              <div className="text-center">
                <MessageSquare className="w-6 h-6 mx-auto text-gray-600 mb-2" />
                <span className="text-sm font-medium">Manage Bookings</span>
                <p className="text-xs text-gray-500">{bookings.length} total</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage the entire platform</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex items-center text-green-600">
            <Activity className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">System Online</span>
          </div>
          <button 
            onClick={handleExportReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'listings', label: 'Property Listings', icon: Home },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'approvals', label: 'Approvals', icon: CheckCircle },
          { id: 'system', label: 'System', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      
      {activeTab === 'listings' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Property Listings</h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {(pgs && Array.isArray(pgs) && pgs.length > 0) ? (
              pgs.map((pg) => (
                <div key={pg.id} className="border border-gray-200 rounded-lg p-4 admin-card-container">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 overflow-hidden">
                    <div className="flex-1 min-w-0 admin-card-content">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{pg.name}</h3>
                        {getStatusBadge(pg.status)}
                      </div>
                      <p className="text-sm text-gray-600 truncate">Location: {pg.location}</p>
                      <p className="text-sm text-gray-600">Price: ₹{pg.price?.toLocaleString()}/month</p>
                      <p className="text-xs text-gray-500 truncate">Owner: {pg.owner}</p>
                    </div>
                    <div className="admin-action-buttons">
                      <button 
                        onClick={() => handleApprovePG(pg.id)}
                        className="admin-action-button flex items-center justify-center px-1.5 sm:px-2 py-1 sm:py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                        title="Approve PG"
                      >
                        <CheckCircle className="admin-button-icon w-3 h-3" />
                        <span className="hidden sm:inline ml-1">Approve</span>
                      </button>
                      <button 
                        onClick={() => handleRejectPG(pg.id)}
                        className="admin-action-button flex items-center justify-center px-1.5 sm:px-2 py-1 sm:py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                        title="Reject PG"
                      >
                        <XCircle className="admin-button-icon w-3 h-3" />
                        <span className="hidden sm:inline ml-1">Reject</span>
                      </button>
                      <button 
                        className="admin-action-button flex items-center justify-center p-1 sm:p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="admin-button-icon w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No property listings found</div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">User Management</h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="owner">Owners</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {(users && Array.isArray(users) && users.length > 0) ? (
              users.map((user) => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                        {getStatusBadge(user.isActive ? 'active' : 'inactive')}
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">{user.role}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      <p className="text-xs text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={`flex items-center px-2 py-1.5 rounded-md text-xs sm:text-sm whitespace-nowrap ${
                          user.isActive 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No users found</div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Booking Management</h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {(bookings && Array.isArray(bookings) && bookings.length > 0) ? (
              bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">Booking #{booking.id}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-gray-600">User: {booking.userName}</p>
                      <p className="text-sm text-gray-600">PG: {booking.pgName}</p>
                  <p className="text-sm text-gray-600">Amount: ₹{booking.totalAmount !== undefined && booking.totalAmount !== null ? booking.totalAmount.toLocaleString() : '0'}</p>
                      <p className="text-xs text-gray-500">
                        {booking.checkIn} to {booking.checkOut}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No bookings found</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-sm font-medium">Database</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Online</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-sm font-medium">Payment Gateway</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-sm font-medium">Email Service</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Running</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">75% Used</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Alerts</h2>
            <div className="space-y-4">
              {(systemAlerts && Array.isArray(systemAlerts) && systemAlerts.length > 0) ? systemAlerts.map((alert) => (
                <div key={alert.id} className={`border border-gray-200 rounded-lg p-4 ${
                  alert.resolved ? 'opacity-60' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.message}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          alert.type === 'error' ? 'bg-red-100 text-red-800' :
                          alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.type.toUpperCase()}
                        </span>
                        {alert.resolved && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">RESOLVED</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : ''}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <button 
                        onClick={() => handleResolveAlert(alert.id)}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No system alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Pending Approvals</h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option value="">All Types</option>
                <option value="pending">Pending PGs</option>
                <option value="rejected">Rejected PGs</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {(pgs && Array.isArray(pgs) && pgs.filter(pg => pg.status === 'pending').length > 0) ? (
              pgs.filter(pg => pg.status === 'pending').map((pg) => (
                <div key={pg.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{pg.name}</h3>
                        {getStatusBadge(pg.status)}
                      </div>
                      <p className="text-sm text-gray-600 truncate">Location: {pg.location}</p>
                  <p className="text-sm text-gray-600">Price: ₹{pg.price !== undefined && pg.price !== null ? pg.price.toLocaleString() : '0'}/month</p>
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(pg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleApprovePG(pg.id)}
                        className="flex items-center justify-center px-2 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs sm:text-sm whitespace-nowrap min-w-0"
                        title="Approve PG"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Approve</span>
                      </button>
                      <button 
                        onClick={() => handleRejectPG(pg.id)}
                        className="flex items-center justify-center px-2 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs sm:text-sm whitespace-nowrap min-w-0"
                        title="Reject PG"
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                      <button 
                        className="flex items-center justify-center p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
                        title="View Details"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No pending approvals</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
            {revenueData ? (
              <Bar data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} height={150} />
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-500">Loading chart...</div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Top Cities</h3>
              <div className="space-y-3">
                {['Indore', 'Mumbai', 'Delhi', 'Pune'].map((city, index) => (
                  <div key={city} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">{city}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${90 - index * 20}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{90 - index * 20}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Booking</span>
                  <span className="text-sm font-semibold">₹12,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Commission</span>
                  <span className="text-sm font-semibold">8.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Satisfaction</span>
                  <span className="text-sm font-semibold">4.6/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Repeat Rate</span>
                  <span className="text-sm font-semibold">35%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
