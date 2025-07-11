import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Minus, Calendar, CreditCard, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface Amenity {
  id: string;
  name: string;
  description: string;
  monthlyCharge: number;
  icon: string;
}

const BookingDetails: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [bookingData] = useState({
    pgName: searchParams.get('pgName') || '',
    roomType: searchParams.get('roomType') || '',
    basePrice: parseInt(searchParams.get('basePrice') || '0'),
    deposit: parseInt(searchParams.get('deposit') || '0')
  });

  const [selectedAmenities, setSelectedAmenities] = useState<{[key: string]: number}>({});
  const [checkInDate, setCheckInDate] = useState('');

  const availableAmenities: Amenity[] = [
    { id: 'ac', name: 'Air Conditioning', description: 'Personal AC in room', monthlyCharge: 2000, icon: '❄️' },
    { id: 'fridge', name: 'Mini Fridge', description: 'Personal refrigerator', monthlyCharge: 1500, icon: '🧊' },
    { id: 'wifi', name: 'Premium Wi-Fi', description: 'High-speed dedicated connection', monthlyCharge: 800, icon: '📶' },
    { id: 'laundry', name: 'Laundry Service', description: 'Weekly pickup/delivery', monthlyCharge: 1200, icon: '👔' },
    { id: 'cleaning', name: 'Room Cleaning', description: 'Daily housekeeping', monthlyCharge: 1000, icon: '🧹' },
    { id: 'gym', name: 'Gym Access', description: 'Fitness center access', monthlyCharge: 1500, icon: '💪' }
  ];

  useEffect(() => {
    // Check after a small delay to avoid immediate redirect during initial load
    const timer = setTimeout(() => {
      if (!user) {
        toast.error('Please login to continue booking');
        navigate('/login');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const updateAmenityQuantity = (amenityId: string, change: number) => {
    setSelectedAmenities(prev => {
      const current = prev[amenityId] || 0;
      const newQuantity = Math.max(0, current + change);
      
      if (newQuantity === 0) {
        const { [amenityId]: removed, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [amenityId]: newQuantity };
    });
  };

  const calculateTotal = () => {
    const amenitiesTotal = Object.entries(selectedAmenities).reduce((total, [amenityId, quantity]) => {
      const amenity = availableAmenities.find(a => a.id === amenityId);
      return total + (amenity?.monthlyCharge || 0) * quantity;
    }, 0);
    
    return {
      basePrice: bookingData.basePrice,
      amenitiesTotal,
      deposit: bookingData.deposit,
      total: bookingData.basePrice + amenitiesTotal + bookingData.deposit
    };
  };

  const handleProceedToPayment = () => {
    if (!user) {
      toast.error('Please login to continue booking');
      navigate('/login');
      return;
    }
    
    if (!checkInDate) {
      toast.error('Please select check-in date');
      return;
    }

    const total = calculateTotal();
    const bookingId = 'BK' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Store booking details for payment
    localStorage.setItem('pendingBooking', JSON.stringify({
      bookingId,
      pgName: bookingData.pgName,
      roomType: bookingData.roomType,
      checkInDate,
      selectedAmenities,
      pricing: total,
      userDetails: {
        name: user?.name,
        email: user?.email,
        phone: user?.phone
      }
    }));

    const params = new URLSearchParams({
      amount: total.total.toString(),
      pgName: bookingData.pgName,
      roomType: bookingData.roomType,
      bookingId
    });

    navigate(`/payment-gateway?${params.toString()}`);
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            title="Go back"
            aria-label="Go back to previous page"
            className="p-2 hover:bg-gray-100 rounded-lg mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
            <p className="text-gray-600">{bookingData.pgName} - {bookingData.roomType} Room</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Check-in Date */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Check-in Date
              </h3>
              <input
                type="date"
                id="checkInDate"
                name="checkInDate"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Additional Amenities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Amenities (Optional)
              </h3>
              <div className="space-y-4">
                {availableAmenities.map((amenity) => {
                  const quantity = selectedAmenities[amenity.id] || 0;
                  return (
                    <div key={amenity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{amenity.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{amenity.name}</h4>
                          <p className="text-sm text-gray-600">{amenity.description}</p>
                          <p className="text-sm font-medium text-blue-600">₹{amenity.monthlyCharge}/month</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateAmenityQuantity(amenity.id, -1)}
                          disabled={quantity === 0}
                          title="Decrease quantity"
                          aria-label={`Decrease ${amenity.name} quantity`}
                          className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => updateAmenityQuantity(amenity.id, 1)}
                          title="Increase quantity"
                          aria-label={`Increase ${amenity.name} quantity`}
                          className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="font-medium">₹{total.basePrice.toLocaleString()}</span>
                </div>
                
                {Object.entries(selectedAmenities).map(([amenityId, quantity]) => {
                  const amenity = availableAmenities.find(a => a.id === amenityId);
                  if (!amenity || quantity === 0) return null;
                  
                  return (
                    <div key={amenityId} className="flex justify-between text-sm">
                      <span className="text-gray-600">{amenity.name} × {quantity}</span>
                      <span>₹{(amenity.monthlyCharge * quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
                
                {total.amenitiesTotal > 0 && (
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-gray-600">Amenities Total</span>
                    <span className="font-medium">₹{total.amenitiesTotal.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-medium">₹{total.deposit.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹{total.total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  *First month rent + amenities + security deposit
                </p>
              </div>
              
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Payment
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                You can manage amenities from your profile after booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;