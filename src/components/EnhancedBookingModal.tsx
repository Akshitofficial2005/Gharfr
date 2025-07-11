import React, { useState, useEffect } from 'react';
import { Calendar, Clock, IndianRupee, Plus, Minus, ShoppingCart, FileText, CreditCard, Shield } from 'lucide-react';
import { EnhancedPG, RoomType, AccessoryOption, BookedAccessory } from '../types/enhanced';
import { useNotificationHelpers } from '../contexts/NotificationContext';
import { AnalyticsService } from '../services/analyticsService';

interface EnhancedBookingModalProps {
  pg: EnhancedPG;
  selectedRoomType: RoomType;
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirm: (bookingData: BookingData) => void;
}

interface BookingData {
  roomTypeId: string;
  checkInDate: string;
  checkOutDate?: string;
  selectedAccessories: BookedAccessory[];
  totalAmount: number;
  breakdown: {
    baseRent: number;
    securityDeposit: number;
    accessoriesRent: number;
    accessoriesDeposit: number;
    platformFee: number;
    gstAmount: number;
    total: number;
  };
}

interface AccessoryCartItem extends AccessoryOption {
  quantity: number;
}

const EnhancedBookingModal: React.FC<EnhancedBookingModalProps> = ({
  pg,
  selectedRoomType,
  isOpen,
  onClose,
  onBookingConfirm
}) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryCartItem[]>([]);
  const [bookingStep, setBookingStep] = useState<'details' | 'accessories' | 'payment'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'partial'>('full');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { showSuccess, showError } = useNotificationHelpers();

  useEffect(() => {
    if (isOpen) {
      // Set minimum check-in date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCheckInDate(tomorrow.toISOString().split('T')[0]);
      
      // Reset state
      setSelectedAccessories([]);
      setBookingStep('details');
      setAgreedToTerms(false);
      
      // Track booking modal open
      AnalyticsService.getInstance().track('booking_modal_opened', {
        propertyId: pg.id,
        roomType: selectedRoomType.type,
        baseRent: selectedRoomType.baseRent
      });
    }
  }, [isOpen, pg.id, selectedRoomType]);

  const addAccessory = (accessory: AccessoryOption) => {
    setSelectedAccessories(prev => {
      const existing = prev.find(item => item.id === accessory.id);
      if (existing) {
        return prev.map(item =>
          item.id === accessory.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...accessory, quantity: 1 }];
    });

    AnalyticsService.getInstance().track('accessory_added_to_cart', {
      propertyId: pg.id,
      accessoryId: accessory.id,
      accessoryName: accessory.name,
      monthlyRent: accessory.monthlyRent
    });
  };

  const removeAccessory = (accessoryId: string) => {
    setSelectedAccessories(prev => {
      const existing = prev.find(item => item.id === accessoryId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === accessoryId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== accessoryId);
    });
  };

  const calculateBreakdown = () => {
    const baseRent = selectedRoomType.baseRent;
    const securityDeposit = selectedRoomType.securityDeposit;
    
    const accessoriesRent = selectedAccessories.reduce(
      (sum, item) => sum + (item.monthlyRent * item.quantity), 0
    );
    const accessoriesDeposit = selectedAccessories.reduce(
      (sum, item) => sum + (item.securityDeposit * item.quantity), 0
    );
    
    const subtotal = baseRent + accessoriesRent;
    const platformFee = Math.round(subtotal * (pg.pricing.platformFee / 100));
    const gstAmount = Math.round((subtotal + platformFee) * (pg.pricing.gstPercentage / 100));
    
    const total = baseRent + accessoriesRent + securityDeposit + accessoriesDeposit + platformFee + gstAmount;
    
    return {
      baseRent,
      securityDeposit,
      accessoriesRent,
      accessoriesDeposit,
      platformFee,
      gstAmount,
      total
    };
  };

  const handleBookingConfirm = () => {
    const breakdown = calculateBreakdown();
    
    const bookingData: BookingData = {
      roomTypeId: selectedRoomType.id,
      checkInDate,
      selectedAccessories: selectedAccessories.map(item => ({
        accessoryId: item.id,
        name: item.name,
        monthlyRent: item.monthlyRent,
        securityDeposit: item.securityDeposit,
        startDate: checkInDate
      })),
      totalAmount: breakdown.total,
      breakdown
    };

    AnalyticsService.getInstance().track('booking_confirmed', {
      propertyId: pg.id,
      roomType: selectedRoomType.type,
      totalAmount: breakdown.total,
      accessoriesCount: selectedAccessories.length,
      paymentMethod
    });

    onBookingConfirm(bookingData);
    showSuccess('Booking Confirmed!', 'Your booking request has been submitted successfully.');
    onClose();
  };

  const breakdown = calculateBreakdown();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Book Your Room</h2>
            <p className="text-gray-600">{pg.name} • {selectedRoomType.type.charAt(0).toUpperCase() + selectedRoomType.type.slice(1)} Room</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center space-x-4">
            {['details', 'accessories', 'payment'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  bookingStep === step ? 'bg-primary-600 text-white' :
                  ['details', 'accessories', 'payment'].indexOf(bookingStep) > index ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium capitalize ${
                  bookingStep === step ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < 2 && <div className="w-8 h-0.5 bg-gray-200 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Booking Details */}
          {bookingStep === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                
                {/* Room Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Room Type</span>
                      <p className="font-medium capitalize">{selectedRoomType.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Capacity</span>
                      <p className="font-medium">{selectedRoomType.capacity} Person(s)</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Furnishing</span>
                      <p className="font-medium capitalize">{selectedRoomType.furnishing.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Available</span>
                      <p className="font-medium">{selectedRoomType.availableRooms} Rooms</p>
                    </div>
                  </div>
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Preferred Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Policies */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Important Policies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                    <div>Entry Timing: {pg.policies.entryTiming}</div>
                    <div>Guest Policy: {pg.policies.guestPolicy}</div>
                    <div>Smoking: {pg.policies.smokingAllowed ? 'Allowed' : 'Not Allowed'}</div>
                    <div>Pets: {pg.policies.petsAllowed ? 'Allowed' : 'Not Allowed'}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setBookingStep('accessories')}
                  disabled={!checkInDate}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Continue to Accessories
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Accessories */}
          {bookingStep === 'accessories' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Add Accessories (Optional)</h3>
                <p className="text-gray-600 mb-6">Enhance your stay with our furniture and appliance rental partners</p>
                
                {selectedRoomType.accessories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No accessories available for this room type</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {selectedRoomType.accessories.map((accessory) => {
                      const cartItem = selectedAccessories.find(item => item.id === accessory.id);
                      const quantity = cartItem?.quantity || 0;
                      
                      return (
                        <div key={accessory.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{accessory.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{accessory.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-green-600 font-medium">
                                  ₹{accessory.monthlyRent}/month
                                </span>
                                <span className="text-gray-500">
                                  ₹{accessory.securityDeposit} deposit
                                </span>
                                {accessory.partner && (
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    via {accessory.partner}
                                  </span>
                                )}
                              </div>
                            </div>
                            <img
                              src={accessory.image}
                              alt={accessory.name}
                              className="w-16 h-16 object-cover rounded ml-4"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => removeAccessory(accessory.id)}
                                disabled={quantity === 0}
                                className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{quantity}</span>
                              <button
                                onClick={() => addAccessory(accessory)}
                                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            {quantity > 0 && (
                              <span className="text-sm font-medium text-primary-600">
                                ₹{(accessory.monthlyRent * quantity).toLocaleString()}/month
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Selected Accessories Summary */}
                {selectedAccessories.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Selected Accessories</h4>
                    {selectedAccessories.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-600 ml-2">× {item.quantity}</span>
                        </div>
                        <span className="font-medium">₹{(item.monthlyRent * item.quantity).toLocaleString()}/month</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setBookingStep('details')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setBookingStep('payment')}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {bookingStep === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                
                {/* Cost Breakdown */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-3">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly Rent</span>
                      <span>₹{breakdown.baseRent.toLocaleString()}</span>
                    </div>
                    {breakdown.accessoriesRent > 0 && (
                      <div className="flex justify-between">
                        <span>Accessories Rent</span>
                        <span>₹{breakdown.accessoriesRent.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Security Deposit (Room)</span>
                      <span>₹{breakdown.securityDeposit.toLocaleString()}</span>
                    </div>
                    {breakdown.accessoriesDeposit > 0 && (
                      <div className="flex justify-between">
                        <span>Security Deposit (Accessories)</span>
                        <span>₹{breakdown.accessoriesDeposit.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Platform Fee ({pg.pricing.platformFee}%)</span>
                      <span>₹{breakdown.platformFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST ({pg.pricing.gstPercentage}%)</span>
                      <span>₹{breakdown.gstAmount.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span>₹{breakdown.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                  <h4 className="font-medium">Payment Option</h4>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="full"
                        checked={paymentMethod === 'full'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'full')}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Pay Full Amount</div>
                        <div className="text-sm text-gray-600">
                          Pay ₹{breakdown.total.toLocaleString()} now (Recommended)
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="partial"
                        checked={paymentMethod === 'partial'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'partial')}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Partial Payment</div>
                        <div className="text-sm text-gray-600">
                          Pay ₹{Math.round(breakdown.total * 0.3).toLocaleString()} now, rest on check-in
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:underline">Terms and Conditions</a>,{' '}
                      <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>, and{' '}
                      <a href="#" className="text-primary-600 hover:underline">Cancellation Policy</a>
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setBookingStep('accessories')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBookingConfirm}
                  disabled={!agreedToTerms}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedBookingModal;
