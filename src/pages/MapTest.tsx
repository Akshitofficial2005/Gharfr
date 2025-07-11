import React from 'react';
import GoogleMapComponent from '../components/GoogleMap';

const MapTest: React.FC = () => {
  const testPGs = [
    {
      id: '1',
      name: 'Test PG Delhi',
      location: {
        coordinates: { lat: 28.6139, lng: 77.2090 },
        address: 'Connaught Place, Delhi'
      },
      roomTypes: [{ price: 8000 }]
    },
    {
      id: '2', 
      name: 'Test PG Mumbai',
      location: {
        coordinates: { lat: 19.0760, lng: 72.8777 },
        address: 'Bandra, Mumbai'
      },
      roomTypes: [{ price: 12000 }]
    }
  ] as any;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Google Maps Test</h1>
      <div className="border rounded-lg overflow-hidden">
        <GoogleMapComponent 
          pgs={testPGs}
          onMarkerClick={(pg) => alert(`Clicked: ${pg.name}`)}
        />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        If you see the map with markers, Google Maps integration is working! 🎉
      </p>
    </div>
  );
};

export default MapTest;