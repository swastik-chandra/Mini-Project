import React, { useEffect, useRef, useState } from 'react';
import type { Event } from '../types';
import { MapIcon, SpinnerIcon } from './Icons';

// Declare L as a global constant to resolve TypeScript errors for the Leaflet API.
declare const L: any;

interface EventMapViewProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const EventMapView: React.FC<EventMapViewProps> = ({ events, onSelectEvent }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [isUpdating, setIsUpdating] = useState(true);

  // Effect for one-time map initialization
  useEffect(() => {
    if (!mapContainerRef.current || typeof L === 'undefined') return;
    
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.3511148, 78.6677428], // Center of India
        zoom: 5,
      });
      L.tileLayer(tileLayerUrl, { attribution, maxZoom: 19 }).addTo(map);
      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }
  }, []);

  // Effect for updating markers when events change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    setIsUpdating(true);

    // Use a timeout to allow the loading spinner to render before intensive map operations
    const timer = setTimeout(() => {
      const map = mapInstanceRef.current;
      const markersLayer = markersLayerRef.current;
      
      markersLayer.clearLayers();
      
      if (events.length === 0) {
        map.setView([22.3511148, 78.6677428], 5);
      } else {
        const markerBounds = L.latLngBounds([]);
        events.forEach(event => {
          const marker = L.marker(event.location, { title: event.title });
          marker.addTo(markersLayer);
          markerBounds.extend(event.location);

          const popupContent = document.createElement('div');
          popupContent.innerHTML = `
            <strong style="font-size: 1rem;">${event.title}</strong>
            <p style="font-size: 0.875rem; margin: 4px 0;">${event.venue}</p>
            <button class="map-popup-button" data-event-id="${event.id}">View Details</button>
          `;
          
          const button = popupContent.querySelector('.map-popup-button');
          if (button) {
              button.addEventListener('click', () => onSelectEvent(event));
          }
          marker.bindPopup(popupContent);
        });
        map.fitBounds(markerBounds, { padding: [50, 50] });
      }

      setIsUpdating(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [events, onSelectEvent]);

  return (
    <div className="h-96 rounded-lg bg-gray-700 overflow-hidden relative border-2 border-gray-600">
      {isUpdating && (
        <div className="absolute inset-0 bg-gray-800/70 backdrop-blur-sm z-20 flex justify-center items-center">
          <SpinnerIcon className="w-12 h-12 text-purple-400 animate-spin" />
        </div>
      )}
      
      {events.length === 0 && !isUpdating && (
         <div className="absolute inset-0 bg-gray-800/50 flex flex-col justify-center items-center text-center p-4 z-10">
             <MapIcon className="w-16 h-16 text-gray-500 mb-4"/>
             <h3 className="text-xl font-semibold text-white">No Events on Map</h3>
             <p className="text-gray-400 mt-2 max-w-md">Try adjusting your filters to see events in this view.</p>
         </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};