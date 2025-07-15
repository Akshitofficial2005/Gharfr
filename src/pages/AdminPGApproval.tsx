import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { safeRenderLocation } from '../utils/locationUtils';
import { Check, X, Eye, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

interface PendingPG {
  _id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
  };
  images: string[];
  roomTypes: Array<{
    type: string;
    price: number;
    availableRooms: number;
  }>;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  isApproved: boolean;
  createdAt: string;
}

const AdminPGApproval: React.FC = () => {
  const [pendingPGs, setPendingPGs] = useState<PendingPG[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPG, setSelectedPG] = useState<PendingPG | null>(null);

  useEffect(() => {
    fetchPendingPGs();
  }, []);

  const fetchPendingPGs = async () => {
    try {
      console.log('Fetching pending PGs...');
      const response = await adminAPI.getAllPGs(1, 50, 'pending');
      console.log('PGs response:', response);
      setPendingPGs(response.pgs || []);
    } catch (error) {
      console.error('Error fetching pending PGs:', error);
      toast.error('Failed to fetch pending PGs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (pgId: string) => {
    try {
      await adminAPI.approvePG(pgId);
      toast.success('PG approved successfully!');
      fetchPendingPGs();
    } catch (error) {
      toast.error('Failed to approve PG');
    }
  };

  const handleReject = async (pgId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await adminAPI.rejectPG(pgId, reason);
      toast.success('PG rejected');
      fetchPendingPGs();
    } catch (error) {
      toast.error('Failed to reject PG');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PG Approval Dashboard</h1>
          <p className="text-gray-600 mt-2">Review and approve new PG listings</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Pending Approvals ({pendingPGs.length})</h2>
          </div>

          {pendingPGs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No pending PG approvals
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingPGs.map((pg) => (
                <div key={pg._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={pg.images[0]}
                          alt={pg.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{pg.name}</h3>
                          <p className="text-gray-600">{safeRenderLocation(pg.location)}</p>
                          <p className="text-sm text-gray-500">
                            Owner: {pg.owner.name} ({pg.owner.phone})
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Room Types:</span>
                          <div className="mt-1">
                            {pg.roomTypes.map((room, idx) => (
                              <div key={idx} className="text-sm">
                                {room.type}: ₹{room.price.toLocaleString()}/month ({room.availableRooms} available)
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Submitted:</span>
                          <div className="text-sm text-gray-900">
                            {new Date(pg.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{pg.description}</p>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedPG(pg)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleApprove(pg._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(pg._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PG Details Modal */}
      {selectedPG && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedPG.name}</h2>
                <button
                  onClick={() => setSelectedPG(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPG.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${selectedPG.name} ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Location:</strong> {safeRenderLocation(selectedPG.location)}</p>
                    <p><strong>Owner:</strong> {selectedPG.owner.name}</p>
                    <p><strong>Email:</strong> {selectedPG.owner.email}</p>
                    <p><strong>Phone:</strong> {selectedPG.owner.phone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{selectedPG.description}</p>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => {
                    handleApprove(selectedPG._id);
                    setSelectedPG(null);
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedPG._id);
                    setSelectedPG(null);
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPGApproval;