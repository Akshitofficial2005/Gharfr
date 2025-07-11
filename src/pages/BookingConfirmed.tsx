import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Home, Calendar, Phone } from 'lucide-react';

const BookingConfirmed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const bookingId = searchParams.get('bookingId');
    
    // Get payment details from localStorage
    const lastPayment = localStorage.getItem('lastPayment');
    if (lastPayment) {
      const payment = JSON.parse(lastPayment);
      setBookingDetails({
        ...payment,
        checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        nextDueDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        bookingId: bookingId || 'BK' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      });
      
      // Store booking in user profile
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      existingBookings.push({
        id: bookingId || 'BK' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        pgName: payment.pgName,
        roomType: payment.roomType,
        monthlyRent: payment.amount,
        checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextDueDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        paymentHistory: [{
          date: new Date().toISOString(),
          amount: payment.amount,
          type: 'booking',
          status: 'paid'
        }]
      });
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));
    }
  }, [searchParams]);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your payment has been processed successfully</p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium">{bookingDetails.bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-medium">{bookingDetails.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PG Name:</span>
              <span className="font-medium">{bookingDetails.pgName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Room Type:</span>
              <span className="font-medium">{bookingDetails.roomType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium text-green-600">₹{parseInt(bookingDetails.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in Date:</span>
              <span className="font-medium">{bookingDetails.checkInDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Next Due Date:</span>
              <span className="font-medium text-orange-600">{bookingDetails.nextDueDate}</span>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Your booking is confirmed and room is reserved</li>
            <li>• Check-in details will be shared 24 hours before your check-in date</li>
            <li>• Next rent payment due on {bookingDetails.nextDueDate}</li>
            <li>• You can pay rent in advance from your profile</li>
            <li>• SMS reminders will be sent before due dates</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Profile
          </button>
          
          <button
            onClick={() => window.print()}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </button>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm mb-2">
            Need help or have questions?
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

export default BookingConfirmed;