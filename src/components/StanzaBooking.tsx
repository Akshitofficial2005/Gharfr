import React, { useState } from 'react';
import { Calendar, Users, Home, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface StanzaBookingProps {
  pgId: string;
  pgName: string;
  pricePerMonth: number;
  availableRooms: number;
  onBookingSubmit: (bookingData: any) => void;
}

const StanzaBooking: React.FC<StanzaBookingProps> = ({
  pgId,
  pgName,
  pricePerMonth,
  availableRooms,
  onBookingSubmit
}) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    moveInDate: '',
    duration: '12', // months
    roomType: 'single',
    guests: 1,
    name: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const months = parseInt(bookingData.duration);
    const monthlyRent = pricePerMonth;
    const cautionMoney = pricePerMonth; // Caution money (refundable)
    const firstMonthRent = monthlyRent; // First month rent
    const total = cautionMoney + firstMonthRent; // Pay both upfront
    return { monthlyRent, cautionMoney, firstMonthRent, total, months };
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!bookingData.moveInDate) {
        toast.error('Please select move-in date');
        return;
      }
    }
    if (step === 2) {
      if (!bookingData.name || !bookingData.phone || !bookingData.email) {
        toast.error('Please fill all details');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBookNow = () => {
    const { monthlyRent, cautionMoney, firstMonthRent, total } = calculateTotal();
    
    onBookingSubmit({
      pgId,
      roomTypeId: bookingData.roomType,
      checkIn: bookingData.moveInDate,
      checkOut: new Date(new Date(bookingData.moveInDate).setMonth(
        new Date(bookingData.moveInDate).getMonth() + parseInt(bookingData.duration)
      )).toISOString().split('T')[0],
      guests: bookingData.guests,
      totalAmount: total,
      userDetails: {
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email
      }
    });
  };

  const { monthlyRent, cautionMoney, firstMonthRent, total } = calculateTotal();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h3 className="text-xl font-bold">Book Your Room</h3>
        <p className="text-blue-100 mt-1">Instant booking • No brokerage</p>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Select Room</span>
          <span>Your Details</span>
          <span>Payment</span>
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Room Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                When do you want to move in?
              </label>
              <input
                type="date"
                value={bookingData.moveInDate}
                onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Home className="w-4 h-4 inline mr-2" />
                How long will you stay?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['3', '6', '12'].map((months) => (
                  <button
                    key={months}
                    onClick={() => handleInputChange('duration', months)}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition ${
                      bookingData.duration === months
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {months === '12' ? '1 year' : `${months} months`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Users className="w-4 h-4 inline mr-2" />
                Room Type
              </label>
              <div className="space-y-3">
                {[
                  { id: 'single', name: 'Single Room', price: pricePerMonth },
                  { id: 'double', name: 'Double Sharing', price: pricePerMonth - 2000 },
                  { id: 'triple', name: 'Triple Sharing', price: pricePerMonth - 4000 }
                ].map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleInputChange('roomType', room.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      bookingData.roomType === room.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{room.name}</h4>
                        <p className="text-sm text-gray-600">Fully furnished</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{room.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">per month</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: User Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4">Your Details</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={bookingData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={bookingData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={bookingData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
              />
            </div>
          </div>
        )}

        {/* Step 3: Payment Summary */}
        {step === 3 && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Booking Summary</h4>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span>First Month Rent</span>
                <span>₹{firstMonthRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Caution Money (Refundable)</span>
                <span>₹{cautionMoney.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Duration</span>
                <span>{bookingData.duration === '12' ? '1 year' : `${bookingData.duration} months`}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Pay Today</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Next month rent due: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Zero Brokerage • Monthly Payment</span>
              </div>
              <div className="text-sm text-green-700 mt-2">
                Pay first month + caution money now. Monthly rent from your profile later.
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={handleNextStep}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleBookNow}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 flex items-center justify-center"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ₹{total.toLocaleString()} & Book Now
            </button>
          )}
        </div>

        {/* Available Rooms */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 inline text-green-500 mr-1" />
            {availableRooms} rooms available
          </p>
        </div>
      </div>
    </div>
  );
};

export default StanzaBooking;