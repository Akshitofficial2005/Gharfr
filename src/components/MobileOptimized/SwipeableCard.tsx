import React, { useState } from 'react';
import { Heart, Share2, MapPin, Star } from 'lucide-react';

interface SwipeableCardProps {
  pg: any;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ pg, onTap }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-105"
      onClick={onTap}
    >
      <div className="relative h-48">
        <img
          src={pg.images?.[0] || '/placeholder-pg.jpg'}
          alt={pg.name}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`p-2 rounded-full backdrop-blur-sm ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full bg-white/80 text-gray-700 backdrop-blur-sm"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full">
          <span className="font-bold">₹{pg.roomTypes?.[0]?.price?.toLocaleString()}</span>
          <span className="text-xs">/month</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900">{pg.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{pg.rating || 4.2}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{pg.location?.address}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {Object.entries(pg.amenities || {})
            .filter(([_, value]) => value)
            .slice(0, 4)
            .map(([key]) => (
              <span
                key={key}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize"
              >
                {key === 'wifi' ? 'Wi-Fi' : key}
              </span>
            ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {pg.roomTypes?.length || 0} room types available
          </span>
          <span className="text-primary-600 font-medium">View Details →</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeableCard;