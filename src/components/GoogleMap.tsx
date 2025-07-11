import React, { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { PG } from '../types';

interface GoogleMapComponentProps {
  pgs: PG[];
  center?: { lat: number; lng: number };
  onMarkerClick?: (pg: PG) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 28.6139, // Delhi
  lng: 77.2090
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  pgs,
  center = defaultCenter,
  onMarkerClick
}) => {
  const [selectedPG, setSelectedPG] = useState<PG | null>(null);

  const onLoad = useCallback((map: any) => {
    const bounds = new window.google.maps.LatLngBounds();
    pgs.forEach(pg => {
      bounds.extend({
        lat: pg.location.coordinates.lat,
        lng: pg.location.coordinates.lng
      });
    });
    map.fitBounds(bounds);
  }, [pgs]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
      >
        {pgs.map((pg) => (
          <Marker
            key={pg.id}
            position={{
              lat: pg.location.coordinates.lat,
              lng: pg.location.coordinates.lng
            }}
            onClick={() => {
              setSelectedPG(pg);
              onMarkerClick?.(pg);
            }}
          />
        ))}
        
        {selectedPG && (
          <InfoWindow
            position={{
              lat: selectedPG.location.coordinates.lat,
              lng: selectedPG.location.coordinates.lng
            }}
            onCloseClick={() => setSelectedPG(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedPG.name}</h3>
              <p className="text-sm text-gray-600">{selectedPG.location.address}</p>
              <p className="text-sm font-medium">₹{selectedPG.roomTypes[0]?.price}/month</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;