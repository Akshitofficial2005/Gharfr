import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';

interface BookingCalendarProps {
  pgId: string;
  pricePerMonth: number;
  availableRooms: number;
  onBookingSubmit: (bookingData: {
    checkIn: Date;
    checkOut: Date;
    guests: number;
    roomType: string;
    specialRequests?: string;
  }) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  pgId,
  pricePerMonth,
  availableRooms,
  onBookingSubmit
}) => {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState('single');
  const [specialRequests, setSpecialRequests] = useState('');

  const calculateDuration = () => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    const days = calculateDuration();
    const dailyRate = pricePerMonth / 30; // Approximate daily rate
    return Math.round(dailyRate * days);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (checkOut <= checkIn) {
      alert('Check-out date must be after check-in date');
      return;
    }

    onBookingSubmit({
      checkIn,
      checkOut,
      guests,
      roomType,
      specialRequests: specialRequests.trim() || undefined
    });
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6); // 6 months ahead

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2" />
        Book Your Stay
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date
            </label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Select check-in date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              dateFormat="MMM dd, yyyy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date
            </label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              minDate={checkIn || minDate}
              maxDate={maxDate}
              placeholderText="Select check-out date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              dateFormat="MMM dd, yyyy"
            />
          </div>
        </div>

        {/* Guests and Room Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">Single Room</option>
              <option value="double">Double Room</option>
              <option value="triple">Triple Room</option>
            </select>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests (Optional)
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any special requests or requirements..."
          />
        </div>

        {/* Booking Summary */}
        {checkIn && checkOut && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-gray-900">Booking Summary</h4>
            <div className="flex justify-between text-sm">
              <span>Duration:</span>
              <span>{calculateDuration()} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Daily Rate:</span>
              <span>₹{Math.round(pricePerMonth / 30).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Guests:</span>
              <span>{guests}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Room Type:</span>
              <span className="capitalize">{roomType}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Availability Info */}
        <div className="flex items-center text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
          {availableRooms} rooms available
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!checkIn || !checkOut || availableRooms === 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 ${
            !checkIn || !checkOut || availableRooms === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {availableRooms === 0 ? 'No Rooms Available' : 'Book Now'}
        </button>
      </form>
    </div>
  );
};

export default BookingCalendar;
