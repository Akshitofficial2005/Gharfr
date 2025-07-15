import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const SimplifiedAdminPanel: React.FC = () => {
  const [pgs, setPgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingPGs();
  }, []);

  const fetchPendingPGs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllPGs(1, 50, 'pending');
      setPgs(response.pgs || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching pending PGs:', err);
      setError('Failed to load pending PGs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (pgId: string) => {
    try {
      await adminAPI.approvePG(pgId);
      // Remove the approved PG from the list
      setPgs(pgs.filter(pg => pg.id !== pgId));
      alert('PG approved successfully!');
    } catch (err) {
      console.error('Error approving PG:', err);
      alert('Failed to approve PG. Please try again.');
    }
  };

  const handleReject = async (pgId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return; // User cancelled
    
    try {
      await adminAPI.rejectPG(pgId, reason);
      // Remove the rejected PG from the list
      setPgs(pgs.filter(pg => pg.id !== pgId));
      alert('PG rejected successfully!');
    } catch (err) {
      console.error('Error rejecting PG:', err);
      alert('Failed to reject PG. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchPendingPGs}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PG Approval Dashboard</h1>
        <button 
          onClick={() => navigate('/')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back to Home
        </button>
      </div>

      {pgs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Pending PGs</h2>
          <p className="text-gray-600">There are no PGs waiting for approval at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pgs.map(pg => (
            <div key={pg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{pg.name}</h2>
                <p className="text-gray-600 mb-4">{pg.description || 'No description provided'}</p>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Location</h3>
                  <p>{pg.location?.address || pg.location?.city || 'Unknown location'}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Price</h3>
                  <p>₹{pg.pricePerMonth || pg.price || 0} per month</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Contact</h3>
                  <p>{pg.contactNumber || 'No contact provided'}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Rooms</h3>
                  <p>Total: {pg.totalRooms || 0}, Available: {pg.availableRooms || 0}</p>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => handleApprove(pg.id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(pg.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimplifiedAdminPanel;