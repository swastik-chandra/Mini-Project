

import React from 'react';
import type { Event, User } from '../types';
import { EventGrid } from './EventGrid';
import { BookmarkIcon, CalendarIcon, PlusIcon, PencilIcon } from './Icons';

interface MyEventsPageProps {
  allEvents: Event[];
  currentUser: User;
  onSelectEvent: (event: Event) => void;
  onRsvpToggle: (event: Event) => void;
  onBookmarkToggle: (eventId: number) => void;
  onInitiateEdit: (event: Event) => void;
}

export const MyEventsPage: React.FC<MyEventsPageProps> = ({ allEvents, currentUser, onSelectEvent, onRsvpToggle, onBookmarkToggle, onInitiateEdit }) => {
  const rsvpdEvents = allEvents.filter(event => event.isRsvpd);
  const bookmarkedEvents = allEvents.filter(event => event.isBookmarked);
  const myCreatedEvents = allEvents.filter(event => event.creator?.email === currentUser.email);

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-600">My Events</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-purple-500 pb-2 flex items-center gap-3">
            <PlusIcon className="w-7 h-7 text-purple-500 dark:text-purple-400"/>
            My Created Events
        </h2>
        {myCreatedEvents.length > 0 ? (
          <div className="space-y-2">
            {myCreatedEvents.map(event => (
                <div key={event.id} className="p-2 pl-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 flex justify-between items-center">
                    <span className="font-semibold">{event.title}</span>
                    <button 
                        onClick={() => onInitiateEdit(event)}
                        className="p-2 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors" 
                        aria-label="Edit event"
                    >
                        <PencilIcon className="w-5 h-5"/>
                    </button>
                </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">You haven't created any events.</h3>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Use the "Create Event" option in the menu to get started!</p>
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-purple-500 pb-2 flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-purple-500 dark:text-purple-400"/>
            Events I'm Attending (RSVP'd)
        </h2>
        {rsvpdEvents.length > 0 ? (
          <EventGrid 
            events={rsvpdEvents} 
            onSelectEvent={onSelectEvent} 
            onRsvpToggle={onRsvpToggle} 
            onBookmarkToggle={onBookmarkToggle} 
          />
        ) : (
          <div className="text-center py-12 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">You haven't RSVP'd to any events yet.</h3>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Go to the Discover page to find your next event!</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-yellow-500 pb-2 flex items-center gap-3">
            <BookmarkIcon className="w-7 h-7 text-yellow-400" isFilled={true} />
            My Bookmarked Events
        </h2>
        {bookmarkedEvents.length > 0 ? (
          <EventGrid 
            events={bookmarkedEvents} 
            onSelectEvent={onSelectEvent} 
            onRsvpToggle={onRsvpToggle} 
            onBookmarkToggle={onBookmarkToggle} 
          />
        ) : (
          <div className="text-center py-12 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">You have no bookmarked events.</h3>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Use the bookmark icon to save events for later.</p>
          </div>
        )}
      </section>
    </div>
  );
};