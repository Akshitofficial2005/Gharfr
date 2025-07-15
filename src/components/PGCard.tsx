import React from 'react';
import { Link } from 'react-router-dom';
import { PG } from '../types';
import { AnalyticsService } from '../services/analyticsService';
import { safeRenderLocation } from '../utils/locationUtils';
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell, Shield, Zap } from 'lucide-react';

interface PGCardProps {
  pg: PG;
}

const PGCard: React.FC<PGCardProps> = ({ pg }) => {
  const handleCardClick = () => {
    AnalyticsService.getInstance().track('property_card_click', {
      propertyId: pg.id,
      propertyName: pg.name,
      location: safeRenderLocation(pg.location),
      rating: pg.rating,
      minPrice: getMinPrice(),
      availableRooms: getAvailableRooms()
    });
  };
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'food':
        return <Utensils className="h-4 w-4" />;
      case 'gym':
        return <Dumbbell className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'powerBackup':
        return <Zap className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getMinPrice = () => {
    return Math.min(...pg.roomTypes.map(room => room.price));
  };

  const getAvailableRooms = () => {
    return pg.roomTypes.reduce((total, room) => total + room.availableRooms, 0);
  };

  const activeAmenities = Object.entries(pg.amenities)
    .filter(([_, value]) => value)
    .map(([key, _]) => key)
    .slice(0, 4);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pg.images[0]}
          alt={pg.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{pg.rating}</span>
          <span className="text-xs text-gray-500">({pg.reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {pg.name}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{safeRenderLocation(pg.location)}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-3 mb-3">
          {activeAmenities.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center text-gray-600"
              title={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
            >
              {getAmenityIcon(amenity)}
            </div>
          ))}
          {activeAmenities.length > 4 && (
            <span className="text-xs text-gray-500">+{Object.values(pg.amenities).filter(Boolean).length - 4} more</span>
          )}
        </div>

        {/* Room Types and Availability */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{pg.roomTypes.length} room type{pg.roomTypes.length > 1 ? 's' : ''}</span>
            <span>{getAvailableRooms()} rooms available</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">₹{getMinPrice().toLocaleString()}</span>
            <span className="text-gray-600 text-sm">/month</span>
            <div className="text-xs text-gray-500">Starting from</div>
          </div>
          <Link
            to={`/pg/${pg.id}`}
            onClick={handleCardClick}
            className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PGCard;