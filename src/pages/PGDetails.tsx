import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PG, Review } from '../types';
import { mockPGs, mockReviews } from '../data/mockData';
import { amenitiesAPI } from '../services/api';
import { socketService } from '../utils/socket';
import { useAuth } from '../contexts/AuthContext';
import { bookingAPI } from '../services/api';
import { AnalyticsService } from '../services/analyticsService';
import StanzaBooking from '../components/StanzaBooking';
import ExtraAmenities from '../components/ExtraAmenities';
import { PGDetailsSkeleton, ReviewSkeleton, LoadingSpinner } from '../components/Skeletons';
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Shield,
  Zap,
  Phone,
  Mail,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
} from 'lucide-react';

const PGDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [pg, setPG] = useState<PG | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<{[key: string]: number}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeAmenities, setActiveAmenities] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const foundPG = mockPGs.find(p => p.id === id);
        if (foundPG) {
          setPG(foundPG);
          setSelectedRoomType(foundPG.roomTypes[0]?.id || '');
          setReviews(mockReviews.filter(r => r.pgId === id));
          
          // Get active amenities
          amenitiesAPI.getActiveAmenities().then((amenities: any[]) => {
            setActiveAmenities(amenities);
          });
          
          // Track property view
          AnalyticsService.getInstance().trackPropertyView(foundPG.id, foundPG.name);
        } else {
          navigate('/404');
        }
        setIsLoading(false);
      }, 1000);
    }
    
    // Connect to socket for real-time updates
    const socket = socketService.connect();
    
    // Listen for amenity updates
    socketService.on('amenityUpdate', (updatedAmenity) => {
      setActiveAmenities(prev => 
        prev.map(amenity => 
          amenity.id === updatedAmenity._id ? updatedAmenity : amenity
        ).filter(amenity => amenity.isActive)
      );
    });
    
    // Listen for PG status updates
    socketService.on('pgStatusUpdate', (update) => {
      if (update.pgId === id && !update.isActive) {
        navigate('/');
      }
    });
    
    return () => {
      socketService.off('amenityUpdate');
      socketService.off('pgStatusUpdate');
    };
  }, [id, navigate]);

  if (isLoading) {
    return <PGDetailsSkeleton />;
  }

  if (!pg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">PG Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const selectedRoom = pg.roomTypes.find(room => room.id === selectedRoomType);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-5 w-5" />;
      case 'parking':
        return <Car className="h-5 w-5" />;
      case 'food':
        return <Utensils className="h-5 w-5" />;
      case 'gym':
        return <Dumbbell className="h-5 w-5" />;
      case 'security':
        return <Shield className="h-5 w-5" />;
      case 'powerBackup':
        return <Zap className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % pg.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + pg.images.length) % pg.images.length);
  };

  const handleBooking = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/pg/${id}` } } });
      return;
    }
    
    // Track booking start
    if (pg) {
      AnalyticsService.getInstance().trackBookingStart(pg.id);
    }
    setShowBookingModal(true);
  };

  const handleFavoriteToggle = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    
    // Track favorite action
    if (pg) {
      AnalyticsService.getInstance().trackPropertyFavorite(
        pg.id, 
        newFavoriteStatus ? 'add' : 'remove'
      );
    }
  };

  const handleContactAction = (method: 'call' | 'whatsapp' | 'email') => {
    if (pg) {
      AnalyticsService.getInstance().trackPropertyContact(pg.id, method);
    }
  };

  const handleBookingSubmit = async (bookingData: any) => {
    try {
      if (!user) {
        toast.error('Please login to book');
        navigate('/login');
        return;
      }

      // Calculate total amount including extra amenities
      const basePrice = selectedRoom?.price || 0;
      const extraAmenitiesTotal = Object.entries(selectedAmenities).reduce((total, [amenityName, quantity]) => {
        const amenity = activeAmenities?.find((a: any) => a.name === amenityName);
        return total + (amenity?.monthlyCharge || 0) * quantity;
      }, 0);
      
      const totalAmount = basePrice + extraAmenitiesTotal;

      // Mock successful booking for demo
      const response = {
        data: {
          _id: 'booking_' + Date.now(),
          pgId: pg?.id || '',
          totalAmount: bookingData.totalAmount || totalAmount,
          status: 'confirmed'
        }
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShowBookingModal(false);
      toast.success('Booking created successfully!');
      navigate(`/payment/${response.data._id}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pg.name,
          text: pg.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={pg.images[currentImageIndex]}
          alt={pg.name}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {pg.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {pg.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-full ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
            } hover:bg-opacity-90 transition-colors`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white text-gray-700 hover:bg-opacity-90 transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{pg.name}</h1>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{pg.rating}</span>
                  <span className="text-gray-500">({pg.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{pg.location.address}, {pg.location.city}, {pg.location.state} - {pg.location.pincode}</span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{pg.description}</p>
              
              {/* Book Now Button - Moved to top */}
              {selectedRoom && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {selectedRoom.type} Room - ₹{selectedRoom.price.toLocaleString()}/month
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedRoom.availableRooms} rooms available
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (!selectedRoom) {
                          toast.error('Please select a room type first');
                          return;
                        }
                        
                        if (!user) {
                          toast.error('Please login to book this PG');
                          navigate('/login');
                          return;
                        }
                        
                        // Calculate total amount (first month + security deposit)
                        const totalAmount = selectedRoom.price + selectedRoom.deposit + 
                          Object.entries(selectedAmenities).reduce((total, [amenityName, quantity]) => {
                            const amenity = activeAmenities?.find((a: any) => a.name === amenityName);
                            return total + (amenity?.monthlyCharge || 0) * quantity;
                          }, 0);
                        
                        // Redirect to booking details page
                        const params = new URLSearchParams({
                          pgName: pg?.name || '',
                          roomType: selectedRoom.type,
                          basePrice: selectedRoom.price.toString(),
                          deposit: selectedRoom.deposit.toString()
                        });
                        
                        navigate(`/booking-details?${params.toString()}`);
                      }}
                      disabled={selectedRoom.availableRooms === 0}
                      className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {selectedRoom.availableRooms === 0 ? 'No Rooms Available' : 'Book Now'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(pg.amenities)
                  .filter(([_, value]) => value)
                  .map(([key, _]) => (
                    <div key={key} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                      {getAmenityIcon(key)}
                      <span className="text-sm font-medium capitalize">
                        {key === 'wifi' ? 'Wi-Fi' : 
                         key === 'ac' ? 'AC' : 
                         key === 'powerBackup' ? 'Power Backup' : 
                         key}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            {/* Room Types */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Room Types & Pricing</h2>
              <div className="space-y-4">
                {pg.roomTypes.map(room => (
                  <div
                    key={room.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRoomType === room.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRoomType(room.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold capitalize">{room.type} Room</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {room.availableRooms}/{room.totalRooms} available
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {room.amenities.map(amenity => (
                            <span
                              key={amenity}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">₹{room.price.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">/month</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Deposit: ₹{room.deposit.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">House Rules</h2>
              <ul className="space-y-2">
                {pg.rules.map((rule, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-start space-x-3">
                        <img
                          src={review.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{review.userName}</h4>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-1">{review.comment}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
              {selectedRoom && (
                <>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 capitalize">
                      {selectedRoom.type} Room
                    </h3>
                    <div className="text-3xl font-bold text-primary-600 mt-1">
                      ₹{selectedRoom.price.toLocaleString()}
                      <span className="text-lg text-gray-600 font-normal">/month</span>
                    </div>
                    {Object.keys(selectedAmenities).length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm text-gray-600">Extra amenities:</div>
                        <div className="text-lg font-semibold text-orange-600">
                          +₹{Object.entries(selectedAmenities).reduce((total, [amenityName, quantity]) => {
                            const amenity = activeAmenities?.find((a: any) => a.name === amenityName);
                            return total + (amenity?.monthlyCharge || 0) * quantity;
                          }, 0).toLocaleString()}/month
                        </div>
                        <div className="text-xl font-bold text-gray-900 border-t pt-2 mt-2">
                          Total: ₹{(selectedRoom.price + Object.entries(selectedAmenities).reduce((total, [amenityName, quantity]) => {
                            const amenity = activeAmenities?.find((a: any) => a.name === amenityName);
                            return total + (amenity?.monthlyCharge || 0) * quantity;
                          }, 0)).toLocaleString()}/month
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Security Deposit: ₹{selectedRoom.deposit.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available Rooms:</span>
                      <span className="font-medium">{selectedRoom.availableRooms}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Room Type:</span>
                      <span className="font-medium capitalize">{selectedRoom.type}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Support</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{pg.ownerName}</p>
                    <p className="text-sm text-gray-600">Ghar Support Team</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">9907002817</span>
                </div>
                <a 
                  href="tel:9907002817"
                  onClick={() => handleContactAction('call')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors block text-center"
                >
                  Contact Support: 9907002817
                </a>
              </div>
            </div>

            {/* Google Map */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
              <div className="relative">
              <div 
                className="h-48 rounded-lg overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center relative border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                onClick={() => {
                  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pg.location.address + ', Indore, Madhya Pradesh')}`;
                  window.open(mapUrl, '_blank');
                }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">View on Google Maps</h4>
                  <p className="text-sm text-gray-600">Click to open location</p>
                </div>
                <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {pg.location.address}, Indore, Madhya Pradesh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Book Your Room</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <StanzaBooking 
                pgId={pg?.id || ''}
                pgName={pg?.name || ''}
                pricePerMonth={pg?.roomTypes.find(rt => rt.id === selectedRoomType)?.price || 0}
                availableRooms={pg?.roomTypes.find(rt => rt.id === selectedRoomType)?.availableRooms || 0}
                onBookingSubmit={handleBookingSubmit}
              />
              
              {/* Extra Amenities Selection */}
              {activeAmenities && activeAmenities.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Additional Amenities
                  </h4>
                  <div className="max-h-60 overflow-y-auto">
                    <ExtraAmenities 
                      amenities={activeAmenities}
                      selectedAmenities={selectedAmenities}
                      onAmenityChange={setSelectedAmenities}
                    />
                  </div>
                  
                  {Object.keys(selectedAmenities).length > 0 && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-md">
                      <div className="text-xs font-medium text-blue-900 mb-1">
                        Selected Amenities:
                      </div>
                      {Object.entries(selectedAmenities).map(([amenityName, quantity]) => {
                        const amenity = activeAmenities.find(a => a.name === amenityName);
                        if (!amenity || quantity === 0) return null;
                        return (
                          <div key={amenityName} className="flex justify-between text-xs text-blue-800">
                            <span>{amenityName} × {quantity}</span>
                            <span>₹{(amenity.monthlyCharge * quantity).toLocaleString()}/mo</span>
                          </div>
                        );
                      })}
                      <div className="border-t border-blue-200 mt-1 pt-1 flex justify-between font-medium text-xs text-blue-900">
                        <span>Total Extra:</span>
                        <span>
                          ₹{Object.entries(selectedAmenities).reduce((total, [amenityName, quantity]) => {
                            const amenity = activeAmenities.find(a => a.name === amenityName);
                            return total + (amenity?.monthlyCharge || 0) * quantity;
                          }, 0).toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PGDetails;