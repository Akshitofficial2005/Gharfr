import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { ExtraAmenity } from '../types';

interface ExtraAmenitiesProps {
  amenities: ExtraAmenity[];
  selectedAmenities: {[key: string]: number};
  onAmenityChange: (amenities: {[key: string]: number}) => void;
}

const ExtraAmenities: React.FC<ExtraAmenitiesProps> = ({
  amenities,
  selectedAmenities,
  onAmenityChange,
}) => {
  const handleQuantityChange = (amenityName: string, change: number) => {
    const currentQuantity = selectedAmenities[amenityName] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);
    
    const updatedAmenities = { ...selectedAmenities };
    if (newQuantity === 0) {
      delete updatedAmenities[amenityName];
    } else {
      updatedAmenities[amenityName] = newQuantity;
    }
    
    onAmenityChange(updatedAmenities);
  };

  return (
    <div className="space-y-3">
      {amenities.map((amenity) => {
        const quantity = selectedAmenities[amenity.name] || 0;
        
        return (
          <div
            key={amenity.id || amenity.name}
            className="flex items-center justify-between p-3 border rounded-lg hover:border-primary-300 transition-colors bg-gray-50"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{amenity.icon || '🏠'}</span>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{amenity.name}</h4>
                  <p className="text-xs text-gray-600 truncate">{amenity.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-primary-600">
                ₹{amenity.monthlyCharge.toLocaleString()}/mo
              </span>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(amenity.name, -1)}
                  disabled={quantity === 0}
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-3 w-3" />
                </button>
                
                <span className="w-6 text-center text-sm font-medium">
                  {quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(amenity.name, 1)}
                  className="w-6 h-6 rounded-full border border-primary-300 bg-primary-50 flex items-center justify-center hover:bg-primary-100 text-primary-600"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      
      {amenities.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">No additional amenities available.</p>
        </div>
      )}
    </div>
  );
};

export default ExtraAmenities;
