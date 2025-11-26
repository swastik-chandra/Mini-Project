

import React, { useEffect, useRef, useState } from 'react';
import type { Event } from '../types';
import { MapView } from './MapView';
import { CalendarIcon, ClockIcon, LocationMarkerIcon, UsersIcon, XIcon, SparklesIcon, BookmarkIcon, TicketIcon, ShareIcon, CheckIcon } from './Icons';
import { formatDate } from '../utils/date';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
  onRsvpToggle: (event: Event) => void;
  onBookmarkToggle: (eventId: number) => void;
}

const getCurrencySymbol = (currency?: string) => {
    if (currency === 'INR') return '₹';
    if (currency === 'USD') return '$';
    return '';
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onRsvpToggle, onBookmarkToggle }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    
    // Set initial focus
    const firstButton = modalRef.current?.querySelector('button');
    if (firstButton) {
        firstButton.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleRsvp = () => {
    onRsvpToggle(event);
  };
  
  const handleBookmark = () => {
    onBookmarkToggle(event.id);
  };

  const handleShare = async () => {
    if (isSharing) return; // Prevent concurrent shares

    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title} on ${formatDate(event.date, { month: 'long', day: 'numeric' })}!`,
      url: `https://eventfinder.app/event/${event.id}`,
    };

    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share(shareData);
      } catch (err) {
        // Don't log an error if the user cancels the share sheet (AbortError)
        if ((err as Error).name !== 'AbortError') {
            console.error("Error sharing:", err);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback for desktop browsers
      try {
        await navigator.clipboard.writeText(shareData.url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
        alert("Failed to copy link.");
      }
    }
  };

  const isRsvpd = !!event.isRsvpd;
  const isBookmarked = !!event.isBookmarked;
  const isPaid = event.price && event.price > 0;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-6 overflow-y-auto">
          <div className="flex justify-between items-start">
            <span className="bg-purple-100 dark:bg-purple-600 text-purple-800 dark:text-white text-xs font-bold px-3 py-1 rounded-full">{event.category}</span>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label="Close event details">
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-2 my-3">
            <h2 id="event-title" className="flex-grow text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500">{event.title}</h2>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0 relative disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Share event"
            >
              {isCopied ? <CheckIcon className="w-7 h-7 text-green-500" /> : <ShareIcon className="w-7 h-7 text-gray-500 dark:text-gray-400" />}
            </button>
            <button
              onClick={handleBookmark}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <BookmarkIcon isFilled={isBookmarked} className={`w-7 h-7 ${isBookmarked ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`} />
            </button>
          </div>
            {isCopied && <div className="text-right text-sm text-green-600 dark:text-green-400 -mt-2 mb-2">Link Copied!</div>}


          <p className="text-gray-600 dark:text-gray-400 mb-6">{event.description}</p>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-3 text-purple-500 dark:text-purple-400" />
              <span>{formatDate(event.date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 mr-3 text-purple-500 dark:text-purple-400" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center">
              <LocationMarkerIcon className="w-5 h-5 mr-3 text-purple-500 dark:text-purple-400" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center">
              <UsersIcon className="w-5 h-5 mr-3 text-purple-500 dark:text-purple-400" />
              <span>{event.attendees} / {event.capacity} attending</span>
            </div>
            {isPaid && (
                 <div className="flex items-center">
                    <TicketIcon className="w-5 h-5 mr-3 text-purple-500 dark:text-purple-400" />
                    <span className="font-semibold">{getCurrencySymbol(event.currency)}{event.price} per ticket</span>
                </div>
            )}
          </div>
          
          <div className="my-6">
            <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Location</h4>
            <MapView location={event.location} />
          </div>
          
          <button 
            onClick={handleRsvp}
            disabled={isRsvpd}
            className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 text-white ${isRsvpd ? 'bg-green-600' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'} transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100`}
          >
            {isRsvpd ? <><SparklesIcon className="w-6 h-6"/>Attending!</> : (isPaid ? <><TicketIcon className="w-6 h-6"/>Buy Ticket - {getCurrencySymbol(event.currency)}{event.price}</> : <><SparklesIcon className="w-6 h-6"/>RSVP Now</>)}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-2">{isPaid ? "Proceed to payment" : "One-click registration"}</p>
        </div>
      </div>
    </div>
  );
};