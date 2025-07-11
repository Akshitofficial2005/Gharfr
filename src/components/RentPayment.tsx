import React, { useState } from 'react';
import { Calendar, CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface RentPaymentProps {
  bookings: Array<{
    id: string;
    pgName: string;
    monthlyRent: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    nextDueDate?: string;
  }>;
}

const RentPayment: React.FC<RentPaymentProps> = ({ bookings }) => {
  const [payingRent, setPayingRent] = useState<string | null>(null);

  const handlePayRent = async (bookingId: string, amount: number) => {
    setPayingRent(bookingId);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Rent paid successfully!');
      
      // Update booking status (in real app, this would update the backend)
      // For demo, we'll just show success
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setPayingRent(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-orange-600 bg-orange-50 border-orange-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Rent Payments</h2>
        <div className="text-sm text-gray-600">
          {bookings.filter(b => b.status === 'pending').length} pending payments
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Bookings</h3>
          <p className="text-gray-600">You don't have any active PG bookings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const daysUntilDue = getDaysUntilDue(booking.dueDate);
            const isOverdue = daysUntilDue < 0;
            const isPaying = payingRent === booking.id;

            return (
              <div key={booking.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {booking.pgName}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Monthly Rent</p>
                        <p className="text-xl font-bold text-gray-900">
                          ₹{booking.monthlyRent.toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Due Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(booking.dueDate).toLocaleDateString()}
                        </p>
                        {!isOverdue && daysUntilDue <= 7 && (
                          <p className="text-sm text-orange-600">
                            {daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`}
                          </p>
                        )}
                        {isOverdue && (
                          <p className="text-sm text-red-600">
                            {Math.abs(daysUntilDue)} days overdue
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-2 capitalize">{booking.status}</span>
                        </div>
                      </div>
                    </div>

                    {booking.nextDueDate && booking.status === 'paid' && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">
                          Next payment due: <span className="font-medium">{new Date(booking.nextDueDate).toLocaleDateString()}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-6">
                    {booking.status === 'pending' || booking.status === 'overdue' ? (
                      <button
                        onClick={() => handlePayRent(booking.id, booking.monthlyRent)}
                        disabled={isPaying}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold transition ${
                          isOverdue 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isPaying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay ₹{booking.monthlyRent.toLocaleString()}
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Paid</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Rent is due on the same date every month</li>
          <li>• Late payments may incur additional charges</li>
          <li>• Payment receipts will be sent to your email</li>
          <li>• Contact support for any payment issues</li>
        </ul>
      </div>
    </div>
  );
};

export default RentPayment;