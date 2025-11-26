
import React from 'react';
import type { Event } from '../types';
import { CalendarIcon, LocationMarkerIcon, SparklesIcon, BookmarkIcon } from './Icons';
import { formatDate } from '../utils/date';
import { Highlight } from './Highlight';

interface EventCardProps {
  event: Event;
  onSelectEvent: (event: Event) => void;
  // FIX: Update onRsvpToggle to expect the full event object for better context and to fix type errors.
  onRsvpToggle: (event: Event) => void;
  onBookmarkToggle: (eventId: number) => void;
  searchTerm?: string;
}

const getCurrencySymbol = (currency?: string) => {
    if (currency === 'INR') return '₹';
    if (currency === 'USD') return '$';
    return '';
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelectEvent, onRsvpToggle, onBookmarkToggle, searchTerm }) => {
  const handleRsvpClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent modal from opening
    // FIX: Pass the full event object to the handler.
    onRsvpToggle(event);
  };
  
  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent modal from opening
    onBookmarkToggle(event.id);
  };

  const isRsvpd = !!event.isRsvpd;
  const isBookmarked = !!event.isBookmarked;
  const isPaid = event.price && event.price > 0;

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl dark:hover:shadow-purple-500/30 border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group flex flex-col"
    >
      <div
        className="cursor-pointer"
        onClick={() => onSelectEvent(event)}
      >
        <div className="relative">
          <img src={event.image} alt={event.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
          
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <button
                onClick={handleBookmarkClick}
                className="p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors z-10"
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
                <BookmarkIcon isFilled={isBookmarked} className={`w-5 h-5 ${isBookmarked ? 'text-yellow-400' : 'text-white'}`} />
            </button>
            <span className={`text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm ${isPaid ? 'bg-green-600/80' : 'bg-blue-600/80'}`}>
                {isPaid ? `${getCurrencySymbol(event.currency)}${event.price}` : 'Free'}
            </span>
          </div>
          

          <div className="absolute top-2 right-2 bg-purple-600/80 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
             <Highlight text={event.category} highlight={searchTerm} />
          </div>
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 truncate">
            <Highlight text={event.title} highlight={searchTerm} />
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <CalendarIcon className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400"/>
              <span>{formatDate(event.date, { month: 'short', day: 'numeric', year: 'numeric' })} at {event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 truncate">
              <LocationMarkerIcon className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400"/>
              <span><Highlight text={event.venue} highlight={searchTerm} /></span>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <button 
            onClick={handleRsvpClick}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 text-white ${isRsvpd ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'}`}
          >
            <SparklesIcon className="w-5 h-5"/>
            {isRsvpd ? 'Attending' : (isPaid ? 'Get Ticket' : 'RSVP')}
          </button>
      </div>
    </div>
  );
};
