

import React from 'react';
import type { Event } from '../types';
import { EventCard } from './EventCard';

interface EventGridProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  // FIX: Update onRsvpToggle to expect the full event object to match the signature of the handler in App.tsx.
  onRsvpToggle: (event: Event) => void;
  onBookmarkToggle: (eventId: number) => void;
  searchTerm?: string;
}

export const EventGrid: React.FC<EventGridProps> = ({ events, onSelectEvent, onRsvpToggle, onBookmarkToggle, searchTerm }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard 
          key={event.id} 
          event={event} 
          onSelectEvent={onSelectEvent} 
          onRsvpToggle={onRsvpToggle} 
          onBookmarkToggle={onBookmarkToggle}
          searchTerm={searchTerm} 
        />
      ))}
    </div>
  );
};
