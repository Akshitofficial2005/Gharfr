import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, MoreVertical, 
  Home, Users, DollarSign, Star, MapPin,
  ToggleLeft, ToggleRight, Search, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ownerAPIService } from '../services/ownerAPI';
import { ApiResponse } from '../types/api';

interface PGListing {
  id: string;
  name: string;
  location: string;
  totalRooms: number;
  occupiedRooms: number;
  monthlyRevenue: number;
  rating: number;
  status: 'active' | 'pending' | 'inactive';
  inquiries: number;
  bookings: number;
  images: string[];
  createdAt: string;
}

const ManageListings: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Check if owner is logged in
    const token = localStorage.getItem('ownerToken');
    if (!token) {
      toast.error('Please login to manage listings');
      navigate('/owner-login');
      return;
    }
    
    loadListings();
  }, [navigate]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await ownerAPIService.getMyPGs() as ApiResponse;
      if (response.success) {
        setListings(response.pgs.map((pg: any) => ({
          ...pg,
          images: pg.images || ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'],
          createdAt: pg.createdAt || '2024-01-15'
        })));
      }
    } catch (error) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (listingId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await ownerAPIService.updatePG(listingId, { pgType: 'boys' } as any);
      
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: newStatus as 'active' | 'pending' | 'inactive' }
          : listing
      ));
      
      toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update listing status');
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await ownerAPIService.deletePG(listingId);
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Home className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manage Listings</h1>
                <p className="text-sm text-gray-600">{listings.length} properties</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/list-pg')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New PG
              </button>
              
              <button
                onClick={() => navigate('/owner-dashboard')}
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by PG name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No listings found' : 'No listings yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by adding your first PG listing'}
            </p>
            <button
              onClick={() => navigate('/list-pg')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First PG
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto">
                    <img
                      src={listing.images[0]}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{listing.name}</h3>
                        <p className="text-gray-600 flex items-center mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {listing.location}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                            {listing.rating}
                          </span>
                          <span>Created: {new Date(listing.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Status & Actions */}
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                          listing.status === 'active' ? 'bg-green-100 text-green-800' :
                          listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.status}
                        </span>
                        
                        <div className="relative">
                          <button
                            onClick={() => setShowDropdown(showDropdown === listing.id ? null : listing.id)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {showDropdown === listing.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                              <button
                                onClick={() => {
                                  navigate(`/pg/${listing.id}`);
                                  setShowDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  // Navigate to edit page (to be implemented)
                                  toast('Edit functionality coming soon', { icon: 'ℹ️' });
                                  setShowDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Listing
                              </button>
                              <button
                                onClick={() => {
                                  handleStatusToggle(listing.id, listing.status);
                                  setShowDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                {listing.status === 'active' ? (
                                  <>
                                    <ToggleLeft className="w-4 h-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="w-4 h-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteListing(listing.id);
                                  setShowDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-gray-900">{listing.totalRooms}</p>
                        <p className="text-xs text-gray-600">Total Rooms</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{listing.occupiedRooms}</p>
                        <p className="text-xs text-gray-600">Occupied</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">₹{listing.monthlyRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Revenue</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-orange-600">{listing.inquiries}</p>
                        <p className="text-xs text-gray-600">Inquiries</p>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Occupancy: {Math.round((listing.occupiedRooms / listing.totalRooms) * 100)}%
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/pg/${listing.id}`)}
                          className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleStatusToggle(listing.id, listing.status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            listing.status === 'active'
                              ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          }`}
                        >
                          {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageListings;