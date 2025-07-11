import React, { useState, useEffect } from 'react';
import { Plus, Home, Users, DollarSign, Calendar, MessageSquare, Settings, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnerDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPGs: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  });
  const [pgs, setPGs] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, pgsRes, bookingsRes] = await Promise.all([
        fetch('/api/owner/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/owner/pgs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/owner/bookings', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (pgsRes.ok) {
        const pgsData = await pgsRes.json();
        setPGs(pgsData.pgs || []);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setRecentBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your properties and bookings</p>
          </div>
          <Link
            to="/owner/add-pg"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New PG
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPGs}</p>
              </div>
              <Home className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <Users className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.occupancyRate}%</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Properties List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
            </div>
            <div className="p-6">
              {pgs.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No properties added yet</p>
                  <Link
                    to="/owner/add-pg"
                    className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
                  >
                    Add your first property
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {pgs.slice(0, 5).map((pg: any) => (
                    <div key={pg._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={pg.images?.[0] || '/placeholder-pg.jpg'}
                          alt={pg.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{pg.name}</h3>
                          <p className="text-sm text-gray-600">{pg.location?.city}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              pg.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {pg.isApproved ? 'Approved' : 'Pending'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {pg.bookingCount || 0} bookings
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/pg/${pg._id}`}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/owner/pg/${pg._id}/edit`}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                          <Settings className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            </div>
            <div className="p-6">
              {recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.slice(0, 5).map((booking: any) => (
                    <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.guestName}</h3>
                        <p className="text-sm text-gray-600">{booking.pgName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{booking.totalAmount?.toLocaleString()}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/owner/bookings"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Bookings</h3>
                <p className="text-sm text-gray-600">View and manage all bookings</p>
              </div>
            </div>
          </Link>

          <Link
            to="/owner/messages"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <MessageSquare className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">Chat with guests</p>
              </div>
            </div>
          </Link>

          <Link
            to="/owner/analytics"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <DollarSign className="w-8 h-8 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View earnings and insights</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;