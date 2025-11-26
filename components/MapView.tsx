import React, { useEffect, useRef } from 'react';

// Declare L as a global constant to resolve TypeScript errors for the Leaflet API.
declare const L: any;

interface MapViewProps {
  location: {
    lat: number;
    lng: number;
  };
}

const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


export const MapView: React.FC<MapViewProps> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null); // To hold the map instance

  useEffect(() => {
    if (!mapRef.current || typeof L === 'undefined') return;

    // Initialize map only once
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: location,
        zoom: 15,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        touchZoom: false,
        doubleClickZoom: false,
      });

      L.tileLayer(tileLayerUrl, { attribution }).addTo(mapInstance.current);

      L.marker(location).addTo(mapInstance.current);
    } else {
      // If map already exists, just update its view
      mapInstance.current.setView(location, 15);
    }
    
  }, [location]);

  return (
    <div className="h-48 rounded-lg bg-gray-700 overflow-hidden relative border-2 border-gray-600">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};