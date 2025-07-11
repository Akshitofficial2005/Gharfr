import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, CreditCard, AlertTriangle, CheckCircle, 
  Clock, Phone, ArrowLeft, Bell 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  pgName: string;
  roomType: string;
  monthlyRent: number;
  checkInDate: string;
  nextDueDate: string;
  status: 'active' | 'due' | 'overdue';
  paymentHistory: Array<{
    date: string;
    amount: number;
    type: string;
    status: string;
  }>;
}

const ManageSubscription: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    
    // Update booking status based on due dates
    const updatedBookings = userBookings.map((booking: Booking) => {
      const dueDate = new Date(booking.nextDueDate);
      const today = new Date();
      const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      let status: 'active' | 'due' | 'overdue' = 'active';
      if (daysDiff < 0) status = 'overdue';
      else if (daysDiff <= 5) status = 'due';
      
      return { ...booking, status };
    });
    
    setBookings(updatedBookings);
    setLoading(false);
  };

  const handlePayRent = (booking: Booking) => {
    const params = new URLSearchParams({
      amount: booking.monthlyRent.toString(),
      pgName: booking.pgName,
      roomType: booking.roomType,
      bookingId: booking.id,
      type: 'rent'
    });
    
    navigate(`/payment-gateway?${params.toString()}`);
  };

  const handleAdvancePayment = (booking: Booking) => {
    const params = new URLSearchParams({
      amount: booking.monthlyRent.toString(),
      pgName: booking.pgName,
      roomType: booking.roomType,
      bookingId: booking.id,
      type: 'advance'
    });
    
    navigate(`/payment-gateway?${params.toString()}`);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'due': return 'text-orange-600 bg-orange-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Subscription</h1>
              <p className="text-gray-600">View and manage your PG bookings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Active Bookings</h3>
            <p className="text-gray-600 mb-6">You don't have any active PG bookings yet.</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Find a PG
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => {
              const daysUntilDue = getDaysUntilDue(booking.nextDueDate);
              
              return (
                <div key={`${booking.id}_${index}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Status Banner */}
                  {booking.status === 'overdue' && (
                    <div className="bg-red-600 text-white px-6 py-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Payment Overdue - Please pay immediately</span>
                    </div>
                  )}
                  {booking.status === 'due' && (
                    <div className="bg-orange-500 text-white px-6 py-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Payment due in {daysUntilDue} days</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Booking Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{booking.pgName}</h3>
                        <p className="text-gray-600">{booking.roomType} Room</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{booking.monthlyRent.toLocaleString()}</p>
                        <p className="text-gray-600 text-sm">per month</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-in Date:</span>
                          <span className="font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Due Date:</span>
                          <span className={`font-medium ${booking.status === 'overdue' ? 'text-red-600' : booking.status === 'due' ? 'text-orange-600' : 'text-gray-900'}`}>
                            {new Date(booking.nextDueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Days Until Due:</span>
                          <span className={`font-medium ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                            {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Rent:</span>
                          <span className="font-medium">₹{booking.monthlyRent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Payment:</span>
                          <span className="font-medium">
                            {booking.paymentHistory.length > 0 
                              ? new Date(booking.paymentHistory[booking.paymentHistory.length - 1].date).toLocaleDateString()
                              : 'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking ID:</span>
                          <span className="font-medium text-sm">{booking.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      {booking.status === 'overdue' || booking.status === 'due' ? (
                        <button
                          onClick={() => handlePayRent(booking)}
                          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAdvancePayment(booking)}
                          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay in Advance
                        </button>
                      )}
                      
                      <button
                        onClick={() => toast('Payment history feature coming soon', { icon: 'ℹ️' })}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Payment History
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">SMS Reminders</span>
              <span className="text-green-600 text-sm">✓ Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Payment Due Alerts</span>
              <span className="text-green-600 text-sm">✓ 5 days before due date</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Overdue Notifications</span>
              <span className="text-green-600 text-sm">✓ Daily until payment</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            Notifications will be sent to your registered mobile number to ensure timely payments.
          </p>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm mb-2">
            Need help with payments or have questions?
          </p>
          <a
            href="tel:9907002817"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
          >
            <Phone className="w-4 h-4 mr-1" />
            Contact Team Ghar: 9907002817
          </a>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscription;