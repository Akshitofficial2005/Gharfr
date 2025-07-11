import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, MapPin, Star } from 'lucide-react';
import BookingCalendar from '../components/Booking/BookingCalendar';
import PaymentForm from '../components/Payment/PaymentForm';
import { apiService } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CompleteBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [pg, setPG] = useState<any>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<any>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/working-login');
      return;
    }
    loadPG();
  }, [id, isAuthenticated]);

  const loadPG = async () => {
    try {
      const response = await apiService.getPGById(id!);
      setPG(response.pg);
      if (response.pg.roomTypes.length > 0) {
        setSelectedRoomType(response.pg.roomTypes[0]);
      }
    } catch (error) {
      toast.error('Failed to load PG details');
      navigate('/');
    }
  };

  const handleDateSelect = (checkInDate: Date, checkOutDate: Date) => {
    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !selectedRoomType) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return selectedRoomType.price * nights;
  };

  const handleBookingSubmit = async () => {
    if (!checkIn || !checkOut || !selectedRoomType) {
      toast.error('Please select dates and room type');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        pgId: id,
        roomTypeId: selectedRoomType._id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        guestDetails: {
          name: user?.name,
          phone: user?.phone || '',
          email: user?.email
        }
      };

      const response = await apiService.createBooking(bookingData);
      setBooking(response.booking);
      setStep(3); // Move to payment step
      toast.success('Booking created! Please complete payment.');
    } catch (error: any) {
      toast.error(error.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    toast.success('Payment successful! Booking confirmed.');
    navigate(`/booking-confirmation/${booking._id}`);
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  if (!pg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                <span className={`ml-2 ${step >= stepNum ? 'text-blue-600' : 'text-gray-500'}`}>
                  {stepNum === 1 ? 'Select Dates' : stepNum === 2 ? 'Review Booking' : 'Payment'}
                </span>
                {stepNum < 3 && <div className="w-16 h-0.5 bg-gray-300 ml-4"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Dates</h2>
                
                {/* Room Type Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Room Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pg.roomTypes.map((room: any) => (
                      <div
                        key={room._id}
                        onClick={() => setSelectedRoomType(room)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedRoomType?._id === room._id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold capitalize">{room.type} Room</h4>
                            <p className="text-sm text-gray-600">{room.availableRooms} available</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-blue-600">₹{room.price.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">per month</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <BookingCalendar onDateSelect={handleDateSelect} />

                {/* Guests */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!checkIn || !checkOut || !selectedRoomType}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-semibold">{checkIn?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-semibold">{checkOut?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="font-semibold capitalize">{selectedRoomType?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-semibold">{guests}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBookingSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && booking && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h2>
                <PaymentForm
                  amount={calculateTotal()}
                  bookingId={booking._id}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            )}
          </div>

          {/* Sidebar - PG Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <img
                src={pg.images?.[0]?.url || '/placeholder-pg.jpg'}
                alt={pg.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{pg.name}</h3>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{pg.location.address}</span>
              </div>

              <div className="flex items-center mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-medium">{pg.rating?.overall || 4.0}</span>
                <span className="text-sm text-gray-500 ml-1">({pg.reviewCount || 0} reviews)</span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(pg.amenities || {})
                    .filter(([_, value]) => value)
                    .slice(0, 6)
                    .map(([key]) => (
                      <span
                        key={key}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize"
                      >
                        {key === 'wifi' ? 'Wi-Fi' : key}
                      </span>
                    ))}
                </div>
              </div>

              {checkIn && checkOut && selectedRoomType && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span>₹{selectedRoomType.price.toLocaleString()}/month</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteBooking;