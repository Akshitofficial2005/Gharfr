import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, Shield, Clock, AlertCircle, CheckCircle, 
  Download, ArrowLeft, Calculator, Info 
} from 'lucide-react';
import { paymentService, PaymentBreakdown, PaymentOption, PaymentRequest } from '../services/paymentService';
import { mockBookings, mockEnhancedPGs } from '../data/enhancedMockData';
import { Booking, EnhancedPG } from '../types/enhanced';
import { useNotificationHelpers } from '../contexts/NotificationContext';
import { AnalyticsService } from '../services/analyticsService';

const Payment: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotificationHelpers();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [pgDetails, setPgDetails] = useState<EnhancedPG | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [breakdown, setBreakdown] = useState<PaymentBreakdown | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    if (bookingId) {
      // Load booking details
      const bookingData = mockBookings.find(b => b.id === bookingId);
      if (bookingData) {
        setBooking(bookingData);
        
        // Load PG details
        const pgData = mockEnhancedPGs.find(pg => pg.id === bookingData.pgId);
        if (pgData) {
          setPgDetails(pgData);
        }
        
        // Calculate payment breakdown
        const accessoryTotal = bookingData.accessories?.reduce((sum, acc) => sum + acc.monthlyRent, 0) || 0;
        const totalAmount = bookingData.monthlyRent + accessoryTotal + bookingData.platformFee + bookingData.gstAmount;
        const paymentBreakdown = paymentService.calculateBreakdown(
          bookingData.monthlyRent,
          accessoryTotal
        );
        setBreakdown(paymentBreakdown);
      }

      // Load payment options
      setPaymentOptions(paymentService.getPaymentOptions());

      // Track page view
      AnalyticsService.getInstance().track('payment_page_viewed', {
        bookingId
      });
    }
  }, [bookingId]);

  const handlePaymentMethodSelect = (optionId: string) => {
    setSelectedPaymentMethod(optionId);
    
    if (breakdown && booking) {
      const option = paymentOptions.find(opt => opt.id === optionId);
      const processingFee = option?.processingFee 
        ? Math.round((breakdown.total * option.processingFee) / 100)
        : 0;

      const updatedBreakdown: PaymentBreakdown = {
        ...breakdown,
        processingFee,
        total: breakdown.total - breakdown.processingFee + processingFee
      };

      setBreakdown(updatedBreakdown);
    }

    AnalyticsService.getInstance().track('payment_method_selected', {
      bookingId,
      method: optionId
    });
  };

  const handlePayment = async () => {
    if (!booking || !breakdown || !selectedPaymentMethod || !agreeToTerms) {
      showError('Validation Error', 'Please complete all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      const paymentRequest: PaymentRequest = {
        bookingId: booking.id,
        studentId: booking.studentId,
        pgId: booking.pgId,
        amount: breakdown.total,
        breakdown,
        paymentMethod: selectedPaymentMethod,
        description: `Booking payment for PG Room`
      };

      const response = await paymentService.initiateRazorpayPayment(paymentRequest);

      if (response.success) {
        showSuccess('Payment Successful', response.message);
        
        // Navigate to booking confirmation
        navigate(`/booking/${booking.id}?payment_success=true`);
      } else {
        showError('Payment Failed', response.message);
      }
    } catch (error) {
      showError('Payment Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!booking || !breakdown || !pgDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Booking
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600 mt-2">Secure payment for your PG booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Booking Summary */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{pgDetails?.name || 'PG Accommodation'}</h3>
                      <p className="text-sm text-gray-600">
                        {pgDetails?.roomTypes.find(rt => rt.id === booking.roomTypeId)?.type || 'Room'}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{breakdown.baseRent.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Check-in:</span>
                      <span className="ml-2 font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Monthly Rent:</span>
                      <span className="ml-2 font-medium">₹{booking.monthlyRent.toLocaleString()}</span>
                    </div>
                  </div>

                  {booking.accessories && booking.accessories.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-900 mb-2">Add-ons:</p>
                      {booking.accessories.map((accessory, index) => (
                        <div key={`${accessory.accessoryId}-${index}`} className="flex justify-between text-sm">
                          <span className="text-gray-600">{accessory.name}</span>
                          <span className="font-medium">₹{accessory.monthlyRent}/month</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {paymentOptions.filter(opt => opt.enabled).map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handlePaymentMethodSelect(option.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPaymentMethod === option.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{option.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{option.name}</p>
                            {option.processingFee && option.processingFee > 0 && (
                              <p className="text-sm text-gray-600">
                                Processing fee: {option.processingFee}%
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {option.processingFee === 0 && (
                            <span className="text-green-600 text-sm font-medium mr-3">Free</span>
                          )}
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod === option.id
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedPaymentMethod === option.id && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-8">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 mr-3 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary-600 hover:text-primary-700">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary-600 hover:text-primary-700">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || !agreeToTerms || isProcessing}
                className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-3" />
                    Pay ₹{breakdown.total.toLocaleString()}
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-green-800 font-medium">100% Secure Payment</p>
                    <p className="text-green-700">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Breakdown</h3>
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <Calculator className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Rent</span>
                  <span className="font-medium">₹{breakdown.baseRent.toLocaleString()}</span>
                </div>
                
                {breakdown.accessoryCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Add-on Services</span>
                    <span className="font-medium">₹{breakdown.accessoryCharges.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">₹{breakdown.platformFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{breakdown.gst.toLocaleString()}</span>
                </div>

                {breakdown.processingFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-medium">₹{breakdown.processingFee.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">₹{breakdown.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-blue-800 font-medium">Payment Schedule</p>
                    <p className="text-blue-700">
                      Monthly rent will be auto-debited on the 1st of each month.
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund Policy */}
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium mb-1">Refund Policy:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Full refund if cancelled within 24 hours</li>
                  <li>• 50% refund if cancelled 7 days before check-in</li>
                  <li>• No refund after check-in</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
