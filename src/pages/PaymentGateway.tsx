import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { RazorpayService } from '../services/razorpayService';
import { useAuth } from '../contexts/AuthContext';

const PaymentGateway: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const razorpayService = RazorpayService.getInstance();
  const [paymentData, setPaymentData] = useState({
    amount: searchParams.get('amount') || '0',
    pgName: searchParams.get('pgName') || '',
    roomType: searchParams.get('roomType') || '',
    bookingId: searchParams.get('bookingId') || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue payment');
      navigate('/login');
      return;
    }

    setProcessing(true);
    
    try {
      await razorpayService.initiatePayment({
        amount: parseInt(paymentData.amount),
        pgName: paymentData.pgName,
        bookingId: paymentData.bookingId,
        userDetails: {
          name: user.name,
          email: user.email,
          phone: user.phone || '9907002817'
        },
        onSuccess: (response: any) => {
          const paymentId = response.razorpay_payment_id;
          
          // Store payment details
          localStorage.setItem('lastPayment', JSON.stringify({
            paymentId,
            orderId: response.razorpay_order_id,
            amount: paymentData.amount,
            pgName: paymentData.pgName,
            roomType: paymentData.roomType,
            bookingId: paymentData.bookingId,
            timestamp: new Date().toISOString(),
            status: 'success',
            gateway: 'razorpay'
          }));
          
          toast.success('Payment successful!');
          navigate(`/booking-confirmed?paymentId=${paymentId}&bookingId=${paymentData.bookingId}`);
          setProcessing(false);
        },
        onFailure: (error: any) => {
          console.error('Payment failed:', error);
          toast.error(error.message || 'Payment failed. Please try again.');
          setProcessing(false);
        }
      });
    } catch (error: any) {
      toast.error(error.message || 'Payment initialization failed');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Complete Payment</h1>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900">{paymentData.pgName}</h3>
            <p className="text-gray-600">{paymentData.roomType} Room</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">₹{parseInt(paymentData.amount).toLocaleString()}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment via Razorpay</h2>
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <img 
              src="https://razorpay.com/assets/razorpay-logo.svg" 
              alt="Razorpay" 
              className="h-8"
            />
            <div>
              <p className="font-medium text-gray-900">Secure Payment Gateway</p>
              <p className="text-sm text-gray-600">Supports Cards, UPI, Net Banking, Wallets</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-2 border rounded">
              <span className="text-xs text-gray-600">Cards</span>
            </div>
            <div className="text-center p-2 border rounded">
              <span className="text-xs text-gray-600">UPI</span>
            </div>
            <div className="text-center p-2 border rounded">
              <span className="text-xs text-gray-600">Net Banking</span>
            </div>
            <div className="text-center p-2 border rounded">
              <span className="text-xs text-gray-600">Wallets</span>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Bank-Grade Security</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Powered by Razorpay - RBI approved payment gateway. 256-bit SSL encryption. PCI DSS compliant.
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-5 h-5 mr-2" />
              Pay ₹{parseInt(paymentData.amount).toLocaleString()} via Razorpay
            </>
          )}
        </button>

        {/* Support */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Need help? Contact Team Ghar at{' '}
            <a href="tel:9907002817" className="text-blue-600 font-medium">
              9907002817
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;