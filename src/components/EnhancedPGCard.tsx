import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnhancedPG } from '../types/enhanced';
import { AnalyticsService } from '../services/analyticsService';
import { safeRenderLocation } from '../utils/locationUtils';
import { 
  MapPin, Star, Wifi, Car, Utensils, Dumbbell, Shield, Zap, 
  Heart, Phone, MessageCircle, Eye, Users, Home, GraduationCap,
  CheckCircle, Clock, IndianRupee
} from 'lucide-react';

interface EnhancedPGCardProps {
  pg: EnhancedPG;
  userLocation?: { lat: number; lng: number };
}

const EnhancedPGCard: React.FC<EnhancedPGCardProps> = ({ pg, userLocation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      case 'meals': return <Utensils className="h-4 w-4" />;
      case 'gym': return <Dumbbell className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'powerBackup': return <Zap className="h-4 w-4" />;
      default: return null;
    }
  };

  const getMinPrice = () => {
    return Math.min(...pg.roomTypes.map(room => room.baseRent));
  };

  const getTotalAvailableRooms = () => {
    return pg.roomTypes.reduce((total, room) => total + room.availableRooms, 0);
  };

  const getNearestCollege = () => {
    if (pg.location.nearbyColleges.length === 0) return null;
    return pg.location.nearbyColleges.reduce((nearest, college) => 
      college.distance < nearest.distance ? college : nearest
    );
  };

  const getGenderBadgeColor = () => {
    switch (pg.gender) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      case 'co-ed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    AnalyticsService.getInstance().track('enhanced_property_card_click', {
      propertyId: pg.id,
      propertyName: pg.name,
      location: safeRenderLocation(pg.location),
      rating: pg.rating,
      minPrice: getMinPrice(),
      availableRooms: getTotalAvailableRooms(),
      gender: pg.gender,
      verified: pg.verified
    });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsFavorited(!isFavorited);
    AnalyticsService.getInstance().trackPropertyFavorite(
      pg.id, 
      isFavorited ? 'remove' : 'add'
    );
  };

  const handleContactClick = (e: React.MouseEvent, method: 'call' | 'message') => {
    e.preventDefault();
    e.stopPropagation();
    
    AnalyticsService.getInstance().trackPropertyContact(pg.id, method === 'call' ? 'call' : 'whatsapp');
    
    if (method === 'call') {
      window.open(`tel:${pg.owner.phone}`);
    } else {
      const message = `Hi, I'm interested in ${pg.name}. Can you provide more details?`;
      window.open(`https://wa.me/91${pg.owner.phone}?text=${encodeURIComponent(message)}`);
    }
  };

  const activeAmenities = Object.entries(pg.amenities)
    .filter(([_, value]) => value)
    .map(([key, _]) => key)
    .slice(0, 6);

  const nearestCollege = getNearestCollege();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pg.images[currentImageIndex] || pg.images[0]}
          alt={pg.name}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation Dots */}
        {pg.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {pg.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {pg.verified && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Verified
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenderBadgeColor()}`}>
            {pg.gender === 'co-ed' ? 'Co-ed' : pg.gender === 'male' ? 'Boys' : 'Girls'}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{pg.rating}</span>
          <span className="text-xs text-gray-500">({pg.reviewCount})</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 mt-16 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>

        {/* Virtual Tour Badge */}
        {/* {pg.virtualTourUrl && (
          <div className="absolute bottom-3 left-3 bg-primary-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Virtual Tour
          </div>
        )} */}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {pg.name}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mb-1">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{safeRenderLocation(pg.location)}</span>
          </div>
          
          {/* Nearest College */}
          {nearestCollege && (
            <div className="flex items-center text-primary-600 text-sm">
              <GraduationCap className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">
                {nearestCollege.distance.toFixed(1)}km from {nearestCollege.name}
              </span>
            </div>
          )}
        </div>

        {/* Room Types Summary */}
        <div className="mb-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>{pg.roomTypes.length} Room Types</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{getTotalAvailableRooms()} Available</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {activeAmenities.slice(0, 4).map((amenity) => (
              <div
                key={amenity}
                className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                title={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
              >
                {getAmenityIcon(amenity)}
                <span className="ml-1 capitalize">{amenity === 'powerBackup' ? 'Power Backup' : amenity}</span>
              </div>
            ))}
            {activeAmenities.length > 4 && (
              <span className="text-xs text-gray-500 py-1">
                +{activeAmenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Owner Info */}
        <div className="mb-4 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {pg.owner.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{pg.owner.name}</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{pg.owner.responseTime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={(e) => handleContactClick(e, 'call')}
                className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                title="Call Owner"
              >
                <Phone className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => handleContactClick(e, 'message')}
                className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-4 w-4 text-gray-600" />
              <span className="text-xl font-bold text-gray-900">
                {getMinPrice().toLocaleString()}
              </span>
              <span className="text-gray-600 text-sm">/month</span>
            </div>
            <div className="text-xs text-gray-500">Starting from • Excl. charges</div>
          </div>
          
          <Link
            to={`/pg/${pg.id}`}
            onClick={handleCardClick}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPGCard;
