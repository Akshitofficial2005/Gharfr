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
    <div className="space-y-4">
      {amenities.map((amenity) => {
        const quantity = selectedAmenities[amenity.name] || 0;
        
        return (
          <div
            key={amenity.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:border-primary-300 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{amenity.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{amenity.description}</p>
              <p className="text-lg font-semibold text-primary-600 mt-2">
                ₹{amenity.monthlyCharge.toLocaleString()}/month
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(amenity.name, -1)}
                disabled={quantity === 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <span className="w-8 text-center font-medium">
                {quantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(amenity.name, 1)}
                className="w-8 h-8 rounded-full border border-primary-300 bg-primary-50 flex items-center justify-center hover:bg-primary-100 text-primary-600"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
      
      {amenities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No additional amenities available for this property.</p>
        </div>
      )}
    </div>
  );
};

export default ExtraAmenities;
